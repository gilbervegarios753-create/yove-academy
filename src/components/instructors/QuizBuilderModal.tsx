import React, { useState } from 'react';
import { Quiz, QuizQuestion, QuestionType, MatchingPair } from '../../types';
import { HelpCircle, Plus, Trash2, CheckCircle2, X, AlertCircle, Layers, FileQuestion, ArrowRight } from 'lucide-react';

interface QuizBuilderModalProps {
  initialQuiz?: Quiz;
  onSaveQuiz: (quiz: Quiz) => void;
  onClose: () => void;
}

export const QuizBuilderModal: React.FC<QuizBuilderModalProps> = ({
  initialQuiz,
  onSaveQuiz,
  onClose
}) => {
  const [quizTitle, setQuizTitle] = useState<string>(initialQuiz?.title || 'Quiz de Evaluación Técnica');
  const [passingScore, setPassingScore] = useState<number>(initialQuiz?.passingScore || 80);
  const [questions, setQuestions] = useState<QuizQuestion[]>(initialQuiz?.questions || []);

  // Form state for adding/editing a new question
  const [questionType, setQuestionType] = useState<QuestionType>('multiple-choice');
  const [questionText, setQuestionText] = useState<string>('');
  const [explanation, setExplanation] = useState<string>('');

  // Multiple Choice Options
  const [opt1, setOpt1] = useState('');
  const [opt2, setOpt2] = useState('');
  const [opt3, setOpt3] = useState('');
  const [opt4, setOpt4] = useState('');
  const [correctAnswerIdx, setCorrectAnswerIdx] = useState<number>(0);

  // True/False Option
  const [tfAnswer, setTfAnswer] = useState<number>(0); // 0 for True, 1 for False

  // Matching Pairs
  const [matchingPairs, setMatchingPairs] = useState<MatchingPair[]>([
    { id: 'm1', left: 'Sensor CKP (Inductivo)', right: 'Genera señal senoidal alternada en CA' },
    { id: 'm2', left: 'Sensor Hall', right: 'Genera onda cuadrada digital en VDC' }
  ]);
  const [newLeft, setNewLeft] = useState('');
  const [newRight, setNewRight] = useState('');

  // Diagnostic Case Scenario
  const [caseVehicle, setCaseVehicle] = useState('Toyota Yaris 2019 1.5L');
  const [caseSymptom, setCaseSymptom] = useState('Ralentí inestable a 600 RPM y tirones al acelerar');
  const [caseDtc, setCaseDtc] = useState('P0171 - System Too Lean (Bank 1)');

  const handleAddMatchingPair = () => {
    if (!newLeft || !newRight) return;
    setMatchingPairs(prev => [
      ...prev,
      { id: `m-${Date.now()}`, left: newLeft, right: newRight }
    ]);
    setNewLeft('');
    setNewRight('');
  };

  const handleAddQuestion = () => {
    if (!questionText.trim()) {
      alert('Por favor ingresa el texto de la pregunta.');
      return;
    }

    let finalOptions: string[] = [];
    let finalCorrectAnswer = 0;

    if (questionType === 'multiple-choice') {
      finalOptions = [opt1, opt2, opt3, opt4].filter(o => o.trim().length > 0);
      if (finalOptions.length < 2) {
        alert('Ingresa al menos 2 opciones de respuesta.');
        return;
      }
      finalCorrectAnswer = correctAnswerIdx;
    } else if (questionType === 'true-false') {
      finalOptions = ['Verdadero (True)', 'Falso (False)'];
      finalCorrectAnswer = tfAnswer;
    } else if (questionType === 'matching') {
      finalOptions = matchingPairs.map(p => `${p.left} ➔ ${p.right}`);
      finalCorrectAnswer = 0;
    } else if (questionType === 'case') {
      finalOptions = [opt1, opt2, opt3, opt4].filter(o => o.trim().length > 0);
      if (finalOptions.length < 2) {
        finalOptions = [
          'Fuga de aire de admisión / vacío no contabilizado por el MAF.',
          'Bomba de gasolina defectuosa que entrega baja presión.',
          'Inyector obstruido en cilindro #1.',
          'Falla interna de compresión de motor.'
        ];
      }
      finalCorrectAnswer = correctAnswerIdx;
    }

    const newQ: QuizQuestion = {
      id: `q-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type: questionType,
      question: questionText,
      options: finalOptions,
      correctAnswer: finalCorrectAnswer,
      explanation: explanation || 'Principio técnico verificado por el instructor.',
      matchingPairs: questionType === 'matching' ? matchingPairs : undefined,
      caseScenario: questionType === 'case' ? {
        vehicle: caseVehicle,
        symptom: caseSymptom,
        dtc: caseDtc,
        background: 'Análisis de datos congelados (Freeze Frame) y ajuste de combustible (Fuel Trims).'
      } : undefined
    };

    setQuestions(prev => [...prev, newQ]);

    // Reset Form
    setQuestionText('');
    setExplanation('');
    setOpt1('');
    setOpt2('');
    setOpt3('');
    setOpt4('');
  };

  const handleRemoveQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const handleSave = () => {
    if (questions.length === 0) {
      alert('Debes agregar al menos una pregunta al quiz.');
      return;
    }

    const compiledQuiz: Quiz = {
      id: initialQuiz?.id || `quiz-${Date.now()}`,
      title: quizTitle,
      passingScore,
      questions
    };

    onSaveQuiz(compiledQuiz);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col text-white shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Quiz Builder — Creador de Evaluaciones</h2>
              <p className="text-xs text-slate-400">Configura preguntas técnicas con soporte para 4 formatos de evaluación.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* General Quiz Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-800/60 p-4 rounded-xl border border-slate-700/80">
            <div className="sm:col-span-2">
              <label className="font-bold text-slate-300 block mb-1">Título del Quiz *</label>
              <input
                type="text"
                value={quizTitle}
                onChange={e => setQuizTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-semibold focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="font-bold text-slate-300 block mb-1">Puntaje Mínimo para Aprobar (%)</label>
              <input
                type="number"
                value={passingScore}
                onChange={e => setPassingScore(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-amber-400 font-bold focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* New Question Constructor */}
          <div className="p-5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5 text-xs">
                <FileQuestion className="w-4 h-4" />
                Añadir Nueva Pregunta al Quiz
              </h3>
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                <button
                  type="button"
                  onClick={() => setQuestionType('multiple-choice')}
                  className={`px-2.5 py-1 rounded font-bold transition text-[11px] ${
                    questionType === 'multiple-choice' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Opción Múltiple
                </button>
                <button
                  type="button"
                  onClick={() => setQuestionType('true-false')}
                  className={`px-2.5 py-1 rounded font-bold transition text-[11px] ${
                    questionType === 'true-false' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Verdadero / Falso
                </button>
                <button
                  type="button"
                  onClick={() => setQuestionType('matching')}
                  className={`px-2.5 py-1 rounded font-bold transition text-[11px] ${
                    questionType === 'matching' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Emparejamiento
                </button>
                <button
                  type="button"
                  onClick={() => setQuestionType('case')}
                  className={`px-2.5 py-1 rounded font-bold transition text-[11px] ${
                    questionType === 'case' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Caso Diagnóstico
                </button>
              </div>
            </div>

            {/* Question Text */}
            <div>
              <label className="font-bold text-slate-300 block mb-1">Enunciado / Pregunta *</label>
              <textarea
                rows={2}
                placeholder="Ej: ¿Cuál es el procedimiento correcto para comprobar la señal de un sensor CKP inductivo?"
                value={questionText}
                onChange={e => setQuestionText(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-medium focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Form Fields according to Question Type */}
            {questionType === 'multiple-choice' && (
              <div className="space-y-3">
                <label className="font-bold text-slate-300 block">Opciones de Respuesta *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Opción A"
                    value={opt1}
                    onChange={e => setOpt1(e.target.value)}
                    className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  />
                  <input
                    type="text"
                    placeholder="Opción B"
                    value={opt2}
                    onChange={e => setOpt2(e.target.value)}
                    className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  />
                  <input
                    type="text"
                    placeholder="Opción C"
                    value={opt3}
                    onChange={e => setOpt3(e.target.value)}
                    className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  />
                  <input
                    type="text"
                    placeholder="Opción D"
                    value={opt4}
                    onChange={e => setOpt4(e.target.value)}
                    className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <span className="font-bold text-slate-300">Respuesta Correcta:</span>
                  <select
                    value={correctAnswerIdx}
                    onChange={e => setCorrectAnswerIdx(Number(e.target.value))}
                    className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg font-bold text-emerald-400"
                  >
                    <option value={0}>Opción A</option>
                    <option value={1}>Opción B</option>
                    <option value={2}>Opción C</option>
                    <option value={3}>Opción D</option>
                  </select>
                </div>
              </div>
            )}

            {questionType === 'true-false' && (
              <div className="flex items-center gap-4 bg-slate-900 p-3 rounded-lg border border-slate-800">
                <span className="font-bold text-slate-300">Selecciona la Respuesta Correcta:</span>
                <label className="flex items-center gap-1.5 font-bold cursor-pointer text-emerald-400">
                  <input
                    type="radio"
                    name="tf"
                    checked={tfAnswer === 0}
                    onChange={() => setTfAnswer(0)}
                  />
                  <span>Verdadero (True)</span>
                </label>
                <label className="flex items-center gap-1.5 font-bold cursor-pointer text-rose-400">
                  <input
                    type="radio"
                    name="tf"
                    checked={tfAnswer === 1}
                    onChange={() => setTfAnswer(1)}
                  />
                  <span>Falso (False)</span>
                </label>
              </div>
            )}

            {questionType === 'matching' && (
              <div className="space-y-3 bg-slate-900 p-3.5 rounded-lg border border-slate-800">
                <label className="font-bold text-slate-300 block">Pares de Emparejamiento (Término ➔ Definición) *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Término / Componente (ej: Multímetro VDC)"
                    value={newLeft}
                    onChange={e => setNewLeft(e.target.value)}
                    className="px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Definición / Función (ej: Mide voltajes en corriente continua)"
                    value={newRight}
                    onChange={e => setNewRight(e.target.value)}
                    className="px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddMatchingPair}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 font-bold text-white rounded-lg transition"
                >
                  + Añadir Par
                </button>

                <div className="space-y-1.5 pt-2">
                  {matchingPairs.map((p, idx) => (
                    <div key={p.id || idx} className="p-2 bg-slate-950 rounded border border-slate-800 flex items-center justify-between text-[11px]">
                      <span><strong className="text-blue-400">{p.left}</strong> ➔ {p.right}</span>
                      <button
                        type="button"
                        onClick={() => setMatchingPairs(prev => prev.filter(m => m.id !== p.id))}
                        className="text-rose-400 font-bold hover:underline"
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {questionType === 'case' && (
              <div className="space-y-3 bg-purple-950/40 p-3.5 rounded-lg border border-purple-500/30">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="font-bold text-purple-300 block mb-1">Vehículo del Caso</label>
                    <input
                      type="text"
                      value={caseVehicle}
                      onChange={e => setCaseVehicle(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-purple-300 block mb-1">Síntoma</label>
                    <input
                      type="text"
                      value={caseSymptom}
                      onChange={e => setCaseSymptom(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-purple-300 block mb-1">DTC Registrado</label>
                    <input
                      type="text"
                      value={caseDtc}
                      onChange={e => setCaseDtc(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-amber-400 font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="font-bold text-slate-300 block">Opciones de Decisión Diagnóstica *</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Opción A (ej: Fuga de vacío en múltiple)"
                      value={opt1}
                      onChange={e => setOpt1(e.target.value)}
                      className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                    />
                    <input
                      type="text"
                      placeholder="Opción B (ej: Presión de combustible baja)"
                      value={opt2}
                      onChange={e => setOpt2(e.target.value)}
                      className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                    />
                    <input
                      type="text"
                      placeholder="Opción C (ej: Sensor O2 defectuoso)"
                      value={opt3}
                      onChange={e => setOpt3(e.target.value)}
                      className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                    />
                    <input
                      type="text"
                      placeholder="Opción D (ej: Falla interna de PCM)"
                      value={opt4}
                      onChange={e => setOpt4(e.target.value)}
                      className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="font-bold text-slate-300">Respuesta Correcta:</span>
                    <select
                      value={correctAnswerIdx}
                      onChange={e => setCorrectAnswerIdx(Number(e.target.value))}
                      className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg font-bold text-emerald-400"
                    >
                      <option value={0}>Opción A</option>
                      <option value={1}>Opción B</option>
                      <option value={2}>Opción C</option>
                      <option value={3}>Opción D</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Explanation */}
            <div>
              <label className="font-bold text-slate-300 block mb-1">Explicación Técnica para el Estudiante</label>
              <input
                type="text"
                placeholder="Explicación del fundamento técnico que justifica la respuesta correcta."
                value={explanation}
                onChange={e => setExplanation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-medium"
              />
            </div>

            <button
              type="button"
              onClick={handleAddQuestion}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 font-bold text-white rounded-xl shadow transition flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Añadir esta Pregunta al Quiz</span>
            </button>
          </div>

          {/* Added Questions Roster */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px] flex items-center justify-between">
              <span>Preguntas Configuradas ({questions.length})</span>
            </h4>

            {questions.length === 0 ? (
              <div className="p-6 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
                Aún no has agregado preguntas a esta evaluación.
              </div>
            ) : (
              <div className="space-y-2">
                {questions.map((q, idx) => (
                  <div key={q.id || idx} className="p-3 bg-slate-800/80 border border-slate-700 rounded-xl space-y-1.5 flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-blue-900/80 text-blue-300 font-bold text-[10px] uppercase">
                          {q.type || 'Multiple-Choice'}
                        </span>
                        <span className="font-bold text-white">{idx + 1}. {q.question}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 italic">Explicación: {q.explanation}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveQuestion(q.id)}
                      className="text-rose-400 hover:text-rose-300 p-1 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-400">{questions.length} pregunta(s) lista(s) para evaluación</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-xs text-slate-300"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white shadow"
            >
              Guardar Quiz en el Módulo
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
