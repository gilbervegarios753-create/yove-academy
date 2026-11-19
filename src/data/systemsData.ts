import { SystemCategoryKey } from '../types';

export interface SystemCategoryDetail {
  id: SystemCategoryKey;
  name: string;
  icon: string;
  description: string;
  keyComponents: string[];
  typicalDtcs: string[];
  relatedCourseCategory: string;
}

export const AUTOMOTIVE_15_SYSTEMS: SystemCategoryDetail[] = [
  {
    id: 'motor',
    name: 'Motor de Combustión',
    icon: '⚙️',
    description: 'Bloque, culata, distribución, lubricación, enfriamiento y componentes mecánicos de combustión interna.',
    keyComponents: ['Bomba de Aceite', 'Cadena/Correa de Sincronización', 'Empaque de Culata', 'Termostato'],
    typicalDtcs: ['P0217', 'P0520', 'P0011', 'P0300'],
    relatedCourseCategory: 'mechanical'
  },
  {
    id: 'inyección',
    name: 'Inyección & Combustible',
    icon: '⛽',
    description: 'Sistemas de inyección multipunto (MPI), inyección directa (GDI/FSI) y riel común diésel (CRDI).',
    keyComponents: ['Inyectores Piezo/Solenoide', 'Bomba Alta Presión GDI', 'Riel de Inyección', 'Regulador de Presión'],
    typicalDtcs: ['P0171', 'P0172', 'P0087', 'P0201'],
    relatedCourseCategory: 'diagnostic'
  },
  {
    id: 'ecu',
    name: 'Computadora / ECU / PCM',
    icon: '💻',
    description: 'Unidad de control electrónico principal, procesadores microcontroladores, drivers de potencia y memorias EEPROM/Flash.',
    keyComponents: ['Módulo ECU/PCM', 'Drivers de Inyectores/Bobinas', 'Cristal Oscilador', 'EPROM EEPROM Flash'],
    typicalDtcs: ['P0601', 'P0606', 'P0685', 'U0100'],
    relatedCourseCategory: 'ecu'
  },
  {
    id: 'abs',
    name: 'ABS & Control de Estabilidad',
    icon: '🛑',
    description: 'Sistema antibloqueo de frenos, control electrónico de estabilidad (ESP/VSC) y distribución electrónica EBD.',
    keyComponents: ['Sensores WSS de Rueda (Hall)', 'Unidad Hidráulica ABS', 'Módulo ECU ABS', 'Sensor Ángulo Dirección'],
    typicalDtcs: ['C0035', 'C0040', 'C0110', 'C0221'],
    relatedCourseCategory: 'mechatronics'
  },
  {
    id: 'airbag',
    name: 'Airbag / SRS',
    icon: '🛡️',
    description: 'Módulo de control de bolsas de aire, pretensores de cinturón de seguridad y sensores de desaceleración de impacto.',
    keyComponents: ['Módulo SRS Airbag', 'Sensor Impacto Frontal/Lateral', 'Cinta de Volante (Clock Spring)', 'Bolsa de Aire Pilotada'],
    typicalDtcs: ['B0001', 'B0010', 'B1000', 'B0028'],
    relatedCourseCategory: 'electronics'
  },
  {
    id: 'transmisión',
    name: 'Transmisión & Caja de Cambios',
    icon: '🕹️',
    description: 'Transmisiones manuales, automáticas hidromáticas, вариаdores CVT y cajas de doble embrague (DSG/DCT).',
    keyComponents: ['Módulo TCM', 'Solenoides de Cambio', 'Convertidor de Par', 'Sensor VSS Ent/Sal'],
    typicalDtcs: ['P0700', 'P0730', 'P0750', 'P0841'],
    relatedCourseCategory: 'mechanical'
  },
  {
    id: 'dirección',
    name: 'Dirección Asistida',
    icon: '🎯',
    description: 'Sistemas de dirección electroasistida (EPS) sobre cremallera o columna, e hidráulica proporcional.',
    keyComponents: ['Módulo EPS', 'Motor Eléctrico Asistencia', 'Sensor Torque/Torque Sensor', 'Cremallera Electrónica'],
    typicalDtcs: ['C1500', 'C1511', 'C1525', 'U0126'],
    relatedCourseCategory: 'mechatronics'
  },
  {
    id: 'suspensión',
    name: 'Suspensión Adaptativa & Neumática',
    icon: '🛞',
    description: 'Sistemas de amortiguación pilotada electrónicamente, suspensión neumática y control de altura.',
    keyComponents: ['Compresor Neumático', 'Sensores de Altura de Chasis', 'Válvula Solenoide de Bloque', 'Amortiguadores EDC'],
    typicalDtcs: ['C1A00', 'C1A13', 'C1100'],
    relatedCourseCategory: 'mechanical'
  },
  {
    id: 'frenos',
    name: 'Frenos & Freno Electrónico EPB',
    icon: '⚡',
    description: 'Circuitos hidráulicos de freno, servofreno de vacío/eléctrico y actuadores de freno de estacionamiento electrónico (EPB).',
    keyComponents: ['Cilindro Maestro', 'Servofreno Electrónico (iBooster)', 'Actuador EPB en Caliper', 'Bomba de Vacío Auxiliar'],
    typicalDtcs: ['C1200', 'C1234', 'C1300'],
    relatedCourseCategory: 'mechatronics'
  },
  {
    id: 'climatización',
    name: 'Climatización & HVAC',
    icon: '❄️',
    description: 'Sistemas de aire acondicionado manual y climatizador automático bizona con compresores de desplazamiento variable.',
    keyComponents: ['Compresor A/C Eléctrico/Variables', 'Válvula de Expansión', 'Sensor Presión A/C', 'Servomotores Mezcla Aire'],
    typicalDtcs: ['B1081', 'B1082', 'P0530'],
    relatedCourseCategory: 'electrical'
  },
  {
    id: 'canbus',
    name: 'Red CAN Bus (High & Low)',
    icon: '📡',
    description: 'Red de comunicación multiplexada diferencial a alta velocidad (500 kbps) y media velocidad (125 kbps).',
    keyComponents: ['Módulo Gateway (CGW)', 'Resistencias Terminadoras 120Ω', 'Líneas CAN-H / CAN-L', 'Conector DLC Pin 6/14'],
    typicalDtcs: ['U0001', 'U0100', 'U0101', 'U0121'],
    relatedCourseCategory: 'canbus'
  },
  {
    id: 'linbus',
    name: 'Red LIN Bus (Single Wire)',
    icon: '🔌',
    description: 'Red monocanal de comunicación serial económica de velocidad baja/media (19.2 kbps) para periféricos y actuadores.',
    keyComponents: ['Master LIN (BCM/ECU)', 'Esclavo LIN (Alternador Smart/Limpia)', 'Línea Single Wire 12V'],
    typicalDtcs: ['U1000', 'U1100', 'U1115'],
    relatedCourseCategory: 'linbus'
  },
  {
    id: 'electrico',
    name: 'Sistema Eléctrico 12V',
    icon: '🔋',
    description: 'Batería plomo-ácido/AGM, alternador inteligente regulado por LIN, motor de arranque y distribución de fusibles BCM/PCDM.',
    keyComponents: ['Alternador Pilotado LIN', 'Motor de Arranque Solenoide', 'Modulo BCM / BSI / SAM', 'Sensor IBS de Batería'],
    typicalDtcs: ['P0562', 'P0563', 'P0620', 'B1318'],
    relatedCourseCategory: 'electrical'
  },
  {
    id: 'hibrido',
    name: 'Sistema Híbrido (HEV / PHEV)',
    icon: '🌱',
    description: 'Acoplamiento de motor térmico y motores-generadores eléctricos (MG1/MG2), transmisión e-CVT y batería de alto voltaje.',
    keyComponents: ['Motor Generador MG1 / MG2', 'Inversor / Conversor Boost', 'Batería NiMH / Li-Ion HV', 'Inversor AC/DC'],
    typicalDtcs: ['P0A80', 'P0A78', 'P0A94', 'P3000'],
    relatedCourseCategory: 'hybrid'
  },
  {
    id: 'ev',
    name: 'Sistema Eléctrico EV (Alto Voltaje)',
    icon: '⚡',
    description: 'Tracción 100% eléctrica de alto voltaje (400V - 800V), batería tracción, BMS (Battery Management System) y puerto Carga Rápida DC.',
    keyComponents: ['Pack Batería Tracción Li-Ion', 'Módulo BMS & Contactores HV', 'Inversor MOSFET/SiC', 'Cargador Abordo OBC & DC/DC'],
    typicalDtcs: ['P0AA6', 'P0A0D', 'U0111', 'P1E00'],
    relatedCourseCategory: 'ev'
  }
];
