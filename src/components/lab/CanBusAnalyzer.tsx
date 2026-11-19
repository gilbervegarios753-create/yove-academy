import React, { useState, useEffect } from 'react';
import { Network, Activity, ShieldAlert, Cpu, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';

export type CanFaultType = 'normal' | 'open_line' | 'short_gnd' | 'wrong_termination' | 'no_comm';

interface CanBusAnalyzerProps {
  scenarioTitle?: string;
  onStepExecuted?: (stepName: string) => void;
}

export const CanBusAnalyzer: React.FC<CanBusAnalyzerProps> = ({
  scenarioTitle = 'Laboratorio de Red CAN Bus & Resistencia Terminadora',
  onStepExecuted
}) => {
  const [faultType, setFaultType] = useState<CanFaultType>('normal');
  const [frameCount, setFrameCount] = useState<number>(1042);
  const [activeTab, setActiveTab] = useState<'topology' | 'frames' | 'physical'>('topology');

  // Simulated CAN Frames stream
  const [currentFrame, setCurrentFrame] = useState({
    id: '0x0CF004',
    name: 'Engine RPM & Speed (ECU -> ABS/IC)',
    dlc: 8,
    data: ['F4', '02', '1A', 'C8', '00', '00', '3A', '88'],
    status: 'ACTIVE OK'
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (faultType === 'no_comm' || faultType === 'short_gnd') {
        setCurrentFrame({
          id: '0x000000',
          name: 'BUS OFF / SIN COMUNICACIÓN',
          dlc: 0,
          data: ['--', '--', '--', '--', '--', '--', '--', '--'],
          status: 'BUS OFF (U0100)'
        });
        return;
      }

      setFrameCount(prev => prev + 1);
      const rpmHex = Math.floor(2000 + Math.random() * 800).toString(16).toUpperCase().padStart(4, '0');
      setCurrentFrame({
        id: '0x0CF004',
        name: 'Engine RPM & Torque (ECU Engine)',
        dlc: 8,
        data: [rpmHex.substring(0, 2), rpmHex.substring(2, 4), '1A', 'C8', '00', '00', '3A', '88'],
        status: faultType === 'open_line' ? 'RETRY WARNING' : 'ACTIVE OK'
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [faultType]);

  const getCanPhysicalData = () => {
    switch (faultType) {
      case 'normal':
        return {
          canH: '3.50 V (Dominante) / 2.50 V (Recesivo)',
          canL: '1.50 V (Dominante) / 2.50 V (Recesivo)',
          vDiff: '2.00 V (Dominante) / 0.00 V (Recesivo)',
          resistanceDLC: '60 Ω (Dos R de 120Ω en paralelo)',
          status: 'OK NORMAL',
          statusColor: 'text-emerald-400 bg-emerald-950/80 border-emerald-500/40'
        };
      case 'open_line':
        return {
          canH: '3.50 V / Floating',
          canL: '2.50 V Constante',
          vDiff: 'Inestable / Incompleto',
          resistanceDLC: '120 Ω (Resistencia terminadora faltante)',
          status: 'LÍNEA ABIERTA / DTC U0100',
          statusColor: 'text-amber-300 bg-amber-950/80 border-amber-500/40'
        };
      case 'short_gnd':
        return {
          canH: '0.00 V (Corto a Masa)',
          canL: '0.00 V (Corto a Masa)',
          vDiff: '0.00 V Constante',
          resistanceDLC: '0 Ω (Cortocircuito directo)',
          status: 'BUS OFF (CRÍTICO)',
          statusColor: 'text-red-300 bg-red-950/80 border-red-500/40'
        };
      case 'wrong_termination':
        return {
          canH: '3.80 V (Sobretensión por falta de carga)',
          canL: '1.20 V',
          vDiff: '2.60 V (Distorsionado por reflexiones)',
          resistanceDLC: '120 Ω o >200 Ω',
          status: 'TERMINACIÓN ERRÓNEA',
          statusColor: 'text-orange-300 bg-orange-950/80 border-orange-500/40'
        };
      case 'no_comm':
        return {
          canH: '0.00 V (Módulo apagado)',
          canL: '0.00 V',
          vDiff: '0.00 V',
          resistanceDLC: 'O.L (Módulo desconectado)',
          status: 'COMUNICACIÓN AUSENTE',
          statusColor: 'text-gray-300 bg-gray-900 border-gray-700'
        };
    }
  };

  const phys = getCanPhysicalData();

  return (
    <div className="p-6 rounded-3xl bg-gradient-to-b from-[#0c1233] to-[#050818] border border-blue-800/60 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono text-[10px] font-bold uppercase">
              CAN BUS ANALYZER v4.0
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono text-[10px] font-bold uppercase">
              Simulación Educativa
            </span>
          </div>
          <h3 className="text-lg font-black text-white mt-1">{scenarioTitle}</h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setFaultType('normal');
              if (onStepExecuted) onStepExecuted('Restablecida red CAN Bus a estado normal');
            }}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Resetear Red</span>
          </button>
        </div>
      </div>

      {/* Fault Injection Simulator Selector */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
        <label className="text-xs font-black uppercase text-amber-300 tracking-wider flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          Inyectar Falla Simulada en Capa Física CAN Bus:
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {[
            { id: 'normal', name: 'Estado Normal (60Ω)', desc: 'Sin fallas en bus' },
            { id: 'open_line', name: 'Línea Abierta (120Ω)', desc: 'R de término faltante' },
            { id: 'short_gnd', name: 'Corto a Masa (0Ω)', desc: 'CAN-H cortocircuitado' },
            { id: 'wrong_termination', name: 'Terminación Errónea', desc: 'Impedancia alta' },
            { id: 'no_comm', name: 'Sin Comunicación', desc: 'ECU sin alimentación' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => {
                setFaultType(f.id as CanFaultType);
                if (onStepExecuted) onStepExecuted(`Inyectada falla ${f.name}`);
              }}
              className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                faultType === f.id
                  ? 'bg-gradient-to-r from-red-600 to-amber-600 border-red-300 text-white font-bold shadow-md'
                  : 'bg-black/40 border-white/10 text-gray-300 hover:bg-white/10'
              }`}
            >
              <p className="text-xs font-black">{f.name}</p>
              <p className="text-[10px] text-gray-300/80">{f.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Realtime CAN Physical Measurement Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
        <div className="p-4 rounded-2xl bg-black/60 border border-green-500/30 space-y-1">
          <span className="text-[10px] text-gray-400 font-bold uppercase block">🟢 CAN High (Pin 6 DLC)</span>
          <p className="text-sm font-black text-emerald-300">{phys.canH}</p>
        </div>

        <div className="p-4 rounded-2xl bg-black/60 border border-yellow-500/30 space-y-1">
          <span className="text-[10px] text-gray-400 font-bold uppercase block">🟡 CAN Low (Pin 14 DLC)</span>
          <p className="text-sm font-black text-amber-300">{phys.canL}</p>
        </div>

        <div className="p-4 rounded-2xl bg-black/60 border border-cyan-500/30 space-y-1">
          <span className="text-[10px] text-gray-400 font-bold uppercase block">🔵 Tensión Diferencial Vdiff</span>
          <p className="text-sm font-black text-cyan-300">{phys.vDiff}</p>
        </div>

        <div className="p-4 rounded-2xl bg-black/60 border border-blue-500/30 space-y-1">
          <span className="text-[10px] text-gray-400 font-bold uppercase block">🔌 Impedancia DLC (6-14)</span>
          <p className="text-sm font-black text-white">{phys.resistanceDLC}</p>
        </div>
      </div>

      {/* Bus Status Banner */}
      <div className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-extrabold ${phys.statusColor}`}>
        <div className="flex items-center gap-2">
          <Network className="w-5 h-5 shrink-0" />
          <span>ESTADO DE RED CAN BUS: {phys.status}</span>
        </div>
        <span>Total Tramas Registradas: #{frameCount}</span>
      </div>

      {/* Frame Streamer Box */}
      <div className="p-5 rounded-2xl bg-[#030612] border border-blue-900/80 space-y-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            Sniffer / Analizador de Tramas CAN J1939 / ISO 15765
          </h4>
          <span className="text-[10px] font-mono text-cyan-300">BAUDRATE: 500 kbps (HS-CAN)</span>
        </div>

        <div className="p-4 rounded-xl bg-black/80 border border-white/10 font-mono text-xs space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-gray-300 border-b border-white/10 pb-2">
            <span><strong>Frame ID:</strong> {currentFrame.id}</span>
            <span><strong>Mensaje:</strong> {currentFrame.name}</span>
            <span><strong>DLC:</strong> {currentFrame.dlc} Bytes</span>
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-500/30">
              {currentFrame.status}
            </span>
          </div>

          <div className="pt-2">
            <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Carga de Datos (DATA Payload):</span>
            <div className="flex gap-2">
              {currentFrame.data.map((b, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded bg-blue-950 text-cyan-200 border border-blue-500/40 font-bold text-xs">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Safety Banner */}
      <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 flex items-center gap-2 text-[11px] text-blue-200">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          <strong>Simulación Educativa:</strong> Protocolo CAN 2.0B / ISO 15765. La prueba de impedancia debe realizarse siempre con la batería desconectada.
        </span>
      </div>
    </div>
  );
};
