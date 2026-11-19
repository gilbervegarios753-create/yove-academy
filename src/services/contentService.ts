import { ALL_COURSES_DATA } from '../data/coursesData';
import { AUTOMOTIVE_CATEGORIES } from '../data/categoriesData';
import { BRANDS_DATA, VEHICLE_MODELS_DATA, DTCS_DATABASE } from '../data/brandsData';
import { MASTER_DTC_DATABASE } from '../data/dtcData';
import { AUTOMOTIVE_15_SYSTEMS, SystemCategoryDetail } from '../data/systemsData';
import { DIAGNOSTIC_CASES_DATA } from '../data/casesData';
import { LABS_DATA } from '../data/labsData';
import { Course, Brand, VehicleModel, CategoryInfo, CourseCategory, Lesson, DTCInfo, DiagnosticCase, LabSimulation, ComponentInfo, VehicleSystem, DTCModel, DTCCategory } from '../types';

let customBrandsStore: Brand[] = [...BRANDS_DATA];
let customDtcsStore: DTCModel[] = [...MASTER_DTC_DATABASE];

export interface SearchResultItem {
  type: 'brand' | 'model' | 'engine' | 'system' | 'component' | 'dtc';
  title: string;
  subtitle: string;
  details: string;
  brandId?: string;
  modelId?: string;
  systemKey?: string;
  dtcCode?: string;
}

export class ContentService {
  public static getAllCourses(): Course[] {
    return ALL_COURSES_DATA;
  }

  public static getCourseById(id: string): Course | undefined {
    return ALL_COURSES_DATA.find(c => c.id === id);
  }

  public static getCoursesByCategory(category: CourseCategory): Course[] {
    return ALL_COURSES_DATA.filter(c => c.category === category);
  }

  public static getAllCategories(): CategoryInfo[] {
    return AUTOMOTIVE_CATEGORIES;
  }

  public static getAllBrands(): Brand[] {
    return customBrandsStore;
  }

  public static addBrand(newBrand: Brand): void {
    if (!customBrandsStore.some(b => b.id === newBrand.id)) {
      customBrandsStore.push(newBrand);
    }
  }

  public static getModelsByBrand(brandId: string): VehicleModel[] {
    const existing = VEHICLE_MODELS_DATA.filter(m => m.brandId === brandId);
    if (existing.length > 0) {
      return existing;
    }

    const brand = customBrandsStore.find(b => b.id === brandId);
    if (!brand) return [];

    return brand.popularModels.map((modelName, idx) => {
      const slug = `${brandId}-${modelName.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
      const isEV = brand.id === 'byd' || brand.id === 'tesla';
      const isHybrid = modelName.toLowerCase().includes('hybrid') || modelName.toLowerCase().includes('phev');

      return {
        id: slug,
        name: modelName,
        brandId: brand.id,
        years: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
        bodyType: 'Información no disponible',
        platform: 'Información no disponible',
        voltageArchitecture: isEV ? 'HV 400V / 800V + 12V Auxiliar' : isHybrid ? 'HV 200V-650V + 12V Auxiliar' : '12V Convencional',
        obdLocation: 'Bajo el tablero de instrumentos, lado del conductor (DLC 16 pines)',
        engines: [
          {
            code: `${brand.name.toUpperCase()}-${idx + 1}.${isEV ? 'EV' : '6L'}`,
            displacement: isEV ? 'Motor Eléctrico Síncrono Imanes Permanentes' : '1.6L 16V Multi-Punto SFI',
            fuelType: isEV ? 'Eléctrico' : isHybrid ? 'Híbrido' : 'Gasolina',
            power: isEV ? '180 HP / 132 kW' : '120 HP @ 6,000 RPM',
            torque: isEV ? '310 Nm Instantáneo' : 'Información no disponible',
            compressionRatio: isEV ? 'N/A (Motor Eléctrico)' : 'Información no disponible',
            timingType: isEV ? 'Transmisión directa sin cadena' : 'Cadena de distribución de alta durabilidad',
            injectionType: isEV ? 'Inversor MOSFET SiC / IGBT Trifásico' : 'Inyección Electrónica Multipunto Secuencial',
            ecuModel: 'Información no disponible',
            obdProtocol: 'CAN Bus high-speed 500kbps (ISO 15765-4)',
            emissionsStandard: isEV ? 'Zero Emissions (ZEV)' : 'Euro 6d-TEMP / EPA Tier 3',
            transmissions: [
              {
                id: `${slug}-trans-1`,
                name: isEV ? 'Reductor Directo Monomarcha EV' : 'Transmisión Automática / Manual 6V',
                type: isEV ? 'Reductor Directo EV' : 'Automática',
                gears: isEV ? '1 Marcha (Reductor 9.0:1)' : '6 Velocidades',
                fluidType: 'Información no disponible',
                controlModule: isEV ? 'Unidad VCU / Inversor Integrado' : 'Módulo TCM de Gestión Electrónica',
                solenoids: isEV ? 'N/A' : 'Solenoides de cambio de presión lineal'
              }
            ],
            systems: [
              {
                id: `${slug}-sys-inj`,
                name: isEV ? 'Gestión de Tracción Eléctrica & Batería HV' : 'Inyección Electrónica & Gestión de Motor',
                category: isEV ? 'ev' : 'inyección',
                description: 'Sistema principal de potencia y respuesta electrónica vehicular',
                components: [
                  {
                    id: `${slug}-ckp`,
                    name: isEV ? 'Sensor Resolver / Posición de Rotor' : 'Sensor CKP de Cigüeñal',
                    type: 'sensor',
                    description: isEV ? 'Sensor analógico inductivo de alta precisión para control de campo estatórico' : 'Sensor Inductivo de velocidad y posición angular de cigüeñal',
                    location: isEV ? 'Tapa trasera del motor eléctrico' : 'Bloque de motor inferior, cerca de polea/volante',
                    typicalSignals: isEV ? 'Señales Sen/Cos alternas trifásicas' : 'Señal Senoidal o Cuadrada en Frecuencia',
                    referenceValues: 'Resistencia: 900 - 1,200 Ω // Tensión VCC: 5.0V',
                    dtcs: isEV ? ['P0A78', 'P0C00'] : ['P0335', 'P0336']
                  },
                  {
                    id: `${slug}-map`,
                    name: isEV ? 'Sensor de Temperatura de Inversor / Estator' : 'Sensor MAP / MAF de Admisión',
                    type: 'sensor',
                    description: isEV ? 'Termistor NTC de monitoreo térmico de potencia' : 'Sensor de presión absoluta o flujo de masa de aire',
                    location: isEV ? 'Módulo inversor de potencia HV' : 'Colector de admisión / Caja de filtro',
                    typicalSignals: 'Voltaje analógico 0.5V - 4.5V proporcional',
                    referenceValues: '1.2V en reposo // 4.0V en máxima demanda',
                    dtcs: isEV ? ['P0A2B', 'P0A2C'] : ['P0106', 'P0107']
                  },
                  {
                    id: `${slug}-inj`,
                    name: isEV ? 'Módulo Inversor Trifásico IGBT/SiC' : 'Electroinyectores de Combustible',
                    type: 'actuator',
                    description: isEV ? 'Conversión DC-AC para modulación del estator' : 'Inyectores de alta impedancia y atomización fina',
                    location: isEV ? 'Carcasa del transeje eléctrico' : 'Riel de inyección en múltiple de admisión',
                    typicalSignals: 'Pulso PWM a masa con pico inductivo',
                    referenceValues: 'Resistencia coil: 12 - 16 Ω // Pulso: 2.0ms en ralentí',
                    dtcs: isEV ? ['P0A78'] : ['P0201', 'P0202']
                  }
                ]
              },
              {
                id: `${slug}-sys-abs`,
                name: 'Sistema de Frenos ABS / Control de Estabilidad ESP',
                category: 'abs',
                description: 'Seguridad activa y frenado regenerativo inteligente',
                components: [
                  {
                    id: `${slug}-wss`,
                    name: 'Sensores WSS de Velocidad de Rueda',
                    type: 'sensor',
                    description: 'Sensores Magnetorresistivos (MRE) de efecto hall activo',
                    location: 'Manguetas de rueda delanteras y traseras',
                    typicalSignals: 'Señal digital de corriente 7mA / 14mA',
                    referenceValues: 'Tensión de alimentación: +12.0V DC',
                    dtcs: ['C0035', 'C0040']
                  }
                ]
              }
            ]
          }
        ]
      };
    });
  }

  public static get15Systems(): SystemCategoryDetail[] {
    return AUTOMOTIVE_15_SYSTEMS;
  }

  public static getAllDtcs(): DTCModel[] {
    return customDtcsStore;
  }

  public static getDtcByCode(code: string): DTCModel | undefined {
    if (!code) return undefined;
    const cleanCode = code.trim().toUpperCase();
    return customDtcsStore.find(d => d.code.toUpperCase() === cleanCode);
  }

  public static searchDtcs(params: {
    query?: string;
    category?: string;
    system?: string;
    severity?: string;
    status?: string;
  }): DTCModel[] {
    const { query = '', category = 'Todas', system = 'Todos', severity = 'Todas', status = 'PUBLISHED' } = params;
    const term = query.trim().toLowerCase();

    return customDtcsStore.filter(dtc => {
      // Status filter
      if (status !== 'ALL' && dtc.status && dtc.status !== status) {
        return false;
      }

      // Category filter
      if (category && category !== 'Todas' && category !== 'Todos' && dtc.category !== category) {
        return false;
      }

      // Severity filter
      if (severity && severity !== 'Todas' && severity !== 'Todos' && dtc.severity !== severity) {
        return false;
      }

      // System filter
      if (system && system !== 'Todos' && !dtc.system.toLowerCase().includes(system.toLowerCase())) {
        return false;
      }

      // Search term match
      if (term) {
        const inCode = dtc.code.toLowerCase().includes(term);
        const inTitle = dtc.title ? dtc.title.toLowerCase().includes(term) : false;
        const inDesc = dtc.description.toLowerCase().includes(term);
        const inSystem = dtc.system.toLowerCase().includes(term);
        const inSymptoms = dtc.symptoms ? dtc.symptoms.some(s => s.toLowerCase().includes(term)) : false;
        const inCauses = dtc.possibleCauses ? dtc.possibleCauses.some(c => c.toLowerCase().includes(term)) : false;
        const inVehicles = dtc.relatedVehicles ? dtc.relatedVehicles.some(v => v.toLowerCase().includes(term)) : false;

        return inCode || inTitle || inDesc || inSystem || inSymptoms || inCauses || inVehicles;
      }

      return true;
    });
  }

  public static addDtc(newDtc: DTCModel): DTCModel {
    const existingIndex = customDtcsStore.findIndex(d => d.code.toUpperCase() === newDtc.code.toUpperCase());
    if (existingIndex >= 0) {
      customDtcsStore[existingIndex] = { ...newDtc, updatedAt: new Date().toISOString() };
      return customDtcsStore[existingIndex];
    } else {
      const created = {
        ...newDtc,
        id: newDtc.id || `dtc-${newDtc.code.toLowerCase()}`,
        status: newDtc.status || 'PUBLISHED',
        updatedAt: new Date().toISOString()
      };
      customDtcsStore.unshift(created);
      return created;
    }
  }

  public static updateDtc(code: string, updatedFields: Partial<DTCModel>): DTCModel | undefined {
    const cleanCode = code.trim().toUpperCase();
    const index = customDtcsStore.findIndex(d => d.code.toUpperCase() === cleanCode);
    if (index >= 0) {
      customDtcsStore[index] = {
        ...customDtcsStore[index],
        ...updatedFields,
        updatedAt: new Date().toISOString()
      };
      return customDtcsStore[index];
    }
    return undefined;
  }

  public static getDtcStats() {
    const total = customDtcsStore.length;
    const published = customDtcsStore.filter(d => d.status === 'PUBLISHED').length;
    const withProcedures = customDtcsStore.filter(d => d.diagnosticProcedure && d.diagnosticProcedure.length > 0).length;
    const withCases = customDtcsStore.filter(d => d.relatedCases && d.relatedCases.length > 0).length;
    const withCourses = customDtcsStore.filter(d => d.relatedCourses && d.relatedCourses.length > 0).length;

    return {
      total,
      published,
      withProcedures,
      withCases,
      withCourses
    };
  }

  // Deep Search Hierarchy across Brand, Model, Engine, System, Component, and DTC
  public static searchHierarchy(
    query: string,
    filters?: { brandId?: string; systemKey?: string }
  ): SearchResultItem[] {
    const term = query.trim().toLowerCase();
    const results: SearchResultItem[] = [];

    // 1. Search Brands
    customBrandsStore.forEach(b => {
      if (!term || b.name.toLowerCase().includes(term) || b.country.toLowerCase().includes(term)) {
        results.push({
          type: 'brand',
          title: `${b.name} (${b.country})`,
          subtitle: `Marca de Origen ${b.country}`,
          details: `Modelos populares: ${b.popularModels.join(', ')}`,
          brandId: b.id
        });
      }
    });

    // 2. Search Models, Engines, Systems, Components
    VEHICLE_MODELS_DATA.forEach(model => {
      const brand = customBrandsStore.find(b => b.id === model.brandId);
      if (filters?.brandId && model.brandId !== filters.brandId) return;

      if (term && (model.name.toLowerCase().includes(term) || brand?.name.toLowerCase().includes(term))) {
        results.push({
          type: 'model',
          title: `${brand?.name || ''} ${model.name}`,
          subtitle: `Años: ${model.years[0]} - ${model.years[model.years.length - 1]}`,
          details: `Motores disponibles: ${model.engines.map(e => e.code).join(', ')}`,
          brandId: model.brandId,
          modelId: model.id
        });
      }

      model.engines.forEach(eng => {
        if (term && (eng.code.toLowerCase().includes(term) || eng.displacement.toLowerCase().includes(term) || eng.fuelType.toLowerCase().includes(term))) {
          results.push({
            type: 'engine',
            title: `Motor ${eng.code} (${eng.displacement})`,
            subtitle: `${brand?.name} ${model.name} // ${eng.fuelType} - ${eng.power}`,
            details: `Sistemas asociados: ${eng.systems.map(s => s.name).join(', ')}`,
            brandId: model.brandId,
            modelId: model.id
          });
        }

        eng.systems.forEach(sys => {
          if (filters?.systemKey && sys.category !== filters.systemKey) return;

          if (term && (sys.name.toLowerCase().includes(term) || sys.category.toLowerCase().includes(term))) {
            results.push({
              type: 'system',
              title: `Sistema: ${sys.name}`,
              subtitle: `Categoría: ${sys.category.toUpperCase()} // ${brand?.name} ${model.name} (${eng.code})`,
              details: `${sys.components.length} componentes registrados`,
              brandId: model.brandId,
              modelId: model.id,
              systemKey: sys.category
            });
          }

          sys.components.forEach(comp => {
            if (term && (comp.name.toLowerCase().includes(term) || comp.description.toLowerCase().includes(term) || comp.type.toLowerCase().includes(term))) {
              results.push({
                type: 'component',
                title: `Componente: ${comp.name}`,
                subtitle: `Tipo: ${comp.type.toUpperCase()} // Ubi: ${comp.location}`,
                details: `DTCs: ${comp.dtcs.join(', ')} // Valor ref: ${comp.referenceValues || 'N/A'}`,
                brandId: model.brandId,
                modelId: model.id
              });
            }
          });
        });
      });
    });

    // 3. Search DTCs
    customDtcsStore.forEach(dtc => {
      if (term && (dtc.code.toLowerCase().includes(term) || dtc.description.toLowerCase().includes(term) || dtc.system.toLowerCase().includes(term) || (dtc.title && dtc.title.toLowerCase().includes(term)))) {
        results.push({
          type: 'dtc',
          title: `DTC ${dtc.code} ${dtc.title ? `- ${dtc.title}` : ''}`,
          subtitle: dtc.description,
          details: `Sistema: ${dtc.system} // Severidad: ${dtc.severity} // Cat: ${dtc.category}`,
          dtcCode: dtc.code
        });
      }
    });

    return results.slice(0, 30);
  }

  // Cross-relate vehicle querying with Courses, Lessons, Cases, Labs, DTCs
  public static getRelatedContentForVehicle(params: {
    brandName?: string;
    modelName?: string;
    engineCode?: string;
    systemCategory?: string;
    dtcCode?: string;
  }) {
    const { brandName = '', modelName = '', engineCode = '', systemCategory = '', dtcCode = '' } = params;

    // Search matching courses
    const matchingCourses = ALL_COURSES_DATA.filter(course => {
      const text = `${course.title} ${course.description} ${course.categoryLabel}`.toLowerCase();
      return (
        (brandName && text.includes(brandName.toLowerCase())) ||
        (systemCategory && text.includes(systemCategory.toLowerCase())) ||
        (dtcCode && text.includes(dtcCode.toLowerCase())) ||
        course.category === 'diagnostic' ||
        course.category === 'obd2' ||
        course.category === 'ecu'
      );
    });

    // Extract individual lessons from matching courses
    const matchingLessons: { lesson: Lesson; courseTitle: string; courseId: string }[] = [];
    matchingCourses.forEach(course => {
      course.modules.forEach(mod => {
        mod.lessons.forEach(lesson => {
          matchingLessons.push({
            lesson,
            courseTitle: course.title,
            courseId: course.id
          });
        });
      });
    });

    // Diagnostic cases
    const matchingCases = DIAGNOSTIC_CASES_DATA.filter(c => {
      const text = `${c.title} ${c.vehicle} ${c.symptom} ${c.dtcCode}`.toLowerCase();
      return (
        (brandName && text.includes(brandName.toLowerCase())) ||
        (dtcCode && c.dtcCode.toLowerCase().includes(dtcCode.toLowerCase())) ||
        (systemCategory && text.includes(systemCategory.toLowerCase()))
      );
    });

    // Labs
    const matchingLabs = LABS_DATA.filter(lab => {
      return (
        systemCategory === 'canbus' ? lab.type === 'canbus' :
        systemCategory === 'ecu' ? lab.type === 'ecu_bench' :
        systemCategory === 'inyección' ? lab.type === 'oscilloscope' :
        true
      );
    });

    // DTCs
    const matchingDtcs = DTCS_DATABASE.filter(dtc => {
      if (dtcCode) return dtc.code.toLowerCase().includes(dtcCode.toLowerCase());
      if (systemCategory) return dtc.system.toLowerCase().includes(systemCategory.toLowerCase());
      return true;
    });

    return {
      courses: matchingCourses.slice(0, 6),
      lessons: matchingLessons.slice(0, 8),
      cases: matchingCases.slice(0, 4),
      labs: matchingLabs,
      dtcs: matchingDtcs.slice(0, 5)
    };
  }
}
