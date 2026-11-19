import { Quiz, Exam, LeaderboardEntry, Mission, Badge } from '../types';

export const EVALUATION_QUIZZES: Quiz[] = [
  {
    id: 'quiz-oscilloscope-101',
    title: 'Quiz de Osciloscopio: Análisis de Ondas Inductivas y Hall',
    category: 'Diagnóstico con Osciloscopio',
    description: 'Pone a prueba tu capacidad de interpretación de seńales CKP/CMP, amplitud de voltaje y frecuencia.',
    passingScore: 80,
    xpReward: 150,
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: '¿Cuál es la característica principal que diferencia una señal de sensor Hall de una inductiva en el osciloscopio?',
        options: [
          'La señal Hall genera corriente alterna sinusoidal variable en frecuencia y voltaje.',
          'La señal Hall es digital de onda cuadrada con amplitud fija de 0-5V o 0-12V, independiente de las RPM.',
          'La señal inductiva requiere alimentación externa de 12V desde el fusible principal.',
          'La señal Hall pierde amplitud conforme aumentan las RPM del motor.'
        ],
        correctAnswer: 1,
        explanation: 'Los sensores de Efecto Hall producen una onda cuadrada digital de amplitud constante (normalmente 5V o 12V) mediante un transistor NPN interno que conmuta a masa. La señal inductiva es análoga de CA y su voltaje varía proporcionalmente con la velocidad de rotación.'
      },
      {
        id: 'q2',
        type: 'true-false',
        question: 'En un inyector de gasolina multipunto, el pico de inducción inductiva (pico de flyback) cuando la ECU corta la masa puede alcanzar de 60V a 90V.',
        options: ['Verdadero', 'Falso'],
        correctAnswer: 0,
        explanation: '¡Verdadero! Cuando la masa del solenoide del inyector se interrumpe abruptamente, el colapso del campo magnético genera un pulso de alta tensión (Flyback Voltage Spike) de entre 60V y 90V, confirmando el buen estado del bobinado e inductancia.'
      },
      {
        id: 'q3',
        type: 'waveform-interpretation',
        question: 'Analiza el oscilograma adjunto de un sensor CKP Inductivo. Al acelerar a 3,000 RPM, la amplitud creció de 1.5Vp a 18Vp pero se observan picos recortados a 0V en la parte inferior. ¿A qué se debe?',
        imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
        options: [
          'Cortocircuito a masa en el devanado interno del sensor.',
          'Saturación de entrada o atenuación incorrecta en el osciloscopio / acoplamiento en DC sin rango adecuado.',
          'La rueda fónica perdió un diente permanentemente.',
          'La batería está entregando sobrevoltaje de 16V.'
        ],
        correctAnswer: 1,
        explanation: 'Al aumentar la velocidad, el voltaje del sensor inductivo supera el rango configurado en el osciloscopio (o límite de entrada del canal), provocando un recorte (clipping) en la captura visual. Se debe ajustar la escala de V/Div a un valor mayor (p. ej. 10V/Div o atenuador 10:1).'
      },
      {
        id: 'q4',
        type: 'matching',
        question: 'Relaciona cada componente del circuito de encendido directo (COP) con su forma de onda correspondiente:',
        options: ['Onda primaria con pulso de saturación y rampa de corriente', 'Onda de pulso digital 5V Trigger ECU', 'Pico de alta tensión secundario con cola de chispa'],
        matchingPairs: [
          { id: 'm1', left: 'Pin de Señal IGT (Trigger) de ECU', right: 'Onda de pulso digital 5V Trigger ECU' },
          { id: 'm2', left: 'Primario de Bobina (Control Transistor)', right: 'Onda primaria con pulso de saturación y rampa de corriente' },
          { id: 'm3', left: 'Captura Secundaria con Pinza Inductiva', right: 'Pico de alta tensión secundario con cola de chispa' }
        ],
        correctAnswer: 0,
        explanation: 'El pin IGT lleva la señal lógica TTL de 5V. El primario de bobina muestra la rampa de corriente y sobretensión de desconexión. La captura secundaria refleja el salto de chispa de 15kV-30kV y el tiempo de quemado de la bujía.'
      },
      {
        id: 'q5',
        type: 'case',
        question: 'Caso Práctico: Toyota Hilux 1KD-FTV con síntoma de arranque prolongado y falla en ralenti. DTC P0335.',
        caseScenario: {
          vehicle: 'Toyota Hilux 3.0 D-4D 2018',
          symptom: 'Dificultad de arranque, motor no pasa de 2,500 RPM',
          dtc: 'P0335 - Crankshaft Position Sensor A Circuit Performance',
          background: 'Se instaló sensor nuevo no original. El escáner muestra RPM fluctuando erráticamente de 0 a 1400 RPM en ralentí.'
        },
        options: [
          'Sustituir la ECU del motor inmediatamente.',
          'Verificar con osciloscopio la entrehierro (gap) de la rueda fónica y el patrón de la onda; los sensores genéricos suelen presentar baja amplitud e interferencia electromagnética por falta de apantallado.',
          'Invertir la polaridad de la batería para reiniciar los datos adaptativos.',
          'Anular el código P0335 en la memoria flash de la computadora.'
        ],
        correctAnswer: 1,
        explanation: 'El DTC P0335 con lectura fluctuante indica pérdida de sincronismo en la lectura de la rueda fónica. En motores diésel Common Rail, los sensores de posición genéricos o un entrehierro desajustado generan ruido magnético y baja señal de salida.'
      }
    ]
  },
  {
    id: 'quiz-canbus-diagnostics',
    title: 'Quiz CAN Bus: Diagnóstico de Redes Multiplexadas',
    category: 'Redes y Protocolos OBD-II',
    description: 'Evaluación técnica de voltajes CAN-High/CAN-Low, impedancia terminadora de 60 Ohm y aislamiento de nodos.',
    passingScore: 80,
    xpReward: 200,
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: '¿Cuáles son los voltajes en estado recesivo (reposo) en una red CAN Bus de Alta Velocidad (ISO 11898)?',
        options: [
          'CAN-High = 0V, CAN-Low = 12V',
          'CAN-High = 2.5V, CAN-Low = 2.5V',
          'CAN-High = 3.5V, CAN-Low = 1.5V',
          'CAN-High = 5.0V, CAN-Low = 0V'
        ],
        correctAnswer: 1,
        explanation: 'En estado recesivo (Lógico 1), ambas líneas diferencial CAN-High y CAN-Low se encuentran equilibradas en un voltaje de reposo aproximado de 2.5V respecto a masa.'
      },
      {
        id: 'q2',
        type: 'true-false',
        question: 'Si la resistencia medida entre el Pin 6 y Pin 14 del conector DLC OBD-II con batería desconectada arroja 120 Ohmios, indica que una de las dos resistencias terminadoras de la red está abierta o desconectada.',
        options: ['Verdadero', 'Falso'],
        correctAnswer: 0,
        explanation: '¡Verdadero! Una red CAN saludable posee dos resistencias de 120 Ω en paralelo en los extremos de la red, dando un equivalente de 60 Ω. Si da 120 Ω, significa que solo una resistencia de terminación está conectada.'
      },
      {
        id: 'q3',
        type: 'matching',
        question: 'Asocia las lecturas anómalas en el bus de datos CAN con la falla de cableado física:',
        options: ['Lectura de 0 Ohmios en DLC', 'Lectura de 2.5V constantes sin pulsos diferenciales', 'Lectura de 12V permanentes en CAN-High'],
        matchingPairs: [
          { id: 'm1', left: 'Cortocircuito directo entre CAN-H y CAN-L', right: 'Lectura de 0 Ohmios en DLC' },
          { id: 'm2', left: 'Línea CAN en Silencio / Búsqueda de dominante atascada', right: 'Lectura de 2.5V constantes sin pulsos diferenciales' },
          { id: 'm3', left: 'Cortocircuito a Positivo de Batería (+12V)', right: 'Lectura de 12V permanentes en CAN-High' }
        ],
        correctAnswer: 0,
        explanation: 'El cortocircuito entre líneas CAN unifica la diferencia de potencial dando 0 Ohmios. Si el bus está en reposo sin actividad pero con terminación conectada, se mantiene en 2.5V.'
      }
    ]
  }
];

export const EVALUATION_EXAMS: Exam[] = [
  {
    id: 'exam-master-diagnosta',
    title: 'Examen de Certificación Final: Diagnosta Automotriz Avanzado YOVE',
    category: 'Examen de Certificación',
    description: 'Examen integral de 20 preguntas de alta exigencia técnica. Cubre osciloscopio, red CAN Bus, lógica de inyección de gasolina/diésel, análisis de sensores, DTCs y estrategias de reparación.',
    timeLimitMinutes: 45,
    passingScore: 85,
    attemptsAllowed: 3,
    xpReward: 500,
    questions: [
      {
        id: 'eq1',
        type: 'multiple-choice',
        question: 'En un sistema de inyección electrónica con sensor de presión absoluta de múltiple (MAP) analógico de frecuencia variable (como Ford EEV-IV/V), ¿cuál es la frecuencia habitual a presión atmosférica a nivel del mar?',
        options: ['159 Hz a 162 Hz', '50 Hz a 60 Hz', '1000 Hz', '2.5 KHz'],
        correctAnswer: 0,
        explanation: 'Los sensores MAP capacitivos de Ford varían su frecuencia: ~159-162 Hz a presión atmosférica (llave en ON, motor apagado) y descienden a ~100-105 Hz con pleno vacío en ralentí.'
      },
      {
        id: 'eq2',
        type: 'true-false',
        question: 'Un ajuste de combustible a corto plazo (Short Term Fuel Trim) en +25% acompañado de sensor O2 atascado en 100mV indica una mezcla pobre severa donde la ECU está intentando enriquecer agregando más tiempo de inyección.',
        options: ['Verdadero', 'Falso'],
        correctAnswer: 0,
        explanation: '¡Verdadero! Los valores positivos altos (+25%) significan que la ECU detectó un exceso de oxígeno (mezcla pobre, O2 < 200mV) y suma combustible para compensar la fuga de vacío o falta de presión de gasolina.'
      },
      {
        id: 'eq3',
        type: 'waveform-interpretation',
        question: 'En la captura de corriente del motor de arranque realizada con pinza inductiva de 600A y osciloscopio, se observa una caída periódica repetitiva en un pico de corriente cada dos vueltas de cigüeñal. ¿Cuál es el diagnóstico?',
        imageUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=600',
        options: [
          'Batería con bajo nivel de electrolito.',
          'Pérdida de compresión relativa en un cilindro específico.',
          'Piñón de Bendix con dientes desgastados.',
          'Alternador con diodo rectificador quemado.'
        ],
        correctAnswer: 1,
        explanation: 'Al realizar la prueba de compresión relativa midiendo los picos de corriente requeridos por el arranque para vencer el Punto Muerto Superior (PMS), una caída periódica en un ciclo indica que un cilindro tiene fuga de compresión (válvula pisada, junta de tapa rota o aros).'
      },
      {
        id: 'eq4',
        type: 'case',
        question: 'Caso de Examen: Volkswagen Golf VII 1.4 TSI con DTC P0299 (Underboost) y tironeo severo bajo carga.',
        caseScenario: {
          vehicle: 'VW Golf VII 1.4 TSI EA211',
          symptom: 'Pérdida súbita de potencia a más de 3000 RPM, luz EPC encendida',
          dtc: 'P0299 - Turbocharger/Supercharger Underboost',
          background: 'Presión especificada de turbo: 2.1 bar. Presión real medida por sensor MAP2: 1.2 bar.'
        },
        options: [
          'Cambiar sensor de posición de mariposa de aceleración.',
          'Comprobar juego en el vástago del actuador eléctrico de la Wastegate, fuga en tubería del intercooler o atascamiento de la válvula N75.',
          'Desconectar la batería por 24 horas.',
          'Reemplazar la computadora de motor Bosch MED17.'
        ],
        correctAnswer: 1,
        explanation: 'El fallo P0299 en los motores 1.4 TSI suele ser causado por holgura o descalibración en el actuador electrónico del turbo (wastegate), o por fisura en el tubo de carga del intercooler aire-agua.'
      },
      {
        id: 'eq5',
        type: 'matching',
        question: 'Relaciona el código de falla OBD-II con su subsistema correspondiente:',
        options: ['Sistema de Inyección de Aire Secundario / Mezcla Pobre', 'Circuito de Calefactor de Sensor de Oxígeno Banco 1 Sensor 1', 'Misfire / Fallo de Encendido Cilindro 3'],
        matchingPairs: [
          { id: 'm1', left: 'P0303', right: 'Misfire / Fallo de Encendido Cilindro 3' },
          { id: 'm2', left: 'P0135', right: 'Circuito de Calefactor de Sensor de Oxígeno Banco 1 Sensor 1' },
          { id: 'm3', left: 'P0171', right: 'Sistema de Inyección de Aire Secundario / Mezcla Pobre' }
        ],
        correctAnswer: 0,
        explanation: 'Los DTCs P0300-P0312 representan fallas de encendido por cilindro; P0130-P0167 sensores de oxígeno y calefactores; P0170-P0175 ajustes de combustible.'
      }
    ]
  }
];

export const GLOBAL_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    id: 'student-9901',
    studentName: 'Ing. Fernando Vargas',
    level: 'Experto YOVE',
    xp: 8450,
    badgesCount: 18,
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200',
    country: 'México',
    countryFlag: '🇲🇽'
  },
  {
    rank: 2,
    id: 'student-8832',
    studentName: 'Técnico Carlos Ramírez',
    level: 'Diagnosta',
    xp: 5920,
    badgesCount: 14,
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
    country: 'Colombia',
    countryFlag: '🇨🇴'
  },
  {
    rank: 3,
    id: 'student-7892',
    studentName: 'Técnico Alejandro Silva',
    level: 'Especialista',
    xp: 1450,
    badgesCount: 8,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    country: 'Perú',
    countryFlag: '🇵🇪'
  },
  {
    rank: 4,
    id: 'student-6120',
    studentName: 'Dra. Sofía Mendoza',
    level: 'Especialista',
    xp: 1280,
    badgesCount: 6,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    country: 'Chile',
    countryFlag: '🇨🇱'
  },
  {
    rank: 5,
    id: 'student-5411',
    studentName: 'Téc. Marco Rossi',
    level: 'Técnico',
    xp: 940,
    badgesCount: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    country: 'Argentina',
    countryFlag: '🇦🇷'
  }
];

export const DEFAULT_STUDENT_MISSIONS: Mission[] = [
  {
    id: 'm-daily-1',
    title: 'Completar 1 Laboratorio Virtual',
    description: 'Experimenta en YOVE Lab con osciloscopio, multímetro o CAN Bus.',
    xpReward: 100,
    category: 'daily',
    completed: true,
    currentProgress: 1,
    totalRequired: 1,
    icon: '🔬'
  },
  {
    id: 'm-daily-2',
    title: 'Resolver 1 Caso Diagnóstico',
    description: 'Investiga síntomas y DTCs en YOVE Cases.',
    xpReward: 150,
    category: 'daily',
    completed: false,
    currentProgress: 0,
    totalRequired: 1,
    icon: '🚘'
  },
  {
    id: 'm-weekly-1',
    title: 'Aprobar un Quiz con 90%+',
    description: 'Pone a prueba tus conocimientos técnicos en la sección de evaluaciones.',
    xpReward: 250,
    category: 'weekly',
    completed: false,
    currentProgress: 0,
    totalRequired: 1,
    icon: '📝'
  },
  {
    id: 'm-weekly-2',
    title: 'Consultar 3 Diagnósticos en YOVE AI',
    description: 'Haz preguntas sobre código DTC o diagrama eléctrico al asistente virtual.',
    xpReward: 200,
    category: 'weekly',
    completed: true,
    currentProgress: 3,
    totalRequired: 3,
    icon: '🤖'
  }
];

export const ALL_BADGES: Badge[] = [
  { id: 'b1', name: 'Primer Oscilograma', icon: '📈', description: 'Completó el laboratorio de osciloscopio' },
  { id: 'b2', name: 'Cazador de DTCs', icon: '🔍', description: 'Resolvió su primer caso práctico P0171' },
  { id: 'b3', name: 'Racha de 7 Días', icon: '🔥', description: 'Estudió durante 7 días consecutivos' },
  { id: 'b4', name: 'Maestro CAN Bus', icon: '🌐', description: 'Superó las pruebas de redes multiplexadas en YOVE Lab' },
  { id: 'b5', name: 'Especialista en Sensores', icon: '⚡', description: 'Identificó señales CKP, CMP, TPS, MAP y O2' },
  { id: 'b6', name: 'Examen de Excelencia', icon: '🎓', description: 'Aprobó un examen final con nota superior al 90%' },
  { id: 'b7', name: 'Experto en Inyección', icon: '⛽', description: 'Completó la ruta de Inyección Electrónica Avanzada' },
  { id: 'b8', name: 'Certificado Oficial', icon: '📜', description: 'Obtuvo su primera acreditación verificable con código QR' }
];
