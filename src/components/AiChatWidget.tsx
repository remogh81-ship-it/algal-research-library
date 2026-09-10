import { FormEvent, useState } from 'react';
import { Bot, Send, Settings, X } from 'lucide-react';
import { askAssistant, QUICK_PROMPTS, type AssistantMode } from '../services/aiAssistant';
import { getStoredGeminiKey, saveGeminiKey } from '../services/geminiService';
import { useI18n } from '../i18n';

export function AiChatWidget() {
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [key, setKey] = useState(getStoredGeminiKey);
  const [prompt, setPrompt] = useState('');
  const [answer, setAnswer] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<AssistantMode>('local');
  const { language } = useI18n();
  const assistantLabel = language === 'ar' ? 'المساعد الذكي' : 'AI Assistant';

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!prompt.trim()) return;
    setBusy(true);
    setError('');
    try {
      const response = await askAssistant(prompt);
      setAnswer(response.answer);
      setMode(response.mode);
      setPrompt('');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Assistant is temporarily unavailable.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="chat-widget">
      {!open && <button className="chat-launcher" onClick={() => setOpen(true)} aria-label={assistantLabel} title={assistantLabel}><Bot size={22} /><span className="chat-launcher-label">{assistantLabel}</span><i className="status-dot" /></button>}
      {open && (
        <section className="chat-panel" aria-label={assistantLabel}>
          <header><span><Bot size={18} /> {assistantLabel}<i className="status-dot" title="Assistant active" /></span><div><button onClick={() => setSettingsOpen(true)} aria-label="Settings"><Settings size={17} /></button><button onClick={() => setOpen(false)} aria-label="Close"><X size={17} /></button></div></header>
          <div className="assistant-mode-badge">{mode === 'local' ? 'الوضع المحلي المباشر / Local Smart Mode' : 'Live AI Mode'}</div>
          <div className="quick-prompts">{QUICK_PROMPTS.map((quickPrompt) => <button key={quickPrompt} type="button" onClick={() => setPrompt(quickPrompt)}>{quickPrompt}</button>)}</div>
          <div className="chat-body"><p>{answer || 'اسأل عن أبحاث الطحالب أو استخدم الإعدادات لإضافة مفتاح Gemini.'}</p>{error && <small className="error">{error}</small>}</div>
          <form onSubmit={submit} className="chat-form"><input value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="اكتب سؤالك..." disabled={busy} /><button disabled={busy} aria-label="Send"><Send size={17} /></button></form>
          {settingsOpen && <div className="modal-backdrop" onClick={() => setSettingsOpen(false)}><div className="modal" onClick={(event) => event.stopPropagation()}><h3>إعدادات مساعد Gemini</h3><p>يُحفظ المفتاح محلياً في هذا المتصفح فقط.</p><input type="password" value={key} onChange={(event) => setKey(event.target.value)} placeholder="Gemini API key" /><button onClick={() => { saveGeminiKey(key); setSettingsOpen(false); }}>حفظ المفتاح</button></div></div>}
        </section>
      )}
    </div>
  );
}
