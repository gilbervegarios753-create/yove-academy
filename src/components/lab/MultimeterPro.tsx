import React, { useState } from 'react';
import { Zap, ShieldAlert, Activity, CheckCircle2, RotateCcw, HelpCircle } from 'lucide-react';

export type MultimeterFunction = 'vdc' | 'vac' | 'ohms' | 'continuity' | 'hz_duty';

interface MultimeterProProps {
  scenarioTitle?: string;
  faultMode?: 'normal' | 'high_resistance' | 'short_gnd' | 'open_circuit' | 'sensor_dirty';
  rpm?: number;
  onStepExecuted?: (stepName: string) => void;
}

export const MultimeterPro: React.FC<MultimeterProProps> = ({
  scenarioTitle = 'Laboratorio de Multímetro Digital Automotriz',
  faultMode = 'normal',
  rpm = 2500,
  onStepExecuted
}) => {
  const [selectedFunction, setSelectedFunction] = useState<MultimeterFunction>('vdc');
  const [redProbe, setRedProbe] = useState<string>('ground_drop');
  const [blackProbe, setBlackProbe] = useState<string>('gnd_battery');
  const [isHold, setIsHold] = useState<boolean>(false);

  // Probe Points Available
  const probePoints: { id: string; name: string; voltageBase: number; ohmsBase: number }[] = [
    { id: 'bplus', name: 'Batería B+ (+12.6V)', voltageBase: 12.65, ohmsBase: 0.1 },
    { id: 'gnd_battery', name: 'Masa Batería (-)', voltageBase: 0.0, ohmsBase: 0.05 },
    { id: 'gnd_engine', name: 'Masa Bloque Motor', voltageBase: 0.02, ohmsBase: 0.1 },
    { id: 'ground_drop', name: 'Cable Masa Motor (Bajo Carga)', voltageBase: 0.03, ohmsBase: 0.2 },
    { id: 'vref_5v', name: 'Alimentación VREF ECU (5V)', voltageBase: 5.01, ohmsBase: 1200 },
    { id: 'sensor_ect', name: 'Sensor ECT Signal (90°C)', voltageBase: 0.68, ohmsBase: 240 },
    { id: 'relay_87', name: 'Contacto Relé Pin 87', voltageBase: 12.45, ohmsBase: 0.15 },
    { id: 'can_pin6', name: 'DLC Pin 6 (CAN-H)', voltageBase: 2.70, ohmsBase: 60 }
  ];

  // Calculate Reading
  const getMeasurementReading = () => {
    const pRed = probePoints.find(p => p.id === redProbe) || probePoints[0];
    const pBlack = probePoints.find(p => p.id === blackProbe) || probePoints[1];

    let val = 0;
    let unit = 'VDC';

    switch (selectedFunction) {
      case 'vdc': {
        unit = 'VDC';
        let rawVoltRed = pRed.voltageBase;
        let rawVoltBlack = pBlack.voltageBase;

        // Apply faults
        if (faultMode === 'high_resistance' && (pRed.id === 'ground_drop' || pRed.id === 'gnd_engine')) {
          rawVoltRed = 0.385; // High voltage drop in ground circuit under load
        }
        if (faultMode === 'short_gnd' && pRed.id === 'vref_5v') {
          rawVoltRed = 0.12; // VREF collapsed to ground
        }
        if (faultMode === 'open_circuit' && pRed.id === 'bplus') {
          rawVoltRed = 0.0;
        }

        val = Math.abs(rawVoltRed - rawVoltBlack);
        break;
      }
      case 'vac': {
        unit = 'VAC';
        if (pRed.id === 'can_pin6' || pRed.id === 'sensor_ect') {
          val = 0.12 + (rpm / 6000) * 1.4;
        } else {
          val = 0.01;
        }
        break;
      }
      case 'ohms': {
        unit = 'Ω';
        let baseR = Math.abs(pRed.ohmsBase + pBlack.ohmsBase);
        if (faultMode === 'high_resistance' && (pRed.id === 'ground_drop' || pRed.id === 'gnd_engine')) {
          baseR = 48.5; // High resistance!
        }
        if (faultMode === 'open_circuit') {
          return { valueDisplay: 'O.L (Circuito Abierto)', unit: 'MΩ', status: 'critical', note: 'Resistencia infinita' };
        }
        if (baseR > 1000) {
          return { valueDisplay: (baseR / 1000).toFixed(2), unit: 'kΩ', status: 'normal', note: 'Rango Kilo-Ohmios' };
        }
        val = baseR;
        break;
      }
      case 'continuity': {
        let baseR = Math.abs(pRed.ohmsBase + pBlack.ohmsBase);
        if (faultMode === 'high_resistance' && (pRed.id === 'ground_drop' || pRed.id === 'gnd_engine')) {
          return { valueDisplay: 'SIN CONTINUIDAD (48.5 Ω)', unit: 'BEEP OFF', status: 'critical', note: 'Resistencia parásita impidió continuidad' };
        }
        if (baseR < 30) {
          return { valueDisplay: 'BEEP! CONTINUO (0.2 Ω)', unit: 'BEEP ON', status: 'normal', note: 'Continuidad eléctrica detectada (<30Ω)' };
        } else {
          return { valueDisplay: 'O.L (Sin Beeper)', unit: 'BEEP OFF', status: 'warning', note: 'Resistencia elevada' };
        }
      }
      case 'hz_duty': {
        unit = 'Hz';
        if (pRed.id === 'can_pin6') {
          val = 50000;
          return { valueDisplay: '50.0 kHz (50% Duty)', unit: 'kHz / %', status: 'normal', note: 'Red CAN-HS 500 kbps' };
        }
        val = (rpm / 60) * 2; // Frequency proportional to RPM
        return { valueDisplay: `${val.toFixed(1)} Hz (${(35 + (rpm / 6000) * 30).toFixed(0)}% Duty)`, unit: 'Hz / %', status: 'normal', note: 'Frecuencia de pulso en tiempo real' };
      }
    }

    let status = 'normal';
    let note = 'Medición dentro de parámetros esperados';

    if (faultMode === 'high_resistance' && val > 0.1) {
      status = 'critical';
      note = 'Caída de tensión excesiva (>100mV). Indique resistencia parásita por sulfatación o arnés fatigado.';
    }

    return {
      valueDisplay: val.toFixed(3),
      unit,
      status,
      note
    };
  };

  const reading = getMeasurementReading();

  const handleSelectPoint = (type: 'red' | 'black', id: string) => {
    if (type === 'red') setRedProbe(id);
    else setBlackProbe(id);
    if (onStepExecuted) {
      onStepExecuted(`Colocada puntera ${type === 'red' ? 'roja' : 'negra'} en ${id}`);
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-gradient-to-b from-[#0e163d] to-[#080d24] border border-blue-800/60 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono text-[10px] font-bold uppercase">
              Instrumento DMM v4.0
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono text-[10px] font-bold uppercase">
              Simulación Educativa
            </span>
          </div>
          <h3 className="text-lg font-black text-white mt-1">{scenarioTitle}</h3>
        </div>

        <button
          onClick={() => setIsHold(!isHold)}
          className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2 shadow ${
            isHold ? 'bg-amber-600 text-white animate-pulse' : 'bg-white/10 text-gray-200 hover:bg-white/20'
          }`}
        >
          <Activity className="w-4 h-4 text-amber-200" />
          <span>{isHold ? 'HOLD (Lectura Congelada)' : 'HOLD Data'}</span>
        </button>
      </div>

      {/* Multimeter Body Display & Control Dial */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* LCD Digital Display Screen (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#040817] border-2 border-blue-500/40 shadow-inner space-y-4 relative overflow-hidden">
          <div className="absolute top-2 right-3 text-[10px] font-mono text-cyan-400/80 font-bold uppercase tracking-widest">
            TRUE RMS AUTOMOTIVE DMM
          </div>

          <div className="pt-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
              LECTURA DIGITAL {isHold ? '(CONGELADA)' : 'EN TIEMPO REAL'}
            </span>

            <div className="flex items-baseline gap-3 my-2">
              <span className="text-4xl sm:text-5xl font-mono font-black text-amber-300 tracking-tight drop-shadow-[0_0_12px_rgba(255,145,0,0.4)]">
                {reading.valueDisplay}
              </span>
              <span className="text-xl font-mono font-extrabold text-cyan-300">
                {reading.unit}
              </span>
            </div>

            {/* Diagnostic Note */}
            <div className="p-3 rounded-xl bg-black/60 border border-white/10 text-xs flex items-start gap-2 mt-3">
              <Zap className={`w-4 h-4 shrink-0 mt-0.5 ${reading.status === 'critical' ? 'text-red-400' : 'text-emerald-400'}`} />
              <p className="text-gray-200">
                <strong>Análisis Diagnóstico:</strong> {reading.note}
              </p>
            </div>
          </div>

          {/* Probes Connection Bar */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10 text-xs">
            <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-500/40 space-y-1">
              <span className="text-[10px] font-bold text-red-300 uppercase block">🔴 Punta Roja (+)</span>
              <span className="text-xs font-extrabold text-white font-mono block truncate">
                {probePoints.find(p => p.id === redProbe)?.name}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-gray-900/90 border border-gray-500/40 space-y-1">
              <span className="text-[10px] font-bold text-gray-300 uppercase block">⚫ Punta Negra (-) COM</span>
              <span className="text-xs font-extrabold text-white font-mono block truncate">
                {probePoints.find(p => p.id === blackProbe)?.name}
              </span>
            </div>
          </div>
        </div>

        {/* Rotative Dial Mode Selector (5 Cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
          <label className="text-xs font-extrabold uppercase text-gray-300 tracking-wider flex items-center gap-1.5">
            <RotateCcw className="w-4 h-4 text-[#ff9100]" />
            Selector de Función DMM:
          </label>

          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'vdc', label: 'Voltaje DC (V=)', desc: 'Caídas de tensión y sensores' },
              { id: 'vac', label: 'Voltaje AC (V~)', desc: 'Sensores VR inductivos' },
              { id: 'ohms', label: 'Resistencia (Ω)', desc: 'Resistencia en frío NTC' },
              { id: 'continuity', label: 'Continuidad (BEEP)', desc: 'Verificación de arnés' },
              { id: 'hz_duty', label: 'Frecuencia / Duty %', desc: 'Señales PWM y CAN' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setSelectedFunction(f.id as MultimeterFunction)}
                className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                  selectedFunction === f.id
                    ? 'bg-gradient-to-r from-[#ff6f00] to-[#ff9100] border-amber-300 text-white font-bold shadow-md'
                    : 'bg-black/40 border-white/10 text-gray-300 hover:bg-white/10'
                }`}
              >
                <p className="text-xs font-black">{f.label}</p>
                <p className="text-[10px] text-gray-200/80">{f.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Circuit Probing Node Selector */}
      <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3">
        <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          Conectar Punteras de Prueba en el Circuito del Vehículo
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Red Probe Options */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-red-400 uppercase block">🔴 Seleccionar Punto para Punta Roja (+):</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {probePoints.map(p => (
                <button
                  key={`red-${p.id}`}
                  onClick={() => handleSelectPoint('red', p.id)}
                  className={`px-3 py-2 rounded-xl text-left font-bold text-[11px] transition cursor-pointer border ${
                    redProbe === p.id
                      ? 'bg-red-600 border-red-300 text-white shadow'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Black Probe Options */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-400 uppercase block">⚫ Seleccionar Punto para Punta Negra (- COM):</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {probePoints.map(p => (
                <button
                  key={`black-${p.id}`}
                  onClick={() => handleSelectPoint('black', p.id)}
                  className={`px-3 py-2 rounded-xl text-left font-bold text-[11px] transition cursor-pointer border ${
                    blackProbe === p.id
                      ? 'bg-gray-700 border-gray-300 text-white shadow'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 flex items-center gap-2 text-[11px] text-blue-200">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          <strong>Simulación Educativa Mecatrónica:</strong> Protegida contra sobretensiones y errores de escala sin riesgo de fusibles quemados en el instrumento real.
        </span>
      </div>
    </div>
  );
};
