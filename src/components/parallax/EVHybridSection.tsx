import React, { useEffect, useRef } from 'react';
import { Zap, ShieldCheck, Battery, Gauge, ArrowRight, Activity, Cpu } from 'lucide-react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../../lib/gsap';

export const EVHybridSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    // Only apply horizontal scroll motion on desktop (>= 1024px)
    if (typeof window !== 'undefined' && window.innerWidth >= 1024 && trackRef.current && sectionRef.current) {
      const ctx = gsap.context(() => {
        const totalWidth = trackRef.current!.scrollWidth - trackRef.current!.clientWidth;
        if (totalWidth > 0) {
          gsap.to(trackRef.current, {
            x: -totalWidth * 0.45, // subtle horizontal slide on vertical scroll
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              end: 'bottom 20%',
              scrub: 1,
            },
          });
        }
      }, sectionRef);

      return () => ctx.revert();
    }
  }, []);

  const evCards = [
    {
      id: 'hv',
      title: 'Seguridad en Alta Tensión (HV)',
      description: 'Procedimientos de desenergización, uso de EPP para 1000V DC y verificación de ausencia de tensión.',
      icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
      tag: 'Seguridad 1000V DC'
    },
    {
      id: 'bms',
      title: 'Gestión de Baterías (BMS)',
      description: 'Monitoreo de estado de carga (SoC), estado de salud (SoH), balanceo de celdas y control térmico por líquido.',
      icon: <Battery className="w-6 h-6 text-[#ff9100]" />,
      tag: 'Baterías Ion-Litio'
    },
    {
      id: 'inv',
      title: 'Inversor & Convertidor DC/DC',
      description: 'Controlador trifásico PWM de potencia, rectificación para motor síncrono de imanes permanentes.',
      icon: <Cpu className="w-6 h-6 text-blue-400" />,
      tag: 'Inversor Trifásico'
    },
    {
      id: 'regen',
      title: 'Frenado Regenerativo',
      description: 'Recuperación de energía cinemática durante la desaceleración y gestión combinada con ABS/ESP.',
      icon: <Gauge className="w-6 h-6 text-cyan-400" />,
      tag: 'Eficiencia Energética'
    }
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-[#070a1e] text-white relative overflow-hidden border-y border-blue-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-600/50 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Zap className="w-4 h-4 text-emerald-400" />
            Especialización en Movilidad Eléctrica
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Vehículos Híbridos & Eléctricos (EV / HEV)
          </h2>
          <p className="text-sm sm:text-base text-gray-300 font-normal leading-relaxed">
            Prepárate para la mayor transformación tecnológica de la industria automotriz con diagnóstico de baterías de alta tensión e inversores de potencia.
          </p>
        </div>

        {/* Horizontal Motion Track Container */}
        <div className="overflow-hidden py-4">
          <div
            ref={trackRef}
            className="flex flex-col lg:flex-row gap-6 transition-transform duration-300 ease-out"
          >
            {evCards.map((card) => (
              <div
                key={card.id}
                className="w-full lg:w-[320px] shrink-0 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-xl hover:bg-white/10 transition-all duration-300 space-y-4 group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-white/15 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {card.icon}
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-1 rounded-full">
                    {card.tag}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-white group-hover:text-emerald-300 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-gray-300 mt-2 leading-relaxed font-normal">
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
