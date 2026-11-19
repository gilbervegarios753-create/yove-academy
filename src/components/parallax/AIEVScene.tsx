import React, { useEffect, useRef, useState } from 'react';
import { Zap, ShieldAlert, Cpu, Activity, CheckCircle2, Sparkles, BatteryCharging } from 'lucide-react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../../lib/gsap';

export const AIEVScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const batteryRef = useRef<HTMLDivElement>(null);
  const inverterRef = useRef<HTMLDivElement>(null);
  const motorRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGPathElement>(null);

  const [activeComponent, setActiveComponent] = useState<'battery' | 'bms' | 'inverter' | 'motor' | 'charger'>('battery');

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      if (!containerRef.current) return;

      // Zoom camera on scroll
      gsap.fromTo(
        containerRef.current,
        { scale: 0.96 },
        {
          scale: 1.0,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );

      // Animate HV Orange Line
      if (lineRef.current) {
        const len = lineRef.current.getTotalLength();
        gsap.set(lineRef.current, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(lineRef.current, {
          strokeDashoffset: 0,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 70%',
            end: 'bottom 50%',
            scrub: 1,
          },
        });
      }

      // Stagger component reveals
      const targets = [batteryRef.current, inverterRef.current, motorRef.current].filter(Boolean);
      if (targets.length > 0) {
        gsap.fromTo(
          targets,
          { opacity: 0, y: 40, scale: 0.92 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 75%',
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const evDetails = {
    battery: {
      title: 'Batería de Alta Tensión (400V / 800V HV)',
      spec: '82 kWh Lithium-Ion NMC • 400V DC',
      desc: 'Paquete modular de celdas con refrigeración líquida de glicol. Almacena la energía eléctrica principal del sistema de tracción.',
      safety: 'Requisito de Seguridad: Desconexión de Servicio MSD (Manual Service Disconnect) previo a mantenimiento.',
    },
    bms: {
      title: 'Sistema de Gestión de Batería (BMS)',
      spec: 'Monitoreo de Celdas Can Bus • Balanceo Activo',
      desc: 'Mide voltaje, corriente y temperatura individual de cada grupo de celdas para prevenir sobrecalentamiento y embalamiento térmico.',
      safety: 'Aislamiento Galvánico & Detección de Fuga a Masa HV (Megóhmetro).',
    },
    inverter: {
      title: 'Inversor de Potencia HV (DC a 3-Fases AC)',
      spec: 'Módulos SiC MOSFET • Frecuencia 10 kHz',
      desc: 'Convierte la corriente continua (DC) de la batería en corriente alterna trifásica (AC) de frecuencia variable para controlar velocidad y torque.',
      safety: 'Condensador de Enlace DC: Requiere tiempo de descarga de seguridad (<5 segundos a <60V).',
    },
    motor: {
      title: 'Motor Eléctrico de Tracción (PMSM)',
      spec: '200 kW (268 HP) • 400 Nm Torque Instantáneo',
      desc: 'Motor Síncrono de Imanes Permanentes. Proporciona aceleración inmediata sin retardos de turbo ni caja de cambios compleja.',
      safety: 'Frenado Regenerativo: Convierte la energía cinética en carga eléctrica durante la desaceleración.',
    },
    charger: {
      title: 'Cargador de A Bordo (OBC) & Conversor DC/DC',
      spec: 'Carga AC 11 kW • DC Fast Charge 150 kW',
      desc: 'Convierte la corriente de la red pública para cargar la batería de tracción y alimenta el sistema auxiliar de 12V.',
      safety: 'Protocolos de Comunicación CCS2 / NACS con Handshake ISO 15118.',
    },
  };

  const curr = evDetails[activeComponent];

  return (
    <section ref={containerRef} id="ev-parallax" className="py-20 bg-[#080d26] text-white relative overflow-hidden border-y border-blue-900/60">
      {/* High Voltage Orange Ambient Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-orange-600/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-950/80 border border-orange-500/50 text-[#ff9100] text-xs font-extrabold uppercase tracking-wider">
            <Zap className="w-4 h-4 text-[#ff9100]" />
            Movilidad Eléctrica de Alta Tensión (HV)
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Especialización en Vehículos Eléctricos (EV)
          </h2>
          <p className="text-sm sm:text-base text-gray-300 font-normal leading-relaxed">
            Aprende los protocolos de desconexión segura, diagnóstico de aislación, gestión de baterías BMS e inversores trifásicos.
          </p>

          {/* Component Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
            {(['battery', 'bms', 'inverter', 'motor', 'charger'] as const).map((key) => (
              <button
                key={key}
                onClick={() => setActiveComponent(key)}
                className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer uppercase ${
                  activeComponent === key
                    ? 'bg-[#ff6f00] text-white shadow-lg shadow-orange-600/30 border border-orange-400'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                }`}
              >
                {key}
              </button>
            ))}
          </div>
        </div>

        {/* HIGH VOLTAGE DRIVETRAIN VISUAL SCENE */}
        <div className="bg-slate-950/90 border border-orange-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
          
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-500 animate-pulse" />
              <h3 className="text-base font-extrabold text-white">LÍNEA DE ALTA TENSIÓN (HIGH VOLTAGE 400V DC / AC)</h3>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-950/80 border border-orange-500/60 rounded-lg text-xs font-mono font-bold text-[#ff9100]">
              <ShieldAlert className="w-4 h-4" />
              <span>RIESGO ELÉCTRICO HV</span>
            </div>
          </div>

          {/* SVG Animated High Voltage Orange Bus Line */}
          <div className="h-44 w-full bg-slate-900 rounded-2xl border border-slate-800 p-4 relative overflow-hidden flex items-center justify-center">
            <svg className="w-full h-full text-orange-500" viewBox="0 0 500 120" preserveAspectRatio="none">
              {/* Battery Block */}
              <rect x="30" y="30" width="120" height="60" rx="8" fill="#1e1b4b" stroke="#f97316" strokeWidth="2" />
              <text x="90" y="65" textAnchor="middle" fill="#f97316" fontSize="12" fontWeight="bold">BATTERY 400V</text>

              {/* Inverter Block */}
              <rect x="210" y="30" width="100" height="60" rx="8" fill="#1e1b4b" stroke="#38bdf8" strokeWidth="2" />
              <text x="260" y="65" textAnchor="middle" fill="#38bdf8" fontSize="12" fontWeight="bold">INVERTER</text>

              {/* Motor Block */}
              <circle cx="420" cy="60" r="35" fill="#1e1b4b" stroke="#10b981" strokeWidth="2" />
              <text x="420" y="65" textAnchor="middle" fill="#10b981" fontSize="12" fontWeight="bold">MOTOR AC</text>

              {/* High Voltage Orange Power Line */}
              <path
                ref={lineRef}
                d="M 150 60 L 210 60 M 310 60 L 385 60"
                fill="none"
                stroke="#ff6f00"
                strokeWidth="4"
              />
            </svg>
          </div>

          {/* ACTIVE COMPONENT DETAILS PANEL */}
          <div className="p-6 rounded-2xl bg-orange-950/30 border border-orange-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-extrabold text-white">{curr.title}</h4>
              <span className="text-xs font-mono font-bold text-[#ff9100] bg-orange-950 px-3 py-1 rounded-lg border border-orange-800">
                {curr.spec}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-normal">{curr.desc}</p>
            
            <div className="pt-2 flex items-center gap-2 text-xs font-mono font-bold text-amber-300 bg-black/40 p-3 rounded-xl border border-white/10">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{curr.safety}</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
