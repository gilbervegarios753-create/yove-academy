import React, { useState, useEffect } from 'react';
import { Quiz, Exam, QuizQuestion, QuestionType, ExamAttempt } from '../../types';
import { EVALUATION_QUIZZES, EVALUATION_EXAMS } from '../../data/evaluationsData';
import { useOffline } from '../../context/OfflineContext';
import {
  FileText,
  Clock,
  Award,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  HelpCircle,
  HelpCircle as HelpIcon,
  ChevronRight,
  BarChart2,
  Image as ImageIcon,
  CheckSquare,
  ShieldCheck,
  Trophy,
  ArrowRight,
  Flame,
  Zap
} from 'lucide-react';
import { FadeInOnScroll } from '../FadeInOnScroll';

interface YoveEvaluationsViewProps {
  onEarnXp?: (amount: number) => void;
  onNavigateToView?: (view: any) => void;
  onCertificateUnlocked?: (courseTitle: string, hours: number) => void;
}

export const YoveEvaluationsView: React.FC<YoveEvaluationsViewProps> = ({
  onEarnXp,
  onNavigateToView,
  onCertificateUnlocked
}) => {
  const { queueEvent } = useOffline();
  const [activeTab, setActiveTab] = useState<'quizzes' | 'exams' | 'history'>('quizzes');
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

  // Active quiz/exam state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [matchingAnswers, setMatchingAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scorePercent, setScorePercent] = useState<number | null>(null);
  const [passed, setPassed] = useState<boolean | null>(null);

  // Timer state for Exams
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number | null>(null);
  const [examAttemptsHistory, setExamAttemptsHistory] = useState<ExamAttempt[]>([
    {
      id: 'att-1',
      examId: 'exam-master-diagnosta',
      examTitle: 'Examen de Certificación Final: Diagnosta Automotriz Avanzado YOVE',
      score: 80,
      passed: false,
      completedAt: '10 de Febrero de 2026',
      timeSpentMinutes: 38,
      totalQuestions: 5,
      correctAnswers: 4
    }
  ]);

  // Exam Countdown Timer Effect
  useEffect(() => {
    if (!selectedExam || isSubmitted || timeLeftSeconds === null) return;

    if (timeLeftSeconds <= 0) {
      handleFinalSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeftSeconds(prev => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedExam, isSubmitted, timeLeftSeconds]);

  const handleStartQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setSelectedExam(null);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setMatchingAnswers({});
    setIsSubmitted(false);
    setScorePercent(null);
    setPassed(null);
  };

  const handleStartExam = (exam: Exam) => {
    setSelectedExam(exam);
    setSelectedQuiz(null);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setMatchingAnswers({});
    setIsSubmitted(false);
    setScorePercent(null);
    setPassed(null);
    setTimeLeftSeconds(exam.timeLimitMinutes * 60);
  };

  const handleSelectOption = (qIndex: number, optionIndex: number) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({
      ...prev,
      [qIndex]: optionIndex
    }));
  };

  const handleFinalSubmit = () => {
    const activeQuestions = selectedQuiz ? selectedQuiz.questions : selectedExam?.questions || [];
    let correctCount = 0;

    activeQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswer) {
        correctCount++;
      }
    });

    const percent = Math.round((correctCount / activeQuestions.length) * 100);
    const passingThreshold = selectedQuiz ? selectedQuiz.passingScore : selectedExam?.passingScore || 80;
    const isPass = percent >= passingThreshold;

    setScorePercent(percent);
    setPassed(isPass);
    setIsSubmitted(true);

    const xpEarned = isPass
      ? selectedQuiz
        ? selectedQuiz.xpReward || 150
        : selectedExam?.xpReward || 400
      : 25;

    if (onEarnXp) {
      onEarnXp(xpEarned);
    }

    // Queue offline event to guarantee progress preservation
    queueEvent('EXAM_SUBMISSION', {
      title: selectedQuiz ? selectedQuiz.title : selectedExam?.title,
      score: percent,
      passed: isPass,
      xpEarned,
      submittedAt: Date.now()
    });

    // Save exam attempt if it's an exam
    if (selectedExam) {
      const spentMinutes = Math.max(1, Math.round((selectedExam.timeLimitMinutes * 60 - (timeLeftSeconds || 0)) / 60));
      const newAttempt: ExamAttempt = {
        id: `att-${Date.now()}`,
        examId: selectedExam.id,
        examTitle: selectedExam.title,
        score: percent,
        passed: isPass,
        completedAt: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
        timeSpentMinutes: spentMinutes,
        totalQuestions: activeQuestions.length,
        correctAnswers: correctCount
      };
      setExamAttemptsHistory(prev => [newAttempt, ...prev]);

      if (isPass && onCertificateUnlocked) {
        onCertificateUnlocked(selectedExam.title, 80);
      }
    }
  };

  const handleResetActiveTest = () => {
    setSelectedQuiz(null);
    setSelectedExam(null);
    setIsSubmitted(false);
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setTimeLeftSeconds(null);
  };

  const activeQuestions = selectedQuiz ? selectedQuiz.questions : selectedExam?.questions || [];
  const currentQ = activeQuestions[currentQuestionIndex];

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="py-10 bg-[#0a0e27] min-h-screen text-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Title */}
        <FadeInOnScroll direction="up">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-900/60 text-[#ff9100] text-xs font-bold uppercase tracking-wider border border-blue-700/50">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Módulo de Evaluaciones Téchnicas & Exámenes
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Acredita tus Competencias de Diagnóstico Automotriz
            </h1>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              Pon a prueba tu conocimiento técnico con quizzes interactivos de osciloscopio, red CAN Bus, interpretación de gráficos, verdadero/falso y casos reales. Aprueba los exámenes finales para desbloquear tu certificado digital oficial.
            </p>
          </div>
        </FadeInOnScroll>

        {/* Tab Selector when NOT currently in an active test */}
        {!selectedQuiz && !selectedExam && (
          <div className="flex justify-center border-b border-white/10 pb-4">
            <div className="inline-flex p-1 bg-white/5 rounded-2xl border border-white/10 gap-2">
              <button
                onClick={() => setActiveTab('quizzes')}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'quizzes'
                    ? 'bg-[#ff6f00] text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>Quizzes Prácticos ({EVALUATION_QUIZZES.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('exams')}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'exams'
                    ? 'bg-[#ff6f00] text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>Exámenes Finales ({EVALUATION_EXAMS.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('history')}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'history'
                    ? 'bg-[#ff6f00] text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <BarChart2 className="w-4 h-4" />
                <span>Historial de Intentos ({examAttemptsHistory.length})</span>
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 1: QUIZZES CATALOG */}
        {/* ======================================================== */}
        {!selectedQuiz && !selectedExam && activeTab === 'quizzes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {EVALUATION_QUIZZES.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-gradient-to-b from-[#0f173a] to-[#0a0e27] p-6 rounded-2xl border border-blue-900/50 hover:border-[#ff6f00] transition-all shadow-xl space-y-4 relative flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-blue-900/80 text-blue-200 text-[10px] font-bold uppercase tracking-wider">
                      {quiz.category || 'Quiz Técnico'}
                    </span>
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      +{quiz.xpReward || 150} XP
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-[#ff9100] transition">
                    {quiz.title}
                  </h3>

                  <p className="text-xs text-gray-300 leading-relaxed">
                    {quiz.description}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2 text-[11px] text-gray-400">
                    <span className="bg-black/40 px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
                      {quiz.questions.length} Preguntas
                    </span>
                    <span className="bg-black/40 px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Mínimo {quiz.passingScore}% para aprobar
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleStartQuiz(quiz)}
                  className="w-full mt-4 py-2.5 rounded-xl bg-gradient-to-r from-[#ff6f00] to-[#ff9100] text-xs font-bold text-white shadow-md flex items-center justify-center gap-2 hover:opacity-90 transition cursor-pointer"
                >
                  <span>Iniciar Quiz Interactivo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 2: EXAMS CATALOG */}
        {/* ======================================================== */}
        {!selectedQuiz && !selectedExam && activeTab === 'exams' && (
          <div className="space-y-6">
            {EVALUATION_EXAMS.map((exam) => (
              <div
                key={exam.id}
                className="bg-gradient-to-r from-[#0d163a] via-[#101b4d] to-[#0d163a] p-6 sm:p-8 rounded-2xl border border-amber-500/40 relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="space-y-3 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-extrabold uppercase tracking-wider border border-amber-500/30">
                      Examen Final Oficial
                    </span>
                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                      <Trophy className="w-3.5 h-3.5" />
                      Genera Certificado Acreditado
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-white">{exam.title}</h2>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">{exam.description}</p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-300 pt-2">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <Clock className="w-4 h-4 text-amber-400" />
                      Tiempo Límite: {exam.timeLimitMinutes} minutos
                    </span>
                    <span className="flex items-center gap-1.5 font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Aprobación: {exam.passingScore}%
                    </span>
                    <span className="flex items-center gap-1.5 font-semibold">
                      <RotateCcw className="w-4 h-4 text-blue-400" />
                      Intentos Permitidos: {exam.attemptsAllowed}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 w-full md:w-auto">
                  <button
                    onClick={() => handleStartExam(exam)}
                    className="w-full md:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 font-extrabold text-sm text-white shadow-xl flex items-center justify-center gap-2 hover:opacity-90 transition cursor-pointer"
                  >
                    <Award className="w-5 h-5" />
                    <span>Iniciar Examen de Certificación</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 3: ATTEMPTS HISTORY */}
        {/* ======================================================== */}
        {!selectedQuiz && !selectedExam && activeTab === 'history' && (
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-[#ff9100]" />
              Historial de Intentos de Examen
            </h3>

            {examAttemptsHistory.length === 0 ? (
              <p className="text-xs text-gray-400">Aún no has realizado intentos de examen final.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-black/40 text-gray-400 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="px-4 py-3">Examen</th>
                      <th className="px-4 py-3">Fecha</th>
                      <th className="px-4 py-3">Puntuación</th>
                      <th className="px-4 py-3">Resultado</th>
                      <th className="px-4 py-3">Tiempo Usado</th>
                      <th className="px-4 py-3 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {examAttemptsHistory.map((att) => (
                      <tr key={att.id} className="hover:bg-white/5 transition">
                        <td className="px-4 py-3 font-bold text-white">{att.examTitle}</td>
                        <td className="px-4 py-3">{att.completedAt}</td>
                        <td className="px-4 py-3 font-mono font-bold text-amber-300">
                          {att.score}% ({att.correctAnswers}/{att.totalQuestions})
                        </td>
                        <td className="px-4 py-3">
                          {att.passed ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                              APROBADO
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 text-[10px] font-bold border border-red-500/30">
                              REPROBADO
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">{att.timeSpentMinutes} min</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => {
                              const match = EVALUATION_EXAMS.find(e => e.id === att.examId);
                              if (match) handleStartExam(match);
                            }}
                            className="text-xs font-bold text-blue-400 hover:underline cursor-pointer"
                          >
                            Reintentar Examen
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 4: ACTIVE QUIZ OR EXAM PLAYER */}
        {/* ======================================================== */}
        {(selectedQuiz || selectedExam) && currentQ && (
          <div className="bg-gradient-to-b from-[#0e163b] to-[#0a0e27] rounded-2xl border border-blue-900/60 p-6 sm:p-8 shadow-2xl space-y-6">
            
            {/* Top Bar Navigation & Timer */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#ff9100]">
                  {selectedQuiz ? `Quiz: ${selectedQuiz.title}` : `Examen: ${selectedExam?.title}`}
                </span>
                <div className="text-xs font-semibold text-gray-300">
                  Pregunta {currentQuestionIndex + 1} de {activeQuestions.length}
                </div>
              </div>

              {/* Timer Widget if Exam */}
              {selectedExam && timeLeftSeconds !== null && (
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-red-950/60 border border-red-500/50 text-red-300 text-xs font-mono font-bold animate-pulse">
                  <Clock className="w-4 h-4 text-red-400" />
                  <span>Tiempo Restante: {formatTimer(timeLeftSeconds)}</span>
                </div>
              )}

              <button
                onClick={handleResetActiveTest}
                className="text-xs text-gray-400 hover:text-white underline cursor-pointer"
              >
                Salir de la Evaluación
              </button>
            </div>

            {/* Question Progress Bar */}
            <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#ff6f00] to-[#ff9100] h-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / activeQuestions.length) * 100}%` }}
              />
            </div>

            {/* QUESTION DISPLAY AREA */}
            <div className="space-y-6">
              
              {/* Question Type Tag */}
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-900/60 text-blue-300 text-[10px] font-bold uppercase tracking-wider border border-blue-700/50">
                  Tipo: {currentQ.type || 'Opción Múltiple'}
                </span>
              </div>

              {/* Question Text */}
              <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
                {currentQ.question}
              </h2>

              {/* Special Graphic / Waveform Image if available */}
              {currentQ.imageUrl && (
                <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-amber-400 font-bold">
                    <ImageIcon className="w-4 h-4" />
                    Gráfico / Oscilograma de Referencia
                  </div>
                  <img
                    src={currentQ.imageUrl}
                    alt="Gráfico de Referencia"
                    className="w-full max-h-64 object-cover rounded-lg border border-white/10"
                  />
                </div>
              )}

              {/* Special Case Scenario Block if available */}
              {currentQ.caseScenario && (
                <div className="p-4 rounded-xl bg-blue-950/50 border border-blue-500/30 space-y-2 text-xs text-gray-200">
                  <div className="font-bold text-blue-300 text-sm">Contexto del Caso Vehicular:</div>
                  <p><strong>Vehículo:</strong> {currentQ.caseScenario.vehicle}</p>
                  <p><strong>Síntoma:</strong> {currentQ.caseScenario.symptom}</p>
                  <p><strong>DTC Registrado:</strong> <span className="text-amber-400 font-mono font-bold">{currentQ.caseScenario.dtc}</span></p>
                  <p className="text-gray-300 italic">{currentQ.caseScenario.background}</p>
                </div>
              )}

              {/* Special Matching Pairs Block if available */}
              {currentQ.matchingPairs && (
                <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
                  <div className="text-xs font-bold text-gray-300">Pareo de Conceptos Técnicos:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {currentQ.matchingPairs.map((pair) => (
                      <div key={pair.id} className="p-2.5 rounded-lg bg-white/5 border border-white/10 space-y-1">
                        <div className="font-bold text-amber-300">{pair.left}</div>
                        <div className="text-gray-300 text-[11px]">➔ {pair.right}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Answer Options */}
              <div className="space-y-3 pt-2">
                {currentQ.options.map((opt, oIdx) => {
                  const isSelected = userAnswers[currentQuestionIndex] === oIdx;
                  const isCorrect = oIdx === currentQ.correctAnswer;

                  let optionStyle = 'bg-white/5 border-white/10 text-gray-200 hover:bg-white/10';

                  if (isSubmitted) {
                    if (isCorrect) {
                      optionStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold';
                    } else if (isSelected && !isCorrect) {
                      optionStyle = 'bg-red-950/80 border-red-500 text-red-200 font-bold';
                    }
                  } else if (isSelected) {
                    optionStyle = 'bg-[#ff6f00]/20 border-[#ff6f00] text-white font-bold ring-2 ring-[#ff6f00]/50';
                  }

                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelectOption(currentQuestionIndex, oIdx)}
                      disabled={isSubmitted}
                      className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm transition flex items-center justify-between gap-3 cursor-pointer ${optionStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-black/40 border border-white/20 text-xs font-bold flex items-center justify-center shrink-0">
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>

                      {isSubmitted && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                      {isSubmitted && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Feedback / Explanation Box when Submitted */}
              {isSubmitted && (
                <div className="p-4 rounded-xl bg-blue-950/80 border border-blue-500/40 text-xs space-y-1.5 animate-in fade-in">
                  <div className="font-bold text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Explicación Técnica del Instructor:
                  </div>
                  <p className="text-gray-200 leading-relaxed">{currentQ.explanation}</p>
                </div>
              )}
            </div>

            {/* BOTTOM STEP CONTROLS */}
            <div className="flex items-center justify-between border-t border-white/10 pt-4">
              <button
                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-gray-300 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
              >
                Anterior
              </button>

              {!isSubmitted ? (
                currentQuestionIndex < activeQuestions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                    className="px-5 py-2.5 rounded-xl bg-[#ff6f00] hover:bg-[#ff8f00] text-xs font-bold text-white transition shadow-lg cursor-pointer"
                  >
                    Siguiente Pregunta
                  </button>
                ) : (
                  <button
                    onClick={handleFinalSubmit}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 text-xs font-extrabold text-white transition shadow-xl cursor-pointer"
                  >
                    Finalizar y Calificar
                  </button>
                )
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleResetActiveTest}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition shadow-lg cursor-pointer"
                  >
                    Volver al Catálogo
                  </button>
                </div>
              )}
            </div>

            {/* RESULTS SUMMARY OVERLAY WHEN SUBMITTED */}
            {isSubmitted && scorePercent !== null && (
              <div className="p-6 rounded-2xl bg-black/60 border border-white/20 space-y-4 text-center">
                <div className="text-3xl font-black text-amber-400 font-mono">
                  Resultado: {scorePercent}%
                </div>
                <div className="text-xs text-gray-300">
                  {passed ? (
                    <span className="text-emerald-400 font-extrabold flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-5 h-5" />
                      ¡Felicidades! Has APROBADO satisfactoriamente la evaluación.
                    </span>
                  ) : (
                    <span className="text-red-400 font-extrabold flex items-center justify-center gap-1">
                      <XCircle className="w-5 h-5" />
                      No has alcanzado el puntaje mínimo requerido. Revisa las explicaciones e inténtalo de nuevo.
                    </span>
                  )}
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
