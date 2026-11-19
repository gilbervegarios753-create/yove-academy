import { UserRole } from './roles';

// 1. Users Model
export interface UserModel {
  id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

// 2. Roles Model
export interface RoleModel {
  id: string;
  code: UserRole;
  name: string;
  description: string;
  permissions: string[];
}

// 3. Profiles Model
export interface ProfileModel {
  id: string;
  userId: string;
  fullName: string;
  avatarUrl?: string;
  country?: string;
  phone?: string;
  workshopName?: string;
  biography?: string;
  xp: number;
  levelName: string;
  streakDays: number;
  studyHours: number;
  createdAt: string;
  updatedAt: string;
}

// 4. Categories Model
export interface CategoryModel {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  slug: string;
}

// 5. Courses Model
export interface CourseModel {
  id: string;
  title: string;
  slug: string;
  icon: string;
  categoryId: string;
  categoryLabel: string;
  description: string;
  longDescription: string;
  price: number;
  duration: string;
  level: 'Inicial' | 'Intermedio' | 'Avanzado' | 'Todos los Niveles';
  features: string[];
  popular: boolean;
  instructorId: string;
  instructorName: string;
  status: 'draft' | 'published' | 'archived';
  totalLessons: number;
  rating: number;
  reviewsCount: number;
  badge?: string;
  createdAt: string;
  updatedAt: string;
}

// 6. Modules Model
export interface ModuleModel {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  createdAt: string;
}

// 7. Lessons Model
export interface LessonModel {
  id: string;
  moduleId: string;
  courseId: string;
  title: string;
  duration: string;
  type: 'video' | 'interactive' | 'pdf' | 'quiz' | 'lab';
  contentUrl?: string;
  textContent?: string;
  resourcesUrl?: string[];
  order: number;
  createdAt: string;
}

// 8. Enrollments Model
export interface EnrollmentModel {
  id: string;
  userId: string;
  courseId: string;
  status: 'active' | 'completed' | 'cancelled';
  enrolledAt: string;
  completedAt?: string;
  expiresAt?: string;
}

// 9. Progress Model
export interface ProgressModel {
  id: string;
  userId: string;
  courseId: string;
  lessonId: string;
  completed: boolean;
  score?: number;
  lastPositionSeconds?: number;
  updatedAt: string;
}

// 10. Quizzes Model
export interface QuizModel {
  id: string;
  lessonId: string;
  title: string;
  passingScore: number;
  totalQuestions: number;
}

// 11. Questions Model
export interface QuestionModel {
  id: string;
  quizId: string;
  questionText: string;
  explanation: string;
  order: number;
}

// 12. Answers Model
export interface AnswerModel {
  id: string;
  questionId: string;
  answerText: string;
  isCorrect: boolean;
}

// 13. Exams Model
export interface ExamModel {
  id: string;
  courseId: string;
  title: string;
  description: string;
  timeLimitMinutes: number;
  passingScore: number;
  totalQuestions: number;
  isActive: boolean;
}

// 14. Certificates Model
export interface CertificateModel {
  id: string;
  code: string; // e.g. "YOVE-2026-8849"
  userId: string;
  studentName: string;
  courseId: string;
  courseTitle: string;
  issueDate: string;
  hours: number;
  verificationUrl: string;
  qrCodeUrl?: string;
}

// 15. Brands Model
export interface BrandModel {
  id: string;
  name: string;
  logo: string;
  country: string;
  popularModels: string[];
  disclaimer: string;
}

// 16. Vehicle Models Model
export interface VehicleModelEntity {
  id: string;
  brandId: string;
  name: string;
  image?: string;
}

// 17. Vehicle Generations Model
export interface VehicleGenerationModel {
  id: string;
  vehicleModelId: string;
  generationCode: string; // e.g. "Mk7", "XP90"
  startYear: number;
  endYear: number;
}

// 18. Vehicle Years Model
export interface VehicleYearModel {
  id: string;
  vehicleModelId: string;
  year: number;
}

// 19. Engines Model
export interface EngineModelEntity {
  id: string;
  vehicleModelId: string;
  code: string; // "1NZ-FE", "1.4 TSI"
  displacement: string; // "1.5L VVT-i"
  fuelType: 'Gasolina' | 'Diésel' | 'Híbrido' | 'Eléctrico';
  power: string;
}

// 20. Transmissions Model
export interface TransmissionModel {
  id: string;
  engineId: string;
  type: 'Manual' | 'Automática CVT' | 'Doble Embrague DSG' | 'Reductora EV';
  gearsCount: number;
}

// 21. Systems Model
export interface SystemModel {
  id: string;
  engineId: string;
  name: string;
  category: 'motor' | 'transmisión' | 'frenos' | 'redes' | 'climatización' | 'batería_hv';
}

// 22. Components Model
export interface ComponentModel {
  id: string;
  systemId: string;
  name: string;
  type: 'sensor' | 'actuator' | 'ecu' | 'mechanical' | 'wiring';
  description: string;
  location: string;
  typicalSignals: string;
  referenceValues?: string;
  pinoutSummary?: string;
}

// 23. Sensors Model
export interface SensorModel extends ComponentModel {
  signalType: 'Analógica' | 'Frecuencia' | 'PWM' | 'SENT' | 'CAN';
  voltageRange: string;
}

// 24. Actuators Model
export interface ActuatorModel extends ComponentModel {
  controlMethod: 'PWM' | 'Relevador' | 'Puente H' | 'Paso a Paso';
  operatingFrequency: string;
}

// 25. DTCs Model & Diagnostic Procedures
export type DTCCategory =
  | 'GENÉRICO OBD-II'
  | 'FABRICANTE'
  | 'COMUNICACIÓN'
  | 'SENSOR'
  | 'ACTUADOR'
  | 'EMISIONES'
  | 'TRANSMISIÓN'
  | 'ABS'
  | 'AIRBAG'
  | 'ECU'
  | 'CAN'
  | 'LIN';

export type TestType =
  | 'visual'
  | 'eléctrica'
  | 'continuidad'
  | 'alimentación'
  | 'masa'
  | 'señal'
  | 'datos en vivo'
  | 'osciloscopio'
  | 'presión'
  | 'temperatura'
  | 'comunicación';

export interface DiagnosticStep {
  stepNumber: number;
  symptom: string;
  dtc: string;
  inspection: string;
  test: string;
  testType: TestType;
  result: string;
  interpretation: string;
  nextStep: string;
}

export interface DTCModel {
  id: string;
  code: string; // e.g. "P0171"
  title: string;
  description: string;
  category: DTCCategory;
  system: string;
  severity: 'Baja' | 'Media' | 'Alta' | 'Crítica';
  symptoms: string[];
  possibleCauses: string[];
  diagnosticApproach: string;
  diagnosticProcedure: DiagnosticStep[];
  recommendedTests: string[];
  relatedVehicles: string[];
  relatedCourses: string[]; // Course IDs
  relatedCases: string[]; // Case IDs
  relatedLabs: string[]; // Lab IDs
  relatedComponents?: {
    sensors?: string[];
    actuators?: string[];
    ecu?: string[];
  };
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  isVerified?: boolean;
  brandId?: string;
  updatedAt?: string;
}

// 26. Diagnostic Cases Model
export interface DiagnosticCaseModel {
  id: string;
  title: string;
  vehicle: string;
  symptom: string;
  dtcCode: string;
  difficulty: 'Fácil' | 'Intermedio' | 'Avanzado' | 'Experto';
  category: string;
  initialLiveData: { parameter: string; value: string; unit: string; normalRange: string }[];
  finalExplanation: string;
  xpReward: number;
}

// 27. Lab Simulations Model
export interface LabSimulationModel {
  id: string;
  title: string;
  type: 'oscilloscope' | 'multimeter' | 'canbus' | 'ecu_bench' | 'sensor_sim';
  description: string;
  objective: string;
  theory: string;
  instructions: string[];
}

// 28. AI Conversations Model
export interface AIConversationModel {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  messages: {
    id: string;
    sender: 'user' | 'assistant';
    text: string;
    timestamp: string;
  }[];
}

// 29. Community Posts Model
export interface CommunityPostModel {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  avatarInitials: string;
  title: string;
  content: string;
  tags: string[];
  category: string;
  likes: number;
  createdAt: string;
  commentsCount: number;
}

// 30. Subscriptions Model
export interface SubscriptionModel {
  id: string;
  userId: string;
  planName: 'Básico' | 'PRO Diagnosta' | 'Enterprise Taller';
  status: 'active' | 'past_due' | 'cancelled';
  priceMonthly: number;
  startDate: string;
  nextBillingDate: string;
}

// 31. Payments Model
export interface PaymentModel {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'pending' | 'failed' | 'refunded';
  provider: 'stripe' | 'paypal' | 'mercadopago';
  transactionId: string;
  itemType: 'course' | 'subscription';
  itemId: string;
  createdAt: string;
}

// 32. Notifications Model
export interface NotificationModel {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'Curso' | 'Progreso' | 'Certificado' | 'Examen' | 'Community' | 'Case' | 'Lab' | 'YOVE AI' | 'Suscripción' | 'Sistema' | string;
  isRead: boolean;
  linkUrl?: string;
  createdAt: string;
  metadata?: any;
}
