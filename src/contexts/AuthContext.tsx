import { createContext, useContext, useState, type ReactNode } from 'react';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  state: string;
  /** Unix ms timestamp when the account was created (trial start) */
  registeredAt: number;
  /** Unix ms timestamp when the current paid subscription expires, if any */
  subscriptionExpiry?: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: Omit<User, 'id' | 'registeredAt' | 'subscriptionExpiry'> & { password: string }) => Promise<boolean>;
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

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate auth: check localStorage for registered users
    const users: (User & { password: string })[] = JSON.parse(
      localStorage.getItem('registeredUsers') || '[]'
    );
    const found = users.find(u => u.email === email && u.password === password);
    if (found) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _pw, ...userData } = found;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    }
    // Default demo account — always has a fresh registeredAt so trial is always active
    if (email === 'farmer@demo.com' && password === 'demo123') {
      const demoUser: User = {
        id: 'demo-1',
        fullName: 'Demo Farmer',
        email: 'farmer@demo.com',
        phoneNumber: '9876543210',
        state: 'Maharashtra',
        registeredAt: Date.now(),
      };
      setUser(demoUser);
      localStorage.setItem('user', JSON.stringify(demoUser));
      return true;
    }
    return false;
  };

  const register = async (
    data: Omit<User, 'id' | 'registeredAt' | 'subscriptionExpiry'> & { password: string }
  ): Promise<boolean> => {
    const users: (User & { password: string })[] = JSON.parse(
      localStorage.getItem('registeredUsers') || '[]'
    );
    if (users.find(u => u.email === data.email)) return false;
    const newUser: User & { password: string } = {
      ...data,
      id: Date.now().toString(),
      registeredAt: Date.now(),
    };
    users.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(users));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _pw, ...userData } = newUser;
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
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
    // Persist into the registered-users list too
    const users: (User & { password: string })[] = JSON.parse(
      localStorage.getItem('registeredUsers') || '[]'
    );
    const idx = users.findIndex(u => u.id === user.id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], subscriptionExpiry: expiry };
      localStorage.setItem('registeredUsers', JSON.stringify(users));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, subscribe }}>
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
