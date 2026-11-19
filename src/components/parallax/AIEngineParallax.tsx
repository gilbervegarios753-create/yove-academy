import React, { useEffect, useRef, useState } from 'react';
import { Cpu, Activity, Zap, Search, Eye, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../../lib/gsap';

export const AIEngineParallax: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinWrapperRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<HTMLDivElement>(null);
  const ecuRef = useRef<HTMLDivElement>(null);
  const sensorRef = useRef<HTMLDivElement>(null);
  const actuatorRef = useRef<HTMLDivElement>(null);
  const flowRef = useRef<HTMLDivElement>(null);
  const diagRef = useRef<HTMLDivElement>(null);

  const [currentStep, setCurrentStep] = useState<number>(1);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      if (!engineRef.current || !ecuRef.current || !sensorRef.current || !actuatorRef.current || !flowRef.current || !diagRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=2000',
          scrub: 1,
          pin: pinWrapperRef.current,
          pinReparent: false,
          onUpdate: (self) => {
            const step = Math.min(7, Math.floor(self.progress * 7) + 1);
            setCurrentStep(step);
          },
        },
      });

      // 1. Motor aparece
      tl.fromTo(engineRef.current, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1 })
      // 2. Cámara se aproxima
      .to(engineRef.current, { scale: 1.15, duration: 1 })
      // 3. Aparece ECU
      .fromTo(ecuRef.current, { opacity: 0, y: 30, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 1 })
      // 4. Aparecen sensores
      .fromTo(sensorRef.current, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 1 })
      // 5. Aparecen actuadores
      .fromTo(actuatorRef.current, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 1 })
      // 6. Aparece flujo de información
      .fromTo(flowRef.current, { opacity: 0, scaleY: 0 }, { opacity: 1, scaleY: 1, duration: 1 })
      // 7. Aparece diagnóstico
      .fromTo(diagRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1 });

    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  const stepsInfo = [
    { num: 1, title: '1. Motor de Combustión Inyección Directa', label: 'Estructura Mecánica' },
    { num: 2, title: '2. Acercamiento & Enfoque de Cámara', label: 'Inspección Micro' },
    { num: 3, title: '3. Unidad de Control de Motor (ECU)', label: 'Cerebro Electrónico' },
    { num: 4, title: '4. Red de Sensores (CKP / MAF / ECT / TPS)', label: 'Captura de Parámetros' },
    { num: 5, title: '5. Actuadores de Potencia (Inyectores / Coils)', label: 'Respuesta Física' },
    { num: 6, title: '6. Flujo Continuo de Información CAN Bus', label: 'Comunicación' },
    { num: 7, title: '7. Diagnóstico Científico & DTC OBD-II', label: 'Dictamen Técnico' },
  ];

  return (
    <section ref={containerRef} id="engine-parallax" className="min-h-screen bg-[#060919] text-white relative overflow-hidden py-16">
      <div ref={pinWrapperRef} className="w-full flex flex-col justify-between min-h-screen relative z-10">
        {/* Background Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-600/10 blur-[150px] pointer-events-none rounded-full" />

      {/* Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2 relative z-10 w-full">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-900/60 border border-blue-700/50 text-[#ff9100] text-xs font-extrabold uppercase tracking-wider">
          <Eye className="w-4 h-4 text-[#ff9100]" />
          Narrativa Visual Interactiva
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Conoce lo que Ocurre Dentro del Vehículo
        </h2>
        <p className="text-sm text-gray-300 max-w-2xl mx-auto font-normal">
          Desplázate hacia abajo para sumergirte capa por capa en el funcionamiento interno del motor.
        </p>

        {/* Step Progress Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {stepsInfo.map((s) => (
            <div
              key={s.num}
              className={`px-3 py-1 rounded-lg text-[11px] font-mono font-bold transition-all ${
                currentStep >= s.num
                  ? 'bg-[#ff6f00] text-white shadow-md'
                  : 'bg-white/5 text-gray-400 border border-white/10'
              }`}
            >
              {s.num}. {s.label}
            </div>
          ))}
        </div>
      </div>

      {/* Main Interactive Stage Container */}
      <div className="max-w-6xl mx-auto px-4 w-full my-auto relative z-10 py-8">
        <div className="bg-slate-950/90 border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
          
          {/* STEP 1 & 2: ENGINE BAY VISUAL STAGE */}
          <div ref={engineRef} className="relative rounded-2xl bg-black/80 border border-blue-900/60 p-6 sm:p-8 space-y-6 overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                <h3 className="text-lg font-extrabold text-white">Motor 2.0L TSI / DOHC Dual VVT</h3>
              </div>
              <span className="text-xs font-mono text-blue-300">RPM: 850 • Temp: 88°C</span>
            </div>

            {/* SVG Engine Block & Cylinders Illustration */}
            <div className="h-44 w-full bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center relative overflow-hidden">
              <svg className="w-full h-full text-blue-400 opacity-80" viewBox="0 0 400 120" preserveAspectRatio="none">
                {/* Cylinder block */}
                <rect x="20" y="30" width="80" height="70" rx="8" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
                <rect x="110" y="30" width="80" height="70" rx="8" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
                <rect x="200" y="30" width="80" height="70" rx="8" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
                <rect x="290" y="30" width="80" height="70" rx="8" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
                {/* Pistons */}
                <rect x="35" y="45" width="50" height="25" rx="4" fill="#38bdf8" />
                <rect x="125" y="60" width="50" height="25" rx="4" fill="#38bdf8" />
                <rect x="215" y="45" width="50" height="25" rx="4" fill="#38bdf8" />
                <rect x="305" y="60" width="50" height="25" rx="4" fill="#38bdf8" />
              </svg>
            </div>
          </div>

          {/* STEP 3, 4, 5 GRID: ECU + SENSORS + ACTUATORS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* STEP 3: ECU */}
            <div ref={ecuRef} className="p-5 rounded-2xl bg-blue-950/70 border border-blue-500/40 space-y-3">
              <div className="flex items-center gap-2 text-blue-300 font-extrabold text-sm">
                <Cpu className="w-4 h-4 text-[#ff9100]" />
                <span>Unidad de Control (ECU)</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed font-normal">
                Microprocesador TriCore operando a 300MHz. Ejecuta millones de cálculos por segundo.
              </p>
              <div className="text-[10px] font-mono text-emerald-400 font-bold bg-black/40 px-2 py-1 rounded">
                Estatus: NORMAL • 0 Errores
              </div>
            </div>

            {/* STEP 4: SENSORES */}
            <div ref={sensorRef} className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-amber-300 font-extrabold text-sm">
                <Activity className="w-4 h-4 text-amber-400" />
                <span>Sensores de Motor</span>
              </div>
              <div className="space-y-1.5 text-xs text-gray-300 font-mono">
                <div className="flex justify-between"><span>CKP (Cigüeñal):</span> <span className="text-emerald-400 font-bold">58X Tooth</span></div>
                <div className="flex justify-between"><span>MAF (Masa Aire):</span> <span className="text-emerald-400 font-bold">2.4 g/s</span></div>
                <div className="flex justify-between"><span>ECT (Temperatura):</span> <span className="text-emerald-400 font-bold">88 °C</span></div>
              </div>
            </div>

            {/* STEP 5: ACTUADORES */}
            <div ref={actuatorRef} className="p-5 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 space-y-3">
              <div className="flex items-center gap-2 text-emerald-300 font-extrabold text-sm">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>Actuadores Principales</span>
              </div>
              <div className="space-y-1.5 text-xs text-gray-300 font-mono">
                <div className="flex justify-between"><span>Inyector Cil 1:</span> <span className="text-amber-400 font-bold">1.8 ms PWM</span></div>
                <div className="flex justify-between"><span>Bobina Cil 1:</span> <span className="text-amber-400 font-bold">Spark 35kV</span></div>
                <div className="flex justify-between"><span>Cuerpo TAC:</span> <span className="text-amber-400 font-bold">12.5% Apertura</span></div>
              </div>
            </div>

          </div>

          {/* STEP 6 & 7: FLOW & DIAGNOSTIC OVERLAY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* STEP 6: FLOW */}
            <div ref={flowRef} className="p-5 rounded-2xl bg-[#0d1338] border border-blue-800/50 space-y-2">
              <div className="flex items-center gap-2 text-sky-300 font-extrabold text-xs uppercase">
                <Sparkles className="w-4 h-4 text-sky-400" />
                <span>Flujo de Datos CAN Bus 500 kbps</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed font-normal">
                Tramas de datos binarios transmitidas a través de la red de multiplexado hacia los módulos ABS, Cuadro de Instrumentos y Transmisión.
              </p>
            </div>

            {/* STEP 7: DIAGNOSTIC OVERLAY */}
            <div ref={diagRef} className="p-5 rounded-2xl bg-black border border-emerald-500/60 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs uppercase">
                  <Search className="w-4 h-4 text-emerald-400" />
                  <span>Resultado del Diagnóstico</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-300 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  OBD-II PASS
                </span>
              </div>
              <p className="text-xs text-gray-200 leading-relaxed font-normal">
                Sistema de Inyección operando en bucle cerrado (Closed Loop). Ajuste de combustible a corto plazo STFT: 0.0%.
              </p>
            </div>

          </div>

        </div>
      </div>
      </div>

    </section>
  );
};
