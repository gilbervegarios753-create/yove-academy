import React, { useState, useEffect } from 'react';
import { LEARNING_PATHS_DATA } from '../../data/pathsData';
import { ALL_COURSES_DATA } from '../../data/coursesData';
import { DIAGNOSTIC_CASES_DATA } from '../../data/casesData';
import { LABS_DATA } from '../../data/labsData';
import { Course, LearningPath, UserLearningPathProgress } from '../../types';
import { 
  Award, Clock, ArrowRight, CheckCircle2, ShieldCheck, Compass, Sparkles, 
  Lock, BookOpen, FileCheck, Stethoscope, Beaker, Check, AlertTriangle, Layers, UserCheck
} from 'lucide-react';
import { FadeInOnScroll } from '../FadeInOnScroll';

interface LearningPathsViewProps {
  onOpenCourse: (course: Course) => void;
  onNavigateToView: (view: any, itemData?: any) => void;
  currentUser?: any;
}

export const LearningPathsView: React.FC<LearningPathsViewProps> = ({
  onOpenCourse,
  onNavigateToView,
  currentUser
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'my_paths' | 'recommendations'>('all');
  const [paths, setPaths] = useState<LearningPath[]>(LEARNING_PATHS_DATA);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPathDetail, setSelectedPathDetail] = useState<LearningPath | null>(null);
  const [claimMessage, setClaimMessage] = useState<{ pathId: string; text: string; success: boolean } | null>(null);

  // Fetch paths from API or fallback
  useEffect(() => {
    fetchPaths();
    fetchRecommendations();
  }, [currentUser]);

  const fetchPaths = async () => {
    setLoading(true);
    try {
      const headers: Record<string, string> = {};
      if (currentUser?.id) headers['x-user-id'] = currentUser.id;

      const res = await fetch('/api/v1/learning-paths', { headers });
      const json = await res.json();
      if (json.success && json.data) {
        setPaths(json.data);
      } else {
        setPaths(LEARNING_PATHS_DATA);
      }
    } catch (err) {
      console.warn('Fallback to static learning paths data:', err);
      setPaths(LEARNING_PATHS_DATA);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const headers: Record<string, string> = {};
      if (currentUser?.id) headers['x-user-id'] = currentUser.id;

      const res = await fetch('/api/v1/learning-paths/recommendations', { headers });
      const json = await res.json();
      if (json.success && json.data) {
        setRecommendations(json.data);
      }
    } catch (err) {
      console.warn('Error fetching recommendations:', err);
    }
  };

  const handleEnroll = async (pathId: string) => {
    if (!currentUser?.id) {
      alert('Inicia sesión para registrar tu progreso en esta ruta.');
      return;
    }

    try {
      const res = await fetch(`/api/v1/learning-paths/${pathId}/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id
        },
        body: JSON.stringify({ userId: currentUser.id })
      });
      const json = await res.json();
      if (json.success) {
        fetchPaths();
        fetchRecommendations();
      }
    } catch (err) {
      console.error('Error enrolling in path:', err);
    }
  };

  const handleClaimCertificate = async (pathId: string) => {
    if (!currentUser?.id) {
      alert('Inicia sesión para obtener tu certificado.');
      return;
    }

    try {
      const res = await fetch(`/api/v1/learning-paths/${pathId}/claim-certificate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id
        },
        body: JSON.stringify({ userId: currentUser.id })
      });
      const json = await res.json();
      if (json.success) {
        setClaimMessage({
          pathId,
          text: json.message || '¡Certificado emitido con éxito!',
          success: true
        });
        fetchPaths();
      } else {
        setClaimMessage({
          pathId,
          text: json.error || 'No cumples con los requisitos para certificar esta ruta.',
          success: false
        });
      }
    } catch (err: any) {
      setClaimMessage({
        pathId,
        text: 'Error de conexión al emitir certificado.',
        success: false
      });
    }
  };

  return (
    <div className="py-12 bg-[#0a0e27] min-h-screen text-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header Title */}
        <FadeInOnScroll direction="up">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/60 text-[#ff9100] text-xs font-bold uppercase tracking-wider border border-blue-700/50">
              <Compass className="w-3.5 h-3.5" />
              YOVE Academy 4.0 — Rutas de Aprendizaje
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Rutas Profesionales de Especialización
            </h1>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              Estructura jerárquica: <span className="text-[#ff9100] font-bold">Ruta → Nivel → Curso → Módulo → Evaluación → Case → Lab → Certificado</span>.
            </p>

            {/* Navigation Filter Tabs */}
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'all'
                    ? 'bg-[#ff6f00] text-white shadow-lg shadow-[#ff6f00]/30'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                Todas las Rutas ({paths.length})
              </button>
              <button
                onClick={() => setActiveTab('recommendations')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
                  activeTab === 'recommendations'
                    ? 'bg-[#ff6f00] text-white shadow-lg shadow-[#ff6f00]/30'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                Recomendadas para Ti
              </button>
            </div>
          </div>
        </FadeInOnScroll>

        {/* RECOMMENDATIONS TAB */}
        {activeTab === 'recommendations' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-amber-900/20 p-6 rounded-2xl border border-blue-500/30">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-amber-400 shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-white">Recomendaciones basadas en tu Historial</h3>
                  <p className="text-xs text-gray-300">
                    Calculadas analizando tus cursos completados, nivel de experiencia XP y requisitos de prerrequisito.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendations.map((rec, idx) => (
                <div key={rec.id} className="bg-black/40 border border-white/10 rounded-2xl p-6 space-y-4 hover:border-[#ff9100]/60 transition">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-blue-900/80 text-blue-200 text-xs font-bold">
                      {rec.badge}
                    </span>
                    <span className="text-xs text-amber-300 font-semibold">{rec.level}</span>
                  </div>
                  <h4 className="text-lg font-bold text-white">{rec.title}</h4>
                  <p className="text-xs text-gray-300">{rec.description}</p>
                  
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs text-amber-200/90 italic">
                    "{rec.reason}"
                  </div>

                  <button
                    onClick={() => {
                      const fullPath = paths.find(p => p.id === rec.id);
                      if (fullPath) setSelectedPathDetail(fullPath);
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#ff6f00] hover:bg-[#ff8f00] text-xs font-bold text-white flex items-center justify-center gap-1.5 transition"
                  >
                    <span>Ver Detalles de la Ruta</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ALL PATHS VIEW */}
        {activeTab === 'all' && (
          <div className="space-y-10">
            {paths.map((path, idx) => {
              const progress: UserLearningPathProgress | null = (path as any).progress || null;
              const pathCourses = (path.courses || [])
                .map(pc => {
                  const courseObj = ALL_COURSES_DATA.find(c => c.id === pc.courseId);
                  const caseObj = pc.caseId ? DIAGNOSTIC_CASES_DATA.find(cs => cs.id === pc.caseId) : null;
                  const labObj = pc.labId ? LABS_DATA.find(l => l.id === pc.labId) : null;
                  return {
                    ...pc,
                    courseObj,
                    caseObj,
                    labObj
                  };
                });

              const isEnrolled = progress?.status === 'IN_PROGRESS' || progress?.status === 'COMPLETED';
              const percent = progress?.progressPercent || 0;

              return (
                <FadeInOnScroll key={path.id} direction="up" delay={idx * 50}>
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
                    
                    {/* Path Header */}
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-white/10 pb-6">
                      <div className="space-y-2 max-w-3xl">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-3 py-1 rounded-full bg-[#ff6f00] text-white text-xs font-bold shadow">
                            {path.badge}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-blue-900/60 text-blue-200 text-xs font-semibold border border-blue-700/50">
                            Nivel: {path.level}
                          </span>
                          <span className="text-xs text-gray-400 font-semibold flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {path.estimatedHours} horas estimadas
                          </span>
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-black text-white">{path.title}</h2>
                        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">{path.description}</p>
                      </div>

                      {/* Right Metric & Enrollment Card */}
                      <div className="shrink-0 bg-black/50 p-5 rounded-xl border border-white/10 space-y-3 min-w-[280px]">
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>Progreso de Ruta:</span>
                          <span className="font-bold text-amber-400">{percent}%</span>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-amber-500 to-[#ff6f00] transition-all duration-500" 
                            style={{ width: `${percent}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-gray-400">
                          <span>Cursos completados:</span>
                          <span className="text-white font-bold">{progress?.completedCoursesCount || 0} / {pathCourses.length}</span>
                        </div>

                        {/* Action Buttons */}
                        {!isEnrolled ? (
                          <button
                            onClick={() => handleEnroll(path.id)}
                            className="w-full py-2.5 rounded-lg bg-[#ff6f00] hover:bg-[#ff8f00] text-xs font-bold text-white shadow transition flex items-center justify-center gap-1.5"
                          >
                            <Compass className="w-4 h-4" />
                            <span>Iniciar esta Ruta</span>
                          </button>
                        ) : progress?.isCertificateEligible ? (
                          <button
                            onClick={() => handleClaimCertificate(path.id)}
                            className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow transition flex items-center justify-center gap-1.5 animate-pulse"
                          >
                            <Award className="w-4 h-4" />
                            <span>¡Reclamar Certificado!</span>
                          </button>
                        ) : (
                          <div className="text-center py-2 bg-emerald-950/40 rounded-lg border border-emerald-500/30 text-xs text-emerald-300 font-bold flex items-center justify-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>Ruta en Curso</span>
                          </div>
                        )}

                        {claimMessage?.pathId === path.id && (
                          <div className={`p-2.5 rounded-lg text-xs ${claimMessage.success ? 'bg-emerald-900/60 text-emerald-200 border border-emerald-500' : 'bg-red-900/60 text-red-200 border border-red-500'}`}>
                            {claimMessage.text}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Requirements Banner */}
                    {path.requirements && path.requirements.length > 0 && (
                      <div className="bg-blue-950/30 border border-blue-800/40 p-4 rounded-xl space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-blue-300 uppercase tracking-wider">
                          <ShieldCheck className="w-4 h-4 text-blue-400" />
                          Requisitos de Ingreso & Certificación
                        </div>
                        <ul className="space-y-1">
                          {path.requirements.map((req, rIdx) => (
                            <li key={rIdx} className="text-xs text-gray-300 flex items-start gap-2">
                              <span className="text-blue-400 font-bold">•</span>
                              <span>{req.description}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Sequence Steps (Levels -> Course -> Modules -> Evaluation -> Case -> Lab -> Certificate) */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Layers className="w-4 h-4 text-[#ff9100]" />
                          Estructura Completa de la Ruta ({pathCourses.length} Niveles de Formación)
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {pathCourses.map((item, cIdx) => {
                          const course = item.courseObj;
                          if (!course) return null;

                          return (
                            <div
                              key={course.id || cIdx}
                              className="bg-black/60 p-5 rounded-2xl border border-white/10 hover:border-[#ff6f00]/60 transition-all flex flex-col justify-between space-y-4 group relative overflow-hidden"
                            >
                              <div className="space-y-3">
                                {/* Level Badge Header */}
                                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                                  <span className="px-2.5 py-0.5 rounded-md bg-blue-900/80 text-blue-200 text-[11px] font-bold">
                                    {item.levelName || `Nivel ${cIdx + 1}`}
                                  </span>
                                  <span className="text-xl">{course.icon || '🚗'}</span>
                                </div>

                                {/* Course Title */}
                                <div>
                                  <h4 className="text-base font-bold text-white group-hover:text-[#ff9100] transition line-clamp-2">
                                    {course.title}
                                  </h4>
                                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                                    {course.description}
                                  </p>
                                </div>

                                {/* Detailed Nodes Breakdown: Modules & Quizzes */}
                                <div className="space-y-2 pt-1 border-t border-white/5 text-[11px]">
                                  <div className="flex items-center justify-between text-gray-300">
                                    <span className="flex items-center gap-1 font-semibold text-gray-300">
                                      <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                                      Módulos Académicos:
                                    </span>
                                    <span className="font-bold text-white">{course.modules?.length || 4} Módulos</span>
                                  </div>

                                  <div className="flex items-center justify-between text-gray-300">
                                    <span className="flex items-center gap-1 font-semibold text-gray-300">
                                      <FileCheck className="w-3.5 h-3.5 text-amber-400" />
                                      Evaluaciones de Módulo:
                                    </span>
                                    <span className="font-bold text-white">Quizzes Teórico-Prácticos</span>
                                  </div>

                                  {/* Real Diagnostic Case Integration */}
                                  {item.caseObj && (
                                    <div className="p-2 rounded-lg bg-purple-950/40 border border-purple-500/30 flex items-center justify-between">
                                      <span className="flex items-center gap-1 text-purple-300 font-bold">
                                        <Stethoscope className="w-3.5 h-3.5 text-purple-400" />
                                        Case Integrado:
                                      </span>
                                      <span className="text-purple-200 font-semibold truncate max-w-[130px]" title={item.caseObj.title}>
                                        {item.caseObj.title}
                                      </span>
                                    </div>
                                  )}

                                  {/* Real Virtual Lab Integration */}
                                  {item.labObj && (
                                    <div className="p-2 rounded-lg bg-teal-950/40 border border-teal-500/30 flex items-center justify-between">
                                      <span className="flex items-center gap-1 text-teal-300 font-bold">
                                        <Beaker className="w-3.5 h-3.5 text-teal-400" />
                                        Lab Virtual:
                                      </span>
                                      <span className="text-teal-200 font-semibold truncate max-w-[130px]" title={item.labObj.title}>
                                        {item.labObj.title}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Course Launch Button */}
                              <div className="pt-2">
                                <button
                                  onClick={() => onOpenCourse(course)}
                                  className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-[#ff6f00] text-xs font-bold text-white flex items-center justify-center gap-1.5 transition"
                                >
                                  <span>Iniciar Nivel / Ver Temario</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                </FadeInOnScroll>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
