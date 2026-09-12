import { FormEvent, useEffect, useMemo, useState } from 'react';
import { BarChart3, Bot, ChevronDown, Copy, Download, FileDown, GitCompare, Send, Settings, Search, Table2, X } from 'lucide-react';
import { askAssistant, generatePaperSummary, QUICK_PROMPTS, type AssistantMode, type AssistantResult } from '../services/aiAssistant';
import { getStoredGeminiKey, saveGeminiKey } from '../services/geminiService';
import { useI18n } from '../i18n';
import { formatAPA, formatBibTeX, formatMLA } from '../hooks/useResources';
import type { Resource } from '../types/resource';
import { getLocalizedSummary } from '../utils/translateSummary';

type SummaryRecord = { paper: Resource; findings: string; abstract: string };
type SummaryTool = 'findings' | 'methodology' | 'applications' | 'citation';

export function AiChatWidget({ selectedPapers = [] }: { selectedPapers?: Resource[] }) {
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
  const [summaryRecords, setSummaryRecords] = useState<SummaryRecord[]>([]);
  const [activeSummaryTab, setActiveSummaryTab] = useState(0);
  const [expandedSummaryIds, setExpandedSummaryIds] = useState<number[]>([]);
  const [summaryView, setSummaryView] = useState<'single' | 'matrix'>('single');
  const [summaryTool, setSummaryTool] = useState<SummaryTool>('findings');
  const [summaryBusy, setSummaryBusy] = useState(false);
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
      const response = await askAssistant(prompt, language);
      setAnswer(response.answer);
      setResults(response.results ?? []);
      const isComparison = /(compare|comparison|matrix|synthesis|قارن|مقارنة|جدول مقارنة)/i.test(prompt);
      setSelectedIds(isComparison ? (response.results ?? []).map(({ resource }) => resource.id) : []);
      if (isComparison) setTool('compare');
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
    if (!citations) return;
    const blob = new Blob([citations], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href = url; link.download = `algae-references.${format === 'bibtex' ? 'bib' : 'txt'}`; link.click(); URL.revokeObjectURL(url);
  };
  const exportSynthesis = (format: 'csv' | 'md') => {
    const rows = selectedResults.map(({ resource }) => [resource.title, resource.algaeType || 'Algae', resource.summary_en || resource.summary_ar || 'Key findings unavailable', resource.category, String(resource.year), resource.doi || resource.url]);
    if (!rows.length) return;
    const content = format === 'csv'
      ? [['Paper Title', 'Species / Strain', 'Key Findings & Efficiency', 'Category', 'Year', 'Citation / Link'], ...rows].map((row) => row.map((value) => `"${value.replace(/"/g, '""')}"`).join(',')).join('\n')
      : `| Paper Title | Species / Strain | Key Findings & Efficiency | Category | Year | Citation / Link |\n| --- | --- | --- | --- | --- | --- |\n${rows.map((row) => `| ${row.join(' | ')} |`).join('\n')}`;
    const blob = new Blob([content], { type: format === 'csv' ? 'text/csv;charset=utf-8' : 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `algae-synthesis.${format}`; link.click(); URL.revokeObjectURL(url);
  };
  const promptChips = language === 'ar'
    ? ['استخلاص النتائج الرئيسية لأبحاث الوقود الحيوي', 'جدول مقارنة لمعالجة العناصر الثقيلة بالطحالب', 'أحدث أبحاث Spirulina و Chlorella', 'صياغة مراجعة مرجعية لأبحاث تثبيت الكربون']
    : ['Extract key findings on biofuel', 'Generate synthesis matrix for heavy metal removal', 'Latest research on Spirulina & Chlorella', 'Synthesize literature review on CO2 bio-fixation'];
  const generateSelectedSummary = async () => {
    if (!selectedPapers.length) return;
    setSummaryBusy(true);
    const summaries = await Promise.all(selectedPapers.map(async (paper): Promise<SummaryRecord> => {
      const abstract = getLocalizedSummary(paper, language) || 'No abstract is available.';
      let findings = abstract;
      try { findings = await generatePaperSummary(abstract, language); } catch { /* local structured fallback below */ }
      return { paper, findings, abstract };
    }));
    setSummaryRecords(summaries);
    setActiveSummaryTab(0);
    setExpandedSummaryIds(summaries.map(({ paper }) => paper.id));
    setSummaryBusy(false);
  };
  const activeSummary = summaryRecords[activeSummaryTab];
  const species = (summary: SummaryRecord) => summary.abstract.match(/\b(?:Scenedesmus|Chlorella|Spirulina|Nannochloropsis|Dunaliella|Haematococcus)\b/gi)?.filter((value, index, values) => values.indexOf(value) === index).join(', ') || summary.paper.algaeType || 'Species not specified';
  const summaryToolText = (summary: SummaryRecord) => {
    if (summaryTool === 'methodology') return `${species(summary)}. ${summary.paper.algaeType || summary.abstract}`;
    if (summaryTool === 'applications') return `${summary.paper.category || summary.paper.categoryArabic}. ${summary.abstract}`;
    if (summaryTool === 'citation') return `${formatAPA(summary.paper)}\n${formatBibTeX(summary.paper)}\n${summary.paper.doi ? `https://doi.org/${summary.paper.doi.replace(/^https?:\/\/doi.org\//, '')}` : 'DOI unavailable.'}`;
    return summary.findings;
  };
  const copySynthesis = async () => {
    const content = summaryRecords.map((summary) => `${summary.paper.title}\n${summaryToolText(summary)}`).join('\n\n');
    if (content) await navigator.clipboard.writeText(content);
  };
  const clearSummaries = () => {
    setSummaryRecords([]);
    setExpandedSummaryIds([]);
    setActiveSummaryTab(0);
  };
  const toggleSummary = (id: number) => setExpandedSummaryIds((ids) => ids.includes(id) ? ids.filter((summaryId) => summaryId !== id) : [...ids, id]);
  const summaryDoi = (paper: Resource) => paper.doi ? (paper.doi.startsWith('http') ? paper.doi : `https://doi.org/${paper.doi}`) : '';

  return (
    <div className="chat-widget">
      {!open && <button className="chat-launcher" onClick={() => setOpen(true)} aria-label={assistantLabel} title={assistantLabel}><Bot size={22} /><span className="chat-launcher-label">{assistantLabel}</span><i className="status-dot" /></button>}
      {open && (
        <div className="chat-overlay" onClick={() => setOpen(false)}><section className="chat-panel" aria-label={assistantLabel} onClick={(event) => event.stopPropagation()}>
          <style>{`.custom-scrollbar::-webkit-scrollbar{width:6px}.custom-scrollbar::-webkit-scrollbar-thumb{background:#7bbdb2;border-radius:999px}`}</style>
          <header><span><Bot size={18} /> {assistantLabel}<i className="status-dot" title="Assistant active" /></span><div><button onClick={() => setSettingsOpen(true)} aria-label="Settings"><Settings size={17} /></button><button onClick={() => setOpen(false)} aria-label="Close"><X size={17} /></button></div></header>
          <div className="assistant-mode-badge">{mode === 'local' ? 'الوضع المحلي المباشر / Local Smart Mode' : 'Live AI Mode'}</div>
          {selectedPapers.length > 0 && <div className="assistant-actions"><button type="button" onClick={() => void generateSelectedSummary()} disabled={summaryBusy}>{summaryBusy ? 'Generating...' : `Generate Detailed Summary (${selectedPapers.length})`}</button></div>}
          {summaryRecords.length > 0 && <div className="assistant-summary-drawer">
            <div className="assistant-summary-toolbar"><strong>{summaryRecords.length} Papers Selected</strong><span><button type="button" className={summaryView === 'single' ? 'active' : ''} onClick={() => setSummaryView('single')}>Single Paper View</button><button type="button" className={summaryView === 'matrix' ? 'active' : ''} onClick={() => setSummaryView('matrix')}>Comparative Matrix View</button></span></div>
            <div className="assistant-actions">{([['findings', '📊 Key Findings'], ['methodology', '🔬 Methodology & Microalgae Species'], ['applications', '🌱 Environmental & Industrial Applications'], ['citation', '🔗 Export & Citation']] as [SummaryTool, string][]).map(([name, label]) => <button type="button" key={name} className={summaryTool === name ? 'active' : ''} onClick={() => { setSummaryTool(name); setSummaryView('single'); }}>{label}</button>)}</div>
            <div className="assistant-summary-tabs"><button type="button" className={activeSummaryTab === -1 ? 'active' : ''} onClick={() => setActiveSummaryTab(-1)}>Combined Synthesis</button>{summaryRecords.map(({ paper }, index) => <button type="button" key={paper.id} className={activeSummaryTab === index ? 'active' : ''} onClick={() => setActiveSummaryTab(index)}>Paper #{index + 1}</button>)}</div>
            <div className="assistant-summary-scroll custom-scrollbar" style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: '0.5rem', scrollbarWidth: 'thin', scrollbarColor: '#7bbdb2 transparent' }}>
              {summaryView === 'matrix' ? <table className="comparison-table"><thead><tr><th>Paper</th><th>Species</th><th>Category</th><th>Year</th><th>Findings</th></tr></thead><tbody>{summaryRecords.map((summary) => <tr key={summary.paper.id}><td>{summary.paper.title}</td><td>{species(summary)}</td><td>{summary.paper.category || summary.paper.categoryArabic}</td><td>{summary.paper.year}</td><td>{summary.findings}</td></tr>)}</tbody></table> : activeSummaryTab === -1 ? <div className="assistant-markdown">{summaryRecords.map((summary) => <p key={summary.paper.id}><strong>{summary.paper.title}</strong><br />{summaryToolText(summary)}</p>)}</div> : activeSummary && <div className="assistant-accordion"><article key={activeSummary.paper.id}><button type="button" onClick={() => toggleSummary(activeSummary.paper.id)}><strong>{activeSummary.paper.title}</strong><ChevronDown size={15} /></button>{expandedSummaryIds.includes(activeSummary.paper.id) && <div className="assistant-markdown"><p><strong>Objective & Research Scope:</strong> {activeSummary.paper.title} ({activeSummary.paper.category || activeSummary.paper.categoryArabic}).</p><p><strong>{summaryTool === 'findings' ? 'Main Findings & Significance' : summaryTool === 'methodology' ? 'Methodology & Microalgae Species' : summaryTool === 'applications' ? 'Environmental & Industrial Applications' : 'Export & Citation'}:</strong> {summaryToolText(activeSummary)}</p><p><strong>Citation & Direct DOI:</strong> {activeSummary.paper.authors} ({activeSummary.paper.year}). {summaryDoi(activeSummary.paper) ? <a href={summaryDoi(activeSummary.paper)} target="_blank" rel="noreferrer">{summaryDoi(activeSummary.paper)}</a> : 'DOI unavailable.'}</p></div>}</article></div>}
            </div>
            <div className="assistant-actions"><button type="button" onClick={() => void copySynthesis()}><Copy size={14} /> Copy Synthesis</button><button type="button" onClick={clearSummaries}>Clear All</button></div>
          </div>}
          <div className="assistant-tools"><button className={tool === 'search' ? 'active' : ''} onClick={() => setTool('search')} title="Deep search"><Search size={14} /> Search</button><button className={tool === 'compare' ? 'active' : ''} onClick={() => setTool('compare')} title="Compare selected"><GitCompare size={14} /> Compare</button><button className={tool === 'analytics' ? 'active' : ''} onClick={() => { setTool('analytics'); setPrompt('Library statistics'); }} title="Bibliometric analytics"><BarChart3 size={14} /> Analytics</button><button className={tool === 'citations' ? 'active' : ''} onClick={() => setTool('citations')} title="Export citations"><FileDown size={14} /> Export</button></div>
          <div className="quick-prompts">{[...promptChips, ...QUICK_PROMPTS].map((quickPrompt) => <button key={quickPrompt} type="button" onClick={() => setPrompt(quickPrompt)}>{quickPrompt}</button>)}</div>
          <div className="chat-body"><div className="assistant-actions"><button onClick={() => void copyAnswer()} title="Copy answer"><Copy size={14} /> Copy</button><button onClick={downloadConversation} title="Download Markdown"><Download size={14} /> Markdown</button></div><div className="assistant-markdown">{answer ? answer.split('\n').map((line, index) => <p key={`${line}-${index}`}>{line.replace(/^#+\s|^\-\s/, '').replace(/\*\*/g, '')}</p>) : <p>اسأل عن أبحاث الطحالب أو استخدم الإعدادات لإضافة مفتاح Gemini.</p>}</div>{tool === 'compare' && selectedResults.length > 0 && <div className="comparison-table"><div className="comparison-heading"><strong><Table2 size={15} /> Synthesis matrix</strong><span><button onClick={() => exportSynthesis('csv')}>CSV</button><button onClick={() => exportSynthesis('md')}>Markdown</button></span></div><table><thead><tr><th>Paper Title</th><th>Species / Strain</th><th>Key Findings & Efficiency</th><th>Category</th><th>Year</th><th>Citation / Link</th></tr></thead><tbody>{selectedResults.map(({ resource }) => <tr key={resource.id}><td>{resource.title}</td><td>{resource.algaeType || 'Algae'}</td><td>{resource.summary_en || resource.summary_ar || 'Key findings unavailable'}</td><td>{resource.category}</td><td>{resource.year}</td><td>{resource.doi || resource.url || '—'}</td></tr>)}</tbody></table></div>}{tool === 'citations' && selectedResults.length > 0 && <div className="assistant-actions"><button onClick={() => exportSelected('apa')}>Download APA</button><button onClick={() => exportSelected('mla')}>Download MLA</button><button onClick={() => exportSelected('bibtex')}>Download BibTeX</button></div>}{results.length > 0 && <div className="assistant-results">{results.map(({ resource }) => <article key={resource.id}><label><input type="checkbox" checked={selectedIds.includes(resource.id)} onChange={() => setSelectedIds((ids) => ids.includes(resource.id) ? ids.filter((id) => id !== resource.id) : [...ids, resource.id])} /><strong>{resource.title}</strong></label><small>{resource.authors} · {resource.year} · {resource.journal}</small><div className="insight-list"><span>🎯 <b>Main Objective / Target:</b> {resource.category}</span><span>🧪 <b>Methodology & Algae Species:</b> {resource.algaeType || 'Algae not specified'}</span><span>📊 <b>Key Results & Findings:</b> {resource.summary_en || resource.summary_ar || 'Summary unavailable'}</span><span>💡 <b>Practical Application / Impact:</b> {resource.category} research and applied biotechnology</span></div><div>{resource.pdfUrl && <a href={resource.pdfUrl} target="_blank" rel="noreferrer">PDF</a>}{resource.doi && <a href={resource.doi.startsWith('http') ? resource.doi : `https://doi.org/${resource.doi}`} target="_blank" rel="noreferrer">DOI</a>}</div></article>)}</div>}{error && <small className="error">{error}</small>}</div>
          <form onSubmit={submit} className="chat-form"><input value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="اكتب سؤالك..." disabled={busy} /><button disabled={busy} aria-label="Send"><Send size={17} /></button></form>
          {settingsOpen && <div className="modal-backdrop" onClick={() => setSettingsOpen(false)}><div className="modal" onClick={(event) => event.stopPropagation()}><h3>إعدادات مساعد Gemini</h3><p>يُحفظ المفتاح محلياً في هذا المتصفح فقط.</p><input type="password" value={key} onChange={(event) => setKey(event.target.value)} placeholder="Gemini API key" /><button onClick={() => { saveGeminiKey(key); setSettingsOpen(false); }}>حفظ المفتاح</button></div></div>}
        </section></div>
      )}
    </div>
  );
}
