import React, { useEffect, useRef, useState } from 'react';
import { Radio, Cpu, ShieldCheck, Activity, CheckCircle2, Sparkles, Network } from 'lucide-react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../../lib/gsap';

export const CANBusParallax: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathHRef = useRef<SVGPathElement>(null);
  const pathLRef = useRef<SVGPathElement>(null);

  const [selectedNode, setSelectedNode] = useState<'ecu' | 'abs' | 'tcu' | 'bcm' | 'sgw'>('ecu');

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Animate CAN-High & CAN-Low wave offset on scroll
      if (pathHRef.current && pathLRef.current) {
        const lenH = pathHRef.current.getTotalLength();
        gsap.set([pathHRef.current, pathLRef.current], { strokeDasharray: lenH, strokeDashoffset: lenH });

        gsap.to([pathHRef.current, pathLRef.current], {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
            end: 'bottom 40%',
            scrub: 1,
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const nodesInfo = {
    ecu: {
      name: 'ECU Motor (Engine Control Unit)',
      speed: 'CAN-High Speed (500 kbps)',
      role: 'Transmite datos de RPM, temperatura de motor, posición de acelerador y par motor solicitado.',
      voltage: 'Receso: 2.5V • Dominante CAN-H: 3.5V | CAN-L: 1.5V (Diferencial 2.0V)',
    },
    abs: {
      name: 'Módulo ABS / ESP (Frenos Control de Estabilidad)',
      speed: 'CAN-High Speed (500 kbps)',
      role: 'Transmite velocidad individual de cada rueda de 4 sensores Hall para control de tracción.',
      voltage: 'Resistencia de Terminación de Red: 120 Ω (En paralelo 60 Ω total)',
    },
    tcu: {
      name: 'TCU Transmisión (Transmission Control Unit)',
      speed: 'CAN-High Speed (500 kbps)',
      role: 'Sincroniza los cambios de marcha con el par producido por la ECU de motor.',
      voltage: 'Trama CAN 11-Bit (Estándar) / 29-Bit (Extendida)',
    },
    bcm: {
      name: 'BCM Módulo de Carrocería (Body Control Module)',
      speed: 'CAN-Low Speed (125 kbps)',
      role: 'Gestiona luces, cierre centralizado, elevavidrios y climatizador.',
      voltage: 'Sincronización de Tramas con Chequeo de Error CRC 15-Bit',
    },
    sgw: {
      name: 'SGW Pasarela de Seguridad (Security Gateway)',
      speed: 'Gateway Multicanal Protegido',
      role: 'Bloquea accesos no autorizados por OBD-II para evitar ciberataques y reprogramaciones no autenticadas.',
      voltage: 'Requiere Token de Desbloqueo Digital de Escáner Oficial',
    },
  };

  const curr = nodesInfo[selectedNode];

  return (
    <section ref={containerRef} id="canbus-parallax" className="py-20 bg-[#080c22] text-white relative overflow-hidden border-y border-blue-900/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-900/60 border border-blue-700/50 text-[#ff9100] text-xs font-extrabold uppercase tracking-wider">
            <Network className="w-4 h-4 text-[#ff9100]" />
            Redes Multiplexadas CAN Bus & LIN
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Diagnóstico de Redes & Trama Binaria Diferencial
          </h2>
          <p className="text-sm sm:text-base text-gray-300 font-normal leading-relaxed">
            Comprende cómo viajan los paquetes de datos entre los módulos vehiculares a través del par trenzado CAN-High y CAN-Low.
          </p>

          {/* Node Selector Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
            {(['ecu', 'abs', 'tcu', 'bcm', 'sgw'] as const).map((key) => (
              <button
                key={key}
                onClick={() => setSelectedNode(key)}
                className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer uppercase ${
                  selectedNode === key
                    ? 'bg-[#ff6f00] text-white shadow-lg shadow-orange-600/30 border border-orange-400'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                }`}
              >
                {key}
              </button>
            ))}
          </div>
        </div>

        {/* CAN BUS DIFFERENTIAL WAVEFORM DISPLAY */}
        <div className="bg-slate-950/90 border border-blue-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
          
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-sky-400 animate-ping" />
              <h3 className="text-base font-extrabold text-white">TWISTED PAIR CAN-HIGH & CAN-LOW DIFFERENTIAL BUS</h3>
            </div>
            <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950 px-3 py-1 rounded-lg border border-amber-800">
              TERMINATION: 60 Ω TOTAL
            </span>
          </div>

          {/* SVG Oscilloscope Trace for CAN Differential Signal */}
          <div className="h-44 w-full bg-black rounded-2xl border border-slate-800 p-4 relative overflow-hidden flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 500 120" preserveAspectRatio="none">
              {/* CAN-High Signal (Blue: 2.5V -> 3.5V) */}
              <path
                ref={pathHRef}
                d="M 0 60 L 50 60 L 50 30 L 100 30 L 100 60 L 150 60 L 150 30 L 200 30 L 200 60 L 300 60 L 300 30 L 350 30 L 350 60 L 500 60"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
              />
              {/* CAN-Low Signal (Orange: 2.5V -> 1.5V) */}
              <path
                ref={pathLRef}
                d="M 0 60 L 50 60 L 50 90 L 100 90 L 100 60 L 150 60 L 150 90 L 200 90 L 200 60 L 300 60 L 300 90 L 350 90 L 350 60 L 500 60"
                fill="none"
                stroke="#ff9100"
                strokeWidth="2.5"
              />
            </svg>
            
            <div className="absolute top-3 left-4 text-[10px] font-mono text-sky-300 font-bold">
              CAN-H (Dominante 3.5V / Receso 2.5V)
            </div>
            <div className="absolute bottom-3 left-4 text-[10px] font-mono text-amber-400 font-bold">
              CAN-L (Dominante 1.5V / Receso 2.5V)
            </div>
          </div>

          {/* NODE DETAILS PANEL */}
          <div className="p-6 rounded-2xl bg-blue-950/40 border border-blue-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-extrabold text-white">{curr.name}</h4>
              <span className="text-xs font-mono font-bold text-sky-300 bg-sky-950 px-3 py-1 rounded-lg border border-sky-800">
                {curr.speed}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-normal">{curr.role}</p>
            <div className="pt-2 text-xs font-mono text-amber-300 font-semibold">
              <span>{curr.voltage}</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
