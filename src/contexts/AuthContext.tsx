import { createContext, useContext, useState, type ReactNode } from 'react';

interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  state: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: Omit<User, 'id'> & { password: string }) => Promise<boolean>;
  logout: () => void;
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
    // Default demo account
    if (email === 'farmer@demo.com' && password === 'demo123') {
      const demoUser: User = {
        id: 'demo-1',
        fullName: 'Demo Farmer',
        email: 'farmer@demo.com',
        phoneNumber: '9876543210',
        state: 'Maharashtra',
      };
      setUser(demoUser);
      localStorage.setItem('user', JSON.stringify(demoUser));
      return true;
    }
    return false;
  };

  const register = async (data: Omit<User, 'id'> & { password: string }): Promise<boolean> => {
    const users: (User & { password: string })[] = JSON.parse(
      localStorage.getItem('registeredUsers') || '[]'
    );
    if (users.find(u => u.email === data.email)) return false;
    const newUser: User & { password: string } = { ...data, id: Date.now().toString() };
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

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
