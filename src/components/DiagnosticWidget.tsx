import React, { useState, useEffect, useRef } from 'react';
import { Activity, Zap, RotateCcw, Cpu, Gauge } from 'lucide-react';

export const DiagnosticWidget: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [waveType, setWaveType] = useState<'sine' | 'square' | 'pwm' | 'can'>('sine');
  const [rpm, setRpm] = useState<number>(2500);
  const [voltage, setVoltage] = useState<number>(5);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let offset = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Dark grid background
      ctx.fillStyle = '#0a0e27';
      ctx.fillRect(0, 0, width, height);

      // Draw Oscilloscope Grid Lines
      ctx.strokeStyle = 'rgba(21, 101, 192, 0.2)';
      ctx.lineWidth = 1;

      // Vertical lines
      for (let x = 0; x < width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      // Horizontal lines
      for (let y = 0; y < height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Center axis
      ctx.strokeStyle = 'rgba(255, 111, 0, 0.3)';
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Signal line
      ctx.strokeStyle = '#00e676';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#00e676';
      ctx.shadowBlur = 8;
      ctx.beginPath();

      const speedFactor = (rpm / 1000) * 0.08;
      if (!isPaused) {
        offset += speedFactor;
      }

      const amplitude = (voltage / 12) * (height / 2 - 20);
      const centerY = height / 2;

      for (let x = 0; x < width; x++) {
        let y = centerY;
        const t = (x * 0.03) + offset;

        if (waveType === 'sine') {
          // Sensor Inductivo (CIGÜEÑAL / CKP)
          y = centerY - Math.sin(t) * amplitude;
        } else if (waveType === 'square') {
          // Sensor Hall (CAMSHAFT / CMP)
          const val = Math.sin(t) > 0 ? 1 : -1;
          y = centerY - val * amplitude;
        } else if (waveType === 'pwm') {
          // Señal PWM Inyector / Solenoide
          const cycle = (x + offset * 30) % 60;
          y = cycle < 20 ? centerY - amplitude : centerY + amplitude * 0.5;
        } else if (waveType === 'can') {
          // Bus CAN-H / CAN-L High Speed
          const noise = (Math.random() - 0.5) * 4;
          const bit = Math.floor((x + offset * 50) / 15) % 2 === 0 ? 1 : -1;
          y = centerY - bit * (amplitude * 0.7) + noise;
        }

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();
      ctx.shadowBlur = 0; // reset shadow

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [waveType, rpm, voltage, isPaused]);

  return (
    <div className="bg-[#0a0e27] border border-[#1565c0]/40 rounded-xl p-5 text-white shadow-2xl relative overflow-hidden">
      {/* Decorative ambient light */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#ff6f00]/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#ff6f00] animate-pulse" />
          <h3 className="font-bold text-lg text-white tracking-wide">
            Simulador de Osciloscopio Automotive OBD-II
          </h3>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          Señal en Vivo (Live Data)
        </span>
      </div>

      {/* Main Display Canvas */}
      <div className="relative mb-4 bg-black rounded-lg overflow-hidden border border-gray-800">
        <canvas
          ref={canvasRef}
          width={600}
          height={200}
          className="w-full h-44 sm:h-48 block cursor-crosshair"
        />
        <div className="absolute top-2 left-2 sm:left-3 text-[10px] sm:text-[11px] font-mono text-emerald-400/80 bg-black/75 px-2 py-0.5 rounded border border-emerald-500/20 max-w-[85%] truncate">
          CH1: {voltage}V/div | RPM: {rpm} | Freq: {Math.round((rpm / 60) * 2)} Hz
        </div>
        <div className="absolute bottom-2 right-2 sm:right-3 text-[10px] sm:text-[11px] font-mono text-amber-400/80 bg-black/75 px-2 py-0.5 rounded border border-amber-500/20 max-w-[85%] truncate">
          {waveType === 'sine' && 'Sensor CKP (Inductivo)'}
          {waveType === 'square' && 'Sensor Hall (CMP)'}
          {waveType === 'pwm' && 'Control PWM (Inyector/VVT)'}
          {waveType === 'can' && 'Bus CAN High (500 kbps)'}
        </div>
      </div>

      {/* Controls Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-medium bg-[#131b3e] p-3.5 rounded-lg border border-blue-900/40">
        {/* Signal Selector */}
        <div>
          <label className="text-gray-400 mb-1.5 block font-semibold">Tipo de Señal de Sensor:</label>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => setWaveType('sine')}
              className={`px-2.5 py-1.5 rounded transition font-medium ${
                waveType === 'sine' ? 'bg-[#ff6f00] text-white font-bold' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Sinusoidal (CKP)
            </button>
            <button
              onClick={() => setWaveType('square')}
              className={`px-2.5 py-1.5 rounded transition font-medium ${
                waveType === 'square' ? 'bg-[#ff6f00] text-white font-bold' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Digital (Hall)
            </button>
            <button
              onClick={() => setWaveType('pwm')}
              className={`px-2.5 py-1.5 rounded transition font-medium ${
                waveType === 'pwm' ? 'bg-[#ff6f00] text-white font-bold' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              PWM (Actuador)
            </button>
            <button
              onClick={() => setWaveType('can')}
              className={`px-2.5 py-1.5 rounded transition font-medium ${
                waveType === 'can' ? 'bg-[#ff6f00] text-white font-bold' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              CAN Bus
            </button>
          </div>
        </div>

        {/* RPM Adjustment */}
        <div className="flex flex-col justify-center">
          <div className="flex justify-between items-center mb-1 text-gray-300">
            <span className="flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-blue-400" />
              Revoluciones Motor:
            </span>
            <span className="font-bold text-[#ff9100]">{rpm} RPM</span>
          </div>
          <input
            type="range"
            min="600"
            max="6000"
            step="100"
            value={rpm}
            onChange={(e) => setRpm(Number(e.target.value))}
            className="w-full accent-[#ff6f00] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-gray-500 mt-1">
            <span>600 Ralentí</span>
            <span>3000 Crucero</span>
            <span>6000 Máx</span>
          </div>
        </div>

        {/* Voltage Adjustment & Pause */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-1 text-gray-300">
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-yellow-400" />
                Amplitud Voltaje:
              </span>
              <span className="font-bold text-yellow-400">{voltage} V</span>
            </div>
            <input
              type="range"
              min="1"
              max="12"
              step="0.5"
              value={voltage}
              onChange={(e) => setVoltage(Number(e.target.value))}
              className="w-full accent-yellow-500 cursor-pointer"
            />
          </div>

          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="flex-1 py-1.5 px-3 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium transition text-center"
            >
              {isPaused ? 'Reanudar' : 'Congelar (Freeze Frame)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
