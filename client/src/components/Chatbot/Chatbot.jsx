import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Download, Minus, Maximize2 } from 'lucide-react';

function renderMarkdown(text) {
  if (!text) return null;
  let html = text
    .replace(/\n\n/g, '\n')
    .replace(/\n-/g, '\n•')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/(https?:\/\/[^\s)]+|mailto:[^\s)]+)/g, (m) => `<a href="${m}" target="_blank" rel="noopener noreferrer" class="underline text-indigo-600 dark:text-indigo-300">${m}</a>`);
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

const STORAGE_KEY = 'portfolio_chat_messages_v1';
const OPEN_KEY = 'portfolio_chat_is_open_v1';

import { getApiBase } from '../../lib/apiBase';
const Chatbot = ({
  apiBase = getApiBase(),
  theme = 'auto',
  welcome = "Hi, I'm Sangay's AI assistant. Ask me about my projects, skills, or how to reach me!",
  faqs = [
    { label: 'See my projects', value: 'Show me your projects' },
    { label: 'Skills overview', value: 'What skills and tech do you use?' },
    { label: 'Contact me', value: 'How can I contact you?' }
  ],
  userAvatar,
  botAvatar
}) => {
  const [isOpen, setIsOpen] = useState(() => {
    try { return JSON.parse(localStorage.getItem(OPEN_KEY) || 'false'); } catch { return false; }
  });
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      const cached = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (Array.isArray(cached) && cached.length) return cached.map(m => ({ ...m, timestamp: new Date(m.timestamp) }));
    } catch {}
    return [{ id: 1, text: welcome, sender: 'bot', timestamp: new Date() }];
  });
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages)); } catch {}
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
    try { localStorage.setItem(OPEN_KEY, JSON.stringify(isOpen)); } catch {}
    if (isOpen && inputRef.current && !minimized) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, minimized]);

  const formatTime = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const addTyping = () => ({ id: 'typing', text: 'typing...', sender: 'typing', timestamp: new Date() });

  const callApi = async (message, history) => {
    const url = `${apiBase.replace(/\/$/, '')}/api/v1/chat`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history })
    });
    if (!res.ok) throw new Error(`API ${res.status}`);
    return res.json();
  };

  const streamType = async (fullText, onChunk, chunkSize = 8, delay = 20) => {
    let i = 0;
    while (i < fullText.length) {
      const next = fullText.slice(i, i + chunkSize);
      onChunk(next);
      i += chunkSize;
      await new Promise(r => setTimeout(r, delay));
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = { id: Date.now(), text: inputValue, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setMessages(prev => [...prev, addTyping()]);
    setLoading(true);

    try {
      const history = messages
        .filter(m => m.sender === 'user' || m.sender === 'bot')
        .map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text }));
      const data = await callApi(userMessage.text, history);
      const fullText = data?.content || "I'm sorry, I couldn't find the answer right now.";

      setMessages(prev => prev.filter(msg => msg.id !== 'typing'));

      const botId = Date.now() + 1;
      setMessages(prev => [...prev, { id: botId, text: '', sender: 'bot', timestamp: new Date() }]);
      await streamType(fullText, (chunk) => {
        setMessages(prev => prev.map(m => m.id === botId ? { ...m, text: (m.text || '') + chunk } : m));
      });
    } catch (err) {
      setMessages(prev => prev.filter(msg => msg.id !== 'typing'));
      setMessages(prev => [...prev, { id: Date.now() + 2, text: 'Sorry, I had trouble reaching the server. Please try again.', sender: 'bot', timestamp: new Date() }]);
    } finally {
      setLoading(false);
    }
  };

  const exportTranscript = (as = 'json') => {
    const data = messages.map(m => ({
      role: m.sender === 'user' ? 'user' : (m.sender === 'bot' ? 'assistant' : m.sender),
      content: m.text,
      timestamp: m.timestamp
    }));
    let blob;
    if (as === 'text') {
      const txt = data.map(d => `[${new Date(d.timestamp).toISOString()}] ${d.role.toUpperCase()}: ${d.content}`).join('\n');
      blob = new Blob([txt], { type: 'text/plain' });
    } else {
      blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat_transcript_${Date.now()}.${as === 'text' ? 'txt' : 'json'}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ 
              type: 'spring',
              damping: 25,
              stiffness: 300
            }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden w-80 h-[500px] flex flex-col border border-gray-200 dark:border-gray-700"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="h-7 w-7 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot size={16} />
                </div>
                <div>
                  <h3 className="font-semibold">Sangay • AI Assistant</h3>
                  <p className="text-[10px] opacity-80">{loading ? 'Typing…' : 'Online'}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setMinimized(m => !m)} className="p-1.5 rounded-full hover:bg-white/10 transition-colors" aria-label="Minimize">
                  {minimized ? <Maximize2 size={16} /> : <Minus size={16} />}
                </button>
                <button onClick={() => exportTranscript('json')} className="p-1.5 rounded-full hover:bg-white/10 transition-colors" aria-label="Export chat">
                  <Download size={16} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
                  aria-label="Close chat"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            {!minimized && (
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50 dark:bg-gray-900/50">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender === 'bot' && message.id !== 'typing' && (
                    <div className="mr-2 mt-1 flex-shrink-0">
                      <div className="h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                        <Bot size={12} className="text-indigo-600 dark:text-indigo-300" />
                      </div>
                    </div>
                  )}
                  <div className="max-w-[85%]">
                    <div
                      className={`px-4 py-2.5 rounded-2xl ${
                        message.sender === 'user'
                          ? 'bg-indigo-600 text-white rounded-br-sm'
                          : message.sender === 'typing'
                          ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-bl-sm w-20'
                          : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-sm border border-gray-100 dark:border-gray-700 rounded-bl-sm'
                      }`}
                    >
                      {message.sender === 'typing' ? (
                        <div className="flex space-x-1.5">
                          <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      ) : (
                        <div className="text-sm prose prose-sm dark:prose-invert max-w-none">
                          {message.sender === 'bot' ? renderMarkdown(message.text) : <p>{message.text}</p>}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 mt-1 block text-right">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  {message.sender === 'user' && (
                    <div className="ml-2 mt-1 flex-shrink-0">
                      <div className="h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                        <User size={12} className="text-indigo-600 dark:text-indigo-300" />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            )}

            {/* Input + FAQs */}
            <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              {!minimized && faqs?.length > 0 && (
                <div className="px-3 pt-2 flex gap-2 flex-wrap">
                  {faqs.slice(0, 4).map((q) => (
                    <button key={q.label} onClick={() => setInputValue(q.value)} className="text-[11px] px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                      {q.label}
                    </button>
                  ))}
                </div>
              )}
              {!minimized && (
              <form onSubmit={handleSendMessage} className="p-3">
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={loading ? 'Assistant is typing…' : 'Type a message...'}
                    disabled={loading}
                    className="w-full pl-4 pr-12 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-60"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || loading}
                    className={`absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-all ${
                      inputValue.trim() && !loading
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                        : 'text-gray-400 dark:text-gray-500'
                    }`}
                    aria-label="Send message"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </form>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: isOpen ? 0 : 1 }}
        whileHover={{ scale: isOpen ? 0 : 1.1 }}
        whileTap={{ scale: isOpen ? 0 : 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        aria-label="Chat with us"
      >
        <MessageSquare className="h-6 w-6" />
      </motion.button>
    </div>
  );
};

export default Chatbot;
