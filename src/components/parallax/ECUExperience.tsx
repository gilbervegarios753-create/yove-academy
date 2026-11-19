import React, { useEffect, useRef, useState } from 'react';
import { Cpu, Activity, Zap, CheckCircle2, ShieldCheck, Sparkles, Layers, ArrowRight } from 'lucide-react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../../lib/gsap';

export const ECUExperience: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const ecuChipRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<'hardware' | 'pinout' | 'logic'>('hardware');

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      if (!ecuChipRef.current || !inputRef.current || !processRef.current || !outputRef.current || !containerRef.current) return;

      gsap.fromTo(
        ecuChipRef.current,
        { opacity: 0, scale: 0.8, y: 40 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.9,
          ease: 'back.out(1.2)',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
          },
        }
      );

      gsap.fromTo(
        [inputRef.current, processRef.current, outputRef.current],
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ecuChipRef.current,
            start: 'top 70%',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} id="ecu-experience" className="py-20 bg-[#090d24] text-white relative overflow-hidden border-y border-blue-900/50">
      {/* Glow Effects */}
      <div className="absolute top-1/4 right-10 w-[500px] h-[500px] bg-blue-600/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-[#ff6f00]/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-900/60 border border-blue-700/50 text-[#ff9100] text-xs font-extrabold uppercase tracking-wider">
            <Cpu className="w-4 h-4 text-[#ff9100]" />
            Especialización Mecatrónica
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Experiencia Inmersiva: Arquitectura Interna de la ECU
          </h2>
          <p className="text-sm sm:text-base text-gray-300 font-normal leading-relaxed">
            Descubre cómo se estructuran las computadoras automotrices de última generación: desde las fuentes conmutadas hasta los microprocesadores de 32 bits.
          </p>

          {/* Interactive Mode Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              onClick={() => setActiveTab('hardware')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'hardware'
                  ? 'bg-[#ff6f00] text-white shadow-lg shadow-orange-600/30'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              Hardware & Placa
            </button>
            <button
              onClick={() => setActiveTab('pinout')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'pinout'
                  ? 'bg-[#ff6f00] text-white shadow-lg shadow-orange-600/30'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              Pinout & Conectores
            </button>
            <button
              onClick={() => setActiveTab('logic')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'logic'
                  ? 'bg-[#ff6f00] text-white shadow-lg shadow-orange-600/30'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              Lógica INPUT → PROCESS → OUTPUT
            </button>
          </div>
        </div>

        {/* CENTERED ECU VISUAL SHOWCASE */}
        <div ref={ecuChipRef} className="bg-slate-950/90 border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
          
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-900/60 border border-blue-700/50 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-[#ff9100]" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">BOSCH MED17.5.25 // TRICORE SAK-TC1782</h3>
                <span className="text-[11px] text-gray-400 font-mono">32-BIT RISC • 300 MHZ • EEPROM 4MB FLASH</span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-3 py-1 rounded-lg border border-emerald-800">
              BENCH READY
            </span>
          </div>

          {/* SVG ECU Circuit Board & Connector Pins Graphic */}
          <div className="h-52 w-full bg-slate-900 rounded-2xl border border-slate-800 p-4 relative overflow-hidden flex items-center justify-center">
            <svg className="w-full h-full text-blue-400" viewBox="0 0 500 160" preserveAspectRatio="none">
              {/* Main PCB Frame */}
              <rect x="20" y="20" width="460" height="120" rx="12" fill="#0f172a" stroke="#334155" strokeWidth="2" />
              {/* Microcontroller Chip */}
              <rect x="200" y="45" width="100" height="70" rx="6" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
              <text x="250" y="85" textAnchor="middle" fill="#38bdf8" fontSize="12" fontWeight="bold" fontFamily="monospace">
                TRICORE
              </text>
              {/* Gold Pin Array */}
              <g fill="#f59e0b">
                <rect x="35" y="35" width="6" height="20" rx="1" />
                <rect x="45" y="35" width="6" height="20" rx="1" />
                <rect x="55" y="35" width="6" height="20" rx="1" />
                <rect x="65" y="35" width="6" height="20" rx="1" />
                <rect x="75" y="35" width="6" height="20" rx="1" />

                <rect x="35" y="105" width="6" height="20" rx="1" />
                <rect x="45" y="105" width="6" height="20" rx="1" />
                <rect x="55" y="105" width="6" height="20" rx="1" />
                <rect x="65" y="105" width="6" height="20" rx="1" />
                <rect x="75" y="105" width="6" height="20" rx="1" />
              </g>

              {/* Traces from Pins to CPU */}
              <path d="M 85 45 L 200 60" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />
              <path d="M 85 115 L 200 100" fill="none" stroke="#ff9100" strokeWidth="1.5" strokeDasharray="3 3" />
              <path d="M 300 80 L 420 80" fill="none" stroke="#10b981" strokeWidth="2" />
            </svg>
          </div>

          {/* 3-STAGE LOGIC FLOW PIPELINE: INPUT → PROCESS → OUTPUT */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            
            {/* INPUT STAGE */}
            <div ref={inputRef} className="p-5 rounded-2xl bg-blue-950/70 border border-blue-800/60 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sky-300 font-extrabold text-sm">
                  <Activity className="w-4 h-4 text-sky-400" />
                  <span>1. ENTRADAS (INPUT)</span>
                </div>
                <span className="text-[10px] font-mono text-sky-400 font-bold">SENSORES</span>
              </div>
              <ul className="space-y-1.5 text-xs text-gray-300 font-mono">
                <li className="flex justify-between"><span>Pin 12 (CKP Hall):</span> <span className="text-emerald-400 font-bold">5.0V VREF</span></li>
                <li className="flex justify-between"><span>Pin 24 (MAF Air):</span> <span className="text-emerald-400 font-bold">2.4V Sig</span></li>
                <li className="flex justify-between"><span>Pin 36 (Pedal TPS):</span> <span className="text-emerald-400 font-bold">0.8V Sig</span></li>
              </ul>
            </div>

            {/* PROCESS STAGE */}
            <div ref={processRef} className="p-5 rounded-2xl bg-[#0d1338] border border-orange-500/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#ff9100] font-extrabold text-sm">
                  <Cpu className="w-4 h-4 text-[#ff9100]" />
                  <span>2. PROCESO (LOGIC)</span>
                </div>
                <span className="text-[10px] font-mono text-amber-400 font-bold">32-BIT CPU</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed font-normal">
                Compara contra la mapa de inyección en RAM. Aplica correcciones por temperatura, altitud y aceleración.
              </p>
            </div>

            {/* OUTPUT STAGE */}
            <div ref={outputRef} className="p-5 rounded-2xl bg-emerald-950/70 border border-emerald-800/60 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-300 font-extrabold text-sm">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span>3. SALIDAS (OUTPUT)</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">ACTUADORES</span>
              </div>
              <ul className="space-y-1.5 text-xs text-gray-300 font-mono">
                <li className="flex justify-between"><span>Pin 60 (Inyector 1):</span> <span className="text-amber-400 font-bold">Pulso PWM</span></li>
                <li className="flex justify-between"><span>Pin 72 (Bobina 1):</span> <span className="text-amber-400 font-bold">Spark 12V</span></li>
                <li className="flex justify-between"><span>Pin 84 (Relé Bamba):</span> <span className="text-amber-400 font-bold">ON (12V)</span></li>
              </ul>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
