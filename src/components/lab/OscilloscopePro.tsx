import React, { useState, useEffect, useRef } from 'react';
import { Activity, Play, Pause, RotateCcw, Sliders, ShieldAlert, Zap, Eye } from 'lucide-react';

export type SignalType = 'ckp' | 'cmp' | 'injector' | 'coil' | 'can_h' | 'can_l';

interface OscilloscopeProProps {
  scenarioTitle?: string;
  defaultSignal?: SignalType;
  faultMode?: 'normal' | 'missing_tooth' | 'timing_mismatch' | 'short_gnd' | 'dirty_signal';
  rpm?: number;
  onStepExecuted?: (stepName: string) => void;
}

export const OscilloscopePro: React.FC<OscilloscopeProProps> = ({
  scenarioTitle = 'Osciloscopio Digital Automotriz de 2 Canales',
  defaultSignal = 'ckp',
  faultMode = 'normal',
  rpm = 2500,
  onStepExecuted
}) => {
  const [signal, setSignal] = useState<SignalType>(defaultSignal);
  const [channelMode, setChannelMode] = useState<'ch1' | 'ch2' | 'dual'>('dual');
  const [voltsPerDiv, setVoltsPerDiv] = useState<number>(2);
  const [timePerDiv, setTimePerDiv] = useState<number>(5);
  const [triggerMode, setTriggerMode] = useState<'auto' | 'normal' | 'single'>('auto');
  const [triggerSlope, setTriggerSlope] = useState<'rising' | 'falling'>('rising');
  const [triggerLevel, setTriggerLevel] = useState<number>(1.5);
  const [coupling, setCoupling] = useState<'dc' | 'ac' | 'gnd'>('dc');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isFrozen, setIsFrozen] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      const centerY = h / 2;

      // Dark CRT Canvas Background
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, w, h);

      // Grid (Scale)
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;

      const gridX = 40 * zoomLevel;
      const gridY = 40;

      for (let x = 0; x < w; x += gridX) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridY) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Zero Axis Line
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(w, centerY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Trigger Line Indicator
      const trigY = centerY - (triggerLevel * (40 / voltsPerDiv));
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 4]);
      ctx.beginPath();
      ctx.moveTo(0, trigY);
      ctx.lineTo(w, trigY);
      ctx.stroke();
      ctx.setLineDash([]);

      const ampScale = (40 / voltsPerDiv) * (coupling === 'ac' ? 1.2 : 1.0);
      const freqScale = (rpm / 1000) * (20 / timePerDiv) * zoomLevel;

      if (coupling === 'gnd') {
        // Flat Ground Line
        ctx.strokeStyle = '#00ffcc';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(w, centerY);
        ctx.stroke();
      } else {
        // Draw Channel 1 Signal
        if (channelMode === 'ch1' || channelMode === 'dual') {
          ctx.strokeStyle = '#00ffcc'; // CH1 Cyan
          ctx.lineWidth = 2.5;
          ctx.beginPath();

          for (let x = 0; x < w; x++) {
            const t = (x + phase) * 0.05 * freqScale;
            let yVal = 0;

            if (signal === 'ckp') {
              // Inductive Sine Wave with missing tooth
              const isMissing = faultMode === 'missing_tooth' && Math.floor(t / 12) % 2 === 0 && (t % 12 > 9);
              yVal = isMissing ? 0 : Math.sin(t) * 2.5;
            } else if (signal === 'cmp') {
              // CMP Hall Square Wave
              const square = Math.sin(t) > 0 ? 1 : -1;
              const noise = faultMode === 'dirty_signal' ? (Math.random() - 0.5) * 1.2 : 0;
              yVal = (square + noise) * 2.0;
            } else if (signal === 'injector') {
              // Injector PWM & Flyback Pulse
              const cycle = (x + phase * 0.5) % 120;
              if (cycle < 20) yVal = -2.5; // Masa (0V)
              else if (cycle < 25) yVal = 8.0; // Flyback Spike (80V Peak)
              else yVal = 1.0; // Battery 12V
            } else if (signal === 'coil') {
              // Ignition Coil Primary Dwell + Flyback
              const cycle = (x + phase * 0.5) % 150;
              if (cycle < 35) yVal = -2.2; // Dwell Conduction
              else if (cycle < 40) yVal = 12.0; // 350V Primary Spike
              else if (cycle < 70) yVal = 0.5; // Spark Burn Line
              else yVal = 1.0;
            } else if (signal === 'can_h') {
              // CAN High
              const bit = faultMode === 'short_gnd' ? 0 : Math.floor(t) % 2 === 0 ? 3.5 : 2.5;
              yVal = bit - 2.5;
            } else if (signal === 'can_l') {
              // CAN Low
              const bit = faultMode === 'short_gnd' ? 0 : Math.floor(t) % 2 === 0 ? 1.5 : 2.5;
              yVal = bit - 2.5;
            }

            const y = centerY - (yVal * ampScale);
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }

        // Draw Channel 2 Signal (Dual Overlay: e.g., CMP or CAN-L)
        if (channelMode === 'ch2' || channelMode === 'dual') {
          ctx.strokeStyle = '#ec4899'; // CH2 Magenta
          ctx.lineWidth = 2;
          ctx.beginPath();

          for (let x = 0; x < w; x++) {
            const t = (x + phase + (faultMode === 'timing_mismatch' ? 40 : 0)) * 0.05 * freqScale;
            let yVal = Math.sin(t * 0.5) > 0 ? 2.0 : -2.0; // Secondary CMP / Reference

            if (signal === 'can_h') {
              // Draw CAN-L on CH2
              const bit = Math.floor(t) % 2 === 0 ? 1.5 : 2.5;
              yVal = bit - 2.5;
            }

            const y = centerY - (yVal * ampScale);
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      }

      if (!isFrozen) phase += 2;
      animRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [signal, channelMode, voltsPerDiv, timePerDiv, triggerMode, triggerSlope, triggerLevel, coupling, zoomLevel, isFrozen, faultMode, rpm]);

  return (
    <div className="p-6 rounded-3xl bg-gradient-to-b from-[#0a0e27] to-[#040714] border border-blue-800/60 shadow-2xl space-y-6">
      {/* Scope Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono text-[10px] font-bold uppercase">
              DSO-2000 PRO
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono text-[10px] font-bold uppercase">
              Simulación Educativa
            </span>
          </div>
          <h3 className="text-lg font-black text-white mt-1">{scenarioTitle}</h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFrozen(!isFrozen)}
            className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2 shadow ${
              isFrozen ? 'bg-amber-600 text-white animate-pulse' : 'bg-white/10 text-gray-200 hover:bg-white/20'
            }`}
          >
            {isFrozen ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            <span>{isFrozen ? 'RUN (Reanudar Captura)' : 'FREEZE FRAME'}</span>
          </button>

          <button
            onClick={() => {
              setVoltsPerDiv(2);
              setTimePerDiv(5);
              setTriggerLevel(1.5);
              setZoomLevel(1);
            }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 transition"
            title="Auto-Set Osciloscopio"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Signal Type Selector */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-300 uppercase block tracking-wider">
          Seleccionar Señal de Entrada Educativa Coherente:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {[
            { id: 'ckp', name: 'CKP Cigüeñal', desc: 'Inductivo / Hall' },
            { id: 'cmp', name: 'CMP Levas', desc: 'Sincronismo VVT' },
            { id: 'injector', name: 'Inyector', desc: 'PWM + Flyback 80V' },
            { id: 'coil', name: 'Bobina Encendido', desc: 'Saturación + 350V' },
            { id: 'can_h', name: 'CAN High', desc: 'Red Bus 2.5V-3.5V' },
            { id: 'can_l', name: 'CAN Low', desc: 'Red Bus 2.5V-1.5V' }
          ].map(s => (
            <button
              key={s.id}
              onClick={() => {
                setSignal(s.id as SignalType);
                if (onStepExecuted) onStepExecuted(`Seleccionada señal ${s.name}`);
              }}
              className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                signal === s.id
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 border-cyan-400 text-white font-bold shadow-md'
                  : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
              }`}
            >
              <p className="text-xs font-black">{s.name}</p>
              <p className="text-[10px] text-gray-300/80">{s.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Scope View Screen & Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* CRT Screen Display (8 Cols) */}
        <div className="lg:col-span-8 space-y-3">
          <div className="relative rounded-2xl overflow-hidden border-2 border-cyan-500/40 bg-[#030712] shadow-2xl">
            <canvas
              ref={canvasRef}
              width={640}
              height={320}
              className="w-full h-[320px] block"
            />

            {/* Live Readouts Badge */}
            <div className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-black/85 border border-cyan-500/30 text-[10px] font-mono space-y-0.5 backdrop-blur-md text-gray-200">
              <p><strong className="text-cyan-400">CH1 Scale:</strong> {voltsPerDiv} V/Div</p>
              <p><strong className="text-pink-400">Time Base:</strong> {timePerDiv} ms/Div</p>
              <p><strong className="text-amber-400">Trigger:</strong> {triggerLevel}V ({triggerSlope.toUpperCase()})</p>
              <p><strong className="text-emerald-400">Zoom:</strong> {zoomLevel}X</p>
            </div>

            {/* Channels Legend */}
            <div className="absolute bottom-3 left-3 flex items-center gap-3 text-[11px] font-mono font-bold">
              <span className="px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-400/50">
                CH1: {signal.toUpperCase()}
              </span>
              {(channelMode === 'ch2' || channelMode === 'dual') && (
                <span className="px-2 py-0.5 rounded bg-pink-950/80 text-pink-300 border border-pink-400/50">
                  CH2: REF / CAM
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Scope Knobs & Parameters Panel (4 Cols) */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4 text-xs">
          <h4 className="font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#ff9100]" />
            Ajuste de Parámetros de Pantalla
          </h4>

          {/* Mode Channel */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Modo Canal</label>
            <div className="grid grid-cols-3 gap-1">
              {['ch1', 'ch2', 'dual'].map(m => (
                <button
                  key={m}
                  onClick={() => setChannelMode(m as any)}
                  className={`py-1.5 rounded-lg font-bold uppercase transition ${
                    channelMode === m ? 'bg-cyan-600 text-white' : 'bg-black/40 text-gray-400'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Volts / Div */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Atenuación Voltios/Div</label>
            <select
              value={voltsPerDiv}
              onChange={(e) => setVoltsPerDiv(Number(e.target.value))}
              className="w-full p-2 rounded-xl bg-black/60 border border-white/20 text-white font-bold"
            >
              <option value={0.5}>0.5 Volts / Div</option>
              <option value={1}>1.0 Volts / Div</option>
              <option value={2}>2.0 Volts / Div</option>
              <option value={5}>5.0 Volts / Div</option>
              <option value={10}>10 Volts / Div</option>
              <option value={20}>20 Volts / Div (Atenuador 10X)</option>
              <option value={50}>50 Volts / Div (Atenuador 20X)</option>
            </select>
          </div>

          {/* Time / Div */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Escala de Tiempo (ms/Div)</label>
            <select
              value={timePerDiv}
              onChange={(e) => setTimePerDiv(Number(e.target.value))}
              className="w-full p-2 rounded-xl bg-black/60 border border-white/20 text-white font-bold"
            >
              <option value={0.5}>0.5 ms / Div (CAN Bus Rápido)</option>
              <option value={1}>1.0 ms / Div</option>
              <option value={2}>2.0 ms / Div</option>
              <option value={5}>5.0 ms / Div (CKP / CMP)</option>
              <option value={10}>10 ms / Div</option>
              <option value={20}>20 ms / Div (Inyectores)</option>
              <option value={50}>50 ms / Div (Lentas Sonda O2)</option>
            </select>
          </div>

          {/* Trigger Settings */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <label className="text-[10px] font-bold text-amber-300 uppercase block">Nivel de Disparo (Trigger)</label>
            <input
              type="range"
              min={-5}
              max={15}
              step={0.5}
              value={triggerLevel}
              onChange={(e) => setTriggerLevel(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 font-mono">
              <span>Slope: {triggerSlope}</span>
              <span className="font-bold text-amber-300">{triggerLevel} Volts</span>
            </div>
          </div>

          {/* Coupling & Zoom */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase block">Acoplamiento</label>
              <select
                value={coupling}
                onChange={(e) => setCoupling(e.target.value as any)}
                className="w-full p-1.5 rounded-lg bg-black/60 border border-white/20 text-white font-bold"
              >
                <option value="dc">DC (Tensión Total)</option>
                <option value="ac">AC (Filtra DC)</option>
                <option value="gnd">GND (Cero Axis)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase block">Zoom Horizontal</label>
              <select
                value={zoomLevel}
                onChange={(e) => setZoomLevel(Number(e.target.value))}
                className="w-full p-1.5 rounded-lg bg-black/60 border border-white/20 text-white font-bold"
              >
                <option value={1}>Zoom 1X</option>
                <option value={2}>Zoom 2X</option>
                <option value={4}>Zoom 4X</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
