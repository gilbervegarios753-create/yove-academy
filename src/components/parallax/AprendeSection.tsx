import React, { useEffect, useRef } from 'react';
import { Cpu, Activity, Radio, Zap, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../../lib/gsap';

export const AprendeSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      if (!titleRef.current) return;

      // Title entrance
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Stagger cards reveal: card 1 -> 0ms, card 2 -> 100ms, card 3 -> 200ms, card 4 -> 300ms
      const validCards = cardsRef.current.filter(Boolean);
      if (validCards.length > 0) {
        gsap.fromTo(
          validCards,
          { opacity: 0, y: 40, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            stagger: 0.1, // 100ms stagger
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardsRef.current[0],
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const pillars = [
    {
      id: 'diag',
      title: 'Diagnóstico Electrónico & Osciloscopio',
      description: 'Aprende a interpretar diagramas eléctricos, realizar mediciones en vivo con osciloscopio digital y aislar fallas complejas de inyección.',
      icon: <Activity className="w-6 h-6 text-[#ff6f00]" />,
      badge: '01. Diagnóstico',
      topics: ['Lectura de Diagramas', 'Osciloscopio 2 Ch', 'DTC OBD-II']
    },
    {
      id: 'ecu',
      title: 'Mecatrónica & Arquitectura de ECUs',
      description: 'Especialízate en la estructura interna de computadoras automotrices: fuentes conmutadas, drivers de potencia y memorias EEPROM.',
      icon: <Cpu className="w-6 h-6 text-[#ff6f00]" />,
      badge: '02. Computadoras',
      topics: ['Hardware de ECU', 'Reinicio de Inmovilizador', 'Lectura de Bench']
    },
    {
      id: 'canbus',
      title: 'Redes Multiplexadas CAN Bus & LIN',
      description: 'Domina la comunicación de datos entre módulos vehiculares, diagnóstico de tramas binarias y oscilogramas de alta y baja velocidad.',
      icon: <Radio className="w-6 h-6 text-[#ff6f00]" />,
      badge: '03. Multiplexado',
      topics: ['Trama CAN-High/Low', 'Red LIN', 'Gateway & Gateway SGW']
    },
    {
      id: 'ev',
      title: 'Vehículos Eléctricos e Híbridos (HV)',
      description: 'Capacitación en seguridad de alta tensión, inversores de frecuencia, motores síncronos trifásicos y gestión de baterías BMS.',
      icon: <Zap className="w-6 h-6 text-[#ff6f00]" />,
      badge: '04. Movilidad Eléctrica',
      topics: ['Aislamiento de Alta Tensión', 'Inversor & BMS', 'Freno Regenerativo']
    }
  ];

  return (
    <section ref={sectionRef} id="aprende" className="py-20 bg-[#f8fafc] text-slate-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div ref={titleRef} className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-extrabold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-blue-700" />
            Metodología de Aprendizaje YOVE
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Pilares de Formación Técnica Especializada
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Nuestra estructura de estudio combina bases teóricas rigurosas con más de 80% de simulaciones prácticas directas sobre sistemas reales.
          </p>
        </div>

        {/* 4 Pillars Grid with Stagger Reveal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => (
            <div
              key={pillar.id}
              ref={(el) => { cardsRef.current[idx] = el; }}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {pillar.icon}
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                    {pillar.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed font-normal">
                    {pillar.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100">
                <div className="flex flex-wrap gap-1.5">
                  {pillar.topics.map((tp, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold">
                      {tp}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
