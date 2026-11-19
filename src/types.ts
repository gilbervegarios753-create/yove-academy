export * from './types/roles';
export * from './types/database';

export type ViewMode =
  | 'inicio'
  | 'cursos'
  | 'rutas'
  | 'marcas'
  | 'garage'
  | 'dtc'
  | 'ai'
  | 'lab'
  | 'cases'
  | 'evaluaciones'
  | 'comunidad'
  | 'certificados'
  | 'planes'
  | 'mi-aprendizaje'
  | 'mis-compras'
  | 'instructores'
  | 'admin'
  | 'content-studio'
  | 'ventas-admin'
  | 'institucion'
  | 'curriculum'
  | 'shield'
  | 'arquitectura-cloud';

export type CourseCategory =
  | 'mechanical'
  | 'mechatronics'
  | 'electrical'
  | 'electronics'
  | 'diagnostic'
  | 'obd2'
  | 'sensors'
  | 'actuators'
  | 'ecu'
  | 'canbus'
  | 'linbus'
  | 'oscilloscope'
  | 'scanner'
  | 'programming'
  | 'transmissions'
  | 'cvt'
  | 'dct'
  | 'gasoline'
  | 'diesel'
  | 'abs'
  | 'esp'
  | 'airbag'
  | 'hvac'
  | 'hybrid'
  | 'ev'
  | 'hv_batteries'
  | 'bms'
  | 'inverters'
  | 'adas'
  | 'diagrams'
  | 'multimeter';

export interface CategoryInfo {
  id: CourseCategory;
  name: string;
  slug: string;
  description: string;
  icon: string;
  coursesCount: number;
}

export type QuestionType =
  | 'multiple-choice'
  | 'true-false'
  | 'matching'
  | 'waveform-interpretation'
  | 'case';

export interface MatchingPair {
  id: string;
  left: string;
  right: string;
}

export interface QuizQuestion {
  id: string;
  type?: QuestionType;
  question: string;
  options: string[];
  correctAnswer: number; // 0-based index or index for true/false
  explanation: string;
  imageUrl?: string;
  matchingPairs?: MatchingPair[];
  caseScenario?: {
    vehicle: string;
    symptom: string;
    dtc: string;
    background: string;
  };
}

export interface Quiz {
  id: string;
  title: string;
  category?: string;
  description?: string;
  questions: QuizQuestion[];
  passingScore: number;
  xpReward?: number;
}

export interface ExamAttempt {
  id: string;
  examId: string;
  examTitle: string;
  score: number;
  passed: boolean;
  completedAt: string;
  timeSpentMinutes: number;
  totalQuestions: number;
  correctAnswers: number;
}

export interface Exam {
  id: string;
  title: string;
  category?: string;
  description: string;
  timeLimitMinutes: number;
  passingScore: number; // percentage e.g. 80
  attemptsAllowed: number;
  questions: QuizQuestion[];
  courseId?: string;
  xpReward?: number;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  category: 'daily' | 'weekly' | 'special';
  completed: boolean;
  currentProgress: number;
  totalRequired: number;
  icon?: string;
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  studentName: string;
  level: 'Aprendiz' | 'Técnico' | 'Especialista' | 'Diagnosta' | 'Experto YOVE';
  xp: number;
  badgesCount: number;
  avatarUrl: string;
  country: string;
  countryFlag: string;
}

export interface PracticalActivity {
  id: string;
  title: string;
  instructions: string;
  requiredTools: string[];
  expectedOutput: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'interactive' | 'pdf' | 'quiz' | 'lab';
  contentUrl?: string;
  textContent?: string;
  imageUrl?: string;
  pdfUrl?: string;
  resources?: { name: string; url: string }[];
  activity?: PracticalActivity;
  quiz?: Quiz;
  completed?: boolean;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  quiz?: Quiz;
}

export interface Course {
  id: string;
  title: string;
  icon: string; // Emoji or Lucide icon key
  category: CourseCategory;
  categoryLabel: string;
  description: string;
  longDescription: string;
  objectives?: string[];
  price: number;
  duration: string;
  level: 'Inicial' | 'Intermedio' | 'Avanzado' | 'Experto' | 'Todos los Niveles';
  features: string[];
  modules: CourseModule[];
  exam?: Exam;
  popular?: boolean;
  instructor?: string;
  instructorId?: string;
  totalLessons?: number;
  rating?: number;
  reviewsCount?: number;
  badge?: string;
  isDemoExample?: boolean; // Indicates verified vs demo content
  status?: 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED';
  requirements?: string[];
  learningOutcomes?: string[];
  systemId?: string;
  relatedDtc?: string;
  relatedVehicle?: string;
  relatedCases?: string[];
  relatedLabs?: string[];
  recommendedAiMode?: string;
}

// Vehicle Hierarchy & Brands
import { DTCCategory, TestType, DTCModel } from './types/database';

export type { DTCCategory, TestType, DTCModel };

export interface DTCInfo extends Partial<DTCModel> {
  code: string; // e.g. "P0171"
  description: string;
  system: string;
  severity: 'Baja' | 'Media' | 'Alta' | 'Crítica';
  possibleCauses: string[];
  recommendedTests: string[];
  relatedCourses: string[]; // Course IDs
  relatedLabs: string[]; // Lab IDs
}

export interface ComponentInfo {
  id: string;
  name: string;
  type: 'sensor' | 'actuator' | 'ecu' | 'mechanical' | 'wiring';
  description: string;
  location: string;
  typicalSignals: string;
  referenceValues?: string;
  pinoutSummary?: string;
  dtcs: string[]; // DTC codes
}

export type SystemCategoryKey =
  | 'motor'
  | 'inyección'
  | 'ecu'
  | 'abs'
  | 'airbag'
  | 'transmisión'
  | 'dirección'
  | 'suspensión'
  | 'frenos'
  | 'climatización'
  | 'canbus'
  | 'linbus'
  | 'electrico'
  | 'hibrido'
  | 'ev';

export interface VehicleSystem {
  id: string;
  name: string; // e.g., "Inyección Electrónica 1NZ-FE"
  category: SystemCategoryKey | string;
  description?: string;
  components: ComponentInfo[];
}

export interface TransmissionInfo {
  id: string;
  name: string; // e.g., "Manual 5 Vel.", "CVT Multidrive", "DSG 7 Vel."
  type: 'Manual' | 'Automática' | 'CVT' | 'Dual-Clutch (DSG)' | 'Reductor Directo EV';
  description?: string;
  gears?: string;
  fluidType?: string;
  controlModule?: string;
  solenoids?: string;
}

export interface EngineInfo {
  code: string; // e.g., "1NZ-FE"
  displacement: string; // "1.5L VVT-i"
  fuelType: 'Gasolina' | 'Diésel' | 'Híbrido' | 'Eléctrico';
  power: string; // "106 HP"
  torque?: string; // e.g. "140 Nm @ 4200 RPM"
  compressionRatio?: string; // e.g. "10.5:1"
  timingType?: string; // e.g. "Cadena de distribución con VVT-i"
  injectionType?: string; // e.g. "Inyección Multipunto Secuencial SFI"
  ecuModel?: string; // e.g. "Denso 32-bit MCU"
  obdProtocol?: string; // e.g. "CAN Bus (ISO 15765-4 500kbps)"
  emissionsStandard?: string; // e.g. "Euro 5 / EPA Tier 2"
  transmissions?: TransmissionInfo[];
  systems: VehicleSystem[];
}

export interface VehicleGeneration {
  id: string;
  name: string; // e.g. "Generación III (XP130)"
  code?: string;
  years: number[];
  engines: EngineInfo[];
}

export interface VehicleModel {
  id: string;
  name: string; // e.g., "Yaris", "Golf", "Hilux"
  brandId: string; // e.g., "toyota"
  years: number[];
  generations?: VehicleGeneration[];
  engines: EngineInfo[];
  image?: string;
  bodyType?: string; // e.g. "Hatchback 5 Puertas / Sedán"
  platform?: string; // e.g. "Toyota B Platform"
  voltageArchitecture?: string; // e.g. "12V Convencional + HV 201.6V"
  obdLocation?: string; // e.g. "Bajo el tablero, lado del conductor"
}

export interface Brand {
  id: string;
  name: string; // e.g., "Toyota"
  logo: string; // Emoji, SVG icon or image URL
  country: string; // e.g., "Japón"
  popularModels: string[];
  disclaimer: string;
  commonDtcs?: DTCInfo[];
  isCustomBrand?: boolean;
}

// Garage Filter
export interface GarageSelection {
  brandId: string;
  modelId: string;
  year: number | null;
  engineCode: string;
  systemCategory: string;
}

// Diagnostic Cases (YOVE Cases)
export interface CaseHint {
  id: string;
  title: string;
  content: string;
  xpPenalty: number;
}

export interface DiagnosticStep {
  id: string;
  stepNumber: number;
  title: string;
  instruction: string;
  toolRequired: 'multimeter' | 'oscilloscope' | 'scanner' | 'visual' | 'pressure_gauge';
  options: {
    text: string;
    isCorrect: boolean;
    feedback: string;
    nextStepId?: string;
  }[];
}

export interface DiagnosticCase {
  id: string;
  title: string;
  vehicle: string;
  brandId?: string;
  engine?: string;
  system?: string;
  symptom: string;
  dtcCode: string;
  difficulty: 'Fácil' | 'Intermedio' | 'Avanzado' | 'Experto';
  category: string;
  initialLiveData: { parameter: string; value: string; unit: string; normalRange: string }[];
  physicalMeasurements?: { testName: string; toolUsed: string; resultValue: string; status: 'Normal' | 'Anómalo' | 'Crítico' }[];
  hints?: CaseHint[];
  steps: DiagnosticStep[];
  finalExplanation: string;
  xpReward: number;
  rewardXp?: number;
  relatedCourseId?: string;
  relatedLabId?: string;
}

// Labs (YOVE Lab)
export interface LabQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface LabSimulation {
  id: string;
  title: string;
  type: 'oscilloscope' | 'multimeter' | 'canbus' | 'ecu_bench' | 'sensor_sim' | 'actuator_sim' | 'relay_circuit' | 'obd2_scanner';
  category?: string;
  componentName?: string; // e.g. "CKP", "CMP", "TPS", "MAP", "MAF", "ECT", "O2", "Relés", "CAN Bus", "OBD-II", "ECU"
  description: string;
  objective: string;
  theory: string;
  instructions: string[];
  activityChallenge?: string;
  expectedResult?: string;
  quiz?: LabQuizQuestion[];
  xpReward?: number;
  referenceNote?: string;
}

export interface LabAttempt {
  id: string;
  userId?: string;
  labType: string;
  scenarioId: string;
  stepsCount: number;
  answers: Record<string, number>;
  score: number;
  errorsCount: number;
  timeSeconds: number;
  explanation: string;
  xpEarned: number;
  completedAt: string;
}

// Learning Paths
export interface LearningPathCourse {
  id?: string;
  courseId: string;
  order: number;
  levelName: string;
  required: boolean;
  caseId?: string;
  labId?: string;
}

export interface LearningPathRequirement {
  id?: string;
  prerequisitePathId?: string;
  prerequisitePathTitle?: string;
  requiredLevel?: string;
  minXp?: number;
  description: string;
}

export interface LearningPath {
  id: string;
  slug?: string;
  title: string;
  badge: string;
  description: string;
  estimatedHours: number;
  targetRole: string;
  level: string;
  certificateTitle?: string;
  courses: LearningPathCourse[];
  requirements?: LearningPathRequirement[];
}

export interface UserLearningPathProgress {
  learningPathId: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  progressPercent: number;
  completedCoursesCount: number;
  totalCoursesCount: number;
  currentCourseId?: string;
  currentCourseTitle?: string;
  nextCourseId?: string;
  nextCourseTitle?: string;
  isCertificateEligible: boolean;
  certificateId?: string;
  requirementsMet: boolean;
  unmetRequirements: string[];
}

// Gamification & Student Profile
export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlockedAt?: string;
}

export interface StudentProfile {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  xp: number;
  level: 'Aprendiz' | 'Técnico' | 'Especialista' | 'Diagnosta' | 'Experto YOVE';
  streakDays: number;
  enrolledCourses: string[]; // Course IDs
  completedCourses: string[]; // Course IDs
  completedLabs: string[]; // Lab IDs
  solvedCases: string[]; // Case IDs
  badges: Badge[];
  studyHours: number;
  examAttempts?: ExamAttempt[];
  missions?: Mission[];
  certificates?: Certificate[];
}

// Certificate
export interface Certificate {
  code: string; // e.g. "YOVE-2026-8849"
  studentName: string;
  courseTitle: string;
  issueDate: string;
  hours: number;
  verificationUrl: string;
  qrCodeUrl?: string;
}

// Roles & Subscriptions
export type UserRole = 'student' | 'instructor' | 'admin';
export type SubscriptionTier = 'free' | 'premium' | 'pro' | 'institution';

export interface SubscriptionPlan {
  tier: SubscriptionTier;
  title: string;
  priceMonthly: number;
  priceAnnual: number;
  description: string;
  badge?: string;
  popular?: boolean;
  features: string[];
  limitations?: string[];
  ctaText: string;
}

export interface UserAccount {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  subscriptionTier: SubscriptionTier;
  status: 'active' | 'suspended' | 'pending';
  joinedDate: string;
  avatarUrl?: string;
  country?: string;
  coursesEnrolledCount?: number;
  xp?: number;
}

// Community
export interface PostComment {
  id: string;
  authorName: string;
  authorRole: string;
  avatarInitials: string;
  date: string;
  content: string;
  likes?: number;
  isAcceptedSolution?: boolean;
  authorAvatarUrl?: string;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorRole: string;
  avatarInitials: string;
  authorAvatarUrl?: string;
  authorCountry?: string;
  title: string;
  content: string;
  tags: string[];
  category: string;
  likes: number;
  date: string;
  comments: PostComment[];
  reported?: boolean;
  reportReason?: string;
  pinned?: boolean;
  isSolved?: boolean;
}

export interface ReportItem {
  id: string;
  postId: string;
  postTitle: string;
  reporterName: string;
  reason: string;
  date: string;
  status: 'pending' | 'approved' | 'dismissed';
}

export interface PlatformAnalytics {
  activeUsersToday: number;
  activeUsersMonthly: number;
  totalCoursesViewed: number;
  averageCompletionRate: number; // percentage
  totalStudyHours: number;
  averageCourseRating: number;
  totalCasesSolved: number;
  totalLabSimulationsRun: number;
  totalAIQueriesHandled: number;
  topSearchTerms: { term: string; count: number }[];
  popularContent: { title: string; views: number; category: string }[];
  monthlyRevenueEstUSD: number;
  subscriptionsBreakdown: { tier: SubscriptionTier; count: number }[];
}

// AI Message
export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  structuredDiagnostic?: {
    symptom: string;
    dtc: string;
    possibleCauses: string[];
    recommendedTests: string[];
    nextStep: string;
  };
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatarInitials: string;
  rating: number;
  comment: string;
  courseTaken: string;
}

export interface Specialty {
  id: string;
  title: string;
  iconName: string;
  description: string;
  details: string[];
}

export interface StatItem {
  id: string;
  number: number;
  suffix: string;
  title: string;
  description: string;
}

export interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  courseInterest: string;
  message: string;
}
