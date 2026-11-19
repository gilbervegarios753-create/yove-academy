import React, { useEffect, useRef } from 'react';
import { Cpu, Activity, Award, CheckCircle2, ShieldAlert, Sparkles, Layers } from 'lucide-react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../../lib/gsap';

export const MecatronicaVisualSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const img1Ref = useRef<HTMLDivElement>(null);
  const img2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Progressive scale animation for image 1 on scroll
      if (img1Ref.current) {
        gsap.fromTo(
          img1Ref.current,
          { scale: 0.92, opacity: 0.8 },
          {
            scale: 1.0,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: img1Ref.current,
              start: 'top 80%',
              end: 'bottom 40%',
              scrub: true,
            },
          }
        );
      }

      // Progressive scale animation for image 2 on scroll
      if (img2Ref.current) {
        gsap.fromTo(
          img2Ref.current,
          { scale: 0.92, opacity: 0.8 },
          {
            scale: 1.0,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: img2Ref.current,
              start: 'top 80%',
              end: 'bottom 40%',
              scrub: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-[#0d1338] text-white relative overflow-hidden border-y border-blue-900/50">
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#ff6f00]/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-900/60 border border-blue-700/50 text-[#ff9100] text-xs font-bold uppercase tracking-wider">
            <Cpu className="w-4 h-4" />
            Mecatrónica Avanzada & Diagnóstico
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ingeniería Automotriz de Nueva Generación
          </h2>
          <p className="text-sm sm:text-base text-gray-300 font-normal leading-relaxed">
            Profundiza en la lectura de señales electrónicas, lógica de módulos de control y resolución de fallas complejas con estándares de taller especializado.
          </p>
        </div>

        {/* BLOCK 1: Image Left + Text Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Image Container Left */}
          <div className="lg:col-span-6">
            <div ref={img1Ref} className="relative group rounded-2xl overflow-hidden border border-white/15 bg-slate-900 shadow-2xl p-2">
              <div className="bg-slate-950 p-6 rounded-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs font-mono text-emerald-400 font-bold">ECU MAP & BENCH PINOUT</span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono">BOSCH MED17 / CONTINENTAL SIMOS</span>
                </div>

                {/* Circuit Pinout Visual Illustration */}
                <div className="space-y-3 pt-2">
                  <div className="p-3 bg-white/5 rounded-lg border border-white/10 flex items-center justify-between text-xs">
                    <span className="text-gray-300">Fuente Regulada 5V Ref Sensor</span>
                    <span className="font-mono text-emerald-400 font-bold">5.02 V OK</span>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg border border-white/10 flex items-center justify-between text-xs">
                    <span className="text-gray-300">Masa Lógica Sensores (Sensor Ground)</span>
                    <span className="font-mono text-emerald-400 font-bold">0.02 V OK</span>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg border border-white/10 flex items-center justify-between text-xs">
                    <span className="text-gray-300">Driver de Inyección Banco 1 PWM</span>
                    <span className="font-mono text-amber-400 font-bold">Oscilograma OK</span>
                  </div>
                </div>

                <div className="p-3 bg-blue-950/60 rounded-lg border border-blue-800/40 text-[11px] text-blue-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Sincronización exacta de CKP Hall & CMP Inductivo en Banco</span>
                </div>
              </div>
            </div>
          </div>

          {/* Text Container Right */}
          <div className="lg:col-span-6 space-y-5 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/5 text-[#ff9100] text-xs font-bold uppercase">
              <Layers className="w-4 h-4" />
              <span>Arquitectura Interna de ECUs</span>
            </div>
            
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              Análisis y Reparación de Módulos de Control Principal
            </h3>

            <p className="text-sm text-gray-300 leading-relaxed font-normal">
              Entiende la topología interna de una computadora automotriz: desde la etapa de alimentación con microcontroladores Tricore hasta los transistores MOSFET/IGBT encargados del accionamiento de inyectores y bobinas.
            </p>

            <ul className="space-y-2.5 text-xs sm:text-sm text-gray-200 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#ff6f00] shrink-0" />
                <span>Identificación de componentes en placa (Diodos Zener, Mosfets, EEPROM)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#ff6f00] shrink-0" />
                <span>Lectura y escritura en modo Bench & Bootloader con KTAG / BDM</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#ff6f00] shrink-0" />
                <span>Extracción de código Pin & Clonación de ECUs de reemplazo</span>
              </li>
            </ul>
          </div>

        </div>

        {/* BLOCK 2: Text Left + Image Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-8">
          
          {/* Text Container Left */}
          <div className="lg:col-span-6 space-y-5 text-left order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/5 text-blue-400 text-xs font-bold uppercase">
              <Activity className="w-4 h-4" />
              <span>Captura & Análisis de Ondas</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              Diagnóstico de Precisión con Osciloscopio Digital 2 Ch
            </h3>

            <p className="text-sm text-gray-300 leading-relaxed font-normal">
              El voltímetro tradicional no es suficiente para evaluar señales de microsegundos. Con el osciloscopio aprenderás a determinar si una falta de encendido proviene de un fallo mecánico de compresión o de un pico inductivo en la bobina.
            </p>

            <ul className="space-y-2.5 text-xs sm:text-sm text-gray-200 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Verificación de atenuadores 10:1 / 20:1 para picos de alta tensión</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Trazado simultáneo de pulso de inyector y corriente con pinza amperimétrica</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Diagnóstico de desfase en tiempo entre árbol de levas y cigüeñal</span>
              </li>
            </ul>
          </div>

          {/* Image Container Right */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <div ref={img2Ref} className="relative group rounded-2xl overflow-hidden border border-white/15 bg-slate-900 shadow-2xl p-2">
              <div className="bg-slate-950 p-6 rounded-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-xs font-mono text-blue-400 font-bold">OSCILLOSCOPE SIGNAL ANALYSIS</span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono">CH1 + CH2 DUAL TRACE</span>
                </div>

                {/* Oscilloscope Waveform Graphical Element */}
                <div className="p-4 bg-black rounded-xl border border-blue-900/60 space-y-3">
                  <div className="h-24 w-full bg-slate-950 rounded border border-slate-800 flex items-center justify-center relative overflow-hidden">
                    <svg className="w-full h-full text-blue-400 opacity-90" viewBox="0 0 300 80" preserveAspectRatio="none">
                      {/* Grid lines */}
                      <line x1="0" y1="20" x2="300" y2="20" stroke="#1e293b" strokeWidth="1" />
                      <line x1="0" y1="40" x2="300" y2="40" stroke="#1e293b" strokeWidth="1" />
                      <line x1="0" y1="60" x2="300" y2="60" stroke="#1e293b" strokeWidth="1" />
                      {/* Channel 1 PWM Signal (Blue) */}
                      <path d="M 0 60 L 40 60 L 40 20 L 80 20 L 80 60 L 120 60 L 120 20 L 160 20 L 160 60 L 200 60 L 200 20 L 240 20 L 240 60 L 300 60" fill="none" stroke="#38bdf8" strokeWidth="2" />
                      {/* Channel 2 Inductive Spike (Orange) */}
                      <path d="M 0 70 Q 20 70 40 10 Q 45 75 80 70 Q 100 70 120 10 Q 125 75 160 70 Q 180 70 200 10 Q 205 75 240 70 L 300 70" fill="none" stroke="#ff9100" strokeWidth="1.5" />
                    </svg>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-gray-300">
                    <span className="text-sky-300">CH1: 5.0 V/Div (PWM)</span>
                    <span className="text-amber-400">CH2: 50.0 V/Div (Spike)</span>
                  </div>
                </div>

                <div className="p-3 bg-emerald-950/50 rounded-lg border border-emerald-800/40 text-[11px] text-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Respuesta de Inyector inductivo dentro del tiempo estándar de 1.8 ms</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
