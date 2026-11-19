import { SubscriptionPlan, UserAccount, ReportItem, PlatformAnalytics } from '../types';

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    tier: 'free',
    title: 'YOVE Free / Básico',
    priceMonthly: 0,
    priceAnnual: 0,
    description: 'Ideal para estudiantes y curiosos que inician en el diagnóstico automotriz.',
    features: [
      'Acceso a 5 cursos introductorios',
      '3 consultas diarias en YOVE AI',
      'Acceso a 2 laboratorios virtuales básicos',
      'Foro de Comunidad en modo lectura'
    ],
    limitations: [
      'Sin descarga de certificados verificables',
      'Sin descargas de esquemas de diagramas de cableado',
      'Sin exámenes de certificación final'
    ],
    ctaText: 'Plan Actual Gratis'
  },
  {
    tier: 'premium',
    title: 'YOVE Premium / Técnico',
    priceMonthly: 29,
    priceAnnual: 290,
    description: 'El estándar de la industria para mecánicos y técnicos automotrices en activo.',
    badge: 'MÁS POPULAR',
    popular: true,
    features: [
      'Acceso ILIMITADO a los 50+ Cursos del catálogo',
      'Consultas ILIMITADAS a YOVE AI Diagnóstico',
      'Acceso completo a los 15 simuladores YOVE Lab',
      'Certificados de Especialización con código QR y verificación',
      'Participación activa en el Foro de la Comunidad',
      'Descuentos en talleres presenciales aliados'
    ],
    ctaText: 'Actualizar a Premium'
  },
  {
    tier: 'pro',
    title: 'YOVE Pro / Taller Master',
    priceMonthly: 59,
    priceAnnual: 590,
    description: 'Para especialistas en ECU, reprogramación, osciloscopio y dueños de taller.',
    badge: 'PRO & DIAGNOSTA',
    features: [
      'Todo lo incluido en el Plan Premium',
      'Acceso a Diagramas de Cableado en Alta Resolución y Pinouts ECU',
      'Prioridad en Consultas de Casos Diagnósticos Complejos',
      'Doble intento y acceso preferencial a Exámenes de Certificación Master',
      'Descarga de Manuales Técnicos en PDF',
      'Hasta 3 cuentas secundarias para mecánicos del taller'
    ],
    ctaText: 'Obtener Plan Pro Master'
  },
  {
    tier: 'institution',
    title: 'YOVE Institution / Escuelas',
    priceMonthly: 199,
    priceAnnual: 1990,
    description: 'Para universidades, institutos técnicos y redes de talleres con múltiples alumnos.',
    badge: 'EMPRESAS & ACADEMIAS',
    features: [
      'Licencias para hasta 25 alumnos o instructores simultáneos',
      'Panel de Control Docente y Reportes Académicos de progreso',
      'Exámenes personalizados y banco de preguntas institucional',
      'Certificados Co-Branded con el logo de tu institución',
      'Soporte dedicado y capacitación para profesores'
    ],
    ctaText: 'Solicitar Plan Institucional'
  }
];

export const INITIAL_USER_ACCOUNTS: UserAccount[] = [
  {
    id: 'user-01',
    fullName: 'Ing. Fernando Vargas',
    email: 'fernando.vargas@yove.edu',
    role: 'instructor',
    subscriptionTier: 'pro',
    status: 'active',
    joinedDate: '15 Ene 2024',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200',
    country: 'México',
    coursesEnrolledCount: 12,
    xp: 8450
  },
  {
    id: 'user-02',
    fullName: 'Técnico Carlos Ramírez',
    email: 'carlos.ramirez@mecanica.com',
    role: 'student',
    subscriptionTier: 'premium',
    status: 'active',
    joinedDate: '20 Mar 2024',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
    country: 'Colombia',
    coursesEnrolledCount: 8,
    xp: 5920
  },
  {
    id: 'user-03',
    fullName: 'Técnico Alejandro Silva',
    email: 'alejandro.silva@yove.com',
    role: 'admin',
    subscriptionTier: 'pro',
    status: 'active',
    joinedDate: '01 Ene 2024',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    country: 'Perú',
    coursesEnrolledCount: 25,
    xp: 9800
  },
  {
    id: 'user-04',
    fullName: 'Dra. Sofía Mendoza',
    email: 'sofia.mendoza@mendoza-autotech.cl',
    role: 'student',
    subscriptionTier: 'institution',
    status: 'active',
    joinedDate: '10 Feb 2025',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    country: 'Chile',
    coursesEnrolledCount: 15,
    xp: 3280
  },
  {
    id: 'user-05',
    fullName: 'Marcos Benítez',
    email: 'marcos.benitez@gmail.com',
    role: 'student',
    subscriptionTier: 'free',
    status: 'active',
    joinedDate: '02 Ago 2026',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    country: 'Argentina',
    coursesEnrolledCount: 2,
    xp: 350
  }
];

export const INITIAL_REPORTS: ReportItem[] = [
  {
    id: 'rep-01',
    postId: 'post-1',
    postTitle: '¿Cómo diagnosticar un fallo de inyector Piezoeléctrico Common Rail?',
    reporterName: 'Ing. Fernando Vargas',
    reason: 'Lenguaje inapropiado o spam en los comentarios',
    date: '10 de Agosto de 2026',
    status: 'pending'
  },
  {
    id: 'rep-02',
    postId: 'post-2',
    postTitle: 'Fuga de corriente en módulo BCM de Chevrolet Cruze 2017',
    reporterName: 'Técnico Carlos Ramírez',
    reason: 'Posible enlace publicitario no autorizado',
    date: '08 de Agosto de 2026',
    status: 'pending'
  }
];

export const INITIAL_ANALYTICS_DATA: PlatformAnalytics = {
  activeUsersToday: 1420,
  activeUsersMonthly: 12480,
  totalCoursesViewed: 48920,
  averageCompletionRate: 78.4,
  totalStudyHours: 145200,
  averageCourseRating: 4.88,
  totalCasesSolved: 3210,
  totalLabSimulationsRun: 18940,
  totalAIQueriesHandled: 84300,
  topSearchTerms: [
    { term: 'P0171 Mezcla Pobre', count: 3840 },
    { term: 'Oscilograma CKP / CMP', count: 2950 },
    { term: 'Resistencia CAN Bus 60 Ohm', count: 2410 },
    { term: 'Inyector Piezoeléctrico Denso', count: 1890 },
    { term: 'Immovilizador Toyota Smart Key', count: 1620 }
  ],
  popularContent: [
    { title: 'Diagnóstico de Sensores con Osciloscopio', views: 8940, category: 'Osciloscopio' },
    { title: 'Inyección Electrónica Avanzada & Estrategias OBD-II', views: 7620, category: 'Inyección' },
    { title: 'Redes Multiplexadas CAN Bus, LIN Bus & Ethernet', views: 6410, category: 'CAN Bus' },
    { title: 'Reparación y Banchering de ECUs / PCM / BCM', views: 5180, category: 'ECU' }
  ],
  monthlyRevenueEstUSD: 48950,
  subscriptionsBreakdown: [
    { tier: 'free', count: 8200 },
    { tier: 'premium', count: 3100 },
    { tier: 'pro', count: 980 },
    { tier: 'institution', count: 200 }
  ]
};
