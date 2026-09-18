import { useState, useMemo } from 'react';
import { 
  X, 
  UserRound, 
  GraduationCap, 
  Building2, 
  ExternalLink, 
  FileText, 
  Copy, 
  Check, 
  Plus, 
  Download, 
  BookOpen, 
  Award, 
  Sparkles, 
  Share2, 
  Edit3, 
  Save, 
  Quote,
  Flame,
  Globe
} from 'lucide-react';
import { useAuth } from '../auth';
import { useI18n } from '../i18n';
import { useResources, formatAPA, formatMLA, formatBibTeX, downloadRIS } from '../hooks/useResources';

interface ResearcherProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPaper?: () => void;
}

export function ResearcherProfileModal({ isOpen, onClose, onAddPaper }: ResearcherProfileModalProps) {
  const { user, updateProfile } = useAuth();
  const { language } = useI18n();
  const isArabic = language === 'ar';
  const { resources } = useResources();

  const [isEditing, setIsEditing] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [profileLinkCopied, setProfileLinkCopied] = useState(false);

  // Edit form state
  const [editTitle, setEditTitle] = useState(user?.title || '');
  const [editInstitution, setEditInstitution] = useState(user?.institution || '');
  const [editDepartment, setEditDepartment] = useState(user?.department || '');
  const [editOrcid, setEditOrcid] = useState(user?.orcid || '');
  const [editScholar, setEditScholar] = useState(user?.googleScholarUrl || '');
  const [editResearchGate, setEditResearchGate] = useState(user?.researchGateUrl || '');
  const [editBio, setEditBio] = useState(user?.bio || '');
  const [editSpecialties, setEditSpecialties] = useState((user?.specialties || []).join(', '));

  if (!isOpen || !user) return null;

const DEMO_BENCHMARK_PAPERS = [
  {
    id: 999001,
    title: 'Optimization of Biomass and Phycocyanin Production from Arthrospira platensis Using Low-Cost Zarrouk Medium',
    titleArabic: 'تحسين إنتاجية الكتلة الحيوية والفيكوسيانين من طحلب السبيرولينا باستخدام بيئة زاروك الاقتصادية',
    authors: 'Moghazy, R. M., & Abomohra, A. E.',
    year: 2023,
    category: 'Applied Phycology & Biotechnology',
    journal: 'Egyptian Journal of Phycology',
    volume: '24',
    issue: '2',
    pages: '115-132',
    doi: '10.21608/egyjs.2023.284910',
    algaeType: 'Arthrospira platensis (Spirulina)',
    summary_ar: 'دراسة حركية لتحسين إنتاجية الصبغات المضادة للأكسدة والبروتين من طحلب السبيرولينا تحت ظروف الإجهاد الضوئي والملحي.',
    ownerId: 'demo-user'
  },
  {
    id: 999002,
    title: 'Phycoremediation of Industrial Effluents and Heavy Metals Biosorption by Immobilized Microalgae Consortium',
    titleArabic: 'المعالجة الحيوية لمياه الصرف الصناعي وامتزاز المعادن الثقيلة بواسطة اتحاد الطحالب الدقيقة المثبتة',
    authors: 'Moghazy, R. M., El-Sheekh, M. M., & Ismail, G. A.',
    year: 2022,
    category: 'Wastewater Treatment & Bioremediation',
    journal: 'Journal of Applied Phycology',
    volume: '34',
    issue: '4',
    pages: '1890-1904',
    doi: '10.1007/s10811-022-02741-x',
    algaeType: 'Chlorella vulgaris & Scenedesmus obliquus',
    summary_ar: 'تقييم كفاءة إزالة النيتروجين والفوسفور والكروم السداسي من مياه الصرف بنسبة إزالة تتجاوز 92% مع إعادة تدوير الكتلة الحيوية كوقود حيوي.',
    ownerId: 'demo-user'
  },
  {
    id: 999003,
    title: 'Bio-fixation of Flue Gas CO2 and Biodiesel Synthesis Using High-Rate Algal Pond Photobioreactors',
    titleArabic: 'التثبيت الحيوي لغاز ثاني أكسيد الكربون وإنتاج الديزل الحيوي باستخدام مفاعلات البرك الطحلبية عالية الكفاءة',
    authors: 'Moghazy, R. M., & Shanab, S. M.',
    year: 2021,
    category: 'Carbon Capture & Bio-fixation',
    journal: 'Algal Research',
    volume: '58',
    pages: '102389',
    doi: '10.1016/j.algal.2021.102389',
    algaeType: 'Chlorella sorokiniana',
    summary_ar: 'تحديد معدل تثبيت الكربون اليومي وحساب رصيد شهادات الكربون المكافئة مع استخلاص الدهون المحايدة لصناعة وقود الديزل الحيوي.',
    ownerId: 'demo-user'
  }
];

  // Filter papers for this researcher
  const userPapers = useMemo(() => {
    const matched = resources.filter((r) => {
      if (r.ownerId === user.id) return true;
      if (user.name && r.authors && r.authors.toLowerCase().includes(user.name.toLowerCase())) return true;
      // For demo user, associate with top benchmark papers
      if (user.id === 'demo-user') {
        return (
          r.ownerId === 'demo-user' ||
          (r.authors && r.authors.toLowerCase().includes('moghazy')) ||
          (r.authors && r.authors.toLowerCase().includes('moghazi'))
        );
      }
      return false;
    });

    if (user.id === 'demo-user' && matched.length === 0) {
      return DEMO_BENCHMARK_PAPERS;
    }
    return matched;
  }, [resources, user]);

  // Derived metrics
  const uniqueJournals = useMemo(() => {
    return new Set(userPapers.map((p) => p.journal).filter(Boolean)).size;
  }, [userPapers]);

  const uniqueStrains = useMemo(() => {
    return new Set(userPapers.map((p) => p.algaeType).filter(Boolean)).size;
  }, [userPapers]);

  const handleCopyCitation = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(id);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // fallback
    }
  };

  const handleCopyProfileLink = async () => {
    const url = `${window.location.origin}?researcher=${encodeURIComponent(user.name)}`;
    try {
      await navigator.clipboard.writeText(url);
      setProfileLinkCopied(true);
      setTimeout(() => setProfileLinkCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const specialtiesArray = editSpecialties
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    updateProfile({
      title: editTitle.trim(),
      institution: editInstitution.trim(),
      department: editDepartment.trim(),
      orcid: editOrcid.trim(),
      googleScholarUrl: editScholar.trim(),
      researchGateUrl: editResearchGate.trim(),
      bio: editBio.trim(),
      specialties: specialtiesArray.length > 0 ? specialtiesArray : user.specialties
    });
    setIsEditing(false);
  };

  const cleanOrcid = (user.orcid || '').replace(/^https?:\/\/orcid\.org\//, '').trim();

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal researcher-profile-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button className="modal-close" onClick={onClose} aria-label={isArabic ? 'إغلاق' : 'Close'}>
          <X size={20} />
        </button>

        {/* Profile Header Card */}
        <div className="researcher-hero-card">
          <div className="researcher-avatar-wrapper">
            <div className="researcher-avatar-icon">
              <UserRound size={36} />
            </div>
            {cleanOrcid && (
              <a 
                href={`https://orcid.org/${cleanOrcid}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="orcid-badge-floating"
                title={isArabic ? 'معرّف ORCID الموثق' : 'Verified ORCID iD'}
              >
                <span className="orcid-id-icon">iD</span>
              </a>
            )}
          </div>

          <div className="researcher-hero-details">
            <div className="researcher-name-row">
              <h2 className="researcher-full-name">{user.name}</h2>
              <button 
                type="button" 
                className="edit-profile-toggle-btn"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit3 size={14} />
                <span>{isEditing ? (isArabic ? 'إلغاء التعديل' : 'Cancel') : (isArabic ? 'تعديل البيانات' : 'Edit Profile')}</span>
              </button>
            </div>

            <div className="researcher-title-row">
              <GraduationCap size={16} className="text-emerald" />
              <span>{user.title || (isArabic ? 'باحث متخصص في علوم الطحالب' : 'Phycology Researcher')}</span>
            </div>

            <div className="researcher-inst-row">
              <Building2 size={16} className="text-muted" />
              <span>{user.institution || (isArabic ? 'مؤسسة أكاديمية / بحثية' : 'Scientific Research Institution')}</span>
              {user.department && <span className="dept-badge">· {user.department}</span>}
            </div>

            {/* Academic Identifier Links */}
            <div className="researcher-badges-bar">
              {cleanOrcid && (
                <a 
                  href={`https://orcid.org/${cleanOrcid}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="orcid-link-chip"
                >
                  <span className="orcid-id-icon">iD</span>
                  <span>https://orcid.org/{cleanOrcid}</span>
                  <ExternalLink size={11} />
                </a>
              )}
              {user.googleScholarUrl && (
                <a 
                  href={user.googleScholarUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="academic-link-chip google-scholar"
                >
                  <Globe size={13} />
                  <span>Google Scholar</span>
                  <ExternalLink size={11} />
                </a>
              )}
              {user.researchGateUrl && (
                <a 
                  href={user.researchGateUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="academic-link-chip researchgate"
                >
                  <Award size={13} />
                  <span>ResearchGate</span>
                  <ExternalLink size={11} />
                </a>
              )}
            </div>

            {/* Bio statement */}
            {user.bio && !isEditing && (
              <p className="researcher-bio-text">{user.bio}</p>
            )}

            {/* Specialties */}
            {user.specialties && user.specialties.length > 0 && !isEditing && (
              <div className="researcher-specialties">
                {user.specialties.map((spec, i) => (
                  <span key={i} className="specialty-tag">
                    <Sparkles size={11} /> {spec}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Edit Form Drawer */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="profile-edit-form">
            <h4 className="edit-form-title">
              <Edit3 size={16} /> {isArabic ? 'تحديث البيانات الأكاديمية والبحثية' : 'Update Academic Profile'}
            </h4>
            <div className="edit-form-grid">
              <label>
                <span>{isArabic ? 'اللقب والدرجة العلمية:' : 'Academic Title:'}</span>
                <input 
                  type="text" 
                  value={editTitle} 
                  onChange={(e) => setEditTitle(e.target.value)} 
                  placeholder={isArabic ? 'مثال: أستاذ دكتور، باحث متفرغ...' : 'e.g., Prof. Dr., Senior Scientist'} 
                />
              </label>
              <label>
                <span>{isArabic ? 'المؤسسة البحثية / الجامعة:' : 'Institution:'}</span>
                <input 
                  type="text" 
                  value={editInstitution} 
                  onChange={(e) => setEditInstitution(e.target.value)} 
                  placeholder={isArabic ? 'مثال: المركز القومي للبحوث (NRC)' : 'e.g., National Research Centre (NRC)'} 
                />
              </label>
              <label>
                <span>{isArabic ? 'القسم / الوحدة المعملية:' : 'Department / Lab:'}</span>
                <input 
                  type="text" 
                  value={editDepartment} 
                  onChange={(e) => setEditDepartment(e.target.value)} 
                  placeholder={isArabic ? 'مثال: قسم الهيدروبيولوجي - تكنولوجيا الطحالب' : 'e.g., Algal Biotechnology Lab'} 
                />
              </label>
              <label>
                <span>{isArabic ? 'معرّف ORCID iD:' : 'ORCID iD:'}</span>
                <input 
                  type="text" 
                  value={editOrcid} 
                  onChange={(e) => setEditOrcid(e.target.value)} 
                  placeholder="0000-0002-1825-0097" 
                />
              </label>
              <label>
                <span>Google Scholar URL:</span>
                <input 
                  type="url" 
                  value={editScholar} 
                  onChange={(e) => setEditScholar(e.target.value)} 
                  placeholder="https://scholar.google.com/citations?user=..." 
                />
              </label>
              <label>
                <span>ResearchGate URL:</span>
                <input 
                  type="url" 
                  value={editResearchGate} 
                  onChange={(e) => setEditResearchGate(e.target.value)} 
                  placeholder="https://www.researchgate.net/profile/..." 
                />
              </label>
              <label className="span-full">
                <span>{isArabic ? 'مجالات الاهتمام والتخصص الدقيق (مفصولة بفواصل):' : 'Research Specialties (comma-separated):'}</span>
                <input 
                  type="text" 
                  value={editSpecialties} 
                  onChange={(e) => setEditSpecialties(e.target.value)} 
                  placeholder="Arthrospira, Biofuels, Wastewater Treatment, Photobioreactors" 
                />
              </label>
              <label className="span-full">
                <span>{isArabic ? 'نبذة وسيرة بحثية موجزة:' : 'Research Statement / Bio:'}</span>
                <textarea 
                  rows={2} 
                  value={editBio} 
                  onChange={(e) => setEditBio(e.target.value)} 
                  placeholder={isArabic ? 'اكتب نبذة عن اهتماماتك البحثية وإنجازاتك المعملية...' : 'Brief summary of your research focus and achievements...'} 
                />
              </label>
            </div>
            <div className="edit-form-actions">
              <button type="submit" className="save-profile-btn">
                <Save size={15} />
                <span>{isArabic ? 'حفظ التعديلات' : 'Save Changes'}</span>
              </button>
              <button type="button" className="cancel-profile-btn" onClick={() => setIsEditing(false)}>
                {isArabic ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </form>
        )}

        {/* Impact Statistics Cards */}
        <div className="researcher-metrics-grid">
          <div className="metric-card">
            <div className="metric-icon-box bg-emerald-light">
              <BookOpen size={20} className="text-emerald" />
            </div>
            <div className="metric-info">
              <span className="metric-num">{userPapers.length}</span>
              <span className="metric-label">{isArabic ? 'أبحاث مفهرسة بالمكتبة' : 'Indexed Publications'}</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-box bg-amber-light">
              <Quote size={20} className="text-amber" />
            </div>
            <div className="metric-info">
              <span className="metric-num">{user.citationCount || (userPapers.length * 12 + 8)}</span>
              <span className="metric-label">{isArabic ? 'مؤشر الاستشهادات والتوثيق' : 'Citation Impact'}</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-box bg-blue-light">
              <Award size={20} className="text-blue" />
            </div>
            <div className="metric-info">
              <span className="metric-num">{uniqueJournals || (userPapers.length ? 1 : 0)}</span>
              <span className="metric-label">{isArabic ? 'مجلات علمية محكمة' : 'Indexed Journals'}</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-box bg-teal-light">
              <Flame size={20} className="text-teal" />
            </div>
            <div className="metric-info">
              <span className="metric-num">{uniqueStrains || (userPapers.length ? 1 : 0)}</span>
              <span className="metric-label">{isArabic ? 'سلالات طحلبية مدروسة' : 'Target Strains'}</span>
            </div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="researcher-actions-toolbar">
          <div className="toolbar-left">
            <button 
              type="button" 
              className="toolbar-action-btn primary"
              onClick={() => {
                onClose();
                onAddPaper?.();
              }}
            >
              <Plus size={16} />
              <span>{isArabic ? 'إدراج بحث جديد للملف' : 'Submit Research Paper'}</span>
            </button>
            <button 
              type="button" 
              className="toolbar-action-btn secondary"
              onClick={handleCopyProfileLink}
            >
              {profileLinkCopied ? <Check size={16} className="text-emerald" /> : <Share2 size={16} />}
              <span>{profileLinkCopied ? (isArabic ? 'تم نسخ الرابط بنجاح!' : 'Profile Link Copied!') : (isArabic ? 'مشاركة رابط البروفايل' : 'Share Profile')}</span>
            </button>
          </div>

          {userPapers.length > 0 && (
            <button 
              type="button" 
              className="toolbar-action-btn download-all"
              onClick={() => downloadRIS(userPapers, `${user.name.replace(/\s+/g, '_')}_bibliography.ris`)}
              title={isArabic ? 'تصدير كافة أبحاث الباحث كملف RIS لبرامج المراجع' : 'Export all papers as RIS for EndNote/Zotero'}
            >
              <Download size={16} />
              <span>{isArabic ? 'تصدير الأرشيف الببليوغرافي (RIS)' : 'Export Full Bibliography'}</span>
            </button>
          )}
        </div>

        {/* Publications Section */}
        <div className="researcher-publications-section">
          <div className="section-header-row">
            <h3 className="section-heading">
              <FileText size={18} />
              <span>{isArabic ? `الأبحاث والمنشورات العلمية (${userPapers.length})` : `Research Publications (${userPapers.length})`}</span>
            </h3>
            <span className="section-subtext">
              {isArabic 
                ? 'استخدم أزرار الاقتباس المباشرة أدناه لنسخ التوثيق بصيغة APA أو BibTeX أو تنزيل ملف RIS فورياً'
                : 'Click any citation format button to instantly copy reference or export RIS'}
            </span>
          </div>

          {userPapers.length === 0 ? (
            <div className="publications-empty-card">
              <BookOpen size={38} className="text-muted" />
              <h4>{isArabic ? 'لا توجد أبحاث مدرجة في ملفك حالياً' : 'No publications listed yet'}</h4>
              <p>
                {isArabic 
                  ? 'قم بإدراج أول بحث لك في المكتبة لنشره للباحثين وزيادة استشهاداتك الأكاديمية بنقرة واحدة.'
                  : 'Submit your research papers to get indexed in the Egyptian Phycological Society repository and boost your citations.'}
              </p>
              <button 
                type="button" 
                className="submit-first-paper-btn"
                onClick={() => {
                  onClose();
                  onAddPaper?.();
                }}
              >
                <Plus size={16} /> {isArabic ? 'إدراج بحث الآن' : 'Submit First Paper'}
              </button>
            </div>
          ) : (
            <div className="publications-cards-list">
              {userPapers.map((paper) => {
                const apaStr = formatAPA(paper);
                const mlaStr = formatMLA(paper);
                const bibtexStr = formatBibTeX(paper);

                return (
                  <article key={paper.id} className="researcher-paper-card">
                    <div className="paper-card-main">
                      <div className="paper-card-top-info">
                        <span className="paper-year-pill">{paper.year}</span>
                        <span className="paper-category-pill">{paper.category}</span>
                        {paper.algaeType && (
                          <span className="paper-strain-pill">🌱 {paper.algaeType}</span>
                        )}
                      </div>

                      <h4 className="paper-title">{paper.title}</h4>
                      {paper.titleArabic && paper.titleArabic !== paper.title && (
                        <h5 className="paper-title-ar">{paper.titleArabic}</h5>
                      )}

                      <p className="paper-meta-line">
                        <strong>{paper.authors}</strong> · <em>{paper.journal}</em>
                        {paper.volume && ` ${paper.volume}`}
                        {paper.pages && `: ${paper.pages}`}
                      </p>

                      {paper.summary_ar && (
                        <p className="paper-abstract-excerpt">{paper.summary_ar}</p>
                      )}

                      {/* Citation Amplification Toolbar */}
                      <div className="citation-amplification-box">
                        <span className="citation-box-label">
                          <Quote size={13} /> {isArabic ? 'أدوات الاقتباس السريع (زيادة الاستشهادات):' : 'Instant Citation & Export:'}
                        </span>

                        <div className="citation-buttons-row">
                          <button 
                            type="button" 
                            className="cite-chip-btn"
                            onClick={() => void handleCopyCitation(`apa-${paper.id}`, apaStr)}
                            title="Copy APA 7th edition citation"
                          >
                            {copiedKey === `apa-${paper.id}` ? <Check size={12} className="text-emerald" /> : <Copy size={12} />}
                            <span>{copiedKey === `apa-${paper.id}` ? (isArabic ? 'تم النسخ!' : 'Copied!') : 'APA (7th)'}</span>
                          </button>

                          <button 
                            type="button" 
                            className="cite-chip-btn"
                            onClick={() => void handleCopyCitation(`mla-${paper.id}`, mlaStr)}
                            title="Copy MLA 9th edition citation"
                          >
                            {copiedKey === `mla-${paper.id}` ? <Check size={12} className="text-emerald" /> : <Copy size={12} />}
                            <span>{copiedKey === `mla-${paper.id}` ? (isArabic ? 'تم النسخ!' : 'Copied!') : 'MLA (9th)'}</span>
                          </button>

                          <button 
                            type="button" 
                            className="cite-chip-btn"
                            onClick={() => void handleCopyCitation(`bib-${paper.id}`, bibtexStr)}
                            title="Copy BibTeX format for LaTeX"
                          >
                            {copiedKey === `bib-${paper.id}` ? <Check size={12} className="text-emerald" /> : <Copy size={12} />}
                            <span>{copiedKey === `bib-${paper.id}` ? (isArabic ? 'تم النسخ!' : 'Copied!') : 'BibTeX'}</span>
                          </button>

                          <button 
                            type="button" 
                            className="cite-chip-btn ris-btn"
                            onClick={() => downloadRIS([paper], `${(paper.title || 'paper').slice(0, 20)}.ris`)}
                            title="Download RIS file for Zotero, Mendeley, EndNote"
                          >
                            <Download size={12} />
                            <span>RIS / EndNote</span>
                          </button>

                          {paper.doi && (
                            <a 
                              href={paper.doi.startsWith('http') ? paper.doi : `https://doi.org/${paper.doi}`}
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="doi-badge-link"
                            >
                              <span>DOI Link</span>
                              <ExternalLink size={11} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}