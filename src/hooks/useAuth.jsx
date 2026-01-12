import { useState, useEffect, useCallback } from 'react';

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      const savedUser = localStorage.getItem('bookyardUser');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        const tokenExpiry = localStorage.getItem('bookyardTokenExpiry');
        if (tokenExpiry && new Date(tokenExpiry) > new Date()) {
          setUser(userData);
        } else {
          localStorage.removeItem('bookyardUser');
          localStorage.removeItem('bookyardTokenExpiry');
        }
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      setError('Failed to restore session');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://n8n.example.com/webhook/parent-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (email && password) {
        const mockUser = {
          id: Date.now().toString(),
          email,
          name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          role: 'parent',
          children: [{ id: '1', name: 'Alex Johnson', grade: 'Grade 5', class: '5A', studentId: 'BY2024001' }],
          school: 'Bookyard Academy',
          phone: '+254 700 123 456',
          avatar: null,
        };
        localStorage.setItem('bookyardUser', JSON.stringify(mockUser));
        localStorage.setItem('bookyardTokenExpiry', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString());
        setUser(mockUser);
        return { success: true, user: mockUser };
      }
      throw new Error('Invalid credentials');
    } catch (err) {
      setError(err.message || 'Login failed');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('bookyardUser');
    localStorage.removeItem('bookyardTokenExpiry');
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (updates) => {
    if (!user) return { success: false, error: 'Not authenticated' };
    try {
      setLoading(true);
      const updatedUser = { ...user, ...updates };
      localStorage.setItem('bookyardUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [user]);

  const isAuthenticated = !!user;

  return { user, loading, error, isAuthenticated, login, logout, updateProfile, checkAuth };
}

export function requireAuth(Component) {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, loading } = useAuth();
    if (loading) {
      return null;
    }
    if (!isAuthenticated) {
      return null;
    }
    return <Component {...props} />;
  };
}
