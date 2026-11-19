import { Course } from '../../types';

const q = (id: string, question: string, options: string[], correctAnswer: number, explanation: string) => ({
  id, question, options, correctAnswer, explanation
});

export const PRIORITY_COURSES_PART4: Course[] = [
  // 16. Transmisiones Automáticas, CVT y Doble Embrague (DCT / DSG)
  {
    id: 'transmisiones-cvt-dct-dsg',
    title: 'Diagnóstico Electrónico de Transmisiones Automáticas, CVT y Doble Embrague (DCT / DSG)',
    icon: '⚙️',
    category: 'cvt',
    categoryLabel: 'Transmisiones Automáticas, CVT y DCT',
    description: 'Diagnóstico de cuerpo de válvulas, solenoides PWM, variadores CVT con correa metálica y mecatrónica de transmisiones robotizadas DSG / DCT.',
    longDescription: 'Especialización técnica en transmisiones modernas. Aprende la hidráulica y control electrónico de transmisiones automáticas convencionales con convertidor de par, transmisiones de variación continua (CVT Jatco/Nissan/Toyota) con control de presión secundaria y primaria, y unidades mecatrónicas de doble embrague DSG (DQ200 seca, DQ250 húmeda, Powershift).',
    objectives: [
      'Diagnosticar problemas de patinamiento y golpes en cambios evaluando solenoides hidráulicos y sensores de presión de fluido.',
      'Identificar el desgaste de correa metálica y conos de variador en cajas CVT mediante medición de presión de aceite hidráulico.',
      'Realizar diagnóstico, sustitución y calibración de juego de embragues en cajas de doble embrague DCT / DSG.',
      'Efectuar procedimientos de aprendizaje básico y adaptación de puntos de contacto de embrague con escáner.'
    ],
    requirements: ['Electricidad y Electrónica Automotriz', 'Uso de Escáner de Diagnóstico Multimarca'],
    learningOutcomes: ['Resolución de códigos de falla P0700, P0841, P2711 y pérdida de tracción en transmisiones automáticas.'],
    price: 269,
    duration: '8 Semanas (65 hrs)',
    level: 'Avanzado',
    status: 'PUBLISHED',
    systemId: 'sistema-transmision',
    relatedVehicle: 'General (Nissan CVT, VW DSG, Ford Powershift, Toyota e-CVT)',
    relatedCases: ['case-013-dsg-sin-reversa', 'case-017-cvt-patinamiento'],
    relatedLabs: ['lab-cvt-pressures', 'lab-dsg-clutch-adaptation'],
    recommendedAiMode: 'diagnostico',
    features: ['Prácticas de desarmado de unidad Mecatrónica DSG', 'Medición de presiones hidráulicas en puertos de prueba', 'Procedimientos de reflash y codificación de TCM'],
    instructor: 'Ing. Carlos Mendoza',
    rating: 4.93,
    reviewsCount: 295,
    modules: [
      {
        id: 'tra-m1',
        title: 'Módulo 1: Transmisiones CVT (Continuously Variable Transmission) y Control de Variadores',
        description: 'Mecanismo de poleas cónicas de diámetro variable, correa de empuje de acero y bomba hidráulica de alta presión.',
        lessons: [
          {
            id: 'tra-m1-l1',
            title: 'Lección 1.1: Física de la Correa Metálica de Empuje y Presión de Aceite de Cierre de Polea',
            duration: '25 min',
            type: 'video',
            textContent: 'Las transmisiones CVT utilizan un par de poleas cónicas hidráulicamente controladas. La ECU modulante aplica hasta 60 bar de presión al variador secundario para evitar que la correa de eslabones de acero resbale bajo alta aceleración.'
          },
          {
            id: 'tra-m1-l2',
            title: 'Lección 1.2: Diagnóstico del Sensor de Presión de Aceite y Solenoide Step Motor / Line Pressure Solenoid',
            duration: '30 min',
            type: 'interactive',
            textContent: 'Los solenoides lineales regulan la presión hidráulica. El desgaste en las válvulas de aluminio del cuerpo de válvulas genera pérdidas internas de presión, haciendo que la transmisión patine y active códigos P0841.'
          }
        ],
        quiz: {
          id: 'q-tra-m1',
          title: 'Quiz Módulo 1: Cajas CVT',
          passingScore: 80,
          questions: [
            q('q-tra-1-1', '¿Qué consecuencia inmediata tiene la degradación o el uso de fluido de transmisión incorrecto (no específico CVT) en una caja de variación continua?', ['El motor consume más gasolina solamente', 'Patinamiento de la correa metálica de acero sobre los conos del variador, rayado irreparable de las superficies y pérdida total de aceleración', 'Aumento de potencia', 'Falla en el motor de arranque'], 1, 'El fluido CVT contiene aditivos de fricción de alta presión diseñados para evitar el deslizamiento metal contra metal.')
          ]
        }
      }
    ]
  },

  // 17. Sistemas ABS, ESP y Control de Estabilidad
  {
    id: 'sistemas-abs-esp-control-estabilidad',
    title: 'Sistemas de Seguridad Activa: ABS, ESP, Control de Tracción y Sensores de Ángulo SAS',
    icon: '🛑',
    category: 'abs',
    categoryLabel: 'ABS, ESP y Seguridad Activa',
    description: 'Diagnóstico del bloque hidráulico HCU, sensores de velocidad de rueda magneto-resistivos, sensor de ángulo de dirección SAS y giroscopio de aceleración lateral (Yaw Rate).',
    longDescription: 'Aprende el diagnóstico avanzado de los sistemas antibloqueo de frenos (ABS) y control electrónico de estabilidad (ESP / ESC). Domina el análisis de sensores de rueda activos de 2 cables con codificador magnético en el rodamiento, diagnóstico de válvulas solenoides en el módulo hidráulico HCU, purga de frenos asistida por escáner y calibración del sensor de ángulo de volante (G85 / SAS).',
    objectives: [
      'Diagnosticar sensores de rueda magneto-resistivos y de Efecto Hall activos (señal de corriente 7mA / 14mA).',
      'Efectuar la calibración de punto cero del sensor de ángulo de dirección (SAS / G85) y del sensor de aceleración lateral (G200/G202).',
      'Realizar el procedimiento de purga hidráulica asistida de la unidad HCU con escáner.',
      'Identificar fallas en la bomba de recirculación de líquido de frenos del ABS.'
    ],
    requirements: ['Osciloscopio Automotriz', 'Multímetro Digital'],
    learningOutcomes: ['Resolución de luces encendidas de ABS, ESP, Tracción y errores de alineación de dirección.'],
    price: 219,
    duration: '6 Semanas (45 hrs)',
    level: 'Intermedio',
    status: 'PUBLISHED',
    systemId: 'sistema-frenos-seguridad',
    relatedVehicle: 'General (Bosch ESP 8.0/9.0, Continental Teves Mk60/Mk100)',
    relatedCases: ['case-016-sensor-rueda-abs', 'case-019-esp-calibracion-sas'],
    relatedLabs: ['lab-abs-wheel-sensor', 'lab-esp-hcu-bleed'],
    recommendedAiMode: 'diagnostico',
    features: ['Análisis de rueda fónica magnética con tarjeta detectora de polos', 'Procedimiento de purga asistida HCU', 'Calibración de sensor SAS con escáner'],
    instructor: 'Ing. Alejandro Silva',
    rating: 4.91,
    reviewsCount: 260,
    modules: [
      {
        id: 'abs-m1',
        title: 'Módulo 1: Sensores de Velocidad de Rueda Activos (2 Cables) y Codificadores Magnéticos',
        description: 'Diferencia entre sensores inductivos pasivos y sensores magneto-resistivos activos impulsados por señal de corriente.',
        lessons: [
          {
            id: 'abs-m1-l1',
            title: 'Lección 1.1: Principio Magneto-Resistivo: Transmisión de Datos por Niveles de Corriente (7mA a 14mA)',
            duration: '20 min',
            type: 'video',
            textContent: 'Los sensores ABS activos son alimentados con 12V o 8V desde el módulo ABS. Al pasar los polos magnéticos del rodamiento frente al sensor, la corriente consumida conmuta en una onda cuadrada perfecta entre 7mA (Bajo) y 14mA (Alto).'
          }
        ],
        quiz: {
          id: 'q-abs-m1',
          title: 'Quiz Módulo 1: Sensores ABS',
          passingScore: 80,
          questions: [
            q('q-abs-1-1', '¿Cómo se comprueba correctamente la señal de un sensor de rueda ABS activo de 2 cables con osciloscopio?', ['Midiendo resistencia en Ohmios directo con el multímetro (lo cual puede dañarlo)', 'Midiendo el voltaje en caída sobre una resistencia en serie o utilizando una pinza de corriente para observar la onda cuadrada de 7mA a 14mA', 'Desconectando la batería', 'Midiendo temperatura'], 1, 'Debido a que el sensor activo modifica la corriente que consume, el método ideal es observar el cambio de corriente o la caída de voltaje en la línea de señal alimentada.')
          ]
        }
      }
    ]
  },

  // 18. Sistemas de Airbag y Pretensionadores (SRS)
  {
    id: 'sistemas-airbag-srs-pretensionadores',
    title: 'Sistemas de Seguridad Pasiva Airbag (SRS), Pretensionadores y Limpieza de Crash Data',
    icon: '🛡️',
    category: 'airbag',
    categoryLabel: 'Airbag y SRS',
    description: 'Protocolos de seguridad, resistencia de detonadores (Squibs), resorte espiral de volante (Clock Spring), pretensionadores pirotécnicos y programación de módulos SRS.',
    longDescription: 'Curso especializado en la reparación segura y diagnóstico de los sistemas de retención suplementaria (SRS). Aprende los protocolos de desactivación de alto riesgo, medición indirecta de resistencia de los detonadores pirotécnicos (debe ser entre 2.0 Ω y 3.5 Ω), diagnóstico del carrete giratorio de volante, sensores de impacto frontal y lateral (MEMS) y borrado de registro de colisión (Crash Data).',
    objectives: [
      'Aplicar estrictamente las normas de seguridad previa manipulación de componentes pirotécnicos SRS.',
      'Diagnosticar discontinuidades en la cinta espiral de dirección (Clock Spring) por girar el volante fuera de centro.',
      'Identificar la causa raíz del código de alta o baja resistencia en bolsas de aire frontales, laterales y pretensionadores de cinturón.',
      'Comprender la arquitectura de almacenamiento de datos de impacto en la memoria EEPROM / Flash del módulo SRS.'
    ],
    requirements: ['Electricidad Automotriz Básica', 'Manejo de Escáner de Diagnóstico'],
    learningOutcomes: ['Reparación segura y diagnóstico de códigos de falla de bolsas de aire e indicadores en el tablero.'],
    price: 229,
    duration: '5 Semanas (40 hrs)',
    level: 'Intermedio',
    status: 'PUBLISHED',
    systemId: 'sistema-seguridad-pasiva',
    relatedVehicle: 'General (Bosch, Continental, Autoliv, TRW)',
    relatedCases: ['case-020-airbag-clockspring', 'case-022-srs-crash-data'],
    relatedLabs: ['lab-srs-squib-resistor'],
    recommendedAiMode: 'diagnostico',
    features: ['Simuladores de detonadores pirotécnicos para prueba segura', 'Procedimiento seguro de cambio de cinta espiral', 'Lógica de borrado de Crash Data'],
    instructor: 'Ing. Carlos Mendoza',
    rating: 4.92,
    reviewsCount: 210,
    modules: [
      {
        id: 'srs-m1',
        title: 'Módulo 1: Seguridad y Arquitectura de Detonadores Pirotécnicos (Squibs)',
        description: 'Precauciones extremas, tiempos de descarga de capacitores del módulo SRS y valor nominal de resistencia.',
        lessons: [
          {
            id: 'srs-m1-l1',
            title: 'Lección 1.1: Regla de Oro de Seguridad: Prohibición Absoluta de Medir Resistencia Directa con Multímetro en Detonadores',
            duration: '20 min',
            type: 'video',
            textContent: 'Nunca uses un multímetro convencional en la función de Ohmetro sobre un detonador de airbag o pretensionador. La corriente que inyecta la batería del multímetro para medir Ohmios (hasta 10mA - 50mA) puede activar la carga pirotécnica provocando una detonación accidental.'
          }
        ],
        quiz: {
          id: 'q-srs-m1',
          title: 'Quiz Módulo 1: Seguridad SRS',
          passingScore: 80,
          questions: [
            q('q-srs-1-1', '¿Cuál es el rango típico de resistencia simulada que el módulo de Airbag espera encontrar en una bolsa de aire o pretensionador en buen estado?', ['0.1 Ω a 0.5 Ω', '2.0 Ω a 3.5 Ω', '100 Ω a 500 Ω', '10,000 Ω'], 1, 'El circuito del squib requiere una resistencia baja precisa (2.0 a 3.5 Ohmios). Una resistencia superior a 4.5 Ohmios activa el código de alta resistencia/circuito abierto.')
          ]
        }
      }
    ]
  },

  // 19. Vehículos Híbridos y Eléctricos: Baterías HV y BMS
  {
    id: 'vehiculos-hibridos-electricos-baterias-hv-bms',
    title: 'Vehículos Híbridos y Eléctricos (HEV/EV): Baterías de Alto Voltaje y Sistema BMS',
    icon: '⚡',
    category: 'hv_batteries',
    categoryLabel: 'Baterías HV y BMS',
    description: 'Seguridad en Alta Tensión (CAT III 1000V), desconexión de Service Plug, diagnóstico de celdas de Li-Ion/NiMH, contactores SMR y BMS.',
    longDescription: 'Formación esencial para trabajar con seguridad en vehículos electrificados de Alta Tensión (hasta 800V DC). Aprende los protocolos de seguridad personal, verificación de ausencia de tensión, arquitectura de baterías NiMH y Litio-Ión, gestión del sistema BMS (Battery Management System), equilibrio activo/pasivo de celdas, análisis de resistencia interna y diagnóstico de relés de contactores principales (System Main Relays - SMR).',
    objectives: [
      'Aplicar la regla de oro de desenergización y verificación de cero voltaje con herramientas aisaladas CAT III / CAT IV 1000V.',
      'Analizar los parámetros de SoC (State of Charge), SoH (State of Health) y desviaciones de voltaje en bloques de celdas con escáner.',
      'Diagnosticar fallas en los relés de contactores SMR1, SMR2 y relé de pre-carga con resistencia de amortiguación.',
      'Identificar pérdidas de aislamiento de alta tensión respecto al chasis mediante monitoreo de resistencia de fuga.'
    ],
    requirements: ['Electricidad Automotriz Avanzada', 'Certificación o conocimiento en Seguridad Eléctrica'],
    learningOutcomes: ['Capacidad técnica para intervenir e inspeccionar paquetes de baterías de alta tensión sin riesgo eléctrico.'],
    price: 349,
    duration: '10 Semanas (80 hrs)',
    level: 'Avanzado',
    status: 'PUBLISHED',
    systemId: 'sistema-alto-voltaje-bateria',
    relatedVehicle: 'Híbridos / Eléctricos (Toyota Prius/Corolla, Nissan Leaf, Tesla Model 3, Hyundai Ioniq)',
    relatedCases: ['case-021-prius-celda-degradada', 'case-025-smr-contactor-abierto'],
    relatedLabs: ['lab-hv-deenergization', 'lab-bms-cell-balance'],
    recommendedAiMode: 'diagnostico',
    features: ['Uso de EPP dieléctrico (Guantes Clase 0 / 1000V)', 'Procedimiento paso a paso de extracción de Service Plug', 'Reemplazo y balanceo de módulos de batería NiMH / Li-Ion'],
    instructor: 'Ing. Alejandro Silva',
    rating: 4.99,
    reviewsCount: 620,
    modules: [
      {
        id: 'ev-m1',
        title: 'Módulo 1: Seguridad Eléctrica y Desenergización del Sistema de Alta Tensión',
        description: 'Categorías de seguridad CAT III/CAT IV, guantes dieléctricos con prueba de aire, y protocolo de interlock.',
        lessons: [
          {
            id: 'ev-m1-l1',
            title: 'Lección 1.1: Clasificación de Voltajes: Límite de Seguridad DC (>60V) y Riesgo de Arco Eléctrico',
            duration: '25 min',
            type: 'video',
            textContent: 'Cualquier tensión continua superior a 60V DC se considera Alta Tensión letal para el cuerpo humano. Los paquetes de baterías automotrices operan entre 200V y 800V DC.'
          },
          {
            id: 'ev-m1-l2',
            title: 'Lección 1.2: Protocolo de Desconexión del Tapón de Servicio (Service Plug) y Tiempo de Descarga de Capacitores del Inversor (5 a 10 min)',
            duration: '35 min',
            type: 'interactive',
            textContent: 'Tras remover el Service Plug, se debe esperar al menos 5 a 10 minutos para permitir que la resistencia de descarga reduzca el voltaje de los condensadores masivos del inversor a menos de 5V DC. Comprueba SIEMPRE con el multímetro CAT III 1000V antes de tocar ningún componente naranja.'
          }
        ],
        quiz: {
          id: 'q-ev-m1',
          title: 'Quiz Módulo 1: Seguridad en Alta Tensión',
          passingScore: 80,
          questions: [
            q('q-ev-1-1', '¿Cuál es la prueba obligatoria antes de colocar los guantes dieléctricos de Clase 0 (1000V) para trabajar en vehículos híbridos/eléctricos?', ['Prueba de resistencia con multímetro', 'Prueba neumática de estanqueidad (inflado de aire para detectar micro-perforaciones o grietas ocultas)', 'Prueba con aceite', 'Lavar los guantes'], 1, 'Incluso un agujero del tamaño de una aguja permite el paso del arco de alta tensión a través del guante.')
          ]
        }
      }
    ]
  },

  // 20. Inversores de Potencia, Generadores y Motores de Tracción Trifásicos (MG1 / MG2 / ADAS)
  {
    id: 'inversores-potencia-motores-electricos-adas',
    title: 'Inversores de Potencia, Motores Trifásicos de Tracción y Calibración ADAS',
    icon: '🔌',
    category: 'inverters',
    categoryLabel: 'Inversores, EV y ADAS',
    description: 'Diagnóstico de transistores IGBT/SiC en inversores, generadores MG1/MG2, sensores Resolver de posición y calibración de radares/cámaras ADAS.',
    longDescription: 'Domina los componentes de potencia y asistencia avanzada a la conducción. Aprende la conmutación trifásica de alta frecuencia en inversores mediante transistores IGBT / Carburo de Silicio (SiC), comprobación de aislamiento de devanados de motores sincrónicos de imán permanente (PMSM) con megóhmetro (Megger), sensores Resolver de posición angular y procesos de calibración estática y dinámica de sistemas ADAS (Frenado Autónomo AEB, Alerta de Cambio de Carril LDW).',
    objectives: [
      'Comprobar el aislamiento de aislamiento de fase a masa de los motores de tracción MG1 y MG2 utilizando megóhmetro (mínimo 500 MΩ a 500V).',
      'Diagnosticar señales de excitación y retorno de sensores Resolver de posición de motor eléctrico.',
      'Analizar la conversión de corriente continua DC de la batería a corriente alterna trifásica AC variable en frecuencia y amplitud.',
      'Realizar procedimientos de alineación de objetivos (Targets) para calibración de radar de control de crucero adaptativo y cámaras parabrisas ADAS.'
    ],
    requirements: ['Baterías HV y Seguridad Eléctrica', 'Osciloscopio Automotriz'],
    learningOutcomes: ['Mantenimiento y diagnóstico integral de tren motriz eléctrico y recalibración de sistemas de asistencia ADAS.'],
    price: 329,
    duration: '9 Semanas (75 hrs)',
    level: 'Experto',
    status: 'PUBLISHED',
    systemId: 'sistema-inversor-adas',
    relatedVehicle: 'General (Toyota Hybrid Synergy Drive, Nissan e-Power, Tesla, ADAS Bosch/Continental)',
    relatedCases: ['case-023-inversor-sobrecalentamiento', 'case-024-adas-camara-descalibrada'],
    relatedLabs: ['lab-inverter-igbt-check', 'lab-adas-target-calibration'],
    recommendedAiMode: 'asistente',
    features: ['Pruebas de aislamiento con Megóhmetro a 500V/1000V', 'Alineación práctica de paneles de calibración ADAS', 'Diagnóstico de conversor DC-DC de 12V'],
    instructor: 'Ing. Carlos Mendoza',
    rating: 4.98,
    reviewsCount: 480,
    modules: [
      {
        id: 'inv-m1',
        title: 'Módulo 1: Arquitectura del Inversor / Conversor de Potencia',
        description: 'Módulos de potencia de transistores IGBT, reactor elevador Boost Converter (de 200V a 650V DC) y circuito conversor DC-DC 12V.',
        lessons: [
          {
            id: 'inv-m1-l1',
            title: 'Lección 1.1: Operación del Módulo IGBT Trifásico: Generación de Señal Sinusoidal por PWM de Alta Frecuencia',
            duration: '30 min',
            type: 'video',
            textContent: 'El inversor conmuta los transistores IGBT a más de 10 kHz para sintetizar tres corrientes alternas desfasadas 120 grados que alimentan los devanados del motor de tracción.'
          }
        ],
        quiz: {
          id: 'q-inv-m1',
          title: 'Quiz Módulo 1: Inversores de Potencia',
          passingScore: 80,
          questions: [
            q('q-inv-1-1', '¿Qué instrumento especializado es indispensable para verificar que el aislamiento del aislamiento del devanado del motor eléctrico trifásico respecto al chasis no tenga fugas?', ['Multímetro convencional en Ohmios', 'Megóhmetro (Megger) aplicando una tensión de prueba de 500V o 1000V DC', 'Escáner genérico OBD-II', 'Punta de prueba lógica'], 1, 'Un multímetro convencional sólo aplica 3V de prueba, incapaz de detectar micro-fugas dieléctricas que se manifiestan únicamente al operar a alta tensión.')
          ]
        }
      }
    ]
  }
];
