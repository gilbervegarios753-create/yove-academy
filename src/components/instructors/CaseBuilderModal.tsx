import React, { useState } from 'react';
import { DiagnosticCase } from '../../types';
import { Stethoscope, Plus, Trash2, X, Wrench, ShieldAlert, Cpu, CheckCircle2 } from 'lucide-react';

interface CaseBuilderModalProps {
  initialCase?: DiagnosticCase;
  onSaveCase: (diagnosticCase: any) => void;
  onClose: () => void;
}

export const CaseBuilderModal: React.FC<CaseBuilderModalProps> = ({
  initialCase,
  onSaveCase,
  onClose
}) => {
  const [title, setTitle] = useState(initialCase?.title || 'Falla de Rendimiento de Motor');
  const [vehicle, setVehicle] = useState(initialCase?.vehicle || 'Toyota Yaris 2019 1.5L 1NZ-FE');
  const [symptom, setSymptom] = useState(initialCase?.symptom || 'Luz Check Engine encendida y ralentí inestable');
  const [dtcCode, setDtcCode] = useState(initialCase?.dtcCode || 'P0171 - System Too Lean (Bank 1)');
  const [category, setCategory] = useState(initialCase?.category || 'Inyección Electrónica');
  const [difficulty, setDifficulty] = useState(initialCase?.difficulty || 'Intermedio');

  // Hints (pistas)
  const [hints, setHints] = useState<{ title: string; content: string; xpPenalty: number }[]>([
    { title: 'Pista 1: Fuel Trims', content: 'Verifica los valores de STFT y LTFT en el flujo de datos del escáner.', xpPenalty: 10 }
  ]);
  const [newHintTitle, setNewHintTitle] = useState('');
  const [newHintContent, setNewHintContent] = useState('');

  // Tests (pruebas)
  const [tests, setTests] = useState<{ testName: string; toolUsed: string; resultValue: string; status: 'Normal' | 'Anómalo' }[]>([
    { testName: 'Prueba de Presión de Riel', toolUsed: 'Manómetro', resultValue: '3.1 bar (45 PSI)', status: 'Normal' },
    { testName: 'Prueba de Humo en Múltiple', toolUsed: 'Máquina de Humo', resultValue: 'Fuga ligera en manguera PCV', status: 'Anómalo' }
  ]);
  const [newTestName, setNewTestName] = useState('');
  const [newTestTool, setNewTestTool] = useState('');
  const [newTestResult, setNewTestResult] = useState('');
  const [newTestStatus, setNewTestStatus] = useState<'Normal' | 'Anómalo'>('Anómalo');

  // Solution
  const [solutionCause, setSolutionCause] = useState('Manguera de ventilación PCV agrietada provocando entrada de aire pirata posterior al MAF.');
  const [solutionProcedure, setSolutionProcedure] = useState('Reemplazar la manguera PCV agrietada, limpiar cuerpo de aceleración y realizar aprendizaje de ralentí con escáner.');

  const handleAddHint = () => {
    if (!newHintTitle || !newHintContent) return;
    setHints(prev => [...prev, { title: newHintTitle, content: newHintContent, xpPenalty: 10 }]);
    setNewHintTitle('');
    setNewHintContent('');
  };

  const handleAddTest = () => {
    if (!newTestName || !newTestResult) return;
    setTests(prev => [...prev, { testName: newTestName, toolUsed: newTestTool || 'Escáner / Multímetro', resultValue: newTestResult, status: newTestStatus }]);
    setNewTestName('');
    setNewTestTool('');
    setNewTestResult('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !vehicle || !symptom) {
      alert('Completa los campos obligatorios: Título, Vehículo y Síntoma.');
      return;
    }

    const compiledCase = {
      id: initialCase?.id || `case-${Date.now()}`,
      title,
      vehicle,
      symptom,
      dtcCode,
      category,
      difficulty,
      pistas: hints,
      pruebas: tests,
      resultados: tests.map(t => `${t.testName}: ${t.resultValue} (${t.status})`),
      solucion: {
        cause: solutionCause,
        procedure: solutionProcedure
      }
    };

    onSaveCase(compiledCase);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col text-white shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Case Builder — Creador de Casos de Diagnóstico</h2>
              <p className="text-xs text-slate-400">Define averías reales con síntomas, pruebas de taller y solución técnica.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Metadata Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-800/60 p-4 rounded-xl border border-slate-700">
            <div>
              <label className="font-bold text-slate-300 block mb-1">Título del Caso Diagnóstico *</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-bold"
              />
            </div>
            <div>
              <label className="font-bold text-slate-300 block mb-1">Vehículo (Año / Marca / Motor) *</label>
              <input
                type="text"
                value={vehicle}
                onChange={e => setVehicle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="font-bold text-slate-300 block mb-1">Síntoma Reportado por el Cliente *</label>
              <textarea
                rows={2}
                value={symptom}
                onChange={e => setSymptom(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="font-bold text-slate-300 block mb-1">Código DTC de Diagnóstico</label>
              <input
                type="text"
                value={dtcCode}
                onChange={e => setDtcCode(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-amber-400 font-mono font-bold"
              />
            </div>
            <div>
              <label className="font-bold text-slate-300 block mb-1">Dificultad del Caso</label>
              <select
                value={difficulty}
                onChange={e => setDifficulty(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-bold"
              >
                <option value="Inicial">Inicial</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Avanzado">Avanzado</option>
                <option value="Experto">Experto</option>
              </select>
            </div>
          </div>

          {/* Tests & Measurements */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <h3 className="font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
              <Wrench className="w-4 h-4" />
              Pruebas de Taller y Mediciones
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <input
                type="text"
                placeholder="Nombre de la Prueba (ej: Caída de masa)"
                value={newTestName}
                onChange={e => setNewTestName(e.target.value)}
                className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
              />
              <input
                type="text"
                placeholder="Instrumento Usado (ej: Fluke 87V)"
                value={newTestTool}
                onChange={e => setNewTestTool(e.target.value)}
                className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
              />
              <input
                type="text"
                placeholder="Resultado (ej: 3.2V - Anómalo)"
                value={newTestResult}
                onChange={e => setNewTestResult(e.target.value)}
                className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
              />
              <button
                type="button"
                onClick={handleAddTest}
                className="py-2 bg-purple-600 hover:bg-purple-500 font-bold text-white rounded-lg transition"
              >
                + Añadir Prueba
              </button>
            </div>

            <div className="space-y-2 pt-2">
              {tests.map((t, idx) => (
                <div key={idx} className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between text-[11px]">
                  <div>
                    <strong className="text-white">{t.testName}</strong> ({t.toolUsed}): <span className="text-amber-300 font-mono">{t.resultValue}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTests(prev => prev.filter((_, i) => i !== idx))}
                    className="text-rose-400 font-bold hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Solution & Root Cause */}
          <div className="p-4 bg-emerald-950/30 rounded-xl border border-emerald-500/30 space-y-3">
            <h3 className="font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Solución y Causa Raíz Verificada
            </h3>
            <div>
              <label className="font-bold text-slate-300 block mb-1">Causa Raíz Determinada</label>
              <input
                type="text"
                value={solutionCause}
                onChange={e => setSolutionCause(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="font-bold text-slate-300 block mb-1">Procedimiento de Reparación Recomendado</label>
              <textarea
                rows={2}
                value={solutionProcedure}
                onChange={e => setSolutionProcedure(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
              />
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 font-bold text-slate-300 hover:bg-slate-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-white shadow"
            >
              Guardar Caso de Diagnóstico
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
