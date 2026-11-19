import React, { useEffect, useRef } from 'react';
import { Cpu, Activity, Radio, Search, CheckCircle2, ArrowDown, ShieldCheck, Wrench } from 'lucide-react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../../lib/gsap';

export const DiagnosticStorySection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const validSteps = stepsRef.current.filter(Boolean);
      if (validSteps.length > 0) {
        gsap.fromTo(
          validSteps,
          { opacity: 0, y: 50, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.2, // sequential reveal as user scrolls
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const storySteps = [
    {
      step: '01',
      title: 'Módulo de Control (ECU)',
      subtitle: 'Procesamiento de Lógica Interna',
      description: 'El microcontrolador procesa datos de memoria y ejecuta algoritmos de avance de chispa y tiempo de inyección.',
      icon: <Cpu className="w-6 h-6 text-[#ff6f00]" />,
      techBadge: 'Microcontrolador 32-Bit',
      colorBg: 'bg-orange-500/10 border-orange-500/30'
    },
    {
      step: '02',
      title: 'Sensórica & Actuadores',
      subtitle: 'Captura de Parámetros Físicos',
      description: 'Sensores Hall e inductivos transforman rotación y presión en diferencias de voltaje y pulsos de onda.',
      icon: <Activity className="w-6 h-6 text-blue-400" />,
      techBadge: 'Sensores CKP / CMP / MAP',
      colorBg: 'bg-blue-500/10 border-blue-500/30'
    },
    {
      step: '03',
      title: 'Captura de Señal & Onda',
      subtitle: 'Evaluación con Osciloscopio',
      description: 'Mide la forma, amplitud y frecuencia de la señal de comunicación para verificar integridad eléctrica sin falsos diagnósticos.',
      icon: <Radio className="w-6 h-6 text-[#ff9100]" />,
      techBadge: 'Análisis de Trazado Dual',
      colorBg: 'bg-amber-500/10 border-amber-500/30'
    },
    {
      step: '04',
      title: 'Scanner OBD-II & Live Data',
      subtitle: 'Lectura de Códigos DTC',
      description: 'Acceso a la memoria de averías del vehículo, análisis de Freeze Frame y prueba de actuadores de manera bidireccional.',
      icon: <Search className="w-6 h-6 text-emerald-400" />,
      techBadge: 'Lectura de DTCs P0/P1/P2',
      colorBg: 'bg-emerald-500/10 border-emerald-500/30'
    },
    {
      step: '05',
      title: 'Diagnóstico & Reparación',
      subtitle: 'Solución Efectiva de la Falla',
      description: 'Aislamiento directo de la causa raíz de la falla evitando el reemplazo innecesario de componentes costosos.',
      icon: <ShieldCheck className="w-6 h-6 text-cyan-400" />,
      techBadge: 'Certificación de Calidad',
      colorBg: 'bg-cyan-500/10 border-cyan-500/30'
    }
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-[#0a0e27] text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-[#ff9100] text-xs font-bold uppercase tracking-wider">
            <Wrench className="w-4 h-4" />
            Flujo de Diagnóstico Profesional
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            El Proceso Científico del Técnico Experto
          </h2>
          <p className="text-sm sm:text-base text-gray-300 font-normal leading-relaxed">
            Sigue paso a paso la secuencia metodológica utilizada en los talleres de diagnóstico electrónico más avanzados.
          </p>
        </div>

        {/* Sequential 5-Step Story Chain */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 relative">
          {storySteps.map((stepItem, idx) => (
            <div
              key={stepItem.step}
              ref={(el) => { stepsRef.current[idx] = el; }}
              className={`p-5 rounded-2xl border backdrop-blur-md transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between ${stepItem.colorBg} relative group`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                    {stepItem.icon}
                  </div>
                  <span className="text-2xl font-black text-white/40 group-hover:text-[#ff9100] transition-colors font-mono">
                    {stepItem.step}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-extrabold text-white leading-snug">
                    {stepItem.title}
                  </h3>
                  <div className="text-[10px] text-[#ff9100] font-bold uppercase mt-0.5">
                    {stepItem.subtitle}
                  </div>
                  <p className="text-[11px] text-gray-300 mt-2 leading-relaxed font-normal">
                    {stepItem.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-white/10">
                <span className="text-[9px] font-mono font-bold text-gray-300 uppercase tracking-wide block truncate">
                  {stepItem.techBadge}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
