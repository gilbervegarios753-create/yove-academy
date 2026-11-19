import React, { useEffect, useRef, useState } from 'react';
import { Zap, Cpu, Activity, CheckCircle2, Sparkles, RefreshCw, Flame } from 'lucide-react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../../lib/gsap';

export const AIHybridScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [driveMode, setDriveMode] = useState<'ev' | 'hybrid' | 'regen'>('hybrid');

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      if (!containerRef.current) return;

      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const modeDetails = {
    ev: {
      title: 'Modo 100% Eléctrico (EV Pure Drive)',
      desc: 'El motor térmico de gasolina permanece apagado. La batería de alta tensión alimenta exclusivamente el motor eléctrico principal para desplazamientos urbanos silenciosos con cero emisiones.',
      iceStatus: 'APAGADO (0 RPM)',
      evStatus: 'ACTIVO (Propulsión Principal)',
      batteryStatus: 'DESCARGA CONTROLADA',
      badgeColor: 'text-emerald-400 bg-emerald-950 border-emerald-800',
    },
    hybrid: {
      title: 'Modo Híbrido Combinado (ICE + Electric Boost)',
      desc: 'El motor de combustión Atkinson trabaja en su punto de máxima eficiencia térmica mientras el motor eléctrico entrega torque adicional durante la aceleración y rebases.',
      iceStatus: 'ACTIVO (2,200 RPM)',
      evStatus: 'BOOST DE POTENCIA (Torque Instantáneo)',
      batteryStatus: 'BALANCE DE CERO',
      badgeColor: 'text-amber-400 bg-amber-950 border-amber-800',
    },
    regen: {
      title: 'Modo Freno Regenerativo (Energy Recovery)',
      desc: 'Al soltar el acelerador o presionar el pedal de freno, el motor eléctrico invierte su funcionamiento para actuar como un generador, convirtiendo la energía cinética en carga eléctrica para la batería.',
      iceStatus: 'CORTE DE INYECCIÓN (Inercia)',
      evStatus: 'MODO GENERADOR AC',
      batteryStatus: 'CARGA RÁPIDA (REGENERACIÓN)',
      badgeColor: 'text-sky-400 bg-sky-950 border-sky-800',
    },
  };

  const curr = modeDetails[driveMode];

  return (
    <section ref={containerRef} id="hybrid-parallax" className="py-20 bg-[#070b20] text-white relative overflow-hidden border-y border-blue-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-900/60 border border-blue-700/50 text-[#ff9100] text-xs font-extrabold uppercase tracking-wider">
            <RefreshCw className="w-4 h-4 text-[#ff9100]" />
            Tecnología de Propulsión Híbrida (HEV / PHEV)
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Gestión Inteligente de Energía Multifuente
          </h2>
          <p className="text-sm sm:text-base text-gray-300 font-normal leading-relaxed">
            Explora la interacción entre el motor de combustión interna, el motor generador eléctrico y el engranaje planetario repartidor de potencia (Power Split Device).
          </p>

          {/* Mode Selector Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              onClick={() => setDriveMode('ev')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                driveMode === 'ev'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>Modo EV Puro</span>
            </button>
            <button
              onClick={() => setDriveMode('hybrid')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                driveMode === 'hybrid'
                  ? 'bg-[#ff6f00] text-white shadow-lg shadow-orange-600/30'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>Modo Híbrido Boost</span>
            </button>
            <button
              onClick={() => setDriveMode('regen')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                driveMode === 'regen'
                  ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              <RefreshCw className="w-4 h-4" />
              <span>Freno Regenerativo</span>
            </button>
          </div>
        </div>

        {/* HYBRID INTERACTIVE DISPLAY BOARD */}
        <div className="bg-slate-950/90 border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
          
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <h3 className="text-lg font-extrabold text-white">{curr.title}</h3>
            <span className={`text-xs font-mono font-bold px-3 py-1 rounded-lg border ${curr.badgeColor}`}>
              HV BATTERY SYNC
            </span>
          </div>

          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-normal">{curr.desc}</p>

          {/* STATUS CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            
            <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-2">
              <div className="text-xs font-extrabold text-gray-400 uppercase">Motor Térmico (ICE)</div>
              <div className="text-sm font-bold text-white">{curr.iceStatus}</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-2">
              <div className="text-xs font-extrabold text-gray-400 uppercase">Motor Eléctrico (MG2)</div>
              <div className="text-sm font-bold text-white">{curr.evStatus}</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-2">
              <div className="text-xs font-extrabold text-gray-400 uppercase">Batería de Alta Tensión</div>
              <div className="text-sm font-bold text-white">{curr.batteryStatus}</div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
