import { FormEvent, useEffect, useMemo, useState } from 'react';
import { BarChart3, Bot, Copy, Download, FileDown, GitCompare, Send, Settings, Search, X } from 'lucide-react';
import { askAssistant, QUICK_PROMPTS, type AssistantMode, type AssistantResult } from '../services/aiAssistant';
import { getStoredGeminiKey, saveGeminiKey } from '../services/geminiService';
import { useI18n } from '../i18n';
import { formatAPA, formatBibTeX, formatMLA } from '../hooks/useResources';

export function AiChatWidget() {
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [key, setKey] = useState(getStoredGeminiKey);
  const [prompt, setPrompt] = useState('');
  const [answer, setAnswer] = useState('');
  const [results, setResults] = useState<AssistantResult[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<AssistantMode>('local');
  const [tool, setTool] = useState<'search' | 'compare' | 'analytics' | 'citations'>('search');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const { language } = useI18n();
  const assistantLabel = language === 'ar' ? 'المساعد الذكي' : 'AI Assistant';
  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', closeOnEscape);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', closeOnEscape); document.body.style.overflow = previousOverflow; };
  }, [open]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!prompt.trim()) return;
    setBusy(true);
    setError('');
    try {
      const response = await askAssistant(prompt);
      setAnswer(response.answer);
      setResults(response.results ?? []);
      setSelectedIds([]);
      setMode(response.mode);
      setPrompt('');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Assistant is temporarily unavailable.');
    } finally {
      setBusy(false);
    }
  }
  const selectedResults = useMemo(() => results.filter(({ resource }) => selectedIds.includes(resource.id)), [results, selectedIds]);
  const copyAnswer = async () => { if (answer) await navigator.clipboard.writeText(answer); };
  const downloadConversation = () => {
    const blob = new Blob([`# ${assistantLabel}\n\n${answer}\n\n${results.map(({ resource }) => `- ${resource.title} (${resource.year})`).join('\n')}`], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href = url; link.download = 'assistant-conversation.md'; link.click(); URL.revokeObjectURL(url);
  };
  const exportSelected = (format: 'apa' | 'mla' | 'bibtex') => {
    const citations = selectedResults.map(({ resource }) => format === 'apa' ? formatAPA(resource) : format === 'mla' ? formatMLA(resource) : formatBibTeX(resource)).join('\n\n');
    if (citations) void navigator.clipboard.writeText(citations);
  };

  return (
    <div className="chat-widget">
      {!open && <button className="chat-launcher" onClick={() => setOpen(true)} aria-label={assistantLabel} title={assistantLabel}><Bot size={22} /><span className="chat-launcher-label">{assistantLabel}</span><i className="status-dot" /></button>}
      {open && (
        <div className="chat-overlay" onClick={() => setOpen(false)}><section className="chat-panel" aria-label={assistantLabel} onClick={(event) => event.stopPropagation()}>
          <header><span><Bot size={18} /> {assistantLabel}<i className="status-dot" title="Assistant active" /></span><div><button onClick={() => setSettingsOpen(true)} aria-label="Settings"><Settings size={17} /></button><button onClick={() => setOpen(false)} aria-label="Close"><X size={17} /></button></div></header>
          <div className="assistant-mode-badge">{mode === 'local' ? 'الوضع المحلي المباشر / Local Smart Mode' : 'Live AI Mode'}</div>
          <div className="assistant-tools"><button className={tool === 'search' ? 'active' : ''} onClick={() => setTool('search')} title="Deep search"><Search size={14} /> Search</button><button className={tool === 'compare' ? 'active' : ''} onClick={() => setTool('compare')} title="Compare selected"><GitCompare size={14} /> Compare</button><button className={tool === 'analytics' ? 'active' : ''} onClick={() => { setTool('analytics'); setPrompt('Library statistics'); }} title="Bibliometric analytics"><BarChart3 size={14} /> Analytics</button><button className={tool === 'citations' ? 'active' : ''} onClick={() => setTool('citations')} title="Export citations"><FileDown size={14} /> Export</button></div>
          <div className="quick-prompts">{[...QUICK_PROMPTS, 'أحدث تقنيات المعالجة الحيوية للمياه', 'إحصائيات أبحاث الوقود الحيوي 2020-2026', 'تصدير المراجع المحددة بصيغة BibTeX'].map((quickPrompt) => <button key={quickPrompt} type="button" onClick={() => setPrompt(quickPrompt)}>{quickPrompt}</button>)}</div>
          <div className="chat-body"><div className="assistant-actions"><button onClick={() => void copyAnswer()} title="Copy answer"><Copy size={14} /> Copy</button><button onClick={downloadConversation} title="Download Markdown"><Download size={14} /> Markdown</button></div><div className="assistant-markdown">{answer ? answer.split('\n').map((line, index) => <p key={`${line}-${index}`}>{line.replace(/^#+\s|^\-\s/, '').replace(/\*\*/g, '')}</p>) : <p>اسأل عن أبحاث الطحالب أو استخدم الإعدادات لإضافة مفتاح Gemini.</p>}</div>{tool === 'compare' && selectedResults.length > 0 && <div className="comparison-table"><strong>Comparison matrix</strong>{selectedResults.map(({ resource }) => <div key={resource.id}><span>{resource.title}</span><small>{resource.year} · {resource.category} · {resource.algaeType || 'algae'}</small></div>)}</div>}{tool === 'citations' && selectedResults.length > 0 && <div className="assistant-actions"><button onClick={() => exportSelected('apa')}>Copy APA</button><button onClick={() => exportSelected('mla')}>Copy MLA</button><button onClick={() => exportSelected('bibtex')}>Copy BibTeX</button></div>}{results.length > 0 && <div className="assistant-results">{results.map(({ resource }) => <article key={resource.id}><label><input type="checkbox" checked={selectedIds.includes(resource.id)} onChange={() => setSelectedIds((ids) => ids.includes(resource.id) ? ids.filter((id) => id !== resource.id) : [...ids, resource.id])} /><strong>{resource.title}</strong></label><small>{resource.authors} · {resource.year} · {resource.journal}</small><div>{resource.pdfUrl && <a href={resource.pdfUrl} target="_blank" rel="noreferrer">PDF</a>}{resource.doi && <a href={resource.doi.startsWith('http') ? resource.doi : `https://doi.org/${resource.doi}`} target="_blank" rel="noreferrer">DOI</a>}</div></article>)}</div>}{error && <small className="error">{error}</small>}</div>
          <form onSubmit={submit} className="chat-form"><input value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="اكتب سؤالك..." disabled={busy} /><button disabled={busy} aria-label="Send"><Send size={17} /></button></form>
          {settingsOpen && <div className="modal-backdrop" onClick={() => setSettingsOpen(false)}><div className="modal" onClick={(event) => event.stopPropagation()}><h3>إعدادات مساعد Gemini</h3><p>يُحفظ المفتاح محلياً في هذا المتصفح فقط.</p><input type="password" value={key} onChange={(event) => setKey(event.target.value)} placeholder="Gemini API key" /><button onClick={() => { saveGeminiKey(key); setSettingsOpen(false); }}>حفظ المفتاح</button></div></div>}
        </section></div>
      )}
    </div>
  );
}
