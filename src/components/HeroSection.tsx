import React, { useEffect, useRef } from 'react';
import { ShieldCheck, PlayCircle, ArrowRight, Zap, CheckCircle2, Award, Cpu, Activity, Radio, Database } from 'lucide-react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/gsap';

interface HeroSectionProps {
  onStartClick: () => void;
  onExploreCoursesClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartClick,
  onExploreCoursesClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const sloganRef = useRef<HTMLParagraphElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const bgLayerRef = useRef<HTMLDivElement>(null);
  const floatLayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      if (!titleRef.current || !sloganRef.current || !buttonsRef.current || !badgeRef.current || !containerRef.current) return;

      // Entrance Timeline Animation
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Title: opacity 0 -> 1, translateY 40px -> 0
      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1 }
      )
      // Badge & Slogan/Description: opacity 0 -> 1, translateY 30px -> 0
      .fromTo(
        badgeRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.7'
      )
      .fromTo(
        sloganRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.5'
      )
      // Buttons: opacity 0 -> 1, scale 0.96 -> 1
      .fromTo(
        buttonsRef.current,
        { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1, duration: 0.7 },
        '-=0.5'
      );

      if (cardRef.current) {
        tl.fromTo(
          cardRef.current,
          { opacity: 0, scale: 1.08, y: 30 },
          { opacity: 1, scale: 1, y: 0, duration: 1 },
          '-=0.8'
        );
      }

      // Scroll Parallax Depth Layers:
      // Layer 1 (Background): velocity 0.2
      if (bgLayerRef.current) {
        gsap.to(bgLayerRef.current, {
          yPercent: 20,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      // Layer 2 (Decorative Floating Tech Badges): velocity 0.4
      if (floatLayerRef.current) {
        gsap.to(floatLayerRef.current, {
          yPercent: 40,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      // Layer 3 (Card Showcase): velocity 0.7
      if (cardRef.current) {
        gsap.to(cardRef.current, {
          yPercent: 15,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[90vh] pt-28 pb-20 flex items-center justify-center overflow-hidden bg-[#0a0e27] text-white"
    >
      {/* CAPA 1: Background Grid & Ambient Glows (Speed 0.2) */}
      <div ref={bgLayerRef} className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:36px_36px]" />
        <div className="absolute top-[-10%] right-[-5%] w-[550px] h-[550px] rounded-full bg-[#ff6f00]/12 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[450px] h-[450px] rounded-full bg-blue-600/10 blur-[100px]" />
      </div>

      {/* CAPA 2: Decorative Floating Automotive Elements (Speed 0.4) */}
      <div ref={floatLayerRef} className="absolute inset-0 pointer-events-none z-0 hidden lg:block">
        <div className="absolute top-[20%] left-[5%] bg-white/5 backdrop-blur-md border border-white/10 px-3.5 py-2 rounded-xl text-xs font-bold text-blue-200 flex items-center gap-2 shadow-lg animate-pulse">
          <Cpu className="w-4 h-4 text-[#ff9100]" />
          <span>ECU Bosch MED17.5</span>
        </div>
        <div className="absolute top-[60%] left-[8%] bg-white/5 backdrop-blur-md border border-white/10 px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-300 flex items-center gap-2 shadow-lg">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>CAN-Bus 500 kbps</span>
        </div>
        <div className="absolute top-[25%] right-[6%] bg-white/5 backdrop-blur-md border border-white/10 px-3.5 py-2 rounded-xl text-xs font-bold text-amber-300 flex items-center gap-2 shadow-lg">
          <Radio className="w-4 h-4 text-amber-400" />
          <span>Sensor Hall CKP/CMP</span>
        </div>
        <div className="absolute bottom-[20%] right-[10%] bg-white/5 backdrop-blur-md border border-white/10 px-3.5 py-2 rounded-xl text-xs font-bold text-cyan-300 flex items-center gap-2 shadow-lg">
          <Database className="w-4 h-4 text-cyan-400" />
          <span>BMS Batería Alta Tensión</span>
        </div>
      </div>

      {/* CAPA 4: Content Main Layer (Speed 1.0) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          
          {/* Top Badge */}
          <div ref={badgeRef} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-100 text-xs sm:text-sm font-semibold shadow-inner">
            <Zap className="w-4 h-4 text-[#ff9100]" />
            <span>Inscripciones Abiertas — Ciclo Académico 2026</span>
          </div>

          {/* Title & Slogan */}
          <div className="space-y-3">
            <h1 ref={titleRef} className="text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold tracking-tight leading-[1.1] text-white">
              YOVE <span className="text-[#ff6f00] bg-gradient-to-r from-[#ff6f00] to-[#ff9100] bg-clip-text text-transparent">Academy</span>
            </h1>
            <p className="text-lg sm:text-xl font-bold text-[#ff9100] tracking-wide uppercase">
              Aprende. Diagnostica. Innova.
            </p>
          </div>

          {/* Subtitle / Description */}
          <p ref={sloganRef} className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto font-normal">
            Aprende las tecnologías más avanzadas en diagnóstico electrónico, lectura de diagramas, osciloscopio, reparación de ECUs y Vehículos Eléctricos con metodología 80% práctica.
          </p>

          {/* Key Value Props */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm font-medium text-blue-100 pt-1">
            <div className="flex items-center gap-1.5 bg-white/5 backdrop-blur px-3 py-1.5 rounded-lg border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-[#ff6f00]" />
              <span>Simuladores Interactivos</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/5 backdrop-blur px-3 py-1.5 rounded-lg border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-[#ff6f00]" />
              <span>Diagramas Mitchell / ALLData</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/5 backdrop-blur px-3 py-1.5 rounded-lg border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-[#ff6f00]" />
              <span>Certificación Oficial QR</span>
            </div>
          </div>

          {/* Hero CTA Buttons */}
          <div ref={buttonsRef} className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStartClick}
              className="w-full sm:w-auto bg-[#ff6f00] hover:bg-[#ff9100] px-8 py-3.5 rounded-xl font-bold text-white shadow-lg shadow-orange-600/30 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Comienza Ahora</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onExploreCoursesClick}
              className="w-full sm:w-auto border border-white/30 hover:border-white hover:bg-white/10 px-8 py-3.5 rounded-xl font-bold text-white transition-all backdrop-blur-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <PlayCircle className="w-5 h-5 text-[#ff6f00]" />
              <span>Explorar Cursos</span>
            </button>
          </div>

          {/* In-Hero Stats */}
          <div className="grid grid-cols-2 gap-4 pt-6 max-w-md mx-auto">
            <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border-l-4 border-[#ff6f00] text-center">
              <div className="text-2xl font-bold text-[#ff6f00]">+500</div>
              <div className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mt-0.5">Técnicos Graduados</div>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border-l-4 border-blue-500 text-center">
              <div className="text-2xl font-bold text-blue-400">15+ Años</div>
              <div className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mt-0.5">Liderazgo Educativo</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
