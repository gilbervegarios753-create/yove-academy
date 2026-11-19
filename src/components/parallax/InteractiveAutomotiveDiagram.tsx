import React, { useState } from 'react';
import { Cpu, Activity, Zap, CheckCircle2, ShieldAlert, Sparkles, Wrench, Search, Info } from 'lucide-react';

export interface AutomotiveComponentSpec {
  id: string;
  shortName: string;
  fullName: string;
  type: string;
  pinout: string;
  signalType: string;
  voltageRange: string;
  description: string;
  commonFailures: string[];
  testMethod: string;
}

export const InteractiveAutomotiveDiagram: React.FC = () => {
  const [selectedComp, setSelectedComp] = useState<string>('ckp');

  const componentsData: Record<string, AutomotiveComponentSpec> = {
    ckp: {
      id: 'ckp',
      shortName: 'CKP',
      fullName: 'Sensor de Posición de Cigüeñal (Crankshaft Position)',
      type: 'Efecto Hall / Inductivo de 2 o 3 Pines',
      pinout: 'Pin 1: +5V VREF | Pin 2: Masa Lógica | Pin 3: Señal Cuadrada Digital',
      signalType: 'Frecuencia de Pulso Cuadrado Digital (58X Tooth Wheel)',
      voltageRange: '0V (Bajo) a 5V (Alto)',
      description: 'Genera el pulso de referencia angular imprescindible para determinar la velocidad del motor (RPM) y el Punto Muerto Superior (PMS) del Cilindro 1.',
      commonFailures: ['Motor no arranca (Sin chispa ni inyección)', 'Corte repentino en caliente por dilatación del bobinado', 'Código DTC P0335 / P0336'],
      testMethod: 'Medición de resistencia de bobina (800-1200 Ω) o verificación de onda con osciloscopio en canal 1.',
    },
    maf: {
      id: 'maf',
      shortName: 'MAF',
      fullName: 'Sensor de Masa de Flujo de Aire (Mass Air Flow)',
      type: 'Hilo Caliente Piezoeléctrico',
      pinout: 'Pin 1: +12V Batería | Pin 2: Masa | Pin 3: +5V VREF | Pin 4: Señal Analógica',
      signalType: 'Tensión Analógica Continua de Flujo',
      voltageRange: '1.0V (Ralentí 850 RPM) → 4.5V (Aceleración WOT)',
      description: 'Mide la masa exacta de aire que ingresa al motor para calcular la inyección estequiométrica (14.7:1 en gasolina).',
      commonFailures: ['Humo negro en escape', 'Falta de potencia en aceleración brusca', 'Código DTC P0101 / P0102'],
      testMethod: 'Limpieza con solvente dielectrico especial para MAF y medición de tensión lineal sin saltos de voltaje.',
    },
    ect: {
      id: 'ect',
      shortName: 'ECT',
      fullName: 'Sensor de Temperatura del Refrigerante (Coolant Temp)',
      type: 'Termistor NTC (Coeficiente de Temperatura Negativo)',
      pinout: 'Pin 1: Masa de Sensor | Pin 2: Tensión Dividida 5V VREF',
      signalType: 'Variación de Resistencia Ohmic por Temperatura',
      voltageRange: '4.0V (Frio -20°C) → 0.5V (Caliente 90°C)',
      description: 'Informa la temperatura de trabajo del motor para ajustar el enriquecimiento de arranque en frío y activar el electroventilador.',
      commonFailures: ['Dificultad de arranque en frío', 'Consumo excesivo de combustible', 'Código DTC P0117 / P0118'],
      testMethod: 'Medición de resistencia ohmios con multímetro en función de la temperatura del refrigerante.',
    },
    tps: {
      id: 'tps',
      shortName: 'TPS',
      fullName: 'Sensor de Posición de Mariposa (Throttle Position)',
      type: 'Potenciómetro Doble de Pista Resistiva o Hall',
      pinout: 'Pin 1: +5V VREF | Pin 2: Masa | Pin 3: Señal Main | Pin 4: Señal Sub',
      signalType: 'Doble Tensión Inversa Cruzada',
      voltageRange: 'Pista 1: 0.5V → 4.5V | Pista 2: 4.5V → 0.5V',
      description: 'Informa el porcentaje de apertura de la mariposa de aceleración para estrategias de aceleración brusca y corte en desaceleración.',
      commonFailures: ['Jaloneos a velocidad constante por desgaste de pista', 'Código DTC P0121 / P0122'],
      testMethod: 'Verificación de la curva analógica en osciloscopio asegurando que no existan caídas a 0V durante el recorrido.',
    },
    o2: {
      id: 'o2',
      shortName: 'O2 Lambda',
      fullName: 'Sonda Lambda / Sensor de Oxígeno (Oxygen Sensor)',
      type: 'Zirconio Calefaccionado (4 Cables)',
      pinout: 'Pin 1-2: Calefactor (12V PWM) | Pin 3: Señal + | Pin 4: Señal -',
      signalType: 'Oscilación de Voltaje por Diferencia de Oxígeno',
      voltageRange: '0.1V (Mezcla Pobre) → 0.9V (Mezcla Rica)',
      description: 'Evalúa la eficiencia de la combustión en el tubo de escape para que la ECU mantenga el bucle cerrado de regulación.',
      commonFailures: ['Luz Check Engine encendida', 'Sensor perezoso por contaminación de azufre o aceite', 'Código DTC P0130 / P0133'],
      testMethod: 'Medición de frecuencia de oscilación en ralentí (al menos 8 a 10 conmutaciones por cada 10 segundos).',
    },
    map: {
      id: 'map',
      shortName: 'MAP',
      fullName: 'Sensor de Presión Absoluta del Múltiple (Manifold Absolute Pressure)',
      type: 'Piezo-resistivo Integrado',
      pinout: 'Pin 1: +5V VREF | Pin 2: Masa | Pin 3: Señal de Presión',
      signalType: 'Voltaje Analógico Proporcional a la Carga del Motor',
      voltageRange: '1.2V (Alto Vacío 20 inHg) → 4.8V (Presión Atmosférica)',
      description: 'Mide la presión negativa dentro del múltiple de admisión para determinar la carga del motor y calcular avance de chispa.',
      commonFailures: ['Marcha mínima inestable', 'Humo negro y bujías carbonizadas', 'Código DTC P0106 / P0107'],
      testMethod: 'Aplicación de vacío manual con bomba Mityvac verificando la respuesta proporcional de voltaje.',
    },
    injector: {
      id: 'injector',
      shortName: 'Inyector',
      fullName: 'Inyector de Combustible Multipunto / Directo GDI',
      type: 'Solenoide Inductivo / Piezoeléctrico',
      pinout: 'Pin 1: +12V Relé de Inyección | Pin 2: Pulso de Masa PWM ECU',
      signalType: 'Pulso de Ancho Variable (PWM) + Pico Inductivo de Retorno',
      voltageRange: '12V Continuo → 0V Pulso Masa → 60V-80V Peak Inductivo',
      description: 'Pulveriza el combustible en microgotas dentro de la cámara o múltiple durante el tiempo de apertura calculado.',
      commonFailures: ['Misfire / Fallo de cilindro', 'Inyector goteando provocando ahogamiento', 'Código DTC P0300 / P0301'],
      testMethod: 'Trazado de onda de corriente con pinza amperimétrica y balance de inyectores en tina de ultrasonido.',
    },
    coil: {
      id: 'coil',
      shortName: 'Bobina COP',
      fullName: 'Bobina de Encendido Individual (Coil-On-Plug)',
      type: 'Inductiva con Driver Transistorizado Integrado (3 u 8 Pines)',
      pinout: 'Pin 1: +12V Encendido | Pin 2: Masa de Potencia | Pin 3: Pulso Triger 5V ECU',
      signalType: 'Pulso de Disparo Digital + Arco Voltaje Secundario',
      voltageRange: 'Triger 5V → Arco Secundario de High Voltage 25,000V - 35,000V',
      description: 'Eleva el voltaje de la batería a miles de voltios para generar la chispa eléctrica entre los electrodos de la bujía.',
      commonFailures: ['Fallo de encendido en carga', 'Aislamiento roto con salto de chispa a masa', 'Código DTC P0351 / P0352'],
      testMethod: 'Medición de tiempo de quemado (Burn Time > 1.2 ms) con atenuador inductivo y osciloscopio.',
    },
  };

  const selected = componentsData[selectedComp] || componentsData.ckp;

  return (
    <section id="interactive-diagram" className="py-20 bg-[#0a0e28] text-white relative overflow-hidden border-y border-blue-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-900/60 border border-blue-700/50 text-[#ff9100] text-xs font-extrabold uppercase tracking-wider">
            <Wrench className="w-4 h-4 text-[#ff9100]" />
            Inspector de Componentes Interactivos
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Esquema Técnico Interactivo de Sensores y Actuadores
          </h2>
          <p className="text-sm sm:text-base text-gray-300 font-normal leading-relaxed">
            Haz clic en cualquier componente para inspeccionar sus especificaciones eléctricas, pinouts, voltajes nominales y metodos de diagnóstico.
          </p>

          {/* Component Selection Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
            {Object.keys(componentsData).map((key) => {
              const item = componentsData[key];
              return (
                <button
                  key={key}
                  onClick={() => setSelectedComp(key)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    selectedComp === key
                      ? 'bg-[#ff6f00] text-white shadow-lg shadow-orange-600/30 border border-orange-400'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {item.shortName}
                </button>
              );
            })}
          </div>
        </div>

        {/* INSPECTOR PANEL */}
        <div className="bg-slate-950/90 border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 relative overflow-hidden">
          
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <span className="text-xs font-mono font-bold text-[#ff9100] uppercase tracking-wider">
                COMPONENTE SELECCIONADO
              </span>
              <h3 className="text-xl font-extrabold text-white mt-0.5">{selected.fullName}</h3>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-3 py-1 rounded-lg border border-emerald-800">
              {selected.type}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-normal">{selected.description}</p>

          {/* Technical Specs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            
            <div className="p-4 rounded-xl bg-slate-900 border border-white/10 space-y-1.5">
              <div className="text-[11px] font-extrabold text-sky-400 font-mono uppercase">Pinout & Conexión</div>
              <p className="text-xs text-gray-200 font-mono">{selected.pinout}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-white/10 space-y-1.5">
              <div className="text-[11px] font-extrabold text-amber-400 font-mono uppercase">Rango Nominal de Voltaje</div>
              <p className="text-xs text-gray-200 font-mono">{selected.voltageRange}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-white/10 space-y-1.5">
              <div className="text-[11px] font-extrabold text-emerald-400 font-mono uppercase">Tipo de Señal de Onda</div>
              <p className="text-xs text-gray-200 font-mono">{selected.signalType}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-white/10 space-y-1.5">
              <div className="text-[11px] font-extrabold text-cyan-400 font-mono uppercase">Método Recomendado de Prueba</div>
              <p className="text-xs text-gray-200 font-mono">{selected.testMethod}</p>
            </div>

          </div>

          {/* Common Failures List */}
          <div className="p-4 rounded-xl bg-orange-950/30 border border-orange-500/30 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#ff9100]">
              <ShieldAlert className="w-4 h-4" />
              <span>Síntomas Comunes de Falla & Códigos DTC</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-xs text-gray-300 font-normal">
              {selected.commonFailures.map((fail, idx) => (
                <li key={idx}>{fail}</li>
              ))}
            </ul>
          </div>

        </div>

      </div>
    </section>
  );
};
