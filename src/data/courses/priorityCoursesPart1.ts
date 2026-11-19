import { Course } from '../../types';

// Helper to construct a standard quiz question
const q = (id: string, question: string, options: string[], correctAnswer: number, explanation: string) => ({
  id, question, options, correctAnswer, explanation
});

// Priority Complete Courses Part 1 (Courses 1 - 13)
export const PRIORITY_COURSES_PART1: Course[] = [
  // 1. Electricidad Automotriz Básica
  {
    id: 'electricidad-automotriz-basica',
    title: 'Electricidad Automotriz Básica y Diagnóstico de Circuitos',
    icon: '🔌',
    category: 'electrical',
    categoryLabel: 'Electricidad Automotriz',
    description: 'Fundamentos de voltaje, corriente, resistencia, Ley de Ohm, caídas de tensión y uso del multímetro en automóviles.',
    longDescription: 'Curso integral diseñado para dominar los fundamentos de la electricidad automotriz moderna. Aprende a interpretar caídas de tensión en relés, fusible, alternadores, baterías y consumidores eléctricos usando metodología de medición OEM.',
    objectives: [
      'Dominar la Ley de Ohm y la Ley de Watt aplicadas a circuitos automotrices.',
      'Medir e interpretar caídas de tensión dinámicas bajo carga eléctrica real.',
      'Diagnosticar fallas por alta resistencia, cortocircuitos y consumos parásitos.',
      'Interpretar esquemas eléctricos automotrices con codificación de colores.'
    ],
    requirements: [
      'Conocimientos básicos de mecánica o física básica.',
      'Multímetro digital automotriz True-RMS.'
    ],
    learningOutcomes: [
      'Localización de fallas de masa/tierra en menos de 10 minutos.',
      'Diagnóstico de problemas de carga de batería y alternadores inteligente.'
    ],
    price: 199,
    duration: '8 Semanas (60 hrs)',
    level: 'Inicial',
    status: 'PUBLISHED',
    systemId: 'sistema-electrico',
    relatedVehicle: 'General (12V Convencional)',
    relatedCases: ['case-001-falla-carga', 'case-005-consumo-parasito'],
    relatedLabs: ['lab-circuito-12v', 'lab-caida-tension'],
    recommendedAiMode: 'diagnostico',
    features: ['Prácticas con multímetro True-RMS', 'Análisis de caídas de tensión bajo carga', 'Certificación oficial Yove Academy'],
    instructor: 'Ing. Carlos Mendoza',
    rating: 4.95,
    reviewsCount: 310,
    modules: [
      {
        id: 'eab-m1',
        title: 'Módulo 1: Fundamentos de Electrostática y Ley de Ohm Automotriz',
        description: 'Parámetros eléctricos fundamentales: Voltios, Amperios, Ohmios y Watts en sistemas de 12V.',
        lessons: [
          {
            id: 'eab-m1-l1',
            title: 'Lección 1.1: Magnitudes Eléctricas y el Atomo en Automoción',
            duration: '20 min',
            type: 'video',
            textContent: 'El movimiento de electrones libres en conductores de cobre genera corriente eléctrica. En el automóvil, la batería provee diferencia de potencial (12.6V en reposo).'
          },
          {
            id: 'eab-m1-l2',
            title: 'Lección 1.2: Ley de Ohm (V = I x R) y Ley de Watt (P = V x I)',
            duration: '25 min',
            type: 'interactive',
            textContent: 'Calcula cómo varía la corriente cuando se incrementa la resistencia por corrosión en una masa o terminal de batería.'
          },
          {
            id: 'eab-m1-l3',
            title: 'Lección 1.3: Tipos de Circuitos: Serie, Paralelo y Mixto',
            duration: '30 min',
            type: 'video',
            textContent: 'Análisis de comportamiento de voltaje y corriente en focos en serie vs focos en paralelo.'
          },
          {
            id: 'eab-m1-l4',
            title: 'Lección 1.4: Taller Práctico: Cálculo de Cargas y Protección con Fusibles',
            duration: '35 min',
            type: 'interactive',
            activity: {
              id: 'act-eab-1',
              title: 'Cálculo de Fusible Adecuado para un Circuito de Luces LED',
              instructions: 'Dado un consumo de 120W a 12V, calcula la corriente requerida y selecciona el fusible maxi/mini apropiado con margen de seguridad del 25%.',
              requiredTools: ['Calculadora', 'Tabla de calibres AWG'],
              expectedOutput: 'Corriente calculada de 10A, fusible seleccionado de 15A.'
            }
          }
        ],
        quiz: {
          id: 'q-eab-m1',
          title: 'Quiz Módulo 1: Ley de Ohm y Magnitudes',
          passingScore: 80,
          questions: [
            q('q-eab-1-1', '¿Cuál es la tensión nominal en reposo de una batería plomo-ácido de 12V al 100% de carga?', ['12.0V', '12.6V', '13.8V', '14.5V'], 1, 'Una batería cargada al 100% indica 12.6V en reposo a temperatura ambiente.'),
            q('q-eab-1-2', 'Si la resistencia de un circuito aumenta al doble manteniendo el voltaje constante, ¿qué sucede con la corriente?', ['Aumenta al doble', 'Se reduce a la mitad', 'Se mantiene igual', 'Se cuadruplica'], 1, 'Según I = V / R, la corriente es inversamente proporcional a la resistencia.')
          ]
        }
      },
      {
        id: 'eab-m2',
        title: 'Módulo 2: Técnicas de Medición con Multímetro Automotriz',
        description: 'Uso correcto de voltímetro, amperímetro y ohmetro sin dañar módulos de control.',
        lessons: [
          {
            id: 'eab-m2-l1',
            title: 'Lección 2.1: Anatomía y Selector del Multímetro Digital True-RMS',
            duration: '20 min',
            type: 'video',
            textContent: 'Aprende las diferencias entre escalas de voltaje DC, AC, resistencia, continuidad y diodo.'
          },
          {
            id: 'eab-m2-l2',
            title: 'Lección 2.2: Medición de Voltaje sin Carga vs Medición bajo Carga',
            duration: '25 min',
            type: 'interactive',
            textContent: 'Por qué medir 12V con un voltímetro de alta impedancia no garantiza que un circuito funcione si existe resistencia parásita.'
          },
          {
            id: 'eab-m2-l3',
            title: 'Lección 2.3: Medición de Corriente con Pinza Amperimétrica de Corriente Directa (DC)',
            duration: '30 min',
            type: 'video',
            textContent: 'Medición de amperaje en marcha y alternador con pinza de efecto Hall de 0-60A y 0-600A.'
          },
          {
            id: 'eab-m2-l4',
            title: 'Lección 2.4: Práctica: Detección de Consumos Parásitos (Parasitic Drain)',
            duration: '40 min',
            type: 'interactive',
            activity: {
              id: 'act-eab-2',
              title: 'Prueba de Consumo Parásito en Módulo BCM',
              instructions: 'Mide la caída de millivoltios a través de los fusibles (Fuse Voltage Drop) para identificar qué módulo no entra en modo Sleep.',
              requiredTools: ['Multímetro mV DC', 'Tabla de caída de mV por fusible'],
              expectedOutput: 'Identificación de consumo parásito superior a 50mA.'
            }
          }
        ],
        quiz: {
          id: 'q-eab-m2',
          title: 'Quiz Módulo 2: Instrumentación y Mediciones',
          passingScore: 80,
          questions: [
            q('q-eab-2-1', '¿Cuál es el valor máximo aceptable de consumo parásito en un vehículo moderno con el sistema en reposo?', ['5 mA', '50 mA', '200 mA', '1 Amperio'], 1, 'El límite estándar de la industria para consumo parásito es de 30mA a 50mA.'),
            q('q-eab-2-2', '¿Por qué nunca se debe medir resistencia (Ohmios) en un circuito alimentado con voltaje?', ['Se quema el foco', 'Se destruye o daña el fusible interno del multímetro', 'Da lectura cero siempre', 'Se apaga la batería'], 1, 'El ohmetro aplica una pequeña batería interna; aplicar voltaje externo daña el instrumento.')
          ]
        }
      },
      {
        id: 'eab-m3',
        title: 'Módulo 3: Diagnóstico por Caída de Tensión (Voltage Drop Testing)',
        description: 'La técnica reina para localizar sulfataciones, empalmes defectuosos y cables dañados.',
        lessons: [
          {
            id: 'eab-m3-l1',
            title: 'Lección 3.1: Principio Fisicoquímico de la Caída de Tensión',
            duration: '20 min',
            type: 'video',
            textContent: 'Toda resistencia no deseable consume parte del voltaje total disponible en el circuito.'
          },
          {
            id: 'eab-m3-l2',
            title: 'Lección 3.2: Pruebas de Caída de Tensión en el Sistema de Carga (Positivo y Masa)',
            duration: '30 min',
            type: 'interactive',
            textContent: 'Paso a paso para medir caída entre B+ de alternador y borne positivo de batería.'
          },
          {
            id: 'eab-m3-l3',
            title: 'Lección 3.3: Pruebas de Caída de Tensión en el Motor de Arranque (Circuito de Alta Corriente)',
            duration: '25 min',
            type: 'video',
            textContent: 'Evaluación del solenoide y cable de potencia durante el arranque (Cranking test).'
          },
          {
            id: 'eab-m3-l4',
            title: 'Lección 3.4: Laboratorio: Mapeo de Caídas de Tensión en Tierra de Chasis y Bloque',
            duration: '35 min',
            type: 'interactive'
          }
        ],
        quiz: {
          id: 'q-eab-m3',
          title: 'Quiz Módulo 3: Caída de Tensión',
          passingScore: 80,
          questions: [
            q('q-eab-3-1', '¿Cuál es la caída de tensión máxima permitida en el cable positivo entre el alternador y la batería a plena carga?', ['0.2V (200mV)', '1.5V', '3.0V', '0.0V exactos'], 0, 'La norma de ingeniería establece un máximo tolerable de 0.2V a 0.3V en cables de carga.'),
            q('q-eab-3-2', '¿En qué condición debe realizarse la prueba de caída de tensión?', ['Con el circuito apagado y sin corriente', 'Con el circuito encendido y la corriente fluyendo', 'Con la batería desconectada', 'En escala de Ohmios'], 1, 'Para medir caída de tensión se requiere que la corriente fluya a través del circuito bajo prueba.')
          ]
        }
      },
      {
        id: 'eab-m4',
        title: 'Módulo 4: Relés, Solenoides, Interruptores y Componentes de Control',
        description: 'Análisis y comprobación de relés de 4 y 5 pines, diodos de supresión y solenoides.',
        lessons: [
          {
            id: 'eab-m4-l1',
            title: 'Lección 4.1: Estructura del Relé Automotriz (Circuito de Control PIN 85/86 y Potencia PIN 30/87/87a)',
            duration: '25 min',
            type: 'video'
          },
          {
            id: 'eab-m4-l2',
            title: 'Lección 4.2: Diodos y Resistencias de Supresión de Picos Inductivos en Relés',
            duration: '20 min',
            type: 'interactive'
          },
          {
            id: 'eab-m4-l3',
            title: 'Lección 4.3: Diagnóstico de Solenoides e Inyectores con Multímetro y Probador de Foco Lógico',
            duration: '30 min',
            type: 'video'
          },
          {
            id: 'eab-m4-l4',
            title: 'Lección 4.4: Práctica: Simulación de Fallas en Banco de Pruebas de Relés',
            duration: '35 min',
            type: 'interactive'
          }
        ],
        quiz: {
          id: 'q-eab-m4',
          title: 'Quiz Módulo 4: Relés y Solenoides',
          passingScore: 80,
          questions: [
            q('q-eab-4-1', '¿Qué números corresponden a los pines de la bobina de control de un relé DIN estándar?', ['30 y 87', '85 y 86', '87 y 87a', '15 y 31'], 1, 'Los terminales 85 y 86 corresponden a los extremos de la bobina electromagnética de control.'),
            q('q-eab-4-2', '¿Qué función cumple el diodo en paralelo con la bobina de un relé?', ['Aumentar la velocidad de encendido', 'Eliminar picos de alto voltaje inductivo (Back-EMF) al apagar', 'Convertir corriente alterna en continua', 'Proteger contra sobrecalentamiento'], 1, 'El diodo apaga el pico de autoinducción electromotriz evitando daños al transistor driver de la ECU.')
          ]
        }
      },
      {
        id: 'eab-m5',
        title: 'Módulo 5: Diagnóstico del Sistema de Batería, Carga y Arranque',
        description: 'Evaluación integral de Baterías AGM/EFB, Alternadores con control de carga inteligente (LIN/PWM) y Motores de Arranque.',
        lessons: [
          {
            id: 'eab-m5-l1',
            title: 'Lección 5.1: Baterías Plomo-Ácido, EFB y AGM: Pruebas de Resistencia Interna (CCA)',
            duration: '25 min',
            type: 'video'
          },
          {
            id: 'eab-m5-l2',
            title: 'Lección 5.2: Alternadores Convencionales vs Carga Inteligente (RVC / LIN Bus)',
            duration: '30 min',
            type: 'interactive'
          },
          {
            id: 'eab-m5-l3',
            title: 'Lección 5.3: Diagnóstico del Motor de Arranque e Interruptor Neumático/Solenoide',
            duration: '25 min',
            type: 'video'
          },
          {
            id: 'eab-m5-l4',
            title: 'Lección 5.4: Evaluación Final de Laboratorio Electrónico',
            duration: '40 min',
            type: 'interactive'
          }
        ],
        quiz: {
          id: 'q-eab-m5',
          title: 'Quiz Módulo 5: Sistema de Carga y Arranque',
          passingScore: 80,
          questions: [
            q('q-eab-5-1', '¿Qué voltaje de salida genera un alternador convencional con el motor encendido a 2000 RPM?', ['12.0V - 12.5V', '13.8V - 14.5V', '15.5V - 16.5V', '11.5V'], 1, 'El rango normal de regulación en alternadores de 12V es de 13.8V a 14.5V.'),
            q('q-eab-5-2', '¿Qué tecnología de batería se requiere en vehículos con sistema Auto Start-Stop?', ['Batería de gel estándar', 'Batería EFB o AGM', 'Batería plomo-ácido convencional', 'Batería de NiCad'], 1, 'Start-Stop exige baterías EFB o AGM diseñadas para soportar ciclos profundos de descarga rápida.')
          ]
        }
      }
    ],
    exam: {
      id: 'ex-eab-final',
      title: 'Examen de Certificación: Electricidad Automotriz Básica',
      description: 'Evaluación teórica y de casos de laboratorio para certificar aptitud en electricidad automotriz.',
      timeLimitMinutes: 60,
      passingScore: 80,
      attemptsAllowed: 3,
      questions: [
        q('ex-eab-q1', 'Un técnico mide 12.6V en el borne de la batería con el foco encendido, pero el foco no ilumina. Al medir en el foco hay 0V. ¿Dónde se encuentra la falla?', ['En la batería descargada', 'En una interrupción/circuito abierto en la línea positiva o de masa hacia el foco', 'En el alternador', 'El foco está en cortocircuito interno'], 1, 'Si hay voltaje en batería pero 0V en el consumidor con circuito cerrado, hay un circuito abierto antes del consumidor.'),
        q('ex-eab-q2', 'Al medir caída de tensión entre la carcasa del alternador y el borne negativo de la batería se obtiene 0.85V. ¿Qué diagnosticas?', ['Sistemas en perfecto estado', 'Defectuosa masa de motor a chasis/batería que causa bajo voltaje de carga', 'Alternador quemado', 'Batería sulfatada internamente'], 1, 'Una caída superior a 0.2V en el lado negativo indica resistencia en las conexiones de tierra de motor.'),
        q('ex-eab-q3', '¿Qué sucede si se instala un cable de calibre más delgado (mayor número AWG) del recomendado para un motoventilador de 20A?', ['Funcionará más rápido', 'Sufrirá alta caída de tensión, calentamiento excesivo del cable y posible incendio', 'Aumentará el voltaje', 'Consumirá menos batería'], 1, 'Un cable delgado presenta mayor resistencia, lo que provoca calentamiento peligroso y caída de tensión.')
      ]
    }
  },

  // 2. Electrónica Automotriz
  {
    id: 'electronica-automotriz-avanzada',
    title: 'Electrónica Automotriz y Análisis de Componentes SMD',
    icon: '🤖',
    category: 'electronics',
    categoryLabel: 'Electrónica Automotriz',
    description: 'Semiconductores, diodos Zener, transistores BJT, MOSFET, IGBT, amplificadores operacionales y microsoldadura.',
    longDescription: 'Aprende los principios físicos y de diagnóstico de la electrónica analógica y digital aplicada a módulos de control automotriz (ECU, TCU, BCM, ABS).',
    objectives: [
      'Identificar y probar componentes de montaje superficial (SMD) en placas impresas (PCB).',
      'Diagnosticar etapas de potencia con MOSFET e IGBT mediante osciloscopio y trazador de curvas.',
      'Comprender el funcionamiento de reguladores de voltaje switching y lineales en ECUs.'
    ],
    requirements: ['Electricidad Automotriz Básica', 'Estación de soldadura y multímetro'],
    learningOutcomes: ['Identificación de componentes quemados en ECUs', 'Prueba de transistores driver fuera de placa'],
    price: 249,
    duration: '8 Semanas (60 hrs)',
    level: 'Intermedio',
    status: 'PUBLISHED',
    systemId: 'ecu-motor',
    relatedVehicle: 'General (Módulos Electrónicos)',
    relatedCases: ['case-002-ecu-no-comunica', 'case-008-inyección-fallida-driver'],
    relatedLabs: ['lab-ecu-bench', 'lab-mosfet-test'],
    recommendedAiMode: 'aprender',
    features: ['Comprobación de semiconductores', 'Microsoldadura SMD con aire caliente', 'Análisis de datasheets'],
    instructor: 'Ing. Mateo Benítez',
    rating: 4.92,
    reviewsCount: 280,
    modules: [
      {
        id: 'ela-m1',
        title: 'Módulo 1: Diodos, Zener, Varistores y Diodos TVS de Protección',
        description: 'Semiconductores P-N, rectificación, regulación Zener y protección contra picos de voltaje.',
        lessons: [
          { id: 'ela-m1-l1', title: 'Lección 1.1: Física de Semiconductores de Silicio y Germanio', duration: '20 min', type: 'video' },
          { id: 'ela-m1-l2', title: 'Lección 1.2: Diodos Rectificadores y Diodos Zener en Fuentes de Alimentación', duration: '25 min', type: 'interactive' },
          { id: 'ela-m1-l3', title: 'Lección 1.3: Diodos de Supresión de Transitorios (TVS) en Líneas CAN/Power', duration: '25 min', type: 'video' },
          { id: 'ela-m1-l4', title: 'Lección 1.4: Taller: Comprobación de Diodos Fuera y Dentro de Placa', duration: '30 min', type: 'interactive' }
        ],
        quiz: {
          id: 'q-ela-m1',
          title: 'Quiz Módulo 1: Diodos y Protección',
          passingScore: 80,
          questions: [
            q('q-ela-1-1', '¿Qué voltaje de polarización directa (Vf) presenta típicamente un diodo rectificador de silicio?', ['0.2V', '0.6V - 0.7V', '1.2V', '5.0V'], 1, 'Los diodos de silicio presentan una caída de voltaje directa estándar de 0.6V a 0.7V.'),
            q('q-ela-1-2', '¿Cómo se conecta un diodo Zener para funcionar como regulador de voltaje?', ['En polarización directa', 'En polarización inversa alcanzando su tensión de ruptura Zener', 'Sin conexión a tierra', 'En serie con el fusible'], 1, 'El diodo Zener trabaja en polarización inversa fija recortando el voltaje al valor Zener especificable.')
          ]
        }
      },
      {
        id: 'ela-m2',
        title: 'Módulo 2: Transistores NPN, PNP, MOSFET e IGBT Automotrices',
        description: 'Drivers de inyectores, bobinas COP, relés y actuadores PWM.',
        lessons: [
          { id: 'ela-m2-l1', title: 'Lección 2.1: Transistores Bipolares (BJT): Base, Colector y Emisor', duration: '25 min', type: 'video' },
          { id: 'ela-m2-l2', title: 'Lección 2.2: Transistores MOSFET de Canal N y Canal P para Alta Corriente', duration: '30 min', type: 'interactive' },
          { id: 'ela-m2-l3', title: 'Lección 2.3: Transistores IGBT (Insulated Gate Bipolar Transistor) en Encendido e Inversores', duration: '30 min', type: 'video' },
          { id: 'ela-m2-l4', title: 'Lección 2.4: Práctica: Prueba de Conmutación de MOSFETs con Multímetro en Módulo ECU', duration: '35 min', type: 'interactive' }
        ],
        quiz: {
          id: 'q-ela-m2',
          title: 'Quiz Módulo 2: Transistores de Potencia',
          passingScore: 80,
          questions: [
            q('q-ela-2-1', '¿Qué ventajas combina un transistor IGBT?', ['Alta impedancia de entrada de un MOSFET y baja tensión de saturación de un BJT', 'Mayor tamaño y menor costo', 'Funcionamiento exclusivo en AC', 'Sensibilidad a la temperatura'], 0, 'El IGBT combina la compuerta aislada tipo MOSFET con la alta capacidad de corriente BJT para cargas de alto voltaje.'),
            q('q-ela-2-2', '¿Qué terminal de un MOSFET controla la conducción entre Drenador (Drain) y Fuente (Source)?', ['Base', 'Compuerta (Gate)', 'Emisor', 'Ánodo'], 1, 'El voltaje aplicado a la Compuerta (Gate) crea el canal de conducción entre Drenador y Fuente.')
          ]
        }
      },
      {
        id: 'ela-m3',
        title: 'Módulo 3: Amplificadores Operacionales y Sensores Acondicionados',
        description: 'Circuitos comparadores, amplificadores diferencial para sensores de corriente y Wheatstone.',
        lessons: [
          { id: 'ela-m3-l1', title: 'Lección 3.1: Configuración Inversora y No Inversora de un Op-Amp', duration: '25 min', type: 'video' },
          { id: 'ela-m3-l2', title: 'Lección 3.2: Comparadores de Voltaje para Detección de Umbral y Histéresis', duration: '25 min', type: 'interactive' },
          { id: 'ela-m3-l3', title: 'Lección 3.3: Amplificadores de Shunt de Corriente en Módulos de Batería y BMS', duration: '30 min', type: 'video' },
          { id: 'ela-m3-l4', title: 'Lección 3.4: Laboratorio: Medición de Señales de Salida de Op-Amp en ECU', duration: '35 min', type: 'interactive' }
        ],
        quiz: {
          id: 'q-ela-m3',
          title: 'Quiz Módulo 3: Amplificadores Operacionales',
          passingScore: 80,
          questions: [
            q('q-ela-3-1', '¿Cuál es la impedancia de entrada ideal de un amplificador operacional?', ['0 Ohmios', 'Infinitamente alta (Megaohmios)', '50 Ohmios', '1 Ohmio'], 1, 'Un Op-Amp ideal no consume corriente de la fuente de señal de entrada debido a su impedancia de entrada infinita.'),
            q('q-ela-3-2', '¿Para qué sirve la histéresis en un comparador con amplificador operacional?', ['Para amplificar ruido', 'Para evitar oscilaciones o falsos disparos cerca del punto de conmutación', 'Para reducir voltaje', 'Para invertir corriente'], 1, 'La histéresis introduce dos umbrales evitando que el ruido haga conmutar erráticamente la salida.')
          ]
        }
      },
      {
        id: 'ela-m4',
        title: 'Módulo 4: Fuentes de Alimentación Conmutadas (Buck / Boost) en ECUs',
        description: 'Convertidores reguladores de 5V de referencia de sensores y voltajes de inyección de 80V GDI.',
        lessons: [
          { id: 'ela-m4-l1', title: 'Lección 4.1: Reguladores Lineales (7805 / LLE) vs Reguladores Switching', duration: '25 min', type: 'video' },
          { id: 'ela-m4-l2', title: 'Lección 4.2: Arquitectura Buck Step-Down (12V a 5V/3.3V) e Inductores de Potencia', duration: '30 min', type: 'interactive' },
          { id: 'ela-m4-l3', title: 'Lección 4.3: Arquitectura Boost Step-Up (12V a 65V/80V) para Inyección Directa GDI', duration: '30 min', type: 'video' },
          { id: 'ela-m4-l4', title: 'Lección 4.4: Diagnóstico: Caída de la Línea de 5V de Referencia por Corto a Masa', duration: '35 min', type: 'interactive' }
        ],
        quiz: {
          id: 'q-ela-m4',
          title: 'Quiz Módulo 4: Fuentes Reguladas en ECU',
          passingScore: 80,
          questions: [
            q('q-ela-4-1', 'Si el voltaje de referencia de 5V de la ECU cae a 1.2V al conectar el sensor TPS, ¿cuál es la causa más probable?', ['Falla del alternador', 'El sensor TPS presenta un cortocircuito interno a masa colapsando la fuente de 5V', 'La batería está baja', 'Bujía defectuosa'], 1, 'Un corto interno en cualquier sensor alimentado por los 5V de referencia arrastra toda la línea regulada a tierra.'),
            q('q-ela-4-2', '¿Qué componente almacena energía magnética en un regulador conmutado tipo Buck?', ['Condensador electrolítico', 'Inductor (Bobina de potencia)', 'Resistencia carbón', 'Diodo LED'], 1, 'El inductor almacena energía magnética durante el periodo TON del transistor y la entrega a la carga en TOFF.')
          ]
        }
      },
      {
        id: 'ela-m5',
        title: 'Módulo 5: Técnicas de Soldadura y Reemplazo de Componentes SMD',
        description: 'Estación de soldadura, pistola de aire caliente, flux, malla desoldadora y microscopio trinocular.',
        lessons: [
          { id: 'ela-m5-l1', title: 'Lección 5.1: Encapsulados SMD: SOIC, QFP, QFN, DPAK y BGA', duration: '25 min', type: 'video' },
          { id: 'ela-m5-l2', title: 'Lección 5.2: Perfiles de Temperatura con Aire Caliente y Uso de Flux Orgánico', duration: '30 min', type: 'interactive' },
          { id: 'ela-m5-l3', title: 'Lección 5.3: Reemplazo de un Driver de Inyección SOIC-20 Dañado', duration: '35 min', type: 'video' },
          { id: 'ela-m5-l4', title: 'Lección 5.4: Evaluación Práctica de Banco y Soldadura', duration: '40 min', type: 'interactive' }
        ],
        quiz: {
          id: 'q-ela-m5',
          title: 'Quiz Módulo 5: Microsoldadura y Reparación',
          passingScore: 80,
          questions: [
            q('q-ela-5-1', '¿Cuál es la función principal del flux durante el proceso de soldadura SMD?', ['Enfriar el componente', 'Limpiar la oxidación de los metales y mejorar la transferencia térmica y fluidez de la soldadura', 'Aumentar la resistencia eléctrica', 'Pegar los pines de plástico'], 1, 'El flux remueve óxidos superficiales y permite que la estaño líquido fluya limpiamente hacia los pads.'),
            q('q-ela-5-2', '¿A qué temperatura aproximada se ajusta la pistola de aire caliente para desoldar un chip SMD con estaño sin plomo (Lead-Free)?', ['150°C', '350°C - 380°C', '550°C', '100°C'], 1, 'La soldadura libre de plomo se funde a ~217°C, requiriendo aire caliente ajustado a 350°C-380°C con flujo controlado.')
          ]
        }
      }
    ],
    exam: {
      id: 'ex-ela-final',
      title: 'Examen de Certificación: Electrónica Automotriz',
      description: 'Certificación teórica y práctica en análisis de componentes y reparación de placas de ECU.',
      timeLimitMinutes: 60,
      passingScore: 80,
      attemptsAllowed: 3,
      questions: [
        q('ex-ela-q1', 'Al probar un transistor MOSFET fuera de la placa con el multímetro en prueba de diodos, se mide continuidad bip entre Drenador y Fuente en ambos sentidos. ¿Cuál es la condición del MOSFET?', ['Excelente estado', 'Cortocircuito interno (dañado)', 'Circuito abierto', 'Necesita más voltaje'], 1, 'Si existe continuidad directa en ambos sentidos entre Drain y Source, el dieléctrico o canal está destruido por sobrecorriente.'),
        q('ex-ela-q2', 'Un capacitor de tantalio en la entrada de alimentación de la ECU está carbonizado. ¿Qué síntoma genera típicamente?', ['Falta de chispas en cilindro 1', 'Cortocircuito directo que quema el fusible principal de la ECU al dar contacto', 'Aumento de RPM', 'Lectura errónea de temperatura'], 1, 'Los capacitores de tantalio al fallar se ponen en cortocircuito directo arrastrando la línea a tierra y quemando fusibles.')
      ]
    }
  },

  // 3. Sensores Automotrices
  {
    id: 'sensores-automotrices-diagnostico',
    title: 'Sensores Automotrices: Diagnóstico por Osciloscopio y Parámetros',
    icon: '📡',
    category: 'sensors',
    categoryLabel: 'Sensores Automotrices',
    description: 'Diagnóstico exhaustivo de CKP, CMP, MAF, MAP, TPS, ECT, IAT, Knock Sensor y Sensores de Presión Piezoeléctricos.',
    longDescription: 'Aprende a analizar el principio de funcionamiento de sensores inductivos, efecto Hall, ópticos, piezorresistivos y de circonio/banda ancha. Diagnostica señales distorsionadas, falta de sincronismo y códigos de falla asociados.',
    objectives: [
      'Identificar la firma de onda característica de cada sensor automotriz.',
      'Diferenciar sensores analógicos de sensores con señal digital PWM o SENT.',
      'Diagnosticar fallas de señal causadas por entrehierro, suciedad o cables dañados.'
    ],
    requirements: ['Electricidad y Electrónica Básica', 'Osciloscopio automotriz de 2 canales'],
    learningOutcomes: ['Diagnóstico preciso de sensores sin reemplazar componentes por adivinación'],
    price: 229,
    duration: '8 Semanas (60 hrs)',
    level: 'Intermedio',
    status: 'PUBLISHED',
    systemId: 'sistema-inyeccion',
    relatedVehicle: 'General (Gasolina / Diésel)',
    relatedCases: ['case-003-ckp-intermitente', 'case-009-maf-descalibrado'],
    relatedLabs: ['lab-sensores-sim', 'lab-oscilloscope-signals'],
    recommendedAiMode: 'diagnostico',
    features: ['Librería de oscilogramas OEM', 'Diagnóstico por Live Data de Escáner', 'Casos reales de taller'],
    instructor: 'Ing. Alejandro Silva',
    rating: 4.96,
    reviewsCount: 340,
    modules: [
      {
        id: 'sen-m1',
        title: 'Módulo 1: Sensores Inductivos vs Sensores Efecto Hall y Ópticos',
        description: 'Comparativa de generadores de voltaje Variable Reluctance (VR) y sensores alimentados con 5V/12V.',
        lessons: [
          { id: 'sen-m1-l1', title: 'Lección 1.1: Sensores Inductivos de 2 Pines: Generación AC por Ley de Faraday', duration: '25 min', type: 'video' },
          { id: 'sen-m1-l2', title: 'Lección 1.2: Sensores Efecto Hall de 3 Pines: Onda Cuadrada Digital y Alimentación 5V/12V', duration: '30 min', type: 'interactive' },
          { id: 'sen-m1-l3', title: 'Lección 1.3: Sensores Ópticos y Mires Metálicas de Alta Configuración', duration: '20 min', type: 'video' },
          { id: 'sen-m1-l4', title: 'Lección 1.4: Taller: Comprobación de Amplitud Vpp y Frecuencia en CKP/CMP', duration: '35 min', type: 'interactive' }
        ],
        quiz: {
          id: 'q-sen-m1',
          title: 'Quiz Módulo 1: Tipos de Sensores de Posición',
          passingScore: 80,
          questions: [
            q('q-sen-1-1', '¿Qué tipo de señal produce un sensor de cigüeñal (CKP) inductivo de 2 pines?', ['Onda cuadrada DC de 0V a 5V', 'Onda senoidal de corriente alterna (AC) cuya amplitud aumenta con las RPM', 'Señal PWM de duty cycle constante', 'Señal de datos serie UART'], 1, 'Los sensores inductivos son generadores pasivos de onda senoidal de corriente alterna.'),
            q('q-sen-1-2', '¿Qué requiere un sensor de Efecto Hall de 3 pines para poder operar?', ['Alimentación de voltaje (5V o 12V), tierra y línea de señal pull-up', 'Únicamente conexión a masa', 'Corriente de alta frecuencia', 'Señal de encendido externa'], 0, 'El elemento Hall requiere alimentación activa y masa para conmutar el transistor de salida a masa.')
          ]
        }
      },
      {
        id: 'sen-m2',
        title: 'Módulo 2: Sensores de Flujo y Presión de Aire (MAF y MAP / BAP)',
        description: 'Sensores de hilo caliente (MAF analógico/frecuencia) y sensores piezorresistivos de presión absoluta de múltiple.',
        lessons: [
          { id: 'sen-m2-l1', title: 'Lección 2.1: Sensor MAF de Hilo Caliente Analógico (0.5V a 4.5V) y de Frecuencia (Hz)', duration: '25 min', type: 'video' },
          { id: 'sen-m2-l2', title: 'Lección 2.2: Sensor MAP de Puente de Wheatstone Piezorresistivo y Presión de Sobrealimentación Turbo', duration: '30 min', type: 'interactive' },
          { id: 'sen-m2-l3', title: 'Lección 2.3: Cálculo Teórico de Carga Volumétrica en Base a MAF/MAP', duration: '25 min', type: 'video' },
          { id: 'sen-m2-l4', title: 'Lección 2.4: Práctica: Prueba de Respuesta Dinámica SNAP Throttle en MAF con Osciloscopio', duration: '35 min', type: 'interactive' }
        ],
        quiz: {
          id: 'q-sen-m2',
          title: 'Quiz Módulo 2: MAF y MAP',
          passingScore: 80,
          questions: [
            q('q-sen-2-1', 'Al dar un acelerón a fondo (Snap Throttle) en un motor atmosférico con MAF en buen estado, ¿a cuánto debe elevarse el voltaje pico?', ['De 1.0V en ralenti a más de 3.8V - 4.2V pico', 'Se mantiene en 1.0V', 'Baja a 0.2V', 'Sube a 12.0V'], 0, 'Un acelerón repentino hace ingresar una gran masa de aire elevando la respuesta del MAF a casi 4V+ en motores saludables.'),
            q('q-sen-2-2', '¿Qué señal entrega un sensor MAP en ralenti con un vacío de múltiple de 18-20 inHg?', ['Voltaje alto (~4.5V)', 'Voltaje bajo (~1.0V - 1.5V)', '0 Volts', '5.0 Volts'], 1, 'Al haber alto vacío en ralenti, la presión absoluta es baja (~30 kPa), generando un voltaje bajo de 1.0V a 1.5V.')
          ]
        }
      },
      {
        id: 'sen-m3',
        title: 'Módulo 3: Sensores de Posición de Mariposa (TPS / APP) y Temperatura (ECT / IAT / EGT)',
        description: 'Potenciómetros dobles con señales cruzadas e invirtientes, termistores NTC.',
        lessons: [
          { id: 'sen-m3-l1', title: 'Lección 3.1: Cuerpo de Aceleración Electrónico: TPS 1 y TPS 2 con Pistas de Carbono/Hall Redundantes', duration: '25 min', type: 'video' },
          { id: 'sen-m3-l2', title: 'Lección 3.2: Sensor de Pedal de Acelerador APP 1 y APP 2: Correlación e Impedancia', duration: '25 min', type: 'interactive' },
          { id: 'sen-m3-l3', title: 'Lección 3.3: Termistores de Coeficiente de Temperatura Negativo (NTC) y Conmutación de Rango Dual', duration: '25 min', type: 'video' },
          { id: 'sen-m3-l4', title: 'Lección 3.4: Práctica: Búsqueda de Ruido de Pista o Puntos Ciegos en TPS con Osciloscopio', duration: '35 min', type: 'interactive' }
        ],
        quiz: {
          id: 'q-sen-m3',
          title: 'Quiz Módulo 3: TPS, APP y Temperatura',
          passingScore: 80,
          questions: [
            q('q-sen-3-1', 'En un cuerpo de aceleración redundante, si TPS 1 va de 0.5V a 4.5V, ¿cómo se comporta típicamente TPS 2?', ['Permanece en 0V', 'Va de 4.5V a 0.5V (señal invertida) o en proporción exacta de la mitad', 'Es idéntico a TPS 1', 'Genera señal alterna'], 1, 'La ECU exige señales redundantes o de espejo (cruzadas) para validar la seguridad del acelerador electrónico.'),
            q('q-sen-3-2', '¿Qué ocurre con la resistencia de un sensor NTC de temperatura de refrigerante (ECT) a medida que el motor se calienta?', ['Aumenta gradualmente', 'Disminuye gradualmente', 'Se mantiene constante', 'Sube a infinito'], 1, 'En termistores NTC (Negative Temperature Coefficient), al aumentar la temperatura la resistencia disminuye.')
          ]
        }
      },
      {
        id: 'sen-m4',
        title: 'Módulo 4: Sensores de Oxígeno Circonio, Titanio y Banda Ancha AFR / LSU 4.9',
        description: 'Monitoreo de mezcla estequiométrica (lambda 1.0) y sensores proporcionales de corriente de bombeo.',
        lessons: [
          { id: 'sen-m4-l1', title: 'Lección 4.1: Sensor de Oxígeno Convencional de Circonio (0.1V a 0.9V) y Calentador HO2S', duration: '25 min', type: 'video' },
          { id: 'sen-m4-l2', title: 'Lección 4.2: Sensor de Banda Ancha Air-Fuel Ratio (AFR) / Bosch LSU 4.2 y LSU 4.9', duration: '30 min', type: 'interactive' },
          { id: 'sen-m4-l3', title: 'Lección 4.3: Corriente de Bombeo (Ip) y Voltaje Nernst (Vs) en Sensores de Banda Ancha', duration: '30 min', type: 'video' },
          { id: 'sen-m4-l4', title: 'Lección 4.4: Práctica: Simulación de Mezcla Rica y Pobre con Propano e Inyección Enriquecida', duration: '35 min', type: 'interactive' }
        ],
        quiz: {
          id: 'q-sen-m4',
          title: 'Quiz Módulo 4: Sensores de Oxígeno y Banda Ancha',
          passingScore: 80,
          questions: [
            q('q-sen-4-1', '¿Qué voltaje genera un sensor de oxígeno de circonio convencional cuando detecta mezcla rica (exceso de combustible)?', ['0.1V - 0.2V', '0.8V - 0.95V', '2.5V', '5.0V'], 1, 'Una mezcla rica genera alta diferencia de oxígeno entre el escape y la referencia, produciendo ~0.9V.'),
            q('q-sen-4-2', 'En un sensor de banda ancha Bosch LSU 4.9, ¿qué parámetro utiliza la ECU para medir el valor de Lambda preciso?', ['La resistencia del calentador', 'La magnitud y dirección de la corriente de bombeo (Ip en miliamperios)', 'El voltaje de la batería', 'La frecuencia del pulso PWM'], 1, 'La ECU varía la corriente de bombeo Ip para mantener la celda Nernst balanceada a 450mV; Ip indica Lambda.')
          ]
        }
      },
      {
        id: 'sen-m5',
        title: 'Módulo 5: Sensores Especiales: Piezoeléctricos de Detonación (Knock) y Presión en Rampa GDI/Common Rail',
        description: 'Sensor KS de detección de picado de biela, sensores de alta presión de combustible piezoeléctricos.',
        lessons: [
          { id: 'sen-m5-l1', title: 'Lección 5.1: Sensor de Detonación (Knock Sensor) Piezoeléctrico y Análisis FFT de Frecuencia', duration: '25 min', type: 'video' },
          { id: 'sen-m5-l2', title: 'Lección 5.2: Sensor de Presión de Rampa de Combustible GDI / Common Rail (FRP)', duration: '25 min', type: 'interactive' },
          { id: 'sen-m5-l3', title: 'Lección 5.3: Sensores con Protocolo Digital SENT (Single Edge Nibble Transmission)', duration: '30 min', type: 'video' },
          { id: 'sen-m5-l4', title: 'Lección 5.4: Evaluación Práctica de Captura de Señales Complejas', duration: '40 min', type: 'interactive' }
        ],
        quiz: {
          id: 'q-sen-m5',
          title: 'Quiz Módulo 5: Sensores Especiales y SENT',
          passingScore: 80,
          questions: [
            q('q-sen-5-1', '¿Qué tipo de señal genera un sensor de detonación (KS) cuando ocurre autoencendido o cascabeleo en el cilindro?', ['Señal constante de 5V DC', 'Ráfaga de voltaje alterno (AC) a la frecuencia de resonancia del bloque (~6kHz-15kHz)', 'Señal digital CAN Bus', 'Cambio de resistencia'], 1, 'El cristal piezoeléctrico del sensor de detonación genera picos de AC al ser golpeado por las ondas mecánicas de cascabeleo.'),
            q('q-sen-5-2', '¿Qué característica define al protocolo de comunicación de sensores SENT (SAE J2716)?', ['Es un protocolo analógico de 0-5V', 'Es un protocolo unidireccional digital punto a punto que transmite datos codificados en duraciones de pulsos', 'Funciona solo en alta tensión', 'Es idéntico a LIN Bus'], 1, 'SENT transmite información digital redundante de alta resolución usando nibbles de tiempo con alta inmunidad a ruido.')
          ]
        }
      }
    ],
    exam: {
      id: 'ex-sen-final',
      title: 'Examen de Certificación: Sensores Automotrices',
      description: 'Certificación integral en diagnóstico y verificación de sensores con osciloscopio.',
      timeLimitMinutes: 60,
      passingScore: 80,
      attemptsAllowed: 3,
      questions: [
        q('ex-sen-q1', 'Un motor no arranca. El osciloscopio muestra señal senoidal en CKP de 1.5Vpp al dar marcha, pero la ECU marca 0 RPM en el escáner. La especificación exige mínimo 3.0Vpp. ¿Cuál es la causa?', ['Sensor Hall descalibrado', 'Entrehierro excesivo entre el sensor inductivo y la rueda fónica, o dientes sucios/dañados', 'Falta de voltaje de 5V', 'Ecu quemada'], 1, 'Si el entrehierro es muy grande, la amplitud de voltaje generada es insuficiente para que la ECU detecte los cruces por cero.'),
        q('ex-sen-q2', '¿Qué ocurre en el ajuste de combustible (Fuel Trim) si el sensor de masa de aire (MAF) está sucio y mide un 25% menos de aire del que realmente ingresa?', ['La ECU enriquece sumando Fuel Trim positivo (+25%) tratando de compensar la mezcla pobre leída por el sensor de oxígeno', 'La ECU corta los inyectores', 'El Fuel Trim se pone en -25%', 'No afecta la mezcla'], 0, 'Al medir menos aire, la ECU entrega menos combustible inicial. El sensor O2 ve mezcla pobre y la ECU eleva el STFT/LTFT a positivo.')
      ]
    }
  },

  // 4. Actuadores Automotrices
  {
    id: 'actuadores-automotrices-diagnostico',
    title: 'Actuadores Automotrices: Inyectores, Bobinas, Válvulas PWM y Solenoides',
    icon: '⚡',
    category: 'actuators',
    categoryLabel: 'Actuadores Automotrices',
    description: 'Diagnóstico de inyectores PFI/GDI/Common Rail, bobinas COP con o sin transistor, electroválvulas VVT, mariposas y canister.',
    longDescription: 'Domina los componentes encargados de ejecutar las órdenes de los módulos de control. Analiza patrones de corriente y voltaje con pinza amperimétrica y osciloscopio en inyectores de pico de inducción, bobinas de encendido e inyectores piezoeléctricos.',
    objectives: [
      'Analizar la curva de pico de voltaje de autoinducción (Back-EMF) en inyectores PFI y solenoides.',
      'Diferenciar bobinas de encendido de 2, 3 y 4 pines (transistor interno vs driver en ECU).',
      'Diagnosticar válvulas reguladoras de flujo PWM (VVT, IAC, EGR, Canister, Turbo VGT).'
    ],
    requirements: ['Electricidad Básica', 'Osciloscopio con pinza amperimétrica DC'],
    learningOutcomes: ['Localización de inyectores goteando o con bobina en corto', 'Diagnóstico de fallas de encendido por bobina COP'],
    price: 229,
    duration: '8 Semanas (60 hrs)',
    level: 'Intermedio',
    status: 'PUBLISHED',
    systemId: 'sistema-inyeccion',
    relatedVehicle: 'General (Gasolina / Diésel)',
    relatedCases: ['case-004-misfire-cilindro-2', 'case-010-vvt-solenoide-atascado'],
    relatedLabs: ['lab-actuadores-pwm', 'lab-injector-waveform'],
    recommendedAiMode: 'diagnostico',
    features: ['Análisis de patrón de voltaje y corriente simultáneo', 'Pruebas de actuadores por PWM', 'Medición de tiempo de quemado de bujías'],
    instructor: 'Ing. Carlos Mendoza',
    rating: 4.91,
    reviewsCount: 260,
    modules: [
      {
        id: 'act-m1',
        title: 'Módulo 1: Inyectores de Gasolina Multipunto (PFI) e Inyección Directa (GDI)',
        description: 'Patrones de pulso de inyección, tiempo de apertura, corriente Peak and Hold y picos de colapso magnético.',
        lessons: [
          { id: 'act-m1-l1', title: 'Lección 1.1: Inyector PFI Convencional: Circuito de Alimentación 12V y Pulso a Masa por ECU', duration: '25 min', type: 'video' },
          { id: 'act-m1-l2', title: 'Lección 1.2: Oscilograma de Voltaje: Tiempo de Inyección, Pico Zener (~60V-80V) y Punto Pintle Hump', duration: '30 min', type: 'interactive' },
          { id: 'act-m1-l3', title: 'Lección 1.3: Inyectores GDI Piezoeléctricos y Solenoide de Alta Presión con Control Peak & Hold (65V/12A)', duration: '30 min', type: 'video' },
          { id: 'act-m1-l4', title: 'Lección 1.4: Taller: Medición del Muesca de Cierre del Inyector (Pintle Hump) con Rampa de Corriente', duration: '35 min', type: 'interactive' }
        ],
        quiz: {
          id: 'q-act-m1',
          title: 'Quiz Módulo 1: Inyectores PFI y GDI',
          passingScore: 80,
          questions: [
            q('q-act-1-1', '¿Qué indica el pico de alto voltaje (~60V-80V) que se observa al finalizar el pulso de inyección en un inyector PFI?', ['Que la batería se sobrecargó', 'El colapso del campo magnético de la bobina al abrir el circuito (Back-EMF)', 'La apertura de la aguja', 'Un cortocircuito en la ECU'], 1, 'Al interrumpir la corriente en la bobina inductiva, se genera un pico de inducción recortado por el diodo Zener interno de la ECU.'),
            q('q-act-1-2', '¿Por qué la inyección directa GDI utiliza un perfil de corriente "Peak & Hold"?', ['Para abrir rápidamente la aguja contra la alta presión y mantenerla abierta con menor corriente para no quemar la bobina', 'Para gastar menos gasolina', 'Porque la batería es de 24V', 'Para limpiar la bujía'], 0, 'Se aplica un pico inicial de corriente alta (~10-12A) a 65V para vencimiento rápido y luego se sostiene con PWM de bajo amperaje.')
          ]
        }
      },
      {
        id: 'act-m2',
        title: 'Módulo 2: Sistemas de Encendido y Bobinas de Alta Tensión (COP / DIS)',
        description: 'Bobinas de 2, 3 y 4 pines, tiempo de dwell, voltaje de ruptura (KV), línea de quemado de chispa y tiempo de arco.',
        lessons: [
          { id: 'act-m2-l1', title: 'Lección 2.1: Principio de Inducción Mutua y Relación de Vueltas Primario/Secundario en Bobinas COP', duration: '25 min', type: 'video' },
          { id: 'act-m2-l2', title: 'Lección 2.2: Bobina de 2 Pines (Driver en ECU) vs Bobina de 3 y 4 Pines (Igniter Transistorizado Interno y Feedback IGT/IGF)', duration: '30 min', type: 'interactive' },
          { id: 'act-m2-l3', title: 'Lección 3.3: Análisis del Oscilograma Secundario: Voltaje de Ruptura (kV), Tiempo de Quemado (ms) y Oscilaciones Residuales', duration: '30 min', type: 'video' },
          { id: 'act-m2-l4', title: 'Lección 2.4: Práctica: Diagnóstico de Falta de Chispa mediante Pinza Atenuadora de Atenuación Primaria', duration: '35 min', type: 'interactive' }
        ],
        quiz: {
          id: 'q-act-m2',
          title: 'Quiz Módulo 2: Bobinas y Encendido',
          passingScore: 80,
          questions: [
            q('q-act-2-1', '¿Cuál es el tiempo de quemado de chispa (Spark Duration) normal y aceptable en una bujía con motor en ralenti?', ['0.1 ms', '1.2 ms a 2.0 ms', '10 ms', '50 ms'], 1, 'Un tiempo de arco saludable entre los electrodos de la bujía oscila típicamente entre 1.2ms y 2.0ms.'),
            q('q-act-2-2', 'Si una bobina COP no muestra oscilaciones residuales al final de la línea de quemado, ¿cuál es el diagnóstico?', ['Bujía en excelente estado', 'Espiras en cortocircuito interno en la bobina (bobina defectuosa con pérdida de energía)', 'Mezcla muy pobre', 'Falta de masa'], 1, 'Las oscilaciones al final representan la energía sobrante que se disipa; la ausencia indica cortocircuito magnético interno.')
          ]
        }
      },
      {
        id: 'act-m3',
        title: 'Módulo 3: Válvulas Reguladoras de Ancho de Pulso (PWM) y Frecuencia',
        description: 'Válvulas IAC de ralentí, purga de canister EVAP, EGR electrónica y reguladores de presión de aceite VVT.',
        lessons: [
          { id: 'act-m3-l1', title: 'Lección 3.1: Principio de Modulación por Ancho de Pulso (PWM) y Frecuencia de Trabajo', duration: '25 min', type: 'video' },
          { id: 'act-m3-l2', title: 'Lección 3.2: Solenoides de Traslape Valvular Variable (VVT / VANOS / VTEC)', duration: '25 min', type: 'interactive' },
          { id: 'act-m3-l3', title: 'Lección 3.3: Válvulas de Purga de Canister y Recirculación de Gases EGR', duration: '25 min', type: 'video' },
          { id: 'act-m3-l4', title: 'Lección 3.4: Práctica: Generación y Prueba Bidireccional de Señal PWM con Generador de Funciones', duration: '35 min', type: 'interactive' }
        ],
        quiz: {
          id: 'q-act-m3',
          title: 'Quiz Módulo 3: Actuadores PWM',
          passingScore: 80,
          questions: [
            q('q-act-3-1', '¿Qué representa un Duty Cycle (Ciclo de Trabajo) del 75% en un solenoide activado por pulso negativo?', ['Que la señal está en nivel alto el 75% del tiempo', 'Que el solenoide está conectado a masa el 75% del periodo total del ciclo', 'Que consume el 75% del combustible', 'Que funciona a 75 Hz'], 1, 'El duty cycle porcentaje expresa la fracción de tiempo dentro de un periodo que el actuador permanece energizado.'),
            q('q-sen-3-2b', 'Si un solenoide VVT se queda trabado mecánicamente en posición abierta por lodo de aceite, ¿qué fallo presenta el motor?', ['Sube la aceleración a 5000 RPM', 'Inestabilidad severa o apagado en ralenti debido a traslape valvular fuera de tiempo', 'Falta de carga del alternador', 'Fuga de refrigerante'], 1, 'Un avance de levas activado en ralenti provoca reingreso excesivo de gases de escape ahogando la combustión.')
          ]
        }
      },
      {
        id: 'act-m4',
        title: 'Módulo 4: Motores de Corriente Directa y Servotores (ETB, EPB, VGT)',
        description: 'Mariposas de aceleración motorizadas, actuadores turbo de geometría variable y frenos de estacionamiento electrónicos.',
        lessons: [
          { id: 'act-m4-l1', title: 'Lección 4.1: Puente H (H-Bridge) en la ECU para Control Bidireccional de Motores DC', duration: '25 min', type: 'video' },
          { id: 'act-m4-l2', title: 'Lección 4.2: Actuadores Electrónicos de Turbocompresor (VGT Actuator) con Feedback de Posición', duration: '30 min', type: 'interactive' },
          { id: 'act-m4-l3', title: 'Lección 4.3: Motores Paso a Paso (Stepper Motors) de 4 y 6 Hilos', duration: '25 min', type: 'video' },
          { id: 'act-m4-l4', title: 'Lección 4.4: Laboratorio: Re-aprendizaje y Calibración de Cuerpo de Aceleración con Escáner', duration: '35 min', type: 'interactive' }
        ],
        quiz: {
          id: 'q-act-m4',
          title: 'Quiz Módulo 4: Motores DC y Puente H',
          passingScore: 80,
          questions: [
            q('q-act-4-1', '¿Cómo invierte la ECU el sentido de giro del motor DC en un cuerpo de aceleración electrónico?', ['Cambiando la frecuencia', 'Invirtiendo la polaridad de las salidas mediante el circuito integrado Puente H (H-Bridge)', 'Aumentando el voltaje a 24V', 'No se puede invertir'], 1, 'El circuito Puente H conmuta cuatro MOSFETs internos para cambiar la dirección de flujo de corriente a través del motor DC.'),
            q('q-act-4-2', '¿Qué ocurre si se mueve manualmente con fuerza la mariposa de aceleración de un vehículo moderno con el contacto abierto?', ['Se limpia mejor', 'Se puede descalibrar el potenciómetro TPS interno o romper los piñones plásticos de reducción', 'Aumenta los caballos de fuerza', 'Se resetea la memoria de la ECU'], 1, 'El forzado manual de actuadores motorizados destruye la engrana interna de nylon o desajusta la posición cero.')
          ]
        }
      },
      {
        id: 'act-m5',
        title: 'Módulo 5: Diagnóstico Integrado de Actuadores en Inyección Diésel Common Rail',
        description: 'Electroválvulas reguladoras de presión de alta (DRV / SCV) e inyectores piezoeléctricos.',
        lessons: [
          { id: 'act-m5-l1', title: 'Lección 5.1: Válvula Reguladora de Presión de Rampa (DRV) y Regulador de Succión (SCV/VCV)', duration: '25 min', type: 'video' },
          { id: 'act-m5-l2', title: 'Lección 5.2: Inyectores Diésel Solenoide de Alta Presión (1800 - 2500 Bar)', duration: '30 min', type: 'interactive' },
          { id: 'act-m5-l3', title: 'Lección 5.3: Inyectores Diésel Piezoeléctricos con Múltiples Inyecciones (Piloto, Principal, Post-Inyección)', duration: '30 min', type: 'video' },
          { id: 'act-m5-l4', title: 'Lección 5.4: Evaluación Final de Laboratorio de Actuadores', duration: '40 min', type: 'interactive' }
        ],
        quiz: {
          id: 'q-act-m5',
          title: 'Quiz Módulo 5: Actuadores Diésel',
          passingScore: 80,
          questions: [
            q('q-act-5-1', '¿Por qué los inyectores piezoeléctricos diésel pueden realizar hasta 7 inyecciones por ciclo de combustión?', ['Porque la cristalina piezoeléctrica conmuta en microsegundos (10 veces más rápido que un solenoide)', 'Porque utilizan gasolina', 'Porque no requieren compresión', 'Porque operan a 12V'], 0, 'La expansión piezoeléctrica por carga eléctrica ocurre a velocidad ultra rápida permitiendo un control exacto del ruido y emisiones.'),
            q('q-act-5-2', '¿Qué precauciones extremas deben tomarse al manipular inyectores piezoeléctricos diésel encendidos?', ['Evitar la luz solar', 'Nunca desconectar el conector eléctrico con el motor funcionando (el cristal puede quedar cargado y el inyector abierto a máxima presión)', 'Usar guantes de lana', 'Medir solo resistencia'], 1, 'Si se corta la conexión con el piezo cargado, no hay descarga y el inyector queda inyectando a 2000 Bar destruyendo el pistón.')
          ]
        }
      }
    ],
    exam: {
      id: 'ex-act-final',
      title: 'Examen de Certificación: Actuadores Automotrices',
      description: 'Certificación teórica y práctica en análisis de patrones de actuadores.',
      timeLimitMinutes: 60,
      passingScore: 80,
      attemptsAllowed: 3,
      questions: [
        q('ex-act-q1', 'Al medir el patrón de corriente de un inyector PFI con la pinza amperimétrica, no se observa la pequeña muesca de apertura (Pintle Hump). ¿Qué significa?', ['Inyector en perfecto estado', 'La aguja interna del inyector está pegada/atascada mecánicamente por barniz o suciedad', 'Bomba de gasolina quemada', 'Filtro de aire sucio'], 1, 'El movimiento físico de la aguja metálica dentro del campo inductivo crea una contracorriente; si no se mueve, no hay muesca.'),
        q('ex-act-q2', 'Un vehículo presenta falla de cilindro intermitente (P0302). La bobina COP de 3 pines recibe alimentación de 12V, masa firme y pulso IGT de 5V desde la ECU, pero no genera chispa. ¿Cuál es el componente defectuoso?', ['La ECU', 'El transistor de potencia interno dentro de la bobina COP o su arrollamiento primario/secundario', 'El sensor de cigüeñal', 'El relé principal'], 1, 'Al confirmarse la presencia de las 3 señales requeridas (12V, masa e IGT de disparo), la bobina integrada es la causante.')
      ]
    }
  },

  // 5. Diagnóstico OBD-II
  {
    id: 'diagnostico-obd2-estandar',
    title: 'Diagnóstico Estándar OBD-II: Modos $01 al $0A y Monitores I/M',
    icon: '🚘',
    category: 'obd2',
    categoryLabel: 'OBD-II',
    description: 'Protocolos ISO 15765 CAN, SAE J1850, K-Line, Modos de diagnóstico OBD2 ($01-$0A), monitores continuos y no continuos.',
    longDescription: 'Aprende a extraer información de diagnóstico de nivel profesional utilizando el estándar internacional OBD-II / EOBD. Domina el análisis de Freeze Frame (Modo $02), lectura de códigos pendientes/permanentes (Modos $03, $07, $0A), verificación de monitores I/M y pruebas de componentes en Modo $06.',
    objectives: [
      'Entender la arquitectura física del conector DLC de 16 pines.',
      'Dominar los 10 Modos de servicio del escáner OBD-II ($01 al $0A).',
      'Analizar los datos de Modo $06 (Test Results for Specific Monitored Systems) para detectar misfires antes de que enciendan el Check Engine.'
    ],
    requirements: ['Conocimiento básico de motores e instrumentación'],
    learningOutcomes: ['Lectura metódica de monitores I/M para inspección vehicular', 'Aprovechamiento de Modo $06 para fallas difíciles'],
    price: 199,
    duration: '6 Semanas (50 hrs)',
    level: 'Inicial',
    status: 'PUBLISHED',
    systemId: 'diagnostico-obd2',
    relatedVehicle: 'Todos los vehículos OBD-II (1996+)',
    relatedCases: ['case-006-monitored-catalyst', 'case-011-p0420-eficiencia-catalizador'],
    relatedLabs: ['lab-obd2-scanner', 'lab-mode-06-analyzer'],
    recommendedAiMode: 'diagnostico',
    features: ['Interpretación de Freeze Frame Data', 'Análisis de Modo $06 con valores hexadecimales', 'Prácticas con escáner genérico y profesional'],
    instructor: 'Ing. Mateo Benítez',
    rating: 4.94,
    reviewsCount: 390,
    modules: [
      {
        id: 'obd-m1',
        title: 'Módulo 1: Historia, Normativa y Conector DLC de 16 Pines',
        description: 'Orígenes de OBD-I, CARB, EPA, EOBD y pinout estándar del conector de diagnóstico J1962.',
        lessons: [
          { id: 'obd-m1-l1', title: 'Lección 1.1: Regulaciones Ambientales y la Evolución a OBD-II / EOBD / JOBD', duration: '20 min', type: 'video' },
          { id: 'obd-m1-l2', title: 'Lección 1.2: Pinout Estándar del Conector DLC J1962: Masas, B+, CAN High/Low y K-Line', duration: '25 min', type: 'interactive' },
          { id: 'obd-m1-l3', title: 'Lección 1.3: Protocolos de Comunicación OBD-II: ISO 9141-2, KWP2000, VPW, PWM y CAN Bus (ISO 15765-4)', duration: '30 min', type: 'video' },
          { id: 'obd-m1-l4', title: 'Lección 1.4: Taller: Comprobación de Alimentación y tierras en el DLC con Multímetro', duration: '30 min', type: 'interactive' }
        ],
        quiz: {
          id: 'q-obd-m1',
          title: 'Quiz Módulo 1: Fundamentos OBD-II',
          passingScore: 80,
          questions: [
            q('q-obd-1-1', '¿Qué pines del conector DLC J1962 están asignados a la comunicación CAN Bus High y CAN Bus Low según la norma SAE?', ['Pines 4 y 5', 'Pines 6 y 14', 'Pines 2 y 10', 'Pines 7 y 15'], 1, 'El estándar SAE J1962 especifica el Pin 6 para CAN High y el Pin 14 para CAN Low.'),
            q('q-obd-1-2', '¿Qué pines corresponden a la masa de chasis y masa de señal respectivamente en el conector DLC?', ['Pines 1 y 2', 'Pin 4 (Masa Chasis) y Pin 5 (Masa Señal)', 'Pin 16', 'Pines 8 y 9'], 1, 'El Pin 4 conecta a la tierra de la carrocería/chasis y el Pin 5 es la tierra limpia de referencia de señal del módulo.')
          ]
        }
      },
      {
        id: 'obd-m2',
        title: 'Módulo 2: Modos de Diagnóstico $01, $02, $03 y $04',
        description: 'Línea de datos en vivo (Live Data), Cuadro Congelado (Freeze Frame), lectura y borrado de DTCs.',
        lessons: [
          { id: 'obd-m2-l1', title: 'Lección 2.1: Modo $01: PID en Tiempo Real y PID Calculados (RPM, STFT, LTFT, Temp, Load)', duration: '25 min', type: 'video' },
          { id: 'obd-m2-l2', title: 'Lección 2.2: Modo $02: Cuadro Congelado (Freeze Frame) - La Fotografía del Momento exacto de la Falla', duration: '30 min', type: 'interactive' },
          { id: 'obd-m2-l3', title: 'Lección 2.3: Modo $03 (DTC Confirmados) y Modo $04 (Clear DTC / Reset Readiness)', duration: '25 min', type: 'video' },
          { id: 'obd-m2-l4', title: 'Lección 2.4: Práctica: Análisis de Freeze Frame en Un Código P0171 (System Too Lean)', duration: '35 min', type: 'interactive' }
        ],
        quiz: {
          id: 'q-obd-m2',
          title: 'Quiz Módulo 2: Modos $01 al $04',
          passingScore: 80,
          questions: [
            q('q-obd-2-1', '¿Qué información crucial revela el Cuadro Congelado (Freeze Frame / Modo $02)?', ['Las RPM y estado del motor en el momento exacto en que se registró el código de falla y se encendió el Check Engine', 'El precio del repuesto', 'El dueño anterior', 'La presión de neumáticos'], 0, 'El Freeze Frame graba los parámetros operacionales claves (velocidad, temp, RPM, fuel trim) del instante del fallo.'),
            q('q-obd-2-2', '¿Qué efecto secundario tiene ejecutar el Modo $04 (Borrado de Códigos de Falla)?', ['Se apaga la radio', 'Se borran los códigos DTC y se reajustan todos los Monitores de Inspección (Readiness) a "No Listos"', 'Se borra la memoria transponder', 'Se desactiva la alarma'], 1, 'Al ejecutar el borrado de DTCs, la ECU reinicia los contadores de los monitores I/M a estado inconcluso.')
          ]
        }
      },
      {
        id: 'obd-m3',
        title: 'Módulo 3: Modos de Diagnóstico $05, $06, $07 y $08',
        description: 'Pruebas de sensores de O2, resultados de monitores no continuos (Mode $06) y control de actuadores.',
        lessons: [
          { id: 'obd-m3-l1', title: 'Lección 3.1: Modo $05: Pruebas del Monitor del Sensor de Oxígeno', duration: '25 min', type: 'video' },
          { id: 'obd-m3-l2', title: 'Lección 3.2: Modo $06: On-Board Monitoring Test Results para Componentes No Continuos', duration: '35 min', type: 'interactive' },
          { id: 'obd-m3-l3', title: 'Lección 3.3: Modo $07: Códigos de Falla Pendientes (Pending DTCs) durante el ciclo de manejo', duration: '20 min', type: 'video' },
          { id: 'obd-m3-l4', title: 'Lección 3.4: Práctica: Diagnóstico de Misfire Cilindro por Cilindro usando Modo $06 TID/CID', duration: '35 min', type: 'interactive' }
        ],
        quiz: {
          id: 'q-obd-m3',
          title: 'Quiz Módulo 3: Modo $06 y DTCs Pendientes',
          passingScore: 80,
          questions: [
            q('q-obd-3-1', '¿Por qué el Modo $06 es tan valioso para el técnico automotriz profesional?', ['Porque permite ver los límites mínimo/máximo y valor actual de pruebas internas antes de que se genere un código permanente', 'Porque cambia el idioma del escáner', 'Porque permite clonar llaves', 'Porque resetea el odómetro'], 0, 'El Modo $06 expone los datos numéricos de pruebas de la ECU (p.ej. conteo de misfires por cilindro), permitiendo prevención.'),
            q('q-obd-3-2', '¿Cuándo se convierte un código pendiente (Modo $07) en un código confirmado (Modo $03)?', ['Al apagar el motor', 'Cuando la falla se repite consecutivamente en un segundo ciclo de manejo con las mismas condiciones', 'A los 100 km', 'Nunca'], 1, 'La mayoría de algoritmos de la ECU exigen la confirmación de la falla en 2 viajes (Two-trip fault logic).')
          ]
        }
      },
      {
        id: 'obd-m4',
        title: 'Módulo 4: Modos $09 (Información del Vehículo) y $0A (Códigos Permanentes)',
        description: 'Número VIN, Calibration ID (CALID), CVN y DTCs permanentes no borrables por escáner.',
        lessons: [
          { id: 'obd-m4-l1', title: 'Lección 4.1: Modo $09: Lectura de VIN, CALID y Verification Numbers (CVN) contra Chiptuning', duration: '25 min', type: 'video' },
          { id: 'obd-m4-l2', title: 'Lección 4.2: Modo $0A: Permanent Diagnostic Trouble Codes (DTCs que persisten tras borrado)', duration: '25 min', type: 'interactive' },
          { id: 'obd-m4-l3', title: 'Lección 4.3: Inoperatividad y Modos de Emergencia (Limp-Home Mode) desencadenados por OBD-II', duration: '25 min', type: 'video' },
          { id: 'obd-m4-l4', title: 'Lección 4.4: Práctica: Verificación de Autenticidad de Software ECU mediante CVN', duration: '35 min', type: 'interactive' }
        ],
        quiz: {
          id: 'q-obd-m4',
          title: 'Quiz Módulo 4: Modo $09 y DTCs Permanentes',
          passingScore: 80,
          questions: [
            q('q-obd-4-1', '¿Cómo se borra un código permanente en Modo $0A?', ['Presionando Clear Codes en el escáner', 'Desconectando la batería durante toda la noche', 'Completando con éxito el ciclo de conducción donde la ECU verifica que la falla fue corregida', 'Cambiando el fusible de la ECU'], 2, 'Los códigos permanentes (Modo $0A) son inmunes al borrado por comandos o batería; solo la ECU los elimina tras verificar la reparación.'),
            q('q-obd-4-2', '¿Qué demuestra una discrepancia entre la suma de verificación CVN leída en Modo $09 y la calibración oficial del fabricante?', ['Batería baja', 'El software de la ECU ha sido modificado, reprogramado o chiptuneado', 'El motor está frío', 'Un fusible soplado'], 1, 'El CVN es una firma criptográfica; si el software es alterado, el hash CVN cambia inmediatamente.')
          ]
        }
      },
      {
        id: 'obd-m5',
        title: 'Módulo 5: Monitores I/M de Inspección y Ciclos de Conducción OEM',
        description: 'Monitores continuos (Misfire, Fuel System, CCM) y no continuos (Catalyst, EVAP, O2, EGR, Secondary Air).',
        lessons: [
          { id: 'obd-m5-l1', title: 'Lección 5.1: Monitores Continuos vs Monitores No Continuos', duration: '25 min', type: 'video' },
          { id: 'obd-m5-l2', title: 'Lección 5.2: Estrategia del Monitor EVAP de Purga y Fuga Fina (0.020" y 0.040")', duration: '30 min', type: 'interactive' },
          { id: 'obd-m5-l3', title: 'Lección 5.3: Ejecución de un Ciclo de Conducción Universal (Universal Drive Cycle) en Pista de Pruebas', duration: '30 min', type: 'video' },
          { id: 'obd-m5-l4', title: 'Lección 5.4: Evaluación de Certificación de Inspección Ambiental OBD-II', duration: '40 min', type: 'interactive' }
        ],
        quiz: {
          id: 'q-obd-m5',
          title: 'Quiz Módulo 5: Monitores e Inspección',
          passingScore: 80,
          questions: [
            q('q-obd-5-1', '¿Cuáles son los 3 monitores que corren de manera CONTINUA siempre que el motor esté funcionando?', ['Catalizador, EVAP y EGR', 'Misfire (Encendido), Fuel System (Combustible) y Comprehensive Components (CCM)', 'Frenos, Airbag y Clima', 'Batería, Alternador y Luces'], 1, 'Los monitores de Misfire, Fuel System y Componentes Integrales están activos todo el tiempo.'),
            q('q-obd-5-2', '¿Qué condición de temperatura y nivel de tanque se requiere para que corra el monitor de fugas del sistema EVAP?', ['Motor caliente a 100°C y tanque lleno al 100%', 'Arranque en frío (temperatura ambiente igual a la del refrigerante) y nivel de combustible entre 1/4 y 3/4', 'Motor en máxima velocidad', 'Tanque vacío'], 1, 'El monitor EVAP exige arranque frío con diferencia menor a 8°C entre IAT y ECT, y nivel de combustible entre 15% y 85%.')
          ]
        }
      }
    ],
    exam: {
      id: 'ex-obd-final',
      title: 'Examen de Certificación: Diagnóstico OBD-II Estándar',
      description: 'Certificación internacional en modos de escáner y pruebas de emisión.',
      timeLimitMinutes: 60,
      passingScore: 80,
      attemptsAllowed: 3,
      questions: [
        q('ex-obd-q1', 'Un vehículo llega a revisión ambiental. No tiene Check Engine encendido, pero 3 monitores están en estado "Not Ready". ¿Qué ocurrirá en la inspección?', ['Aprobará sin problemas', 'Será rechazado por monitores incompletos debido a un borrado reciente de códigos o batería desconectada', 'Le darán una multa inmediata', 'Le cambiarán la ECU'], 1, 'Las estaciones de inspección rechazan vehículos con monitores incompletos para evitar el engaño por borrado rápido de fallas.'),
        q('ex-obd-q2', 'En Modo $06, el valor actual de prueba del monitor de misfire en cilindro 3 marca 42 conteos, con un límite máximo permitido de 50. El Check Engine aún no ha encendido. ¿Qué concluye el técnico?', ['Todo está perfecto', 'Existe una falla incipiente de encendido en el cilindro 3 cercana al umbral de encendido del MIL', 'La bujía 3 está rota', 'Se debe reemplazar el catalizador'], 1, 'El Modo $06 revela que el cilindro 3 está acumulando misfires cerca del límite para encender la luz de falla.')
      ]
    }
  },

  // 6. Uso del Multímetro
  {
    id: 'uso-del-multimetro-automotriz',
    title: 'Dominio del Multímetro Automotriz True-RMS y Diagnósticos Electrónicos',
    icon: '⏱️',
    category: 'multimeter',
    categoryLabel: 'Uso del Multímetro',
    description: 'Medición avanzada de voltaje True-RMS, corriente con pinza, frecuencia, ciclo de trabajo (Duty Cycle), diodos y capacitancia.',
    longDescription: 'Aprende el manejo experto de multímetros automotrices de alta resolución (Fluke 88V, Power Probe, etc.). Aplica técnicas avanzadas de diagnóstico de señales pulsantes, ancho de pulso en milisegundos, pruebas de diodos en alternadores y medición de continuidad sin dañarse.',
    objectives: [
      'Dominar la diferencia entre mediciones promedio (Average) y True-RMS en señales no senoidales.',
      'Utilizar las funciones MIN/MAX/AVG para capturar picos de caída de voltaje en milisegundos durante el arranque.',
      'Medir Frecuencia (Hz) y Ciclo de Trabajo (Duty Cycle %) en sensores y actuadores PWM.'
    ],
    requirements: ['Ninguno (Nivel Aprendiz/Básico)'],
    learningOutcomes: ['Aprovechamiento al 100% de las funciones avanzadas del multímetro automotriz'],
    price: 149,
    duration: '4 Semanas (40 hrs)',
    level: 'Inicial',
    status: 'PUBLISHED',
    systemId: 'sistemas-electricos',
    relatedVehicle: 'Universal',
    relatedCases: ['case-001-falla-carga'],
    relatedLabs: ['lab-circuito-12v'],
    recommendedAiMode: 'aprender',
    features: ['Captura de picos MIN/MAX a 1ms', 'Uso de sondas perforadoras de aislamiento', 'Seguridad CAT III 1000V'],
    instructor: 'Ing. Carlos Mendoza',
    rating: 4.97,
    reviewsCount: 420,
    modules: [
      {
        id: 'mul-m1',
        title: 'Módulo 1: Arquitectura, Categorías de Seguridad (CAT II/III/IV) e Impedancia',
        description: 'Impedancia interna de 10 MΩ para protección de ECUs y selección de rangos de voltaje.',
        lessons: [
          { id: 'mul-m1-l1', title: 'Lección 1.1: ¿Por qué usar un Multímetro de 10 Megaohmios de Impedancia en Automoción?', duration: '20 min', type: 'video' },
          { id: 'mul-m1-l2', title: 'Lección 1.2: Categorías de Seguridad CAT II, CAT III y CAT IV (Especial para Vehículos Híbridos y EV)', duration: '20 min', type: 'interactive' },
          { id: 'mul-m1-l3', title: 'Lección 1.3: Selección de Escalas Automáticas (Auto-Ranging) vs Rango Manual', duration: '20 min', type: 'video' },
          { id: 'mul-m1-l4', title: 'Lección 1.4: Taller: Verificación de Fusibles Internos de Corriente en el Multímetro', duration: '25 min', type: 'interactive' }
        ],
        quiz: {
          id: 'q-mul-m1',
          title: 'Quiz Módulo 1: Seguridad e Impedancia',
          passingScore: 80,
          questions: [
            q('q-mul-1-1', '¿Qué ocurre si se utiliza un multímetro antiguo con baja impedancia (p.ej. 20 kΩ/V) para medir la señal de un sensor de la ECU?', ['La lectura es más exacta', 'El multímetro drena corriente del circuito sobrecargando y pudiendo dañar el microprocesador de la ECU', 'Se quema el fusible de la batería', 'Aumenta el voltaje del sensor'], 1, 'Los multímetros de baja impedancia cargan el circuito alterando el voltaje y pudiendo quemar salidas de la ECU.'),
            q('q-mul-1-2', '¿Qué categoría de seguridad MÍNIMA debe poseer un multímetro para realizar mediciones en sistemas de Alto Voltaje de vehículos híbridos o eléctricos (HV 400V/800V)?', ['CAT I 30V', 'CAT II 250V', 'CAT III 1000V / CAT IV 600V con puntas aisladas certificadas', 'Cualquier multímetro económico'], 2, 'Trabajar en alto voltaje EV exige herramientas certificadas CAT III 1000V / CAT IV 600V para prevenir arcos eléctricos mortales.')
          ]
        }
      },
      {
        id: 'mul-m2',
        title: 'Módulo 2: Mediciones de Voltaje DC/AC y Función MIN / MAX / Peak-1ms',
        description: 'Captura de caídas de tensión instantáneas y rizado de corriente alterna de diodos de alternador.',
        lessons: [
          { id: 'mul-m2-l1', title: 'Lección 2.1: Medición de Voltaje Continuo (DC): Detección de Ruido y Caídas de Masa', duration: '20 min', type: 'video' },
          { id: 'mul-m2-l2', title: 'Lección 2.2: Medición de Rizado Alterno (AC Ripple) para Diagnosticar Diodos Quemados en el Alternador', duration: '25 min', type: 'interactive' },
          { id: 'mul-m2-l3', title: 'Lección 2.3: Función MIN/MAX y Peak 1ms: Medición de la Caída Mínima de Batería durante el Arranque', duration: '25 min', type: 'video' },
          { id: 'mul-m2-l4', title: 'Lección 2.4: Práctica: Diagnóstico de Estado de Batería con la Función MIN MAX durante Cranking', duration: '30 min', type: 'interactive' }
        ],
        quiz: {
          id: 'q-mul-m2',
          title: 'Quiz Módulo 2: Voltaje y Picos Mínimos/Máximos',
          passingScore: 80,
          questions: [
            q('q-mul-2-1', 'Si al medir la salida del alternador en escala AC (Voltaje Alterno) se obtiene una lectura superior a 0.5V AC (500mV AC), ¿qué falla existe?', ['El alternador está perfecto', 'Uno o más diodos del puente rectificador del alternador están en cortocircuito/dañados dejando pasar rizado AC', 'La batería está cargada al 100%', 'Falta aceite de motor'], 1, 'Un puente rectificador defectuoso fuga voltaje alterno a la red eléctrica causando interferencia en módulos y descarga de batería.'),
            q('q-mul-2-2', 'Al presionar el botón de arranque con la función MIN activa, el multímetro registra un voltaje mínimo de 7.8V en la batería. ¿Cuál es la interpretación?', ['Batería en excelente estado', 'Batería sulfatada/agotada que no sostiene el voltaje de cranking (mínimo deseable > 9.6V a 21°C)', 'El motor de arranque está nuevo', 'Falta fusible'], 1, 'Si el voltaje cae por debajo de 9.6V durante el arranque, la batería ha perdido capacidad CCA o hay exceso de arrastre.')
          ]
        }
      },
      {
        id: 'mul-m3',
        title: 'Módulo 3: Medición de Frecuencia (Hz) y Ciclo de Trabajo (% Duty Cycle)',
        description: 'Diagnóstico de sensores de velocidad de frecuencia y actuadores controlados por pulsos PWM.',
        lessons: [
          { id: 'mul-m3-l1', title: 'Lección 3.1: Medición de Frecuencia en Hertz (Hz): Sensores MAF digital, ABS y Velocidad de Rueda', duration: '25 min', type: 'video' },
          { id: 'mul-m3-l2', title: 'Lección 3.2: Ciclo de Trabajo Positivo (+ Duty) y Negativo (- Duty) en Válvula IAC y Solenoides Cánister', duration: '25 min', type: 'interactive' },
          { id: 'mul-m3-l3', title: 'Lección 3.3: Medición de Ancho de Pulso en Milisegundos (ms Pulse Width) de Inyectores PFI', duration: '25 min', type: 'video' },
          { id: 'mul-m3-l4', title: 'Lección 3.4: Práctica: Mapeo de Frecuencia del MAF de Frecuencia (1kHz a 10kHz)', duration: '30 min', type: 'interactive' }
        ],
        quiz: {
          id: 'q-mul-m3',
          title: 'Quiz Módulo 3: Frecuencia y Duty Cycle',
          passingScore: 80,
          questions: [
            q('q-mul-3-1', '¿En qué unidad se expresa el Ciclo de Trabajo (Duty Cycle) de una señal PWM?', ['Hertz (Hz)', 'Porcentaje (%)', 'Miliamperios (mA)', 'Volts (V)'], 1, 'El ciclo de trabajo se mide en Porcentaje (0% a 100%) indicando la proporción del periodo en estado activo.'),
            q('q-mul-3-2', 'Si un sensor MAF digital de frecuencia entrega 2.2 kHz en ralentí y sube suavemente a 7.5 kHz al acelerar, ¿cuál es el estado de la señal?', ['Señal correcta y funcional', 'Sensor dañado', 'Falta de masa', 'Cortocircuito a 12V'], 0, 'Los sensores MAF de frecuencia responden variando su frecuencia en Hertz proporcionalmente al caudal de aire ingresado.')
          ]
        }
      },
      {
        id: 'mul-m4',
        title: 'Módulo 4: Medición de Resistencia, Continualidad, Diodos y Capacitancia',
        description: 'Prueba de relés, potenciómetros, bobinas, diodos de alternador y capacitores de filtrado.',
        lessons: [
          { id: 'mul-m4-l1', title: 'Lección 4.1: Prueba de Resistencia (Ω): Tolerancias en Inyectores, Bobinas y Sensores de Temp', duration: '25 min', type: 'video' },
          { id: 'mul-m4-l2', title: 'Lección 4.2: Prueba de Continuidad Beeper: Rastreo de Líneas en Arneses Eléctricos', duration: '20 min', type: 'interactive' },
          { id: 'mul-m4-l3', title: 'Lección 4.3: Prueba de Diodos: Medición de Caída de Voltaje Directa en Semiconductores', duration: '25 min', type: 'video' },
          { id: 'mul-m4-l4', title: 'Lección 4.4: Práctica: Medición de Resistencia de Terminación CAN Bus (60 Ω en paralelo)', duration: '30 min', type: 'interactive' }
        ],
        quiz: {
          id: 'q-mul-m4',
          title: 'Quiz Módulo 4: Resistencia y Diodos',
          passingScore: 80,
          questions: [
            q('q-mul-4-1', 'Al medir resistencia en las líneas de comunicación CAN High y CAN Low en la toma OBD2 con la batería desconectada, ¿qué valor debe obtenerse si la red está sana?', ['0 Ohmios', '120 Ohmios', '60 Ohmios (dos resistencias de 120 Ω en paralelo)', '10,000 Ohmios'], 2, 'El Bus CAN utiliza dos resistencias de terminación de 120 Ω en cada extremo del bus, dando un equivalente en paralelo de 60 Ω.'),
            q('q-mul-4-2', 'Si se mide continuidad en un cable de arnés de 3 metros y el multímetro marca 15 Ohmios de resistencia, ¿qué indica?', ['Cable perfecto', 'El cable presenta corrosión interna o hilos de cobre rotos (alta resistencia en el conductor)', 'Está en corto a tierra', 'Está desconectado'], 1, 'Un cable de cobre de 3 metros de longitud debe presentar una resistencia casi nula (< 0.2 Ω). 15 Ω es anormalmente alto.')
          ]
        }
      },
      {
        id: 'mul-m5',
        title: 'Módulo 5: Pinzas Amperimétricas y Accesorios de Diagnóstico',
        description: 'Pinza amperimétrica de baja corriente (0-60A DC) para inyectores y bombas de combustible, y sondas perforadoras.',
        lessons: [
          { id: 'mul-m5-l1', title: 'Lección 5.1: Calibración a Cero (Zero Adjustment) en Pinzas Amperimétricas de Efecto Hall DC', duration: '20 min', type: 'video' },
          { id: 'mul-m5-l2', title: 'Lección 5.2: Medición del Consumo de Corriente de la Bomba de Gasolina (4A a 7A) y Ondulaciones del Conmutador', duration: '25 min', type: 'interactive' },
          { id: 'mul-m5-l3', title: 'Lección 5.3: Uso Responsable de Sondas Perforadoras de Cable (Back-Probing) sin Destruir el Sello Impermeable', duration: '20 min', type: 'video' },
          { id: 'mul-m5-l4', title: 'Lección 5.4: Evaluación Final Práctica con Multímetro Automotriz', duration: '35 min', type: 'interactive' }
        ],
        quiz: {
          id: 'q-mul-m5',
          title: 'Quiz Módulo 5: Pinzas Amperimétricas',
          passingScore: 80,
          questions: [
            q('q-mul-5-1', '¿Por qué es indispensable ajustar a CERO (ZERO) la pinza amperimétrica DC antes de realizar cualquier medición?', ['Para encender el LED', 'Para cancelar el campo magnético terrestre y la remanencia magnética de la mordaza asegurando precisión', 'Para subir la batería', 'Para cambiar de Amperios a Volts'], 1, 'Los sensores Hall de las pinzas DC detectan campos magnéticos ambientales; la puesta a cero elimina los desvíos offset.'),
            q('q-mul-5-2', 'Al medir el consumo de corriente de una bomba de combustible eléctrica en un motor de 4 cilindros se registra un consumo de 12.5 Amperios. ¿Cuál es el diagnóstico?', ['Consumo normal', 'Bomba trabada, filtro obstruido o motor eléctrico con fricción excesiva consumiendo el doble de lo normal (riesgo de quemar relé/ECU)', 'Batería agotada', 'Inyector goteando'], 1, 'Una bomba de gasolina de automóvil consume normalmente entre 4A y 7A. 12.5A indica sobrecarga severa.')
          ]
        }
      }
    ],
    exam: {
      id: 'ex-mul-final',
      title: 'Examen de Certificación: Dominio del Multímetro Automotriz',
      description: 'Certificación oficial de habilidades de medición y diagnóstico con multímetro.',
      timeLimitMinutes: 45,
      passingScore: 80,
      attemptsAllowed: 3,
      questions: [
        q('ex-mul-q1', 'Un técnico intenta medir la corriente del foco principal conectando las puntas del multímetro en PARALELO con los terminales del foco en escala de Amperios. ¿Qué ocurrirá?', ['El foco brillará más', 'Se generará un cortocircuito directo a través del multímetro quemando el fusible interno de 10A del instrumento', 'Se apagará el alternador', 'Medirá el voltaje correctamente'], 1, 'El amperímetro tiene resistencia interna casi nula; conectar en paralelo crea un corto directo al suministro de energía.'),
        q('ex-mul-q2', 'Para medir el ciclo de trabajo PWM con un multímetro que no posee la tecla Hz/Duty, ¿qué escala y conversión se puede utilizar como aproximación en señales de frecuencia fija?', ['Escala de Resistencia', 'Escala de Voltaje DC (el voltaje leído dividido entre el voltaje máximo de la señal da el % de duty aproximado)', 'Escala AC', 'Escala de Diodos'], 1, 'El valor promedio de DC leído por un voltímetro en una señal PWM es proporcional al Duty Cycle multiplicado por la amplitud.')
      ]
    }
  },

  // 7. Uso del Osciloscopio
  {
    id: 'uso-del-osciloscopio-automotriz',
    title: 'Dominio del Osciloscopio Automotriz de 2 y 4 Canales',
    icon: '📈',
    category: 'oscilloscope',
    categoryLabel: 'Osciloscopio Automotriz',
    description: 'Ajuste de acoplamiento AC/DC, disparo (Trigger), tiempo por división, atenuadores 10:1/20:1 y transductores de presión.',
    longDescription: 'El osciloscopio es los ojos del técnico moderno. Aprende a dominar el ajuste de base de tiempo, escalas de voltaje por división, modos de acoplamiento AC/DC, configuración de disparador (Trigger de flanco ascendente/descendente) y decodificación de tramas de datos digitales.',
    objectives: [
      'Configurar rápidamente escala de voltaje, tiempo por división y disparador en cualquier osciloscopio.',
      'Analizar señales de sensores y actuadores simultáneamente en 2, 3 y 4 canales.',
      'Utilizar atenuadores 20:1 / 100:1 para proteger las entradas del equipo contra picos inductivos de hasta 500V.'
    ],
    requirements: ['Electricidad y Electrónica Básica'],
    learningOutcomes: ['Captura limpia de señales sin aliasing ni ruido eléctrico', 'Diagnóstico rápido de fallas de sincronismo de motor'],
    price: 279,
    duration: '8 Semanas (60 hrs)',
    level: 'Intermedio',
    status: 'PUBLISHED',
    systemId: 'diagnostico-osciloscopio',
    relatedVehicle: 'Universal',
    relatedCases: ['case-003-ckp-intermitente', 'case-004-misfire-cilindro-2'],
    relatedLabs: ['lab-oscilloscope-signals'],
    recommendedAiMode: 'diagnostico',
    features: ['Uso de atenuadores de protección', 'Librería de señales de referencia OEM', 'Uso de reglas de grados de cigüeñal (0°-720°)'],
    instructor: 'Ing. Alejandro Silva',
    rating: 4.98,
    reviewsCount: 450,
    modules: [
      {
        id: 'osc-m1',
        title: 'Módulo 1: Fundamentos de Osciloscoía y Controles Principales',
        description: 'Eje X (Tiempo), Eje Y (Voltaje), tasa de muestreo (MSa/s) y resolución de bits.',
        lessons: [
          { id: 'osc-m1-l1', title: 'Lección 1.1: El Osciloscopio vs El Multímetro: Mapeo Gráfico de Voltaje en Función del Tiempo', duration: '20 min', type: 'video' },
          { id: 'osc-m1-l2', title: 'Lección 1.2: Configuración del Eje Y (Voltios/División) y Offset Vertical de Traza', duration: '25 min', type: 'interactive' },
          { id: 'osc-m1-l3', title: 'Lección 1.3: Configuración del Eje X (Tiempo/División) para Capturas Rápidas (us) y Lentas (ms/s)', duration: '25 min', type: 'video' },
          { id: 'osc-m1-l4', title: 'Lección 1.4: Taller: Captura de la Señal de un Sensor Hall de Distribución', duration: '35 min', type: 'interactive' }
        ],
        quiz: {
          id: 'q-osc-m1',
          title: 'Quiz Módulo 1: Controles del Osciloscopio',
          passingScore: 80,
          questions: [
            q('q-osc-1-1', 'Si se desea visualizar 2 vueltas completas de cigüeñal (720°) en un motor a 1000 RPM (60 ms por ciclo completo), ¿cuál es la base de tiempo (Time/Div) adecuada en una pantalla de 10 divisiones?', ['1 microsegundo/div', '10 milisegundos/división (Total 100 ms en pantalla)', '5 segundos/div', '100 microsegundos/div'], 1, '10 ms/div x 10 divisiones = 100 ms totales en pantalla, lo que permite observar holgadamente el ciclo de 60 ms.'),
            q('q-osc-1-2', '¿Qué sucede si se selecciona una escala de 1 Volt/div para medir una señal de inyector que alcanza un pico de 60 Volts?', ['Se congela el osciloscopio', 'La traza se sale por completo de la pantalla por la parte superior recortando la onda', 'Se borra la señal', 'Baja la corriente'], 1, 'Con 1V/div y 8-10 divisiones en pantalla, el límite visible es 8V-10V; una señal de 60V supera la altura de pantalla.')
          ]
        }
      },
      {
        id: 'osc-m2',
        title: 'Módulo 2: Acoplamiento de Entrada (AC / DC / GND) y Atenuadores 20:1',
        description: 'Bloqueo de componente continua para ver ruido alterno y protección de canales contra picos inductivos.',
        lessons: [
          { id: 'osc-m2-l1', title: 'Lección 2.1: Acoplamiento DC (Direct Current): Medición Absoluta de Voltaje con Respecto a Masa', duration: '25 min', type: 'video' },
          { id: 'osc-m2-l2', title: 'Lección 2.2: Acoplamiento AC (Alternating Current): Eliminación del Voltaje de Offset DC para Ver Micro-Ruidos', duration: '25 min', type: 'interactive' },
          { id: 'osc-m2-l3', title: 'Lección 2.3: Atenuadores 20:1 y 100:1: Protección contra Picos Inductivos de Bobinas e Inyectores', duration: '25 min', type: 'video' },
          { id: 'osc-m2-l4', title: 'Lección 2.4: Práctica: Visualización del Rizado de Alternador mediante Acoplamiento AC', duration: '30 min', type: 'interactive' }
        ],
        quiz: {
          id: 'q-osc-m2',
          title: 'Quiz Módulo 2: Acoplamiento y Atenuadores',
          passingScore: 80,
          questions: [
            q('q-osc-2-1', '¿Por qué NUNCA se debe conectar un canal de osciloscopio directo (sin atenuador 20:1) al primario de una bobina de encendido convencional?', ['Porque la señal es muy lenta', 'Porque el pico inductivo de colapso (~300V-400V) superará el límite máximo de entrada del equipo (típicamente 50V) destruyendo el canal', 'Porque se apaga el motor', 'Porque cambia la frecuencia'], 1, 'Los canales directos soportan voltaje bajo (20V-50V max); picos de primario de bobina requieren atenuador 20:1.'),
            q('q-osc-2-2', '¿En qué modo de acoplamiento se debe ajustar el osciloscopio para analizar el rizado eléctrico (ripple) de la batería en la línea de 12V?', ['Acoplamiento DC', 'Acoplamiento AC (elimina los 12V DC y amplifica las pequeñas variaciones mVolts AC de ruido)', 'GND', 'Trifásico'], 1, 'El acoplamiento AC elimina la componente continua de 12V permitiendo usar escalas sensibles de 50mV/div para ver el ruido.')
          ]
        }
      },
      {
        id: 'osc-m3',
        title: 'Módulo 3: Modos de Disparo (Trigger): Auto, Normal, Single y Umbral de Voltaje',
        description: 'Estabilización de señales repetitivas y captura de eventos transitorios únicos.',
        lessons: [
          { id: 'osc-m3-l1', title: 'Lección 3.1: ¿Qué es el Trigger y por qué las Señales sin Disparo "Caminan" en Pantalla?', duration: '25 min', type: 'video' },
          { id: 'osc-m3-l2', title: 'Lección 3.2: Flanco Ascendente (Rising Edge) vs Flanco Descendente (Falling Edge)', duration: '25 min', type: 'interactive' },
          { id: 'osc-m3-l3', title: 'Lección 3.3: Modo SINGLE (Disparo Único): Captura de Eventos Transitorios como la Caída de Arranque o Falla Intermitente', duration: '25 min', type: 'video' },
          { id: 'osc-m3-l4', title: 'Lección 3.4: Práctica: Estabilización de la Señal de un Sensor MAF de Frecuencia', duration: '30 min', type: 'interactive' }
        ],
        quiz: {
          id: 'q-osc-m3',
          title: 'Quiz Módulo 3: Sincronización y Trigger',
          passingScore: 80,
          questions: [
            q('q-osc-3-1', '¿Qué modo de Trigger se debe seleccionar para congelar en pantalla un único pulso de encendido intermitente que ocurre esporádicamente?', ['Modo AUTO', 'Modo SINGLE (Un disparo y congela la pantalla al detectar la primera transición que cruza el umbral)', 'Modo OFF', 'Modo Scan'], 1, 'El modo SINGLE espera hasta que la señal cruce el umbral de voltaje fijado, guarda la captura en memoria y detiene el barrido.'),
            q('q-osc-3-2', 'Si el nivel de voltaje de Trigger se coloca a 8.0 Volts en una señal de sensor Hall que oscila de 0V a 5V, ¿qué ocurrirá en modo NORMAL?', ['La señal se ve perfectamente', 'El osciloscopio no disparará y la pantalla quedará en blanco o congelada', 'Se quema el sensor', 'Baja la frecuencia'], 1, 'En modo NORMAL, el osciloscopio solo refresca pantalla cuando la señal cruza el umbral; si es mayor que la onda, no dispara.')
          ]
        }
      },
      {
        id: 'osc-m4',
        title: 'Módulo 4: Diagnóstico Multicanal y Sincronismo CKP / CMP de Motor',
        description: 'Comparación simultánea de sensores de cigüeñal y árbol de levas para detectar saltos de cadena/correa de distribución.',
        lessons: [
          { id: 'osc-m4-l1', title: 'Lección 4.1: Configuración de Osciloscopio de 2 y 4 Canales con Masas Comunes', duration: '25 min', type: 'video' },
          { id: 'osc-m4-l2', title: 'Lección 4.2: Análisis de Sincronismo Físico vs Sincronismo Electrónico entre CKP y CMP', duration: '30 min', type: 'interactive' },
          { id: 'osc-m4-l3', title: 'Lección 4.3: Uso de Superposición de Curvas de Referencia OEM para Detección de Desfasamiento por VVT', duration: '30 min', type: 'video' },
          { id: 'osc-m4-l4', title: 'Lección 4.4: Práctica: Verificación de Distribución en Motor de 4 Cilindros con 2 Canales', duration: '35 min', type: 'interactive' }
        ],
        quiz: {
          id: 'q-osc-m4',
          title: 'Quiz Módulo 4: Sincronismo CKP / CMP',
          passingScore: 80,
          questions: [
            q('q-osc-4-1', '¿Cómo se comprueba si una cadena de distribución se ha estirado o saltado un diente sin desarmar el motor?', ['Midiendo compresión con manómetro', 'Conectando el Canal A al CKP y el Canal B al CMP, comparando la posición de los pulsos contra la gráfica de sincronismo OEM', 'Borrando los códigos con escáner', 'Cambiando el aceite'], 1, 'La relación temporal precisa entre los dientes del CKP y CMP capturada en 2 canales revela desfasamientos mecánicos mínimos.'),
            q('q-osc-4-2', '¿Qué ocurre con la señal de sincronismo si la rueda fónica del cigüeñal presenta un diente doblado o roto?', ['La señal desaparece por completo', 'Se observa un pulso distorsionado o ausente en cada vuelta, provocando código de falla de sincronismo o misfires', 'Aumenta el voltaje de la batería', 'Se apaga el escáner'], 1, 'Un diente deformado altera el campo magnético produciendo una irregularidad local en la onda identificable en el osciloscopio.')
          ]
        }
      },
      {
        id: 'osc-m5',
        title: 'Módulo 5: Diagnóstico con Transductores de Presión (WPS / FirstLook / Transductor de Escape)',
        description: 'Medición de presión en cilindro (In-Cylinder Pressure), pulso de escape y vacío en múltiple.',
        lessons: [
          { id: 'osc-m5-l1', title: 'Lección 5.1: Transductores Piezoeléctricos y Piezorresistivos de Presión (de -15 PSI a 500 PSI)', duration: '25 min', type: 'video' },
          { id: 'osc-m5-l2', title: 'Lección 5.2: Análisis de la Torre de Compresión In-Cylinder: Puntos de Apertura/Cierre de Válvulas y Regla de 720°', duration: '35 min', type: 'interactive' },
          { id: 'osc-m5-l3', title: 'Lección 5.3: Transductor de Pulso de Escape (FirstLook): Detección de Válvulas Mallas o Asientos Quemados', duration: '30 min', type: 'video' },
          { id: 'osc-m5-l4', title: 'Lección 5.4: Evaluación Final Práctica de Osciloscoía Automotriz', duration: '40 min', type: 'interactive' }
        ],
        quiz: {
          id: 'q-osc-m5',
          title: 'Quiz Módulo 5: Transductores de Presión',
          passingScore: 80,
          questions: [
            q('q-osc-5-1', '¿Qué información técnica entrega la prueba In-Cylinder con transductor de presión en la cavidad de la bujía mientras el motor gira?', ['Solo la presión de aceite', 'La compresión dinámica real, la contrapresión del catalizador obstruido y los puntos exactos de apertura de válvulas de escape e admisión', 'El nivel de refrigerante', 'La velocidad del alternador'], 1, 'El transductor en cilindro dibuja la curva de presión dinámica revelando problemas de tiempo de levas, resorte roto o catalizador tapado.'),
            q('q-osc-5-2', 'En la torre de compresión de un motor en marcha, ¿qué indica si el pico de presión de escape supera los 3 a 5 PSI antes de la admisión?', ['Pistón nuevo', 'Restricción o taponamiento severo en la tubería de escape o catalizador colapsado', 'Filtro de aire sucio', 'Mezcla rica'], 1, 'Al abrir la válvula de escape, el pistón empuja los gases; si el escape está tapado, se acumula contrapresión positiva alta.')
          ]
        }
      }
    ],
    exam: {
      id: 'ex-osc-final',
      title: 'Examen de Certificación: Osciloscopio Automotriz',
      description: 'Certificación profesional en diagnóstico avanzado de ondas y patrones de falla.',
      timeLimitMinutes: 60,
      passingScore: 80,
      attemptsAllowed: 3,
      questions: [
        q('ex-osc-q1', 'Al medir la señal de un sensor inductivo VR de 2 pines en la marcha, la amplitud es de solo 0.8 Vpp y presenta ruido severo. Al acercar la sonda de masa al sensor, la onda se aplana. ¿Cuál es el diagnóstico?', ['Línea de masa del osciloscopio en mal estado o interferencia electromagnética por cable de alta tensión de bujía cercano', 'Batería destruida', 'Inyector quemado', 'Filtro de aceite tapado'], 0, 'La masa del osciloscopio es crítica para evitar bucles de tierra o captación de radiación de encendido secundario.'),
        q('ex-osc-q2', 'Un vehículo presenta pérdida de potencia. La prueba In-Cylinder muestra una contrapresión de escape de 12 PSI a 2500 RPM. ¿Cuál es la acción correctiva?', ['Cambiar bujías', 'Desmontar e inspeccionar el catalizador/silenciador por obstrucción física interna', 'Ajustar las punterías', 'Cambiar sensor MAP'], 1, 'Una contrapresión superior a 2 PSI a 2500 RPM confirma un bloqueo físico en el sistema de escape que ahoga el motor.')
      ]
    }
  }
];
