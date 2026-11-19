import { StudentProfile, Certificate, CommunityPost } from '../types';

export const INITIAL_STUDENT_PROFILE: StudentProfile = {
  id: 'student-7892',
  fullName: 'Técnico Alejandro Silva',
  email: 'asilva@yoveacademy.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  xp: 1450,
  level: 'Especialista',
  streakDays: 8,
  enrolledCourses: ['diagnostico-obd2', 'electronica-automotriz'],
  completedCourses: ['sistemas-electricos'],
  completedLabs: ['oscilloscope-lab', 'multimeter-lab'],
  solvedCases: ['case-p0171-yaris'],
  badges: [
    { id: 'b1', name: 'Primer Oscilograma', icon: '📈', description: 'Completó el laboratorio de osciloscopio' },
    { id: 'b2', name: 'Cazador de DTCs', icon: '🔍', description: 'Resolvió su primer caso práctico P0171' },
    { id: 'b3', name: 'Racha de 7 Días', icon: '🔥', description: 'Estudió durante 7 días consecutivos' }
  ],
  studyHours: 42
};

export const SAMPLE_CERTIFICATES: Certificate[] = [
  {
    code: 'YOVE-2026-8849',
    studentName: 'Técnico Alejandro Silva',
    courseTitle: 'Sistemas Eléctricos Automotrices',
    issueDate: '15 de Enero de 2026',
    hours: 60,
    verificationUrl: 'https://yove-academy.ai.studio/verify-certificate/YOVE-2026-8849'
  },
  {
    code: 'YOVE-2026-9102',
    studentName: 'Ing. María López',
    courseTitle: 'Vehículos Eléctricos e Híbridos',
    issueDate: '28 de Febrero de 2026',
    hours: 100,
    verificationUrl: 'https://yove-academy.ai.studio/verify-certificate/YOVE-2026-9102'
  }
];

export const COMMUNITY_POSTS_DATA: CommunityPost[] = [
  {
    id: 'post-1',
    authorName: 'Carlos R. (Técnico)',
    authorRole: 'Diagnosta Avanzado',
    avatarInitials: 'CR',
    title: '¿Cómo diagnosticar señal difusa en sensor Hall CMP de Nissan Sentra B17?',
    content: 'Tengo un Sentra 2018 que tira código P0340. En el osciloscopio la señal de 5V baja solo a 1.2V en vez de 0.2V en el nivel bajo. ¿Puede ser falta de buena masa en el sensor o tirón en la ECU?',
    tags: ['Nissan', 'P0340', 'Osciloscopio', 'CMP'],
    category: 'Diagnóstico Electrónico',
    likes: 18,
    date: 'Hace 3 horas',
    comments: [
      {
        id: 'c1',
        authorName: 'Ing. Fernando Varga',
        authorRole: 'Instructor YOVE',
        avatarInitials: 'FV',
        date: 'Hace 2 horas',
        content: 'Mide la caída de tensión en el pin de masa del sensor con el motor girando. Si mides más de 100mV de caída respecto a la masa negativa de la batería, hay resistencia en el cableado o la masa de señal en la ECU.'
      }
    ]
  },
  {
    id: 'post-2',
    authorName: 'Mateo G.',
    authorRole: 'Estudiante Certificado',
    avatarInitials: 'MG',
    title: 'Aporte: Diagrama de pines y prueba en banco para ECU Bosch ME7.5 (VW/Audi)',
    content: 'Les comparto la guía en PDF que armé aplicando lo aprendido en el curso de Electrónica Automotriz para conectar en banco la ECU ME7.5 con fuente regulada de 13.8V.',
    tags: ['Volkswagen', 'ECU', 'Bosch', 'BancoPruebas'],
    category: 'Reparación de ECUs',
    likes: 34,
    date: 'Ayer',
    comments: []
  }
];
