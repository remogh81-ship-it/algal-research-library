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
  Globe,
  RefreshCw,
  Upload,
  AlertCircle,
  CheckCircle2,
  FileCode
} from 'lucide-react';
import { useAuth } from '../auth';
import { useI18n } from '../i18n';
import { useResources, formatAPA, formatMLA, formatBibTeX, downloadRIS } from '../hooks/useResources';
import { 
  cleanOrcid, 
  fetchWorksFromOrcid, 
  parseScholarBibTeX, 
  syncAndClassifyPapers 
} from '../services/academicSync';
import { saveSubmittedResourcesBatch } from '../services/resourceLoader';

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

  // Sync & Import states
  const [isSyncingOrcid, setIsSyncingOrcid] = useState(false);
  const [syncNotification, setSyncNotification] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [isScholarModalOpen, setIsScholarModalOpen] = useState(false);
  const [scholarBibText, setScholarBibText] = useState('');
  const [isImportingScholar, setIsImportingScholar] = useState(false);

  // Edit form state
  const [editTitle, setEditTitle] = useState(user?.title || '');
  const [editInstitution, setEditInstitution] = useState(user?.institution || '');
  const [editDepartment, setEditDepartment] = useState(user?.department || '');
  const [editOrcid, setEditOrcid] = useState(user?.orcid || '');
  const [editScholar, setEditScholar] = useState(user?.googleScholarUrl || '');
  const [editResearchGate, setEditResearchGate] = useState(user?.researchGateUrl || '');
  const [editBio, setEditBio] = useState(user?.bio || '');
  const [editSpecialties, setEditSpecialties] = useState((user?.specialties || []).join(', '));

  // Filter papers for this researcher
  const userPapers = useMemo(() => {
    if (!user) return [];
    return resources.filter((r) => {
      if (r.ownerId === user.id) return true;
      if (user.name && r.authors && r.authors.toLowerCase().includes(user.name.toLowerCase())) return true;
      return false;
    });
  }, [resources, user]);

  // Derived metrics
  const uniqueJournals = useMemo(() => {
    return new Set(userPapers.map((p) => p.journal).filter(Boolean)).size;
  }, [userPapers]);

  const uniqueStrains = useMemo(() => {
    return new Set(userPapers.map((p) => p.algaeType).filter(Boolean)).size;
  }, [userPapers]);

  if (!isOpen || !user) return null;

  const validOrcid = cleanOrcid(user.orcid);

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

  const handleSyncOrcid = async () => {
    if (!validOrcid) {
      setSyncNotification({
        type: 'info',
        text: isArabic
          ? 'يرجى تسجيل معرّف ORCID الخاص بك أولاً بالضغط على "تعديل البيانات" للتمكن من المزامنة التلقائية.'
          : 'Please add your ORCID iD in your profile settings first to enable auto-sync.'
      });
      setIsEditing(true);
      return;
    }

    setIsSyncingOrcid(true);
    setSyncNotification(null);

    try {
      const works = await fetchWorksFromOrcid(validOrcid);
      if (!works || works.length === 0) {
        setSyncNotification({
          type: 'info',
          text: isArabic
            ? 'لم يتم العثور على أبحاث منشورة في هذا المعرف أو جاري انتظار تحديث مستودع ORCID.'
            : 'No public research works found for this ORCID iD.'
        });
        return;
      }

      // Check against existing library papers to avoid duplicate imports
      const existingTitles = new Set(resources.map((r) => r.title.toLowerCase().trim()));
      const existingDois = new Set(resources.map((r) => r.doi.toLowerCase().trim()).filter(Boolean));
      const newWorks = works.filter((w) => {
        const titleMatch = existingTitles.has(w.title.toLowerCase().trim());
        const doiMatch = w.doi ? existingDois.has(w.doi.toLowerCase().trim()) : false;
        return !titleMatch && !doiMatch;
      });

      if (newWorks.length === 0) {
        setSyncNotification({
          type: 'info',
          text: isArabic
            ? 'كافة أبحاثك المسجلة في ORCID مدرجة بالفعل ومصنفة داخل المكتبة البحثية!'
            : 'All your ORCID papers are already indexed and classified in the library!'
        });
        return;
      }

      const classified = syncAndClassifyPapers(newWorks, user.id, user.name);
      await saveSubmittedResourcesBatch(classified);
      window.dispatchEvent(new Event('resources-updated'));

      setSyncNotification({
        type: 'success',
        text: isArabic
          ? `تمت بنجاح مزامنة وتصنيف ${classified.length} بحثاً من ORCID وإدراجها في المكتبة وملفك الشخصي!`
          : `Successfully synced and classified ${classified.length} research papers from ORCID!`
      });
    } catch (err: any) {
      setSyncNotification({
        type: 'error',
        text: isArabic
          ? `تعذر استكمال المزامنة مع ORCID: ${err?.message || 'خطأ في الاتصال'}`
          : `Failed to sync with ORCID: ${err?.message || 'Network error'}`
      });
    } finally {
      setIsSyncingOrcid(false);
    }
  };

  const handleImportScholarBibTeX = async () => {
    if (!scholarBibText.trim()) return;
    setIsImportingScholar(true);

    try {
      const parsedWorks = parseScholarBibTeX(scholarBibText);
      if (parsedWorks.length === 0) {
        setSyncNotification({
          type: 'error',
          text: isArabic 
            ? 'لم يتم العثور على أبحاث صالحة في نص BibTeX. تأكد من نسخ صيغة BibTeX القياسية من Google Scholar.'
            : 'No valid BibTeX entries found. Please ensure you copied standard BibTeX from Google Scholar.'
        });
        return;
      }

      const existingTitles = new Set(resources.map((r) => r.title.toLowerCase().trim()));
      const existingDois = new Set(resources.map((r) => r.doi.toLowerCase().trim()).filter(Boolean));
      const newWorks = parsedWorks.filter((w) => {
        const titleMatch = existingTitles.has(w.title.toLowerCase().trim());
        const doiMatch = w.doi ? existingDois.has(w.doi.toLowerCase().trim()) : false;
        return !titleMatch && !doiMatch;
      });

      if (newWorks.length === 0) {
        setSyncNotification({
          type: 'info',
          text: isArabic
            ? 'كافة الأبحاث الموجودة في ملف BibTeX مدرجة بالفعل ومصنفة في المكتبة.'
            : 'All papers in the BibTeX file already exist in the library.'
        });
        setIsScholarModalOpen(false);
        return;
      }

      const classified = syncAndClassifyPapers(newWorks, user.id, user.name);
      await saveSubmittedResourcesBatch(classified);
      window.dispatchEvent(new Event('resources-updated'));

      setIsScholarModalOpen(false);
      setScholarBibText('');
      setSyncNotification({
        type: 'success',
        text: isArabic
          ? `تم بنجاح استيراد وتصنيف ${classified.length} بحثاً من Google Scholar وإدراجها في المكتبة!`
          : `Successfully imported and classified ${classified.length} papers from Google Scholar!`
      });
    } catch (err: any) {
      setSyncNotification({
        type: 'error',
        text: isArabic ? 'حدث خطأ أثناء معالجة بيانات BibTeX.' : 'Error processing BibTeX data.'
      });
    } finally {
      setIsImportingScholar(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) setScholarBibText(content);
    };
    reader.readAsText(file);
  };

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
            {validOrcid && (
              <a 
                href={`https://orcid.org/${validOrcid}`} 
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
              {validOrcid && (
                <a 
                  href={`https://orcid.org/${validOrcid}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="orcid-link-chip"
                >
                  <span className="orcid-id-icon">iD</span>
                  <span>https://orcid.org/{validOrcid}</span>
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

            {/* Bio summary */}
            {user.bio && (
              <p className="researcher-bio-text">{user.bio}</p>
            )}

            {/* Research Specialties Chips */}
            {user.specialties && user.specialties.length > 0 && (
              <div className="researcher-specialties-row">
                <span className="specialties-label">
                  <Sparkles size={13} /> {isArabic ? 'الاهتمامات والتخصصات الدقيقة:' : 'Focus Areas:'}
                </span>
                <div className="specialties-chips-wrap">
                  {user.specialties.map((spec, i) => (
                    <span key={i} className="specialty-chip">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Edit Profile Form (Collapsible) */}
        {isEditing && (
          <form className="edit-profile-drawer" onSubmit={handleSaveProfile}>
            <div className="drawer-header">
              <h3>
                <Edit3 size={16} />
                <span>{isArabic ? 'تحديث الملف التعريفي والروابط الأكاديمية' : 'Update Academic Profile & Identifiers'}</span>
              </h3>
            </div>

            <div className="edit-form-grid">
              <div className="input-group">
                <label>{isArabic ? 'اللقب الأكاديمي والدرجة العلمية' : 'Academic Title / Position'}</label>
                <input 
                  type="text" 
                  value={editTitle} 
                  onChange={(e) => setEditTitle(e.target.value)} 
                  placeholder={isArabic ? 'مثال: أستاذ التكنولوجيا الحيوية الطحلبية' : 'e.g. Professor of Applied Phycology'}
                />
              </div>

              <div className="input-group">
                <label>{isArabic ? 'الجامعة أو المركز البحثي' : 'Institution / University'}</label>
                <input 
                  type="text" 
                  value={editInstitution} 
                  onChange={(e) => setEditInstitution(e.target.value)} 
                  placeholder={isArabic ? 'مثال: المركز القومي للبحوث' : 'e.g. National Research Centre'}
                />
              </div>

              <div className="input-group">
                <label>{isArabic ? 'القسم أو المعمل البحثي' : 'Department / Research Unit'}</label>
                <input 
                  type="text" 
                  value={editDepartment} 
                  onChange={(e) => setEditDepartment(e.target.value)} 
                  placeholder={isArabic ? 'مثال: قسم الهيدروبيولوجي - معمل بيوتكنولوجيا الطحالب' : 'e.g. Hydrobiology Dept.'}
                />
              </div>

              <div className="input-group">
                <label>{isArabic ? 'معرّف ORCID (16 رقم)' : 'ORCID iD (16 digits)'}</label>
                <input 
                  type="text" 
                  value={editOrcid} 
                  onChange={(e) => setEditOrcid(e.target.value)} 
                  placeholder="0000-0002-1825-0097"
                />
              </div>

              <div className="input-group">
                <label>{isArabic ? 'رابط ملف Google Scholar' : 'Google Scholar Profile URL'}</label>
                <input 
                  type="url" 
                  value={editScholar} 
                  onChange={(e) => setEditScholar(e.target.value)} 
                  placeholder="https://scholar.google.com/citations?user=..."
                />
              </div>

              <div className="input-group">
                <label>{isArabic ? 'رابط ملف ResearchGate' : 'ResearchGate Profile URL'}</label>
                <input 
                  type="url" 
                  value={editResearchGate} 
                  onChange={(e) => setEditResearchGate(e.target.value)} 
                  placeholder="https://www.researchgate.net/profile/..."
                />
              </div>

              <div className="input-group full-width">
                <label>{isArabic ? 'الاهتمامات البحثية وسلالات الطحالب المستهدفة (مفصولة بفواصل)' : 'Research Topics & Algae Species (comma-separated)'}</label>
                <input 
                  type="text" 
                  value={editSpecialties} 
                  onChange={(e) => setEditSpecialties(e.target.value)} 
                  placeholder={isArabic ? 'Arthrospira platensis, Chlorella vulgaris, Biofuels, Phycoremediation' : 'Spirulina, Chlorella, Biofuels, Bioremediation'}
                />
              </div>

              <div className="input-group full-width">
                <label>{isArabic ? 'نبذة علمية وسيرة ذاتية مختصرة' : 'Short Academic Bio'}</label>
                <textarea 
                  rows={2} 
                  value={editBio} 
                  onChange={(e) => setEditBio(e.target.value)} 
                  placeholder={isArabic ? 'اكتب نبذة عن مجالاتك البحثية وخبراتك المعملية...' : 'Describe your research experience...'}
                />
              </div>
            </div>

            <div className="edit-form-footer">
              <button type="submit" className="save-profile-btn">
                <Save size={16} />
                <span>{isArabic ? 'حفظ التعديلات' : 'Save Changes'}</span>
              </button>
              <button type="button" className="cancel-edit-btn" onClick={() => setIsEditing(false)}>
                {isArabic ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </form>
        )}

        {/* Academic Impact Metrics Cards */}
        <div className="researcher-impact-stats">
          <div className="impact-stat-card">
            <div className="stat-icon-circle blue">
              <FileText size={18} />
            </div>
            <div className="stat-text-col">
              <span className="stat-number">{userPapers.length}</span>
              <span className="stat-title">{isArabic ? 'أبحاث مفهرسة' : 'Indexed Publications'}</span>
            </div>
          </div>

          <div className="impact-stat-card">
            <div className="stat-icon-circle green">
              <Award size={18} />
            </div>
            <div className="stat-text-col">
              <span className="stat-number">{uniqueJournals}</span>
              <span className="stat-title">{isArabic ? 'مجلات ودوريات علمية' : 'Distinct Journals'}</span>
            </div>
          </div>

          <div className="impact-stat-card">
            <div className="stat-icon-circle amber">
              <Sparkles size={18} />
            </div>
            <div className="stat-text-col">
              <span className="stat-number">{uniqueStrains}</span>
              <span className="stat-title">{isArabic ? 'سلالات طحالب مدروسة' : 'Algae Species Studied'}</span>
            </div>
          </div>

          <div className="impact-stat-card">
            <div className="stat-icon-circle red">
              <Flame size={18} />
            </div>
            <div className="stat-text-col">
              <span className="stat-number">{user.citationCount || (userPapers.length * 16)}</span>
              <span className="stat-title">{isArabic ? 'مؤشر الاستشهادات التقديري' : 'Estimated Citations'}</span>
            </div>
          </div>
        </div>

        {/* Sync / Action Notification Banner */}
        {syncNotification && (
          <div className={`sync-alert-banner ${syncNotification.type}`}>
            {syncNotification.type === 'success' && <CheckCircle2 size={18} className="text-emerald shrink-0" />}
            {syncNotification.type === 'error' && <AlertCircle size={18} className="text-rose shrink-0" />}
            {syncNotification.type === 'info' && <Sparkles size={18} className="text-blue shrink-0" />}
            <span className="sync-alert-text">{syncNotification.text}</span>
            <button 
              type="button" 
              className="sync-alert-close" 
              onClick={() => setSyncNotification(null)}
              aria-label="Close alert"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Profile Actions Bar */}
        <div className="researcher-actions-toolbar">
          <div className="toolbar-left-group">
            <button 
              type="button" 
              className="toolbar-action-btn primary"
              onClick={() => {
                onClose();
                onAddPaper?.();
              }}
            >
              <Plus size={16} />
              <span>{isArabic ? 'إدراج بحث يدوي' : 'Manual Submit'}</span>
            </button>

            <button 
              type="button" 
              className="toolbar-action-btn sync-btn"
              onClick={handleSyncOrcid}
              disabled={isSyncingOrcid}
              title={isArabic ? 'مزامنة وتصنيف أبحاث ORCID تلقائياً في المكتبة' : 'Auto sync & classify papers from ORCID'}
            >
              <RefreshCw size={16} className={isSyncingOrcid ? 'spin' : ''} />
              <span>{isSyncingOrcid ? (isArabic ? 'جاري المزامنة...' : 'Syncing...') : (isArabic ? 'مزامنة أبحاث ORCID تلقائياً' : 'Sync ORCID')}</span>
            </button>

            <button 
              type="button" 
              className="toolbar-action-btn scholar-btn"
              onClick={() => setIsScholarModalOpen(true)}
              title={isArabic ? 'استيراد أبحاث Google Scholar وتصنيفها آلياً' : 'Import papers from Google Scholar'}
            >
              <Upload size={16} />
              <span>{isArabic ? 'استيراد من Google Scholar' : 'Import Scholar'}</span>
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
                  ? 'يمكنك استيراد أبحاثك بنقرة زر واحدة عبر معرّف ORCID أو ملف BibTeX من Google Scholar، أو إدراجها يدوياً.'
                  : 'Sync your papers from ORCID, import via Google Scholar BibTeX, or submit manually to get indexed in the library.'}
              </p>
              <div className="empty-actions-row">
                <button 
                  type="button" 
                  className="submit-first-paper-btn"
                  onClick={handleSyncOrcid}
                  disabled={isSyncingOrcid}
                >
                  <RefreshCw size={16} className={isSyncingOrcid ? 'spin' : ''} />
                  <span>{isArabic ? 'مزامنة أبحاث ORCID الآن' : 'Sync ORCID Now'}</span>
                </button>
                <button 
                  type="button" 
                  className="submit-first-paper-btn secondary"
                  onClick={() => setIsScholarModalOpen(true)}
                >
                  <Upload size={16} />
                  <span>{isArabic ? 'استيراد من Google Scholar' : 'Import Scholar'}</span>
                </button>
              </div>
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

        {/* Google Scholar Import Modal */}
        {isScholarModalOpen && (
          <div className="sub-modal-backdrop" onClick={() => setIsScholarModalOpen(false)}>
            <div className="sub-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="sub-modal-header">
                <div className="sub-modal-title-box">
                  <FileCode size={20} className="text-primary" />
                  <h3>{isArabic ? 'استيراد أبحاث Google Scholar وتصنيفها آلياً' : 'Import & Auto-Classify Google Scholar Papers'}</h3>
                </div>
                <button type="button" className="close-btn" onClick={() => setIsScholarModalOpen(false)}>
                  <X size={18} />
                </button>
              </div>

              <div className="scholar-import-guide">
                <p>
                  {isArabic 
                    ? 'نظراً لقيود الحماية على Google Scholar، يمكنك تصدير أبحاثك بنقرة واحدة من حسابك:'
                    : 'To import papers from Google Scholar:'}
                </p>
                <ol>
                  <li>{isArabic ? 'افتح حسابك في Google Scholar وحدد أبحاثك المطلوبة.' : 'Open your Google Scholar profile and select papers.'}</li>
                  <li>{isArabic ? 'اضغط على زر Export (تصدير) واختر تنسيق BibTeX.' : 'Click Export and choose BibTeX.'}</li>
                  <li>{isArabic ? 'الصق النص المنسوخ أدناه أو ارفع الملف المحفوظ (.bib).' : 'Paste the BibTeX text below or upload the .bib file.'}</li>
                </ol>
              </div>

              <div className="scholar-input-area">
                <div className="file-upload-row">
                  <label className="file-upload-btn">
                    <Upload size={15} />
                    <span>{isArabic ? 'رفع ملف .bib من جهازك' : 'Upload .bib file'}</span>
                    <input type="file" accept=".bib,.txt" onChange={handleFileUpload} style={{ display: 'none' }} />
                  </label>
                  <span className="file-upload-hint">
                    {scholarBibText ? (isArabic ? 'تم تحميل النص، جاهز للمعالجة والتصنيف' : 'File loaded, ready to import') : (isArabic ? 'أو الصق النص مباشرة في الصندوق أدناه:' : 'Or paste BibTeX directly below:')}
                  </span>
                </div>

                <textarea
                  className="scholar-bib-textarea"
                  rows={8}
                  value={scholarBibText}
                  onChange={(e) => setScholarBibText(e.target.value)}
                  placeholder="@article{...\n  title={...},\n  author={...},\n  year={...}\n}"
                />
              </div>

              <div className="sub-modal-footer">
                <button
                  type="button"
                  className="scholar-submit-btn"
                  onClick={handleImportScholarBibTeX}
                  disabled={isImportingScholar || !scholarBibText.trim()}
                >
                  <Sparkles size={16} />
                  <span>{isImportingScholar ? (isArabic ? 'جاري الفحص والتصنيف...' : 'Processing...') : (isArabic ? 'استيراد وتصنيف الأبحاث فورياً' : 'Import & Auto-Classify')}</span>
                </button>
                <button
                  type="button"
                  className="scholar-cancel-btn"
                  onClick={() => setIsScholarModalOpen(false)}
                >
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
