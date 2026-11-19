import { LearningPath } from '../types';

export const LEARNING_PATHS_DATA: LearningPath[] = [
  {
    id: 'path-tecnico-mecatronica',
    slug: 'tecnico-mecatronica-automotriz',
    title: 'Ruta Profesional: Técnico en Mecatrónica Automotriz',
    badge: '⚙️ Técnico Mecatrónico Master',
    description: 'Carrera técnica integral para dominar electricidad, electrónica, diagnóstico OBD-II, redes CAN Bus y reparación de ECUs.',
    estimatedHours: 240,
    targetRole: 'Técnico Mecatrónico Automotriz / Especialista de Taller',
    level: 'Inicial a Avanzado',
    certificateTitle: 'Certificado Profesional: Técnico en Mecatrónica Automotriz',
    requirements: [
      {
        description: 'Público general. Sin prerrequisito de ruta previa. Se recomienda interés por la electromovilidad y diagnóstico.'
      }
    ],
    courses: [
      { courseId: 'sistemas-electricos', order: 1, levelName: 'Nivel 1: Electricidad Fundamental', required: true, labId: 'multimeter-lab' },
      { courseId: 'electronica-automotriz', order: 2, levelName: 'Nivel 2: Electrónica Digital y Sensores', required: true, labId: 'multimeter-lab' },
      { courseId: 'diagnostico-obd2', order: 3, levelName: 'Nivel 3: Diagnóstico OBD-II y Escáner', required: true, caseId: 'case-p0171-yaris', labId: 'scanner-lab' },
      { courseId: 'can-bus-lin-bus-diagnostico-redes', order: 4, levelName: 'Nivel 4: Redes CAN Bus y Multiplexado', required: true, caseId: 'case-u0100-ford', labId: 'can-bus-lab' },
      { courseId: 'diagnostico-reparacion-ecu-automotriz', order: 5, levelName: 'Nivel 5: Diagnóstico y Reparación de ECU', required: true, labId: 'ecu-bench-lab' }
    ]
  },
  {
    id: 'path-diagnostico-electronico',
    slug: 'diagnostico-electronico',
    title: 'Ruta Especialista en Diagnóstico Electrónico',
    badge: '🔍 Diagnosta Electrónico',
    description: 'Metodología avanzada de diagnóstico electrónico con escáner OBD-II, lectura de Freeze Frame y osciloscopio de señales.',
    estimatedHours: 180,
    targetRole: 'Técnico Diagnosta Electrónico / Jefe de Diagnóstico',
    level: 'Intermedio',
    certificateTitle: 'Certificado de Especialización: Diagnóstico Electrónico Automotriz',
    requirements: [
      {
        prerequisitePathId: 'path-electricidad-automotriz',
        prerequisitePathTitle: 'Electricidad Automotriz',
        minXp: 300,
        description: 'Recomendado haber completado la ruta de Electricidad Automotriz o poseer mínimo 300 XP en la plataforma.'
      }
    ],
    courses: [
      { courseId: 'sistemas-electricos', order: 1, levelName: 'Nivel 1: Medición de Circuitos y Caídas de Tensión', required: true, labId: 'multimeter-lab' },
      { courseId: 'diagnostico-obd2', order: 2, levelName: 'Nivel 2: Diagnóstico OBD-II, PIDs y Freeze Frame', required: true, caseId: 'case-p0171-yaris', labId: 'scanner-lab' },
      { courseId: 'diagnostico-osciloscopio-automotriz', order: 3, levelName: 'Nivel 3: Análisis de Formas de Onda con Osciloscopio', required: true, labId: 'oscilloscope-lab' },
      { courseId: 'sensores-ckp-cmp-sincronismo', order: 4, levelName: 'Nivel 4: Sincronismo de Sensores CKP/CMP', required: true, caseId: 'case-p0300-chevrolet', labId: 'oscilloscope-lab' }
    ]
  },
  {
    id: 'path-especialista-osciloscopio',
    slug: 'especialista-osciloscopio',
    title: 'Ruta Especialista en Osciloscopio Automotriz',
    badge: '📊 Máster en Osciloscopía',
    description: 'Dominio de captura y análisis de señales analógicas, digitales, PWM, hall, inductivas y capas físicas con osciloscopio.',
    estimatedHours: 150,
    targetRole: 'Especialista en Metrología y Osciloscopía Automotriz',
    level: 'Intermedio / Avanzado',
    certificateTitle: 'Certificado Profesional: Especialista en Osciloscopio Automotriz',
    requirements: [
      {
        prerequisitePathId: 'path-diagnostico-electronico',
        prerequisitePathTitle: 'Diagnóstico Electrónico',
        minXp: 500,
        description: 'Conocimientos de señales eléctricas y mínimo 500 XP acumulados.'
      }
    ],
    courses: [
      { courseId: 'diagnostico-osciloscopio-automotriz', order: 1, levelName: 'Nivel 1: Osciloscopio Digital y Configuración de Triggers', required: true, labId: 'oscilloscope-lab' },
      { courseId: 'cuerpo-aceleracion-electronico-tps-app', order: 2, levelName: 'Nivel 2: Diagnóstico de Pistas TPS/APP y Motores PWM', required: true, labId: 'oscilloscope-lab' },
      { courseId: 'sensores-ckp-cmp-sincronismo', order: 3, levelName: 'Nivel 3: Análisis Angular CKP vs CMP', required: true, caseId: 'case-p0300-chevrolet', labId: 'oscilloscope-lab' },
      { courseId: 'can-bus-lin-bus-diagnostico-redes', order: 4, levelName: 'Nivel 4: Análisis Físico de Tramas CAN-High y CAN-Low', required: true, caseId: 'case-u0100-ford', labId: 'can-bus-lab' }
    ]
  },
  {
    id: 'path-especialista-can-bus',
    slug: 'especialista-can-bus',
    title: 'Ruta Especialista en Redes CAN Bus y Multiplexado',
    badge: '🌐 Especialista CAN Bus & LIN',
    description: 'Diagnóstico de redes multiplexadas automotrices, resistencias de terminación de 60Ω, gateways e interferencias electromagnéticas.',
    estimatedHours: 160,
    targetRole: 'Especialista en Redes Multiplexadas Automotrices',
    level: 'Avanzado',
    certificateTitle: 'Certificado Experto: Redes CAN Bus y Multiplexado Automotriz',
    requirements: [
      {
        prerequisitePathId: 'path-diagnostico-electronico',
        prerequisitePathTitle: 'Diagnóstico Electrónico',
        minXp: 600,
        description: 'Mínimo 600 XP o certificación en Diagnóstico Electrónico.'
      }
    ],
    courses: [
      { courseId: 'redes-automotrices', order: 1, levelName: 'Nivel 1: Arquitectura de Redes Multiplexadas', required: true },
      { courseId: 'can-bus-lin-bus-diagnostico-redes', order: 2, levelName: 'Nivel 2: Diagnóstico de Capa Física CAN y LIN Bus', required: true, caseId: 'case-u0100-ford', labId: 'can-bus-lab' },
      { courseId: 'diagnostico-reparacion-ecu-automotriz', order: 3, levelName: 'Nivel 3: Comunicación Inter-Módulos y Gateways', required: true, labId: 'ecu-bench-lab' }
    ]
  },
  {
    id: 'path-tecnico-vehiculos-hibridos',
    slug: 'tecnico-vehiculos-hibridos',
    title: 'Ruta Técnico en Vehículos Híbridos (HEV/PHEV)',
    badge: '🔋 Técnico HEV/PHEV',
    description: 'Mantenimiento y diagnóstico seguro de baterías de alto voltaje HV, sistemas BMS, desenergizado seguro e inversores.',
    estimatedHours: 170,
    targetRole: 'Técnico Especialista en Vehículos Híbridos',
    level: 'Intermedio / Avanzado',
    certificateTitle: 'Certificado Profesional: Técnico en Vehículos Híbridos (HEV/PHEV)',
    requirements: [
      {
        minXp: 500,
        description: 'Conocimientos de seguridad eléctrica y mínimo 500 XP.'
      }
    ],
    courses: [
      { courseId: 'sistemas-electricos', order: 1, levelName: 'Nivel 1: Fundamentos Eléctricos de Seguridad HV', required: true, labId: 'multimeter-lab' },
      { courseId: 'vehiculos-hibridos-electricos-baterias-hv-bms', order: 2, levelName: 'Nivel 2: Baterías de Alto Voltaje HV y Sistema BMS', required: true, caseId: 'case-p0a80-prius', labId: 'hybrid-hv-lab' },
      { courseId: 'inversores-potencia-motores-electricos-adas', order: 3, levelName: 'Nivel 3: Inversores de Potencia y Motores Generadores MG1/MG2', required: true, labId: 'hybrid-hv-lab' }
    ]
  },
  {
    id: 'path-tecnico-vehiculos-electricos',
    slug: 'tecnico-vehiculos-electricos',
    title: 'Ruta Técnico en Vehículos 100% Eléctricos (EV)',
    badge: '⚡ Especialista EV 1000V',
    description: 'Especialización de alto nivel en vehículos 100% eléctricos, protocolos de carga rápida, inversores de carburo de silicio y frenado regenerativo.',
    estimatedHours: 190,
    targetRole: 'Técnico Máster en Vehículos Eléctricos EV',
    level: 'Avanzado / Máster',
    certificateTitle: 'Certificado Máster: Técnico Especialista en Vehículos Eléctricos (EV)',
    requirements: [
      {
        prerequisitePathId: 'path-tecnico-vehiculos-hibridos',
        prerequisitePathTitle: 'Técnico en Vehículos Híbridos',
        minXp: 800,
        description: 'Recomendado haber completado la ruta HEV o poseer 800 XP.'
      }
    ],
    courses: [
      { courseId: 'vehiculos-hibridos-electricos-baterias-hv-bms', order: 1, levelName: 'Nivel 1: Paquetes de Baterías EV y Seguridad de Alto Voltaje', required: true, caseId: 'case-p0a80-prius', labId: 'hybrid-hv-lab' },
      { courseId: 'inversores-potencia-motores-electricos-adas', order: 2, levelName: 'Nivel 2: Inversores SiC/IGBT y Motores de Tracción AC', required: true, labId: 'hybrid-hv-lab' },
      { courseId: 'sistemas-abs-esp-control-estabilidad', order: 3, levelName: 'Nivel 3: Frenado Regenerativo iBooster y Estabilidad', required: true, labId: 'scanner-lab' }
    ]
  },
  {
    id: 'path-diagnostico-ecu',
    slug: 'diagnostico-ecu',
    title: 'Ruta Diagnóstico y Reparación de ECUs',
    badge: '💻 Máster en Programación ECU',
    description: 'Diagnóstico en banco de pruebas, sustitución de transistores de potencia, lectura de microcontroladores en Boot/Bench Mode e inmovilizadores.',
    estimatedHours: 200,
    targetRole: 'Especialista en Diagnóstico y Reparación de Módulos ECU',
    level: 'Avanzado / Máster',
    certificateTitle: 'Certificado Experto: Diagnóstico y Reparación de Módulos ECU',
    requirements: [
      {
        prerequisitePathId: 'path-diagnostico-electronico',
        prerequisitePathTitle: 'Diagnóstico Electrónico',
        minXp: 750,
        description: 'Mínimo 750 XP o experiencia en soldadura SMD/PCB.'
      }
    ],
    courses: [
      { courseId: 'electronica-automotriz', order: 1, levelName: 'Nivel 1: Electrónica Analógica y Digital en Placa PCB', required: true, labId: 'multimeter-lab' },
      { courseId: 'diagnostico-reparacion-ecu-automotriz', order: 2, levelName: 'Nivel 2: Diagnóstico de Fuentes Reguladas VREF y Drivers en Banco', required: true, labId: 'ecu-bench-lab' },
      { courseId: 'programacion-ecu', order: 3, levelName: 'Nivel 3: Lectura Bench/Boot, Programación Flash y Clonación', required: true, labId: 'ecu-bench-lab' }
    ]
  },
  {
    id: 'path-especialista-inyeccion',
    slug: 'especialista-inyeccion',
    title: 'Ruta Especialista en Sistemas de Inyección',
    badge: '⛽ Especialista en Inyección GDI / Common Rail',
    description: 'Diagnóstico integral de inyección directa de gasolina (GDI/PFI) e inyección Diesel Common Rail de alta presión y filtros DPF.',
    estimatedHours: 175,
    targetRole: 'Especialista en Inyección Electrónica y Emisiones',
    level: 'Intermedio / Avanzado',
    certificateTitle: 'Certificado de Especialización: Sistemas de Inyección Electrónica',
    requirements: [
      {
        minXp: 400,
        description: 'Mínimo 400 XP en la plataforma YOVE Academy.'
      }
    ],
    courses: [
      { courseId: 'inyeccion-gasolina-gdi-pfi', order: 1, levelName: 'Nivel 1: Inyección Directa GDI y PFI', required: true, caseId: 'case-p0171-yaris', labId: 'scanner-lab' },
      { courseId: 'inyeccion-diesel-common-rail-dpf', order: 2, levelName: 'Nivel 2: Inyección Diesel Common Rail y Filtro DPF', required: true, labId: 'scanner-lab' },
      { courseId: 'cuerpo-aceleracion-electronico-tps-app', order: 3, levelName: 'Nivel 3: Control Electrónico de Aire y Mariposa Motorizada', required: true, labId: 'oscilloscope-lab' }
    ]
  },
  {
    id: 'path-especialista-transmisiones',
    slug: 'especialista-transmisiones',
    title: 'Ruta Especialista en Transmisiones',
    badge: '⚙️ Especialista en Cajas Automáticas',
    description: 'Diagnóstico electrónico de transmisiones automáticas CVT, doble embrague DCT/DSG, solenoides PWM y módulo TCM.',
    estimatedHours: 165,
    targetRole: 'Especialista en Transmisiones Automáticas y Electrónicas',
    level: 'Intermedio / Avanzado',
    certificateTitle: 'Certificado Profesional: Especialista en Transmisiones Electrónicas',
    requirements: [
      {
        minXp: 400,
        description: 'Mínimo 400 XP acumulados.'
      }
    ],
    courses: [
      { courseId: 'transmisiones-cvt-dct-dsg', order: 1, levelName: 'Nivel 1: Transmisiones CVT, DCT y DSG', required: true, labId: 'scanner-lab' },
      { courseId: 'diagnostico-obd2', order: 2, levelName: 'Nivel 2: Diagnóstico de Módulo TCM y Monitoreo de Solenoides', required: true, labId: 'scanner-lab' },
      { courseId: 'can-bus-lin-bus-diagnostico-redes', order: 3, levelName: 'Nivel 3: Comunicación de Red ECM - TCM', required: true, caseId: 'case-u0100-ford', labId: 'can-bus-lab' }
    ]
  },
  {
    id: 'path-electricidad-automotriz',
    slug: 'electricidad-automotriz',
    title: 'Ruta Electricidad Automotriz',
    badge: '🔋 Técnico Electricista',
    description: 'Fundamentos de electricidad automotriz: Ley de Ohm, esquemas eléctricos, uso del multímetro, relés, sistemas SRS y ABS.',
    estimatedHours: 120,
    targetRole: 'Técnico Electricista Automotriz',
    level: 'Inicial',
    certificateTitle: 'Certificado Técnico: Fundamentos de Electricidad Automotriz',
    requirements: [
      {
        description: 'Sin requisitos previos. Ideal para estudiantes principiantes que se inician en la automoción.'
      }
    ],
    courses: [
      { courseId: 'sistemas-electricos', order: 1, levelName: 'Nivel 1: Ley de Ohm, Circuitos y Multímetro', required: true, labId: 'multimeter-lab' },
      { courseId: 'sistemas-airbag-srs-pretensionadores', order: 2, levelName: 'Nivel 2: Sistemas de Seguridad Airbag SRS', required: true, labId: 'multimeter-lab' },
      { courseId: 'sistemas-abs-esp-control-estabilidad', order: 3, levelName: 'Nivel 3: Sensores de Rueda y Válvulas ABS', required: true, labId: 'scanner-lab' }
    ]
  }
];
