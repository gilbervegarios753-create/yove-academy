import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, Permission } from '../types/roles';
import { UserModel, ProfileModel } from '../types/database';
import { AuthService, AuthSession } from '../services/authService';

interface AuthContextType {
  role: UserRole;
  user: UserModel;
  profile: ProfileModel;
  token: string;
  isAuthenticated: boolean;
  switchRole: (newRole: UserRole) => void;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, name: string, country: string) => Promise<void>;
  loginWithGoogle: (payload: { credential?: string; email?: string; name?: string; picture?: string; googleId?: string }) => Promise<void>;
  verifyEmailCode: (email: string, code: string, fullName?: string, country?: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permission: Permission) => boolean;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  addXp: (amount: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('STUDENT');
  const [session, setSession] = useState<AuthSession>(AuthService.getSessionForRole('STUDENT'));
  const [token, setToken] = useState<string>('jwt_student_demo_token');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('yove_auth_token');
    const savedRole = localStorage.getItem('yove_selected_role') as UserRole;
    if (savedToken && !savedToken.startsWith('jwt_')) {
      // Verify real session with backend
      fetch('/api/v1/auth/me', {
        headers: { 'Authorization': `Bearer ${savedToken}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.user) {
            const dbUser = data.user;
            const user: UserModel = {
              id: dbUser.id,
              email: dbUser.email,
              role: dbUser.role as UserRole,
              isActive: Boolean(dbUser.is_active ?? 1),
              emailVerified: true,
              createdAt: dbUser.created_at || new Date().toISOString(),
              updatedAt: dbUser.updated_at || new Date().toISOString()
            };
            const profile: ProfileModel = {
              id: `prof_${dbUser.id}`,
              userId: dbUser.id,
              fullName: dbUser.full_name || 'Estudiante YOVE',
              avatarUrl: dbUser.avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
              country: dbUser.country || 'Global',
              workshopName: dbUser.workshop_name || 'Taller Personal',
              xp: dbUser.xp || 0,
              levelName: dbUser.level_name || 'Técnico',
              streakDays: dbUser.streak_days || 1,
              studyHours: dbUser.study_hours || 1,
              createdAt: dbUser.created_at || new Date().toISOString(),
              updatedAt: dbUser.updated_at || new Date().toISOString()
            };
            setSession({ user, profile, token: savedToken });
            setCurrentRole(user.role as UserRole);
            setToken(savedToken);
            setIsAuthenticated(true);
          }
        })
        .catch(() => {
          // Fallback to demo role
          if (savedRole && AuthService.getSessionForRole(savedRole)) {
            setCurrentRole(savedRole);
            setSession(AuthService.getSessionForRole(savedRole));
          }
        });
    } else if (savedRole && AuthService.getSessionForRole(savedRole)) {
      setCurrentRole(savedRole);
      setSession(AuthService.getSessionForRole(savedRole));
      setToken(AuthService.getSessionForRole(savedRole).token);
    }
  }, []);

  const switchRole = (newRole: UserRole) => {
    setCurrentRole(newRole);
    const newSession = AuthService.getSessionForRole(newRole);
    setSession(newSession);
    setToken(newSession.token);
    setIsAuthenticated(true);
    localStorage.setItem('yove_selected_role', newRole);
    localStorage.setItem('yove_auth_token', newSession.token);
  };

  const login = async (email: string, pass: string) => {
    try {
      const result = await AuthService.loginReal(email, pass);
      setSession(result);
      setCurrentRole(result.user.role as UserRole);
      setToken(result.token);
      setIsAuthenticated(true);
      localStorage.setItem('yove_auth_token', result.token);
      localStorage.setItem('yove_selected_role', result.user.role);
    } catch (e: any) {
      throw e;
    }
  };

  const register = async (email: string, pass: string, name: string, country: string) => {
    try {
      const result = await AuthService.registerReal(email, pass, name, country);
      setSession(result);
      setCurrentRole(result.user.role as UserRole);
      setToken(result.token);
      setIsAuthenticated(true);
      localStorage.setItem('yove_auth_token', result.token);
      localStorage.setItem('yove_selected_role', result.user.role);
    } catch (e: any) {
      throw e;
    }
  };

  const loginWithGoogle = async (payload: { credential?: string; email?: string; name?: string; picture?: string; googleId?: string }) => {
    try {
      const result = await AuthService.googleAuthReal(payload);
      setSession(result);
      setCurrentRole(result.user.role as UserRole);
      setToken(result.token);
      setIsAuthenticated(true);
      localStorage.setItem('yove_auth_token', result.token);
      localStorage.setItem('yove_selected_role', result.user.role);
    } catch (e: any) {
      throw e;
    }
  };

  const verifyEmailCode = async (email: string, code: string, fullName?: string, country?: string) => {
    try {
      const result = await AuthService.verifyEmailCodeReal(email, code, fullName, country);
      setSession(result);
      setCurrentRole(result.user.role as UserRole);
      setToken(result.token);
      setIsAuthenticated(true);
      localStorage.setItem('yove_auth_token', result.token);
      localStorage.setItem('yove_selected_role', result.user.role);
    } catch (e: any) {
      throw e;
    }
  };

  const logout = async () => {
    try {
      await AuthService.logoutReal(token);
    } catch {}
    localStorage.removeItem('yove_auth_token');
    localStorage.removeItem('yove_selected_role');
    const defaultSess = AuthService.getSessionForRole('STUDENT');
    setSession(defaultSess);
    setCurrentRole('STUDENT');
    setToken('');
    setIsAuthenticated(false);
  };

  const hasPermission = (permission: Permission): boolean => {
    return AuthService.hasPermission(currentRole, permission);
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (Array.isArray(roles)) {
      return roles.includes(currentRole);
    }
    return currentRole === roles;
  };

  const addXp = (amount: number) => {
    setSession(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        xp: prev.profile.xp + amount
      }
    }));
  };

  return (
    <AuthContext.Provider value={{
      role: currentRole,
      user: session.user,
      profile: session.profile,
      token,
      isAuthenticated,
      switchRole,
      login,
      register,
      loginWithGoogle,
      verifyEmailCode,
      logout,
      hasPermission,
      hasRole,
      addXp
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de AuthProvider');
  }
  return context;
};
