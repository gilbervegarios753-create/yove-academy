import React, { useState } from 'react';
import { HelpCircle, Plus, Trash2, CheckCircle, Clock, Award, Image as ImageIcon, Sparkles } from 'lucide-react';

interface Question {
  id: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'OSCILLOGRAM_IMAGE' | 'MATCHING';
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  imageUrl?: string;
}

interface QuizExamBuilderProps {
  courseId?: string;
  lessonId?: string;
  onSave?: (quizData: any) => void;
}

export const QuizExamBuilder: React.FC<QuizExamBuilderProps> = ({
  courseId,
  lessonId,
  onSave
}) => {
  const [title, setTitle] = useState('Evaluación Técnica de Sensores de Posición');
  const [passingScore, setPassingScore] = useState(80);
  const [timeLimitSeconds, setTimeLimitSeconds] = useState(600); // 10 mins
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 'q1',
      type: 'MULTIPLE_CHOICE',
      question: '¿Qué amplitud de señal analógica se espera en un sensor de posición Hall en condición Key ON / Engine OFF?',
      options: ['0.0V o 5.0V fijo según ventana del reluctor', '12.0V de pulso senoidal', '2.5V AC', '0.0V estricto en todos los pines'],
      correctAnswerIndex: 0,
      explanation: 'El sensor Hall es un dispositivo semiconductor digital. Su salida oscila entre 0V (GND) y el voltaje de referencia (usualmente 5V u 8V) dependiendo de la posición de la ventana metálica.'
    }
  ]);

  const addQuestion = () => {
    const newQ: Question = {
      id: `q-${Date.now()}`,
      type: 'MULTIPLE_CHOICE',
      question: 'Nueva Pregunta Técnica',
      options: ['Opción A', 'Opción B', 'Opción C', 'Opción D'],
      correctAnswerIndex: 0,
      explanation: 'Explicación del fundamento técnico.'
    };
    setQuestions([...questions, newQ]);
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestion = (id: string, updated: Partial<Question>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updated } : q));
  };

  return (
    <div className="bg-[#0f172a] border border-cyan-500/30 p-6 rounded-3xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-950/60 border border-purple-500/40 rounded-2xl text-purple-400">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Constructor de Cuestionarios y Exámenes Técnicos</h3>
            <p className="text-xs text-slate-400">Diseñe evaluaciones con imágenes de oscilogramas, opción múltiple y explicaciones técnicas.</p>
          </div>
        </div>

        <button
          onClick={addQuestion}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4" /> Agregar Pregunta
        </button>
      </div>

      {/* Quiz Config */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div>
          <label className="block text-slate-300 mb-1 font-medium">Título de la Evaluación</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block text-slate-300 mb-1 font-medium">Puntaje Mínimo de Aprobación (%)</label>
          <input
            type="number"
            value={passingScore}
            onChange={(e) => setPassingScore(Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block text-slate-300 mb-1 font-medium">Límite de Tiempo (Segundos)</label>
          <input
            type="number"
            value={timeLimitSeconds}
            onChange={(e) => setTimeLimitSeconds(Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((q, idx) => (
          <div key={q.id} className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-400">Pregunta #{idx + 1}</span>
              <button
                onClick={() => removeQuestion(q.id)}
                className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <input
              type="text"
              value={q.question}
              onChange={(e) => updateQuestion(q.id, { question: e.target.value })}
              placeholder="Enunciado de la pregunta..."
              className="w-full bg-[#0a0e27] border border-slate-700 rounded-xl p-2.5 text-xs text-white outline-none focus:ring-2 focus:ring-purple-500 font-semibold"
            />

            <div className="space-y-2 pl-2">
              <label className="block text-[11px] text-slate-400 font-medium">Opciones de Respuesta (Marque la correcta):</label>
              {q.options.map((opt, optIdx) => (
                <div key={optIdx} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`correct-${q.id}`}
                    checked={q.correctAnswerIndex === optIdx}
                    onChange={() => updateQuestion(q.id, { correctAnswerIndex: optIdx })}
                    className="accent-purple-500 w-4 h-4"
                  />
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => {
                      const newOpts = [...q.options];
                      newOpts[optIdx] = e.target.value;
                      updateQuestion(q.id, { options: newOpts });
                    }}
                    className="flex-1 bg-[#0a0e27] border border-slate-800 rounded-lg p-2 text-xs text-slate-200 outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 font-medium">Fundamento Técnico / Retroalimentación:</label>
              <textarea
                value={q.explanation}
                onChange={(e) => updateQuestion(q.id, { explanation: e.target.value })}
                rows={2}
                className="w-full bg-[#0a0e27] border border-slate-800 rounded-xl p-2.5 text-xs text-slate-300 outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
