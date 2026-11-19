import React from 'react';
import { Award, CheckCircle2, AlertTriangle, Clock, MessageSquare, ShieldAlert, X } from 'lucide-react';
import { LabAttempt } from '../../types';

interface LabAttemptSummaryModalProps {
  attempt: LabAttempt;
  labTitle: string;
  onClose: () => void;
  onAskAI?: (prompt: string) => void;
}

export const LabAttemptSummaryModal: React.FC<LabAttemptSummaryModalProps> = ({
  attempt,
  labTitle,
  onClose,
  onAskAI
}) => {
  const isPassed = attempt.score >= 70;

  const handleAskAI = () => {
    const prompt = `Analiza detalladamente los resultados de mi intento de laboratorio en YOVE Academy:
- **Laboratorio**: ${labTitle} (${attempt.labType})
- **Puntuación**: ${attempt.score}% (${isPassed ? 'Aprobado' : 'Requiere Refuerzo'})
- **Errores cometidos**: ${attempt.errorsCount}
- **Pasos ejecutados**: ${attempt.stepsCount}
- **Tiempo empleado**: ${Math.floor(attempt.timeSeconds / 60)} min ${attempt.timeSeconds % 60} seg
- **Explicación del resultado**: ${attempt.explanation}

Por favor proporcióname un análisis técnico de mis respuestas, los conceptos teóricos clave que debo reforzar y recomendaciones prácticas de diagnóstico.`;

    if (onAskAI) {
      onAskAI(prompt);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#0f173a] to-[#080d26] border border-blue-500/40 shadow-2xl space-y-6 text-white">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge & Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/60 text-[#ff9100] text-xs font-black uppercase tracking-wider border border-blue-700/50">
            <Award className="w-4 h-4 text-[#ff9100]" />
            RESUMEN DE RESULTADOS // YOVE LAB
          </div>

          <h2 className="text-2xl font-black text-white">{labTitle}</h2>
          <p className="text-xs text-gray-300">
            Informe técnico del laboratorio práctico con registro de métricas y perseverancia.
          </p>
        </div>

        {/* Results Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase block">Puntuación Final</span>
            <span className={`text-2xl font-black font-mono ${isPassed ? 'text-emerald-400' : 'text-amber-400'}`}>
              {attempt.score}%
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase block">Errores Cometidos</span>
            <span className="text-2xl font-black font-mono text-red-400">
              {attempt.errorsCount}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase block">Tiempo Invertido</span>
            <span className="text-2xl font-black font-mono text-cyan-300 flex items-center justify-center gap-1">
              <Clock className="w-4 h-4 shrink-0" />
              {Math.floor(attempt.timeSeconds / 60)}m {attempt.timeSeconds % 60}s
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase block">XP Ganado</span>
            <span className="text-2xl font-black font-mono text-[#ff9100]">
              +{attempt.xpEarned} XP
            </span>
          </div>
        </div>

        {/* Status Explanation Box */}
        <div className={`p-4 rounded-2xl border space-y-2 text-xs ${
          isPassed ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-100' : 'bg-amber-950/40 border-amber-500/40 text-amber-100'
        }`}>
          <div className="flex items-center gap-2 font-extrabold text-sm">
            {isPassed ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertTriangle className="w-5 h-5 text-amber-400" />}
            <span>{isPassed ? '¡Laboratorio Aprobado Satisfactoriamente!' : 'Laboratorio Completado (Se Recomienda Repaso)'}</span>
          </div>

          <p className="leading-relaxed">{attempt.explanation}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={handleAskAI}
            className="w-full sm:w-1/2 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white font-extrabold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-cyan-300" />
            Explicar Resultado con YOVE AI
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-1/2 py-3 rounded-xl bg-gradient-to-r from-[#ff6f00] to-[#ff9100] text-white font-extrabold text-xs shadow-lg hover:opacity-90 transition cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Continuar a Siguiente Laboratorio</span>
          </button>
        </div>

        {/* Disclaimer */}
        <div className="text-center text-[10px] text-gray-400 font-mono flex items-center justify-center gap-1">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Simulación Educativa Mecatrónica — Estándar SAE J1978 / ISO 15765</span>
        </div>

      </div>
    </div>
  );
};
