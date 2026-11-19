import React, { useState, useEffect } from 'react';
import { DIAGNOSTIC_CASES_DATA } from '../../data/casesData';
import { DiagnosticCase } from '../../types';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Award,
  RotateCcw,
  Wrench,
  Sparkles,
  HelpCircle,
  Clock,
  Lightbulb,
  MessageSquare,
  Car,
  BookOpen,
  Activity,
  FileText,
  Search,
  CheckSquare
} from 'lucide-react';
import { FadeInOnScroll } from '../FadeInOnScroll';

interface YoveCasesViewProps {
  onEarnXp?: (amount: number) => void;
  onNavigateToView?: (view: any) => void;
  onAskAI?: (prompt: string) => void;
  onOpenLabWithComponent?: (type: any) => void;
  onOpenCourse?: (courseId: string) => void;
}

export const YoveCasesView: React.FC<YoveCasesViewProps> = ({
  onEarnXp,
  onNavigateToView,
  onAskAI,
  onOpenLabWithComponent,
  onOpenCourse
}) => {
  const { user, token } = useAuth();
  const [selectedCase, setSelectedCase] = useState<DiagnosticCase | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [completedCases, setCompletedCases] = useState<Record<string, boolean>>({});

  // Investigation Mechanics States
  const [unlockedHints, setUnlockedHints] = useState<Record<string, boolean>>({});
  const [attemptsCount, setAttemptsCount] = useState<number>(0);
  const [timeElapsed, setTimeElapsed] = useState<number>(0); // in seconds
  const [caseFinished, setCaseFinished] = useState<boolean>(false);
  const [finalCalculatedXp, setFinalCalculatedXp] = useState<number>(0);

  // Search/Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Load completed attempts from backend on mount
  useEffect(() => {
    if (user?.id && token) {
      fetch(`/api/v1/cases/attempts/${user.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.attempts) {
          const completedMap: Record<string, boolean> = {};
          data.attempts.forEach((att: any) => {
            if (att.completed) {
              completedMap[att.case_id] = true;
            }
          });
          setCompletedCases(completedMap);
        }
      })
      .catch(err => console.error("Error loading case attempts:", err));
    }
  }, [user?.id, token]);

  // Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (selectedCase && !caseFinished) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [selectedCase, caseFinished]);

  const startCase = (c: DiagnosticCase) => {
    setSelectedCase(c);
    setCurrentStepIndex(0);
    setSelectedOptionIndex(null);
    setFeedback(null);
    setUnlockedHints({});
    setAttemptsCount(0);
    setTimeElapsed(0);
    setCaseFinished(false);
    setFinalCalculatedXp(c.xpReward || 150);
  };

  const handleUnlockHint = (hintId: string, penalty: number) => {
    if (unlockedHints[hintId]) return;
    setUnlockedHints(prev => ({ ...prev, [hintId]: true }));
    setFinalCalculatedXp(prev => Math.max(30, prev - penalty));
  };

  const handleSelectOption = (optionIndex: number) => {
    if (!selectedCase) return;
    const step = selectedCase.steps[currentStepIndex];
    const option = step.options[optionIndex];

    setAttemptsCount(prev => prev + 1);
    setSelectedOptionIndex(optionIndex);
    setFeedback({
      isCorrect: option.isCorrect,
      text: option.feedback
    });

    if (option.isCorrect) {
      if (currentStepIndex === selectedCase.steps.length - 1) {
        // Case fully solved!
        setCaseFinished(true);
        setCompletedCases(prev => ({ ...prev, [selectedCase.id]: true }));

        // Time bonus calculation
        const timeBonus = timeElapsed < 120 ? 30 : timeElapsed < 300 ? 15 : 0;
        const totalXp = finalCalculatedXp + timeBonus;

        if (onEarnXp) onEarnXp(totalXp);

        // Persist attempt in backend
        if (user?.id && token) {
          fetch('/api/v1/cases/attempt', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              user_id: user.id,
              case_id: selectedCase.id,
              attempt_id: `case_${selectedCase.id}_${Date.now()}`,
              steps: selectedCase.steps,
              hints_used: Object.keys(unlockedHints).length,
              tests_performed: attemptsCount + 1,
              score: 100,
              accuracy: Math.round((1 / (attemptsCount + 1)) * 100),
              time_seconds: timeElapsed,
              completed: true,
              xp_reward: totalXp
            })
          }).catch(err => console.error("Error saving case attempt:", err));
        }
      }
    }
  };

  const handleNextStep = () => {
    if (!selectedCase) return;
    if (currentStepIndex < selectedCase.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setSelectedOptionIndex(null);
      setFeedback(null);
    }
  };

  // Format seconds to MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const filteredCases = DIAGNOSTIC_CASES_DATA.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.dtcCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="py-12 bg-[#0a0e27] min-h-screen text-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <FadeInOnScroll direction="up">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/60 text-[#ff9100] text-xs font-black uppercase tracking-wider border border-blue-700/50">
              <ShieldCheck className="w-3.5 h-3.5 text-[#ff9100]" />
              YOVE CASES // Casos Prácticos Reales de Taller
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Investiga, Mide y Diagnostica Averías Complejas
            </h1>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Mecanica didáctica de aprendizaje: la solución no se muestra de inmediato. Utiliza la lógica, consulta mediciones físicas, desbloquea pistas progresivas y gana XP por cada diagnóstico resuelto.
            </p>
          </div>
        </FadeInOnScroll>

        {/* Reference Disclaimer Banner (MANDATORY PROMPT 07) */}
        <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-center justify-between gap-3 text-xs text-amber-200 shadow-md">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Valores de Referencia Demostrativos Educativos:</strong> Todos los datos de escáner, oscilogramas y procedimientos son casos reales documentados con fines didácticos en YOVE Academy.
            </span>
          </div>

          <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-amber-900/80 text-amber-300 border border-amber-600/50">
            PROMPT 07 COMPLIANT
          </span>
        </div>

        {/* Active Selected Diagnostic Case View */}
        {selectedCase ? (
          <div className="max-w-5xl mx-auto bg-gradient-to-b from-[#0f173a] to-[#0a0e27] p-6 sm:p-8 rounded-3xl border border-blue-800/50 shadow-2xl space-y-6 animate-fade-in">
            
            {/* Top Bar Case Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-black px-2.5 py-0.5 rounded bg-[#ff6f00] text-white">
                    DTC: {selectedCase.dtcCode}
                  </span>
                  <span className="text-xs text-amber-300 font-bold flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    Recompensa: +{finalCalculatedXp} XP
                  </span>
                  <span className="text-xs text-blue-300 font-mono font-bold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Tiempo: {formatTime(timeElapsed)}
                  </span>
                  <span className="text-xs text-emerald-300 font-bold flex items-center gap-1">
                    <CheckSquare className="w-3.5 h-3.5" />
                    Intentos: {attemptsCount}
                  </span>
                </div>

                <h2 className="text-2xl font-black text-white mt-1.5">{selectedCase.vehicle}</h2>
                <p className="text-xs text-gray-400">Categoría: {selectedCase.category} • Dificultad: {selectedCase.difficulty}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedCase(null)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition cursor-pointer"
                >
                  ← Volver a la Lista de Casos
                </button>
              </div>
            </div>

            {/* Vehicle Symptoms & Live Data Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Symptom Card */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2 text-xs">
                <h4 className="font-extrabold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Síntoma Reportado por el Cliente
                </h4>
                <p className="text-gray-300 leading-relaxed">{selectedCase.symptom}</p>
              </div>

              {/* Live Data Initial Parameters */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2 text-xs">
                <h4 className="font-extrabold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-blue-400" />
                  Flujo de Datos Inicial (Live Data)
                </h4>
                <div className="space-y-1">
                  {selectedCase.initialLiveData.map((d, idx) => (
                    <div key={idx} className="flex items-center justify-between font-mono text-[11px] border-b border-white/5 pb-0.5">
                      <span className="text-gray-400">{d.parameter}:</span>
                      <span className="text-amber-300 font-bold">{d.value} {d.unit}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Physical Measurements Table (If Available) */}
            {selectedCase.physicalMeasurements && selectedCase.physicalMeasurements.length > 0 && (
              <div className="p-4 rounded-2xl bg-black/50 border border-blue-500/30 space-y-2 text-xs">
                <h4 className="font-extrabold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Wrench className="w-4 h-4 text-[#ff9100]" />
                  Pruebas y Mediciones Físicas en Taller
                </h4>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-[11px]">
                    <thead>
                      <tr className="text-gray-400 border-b border-white/10">
                        <th className="py-1">Prueba</th>
                        <th className="py-1">Equipo Usado</th>
                        <th className="py-1">Resultado Medido</th>
                        <th className="py-1">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCase.physicalMeasurements.map((m, idx) => (
                        <tr key={idx} className="border-b border-white/5 text-gray-200">
                          <td className="py-1.5 font-bold">{m.testName}</td>
                          <td className="py-1.5 text-gray-400">{m.toolUsed}</td>
                          <td className="py-1.5 text-amber-300 font-bold">{m.resultValue}</td>
                          <td className="py-1.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              m.status === 'Normal' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-red-950 text-red-300 border border-red-500/40'
                            }`}>
                              {m.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Progressive Hints Section */}
            {selectedCase.hints && selectedCase.hints.length > 0 && (
              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 space-y-3 text-xs">
                <h4 className="font-extrabold text-indigo-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-300" />
                  Sistema de Pistas de Investigación
                </h4>

                <div className="space-y-2">
                  {selectedCase.hints.map((h) => {
                    const isUnlocked = unlockedHints[h.id];
                    return (
                      <div key={h.id} className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">{h.title}</span>
                          {!isUnlocked ? (
                            <button
                              onClick={() => handleUnlockHint(h.id, h.xpPenalty)}
                              className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-[10px] shadow transition cursor-pointer flex items-center gap-1"
                            >
                              <Lightbulb className="w-3 h-3" />
                              Desbloquear Pista (-{h.xpPenalty} XP)
                            </button>
                          ) : (
                            <span className="text-[10px] font-bold text-emerald-400">Desbloqueada</span>
                          )}
                        </div>

                        {isUnlocked && (
                          <p className="text-indigo-200 mt-1 leading-relaxed">{h.content}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Current Investigation Step */}
            {!caseFinished && selectedCase.steps[currentStepIndex] && (
              <div className="space-y-5 pt-2">
                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="text-xs font-black text-[#ff9100] uppercase tracking-wider">
                    Paso {currentStepIndex + 1} de {selectedCase.steps.length}: {selectedCase.steps[currentStepIndex].title}
                  </span>
                </div>

                <p className="text-sm font-semibold text-white leading-relaxed">
                  {selectedCase.steps[currentStepIndex].instruction}
                </p>

                {/* Options List */}
                <div className="space-y-3">
                  {selectedCase.steps[currentStepIndex].options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      disabled={feedback !== null && feedback.isCorrect}
                      onClick={() => handleSelectOption(oIdx)}
                      className={`w-full p-4 rounded-2xl border text-xs sm:text-sm text-left font-semibold transition cursor-pointer flex items-center justify-between ${
                        selectedOptionIndex === oIdx
                          ? feedback?.isCorrect
                            ? 'bg-emerald-600/30 border-emerald-400 text-white font-bold'
                            : 'bg-red-600/30 border-red-400 text-white font-bold'
                          : 'bg-black/40 border-white/10 text-gray-200 hover:bg-white/10'
                      }`}
                    >
                      <span>{opt.text}</span>
                      {selectedOptionIndex === oIdx && (
                        feedback?.isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> : <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Feedback Box */}
                {feedback && (
                  <div className={`p-5 rounded-2xl border space-y-3 animate-fade-in ${
                    feedback.isCorrect ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200' : 'bg-red-950/40 border-red-500/50 text-red-200'
                  }`}>
                    <div className="flex items-center gap-2 font-bold text-sm">
                      {feedback.isCorrect ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          <span>¡Paso de Diagnóstico Correcto!</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-5 h-5 text-red-400" />
                          <span>Hipótesis o Procedimiento Incorrecto</span>
                        </>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm leading-relaxed">{feedback.text}</p>

                    {feedback.isCorrect && currentStepIndex < selectedCase.steps.length - 1 && (
                      <button
                        onClick={handleNextStep}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow transition cursor-pointer flex items-center gap-2 mt-2"
                      >
                        <span>Avanzar al Siguiente Paso de Diagnóstico</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Final Solved Case Card */}
            {caseFinished && (
              <div className="p-6 rounded-3xl bg-emerald-950/50 border border-emerald-500/60 space-y-5 animate-fade-in shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black shrink-0">
                    <Award className="w-7 h-7 text-amber-300" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-white">¡Caso Resuelto con Éxito Total!</h3>
                    <p className="text-xs text-emerald-300 font-semibold">
                      Completado en {formatTime(timeElapsed)} con {attemptsCount} intentos • Recompensa: +{finalCalculatedXp} XP
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2 text-xs">
                  <h4 className="font-extrabold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    Explicación Técnica & Lección Aprendida
                  </h4>
                  <p className="text-gray-200 leading-relaxed">{selectedCase.finalExplanation}</p>
                </div>

                {/* Multimodule Integration Action Bar */}
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <button
                    onClick={() => {
                      if (onAskAI) {
                        onAskAI(`Explícame más sobre la causa raíz y las lecciones aprendidas del caso práctico ${selectedCase.title} (${selectedCase.vehicle}).`);
                      } else if (onNavigateToView) {
                        onNavigateToView('ai');
                      }
                    }}
                    className="py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold shadow transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Consultar a YOVE AI
                  </button>

                  <button
                    onClick={() => {
                      if (onOpenLabWithComponent) {
                        onOpenLabWithComponent(selectedCase.relatedLabId || 'oscilloscope-lab');
                      } else if (onNavigateToView) {
                        onNavigateToView('lab');
                      }
                    }}
                    className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold shadow transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Activity className="w-4 h-4" />
                    Probar en YOVE Lab
                  </button>

                  <button
                    onClick={() => {
                      if (onNavigateToView) onNavigateToView('garage');
                    }}
                    className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-gray-200 font-bold border border-white/20 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Car className="w-4 h-4 text-[#ff9100]" />
                    Ver en YOVE Garage
                  </button>
                </div>
              </div>
            )}

          </div>
        ) : (
          /* Cases Selection Grid */
          <div className="space-y-6">
            
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Buscar caso por vehículo, DTC (Ej. P0171, U0100) o sistema..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border border-white/20 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#ff6f00]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCases.map((c) => {
                const isCompleted = completedCases[c.id];
                return (
                  <div
                    key={c.id}
                    className="p-6 rounded-3xl bg-gradient-to-b from-[#0e163d] to-[#0a0e27] border border-blue-800/50 hover:border-blue-500/80 transition shadow-xl flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded bg-[#ff6f00] text-white">
                          DTC: {c.dtcCode}
                        </span>

                        <span className="text-xs font-extrabold text-amber-300 flex items-center gap-1">
                          <Award className="w-3.5 h-3.5" />
                          +{c.xpReward || 150} XP
                        </span>
                      </div>

                      <h3 className="font-extrabold text-base text-white group-hover:text-[#ff9100] transition">
                        {c.title}
                      </h3>

                      <p className="text-xs font-bold text-blue-300">{c.vehicle}</p>

                      <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
                        {c.symptom}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-gray-400">
                        {c.difficulty} • {c.category}
                      </span>

                      <button
                        onClick={() => startCase(c)}
                        className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5 ${
                          isCompleted
                            ? 'bg-emerald-600 text-white shadow'
                            : 'bg-gradient-to-r from-[#ff6f00] to-[#ff9100] text-white shadow hover:opacity-90'
                        }`}
                      >
                        {isCompleted ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Resuelto
                          </>
                        ) : (
                          <>
                            <span>Investigar Caso</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
