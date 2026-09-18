import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export type AuthUser = { 
  id: string; 
  name: string; 
  email: string;
  title?: string;
  institution?: string;
  department?: string;
  orcid?: string;
  googleScholarUrl?: string;
  researchGateUrl?: string;
  bio?: string;
  specialties?: string[];
  citationCount?: number;
};

type StoredUser = AuthUser & { password: string };

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => string | null;
  register: (name: string, email: string, password: string) => string | null;
  updateProfile: (updates: Partial<Omit<AuthUser, 'id' | 'email'>>) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const USERS_KEY = 'algae-library-users';
const SESSION_KEY = 'algae-library-session';
const DEMO_PROFILE_KEY = 'algae-library-demo-profile';

export const DEMO_CREDENTIALS = { email: 'demo@algae-library.local', password: 'demo1234' };

const DEFAULT_DEMO_PROFILE: AuthUser = {
  id: 'demo-user',
  name: 'Demo Researcher (د. باحث تجريبي)',
  email: DEMO_CREDENTIALS.email,
  title: 'Senior Phycologist & Biotechnology Specialist',
  institution: 'National Research Centre (NRC), Egypt',
  department: 'Hydrobiology Department, Algal Biotechnology Unit',
  orcid: '0000-0002-1825-0097',
  googleScholarUrl: 'https://scholar.google.com',
  researchGateUrl: 'https://www.researchgate.net',
  bio: 'Specialized in microalgae mass cultivation, photobioreactor scale-up, Arthrospira platensis (Spirulina) harvest optimization, and phycoremediation of industrial wastewater.',
  specialties: ['Arthrospira platensis', 'Chlorella vulgaris', 'Biofuels & Biodiesel', 'Phycoremediation', 'Zarrouk Medium Optimization'],
  citationCount: 48
};

function readUsers(): StoredUser[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(USERS_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed as StoredUser[] : [];
  } catch {
    return [];
  }
}

function getStoredDemoProfile(): AuthUser {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(DEMO_PROFILE_KEY) ?? 'null');
    return (parsed && typeof parsed === 'object') ? (parsed as AuthUser) : DEFAULT_DEMO_PROFILE;
  } catch {
    return DEFAULT_DEMO_PROFILE;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const parsed: unknown = JSON.parse(localStorage.getItem(SESSION_KEY) ?? 'null');
      return parsed && typeof parsed === 'object' ? parsed as AuthUser : null;
    } catch {
      return null;
    }
  });

  const persist = (next: AuthUser | null) => {
    setUser(next);
    if (next) localStorage.setItem(SESSION_KEY, JSON.stringify(next));
    else localStorage.removeItem(SESSION_KEY);
  };

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isAuthenticated: user !== null,
    login: (email, password) => {
      const normalizedEmail = email.trim().toLowerCase();
      if (!normalizedEmail || !password) return 'Enter your email and password.';
      const users = readUsers();
      
      const demo = normalizedEmail === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password
        ? { ...getStoredDemoProfile(), password: DEMO_CREDENTIALS.password }
        : undefined;
      
      const match = users.find((candidate) => candidate.email === normalizedEmail && candidate.password === password) ?? demo;
      if (!match) return 'Invalid email or password.';
      
      const sessionUser: AuthUser = {
        id: match.id,
        name: match.name,
        email: match.email,
        title: match.title,
        institution: match.institution,
        department: match.department,
        orcid: match.orcid,
        googleScholarUrl: match.googleScholarUrl,
        researchGateUrl: match.researchGateUrl,
        bio: match.bio,
        specialties: match.specialties,
        citationCount: match.citationCount
      };
      
      persist(sessionUser);
      return null;
    },
    register: (name, email, password) => {
      const normalizedEmail = email.trim().toLowerCase();
      if (!name.trim()) return 'Enter your name.';
      if (!normalizedEmail || !normalizedEmail.includes('@')) return 'Enter a valid email address.';
      if (password.length < 6) return 'Password must be at least 6 characters.';
      const users = readUsers();
      if (users.some((candidate) => candidate.email === normalizedEmail)) return 'An account already exists for this email.';
      
      const next: StoredUser = { 
        id: crypto.randomUUID(), 
        name: name.trim(), 
        email: normalizedEmail, 
        password,
        title: 'Phycology Researcher',
        institution: 'Academic / Scientific Research Institution',
        specialties: ['Microalgae', 'Applied Phycology']
      };
      
      localStorage.setItem(USERS_KEY, JSON.stringify([...users, next]));
      
      const sessionUser: AuthUser = {
        id: next.id,
        name: next.name,
        email: next.email,
        title: next.title,
        institution: next.institution,
        specialties: next.specialties
      };
      
      persist(sessionUser);
      return null;
    },
    updateProfile: (updates) => {
      if (!user) return;
      const updated: AuthUser = { ...user, ...updates };
      persist(updated);
      
      // Persist to users list
      const users = readUsers();
      const updatedUsers = users.map((u) => u.id === user.id ? { ...u, ...updates } : u);
      localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
      
      // If demo user, persist demo profile override
      if (user.id === 'demo-user') {
        localStorage.setItem(DEMO_PROFILE_KEY, JSON.stringify(updated));
      }
    },
    logout: () => persist(null),
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used within AuthProvider');
  return value;
}
