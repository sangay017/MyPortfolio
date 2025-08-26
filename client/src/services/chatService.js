// Use the same API base as other services; set VITE_API_URL to your backend URL in production
import { getApiBase } from '../lib/apiBase';
export async function sendChatMessage(message, history = [], apiBase) {
  const url = `${getApiBase(apiBase)}/api/v1/chat`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history })
  });
  if (!res.ok) throw new Error(`Chat API ${res.status}`);
  return res.json();
}
