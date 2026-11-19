import { UserRole, Permission, ROLE_PERMISSIONS } from '../types/roles';
import { UserModel, ProfileModel } from '../types/database';

export interface AuthSession {
  user: UserModel;
  profile: ProfileModel;
  token: string;
}

export const DEFAULT_USERS: Record<UserRole, AuthSession> = {
  SUPER_ADMIN: {
    token: 'jwt_superadmin_demo_token',
    user: {
      id: 'usr_superadmin',
      email: 'superadmin@yoveacademy.com',
      role: 'SUPER_ADMIN',
      isActive: true,
      emailVerified: true,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z'
    },
    profile: {
      id: 'prof_superadmin',
      userId: 'usr_superadmin',
      fullName: 'Ing. Carlos Mendoza (Super Admin)',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      country: 'Perú',
      workshopName: 'Sede Central YOVE',
      xp: 15400,
      levelName: 'Experto YOVE',
      streakDays: 45,
      studyHours: 240,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z'
    }
  },
  ADMIN: {
    token: 'jwt_admin_demo_token',
    user: {
      id: 'usr_admin',
      email: 'admin@yoveacademy.com',
      role: 'ADMIN',
      isActive: true,
      emailVerified: true,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z'
    },
    profile: {
      id: 'prof_admin',
      userId: 'usr_admin',
      fullName: 'Dra. Elena Rostova (Admin Académico)',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
      country: 'México',
      workshopName: 'YOVE Campus Online',
      xp: 9800,
      levelName: 'Diagnosta',
      streakDays: 30,
      studyHours: 180,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z'
    }
  },
  INSTITUTION_ADMIN: {
    token: 'jwt_institution_admin_demo_token',
    user: {
      id: 'usr_inst_admin_1',
      email: 'admin.itay@yoveinstitution.edu',
      role: 'INSTITUTION_ADMIN',
      isActive: true,
      emailVerified: true,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z'
    },
    profile: {
      id: 'prof_inst_admin_1',
      userId: 'usr_inst_admin_1',
      fullName: 'Ing. Gabriel Torres (Director ITAY)',
      avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300',
      country: 'Perú',
      workshopName: 'Instituto Técnico Automotriz ITAY',
      xp: 14200,
      levelName: 'Director Académico',
      streakDays: 40,
      studyHours: 220,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z'
    }
  },
  INSTRUCTOR: {
    token: 'jwt_instructor_demo_token',
    user: {
      id: 'usr_instructor',
      email: 'instructor@yoveacademy.com',
      role: 'INSTRUCTOR',
      isActive: true,
      emailVerified: true,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z'
    },
    profile: {
      id: 'prof_instructor',
      userId: 'usr_instructor',
      fullName: 'Prof. Mario Rossi (Máster en Redes CAN)',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
      country: 'Chile',
      workshopName: 'Laboratorio de Diagnóstico Electrónico Rossi',
      xp: 12100,
      levelName: 'Especialista',
      streakDays: 28,
      studyHours: 210,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z'
    }
  },
  STUDENT: {
    token: 'jwt_student_demo_token',
    user: {
      id: 'usr_student',
      email: 'estudiante@yoveacademy.com',
      role: 'STUDENT',
      isActive: true,
      emailVerified: true,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z'
    },
    profile: {
      id: 'prof_student',
      userId: 'usr_student',
      fullName: 'Alex Vega (Estudiante Diagnosta)',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
      country: 'Colombia',
      workshopName: 'Taller AutoEspecializado Vega',
      xp: 2850,
      levelName: 'Técnico',
      streakDays: 12,
      studyHours: 42,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z'
    }
  },
  MODERATOR: {
    token: 'jwt_moderator_demo_token',
    user: {
      id: 'usr_moderator',
      email: 'moderador@yoveacademy.com',
      role: 'MODERATOR',
      isActive: true,
      emailVerified: true,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z'
    },
    profile: {
      id: 'prof_moderator',
      userId: 'usr_moderator',
      fullName: 'Sofía Valenzuela (Moderadora de Comunidad)',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300',
      country: 'Argentina',
      workshopName: 'YOVE Community Support',
      xp: 6400,
      levelName: 'Diagnosta',
      streakDays: 19,
      studyHours: 95,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z'
    }
  }
};

export class AuthService {
  public static hasPermission(role: UserRole, permission: Permission): boolean {
    const permissions = ROLE_PERMISSIONS[role] || [];
    return permissions.includes(permission);
  }

  public static getSessionForRole(role: UserRole): AuthSession {
    return DEFAULT_USERS[role] || DEFAULT_USERS.STUDENT;
  }

  public static async loginReal(email: string, password: string):Promise<{ token: string; user: UserModel; profile: ProfileModel }> {
    const res = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Error al iniciar sesión');
    }
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
      fullName: dbUser.full_name || email.split('@')[0],
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
    return { token: data.token, user, profile };
  }

  public static async registerReal(email: string, password: string, fullName: string, country: string):Promise<{ token: string; user: UserModel; profile: ProfileModel }> {
    const res = await fetch('/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, full_name: fullName, country })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Error al registrar usuario');
    }
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
      fullName: dbUser.full_name || fullName,
      avatarUrl: dbUser.avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
      country: dbUser.country || country,
      workshopName: dbUser.workshop_name || 'Taller Personal',
      xp: dbUser.xp || 0,
      levelName: dbUser.level_name || 'Técnico',
      streakDays: 1,
      studyHours: 1,
      createdAt: dbUser.created_at || new Date().toISOString(),
      updatedAt: dbUser.updated_at || new Date().toISOString()
    };
    return { token: data.token, user, profile };
  }

  public static async getMeReal(token: string): Promise<{ user: UserModel; profile: ProfileModel }> {
    const res = await fetch('/api/v1/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Sesión no válida');
    }
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
      fullName: dbUser.full_name || dbUser.email.split('@')[0],
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
    return { user, profile };
  }

  public static async forgotPasswordReal(email: string): Promise<{ message: string; demoResetToken?: string }> {
    const res = await fetch('/api/v1/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Error al solicitar recuperación de contraseña');
    }
    return { message: data.message, demoResetToken: data.demoResetToken };
  }

  public static async resetPasswordReal(token: string, newPassword: string): Promise<{ message: string }> {
    const res = await fetch('/api/v1/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Error al restablecer la contraseña');
    }
    return { message: data.message };
  }

  public static async changePasswordReal(token: string, currentPassword: string, newPassword: string): Promise<{ message: string }> {
    const res = await fetch('/api/v1/auth/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Error al cambiar la contraseña');
    }
    return { message: data.message };
  }

  public static async googleAuthReal(googlePayload: { credential?: string; email?: string; name?: string; picture?: string; googleId?: string }): Promise<{ token: string; user: UserModel; profile: ProfileModel }> {
    const res = await fetch('/api/v1/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(googlePayload)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Error al autenticar con Google');
    }
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
      fullName: dbUser.full_name || dbUser.email.split('@')[0],
      avatarUrl: dbUser.avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
      country: dbUser.country || 'Global',
      workshopName: dbUser.workshop_name || 'Taller Personal',
      xp: dbUser.xp || 100,
      levelName: dbUser.level_name || 'Técnico',
      streakDays: 1,
      studyHours: 1,
      createdAt: dbUser.created_at || new Date().toISOString(),
      updatedAt: dbUser.updated_at || new Date().toISOString()
    };
    return { token: data.token, user, profile };
  }

  public static async sendVerificationCodeReal(email: string): Promise<{ message: string; demoCode?: string }> {
    const res = await fetch('/api/v1/auth/send-verification-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Error al enviar código de verificación');
    }
    return { message: data.message, demoCode: data.demoCode };
  }

  public static async verifyEmailCodeReal(email: string, code: string, fullName?: string, country?: string): Promise<{ token: string; user: UserModel; profile: ProfileModel }> {
    const res = await fetch('/api/v1/auth/verify-email-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code, full_name: fullName, country })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Código de verificación incorrecto o expirado');
    }
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
      fullName: dbUser.full_name || dbUser.email.split('@')[0],
      avatarUrl: dbUser.avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
      country: dbUser.country || 'Global',
      workshopName: dbUser.workshop_name || 'Taller Personal',
      xp: dbUser.xp || 50,
      levelName: dbUser.level_name || 'Técnico',
      streakDays: 1,
      studyHours: 1,
      createdAt: dbUser.created_at || new Date().toISOString(),
      updatedAt: dbUser.updated_at || new Date().toISOString()
    };
    return { token: data.token, user, profile };
  }

  public static async logoutReal(token: string): Promise<void> {
    await fetch('/api/v1/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
  }
}

