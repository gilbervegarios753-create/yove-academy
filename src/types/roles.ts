export type UserRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'INSTITUTION_ADMIN'
  | 'INSTRUCTOR'
  | 'STUDENT'
  | 'MODERATOR';

export type Permission =
  // User Management
  | 'users:read'
  | 'users:create'
  | 'users:update'
  | 'users:delete'
  | 'users:manage_roles'

  // Course Management
  | 'courses:read'
  | 'courses:create'
  | 'courses:update'
  | 'courses:delete'
  | 'courses:publish'

  // Vehicles & Garage Database
  | 'vehicles:read'
  | 'vehicles:manage'

  // Community & Moderation
  | 'community:read'
  | 'community:post'
  | 'community:moderate'
  | 'community:delete'

  // Analytics & Platform
  | 'analytics:view'
  | 'system:settings'

  // Student Actions
  | 'student:enroll'
  | 'student:view_content'
  | 'student:take_exam'
  | 'student:view_certificates'

  // Financials & Subscriptions
  | 'payments:manage'
  | 'subscriptions:view';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  SUPER_ADMIN: [
    'users:read',
    'users:create',
    'users:update',
    'users:delete',
    'users:manage_roles',
    'courses:read',
    'courses:create',
    'courses:update',
    'courses:delete',
    'courses:publish',
    'vehicles:read',
    'vehicles:manage',
    'community:read',
    'community:post',
    'community:moderate',
    'community:delete',
    'analytics:view',
    'system:settings',
    'student:enroll',
    'student:view_content',
    'student:take_exam',
    'student:view_certificates',
    'payments:manage',
    'subscriptions:view'
  ],
  ADMIN: [
    'users:read',
    'users:create',
    'users:update',
    'courses:read',
    'courses:create',
    'courses:update',
    'courses:publish',
    'vehicles:read',
    'vehicles:manage',
    'community:read',
    'community:post',
    'community:moderate',
    'analytics:view',
    'student:enroll',
    'student:view_content',
    'student:take_exam',
    'student:view_certificates',
    'payments:manage',
    'subscriptions:view'
  ],
  INSTITUTION_ADMIN: [
    'users:read',
    'users:create',
    'users:update',
    'courses:read',
    'vehicles:read',
    'community:read',
    'community:post',
    'analytics:view',
    'student:enroll',
    'student:view_content',
    'student:take_exam',
    'student:view_certificates',
    'subscriptions:view'
  ],
  INSTRUCTOR: [
    'courses:read',
    'courses:create',
    'courses:update',
    'vehicles:read',
    'community:read',
    'community:post',
    'analytics:view',
    'student:view_content',
    'student:view_certificates'
  ],
  STUDENT: [
    'courses:read',
    'vehicles:read',
    'community:read',
    'community:post',
    'student:enroll',
    'student:view_content',
    'student:take_exam',
    'student:view_certificates',
    'subscriptions:view'
  ],
  MODERATOR: [
    'courses:read',
    'vehicles:read',
    'community:read',
    'community:post',
    'community:moderate',
    'community:delete',
    'student:view_content'
  ]
};

export interface RoleInfo {
  role: UserRole;
  label: string;
  description: string;
  color: string;
  badgeBg: string;
}

export const ROLE_DETAILS: Record<UserRole, RoleInfo> = {
  SUPER_ADMIN: {
    role: 'SUPER_ADMIN',
    label: 'Super Admin',
    description: 'Control total de infraestructura, configuraciones de servidor y permisos globales.',
    color: '#ef4444',
    badgeBg: 'bg-red-950/80 border-red-500/50 text-red-300'
  },
  ADMIN: {
    role: 'ADMIN',
    label: 'Administrador',
    description: 'Gestión académica, catálogo de cursos, finanzas e inscripciones.',
    color: '#f97316',
    badgeBg: 'bg-orange-950/80 border-orange-500/50 text-orange-300'
  },
  INSTITUTION_ADMIN: {
    role: 'INSTITUTION_ADMIN',
    label: 'Admin Institucional',
    description: 'Gestión de alumnos, docentes, licencias, grupos y reportes de la institución.',
    color: '#06b6d4',
    badgeBg: 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300'
  },
  INSTRUCTOR: {
    role: 'INSTRUCTOR',
    label: 'Instructor Docente',
    description: 'Creación de módulos, edición de lecciones, evaluación de exámenes y laboratorio.',
    color: '#3b82f6',
    badgeBg: 'bg-blue-950/80 border-blue-500/50 text-blue-300'
  },
  STUDENT: {
    role: 'STUDENT',
    label: 'Estudiante Diagnosta',
    description: 'Acceso a cursos inscritos, simuladores de taller, casos y certificación.',
    color: '#10b981',
    badgeBg: 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
  },
  MODERATOR: {
    role: 'MODERATOR',
    label: 'Moderador de Foro',
    description: 'Control de calidad en la comunidad, revisión de consultas y comentarios.',
    color: '#a855f7',
    badgeBg: 'bg-purple-950/80 border-purple-500/50 text-purple-300'
  }
};
