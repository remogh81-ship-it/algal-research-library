import { FormEvent, useState } from 'react';
import { Bot, Send, Settings, X } from 'lucide-react';
import { askGemini, getStoredGeminiKey, saveGeminiKey } from '../services/geminiService';

export function AiChatWidget() {
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [key, setKey] = useState(getStoredGeminiKey);
  const [prompt, setPrompt] = useState('');
  const [answer, setAnswer] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!prompt.trim()) return;
    setBusy(true);
    setError('');
    try {
      setAnswer(await askGemini(prompt));
      setPrompt('');
    } catch (requestError) {
      const code = requestError instanceof Error ? requestError.message : '';
      setError(code === 'GEMINI_API_KEY_REQUIRED'
        ? 'أضف مفتاح Gemini من الإعدادات أو عرّف VITE_API_KEY في ملف البيئة.'
        : code === 'GEMINI_API_KEY_UNAUTHORIZED'
          ? 'مفتاح Gemini غير صالح أو غير مصرح له. تحقق من المفتاح وإعدادات API.'
          : 'تعذر الاتصال بالمساعد. تحقق من المفتاح واتصال الإنترنت.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="chat-widget">
      {!open && <button className="chat-launcher" onClick={() => setOpen(true)} aria-label="Open AI assistant"><Bot size={22} /></button>}
      {open && (
        <section className="chat-panel" aria-label="AI assistant">
          <header><span><Bot size={18} /> مساعد أبحاث الطحالب</span><div><button onClick={() => setSettingsOpen(true)} aria-label="Settings"><Settings size={17} /></button><button onClick={() => setOpen(false)} aria-label="Close"><X size={17} /></button></div></header>
          <div className="chat-body"><p>{answer || 'اسأل عن أبحاث الطحالب أو استخدم الإعدادات لإضافة مفتاح Gemini.'}</p>{error && <small className="error">{error}</small>}</div>
          <form onSubmit={submit} className="chat-form"><input value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="اكتب سؤالك..." disabled={busy} /><button disabled={busy} aria-label="Send"><Send size={17} /></button></form>
          {settingsOpen && <div className="modal-backdrop" onClick={() => setSettingsOpen(false)}><div className="modal" onClick={(event) => event.stopPropagation()}><h3>إعدادات مساعد Gemini</h3><p>يُحفظ المفتاح محلياً في هذا المتصفح فقط.</p><input type="password" value={key} onChange={(event) => setKey(event.target.value)} placeholder="Gemini API key" /><button onClick={() => { saveGeminiKey(key); setSettingsOpen(false); }}>حفظ المفتاح</button></div></div>}
        </section>
      )}
    </div>
  );
}
