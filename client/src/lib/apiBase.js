// Centralized API base resolver
// Order of precedence:
// 1) Explicit customBase (caller-provided)
// 2) VITE_BACKEND_URL (Vite-exposed)
// 3) BACKEND_URL (non-Vite; works only if injected at build-time by platform)
// 4) VITE_API_URL (legacy)
// 5) VITE_API_BASE (legacy)
// 6) window.location.origin (fallback)
export function getApiBase(customBase) {
  // Normalize a single URL string (remove trailing slash)
  const norm = (u) => (typeof u === 'string' ? u.trim().replace(/\/$/, '') : '');
  // Allow opting into same-origin relative API (useful with Vercel rewrites)
  // If set to 'true', we return an empty base so callers produce URLs like '/api/...'
  const useRelative = (import.meta?.env?.VITE_API_RELATIVE || import.meta?.env?.VITE_USE_RELATIVE_API) === 'true';
  if (useRelative && !customBase) {
    return '';
  }
  const isLocalUrl = (u) => {
    try {
      const h = new URL(u).hostname;
      return h === 'localhost' || h === '127.0.0.1' || h === '::1';
    } catch {
      return false;
    }
  };
  const pickFromList = (list, origin) => {
    if (!Array.isArray(list) || list.length === 0) return '';
    // Prefer exact hostname match to current origin
    try {
      const originHost = new URL(origin).hostname;
      const exact = list.find((u) => {
        try { return new URL(u).hostname === originHost; } catch { return false; }
      });
      if (exact) return norm(exact);
    } catch {}
    // Otherwise pick local if running locally, else first non-local
    const runningLocal = /^(http:\/\/)?(localhost|127\.0\.0\.1|\[?::1\]?)/i.test(origin);
    if (runningLocal) {
      const local = list.find((u) => isLocalUrl(u));
      if (local) return norm(local);
    }
    const nonLocal = list.find((u) => !isLocalUrl(u)) || list[0];
    return norm(nonLocal);
  };

  if (typeof customBase === 'string' && customBase.trim().length) {
    // Support comma-separated list in customBase too
    const parts = customBase.split(',').map((s) => s.trim()).filter(Boolean);
    if (parts.length > 1) {
      const origin = typeof window !== 'undefined' ? norm(window.location.origin) : '';
      return pickFromList(parts, origin);
    }
    return norm(customBase);
  }

  const origin = typeof window !== 'undefined' ? norm(window.location.origin) : '';
  const rawCandidates = [
    import.meta.env.VITE_BACKEND_URL,
    import.meta.env.BACKEND_URL,
    import.meta.env.VITE_API_URL,
    import.meta.env.VITE_API_BASE,
  ].filter((v) => typeof v === 'string' && v.trim().length);

  // Expand any comma-separated entries into lists and pick best URL per entry
  for (const val of rawCandidates) {
    const parts = val.split(',').map((s) => s.trim()).filter(Boolean);
    if (parts.length === 1) {
      // Single URL; return immediately
      return norm(parts[0]);
    }
    // Multiple URLs; choose best based on origin
    const picked = pickFromList(parts, origin);
    if (picked) return picked;
  }

  // Fallback to current origin
  // If we’re on a platform with rewrites (like Vercel), returning '' lets callers hit '/api/...'
  // which avoids CORS entirely via same-origin rewrite. Otherwise, use origin.
  try {
    if (typeof window !== 'undefined') {
      const host = new URL(origin).hostname;
      if (host.endsWith('.vercel.app')) return '';
    }
  } catch {}
  return origin;
}
