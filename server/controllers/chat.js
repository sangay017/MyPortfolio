const axios = require('axios');
const Project = require('../models/Project');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { getPortfolioContext } = require('../utils/contextBuilder');

// Build the system prompt from DB + repo summary
async function buildSystemPrompt() {
  const [context, projects] = await Promise.all([
    getPortfolioContext(),
    Project.find().select('title description technologies githubUrl liveDemoUrl createdAt').lean()
  ]);

  const projectsSummary = projects
    .map((p, idx) => `
${idx + 1}. ${p.title}
   - Tech: ${Array.isArray(p.technologies) ? p.technologies.join(', ') : ''}
   - GitHub: ${p.githubUrl || '—'}
   - Live: ${p.liveDemoUrl || '—'}
   - Summary: ${p.description ? p.description.slice(0, 800) + (p.description.length > 800 ? '…' : '') : '—'}`)
    .join('\n');

  const email = process.env.FROM_EMAIL || process.env.TO_EMAIL;

  return `You are Sangay Rinchen's portfolio assistant. Speak in first person as Sangay.
Be polite, helpful, and concise but willing to elaborate when asked. Use Markdown for structure (lists, tables) and turn URLs/emails into clickable links.
If you are not sure, say so and ask a clarifying question.

== Portfolio Summary ==
Name: Sangay Rinchen
Email: ${email || 'N/A'}

== Tech Stack (detected) ==
Client: ${context.client?.name || 'client'} with React + TailwindCSS
Server: ${context.server?.name || 'server'} with Express + MongoDB (Mongoose)

== Client Dependencies ==\n${context.client?.deps || 'N/A'}

== Server Dependencies ==\n${context.server?.deps || 'N/A'}

== API Routes (detected) ==\n${context.apiRoutes || 'N/A'}

== UI Sections (detected) ==\n${context.uiSections || 'N/A'}

== Projects (from DB) ==\n${projectsSummary || 'No projects found yet.'}

Guidelines:
- Always ground answers in the above context.
- Offer links when relevant (GitHub, Live Demo, Email).
- When asked about skills, summarize tech stack and highlight notable projects.
- When asked to contact, provide the email as a mailto link if available.
`;
}

// @desc    Chat with portfolio-aware assistant
// @route   POST /api/v1/chat
// @access  Public
exports.chat = asyncHandler(async (req, res, next) => {
  const { message, history } = req.body || {};
  if (!message || typeof message !== 'string') {
    return next(new ErrorResponse('Message is required', 400));
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const baseUrl = process.env.OPENAI_BASE_URL || 'https://openrouter.ai/api/v1';
  const model = process.env.OPENAI_MODEL || 'qwen/qwen2.5-vl-32b-instruct:free';
  if (!apiKey) {
    return next(new ErrorResponse('Missing OpenAI API key on server', 500));
  }

  // Build messages list
  const systemPrompt = await buildSystemPrompt();
  const msgs = [{ role: 'system', content: systemPrompt }];
  if (Array.isArray(history)) {
    // Expect history items as { role: 'user'|'assistant', content: '...' }
    for (const h of history) {
      if (h && typeof h.content === 'string' && (h.role === 'user' || h.role === 'assistant')) {
        msgs.push({ role: h.role, content: h.content });
      }
    }
  }
  msgs.push({ role: 'user', content: message });

  try {
    const response = await axios.post(
      `${baseUrl}/chat/completions`,
      {
        model,
        messages: msgs,
        temperature: 0.7,
        stream: false
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    const text = response.data?.choices?.[0]?.message?.content?.trim();
    return res.status(200).json({ success: true, content: text || 'Sorry, I could not generate a response.' });
  } catch (err) {
    console.error('Chat API error:', err?.response?.data || err.message);
    return next(new ErrorResponse('Failed to get response from AI service', 502));
  }
});
