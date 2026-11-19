import React, { useState } from 'react';
import { LabSimulation } from '../../types';
import { Cpu, Plus, Trash2, X, Activity, Zap, CheckCircle2 } from 'lucide-react';

interface LabBuilderModalProps {
  initialLab?: LabSimulation;
  onSaveLab: (labDefinition: any) => void;
  onClose: () => void;
}

export const LabBuilderModal: React.FC<LabBuilderModalProps> = ({
  initialLab,
  onSaveLab,
  onClose
}) => {
  const [title, setTitle] = useState(initialLab?.title || 'Práctica Práctica de Laboratorio Virtual');
  const [objective, setObjective] = useState(initialLab?.objective || 'Comprobar el funcionamiento del componente bajo carga real.');
  const [instrument, setInstrument] = useState<string>(initialLab?.type || 'oscilloscope');
  const [componentName, setComponentName] = useState(initialLab?.componentName || 'Sensor CKP Hall / Inductivo');
  
  // Parameters
  const [parameters, setParameters] = useState<{ paramName: string; nominalValue: string; unit: string }[]>([
    { paramName: 'Tensión Máxima P-P', nominalValue: '5.0', unit: 'V' },
    { paramName: 'Frecuencia de Señal', nominalValue: '850', unit: 'Hz' }
  ]);
  const [newParamName, setNewParamName] = useState('');
  const [newParamVal, setNewParamVal] = useState('');
  const [newParamUnit, setNewParamUnit] = useState('');

  // Activity Guide
  const [instructions, setInstructions] = useState<string>('1. Conectar punta lógica del canal 1 al terminal de señal.\n2. Configurar la escala vertical en 2V/div y horizontal en 5ms/div.\n3. Encender la simulación y medir el ciclo de trabajo.');
  const [activityChallenge, setActivityChallenge] = useState('Determina si la forma de onda presenta deformación por cortocircuito a masa.');
  const [expectedResult, setExpectedResult] = useState('Señal cuadrada limpia sin picos inductivos parasitarios.');

  const handleAddParameter = () => {
    if (!newParamName || !newParamVal) return;
    setParameters(prev => [...prev, { paramName: newParamName, nominalValue: newParamVal, unit: newParamUnit || 'V' }]);
    setNewParamName('');
    setNewParamVal('');
    setNewParamUnit('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !objective) {
      alert('Completa los campos obligatorios.');
      return;
    }

    const compiledLab = {
      id: initialLab?.id || `lab-${Date.now()}`,
      title,
      objective,
      type: instrument,
      componentName,
      parameters,
      activity: {
        instructions: instructions.split('\n'),
        challenge: activityChallenge,
        expectedResult
      },
      evaluation: {
        passingCondition: expectedResult,
        xpReward: 150
      }
    };

    onSaveLab(compiledLab);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col text-white shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Lab Builder — Creador de Laboratorios Virtuales</h2>
              <p className="text-xs text-slate-400">Diseña simulaciones e instrumentación interactiva para tus alumnos.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-800/60 p-4 rounded-xl border border-slate-700">
            <div>
              <label className="font-bold text-slate-300 block mb-1">Título del Laboratorio *</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-bold"
              />
            </div>
            <div>
              <label className="font-bold text-slate-300 block mb-1">Instrumento Principal *</label>
              <select
                value={instrument}
                onChange={e => setInstrument(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-cyan-400 font-bold"
              >
                <option value="oscilloscope">Osciloscopio Digital (4 Canales)</option>
                <option value="multimeter">Multímetro Digital Automotriz (DMM)</option>
                <option value="canbus">Analizador Redes CAN / LIN Bus</option>
                <option value="scanner">Escáner Diagnóstico OBD-II Live Data</option>
                <option value="ecu_bench">Banco de Pruebas ECU / Inyectores</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="font-bold text-slate-300 block mb-1">Objetivo Didáctico del Laboratorio *</label>
              <textarea
                rows={2}
                value={objective}
                onChange={e => setObjective(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="font-bold text-slate-300 block mb-1">Componente Objetivo</label>
              <input
                type="text"
                value={componentName}
                onChange={e => setComponentName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
              />
            </div>
          </div>

          {/* Parameters Section */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <h3 className="font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Parámetros Eléctricos de Referencia
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <input
                type="text"
                placeholder="Parámetro (ej: Voltaje Vpp)"
                value={newParamName}
                onChange={e => setNewParamName(e.target.value)}
                className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
              />
              <input
                type="text"
                placeholder="Valor Nominal (ej: 12.6)"
                value={newParamVal}
                onChange={e => setNewParamVal(e.target.value)}
                className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
              />
              <input
                type="text"
                placeholder="Unidad (ej: VDC / Hz / %)"
                value={newParamUnit}
                onChange={e => setNewParamUnit(e.target.value)}
                className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
              />
              <button
                type="button"
                onClick={handleAddParameter}
                className="py-2 bg-cyan-600 hover:bg-cyan-500 font-bold text-white rounded-lg transition"
              >
                + Añadir Parámetro
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {parameters.map((p, idx) => (
                <div key={idx} className="px-3 py-1.5 bg-slate-900 rounded-lg border border-slate-800 text-[11px] flex items-center gap-2">
                  <span className="font-bold text-slate-300">{p.paramName}:</span>
                  <span className="text-cyan-400 font-mono font-bold">{p.nominalValue} {p.unit}</span>
                  <button
                    type="button"
                    onClick={() => setParameters(prev => prev.filter((_, i) => i !== idx))}
                    className="text-rose-400 hover:text-rose-300 font-bold ml-1"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Instructions */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <h3 className="font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Guía de Actividad y Criterio de Evaluación
            </h3>
            <div>
              <label className="font-bold text-slate-300 block mb-1">Instrucciones Paso a Paso (una por línea)</label>
              <textarea
                rows={3}
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-[11px]"
              />
            </div>
            <div>
              <label className="font-bold text-slate-300 block mb-1">Resultado Esperado para Aprobación</label>
              <input
                type="text"
                value={expectedResult}
                onChange={e => setExpectedResult(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-emerald-400 font-bold"
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
              className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-bold text-white shadow"
            >
              Guardar Laboratorio Virtual
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
