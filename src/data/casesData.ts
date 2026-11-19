import { DiagnosticCase } from '../types';

export const DIAGNOSTIC_CASES_DATA: DiagnosticCase[] = [
  {
    id: 'case-p0171-yaris',
    title: 'Mezcla Pobre en Toyota Yaris 1.5L (DTC P0171)',
    vehicle: 'Toyota Yaris 2019 1.5L 1NZ-FE',
    brandId: 'toyota',
    engine: '1NZ-FE 1.5L',
    system: 'Inyección Electrónica',
    symptom: 'Luz Check Engine encendida, tirones ocasionales al acelerar y ralentí inestable a 600 RPM.',
    dtcCode: 'P0171 - System Too Lean (Bank 1)',
    difficulty: 'Intermedio',
    category: 'Inyección Electrónica',
    initialLiveData: [
      { parameter: 'RPM Motor', value: '620', unit: 'RPM', normalRange: '650-750 RPM' },
      { parameter: 'MAF (Flujo Aire)', value: '1.2', unit: 'g/s', normalRange: '1.8-2.2 g/s' },
      { parameter: 'STFT (Ajuste Corto)', value: '+18.5', unit: '%', normalRange: '-5% a +5%' },
      { parameter: 'LTFT (Ajuste Largo)', value: '+24.2', unit: '%', normalRange: '-5% a +5%' },
      { parameter: 'O2 B1S1 (Oxígeno)', value: '0.08', unit: 'V', normalRange: '0.1V a 0.9V (Oscilante)' }
    ],
    physicalMeasurements: [
      { testName: 'Presión de Combustible en Riel', toolUsed: 'Manómetro de Combustible', resultValue: '3.1 bar (45 PSI)', status: 'Normal' },
      { testName: 'Voltaje de Masa del MAF', toolUsed: 'Multímetro VDC', resultValue: '0.015V (15mV)', status: 'Normal' },
      { testName: 'Prueba de Humo en Múltiple', toolUsed: 'Máquina de Humo', resultValue: 'Fuga ligera en manguera PCV agrietada', status: 'Anómalo' }
    ],
    hints: [
      {
        id: 'h-1',
        title: 'Pista 1: Comportamiento de los Fuel Trims',
        content: 'Los Fuel Trims marcadamente positivos (+18% STFT y +24% LTFT) indican que la ECU está inyectando gasolina extra porque la sonda O2 detecta exceso de aire no contabilizado.',
        xpPenalty: 10
      },
      {
        id: 'h-2',
        title: 'Pista 2: Prueba de Vacío vs MAF',
        content: 'Un sensor MAF contaminado con polvo o aceite seco mide MENOS aire del que realmente ingresa al motor, haciendo que la ECU empobrezca la mezcla por cálculo falso.',
        xpPenalty: 15
      }
    ],
    steps: [
      {
        id: 'step-1',
        stepNumber: 1,
        title: 'Análisis de Flujo de Datos (Live Data)',
        instruction: 'Analizando los Fuel Trims extremadamente positivos (+18% STFT y +24% LTFT) en ralentí, ¿qué hipótesis inicial es la más lógica?',
        toolRequired: 'scanner',
        options: [
          {
            text: 'Fuga de aire no medido (vacío) posterior al MAF o sensor MAF sucio/descalibrado.',
            isCorrect: true,
            feedback: '¡Correcto! Un ingreso de aire no contabilizado o un MAF descalibrado hacia abajo desbalancea la relación estequiométrica a mezcla pobre.',
            nextStepId: 'step-2'
          },
          {
            text: 'Fuga de combustible en un inyector atascado abierto.',
            isCorrect: false,
            feedback: 'Incorrecto. Un inyector abierto causaría exceso de gasolina, mezcla rica y Fuel Trims marcadamente negativos (-20%).'
          },
          {
            text: 'Filtro de aire excesivamente obstruido.',
            isCorrect: false,
            feedback: 'Incorrecto. Un filtro de aire obstruido restringiría el flujo de aire libre causante de riqueza, no de mezclas pobres.'
          }
        ]
      },
      {
        id: 'step-2',
        stepNumber: 2,
        title: 'Prueba con Limpiador Carbu-Cleaner en Admisión',
        instruction: 'Rocías un limpiador carburador en las mangueras de vacío con el motor encendido. ¿Qué cambio observas en el escáner que confirma la fuga?',
        toolRequired: 'visual',
        options: [
          {
            text: 'El STFT cambia rápidamente hacia valores negativos (-15%) y el voltaje de O2 sube a 0.85V.',
            isCorrect: true,
            feedback: '¡Excelente! Al ingresar el solvente inflamable por la hendidura de vacío, la mezcla se enriquece instantáneamente y el STFT corrige restando combustible.',
            nextStepId: 'step-3'
          },
          {
            text: 'Los Fuel Trims aumentan a +35% y el motor se apaga.',
            isCorrect: false,
            feedback: 'Incorrecto. La adición de hidrocarburos no eleva más el ajuste positivo sino que satisface la demanda de combustible.'
          }
        ]
      },
      {
        id: 'step-3',
        stepNumber: 3,
        title: 'Inspección Física y Solución Definitiva',
        instruction: 'Observas una manguera de ventilación PCV picada e hilo caliente del MAF con depósito seco. ¿Qué procedimiento correctivo aplicas?',
        toolRequired: 'visual',
        options: [
          {
            text: 'Reemplazar la manguera PCV agrietada y limpiar delicadamente el elemento del MAF con spray dieléctrico específico sin residuo.',
            isCorrect: true,
            feedback: '¡Diagnóstico Exitoso! Tras reemplazar la manguera y limpiar el MAF, los Fuel Trims regresaron a valores normales (+2% STFT / +3% LTFT) y el código P0171 fue borrado.',
            nextStepId: 'final'
          },
          {
            text: 'Cambiar la computadora de motor (ECU) por fallo de procesador.',
            isCorrect: false,
            feedback: 'Incorrecto. La ECU funcionaba perfectamente calculando la corrección de combustible ante la falla física de vacío.'
          }
        ]
      }
    ],
    finalExplanation: 'En el motor Toyota 1NZ-FE 1.5L, el código P0171 es causado frecuentemente por acumulación de contaminantes en las resistencias del sensor MAF combinado con grietas en las mangueras de vacío PCV. La metodología comprobó la hipótesis mediante la prueba de respuesta dinámica de los Fuel Trims.',
    xpReward: 150,
    rewardXp: 150,
    relatedCourseId: 'inj-elec-master',
    relatedLabId: 'maf-lab'
  },
  {
    id: 'case-u0100-vw',
    title: 'Sin Arranque y Pérdida de Comunicación CAN Bus en VW Golf TSI',
    vehicle: 'Volkswagen Golf VII 1.4 TSI',
    brandId: 'volkswagen',
    engine: '1.4 TSI EA211',
    system: 'Red CAN Bus',
    symptom: 'El motor da marcha pero no enciende. Destellan los testigos de ABS, Dirección Asistida y Airbag en el cuadro de instrumentos.',
    dtcCode: 'U0100 - Lost Communication with ECM/PCM A',
    difficulty: 'Avanzado',
    category: 'Redes & CAN Bus',
    initialLiveData: [
      { parameter: 'Estado de Red CAN', value: 'Bus Off / Falla de Nódulo', unit: '-', normalRange: 'Normal / Activa' },
      { parameter: 'Comunicación ECU Motor', value: 'Sin Respuesta', unit: '-', normalRange: 'Conectado' },
      { parameter: 'Voltaje B+ ECU Pin 30', value: '12.4', unit: 'V', normalRange: '12.0-14.2V' },
      { parameter: 'Voltaje Ignición +15', value: '0.0', unit: 'V', normalRange: '12.0V con Llave ON' }
    ],
    physicalMeasurements: [
      { testName: 'Resistencia Pines 6-14 DLC', toolUsed: 'Multímetro Ω (Batería OFF)', resultValue: '120 Ω', status: 'Anómalo' },
      { testName: 'Voltaje CAN High Pin 6', toolUsed: 'Osciloscopio VDC', resultValue: '2.5 V constante', status: 'Anómalo' },
      { testName: 'Voltaje CAN Low Pin 14', toolUsed: 'Osciloscopio VDC', resultValue: '2.5 V constante', status: 'Anómalo' }
    ],
    hints: [
      {
        id: 'h-vw-1',
        title: 'Pista 1: Lectura de Resistencia 120Ω en DLC',
        content: 'Si la medición entre CAN H y CAN L arroja 120Ω en lugar de los 60Ω estándar, indica que una de las dos resistencias terminadoras está desconectada de la red (frecuentemente la integrada en la propia ECU de motor).',
        xpPenalty: 15
      },
      {
        id: 'h-vw-2',
        title: 'Pista 2: Falta de Voltaje de Ignición +15',
        content: 'Verifica si el relé principal de potencia del motor (Relé 458 / 645 en caja de fusibles de vano motor) se activa al girar la llave a la posición ON.',
        xpPenalty: 20
      }
    ],
    steps: [
      {
        id: 'step-1',
        stepNumber: 1,
        title: 'Prueba de Resistencia de Red CAN C',
        instruction: 'Mides 120 Ω entre el Pin 6 y el Pin 14 del conector OBD-II. ¿Qué conclusión técnica se deriva de este valor?',
        toolRequired: 'multimeter',
        options: [
          {
            text: 'Una de las dos resistencias terminadoras de 120Ω está aislada, o la ECU de motor no está energizada.',
            isCorrect: true,
            feedback: '¡Exacto! Al estar aislada la ECU del motor (donde reside una de las resistencias de cierre), la red pierde el paralelismo y la resistencia salta a 120Ω.',
            nextStepId: 'step-2'
          },
          {
            text: 'El cable CAN High está en cortocircuito directo a masa.',
            isCorrect: false,
            feedback: 'Incorrecto. Un cortocircuito a masa marcaría cerca de 0 Ω o alteraría drásticamente los voltajes de masa.'
          }
        ]
      },
      {
        id: 'step-2',
        stepNumber: 2,
        title: 'Comprobación de Alimentación de la ECU',
        instruction: 'Verificas el terminal de alimentación de ignición (+15) en el conector de la ECU de motor y mides 0.0V con el contacto en ON. ¿Cuál es la causa física?',
        toolRequired: 'multimeter',
        options: [
          {
            text: 'El relé de alimentación principal del motor (Relé 645) no conmuta por terminales sulfatados o bobina abierta.',
            isCorrect: true,
            feedback: '¡Muy bien! Sin alimentación de ignición, la ECU permanece apagada, no responde en CAN Bus (DTC U0100) y no cierra la resistencia terminadora de red.',
            nextStepId: 'step-3'
          },
          {
            text: 'Inmovilizador antirobo desprogramado.',
            isCorrect: false,
            feedback: 'Incorrecto. El inmovilizador bloquea el arranque o la inyección, pero no corta la alimentación física de ignición +15 de la ECU.'
          }
        ]
      },
      {
        id: 'step-3',
        stepNumber: 3,
        title: 'Reemplazo de Relé y Verificación Final',
        instruction: 'Sustituyes el relé principal defectuoso por un repuesto original y reevalúas la red. ¿Qué valores restablecen el funcionamiento normal?',
        toolRequired: 'scanner',
        options: [
          {
            text: 'La resistencia en pines 6-14 regresa a 60 Ω, los voltajes de CAN H/L vuelven a oscilar a 3.5V/1.5V, la ECU responde al escáner y el motor enciende inmediatamente.',
            isCorrect: true,
            feedback: '¡Solución Exitosa! Al restaurar el relé principal, la ECU encendió, completó el circuito CAN a 60 Ω y reanudó la comunicación con el cuadro y el escáner.',
            nextStepId: 'final'
          },
          {
            text: 'Reprogramar el software de la ECU mediante Flash J2534.',
            isCorrect: false,
            feedback: 'Incorrecto. Reprogramar una ECU que no estaba encendiendo físicamente habría sido un procedimiento riesgoso e inútil.'
          }
        ]
      }
    ],
    finalExplanation: 'En la plataforma MQB de Volkswagen, la falta de comunicación U0100 suele provenir de la falta de alimentación +15 de la ECU por fallo en el relé de potencia principal. La medición de impedancia de 120Ω en el DLC fue la pista definitiva de que la ECU de motor estaba fuera de línea.',
    xpReward: 180,
    rewardXp: 180,
    relatedCourseId: 'canbus-diag',
    relatedLabId: 'canbus-lab'
  },
  {
    id: 'case-p0340-nissan',
    title: 'Fallo de Arrancado Frecuente y DTC P0340 en Nissan Sentra 1.8L',
    vehicle: 'Nissan Sentra 2017 1.8L MRA8DE',
    brandId: 'nissan',
    engine: 'MRA8DE 1.8L',
    system: 'Sensores de Motor',
    symptom: 'El motor tarda de 5 a 10 segundos en arrancar (Cranteo largo). Una vez encendido, no pasa de 3000 RPM por modo de protección.',
    dtcCode: 'P0340 - Camshaft Position Sensor Circuit Bank 1',
    difficulty: 'Intermedio',
    category: 'Sensores de Motor',
    initialLiveData: [
      { parameter: 'RPM Motor', value: '720', unit: 'RPM', normalRange: '700-800 RPM' },
      { parameter: 'Señal CMP Camshaft', value: 'Inestable / Caídas a 0V', unit: '-', normalRange: 'Onda Cuadrada 0-5V Limpia' },
      { parameter: 'Señal CKP Crankshaft', value: 'Correcta', unit: '-', normalRange: 'Onda Cuadrada 0-5V Limpia' }
    ],
    physicalMeasurements: [
      { testName: 'Alimentación VREF Pin 1 CMP', toolUsed: 'Multímetro VDC', resultValue: '5.01 V', status: 'Normal' },
      { testName: 'Masa de Sensor Pin 2 CMP', toolUsed: 'Multímetro VDC', resultValue: '0.012 V', status: 'Normal' },
      { testName: 'Señal en Osciloscopio Pin 3 CMP', toolUsed: 'Osciloscopio', resultValue: 'Onda cuadrada con deformación en bordes de flanco por calor', status: 'Anómalo' }
    ],
    hints: [
      {
        id: 'h-nis-1',
        title: 'Pista 1: Sensores de Efecto Hall Nissan',
        content: 'Los sensores CMP de cuerpo de plástico en motores Nissan MRA8DE / MR20DE suelen sufrir grietas térmicas en el encapsulado interno del elemento Hall al calentarse.',
        xpPenalty: 10
      }
    ],
    steps: [
      {
        id: 'step-1',
        stepNumber: 1,
        title: 'Comprobación Eléctrica del Arnés',
        instruction: 'Verificas 5.0V de alimentación y 0.01V de masa en el conector del sensor CMP. ¿Qué descarta esta prueba?',
        toolRequired: 'multimeter',
        options: [
          {
            text: 'Descarta líneas abiertas o altas resistencias en el cableado y confirma que el fallo es interno en el sensor CMP.',
            isCorrect: true,
            feedback: '¡Correcto! Al estar perfectas las alimentaciones, la anomalía proviene del transductor electrónico del sensor.',
            nextStepId: 'step-2'
          },
          {
            text: 'Descarta la cadena de distribución desincronizada.',
            isCorrect: false,
            feedback: 'Incorrecto. La alimentación eléctrica no confirma la posición mecánica de las levas.'
          }
        ]
      },
      {
        id: 'step-2',
        stepNumber: 2,
        title: 'Verificación con Osciloscopio y Reemplazo',
        instruction: 'Capturas la señal con el motor a 90°C y observas que la onda cuadrada de 5V colapsa en bordes redondeados. Reemplazas el sensor CMP por repuesto genuino. ¿Cuál es el resultado?',
        toolRequired: 'oscilloscope',
        options: [
          {
            text: 'La señal de onda cuadrada se restablece nítida de 0V a 5V, el motor arranca en menos de 1 segundo y el DTC P0340 se borra.',
            isCorrect: true,
            feedback: '¡Excelente! El sensor de repuesto genuino restauró la velocidad de sincronismo que la ECU requería para inyectar en fase.',
            nextStepId: 'final'
          },
          {
            text: 'El vehículo sigue fallando porque faltaba borrar el aprendizaje de la mariposa.',
            isCorrect: false,
            feedback: 'Incorrecto. El código P0340 no se relaciona con la mariposa sino con la fase de encendido/inyección.'
          }
        ]
      }
    ],
    finalExplanation: 'En el motor Nissan 1.8L MRA8DE, los sensores CMP tipo Hall sufren degradación de semiconductor por ciclaje térmico. La comprobación del arnés aisló la falla al propio componente sin necesidad de cambiar arneses o computadoras.',
    xpReward: 140,
    rewardXp: 140,
    relatedCourseId: 'sensors-pro',
    relatedLabId: 'cmp-lab'
  }
];
