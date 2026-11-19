import React, { useState, lazy, Suspense } from 'react';
import { ViewMode, Course, StudentProfile } from './types';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AprendeSection } from './components/parallax/AprendeSection';
import { AIEngineParallax } from './components/parallax/AIEngineParallax';
import { SensorParallax } from './components/parallax/SensorParallax';
import { ECUExperience } from './components/parallax/ECUExperience';
import { MecatronicaVisualSection } from './components/parallax/MecatronicaVisualSection';
import { DiagnosticStorySection } from './components/parallax/DiagnosticStorySection';
import { InteractiveAutomotiveDiagram } from './components/parallax/InteractiveAutomotiveDiagram';
import { AIEVScene } from './components/parallax/AIEVScene';
import { AIHybridScene } from './components/parallax/AIHybridScene';
import { CANBusParallax } from './components/parallax/CANBusParallax';
import { EVHybridSection } from './components/parallax/EVHybridSection';
import { TimelineSection } from './components/parallax/TimelineSection';
import { CtaSection } from './components/parallax/CtaSection';
import { CoursesSection } from './components/CoursesSection';
import { CourseModal } from './components/CourseModal';
import { SpecialtiesSection } from './components/SpecialtiesSection';
import { DiagnosticWidget } from './components/DiagnosticWidget';
import { StatsSection } from './components/StatsSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FaqSection } from './components/FaqSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { OfflinePwaBar } from './components/pwa/OfflinePwaBar';
import { MobileBottomBar } from './components/navigation/MobileBottomBar';
import { ViewLoadingSkeleton } from './components/common/ViewLoadingSkeleton';
import { RoleSwitcherBar } from './components/auth/RoleSwitcherBar';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { useAuth } from './context/AuthContext';

import { ALL_COURSES_DATA } from './data/coursesData';
import { INITIAL_STUDENT_PROFILE } from './data/gamificationData';
import { Cpu, Sparkles, X } from 'lucide-react';
import { FadeInOnScroll } from './components/FadeInOnScroll';
import { ScrollTrigger } from './lib/gsap';

// Performance Lazy Loading for Views
const StudentDashboardView = lazy(() => import('./components/lms/StudentDashboardView').then(m => ({ default: m.StudentDashboardView })));
const CoursePlayerModal = lazy(() => import('./components/lms/CoursePlayerModal').then(m => ({ default: m.CoursePlayerModal })));
const LearningPathsView = lazy(() => import('./components/lms/LearningPathsView').then(m => ({ default: m.LearningPathsView })));
const CertificatesView = lazy(() => import('./components/lms/CertificatesView').then(m => ({ default: m.CertificatesView })));
const BrandsView = lazy(() => import('./components/brands/BrandsView').then(m => ({ default: m.BrandsView })));
const GarageView = lazy(() => import('./components/garage/GarageView').then(m => ({ default: m.GarageView })));
const DtcProView = lazy(() => import('./components/dtc/DtcProView').then(m => ({ default: m.DtcProView })));
const YoveAIView = lazy(() => import('./components/ai/YoveAIView').then(m => ({ default: m.YoveAIView })));
const YoveLabView = lazy(() => import('./components/lab/YoveLabView').then(m => ({ default: m.YoveLabView })));
const YoveCasesView = lazy(() => import('./components/cases/YoveCasesView').then(m => ({ default: m.YoveCasesView })));
const YoveEvaluationsView = lazy(() => import('./components/evaluations/YoveEvaluationsView').then(m => ({ default: m.YoveEvaluationsView })));
const CommunityView = lazy(() => import('./components/community/CommunityView').then(m => ({ default: m.CommunityView })));
const InstructorsView = lazy(() => import('./components/instructors/InstructorsView').then(m => ({ default: m.InstructorsView })));
const AdminView = lazy(() => import('./components/admin/AdminView').then(m => ({ default: m.AdminView })));
const ContentStudioDashboard = lazy(() => import('./components/admin/content-studio/ContentStudioDashboard').then(m => ({ default: m.ContentStudioDashboard })));
const PricingView = lazy(() => import('./components/monetization/PricingView').then(m => ({ default: m.PricingView })));
const InstitutionView = lazy(() => import('./components/institution/InstitutionView').then(m => ({ default: m.InstitutionView })));
const CurriculumView = lazy(() => import('./components/curriculum/CurriculumView').then(m => ({ default: m.CurriculumView })));
const YoveShieldView = lazy(() => import('./components/shield/YoveShieldView').then(m => ({ default: m.YoveShieldView })));
const YoveArchitectureView = lazy(() => import('./components/scale/YoveArchitectureView').then(m => ({ default: m.YoveArchitectureView })));
const YoveMyPaymentsView = lazy(() => import('./components/payments/YoveMyPaymentsView').then(m => ({ default: m.YoveMyPaymentsView })));
const YoveSalesCenterView = lazy(() => import('./components/payments/YoveSalesCenterView').then(m => ({ default: m.YoveSalesCenterView })));

import { YoveCartProvider } from './context/YoveCartContext';
import { YoveCartDrawer } from './components/payments/YoveCartDrawer';
import { YoveCheckoutModal } from './components/payments/YoveCheckoutModal';

export default function App() {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<ViewMode>('inicio');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [enrollModalOpen, setEnrollModalOpen] = useState<boolean>(false);
  const [playingCourse, setPlayingCourse] = useState<Course | null>(null);
  const [labType, setLabType] = useState<'oscilloscope' | 'multimeter' | 'canbus'>('oscilloscope');
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);
  const [urlVerificationCode, setUrlVerificationCode] = useState<string>('');
  const [checkoutModalOpen, setCheckoutModalOpen] = useState<boolean>(false);

  React.useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/verify-certificate/')) {
      const code = path.replace('/verify-certificate/', '').trim();
      if (code) {
        setUrlVerificationCode(code);
        setCurrentView('certificados');
      }
    } else {
      const params = new URLSearchParams(window.location.search);
      const codeParam = params.get('code');
      if (codeParam) {
        setUrlVerificationCode(codeParam);
        setCurrentView('certificados');
      }
    }
  }, []);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);
    return () => clearTimeout(timer);
  }, [currentView]);

  // Student Gamification Profile State
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(INITIAL_STUDENT_PROFILE);

  const handleAskAI = (promptText: string) => {
    setAiPrompt(promptText);
    setCurrentView('ai');
  };

  const handleEarnXp = (xpAmount: number) => {
    setStudentProfile(prev => ({
      ...prev,
      xp: prev.xp + xpAmount
    }));
  };

  const handleOpenEnrollModal = () => {
    setSelectedCourse(ALL_COURSES_DATA[0]);
    setEnrollModalOpen(true);
  };

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    setEnrollModalOpen(true);
  };

  const handleOpenCoursePlayer = (course: Course) => {
    setPlayingCourse(course);
  };

  const handleOpenCourseById = (courseId: string) => {
    const found = ALL_COURSES_DATA.find(c => c.id === courseId) || ALL_COURSES_DATA[0];
    if (found) {
      setPlayingCourse(found);
    }
  };

  const handleNavigateToView = (view: ViewMode) => {
    setCurrentView(view);
    setMobileDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenLab = (type: 'oscilloscope' | 'multimeter' | 'canbus') => {
    setLabType(type);
    setCurrentView('lab');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEnrollSubmit = (courseName: string, studentName: string, email: string) => {
    console.log(`Pre-enrollment submitted for ${studentName} (${email}) - ${courseName}`);
  };

  const scrollToSection = (id: string) => {
    if (currentView !== 'inicio') {
      setCurrentView('inicio');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <YoveCartProvider>
      <div className="min-h-screen bg-[#0a0e27] text-[#1a1a2e] font-sans selection:bg-[#ff6f00] selection:text-white pb-16 lg:pb-0">
      {/* Offline Status & PWA Install Bar */}
      <OfflinePwaBar />

      {/* Role Architecture Switcher Bar */}
      <RoleSwitcherBar />

      {/* Fixed Header Bar */}
      <Navbar
        currentView={currentView}
        onNavigateView={handleNavigateToView}
        onOpenEnrollModal={handleOpenEnrollModal}
        studentXp={studentProfile.xp}
        studentLevel={studentProfile.level}
      />

      {/* Main View Router Content with Suspense */}
      <main id="main-content" role="main" tabIndex={-1} className="outline-none">
        <Suspense fallback={<ViewLoadingSkeleton />}>
          {currentView === 'inicio' && (
            <>
              <HeroSection
                onStartClick={() => scrollToSection('contacto')}
                onExploreCoursesClick={() => setCurrentView('cursos')}
              />

              <AprendeSection />

              {/* Featured Oscilloscope Interactive Widget */}
              <section className="py-16 bg-[#0a0e27] text-white relative overflow-hidden border-y border-blue-900/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                    <div className="lg:col-span-5">
                      <FadeInOnScroll direction="right" className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/60 text-[#ff9100] text-xs font-bold uppercase tracking-wider border border-blue-700/50">
                          <Cpu className="w-3.5 h-3.5" />
                          Laboratorio Virtual Interactivo
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                          Experimenta Nuestra Metodología Práctica
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                          Prueba en vivo nuestro simulador de osciloscopio digital. Ajusta las revoluciones del motor, varía la amplitud de voltaje y alterna entre sensores Inductivos, Hall, PWM y redes CAN Bus.
                        </p>
                        <button
                          onClick={() => handleNavigateToView('lab')}
                          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff6f00] to-[#ff9100] text-xs font-bold text-white shadow-lg flex items-center gap-2 hover:opacity-90 transition cursor-pointer min-h-[44px]"
                          aria-label="Abrir Laboratorio Completo YOVE Lab"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>Abrir Laboratorio Completo YOVE Lab</span>
                        </button>
                      </FadeInOnScroll>
                    </div>

                    <div className="lg:col-span-7">
                      <FadeInOnScroll direction="left" delay={150}>
                        <DiagnosticWidget />
                      </FadeInOnScroll>
                    </div>
                  </div>
                </div>
              </section>

              <AIEngineParallax />

              <SensorParallax />

              <ECUExperience />

              <MecatronicaVisualSection />

              <DiagnosticStorySection />

              <InteractiveAutomotiveDiagram />

              <AIEVScene />

              <AIHybridScene />

              <CANBusParallax />

              <EVHybridSection />

              <CoursesSection onSelectCourse={handleSelectCourse} />

              <TimelineSection />

              <SpecialtiesSection />

              <StatsSection />

              <TestimonialsSection />

              <FaqSection />

              <ContactSection />

              <CtaSection
                onExploreCourses={() => setCurrentView('cursos')}
                onStartEnrollment={handleOpenEnrollModal}
              />
            </>
          )}

          {currentView === 'cursos' && (
            <div className="pt-12">
              <CoursesSection onSelectCourse={handleSelectCourse} />
            </div>
          )}

          {currentView === 'rutas' && (
            <LearningPathsView
              onOpenCourse={handleOpenCoursePlayer}
              onNavigateToView={handleNavigateToView}
            />
          )}

          {currentView === 'marcas' && (
            <BrandsView
              onSelectVehicleInGarage={() => setCurrentView('garage')}
              onNavigateToView={handleNavigateToView}
              onAskAI={handleAskAI}
            />
          )}

          {currentView === 'garage' && (
            <GarageView
              onOpenLabWithComponent={handleOpenLab}
              onAskAI={handleAskAI}
              onNavigateToView={handleNavigateToView}
              onOpenCourse={handleOpenCoursePlayer}
            />
          )}

          {currentView === 'dtc' && (
            <DtcProView
              onAskAI={handleAskAI}
              onNavigateToView={handleNavigateToView}
              onSelectCourse={handleSelectCourse}
              onOpenLab={handleOpenLab}
              isAdmin={user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN'}
            />
          )}

          {currentView === 'ai' && (
            <YoveAIView
              initialPrompt={aiPrompt}
              onNavigateToView={handleNavigateToView}
              onOpenLabWithComponent={handleOpenLab}
              onOpenCourse={handleOpenCoursePlayer}
              onEarnXp={handleEarnXp}
            />
          )}

          {currentView === 'lab' && (
            <YoveLabView
              initialLabType={labType}
              onNavigateToView={handleNavigateToView}
              onAskAI={handleAskAI}
              onEarnXp={handleEarnXp}
              onOpenCourse={handleOpenCourseById}
            />
          )}

          {currentView === 'cases' && (
            <YoveCasesView
              onEarnXp={handleEarnXp}
              onNavigateToView={handleNavigateToView}
              onAskAI={handleAskAI}
              onOpenLabWithComponent={handleOpenLab}
              onOpenCourse={handleOpenCourseById}
            />
          )}

          {currentView === 'evaluaciones' && (
            <YoveEvaluationsView
              onEarnXp={handleEarnXp}
              onNavigateToView={handleNavigateToView}
              onCertificateUnlocked={() => {
                handleEarnXp(500);
                setCurrentView('certificados');
              }}
            />
          )}

          {currentView === 'comunidad' && (
            <CommunityView onNavigateToView={handleNavigateToView} />
          )}

          {currentView === 'planes' && (
            <PricingView onSelectTier={() => {
              handleEarnXp(100);
            }} />
          )}

          {currentView === 'certificados' && (
            <CertificatesView initialVerificationCode={urlVerificationCode} />
          )}

          {currentView === 'institucion' && (
            <InstitutionView />
          )}

          {currentView === 'curriculum' && (
            <CurriculumView />
          )}

          {currentView === 'mi-aprendizaje' && (
            <StudentDashboardView
              profile={studentProfile}
              courses={ALL_COURSES_DATA}
              onOpenCourse={handleOpenCoursePlayer}
              onNavigateToView={handleNavigateToView}
            />
          )}

          {currentView === 'instructores' && (
            <InstructorsView />
          )}

          {currentView === 'admin' && (
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
              <AdminView />
            </ProtectedRoute>
          )}

          {currentView === 'content-studio' && (
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
              <ContentStudioDashboard />
            </ProtectedRoute>
          )}

          {currentView === 'mis-compras' && (
            <YoveMyPaymentsView />
          )}

          {currentView === 'ventas-admin' && (
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
              <YoveSalesCenterView />
            </ProtectedRoute>
          )}

          {currentView === 'shield' && (
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
              <YoveShieldView />
            </ProtectedRoute>
          )}

          {currentView === 'arquitectura-cloud' && (
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
              <YoveArchitectureView />
            </ProtectedRoute>
          )}
        </Suspense>
      </main>

      <Footer />

      {/* Cart Drawer & Checkout Modal */}
      <YoveCartDrawer onOpenCheckout={() => setCheckoutModalOpen(true)} />
      <YoveCheckoutModal isOpen={checkoutModalOpen} onClose={() => setCheckoutModalOpen(false)} />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomBar
        currentView={currentView}
        onNavigateView={handleNavigateToView}
        onOpenMoreMenu={() => setMobileDrawerOpen(true)}
      />

      {/* Mobile Drawer Modal for Extra Navigation */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/80 backdrop-blur-sm lg:hidden">
          <div className="bg-slate-900 border-t border-slate-700 rounded-t-3xl p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-extrabold text-white text-base">Menú YOVE Academy 3.0</h3>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800"
                aria-label="Cerrar menú"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-bold text-slate-200">
              <button
                onClick={() => handleNavigateToView('rutas')}
                className="p-3 bg-slate-800 rounded-xl hover:bg-slate-700 text-left"
              >
                🛣️ Rutas de Aprendizaje
              </button>
              <button
                onClick={() => handleNavigateToView('marcas')}
                className="p-3 bg-slate-800 rounded-xl hover:bg-slate-700 text-left"
              >
                🚘 Diagnóstico por Marcas
              </button>
              <button
                onClick={() => handleNavigateToView('evaluaciones')}
                className="p-3 bg-slate-800 rounded-xl hover:bg-slate-700 text-left text-amber-400"
              >
                🏆 Exámenes y Evaluación
              </button>
              <button
                onClick={() => handleNavigateToView('comunidad')}
                className="p-3 bg-slate-800 rounded-xl hover:bg-slate-700 text-left text-blue-400"
              >
                💬 Comunidad Foros
              </button>
              <button
                onClick={() => handleNavigateToView('planes')}
                className="p-3 bg-slate-800 rounded-xl hover:bg-slate-700 text-left text-emerald-400"
              >
                💎 Suscripciones y Planes
              </button>
              <button
                onClick={() => handleNavigateToView('certificados')}
                className="p-3 bg-slate-800 rounded-xl hover:bg-slate-700 text-left text-purple-400"
              >
                📜 Mis Certificados
              </button>
              <button
                onClick={() => handleNavigateToView('instructores')}
                className="p-3 bg-slate-800 rounded-xl hover:bg-slate-700 text-left"
              >
                👨‍🏫 Instructores
              </button>
              <button
                onClick={() => handleNavigateToView('admin')}
                className="p-3 bg-slate-800 rounded-xl hover:bg-slate-700 text-left text-rose-400"
              >
                ⚙️ Panel Administrativo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Course Pre-Enrollment Modal */}
      {enrollModalOpen && (
        <CourseModal
          course={selectedCourse}
          onClose={() => setEnrollModalOpen(false)}
          onEnroll={handleEnrollSubmit}
          onStartCourse={handleOpenCoursePlayer}
        />
      )}

      {/* LMS Player Modal */}
      {playingCourse && (
        <Suspense fallback={null}>
          <CoursePlayerModal
            course={playingCourse}
            onClose={() => setPlayingCourse(null)}
            onCompleteCourse={() => {
              handleEarnXp(250);
              setPlayingCourse(null);
              setCurrentView('certificados');
            }}
          />
        </Suspense>
      )}
      </div>
    </YoveCartProvider>
  );
}
