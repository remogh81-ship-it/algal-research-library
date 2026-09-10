import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';
import { I18nProvider } from './i18n';
import { AuthProvider } from './auth';

createRoot(document.getElementById('root')!).render(<StrictMode><AuthProvider><I18nProvider><App /></I18nProvider></AuthProvider></StrictMode>);
