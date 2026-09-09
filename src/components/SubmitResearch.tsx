import { useEffect, useState } from 'react';
import { supabase, hasCompleteResearchProfile } from '../services/supabase';

export function SubmitResearch() {
  const [status, setStatus] = useState<'loading' | 'ready' | 'blocked'>('loading');
  useEffect(() => {
    let active = true;
    async function checkProfile() {
      if (!supabase) { if (active) setStatus('blocked'); return; }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !(await hasCompleteResearchProfile(user.id))) { if (active) setStatus('blocked'); return; }
      if (active) setStatus('ready');
    }
    void checkProfile();
    return () => { active = false; };
  }, []);
  if (status === 'loading') return <main className="page"><p>جارٍ التحقق من الحساب...</p></main>;
  if (status === 'blocked') return <main className="page"><h1>إرسال بحث</h1><p className="notice">يلزم تسجيل الدخول وإكمال حقلي الدولة والمؤسسة الأكاديمية من الملف الشخصي قبل إرسال بحث.</p></main>;
  return <main className="page"><h1>إرسال بحث</h1><form className="paper-form"><label>عنوان البحث<input required /></label><label>رابط DOI<input type="url" /></label><label>ملخص البحث<textarea required /></label><button type="submit">إرسال للمراجعة</button></form></main>;
}
