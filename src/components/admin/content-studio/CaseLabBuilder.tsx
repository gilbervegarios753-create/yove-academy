import React, { useState } from 'react';
import { Wrench, Cpu, AlertTriangle, CheckCircle2, Plus, Sparkles, Layers, Sliders, Shield } from 'lucide-react';

export const CaseLabBuilder: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'case' | 'lab'>('case');

  // Case State
  const [caseTitle, setCaseTitle] = useState('Falla de Encendido Intermitente por Sensor CKP Hall');
  const [vehicle, setVehicle] = useState('Toyota Corolla 1.8L 2021');
  const [dtcCode, setDtcCode] = useState('P0335');
  const [symptom, setSymptom] = useState('El motor se apaga espontáneamente al alcanzar 85°C de temperatura operacional.');
  const [solution, setSolution] = useState('Sustitución del sensor de posición de cigueñal (CKP) por falla térmica de elemento Hall.');
  const [xpReward, setXpReward] = useState(150);

  // Lab State
  const [labTitle, setLabTitle] = useState('Análisis de Señales de Comunicación en Red CAN-Bus');
  const [labObjective, setLabObjective] = useState('Capturar e interpretar la forma de onda CAN-High y CAN-Low usando el osciloscopio de 2 canales.');
  const [equipment, setEquipment] = useState('Osciloscopio Automotriz 2 Canales, Punta de Prueba 10X, Scanner OBD-II');

  return (
    <div className="bg-[#0f172a] border border-cyan-500/30 p-6 rounded-3xl space-y-6">
      {/* Tab Selector */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl text-emerald-400">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Creador de Casos de Diagnóstico y Laboratorios Virtuales</h3>
            <p className="text-xs text-slate-400">Diseñe simulaciones prácticas con vehículos reales, osciloscopios y multímetros.</p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('case')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition ${activeTab === 'case' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            📋 Caso de Diagnóstico
          </button>
          <button
            onClick={() => setActiveTab('lab')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition ${activeTab === 'lab' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            🔬 Laboratorio Virtual
          </button>
        </div>
      </div>

      {activeTab === 'case' ? (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Título del Caso de Diagnóstico</label>
              <input
                type="text"
                value={caseTitle}
                onChange={(e) => setCaseTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Vehículo de Prueba</label>
              <input
                type="text"
                value={vehicle}
                onChange={(e) => setVehicle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Código de Falla (DTC)</label>
              <input
                type="text"
                value={dtcCode}
                onChange={(e) => setDtcCode(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Recompensa en Puntos XP</label>
              <input
                type="number"
                value={xpReward}
                onChange={(e) => setXpReward(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">Síntoma Reportado por el Cliente</label>
            <textarea
              value={symptom}
              onChange={(e) => setSymptom(e.target.value)}
              rows={2}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">Solución Técnica Definitiva</label>
            <textarea
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              rows={2}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 mb-1 font-medium">Título de la Práctica de Laboratorio</label>
            <input
              type="text"
              value={labTitle}
              onChange={(e) => setLabTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">Objetivo Pedagógico</label>
            <textarea
              value={labObjective}
              onChange={(e) => setLabObjective(e.target.value)}
              rows={2}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">Instrumentos y Equipos Requeridos</label>
            <input
              type="text"
              value={equipment}
              onChange={(e) => setEquipment(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      )}
    </div>
  );
};
