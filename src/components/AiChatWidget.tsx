import React, { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { 
  Bot, 
  ChevronDown, 
  Copy, 
  Download, 
  FileDown, 
  GitCompare, 
  Send, 
  Settings, 
  Search, 
  Table2, 
  X,
  Dna,
  FileSpreadsheet,
  FlaskConical,
  Sparkles,
  LineChart,
  BookOpen,
  RotateCcw,
  Check,
  Cpu,
  Layers,
  Sparkle
} from 'lucide-react';
import { 
  askAssistant, 
  generatePaperSummary, 
  RESEARCH_TOOLS,
  QUICK_PROMPTS_AR,
  QUICK_PROMPTS_EN,
  type AssistantMode, 
  type AssistantResult,
  type ChatHistoryItem,
  type ResearchToolDefinition
} from '../services/aiAssistant';
import { getStoredGeminiKey, saveGeminiKey } from '../services/geminiService';
import { useI18n } from '../i18n';
import { formatAPA, formatBibTeX, formatMLA } from '../hooks/useResources';
import type { Resource } from '../types/resource';
import { getLocalizedSummary } from '../utils/translateSummary';

type SummaryRecord = { paper: Resource; findings: string; abstract: string };
type SummaryTool = 'findings' | 'methodology' | 'applications' | 'citation';

interface MessageBubble {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  mode?: AssistantMode;
  results?: AssistantResult[];
  time: string;
}

export function AiChatWidget({ selectedPapers = [] }: { selectedPapers?: Resource[] }) {
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [key, setKey] = useState(getStoredGeminiKey);
  const [prompt, setPrompt] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<AssistantMode>('local');
  const [activeTab, setActiveTab] = useState<'chat' | 'tools' | 'synthesis'>('chat');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [summaryRecords, setSummaryRecords] = useState<SummaryRecord[]>([]);
  const [activeSummaryTab, setActiveSummaryTab] = useState(0);
  const [expandedSummaryIds, setExpandedSummaryIds] = useState<number[]>([]);
  const [summaryView, setSummaryView] = useState<'single' | 'matrix'>('single');
  const [summaryTool, setSummaryTool] = useState<SummaryTool>('findings');
  const [summaryBusy, setSummaryBusy] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  type FocusPreset = 'standard' | 'focused' | 'benchmark' | 'protocol' | 'qc';
  const [focusPreset, setFocusPreset] = useState<FocusPreset>('standard');

  const { language } = useI18n();
  const isArabic = language === 'ar';
  const assistantLabel = isArabic ? 'المساعد العلمي الذكي للطحالب' : 'Algal AI Research Assistant';
  
  const initialGreeting = isArabic 
    ? `مرحباً بك في **المساعد الذكي المتخصص في علوم وتطبيقات الطحالب**! 🌿🔬\n\nأنا هنا لمساعدتك في:\n- 🧬 **تشخيص وتصنيف الأنواع** (*Chlorella*, *Spirulina*, *Scenedesmus*...)\n- 🧪 **تحديد وملاءمة البيئات الغذائية** (BG-11, Zarrouk, BBM...)\n- 📋 **تصميم بروتوكولات التجارب** لإنتاج الوقود الحيوي ومعالجة مياه الصرف\n- 🔍 **البحث والتحليل المقارن** في أكثر من 31,000 بحث علمي\n\nاختر إحدى الأدوات أدناه أو اكتب استفسارك مباشرة!`
    : `Welcome to the **Algal Research AI Companion**! 🌿🔬\n\nI can assist you with:\n- 🧬 **Species Taxonomy & Identification** (*Chlorella*, *Spirulina*, *Scenedesmus*...)\n- 🧪 **Formulating Culture Media** (BG-11, Zarrouk, BBM, f/2...)\n- 📋 **Generating Lab Protocols** for Biofuels, Pigments & Phycoremediation\n- 🔍 **Synthesizing Evidence** across 31,000+ indexed research papers\n\nPick a specialized research tool below or ask any question!`;

  const [messages, setMessages] = useState<MessageBubble[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: initialGreeting,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open, busy]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  // Handle icon mapping for tools
  const renderToolIcon = (icon: string) => {
    switch (icon) {
      case 'Dna': return <Dna size={16} />;
      case 'FileSpreadsheet': return <FileSpreadsheet size={16} />;
      case 'FlaskConical': return <FlaskConical size={16} />;
      case 'Sparkles': return <Sparkles size={16} />;
      case 'LineChart': return <LineChart size={16} />;
      case 'BookOpen': return <BookOpen size={16} />;
      default: return <Cpu size={16} />;
    }
  };

  async function submit(event?: FormEvent) {
    event?.preventDefault();
    const query = prompt.trim();
    if (!query) return;

    const userMsg: MessageBubble = {
      id: String(Date.now()),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setPrompt('');
    setBusy(true);
    setError('');

    // Prepare history
    const historyPayload: ChatHistoryItem[] = messages.slice(-6).map(m => ({
      sender: m.sender,
      text: m.text,
    }));

    let queryPayload = query;
    if (focusPreset === 'focused') {
      queryPayload += isArabic 
        ? '\n[توجيه علمي ذو أولوية: المطلوب إجابة تنفيذية مركزة جداً وموجزة بالأرقام والنتائج المباشرة دون حشو أو استطراد]'
        : '\n[Priority Scientific Directive: Direct executive takeaway with exact quantitative figures, concise, zero fluff]';
    } else if (focusPreset === 'benchmark') {
      queryPayload += isArabic 
        ? '\n[توجيه علمي ذو أولوية: المطلوب التركيز الشديد على جدول مقارنة كمي رقمي للبارامترات والقيم المثلى ونطاقات التشغيل والوحدات]'
        : '\n[Priority Scientific Directive: Detailed quantitative benchmark table of parameters, optimal values, and operating ranges with units]';
    } else if (focusPreset === 'protocol') {
      queryPayload += isArabic 
        ? '\n[توجيه علمي ذو أولوية: المطلوب بروتوكول معملي دقيق SOP خطوة بخطوة بالتركيزات الكيميائية والمواد وأوقات التحضين]'
        : '\n[Priority Scientific Directive: Step-by-step actionable lab SOP with exact chemical concentrations, reagents, and timings]';
    } else if (focusPreset === 'qc') {
      queryPayload += isArabic 
        ? '\n[توجيه علمي ذو أولوية: المطلوب التركيز على ضوابط الجودة ونقاط الفشل الحرجة والمحاذير المعملية وطرق التغلب عليها وتفادي التلوث]'
        : '\n[Priority Scientific Directive: Quality control criteria, critical failure modes, contamination hazards, and mitigation SOP]';
    }

    try {
      const response = await askAssistant(queryPayload, language, historyPayload);
      setMode(response.mode);

      const assistantMsg: MessageBubble = {
        id: String(Date.now() + 1),
        sender: 'assistant',
        text: response.answer,
        mode: response.mode,
        results: response.results,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // If comparison query, auto-check items
      const isComparison = /(compare|comparison|matrix|synthesis|قارن|مقارنة|جدول مقارنة)/i.test(query);
      if (isComparison && response.results?.length) {
        setSelectedIds(response.results.map((r) => r.resource.id));
      }
    } catch (requestError) {
      const errorMsg = requestError instanceof Error ? requestError.message : 'Assistant is temporarily unavailable.';
      setError(errorMsg);
      const fallbackMsg: MessageBubble = {
        id: String(Date.now() + 1),
        sender: 'assistant',
        text: isArabic 
          ? `⚠️ **تنبيه:** لم يتمكن المساعد من إتمام المعالجة حالياً (${errorMsg}). يُرجى إعادة المحاولة أو اختيار إحدى الأدوات المتخصصة أدناه.`
          : `⚠️ **Notice:** The assistant encountered an issue while processing your request (${errorMsg}). Please try again or select one of the specialized tools below.`,
        mode: 'local',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setBusy(false);
    }
  }

  const handleToolSelect = (tool: ResearchToolDefinition) => {
    const template = isArabic ? tool.promptTemplateAr : tool.promptTemplateEn;
    setPrompt(template);
    setActiveTab('chat');
  };

  const copyText = async (id: string, text: string) => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'assistant',
        text: initialGreeting,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  };

  const downloadConversation = () => {
    const markdown = `# ${assistantLabel}\n*${new Date().toLocaleString()}*\n\n` +
      messages.map((m) => `### ${m.sender === 'user' ? '👤 ' + (isArabic ? 'الباحث' : 'Researcher') : '🤖 ' + (isArabic ? 'المساعد الذكي' : 'Algal Assistant')}\n${m.text}\n`).join('\n---\n\n');
    
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `algae-assistant-${Date.now()}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Quick prompt selection
  const promptChips = isArabic ? QUICK_PROMPTS_AR : QUICK_PROMPTS_EN;

  // Multi-paper summary generator
  const generateSelectedSummary = async () => {
    if (!selectedPapers.length) return;
    setSummaryBusy(true);
    setActiveTab('synthesis');
    const summaries = await Promise.all(
      selectedPapers.map(async (paper): Promise<SummaryRecord> => {
        const abstract = getLocalizedSummary(paper, language) || 'No abstract available.';
        let findings = abstract;
        try {
          findings = await generatePaperSummary(abstract, language);
        } catch {
          // fallback keeps localized summary
        }
        return { paper, findings, abstract };
      })
    );
    setSummaryRecords(summaries);
    setActiveSummaryTab(0);
    setExpandedSummaryIds(summaries.map(({ paper }) => paper.id));
    setSummaryBusy(false);
  };

  const activeSummary = summaryRecords[activeSummaryTab];
  
  const species = (summary: SummaryRecord) =>
    summary.abstract.match(/\b(?:Scenedesmus|Chlorella|Spirulina|Arthrospira|Nannochloropsis|Dunaliella|Haematococcus|Anabaena|Nostoc)\b/gi)?.filter((v, i, a) => a.indexOf(v) === i).join(', ') ||
    summary.paper.algaeType || (isArabic ? 'نوع عام' : 'Unspecified species');

  const summaryToolText = (summary: SummaryRecord) => {
    if (summaryTool === 'methodology') return `🔬 ${species(summary)}. ${summary.paper.algaeType || summary.abstract}`;
    if (summaryTool === 'applications') return `🌱 ${summary.paper.category || summary.paper.categoryArabic}. ${summary.abstract}`;
    if (summaryTool === 'citation') {
      return `${formatAPA(summary.paper)}\n\n${formatBibTeX(summary.paper)}`;
    }
    return summary.findings;
  };

  const toggleSummary = (id: number) => {
    setExpandedSummaryIds((ids) => (ids.includes(id) ? ids.filter((sId) => sId !== id) : [...ids, id]));
  };

  // Helper to format inline markdown (bold, italic, code, links)
  const formatInlineHtml = (raw: string): string => {
    let res = raw;
    // Bold **text**
    res = res.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic *text*
    res = res.replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
    // Inline code `code`
    res = res.replace(/`([^`]+)`/g, '<code class="chat-inline-code">$1</code>');
    // Markdown links [text](url)
    res = res.replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer" class="chat-link">$1 ↗</a>');
    return res;
  };

  // Helper to format complex markdown lines into styled elements (tables, code blocks, lists)
  const renderMarkdown = (text: string) => {
    if (!text) return null;
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();

      // 1. Spacing / empty lines
      if (!trimmed) {
        elements.push(<div key={`sp-${i}`} className="md-spacing" />);
        i++;
        continue;
      }

      // 2. Multi-line Code Block (```)
      if (trimmed.startsWith('```')) {
        const codeLines: string[] = [];
        i++;
        while (i < lines.length && !lines[i].trim().startsWith('```')) {
          codeLines.push(lines[i]);
          i++;
        }
        if (i < lines.length && lines[i].trim().startsWith('```')) {
          i++;
        }
        elements.push(
          <pre key={`code-${i}`} className="chat-code-block">
            <code>{codeLines.join('\n')}</code>
          </pre>
        );
        continue;
      }

      // 3. Markdown Tables (| Col 1 | Col 2 |)
      const isTableRow = (str: string) => str.includes('|') && str.startsWith('|');
      const isTableSeparator = (str: string) => /^\|?(\s*:?-+:?\s*\|)+\s*:?-+:?\s*\|?$/.test(str);

      if (isTableRow(trimmed) && i + 1 < lines.length && isTableSeparator(lines[i + 1].trim())) {
        const headerLine = trimmed;
        i += 2; // skip header & separator
        const dataRows: string[] = [];
        while (i < lines.length && lines[i].trim().includes('|') && lines[i].trim().length > 1) {
          dataRows.push(lines[i].trim());
          i++;
        }

        const parseCells = (rowStr: string) => {
          const parts = rowStr.split('|');
          let cells = parts.map(c => c.trim());
          if (cells[0] === '') cells.shift();
          if (cells[cells.length - 1] === '') cells.pop();
          return cells;
        };

        const headers = parseCells(headerLine);
        const rows = dataRows.map(parseCells);

        elements.push(
          <div key={`tbl-${i}`} className="chat-table-wrapper">
            <table className="chat-table">
              <thead>
                <tr>
                  {headers.map((h, hIdx) => (
                    <th key={hIdx} dangerouslySetInnerHTML={{ __html: formatInlineHtml(h) }} />
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rIdx) => (
                  <tr key={rIdx}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} dangerouslySetInnerHTML={{ __html: formatInlineHtml(cell) }} />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        continue;
      }

      // 4. Headings
      if (trimmed.startsWith('#### ')) {
        elements.push(<h5 key={`h4-${i}`} className="md-h4">{trimmed.replace('#### ', '')}</h5>);
        i++;
        continue;
      }
      if (trimmed.startsWith('### ')) {
        elements.push(<h4 key={`h3-${i}`} className="md-h4">{trimmed.replace('### ', '')}</h4>);
        i++;
        continue;
      }
      if (trimmed.startsWith('## ')) {
        elements.push(<h3 key={`h2-${i}`} className="md-h3">{trimmed.replace('## ', '')}</h3>);
        i++;
        continue;
      }
      if (trimmed.startsWith('# ')) {
        elements.push(<h2 key={`h1-${i}`} className="md-h2">{trimmed.replace('# ', '')}</h2>);
        i++;
        continue;
      }

      // 5. Unordered List (- or *)
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const items: string[] = [];
        while (i < lines.length && (lines[i].trim().startsWith('- ') || lines[i].trim().startsWith('* '))) {
          items.push(lines[i].trim().substring(2));
          i++;
        }
        elements.push(
          <ul key={`ul-${i}`} className="chat-list">
            {items.map((it, itIdx) => (
              <li key={itIdx} dangerouslySetInnerHTML={{ __html: formatInlineHtml(it) }} />
            ))}
          </ul>
        );
        continue;
      }

      // 6. Ordered List (1. 2. ...)
      if (/^\d+\.\s/.test(trimmed)) {
        const items: string[] = [];
        while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
          items.push(lines[i].trim().replace(/^\d+\.\s/, ''));
          i++;
        }
        elements.push(
          <ol key={`ol-${i}`} className="chat-ol">
            {items.map((it, itIdx) => (
              <li key={itIdx} dangerouslySetInnerHTML={{ __html: formatInlineHtml(it) }} />
            ))}
          </ol>
        );
        continue;
      }

      // 7. Callout note or blockquote
      if (trimmed.startsWith('> [!NOTE]') || trimmed.startsWith('> [!TIP]')) {
        elements.push(
          <div key={`callout-${i}`} className="md-callout-note">
            <strong>ℹ️ {isArabic ? 'تنبيه' : 'Note'}</strong>
          </div>
        );
        i++;
        continue;
      }
      if (trimmed.startsWith('> ')) {
        const quoteLines: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith('> ')) {
          quoteLines.push(lines[i].trim().substring(2));
          i++;
        }
        elements.push(
          <blockquote key={`bq-${i}`} className="md-quote">
            {quoteLines.map((ql, qlIdx) => (
              <div key={qlIdx} dangerouslySetInnerHTML={{ __html: formatInlineHtml(ql) }} />
            ))}
          </blockquote>
        );
        continue;
      }

      // 8. Normal paragraph
      elements.push(
        <p key={`p-${i}`} className="md-p" dangerouslySetInnerHTML={{ __html: formatInlineHtml(trimmed) }} />
      );
      i++;
    }

    return elements;
  };

  return (
    <div className="chat-widget">
      {!open && (
        <button 
          className="chat-launcher" 
          onClick={() => setOpen(true)} 
          aria-label={assistantLabel} 
          title={assistantLabel}
        >
          <Bot size={24} />
          <span className="chat-launcher-label">{isArabic ? 'المساعد العلمي' : 'AI Assistant'}</span>
          <span className="pulse-indicator" />
        </button>
      )}

      {open && (
        <div className="chat-overlay" onClick={() => setOpen(false)}>
          <section className="chat-panel" aria-label={assistantLabel} onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <header className="assistant-header">
              <div className="header-info">
                <div className="bot-avatar">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="header-title">{assistantLabel}</h3>
                  <span className="header-badge">
                    {mode === 'live' ? (
                      <><span className="status-live" /> Gemini 2.0 Flash</>
                    ) : (
                      <><span className="status-local" /> {isArabic ? 'الوضع المحلي الذكي' : 'Local Smart Mode'}</>
                    )}
                  </span>
                </div>
              </div>
              <div className="header-actions">
                <button 
                  type="button"
                  onClick={clearChat} 
                  title={isArabic ? 'مسح المحادثة' : 'Clear chat'} 
                  aria-label="Clear chat"
                >
                  <RotateCcw size={16} />
                </button>
                <button 
                  type="button"
                  onClick={downloadConversation} 
                  title={isArabic ? 'تحميل المحادثة (Markdown)' : 'Export Markdown'} 
                  aria-label="Export Markdown"
                >
                  <Download size={16} />
                </button>
                <button 
                  type="button"
                  onClick={() => setSettingsOpen(true)} 
                  title={isArabic ? 'إعدادات المفتاح' : 'API Key Settings'} 
                  aria-label="Settings"
                >
                  <Settings size={16} />
                </button>
                <button 
                  type="button"
                  onClick={() => setOpen(false)} 
                  title={isArabic ? 'إغلاق' : 'Close'} 
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>
            </header>

            {/* Navigation Tabs */}
            <div className="assistant-tabs-nav">
              <button 
                type="button"
                className={activeTab === 'chat' ? 'active' : ''} 
                onClick={() => setActiveTab('chat')}
              >
                💬 {isArabic ? 'المحادثة الذكية' : 'Research Chat'}
              </button>
              <button 
                type="button"
                className={activeTab === 'tools' ? 'active' : ''} 
                onClick={() => setActiveTab('tools')}
              >
                🔬 {isArabic ? 'الأدوات المتخصصة (6)' : 'Specialized Tools'}
              </button>
              {selectedPapers.length > 0 && (
                <button 
                  type="button"
                  className={activeTab === 'synthesis' ? 'active' : ''} 
                  onClick={() => setActiveTab('synthesis')}
                >
                  📊 {isArabic ? `تخليص الأبحاث (${selectedPapers.length})` : `Synthesis (${selectedPapers.length})`}
                </button>
              )}
            </div>

            {/* TAB 1: Chat Stream */}
            {activeTab === 'chat' && (
              <div className="assistant-chat-stream">
                {/* Selected papers badge if any */}
                {selectedPapers.length > 0 && (
                  <div className="selected-papers-banner">
                    <span>
                      📋 {isArabic ? `تم تحديد ${selectedPapers.length} بحث علمي` : `${selectedPapers.length} papers selected`}
                    </span>
                    <button 
                      type="button" 
                      onClick={() => void generateSelectedSummary()} 
                      disabled={summaryBusy}
                    >
                      {summaryBusy ? (isArabic ? 'جاري التلخيص...' : 'Summarizing...') : (isArabic ? 'توليد مراجعة تجميعية' : 'Synthesize Matrix')}
                    </button>
                  </div>
                )}

                {/* Messages Bubbles */}
                <div className="chat-messages-container">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`chat-bubble-row ${msg.sender}`}>
                      <div className="bubble-avatar">
                        {msg.sender === 'user' ? '👤' : <Bot size={16} />}
                      </div>
                      <div className="bubble-content">
                        <div className="bubble-meta">
                          <span className="bubble-author">
                            {msg.sender === 'user' ? (isArabic ? 'الباحث' : 'Researcher') : (isArabic ? 'المستشار العلمي' : 'Algae Advisor')}
                          </span>
                          <span className="bubble-time">{msg.time}</span>
                          {msg.sender === 'assistant' && (
                            <button 
                              type="button" 
                              className="copy-bubble-btn"
                              onClick={() => void copyText(msg.id, msg.text)}
                              title={isArabic ? 'نسخ الإجابة' : 'Copy'}
                            >
                              {copiedId === msg.id ? <Check size={12} /> : <Copy size={12} />}
                            </button>
                          )}
                        </div>
                        <div className="bubble-body">
                          {renderMarkdown(msg.text)}
                        </div>

                        {/* Associated Papers if any */}
                        {msg.results && msg.results.length > 0 && (
                          <div className="bubble-paper-results">
                            <h5>📚 {isArabic ? 'أوراق علمية ذات صلة من قاعدة البيانات:' : 'Indexed Relevant Papers:'}</h5>
                            {msg.results.map(({ resource }) => (
                              <div key={resource.id} className="mini-paper-card">
                                <div className="paper-card-top">
                                  <strong>{resource.title}</strong>
                                  <span className="paper-year">{resource.year}</span>
                                </div>
                                <p className="paper-authors">{resource.authors} · <em>{resource.journal}</em></p>
                                <div className="paper-tags">
                                  <span className="tag-strain">{resource.algaeType || 'Algae'}</span>
                                  <span className="tag-cat">{resource.category}</span>
                                </div>
                                {resource.doi && (
                                  <a 
                                    href={resource.doi.startsWith('http') ? resource.doi : `https://doi.org/${resource.doi}`} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="doi-link"
                                  >
                                    DOI Link ↗
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Typing Indicator when busy */}
                  {busy && (
                    <div className="chat-bubble-row assistant typing-row">
                      <div className="bubble-avatar"><Bot size={16} /></div>
                      <div className="bubble-content typing-box">
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                        <span className="typing-text">
                          {isArabic ? 'المساعد يحلل البيانات الفيكولوجية...' : 'Analyzing phycological datasets...'}
                        </span>
                      </div>
                    </div>
                  )}

                  <div ref={chatEndRef} />
                </div>

                {/* Quick Prompts Carousel */}
                <div className="quick-chips-bar">
                  <span className="chips-title">{isArabic ? 'نماذج استفسارات:' : 'Quick Prompts:'}</span>
                  {promptChips.map((chip, i) => (
                    <button 
                      key={i} 
                      type="button" 
                      className="quick-chip"
                      onClick={() => setPrompt(chip)}
                    >
                      <Sparkle size={12} /> {chip}
                    </button>
                  ))}
                </div>

                {/* Precision Focus Mode Toolbar */}
                <div className="focus-mode-bar">
                  <span className="focus-mode-label">
                    <Sparkles size={13} /> {isArabic ? 'نمط الدقة والتركيز:' : 'Precision Mode:'}
                  </span>
                  <button 
                    type="button" 
                    className={`focus-btn ${focusPreset === 'standard' ? 'active' : ''}`}
                    onClick={() => setFocusPreset('standard')}
                    title={isArabic ? 'إجابة علمية شاملة متوازنة' : 'Balanced standard response'}
                  >
                    🌐 {isArabic ? 'شامل متوازن' : 'Balanced'}
                  </button>
                  <button 
                    type="button" 
                    className={`focus-btn ${focusPreset === 'focused' ? 'active' : ''}`}
                    onClick={() => setFocusPreset('focused')}
                    title={isArabic ? 'إجابة تنفيذية مركزة بالأرقام والنتائج المباشرة' : 'Executive direct takeaway'}
                  >
                    🎯 {isArabic ? 'إجابة مركزة' : 'Executive'}
                  </button>
                  <button 
                    type="button" 
                    className={`focus-btn ${focusPreset === 'benchmark' ? 'active' : ''}`}
                    onClick={() => setFocusPreset('benchmark')}
                    title={isArabic ? 'جدول مقارنة كمي رقمي للبارامترات والمدى المثالي' : 'Quantitative parameter table'}
                  >
                    📊 {isArabic ? 'جدول معايير' : 'Parameters'}
                  </button>
                  <button 
                    type="button" 
                    className={`focus-btn ${focusPreset === 'protocol' ? 'active' : ''}`}
                    onClick={() => setFocusPreset('protocol')}
                    title={isArabic ? 'بروتوكول معملي إجرائي SOP خطوة بخطوة بالتركيزات' : 'Step-by-step SOP'}
                  >
                    🔬 {isArabic ? 'بروتوكول SOP' : 'Protocol'}
                  </button>
                  <button 
                    type="button" 
                    className={`focus-btn ${focusPreset === 'qc' ? 'active' : ''}`}
                    onClick={() => setFocusPreset('qc')}
                    title={isArabic ? 'ضوابط ومحاذير الجودة ونقاط الفشل الحرجة' : 'Critical QC & failure modes'}
                  >
                    ⚠️ {isArabic ? 'محاذير وضوابط' : 'QC & Pitfalls'}
                  </button>
                </div>

                {/* Input Bar */}
                <form onSubmit={submit} className="chat-input-bar">
                  <textarea
                    rows={1}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        void submit();
                      }
                    }}
                    placeholder={isArabic ? 'اطرح سؤالاً علمياً عن الطحالب، أو اطلب بروتوكولاً... (Enter للإرسال)' : 'Ask any phycology question or request a protocol... (Enter to send)'}
                    disabled={busy}
                  />
                  <button type="submit" disabled={busy || !prompt.trim()} className="send-btn" aria-label="Send">
                    <Send size={18} />
                  </button>
                </form>
              </div>
            )}

            {/* TAB 2: Specialized Research Tools (6 Tools Grid) */}
            {activeTab === 'tools' && (
              <div className="assistant-tools-view">
                <div className="tools-intro">
                  <h4>🔬 {isArabic ? 'الجناح الاستشاري للبحوث المتقدمة' : 'Specialized Phycology Advisory Suite'}</h4>
                  <p>
                    {isArabic 
                      ? 'اختر إحدى الأدوات المتخصصة لتطبيق نماذج بروتوكولية دقيقة معتمدة من الجمعية المصرية للطحالب.'
                      : 'Select a specialized module to trigger standardized scientific workflows tailored for phycologists.'}
                  </p>
                </div>
                <div className="tools-grid-cards">
                  {RESEARCH_TOOLS.map((tool) => (
                    <div 
                      key={tool.id} 
                      className="tool-card"
                      onClick={() => handleToolSelect(tool)}
                    >
                      <div className="tool-card-header">
                        <div className="tool-icon-wrapper">
                          {renderToolIcon(tool.icon)}
                        </div>
                        <h5>{isArabic ? tool.nameAr : tool.nameEn}</h5>
                      </div>
                      <p className="tool-card-desc">
                        {isArabic ? tool.descriptionAr : tool.descriptionEn}
                      </p>
                      <button type="button" className="use-tool-btn">
                        {isArabic ? 'استخدام الأداة ↗' : 'Launch Module ↗'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: Multi-Paper Synthesis Matrix */}
            {activeTab === 'synthesis' && (
              <div className="assistant-synthesis-view">
                {summaryRecords.length === 0 ? (
                  <div className="synthesis-empty">
                    <Layers size={36} />
                    <p>{isArabic ? 'لم يتم توليد تلخيص بعد. حدد أوراقاً علمية ثم اضغط زر التلخيص.' : 'No papers synthesized yet. Select papers from search and click Summarize.'}</p>
                    <button 
                      type="button" 
                      onClick={() => void generateSelectedSummary()}
                      disabled={summaryBusy || selectedPapers.length === 0}
                    >
                      {isArabic ? 'بدء التلخيص الآن' : 'Start Synthesis'}
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="synthesis-toolbar">
                      <strong>{isArabic ? `${summaryRecords.length} أبحاث محددة` : `${summaryRecords.length} Selected Papers`}</strong>
                      <div className="view-toggle">
                        <button 
                          type="button" 
                          className={summaryView === 'single' ? 'active' : ''} 
                          onClick={() => setSummaryView('single')}
                        >
                          {isArabic ? 'عرض تفصيلي' : 'Detailed View'}
                        </button>
                        <button 
                          type="button" 
                          className={summaryView === 'matrix' ? 'active' : ''} 
                          onClick={() => setSummaryView('matrix')}
                        >
                          {isArabic ? 'مصفوفة مقارنة' : 'Matrix View'}
                        </button>
                      </div>
                    </div>

                    <div className="synthesis-dimension-selector">
                      {([
                        ['findings', isArabic ? '📊 النتائج الرئيسية' : '📊 Key Findings'],
                        ['methodology', isArabic ? '🔬 المنهجية والسلالات' : '🔬 Methodology & Strains'],
                        ['applications', isArabic ? '🌱 التطبيقات البيئية' : '🌱 Applications'],
                        ['citation', isArabic ? '🔗 التوثيق المرجعي' : '🔗 Citations']
                      ] as [SummaryTool, string][]).map(([val, label]) => (
                        <button 
                          key={val} 
                          type="button" 
                          className={summaryTool === val ? 'active' : ''}
                          onClick={() => setSummaryTool(val)}
                        >
                          {label}
                        </button>
                      ))}
                    </div>

                    <div className="synthesis-content-scroll">
                      {summaryView === 'matrix' ? (
                        <div className="matrix-table-wrapper">
                          <table className="synthesis-matrix-table">
                            <thead>
                              <tr>
                                <th>{isArabic ? 'البحث' : 'Paper'}</th>
                                <th>{isArabic ? 'السلالة' : 'Species / Strain'}</th>
                                <th>{isArabic ? 'التصنيف' : 'Category'}</th>
                                <th>{isArabic ? 'السنة' : 'Year'}</th>
                                <th>{isArabic ? 'التحليل' : 'Analysis'}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {summaryRecords.map((s) => (
                                <tr key={s.paper.id}>
                                  <td><strong>{s.paper.title}</strong></td>
                                  <td><em>{species(s)}</em></td>
                                  <td>{s.paper.category}</td>
                                  <td>{s.paper.year}</td>
                                  <td>{s.findings}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="single-accordion-list">
                          {summaryRecords.map((s) => (
                            <div key={s.paper.id} className="synthesis-paper-card">
                              <button 
                                type="button" 
                                className="paper-card-header-btn"
                                onClick={() => toggleSummary(s.paper.id)}
                              >
                                <span><strong>{s.paper.title}</strong> ({s.paper.year})</span>
                                <ChevronDown size={16} />
                              </button>
                              {expandedSummaryIds.includes(s.paper.id) && (
                                <div className="paper-card-expanded-body">
                                  <p><strong>{isArabic ? 'السلالات:' : 'Species:'}</strong> <em>{species(s)}</em></p>
                                  <p><strong>{isArabic ? 'المحتوى والنتائج:' : 'Analysis:'}</strong></p>
                                  <div className="expanded-text">{renderMarkdown(summaryToolText(s))}</div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Gemini API Key Modal */}
            {settingsOpen && (
              <div className="modal-backdrop" onClick={() => setSettingsOpen(false)}>
                <div className="modal api-key-modal" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <Settings size={20} />
                    <h3>{isArabic ? 'إعدادات محرك Gemini 2.0 الذكي' : 'Gemini 2.0 AI Settings'}</h3>
                  </div>
                  <p className="modal-desc">
                    {isArabic 
                      ? 'يمكنك إضافة مفتاح Gemini API المجاني الخاص بك لتفعيل القدرات التوليدية المتقدمة (Gemini 2.0 Flash) لإنتاج بروتوكولات تفاعلية فورية. يُحفظ المفتاح محلياً في متصفحك فقط.'
                      : 'Provide your personal Google Gemini API key to unlock the Gemini 2.0 Flash reasoning engine. The key is securely stored in your local browser only.'}
                  </p>
                  <input 
                    type="password" 
                    value={key} 
                    onChange={(e) => setKey(e.target.value)} 
                    placeholder="AIzaSy..." 
                    className="api-key-input"
                  />
                  <div className="modal-actions">
                    <a 
                      href="https://aistudio.google.com/app/apikey" 
                      target="_blank" 
                      rel="noreferrer"
                      className="get-key-link"
                    >
                      {isArabic ? 'احصل على مفتاح مجاني من Google ↗' : 'Get free Gemini API Key ↗'}
                    </a>
                    <button 
                      type="button" 
                      className="save-key-btn"
                      onClick={() => {
                        saveGeminiKey(key);
                        setSettingsOpen(false);
                      }}
                    >
                      {isArabic ? 'حفظ المفتاح' : 'Save Key'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
