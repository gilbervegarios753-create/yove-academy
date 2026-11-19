import React, { useState, useEffect } from 'react';
import { LABS_DATA } from '../../data/labsData';
import { LabSimulation, LabAttempt } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { MultimeterPro } from './MultimeterPro';
import { OscilloscopePro, SignalType } from './OscilloscopePro';
import { CanBusAnalyzer } from './CanBusAnalyzer';
import { LabAttemptSummaryModal } from './LabAttemptSummaryModal';
import {
  Cpu,
  Activity,
  Wrench,
  ShieldAlert,
  Award,
  Zap,
  CheckCircle2,
  HelpCircle,
  BookOpen,
  Car,
  MessageSquare,
  Clock,
  RotateCcw,
  Sliders,
  Network
} from 'lucide-react';
import { FadeInOnScroll } from '../FadeInOnScroll';

interface YoveLabViewProps {
  initialLabType?: string;
  onNavigateToView?: (view: any) => void;
  onAskAI?: (prompt: string) => void;
  onEarnXp?: (amount: number) => void;
  onOpenCourse?: (courseId: string) => void;
}

export const YoveLabView: React.FC<YoveLabViewProps> = ({
  initialLabType = 'oscilloscope-lab',
  onNavigateToView,
  onAskAI,
  onEarnXp,
  onOpenCourse
}) => {
  const { user, token } = useAuth();

  // Active Lab State
  const [selectedLabId, setSelectedLabId] = useState<string>(() => {
    const found = LABS_DATA.find(l => l.id === initialLabType || l.type === initialLabType);
    return found ? found.id : LABS_DATA[0].id;
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  const currentLab = LABS_DATA.find(l => l.id === selectedLabId) || LABS_DATA[0];

  // Active Instrument View Mode ('multimeter' | 'oscilloscope' | 'canbus')
  const [activeToolTab, setActiveToolTab] = useState<'multimeter' | 'oscilloscope' | 'canbus'>(() => {
    if (currentLab.type === 'multimeter') return 'multimeter';
    if (currentLab.type === 'canbus') return 'canbus';
    return 'oscilloscope';
  });

  // Simulation Parameters
  const [rpm, setRpm] = useState<number>(2500);
  const [faultSimulation, setFaultSimulation] = useState<'normal' | 'missing_tooth' | 'high_resistance' | 'sensor_dirty' | 'short_gnd'>('normal');

  // Timer & Steps tracking
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [stepsCount, setStepsCount] = useState<number>(0);

  // Quiz / Evaluation States
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [scoreEarned, setScoreEarned] = useState<number>(0);
  const [lastAttempt, setLastAttempt] = useState<LabAttempt | null>(null);
  const [showSummaryModal, setShowSummaryModal] = useState<boolean>(false);

  // Timer Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedLabId]);

  // Reset quiz and timers when switching labs
  useEffect(() => {
    setUserAnswers({});
    setQuizSubmitted(false);
    setElapsedSeconds(0);
    setStepsCount(0);
    setShowSummaryModal(false);

    // Auto-select instrument tab based on lab type
    if (currentLab.type === 'multimeter') {
      setActiveToolTab('multimeter');
    } else if (currentLab.type === 'canbus') {
      setActiveToolTab('canbus');
    } else {
      setActiveToolTab('oscilloscope');
    }
  }, [selectedLabId]);

  // Track step execution
  const handleStepExecuted = (stepName: string) => {
    setStepsCount(prev => prev + 1);
  };

  // Filter Labs by Category
  const categories = ['Todos', 'Instrumentación', 'Sensores', 'Actuadores', 'Redes', 'Diagnóstico', 'Electrónica'];

  const filteredLabs = LABS_DATA.filter(lab => {
    if (selectedCategory === 'Todos') return true;
    return lab.category === selectedCategory;
  });

  // Handle Quiz Submission & Persist Attempt
  const handleSubmitQuiz = () => {
    if (!currentLab.quiz || currentLab.quiz.length === 0) return;

    let correctCount = 0;
    currentLab.quiz.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const totalQ = currentLab.quiz.length;
    const errorsCount = totalQ - correctCount;
    const reward = currentLab.xpReward || 100;
    const finalEarned = Math.round((correctCount / totalQ) * reward);
    const scorePct = Math.round((correctCount / totalQ) * 100);

    setScoreEarned(finalEarned);
    setQuizSubmitted(true);

    if (onEarnXp && finalEarned > 0) {
      onEarnXp(finalEarned);
    }

    const newAttempt: LabAttempt = {
      id: `lab_att_${Date.now()}`,
      userId: user?.id,
      labType: currentLab.type,
      scenarioId: currentLab.id,
      stepsCount: stepsCount + Object.keys(userAnswers).length,
      answers: userAnswers,
      score: scorePct,
      errorsCount,
      timeSeconds: elapsedSeconds,
      explanation: `Completado laboratorio ${currentLab.title} con ${correctCount}/${totalQ} aciertos (${scorePct}%).`,
      xpEarned: finalEarned,
      completedAt: new Date().toISOString()
    };

    setLastAttempt(newAttempt);
    setShowSummaryModal(true);

    // Save locally
    try {
      const stored = localStorage.getItem('yove_lab_attempts');
      const attempts = stored ? JSON.parse(stored) : [];
      attempts.unshift(newAttempt);
      localStorage.setItem('yove_lab_attempts', JSON.stringify(attempts.slice(0, 50)));
    } catch (e) {
      console.error("Local storage error:", e);
    }

    // Persist attempt in backend API
    if (user?.id && token) {
      fetch('/api/v1/labs/attempt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          user_id: user.id,
          lab_type: currentLab.type,
          scenario_id: currentLab.id,
          score: scorePct,
          errors_count: errorsCount,
          time_seconds: elapsedSeconds,
          explanation: newAttempt.explanation,
          xp_earned: finalEarned
        })
      }).catch(err => console.error("Error saving lab attempt to server:", err));
    }
  };

  // Helper to get signal for oscilloscope
  const getSignalForCurrentLab = (): SignalType => {
    const comp = (currentLab.componentName || '').toUpperCase();
    if (comp.includes('CKP')) return 'ckp';
    if (comp.includes('CMP')) return 'cmp';
    if (comp.includes('ACTUADORES') || currentLab.id === 'actuator-sim-lab') return 'injector';
    if (currentLab.id === 'oscilloscope-lab') return 'coil';
    if (comp.includes('CAN')) return 'can_h';
    return 'ckp';
  };

  return (
    <div className="py-12 bg-[#0a0e27] min-h-screen text-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Title & Branding */}
        <FadeInOnScroll direction="up">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-900/60 text-[#ff9100] text-xs font-black uppercase tracking-wider border border-blue-700/50 shadow-md">
              <Cpu className="w-4 h-4 text-[#ff9100]" />
              YOVE LAB PRO // Laboratorios Virtuales de Mecatrónica
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Simuladores Educativos de Sensores, Actuadores e Instrumental
            </h1>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Practica con multímetros digital True RMS, osciloscopios de 2 canales, señales de CKP/CMP/TPS/MAP/MAF/ECT/O2, relés, bancos ECU y redes CAN Bus.
            </p>
          </div>
        </FadeInOnScroll>

        {/* Safety & Technical Disclaimer Banner */}
        <div className="p-3.5 rounded-2xl bg-blue-950/50 border border-blue-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-blue-200 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
            <span>
              <strong>Simulación Educativa Mecatrónica:</strong> Entorno de práctica virtual sin riesgo eléctrico. Valores de referencia pedagógicos según especificaciones SAE J1978 e ISO 15765.
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/60 border border-blue-400/40 font-mono text-[11px] text-cyan-300">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{Math.floor(elapsedSeconds / 60)}m {elapsedSeconds % 60}s</span>
            </div>

            <span className="text-[10px] uppercase font-mono font-bold px-2.5 py-1 rounded bg-blue-900/80 text-blue-300 border border-blue-700/50">
              YOVE LAB PRO 4.0
            </span>
          </div>
        </div>

        {/* Categories & Lab Selector Bar */}
        <div className="space-y-4">
          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider shrink-0 mr-1">
              Categoría:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition cursor-pointer border shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-blue-600 border-blue-400 text-white shadow-md'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Labs Selector Bar */}
          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
            {filteredLabs.map((lab) => (
              <button
                key={lab.id}
                onClick={() => setSelectedLabId(lab.id)}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition cursor-pointer flex items-center gap-2 border shrink-0 ${
                  lab.id === selectedLabId
                    ? 'bg-gradient-to-r from-[#ff6f00] to-[#ff9100] text-white border-amber-300 shadow-xl scale-102'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-200" />
                <span>{lab.componentName || lab.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Laboratory Dashboard Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column (4 Cols): Objective, Theory, Instructions */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Objective & Metadata Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-b from-[#0e163d] to-[#080d24] border border-blue-800/60 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-black text-[#ff9100] uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  {currentLab.componentName} // Módulo
                </span>

                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                  +{currentLab.xpReward || 100} XP
                </span>
              </div>

              <h2 className="text-lg font-black text-white leading-snug">{currentLab.title}</h2>

              <div className="space-y-2 text-xs text-gray-300 leading-relaxed">
                <p><strong>Meta Educativa:</strong> {currentLab.objective}</p>
                <p><strong>Descripción:</strong> {currentLab.description}</p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  onClick={() => {
                    const prompt = `Explícame en detalle la teoría y el procedimiento de diagnóstico para el laboratorio de ${currentLab.title} (${currentLab.componentName}).`;
                    if (onAskAI) onAskAI(prompt);
                    else if (onNavigateToView) onNavigateToView('ai');
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white font-extrabold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-cyan-300" />
                  Explicar este Laboratorio con YOVE AI
                </button>

                <button
                  onClick={() => {
                    if (onNavigateToView) onNavigateToView('garage');
                  }}
                  className="w-full py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-gray-200 text-xs font-bold border border-white/20 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Car className="w-4 h-4 text-[#ff9100]" />
                  Ver Vehículos de Prueba en YOVE Garage
                </button>
              </div>
            </div>

            {/* Theory Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-b from-[#0e163d] to-[#080d24] border border-blue-800/60 space-y-3 shadow-2xl">
              <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-400" />
                Fundamento Teórico
              </h3>

              <p className="text-xs text-gray-300 leading-relaxed font-sans">{currentLab.theory}</p>
            </div>

            {/* Instructions Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-b from-[#0e163d] to-[#080d24] border border-blue-800/60 space-y-3 shadow-2xl">
              <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Wrench className="w-4 h-4 text-[#ff9100]" />
                Procedimiento de Simulación
              </h3>

              <ol className="space-y-2 text-xs text-gray-300 list-decimal list-inside leading-relaxed">
                {currentLab.instructions.map((inst, idx) => (
                  <li key={idx} className="marker:text-[#ff9100] marker:font-bold">{inst}</li>
                ))}
              </ol>
            </div>

          </div>

          {/* Right Column (8 Cols): Interactive Instruments & Evaluation */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Instrument View Mode Selector Tabs */}
            <div className="p-2 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-gray-400 uppercase px-3 tracking-wider hidden sm:inline">
                Instrumental Activo:
              </span>

              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setActiveToolTab('oscilloscope')}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center justify-center gap-2 ${
                    activeToolTab === 'oscilloscope'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  <Activity className="w-4 h-4 text-cyan-300" />
                  Osciloscopio Digital
                </button>

                <button
                  onClick={() => setActiveToolTab('multimeter')}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center justify-center gap-2 ${
                    activeToolTab === 'multimeter'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  Multímetro DMM
                </button>

                <button
                  onClick={() => setActiveToolTab('canbus')}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center justify-center gap-2 ${
                    activeToolTab === 'canbus'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  <Network className="w-4 h-4 text-emerald-300" />
                  Analizador CAN
                </button>
              </div>
            </div>

            {/* Active Instrument Component Render */}
            {activeToolTab === 'oscilloscope' && (
              <OscilloscopePro
                scenarioTitle={`Consola Osciloscopio PRO // ${currentLab.componentName}`}
                defaultSignal={getSignalForCurrentLab()}
                faultMode={faultSimulation as any}
                rpm={rpm}
                onStepExecuted={handleStepExecuted}
              />
            )}

            {activeToolTab === 'multimeter' && (
              <MultimeterPro
                scenarioTitle={`Consola Multímetro True RMS // ${currentLab.componentName}`}
                faultMode={faultSimulation as any}
                rpm={rpm}
                onStepExecuted={handleStepExecuted}
              />
            )}

            {activeToolTab === 'canbus' && (
              <CanBusAnalyzer
                scenarioTitle={`Red de Datos CAN Bus // ${currentLab.componentName}`}
                onStepExecuted={handleStepExecuted}
              />
            )}

            {/* Practical Challenge Box */}
            {currentLab.activityChallenge && (
              <div className="p-5 rounded-3xl bg-amber-950/30 border border-amber-500/40 space-y-2 text-xs shadow-xl">
                <h4 className="font-extrabold text-amber-300 uppercase tracking-wider text-xs flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Desafío de Diagnóstico Práctico
                </h4>
                <p className="text-amber-100 text-sm">{currentLab.activityChallenge}</p>
                <p className="text-xs text-amber-200/90 font-mono pt-1 border-t border-amber-500/20">
                  <strong>Resultado Esperado:</strong> {currentLab.expectedResult}
                </p>
              </div>
            )}

            {/* Evaluation Quiz Section */}
            {currentLab.quiz && currentLab.quiz.length > 0 && (
              <div className="p-6 rounded-3xl bg-gradient-to-b from-[#0e163d] to-[#080d24] border border-blue-800/60 space-y-5 shadow-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-blue-400" />
                    <h3 className="font-extrabold text-base text-white">Evaluación Práctica del Laboratorio</h3>
                  </div>

                  {quizSubmitted && (
                    <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-extrabold text-xs flex items-center gap-1 shadow">
                      <CheckCircle2 className="w-4 h-4" />
                      Evaluación Finalizada (+{scoreEarned} XP)
                    </span>
                  )}
                </div>

                <div className="space-y-6">
                  {currentLab.quiz.map((q, qIdx) => (
                    <div key={q.id} className="p-4.5 rounded-2xl bg-black/40 border border-white/10 space-y-3 text-xs">
                      <p className="font-bold text-white text-sm">
                        {qIdx + 1}. {q.question}
                      </p>

                      <div className="space-y-2">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = userAnswers[q.id] === oIdx;
                          const isCorrectOption = oIdx === q.correctAnswer;

                          let btnStyle = 'bg-white/5 border-white/10 text-gray-200 hover:bg-white/10';
                          if (quizSubmitted) {
                            if (isCorrectOption) {
                              btnStyle = 'bg-emerald-600/40 border-emerald-400 text-emerald-100 font-bold';
                            } else if (isSelected && !isCorrectOption) {
                              btnStyle = 'bg-red-600/40 border-red-400 text-red-100 font-bold';
                            }
                          } else if (isSelected) {
                            btnStyle = 'bg-blue-600 border-blue-400 text-white font-bold';
                          }

                          return (
                            <button
                              key={oIdx}
                              disabled={quizSubmitted}
                              onClick={() => {
                                setUserAnswers({ ...userAnswers, [q.id]: oIdx });
                                handleStepExecuted(`Respondida pregunta ${qIdx + 1}`);
                              }}
                              className={`w-full p-3 rounded-xl border text-left text-xs transition cursor-pointer flex items-center justify-between ${btnStyle}`}
                            >
                              <span>{opt}</span>
                              {quizSubmitted && isCorrectOption && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>

                      {quizSubmitted && (
                        <p className="p-3 rounded-xl bg-blue-950/60 border border-blue-500/30 text-[11px] text-blue-200 leading-relaxed">
                          💡 <strong>Explicación Técnica:</strong> {q.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {!quizSubmitted ? (
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={Object.keys(userAnswers).length < currentLab.quiz.length}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#ff6f00] to-[#ff9100] text-white font-extrabold text-xs shadow-xl hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Award className="w-4 h-4" />
                    Enviar Respuestas y Finalizar Laboratorio
                  </button>
                ) : (
                  <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 text-center space-y-3">
                    <h4 className="font-extrabold text-emerald-300 text-sm">¡Resultados Guardados Exitosamente!</h4>
                    <p className="text-xs text-emerald-100">
                      Obtuviste <strong>+{scoreEarned} XP</strong> guardados en tu historial académico de YOVE Academy.
                    </p>
                    <button
                      onClick={() => setShowSummaryModal(true)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition cursor-pointer inline-flex items-center gap-2"
                    >
                      <Award className="w-4 h-4" />
                      Ver Informe Detallado de Resultados
                    </button>
                  </div>
                )}

              </div>
            )}

          </div>

        </div>

      </div>

      {/* Summary Attempt Modal */}
      {showSummaryModal && lastAttempt && (
        <LabAttemptSummaryModal
          attempt={lastAttempt}
          labTitle={currentLab.title}
          onClose={() => setShowSummaryModal(false)}
          onAskAI={onAskAI}
        />
      )}
    </div>
  );
};
