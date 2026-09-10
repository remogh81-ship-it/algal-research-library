import { FormEvent, useState } from 'react';
import { useAuth } from '../auth';
import { saveSubmittedResource } from '../services/resourceLoader';
import type { Resource } from '../types/resource';

type FormValues = Omit<Resource, 'id'>;
const initial: FormValues = { title: '', titleArabic: '', category: 'Microalgae', categoryArabic: '', algaeType: 'microalgae', authors: '', year: new Date().getFullYear(), journal: '', doi: '', summary: '', url: '', pdfUrl: '' };
const publishingYearMin = 1800;

export function SubmissionModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const { user } = useAuth();
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
      ['summary', 'Arabic summary is required.'],
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
    <button className="modal-close" onClick={onClose} aria-label="Close">×</button><span className="eyebrow">NEW RESEARCH</span><h2>Add research paper</h2><p className="modal-intro">All fields are saved locally and appear in your library immediately.</p>
    <form onSubmit={submit} className="submission-form"><div className="form-grid"><label>English title<input value={values.title} onChange={(event) => update('title', event.target.value)} required /></label><label>Arabic title<input value={values.titleArabic} onChange={(event) => update('titleArabic', event.target.value)} required /></label><label>Authors<input value={values.authors} onChange={(event) => update('authors', event.target.value)} required /></label><label>Publication year<input type="number" value={values.year} onChange={(event) => update('year', event.target.value)} required /></label><label>Category<select value={values.category} onChange={(event) => update('category', event.target.value)}><option>Microalgae</option><option>Macroalgae</option><option>Biofuel</option><option>Bioremediation</option><option>Wastewater Treatment</option><option>Carbon Capture</option></select></label><label>Algae type<select value={values.algaeType} onChange={(event) => update('algaeType', event.target.value)} required><option value="microalgae">Microalgae</option><option value="macroalgae">Macroalgae</option></select></label><label>Journal name<input value={values.journal} onChange={(event) => update('journal', event.target.value)} required /></label><label>DOI<input value={values.doi} onChange={(event) => update('doi', event.target.value)} /></label><label>Landing page URL<input type="url" value={values.url} onChange={(event) => update('url', event.target.value)} /></label><label>PDF URL<input type="url" value={values.pdfUrl} onChange={(event) => update('pdfUrl', event.target.value)} /></label></div><label>Arabic summary<textarea value={values.summary} onChange={(event) => update('summary', event.target.value)} required /></label>{error && <p className="error">{error}</p>}<button className="primary-action" type="submit">Save research</button></form>
  </section></div>;
}
