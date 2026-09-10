import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export type AuthUser = { id: string; name: string; email: string };
type StoredUser = AuthUser & { password: string };
type AuthContextValue = { user: AuthUser | null; login: (email: string, password: string) => string | null; register: (name: string, email: string, password: string) => string | null; logout: () => void };
const AuthContext = createContext<AuthContextValue | null>(null);
const USERS_KEY = 'algae-library-users';
const SESSION_KEY = 'algae-library-session';

function readUsers(): StoredUser[] {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) ?? '[]') as StoredUser[]; } catch { return []; }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY) ?? 'null') as AuthUser | null; } catch { return null; }
  });
  const persist = (next: AuthUser | null) => {
    setUser(next);
    if (next) localStorage.setItem(SESSION_KEY, JSON.stringify(next));
    else localStorage.removeItem(SESSION_KEY);
  };
  const value = useMemo<AuthContextValue>(() => ({
    user,
    login: (email, password) => {
      const match = readUsers().find((candidate) => candidate.email === email.trim().toLowerCase() && candidate.password === password);
      if (!match) return 'Invalid email or password';
      persist({ id: match.id, name: match.name, email: match.email });
      return null;
    },
    register: (name, email, password) => {
      const normalized = email.trim().toLowerCase();
      const users = readUsers();
      if (users.some((candidate) => candidate.email === normalized)) return 'An account already exists for this email';
      const next: StoredUser = { id: crypto.randomUUID(), name: name.trim(), email: normalized, password };
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
