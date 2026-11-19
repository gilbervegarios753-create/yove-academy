import { Course, Testimonial, Specialty, StatItem } from '../types';
import { ALL_COURSES_DATA } from './coursesData';

export const COURSES_DATA: Course[] = ALL_COURSES_DATA;


export const SPECIALTIES_DATA: Specialty[] = [
  {
    id: 'teoria',
    title: 'Formación Teórica Rigurosa',
    iconName: 'BookOpen',
    description: 'Fundamentos sólidos en física, lógica eléctrica y arquitectura automotriz aplicada.',
    details: ['Explicación matemática de ondas de señales', 'Comprensión profunda de lógica de control', 'Material didáctico descargable HD']
  },
  {
    id: 'practica',
    title: 'Práctica Hands-On',
    iconName: 'Wrench',
    description: 'Simuladores e interacción con vehículos reales en nuestro taller virtual y laboratorios.',
    details: ['Simuladores interactivos de circuitos', 'Casos de estudio con fallas reales introducidas', 'Guías paso a paso de resolución']
  },
  {
    id: 'software',
    title: 'Software Especializado OEM',
    iconName: 'Laptop',
    description: 'Acceso a plataformas de diagnóstico y esquemas eléctricos de fabricantes.',
    details: ['Acceso a Mitchell, ALLData y HaynesPro', 'Uso de software de telemetría y scanner', 'Interpretación técnica rápida']
  },
  {
    id: 'certificacion',
    title: 'Certificaciones Verificables',
    iconName: 'Award',
    description: 'Certificados reconocidos internacionalmente con código QR de autenticación.',
    details: ['Avalado por ingenieros especialistas', 'Verificación digital instantánea', 'Perfil destacado en nuestra bolsa laboral']
  }
];

export const STATS_DATA: StatItem[] = [
  {
    id: 'graduados',
    number: 500,
    suffix: '+',
    title: 'Estudiantes Graduados',
    description: 'Alumnos capacitados en más de 12 países de Latinoamérica'
  },
  {
    id: 'experiencia',
    number: 15,
    suffix: '+',
    title: 'Años de Experiencia',
    description: 'Instructores en activo con amplia trayectoria en diagnóstico'
  },
  {
    id: 'empleabilidad',
    number: 95,
    suffix: '%',
    title: 'Tasa de Empleabilidad',
    description: 'Graduados que laboran o abrieron su taller propio'
  },
  {
    id: 'soporte',
    number: 24,
    suffix: '/7',
    title: 'Soporte Académico',
    description: 'Comunidad activa de técnicos y mentores asignados'
  }
];

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: '1',
    name: 'Juan Morales',
    role: 'Técnico Automotriz Independiente',
    avatarInitials: 'JM',
    rating: 5,
    comment: 'Gracias a Yove Academy pude empezar a diagnosticar fallas en ECUs que antes derivaba a otros talleres. En solo 3 meses incrementé los ingresos de mi taller en un 40%.',
    courseTaken: 'Electrónica Automotriz & OBD-II'
  },
  {
    id: '2',
    name: 'Ing. María López',
    role: 'Ingeniera de Mantenimiento de Flotas',
    avatarInitials: 'ML',
    rating: 5,
    comment: 'El curso de Vehículos Eléctricos e Híbridos fue crucial para la transición de nuestra flota. La calidad teórica y los simuladores prácticos no tienen competencia.',
    courseTaken: 'Vehículos Eléctricos e Híbridos'
  },
  {
    id: '3',
    name: 'Carlos Ramírez',
    role: 'Especialista en Diagnóstico Electrónico',
    avatarInitials: 'CR',
    rating: 5,
    comment: 'El manejo del osciloscopio y la interpretación de diagramas cambió por completo mi forma de trabajar. Ahora encuentro fallas intermitentes en minutos.',
    courseTaken: 'Certificación Máster en Mecatrónica'
  }
];

export const FAQ_DATA = [
  {
    question: '¿Necesito conocimientos previos para empezar?',
    answer: 'No obligatoriamente. Contamos con rutas desde nivel Inicial como Sistemas Eléctricos hasta programas avanzados como Vehículos Eléctricos o la Certificación Máster.'
  },
  {
    question: '¿Cómo es la modalidad de estudio?',
    answer: 'Es 100% online y flexible. Tendrás acceso a la plataforma 24/7 con clases grabadas en alta definición, simuladores interactivos, clases en vivo semanales para dudas y soporte directo de tutores.'
  },
  {
    question: '¿Los certificados tienen validez oficial?',
    answer: 'Sí. Todos nuestros certificados incluyen un código QR de verificación única, detallando las horas lectivas y las competencias alcanzadas, aceptado por empresas y talleres del rubro.'
  },
  {
    question: '¿Qué métodos de pago aceptan?',
    answer: 'Aceptamos tarjetas de crédito/débito (Visa, Mastercard, Amex), PayPal, transferencias bancarias locales y depósitos mediante agentes autorizados.'
  }
];
