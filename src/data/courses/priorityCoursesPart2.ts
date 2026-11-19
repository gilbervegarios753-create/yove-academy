import { Course } from '../../types';

const q = (id: string, question: string, options: string[], correctAnswer: number, explanation: string) => ({
  id, question, options, correctAnswer, explanation
});

export const PRIORITY_COURSES_PART2: Course[] = [
  // 8. Diagnóstico CKP/CMP
  {
    id: 'diagnostico-ckp-cmp-sincronismo',
    title: 'Diagnóstico Profesional de Sensores CKP y CMP: Sincronismo Electrónico',
    icon: '⚡',
    category: 'sensors',
    categoryLabel: 'Sensores Automotrices',
    description: 'Análisis profundo de sensores de cigüeñal y árbol de levas. Detección de fallas de sincronismo, entrehierro y ruedas fónicas.',
    longDescription: 'Especialización en el sistema de correlación de posición de motor. Domina la captura de ondas CKP/CMP inductivas, Hall y ópticas en sistemas con distribución fija y traslape variable VVT.',
    objectives: [
      'Identificar de inmediato discrepancias de tiempo de encendido y correlación CKP/CMP.',
      'Analizar de forma práctica patrones de rueda fónica de 36-1, 60-2 y configuraciones especiales OEM.',
      'Diagnosticar fallas de arranque en frío o apagado térmico por dilatación en sensores inductivos.'
    ],
    requirements: ['Osciloscopio Automotriz', 'Electricidad Básica'],
    learningOutcomes: ['Resolución de códigos P0335, P0340, P0011, P0016 en menos de 30 minutos'],
    price: 219,
    duration: '6 Semanas (45 hrs)',
    level: 'Intermedio',
    status: 'PUBLISHED',
    systemId: 'sistema-inyeccion',
    relatedVehicle: 'General (Gasolina / Diésel)',
    relatedCases: ['case-003-ckp-intermitente'],
    relatedLabs: ['lab-oscilloscope-signals'],
    recommendedAiMode: 'diagnostico',
    features: ['Librería de patrones de rueda fónica OEM', 'Casos de estudio de código P0016', 'Superposición de señales en osciloscopio'],
    instructor: 'Ing. Alejandro Silva',
    rating: 4.93,
    reviewsCount: 290,
    modules: [
      {
        id: 'ckp-m1',
        title: 'Módulo 1: Arquitectura de Sensores CKP Inductivos vs Hall',
        description: 'Construcción interna, imán permanente, núcleos de hierro dulce y circuitos de entrada en la ECU.',
        lessons: [
          { id: 'ckp-m1-l1', title: 'Lección 1.1: Física del Sensor Inductivo CKP: Cruce por Cero (Zero Crossing) y Vpp', duration: '20 min', type: 'video' },
          { id: 'ckp-m1-l2', title: 'Lección 1.2: Sensor Hall de Cigüeñal: Schmitt Trigger e Inmunidad a Ruido', duration: '25 min', type: 'interactive' },
          { id: 'ckp-m1-l3', title: 'Lección 1.3: Análisis de Ruedas Fónicas 60-2 (Bosch Motronic) y 36-1 (Ford EDIS)', duration: '25 min', type: 'video' },
          { id: 'ckp-m1-l4', title: 'Lección 1.4: Práctica: Diagnóstico de Falta de Señal CKP por Resistencia Térmica Elevada', duration: '30 min', type: 'interactive' }
        ],
        quiz: {
          id: 'q-ckp-m1',
          title: 'Quiz Módulo 1: Tipos de CKP',
          passingScore: 80,
          questions: [
            q('q-ckp-1-1', '¿Qué indica el espacio equivalente a 2 dientes faltantes en una rueda fónica de 60-2 dientes?', ['Una falla de fabricación', 'El punto de referencia angular absoluto (TDC / PMI) para que la ECU identifique la posición del cigüeñal', 'El lugar donde va el aceite', 'El punto de corte de RPM'], 1, 'La ventana amplia creada por los dientes faltantes genera una señal distintiva que sincroniza el conteo angular de la ECU.'),
            q('q-ckp-1-2', 'Un sensor CKP inductivo muestra 900 Ω a 20°C. Al calentarse el motor a 90°C la resistencia sube a 15,000 Ω y el motor se apaga. ¿Cuál es el problema?', ['El aceite está viejo', 'Falla de dilatación térmica interna en el devanado de cobre del sensor (circuito abierto caliente)', 'Falta fusible', 'Ecu dañada'], 1, 'Los sensores inductivos fatigados abren su bobinado interno al dilatarse con el calor del bloque apangando el motor.')
          ]
        }
      },
      {
        id: 'ckp-m2',
        title: 'Módulo 2: Sensores CMP de Árbol de Levas y Sincronismo VVT',
        description: 'Sensores de levas en admisión y escape, marcas de referencia múltiples y variadores hidráulicos.',
        lessons: [
          { id: 'ckp-m2-l1', title: 'Lección 2.1: Sensores CMP de Un Solo Diente vs Sensores de Ventanas Múltiples Inequidistantes', duration: '25 min', type: 'video' },
          { id: 'ckp-m2-l2', title: 'Lección 2.2: Lógica de Identificación de Cilindro en Fase de Compresión vs Escape', duration: '25 min', type: 'interactive' },
          { id: 'ckp-m2-l3', title: 'Lección 2.3: Variadores VVT (Dual VVT-i, VANOS, VTEC) y Desplazamiento de la Señal CMP', duration: '25 min', type: 'video' },
          { id: 'ckp-m2-l4', title: 'Lección 2.4: Práctica: Detección de Código P0016 (Correlación CKP/CMP Banco 1)', duration: '35 min', type: 'interactive' }
        ],
        quiz: {
          id: 'q-ckp-m2',
          title: 'Quiz Módulo 2: CMP y VVT',
          passingScore: 80,
          questions: [
            q('q-ckp-2-1', '¿Por qué la ECU necesita la señal del CMP si ya cuenta con la señal del CKP?', ['No la necesita en absoluto', 'Porque el cigüeñal da 2 vueltas por cada 1 vuelta del árbol de levas; el CMP le indica a la ECU cuál cilindro está en compresión (fase de motor)', 'Para medir la velocidad del auto', 'Para la radio'], 1, 'Sin el CMP, la ECU no sabe si el cilindro 1 está en la carrera de compresión o de escape en inyección secuencial.'),
            q('q-ckp-2-2', '¿Qué representa el código de falla P0011 o P0016 en el escáner?', ['Falla del sensor de oxigeno', 'Desfasamiento angular entre la posición del cigüeñal y la del árbol de levas fuera del rango tolerado por la ECU', 'Batería baja', 'Fuga de agua'], 1, 'P0016 confirma que los pulsos del CMP no ocurren en el rango de grados de cigüeñal esperados por la programación OEM.')
          ]
        }
      },
      {
        id: 'ckp-m3',
        title: 'Módulo 3: Captura y Verificación de Patrones en Osciloscopio',
        description: 'Uso de dos canales simultáneos, reglas de grados y patrones de referencia de la biblioteca.',
        lessons: [
          { id: 'ckp-m3-l1', title: 'Lección 3.1: Ajuste de Canal A (CKP) y Canal B (CMP) con Tierra Común Limpia', duration: '25 min', type: 'video' },
          { id: 'ckp-m3-l2', title: 'Lección 3.2: Contado de Dientes y Medición de Ángulo en Grados de Cigüeñal (0° - 720°)', duration: '30 min', type: 'interactive' },
          { id: 'ckp-m3-l3', title: 'Lección 3.3: Ruido Electromagnético e Interferencias por Cables de Encendido Secundario o Alternador', duration: '25 min', type: 'video' },
          { id: 'ckp-m3-l4', title: 'Lección 3.4: Práctica: Diagnóstico de Rueda Fónica Floja o Guiada con Juego Axial en Cigüeñal', duration: '35 min', type: 'interactive' }
        ],
        quiz: {
          id: 'q-ckp-m3',
          title: 'Quiz Módulo 3: Análisis de Ondas',
          passingScore: 80,
          questions: [
            q('q-ckp-3-1', 'Si en la gráfica de un sensor Hall CKP la señal no cae hasta 0.0V sino que se queda en 1.8V en el nivel bajo, ¿qué falla existe?', ['Ninguna', 'Resistencia alta en la conexión de masa del sensor o transistor de salida del sensor degradado', 'Batería con exceso de carga', 'Filtro de aire sucio'], 1, 'El nivel lógico bajo (LOGIC ZERO) debe ser menor a 0.5V. Un valor alto de 1.8V impide que el microprocesador reconozca el flanco.'),
            q('q-ckp-3-2', '¿Cómo influye una holgura o juego axial en el cigüeñal sobre la señal de un sensor inductivo?', ['No influye', 'Modifica la distancia de entrehierro al acelerar o soltar el embrague, alterando la amplitud Vpp de la señal', 'Aumenta las RPM', 'Sube el voltaje a 50V'], 1, 'El desplazamiento longitudinal del cigüeñal aleja la rueda fónica del núcleo magnético del sensor reduciendo el voltaje.')
          ]
        }
      },
      {
        id: 'ckp-m4',
        title: 'Módulo 4: Simulación de Señales y Pruebas en Banco',
        description: 'Uso de generadores de señales CKP/CMP (Simuladores de Rueda Fónica) para probar ECUs en mesa.',
        lessons: [
          { id: 'ckp-m4-l1', title: 'Lección 4.1: Generadores de Señales Arbitrarias para Bancos de Prueba de ECUs', duration: '25 min', type: 'video' },
          { id: 'ckp-m4-l2', title: 'Lección 4.2: Simulación de Señales Inductivas (AC) mediante Transformadores/Generador', duration: '25 min', type: 'interactive' },
          { id: 'ckp-m4-l3', title: 'Lección 4.3: Simulación de Señales Hall (0-5V / 0-12V PWM) para Activación de Inyección e Ignition', duration: '25 min', type: 'video' },
          { id: 'ckp-m4-l4', title: 'Lección 4.4: Práctica: Verificación de Inyección en Banco de Trabajo con Simulador CKP', duration: '35 min', type: 'interactive' }
        ],
        quiz: {
          id: 'q-ckp-m4',
          title: 'Quiz Módulo 4: Simulación en Banco',
          passingScore: 80,
          questions: [
            q('q-ckp-4-1', '¿Qué utilidad tiene injectar una señal simulada de CKP de 60-2 a una ECU en el banco de trabajo?', ['Ninguna', 'Permite comprobar si la ECU procesa la señal y activa los relés principales, pulsos de inyectores y bobinas de encendido', 'Resetea el kilometraje', 'Limpia los inyectores'], 1, 'La simulación valida si los circuitos procesadores de entrada (Trigger IC) y los drivers de salida de la ECU funcionan correctamente.'),
            q('q-ckp-4-2', '¿Qué voltaje de amplitud de pulso cuadrado debe configurarse para simular un sensor CKP Hall alimentado con 5V de referencia?', ['12.0V', '5.0V Peak-to-Peak (de 0V a 5V)', '100V', '1.0V'], 1, 'La amplitud de la onda cuadrada debe igualar la tensión de la línea de Pull-Up o alimentación del sensor Hall (5V).')
          ]
        }
      },
      {
        id: 'ckp-m5',
        title: 'Módulo 5: Casos Complejos de Taller y Metodología de Diagnóstico Express',
        description: 'Casos reales de fallas intermitentes, desmagnetización de piñones y arneses invertidos.',
        lessons: [
          { id: 'ckp-m5-l1', title: 'Lección 5.1: Inversión de Polaridad en Sensores Inductivos de 2 Pines (Efecto en el Flanco de Disparo)', duration: '25 min', type: 'video' },
          { id: 'ckp-m5-l2', title: 'Lección 5.2: Desmagnetización por Golpe o Virutas Metálicas Adheridas al Núcleo Magnético', duration: '25 min', type: 'interactive' },
          { id: 'ckp-m5-l3', title: 'Lección 5.3: Diagrama de Árbol de Decisión para Fallas No-Start / No-Spark por CKP', duration: '25 min', type: 'video' },
          { id: 'ckp-m5-l4', title: 'Lección 5.4: Evaluación Práctica Final de Sincronismo', duration: '40 min', type: 'interactive' }
        ],
        quiz: {
          id: 'q-ckp-m5',
          title: 'Quiz Módulo 5: Diagnóstico Avanzado',
          passingScore: 80,
          questions: [
            q('q-ckp-5-1', '¿Qué ocurre si se invierten accidentalmente los dos cables de un sensor CKP inductivo al reparar un arnés?', ['Se quema el sensor', 'La fase de la onda senoidal se invierte (180°), cambiando el sentido del cruce por cero y provocando falla de encendido', 'Aumenta la velocidad del auto', 'Funciona exactamente igual'], 1, 'La inversión de pines invierte la pendiente del cruce por cero en el hueco de referencia, desfasando el tiempo de disparo.'),
            q('q-ckp-5-2', '¿Qué efecto provocan las virutas de limadura metálica pegadas en la punta magnética de un sensor CKP inductivo?', ['Mejoran la señal', 'Absorben y dispersan el flujo magnético reduciendo drásticamente la amplitud Vpp de la señal generada', 'Limpian el motor', 'Sin efecto'], 1, 'La acumulación de residuo ferroso desvía el campo magnético del imán permanente impidiendo la inducción correcta.')
          ]
        }
      }
    ],
    exam: {
      id: 'ex-ckp-final',
      title: 'Examen de Certificación: Diagnóstico CKP/CMP y Sincronismo',
      description: 'Evaluación de maestría en diagnóstico de sensores de posición de motor.',
      timeLimitMinutes: 45,
      passingScore: 80,
      attemptsAllowed: 3,
      questions: [
        q('ex-ckp-q1', 'Un motor Nissan 2.5L gira con marcha fuerte pero no arranca. El escáner muestra código P0335. En el osciloscopio se ve señal cuadrada de 5V en CKP y CMP. Al comparar las ondas con el manual OEM, el pulso del CMP está retrasado 3 dientes de cigüeñal. ¿Cuál es el diagnóstico?', ['Cambiar la ECU', 'Cadena de distribución estirada o tensor hidráulico colapsado que desfasó la sincronización mecánica', 'Inyector obstruido', 'Falta de gasolina'], 1, 'El desfasamiento de 3 dientes medido directamente con osciloscopio confirma salto o estiramiento de la cadena de tiempo.'),
        q('ex-ckp-q2', '¿Qué prueba simple con multímetro en escala de Voltaje DC permite saber si una línea de señal de sensor Hall de 3 pines desconectado tiene continuidad hasta la ECU?', ['Medir 0V', 'Medir el voltaje de Pull-Up entregado por la ECU (típicamente 5.0V o 12.0V) en el pin de señal del arnés desconectado con contacto puesto', 'Medir resistencia a chasis', 'Medir corriente AC'], 1, 'La resistencia interna de Pull-Up dentro de la ECU coloca 5V/12V en el cable de señal cuando el transistor del sensor está abierto.')
      ]
    }
  },

  // 9. Diagnóstico MAF/MAP
  {
    id: 'diagnostico-maf-map-calculo-carga',
    title: 'Diagnóstico de Sensores MAF y MAP: Medición de Masa de Aire y Vacío',
    icon: '💨',
    category: 'sensors',
    categoryLabel: 'Sensores Automotrices',
    description: 'Diagnóstico preciso de sensores de flujo masivo de aire (MAF) y presión absoluta del múltiple (MAP) para motores atmosféricos y sobrealimentados.',
    longDescription: 'Aprende la física del cálculo de carga de motor por la ECU (Speed-Density vs Mass Air Flow). Diagnostica sensores descalibrados, fugas de vacío no contabilizadas y problemas de presión de sobrealimentación Turbo.',
    objectives: [
      'Analizar tablas de gramos por segundo (g/s) de MAF según la cilindrada del motor.',
      'Diagnosticar sensores MAP piezorresistivos de 1 a 4 Bar de rango.',
      'Identificar de forma metódica entradas de aire pirata (fugas de vacío) que afectan el STFT/LTFT.'
    ],
    requirements: ['Escáner Automotriz', 'Osciloscopio'],
    learningOutcomes: ['Identificación de fallas de mezcla rica/pobre causadas por sensores de aire defectuosos'],
    price: 199,
    duration: '6 Semanas (45 hrs)',
    level: 'Intermedio',
    status: 'PUBLISHED',
    systemId: 'sistema-inyeccion',
    relatedVehicle: 'General (Gasolina / Diésel)',
    relatedCases: ['case-009-maf-descalibrado'],
    relatedLabs: ['lab-sensores-sim'],
    recommendedAiMode: 'diagnostico',
    features: ['Regla empírica de g/s por litro de cilindrada', 'Pruebas de vacío con vacuómetro y humómetro', 'Casos reales de simulación de fugas'],
    instructor: 'Ing. Mateo Benítez',
    rating: 4.90,
    reviewsCount: 230,
    modules: [
      {
        id: 'maf-m1',
        title: 'Módulo 1: Estrategia de Inyección Mass Air Flow (MAF) vs Speed Density (MAP)',
        description: 'Fundamentos aerodinámicos de la medición directa de masa de aire vs cálculo por densidad y velocidad.',
        lessons: [
          { id: 'maf-m1-l1', title: 'Lección 1.1: Densidad del Aire, Temperatura, Humedad y Altitud sobre el Nivel del Mar', duration: '20 min', type: 'video' },
          { id: 'maf-m1-l2', title: 'Lección 1.2: Sistema MAF: Medición Directa de Masa de Aire en Gramos por Segundo (g/s)', duration: '25 min', type: 'interactive' },
          { id: 'maf-m1-l3', title: 'Lección 1.3: Sistema Speed-Density: Cálculo por MAP, IAT, RPM y Eficiencia Volumétrica (VE %)', duration: '25 min', type: 'video' },
          { id: 'maf-m1-l4', title: 'Lección 1.4: Práctica: Comparativa de Datos de Muestra en Escáner entre MAF y MAP', duration: '30 min', type: 'interactive' }
        ],
        quiz: {
          id: 'q-maf-m1',
          title: 'Quiz Módulo 1: Estrategias MAF vs MAP',
          passingScore: 80,
          questions: [
            q('q-maf-1-1', '¿Cuál es la regla empírica estándar para el valor de lectura en g/s de un sensor MAF en ralentí en un motor de 2.0 Litros a temperatura de trabajo?', ['Aproximadamente 2.0 g/s (1 g/s por cada litro de cilindrada del motor en ralentí)', '100 g/s', '0.1 g/s', '50 g/s'], 0, 'Como norma general de diagnóstico, un motor atmosférico en ralentí a 800 RPM consume aproximadamente 1 g/s por litro de cilindrada.'),
            q('q-maf-1-2', 'En un sistema Speed-Density basado en sensor MAP, si ocurre una fuga de vacío por una manguera rota, ¿qué lectura detecta el MAP en ralentí?', ['Detecta menor presión (más vacío)', 'Detecta mayor presión absoluta (menos vacío), por lo que la ECU inyecta MÁS combustible por error', 'Se pone en 0 Volts', 'No cambia'], 1, 'Una fuga de vacío reduce el vacío del múltiple, aumentando la presión absoluta leída por el MAP y enriqueciendo la mezcla.')
          ]
        }
      },
      {
        id: 'maf-m2',
        title: 'Módulo 2: Sensor MAF de Hilo Caliente (Hot Wire) y Película Caliente (Hot Film)',
        description: 'Mantenimiento del hilo de platino a temperatura constante (+200°C) por puente de Wheatstone interno.',
        lessons: [
          { id: 'maf-m2-l1', title: 'Lección 2.1: Funcionamiento del Hilo Caliente de Platino y Termistor de Compensación', duration: '25 min', type: 'video' },
          { id: 'maf-m2-l2', title: 'Lección 2.2: Contaminación por Aceite de Filtros de Reemplazo K&N y Polvo Fino', duration: '25 min', type: 'interactive' },
          { id: 'maf-m2-l3', title: 'Lección 2.3: MAF de Frecuencia Digital (Frecuencia en Hz proporcional al flujo de aire)', duration: '25 min', type: 'video' },
          { id: 'maf-m2-l4', title: 'Lección 2.4: Práctica: Limpieza Correcta con Dieléctrico MAF Cleaner y Verificación Voltmétrica', duration: '30 min', type: 'interactive' }
        ],
        quiz: {
          id: 'q-maf-m2',
          title: 'Quiz Módulo 2: Sensores MAF',
          passingScore: 80,
          questions: [
            q('q-maf-2-1', '¿Por qué la película de aceite o polvo depositada sobre el hilo caliente del MAF provoca que el motor trabaje POBRE en aceleración?', ['Porque aísla térmicamente el hilo de platino, impidiendo que el flujo de aire lo enfríe correctamente y haciendo que la ECU lea MENOS aire del real', 'Porque quema la ECU', 'Porque aumenta el amperaje', 'Porque ahoga las bujías'], 0, 'La capa aislante frena la disipación de calor; el circuito requiere menos corriente para mantener la temp y reporta menor masa de aire.'),
            q('q-maf-2-2', '¿Qué producto químico es el ÚNICO indicado para limpiar el elemento sensor interno de un MAF sin destruirlo?', ['CarbuClean / Thinner', 'Limpiador de contactos residuo cero especial para sensores MAF (Precision MAF Cleaner)', 'Gasolina con aceite', 'Agua y jabón'], 1, 'Los solventes agresivos como el CarbuClean disuelven el recubrimiento epóxico o plástico protector del sensor inutilizándolo.')
          ]
        }
      },
      {
        id: 'maf-m3',
        title: 'Módulo 3: Sensor MAP Piezorresistivo y Sensores de Presión de Turbo (MAP / BARO / Boost)',
        description: 'Elementos de galga extensiométrica sobre diafragma de silicio sellado al vacío absoluto.',
        lessons: [
          { id: 'maf-m3-l1', title: 'Lección 3.1: Estructura de la Galga Piezorresistiva sobre Cámara de Vacío de Referencia', duration: '25 min', type: 'video' },
          { id: 'maf-m3-l2', title: 'Lección 3.2: Curva de Salida Voltios vs Presión (kPa / inHg / PSI / Bar)', duration: '25 min', type: 'interactive' },
          { id: 'maf-m3-l3', title: 'Lección 3.3: Sensores BARO de Presión Barométrica para Ajuste de Altitud', duration: '25 min', type: 'video' },
          { id: 'maf-m3-l4', title: 'Lección 3.4: Práctica: Prueba de Curva de Respuesta de Sensor MAP con Bomba de Vacío Mityvac', duration: '35 min', type: 'interactive' }
        ],
        quiz: {
          id: 'q-maf-m3',
          title: 'Quiz Módulo 3: Sensores MAP',
          passingScore: 80,
          questions: [
            q('q-maf-3-1', 'Con el motor apagado y el contacto puesto a nivel del mar (101 kPa / 14.7 PSI), ¿qué voltaje debe medir aproximadamente la señal de un sensor MAP de 1 Bar?', ['0.2 Volts', '4.5 Volts a 4.8 Volts (Presión barométrica atmosférica completa)', '2.5 Volts', '12.0 Volts'], 1, 'Sin vacío de motor en marcha, la galga siente toda la presión atmosférica generando su máximo voltaje (~4.5V a nivel del mar).'),
            q('q-maf-3-2', 'Al aplicar 15 inHg de vacío con una bomba manual Mityvac al puerto del MAP con contacto puesto, ¿qué debe hacer el voltaje de salida?', ['Aumentar a 5V', 'Descender drásticamente desde ~4.5V hasta aproximadamente 1.2V - 1.5V', 'Mantenerse fijo', 'Bajar a 0V'], 1, 'Al simular vacío de admisión, la presión absoluta baja sobre el diafragma y la tensión de salida desciende proporcionalmente.')
          ]
        }
      },
      {
        id: 'maf-m4',
        title: 'Módulo 4: Detección de Fugas de Aire no Contabilizadas y Pruebas con Máquina de Humo',
        description: 'Localización de fisuras en ductos de admisión, mangueras PCV, empaques de múltiple y servofreno.',
        lessons: [
          { id: 'maf-m4-l1', title: 'Lección 4.1: Concepto de "False Air" (Aire no medido que ingresa después del sensor MAF)', duration: '25 min', type: 'video' },
          { id: 'maf-m4-l2', title: 'Lección 4.2: Análisis de Fuel Trims en Ralentí vs 2500 RPM para Diagnosticar Fugas de Vacío', duration: '30 min', type: 'interactive' },
          { id: 'maf-m4-l3', title: 'Lección 4.3: Uso de la Máquina de Generación de Humo de Diagnóstico (Smoke Machine Test)', duration: '25 min', type: 'video' },
          { id: 'maf-m4-l4', title: 'Lección 4.4: Práctica: Búsqueda de Fuga en Empaque de Múltiple de Admisión con Humo Presurizado', duration: '35 min', type: 'interactive' }
        ],
        quiz: {
          id: 'q-maf-m4',
          title: 'Quiz Módulo 4: Fugas de Vacío',
          passingScore: 80,
          questions: [
            q('q-maf-4-1', 'Un vehículo tiene un Fuel Trim a Corto Plazo (+22%) en ralentí, pero al acelerar a 2500 RPM el Fuel Trim se normaliza a (+3%). ¿Qué tipo de falla indica este patrón?', ['Inyector tapado', 'Fuga de vacío en el múltiple de admisión (el aire pirata tiene mayor impacto en ralentí por la baja masa total de aire)', 'Bomba de gasolina defectuosa', 'Sensor de oxígeno quemado'], 1, 'En ralentí el volumen de aire es pequeño, por lo que la fuga representa un % alto de error. A 2500 RPM la gran masa diluye la fuga.'),
            q('q-maf-4-2', 'Si la prueba con la máquina de humo muestra salida de humo denso por el sello del eje del cuerpo de aceleración, ¿cuál es la solución?', ['Apretar los tornillos', 'Reemplazar los sellos/empaques del cuerpo de aceleración o el cuerpo completo', 'Borrar los códigos con escáner', 'Poner silicona por fuera'], 1, 'Cualquier fuga identificada visualmente con la máquina de humo requiere reemplazo del sello dañado.')
          ]
        }
      },
      {
        id: 'maf-m5',
        title: 'Módulo 5: Diagnóstico Integrado en Motores Turbocargados (MAP1 / MAP2 / Boost Pressure)',
        description: 'Sensores de presión antes y después de la mariposa, intercooler y control de Wastegate.',
        lessons: [
          { id: 'maf-m5-l1', title: 'Lección 5.1: Arquitectura de Sensores de Presión en Motores con Turbocompresor', duration: '25 min', type: 'video' },
          { id: 'maf-m5-l2', title: 'Lección 5.2: Correlación entre Presión Deseada de Turbo y Presión Real Medida', duration: '25 min', type: 'interactive' },
          { id: 'maf-m5-l3', title: 'Lección 5.3: Códigos P0299 (Underboost) y P0234 (Overboost): Metodología de Descarte', duration: '30 min', type: 'video' },
          { id: 'maf-m5-l4', title: 'Lección 5.4: Evaluación Final Práctica de Sensores de Aire', duration: '40 min', type: 'interactive' }
        ],
        quiz: {
          id: 'q-maf-m5',
          title: 'Quiz Módulo 5: Turbo y Sobrealimentación',
          passingScore: 80,
          questions: [
            q('q-maf-5-1', '¿Qué causa el código P0299 (Turbocharger Underboost) en un motor GDI Turbo?', ['Fuga de aire en mangueras de intercooler, válvula diverter defectuosa o wastegate atascada abierta', 'Exceso de presión de gasolina', 'Filtro de aceite tapado', 'Sensor de detonación roto'], 0, 'El P0299 se activa cuando la presión medida por el sensor MAP/Boost es significativamente inferior a la solicitada por la ECU.'),
            q('q-maf-5-2', '¿Qué sensor utiliza la ECU para medir la presión de aire JUSTO ANTES de la mariposa en motores turbo modernos?', ['Sensor MAP de múltiple', 'Sensor TIP (Throttle Inlet Pressure) / Charge Air Pressure', 'Sensor de nivel de aceite', 'Sensor de frenos'], 1, 'El sensor TIP/Charge Pressure mide la presión generada por el turbo en la tubería antes de la mariposa de aceleración.')
          ]
        }
      }
    ],
    exam: {
      id: 'ex-maf-final',
      title: 'Examen de Certificación: Diagnóstico MAF/MAP y Carga de Motor',
      description: 'Evaluación técnica en cálculo de aire y diagnóstico de sensores de carga.',
      timeLimitMinutes: 45,
      passingScore: 80,
      attemptsAllowed: 3,
      questions: [
        q('ex-maf-q1', 'Un motor V6 de 3.5 Litros registra en ralentí 1.2 g/s en el sensor MAF (debería registrar ~3.5 g/s). El motor presenta vacilación severa al acelerar. Al limpiar el MAF sube a 3.4 g/s y la falla desaparece. ¿Qué fenómeno físico estaba ocurriendo?', ['El hilo del MAF estaba en corto a 12V', 'La suciedad aislante provocaba subestimación drástica de la masa de aire, empobreciendo la mezcla', 'El filtro de aire estaba húmedo', 'El catalizador estaba frío'], 1, 'La subestimación de masa de aire reduce el tiempo de inyección base calculado por la ECU provocando mezcla extremadamente pobre.'),
        q('ex-maf-q2', 'Al medir la señal de un sensor MAP con multímetro en el cable de señal, se registran 5.0V fijos tanto en ralentí como a 3000 RPM. La línea de tierra mide 0V y la referencia mide 5V. ¿Cuál es el diagnóstico?', ['MAP perfecto', 'El sensor MAP tiene un cortocircuito interno entre la referencia de 5V y el pin de señal (sensor dañado)', 'La ECU se quemó', 'Manguera tapada'], 1, 'Si el voltaje de señal se queda trabado en 5V fijos sin reaccionar al vacío, el elemento piezorresistivo o la electrónica interna falló.')
      ]
    }
  },

  // 10. Diagnóstico TPS
  {
    id: 'diagnostico-tps-app-acelerador-electronico',
    title: 'Diagnóstico de TPS, APP y Cuerpos de Aceleración Electrónicos (Drive-by-Wire)',
    icon: '🎛️',
    category: 'sensors',
    categoryLabel: 'Sensores Automotrices',
    description: 'Acelerador electrónico Drive-by-Wire, potenciómetros dobles TPS1/TPS2, pedales APP1/APP2 y recalibración de mariposa.',
    longDescription: 'Domina los sistemas de control de aceleración sin cable mecánico. Aprende el funcionamiento de sensores de efecto Hall sin contacto y potenciómetros de película de carbón. Diagnostica estados de emergencia (Failsafe / Limp-Home Mode) y procedimientos de reaprendizaje de ralentí.',
    objectives: [
      'Entender la estrategia de seguridad por correlación cruzada de señales TPS y APP.',
      'Capturar picos de ruido en pistas de carbón con osciloscopio en modo Roll.',
      'Ejecutar procedimientos de calibración e inicialización de mariposa electrónica con escáner.'
    ],
    requirements: ['Escáner Automotriz', 'Multímetro / Osciloscopio'],
    learningOutcomes: ['Eliminación de códigos de falla P0121, P0122, P0221, P2135 sin reemplazar piezas innecesarias'],
    price: 189,
    duration: '4 Semanas (35 hrs)',
    level: 'Intermedio',
    status: 'PUBLISHED',
    systemId: 'sistema-inyeccion',
    relatedVehicle: 'General (Vehículos con Acelerador Electrónico)',
    relatedCases: ['case-007-cuerpo-aceleración-limp-home'],
    relatedLabs: ['lab-actuadores-pwm'],
    recommendedAiMode: 'diagnostico',
    features: ['Análisis de señales cruzadas en osciloscopio', 'Casos de Limp Mode por corrosión en conector', 'Procedimiento de aprendizaje sin escáner'],
    instructor: 'Ing. Carlos Mendoza',
    rating: 4.92,
    reviewsCount: 210,
    modules: [
      {
        id: 'tps-m1',
        title: 'Módulo 1: Mapeo Potenciométrico y Sensores de Efecto Hall en Mariposas y Pedales',
        description: 'Potenciómetro divisor de voltaje de 3 terminales vs sensores inductivos/Hall de efecto magnético sin desgaste.',
        lessons: [
          { id: 'tps-m1-l1', title: 'Lección 1.1: El Potenciómetro de Carbón: Divisor de Voltaje Variable y Desgaste Físico', duration: '20 min', type: 'video' },
          { id: 'tps-m1-l2', title: 'Lección 1.2: Sensores TPS/APP de Efecto Hall Aislados Magnéticamente', duration: '25 min', type: 'interactive' },
          { id: 'tps-m1-l3', title: 'Lección 1.3: Estrategia de Redundancia Dual de la ECU: Verificación de Seguridad en 1 ms', duration: '20 min', type: 'video' },
          { id: 'tps-m1-l4', title: 'Lección 1.4: Práctica: Trazado de Curva de Voltaje de TPS con Multímetro Analógico vs Digital', duration: '30 min', type: 'interactive' }
        ],
        quiz: {
          id: 'q-tps-m1',
          title: 'Quiz Módulo 1: Principios de TPS/APP',
          passingScore: 80,
          questions: [
            q('q-tps-1-1', '¿Por qué los fabricantes modernos están migrando de potenciómetros de carbón a sensores Hall en el acelerador?', ['Porque son más baratos', 'Porque no tienen contacto mecánico suelto al desgaste por fricción, eliminando la aparición de puntos ciegos o ruidos', 'Porque usan 24V', 'Porque consumen menos aceite'], 1, 'La ausencia de fricción física en sensores Hall garantiza durabilidad de por vida sin desgaste de pistas.'),
            q('q-tps-1-2', '¿Qué realiza la ECU si detecta que la suma de TPS 1 + TPS 2 es diferente de 5.0 Volts en un sistema de señales complementarias?', ['Ignora el error', 'Entra inmediatamente en modo de emergencia (Limp Home), limita las RPM a ~1500 y enciende la luz de advertencia EPC/Check Engine', 'Apaga las luces del auto', 'Sube la velocidad al máximo'], 1, 'Por motivos estricto de seguridad funcional ISO 26262, cualquier inconsistencia de acelerador bloquea la apertura de mariposa.')
          ]
        }
      },
      {
        id: 'tps-m2',
        title: 'Módulo 2: Sensor de Posición del Pedal de Acelerador (APP 1 y APP 2)',
        description: 'Construcción del pedal con dos sensores independientes, resortes de retorno duales y kickdown.',
        lessons: [
          { id: 'tps-m2-l1', title: 'Lección 2.1: Pinout Estándar de 6 Terminales en Pedales de Acelerador Electrónico', duration: '20 min', type: 'video' },
          { id: 'tps-m2-l2', title: 'Lección 2.2: Configuración de Voltaje Parcial: APP 1 (0.5V a 4.5V) y APP 2 (0.25V a 2.25V)', duration: '25 min', type: 'interactive' },
          { id: 'tps-m2-l3', title: 'Lección 2.3: Infiltración de Humedad o Agua en el Pedal por Desagües de Parabrisas Obstruidos', duration: '20 min', type: 'video' },
          { id: 'tps-m2-l4', title: 'Lección 2.4: Práctica: Medición Dinámica de las 2 Señales del APP en Escáner durante Todo el Recorrido', duration: '30 min', type: 'interactive' }
        ],
        quiz: {
          id: 'q-tps-m2',
          title: 'Quiz Módulo 2: Sensor APP',
          passingScore: 80,
          questions: [
            q('q-tps-2-1', '¿Por qué la señal APP 2 mide exactamente la mitad del voltaje de APP 1 en muchos sistemas automotrices (p.ej. Toyota/GM)?', ['Para ahorrar batería', 'Para permitir a la ECU validar matemáticamente mediante la fórmula (APP 1 = 2 x APP 2) que ningún circuito está cortocircuitado a 5V o masa', 'Es por azar', 'Para encender el aire acondicionado'], 1, 'La relación proporcional exacta de 2 a 1 permite detectar cortocircuitos cruzados entre líneas de señal.'),
            q('q-tps-2-2', 'Si se pisa el pedal a fondo y APP 1 llega a 4.2V pero APP 2 se queda congelado en 0.5V, ¿qué código de falla registra el escáner?', ['P0300 Misfire', 'P2135 / P2138 Correlación de Voltaje de Sensor de Posición de Pedal/Mariposa', 'P0100 MAF', 'P0500 VSS'], 1, 'Cualquier falta de seguimiento proporcional entre APP1 y APP2 dispara un DTC de correlación de pedal.')
          ]
        }
      },
      {
        id: 'tps-m3',
        title: 'Módulo 3: Detección de Ruido y Puntos Ciegos con Osciloscopio',
        description: 'Ajuste de osciloscopio en modo Roll (100ms/div o 200ms/div) para barrido lento de aceleración.',
        lessons: [
          { id: 'tps-m3-l1', title: 'Lección 3.1: Captura de Ruido por Micro-Fisuras en la Película de Resistiva de Carbono', duration: '20 min', type: 'video' },
          { id: 'tps-m3-l2', title: 'Lección 3.2: Uso del Modo SCAN / ROLL en el Osciloscopio para Barridos de Aceleración Suaves', duration: '25 min', type: 'interactive' },
          { id: 'tps-m3-l3', title: 'Lección 3.3: Caídas de Tensión en la Tierra de Sensores de la ECU (Sensor Ground Offset)', duration: '20 min', type: 'video' },
          { id: 'tps-m3-l4', title: 'Lección 3.4: Práctica: Diagnóstico de Tironeo en Aceleración Parcial por Pista TPS Gastada en zona de 2000 RPM', duration: '30 min', type: 'interactive' }
        ],
        quiz: {
          id: 'q-tps-m3',
          title: 'Quiz Módulo 3: Diagnóstico con Osciloscopio',
          passingScore: 80,
          questions: [
            q('q-tps-3-1', '¿Por qué la tasa de refresco lenta del escáner (Live Data) a menudo NO detecta un punto ciego en la pista del TPS?', ['Porque el escáner es muy rápido', 'Porque el escáner actualiza datos solo 5 a 10 veces por segundo, perdiéndose micro-caídas de voltaje de 2 milisegundos que el osciloscopio sí atrapa', 'Porque el escáner no mide voltaje', 'Porque borra las fallas'], 1, 'Las caídas de voltaje por desgaste de pista son ultra breves; el escáner promedia la señal y enmascara la falla.'),
            q('q-tps-3-2', 'En la gráfica del osciloscopio, ¿cómo se visualiza una pista de TPS en mal estado durante un barrido lento?', ['Como una línea recta vertical', 'Como picos hacia 0V (picos o "glitches" de ruido negativo) que rompen la rampa suave de voltaje', 'Como una onda senoidal perfecta', 'Como un cambio de color'], 1, 'Al pasar el limpiador metálico sobre la zona carbonizada o gastada, pierde contacto momentáneo cayendo a 0V.')
          ]
        }
      },
      {
        id: 'tps-m4',
        title: 'Módulo 4: Limpieza de Cuerpo de Aceleración y Procedimientos de Reaprendizaje',
        description: 'Procedimiento seguro de limpieza de la garganta de aceleración y reseteo de la posición de ralentí adaptada.',
        lessons: [
          { id: 'tps-m4-l1', title: 'Lección 4.1: Acumulación de Carbón y Vapores de Aceite PCV en la Garganta de la Mariposa', duration: '20 min', type: 'video' },
          { id: 'tps-m4-l2', title: 'Lección 4.2: Precauciones Extremas para Limpieza Mecánica sin Mover la Placa Forzadamente', duration: '25 min', type: 'interactive' },
          { id: 'tps-m4-l3', title: 'Lección 4.3: Procedimiento de Reaprendizaje con Escáner (Throttle Body Re-learn / Idle Air Volume Learn)', duration: '25 min', type: 'video' },
          { id: 'tps-m4-l4', title: 'Lección 4.4: Práctica: Solución de Ralentí Acelerado a 1800 RPM tras Limpieza de Cuerpo de Aceleración en Nissan/GM', duration: '35 min', type: 'interactive' }
        ],
        quiz: {
          id: 'q-tps-m4',
          title: 'Quiz Módulo 4: Limpieza y Calibración',
          passingScore: 80,
          questions: [
            q('q-tps-4-1', '¿Por qué un motor queda acelerado a 1500-2000 RPM en ralentí después de remover la suciedad de la mariposa de aceleración?', ['Porque se rompió el motor', 'Porque la ECU mantenía la mariposa más abierta para compensar la suciedad previa; al limpiar, entra exceso de aire hasta que se re-aprenda la nueva posición cero', 'Porque falta gasolina', 'Porque se quemó el fusible'], 1, 'La ECU adapta con el tiempo el ángulo de reposo para vencer el carbón. Al limpiar, el paso de aire aumenta drasticamente.'),
            q('q-tps-4-2', '¿Qué condiciones preliminares exige la ECU antes de permitir ejecutar el aprendizaje de volumen de aire de ralentí con el escáner?', ['Motor helado a 0°C', 'Temperatura de refrigerante normal de trabajo (80°C-90°C), transmisión en Neutral/Park y todas las cargas eléctricas apagadas (A/C, luces)', 'Tanque vacío', 'Capó abierto'], 1, 'Los algoritmos de aprendizaje de ralentí rechazan la calibración si el motor está frío o existen cargas de A/C o alternador activas.')
          ]
        }
      },
      {
        id: 'tps-m5',
        title: 'Módulo 5: Diagnóstico de Marcha de Emergencia (Limp Home Mode)',
        description: 'Análisis de causas de falla de aceleración: relés de control del actuador de mariposa y motores DC dañados.',
        lessons: [
          { id: 'tps-m5-l1', title: 'Lección 5.1: Mecanismo de Resorte de Retorno de Seguridad en el Cuerpo de Aceleración', duration: '20 min', type: 'video' },
          { id: 'tps-m5-l2', title: 'Lección 5.2: Relé de Control del Actuador de Mariposa (Throttle Actuator Control Relay)', duration: '20 min', type: 'interactive' },
          { id: 'tps-m5-l3', title: 'Lección 5.3: Diagnóstico de Engranajes Plásticos Rotos o Dientes Barridos en el Cuerpo', duration: '25 min', type: 'video' },
          { id: 'tps-m5-l4', title: 'Lección 5.4: Evaluación Práctica Final de Acelerador Electrónico', duration: '35 min', type: 'interactive' }
        ],
        quiz: {
          id: 'q-tps-m5',
          title: 'Quiz Módulo 5: Modo de Emergencia',
          passingScore: 80,
          questions: [
            q('q-tps-5-1', 'Cuando el sistema de aceleración entra en Limp Home por falla grave de TPS, ¿cuál es la posición mecánica que adopta la mariposa impulsada por su resorte de seguridad?', ['Completamente cerrada al 0%', 'Ligeramente abierta al 5% - 7% para permitir aire suficiente para que el vehículo ruede despacio a un lugar seguro', 'Totalmente abierta al 100%', 'Gira 360 grados'], 1, 'El resorte mecánicamente desenergizado la coloca en posición "Default/Limp Home" (~6% de apertura), permitiendo ~1200 RPM.'),
            q('q-tps-5-2', 'Si al aplicar 12V directos de forma breve al motor DC del cuerpo de aceleración este no se mueve ni consume amperaje, ¿cuál es el fallo?', ['Falta de aceite', 'Escobillas de carbón del motor DC desgastadas o bobinado abierto en el servomotor', 'Sensor TPS descalibrado', 'Fusible de radio soplado'], 1, 'Un servomotor DC con escobillas desgastadas o bobina abierta presenta resistencia infinita y no genera torque.')
          ]
        }
      }
    ],
    exam: {
      id: 'ex-tps-final',
      title: 'Examen de Certificación: Diagnóstico TPS, APP y Mariposa Electrónica',
      description: 'Certificación técnica en sistemas de aceleración Drive-by-Wire.',
      timeLimitMinutes: 45,
      passingScore: 80,
      attemptsAllowed: 3,
      questions: [
        q('ex-tps-q1', 'Un Chevrolet Cruze llega en grúa con Check Engine y código P2135. El escáner muestra TPS1 en 0.8V y TPS2 en 0.8V (deberían sumar 5.0V). Al inspeccionar el conector del cuerpo de aceleración se observa sulfatación verde por líquido limpiaparabrisas. Tras limpiar las terminales con dieléctrico y secar, TPS1 marca 0.8V y TPS2 marca 4.2V. ¿Cuál era el problema?', ['El cuerpo de aceleración estaba inservible', 'La humedad sulfatada creó un puente resistivo en el conector cruzando las líneas de señal de los dos sensores', 'La ECU requería reprogramación J2534', 'El pedal estaba roto'], 1, 'La sulfatación en conectores crea cortocircuitos resistivos entre pines adyacentes distorsionando las lecturas analógicas.'),
        q('ex-tps-q2', 'Al intentar ejecutar el reaprendizaje de mariposa en un vehículo Toyota con escáner, este lanza el mensaje "Procedure Failed / Conditions Not Met". El técnico nota que la temperatura de refrigerante está en 62°C. ¿Qué debe hacer?', ['Cambiar la ECU', 'Hacer funcionar el motor hasta alcanzar la temperatura operacional adecuada (mínimo 82°C) y reintentar', 'Desconectar la batería', 'Reemplazar el pedal'], 1, 'Las rutinas de servicio en escáner verifican precondiciones de software; si la temperatura es inferior a 80°C la rutina aborta.')
      ]
    }
  }
];
