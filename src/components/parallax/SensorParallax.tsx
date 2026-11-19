import React, { useEffect, useRef, useState } from 'react';
import { Activity, Cpu, Zap, Radio, CheckCircle2, Play, Sparkles, AlertCircle } from 'lucide-react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../../lib/gsap';

export const SensorParallax: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const sensorRef = useRef<HTMLDivElement>(null);
  const signalPathRef = useRef<SVGPathElement>(null);
  const ecuRef = useRef<HTMLDivElement>(null);
  const actuatorRef = useRef<HTMLDivElement>(null);
  
  const [activeStep, setActiveStep] = useState<number>(1);
  const [simulating, setSimulating] = useState<boolean>(true);
  const [selectedSensor, setSelectedSensor] = useState<'CKP' | 'MAF' | 'TPS' | 'ECT'>('CKP');

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      if (!sensorRef.current || !ecuRef.current || !actuatorRef.current || !sectionRef.current) return;

      // Step 1: Sensor appears
      gsap.fromTo(
        sensorRef.current,
        { opacity: 0, scale: 0.8, x: -40 },
        {
          opacity: 1,
          scale: 1,
          x: 0,
          duration: 0.8,
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            onEnter: () => setActiveStep(1),
          },
        }
      );

      // Step 2: Signal travels
      if (signalPathRef.current) {
        const pathLength = signalPathRef.current.getTotalLength();
        gsap.set(signalPathRef.current, { strokeDasharray: pathLength, strokeDashoffset: pathLength });

        gsap.to(signalPathRef.current, {
          strokeDashoffset: 0,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            end: 'top 30%',
            scrub: 1,
            onUpdate: (self) => {
              if (self.progress > 0.3 && self.progress <= 0.6) setActiveStep(2);
              else if (self.progress > 0.6 && self.progress <= 0.85) setActiveStep(3);
              else if (self.progress > 0.85) setActiveStep(4);
            },
          },
        });
      }

      // Step 3: ECU appears & processes
      gsap.fromTo(
        ecuRef.current,
        { opacity: 0, scale: 0.85, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 50%',
          },
        }
      );

      // Step 4: Actuator responds
      gsap.fromTo(
        actuatorRef.current,
        { opacity: 0, scale: 0.8, x: 40 },
        {
          opacity: 1,
          scale: 1,
          x: 0,
          duration: 0.8,
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 40%',
            onEnter: () => setActiveStep(4),
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const sensorDetails = {
    CKP: {
      name: 'Sensor CKP (Posición de Cigüeñal)',
      type: 'Hall / Inductivo',
      inputSig: '0V / 5V Pulso Cuadrado Digital',
      outputAct: 'Pulso PWM de Inyector (1.8 ms) + Bobina de Encendido',
      nominalVal: '58 Dientes (Frecuencia Variable 20Hz - 2.5kHz)',
      description: 'Mide la velocidad angular del cigüeñal y la posición exacta del PMS (Punto Muerto Superior) para sincronizar el encendido.',
    },
    MAF: {
      name: 'Sensor MAF (Flujo de Masa de Aire)',
      type: 'Hilo Caliente Piezoeléctrico',
      inputSig: 'Voltaje Analógico 1.0V (Ralentí) a 4.5V (WOT)',
      outputAct: 'Ajuste de Tiempo Principal de Inyección (STFT)',
      nominalVal: '2.5 g/s en ralentí a 850 RPM',
      description: 'Mide la cantidad y masa de aire que ingresa al múltiple de admisión para calcular la relación estequiométrica 14.7:1.',
    },
    TPS: {
      name: 'Sensor TPS (Posición de Acelerador)',
      type: 'Potenciómetro Doble / Efecto Hall',
      inputSig: 'Pista 1: 0.5V → 4.5V | Pista 2: 4.5V → 0.5V',
      outputAct: 'Apertura de Mariposa Motorizada TAC + Enriquecimiento',
      nominalVal: '0.5V (Mariposa Cerrada) - 4.5V (Plena Carga)',
      description: 'Informa la intención del conductor al presionar el pedal para modular el cuerpo de aceleración electrónico.',
    },
    ECT: {
      name: 'Sensor ECT (Temperatura Refrigerante)',
      type: 'Termistor NTC (Coeficiente Negativo)',
      inputSig: 'Caída de Tensión 4.0V (Frío -20°C) → 0.5V (Caliente 90°C)',
      outputAct: 'Relé de Electroventilador + Estrategia de Arranque en Frío',
      nominalVal: '2.5 kΩ a 20°C → 200 Ω a 90°C',
      description: 'Permite a la ECU enriquecer la mezcla durante el calentamiento del motor y gestionar la protección térmica.',
    },
  };

  const currSensor = sensorDetails[selectedSensor];

  return (
    <section ref={sectionRef} id="sensor-parallax" className="py-20 bg-[#070a1e] text-white relative overflow-hidden border-y border-blue-900/60">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-blue-600/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-900/60 border border-blue-700/50 text-[#ff9100] text-xs font-extrabold uppercase tracking-wider">
            <Radio className="w-4 h-4 text-[#ff9100]" />
            Arquitectura de Control Electrónico
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Cadena de Procesamiento: Sensor → Señal → ECU → Actuador
          </h2>
          <p className="text-sm sm:text-base text-gray-300 font-normal leading-relaxed">
            Experimenta cómo la computadora automotriz captura magnitudes físicas del motor, las convierte en datos digitales y responde en microsegundos.
          </p>

          {/* Sensor Selector Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
            {(['CKP', 'MAF', 'TPS', 'ECT'] as const).map((sKey) => (
              <button
                key={sKey}
                onClick={() => setSelectedSensor(sKey)}
                className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  selectedSensor === sKey
                    ? 'bg-[#ff6f00] text-white shadow-lg shadow-orange-600/30 border border-orange-400'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                }`}
              >
                {sKey}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive 4-Step Pipeline Visual Scene */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-4">
          
          {/* STEP 1: SENSOR CARD */}
          <div className="lg:col-span-3">
            <div
              ref={sensorRef}
              className={`p-6 rounded-2xl border transition-all duration-300 ${
                activeStep === 1
                  ? 'bg-blue-950/80 border-[#ff9100] shadow-xl shadow-orange-500/10 scale-105'
                  : 'bg-slate-900/80 border-white/10'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/40 flex items-center justify-center">
                    <Radio className="w-4 h-4 text-[#ff9100]" />
                  </div>
                  <span className="text-xs font-extrabold text-white uppercase">1. Sensor</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                  INPUT
                </span>
              </div>

              <div className="mt-4 space-y-2">
                <h4 className="text-base font-extrabold text-white">{currSensor.name}</h4>
                <p className="text-xs text-gray-300 leading-relaxed font-normal">{currSensor.description}</p>
                <div className="pt-2 text-[11px] font-mono text-amber-300 font-semibold">
                  <span>Val. Nom: {currSensor.nominalVal}</span>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 2: SIGNAL WAVE ANIMATION PIPELINE */}
          <div className="lg:col-span-3">
            <div className="p-5 rounded-2xl bg-slate-950 border border-blue-900/60 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between text-[11px] font-mono text-gray-300">
                <span className="flex items-center gap-1.5 text-[#ff9100] font-bold">
                  <Activity className="w-3.5 h-3.5 animate-pulse" />
                  2. Transmisión de Señal
                </span>
                <span className="text-emerald-400 font-bold">5.0V VREF</span>
              </div>

              {/* Animated Waveform SVG */}
              <div className="h-20 w-full bg-black/80 rounded-xl border border-slate-800 relative overflow-hidden flex items-center justify-center">
                <svg className="w-full h-full text-[#ff9100]" viewBox="0 0 200 60" preserveAspectRatio="none">
                  <path
                    ref={signalPathRef}
                    d="M 0 30 Q 20 5 40 30 T 80 30 T 120 5 T 140 55 T 160 30 T 200 30"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/10 to-transparent animate-pulse" />
              </div>

              <div className="text-[10px] font-mono text-gray-400 truncate">
                {currSensor.inputSig}
              </div>
            </div>
          </div>

          {/* STEP 3: ECU LOGIC PROCESSING */}
          <div className="lg:col-span-3">
            <div
              ref={ecuRef}
              className={`p-6 rounded-2xl border transition-all duration-300 ${
                activeStep === 3
                  ? 'bg-blue-950/90 border-blue-400 shadow-xl shadow-blue-500/20 scale-105'
                  : 'bg-slate-900/80 border-white/10'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center">
                    <Cpu className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-xs font-extrabold text-white uppercase">3. Procesamiento ECU</span>
                </div>
                <span className="text-[10px] font-mono text-cyan-300 font-bold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                  PROCESS
                </span>
              </div>

              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-extrabold text-white">Microcontrolador 32-Bit</h4>
                <p className="text-xs text-gray-300 leading-relaxed font-normal">
                  Compara la señal recibida contra las tablas de mapeo de la memoria EEPROM y calcula la respuesta óptima.
                </p>
                <div className="pt-2 flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Latencia de Cálculo: &lt; 0.5 ms</span>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 4: ACTUATOR RESPONSE */}
          <div className="lg:col-span-3">
            <div
              ref={actuatorRef}
              className={`p-6 rounded-2xl border transition-all duration-300 ${
                activeStep === 4
                  ? 'bg-emerald-950/80 border-emerald-400 shadow-xl shadow-emerald-500/20 scale-105'
                  : 'bg-slate-900/80 border-white/10'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-xs font-extrabold text-white uppercase">4. Actuador</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-300 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                  OUTPUT
                </span>
              </div>

              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-extrabold text-white">Respuesta Física Real</h4>
                <p className="text-xs text-gray-300 leading-relaxed font-normal">{currSensor.outputAct}</p>
                <div className="pt-2 flex items-center gap-1.5 text-[11px] font-mono text-amber-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Accionamiento por Transistor MOSFET</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Summary Educational Banner */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#ff6f00]/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-[#ff9100]" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">
                ¿Sabías qué? En YOVE Academy simulas este flujo con Osciloscopio Digital de 4 Canales
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Puedes pausar la señal, medir tiempo de elevación (Rise Time) y verificar ruido eléctrico por masas deficientes.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
