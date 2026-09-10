import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export type AuthUser = { id: string; name: string; email: string };
type StoredUser = AuthUser & { password: string };
type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => string | null;
  register: (name: string, email: string, password: string) => string | null;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const USERS_KEY = 'algae-library-users';
const SESSION_KEY = 'algae-library-session';

function readUsers(): StoredUser[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(USERS_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed as StoredUser[] : [];
  } catch {
    return [];
  }
}

export const DEMO_CREDENTIALS = { email: 'demo@algae-library.local', password: 'demo1234' };

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
        ? { id: 'demo-user', name: 'Demo Researcher', email: DEMO_CREDENTIALS.email, password: DEMO_CREDENTIALS.password }
        : undefined;
      const match = users.find((candidate) => candidate.email === normalizedEmail && candidate.password === password) ?? demo;
      if (!match) return 'Invalid email or password.';
      persist({ id: match.id, name: match.name, email: match.email });
      return null;
    },
    register: (name, email, password) => {
      const normalizedEmail = email.trim().toLowerCase();
      if (!name.trim()) return 'Enter your name.';
      if (!normalizedEmail || !normalizedEmail.includes('@')) return 'Enter a valid email address.';
      if (password.length < 6) return 'Password must be at least 6 characters.';
      const users = readUsers();
      if (users.some((candidate) => candidate.email === normalizedEmail)) return 'An account already exists for this email.';
      const next: StoredUser = { id: crypto.randomUUID(), name: name.trim(), email: normalizedEmail, password };
      localStorage.setItem(USERS_KEY, JSON.stringify([...users, next]));
      persist({ id: next.id, name: next.name, email: next.email });
      return null;
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
