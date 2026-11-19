import React, { useEffect, useRef } from 'react';
import { ArrowRight, PlayCircle, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../../lib/gsap';

interface CtaSectionProps {
  onExploreCourses: () => void;
  onStartEnrollment: () => void;
}

export const CtaSection: React.FC<CtaSectionProps> = ({
  onExploreCourses,
  onStartEnrollment,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      if (!containerRef.current) return;

      if (bgRef.current) {
        gsap.to(bgRef.current, {
          yPercent: -20,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-24 bg-[#0a0e27] text-white relative overflow-hidden border-t border-blue-900/50">
      
      {/* Lightweight Parallax Background Layer */}
      <div ref={bgRef} className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-r from-[#ff6f00] via-blue-600 to-emerald-500 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#ff9100] text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-[#ff9100]" />
          <span>Transforma tu Perfil Técnico Automotriz</span>
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Comienza tu formación profesional en <span className="text-[#ff6f00]">YOVE Academy</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-300 font-normal leading-relaxed">
            Aprende. Diagnostica. Innova. Accede de inmediato a nuestros 50 cursos, simuladores de laboratorio virtual y comunidad experta.
          </p>
        </div>

        {/* Value Prop Icons */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-gray-200 font-medium pt-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Acceso 24/7 de por Vida</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Certificado QR Oficial</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Simuladores Practicos</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStartEnrollment}
            className="w-full sm:w-auto bg-[#ff6f00] hover:bg-[#ff9100] px-8 py-4 rounded-xl font-bold text-white shadow-xl shadow-orange-600/30 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            <span>Crear Cuenta e Inscribirme</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={onExploreCourses}
            className="w-full sm:w-auto border border-white/30 hover:border-white hover:bg-white/10 px-8 py-4 rounded-xl font-bold text-white transition-all backdrop-blur-sm flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            <PlayCircle className="w-5 h-5 text-[#ff6f00]" />
            <span>Explorar Cursos</span>
          </button>
        </div>

      </div>
    </section>
  );
};
