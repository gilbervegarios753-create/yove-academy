import { CategoryInfo } from '../types';

export const AUTOMOTIVE_CATEGORIES: CategoryInfo[] = [
  {
    id: 'mechanical',
    name: 'Mecánica Automotriz',
    slug: 'mecanica-automotriz',
    description: 'Sistemas de combustión interna, sincronización, ajuste de motor, tren motriz y metrología.',
    icon: '⚙️',
    coursesCount: 6
  },
  {
    id: 'electrical',
    name: 'Electricidad Automotriz',
    slug: 'electricidad-automotriz',
    description: 'Sistemas de carga, arranque, caídas de tensión, circuitos y lectura de diagramas OEM.',
    icon: '🔌',
    coursesCount: 5
  },
  {
    id: 'electronics',
    name: 'Electrónica Automotriz',
    slug: 'electronica-automotriz',
    description: 'Componentes de estado sólido, lógica digital, microcontroladores y análisis de circuitos en ECUs.',
    icon: '🤖',
    coursesCount: 5
  },
  {
    id: 'mechatronics',
    name: 'Mecatrónica Automotriz',
    slug: 'mecatronica-automotriz',
    description: 'Integración electromecánica, transmisiones robotizadas, direcciones EPS y actuadores inteligentes.',
    icon: '🎛️',
    coursesCount: 4
  },
  {
    id: 'gasoline',
    name: 'Inyección Gasolina',
    slug: 'inyeccion-gasolina',
    description: 'Sistemas PFI, GDI inyección directa, bomba de alta presión y diagnóstico de mezcla aire/combustible.',
    icon: '⛽',
    coursesCount: 4
  },
  {
    id: 'diesel',
    name: 'Inyección Diésel',
    slug: 'inyeccion-diesel',
    description: 'Sistemas Common Rail, inyectores piezoeléctricos/solenoide, bomba de alta y sistemas DPF/AdBlue.',
    icon: '🚜',
    coursesCount: 4
  },
  {
    id: 'diagnostic',
    name: 'Diagnóstico Electrónico',
    slug: 'diagnostico-electronico',
    description: 'Metodología científica de diagnóstico, Live Data, Fuel Trims y resolución de fallas complejas.',
    icon: '🔬',
    coursesCount: 5
  },
  {
    id: 'obd2',
    name: 'OBD-II',
    slug: 'obd2',
    description: 'Estándar internacional OBD-II, Modos $01 al $0A, monitores I/M y ciclos de conducción.',
    icon: '🚘',
    coursesCount: 4
  },
  {
    id: 'sensors',
    name: 'Sensores Automotrices',
    slug: 'sensores-automotrices',
    description: 'Diagnóstico profundo de CKP, CMP, MAF, MAP, TPS, ECT, O2/Wideband y sensores de presión.',
    icon: '📡',
    coursesCount: 7
  },
  {
    id: 'actuators',
    name: 'Actuadores Automotrices',
    slug: 'actuadores-automotrices',
    description: 'Diagnóstico de inyectores, bobinas de encendido, válvulas PWM, motores VVT y mariposas electrónicas.',
    icon: '⚡',
    coursesCount: 4
  },
  {
    id: 'ecu',
    name: 'ECU (Computadoras Automotrices)',
    slug: 'ecu',
    description: 'Arquitectura interna de ECM/PCM, banqueo, fuentes reguladas, etapas de potencia y clonación.',
    icon: '💻',
    coursesCount: 5
  },
  {
    id: 'canbus',
    name: 'CAN Bus',
    slug: 'canbus',
    description: 'Diagnóstico de redes Controller Area Network (High/Low), tramas de datos, resistencia y Bus-Off.',
    icon: '📶',
    coursesCount: 4
  },
  {
    id: 'linbus',
    name: 'LIN Bus',
    slug: 'linbus',
    description: 'Redes sub-módulo monohilo, alternadores LIN, módulos de puerta y sensores inteligentes.',
    icon: '〰️',
    coursesCount: 3
  },
  {
    id: 'oscilloscope',
    name: 'Osciloscopio Automotriz',
    slug: 'osciloscopio-automotriz',
    description: 'Osciloscopios de 2 y 4 canales, transductores de presión FirstLook/WPS, atenuadores y señales.',
    icon: '📈',
    coursesCount: 5
  },
  {
    id: 'transmissions',
    name: 'Transmisiones Automáticas',
    slug: 'transmisiones-automaticas',
    description: 'Transmisiones hidromáticas de 6/8/10 velocidades, planetarios, embragues y cuerpo de válvulas.',
    icon: '⚙️',
    coursesCount: 4
  },
  {
    id: 'cvt',
    name: 'Transmisiones CVT',
    slug: 'transmisiones-cvt',
    description: 'Continuously Variable Transmission, poleas de diámetro variable, banda metálica y presión de aceite.',
    icon: '🔄',
    coursesCount: 3
  },
  {
    id: 'dct',
    name: 'Transmisiones DCT / DSG',
    slug: 'transmisiones-dct-dsg',
    description: 'Dual Clutch Transmission, doble embrague seco y húmedo, mecatrónica y ajuste básico con escáner.',
    icon: '🔀',
    coursesCount: 3
  },
  {
    id: 'abs',
    name: 'Sistemas ABS',
    slug: 'sistemas-abs',
    description: 'Anti-lock Braking System, unidad electrohidráulica, sensores magnetoresistivos e inductivos.',
    icon: '🛑',
    coursesCount: 3
  },
  {
    id: 'esp',
    name: 'Sistemas ESP / Control de Estabilidad',
    slug: 'sistemas-esp',
    description: 'Electronic Stability Program, sensor de ángulo de dirección SAS, giroscopio y desacelerómetro.',
    icon: '🚗',
    coursesCount: 3
  },
  {
    id: 'airbag',
    name: 'Sistemas Airbag & SRS',
    slug: 'sistemas-airbag-srs',
    description: 'Supplemental Restraint System, detonadores, sensores de impacto frontal/lateral y módulo ORC/SDM.',
    icon: '🛡️',
    coursesCount: 3
  },
  {
    id: 'hvac',
    name: 'Climatización Automotriz',
    slug: 'climatizacion-automotriz',
    description: 'Aire acondicionado, compresores de cilindrada variable, R134a/R1234yf y climatizadores bi-zona.',
    icon: '❄️',
    coursesCount: 3
  },
  {
    id: 'hybrid',
    name: 'Vehículos Híbridos',
    slug: 'vehiculos-hibridos',
    description: 'Sistemas Toyota THS II, Honda i-MMD, motores MG1/MG2, transmisión transeje planetaria PSD.',
    icon: '🔋',
    coursesCount: 4
  },
  {
    id: 'ev',
    name: 'Vehículos Eléctricos (EV)',
    slug: 'vehiculos-electricos',
    description: 'Seguridad en Alto Voltaje CAT III 1000V, motores CA síncronos de imanes permanentes y puerto CCS2.',
    icon: '⚡',
    coursesCount: 4
  },
  {
    id: 'hv_batteries',
    name: 'Baterías HV (Alto Voltaje)',
    slug: 'baterias-hv',
    description: 'Química de celdas Li-Ion / NiMH, paquetes en serie/paralelo, pruebas de SOH, resistencia interna.',
    icon: '🔋',
    coursesCount: 3
  },
  {
    id: 'bms',
    name: 'BMS (Battery Management System)',
    slug: 'bms',
    description: 'Gestión de batería, balanceo pasivo y activo de celdas, monitoreo de temperatura, relés SMR.',
    icon: '🧠',
    coursesCount: 3
  },
  {
    id: 'inverters',
    name: 'Inversores de Frecuencia HV',
    slug: 'inversores-hv',
    description: 'Convertidor Boost, módulo de potencia IGBT / SiC, inversor trifásico y convertidor DC-DC 12V.',
    icon: '🎛️',
    coursesCount: 3
  },
  {
    id: 'adas',
    name: 'Sistemas ADAS',
    slug: 'sistemas-adas',
    description: 'Asistencia avanzada a la conducción, cámaras parabrisas, radar de ondas milimétricas y calibración.',
    icon: '👁️',
    coursesCount: 3
  },
  {
    id: 'programming',
    name: 'Programación Automotriz',
    slug: 'programacion-automotriz',
    description: 'Reprogramación J2534, vírgenes immobilizer, lectura EEPROM/FLASH, adaptación de llaves.',
    icon: '🔑',
    coursesCount: 4
  },
  {
    id: 'diagrams',
    name: 'Interpretación de Diagramas',
    slug: 'interpretacion-de-diagramas',
    description: 'Lectura de esquemas eléctricos DIN, ISO, Mitchell1, ALLDATA, wiring diagrams OEM y pinouts.',
    icon: '📐',
    coursesCount: 3
  },
  {
    id: 'multimeter',
    name: 'Uso del Multímetro',
    slug: 'uso-del-multimetro',
    description: 'Medición de voltaje True-RMS, corriente con pinza amperimétrica, resistencia, frecuencia y duty cycle.',
    icon: '⏱️',
    coursesCount: 3
  }
];
