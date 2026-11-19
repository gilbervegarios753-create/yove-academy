import React, { useState, useEffect, useRef } from 'react';
import { GraduationCap, BookOpen, Layers, CarFront, Award } from 'lucide-react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/gsap';
import { CoreApi, ApiStats } from '../services/api/coreApi';

export const StatsSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [stats, setStats] = useState<ApiStats | null>(null);
  const [counts, setCounts] = useState({
    cursos: 0,
    lecciones: 0,
    estudiantes: 0,
    marcas: 0,
  });

  useEffect(() => {
    CoreApi.getPublicStats().then(data => {
      if (data) setStats(data);
    });
  }, []);

  useEffect(() => {
    if (!stats) return;

    if (prefersReducedMotion()) {
      setCounts({
        cursos: stats.coursesCount,
        lecciones: stats.lessonsCount,
        estudiantes: stats.studentsCount,
        marcas: stats.brandsCount,
      });
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          const obj = { c: 0, l: 0, e: 0, b: 0 };
          gsap.to(obj, {
            c: stats.coursesCount,
            l: stats.lessonsCount,
            e: stats.studentsCount,
            b: stats.brandsCount,
            duration: 2.2,
            ease: 'power2.out',
            onUpdate: () => {
              setCounts({
                cursos: Math.floor(obj.c),
                lecciones: Math.floor(obj.l),
                estudiantes: Math.floor(obj.e),
                marcas: Math.floor(obj.b),
              });
            },
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [stats]);

  const statsList = [
    { id: 'cursos', value: counts.cursos, suffix: '', label: 'Cursos', icon: <BookOpen className="w-7 h-7 text-[#ff6f00]" /> },
    { id: 'lecciones', value: counts.lecciones, suffix: '', label: 'Lecciones', icon: <Layers className="w-7 h-7 text-[#ff6f00]" /> },
    { id: 'estudiantes', value: counts.estudiantes, suffix: '', label: 'Estudiantes', icon: <GraduationCap className="w-7 h-7 text-[#ff6f00]" /> },
    { id: 'marcas', value: counts.marcas, suffix: '', label: 'Marcas', icon: <CarFront className="w-7 h-7 text-[#ff6f00]" /> },
  ];

  return (
    <section
      id="beneficios"
      ref={sectionRef}
      className="py-16 bg-[#0a0e27] text-white relative overflow-hidden border-y border-white/10"
    >
      {/* Background glow circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#ff6f00]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsList.map((stat) => (
            <div
              key={stat.id}
              className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border-l-4 border-[#ff6f00] hover:bg-white/10 transition-all duration-300 shadow-xl group h-full flex flex-col justify-between"
            >
              <div className="w-12 h-12 rounded-xl bg-[#ff6f00]/15 border border-[#ff6f00]/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>

              <div>
                <div className="text-3xl sm:text-4xl font-black text-[#ff6f00] mb-1 tracking-tight font-mono">
                  {stat.value}{stat.suffix}
                </div>

                <h3 className="text-sm font-extrabold text-white">
                  {stat.label}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

