import { useEffect, useMemo, useState } from 'react';
import { BookOpen, FilePlus2, Search } from 'lucide-react';
import { AdSlot } from './components/AdSlot';
import { AiChatWidget } from './components/AiChatWidget';
import { Footer } from './components/Footer';
import { SearchFilters } from './components/SearchFilters';
import { SubmitResearch } from './components/SubmitResearch';
import { filterPapers, loadAlgaeDatabase } from './services/databaseService';
import type { Filters, Language, Paper } from './types';

const titles: Record<Language, string> = {
  ar: 'المكتبة المتكاملة لأبحاث الطحالب | أ.د/ رضا محمد مغازي',
  en: 'Integrated Algae Research Library | Prof. Dr. Reda Mohamed Mogazy',
  it: 'Biblioteca Integrata di Ricerca sulle Alghe',
};
const initialFilters: Filters = { topic: '', year: '', author: '', doi: '', language: '' };

export default function App() {
  const [language, setLanguage] = useState<Language>('ar');
  const [papers, setPapers] = useState<Paper[]>([]);
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submit, setSubmit] = useState(false);
  const pageSize = 25;
  const filtered = useMemo(() => filterPapers(papers, filters), [papers, filters]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    document.title = titles[language];
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', titles[language]);
  }, [language]);
  useEffect(() => { void loadAlgaeDatabase().then(setPapers).catch((e: unknown) => setError(e instanceof Error ? e.message : 'تعذر تحميل قاعدة البيانات')).finally(() => setLoading(false)); }, []);
  useEffect(() => { setPage(1); }, [filters]);

  if (submit) return <><header className="topbar"><button onClick={() => setSubmit(false)}><BookOpen size={18} /> المكتبة</button></header><SubmitResearch /><Footer /></>;
  return <div>
    <header className="topbar"><div className="brand"><BookOpen size={25} /><span>{titles[language]}</span></div><div className="nav-actions"><select value={language} onChange={(e) => setLanguage(e.target.value as Language)} aria-label="Language"><option value="ar">العربية</option><option value="en">English</option><option value="it">Italiano</option></select><button onClick={() => setSubmit(true)}><FilePlus2 size={17} /> إرسال بحث</button></div></header>
    <AdSlot />
    <main className="layout"><SearchFilters filters={filters} onChange={setFilters} /><section className="results"><div className="results-heading"><div><h1>{language === 'ar' ? 'استكشف أبحاث الطحالب' : language === 'it' ? 'Esplora la ricerca sulle alghe' : 'Explore algae research'}</h1><p>{filtered.length.toLocaleString()} دراسة مفهرسة</p></div><Search size={26} /></div>
      {loading && <p>جارٍ تحميل قاعدة البيانات بشكل غير متزامن...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && visible.map((paper, index) => <div key={paper.id} className="paper-card"><h2>{paper.title}</h2><p>{paper.authors} · {paper.year} · {paper.language}</p><small>{paper.topic} {paper.doi && `· DOI: ${paper.doi}`}</small>{index === 9 && <AdSlot variant="native" />}</div>)}
      {!loading && !error && filtered.length === 0 && <p>لا توجد نتائج مطابقة للفلاتر الحالية.</p>}
      {totalPages > 1 && <nav className="pagination"><button disabled={page === 1} onClick={() => setPage(page - 1)}>السابق</button><span>{page} / {totalPages}</span><button disabled={page === totalPages} onClick={() => setPage(page + 1)}>التالي</button></nav>}
    </section></main>
    <AdSlot /><Footer /><AiChatWidget />
  </div>;
}
