import { Brand, VehicleModel, DTCInfo } from '../types';

export const DTCS_DATABASE: DTCInfo[] = [
  {
    code: 'P0171',
    description: 'Sistema Demasiado Magro (Banco 1) / System Too Lean (Bank 1)',
    system: 'Inyección y Control de Mezcla Aire/Combustible',
    severity: 'Media',
    possibleCauses: [
      'Fuga de vacío en múltiple de admisión o mangueras de vacío',
      'Sensor MAF sucio, descalibrado o defectuoso',
      'Baja presión de combustible (Filtro obstruido o bomba fatigada)',
      'Inyectores obstruidos o sucios',
      'Fuga de escape antes del sensor O2 primario'
    ],
    recommendedTests: [
      'Medir lectura del MAF en gramos por segundo (g/s) en ralentí',
      'Monitorear Fuel Trims (STFT y LTFT) rociando limpiador de carburador',
      'Prueba de presión de combustible con manómetro en riel',
      'Prueba de humo para fugas de admisión'
    ],
    relatedCourses: ['diagnostico-obd2', 'electronica-automotriz'],
    relatedLabs: ['multimeter-lab', 'oscilloscope-lab']
  },
  {
    code: 'P0300',
    description: 'Fallo de Encendido Múltiple/Aleatorio Detectado',
    system: 'Encendido y Encendido Cilindros',
    severity: 'Alta',
    possibleCauses: [
      'Bujías desgastadas o descalibradas',
      'Bobinas de encendido (COP) fatigadas o con fugas de chispa',
      'Presión de combustible deficiente',
      'Pérdida de compresión en múltiples cilindros',
      'Fallo de señal CKP intermitente'
    ],
    recommendedTests: [
      'Prueba de corriente con pinza amperimétrica en bobinas COP',
      'Prueba de compresión y fuga de cilindros',
      'Monitoreo de contadores de Misfire en scanner'
    ],
    relatedCourses: ['diagnostico-obd2', 'sistemas-mecanicos'],
    relatedLabs: ['oscilloscope-lab']
  },
  {
    code: 'P0335',
    description: 'Circuito A del Sensor de Posición del Cigüeñal (CKP)',
    system: 'Gestión de Motor y Sincronización',
    severity: 'Alta',
    possibleCauses: [
      'Sensor CKP defectuoso o arnés interrumpido/en corto',
      'Entrehierro o suciedad en la rueda fónica',
      'Eje o corona fónica deformada',
      'Falla en la etapa de entrada de la ECU'
    ],
    recommendedTests: [
      'Comprobar resistencia o señal del sensor CKP con osciloscopio',
      'Verificar voltaje de alimentación de 5V u 8V en sensores Hall',
      'Prueba de continuidad del arnés a los pines de la ECU'
    ],
    relatedCourses: ['electronica-automotriz', 'diagnostico-obd2'],
    relatedLabs: ['oscilloscope-lab']
  },
  {
    code: 'U0100',
    description: 'Pérdida de Comunicación con la ECU del Motor (ECM/PCM)',
    system: 'Redes Automotrices CAN Bus',
    severity: 'Crítica',
    possibleCauses: [
      'Pérdida de alimentación (+12V) o masa en la ECU del motor',
      'Líneas CAN High o CAN Low en cortocircuito o abiertas',
      'Falla del módulo Gateway o módulo de control de carrocería (BCM)',
      'Resistencias terminadoras de 120 ohms ausentes o dañadas'
    ],
    recommendedTests: [
      'Medir resistencia de la red CAN Bus en conector DLC (debe ser ~60 Ohms)',
      'Comprobar voltajes CAN H (~2.5V a 3.5V) y CAN L (~1.5V a 2.5V)',
      'Grabar trama CAN Bus con Osciloscopio'
    ],
    relatedCourses: ['redes-automotrices', 'diagnostico-obd2'],
    relatedLabs: ['canbus-lab']
  },
  {
    code: 'P0A80',
    description: 'Reemplazar Paquete de Baterías de Alto Voltaje (Hybrid Battery Pack)',
    system: 'Sistema Híbrido (HEV)',
    severity: 'Alta',
    possibleCauses: [
      'Desbalance de voltaje entre bloques de celdas NiMH/Li-Ion',
      'Corrosión en las pletinas de conexión entre módulos de batería',
      'Ventilador de enfriamiento de batería obstruido o inoperativo',
      'Falla de lectura del sensor de temperatura o voltaje del BMS'
    ],
    recommendedTests: [
      'Escanear delta de voltaje entre bloques de batería en tiempo real',
      'Inspeccionar pletinas de cobre por sulfatación',
      'Comprobar funcionamiento del soplador de refrigeración con scanner'
    ],
    relatedCourses: ['mantenimiento-hibridos', 'diagnostico-ev'],
    relatedLabs: ['multimeter-lab']
  },
  {
    code: 'P0AA6',
    description: 'Falla de Aislamiento del Sistema de Alto Voltaje (HV Insulation Fault)',
    system: 'Sistema Eléctrico EV / Híbrido',
    severity: 'Crítica',
    possibleCauses: [
      'Fuga de corriente de alto voltaje a chasis del vehículo',
      'Humedad dentro del inversor o motor eléctrico',
      'Cableado de alto voltaje (naranja) dañado o desgastado',
      'Fuga de refrigerante dieléctrico en compresor A/C eléctrico'
    ],
    recommendedTests: [
      'Medir resistencia de aislamiento con Megaóhmetro (MΩ) a 500V/1000V',
      'Verificar desconexión de servicio MSD antes de cualquier maniobra',
      'Inspeccionar integridad del compresor A/C HV'
    ],
    relatedCourses: ['diagnostico-ev', 'seguridad-alto-voltaje'],
    relatedLabs: ['multimeter-lab']
  }
];

export const BRANDS_DATA: Brand[] = [
  {
    id: 'toyota',
    name: 'Toyota',
    logo: '🚗',
    country: 'Japón',
    popularModels: ['Yaris', 'Corolla', 'Hilux', 'RAV4', 'Prius'],
    disclaimer: 'Contenido educativo independiente. YOVE Academy no está afiliada, patrocinada ni respaldada por Toyota Motor Corporation.',
    commonDtcs: DTCS_DATABASE
  },
  {
    id: 'volkswagen',
    name: 'Volkswagen',
    logo: '🚙',
    country: 'Alemania',
    popularModels: ['Golf', 'Jetta', 'Polo', 'Amarok', 'Tiguan'],
    disclaimer: 'Contenido educativo independiente. YOVE Academy no está afiliada, patrocinada ni respaldada por Volkswagen AG.',
    commonDtcs: DTCS_DATABASE
  },
  {
    id: 'hyundai',
    name: 'Hyundai',
    logo: '🚘',
    country: 'Corea del Sur',
    popularModels: ['Accent', 'Elantra', 'Tucson', 'Santa Fe', 'Ioniq'],
    disclaimer: 'Contenido educativo independiente. YOVE Academy no está afiliada, patrocinada ni respaldada por Hyundai Motor Company.',
    commonDtcs: DTCS_DATABASE
  },
  {
    id: 'kia',
    name: 'Kia',
    logo: '🚘',
    country: 'Corea del Sur',
    popularModels: ['Rio', 'Cerato', 'Sportage', 'Sorento', 'EV6'],
    disclaimer: 'Contenido educativo independiente. YOVE Academy no está afiliada, patrocinada ni respaldada por Kia Corporation.',
    commonDtcs: DTCS_DATABASE
  },
  {
    id: 'nissan',
    name: 'Nissan',
    logo: '🏎️',
    country: 'Japón',
    popularModels: ['Versa', 'Sentra', 'Frontier', 'Kicks', 'Leaf'],
    disclaimer: 'Contenido educativo independiente. YOVE Academy no está afiliada, patrocinada ni respaldada por Nissan Motor Co., Ltd.',
    commonDtcs: DTCS_DATABASE
  },
  {
    id: 'ford',
    name: 'Ford',
    logo: '🛻',
    country: 'Estados Unidos',
    popularModels: ['Fiesta', 'Focus', 'Ranger', 'F-150', 'Mustang Mach-E'],
    disclaimer: 'Contenido educativo independiente. YOVE Academy no está afiliada, patrocinada ni respaldada por Ford Motor Company.',
    commonDtcs: DTCS_DATABASE
  },
  {
    id: 'chevrolet',
    name: 'Chevrolet',
    logo: '🚙',
    country: 'Estados Unidos',
    popularModels: ['Onix', 'Sail', 'Tracker', 'S10', 'Colorado'],
    disclaimer: 'Contenido educativo independiente. YOVE Academy no está afiliada, patrocinada ni respaldada por General Motors Company.',
    commonDtcs: DTCS_DATABASE
  },
  {
    id: 'honda',
    name: 'Honda',
    logo: '🏎️',
    country: 'Japón',
    popularModels: ['Civic', 'City', 'CR-V', 'HR-V', 'Fit'],
    disclaimer: 'Contenido educativo independiente. YOVE Academy no está afiliada, patrocinada ni respaldada por Honda Motor Co., Ltd.',
    commonDtcs: DTCS_DATABASE
  },
  {
    id: 'mazda',
    name: 'Mazda',
    logo: '🚘',
    country: 'Japón',
    popularModels: ['Mazda 3', 'Mazda 2', 'CX-5', 'CX-30', 'MX-5'],
    disclaimer: 'Contenido educativo independiente. YOVE Academy no está afiliada, patrocinada ni respaldada por Mazda Motor Corporation.',
    commonDtcs: DTCS_DATABASE
  },
  {
    id: 'mitsubishi',
    name: 'Mitsubishi',
    logo: '🚙',
    country: 'Japón',
    popularModels: ['L200', 'Montero Sport', 'Outlander', 'ASX', 'Mirage'],
    disclaimer: 'Contenido educativo independiente. YOVE Academy no está afiliada, patrocinada ni respaldada por Mitsubishi Motors Corporation.',
    commonDtcs: DTCS_DATABASE
  },
  {
    id: 'subaru',
    name: 'Subaru',
    logo: '⭐',
    country: 'Japón',
    popularModels: ['Impreza', 'XV / Crosstrek', 'Forester', 'Outback', 'WRX'],
    disclaimer: 'Contenido educativo independiente. YOVE Academy no está afiliada, patrocinada ni respaldada por Subaru Corporation.',
    commonDtcs: DTCS_DATABASE
  },
  {
    id: 'renault',
    name: 'Renault',
    logo: '🚗',
    country: 'Francia',
    popularModels: ['Kwid', 'Logan', 'Sandero', 'Duster', 'Zoe'],
    disclaimer: 'Contenido educativo independiente. YOVE Academy no está afiliada, patrocinada ni respaldada por Renault Group.',
    commonDtcs: DTCS_DATABASE
  },
  {
    id: 'peugeot',
    name: 'Peugeot',
    logo: '🦁',
    country: 'Francia',
    popularModels: ['208', '308', '2008', '3008', 'e-208'],
    disclaimer: 'Contenido educativo independiente. YOVE Academy no está afiliada, patrocinada ni respaldada por Stellantis NV / Peugeot.',
    commonDtcs: DTCS_DATABASE
  },
  {
    id: 'citroen',
    name: 'Citroën',
    logo: '🚗',
    country: 'Francia',
    popularModels: ['C3', 'C4 Cactus', 'Berlingo', 'C5 Aircross'],
    disclaimer: 'Contenido educativo independiente. YOVE Academy no está afiliada, patrocinada ni respaldada por Stellantis NV / Citroën.',
    commonDtcs: DTCS_DATABASE
  },
  {
    id: 'fiat',
    name: 'Fiat',
    logo: '🇮🇹',
    country: 'Italia',
    popularModels: ['Uno', 'Palio', 'Cronos', 'Toro', 'Pulse', '500e'],
    disclaimer: 'Contenido educativo independiente. YOVE Academy no está afiliada, patrocinada ni respaldada por Stellantis NV / Fiat.',
    commonDtcs: DTCS_DATABASE
  },
  {
    id: 'bmw',
    name: 'BMW',
    logo: '🏁',
    country: 'Alemania',
    popularModels: ['Serie 3', 'Serie 1', 'X3', 'X5', 'i4'],
    disclaimer: 'Contenido educativo independiente. YOVE Academy no está afiliada, patrocinada ni respaldada por BMW AG.',
    commonDtcs: DTCS_DATABASE
  },
  {
    id: 'mercedes-benz',
    name: 'Mercedes-Benz',
    logo: '🌟',
    country: 'Alemania',
    popularModels: ['Clase A', 'Clase C', 'Clase E', 'GLC', 'EQE'],
    disclaimer: 'Contenido educativo independiente. YOVE Academy no está afiliada, patrocinada ni respaldada por Mercedes-Benz Group AG.',
    commonDtcs: DTCS_DATABASE
  },
  {
    id: 'audi',
    name: 'Audi',
    logo: '⭕',
    country: 'Alemania',
    popularModels: ['A3', 'A4', 'Q3', 'Q5', 'e-tron'],
    disclaimer: 'Contenido educativo independiente. YOVE Academy no está afiliada, patrocinada ni respaldada por AUDI AG.',
    commonDtcs: DTCS_DATABASE
  },
  {
    id: 'volvo',
    name: 'Volvo',
    logo: '🇸🇪',
    country: 'Suecia',
    popularModels: ['XC40', 'XC60', 'XC90', 'C40 Recharge'],
    disclaimer: 'Contenido educativo independiente. YOVE Academy no está afiliada, patrocinada ni respaldada por Volvo Car Corporation.',
    commonDtcs: DTCS_DATABASE
  },
  {
    id: 'jeep',
    name: 'Jeep',
    logo: '🏔️',
    country: 'Estados Unidos',
    popularModels: ['Renegade', 'Compass', 'Grand Cherokee', 'Wrangler'],
    disclaimer: 'Contenido educativo independiente. YOVE Academy no está afiliada, patrocinada ni respaldada por Stellantis NV / Jeep.',
    commonDtcs: DTCS_DATABASE
  },
  {
    id: 'suzuki',
    name: 'Suzuki',
    logo: '🚘',
    country: 'Japón',
    popularModels: ['Swift', 'Jimny', 'Vitara', 'Baleno', 'S-Cross'],
    disclaimer: 'Contenido educativo independiente. YOVE Academy no está afiliada, patrocinada ni respaldada por Suzuki Motor Corporation.',
    commonDtcs: DTCS_DATABASE
  },
  {
    id: 'chery',
    name: 'Chery',
    logo: '🇨🇳',
    country: 'China',
    popularModels: ['Tiggo 2', 'Tiggo 4 Pro', 'Tiggo 7 Pro', 'Arrizo 6'],
    disclaimer: 'Contenido educativo independiente. YOVE Academy no está afiliada, patrocinada ni respaldada por Chery Automobile Co., Ltd.',
    commonDtcs: DTCS_DATABASE
  },
  {
    id: 'geely',
    name: 'Geely',
    logo: '🌐',
    country: 'China',
    popularModels: ['GX3 Pro', 'Coolray', 'Azkarra', 'Geometry C'],
    disclaimer: 'Contenido educativo independiente. YOVE Academy no está afiliada, patrocinada ni respaldada por Geely Auto Group.',
    commonDtcs: DTCS_DATABASE
  },
  {
    id: 'jac',
    name: 'JAC',
    logo: '🚚',
    country: 'China',
    popularModels: ['JS2', 'JS4', 'T8 PRO', 'iEV7S'],
    disclaimer: 'Contenido educativo independiente. YOVE Academy no está afiliada, patrocinada ni respaldada por JAC Motors.',
    commonDtcs: DTCS_DATABASE
  },
  {
    id: 'byd',
    name: 'BYD',
    logo: '🔋',
    country: 'China',
    popularModels: ['Dolphin', 'Atto 3', 'Seal', 'Han', 'Tang'],
    disclaimer: 'Contenido educativo independiente. YOVE Academy no está afiliada, patrocinada ni respaldada por BYD Company Ltd.',
    commonDtcs: DTCS_DATABASE
  },
  {
    id: 'tesla',
    name: 'Tesla',
    logo: '⚡',
    country: 'Estados Unidos',
    popularModels: ['Model 3', 'Model Y', 'Model S', 'Model X', 'Cybertruck'],
    disclaimer: 'Contenido educativo independiente. YOVE Academy no está afiliada, patrocinada ni respaldada por Tesla, Inc.',
    commonDtcs: DTCS_DATABASE
  }
];

export const VEHICLE_BRANDS = BRANDS_DATA;

export const VEHICLE_MODELS_DATA: VehicleModel[] = [
  {
    id: 'toyota-yaris',
    name: 'Yaris',
    brandId: 'toyota',
    years: [2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
    generations: [
      {
        id: 'gen-yaris-3',
        name: 'Generación III (XP130)',
        years: [2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020],
        engines: [
          {
            code: '1NZ-FE',
            displacement: '1.5L VVT-i',
            fuelType: 'Gasolina',
            power: '106 HP',
            transmissions: [
              { id: 't1', name: 'Manual 5 Velocidades', type: 'Manual' },
              { id: 't2', name: 'CVT Multidrive 7V Simulado', type: 'CVT' }
            ],
            systems: [
              {
                id: 'inyeccion-1nzfe',
                name: 'Inyección Electrónica VVT-i',
                category: 'inyección',
                components: [
                  {
                    id: 'ckp-1nzfe',
                    name: 'Sensor CKP (Posición de Cigüeñal)',
                    type: 'sensor',
                    description: 'Sensor Inductivo de 2 pines en la polea del cigüeñal.',
                    location: 'Detrás de la polea de accesorios inferior.',
                    typicalSignals: 'Señal Senoidal alterna de ~1.5V a 12V según RPM.',
                    referenceValues: 'Resistencia coil: 980 - 1,250 Ω // Voltaje min: 1.5 VAC @ 600 RPM',
                    dtcs: ['P0335', 'P0336']
                  },
                  {
                    id: 'maf-1nzfe',
                    name: 'Sensor MAF / IAT (Flujo de Aire Mass)',
                    type: 'sensor',
                    description: 'Sensor Hilo Caliente de 5 pines con termistor de aire integrado.',
                    location: 'Cuerpo del filtro de aire.',
                    typicalSignals: 'Voltaje analógico 1.0V (Ralentí) a 4.2V (WOT).',
                    referenceValues: '1.1V @ 700 RPM // 1.7V @ 2,000 RPM // 4.0V WOT',
                    dtcs: ['P0100', 'P0101', 'P0171']
                  }
                ]
              },
              {
                id: 'ecu-1nzfe',
                name: 'Módulo de Control de Motor (ECM Denso)',
                category: 'ecu',
                components: [
                  {
                    id: 'pcm-denso-1nz',
                    name: 'Unidad ECU Denso 32-bit',
                    type: 'ecu',
                    description: 'Módulo principal con conectores de 60 pines y driver dual VVT-i.',
                    location: 'Compartimento del motor, junto a la batería.',
                    typicalSignals: 'Señales CAN Bus 500kbps, control PWM de inyectores.',
                    referenceValues: 'Alimentación: +12.6V en pines B+ y IGT1-4.',
                    dtcs: ['U0100', 'P0606']
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    engines: [
      {
        code: '1NZ-FE',
        displacement: '1.5L VVT-i',
        fuelType: 'Gasolina',
        power: '106 HP',
        transmissions: [
          { id: 't1', name: 'Manual 5 Velocidades', type: 'Manual' },
          { id: 't2', name: 'CVT Multidrive 7V', type: 'CVT' }
        ],
        systems: [
          {
            id: 'inyeccion-1nzfe',
            name: 'Inyección Electrónica VVT-i',
            category: 'inyección',
            components: [
              {
                id: 'ckp-1nzfe',
                name: 'Sensor CKP (Posición de Cigüeñal)',
                type: 'sensor',
                description: 'Sensor Inductivo de 2 pines en la polea del cigüeñal.',
                location: 'Detrás de la polea de accesorios inferior.',
                typicalSignals: 'Señal Senoidal alterna de ~1.5V a 12V según RPM.',
                referenceValues: 'Resistencia coil: 980 - 1,250 Ω // Voltaje min: 1.5 VAC @ 600 RPM',
                dtcs: ['P0335', 'P0336']
              },
              {
                id: 'maf-1nzfe',
                name: 'Sensor MAF / IAT (Flujo de Aire Mass)',
                type: 'sensor',
                description: 'Sensor Hilo Caliente de 5 pines con termistor de aire integrado.',
                location: 'Cuerpo del filtro de aire.',
                typicalSignals: 'Voltaje analógico 1.0V (Ralentí) a 4.2V (WOT).',
                referenceValues: '1.1V @ 700 RPM // 1.7V @ 2,000 RPM // 4.0V WOT',
                dtcs: ['P0100', 'P0101', 'P0171']
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'toyota-prius',
    name: 'Prius',
    brandId: 'toyota',
    years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
    engines: [
      {
        code: '2ZR-FXE',
        displacement: '1.8L Atkinson + HSD EV',
        fuelType: 'Híbrido',
        power: '121 HP',
        transmissions: [
          { id: 't-ecvt', name: 'TransejePlanetario e-CVT', type: 'CVT' }
        ],
        systems: [
          {
            id: 'sys-hsd',
            name: 'Sistema Híbrido Hybrid Synergy Drive (HSD)',
            category: 'hibrido',
            components: [
              {
                id: 'inverter-prius',
                name: 'Inversor / Conversor Boost HV',
                type: 'ecu',
                description: 'Inversor trifásico con módulo IPM y conversor DC/DC 12V.',
                location: 'Compartimento del motor sobre el transeje.',
                typicalSignals: 'Tensiones AC de 201V a 650V trifásica para MG1/MG2.',
                referenceValues: 'Resistencia aislamiento > 10 MΩ',
                dtcs: ['P0A78', 'P0A94']
              },
              {
                id: 'hv-battery-prius',
                name: 'Batería de Alto Voltaje (HV Pack)',
                type: 'actuator',
                description: 'Pack de 28 módulos NiMH conectadas en serie (201.6V nominal).',
                location: 'Bajo el asiento trasero.',
                typicalSignals: 'Voltaje total 201.6V DC a 240V DC.',
                referenceValues: 'Diferencia max entre bloques: 0.3V',
                dtcs: ['P0A80', 'P3000']
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'vw-golf',
    name: 'Golf',
    brandId: 'volkswagen',
    years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
    engines: [
      {
        code: '1.4 TSI',
        displacement: '1.4L Turbo GDI',
        fuelType: 'Gasolina',
        power: '150 HP',
        transmissions: [
          { id: 'dsg7', name: 'DSG 7 Velocidades Doble Embrague (DQ200)', type: 'Dual-Clutch (DSG)' }
        ],
        systems: [
          {
            id: 'gdi-14tsi',
            name: 'Inyección Directa GDI & Turbo',
            category: 'inyección',
            components: [
              {
                id: 'hpfp-tsi',
                name: 'Bomba de Alta Presión de Combustible',
                type: 'actuator',
                description: 'Bomba mecánica accionada por árbol de levas con solenoide de control PWM.',
                location: 'Sobre la tapa de válvulas superior.',
                typicalSignals: 'Pulso PWM a 12V con variación de ciclo útil.',
                referenceValues: 'Presión Riel: 35 Bar en ralentí a 200 Bar a carga máxima',
                dtcs: ['P0087', 'P0088']
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'byd-dolphin',
    name: 'Dolphin',
    brandId: 'byd',
    years: [2022, 2023, 2024],
    engines: [
      {
        code: 'BYD-TZ180',
        displacement: 'Motor Eléctrico Síncrono Imanes Permanentes',
        fuelType: 'Eléctrico',
        power: '95 HP / 177 HP',
        transmissions: [
          { id: 'ev-red', name: 'Reductor Directo Monomarcha EV', type: 'Reductor Directo EV' }
        ],
        systems: [
          {
            id: 'ev-blade-battery',
            name: 'Sistema Batería Blade LFP 60kWh',
            category: 'ev',
            components: [
              {
                id: 'bms-byd',
                name: 'Módulo BMS (Battery Management System)',
                type: 'ecu',
                description: 'Controlador inteligente de carga, balanceo de celdas LFP y protección de temperatura.',
                location: 'Integrado en el Pack Blade bajo el piso.',
                typicalSignals: 'Red CAN-EV 500kbps, monitoreo de 126 celdas.',
                referenceValues: 'Voltaje Nominal: 403.2V DC',
                dtcs: ['P0AA6', 'U0111']
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'tesla-model3',
    name: 'Model 3',
    brandId: 'tesla',
    years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
    engines: [
      {
        code: '3D1 Dual Motor',
        displacement: 'Motor Eléctrico Inducción / Reluctancia',
        fuelType: 'Eléctrico',
        power: '283 HP - 450 HP',
        transmissions: [
          { id: 'tesla-single', name: 'Reductor Directo Monomarcha Tesla', type: 'Reductor Directo EV' }
        ],
        systems: [
          {
            id: 'tesla-hv-drivetrain',
            name: 'Inversor MOSFET SiC & Batería 400V',
            category: 'ev',
            components: [
              {
                id: 'tesla-pcs',
                name: 'Power Conversion System (PCS)',
                type: 'ecu',
                description: 'Unidad integrada que combina Inversor, Cargador Onboard y Conversor DC-DC 12V.',
                location: 'Bajo el asiento trasero junto al pack HV.',
                typicalSignals: 'Red CAN Bus propia y EtherCAN.',
                referenceValues: 'Voltaje Operativo HV: 350V - 420V',
                dtcs: ['P0AA6', 'P0A0D']
              }
            ]
          }
        ]
      }
    ]
  }
];
