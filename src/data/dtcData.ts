import { DTCModel } from '../types';

export const MASTER_DTC_DATABASE: DTCModel[] = [
  // 1. P0101 - MAF Sensor Range/Performance (GENÉRICO / SENSOR)
  {
    id: 'dtc-p0101',
    code: 'P0101',
    title: 'Rango / Rendimiento del Circuito del Sensor de Flujo de Masa de Aire (MAF)',
    description: 'El módulo de control del motor (ECM/PCM) detecta que la señal de masa de aire entregada por el sensor MAF está fuera del rango lógico calculado en función de las RPM del motor, posición de mariposa (TPS) y presión de admisión (MAP).',
    category: 'SENSOR',
    system: 'Inyección y Control de Mezcla Aire/Combustible',
    severity: 'Media',
    symptoms: [
      'Luz Check Engine (MIL) encendida',
      'Inestabilidad en ralentí o apagado intempestivo',
      'Pérdida de potencia y respuesta lenta al acelerar',
      'Consumo elevado de combustible y humo negro en escape'
    ],
    possibleCauses: [
      'Elemento caliente del sensor MAF sucio con aceite o polvo',
      'Fuga de aire de admisión después del sensor MAF (fuga de vacío)',
      'Filtro de aire extremadamente obstruido o deformado',
      'Caída de tensión o falso contacto en el conector del sensor MAF',
      'Conducto de admisión roto o abrazadera suelta'
    ],
    diagnosticApproach: 'Evaluación metódica de la integridad del ducto de admisión, medición del flujo en gramos por segundo (g/s) a ralentí y 2500 RPM con escáner, y verificación de la señal de frecuencia o voltaje con osciloscopio.',
    diagnosticProcedure: [
      {
        stepNumber: 1,
        symptom: 'Jaloneo suave en aceleración y ralentí inestable',
        dtc: 'P0101',
        inspection: 'Inspección visual del conducto de hule entre el filtro de aire y el cuerpo de aceleración.',
        test: 'Comprobación de grietas o abrazaderas flojas.',
        testType: 'visual',
        result: 'Se detecta fisura pequeña en la manguera de fuelle tras el sensor MAF.',
        interpretation: 'Entrada de aire no medido (aire pirata) que diluye la lectura del MAF.',
        nextStep: 'Reemplazar manguera de admisión y borrar códigos de falla.'
      },
      {
        stepNumber: 2,
        symptom: 'Luz Check Engine activa con código P0101 almacenado',
        dtc: 'P0101',
        inspection: 'Revisión de parámetros en datos en vivo con el escáner.',
        test: 'Monitoreo de flujo MAF (g/s) en ralentí (650 RPM) en motor a 90°C.',
        testType: 'datos en vivo',
        result: 'Lectura de 1.1 g/s (el rango normal para motor 2.0L es 2.0 a 3.5 g/s).',
        interpretation: 'Sensor MAF descalibrado o filamento de platino contaminado.',
        nextStep: 'Proceder a la limpieza dieléctrica del filamento o prueba eléctrica.'
      },
      {
        stepNumber: 3,
        symptom: 'Valores de flujo MAF anormalmente bajos',
        dtc: 'P0101',
        inspection: 'Verificación eléctrica en los pines del sensor MAF.',
        test: 'Medición de alimentación (+12V Batería, +5V Referencia) y Masa de Sensor.',
        testType: 'alimentación',
        result: 'Alimentación de 12.1V en Pin 2 y Masa constante de 0.02V en Pin 1.',
        interpretation: 'El circuito eléctrico de alimentación y tierra del MAF está en perfecto estado.',
        nextStep: 'Realizar captura de la señal de salida con osciloscopio.'
      },
      {
        stepNumber: 4,
        symptom: 'Respuesta lenta al acelerar a fondo (WOT)',
        dtc: 'P0101',
        inspection: 'Conexión de canal 1 del osciloscopio al cable de señal del MAF.',
        test: 'Captura de respuesta analógica/frecuencia durante un acelerón rápido a fondo.',
        testType: 'osciloscopio',
        result: 'Pico máximo de voltaje alcanza sólo 3.1V en lugar de superar 4.2V a 4.8V.',
        interpretation: 'Agotamiento del filamento caliente del sensor MAF por desgaste térmico.',
        nextStep: 'Sustituir sensor MAF por repuesto original OEM y realizar aprendizaje.'
      }
    ],
    recommendedTests: [
      'Monitorear flujo de masa de aire (g/s) a ralentí y 2500 RPM',
      'Limpieza del filamento caliente con solvente limpiador de MAF',
      'Prueba de humo presurizado para fugas de aire de admisión',
      'Comprobar curva de señal analógica/frecuencia con osciloscopio'
    ],
    relatedVehicles: ['Nissan Sentra 1.8L', 'Toyota Corolla 1.8L', 'Volkswagen Jetta 2.0L', 'Chevrolet Cruze 1.4T'],
    relatedCourses: ['diagnostico-maf-map-carga-motor', 'diagnostico-obd2'],
    relatedCases: ['case-001-maf-sucio', 'case-011-fuel-trim-p0171'],
    relatedLabs: ['lab-maf-scope', 'oscilloscope-lab'],
    relatedComponents: {
      sensors: ['Sensor MAF', 'Sensor MAP', 'Sensor TPS'],
      ecu: ['ECM / PCM Engine Control Module']
    },
    status: 'PUBLISHED',
    isVerified: true
  },

  // 2. P0171 - System Too Lean Bank 1 (EMISIONES / GENÉRICO)
  {
    id: 'dtc-p0171',
    code: 'P0171',
    title: 'Sistema Demasiado Magro / Pobre (Banco 1)',
    description: 'El módulo de control del motor detecta que la relación aire/combustible en el Banco 1 es excesivamente pobre. Los ajustes de combustible a largo plazo (LTFT) han superado el umbral del +20% al +25% para compensar el exceso de oxígeno.',
    category: 'EMISIONES',
    system: 'Inyección y Control de Mezcla Aire/Combustible',
    severity: 'Media',
    symptoms: [
      'Inestabilidad o titubeo en ralentí',
      'Vacilación o falta de respuesta al presionar el acelerador',
      'Código de error P0171 guardado en memoria',
      'Posibles explosiones leves en el múltiple de admisión'
    ],
    possibleCauses: [
      'Fuga de vacío en mangueras, junta de admisión o válvula PCV',
      'Sensor MAF sucio o descalibrado',
      'Baja presión en el riel de inyectores (bomba fatigada o filtro obstruido)',
      'Inyectores de combustible parcialmente tapados',
      'Fuga en el múltiple de escape antes del sensor O2 primario'
    ],
    diagnosticApproach: 'Verificación del comportamiento de los Fuel Trims (STFT y LTFT) a ralentí versus 2500 RPM para diferenciar entre fuga de vacío y falta de suministro de combustible.',
    diagnosticProcedure: [
      {
        stepNumber: 1,
        symptom: 'Ralentí inestable que se estabiliza al acelerar a 2500 RPM',
        dtc: 'P0171',
        inspection: 'Visualización de datos de combustible en vivo en el escáner.',
        test: 'Lectura de STFT y LTFT a ralentí y a 2500 RPM.',
        testType: 'datos en vivo',
        result: 'LTFT +24% en ralentí; baja a +4% al acelerar a 2500 RPM.',
        interpretation: 'Comportamiento típico de fuga de vacío en admisión (el aire entrante se diluye a mayor flujo).',
        nextStep: 'Realizar prueba de humo o búsqueda de fugas físicas.'
      },
      {
        stepNumber: 2,
        symptom: 'Presencia de silbido leve en la bahía del motor',
        dtc: 'P0171',
        inspection: 'Inyección de humo presurizado a 5 PSI en el ducto de admisión.',
        test: 'Prueba de estanqueidad de vacío con maquina de humo.',
        testType: 'presión',
        result: 'Se observa salida de humo por la junta de la válvula PCV.',
        interpretation: 'Diafragma de la válvula PCV roto permitiendo ingreso continuo de aire sin medir.',
        nextStep: 'Reemplazar válvula PCV y verificar vacíos del motor.'
      },
      {
        stepNumber: 3,
        symptom: 'LTFT alto tanto en ralentí (+22%) como a 2500 RPM (+25%)',
        dtc: 'P0171',
        inspection: 'Verificación de la presión hidráulica de gasolina.',
        test: 'Conectar manómetro en el puerto de prueba del riel de inyectores.',
        testType: 'presión',
        result: 'Presión de 28 PSI en lugar del valor especificado de 45 PSI.',
        interpretation: 'Bomba de combustible fatigada o regulador de presión defectuoso.',
        nextStep: 'Comprobar filtro de gasolina y bomba de combustible.'
      }
    ],
    recommendedTests: [
      'Prueba de humo para fugas de vacío en múltiple y mangueras',
      'Monitoreo de STFT/LTFT con limpiador de carburador',
      'Medición de presión y caudal de gasolina con manómetro',
      'Verificación del sensor de oxígeno O2 B1S1 con osciloscopio'
    ],
    relatedVehicles: ['Toyota Yaris 1.5L', 'Honda Civic 1.8L', 'Ford Focus 2.0L', 'Nissan Versa 1.6L'],
    relatedCourses: ['diagnostico-obd2', 'inyeccion-gasolina-gdi-pfi'],
    relatedCases: ['case-002-fuga-vacio', 'case-011-fuel-trim-p0171'],
    relatedLabs: ['multimeter-lab', 'lab-fuel-trim-analysis'],
    relatedComponents: {
      sensors: ['Sensor MAF', 'Sensor O2 Primario', 'Sensor MAP'],
      actuators: ['Inyectores de Combustible', 'Válvula PCV']
    },
    status: 'PUBLISHED',
    isVerified: true
  },

  // 3. P0172 - System Too Rich Bank 1 (EMISIONES / GENÉRICO)
  {
    id: 'dtc-p0172',
    code: 'P0172',
    title: 'Sistema Demasiado Rico (Banco 1)',
    description: 'El ECM detecta que la mezcla de combustible en el Banco 1 es excesivamente rica. Los ajustes de combustible a largo plazo (LTFT) han alcanzado el umbral negativo del -20% al -25% intentando recortar combustible.',
    category: 'EMISIONES',
    system: 'Inyección y Control de Mezcla Aire/Combustible',
    severity: 'Media',
    symptoms: [
      'Olor intenso a gasolina cruda en el tubo de escape',
      'Humo negro al acelerar',
      'Hollín negro en las bujías de encendido',
      'Inestabilidad y pérdida de eficiencia de combustible'
    ],
    possibleCauses: [
      'Inyector de combustible goteando o trancado abierto',
      'Alta presión de combustible por regulador de presión atascado',
      'Válvula Purga EVAP atascada abierta (aspira vapores saturados)',
      'Sensor MAF contaminado reportando aire de más',
      'Sensor de temperatura de refrigerante (ECT) marcando motor frío congelado'
    ],
    diagnosticApproach: 'Monitoreo de Fuel Trims despinchando la manguera de la purga EVAP, verificación de presión de combustible y prueba de goteo de inyectores.',
    diagnosticProcedure: [
      {
        stepNumber: 1,
        symptom: 'Olor a gasolina en ralentí y LTFT en -25%',
        dtc: 'P0172',
        inspection: 'Desconexión de la manguera de la válvula de purga de la cánula EVAP y taponamiento.',
        test: 'Monitoreo del ajuste de combustible STFT.',
        testType: 'datos en vivo',
        result: 'El STFT pasa de -20% inmediatamente a 0% al estrangular la manguera EVAP.',
        interpretation: 'La válvula de purga EVAP se quedó atascada mecánicamente abierta introduciendo vapores saturados.',
        nextStep: 'Reemplazar válvula solenoide de purga EVAP.'
      },
      {
        stepNumber: 2,
        symptom: 'Bujías del cilindro 2 y 3 húmedas de combustible',
        dtc: 'P0172',
        inspection: 'Prueba de estanqueidad de inyectores en laboratorio.',
        test: 'Prueba de pulso y presión a 40 PSI en tina de ultrasónica.',
        testType: 'presión',
        result: 'Inyector 2 presenta goteo continuo sin pulso eléctrico.',
        interpretation: 'Inyector trancado mecánicamente por suciedad en la aguja.',
        nextStep: 'Limpieza con ultrasonido o reemplazo del inyector defectuoso.'
      }
    ],
    recommendedTests: [
      'Estrangular manguera de purga EVAP monitoreando STFT',
      'Prueba de goteo de inyectores con probetas graduadas',
      'Medición de presión de combustible en riel',
      'Comprobar lectura del sensor ECT en datos en vivo'
    ],
    relatedVehicles: ['Volkswagen Golf 2.0 TSI', 'Chevrolet Aveo 1.6L', 'Ford EcoSport 2.0L'],
    relatedCourses: ['inyeccion-gasolina-gdi-pfi', 'diagnostico-obd2'],
    relatedCases: ['case-007-gdi-baja-presion'],
    relatedLabs: ['lab-fuel-trim-analysis'],
    relatedComponents: {
      sensors: ['Sensor ECT', 'Sensor MAF', 'Sensor O2'],
      actuators: ['Inyectores', 'Solenoide Purga EVAP']
    },
    status: 'PUBLISHED',
    isVerified: true
  },

  // 4. P0299 - Turbocharger Underboost (ACTUADOR / GENÉRICO)
  {
    id: 'dtc-p0299',
    code: 'P0299',
    title: 'Condición de Baja Presión de Sobrealimentación del Turbocompresor (Underboost)',
    description: 'La ECU del motor detecta que la presión de aire medida en el múltiple de admisión (MAP / Boost Sensor) es significativamente inferior a la presión de sobrealimentación objetivo calculada.',
    category: 'ACTUADOR',
    system: 'Sistema de Sobrealimentación Turbo y Carga de Motor',
    severity: 'Alta',
    symptoms: [
      'Pérdida drástica de potencia al acelerar a fondo',
      'Respuesta tardía del turbo (Turbo Lag severo)',
      'Luz Check Engine activa y modo de protección (Limp Mode)',
      'Silbido fuerte de escape de aire debajo del capó'
    ],
    possibleCauses: [
      'Fuga de aire en mangueras de intercooler o manguito roto',
      'Válvula de descarga del turbo (Wastegate) trancada abierta',
      'Solenoide de control de vacío de la Wastegate/N75 fallando',
      'Fuga en el actuador neumático de geométría variable (VGT)',
      'Desgaste interno o holgura excesiva en la turbina del turbocompresor'
    ],
    diagnosticApproach: 'Inspección de mangueras de sobrealimentación con prueba de presión, prueba de vacío en el actuador de la wastegate y medición de la señal de control PWM del solenoide N75.',
    diagnosticProcedure: [
      {
        stepNumber: 1,
        symptom: 'Silbido agudo al aumentar las RPM del turbo y pérdida de potencia',
        dtc: 'P0299',
        inspection: 'Prueba de presión con tapón sellador en la entrada del intercooler a 15 PSI.',
        test: 'Inspección visual y auditiva con agua jabonosa.',
        testType: 'presión',
        result: 'Se observan burbujas masivas en la junta inferior del radiador Intercooler.',
        interpretation: 'Fuga de aire de sobrealimentación comprimido hacia la atmósfera.',
        nextStep: 'Reemplazar junta tórica de conexión rápida del intercooler.'
      },
      {
        stepNumber: 2,
        symptom: 'Presión deseada de turbo 1.4 bar, presión real estancada en 0.2 bar',
        dtc: 'P0299',
        inspection: 'Prueba de vacío manual con bomba Mityvac en el pulmón de la Wastegate.',
        test: 'Aplicar 15 inHg de vacío directo a la cápsula de accionamiento.',
        testType: 'eléctrica',
        result: 'La varilla de la wastegate no se desplaza y la bomba no retiene el vacío.',
        interpretation: 'Diafragma de goma roto en la cápsula neumática de la wastegate.',
        nextStep: 'Reemplazar actuador de vacío de la wastegate y calibrar carrera.'
      }
    ],
    recommendedTests: [
      'Prueba de presión de fugas en conductos de Intercooler',
      'Comprobar retención de vacío en pulmón de Wastegate',
      'Medir ciclo de trabajo PWM (%) del solenoide de control N75',
      'Inspección de juego axial de la turbina del turbo'
    ],
    relatedVehicles: ['VW Jetta 1.4 TSI / 2.0 TSI', 'Ford Fusion 2.0 EcoBoost', 'Chevrolet Tracker 1.2T'],
    relatedCourses: ['diagnostico-maf-map-carga-motor', 'diagnostico-obd2'],
    relatedCases: ['case-003-p0299-turbo'],
    relatedLabs: ['lab-oscilloscope-signals'],
    relatedComponents: {
      sensors: ['Sensor MAP1 / MAP2 Boost', 'Sensor MAP'],
      actuators: ['Solenoide N75 / Wastegate', 'Turbocharger Assembly']
    },
    status: 'PUBLISHED',
    isVerified: true
  },

  // 5. P0300 - Random/Multiple Cylinder Misfire (ACTUADOR / GENÉRICO)
  {
    id: 'dtc-p0300',
    code: 'P0300',
    title: 'Detección de Fallo de Encendido Múltiple / Aleatorio en Cilindros (Misfire)',
    description: 'La ECU ha registrado variaciones en la velocidad de rotación del cigüeñal (analizadas mediante la señal del sensor CKP) que indican que múltiples cilindros no están produciendo el par motor esperado.',
    category: 'ACTUADOR',
    system: 'Sistema de Encendido y Combustión',
    severity: 'Alta',
    symptoms: [
      'Temblores fuertes en el motor y vibración en el volante',
      'Luz Check Engine parpadeando (indicando riesgo de daño al catalizador)',
      'Olor a gasolina sin quemar en el escape',
      'Pérdida considerable de fuerza bajo carga'
    ],
    possibleCauses: [
      'Bujías de encendido muy desgastadas o con calibración errónea',
      'Bobinas de encendido (COP) fatigadas o agrietadas',
      'Presión de combustible deficiente o bomba fatigada',
      'Entrada de aire no medido por junta de admisión rota',
      'Inyectores de combustible tapados en múltiples cilindros'
    ],
    diagnosticApproach: 'Identificación de contadores de Misfire por cilindro con escáner, prueba de rampa de corriente en bobinas COP con pinza amperimétrica y verificación de compresión de cilindros.',
    diagnosticProcedure: [
      {
        stepNumber: 1,
        symptom: 'Luz Check Engine parpadeando intermitentemente bajo aceleración',
        dtc: 'P0300',
        inspection: 'Lectura de contadores de Misfire en datos en vivo del escáner.',
        test: 'Conteo de fallos en cilindros 1, 2, 3 y 4 en período de 1000 revoluciones.',
        testType: 'datos en vivo',
        result: 'Cilindro 2 registra 420 fallos, Cilindro 3 registra 380 fallos.',
        interpretation: 'Fallo concentrado principalmente en cilindros contiguos 2 y 3.',
        nextStep: 'Intercambiar bobinas e inspeccionar bujías de cilindros 2 y 3.'
      },
      {
        stepNumber: 2,
        symptom: 'Bujías retiradas muestran desgaste severo del electrodo central',
        dtc: 'P0300',
        inspection: 'Comprobación de la luz (gap) entre electrodos con calibrador de hojas.',
        test: 'Medición de holgura en mm.',
        testType: 'visual',
        result: 'Gap de 1.6 mm (especificación nominal original 1.1 mm).',
        interpretation: 'Distancia excesiva exige mayor voltaje de perforación provocando fugas en la bobina.',
        nextStep: 'Reemplazar bujías por juego nuevo original calibrado.'
      },
      {
        stepNumber: 3,
        symptom: 'Persistencia de fallo tras reemplazar bujías',
        dtc: 'P0300',
        inspection: 'Análisis del secundario/corriente de bobina con osciloscopio y pinza 60A.',
        test: 'Captura de rampa de corriente en bobina COP.',
        testType: 'osciloscopio',
        result: 'Ausencia de tiempo de quemado (Spark time < 0.5 ms).',
        interpretation: 'Bobina de encendido con cortocircuito interno entre espiras del secundario.',
        nextStep: 'Reemplazar bobina COP del cilindro afectado.'
      }
    ],
    recommendedTests: [
      'Monitoreo de contadores de Misfire en tiempo real',
      'Prueba de rampa de corriente en bobinas COP con pinza 60A',
      'Medición de compresión relativa y estática de cilindros',
      'Inspección del estado físico y calibración de bujías'
    ],
    relatedVehicles: ['Chevrolet Cruze 1.8L', 'Nissan Versa 1.6L', 'Ford Fiesta 1.6L', 'Toyota RAV4 2.4L'],
    relatedCourses: ['diagnostico-osciloscopio-automotriz', 'diagnostico-obd2'],
    relatedCases: ['case-004-falla-encendido-cop', 'case-010-compresion-relativa'],
    relatedLabs: ['oscilloscope-lab', 'lab-oscilloscope-signals'],
    relatedComponents: {
      sensors: ['Sensor CKP', 'Sensor CMP'],
      actuators: ['Bobinas COP', 'Bujías', 'Inyectores']
    },
    status: 'PUBLISHED',
    isVerified: true
  },

  // 6. P0335 - Crankshaft Position Sensor A Circuit (SENSOR / GENÉRICO)
  {
    id: 'dtc-p0335',
    code: 'P0335',
    title: 'Circuito A del Sensor de Posición del Cigüeñal (CKP)',
    description: 'El ECM no detecta impulsos válidos de sincronización provenientes del sensor de posición del cigüeñal (CKP) durante el giro del motor de arranque o la marcha normal.',
    category: 'SENSOR',
    system: 'Sincronización y Gestión Electrónica del Motor',
    severity: 'Alta',
    symptoms: [
      'El motor gira pero no arranca (No Crank - No Start)',
      'Apagado repentino del motor en marcha o al llegar a un semáforo',
      'Tacómetro (RPM) no se mueve al dar marcha de arranque',
      'Luz Check Engine encendida'
    ],
    possibleCauses: [
      'Sensor CKP defectuoso o descalibrado',
      'Cable de señal CKP cortado o cortocircuitado a masa/positivo',
      'Dientes mellados o dañados en la Rueda Fónica del cigüeñal',
      'Entrehierro excesivo o virutas metálicas acumuladas en la punta magnética',
      'Falla en el canal de entrada analógico de la ECU'
    ],
    diagnosticApproach: 'Verificación del movimiento de la aguja de RPM en escáner, prueba de resistencia en sensores inductivos, medición de alimentación 5V/12V en Hall y captura de la onda cuadrada/senoidal con osciloscopio.',
    diagnosticProcedure: [
      {
        stepNumber: 1,
        symptom: 'Motor gira al dar marcha pero el tacómetro en el tablero se queda congelado en 0 RPM',
        dtc: 'P0335',
        inspection: 'Verificación de datos en vivo de RPM con escáner durante el arranque.',
        test: 'Lectura del parámetro Engine Speed durante 5 segundos de marcha.',
        testType: 'datos en vivo',
        result: '0 RPM constantes registradas por el escáner.',
        interpretation: 'El ECM no está recibiendo ninguna señal del sensor CKP.',
        nextStep: 'Proceder a prueba eléctrica en el conector del sensor.'
      },
      {
        stepNumber: 2,
        symptom: 'Conector de 3 terminales del sensor CKP tipo Hall desconectado',
        dtc: 'P0335',
        inspection: 'Medición de voltaje con multímetro en la escala de 20V DC en el arnés.',
        test: 'Verificar Alimentación (Pin 1), Masa (Pin 2) y Referencia (Pin 3).',
        testType: 'alimentación',
        result: 'Pin 1: 5.01V, Pin 2: 0.01V (Masa), Pin 3: 4.98V.',
        interpretation: 'Alimentación y tierra del arnés desde la ECU impecables.',
        nextStep: 'Conectar sensor y verificar pulso de salida con osciloscopio.'
      },
      {
        stepNumber: 3,
        symptom: 'Señal CKP ausente al girar el cigüeñal',
        dtc: 'P0335',
        inspection: 'Medición de la onda en el Pin de señal conectando canal 1 del osciloscopio.',
        test: 'Captura de señal cuadrada de 0V a 5V.',
        testType: 'osciloscopio',
        result: 'Voltaje plano constante en 5.0V sin ningun pulso a masa.',
        interpretation: 'Sensor de Efecto Hall dañado internamente (elemento semiconductor quemado).',
        nextStep: 'Reemplazar sensor CKP y verificar arranque.'
      }
    ],
    recommendedTests: [
      'Monitorear RPM en el escáner durante la marcha de arranque',
      'Medición de voltajes de alimentación (+5V / +12V y Tierra) en arnés',
      'Captura de la señal CKP con osciloscopio (frecuencia y forma de onda)',
      'Inspección visual de la rueda fónica con endoscopio'
    ],
    relatedVehicles: ['Nissan Sentra 2.0L', 'Hyundai Accent 1.6L', 'Toyota Hilux 2.5 D-4D', 'Kia Rio 1.4L'],
    relatedCourses: ['diagnostico-osciloscopio-automotriz', 'diagnostico-obd2'],
    relatedCases: ['case-005-ckp-sin-arranque'],
    relatedLabs: ['oscilloscope-lab', 'lab-oscilloscope-signals'],
    relatedComponents: {
      sensors: ['Sensor CKP (Efecto Hall / Inductivo)', 'Sensor CMP'],
      ecu: ['Módulo de Control de Motor ECM']
    },
    status: 'PUBLISHED',
    isVerified: true
  },

  // 7. P0420 - Catalyst System Efficiency Below Threshold (EMISIONES / GENÉRICO)
  {
    id: 'dtc-p0420',
    code: 'P0420',
    title: 'Eficiencia del Sistema Catalizador por Debajo del Umbral (Banco 1)',
    description: 'La ECU compara la actividad de conmutación del sensor de oxígeno secundario (después del catalizador) con la del sensor primario (antes del catalizador). Si el sensor secundario cicla con la misma frecuencia que el primario, el catalizador ha perdido su capacidad de almacenamiento de oxígeno.',
    category: 'EMISIONES',
    system: 'Sistema de Control de Emisiones y Escape',
    severity: 'Baja',
    symptoms: [
      'Luz Check Engine encendida de forma permanente',
      'Ligeros olores azufrados (huevo podrido) en el escape',
      'Posible restricción en la aceleración si el monolito está derretido/obstruido',
      'Fallo en la inspección de emisiones contaminantes'
    ],
    possibleCauses: [
      'Convertidor catalítico degradado o contaminado con aceite/refrigerante',
      'Sensor de oxígeno secundario (Downstream O2) descalibrado o dañado',
      'Fuga de escape entre el sensor primario y el secundario',
      'Misfires no corregidos previamente que sobrecalentaron el catalizador',
      'Mezcla rica prolongada quemando combustible dentro del catalizador'
    ],
    diagnosticApproach: 'Análisis de la gráfica de voltaje del sensor O2 secundario con osciloscopio a 2500 RPM (debe mantenerse recta y estable cerca de 0.6V a 0.8V) y prueba de contrapresión de escape.',
    diagnosticProcedure: [
      {
        stepNumber: 1,
        symptom: 'Luz Check Engine con P0420 como único código',
        dtc: 'P0420',
        inspection: 'Conexión de osciloscopio en Canal 1 (O2 B1S1) y Canal 2 (O2 B1S2).',
        test: 'Monitoreo de señales a 2500 RPM mantenidas durante 3 minutos.',
        testType: 'osciloscopio',
        result: 'Canal 2 (secundario) oscila idénticamente a Canal 1 entre 0.1V y 0.9V.',
        interpretation: 'El catalizador no está reteniendo oxígeno; se comporta como un tubo recto.',
        nextStep: 'Verificar que no existan fugas de escape antes de dictaminar el catalizador.'
      },
      {
        stepNumber: 2,
        symptom: 'Inspección debajo del vehículo',
        dtc: 'P0420',
        inspection: 'Prueba de fugas en la tubería de escape.',
        test: 'Inyección de aire presurizado en la punta del escape con motor apagado.',
        testType: 'visual',
        result: 'Tubería y bridas de escape totalmente selladas sin fugas.',
        interpretation: 'Confirmado el diagnóstico de degradación química del convertidor catalítico.',
        nextStep: 'Reemplazar convertidor catalítico por unidad homologada Euro 4/5.'
      }
    ],
    recommendedTests: [
      'Graficar sensor O2 secundario a 2500 RPM con osciloscopio',
      'Prueba de contrapresión de escape instalando manómetro en orificio de O2',
      'Inspección visual del monolito con endoscopio',
      'Comprobar fugas en bridas de escape'
    ],
    relatedVehicles: ['Honda Civic 1.8L', 'Nissan Sentra 2.0L', 'Toyota RAV4 2.4L', 'Chevrolet Aveo 1.6L'],
    relatedCourses: ['diagnostico-obd2', 'inyeccion-gasolina-gdi-pfi'],
    relatedCases: ['case-006-p0420-catalizador'],
    relatedLabs: ['oscilloscope-lab'],
    relatedComponents: {
      sensors: ['Sensor O2 Primario (B1S1)', 'Sensor O2 Secundario (B1S2)'],
      actuators: ['Convertidor Catalítico']
    },
    status: 'PUBLISHED',
    isVerified: true
  },

  // 8. P0606 - ECM/PCM Processor Fault (ECU / GENÉRICO)
  {
    id: 'dtc-p0606',
    code: 'P0606',
    title: 'Falla del Procesador del Módulo de Control del Motor (ECM / PCM)',
    description: 'El microcontrolador principal de la ECU ha detectado una anomalía crítica en sus rutinas de autodiagnóstico interno, fallo en el coprocesador de monitoreo de seguridad de aceleración o falla de suma de comprobación (Checksum).',
    category: 'ECU',
    system: 'Unidad de Control Electrónico (ECU / ECM)',
    severity: 'Crítica',
    symptoms: [
      'El motor se apaga repentinamente y no vuelve a arrancar',
      'Modo de marcha de emergencia severa (Limp Home) sin respuesta de acelerador',
      'Múltiples códigos de falla incoherentes almacenados al mismo tiempo',
      'Imposibilidad de comunicación con el escáner intermitente'
    ],
    possibleCauses: [
      'Falla física interna del microprocesador o memoria FLASH de la ECU',
      'Infiltración de humedad o agua dentro de la carcasa de la ECU',
      'Proceso de reprogramación o reflash de software interrumpido',
      'Caída severa de voltaje de alimentación de la ECU durante el encendido',
      'Masa de la ECU sulfatada produciendo ruido de alta frecuencia'
    ],
    diagnosticApproach: 'Verificación rigurosa de todas las alimentaciones de +12V directas, +12V bajo ignición y tierras principales de la ECU bajo carga con lámpara de prueba antes de determinar reemplazo de computadora.',
    diagnosticProcedure: [
      {
        stepNumber: 1,
        symptom: 'Vehículo en modo de emergencia con código P0606',
        dtc: 'P0606',
        inspection: 'Revisión del pinout de alimentaciones de la ECU en diagrama eléctrico OEM.',
        test: 'Medición de voltaje bajo carga en los pines de batería e ignición.',
        testType: 'alimentación',
        result: 'Pin de masa B32 presenta caída de tensión de 1.8V al accionar la marcha.',
        interpretation: 'Pérdida de masa principal de la ECU por sulfatación en el perno de chasis.',
        nextStep: 'Limpiar superficie de masa de chasis, aplicar grasa dieléctrica y reevaluar.'
      },
      {
        stepNumber: 2,
        symptom: 'Persistencia del P0606 con alimentaciones de 12.6V y masas de 0.01V perfectas',
        dtc: 'P0606',
        inspection: 'Prueba de la ECU en banco de simulación.',
        test: 'Chequeo de regulador de 5V interno y señal de reloj del cristal.',
        testType: 'eléctrica',
        result: 'El microprocesador calienta excesivamente (>85°C) en menos de 2 minutos.',
        interpretation: 'Daño irreversible en el circuito integrado del microprocesador principal.',
        nextStep: 'Reemplazar o clonar módulo ECU del motor.'
      }
    ],
    recommendedTests: [
      'Verificar caídas de tensión en todas las tierras de la ECU con voltímetro',
      'Comprobar voltajes de alimentación (+12V Batería e Ignición) bajo carga',
      'Proceso de reflash/actualización de firmware con software OEM J2534',
      'Prueba de la ECU en banco de diagnóstico especializado'
    ],
    relatedVehicles: ['Toyota Corolla 1.8L', 'Nissan X-Trail 2.5L', 'Chevrolet Cruze 1.4T', 'Ford Focus 2.0L'],
    relatedCourses: ['diagnostico-reparacion-ecu-automotriz', 'diagnostico-obd2'],
    relatedCases: ['case-015-ecu-sin-5v'],
    relatedLabs: ['lab-ecu-bench-testing'],
    relatedComponents: {
      ecu: ['ECM / PCM Engine Control Module']
    },
    status: 'PUBLISHED',
    isVerified: true
  },

  // 9. P0620 - Generator Control Circuit Fault (LIN / GENÉRICO)
  {
    id: 'dtc-p0620',
    code: 'P0620',
    title: 'Falla en el Circuito de Control del Alternador (Red LIN Bus)',
    description: 'El módulo ECM pierde la comunicación o detecta una falla en la señal de control PWM o bus LIN entre la ECU y el regulador de voltaje inteligente del alternador.',
    category: 'LIN',
    system: 'Sistema de Carga e Inteligencia de Batería',
    severity: 'Media',
    symptoms: [
      'Testigo de batería encendido en el tablero de instrumentos',
      'Voltaje de carga fijo en modo de emergencia (13.8V a 14.2V)',
      'Parpadeo de luces en ralentí',
      'Código de error P0620 o U0120 almacenado en memoria'
    ],
    possibleCauses: [
      'Cable de comunicación LIN del alternador cortado o pelado contra el motor',
      'Regulador inteligente de voltaje del alternador defectuoso',
      'Falla del módulo de control del motor (salida LIN dañada)',
      'Sensor Inteligente de Batería (IBS) dañado interfiriendo en el bus LIN'
    ],
    diagnosticApproach: 'Captura de la trama de datos LIN Bus de 12V con osciloscopio en el pin de control del alternador para determinar si la ECU transmite la cabecera.',
    diagnosticProcedure: [
      {
        stepNumber: 1,
        symptom: 'Luz de batería encendida pero alternador cargando a 13.9V',
        dtc: 'P0620',
        inspection: 'Desconexión del enchufe de control del alternador.',
        test: 'Captura de señal con osciloscopio en el cable LIN proveniente de la ECU.',
        testType: 'osciloscopio',
        result: 'Se observa pulso cuadrado perfecto de 0V a 12V con datos LIN.',
        interpretation: 'La ECU está enviando correctamente el mando de voltaje de carga.',
        nextStep: 'Inspeccionar el conector y regulador interno del alternador.'
      },
      {
        stepNumber: 2,
        symptom: 'Señal LIN plana constante en 12V sin ningun pulso a masa',
        dtc: 'P0620',
        inspection: 'Prueba de continuidad del cable LIN desde el alternador hasta el pin de la ECU.',
        test: 'Medición de resistencia en Ohmios.',
        testType: 'continuidad',
        result: 'Resistencia infinita (circuito abierto).',
        interpretation: 'Cable LIN roto en el arnés inferior del alternador.',
        nextStep: 'Reparar cableado y borrar códigos DTC.'
      }
    ],
    recommendedTests: [
      'Capturar trama LIN Bus (12V a 0V) con osciloscopio',
      'Prueba de continuidad del arnés entre alternador y ECU',
      'Monitorear carga deseada vs real en datos en vivo del escáner',
      'Verificar fusible del sistema de carga'
    ],
    relatedVehicles: ['Ford Focus 2.0L Duratec', 'BMW 320i F30', 'Mercedes C200', 'Audi A4 2.0 TFSI'],
    relatedCourses: ['can-bus-lin-bus-diagnostico-redes', 'electronica-automotriz'],
    relatedCases: ['case-012-linbus-alternador'],
    relatedLabs: ['lab-lin-bus-decode'],
    relatedComponents: {
      sensors: ['Sensor IBS Batería'],
      actuators: ['Regulador de Alternador Inteligente'],
      ecu: ['ECM Engine Control Module']
    },
    status: 'PUBLISHED',
    isVerified: true
  },

  // 10. P0700 - Transmission Control System Fault (TRANSMISIÓN / GENÉRICO)
  {
    id: 'dtc-p0700',
    code: 'P0700',
    title: 'Falla Solicitada por el Módulo de Control de la Transmisión (TCM)',
    description: 'El código P0700 es un código informativo en el ECM que indica que el módulo de control de la transmisión (TCM) ha detectado un fallo grave en la caja de cambios automática y ha solicitado encender la luz Check Engine.',
    category: 'TRANSMISIÓN',
    system: 'Transmisión Automática / CVT / DSG',
    severity: 'Alta',
    symptoms: [
      'Caja de cambios bloqueada en 3ª velocidad (Modo Protegido / Limp Home)',
      'Golpe o impacto fuerte al engranar Reversa o Drive',
      'Patinamiento de cambios al acelerar',
      'Luz Check Engine encendida'
    ],
    possibleCauses: [
      'Presencia de códigos específicos de falla en el módulo TCM (ej. P0841, P0750)',
      'Fuga o nivel muy bajo de fluido de transmisión hidráulica (ATF / CVT)',
      'Solenoides de cambio o de presión con falla eléctrica',
      'Falso contacto en el conector principal del cuerpo de válvulas',
      'Sobrecalentamiento excesivo del aceite de la transmisión'
    ],
    diagnosticApproach: 'Ingresar específicamente al módulo de diagnóstico de la Transmisión (TCM) con el escáner para leer los códigos de falla secundarios específicos.',
    diagnosticProcedure: [
      {
        stepNumber: 1,
        symptom: 'Vehículo atascado en 3ª marcha con P0700 en el motor',
        dtc: 'P0700',
        inspection: 'Escanear el sistema de la Transmisión (TCM) de forma dedicada.',
        test: 'Lectura de memoria de DTCs del TCM.',
        testType: 'comunicación',
        result: 'Se encuentra el código específico P0841 (Rango de Presión de Aceite CVT).',
        interpretation: 'El P0700 es solo la bandera enviada al motor; la falla real reside en la presión hidráulica de la CVT.',
        nextStep: 'Proceder con la guía diagnóstica para el código P0841.'
      }
    ],
    recommendedTests: [
      'Escanear el módulo TCM directamente',
      'Verificar nivel y estado térmico del fluido ATF/CVT',
      'Probar continuidad del arnés principal de la transmisión',
      'Verificar presiones hidráulicas en puertos de prueba'
    ],
    relatedVehicles: ['Nissan Sentra CVT', 'VW Jetta Tiptronic', 'Chevrolet Cruze 6T40', 'Toyota Corolla CVT'],
    relatedCourses: ['transmisiones-cvt-dct-dsg', 'diagnostico-obd2'],
    relatedCases: ['case-013-dsg-sin-reversa', 'case-017-cvt-patinamiento'],
    relatedLabs: ['lab-cvt-pressures'],
    relatedComponents: {
      ecu: ['TCM Transmission Control Module'],
      actuators: ['Solenoides de Cuerpo de Válvulas']
    },
    status: 'PUBLISHED',
    isVerified: true
  },

  // 11. P0841 - Transmission Fluid Pressure Sensor/Switch A Circuit (TRANSMISIÓN / FABRICANTE)
  {
    id: 'dtc-p0841',
    code: 'P0841',
    title: 'Rango / Rendimiento del Circuito del Sensor A de Presión de Fluido de Transmisión (CVT)',
    description: 'El TCM detecta que la presión hidráulica real medida por el sensor de presión de la polea secundaria no coincide con la presión hidráulica requerida por el mapa de control de la caja CVT.',
    category: 'FABRICANTE',
    system: 'Transmisión de Variación Continua (CVT)',
    severity: 'Alta',
    symptoms: [
      'Patinamiento severo de la transmisión en pendientes o al acelerar a fondo',
      'Pérdida súbita de tracción y aumento brusco de RPM del motor sin avanzar',
      'Luz de advertencia de transmisión encendida',
      'Código P0841 grabado en el TCM'
    ],
    possibleCauses: [
      'Válvula reguladora de presión en el cuerpo de válvulas atascada por virutas',
      'Filtro de aceite CVT completamente saturado',
      'Sensor de presión hidráulica defectuoso o fuera de tolerancia',
      'Desgaste excesivo y rayado en los conos del variador y correa metálica'
    ],
    diagnosticApproach: 'Verificación del nivel de aceite CVT, monitoreo de la presión primaria y secundaria en datos en vivo y medición de resistencia del solenoide de línea.',
    diagnosticProcedure: [
      {
        stepNumber: 1,
        symptom: 'Patinamiento al arrancar en pendientes calientes',
        dtc: 'P0841',
        inspection: 'Lectura de datos en vivo de la presión de polea secundaria.',
        test: 'Comparación entre Presión Deseada (Target Pressure) y Presión Real.',
        testType: 'datos en vivo',
        result: 'Presión deseada 4.5 MPa, Presión real se desploma a 0.8 MPa.',
        interpretation: 'Fuga interna masiva de presión de aceite hidráulico en el cuerpo de válvulas.',
        nextStep: 'Desmontar cárter de caja CVT e inspeccionar presencia de virutas metálicas.'
      },
      {
        stepNumber: 2,
        symptom: 'Presencia de limadura de aluminio abundante en los imanes del cárter',
        dtc: 'P0841',
        inspection: 'Inspección visual de la superficie de la correa de acero con endoscopio.',
        test: 'Revisión de rayado en los conos del variador.',
        testType: 'visual',
        result: 'Surcos profundos en las caras cónicas del variador secundario.',
        interpretation: 'Daño mecánico irreparable por fricción metal-metal por falta de presión.',
        nextStep: 'Reemplazar o reconstruir completamente la transmisión CVT.'
      }
    ],
    recommendedTests: [
      'Comparar presión deseada vs presión real en datos en vivo',
      'Inspección de imanes del cárter de transmisión',
      'Prueba de resistencia de solenoides de presión con multímetro',
      'Verificación del estado térmico e índice de degradación del fluido'
    ],
    relatedVehicles: ['Nissan Sentra 1.8L CVT Jatco', 'Nissan Altima 2.5L CVT', 'Mitsubishi Lancer CVT'],
    relatedCourses: ['transmisiones-cvt-dct-dsg', 'diagnostico-obd2'],
    relatedCases: ['case-017-cvt-patinamiento'],
    relatedLabs: ['lab-cvt-pressures'],
    relatedComponents: {
      sensors: ['Sensor de Presión Secundaria CVT'],
      actuators: ['Solenoide de Presión de Línea', 'Cuerpo de Válvulas']
    },
    status: 'PUBLISHED',
    isVerified: true
  },

  // 12. P2135 - Throttle/Pedal Position Sensor/Switch A/B Voltage Correlation (SENSOR / FABRICANTE)
  {
    id: 'dtc-p2135',
    code: 'P2135',
    title: 'Correlación de Voltaje de Sensores TPS A y B de Posición de Mariposa de Aceleración',
    description: 'La ECU del motor detecta una discrepancia no permitida entre la señal del Sensor TPS 1 y del Sensor TPS 2 alojados en el cuerpo de aceleración electrónico (Drive-by-Wire) durante más de 10 milisegundos.',
    category: 'SENSOR',
    system: 'Aceleración Electrónica y Control Mariposa (Drive-by-Wire)',
    severity: 'Alta',
    symptoms: [
      'Entrada instantánea en Modo de Emergencia (Limp Home) a 1200 RPM fijas',
      'El pedal del acelerador no responde en absoluto',
      'Mensaje de Potencia de Motor Reducida en el tablero',
      'Ralentí acelerado y oscilante'
    ],
    possibleCauses: [
      'Pista de carbón desgastada o micro-fisurada dentro del cuerpo de aceleración',
      'Residuos de carbón o aceite obstruyendo el movimiento de la mariposa',
      'Conector del cuerpo de aceleración con pines flojos o sulfatados',
      'Falla de la masa de sensores de la ECU (Sensor Ground Offset)'
    ],
    diagnosticApproach: 'Monitoreo de la suma TPS 1 + TPS 2 en datos en vivo (debe ser siempre ~5.0V constante) y barrido suave con osciloscopio en modo ROLL para detectar micro-ruido.',
    diagnosticProcedure: [
      {
        stepNumber: 1,
        symptom: 'Vehículo entra en marcha de seguridad y pedal deja de responder',
        dtc: 'P2135',
        inspection: 'Lectura de voltajes TPS 1 y TPS 2 en el escáner.',
        test: 'Monitorear la suma matemática (TPS 1 + TPS 2) al mover la mariposa.',
        testType: 'datos en vivo',
        result: 'TPS 1 = 0.85V, TPS 2 = 3.20V (Suma = 4.05V en lugar de 5.00V).',
        interpretation: 'Pérdida de correlación por fallo en una de las pistas potenciométricas.',
        nextStep: 'Conectar osciloscopio de 2 canales para localizar la pista defectuosa.'
      },
      {
        stepNumber: 2,
        symptom: 'Caída momentánea a 0V al abrir la mariposa a un 30%',
        dtc: 'P2135',
        inspection: 'Captura de señal TPS 1 en Canal 1 y TPS 2 en Canal 2 con osciloscopio en 1s/Div.',
        test: 'Barrido lento del acelerador manual.',
        testType: 'osciloscopio',
        result: 'Canal 1 presenta picos de ruido y caída a 0V justo en la zona del 30% de apertura.',
        interpretation: 'Pista de carbón desgastada físicamente por fricción constante en posición de crucero.',
        nextStep: 'Sustituir cuerpo de aceleración electrónico y realizar aprendizaje de ralentí.'
      }
    ],
    recommendedTests: [
      'Monitorear la suma de voltajes TPS 1 + TPS 2 = 5.0V',
      'Barrido de aceleración con osciloscopio en modo SCAN/ROLL',
      'Limpieza de garganta de mariposa y reaprendizaje de ralentí',
      'Verificar caída de voltaje en la línea de masa de sensores'
    ],
    relatedVehicles: ['Chevrolet Aveo / Sonic / Cruze', 'Nissan Sentra B16', 'Ford Focus / EcoSport', 'Volkswagen Bora 2.5L'],
    relatedCourses: ['diagnostico-tps-app-acelerador-electronico', 'diagnostico-obd2'],
    relatedCases: ['case-004-falla-encendido-cop'],
    relatedLabs: ['oscilloscope-lab'],
    relatedComponents: {
      sensors: ['Sensor TPS Dual', 'Sensor APP Dual'],
      actuators: ['Motor Servomotor Mariposa TAC']
    },
    status: 'PUBLISHED',
    isVerified: true
  },

  // 13. U0100 - Lost Communication With ECM/PCM A (CAN / COMUNICACIÓN)
  {
    id: 'dtc-u0100',
    code: 'U0100',
    title: 'Pérdida de Comunicación con el Módulo de Control del Motor (ECM / PCM)',
    description: 'Los demás módulos de la red del vehículo (ABS, TCM, BCM, Cuadro de Instrumentos) han dejado de recibir los mensajes periódicos transmitidos por el Módulo de Control del Motor (ECM) a través de la red CAN Bus de Alta Velocidad.',
    category: 'CAN',
    system: 'Redes de Comunicación Multiplexada CAN Bus',
    severity: 'Crítica',
    symptoms: [
      'El motor no da marcha o gira sin arrancar',
      'Todos los testigos del tablero encendidos (ABS, Airbag, Check Engine, Freno)',
      'Agujas de velocímetro y tacómetro muertas o locas',
      'El escáner no logra establecer comunicación con la ECU del motor'
    ],
    possibleCauses: [
      'Pérdida de alimentación de +12V o tierra en el Módulo ECM',
      'Líneas CAN High o CAN Low cortadas o cortocircuitadas en el arnés de motor',
      'Módulo de la red (ej. ABS o BCM) dañado bloqueando el bus con nivel dominante continuo',
      'Resistencia de terminación de 120 Ω abierta en un extremo'
    ],
    diagnosticApproach: 'Medición de resistencia de terminación en pines 6 y 14 del conector DLC (debe ser de 60 Ω con batería desconectada) y verificación de las ondas espejo CAN-H y CAN-L con osciloscopio.',
    diagnosticProcedure: [
      {
        stepNumber: 1,
        symptom: 'Escáner marca Error de Comunicación con ECM',
        dtc: 'U0100',
        inspection: 'Desconexión del borne negativo de la batería.',
        test: 'Medición de resistencia entre Pin 6 (CAN-H) y Pin 14 (CAN-L) en el conector DLC OBD-II.',
        testType: 'eléctrica',
        result: 'Resistencia leída de 120 Ω en lugar de 60 Ω.',
        interpretation: 'Una de las dos resistencias terminadoras de 120 Ω está desconectada o la línea está cortada.',
        nextStep: 'Verificar arnés entre el conector DLC y la ECU del motor.'
      },
      {
        stepNumber: 2,
        symptom: 'Resistencia DLC marca 60 Ω impecable',
        dtc: 'U0100',
        inspection: 'Medición de tensión de línea recesiva con el contacto en ON.',
        test: 'Verificar voltajes respecto a masa en Pin 6 (CAN-H) y Pin 14 (CAN-L).',
        testType: 'señal',
        result: 'Pin 6: 0.0V, Pin 14: 0.0V.',
        interpretation: 'Cortocircuito a masa directo en una de las líneas del par trenzado CAN.',
        nextStep: 'Desconectar módulos progresivamente para aislar el cortocircuito en el arnés.'
      },
      {
        stepNumber: 3,
        symptom: 'Forma de onda CAN-H deformada en osciloscopio',
        dtc: 'U0100',
        inspection: 'Conexión de osciloscopio de 2 canales en Pins 6 y 14.',
        test: 'Captura de tramas a 500 kbps.',
        testType: 'osciloscopio',
        result: 'CAN High aplastado a 2.5V sin picos a 3.5V.',
        interpretation: 'Módulo ABS interno en falla dominando permanentemente la línea.',
        nextStep: 'Desconectar conector del ABS y comprobar restauración del arranque.'
      }
    ],
    recommendedTests: [
      'Medir resistencia de terminación (60 Ω) en conector DLC OBD-II',
      'Verificar voltajes de reposo CAN-H (2.5V) y CAN-L (2.5V)',
      'Capturar señal espejo diferencial con osciloscopio de 2 canales',
      'Verificar alimentaciones principales y masa de la ECU'
    ],
    relatedVehicles: ['Chevrolet Cruze 1.8L', 'Volkswagen Golf 2.0 TSI', 'Nissan X-Trail 2.5L', 'Ford Focus 2.0L'],
    relatedCourses: ['can-bus-lin-bus-diagnostico-redes', 'diagnostico-obd2'],
    relatedCases: ['case-008-red-can-caida'],
    relatedLabs: ['canbus-lab', 'lab-can-bus-waveform'],
    relatedComponents: {
      ecu: ['ECM Engine Control Module', 'Gateway Module', 'BCM Body Control Module']
    },
    status: 'PUBLISHED',
    isVerified: true
  },

  // 14. U0101 - Lost Communication With TCM (CAN / COMUNICACIÓN)
  {
    id: 'dtc-u0101',
    code: 'U0101',
    title: 'Pérdida de Comunicación con el Módulo de Control de la Transmisión (TCM)',
    description: 'El módulo de control del motor y la combinación de instrumentos han perdido la comunicación con el módulo de la caja de cambios automática (TCM) a través de la red CAN Bus.',
    category: 'CAN',
    system: 'Redes de Comunicación Multiplexada CAN Bus',
    severity: 'Crítica',
    symptoms: [
      'Indicador de posición de marchas (P R N D) parpadeando o en blanco en el cuadro de mandos',
      'Caja bloqueada en marcha de emergencia (3ª velocidad)',
      'El motor no da marcha de arranque (por falta de confirmación de P/N)',
      'Código U0101 en el ECM y BCM'
    ],
    possibleCauses: [
      'Fusible de alimentación del módulo TCM quemado o sulfatado',
      'Módulo Mechatronic / TCM dañado por infiltración de aceite o sobrecalentamiento',
      'Arnés de comunicación CAN de la transmisión pelado contra el soporte de la caja',
      'Conector multipin de la transmisión flojo o impregnado de fluido ATF'
    ],
    diagnosticApproach: 'Verificación de alimentación y masa en el conector del TCM, comprobación de resistencia del bus CAN en los pines del TCM y aislamiento de tramas de red.',
    diagnosticProcedure: [
      {
        stepNumber: 1,
        symptom: 'Posición de marchas en blanco y sin arranque',
        dtc: 'U0101',
        inspection: 'Verificación de fusibles del TCM en la caja de fusibles del vano motor.',
        test: 'Comprobación de continuidad de fusibles con multímetro.',
        testType: 'continuidad',
        result: 'Fusible F12 de 15A quemado.',
        interpretation: 'Cortocircuito a masa en la línea de alimentación del solenoide o TCM.',
        nextStep: 'Inspeccionar arnés inferior de la caja de cambios por rozamiento.'
      }
    ],
    recommendedTests: [
      'Verificar voltajes de alimentación y tierra en el conector del TCM',
      'Comprobar continuidad del par trenzado CAN del TCM',
      'Revisión visual de presencia de aceite ATF en los pines del conector',
      'Grabar tramas de comunicación con osciloscopio'
    ],
    relatedVehicles: ['VW Jetta DSG DQ200', 'Ford Fiesta / Focus Powershift', 'Nissan Sentra CVT'],
    relatedCourses: ['can-bus-lin-bus-diagnostico-redes', 'transmisiones-cvt-dct-dsg'],
    relatedCases: ['case-008-red-can-caida', 'case-013-dsg-sin-reversa'],
    relatedLabs: ['canbus-lab'],
    relatedComponents: {
      ecu: ['TCM Transmission Control Module', 'Mechatronic Assembly']
    },
    status: 'PUBLISHED',
    isVerified: true
  },

  // 15. C0035 - Left Front Wheel Speed Sensor Fault (ABS / ABS)
  {
    id: 'dtc-c0035',
    code: 'C0035',
    title: 'Circuito del Sensor de Velocidad de la Rueda Delantera Izquierda (ABS)',
    description: 'El módulo de control del sistema de frenos ABS detecta una señal intermitente, voltaje fuera de rango o ausencia total de pulsos provenientes del sensor de velocidad activo/pasivo de la rueda delantera izquierda.',
    category: 'ABS',
    system: 'Frenos ABS, ESP y Control de Tracción',
    severity: 'Media',
    symptoms: [
      'Luces de advertencia de ABS, ESP y Tracción encendidas en el tablero',
      'Desactivación automática del control de estabilidad y asistencia en pendientes',
      'Activación falsa o pulsación extraña del pedal de freno a baja velocidad',
      'Código C0035 guardado en el módulo ABS'
    ],
    possibleCauses: [
      'Sensor de rueda ABS magneto-resistivo dañado o fisurado',
      'Anillo codificador magnético en el rodamiento de rueda dañado o con viruta de hierro',
      'Cable del sensor estirado o cortado por movimiento de la suspensión',
      'Falso contacto en la pacha del sensor por agua/barro'
    ],
    diagnosticApproach: 'Verificación de la señal de corriente (7mA / 14mA) o señal de voltaje con osciloscopio al girar la rueda con la mano e inspección magnética del rodamiento.',
    diagnosticProcedure: [
      {
        stepNumber: 1,
        symptom: 'Luz ABS encendida tras cambiar el rodamiento de rueda',
        dtc: 'C0035',
        inspection: 'Verificación del rodamiento de rueda recién instalado.',
        test: 'Inspección de la pista magnética con tarjeta detectora de polos magnéticos.',
        testType: 'visual',
        result: 'El rodamiento fue montado al revés (la banda magnética quedó hacia afuera).',
        interpretation: 'El sensor activo no tiene banda magnética frente a su punta para conmutar.',
        nextStep: 'Desmontar mangueta y colocar rodamiento en la posición correcta.'
      },
      {
        stepNumber: 2,
        symptom: 'Señal del sensor se corta intermitentemente al girar el volante a la izquierda',
        dtc: 'C0035',
        inspection: 'Medición de la onda de corriente/voltaje del sensor con osciloscopio moviendo la dirección.',
        test: 'Captura de señal mientras se mueve manualmente el cable flexible.',
        testType: 'osciloscopio',
        result: 'Caída a 0V justo al doblar a fondo a la izquierda.',
        interpretation: 'Cobre interno del cable flexible partido dentro del aislante de goma.',
        nextStep: 'Reemplazar sensor de rueda ABS delantero izquierdo.'
      }
    ],
    recommendedTests: [
      'Comprobar onda cuadrada de corriente (7mA / 14mA) con osciloscopio',
      'Inspección de la pista magnética con visor detector de polos',
      'Monitorear velocidad de las 4 ruedas en datos en vivo a 20 km/h',
      'Medición de continuidad y aislamiento del arnés de rueda'
    ],
    relatedVehicles: ['Chevrolet Cruze / Aveo', 'Volkswagen Golf / Jetta', 'Toyota Corolla', 'Nissan Sentra'],
    relatedCourses: ['sistemas-abs-esp-control-estabilidad', 'diagnostico-obd2'],
    relatedCases: ['case-016-sensor-rueda-abs'],
    relatedLabs: ['lab-abs-wheel-sensor'],
    relatedComponents: {
      sensors: ['Sensor ABS Magneto-Resistivo'],
      ecu: ['Módulo de Control ABS / ESP HCU']
    },
    status: 'PUBLISHED',
    isVerified: true
  },

  // 16. B1000 - SRS Airbag Control Module Internal Fault (AIRBAG / AIRBAG)
  {
    id: 'dtc-b1000',
    code: 'B1000',
    title: 'Falla Interna del Módulo de Control de Airbag (SRS / Crash Data)',
    description: 'El módulo de control de seguridad pasiva (SRS Airbag) registra una falla en su microcontrolador interno o ha almacenado un registro permanente de colisión (Crash Data) tras un impacto.',
    category: 'AIRBAG',
    system: 'Seguridad Pasiva Airbag (SRS) y Pretensionadores',
    severity: 'Crítica',
    symptoms: [
      'Testigo de Airbag (SRS) encendido fijamente en el tablero',
      'Sistema de bolsas de aire e inyectores pirotécnicos totalmente inhabilitados',
      'Imposibilidad de borrar el código DTC con escáner convencional'
    ],
    possibleCauses: [
      'Registro de colisión previo grabado en la memoria EEPROM / FLASH (Crash Data)',
      'Infiltración de líquido por derrame en la consola central sobre el módulo SRS',
      'Falla del capacitor reservorio de energía de detonación interno',
      'Intento fallido de reprogramación del módulo SRS'
    ],
    diagnosticApproach: 'Verificación de alimentaciones y masa del módulo SRS, escaneo de códigos de detonador secundario y evaluación del estado de Crash Data.',
    diagnosticProcedure: [
      {
        stepNumber: 1,
        symptom: 'Luz SRS encendida fija en vehículo comprado en subasta',
        dtc: 'B1000',
        inspection: 'Lectura de memoria de la ECU de Airbag con escáner profesional.',
        test: 'Verificación de estado de registro de colisión.',
        testType: 'comunicación',
        result: 'Parámetro Crash Event Stored = TRUE.',
        interpretation: 'El módulo activó pretensionadores en un impacto previo y se bloqueó por seguridad.',
        nextStep: 'Reemplazar módulo SRS por unidad nueva o limpiar Crash Data en banco.'
      }
    ],
    recommendedTests: [
      'Verificar voltajes de alimentación e ignición en arnés SRS',
      'Escanear resistencia de squibs/detonadores pirotécnicos (debe ser 2.0-3.5 Ω)',
      'Prueba de continuidad del resorte espiral (Clock Spring)',
      'Comprobar estado de memoria Crash Data'
    ],
    relatedVehicles: ['Hyundai Elantra', 'Kia Forte', 'Toyota Corolla', 'Nissan Versa'],
    relatedCourses: ['sistemas-airbag-srs-pretensionadores', 'diagnostico-obd2'],
    relatedCases: ['case-020-airbag-clockspring', 'case-022-srs-crash-data'],
    relatedLabs: ['lab-srs-squib-resistor'],
    relatedComponents: {
      sensors: ['Sensores de Impacto Frontal / Lateral'],
      ecu: ['Módulo de Control SRS Airbag'],
      actuators: ['Detonadores Squibs Airbag', 'Pretensionadores']
    },
    status: 'PUBLISHED',
    isVerified: true
  },

  // 17. P0A80 - Replace Hybrid Battery Pack (FABRICANTE / EV)
  {
    id: 'dtc-p0a80',
    code: 'P0A80',
    title: 'Reemplazar Paquete de Baterías de Alto Voltaje (Hybrid Battery Pack)',
    description: 'El Módulo de Gestión de Batería de Alto Voltaje (BMS) detecta un desbalance de tensión superior al límite permitido (mayor a 0.3V a 0.5V) entre los bloques de celdas de la batería NiMH o Litio-Ión durante ciclos de carga o descarga.',
    category: 'FABRICANTE',
    system: 'Sistema Híbrido y Batería de Alto Voltaje',
    severity: 'Alta',
    symptoms: [
      'Aviso "Check Hybrid System" en la pantalla del vehículo',
      'Soplador/Ventilador de la batería de alta tensión funcionando a máxima velocidad',
      'El motor de gasolina permanece encendido continuamente',
      'Descarga anormalmente rápida de las barras del estado de carga (SoC) en la pantalla'
    ],
    possibleCauses: [
      'Degradación o pérdida de capacidad en uno o más módulos de la batería',
      'Sulfatación y corrosión severa en las pletinas de cobre de interconexión de celdas',
      'Ventilador de enfriamiento de la batería híbrida obstruido por polvo/pelusa',
      'Sensor de voltaje o sensor de temperatura de bloque dañado'
    ],
    diagnosticApproach: 'Escaneo en tiempo real de los voltajes de todos los bloques de la batería (Block Voltages 1 al 14) aplicando aceleración con freno pisado para forzar descarga.',
    diagnosticProcedure: [
      {
        stepNumber: 1,
        symptom: 'Ventilador de batería ruidoso y aviso de sistema híbrido',
        dtc: 'P0A80',
        inspection: 'Lectura de datos en vivo del módulo BMS en escáner.',
        test: 'Monitorear Delta de Voltaje entre el bloque de mayor tensión y el de menor tensión.',
        testType: 'datos en vivo',
        result: 'Bloque 12 marca 13.8V; Bloque 6 marca 11.2V (Delta V = 2.6V en aceleración).',
        interpretation: 'El Bloque 6 tiene celdas internas cruzadas con pérdida crítica de capacidad.',
        nextStep: 'Desenergizar el sistema HV con guantes CAT III 1000V, retirar tapón de servicio y desmontar batería.'
      },
      {
        stepNumber: 2,
        symptom: 'Batería híbrida desmontada en mesa de trabajo',
        dtc: 'P0A80',
        inspection: 'Revisión de las pletinas de cobre de unión de bornes.',
        test: 'Inspección visual y medición de resistencia de contacto.',
        testType: 'visual',
        result: 'Presencia de moho verde de sulfato de cobre en la pletina del bloque 6.',
        interpretation: 'Alta resistencia eléctrica por corrosión que sobrecalienta el bloque de celdas.',
        nextStep: 'Limpiar pletinas con ácido neutro o reemplazar celdas degradadas y balancear.'
      }
    ],
    recommendedTests: [
      'Medir Delta V entre bloques de batería en prueba de carga estática',
      'Inspeccionar pletinas de cobre de interconexión por sulfatación',
      'Prueba de activación del ventilador de la batería con escáner',
      'Verificar sensor de temperatura de batería HV'
    ],
    relatedVehicles: ['Toyota Prius 1.8L Hybrid', 'Toyota Camry Hybrid', 'Honda Civic Hybrid', 'Ford Escape Hybrid'],
    relatedCourses: ['vehiculos-hibridos-electricos-baterias-hv-bms', 'diagnostico-obd2'],
    relatedCases: ['case-021-prius-celda-degradada'],
    relatedLabs: ['lab-bms-cell-balance', 'lab-hv-deenergization'],
    relatedComponents: {
      sensors: ['Sensores de Temperatura de Batería HV'],
      ecu: ['BMS Battery Management System Module'],
      actuators: ['Soplador de Refrigeración Batería HV']
    },
    status: 'PUBLISHED',
    isVerified: true
  },

  // 18. P0AA6 - Hybrid Battery Voltage System Isolation Fault (FABRICANTE / EV)
  {
    id: 'dtc-p0aa6',
    code: 'P0AA6',
    title: 'Falla de Aislamiento del Sistema de Alto Voltaje (HV Isolation Fault)',
    description: 'El Módulo de Control del Sistema Híbrido / EV detecta que la resistencia de aislamiento entre el circuito flotante de corriente continua/alterna de alta tensión (cables naranjas) y el chasis del vehículo ha caído por debajo de 500 kΩ.',
    category: 'FABRICANTE',
    system: 'Sistema Eléctrico de Alto Voltaje EV / HEV',
    severity: 'Crítica',
    symptoms: [
      'El vehículo no pasa a estado "READY" y no se mueve',
      'Desconexión automática de emergencia de los contactores principales (SMR)',
      'Aviso de falla eléctrica grave en la pantalla de instrumentos',
      'Código P0AA6 con sub-códigos INF 526 / INF 612'
    ],
    possibleCauses: [
      'Fuga de electrólito en las celdas de la batería de alto voltaje hacia la bandeja de metal',
      'Fuga de corriente de alta tensión en el devanado del compresor de A/C eléctrico',
      'Humedad o condensación acumulada dentro de la carcasa del Inversor de Potencia',
      'Aislamiento de cable naranja de alta tensión desgastado y rozando el chasis'
    ],
    diagnosticApproach: 'Desconexión de componentes de alta tensión uno a uno (previo protocolo de desenergización y verificación de 0V con multímetro CAT III 1000V) y medición de resistencia de aislamiento con megóhmetro (Megger) a 500V DC.',
    diagnosticProcedure: [
      {
        stepNumber: 1,
        symptom: 'Vehículo se apaga en marcha y no vuelve a dar READY',
        dtc: 'P0AA6',
        inspection: 'Verificación del sub-código INF con escáner para aislar el área de la falla.',
        test: 'Lectura de datos de Freeze Frame en el módulo de control híbrido.',
        testType: 'comunicación',
        result: 'Sub-código de detalle INF 526 asignado a la rama del Compresor A/C.',
        interpretation: 'La pérdida de aislamiento está localizada en el circuito del compresor eléctrico de aire acondicionado.',
        nextStep: 'Desenergizar vehículo, desconectar enchufe de alta tensión del compresor A/C y medir aislamiento.'
      },
      {
        stepNumber: 2,
        symptom: 'Compresor A/C de alta tensión desconectado',
        dtc: 'P0AA6',
        inspection: 'Medición con Megóhmetro (Megger) aplicando 500V DC entre las fases del compresor y su carcasa de aluminio.',
        test: 'Prueba de resistencia de aislamiento dieléctrico.',
        testType: 'eléctrica',
        result: 'Resistencia leída de 0.2 MΩ (El límite mínimo de seguridad es 10 MΩ).',
        interpretation: 'Bobinado interno del motor trifásico del compresor A/C derivado a masa por refrigerante inadecuado.',
        nextStep: 'Sustituir compresor A/C eléctrico y recargar con aceite dieléctrico POE.'
      }
    ],
    recommendedTests: [
      'Medir resistencia de aislamiento con Megóhmetro a 500V/1000V',
      'Verificar ausencia de tensión (0.00V DC/AC) tras retirar Service Plug',
      'Desconectar progresivamente Inversor, Batería y Compresor A/C',
      'Verificar uso exclusivo de aceite sintético POE para A/C'
    ],
    relatedVehicles: ['Toyota Prius 1.8L', 'Nissan Leaf 100% EV', 'Tesla Model 3', 'Hyundai Ioniq EV'],
    relatedCourses: ['inversores-potencia-motores-electricos-adas', 'vehiculos-hibridos-electricos-baterias-hv-bms'],
    relatedCases: ['case-025-smr-contactor-abierto'],
    relatedLabs: ['lab-hv-deenergization'],
    relatedComponents: {
      sensors: ['Sensor de Aislamiento HV Leakage'],
      ecu: ['Hybrid Vehicle ECU'],
      actuators: ['Compresor A/C Eléctrico HV', 'Inversor de Potencia']
    },
    status: 'PUBLISHED',
    isVerified: true
  }
];
