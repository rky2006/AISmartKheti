import { createContext, useContext, useState, type ReactNode } from 'react';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  state: string;
  /** Profile picture URL (from Google) */
  photoURL?: string;
  /** Unix ms timestamp when the account was created (trial start) */
  registeredAt: number;
  /** Unix ms timestamp when the current paid subscription expires, if any */
  subscriptionExpiry?: number;
}

/** Simulated Google account profiles for demo purposes */
const GOOGLE_DEMO_ACCOUNTS: Omit<User, 'id' | 'registeredAt'>[] = [
  { fullName: 'Rajesh Kumar', email: 'rajesh.kumar@gmail.com', phoneNumber: '9876543210', state: 'Maharashtra', photoURL: 'https://ui-avatars.com/api/?name=Rajesh+Kumar&background=4285f4&color=fff' },
  { fullName: 'Priya Sharma', email: 'priya.sharma@gmail.com', phoneNumber: '9988776655', state: 'Punjab', photoURL: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=34a853&color=fff' },
  { fullName: 'Amit Patel', email: 'amit.patel@gmail.com', phoneNumber: '9871234567', state: 'Gujarat', photoURL: 'https://ui-avatars.com/api/?name=Amit+Patel&background=ea4335&color=fff' },
];

interface AuthContextType {
  user: User | null;
  /** Simulates Google OAuth sign-in; auto-creates account if first sign-in */
  googleSignIn: (accountIndex?: number) => Promise<boolean>;
  logout: () => void;
  /** Activates a 1-year paid subscription for the current user (simulated payment). */
  subscribe: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  /**
   * Simulates Google OAuth sign-in.
   * In a real app this would use Firebase Auth or Google Identity Services.
   * @param accountIndex - which demo Google account to sign in as (0-2)
   */
  const googleSignIn = async (accountIndex = 0): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 800)); // simulate network call

    const profile = GOOGLE_DEMO_ACCOUNTS[accountIndex % GOOGLE_DEMO_ACCOUNTS.length];

    // Check if user already registered (returning user)
    const users: User[] = JSON.parse(localStorage.getItem('googleUsers') || '[]');
    const existing = users.find(u => u.email === profile.email);

    if (existing) {
      setUser(existing);
      localStorage.setItem('user', JSON.stringify(existing));
      return true;
    }

    // New user — create account
    const newUser: User = {
      ...profile,
      id: `google-${Date.now()}`,
      registeredAt: Date.now(),
    };
    users.push(newUser);
    localStorage.setItem('googleUsers', JSON.stringify(users));
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const subscribe = () => {
    if (!user) return;
    const expiry = Date.now() + 365 * 24 * 60 * 60 * 1000; // 1 year
    const updated: User = { ...user, subscriptionExpiry: expiry };
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
    // Persist into the google-users list too
    const users: User[] = JSON.parse(localStorage.getItem('googleUsers') || '[]');
    const idx = users.findIndex(u => u.id === user.id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], subscriptionExpiry: expiry };
      localStorage.setItem('googleUsers', JSON.stringify(users));
    }
  };

  return (
    <AuthContext.Provider value={{ user, googleSignIn, logout, subscribe }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
