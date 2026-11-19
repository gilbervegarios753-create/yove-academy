import React, { useState } from 'react';
import { Sparkles, Bot, CheckCircle2, ShieldAlert, X, Copy, RefreshCw } from 'lucide-react';

interface AiContentAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyDraft: (content: string) => void;
  topicContext?: string;
}

export const AiContentAssistantModal: React.FC<AiContentAssistantModalProps> = ({
  isOpen,
  onClose,
  onApplyDraft,
  topicContext = ''
}) => {
  const [promptAction, setPromptAction] = useState<'LESSON' | 'EXPLANATION' | 'QUESTIONS' | 'LAB' | 'CASE'>('LESSON');
  const [userQuery, setUserQuery] = useState(topicContext || 'Sensores Hall de Posición de Cigueñal');
  const [loading, setLoading] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleGenerateAiDraft = async () => {
    setLoading(true);
    setError('');
    setGeneratedDraft('');

    try {
      let promptText = '';
      if (promptAction === 'LESSON') {
        promptText = `Genera un borrador académico completo para una lección técnica sobre: ${userQuery}. Incluye: 1. Objetivos Pedagógicos, 2. Teoría de Funcionamiento, 3. Procedimiento de Medición con Multímetro u Osciloscopio, 4. Checklist de Taller y 5. Puntos de Advertencia de Seguridad. Estructura con Markdown claro.`;
      } else if (promptAction === 'EXPLANATION') {
        promptText = `Mejora y profundiza pedagógicamente la siguiente explicación técnica sobre ${userQuery}, agregando analogías mecánicas, valores nominales de voltaje y resistencia típicos.`;
      } else if (promptAction === 'QUESTIONS') {
        promptText = `Genera 3 preguntas técnicas de opción múltiple sobre ${userQuery} con 4 opciones cada una, indicando la opción correcta y la justificación técnica en Markdown.`;
      } else if (promptAction === 'LAB') {
        promptText = `Propón un laboratorio virtual con equipos de diagnóstico (Osciloscopio, Multímetro, Escáner) para verificar ${userQuery}. Incluye objetivos, herramientas y procedimiento paso a paso.`;
      } else {
        promptText = `Crea un caso de estudio de diagnóstico automotriz realista para un vehículo moderno con falla en ${userQuery}. Incluye síntoma, código de falla DTC, pruebas recomendadas y solución.`;
      }

      const res = await fetch('/api/v1/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          systemInstruction: 'Eres YOVE Content AI Assistant, redactor académico experto en mecatrónica automotriz.'
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Error generando contenido con IA');
      }

      setGeneratedDraft(data.response);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0f172a] border border-cyan-500/40 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 bg-[#131e3a] border-b border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-cyan-950 border border-cyan-500/50 rounded-2xl text-cyan-400">
              <Sparkles className="w-6 h-6 animate-pulse text-yellow-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                YOVE AI Content Assistant
                <span className="px-2 py-0.5 bg-cyan-950 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold rounded-md">
                  AI_DRAFT
                </span>
              </h3>
              <p className="text-xs text-slate-400">Asistente Inteligente para Creación y Redacción Académica Mecatrónica</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { id: 'LESSON', label: '📖 Lección' },
              { id: 'EXPLANATION', label: '💡 Explicación' },
              { id: 'QUESTIONS', label: '❓ Preguntas' },
              { id: 'LAB', label: '🔬 Laboratorio' },
              { id: 'CASE', label: '📋 Caso' },
            ].map((act) => (
              <button
                key={act.id}
                onClick={() => setPromptAction(act.id as any)}
                className={`p-2.5 rounded-xl text-xs font-bold border transition ${
                  promptAction === act.id ? 'bg-cyan-600 border-cyan-400 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {act.label}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Tema / Asignatura del Curso</label>
            <input
              type="text"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder="Ej: Inyección Electrónica Directa GDI / Sensores Hall"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <button
            onClick={handleGenerateAiDraft}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-yellow-300" />}
            {loading ? 'Generando Borrador con Inteligencia Artificial...' : 'Generar Borrador AI_DRAFT'}
          </button>

          {/* AI Result Box */}
          {generatedDraft && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                  <Bot className="w-4 h-4" /> Borrador Generado (Estado: AI_DRAFT)
                </span>
                <span className="text-[10px] text-slate-400">Requiere revisión humana previa a publicación</span>
              </div>

              <div className="h-60 bg-[#090d24] border border-cyan-500/30 p-4 rounded-2xl overflow-y-auto text-xs text-slate-200 font-mono whitespace-pre-line leading-relaxed">
                {generatedDraft}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => {
                    onApplyDraft(generatedDraft);
                    onClose();
                  }}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition"
                >
                  <CheckCircle2 className="w-4 h-4" /> Aplicar al Editor Principal
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
