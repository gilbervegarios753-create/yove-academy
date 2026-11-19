import React, { useState } from 'react';
import { Course, Lesson, Quiz } from '../../types';
import { useOffline } from '../../context/OfflineContext';
import { enrichModule, getLessonVideoUrl } from '../../utils/courseMediaEnricher';
import { X, PlayCircle, CheckCircle2, FileText, HelpCircle, Download, ArrowLeft, ArrowRight, Award, Lock, BookOpen } from 'lucide-react';

interface CoursePlayerModalProps {
  course: Course;
  onClose: () => void;
  onCompleteCourse?: (courseId: string) => void;
}

export const CoursePlayerModal: React.FC<CoursePlayerModalProps> = ({
  course,
  onClose,
  onCompleteCourse
}) => {
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>({
    'les-1': true,
    'les-2': true
  });
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Normalize modules list safely
  const rawModules = Array.isArray(course?.modules) ? course.modules : [];
  const sampleModules = rawModules.length === 0 || typeof rawModules[0] === 'string'
    ? [
        {
          id: 'mod-1',
          title: typeof rawModules[0] === 'string' ? rawModules[0] : 'Módulo 1: Fundamentos Teóricos y Arquitectura',
          description: 'Conceptos clave, señales y esquemas del sistema.',
          lessons: [
            {
              id: 'les-1',
              title: '1.1 Introducción y Diagnóstico Inicial',
              duration: '15 min',
              type: 'video' as const,
              contentUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
              textContent: 'En esta lección aprenderemos los principios fundamentales del diagnóstico electrónico automotriz. Analizaremos los diagramas eléctricos de fábrica y las precauciones de seguridad al trabajar con unidades de control (ECU).'
            },
            {
              id: 'les-2',
              title: '1.2 Lectura de Parámetros y Señales',
              duration: '22 min',
              type: 'interactive' as const,
              textContent: 'Analiza la señal utilizando el Osciloscopio Digital. Observa cómo cambia la amplitud de voltaje según el régimen de revoluciones (RPM).'
            },
            {
              id: 'les-3',
              title: '1.3 Quiz de Evaluación de Fundamentos',
              duration: '10 min',
              type: 'quiz' as const,
              quiz: {
                id: 'quiz-1',
                title: 'Evaluación Módulo 1',
                passingScore: 80,
                questions: [
                  {
                    id: 'q1',
                    question: '¿Cuál es la resistencia terminadora estándar en los extremos de un bus CAN C de alta velocidad?',
                    options: ['60 Ohms', '120 Ohms', '240 Ohms', '10 Ohms'],
                    correctAnswer: 1,
                    explanation: 'Cada nodo terminal posee una resistencia de 120 Ohms. En paralelo, la resistencia total equivalente es de 60 Ohms.'
                  },
                  {
                    id: 'q2',
                    question: '¿Qué tipo de señal genera un sensor de cigüeñal (CKP) inductivo de 2 pines?',
                    options: ['Onda cuadrada digital 0-5V', 'Voltaje DC variable', 'Onda senoidal alterna (AC)', 'Pulso PWM constante'],
                    correctAnswer: 2,
                    explanation: 'Los sensores inductivos generan su propio voltaje por inducción electromagnética en forma de onda senoidal de corriente alterna.'
                  }
                ]
              }
            }
          ]
        },
        {
          id: 'mod-2',
          title: 'Módulo 2: Procedimientos Prácticos de Laboratorio',
          description: 'Mediciones reales y aislamiento de fallas.',
          lessons: [
            {
              id: 'les-4',
              title: '2.1 Medición de Caídas de Tensión en Masa',
              duration: '18 min',
              type: 'video' as const,
              textContent: 'Guía paso a paso para medir caídas de tensión utilizando el multímetro bajo carga real.'
            },
            {
              id: 'les-5',
              title: '2.2 Manual Técnico en PDF de Diagnóstico',
              duration: '10 min',
              type: 'pdf' as const,
              resources: [
                { name: 'Manual_Diagnostico_YOVE_v2.pdf', url: '#' },
                { name: 'Esquema_Electrico_Muestra.pdf', url: '#' }
              ],
              textContent: 'Descarga el material de referencia técnica para conservación en taller.'
            }
          ]
        }
      ]
    : rawModules.map((mod: any, idx: number) => {
        const moduleObj = {
          id: mod.id || `mod-${idx + 1}`,
          title: typeof mod === 'string' ? mod : (mod.title || `Módulo ${idx + 1}`),
          description: typeof mod === 'string' ? '' : (mod.description || ''),
          lessons: Array.isArray(mod.lessons) && mod.lessons.length > 0 ? mod.lessons : [
            {
              id: `les-default-${idx}-1`,
              title: `Lección 1 del Módulo ${idx + 1}`,
              duration: '15 min',
              type: 'video' as const,
              textContent: typeof mod === 'string' ? mod : (mod.description || 'Lección de estudio técnico automotriz.')
            }
          ]
        };
        return enrichModule(moduleObj, course.category);
      });

  const currentModule = sampleModules[activeModuleIndex] || sampleModules[0];
  const currentLessons = currentModule?.lessons || [];
  const rawLesson: Lesson = currentLessons[activeLessonIndex] || currentLessons[0] || {
    id: 'les-fallback',
    title: 'Lección Inicial',
    duration: '10 min',
    type: 'video',
    textContent: 'Contenido técnico de estudio.'
  };

  const currentLesson: Lesson = {
    ...rawLesson,
    contentUrl: rawLesson.contentUrl || (rawLesson as any).videoUrl || getLessonVideoUrl(rawLesson.title, course.category, rawLesson.contentUrl)
  };

  const { queueEvent } = useOffline();

  const toggleLessonComplete = (lessonId: string) => {
    const isNowCompleted = !completedLessons[lessonId];
    setCompletedLessons(prev => ({
      ...prev,
      [lessonId]: isNowCompleted
    }));

    if (isNowCompleted) {
      queueEvent('LESSON_PROGRESS', {
        courseId: course?.id,
        courseTitle: course?.title,
        lessonId,
        lessonTitle: currentLesson.title,
        completedAt: Date.now()
      });
    }
  };

  const handleQuizSubmit = (quiz: Quiz) => {
    let correctCount = 0;
    quiz.questions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctAnswer) {
        correctCount++;
      }
    });
    const calculatedScore = Math.round((correctCount / quiz.questions.length) * 100);
    setQuizScore(calculatedScore);
    setQuizSubmitted(true);
    if (calculatedScore >= quiz.passingScore) {
      toggleLessonComplete(currentLesson.id);
    }
  };

  const totalLessonsCount = sampleModules.reduce((acc, mod) => acc + (mod.lessons?.length || 0), 0);
  const completedLessonsCount = Object.keys(completedLessons).filter(k => completedLessons[k]).length;
  const progressPercent = Math.min(100, Math.round((completedLessonsCount / totalLessonsCount) * 100));

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-hidden animate-in fade-in duration-200">
      <div className="bg-[#0a0e27] text-white w-full max-w-6xl h-[92vh] rounded-2xl border border-blue-900/50 shadow-2xl flex flex-col overflow-hidden">
        {/* Header Bar */}
        <div className="px-6 py-4 bg-[#070a1e] border-b border-blue-900/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{course.icon}</span>
            <div>
              <span className="text-[10px] font-bold text-[#ff6f00] uppercase tracking-wider">
                {course.categoryLabel} // Aula Virtual LMS
              </span>
              <h2 className="text-lg font-bold text-white line-clamp-1">{course.title}</h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Progress Bar Header */}
            <div className="hidden md:flex items-center gap-3 bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
              <span className="text-xs font-semibold text-gray-300">Progreso del Curso:</span>
              <div className="w-28 h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#ff6f00] to-emerald-400 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-xs font-bold text-emerald-400">{progressPercent}%</span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition"
              title="Cerrar Aula"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body Layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Main Media Player / Content Area */}
          <div className="lg:col-span-8 bg-[#0a0e27] p-4 sm:p-6 overflow-y-auto flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-blue-900/40">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-900/40 text-blue-300 border border-blue-700/50">
                  {currentModule.title}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  Lección {activeLessonIndex + 1} de {currentModule?.lessons?.length || 1}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                {currentLesson.title}
              </h3>

              {/* Lesson Viewer depending on Type */}
              {currentLesson.type === 'video' && (
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-black border border-white/10 shadow-lg relative flex items-center justify-center">
                  {currentLesson.contentUrl ? (
                    <iframe
                      src={currentLesson.contentUrl}
                      title={currentLesson.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="text-center space-y-2">
                      <PlayCircle className="w-16 h-16 text-[#ff6f00] mx-auto animate-pulse" />
                      <p className="text-sm font-semibold text-gray-300">Reproduciendo Clase Grabada en Alta Definición</p>
                    </div>
                  )}
                </div>
              )}

              {currentLesson.type === 'interactive' && (
                <div className="p-6 rounded-xl bg-gradient-to-br from-blue-950/40 to-slate-900/60 border border-blue-800/40 space-y-4">
                  <div className="flex items-center gap-2 text-[#ff9100] text-sm font-bold uppercase tracking-wide">
                    <Award className="w-4 h-4" />
                    <span>Práctica Interactiva Guiada</span>
                  </div>
                  <p className="text-sm text-gray-200 leading-relaxed">
                    {currentLesson.textContent}
                  </p>
                  <div className="p-4 rounded-lg bg-black/50 border border-white/10 text-xs text-emerald-400 font-mono">
                    [SIMULADOR_STATUS]: Señal de osciloscopio lista. Ajuste canal 1 a 2V/Div y 5ms/Div.
                  </div>
                </div>
              )}

              {currentLesson.type === 'pdf' && (
                <div className="p-6 rounded-xl bg-white/5 border border-white/10 space-y-4">
                  <div className="flex items-center gap-3 text-blue-400 font-bold">
                    <FileText className="w-6 h-6" />
                    <span>Material de Estudio y Manuales OEM</span>
                  </div>
                  <p className="text-sm text-gray-300">
                    Descarga los recursos adjuntos para conservar tus guías rápidas de diagnóstico y esquemas de arnés.
                  </p>
                  {currentLesson.resources && (
                    <div className="space-y-2 pt-2">
                      {currentLesson.resources.map((res, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-white/10">
                          <span className="text-xs font-semibold text-white">{res.name}</span>
                          <button className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded bg-[#ff6f00] hover:bg-[#ff8f00] text-white transition">
                            <Download className="w-3.5 h-3.5" />
                            Descargar
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {currentLesson.type === 'quiz' && currentLesson.quiz && (
                <div className="p-6 rounded-xl bg-white/5 border border-white/10 space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <h4 className="font-bold text-lg text-white">{currentLesson.quiz.title}</h4>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Mínimo Aprobatorio: {currentLesson.quiz.passingScore}%
                    </span>
                  </div>

                  {!quizSubmitted ? (
                    <div className="space-y-6">
                      {currentLesson.quiz.questions.map((q, qIdx) => (
                        <div key={q.id} className="space-y-3">
                          <p className="text-sm font-bold text-gray-200">
                            {qIdx + 1}. {q.question}
                          </p>
                          <div className="space-y-2">
                            {q.options.map((opt, oIdx) => (
                              <label
                                key={oIdx}
                                className={`flex items-center gap-3 p-3 rounded-lg border text-xs sm:text-sm cursor-pointer transition ${
                                  quizAnswers[qIdx] === oIdx
                                    ? 'bg-blue-600/30 border-blue-400 text-white'
                                    : 'bg-black/30 border-white/10 text-gray-300 hover:bg-white/5'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`quiz-${q.id}`}
                                  checked={quizAnswers[qIdx] === oIdx}
                                  onChange={() =>
                                    setQuizAnswers(prev => ({ ...prev, [qIdx]: oIdx }))
                                  }
                                  className="text-[#ff6f00] focus:ring-0"
                                />
                                <span>{opt}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}

                      <button
                        onClick={() => handleQuizSubmit(currentLesson.quiz!)}
                        disabled={Object.keys(quizAnswers).length < currentLesson.quiz.questions.length}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-[#ff6f00] to-[#ff9100] font-bold text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-95 transition"
                      >
                        Enviar Evaluación
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-6 space-y-4">
                      <div className={`text-4xl font-black ${quizScore! >= currentLesson.quiz.passingScore ? 'text-emerald-400' : 'text-red-400'}`}>
                        {quizScore}%
                      </div>
                      <p className="text-sm text-gray-200 font-semibold">
                        {quizScore! >= currentLesson.quiz.passingScore
                          ? '¡Felicidades! Has aprobado la evaluación teórica.'
                          : 'No alcanzaste el puntaje mínimo. Puedes repasar la lección y reintentar.'}
                      </p>
                      <button
                        onClick={() => {
                          setQuizSubmitted(false);
                          setQuizAnswers({});
                        }}
                        className="px-5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition"
                      >
                        Volver a Intentar
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Text Description */}
              {currentLesson.textContent && currentLesson.type !== 'interactive' && currentLesson.type !== 'pdf' && (
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-gray-300 leading-relaxed">
                  {currentLesson.textContent}
                </div>
              )}
            </div>

            {/* Bottom Actions Bar */}
            <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-4 mt-6">
              <button
                onClick={() => toggleLessonComplete(currentLesson.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
                  completedLessons[currentLesson.id]
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{completedLessons[currentLesson.id] ? 'Lección Completada' : 'Marcar como Completada'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  disabled={activeLessonIndex === 0}
                  onClick={() => setActiveLessonIndex(prev => prev - 1)}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
                  title="Lección Anterior"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={activeLessonIndex === (currentModule?.lessons?.length || 1) - 1}
                  onClick={() => setActiveLessonIndex(prev => prev + 1)}
                  className="p-2.5 rounded-xl bg-[#ff6f00] hover:bg-[#ff8f00] text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
                  title="Siguiente Lección"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Modules & Lessons Index */}
          <div className="lg:col-span-4 bg-[#070a1e] p-4 overflow-y-auto space-y-4">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2">
              Índice del Curso ({sampleModules.length} Módulos)
            </h4>

            <div className="space-y-3">
              {sampleModules.map((mod, mIdx) => (
                <div key={mod.id || mIdx} className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                  <button
                    onClick={() => setActiveModuleIndex(mIdx)}
                    className={`w-full p-3 text-left font-bold text-xs sm:text-sm flex items-center justify-between transition ${
                      activeModuleIndex === mIdx ? 'bg-blue-600/30 text-white' : 'text-gray-300 hover:bg-white/5'
                    }`}
                  >
                    <span className="line-clamp-1">{mod.title}</span>
                    <span className="text-[10px] text-gray-400 shrink-0 ml-2">
                      {mod.lessons?.length || 0} lecc.
                    </span>
                  </button>

                  {activeModuleIndex === mIdx && (
                    <div className="p-2 space-y-1 bg-black/40 border-t border-white/5">
                      {(mod.lessons || []).map((les: Lesson, lIdx: number) => {
                        const isCompleted = completedLessons[les.id];
                        const isActive = activeLessonIndex === lIdx;

                        return (
                          <button
                            key={les.id}
                            onClick={() => setActiveLessonIndex(lIdx)}
                            className={`w-full p-2.5 rounded-lg text-xs text-left flex items-center justify-between transition ${
                              isActive
                                ? 'bg-[#ff6f00]/20 text-[#ff9100] font-bold border border-[#ff6f00]/40'
                                : 'text-gray-300 hover:bg-white/5'
                            }`}
                          >
                            <div className="flex items-center gap-2 line-clamp-1">
                              {les.type === 'video' && <PlayCircle className="w-3.5 h-3.5 shrink-0 text-blue-400" />}
                              {les.type === 'quiz' && <HelpCircle className="w-3.5 h-3.5 shrink-0 text-amber-400" />}
                              {les.type === 'pdf' && <FileText className="w-3.5 h-3.5 shrink-0 text-emerald-400" />}
                              {les.type === 'interactive' && <Award className="w-3.5 h-3.5 shrink-0 text-purple-400" />}
                              <span>{les.title}</span>
                            </div>

                            {isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : (
                              <span className="text-[10px] text-gray-400 shrink-0">{les.duration}</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Certificate Unlock Banner */}
            {progressPercent === 100 && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-900/60 to-teal-900/60 border border-emerald-500/40 text-center space-y-2 animate-in zoom-in-95 duration-300">
                <Award className="w-8 h-8 text-emerald-400 mx-auto" />
                <h5 className="font-bold text-sm text-white">¡Curso Completado al 100%!</h5>
                <p className="text-[11px] text-emerald-200">
                  Tu certificado de finalización está listo para ser generado.
                </p>
                <button
                  onClick={() => {
                    if (onCompleteCourse) onCompleteCourse(course.id);
                    onClose();
                  }}
                  className="w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 font-bold text-xs text-white transition shadow-lg"
                >
                  Obtener Mi Certificado
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
