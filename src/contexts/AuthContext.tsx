import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type Role = 'collector' | 'school' | 'teacher';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  schoolId?: string; // For school and teacher roles
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loginWithPassword: (email: string, password: string) => Promise<boolean>;
  verifyOtp: (email: string, otp: string) => Promise<boolean>;
  signup: (email: string, password: string, role: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('edu_beacon_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const loginWithPassword = async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return true; 
  };

  const signup = async (email: string, password: string, roleInput: string) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const role: Role = (roleInput as Role) || 'teacher';
    
    // In a real app we would create the user in backend. 
    // Here we jump straight to login.
    const loggedInUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0], 
      email,
      role,
    };

    setUser(loggedInUser);
    localStorage.setItem('edu_beacon_user', JSON.stringify(loggedInUser));
    return true;
  };

  const verifyOtp = async (email: string, otp: string) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    if (otp !== '123456') return false;

    let role: Role = 'collector';
    let name = 'Dr. M. Pawar';
    let id = 'C1';
    
    if (email.includes('school')) {
      role = 'school';
      name = 'Admin - ZP School Taloda';
      id = 'S1045';
    } else if (email.includes('teacher')) {
      role = 'teacher';
      name = 'Priya Deshmukh';
      id = 'T1';
    } else if (email.includes('collector')) {
      role = 'collector';
      name = 'Dr. M. Pawar';
      id = 'C1';
    } else {
        role = 'collector'; // fallback
    }

    const loggedInUser: User = {
      id,
      name,
      email,
      role,
    };

    setUser(loggedInUser);
    localStorage.setItem('edu_beacon_user', JSON.stringify(loggedInUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('edu_beacon_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loginWithPassword, verifyOtp, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
