import { LabSimulation } from '../types';

export const LABS_DATA: LabSimulation[] = [
  {
    id: 'multimeter-lab',
    title: 'Laboratorio de Multímetro Digital Automotriz',
    type: 'multimeter',
    category: 'Instrumentación',
    componentName: 'Multímetro',
    description: 'Medición de Voltaje DC, caída de tensión bajo carga, resistencia NTC, continuidad y ciclo de trabajo PWM (Duty Cycle %).',
    objective: 'Dominar el uso del DMM automotriz para diagnosticar circuitos abiertos, altas resistencias de masa y caídas de voltaje en componentes energizados.',
    theory: 'El multímetro digital mide valores eficaces o promedio. En electrónica automotriz, para detectar una mala masa o corrosión en conectores, NUNCA se mide resistencia en frío, sino la CAÍDA DE TENSIÓN con el circuito operando bajo carga real.',
    instructions: [
      'Conecta la punta negra (COM) al borne negativo (-) de batería o masa de motor.',
      'Coloca la punta roja (V/Ω) en el punto de prueba del arnés o pin del sensor.',
      'Selecciona la función deseada: VDC, Ohmios (Ω), Continuidad (diodo) o Duty Cycle (%).',
      'Activa el consumidor eléctrico para verificar la caída de tensión bajo carga (máximo 100mV aceptable en masas).'
    ],
    activityChallenge: 'Mide la caída de tensión en el cable de masa del motor al arrancar. La batería entrega 12.6V en reposo. ¿Cuál es la caída máxima permitida en la masa?',
    expectedResult: 'Caída de tensión menor a 0.100V (100mV). Si supera 200mV existe resistencia parásita por sulfatación o cable fatigado.',
    xpReward: 120,
    referenceNote: 'Valores de Referencia Demostrativos Educativos conforme a Estándar SAE J1978.',
    quiz: [
      {
        id: 'q-multi-1',
        question: '¿Cuál es la forma correcta de comprobar la calidad de una masa de motor?',
        options: [
          'Medir resistencia en ohmios con el motor apagado y batería desconectada.',
          'Medir la caída de tensión en VDC entre la masa del motor y el polo (-) de la batería con el circuito funcionando.',
          'Conectar la lámpara de pruebas en serie entre el polo (+) y la masa.',
          'Medir el amperaje consumido colocando el multímetro en paralelo.'
        ],
        correctAnswer: 1,
        explanation: 'La caída de tensión bajo carga real revela altas resistencias parásitas que la medición de ohmios en frío no logra detectar.'
      },
      {
        id: 'q-multi-2',
        question: 'Si la batería marca 12.6V en reposo y baja a 10.2V durante el arranque, ¿cuál es el estado de la batería?',
        options: [
          'Batería destruida por cortocircuito interno.',
          'Totalmente normal, el voltaje de arranque no debe caer por debajo de 9.6V.',
          'Alternador averiado que no suministra carga.',
          'Masa de motor suelta.'
        ],
        correctAnswer: 1,
        explanation: 'Durante la alta demanda del motor de arranque, un voltaje igual o mayor a 9.6V indica una batería en buen estado de capacidad de descarga (CCA).'
      }
    ]
  },
  {
    id: 'oscilloscope-lab',
    title: 'Laboratorio de Osciloscopio Digital de 2/4 Canales',
    type: 'oscilloscope',
    category: 'Instrumentación',
    componentName: 'Osciloscopio',
    description: 'Análisis de oscilogramas en tiempo real: frecuencias de pulso, amplitud pico a pico, ruido inductivo y acoplamiento AC/DC.',
    objective: 'Configurar escala de tiempo (Time/Div), atenuador de voltaje (Volts/Div), nivel de disparo (Trigger) y tipo de acoplamiento para capturar señales rápidas.',
    theory: 'El osciloscopio dibuja la variación del voltaje (eje Y) respecto al tiempo (eje X). Es la única herramienta capaz de revelar micro-interrupciones, picos de sobretensión inductiva y desincronismos de microsegundos que un escáner o multímetro no registran.',
    instructions: [
      'Conecta la pinza de masa del canal CH1 al polo negativo de batería.',
      'Aplica la punta atenuadora 10X en el pin de señal del sensor/actuador.',
      'Selecciona el nivel de Trigger en flanco ascendente (Rising Edge) para estabilizar la imagen en pantalla.',
      'Ajusta Time/Div según la velocidad de la señal (ej. 1ms para CAN Bus, 10ms para CKP/CMP, 20ms para O2).'
    ],
    activityChallenge: 'Ajusta la escala a 2V/Div y 5ms/Div. Visualiza el pico de sobretensión de colapso magnético en la bobina de encendido. ¿Cuál es el pico esperado en el primario?',
    expectedResult: 'Sobretensión inductiva de colapso entre 300V y 400V en el secundario/primario atenuado.',
    xpReward: 150,
    referenceNote: 'Valores de Referencia Demostrativos Educativos.',
    quiz: [
      {
        id: 'q-osc-1',
        question: '¿Qué sucede si mides el primario de una bobina de encendido sin punta atenuadora 10X o 20X?',
        options: [
          'La señal se lee con mayor precisión de decimales.',
          'El pico de inducción de 350V puede dañar el canal de entrada del osciloscopio si su límite es 50V.',
          'El osciloscopio invierte la polaridad automáticamente.',
          'La escala de tiempo se congela.'
        ],
        correctAnswer: 1,
        explanation: 'El colapso del campo magnético genera picos de sobretensión inductiva (Back-EMF) que superan los límites seguros de entrada sin atenuador.'
      }
    ]
  },
  {
    id: 'ckp-lab',
    title: 'Laboratorio de Sensor CKP (Posición del Cigüeñal)',
    type: 'oscilloscope',
    category: 'Sensores',
    componentName: 'CKP',
    description: 'Simulación de sensor CKP Inductivo (generador de frecuencia VR) vs CKP Efecto Hall (onda cuadrada digital) en Rueda Fónica 60-2 o 36-1.',
    objective: 'Diferenciar las señales analógicas inductivas de las digitales Hall y diagnosticar dientes faltantes para la sincronización del PMS (Punto Muerto Superior).',
    theory: 'El sensor CKP indica a la ECU las RPM exactas y la posición del cigüeñal. El sensor inductivo genera su propio voltaje alterno (VAC) proporcional a las RPM. El sensor Hall requiere alimentación (5V o 12V) y entrega una onda cuadrada digital.',
    instructions: [
      'Varía las RPM de 750 a 4000 RPM para observar el aumento de voltaje pico a pico en el CKP Inductivo.',
      'Cambia a CKP Hall y observa cómo la amplitud de voltaje (0-5V) se mantiene constante sin importar las RPM.',
      'Identifica el hueco del diente faltante (espacio de sincronización del cilindro N° 1).'
    ],
    activityChallenge: 'Simula un diente roto en la rueda fónica a 2500 RPM. Identifica la distorsión del oscilograma.',
    expectedResult: 'Aparición de un pulso nulo o distorsión anormal que causa código P0335 / P0336 y corte de encendido.',
    xpReward: 140,
    referenceNote: 'Valores de Referencia Demostrativos Educativos.',
    quiz: [
      {
        id: 'q-ckp-1',
        question: '¿Cómo varía la señal de un sensor CKP Inductivo a medida que aumentan las RPM del motor?',
        options: [
          'Aumenta la frecuencia pero el voltaje permanece fijo en 5V.',
          'Aumentan tanto la frecuencia como el voltaje pico a pico (Vpp).',
          'El voltaje disminuye a cero por resistencia interna.',
          'La señal pasa de onda cuadrada a senoidal.'
        ],
        correctAnswer: 1,
        explanation: 'Al ser un generador de reluctancia variable, a mayor velocidad angular de la rueda fónica se genera mayor ley de Faraday (mayor Vpp y mayor Hz).'
      }
    ]
  },
  {
    id: 'cmp-lab',
    title: 'Laboratorio de Sensor CMP (Posición del Árbol de Levas)',
    type: 'oscilloscope',
    category: 'Sensores',
    componentName: 'CMP',
    description: 'Análisis de señal CMP Hall y correlación de sincronismo CKP + CMP en motores con distribución variable (VVT / VANOS).',
    objective: 'Evaluar el sincronismo relativo entre el árbol de levas y el cigüeñal para diagnosticar cadenas estiradas o saltos de diente de distribución.',
    theory: 'El sensor CMP informa el avance de la fase de admisión/escape respecto al ciclo de cuatro tiempos (360° de levas por 720° de cigüeñal). Permite la inyección secuencial en la fase de admisión correcta.',
    instructions: [
      'Superpón la señal CKP en Canal 1 y CMP en Canal 2.',
      'Activa el solenoide VVT para observar el desfase angular de la señal CMP respecto a la ventana del CKP.',
      'Verifica la presencia de código P0011 / P0016 cuando existe desalineación.'
    ],
    activityChallenge: 'Comprueba el desfasaje de señal CMP al correr 1 diente de la cadena de tiempo.',
    expectedResult: 'El flanco del CMP se desplaza más de 10° respecto al diente de referencia del CKP, registrando DTC P0016.',
    xpReward: 140,
    referenceNote: 'Valores de Referencia Demostrativos Educativos.',
    quiz: [
      {
        id: 'q-cmp-1',
        question: '¿Qué código de falla indica directamente falta de correlación angular entre CKP y CMP?',
        options: [
          'P0171 - Mezcla Pobre',
          'P0016 - Crankshaft Position - Camshaft Position Correlation',
          'P0300 - Misfire Múltiple',
          'U0100 - Pérdida de Comunicación'
        ],
        correctAnswer: 1,
        explanation: 'El código P0016 es el estándar OBD-II que alerta cuando la computadora detecta desfasaje físico entre la posición del cigüeñal y del árbol de levas.'
      }
    ]
  },
  {
    id: 'tps-lab',
    title: 'Laboratorio de Sensor TPS (Posición de Mariposa)',
    type: 'sensor_sim',
    category: 'Sensores',
    componentName: 'TPS',
    description: 'Prueba de potenciómetro lineal de acelerador (0.5V a 4.5V) y sistemas de doble pista de seguridad en cuerpo de aceleración electrónico (ETB).',
    objective: 'Detectar zonas de pista desgastadas (micro-cortes de voltaje) que producen tirones al acelerar y activar el modo de emergencia (Limp Mode).',
    theory: 'El sensor TPS mide la apertura de la mariposa. En sistemas Drive-by-Wire modernos, posee dos pistas con señales inversas o desfasadas (TPS 1 de 0.5V a 4.5V y TPS 2 de 4.5V a 0.5V) para que la ECU valide la veracidad de la lectura.',
    instructions: [
      'Mueve el pedal de aceleración progresivamente de 0% a 100%.',
      'Observa la curva de voltaje de TPS 1 subiendo linealmente de 0.5V a 4.5V.',
      'Analiza la curva complementaria de TPS 2 descendiendo de 4.5V a 0.5V.',
      'Simula una grieta de carbón en el potenciómetro para ver la caída momentánea a 0V.'
    ],
    activityChallenge: 'Identifica el ruido parásito en el TPS al 35% de apertura. ¿Qué código genera la ECU?',
    expectedResult: 'Registro de DTC P0121 / P0221 por inconsistencia entre pista 1 y pista 2.',
    xpReward: 130,
    referenceNote: 'Valores de Referencia Demostrativos Educativos.',
    quiz: [
      {
        id: 'q-tps-1',
        question: '¿Por qué los cuerpos de aceleración electrónicos utilizan dos sensores TPS en lugar de uno solo?',
        options: [
          'Para medir la temperatura de la mariposa.',
          'Por redundancia de seguridad (fail-safe): si una pista falla o discrepa, la ECU entra en modo de protección (Limp Mode).',
          'Para alimentar el pedal del acelerador con 12V.',
          'Para duplicar la velocidad de respuesta de la computadora.'
        ],
        correctAnswer: 1,
        explanation: 'Al no existir cable mecánico hacia la mariposa, la redundancia de doble pista evita aceleraciones no deseadas ante un fallo de potenciómetro.'
      }
    ]
  },
  {
    id: 'map-lab',
    title: 'Laboratorio de Sensor MAP (Presión Múltiple de Admisión)',
    type: 'sensor_sim',
    category: 'Sensores',
    componentName: 'MAP',
    description: 'Análisis de sensor MAP analógico (piezorresistivo 1.0V en ralentí - 4.5V en plena carga) y sensores MAP de salida digital por frecuencia.',
    objective: 'Relacionar el vacío del motor (inHg / kPa) con el voltaje de salida del MAP para calcular la carga del motor y el avance de chispa.',
    theory: 'El sensor MAP mide la presión absoluta dentro del múltiple de admisión. A alto vacío (ralentí, ~18-22 inHg) el voltaje es bajo (~1.0V a 1.3V). Al acelerar a fondo (WOT, presión atmosférica ~100 kPa) el voltaje sube a ~4.0V-4.5V.',
    instructions: [
      'Aplica vacío con la bomba Mityvac al racor del sensor MAP.',
      'Observa cómo al aumentar el vacío simulado (0 a 20 inHg), el voltaje de salida disminuye.',
      'Compara la lectura con la presión barométrica de referencia (BAP).'
    ],
    activityChallenge: 'Simula una fuga de vacío en la junta del múltiple. ¿Qué sucede con el voltaje del MAP en ralentí?',
    expectedResult: 'El vacío cae (presión sube) y el MAP entrega 2.2V en ralentí en lugar de 1.2V, enriqueciendo la mezcla (P0171 / P0106).',
    xpReward: 130,
    referenceNote: 'Valores de Referencia Demostrativos Educativos.',
    quiz: [
      {
        id: 'q-map-1',
        question: 'En un motor atmosférico en ralentí a nivel del mar con un buen vacío (~20 inHg), ¿qué voltaje aproximado se espera en la señal del sensor MAP?',
        options: [
          '4.8V VDC',
          '1.0V a 1.4V VDC',
          '0.0V VDC',
          '12.0V VDC'
        ],
        correctAnswer: 1,
        explanation: 'En ralentí el alto vacío reduce la presión absoluta en el múltiple a ~30-35 kPa, resultando en un voltaje bajo de salida (~1.0V - 1.4V).'
      }
    ]
  },
  {
    id: 'maf-lab',
    title: 'Laboratorio de Sensor MAF (Flujo de Masa de Aire)',
    type: 'sensor_sim',
    category: 'Sensores',
    componentName: 'MAF',
    description: 'Diagnóstico de sensor de hilo caliente / película caliente en gramos/segundo (g/s) y curva de respuesta dinámica a aceleraciones rápidas.',
    objective: 'Evaluar el flujo de aire medido en g/s (regla de oro: g/s aproximados en ralentí = cilindrada en litros) y detectar contaminación del hilo térmico.',
    theory: 'El MAF mide directamente la masa de aire que entra al motor pasando corriente por un hilo caliente que se mantiene a temperatura constante (~200°C sobre ambiente). El aire circulante lo enfria y el circuito eleva la corriente/voltaje para compensarlo.',
    instructions: [
      'Verifica la lectura en ralentí de un motor 1.6L (~1.6 g/s o 1.2V a 1.4V).',
      'Realiza un acelerón rápido (Snap Throttle) y observa el pico de respuesta (>4.0V o >50 g/s).',
      'Simula suciedad de aceite en el elemento sensor para medir el retardo de señal.'
    ],
    activityChallenge: 'Un motor 2.0L marca 0.8 g/s en ralentí. ¿Cuál es el diagnóstico?',
    expectedResult: 'Sensor MAF contaminado o defectuoso que mide menos aire del real, generando DTC P0171 (Mezcla Pobre).',
    xpReward: 135,
    referenceNote: 'Valores de Referencia Demostrativos Educativos.',
    quiz: [
      {
        id: 'q-maf-1',
        question: '¿Cuál es la regla práctica para estimar el flujo de aire normal en gramos/segundo (g/s) de un motor a temperatura normal en ralentí?',
        options: [
          'Aproximadamente igual al cilindraje del motor en litros (Ej. Motor 2.0L ≈ 2.0 g/s).',
          'Siempre debe ser constante en 10 g/s para todos los motores.',
          'Igual a la presión de los neumáticos.',
          'Igual a las RPM divididas por 100.'
        ],
        correctAnswer: 0,
        explanation: 'Como norma de diagnóstico rápido, un motor de 1.5L saludable debe marcar cerca de 1.5 g/s a 1.8 g/s en ralentí estable.'
      }
    ]
  },
  {
    id: 'ect-lab',
    title: 'Laboratorio de Sensor ECT (Temperatura del Refrigerante)',
    type: 'sensor_sim',
    category: 'Sensores',
    componentName: 'ECT',
    description: 'Curva de resistencia NTC (Coeficiente de Temperatura Negativo) y conmutación de rango de resistencia en ECU para alta precisión.',
    objective: 'Diagnosticar sensores ECT descalibrados que impiden el enriquecimiento en frío o la activación del electroventilador.',
    theory: 'En un termistor NTC, a medida que la temperatura AUMENTA, la resistencia interna DISMINUYE. En frío (-10°C) la resistencia es alta (~7,000Ω, 4.0V), mientras que a temperatura normal (90°C) baja a ~200Ω-300Ω (0.5V-0.8V).',
    instructions: [
      'Simula el calentamiento del motor desde 20°C hasta 95°C.',
      'Grafica la caída de voltaje en la señal de ECT.',
      'Observa el salto brusco de voltaje cuando la ECU conmuta la resistencia interna Pull-Up para ampliar la resolución a altas temperaturas.'
    ],
    activityChallenge: 'Comprueba el sensor ECT pegado en 20°C constantes con el motor caliente a 90°C.',
    expectedResult: 'Mezcla excesivamente rica en caliente, humo negro, ahogamiento y DTC P0117 / P0118.',
    xpReward: 125,
    referenceNote: 'Valores de Referencia Demostrativos Educativos.',
    quiz: [
      {
        id: 'q-ect-1',
        question: 'En un sensor de temperatura de refrigerante de tipo NTC, ¿qué sucede con el voltaje de señal al calentarse el motor?',
        options: [
          'El voltaje sube hasta 12V.',
          'El voltaje disminuye gradualmente hacia valores inferiores a 1.0V.',
          'El voltaje se convierte en onda cuadrada.',
          'El voltaje se mantiene en 5.0V fijos.'
        ],
        correctAnswer: 1,
        explanation: 'Al ser NTC, al subir la temperatura baja la resistencia, derivando más corriente a masa a través del divisor de tensión y bajando el voltaje de señal.'
      }
    ]
  },
  {
    id: 'o2-lab',
    title: 'Laboratorio de Sensor O2 / Sonda Lambda (Zirconio & Banda Ancha A/F)',
    type: 'sensor_sim',
    category: 'Sensores',
    componentName: 'O2',
    description: 'Comparativa de Sonda Lambda de Zirconio Convencional (0.1V a 0.9V) vs Sensor de Relación Aire/Combustible Banda Ancha A/F (2.2V - 3.8V / mA).',
    objective: 'Interpretar el tiempo de respuesta (frecuencia de conmutación de rico a pobre en <100ms) y la corriente de bombeo en sensores de banda ancha.',
    theory: 'La sonda de zirconio commuta entre 0.1V (pobre, exceso O2) y 0.9V (rico, falta O2) centrada en lambda = 1.00 (0.45V). El sensor A/F mide el valor lambda exacto (de 10:1 a 20:1) variando la corriente de la celda de bombeo en microamperios (µA).',
    instructions: [
      'Induce una mezcla rica rociando combustible en la admisión y observa el salto inmediato a 0.85V en sonda Zirconio.',
      'Induce mezcla pobre desconectando una manguera de vacío y observa la caída a 0.10V.',
      'Comprueba el funcionamiento del calefactor del sensor (HTR) verificando la resistencia de la bobina interna (3Ω a 15Ω).'
    ],
    activityChallenge: 'Evalúa la frecuencia de oscilación de la sonda pre-catalizador a 2000 RPM.',
    expectedResult: 'Mínimo 8 a 10 conmutaciones por cada 10 segundos. Una sonda lenta o agotada genera DTC P0133.',
    xpReward: 145,
    referenceNote: 'Valores de Referencia Demostrativos Educativos.',
    quiz: [
      {
        id: 'q-o2-1',
        question: '¿Qué voltaje entrega una sonda de oxígeno de Zirconio convencional cuando la mezcla de aire/combustible es rica?',
        options: [
          '0.1V a 0.2V VDC',
          '0.8V a 0.9V VDC',
          '2.5V VDC fijos',
          '-0.5V VDC'
        ],
        correctAnswer: 1,
        explanation: 'Una diferencia alta de concentración de oxígeno entre los gases de escape y el aire exterior genera una diferencia de potencial galvánico cercana a 0.9V (mezcla rica).'
      }
    ]
  },
  {
    id: 'relay-circuit-lab',
    title: 'Laboratorio de Relés & Circuitos de Potencia Automotriz',
    type: 'relay_circuit',
    category: 'Actuadores',
    componentName: 'Relés',
    description: 'Prueba de relés ISO estándar de 4 y 5 pines (Pines 30, 85, 86, 87, 87a), caída de tensión en platinos y diodo o resistencia de supresión de pico.',
    objective: 'Comprender el principio de conmutación electromagnética para controlar altos amperajes (bombas, electros, faros) mediante bajas corrientes de ECU.',
    theory: 'Un relé separa el circuito de mando (bobina 85-86, consumo ~150mA) del circuito de potencia (contactos 30-87, soporta 30A-40A). La corrosión en los platinos del pin 87 genera caída de tensión bajo carga.',
    instructions: [
      'Alimenta los pines 85 y 86 de la bobina con 12V para escuchar el chasquido de conmutación (Click Test).',
      'Mide la resistencia de la bobina interna (debe marcar entre 60Ω y 120Ω).',
      'Mide la caída de tensión entre el pin 30 (entrada de batería) y el pin 87 (salida a la carga) con el relé activado.'
    ],
    activityChallenge: 'Detecta los platinos fogueados de un relé de bomba de combustible.',
    expectedResult: 'Caída de tensión entre pin 30 y 87 mayor a 0.250V (250mV) indica platinos carbonizados.',
    xpReward: 125,
    referenceNote: 'Valores de Referencia Demostrativos Educativos.',
    quiz: [
      {
        id: 'q-relay-1',
        question: 'En un relé automotriz ISO de 4 pines, ¿qué números identifican la bobina de control?',
        options: [
          'Pines 30 y 87',
          'Pines 85 y 86',
          'Pines 87 y 87a',
          'Pines 1 y 2'
        ],
        correctAnswer: 1,
        explanation: 'Los pines 85 y 86 corresponden electromagnéticamente a los extremos de la bobina del electroimán.'
      }
    ]
  },
  {
    id: 'canbus-lab',
    title: 'Laboratorio de Red CAN Bus & Resistencia Terminadora',
    type: 'canbus',
    category: 'Redes',
    componentName: 'CAN Bus',
    description: 'Análisis de bus de datos diferencial CAN High / CAN Low (500 kbps), nivel de voltaje recesivo (2.5V) y dominante (3.5V / 1.5V).',
    objective: 'Diagnosticar problemas de capa física en la red CAN mediante mediciones de impedancia en los pines 6 y 14 del conector DLC OBD-II.',
    theory: 'La red CAN HS utiliza transmisión diferencial equilibrada para inmunidad al ruido electromagnético. La red cuenta con dos resistencias terminadoras de 120Ω en paralelo (en la ECU de Motor y Cuadro de Instrumentos), arrojando 60Ω en el conector DLC.',
    instructions: [
      'Mide la resistencia con batería desconectada entre Pin 6 (CAN H) y Pin 14 (CAN L) en el DLC.',
      'Simula la desconexión de una ECU con resistencia de término para ver la lectura subir de 60Ω a 120Ω.',
      'Simula un cortocircuito entre CAN H y Masa para observar el colapso del bus (Bus Off / DTC U0100).'
    ],
    activityChallenge: 'Diagnostica la red con impedancia de 120Ω entre pines 6 y 14.',
    expectedResult: 'Una de las dos resistencias terminadoras de 120Ω está desconectada o la línea del bus está abierta.',
    xpReward: 150,
    referenceNote: 'Valores de Referencia Demostrativos Educativos.',
    quiz: [
      {
        id: 'q-can-1',
        question: '¿Cuál es el valor de resistencia normal esperado entre los pines 6 (CAN High) y 14 (CAN Low) del DLC con la batería desconectada en un sistema CAN C estándar?',
        options: [
          '0 Ω (Cortocircuito)',
          '60 Ω (Dos resistencias de 120Ω en paralelo)',
          '120 Ω (Una sola resistencia)',
          'Infinito / Circuito abierto'
        ],
        correctAnswer: 1,
        explanation: 'Las dos resistencias de cierre de 120Ω montadas en los nodos extremos de la red quedan eléctricamente en paralelo, arrojando 60Ω en la medición.'
      }
    ]
  },
  {
    id: 'obd2-scanner-lab',
    title: 'Laboratorio de OBD-II y Protocolos de Escáner',
    type: 'obd2_scanner',
    category: 'Diagnóstico',
    componentName: 'OBD-II',
    description: 'Identificación de pinout del conector DLC J1962, Modos de Diagnóstico OBD-II (Modo 01 al Modo 0A), lectura de Freeze Frame y PIDs en tiempo real.',
    objective: 'Masterizar el puerto DLC OBD-II: Pin 16 B+, Pins 4 y 5 Masas, Pin 6/14 CAN Bus, e interpretar cuadros congelados (Freeze Frame) ante fallos de emisión.',
    theory: 'El estándar OBD-II exige el conector de 16 pines J1962. El Modo $01 muestra datos en vivo; Modo $02 captura la foto fija de cuando ocurrió el código (Freeze Frame); Modo $03 lee DTCs guardados; Modo $06 muestra monitores fuera de tolerancia.',
    instructions: [
      'Identifica los voltajes de alimentación en el puerto DLC antes de conectar el escáner.',
      'Accede al Modo $02 (Freeze Frame) para analizar a qué RPM, temperatura y velocidad se registró el DTC.',
      'Monitorea el estado de los monitores I/M (Readiness Monitors) para la inspección técnica vehicular.'
    ],
    activityChallenge: 'Verifica la masa del Pin 4 (Masa de Chasis) respecto al Pin 5 (Masa de Señal ECU).',
    expectedResult: 'Ambos pines deben presentar continuidad a masa (<0.050V de caída de tensión) para alimentar correctamente la interface VCI.',
    xpReward: 135,
    referenceNote: 'Valores de Referencia Demostrativos Educativos.',
    quiz: [
      {
        id: 'q-obd-1',
        question: 'En el conector OBD-II DLC J1962 de 16 pines, ¿qué posición ocupa el pin de alimentación positiva B+ de batería?',
        options: [
          'Pin 1',
          'Pin 16',
          'Pin 4',
          'Pin 6'
        ],
        correctAnswer: 1,
        explanation: 'El Pin 16 suministra corriente B+ constante de 12V protegida por fusible para energizar los escáneres y VCIs.'
      }
    ]
  },
  {
    id: 'ecu-bench-lab',
    title: 'Laboratorio de Prueba de Banco de ECU & Módulos',
    type: 'ecu_bench',
    category: 'Electrónica',
    componentName: 'ECU',
    description: 'Banquear computadoras automotrices: líneas de alimentación B+, Ignición (+15), Masas de Potencia PGND, Masa de Señal SGND y Fuente Regulatoria VREF de 5.0V.',
    objective: 'Aprender a energizar una ECU en mesa de trabajo sin el vehículo para diagnósticos de comunicación, lectura de eeprom/micro y prueba de drivers.',
    theory: 'Una ECU requiere sus tierras de potencia (PGND), sus tierras de señal (SGND), su positivo directo (B+30) y su positivo de llave (+15). Si la fuente interna de la ECU falla, el regulador no entregará los 5.00V exactos de VREF a los sensores.',
    instructions: [
      'Conecta el arnés de prueba a la fuente regulada de 12.8V.',
      'Energiza B+ (Pin 30) e Ignición (Pin 15).',
      'Mide la salida VREF de 5.0V en los pines de alimentación de sensores de la ECU.',
      'Verifica si el microprocesador inicia el pulso de control del relé principal (ASD / Main Relay Ground).'
    ],
    activityChallenge: 'Diagnostica una ECU que entrega 2.1V en VREF en lugar de 5.0V.',
    expectedResult: 'Regulador interno quemado o cortocircuito parásito en capacitor de filtrado de la placa.',
    xpReward: 160,
    referenceNote: 'Valores de Referencia Demostrativos Educativos.',
    quiz: [
      {
        id: 'q-ecu-1',
        question: 'Si al energizar la ECU en banco la salida de voltaje de referencia VREF marca 0.2V en lugar de 5.0V y la ECU se calienta en exceso, ¿cuál es la causa probable?',
        options: [
          'Microprocesador desprogramado.',
          'Cortocircuito interno a masa en la línea de VREF o diodo de protección en corto.',
          'Falta de líquido refrigerante en la mesa.',
          'El escáner no es compatible.'
        ],
        correctAnswer: 1,
        explanation: 'Un cortocircuito a masa en VREF sobrecarga el regulador integrado de 5V provocando sobrecalentamiento y colapso del voltaje.'
      }
    ]
  },
  {
    id: 'sensor-sim-lab',
    title: 'Laboratorio de Clasificación de Sensores Automotrices',
    type: 'sensor_sim',
    category: 'Sensores',
    componentName: 'Sensores',
    description: 'Análisis integrado de la arquitectura de sensores: Pasivos (no requieren alimentación, generan señal) vs Activos (requieren VREF / 12V y masa).',
    objective: 'Identificar la familia de cada sensor por su arnés (2 pines, 3 pines, 4 pines o 6 pines) y sus métodos de comprobación rápida.',
    theory: 'Los sensores transforman magnitudes físicas (temperatura, presión, posición, aceleración, composición química) en señales eléctricas comprensibles para el convertidor analógico-digital (ADC) de la ECU.',
    instructions: [
      'Selecciona el sensor a probar (EGR, Knock Sensor, Acelerómetro, Presión de Riel GDI).',
      'Mide la respuesta dinámica según su tipo de transductor piezorresistivo, piezoeléctrico o capacitivo.'
    ],
    activityChallenge: 'Comprueba un sensor de picado (Knock Sensor Piezoeléctrico) golpeando suavemente con el maneral de una llave.',
    expectedResult: 'Aparición de pequeñas crestas de voltaje de corriente alterna (mVAC) por el efecto piezoeléctrico del cristal.',
    xpReward: 130,
    referenceNote: 'Valores de Referencia Demostrativos Educativos.',
    quiz: [
      {
        id: 'q-sens-1',
        question: '¿Qué tipo de señal eléctrica genera un sensor piezoeléctrico de detonación (Knock Sensor) al detectar vibración/pistoneo?',
        options: [
          'Señal de corriente directa fija de 12V.',
          'Picos de voltaje alterno (VAC) proporcionales a la frecuencia del golpeteo.',
          'Onda de pulso digital CAN Bus.',
          'Resistencia fija de 1000Ω.'
        ],
        correctAnswer: 1,
        explanation: 'El cristal piezoeléctrico genera cargas eléctricas en forma de pequeños picos de VAC ante deformaciones mecánicas o vibraciones del bloque.'
      }
    ]
  },
  {
    id: 'actuator-sim-lab',
    title: 'Laboratorio de Actuadores & Control PWM de Potencia',
    type: 'actuator_sim',
    category: 'Actuadores',
    componentName: 'Actuadores',
    description: 'Diagnóstico de inyectores de gasolina PFI/GDI, válvulas solenoide VVT, electroválvula de purga cánister EVAP y servomotor de mariposa.',
    objective: 'Evaluar el control por ciclo de trabajo (PWM Duty Cycle %) y modulación por ancho de pulso desde los transistores MOSFET / IGBT de la ECU.',
    theory: 'Los actuadores convierten las órdenes eléctricas de la ECU en trabajo mecánico o térmico. La ECU conmuta la masa del actuador con una frecuencia fija y varía el ancho del pulso en porcentaje (Duty Cycle) para regular el flujo o presión.',
    instructions: [
      'Aumenta el Duty Cycle del solenoide VVT del 10% al 80% y observa el aumento de la presión hidráulica de aceite.',
      'Analiza el pico de colapso inductivo (Flyback Voltage) al apagar el solenoide.',
      'Simula el tiempo de inyección (Injection Pulse Width) de un inyector en milisegundos (ms).'
    ],
    activityChallenge: 'Mide el tiempo de inyección en ralentí para un inyector PFI.',
    expectedResult: 'Tiempo normal de apertura entre 1.8ms y 2.8ms a temperatura de trabajo.',
    xpReward: 140,
    referenceNote: 'Valores de Referencia Demostrativos Educativos.',
    quiz: [
      {
        id: 'q-act-1',
        question: 'Si la ECU conmuta a masa un solenoide con una señal PWM con Duty Cycle del 25% a 12V, ¿cuál es el voltaje promedio que leerá un multímetro digital en VDC?',
        options: [
          '12.0V VDC',
          'Aproximadamente 9.0V VDC en el pin de control (12V * (1 - 0.25))',
          '0.0V VDC',
          '24.0V VDC'
        ],
        correctAnswer: 1,
        explanation: 'Dado que la ECU conmuta a masa durante el 25% del tiempo, el terminal permanece a 12V durante el 75% del ciclo, resultando en 9.0V promedio.'
      }
    ]
  }
];
