import React, { useEffect, useRef, useState } from 'react';
import { Award, CheckCircle2, Trophy, Compass, ArrowRight } from 'lucide-react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../../lib/gsap';

export const TimelineSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineFillRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 70%',
        end: 'bottom 30%',
        onUpdate: (self) => {
          const p = Math.min(100, Math.max(0, self.progress * 100));
          setScrollProgress(p);
          if (lineFillRef.current) {
            lineFillRef.current.style.height = `${p}%`;
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const stages = [
    { num: '01', title: 'Fundamentos Automotrices', desc: 'Sistemas del vehículo, herramientas de taller y seguridad.' },
    { num: '02', title: 'Mecánica de Motores', desc: 'Ciclo Otto y Diesel, sincronización y metrología.' },
    { num: '03', title: 'Electricidad Automotriz', desc: 'Ley de Ohm, multímetro, relés y caída de tensión.' },
    { num: '04', title: 'Electrónica & Componentes', desc: 'Semiconductores, transistores, sensores y actuadores.' },
    { num: '05', title: 'Diagnóstico Electrónico', desc: 'Lectura de diagramas, scanner OBD-II y osciloscopio.' },
    { num: '06', title: 'Reparación de ECUs', desc: 'Fuentes conmutadas, drivers y reprogramación Bench.' },
    { num: '07', title: 'Redes CAN Bus & LIN', desc: 'Redes multiplexadas, gateway y oscilogramas CAN-H/L.' },
    { num: '08', title: 'Vehículos Híbridos (HEV)', desc: 'Gestión de baterías HV, inversores y seguridad HV.' },
    { num: '09', title: 'Vehículos Eléctricos (EV)', desc: 'Motores síncronos, cargadores J1772/CCS2 y BMS.' },
    { num: '10', title: 'Especialización & Máster', desc: 'Certificación profesional de graduación YOVE Academy.' }
  ];

  return (
    <section ref={sectionRef} id="timeline" className="py-20 bg-[#0a0e27] text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-[#ff9100] text-xs font-bold uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            Ruta de Formación Modular
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Tu Camino en YOVE Academy
          </h2>
          <p className="text-sm sm:text-base text-gray-300 font-normal leading-relaxed">
            Una trayectoria completa estructurada en 10 etapas progresivas para llevarte de nivel inicial a especialista certificado.
          </p>
        </div>

        {/* Timeline Line & 10 Stages */}
        <div className="relative max-w-4xl mx-auto pt-6">
          
          {/* Vertical Progress Bar Container */}
          <div className="absolute left-4 sm:left-1/2 top-10 bottom-10 w-1 bg-white/10 -translate-x-1/2 rounded-full overflow-hidden">
            <div
              ref={lineFillRef}
              className="w-full bg-gradient-to-b from-[#ff6f00] via-[#ff9100] to-emerald-400 transition-all duration-150 ease-out rounded-full"
              style={{ height: `${scrollProgress}%` }}
            />
          </div>

          {/* 10 Stages List */}
          <div className="space-y-8 relative">
            {stages.map((stg, idx) => {
              const stagePct = ((idx + 1) / stages.length) * 100;
              const isActive = scrollProgress >= stagePct - 10;
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={stg.num}
                  className={`flex flex-col sm:flex-row items-start sm:items-center ${
                    isEven ? 'sm:flex-row-reverse' : ''
                  } gap-6 sm:gap-12 relative`}
                >
                  {/* Step Node Marker */}
                  <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-2 bg-[#0a0e27] flex items-center justify-center z-10 transition-colors duration-300 shrink-0">
                    <span
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        isActive ? 'bg-[#ff6f00] scale-125 shadow-[0_0_12px_#ff6f00]' : 'bg-slate-600'
                      }`}
                    />
                  </div>

                  {/* Stage Card */}
                  <div className={`pl-12 sm:pl-0 sm:w-1/2 ${isEven ? 'sm:text-right' : 'sm:text-left'}`}>
                    <div
                      className={`p-5 rounded-2xl border transition-all duration-300 ${
                        isActive
                          ? 'bg-white/10 border-[#ff6f00]/50 shadow-xl'
                          : 'bg-white/5 border-white/10 opacity-70'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1 justify-start sm:justify-start">
                        <span className="text-xs font-mono font-black text-[#ff9100]">
                          ETAPA {stg.num}
                        </span>
                        {isActive && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                      </div>

                      <h3 className="text-base font-extrabold text-white">
                        {stg.title}
                      </h3>

                      <p className="text-xs text-gray-300 mt-1 leading-relaxed font-normal">
                        {stg.desc}
                      </p>
                    </div>
                  </div>

                  {/* Spacer for desktop 2-column balance */}
                  <div className="hidden sm:block sm:w-1/2" />
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
