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

  // In production, update this to your Render URL: e.g., https://your-app.onrender.com
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  useEffect(() => {
    const checkAuth = async () => {
        const token = localStorage.getItem('edu_beacon_token');
        if (token) {
            try {
                const response = await fetch(`${BASE_URL}/api/user/me?token=${token}`);
                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                } else {
                    localStorage.removeItem('edu_beacon_token');
                }
            } catch (err) {
                console.error("Auth check failed", err);
            }
        }
        setIsLoading(false);
    };
    checkAuth();
  }, []);

  const loginWithPassword = async (email: string, password: string) => {
    try {
        const response = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('edu_beacon_token', data.access_token);
            // After successful password, we still show OTP step in UI for demo
            return true;
        }
    } catch (err) {
        console.error("Login failed", err);
    }
    return false; 
  };

  const signup = async (email: string, password: string, roleInput: string) => {
    try {
        const response = await fetch(`${BASE_URL}/api/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, role: roleInput }),
        });
        
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('edu_beacon_token', data.access_token);
            
            // Get user info
            const userRes = await fetch(`${BASE_URL}/api/user/me?token=${data.access_token}`);
            if (userRes.ok) {
                const userData = await userRes.json();
                setUser(userData);
                return true;
            }
        }
    } catch (err) {
        console.error("Signup failed", err);
    }
    return false;
  };

  const verifyOtp = async (email: string, otp: string) => {
    // Simulated delay
    await new Promise(resolve => setTimeout(resolve, 800));
    if (otp !== '123456') return false;

    const token = localStorage.getItem('edu_beacon_token');
    if (token) {
        const response = await fetch(`${BASE_URL}/api/user/me?token=${token}`);
        if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            return true;
        }
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('edu_beacon_token');
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
