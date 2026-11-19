import { Course } from '../../types';

const q = (id: string, question: string, options: string[], correctAnswer: number, explanation: string) => ({
  id, question, options, correctAnswer, explanation
});

export const PRIORITY_COURSES_PART3: Course[] = [
  // 11. Redes CAN Bus y LIN Bus
  {
    id: 'can-bus-lin-bus-diagnostico-redes',
    title: 'Diagnóstico e Interpretación de Redes Multiplexadas CAN Bus y LIN Bus',
    icon: '🌐',
    category: 'canbus',
    categoryLabel: 'Redes CAN Bus / LIN Bus',
    description: 'Aprende el comportamiento físico, protocolos de comunicación, resistencia de terminación y diagnóstico con osciloscopio en redes CAN High-Speed, Low-Speed y LIN Bus.',
    longDescription: 'Especialización técnica de alto nivel para diagnosticar fallas de comunicación en vehículos modernos. Analiza la señal diferencial CAN-High (2.5V a 3.5V) y CAN-Low (2.5V a 1.5V), identifica nodos dominantes/recesivos, fallas de resistencia final de 60 Ω en paralelo, tramas corruptas, problemas en la Gateway Central y comportamiento monopolar en LIN Bus (12V nominal).',
    objectives: [
      'Medir e interpretar las señales de tensión diferencial CAN-H y CAN-L con osciloscopio de 2 canales.',
      'Identificar la causa raíz de la pérdida de comunicación inter-módulos (Códigos U0100, U0101, U0401).',
      'Verificar la integridad de las resistencias de terminación de 120 Ω mediante mediciones en paralelo (60 Ω deseados) con batería desconectada.',
      'Diagnosticar redes monofilares LIN Bus en alternadores inteligentes, sensores de batería (IBS), motores de limpiaparabrisas y climatización.'
    ],
    requirements: [
      'Electricidad y Electrónica Automotriz Intermedia',
      'Uso de Osciloscopio Automotriz de 2 canales',
      'Multímetro Digital True-RMS'
    ],
    learningOutcomes: [
      'Aislamiento de módulos defectuosos que bloquean la red en menos de 20 minutos.',
      'Interpretación de la física de tramas CAN (SOF, Identifier, DLC, Data, CRC, ACK, EOF).',
      'Corrección de caídas de comunicación CAN en conectores de puerta de enlace (Gateway Module).'
    ],
    price: 249,
    duration: '8 Semanas (60 hrs)',
    level: 'Avanzado',
    status: 'PUBLISHED',
    systemId: 'sistema-redes-comunicacion',
    relatedVehicle: 'General (Vehículos CAN / LIN High Speed)',
    relatedCases: ['case-008-red-can-caida', 'case-012-linbus-alternador'],
    relatedLabs: ['lab-can-bus-waveform', 'lab-lin-bus-decode'],
    recommendedAiMode: 'diagnostico',
    features: [
      'Decodificación física de tramas CAN-Bus en vivo',
      'Inyección de fallas en maquetas de red real',
      'Análisis de red Gateway y BCM con escáner avanzado',
      'Certificación oficial Yove Academy en Diagnóstico de Redes'
    ],
    instructor: 'Ing. Carlos Mendoza',
    rating: 4.96,
    reviewsCount: 340,
    modules: [
      {
        id: 'can-m1',
        title: 'Módulo 1: Arquitectura y Física del Protocolo CAN Bus (ISO 11898)',
        description: 'Tensiones diferenciales, estados recesivo (2.5V) y dominante (3.5V / 1.5V), y topología en bus de estrella o árbol.',
        lessons: [
          {
            id: 'can-m1-l1',
            title: 'Lección 1.1: Principio Físico del Par Trenzado y Supresión de Interferencia Electromagnética (EMI)',
            duration: '25 min',
            type: 'video',
            textContent: 'El par de cables trenzados CAN-H y CAN-L elimina el ruido inducido exterior porque ambas líneas reciben el mismo impacto electromagnético simultáneamente. El receptor diferencial de la ECU calcula (CAN-H) - (CAN-L), cancelando completamente el ruido parásito común.'
          },
          {
            id: 'can-m1-l2',
            title: 'Lección 1.2: Estados Lógicos: Recesivo (Lógico 1) y Dominante (Lógico 0) a 500 kbps',
            duration: '30 min',
            type: 'interactive',
            textContent: 'En estado recesivo (sin transmitir), ambas líneas miden 2.5V respecto a masa (Diferencia = 0V). En estado dominante (transmitiendo un 0 lógico), CAN-H sube a 3.5V y CAN-L baja a 1.5V (Diferencia = 2.0V).'
          },
          {
            id: 'can-m1-l3',
            title: 'Lección 1.3: La Resistencia de Terminación: Por qué 120 Ω + 120 Ω = 60 Ω en Paralelo',
            duration: '25 min',
            type: 'video',
            textContent: 'Para evitar la reflexión de ondas electromagnéticas al final de las líneas de alta velocidad, los dos módulos situados en los extremos (usualmente ECM y BCM o ABS) contienen una resistencia interna de 120 Ω entre CAN-H y CAN-L. Al medir con el multímetro entre el Pin 6 y Pin 14 del conector OBD-II (con la batería desconectada), la resistencia equivalente debe ser exactamente de 60 Ω.'
          },
          {
            id: 'can-m1-l4',
            title: 'Lección 1.4: Práctica: Medición de Resistencia de Terminación OBD-II (Pin 6 y Pin 14) e Identificación de Resistencia Abierta (120 Ω)',
            duration: '35 min',
            type: 'interactive',
            activity: {
              id: 'act-can-1',
              title: 'Práctica de Resistencia de Terminación CAN en OBD-II',
              instructions: 'Desconecta el borne negativo de la batería. Conecta el multímetro en la escala de 200 Ω en los pines 6 (CAN High) y 14 (CAN Low) del conector DLC. Anota la lectura. Si obtienes 120 Ω, hay una resistencia o conector abierto en uno de los módulos extremos.',
              requiredTools: ['Multímetro Digital True-RMS', 'Caja de Desconexión OBD-II (Breakout Box)'],
              expectedOutput: 'Lectura nominal de 60 Ω ± 2 Ω.'
            }
          }
        ],
        quiz: {
          id: 'q-can-m1',
          title: 'Quiz Módulo 1: Fundamentos de CAN Bus',
          passingScore: 80,
          questions: [
            q('q-can-1-1', '¿Cuál es la tensión diferencial entre CAN-H y CAN-L cuando la red está en estado Recesivo (Lógico 1)?', ['2.0 V', '0.0 V (ambos están a 2.5 V)', '5.0 V', '12.0 V'], 1, 'En estado recesivo no hay transmisión activa; CAN-H está a 2.5V y CAN-L está a 2.5V, por lo que la diferencia es 2.5V - 2.5V = 0.0V.'),
            q('q-can-1-2', 'Si al medir la resistencia entre los pines 6 y 14 del conector OBD-II con batería desconectada obtienes 120 Ω en lugar de 60 Ω, ¿cuál es la causa más probable?', ['La batería está completamente descargada', 'Un módulo extremo con resistencia de terminación de 120 Ω está desconectado o la línea tiene un cable cortado', 'Hay un cortocircuito a masa en CAN Low', 'El fusible principal de la ECU se quemó'], 1, 'Al estar dos resistencias de 120 Ω en paralelo, si una se desconecta o la línea se abre, la resistencia total leída por el multímetro sube de 60 Ω a 120 Ω.'),
            q('q-can-1-3', '¿Qué pines del conector de diagnóstico estándar OBD-II (J1962) corresponden a la red CAN High Speed?', ['Pines 4 y 5', 'Pines 6 (CAN-H) y 14 (CAN-L)', 'Pines 7 y 15', 'Pines 2 y 10'], 1, 'El estándar ISO 15765-4 asigna obligatoriamente el Pin 6 a CAN High y el Pin 14 a CAN Low.')
          ]
        }
      },
      {
        id: 'can-m2',
        title: 'Módulo 2: Diagnóstico de Fallas de Capa Física con Osciloscopio',
        description: 'Identificación de cortocircuitos a masa, cortocircuitos a positivo 12V, resistencia abierta y derivaciones de masa.',
        lessons: [
          {
            id: 'can-m2-l1',
            title: 'Lección 2.1: Configuración del Osciloscopio de 2 Canales para Captura de CAN High y CAN Low',
            duration: '25 min',
            type: 'video',
            textContent: 'Ajusta el Canal 1 en CAN-H (escala de 1V/Div, Acoplamiento DC, sonda a Pin 6 OBD-II) y el Canal 2 en CAN-L (escala de 1V/Div, Acoplamiento DC, sonda a Pin 14 OBD-II). Configura la base de tiempo en 10 µs/Div a 50 µs/Div con disparo (Trigger) en flanco ascendente en 3.0V.'
          },
          {
            id: 'can-m2-l2',
            title: 'Lección 2.2: Patrón Óptimo de Espejo Perfecto y Tolerancia a Transitorios',
            duration: '30 min',
            type: 'interactive',
            textContent: 'Las ondas de CAN-H y CAN-L deben ser exactamente un reflejo especular la una de la otra en todo momento. La suma instantánea de CAN-H + CAN-L en estado dominante (3.5V + 1.5V) siempre resulta en aproximadamente 5.0V constante.'
          },
          {
            id: 'can-m2-l3',
            title: 'Lección 2.3: Diagnóstico de Cortocircuito a Masa (0V) o Cortocircuito a Positivo de Batería (12V)',
            duration: '30 min',
            type: 'video',
            textContent: 'Si CAN-H o CAN-L sufre un corto a masa, la red entera o ese tramo colapsa. Con un corto a masa en CAN-H, la línea queda clavada en 0V. Con un corto a positivo de batería (12V), ambas líneas son arrastradas hacia 12V o la ECU entra en estado Bus-Off por protección.'
          },
          {
            id: 'can-m2-l4',
            title: 'Lección 2.4: Práctica: Diagnóstico de Código de Falla U0100 (Pérdida de Comunicación con el ECM) por Arnés Rozado contra el Chasis',
            duration: '40 min',
            type: 'interactive',
            activity: {
              id: 'act-can-2',
              title: 'Aislamiento de Falla de Corto en Arnés CAN',
              instructions: 'Usa el osciloscopio en el DLC. Observa la forma de onda de CAN-L. Si aparece plana a 0V, desconecta progresivamente los conectores del arnés de motor hasta que la onda especular recupere sus 2.5V de nivel recesivo.',
              requiredTools: ['Osciloscopio Automotriz de 2 canales', 'Manual de Diagramas de Red OEM'],
              expectedOutput: 'Localización del punto exacto del corto en el arnés de cableado.'
            }
          }
        ],
        quiz: {
          id: 'q-can-m2',
          title: 'Quiz Módulo 2: Capa Física CAN con Osciloscopio',
          passingScore: 80,
          questions: [
            q('q-can-2-1', '¿Qué ocurre con la señal de CAN-L cuando la red pasa de estado Recesivo a Dominante?', ['Sube de 2.5 V a 3.5 V', 'Baja de 2.5 V a 1.5 V', 'Baja de 12.0 V a 0.0 V', 'Sube de 0.0 V a 5.0 V'], 1, 'CAN-L baja de su nivel de reposo de 2.5V a 1.5V durante el bit dominante.'),
            q('q-can-2-2', 'Si al sumar el Canal 1 (CAN-H) y Canal 2 (CAN-L) en la función matemática A+B del osciloscopio obtienes una línea recta constante de aproximadamente 5V, ¿qué significa esto?', ['Que la red tiene una falla grave de comunicación', 'Que la red está funcionando perfectamente en capa física sin deformaciones de señal', 'Que el conector DLC está suelto', 'Que la masa del osciloscopio no está conectada'], 1, 'La simetría espejo perfecta hace que (3.5V + 1.5V) = 5.0V constante. Si la suma varía erráticamente, indica asimetría o ruido electromagnético. ')
          ]
        }
      },
      {
        id: 'can-m3',
        title: 'Módulo 3: Red LIN Bus (Local Interconnect Network) y Módulos Esclavos',
        description: 'Comunicación monofilular a 19.2 kbps, maestro-esclavo, niveles de tensión de 12V recesivo a 0V dominante.',
        lessons: [
          {
            id: 'lin-m3-l1',
            title: 'Lección 3.1: Principio de Operación de LIN Bus: Un Solo Cable de Señal a 12 Voltios',
            duration: '20 min',
            type: 'video',
            textContent: 'LIN Bus es una red económica diseñada para subsistemas que no requieren la alta velocidad de CAN. Utiliza un solo cable donde el estado recesivo es 12V (tensión de batería) y el estado dominante es pulsado a masa (0V).'
          },
          {
            id: 'lin-m3-l2',
            title: 'Lección 3.2: Topología Maestro-Esclavo y Diagnóstico de Alternador Inteligente Lin-Bus',
            duration: '25 min',
            type: 'interactive',
            textContent: 'El módulo maestro (ej. ECM) genera el mensaje Header y la sincronización. El módulo esclavo (ej. Regulador del Alternador) responde completando el campo de datos. Si la red LIN se interrumpe, el alternador suele entrar en modo de carga fija por defecto a 13.8V - 14.2V e indicar código de falla U0120 o P0620.'
          },
          {
            id: 'lin-m3-l3',
            title: 'Lección 3.3: Práctica: Captura de Trama LIN Bus con Osciloscopio y Detección de Falla en Sensor Inteligente de Batería (IBS)',
            duration: '35 min',
            type: 'interactive',
            activity: {
              id: 'act-lin-1',
              title: 'Diagnóstico de Red LIN de Carga y Batería',
              instructions: 'Conecta la sonda del osciloscopio al cable LIN del alternador o del sensor IBS en el borne negativo. Configura 2V/Div, 200 µs/Div. Verifica el pulso continuo de 12V a 0V. Si la señal está plana en 12V sin pulsos a masa, el maestro no está enviando la cabecera de sincronización o el cable está cortado.',
              requiredTools: ['Osciloscopio', 'Punta de prueba atenuada 10x', 'Escáner con datos en vivo de LIN'],
              expectedOutput: 'Onda cuadrada limpia de 0V a 12V con frecuencia de trama coherente.'
            }
          }
        ],
        quiz: {
          id: 'q-lin-m3',
          title: 'Quiz Módulo 3: LIN Bus',
          passingScore: 80,
          questions: [
            q('q-lin-3-1', '¿Cuál es el voltaje nominal en reposo (estado Recesivo) de una línea de comunicación LIN Bus?', ['2.5 V', '5.0 V', 'Voltaje de Batería (Aproximadamente 12.0 V)', '0.0 V'], 2, 'A diferencia de CAN que trabaja a 2.5V, LIN es impulsado por la tensión del sistema eléctrico (12V recesivo).'),
            q('q-lin-3-2', '¿Qué ocurre normalmente si el cable LIN entre la ECU y el alternador inteligente se corta?', ['El vehículo se apaga inmediatamente y no vuelve a arrancar', 'El alternador deja de generar corriente y la batería se descarga en minutos', 'El alternador adopta una estrategia de seguridad (Default Mode) cargando a un voltaje fijo seguro de 13.8V-14.2V y registra un DTC de comunicación', 'Se quema el fusible de encendido'], 2, 'Los sistemas de carga LIN están diseñados para no dejar varado al conductor; en ausencia de datos, el regulador conmuta a regulación interna de emergencia.')
          ]
        }
      }
    ],
    exam: {
      id: 'ex-can-final',
      title: 'Examen de Certificación Profesional en Diagnóstico de Redes CAN / LIN Bus',
      description: 'Evaluación rigurosa de 10 preguntas sobre capa física, resistencias de terminación, códigos U y análisis con osciloscopio.',
      timeLimitMinutes: 45,
      passingScore: 80,
      attemptsAllowed: 3,
      questions: [
        q('q-ex-can-1', 'Al medir la resistencia entre CAN-H y CAN-L en el OBD-II leemos 0.5 Ω. ¿Qué falla tiene la red?', ['Resistencia de terminación abierta', 'Cortocircuito directo entre el cable CAN High y CAN Low', 'Línea de masa desconectada', 'Red normal'], 1, 'Una resistencia cercana a 0 Ω indica que los dos cables del par trenzado están cortocircuitados directamente entre sí.'),
        q('q-ex-can-2', '¿Qué código de diagnóstico de falla representa una pérdida de comunicación completa con el Módulo de Control de la Transmisión (TCM)?', ['P0300', 'U0101', 'C0035', 'B1000'], 1, 'Los códigos con prefijo "U" representan fallas en las redes de comunicación y el sub-código U0101 especifica la pérdida de comunicación con el TCM.')
      ]
    }
  },

  // 12. Osciloscopio Automotriz Avanzado
  {
    id: 'diagnostico-osciloscopio-automotriz',
    title: 'Diagnóstico Avanzado con Osciloscopio Automotriz y Análisis de Formas de Onda',
    icon: '📊',
    category: 'oscilloscope',
    categoryLabel: 'Osciloscopio Automotriz',
    description: 'Dominio total del osciloscopio: atenuadores 10:1 y 20:1, pinzas amperimétricas de baja y alta corriente, capturas de referencia y diagnóstico de fallas intermitentes.',
    longDescription: 'Curso indispensable para el técnico diagnosta moderno. Aprende a dominar los ajustes fundamentales de base de tiempo, voltaje por división, tipos de acoplamiento (AC/DC) y modos de disparo (Trigger). Utiliza pinzas amperimétricas para analizar el consumo de corriente de inyectores piezoeléctricos/solenoides, bombas de combustible, bobinas COP y pruebas de compresión relativa sin desarmar el motor.',
    objectives: [
      'Configurar correctamente los parámetros de captura para señales rápidas de alta frecuencia y transitorios lentos.',
      'Utilizar pinzas amperimétricas de baja corriente (60A) para medir la rampa de corriente de bobinas e inyectores.',
      'Realizar pruebas de compresión relativa con la pinza inductiva de alta corriente (600A) durante el arranque.',
      'Interpretar picos de inductancia (Flyback voltage) de más de 300V de forma segura usando atenuadores pasivos 10:1 o 20:1.'
    ],
    requirements: ['Conocimiento de Electricidad Básica', 'Osciloscopio Automotriz de al menos 2 canales y 20 MHz'],
    learningOutcomes: ['Diagnóstico de compresión en motores en menos de 5 minutos mediante compresión relativa.'],
    price: 229,
    duration: '7 Semanas (55 hrs)',
    level: 'Intermedio',
    status: 'PUBLISHED',
    systemId: 'sistema-diagnostico-electronico',
    relatedVehicle: 'General (Gasolina / Diésel / Híbrido)',
    relatedCases: ['case-004-falla-encendido-cop', 'case-010-compresion-relativa'],
    relatedLabs: ['lab-oscilloscope-signals', 'lab-current-clamp-inj'],
    recommendedAiMode: 'diagnostico',
    features: ['Librería de más de 100 señales OEM de referencia', 'Uso práctico de pinzas de corriente de 60A y 600A', 'Prácticas con transductores de presión en cilindro (PXZ)'],
    instructor: 'Ing. Alejandro Silva',
    rating: 4.97,
    reviewsCount: 410,
    modules: [
      {
        id: 'osc-m1',
        title: 'Módulo 1: Controles Esenciales: Volt/Div, Time/Div, Trigger y Atenuación',
        description: 'Fundamentos de muestreo digital (GSa/s), ancho de banda y protección contra picos inductivos.',
        lessons: [
          {
            id: 'osc-m1-l1',
            title: 'Lección 1.1: Ajuste Fino de la Base de Tiempo: De Microsegundos (µs) a Segundos (s)',
            duration: '20 min',
            type: 'video',
            textContent: 'Para ver un pulso de inyección (2ms a 5ms) usa una base de tiempo de 1ms/Div o 2ms/Div. Para evaluar un barrido de TPS usa el modo ROLL / SCAN con 1s/Div.'
          },
          {
            id: 'osc-m1-l2',
            title: 'Lección 1.2: El Disparo (Trigger): Flanco Ascendente, Descendente, Modo Automático y Normal',
            duration: '25 min',
            type: 'interactive',
            textContent: 'El Trigger estabiliza la imagen congelando la onda en el punto exacto donde cruza un umbral de voltaje prefijado. Sin Trigger correcto, la onda parece flotar descontrolada en la pantalla.'
          },
          {
            id: 'osc-m1-l3',
            title: 'Lección 1.3: Atenuadores 10:1 y 20:1: Protección del Canal contra Picos de Colapso Inductivo (Flyback > 300V)',
            duration: '25 min',
            type: 'video',
            textContent: 'Al desconectar la corriente de un solenoide o bobina de encendido, el colapso del campo magnético genera un pico de tensión inductiva invertida de hasta 400V. Conectar el osciloscopio directo sin atenuador a un canal calibrado a máximo 50V puede destruir la etapa de entrada.'
          }
        ],
        quiz: {
          id: 'q-osc-m1',
          title: 'Quiz Módulo 1: Controles de Osciloscopio',
          passingScore: 80,
          questions: [
            q('q-osc-1-1', '¿Por qué se requiere un atenuador pasivo 20:1 para medir la señal del primario de una bobina de encendido?', ['Para amplificar la señal pequeña de los sensores', 'Para reducir un pico inductivo de colapso magnético (Flyback) de hasta 400V a un nivel seguro para el canal del osciloscopio', 'Para convertir corriente en voltaje', 'Para limpiar el ruido de la batería'], 1, 'El pico de tensión generado por la bobina al abrir el transistor excede el límite de entrada directo de la mayoría de los osciloscopios USB/portátiles.')
          ]
        }
      },
      {
        id: 'osc-m2',
        title: 'Módulo 2: Diagnóstico con Pinza Amperimétrica de Baja Corriente (60A)',
        description: 'Análisis del perfil de corriente en inyectores de gasolina, diésel, bobinas COP y bombas de combustible.',
        lessons: [
          {
            id: 'osc-m2-l1',
            title: 'Lección 2.1: Principio de Efecto Hall en Pinzas de Corriente: Conversión de 10mV/A y 100mV/A',
            duration: '20 min',
            type: 'video',
            textContent: 'La pinza amperimétrica mide el campo magnético alrededor del cable sin necesidad de pelar ni interrumpir el circuito eléctrico.'
          },
          {
            id: 'osc-m2-l2',
            title: 'Lección 2.2: Detección del Punto de Apertura Mecánica de la Aguja del Inyector (Pintle Hump)',
            duration: '30 min',
            type: 'interactive',
            textContent: 'En la rampa de corriente ascendente de un inyector solenoide aparece una pequeña muesca o inflexión conocida como "Pintle Hump". Esta muesca confirma que la aguja se movió mecánicamente venciendo la presión de combustible y la fuerza del resorte.'
          }
        ],
        quiz: {
          id: 'q-osc-m2',
          title: 'Quiz Módulo 2: Pinza Amperimétrica de Baja Corriente',
          passingScore: 80,
          questions: [
            q('q-osc-2-1', '¿Qué confirma la presencia de la muesca "Pintle Hump" en la gráfica de rampa de corriente de un inyector?', ['Que la ECU está enviando 12V', 'Que la aguja interna del inyector se desplazó mecánicamente (abrió el paso de combustible)', 'Que la bomba de gasolina se apagó', 'Que el inyector está goteando'], 1, 'El movimiento mecánico del núcleo dentro del solenoide induce una fem opuesta que altera levemente la pendiente de la corriente, confirmando apertura física.')
          ]
        }
      }
    ]
  },

  // 13. Diagnóstico y Reparación de ECU / ECM / PCM
  {
    id: 'diagnostico-reparacion-ecu-automotriz',
    title: 'Diagnóstico Avanzado, Pruebas en Banco y Reparación de Módulos ECU / ECM',
    icon: '🖥️',
    category: 'ecu',
    categoryLabel: 'ECU y Módulos',
    description: 'Arquitectura interna de la computadora del motor, drivers de salida, fuentes de alimentación de 5V, lectura en banco (Bench / Boot / BDM) y clonación.',
    longDescription: 'Aprende a reparar y diagnosticar computadoras de motor a nivel de componentes electrónicos SMD. Domina la identificación de reguladores lineales de 5V, microprocesadores (TriCore, Renesas, PowerPC), transistores MOSFET e IGBT de encendido, memorias EEPROM y FLASH, así como la metodología de banqueo con simuladores de señales CKP/CMP.',
    objectives: [
      'Identificar los bloques funcionales clave dentro de la placa PCB de la ECU (Fuente de Alimentación, Procesador, Drivers, Interfaz de Entrada).',
      'Diagnosticar y reemplazar reguladores de voltaje de 5V quemados por cortocircuitos externos en sensores.',
      'Sustituir drivers de inyección de combustible y transistores IGBT de bobinas de encendido dañados.',
      'Efectuar clonación de memorias EEPROM / Flash mediante programadores de banco sin desoldar chips sensibles.'
    ],
    requirements: ['Electrónica Automotriz con Semiconductores', 'Manejo de Cautín, Estación de Aire Caliente SMD y Flujo de Soldadura'],
    learningOutcomes: ['Reparación de ECUs dañadas por inversión de polaridad o cortocircuitos en arnés.'],
    price: 299,
    duration: '10 Semanas (80 hrs)',
    level: 'Experto',
    status: 'PUBLISHED',
    systemId: 'sistema-gestion-motor',
    relatedVehicle: 'General (Bosch, Delphi, Continental, Denso, Magneti Marelli)',
    relatedCases: ['case-015-ecu-sin-5v', 'case-018-driver-inyector-quemado'],
    relatedLabs: ['lab-ecu-bench-testing', 'lab-eeprom-programmer'],
    recommendedAiMode: 'asistente',
    features: ['Diagramas de bancada (Pinouts de ECU)', 'Uso de programadores KTAG, KESS, VVDI, OBDStar', 'Prácticas de desoldadura y soldadura de integrados QFP/SOP'],
    instructor: 'Ing. Carlos Mendoza',
    rating: 4.98,
    reviewsCount: 520,
    modules: [
      {
        id: 'ecu-m1',
        title: 'Módulo 1: Arquitectura Interna de la ECU y Sección de Fuente de Poder (Power Supply)',
        description: 'Comprobación de diodos de protección contra inversión de polaridad, capacitores electrolíticos/tántalo y circuitos integrados de regulación.',
        lessons: [
          {
            id: 'ecu-m1-l1',
            title: 'Lección 1.1: El Regulador de Voltaje Interno de 5V (Vcc de Sensores y Microprocesador)',
            duration: '25 min',
            type: 'video',
            textContent: 'La ECU convierte los 12V-14V inestables del vehículo en una línea ultranave y regulada de 5.00V exactos. Si un sensor en el motor sufre un corto a masa, la línea de 5V cae a 0V, apagando el microprocesador o entrando en protección de sobrecorriente.'
          },
          {
            id: 'ecu-m1-l2',
            title: 'Lección 1.2: El Cristal Oscilador (Clock) y la Secuencia de Reseteo del Microprocesador',
            duration: '25 min',
            type: 'interactive',
            textContent: 'El cristal de cuarzo genera la frecuencia de reloj (ej. 4MHz, 16MHz, 40MHz) necesaria para que el microprocesador ejecute instrucciones. Con el osciloscopio en AC, debes medir una onda senoidal limpia en los dos extremos del cristal.'
          }
        ],
        quiz: {
          id: 'q-ecu-m1',
          title: 'Quiz Módulo 1: Fuente Interna de la ECU',
          passingScore: 80,
          questions: [
            q('q-ecu-1-1', '¿Qué sucede con la ECU si el cable de referencia de 5V de un sensor de presión MAP toca directamente el chasis (masa)?', ['La ECU se incendia inmediatamente', 'El regulador interno de 5V entra en protección por cortocircuito, colapsando el voltaje de 5V y haciendo que el motor se apague o no tenga comunicación con el escáner', 'El alternador deja de cargar', 'No pasa nada porque tiene fusible fusible'], 1, 'La pérdida de la línea de 5V desalimenta el resto de sensores y en muchos diseños apaga la lógica del microcontrolador.')
          ]
        }
      }
    ]
  },

  // 14. Inyección Electrónica de Gasolina GDI / PFI
  {
    id: 'inyeccion-gasolina-gdi-pfi',
    title: 'Sistemas de Inyección de Gasolina Avanzada: PFI e Inyección Directa GDI',
    icon: '⛽',
    category: 'gasoline',
    categoryLabel: 'Inyección Gasolina',
    description: 'Diagnóstico de bombas de alta presión conducidas por árbol de levas (HPFP), inyectores solenoidales y piezoeléctricos a 200 bar, y ajuste de combustible (Fuel Trim).',
    longDescription: 'Comprende el funcionamiento integral de la inyección directa de gasolina (GDI/FSI/EcoBoost/SIDI). Aprende a evaluar la bomba mecánica de alta presión con válvula dosificadora (QCV), inyectores operados con picos de voltaje elevado (Boost Voltage de 50V a 90V), análisis de mezclas ricas/pobres mediante STFT y LTFT en el escáner, y diagnóstico de depósitos de carbón en válvulas de admisión.',
    objectives: [
      'Diagnosticar fallas en el circuito de baja presión (3-5 bar) y alta presión (40-200 bar) en motores GDI.',
      'Analizar los valores de STFT (Short Term Fuel Trim) y LTFT (Long Term Fuel Trim) para corregir fugas de vacío y fallas de masa de aire.',
      'Evaluar la señal de pulso de inyección GDI con pico de aceleración de voltaje (Boost Voltage) y mantenimiento de corriente (Hold Current).',
      'Diagnosticar códigos de falla P0171 (System Too Lean) y P0172 (System Too Rich) de forma sistemática.'
    ],
    requirements: ['Diagnóstico con Osciloscopio', 'Electricidad Automotriz'],
    learningOutcomes: ['Resolución de problemas de titubeo en aceleración y baja presión de riel en motores GDI.'],
    price: 239,
    duration: '7 Semanas (50 hrs)',
    level: 'Intermedio',
    status: 'PUBLISHED',
    systemId: 'sistema-inyeccion',
    relatedVehicle: 'Gasolina GDI / PFI (VW FSI/TSI, Ford EcoBoost, GM Ecotec GDI)',
    relatedCases: ['case-007-gdi-baja-presion', 'case-011-fuel-trim-p0171'],
    relatedLabs: ['lab-gdi-waveform', 'lab-fuel-trim-analysis'],
    recommendedAiMode: 'diagnostico',
    features: ['Análisis de curvas de inyección GDI en osciloscopio', 'Desarme e inspección de Bombas HPFP', 'Estrategias de descarbonización de válvulas de admisión'],
    instructor: 'Ing. Alejandro Silva',
    rating: 4.94,
    reviewsCount: 380,
    modules: [
      {
        id: 'gdi-m1',
        title: 'Módulo 1: Arquitectura del Sistema de Alta Presión GDI (HPFP y Riel)',
        description: 'Funcionamiento de la bomba de alta presión de pistón conducida por excentricidad del árbol de levas y válvula reguladora de volumen.',
        lessons: [
          {
            id: 'gdi-m1-l1',
            title: 'Lección 1.1: De PFI a GDI: Ventajas Termodinámicas de la Inyección Directa en la Cámara de Combustión',
            duration: '20 min',
            type: 'video',
            textContent: 'Al inyectar gasolina directamente en el cilindro a más de 100 bar, el combustible se vaporiza instantáneamente absorbiendo calor de la cámara. Esta reducción de temperatura permite relaciones de compresión más altas sin provocar detonación o cascabeleo (Knock).'
          },
          {
            id: 'gdi-m1-l2',
            title: 'Lección 1.2: Control PWM de la Válvula Dosificadora de Combustible (Quantity Control Valve - QCV)',
            duration: '25 min',
            type: 'interactive',
            textContent: 'La ECU modula la válvula QCV mediante PWM sincronizado con la posición del árbol de levas para ajustar cuánto combustible entra al elemento de bombeo de la HPFP en cada carrera del pistón.'
          }
        ],
        quiz: {
          id: 'q-gdi-m1',
          title: 'Quiz Módulo 1: Bombas GDI HPFP',
          passingScore: 80,
          questions: [
            q('q-gdi-1-1', '¿Cuál es la presión típica de operación en el riel de inyección directa de gasolina (GDI) a ralentí y aceleración plena?', ['3 a 4 bar (45-60 PSI)', '30 a 200 bar (435 a 2900 PSI)', '1500 a 2000 bar', '0.5 a 1 bar'], 1, 'A diferencia de PFI (3-4 bar), GDI opera entre 30-40 bar en ralentí y supera los 150-200 bar en máxima carga.')
          ]
        }
      }
    ]
  },

  // 15. Inyección Diésel Common Rail y Sistemas Anti-Contaminación
  {
    id: 'inyeccion-diesel-common-rail-dpf',
    title: 'Sistemas de Inyección Diésel Common Rail y Control de Emisiones (DPF / EGR / SCR)',
    icon: '🚜',
    category: 'diesel',
    categoryLabel: 'Inyección Diésel',
    description: 'Diagnóstico de bombas CP1/CP3/CP4, inyectores diésel piezoeléctricos/solenoide hasta 2500 bar, regeneración de DPF, válvulas EGR y AdBlue/SCR.',
    longDescription: 'Especialización completa en motores diésel de alta tecnología. Aprende a evaluar el circuito de alta presión Common Rail, el estado del Sensor de Presión de Riel (RPS), la Válvula Reguladora de Presión (DRV/PCV) y de Caudal (MPROP/VCV), el retorno de inyectores en probetas graduadas, la saturación del Filtro de Partículas Diésel (DPF) con sensor de presión diferencial y el funcionamiento del sistema AdBlue/DEF con sensores de NOx.',
    objectives: [
      'Realizar pruebas de retorno de inyectores diésel Common Rail para identificar fugas internas excesivas.',
      'Diagnosticar la presión de riel en la fase de arranque (mínimo 250 bar requeridos para autorizar el encendido).',
      'Efectuar procedimientos de regeneración forzada de DPF con escáner y verificación de contrapresión de escape.',
      'Comprobar la válvula EGR y los circuitos del sistema de reducción catalítica selectiva SCR (AdBlue).'
    ],
    requirements: ['Osciloscopio Automotriz', 'Escáner de Diagnóstico Multimarca'],
    learningOutcomes: ['Diagnóstico de falta de arranque en caliente en motores diésel Common Rail.'],
    price: 279,
    duration: '9 Semanas (70 hrs)',
    level: 'Avanzado',
    status: 'PUBLISHED',
    systemId: 'sistema-inyeccion-diesel',
    relatedVehicle: 'Diésel Common Rail (Bosch, Delphi, Denso, Continental)',
    relatedCases: ['case-009-crdi-sin-arranque', 'case-014-dpf-saturado'],
    relatedLabs: ['lab-common-rail-pressure', 'lab-dpf-regen'],
    recommendedAiMode: 'diagnostico',
    features: ['Prueba práctica de retorno de inyectores con probetas', 'Procedimiento de codificación de inyectores IMA / IQA', 'Regeneración forzada de DPF en vivo'],
    instructor: 'Ing. Carlos Mendoza',
    rating: 4.95,
    reviewsCount: 390,
    modules: [
      {
        id: 'cr-m1',
        title: 'Módulo 1: Circuitos de Alta Presión Common Rail y Bombas de Alta Presión',
        description: 'Operación de bombas de pistón radiales (Bosch CP1, CP3, CP4) y lógica de presurización hasta 2500 bar.',
        lessons: [
          {
            id: 'cr-m1-l1',
            title: 'Lección 1.1: El Acumulador de Alta Presión (Riel Común) y la Lógica de Control de Presión',
            duration: '25 min',
            type: 'video',
            textContent: 'El riel actúa como un acumulador hidráulico que amortigua los pulsos de presión de la bomba. La ECU exige un mínimo de 200 a 250 bar durante la marcha de arranque antes de enviar el pulso de apertura a los inyectores.'
          },
          {
            id: 'cr-m1-l2',
            title: 'Lección 1.2: Diagnóstico del Sensor de Presión de Riel (RPS) y Válvula DRV / MPROP',
            duration: '30 min',
            type: 'interactive',
            textContent: 'El sensor RPS es un elemento piezoresistivo de 3 cables (5V, Masa, Señal). A 0 bar la señal mide aprox. 0.5V; a 250 bar mide aprox. 1.3V; a 1600 bar supera los 4.0V.'
          }
        ],
        quiz: {
          id: 'q-cr-m1',
          title: 'Quiz Módulo 1: Alta Presión Common Rail',
          passingScore: 80,
          questions: [
            q('q-cr-1-1', '¿Cuál es la presión mínima requerida en el riel de un motor diésel Common Rail para que la ECU autorice la inyección y el motor arranque?', ['10 bar', '50 bar', '200 a 250 bar (aprox. 3000-3600 PSI)', '1000 bar'], 2, 'Si la presión leída por el sensor de riel no alcanza los 200-250 bar durante el giro del motor de arranque, la ECU deshabilita los pulsos de los inyectores por seguridad.')
          ]
        }
      }
    ]
  }
];
