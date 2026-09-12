import { FormEvent, useState } from 'react';
import { useAuth } from '../auth';
import { saveSubmittedResource } from '../services/resourceLoader';
import type { Resource } from '../types/resource';
import { useI18n } from '../i18n';

type FormValues = Omit<Resource, 'id'>;
const initial: FormValues = { title: '', titleArabic: '', category: 'Microalgae', categoryArabic: '', algaeType: 'microalgae', authors: '', year: new Date().getFullYear(), journal: '', volume: '', issue: '', pages: '', doi: '', summary_ar: '', url: '', pdfUrl: '' };
const publishingYearMin = 1800;

export function SubmissionModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const { user } = useAuth();
  const { t, category } = useI18n();
  const [values, setValues] = useState(initial);
  const [error, setError] = useState('');
  const update = (key: keyof FormValues, value: string) => setValues((current) => ({ ...current, [key]: key === 'year' ? Number(value) : value }));
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!user) return;
    const requiredFields: Array<[keyof FormValues, string]> = [
      ['title', 'English title is required.'],
      ['authors', 'Authors are required.'],
      ['year', 'Publication year is required.'],
      ['category', 'Category is required.'],
      ['doi', 'DOI is required.'],
      ['summary_ar', 'Arabic summary is required.'],
    ];
    const missing = requiredFields.find(([key]) => !String(values[key]).trim());
    if (missing) { setError(missing[1]); return; }
    if (values.year <  publishingYearMin || values.year > new Date().getFullYear() + 1) {
      setError('Enter a valid publication year.'); return;
    }
    try {
      const id = Number(`${Date.now()}${Math.floor(Math.random() * 1000)}`);
      await saveSubmittedResource({ ...values, id, ownerId: user.id });
      window.dispatchEvent(new Event('resources-updated')); onSaved(); onClose();
    } catch { setError('Unable to save this submission locally.'); }
  };
  return <div className="modal-backdrop" onClick={onClose}><section className="modal submission-modal" onClick={(event) => event.stopPropagation()}>
    <button className="modal-close" onClick={onClose} aria-label="Close">×</button><span className="eyebrow">{t('submission.eyebrow')}</span><h2>{t('submission.title')}</h2><p className="modal-intro">{t('submission.intro')}</p>
    <form onSubmit={submit} className="submission-form"><div className="form-grid"><label>{t('submission.englishTitle')}<input value={values.title} onChange={(event) => update('title', event.target.value)} required /></label><label>{t('submission.arabicTitle')}<input value={values.titleArabic} onChange={(event) => update('titleArabic', event.target.value)} required /></label><label>{t('submission.authors')}<input value={values.authors} onChange={(event) => update('authors', event.target.value)} required /></label><label>{t('submission.year')}<input type="number" value={values.year} onChange={(event) => update('year', event.target.value)} required /></label><label>{t('submission.category')}<select value={values.category} onChange={(event) => update('category', event.target.value)}>{['Microalgae', 'Macroalgae', 'Biofuel', 'Bioremediation', 'Wastewater Treatment', 'Carbon Capture', 'Wastewater Bioremediation', 'Microalgae Cultivation', 'Carbon Bio-fixation', 'Heavy Metals Biosorption', 'Applied Phycology'].map((value) => <option key={value} value={value}>{category(value)}</option>)}</select></label><label>{t('submission.algaeType')}<select value={values.algaeType} onChange={(event) => update('algaeType', event.target.value)} required><option value="microalgae">{category('Microalgae')}</option><option value="macroalgae">{category('Macroalgae')}</option></select></label><label>{t('submission.journal')}<input value={values.journal} onChange={(event) => update('journal', event.target.value)} required /></label><label>DOI<input value={values.doi} onChange={(event) => update('doi', event.target.value)} /></label><label>{t('submission.url')}<input type="url" value={values.url} onChange={(event) => update('url', event.target.value)} /></label><label>{t('submission.pdf')}<input type="url" value={values.pdfUrl} onChange={(event) => update('pdfUrl', event.target.value)} /></label></div><label>{t('submission.summary')}<textarea value={values.summary_ar} onChange={(event) => update('summary_ar', event.target.value)} required /></label>{error && <p className="error">{error}</p>}<button className="primary-action" type="submit">{t('submission.save')}</button></form>
  </section></div>;
}
