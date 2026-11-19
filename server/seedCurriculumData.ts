import { db } from "./db";

export function seedCurriculumData() {
  try {
    const existingSource = db.prepare("SELECT COUNT(*) as count FROM curriculum_sources").get() as { count: number };
    if (existingSource && existingSource.count > 0) {
      console.log("[SeedCurriculumData] Curriculum sources already seeded.");
      return;
    }

    console.log("[SeedCurriculumData] Seeding Prompt 41 Curriculum + Syllabus + Internet Research Engine data...");

    // 1. Sources Registry
    const insertSource = db.prepare(`
      INSERT INTO curriculum_sources (
        id, name, type, institution, country, language, description, url, documentPath, version, publicationDate, accessDate, status, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertSource.run(
      'src_senati_2026',
      'Malla Curricular - Mecatrónica Automotriz SENATI',
      'INSTITUTIONAL_CURRICULUM',
      'SENATI',
      'Perú',
      'es',
      'Estructura de formación técnico-profesional de 6 semestres en Mecatrónica Automotriz (Perfil profesional, competencias, laboratorios y formación dual).',
      'https://www.senati.edu.pe/especialidades/mecatronica-automotriz',
      '/docs/Malla_Curricular_Mecatronica_Automotriz_SENATI.pdf',
      '2026-v1',
      '2025-01-15',
      '2026-08-12',
      'ACTIVE',
      'Fuente Curricular A de referencia para competencias de la industria y distribución por semestres.'
    );

    insertSource.run(
      'src_yove_docb_2026',
      'YOVE Academy Mecatrónica Automotriz I-VI Semestres',
      'SYLLABUS',
      'YOVE Academy Reference',
      'Perú',
      'es',
      'Documento curricular de referencia con síntesis de unidades didácticas, créditos, horas, contenidos y resultados de aprendizaje.',
      'https://yoveacademy.edu/curriculum/yove_mecatronica_i_vi.pdf',
      '/docs/YOVE_Academy_Mecatronica_Automotriz_I_VI_Semestres.pdf',
      '2026-v2',
      '2026-02-01',
      '2026-08-12',
      'ACTIVE',
      'Fuente Curricular B de referencia para unidades didácticas y asignación de créditos/horas.'
    );

    insertSource.run(
      'src_bosch_auto_manual',
      'Bosch Automotive Handbook 10th Edition',
      'TECHNICAL_MANUAL',
      'Robert Bosch GmbH',
      'Alemania',
      'es',
      'Manual técnico de ingeniería automotriz con física, cálculos, electrónica de control de motor y sistemas de freno/dinámica.',
      'https://www.bosch-professional.com/automotive',
      '/docs/Bosch_Automotive_Handbook.pdf',
      '10th Ed.',
      '2022-05-10',
      '2026-08-12',
      'ACTIVE',
      'Fuente técnica estándar para fundamentos de sensores, actuadores y comunicaciones CAN/LIN.'
    );

    insertSource.run(
      'src_sae_j1979',
      'SAE J1979 / ISO 15031 OBD-II Standards',
      'OFFICIAL_REGULATION',
      'SAE International',
      'EE.UU.',
      'en',
      'Estándares internacionales de diagnóstico a bordo OBD-II, modos de servicio ($01-$0A), PIDs y códigos de falla DTC.',
      'https://www.sae.org/standards/content/j1979_201702/',
      '/docs/SAE_J1979_Standards.pdf',
      'J1979_201702',
      '2017-02-01',
      '2026-08-12',
      'ACTIVE',
      'Normativa técnica de diagnósticos e interpretación de señales OBD-II.'
    );

    insertSource.run(
      'src_yove_original',
      'YOVE Master Curriculum Synthesis 2026',
      'YOVE_ORIGINAL',
      'YOVE Academy Academic Core',
      'Perú / Internacional',
      'es',
      'Síntesis curricular consolidada YOVE Academy que integra fundamentos, diagnóstico avanzado, vehículos híbridos/EVs, osciloscopio y programación de microcontroladores.',
      'https://yoveacademy.edu/master-curriculum',
      '/docs/YOVE_Master_Curriculum_2026.pdf',
      '2026.1',
      '2026-08-12',
      '2026-08-12',
      'ACTIVE',
      'Plan consolidado autoría de YOVE Academy.'
    );

    // 2. Semesters (I to VI)
    const insertSemester = db.prepare(`
      INSERT INTO curriculum_semesters (id, semesterNumber, title, description, creditTotal, hoursTotal)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertSemester.run('sem_1', 1, 'Semestre I — Fundamentos y Mecánica/Electricidad Básica', 'Estudios generales, física aplicada, mantenimiento de chasis (suspensión, dirección, frenos) y mediciones eléctricas iniciales.', 22, 396);
    insertSemester.run('sem_2', 2, 'Semestre II — Transmisión, Hidráulica, Sensores y Actuadores', 'Transmisiones mecánicas y automáticas, sistemas auxiliares, hidráulica/neumática, laboratorio y sensores/actuadores.', 24, 432);
    insertSemester.run('sem_3', 3, 'Semestre III — Motores, Carga/Arranque y Electrónica Digital', 'Fluidos/lubricantes, mediciones electrónicas, soldadura, sistemas de carga/arranque, CAD y circuitos digitales.', 23, 414);
    insertSemester.run('sem_4', 4, 'Semestre IV — Encendido, Luces, HVAC y Programación C', 'Sistemas de encendido electrónico, alumbrado/accesorios, climatización automotriz y programación C aplicada a la ECU.', 21, 378);
    insertSemester.run('sem_5', 5, 'Semestre V — Motores Otto, Inyección, ECUs e Inmovilizadores', 'Seguridad pasiva/activa, motores Otto, inyección electrónica, reparación de módulos ECUs y programación de llaves/microcontroladores.', 25, 450);
    insertSemester.run('sem_6', 6, 'Semestre VI — Motores Diesel, Híbridos/EV, GLP/GNV y Gestión', 'Motores y sistemas Common Rail Diesel, gestión de talleres, rectificaciones, conversiones a gas y vehículos híbridos/eléctricos (EV).', 27, 486);

    // 3. Curriculum Units (Document B Units + Reference)
    const insertUnit = db.prepare(`
      INSERT INTO curriculum_units (
        id, semesterId, semesterNumber, code, name, credits, hours, level, status,
        sourceId, sourceType, sourceTitle, sourceInstitution, sourceUrl, sourceReference, dateAccessed, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // SEMESTRE I
    insertUnit.run('UNIT-SEM1-01', 'sem_1', 1, 'MEC-101', 'Mantenimiento del sistema de suspensión', 3, 54, 'NIVEL 2 — TÉCNICO', 'SYLLABUS_DEFINED', 'src_yove_docb_2026', 'SYLLABUS', 'YOVE Academy Mecatrónica Automotriz I-VI Semestres', 'YOVE Reference', 'https://yoveacademy.edu/docs/B', 'Pág. 12 - Documento B', '2026-08-12', 'Unidad de chasis y amortiguadores.');
    insertUnit.run('UNIT-SEM1-02', 'sem_1', 1, 'MEC-102', 'Mantenimiento del sistema de dirección', 3, 54, 'NIVEL 2 — TÉCNICO', 'SYLLABUS_DEFINED', 'src_yove_docb_2026', 'SYLLABUS', 'YOVE Academy Mecatrónica Automotriz I-VI Semestres', 'YOVE Reference', 'https://yoveacademy.edu/docs/B', 'Pág. 14 - Documento B', '2026-08-12', 'Dirección hidráulica y electroasistida EPS.');
    insertUnit.run('UNIT-SEM1-03', 'sem_1', 1, 'MEC-103', 'Alineamiento automotriz', 2, 36, 'NIVEL 2 — TÉCNICO', 'SYLLABUS_DEFINED', 'src_yove_docb_2026', 'SYLLABUS', 'YOVE Academy Mecatrónica Automotriz I-VI Semestres', 'YOVE Reference', 'https://yoveacademy.edu/docs/B', 'Pág. 16 - Documento B', '2026-08-12', 'Caster, Camber, Toe-in y geometría de dirección.');
    insertUnit.run('UNIT-SEM1-04', 'sem_1', 1, 'MEC-104', 'Mantenimiento del sistema de frenos', 3, 54, 'NIVEL 2 — TÉCNICO', 'SYLLABUS_DEFINED', 'src_yove_docb_2026', 'SYLLABUS', 'YOVE Academy Mecatrónica Automotriz I-VI Semestres', 'YOVE Reference', 'https://yoveacademy.edu/docs/B', 'Pág. 18 - Documento B', '2026-08-12', 'Frenos de disco, tambor e inspección de circuitos hidráulicos.');
    insertUnit.run('UNIT-SEM1-05', 'sem_1', 1, 'MEC-105', 'Mediciones eléctricas automotrices', 4, 72, 'NIVEL 1 — FUNDAMENTOS', 'PUBLISHED', 'src_yove_docb_2026', 'SYLLABUS', 'YOVE Academy Mecatrónica Automotriz I-VI Semestres', 'YOVE Reference', 'https://yoveacademy.edu/docs/B', 'Pág. 20 - Documento B', '2026-08-12', 'Curso Piloto 1: Ley de Ohm, multímetro, caída de tensión y consumo en reposo.');
    insertUnit.run('UNIT-SEM1-06', 'sem_1', 1, 'MEC-106', 'Laboratorio de mecanismos automotrices', 3, 54, 'NIVEL 1 — FUNDAMENTOS', 'SYLLABUS_DEFINED', 'src_yove_docb_2026', 'SYLLABUS', 'YOVE Academy Mecatrónica Automotriz I-VI Semestres', 'YOVE Reference', 'https://yoveacademy.edu/docs/B', 'Pág. 22 - Documento B', '2026-08-12', 'Torque, palancas, engranajes y poleas.');
    insertUnit.run('UNIT-SEM1-07', 'sem_1', 1, 'MEC-107', 'Comunicación Oral', 2, 36, 'NIVEL 1 — FUNDAMENTOS', 'SYLLABUS_DEFINED', 'src_yove_docb_2026', 'SYLLABUS', 'YOVE Academy Mecatrónica Automotriz I-VI Semestres', 'YOVE Reference', 'https://yoveacademy.edu/docs/B', 'Pág. 24 - Documento B', '2026-08-12', 'Expresión técnica y comunicación con clientes en taller.');
    insertUnit.run('UNIT-SEM1-08', 'sem_1', 1, 'MEC-108', 'Aplicaciones en internet', 2, 36, 'NIVEL 1 — FUNDAMENTOS', 'SYLLABUS_DEFINED', 'src_yove_docb_2026', 'SYLLABUS', 'YOVE Academy Mecatrónica Automotriz I-VI Semestres', 'YOVE Reference', 'https://yoveacademy.edu/docs/B', 'Pág. 26 - Documento B', '2026-08-12', 'Búsqueda de manuales técnicos y catálogos de repuestos online.');

    // SEMESTRE II
    insertUnit.run('UNIT-SEM2-01', 'sem_2', 2, 'MEC-201', 'Sistema de transmisión mecánica y automática', 4, 72, 'NIVEL 2 — TÉCNICO', 'SYLLABUS_DEFINED', 'src_yove_docb_2026', 'SYLLABUS', 'YOVE Academy Mecatrónica Automotriz I-VI Semestres', 'YOVE Reference', 'https://yoveacademy.edu/docs/B', 'Pág. 28 - Documento B', '2026-08-12', 'Cajas mecánicas, convertidor de par y transmisiones hidráulicas.');
    insertUnit.run('UNIT-SEM2-02', 'sem_2', 2, 'MEC-202', 'Hidráulica y neumática automotriz', 3, 54, 'NIVEL 2 — TÉCNICO', 'SYLLABUS_DEFINED', 'src_yove_docb_2026', 'SYLLABUS', 'YOVE Academy Mecatrónica Automotriz I-VI Semestres', 'YOVE Reference', 'https://yoveacademy.edu/docs/B', 'Pág. 30 - Documento B', '2026-08-12', 'Sistemas neumáticos en vehículos pesados y válvulas hidráulicas.');
    insertUnit.run('UNIT-SEM2-03', 'sem_2', 2, 'MEC-203', 'Sistema diferencial', 3, 54, 'NIVEL 2 — TÉCNICO', 'SYLLABUS_DEFINED', 'src_yove_docb_2026', 'SYLLABUS', 'YOVE Academy Mecatrónica Automotriz I-VI Semestres', 'YOVE Reference', 'https://yoveacademy.edu/docs/B', 'Pág. 32 - Documento B', '2026-08-12', 'Corona, piñón de ataque y diferenciales autoblocantes.');
    insertUnit.run('UNIT-SEM2-04', 'sem_2', 2, 'MEC-204', 'Sistema de transmisión auxiliar', 2, 36, 'NIVEL 2 — TÉCNICO', 'SYLLABUS_DEFINED', 'src_yove_docb_2026', 'SYLLABUS', 'YOVE Academy Mecatrónica Automotriz I-VI Semestres', 'YOVE Reference', 'https://yoveacademy.edu/docs/B', 'Pág. 34 - Documento B', '2026-08-12', 'Ejes cardán, juntas homocinéticas y caja de transferencia 4x4.');
    insertUnit.run('UNIT-SEM2-05', 'sem_2', 2, 'MEC-205', 'Laboratorio de transmisión', 3, 54, 'NIVEL 2 — TÉCNICO', 'SYLLABUS_DEFINED', 'src_yove_docb_2026', 'SYLLABUS', 'YOVE Academy Mecatrónica Automotriz I-VI Semestres', 'YOVE Reference', 'https://yoveacademy.edu/docs/B', 'Pág. 36 - Documento B', '2026-08-12', 'Desarmado, metrología de piñones y comprobación de juegos.');
    insertUnit.run('UNIT-SEM2-06', 'sem_2', 2, 'MEC-206', 'Sensores y actuadores automotrices', 5, 90, 'NIVEL 3 — DIAGNÓSTICO', 'PUBLISHED', 'src_yove_docb_2026', 'SYLLABUS', 'YOVE Academy Mecatrónica Automotriz I-VI Semestres', 'YOVE Reference', 'https://yoveacademy.edu/docs/B', 'Pág. 38 - Documento B', '2026-08-12', 'Curso Piloto 3: CKP, CMP, MAF, MAP, ECT, TPS, inyectores, solenoides y osciloscopio.');
    insertUnit.run('UNIT-SEM2-07', 'sem_2', 2, 'MEC-207', 'Interpretación y producción de textos', 2, 36, 'NIVEL 1 — FUNDAMENTOS', 'SYLLABUS_DEFINED', 'src_yove_docb_2026', 'SYLLABUS', 'YOVE Academy Mecatrónica Automotriz I-VI Semestres', 'YOVE Reference', 'https://yoveacademy.edu/docs/B', 'Pág. 40 - Documento B', '2026-08-12', 'Redacción de informes técnicos de reparación e historiales de averías.');
    insertUnit.run('UNIT-SEM2-08', 'sem_2', 2, 'MEC-208', 'Ofimática', 2, 36, 'NIVEL 1 — FUNDAMENTOS', 'SYLLABUS_DEFINED', 'src_yove_docb_2026', 'SYLLABUS', 'YOVE Academy Mecatrónica Automotriz I-VI Semestres', 'YOVE Reference', 'https://yoveacademy.edu/docs/B', 'Pág. 42 - Documento B', '2026-08-12', 'Gestión de hojas de cálculo para presupuestos y mantenimiento.');

    // SEMESTRE III
    insertUnit.run('UNIT-SEM3-01', 'sem_3', 3, 'MEC-301', 'Fluidos y lubricantes automotrices', 2, 36, 'NIVEL 1 — FUNDAMENTOS', 'SYLLABUS_DEFINED', 'src_yove_docb_2026', 'SYLLABUS', 'YOVE Academy Mecatrónica Automotriz I-VI Semestres', 'YOVE Reference', 'https://yoveacademy.edu/docs/B', 'Pág. 44 - Documento B', '2026-08-12', 'Viscosidad SAE, clasificaciones API/ACEA y refrigerantes.');
    insertUnit.run('UNIT-SEM3-02', 'sem_3', 3, 'MEC-302', 'Mediciones electrónicas automotrices', 4, 72, 'NIVEL 2 — TÉCNICO', 'SYLLABUS_DEFINED', 'src_yove_docb_2026', 'SYLLABUS', 'YOVE Academy Mecatrónica Automotriz I-VI Semestres', 'YOVE Reference', 'https://yoveacademy.edu/docs/B', 'Pág. 46 - Documento B', '2026-08-12', 'Uso avanzado del osciloscopio automotriz automotriz de 2 y 4 canales.');
    insertUnit.run('UNIT-SEM3-03', 'sem_3', 3, 'MEC-303', 'Soldadura aplicada a mecanismos automotrices', 3, 54, 'NIVEL 2 — TÉCNICO', 'SYLLABUS_DEFINED', 'src_yove_docb_2026', 'SYLLABUS', 'YOVE Academy Mecatrónica Automotriz I-VI Semestres', 'YOVE Reference', 'https://yoveacademy.edu/docs/B', 'Pág. 48 - Documento B', '2026-08-12', 'Soldadura SMAW, MIG/MAG y autógena en chasis y escapes.');
    insertUnit.run('UNIT-SEM3-04', 'sem_3', 3, 'MEC-304', 'Sistema de carga y arranque', 4, 72, 'NIVEL 2 — TÉCNICO', 'PUBLISHED', 'src_yove_docb_2026', 'SYLLABUS', 'YOVE Academy Mecatrónica Automotriz I-VI Semestres', 'YOVE Reference', 'https://yoveacademy.edu/docs/B', 'Pág. 50 - Documento B', '2026-08-12', 'Curso Piloto 4: Alternadores inteligentes LIN, regulador PWM, arrancadores y baterías.');
    insertUnit.run('UNIT-SEM3-05', 'sem_3', 3, 'MEC-305', 'Dibujo técnico asistido por computadora', 3, 54, 'NIVEL 1 — FUNDAMENTOS', 'SYLLABUS_DEFINED', 'src_yove_docb_2026', 'SYLLABUS', 'YOVE Academy Mecatrónica Automotriz I-VI Semestres', 'YOVE Reference', 'https://yoveacademy.edu/docs/B', 'Pág. 52 - Documento B', '2026-08-12', 'CAD automotriz, simbología de esquemas eléctricos y diagramas de bloques.');
    insertUnit.run('UNIT-SEM3-06', 'sem_3', 3, 'MEC-306', 'Mediciones de circuitos digitales automotrices', 3, 54, 'NIVEL 3 — DIAGNÓSTICO', 'SYLLABUS_DEFINED', 'src_yove_docb_2026', 'SYLLABUS', 'YOVE Academy Mecatrónica Automotriz I-VI Semestres', 'YOVE Reference', 'https://yoveacademy.edu/docs/B', 'Pág. 54 - Documento B', '2026-08-12', 'Compuertas lógicas, PWM, reloj de bus de datos y multiplexado.');
    insertUnit.run('UNIT-SEM3-07', 'sem_3', 3, 'MEC-307', 'Inglés para la comunicación oral', 2, 36, 'NIVEL 1 — FUNDAMENTOS', 'SYLLABUS_DEFINED', 'src_yove_docb_2026', 'SYLLABUS', 'YOVE Academy Mecatrónica Automotriz I-VI Semestres', 'YOVE Reference', 'https://yoveacademy.edu/docs/B', 'Pág. 56 - Documento B', '2026-08-12', 'Vocabulario técnico de herramientas y componentes en inglés.');
    insertUnit.run('UNIT-SEM3-08', 'sem_3', 3, 'MEC-308', 'Comportamiento ético', 2, 36, 'NIVEL 1 — FUNDAMENTOS', 'SYLLABUS_DEFINED', 'src_yove_docb_2026', 'SYLLABUS', 'YOVE Academy Mecatrónica Automotriz I-VI Semestres', 'YOVE Reference', 'https://yoveacademy.edu/docs/B', 'Pág. 58 - Documento B', '2026-08-12', 'Ética en el presupuesto de reparaciones y transparencia profesional.');

    // SEMESTRE IV
    insertUnit.run('UNIT-SEM4-01', 'sem_4', 4, 'MEC-401', 'Sistema de encendido', 4, 72, 'NIVEL 2 — TÉCNICO', 'SYLLABUS_DEFINED', 'src_yove_docb_2026', 'SYLLABUS', 'YOVE Academy Mecatrónica Automotriz I-VI Semestres', 'YOVE Reference', 'https://yoveacademy.edu/docs/B', 'Pág. 60 - Documento B', '2026-08-12', 'Encendido por transistor, bobinas COP, primario y secundario en osciloscopio.');
    insertUnit.run('UNIT-SEM4-02', 'sem_4', 4, 'MEC-402', 'Sistema de luces y accesorios eléctricos', 3, 54, 'NIVEL 2 — TÉCNICO', 'SYLLABUS_DEFINED', 'src_yove_docb_2026', 'SYLLABUS', 'YOVE Academy Mecatrónica Automotriz I-VI Semestres', 'YOVE Reference', 'https://yoveacademy.edu/docs/B', 'Pág. 62 - Documento B', '2026-08-12', 'Luces LED, Xenón, relés, fusibles y controladores BCM.');
    insertUnit.run('UNIT-SEM4-03', 'sem_4', 4, 'MEC-403', 'Sistemas de calefacción y aire acondicionado automotriz', 4, 72, 'NIVEL 2 — TÉCNICO', 'SYLLABUS_DEFINED', 'src_yove_docb_2026', 'SYLLABUS', 'YOVE Academy Mecatrónica Automotriz I-VI Semestres', 'YOVE Reference', 'https://yoveacademy.edu/docs/B', 'Pág. 64 - Documento B', '2026-08-12', 'Gas R134a/R1234yf, compresor de cilindrada variable y climatización electrónica.');
    insertUnit.run('UNIT-SEM4-04', 'sem_4', 4, 'MEC-404', 'Programación lenguaje C para aplicación automotriz', 4, 72, 'NIVEL 4 — ESPECIALIZACIÓN', 'PUBLISHED', 'src_yove_docb_2026', 'SYLLABUS', 'YOVE Academy Mecatrónica Automotriz I-VI Semestres', 'YOVE Reference', 'https://yoveacademy.edu/docs/B', 'Pág. 66 - Documento B', '2026-08-12', 'Estructuras en C, lectura ADC de sensores, timers y comunicación CAN en microcontroladores.');
    insertUnit.run('UNIT-SEM4-05', 'sem_4', 4, 'MEC-405', 'Comprensión y redacción en inglés', 3, 54, 'NIVEL 1 — FUNDAMENTOS', 'SYLLABUS_DEFINED', 'src_yove_docb_2026', 'SYLLABUS', 'YOVE Academy Mecatrónica Automotriz I-VI Semestres', 'YOVE Reference', 'https://yoveacademy.edu/docs/B', 'Pág. 68 - Documento B', '2026-08-12', 'Lectura de DTCs, manuales Mitchell/Alldata en inglés.');
    insertUnit.run('UNIT-SEM4-06', 'sem_4', 4, 'MEC-406', 'Solución de problemas', 3, 54, 'NIVEL 3 — DIAGNÓSTICO', 'SYLLABUS_DEFINED', 'src_yove_docb_2026', 'SYLLABUS', 'YOVE Academy Mecatrónica Automotriz I-VI Semestres', 'YOVE Reference', 'https://yoveacademy.edu/docs/B', 'Pág. 70 - Documento B', '2026-08-12', 'Metodología causa-raíz y diagramas de Ishikawa para fallas mecánicas.');

    // SEMESTRE V
    insertUnit.run('UNIT-SEM5-01', 'sem_5', 5, 'MEC-501', 'Sistema de seguridad del vehículo', 3, 54, 'NIVEL 3 — DIAGNÓSTICO', 'SYLLABUS_DEFINED', 'src_yove_docb_2026', 'SYLLABUS', 'YOVE Academy Mecatrónica Automotriz I-VI Semestres', 'YOVE Reference', 'https://yoveacademy.edu/docs/B', 'Pág. 72 - Documento B', '2026-08-12', 'ABS, ESP, Airbags SRS, pretensores de cinturón y sensores de impacto.');
    insertUnit.run('UNIT-SEM5-02', 'sem_5', 5, 'MEC-502', 'Motor de combustión interna Otto', 5, 90, 'NIVEL 2 — TÉCNICO', 'PUBLISHED', 'src_yove_docb_2026', 'SYLLABUS', 'YOVE Academy Mecatrónica Automotriz I-VI Semestres', 'YOVE Reference', 'https://yoveacademy.edu/docs/B', 'Pág. 74 - Documento B', '2026-08-12', 'Curso Piloto 5: Desarmado, metrología de monoblock, culata, distribuciones VVT e inspección de juego axial.');
    insertUnit.run('UNIT-SEM5-03', 'sem_5', 5, 'MEC-503', 'Sistema de inyección de motores Otto', 5, 90, 'NIVEL 3 — DIAGNÓSTICO', 'PUBLISHED', 'src_yove_docb_2026', 'SYLLABUS', 'YOVE Academy Mecatrónica Automotriz I-VI Semestres', 'YOVE Reference', 'https://yoveacademy.edu/docs/B', 'Pág. 76 - Documento B', '2026-08-12', 'Curso Piloto 6: Multipunto MPFI y Directa GDI, ajuste de combustible (STFT/LTFT) y sonda Lambda.');
    insertUnit.run('UNIT-SEM5-04', 'sem_5', 5, 'MEC-504', 'Diagnóstico y mantenimiento de módulos electrónicos', 5, 90, 'NIVEL 4 — ESPECIALIZACIÓN', 'PUBLISHED', 'src_yove_docb_2026', 'SYLLABUS', 'YOVE Academy Mecatrónica Automotriz I-VI Semestres', 'YOVE Reference', 'https://yoveacademy.edu/docs/B', 'Pág. 78 - Documento B', '2026-08-12', 'Curso Piloto 7: Reparación de fuentes conmutadas de ECU, sustitución de MOSFETs, drivers de inyección y banqueo.');
    insertUnit.run('UNIT-SEM5-05', 'sem_5', 5, 'MEC-505', 'Diagnóstico de inmovilizadores y programación de microcontroladores', 4, 72, 'NIVEL 4 — ESPECIALIZACIÓN', 'SYLLABUS_DEFINED', 'src_yove_docb_2026', 'SYLLABUS', 'YOVE Academy Mecatrónica Automotriz I-VI Semestres', 'YOVE Reference', 'https://yoveacademy.edu/docs/B', 'Pág. 80 - Documento B', '2026-08-12', 'Transponders, lectura EEPROM, eeprom dump, kloning y programación J2534.');
    insertUnit.run('UNIT-SEM5-06', 'sem_5', 5, 'MEC-506', 'Fundamentos de innovación tecnológica', 2, 36, 'NIVEL 5 — PROFESIONAL', 'SYLLABUS_DEFINED', 'src_yove_docb_2026', 'SYLLABUS', 'YOVE Academy Mecatrónica Automotriz I-VI Semestres', 'YOVE Reference', 'https://yoveacademy.edu/docs/B', 'Pág. 82 - Documento B', '2026-08-12', 'Diseño de prototipos de simulación y herramientas de prueba para taller.');
    insertUnit.run('UNIT-SEM5-07', 'sem_5', 5, 'MEC-507', 'Oportunidades de negocio', 2, 36, 'NIVEL 5 — PROFESIONAL', 'SYLLABUS_DEFINED', 'src_yove_docb_2026', 'SYLLABUS', 'YOVE Academy Mecatrónica Automotriz I-VI Semestres', 'YOVE Reference', 'https://yoveacademy.edu/docs/B', 'Pág. 84 - Documento B', '2026-08-12', 'Modelado Canvas para talleres mecatrónicos especializados.');

    // SEMESTRE VI
    insertUnit.run('UNIT-SEM6-01', 'sem_6', 6, 'MEC-601', 'Motor de combustión interna Diesel', 4, 72, 'NIVEL 2 — TÉCNICO', 'PUBLISHED', 'src_yove_docb_2026', 'SYLLABUS', 'YOVE Academy Mecatrónica Automotriz I-VI Semestres', 'YOVE Reference', 'https://yoveacademy.edu/docs/B', 'Pág. 86 - Documento B', '2026-08-12', 'Curso Piloto 8: Ciclo Diésel, turbocompresor VGT, intercooler y prueba de compresión hidráulica.');
    insertUnit.run('UNIT-SEM6-02', 'sem_6', 6, 'MEC-602', 'Sistema de inyección de motores Diesel', 5, 90, 'NIVEL 3 — DIAGNÓSTICO', 'PUBLISHED', 'src_yove_docb_2026', 'SYLLABUS', 'YOVE Academy Mecatrónica Automotriz I-VI Semestres', 'YOVE Reference', 'https://yoveacademy.edu/docs/B', 'Pág. 88 - Documento B', '2026-08-12', 'Curso Piloto 9: Common Rail (CRDi), inyectores piezoeléctricos, bomba de alta presión y regeneración DPF/AdBlue.');
    insertUnit.run('UNIT-SEM6-03', 'sem_6', 6, 'MEC-603', 'Gestión de talleres', 3, 54, 'NIVEL 5 — PROFESIONAL', 'SYLLABUS_DEFINED', 'src_yove_docb_2026', 'SYLLABUS', 'YOVE Academy Mecatrónica Automotriz I-VI Semestres', 'YOVE Reference', 'https://yoveacademy.edu/docs/B', 'Pág. 90 - Documento B', '2026-08-12', 'Administración de órdenes de trabajo, KPIs de taller y gestión de residuos ambientales.');
    insertUnit.run('UNIT-SEM6-04', 'sem_6', 6, 'MEC-604', 'Rectificaciones automotrices', 3, 54, 'NIVEL 2 — TÉCNICO', 'SYLLABUS_DEFINED', 'src_yove_docb_2026', 'SYLLABUS', 'YOVE Academy Mecatrónica Automotriz I-VI Semestres', 'YOVE Reference', 'https://yoveacademy.edu/docs/B', 'Pág. 92 - Documento B', '2026-08-12', 'Rectificado de cigüeñales, encamisado de cilindros y cepillado de culatas.');
    insertUnit.run('UNIT-SEM6-05', 'sem_6', 6, 'MEC-605', 'Sistema de conversión de combustible a GLP', 2, 36, 'NIVEL 3 — DIAGNÓSTICO', 'SYLLABUS_DEFINED', 'src_yove_docb_2026', 'SYLLABUS', 'YOVE Academy Mecatrónica Automotriz I-VI Semestres', 'YOVE Reference', 'https://yoveacademy.edu/docs/B', 'Pág. 94 - Documento B', '2026-08-12', 'Inyección secuencial GLP 5ta generación y emuladores de inyección.');
    insertUnit.run('UNIT-SEM6-06', 'sem_6', 6, 'MEC-606', 'Sistema de conversión de combustible a GNV', 2, 36, 'NIVEL 3 — DIAGNÓSTICO', 'SYLLABUS_DEFINED', 'src_yove_docb_2026', 'SYLLABUS', 'YOVE Academy Mecatrónica Automotriz I-VI Semestres', 'YOVE Reference', 'https://yoveacademy.edu/docs/B', 'Pág. 96 - Documento B', '2026-08-12', 'Reductores de presión GNV, cilindros de alta presión y recalibración.');
    insertUnit.run('UNIT-SEM6-07', 'sem_6', 6, 'MEC-607', 'Sistemas automotores eléctricos e híbridos', 5, 90, 'NIVEL 4 — ESPECIALIZACIÓN', 'PUBLISHED', 'src_yove_docb_2026', 'SYLLABUS', 'YOVE Academy Mecatrónica Automotriz I-VI Semestres', 'YOVE Reference', 'https://yoveacademy.edu/docs/B', 'Pág. 98 - Documento B', '2026-08-12', 'Curso Piloto 10: Seguridad de alta tensión (HV), baterías Li-ion, BMS, inversor trifásico e inyección de potencia.');
    insertUnit.run('UNIT-SEM6-08', 'sem_6', 6, 'MEC-608', 'Innovación tecnológica', 2, 36, 'NIVEL 5 — PROFESIONAL', 'SYLLABUS_DEFINED', 'src_yove_docb_2026', 'SYLLABUS', 'YOVE Academy Mecatrónica Automotriz I-VI Semestres', 'YOVE Reference', 'https://yoveacademy.edu/docs/B', 'Pág. 100 - Documento B', '2026-08-12', 'Implementación de telemática e IoT para diagnóstico remoto de flotas.');
    insertUnit.run('UNIT-SEM6-09', 'sem_6', 6, 'MEC-609', 'Plan de negocios', 2, 36, 'NIVEL 5 — PROFESIONAL', 'SYLLABUS_DEFINED', 'src_yove_docb_2026', 'SYLLABUS', 'YOVE Academy Mecatrónica Automotriz I-VI Semestres', 'YOVE Reference', 'https://yoveacademy.edu/docs/B', 'Pág. 102 - Documento B', '2026-08-12', 'Plan financiero y retorno de inversión para centro de diagnóstico automotriz.');

    // 4. Detailed Syllabi for the 10 PILOT priority units
    const insertSyllabus = db.prepare(`
      INSERT INTO curriculum_syllabi (
        id, unitId, generalCompetency, specificCompetency, learningOutcomes, capabilities,
        prerequisites, weeklyDistribution, theoreticalActivities, practicalActivities,
        labActivities, resources, learningEvidences, evaluationMethod, evaluationInstruments,
        bibliography, multimediaResources, practicalCases, safetyRules, integratingProject,
        weeklyStatus, status, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Helper function to seed syllabi for pilot units
    const pilotSyllabi = [
      {
        id: 'SYLL-SEM1-05',
        unitId: 'UNIT-SEM1-05',
        generalCompetency: 'Realizar mediciones de magnitudes eléctricas en sistemas automotrices con precisión y seguridad.',
        specificCompetency: 'Utilizar multímetro digital, pinza amperimétrica y puntas de prueba para verificar voltaje, corriente, resistencia y caída de tensión en arneses y componentes.',
        learningOutcomes: 'Al finalizar el curso, el estudiante podrá: 1. Medir tensión, corriente y resistencia en circuitos en serie, paralelo y mixtos con error menor al 2%. 2. Diagnosticar caídas de tensión en masa y alimentación. 3. Medir el consumo en reposo (corriente de fuga) del vehículo.',
        capabilities: 'Interpretación de esquemas eléctricos, manejo seguro de multímetros en escalas AC/DC, cálculo de potencia en watts.',
        prerequisites: 'Matemática básica y física elemental.',
        weeklyDistribution: JSON.stringify([
          { week: 1, topic: 'Fundamentos de electricidad automotriz y Ley de Ohm', hours: 9, activity: 'Cálculo y montaje de circuitos básicos en protoboard/panel de prueba.' },
          { week: 2, topic: 'Manejo del multímetro digital (Voltímetro y Amperímetro)', hours: 9, activity: 'Medición de tensión de batería e intensidad en lámparas halógenas.' },
          { week: 3, topic: 'Medición de Resistencia y Comprobación de Continuidad', hours: 9, activity: 'Verificación de fusible quemado, relés y arneses con alta resistencia.' },
          { week: 4, topic: 'Caídas de Tensión en Circuitos de Carga y Masa', hours: 9, activity: 'Prueba de caída de tensión en el cable positivo de arranque y masa de chasis.' },
          { week: 5, topic: 'Pinza Amperimétrica y Corriente de Fuga (Consumo Parasitorio)', hours: 9, activity: 'Medición de mA en reposo en vehículo con módulos en modo sleep.' },
          { week: 6, topic: 'Simulación y Diagnóstico de Cortocircuitos y Circuitos Abiertos', hours: 9, activity: 'Aislamiento de fallas con luz de prueba de alta impedancia.' },
          { week: 7, topic: 'Evaluación Práctica de Diagnóstico Eléctrico', hours: 9, activity: 'Examen práctico individual de localización de fallas provocadas.' },
          { week: 8, topic: 'Evaluación Teórica y Proyecto Integrador de Mediciones', hours: 9, activity: 'Presentación del informe técnico con fotos y lecturas de multímetro.' }
        ]),
        theoreticalActivities: 'Clases magistrales interactivas, demostración con pizarrón digital y análisis de casos reales.',
        practicalActivities: 'Montaje de arneses automotrices, verificación de caída de tensión con arrancador activado.',
        labActivities: 'Laboratorio de paneles de simulación de fallas con resistencias variables.',
        resources: 'Multímetros automotrices CAT III 1000V, pinzas amperimétricas DC, punta lógica, maquetas interactivas.',
        learningEvidences: 'Informe de mediciones reales firmado, lista de cotejo de taller y examen escrito de Ley de Ohm.',
        evaluationMethod: 'Evaluación continua (40% Taller, 30% Exámenes Teóricos, 30% Proyecto Integrador).',
        evaluationInstruments: 'Rúbrica de desempeño en taller y cuestionario automatizado en plataforma YOVE.',
        bibliography: 'Bosch Automotive Handbook 10th Ed.; Manual de Electricidad Automotriz Haynes.',
        multimediaResources: 'Videos tutoriales HD de medición de caída de tensión y simulación interactiva Multímetro YOVE.',
        practicalCases: 'Caso Real: Falla de arranque en Toyota Hilux por caída de tensión de 1.8V en el cable de masa.',
        safetyRules: 'Uso obligatorio de gafas de seguridad, guantes dieléctricos y desconexión segura de batería.',
        integratingProject: 'Maqueta de instalación eléctrica con protección por fusibles y relé automotriz.',
        weeklyStatus: 'COMPLETED',
        status: 'PUBLISHED'
      },
      {
        id: 'SYLL-SEM2-06',
        unitId: 'UNIT-SEM2-06',
        generalCompetency: 'Diagnosticar sensores y actuadores del sistema de gestión electrónica del motor utilizando osciloscopio y escáner.',
        specificCompetency: 'Interpretar ondas de oscilograma en sensores CKP, CMP, MAP, MAF, TPS y comprobar actuadores PWM (inyectores, solenoides VVT, cuerpo de aceleración).',
        learningOutcomes: 'Al finalizar el curso, el estudiante podrá: 1. Distinguir la señal inductiva vs Hall de CKP/CMP en osciloscopio. 2. Medir el tiempo de inyección (ms) y pulso PWM de solenoides. 3. Interpretar códigos DTC asociados a fallas de sensores.',
        capabilities: 'Ajuste de osciloscopio en volts/div y ms/div, lectura de Live Data en escáner, identificación de señales de referencia 5V.',
        prerequisites: 'Mediciones eléctricas automotrices (MEC-105).',
        weeklyDistribution: JSON.stringify([
          { week: 1, topic: 'Clasificación de sensores: Análogos, Digitales, Frecuencia y PWM', hours: 10, activity: 'Identificación visual en motor de prueba.' },
          { week: 2, topic: 'Sensores de Posición de Cigüeñal (CKP) y Levas (CMP)', hours: 10, activity: 'Captura de oscilograma y sincronismo CKP/CMP.' },
          { week: 3, topic: 'Sensores de Presión (MAP) y Flujo de Aire (MAF)', hours: 10, activity: 'Prueba con bomba de vacío mityvac y lectura de voltaje vs succión.' },
          { week: 4, topic: 'Sensores de Temperatura (ECT, IAT) y Posición de Mariposa (TPS/APP)', hours: 10, activity: 'Curva NTC de resistencia vs temperatura.' },
          { week: 5, topic: 'Actuadores: Inyectores de combustible (EGI y GDI) y Bobinas', hours: 10, activity: 'Medición de pulso de inyección y pico inductivo de colapso.' },
          { week: 6, topic: 'Actuadores PWM: Solenoides VVT, Válvula IAC y Válvula EGR', hours: 10, activity: 'Análisis de duty cycle (% ciclo de trabajo) con osciloscopio.' },
          { week: 7, topic: 'Sondas Lambda Zirconia, Titania y Banda Ancha (AFR)', hours: 10, activity: 'Oscilograma de mezcla rica/pobre en ralentí y aceleración.' },
          { week: 8, topic: 'Diagnóstico Integrado con Escáner OBD-II y Osciloscopio', hours: 10, activity: 'Caso diagnóstico real con falla provocada de desfasamiento VVT.' },
          { week: 9, topic: 'Evaluación Final de Diagnóstico de Sensores', hours: 10, activity: 'Evaluación práctica de 30 min por vehículo.' }
        ]),
        theoreticalActivities: 'Clases teóricas de física de semiconductores y sensores piezoeléctricos.',
        practicalActivities: 'Conexión de osciloscopio de 2 canales en arnés de sensor CKP Inductivo y Hall.',
        labActivities: 'Simulación de sensores con generador de señales PWM y lectura en ECU banqueada.',
        resources: 'Osciloscopios Hantek/PicoScope de 4 canales, escáneres Launch/Autel, bombas de vacío mityvac.',
        learningEvidences: 'Capturas de pantalla de oscilogramas con cursores de medición y diagnóstico escrito.',
        evaluationMethod: 'Evaluación de habilidades de taller (50%) + Examen de teoría (30%) + Caso en escáner (20%).',
        evaluationInstruments: 'Rúbrica de osciloscopía automotriz y examen en línea.',
        bibliography: 'Bosch Automotive Sensors Guide; Manual de Osciloscopio Automotriz Pico Technology.',
        multimediaResources: 'Biblioteca de señales de osciloscopio normales vs defectuosas en formato `.psdata`.',
        practicalCases: 'Caso Real: Motor Nissan HR16DE no arranca por sensor CKP con señal atenuada por residuos metálicos.',
        safetyRules: 'Precaución con partes móviles del motor encendido y temperaturas de escape al medir sonda Lambda.',
        integratingProject: 'Guía práctica de referencia de formas de onda de sensores para 5 motores populares.',
        weeklyStatus: 'COMPLETED',
        status: 'PUBLISHED'
      },
      {
        id: 'SYLL-SEM3-04',
        unitId: 'UNIT-SEM3-04',
        generalCompetency: 'Diagnosticar y reparar el sistema de carga con alternadores inteligentes y el sistema de arranque automotriz.',
        specificCompetency: 'Comprobar el puente rectificador de diodos, estator, rotor, reguladores LIN/BSS y motor de arranque con solenoide y reductor planetario.',
        learningOutcomes: 'Al finalizar el curso, el estudiante podrá: 1. Diagnosticar ondulación AC (ripple) por diodo quemado en el alternador. 2. Diagnosticar la carga gestionada por BCM vía protocolo LIN. 3. Reparar el solenoide y carbones de motor de arranque.',
        capabilities: 'Uso de pinza amperimétrica de 600A DC, osciloscopio para ripple AC, probador de alternadores inteligentes.',
        prerequisites: 'Mediciones eléctricas automotrices (MEC-105).',
        weeklyDistribution: JSON.stringify([
          { week: 1, topic: 'Baterías automotrices (Inundadas, EFB y AGM) y Prueba de Conductancia', hours: 9, activity: 'Prueba de CCA con analizador digital de baterías Midtronics.' },
          { week: 2, topic: 'Principio de Alternador e Inducción Electromagnética', hours: 9, activity: 'Prueba de campo con rotor y prueba de diodos con multímetro.' },
          { week: 3, topic: 'Alternadores Convencionales vs Reguladores Inteligentes (LIN/BSS/PWM)', hours: 9, activity: 'Conexión de interfaz de comandos LIN para variación de voltaje.' },
          { week: 4, topic: 'Medición de Ondulación AC (Ripple Test) con Osciloscopio', hours: 9, activity: 'Detección de diodos en cortocircuito en el alternador.' },
          { week: 5, topic: 'Motor de Arranque: Solenoide, Bendix, Carbones y Planetarios', hours: 9, activity: 'Desarmado completo y metrología de colector y escobillas.' },
          { week: 6, topic: 'Medición de Consumo de Corriente al Dar Marcha (Cranking Test)', hours: 9, activity: 'Captura del pico de corriente de arranque (Amperios) con pinza amperimétrica.' },
          { week: 7, topic: 'Diagnóstico de Sistemas Start-Stop e Integración BCM', hours: 9, activity: 'Ajuste de registro de batería nueva en la computadora del vehículo.' },
          { week: 8, topic: 'Evaluación Integrada de Carga y Arranque', hours: 9, activity: 'Diagnóstico y reparación de falla simulada en mesa de pruebas.' }
        ]),
        theoreticalActivities: 'Fundamentos de electromagnetismo, curvas de carga y comunicación LIN.',
        practicalActivities: 'Desarmado y armado en banco de alternadores y motores de arranque.',
        labActivities: 'Banco de pruebas de alternadores impulsado por motor eléctrico.',
        resources: 'Banco de pruebas de carga, osciloscopio, probador de baterías por conductancia, pinza de 600A.',
        learningEvidences: 'Ficha de comprobación de diodos y reporte de estado de salud de batería (SOH/SOC).',
        evaluationMethod: 'Prueba de desempeño en banco (50%), Examen escrito (50%).',
        evaluationInstruments: 'Lista de cotejo de taller e instrumento escrito.',
        bibliography: 'Bosch Charging and Starting Systems Manual; Delco Remy Technical Guide.',
        multimediaResources: 'Animación 3D de funcionamiento de sistema planetario de arranque e inducción de rotor.',
        practicalCases: 'Caso Real: Ford Ranger 2.2 con luz de batería encendida por falla de bus LIN entre PCM y alternador.',
        safetyRules: 'Desconexión de batería antes de desmontar el motor de arranque para evitar arcos eléctricos de alta corriente.',
        integratingProject: 'Protocolo de diagnóstico rápido de 5 minutos para el sistema de carga y arranque en taller.',
        weeklyStatus: 'COMPLETED',
        status: 'PUBLISHED'
      },
      {
        id: 'SYLL-SEM4-04',
        unitId: 'UNIT-SEM4-04',
        generalCompetency: 'Desarrollar algoritmos y programas en lenguaje C para el procesamiento de datos de sensores y control de actuadores en microcontroladores automotrices.',
        specificCompetency: 'Programar conversor analógico-digital (ADC), temporizadores (Timers), modulación de ancho de pulso (PWM) y comunicación CAN Bus en microcontroladores AVR/STM32.',
        learningOutcomes: 'Al finalizar el curso, el estudiante podrá: 1. Escribir código C funcional para leer sensores de temperatura y presión. 2. Generar señales PWM para control de inyectores. 3. Configurar tramas CAN Bus para comunicación intermódulo.',
        capabilities: 'Lógica de programación, uso de IDE (Microchip Studio/STM32CubeIDE), lectura de datasheets de microcontroladores.',
        prerequisites: 'Mediciones de circuitos digitales (MEC-306).',
        weeklyDistribution: JSON.stringify([
          { week: 1, topic: 'Sintaxis en C, Variables, Tipos de datos y Operadores Bit a Bit', hours: 9, activity: 'Ejercicios de manipulación de registros de entrada/salida (GPIO).' },
          { week: 2, topic: 'Estructuras de Control (if, switch, for, while) en Sistemas Embebidos', hours: 9, activity: 'Algoritmo de control de luces indicadoras y alertas de sobretemperatura.' },
          { week: 3, topic: 'Conversión Analógica a Digital (ADC) para Lectura de Sensores', hours: 9, activity: 'Lectura de potenciómetro simulando sensor TPS e impresión en pantalla.' },
          { week: 4, topic: 'Timers e Interrupciones por Hardware en Microcontroladores', hours: 9, activity: 'Medición de frecuencia de impulsos de entrada simulando CKP.' },
          { week: 5, topic: 'Modulación por Ancho de Pulso (PWM) para Actuadores Automotrices', hours: 9, activity: 'Control de velocidad de electroventilador y posición de cuerpo de aceleración.' },
          { week: 6, topic: 'Protocolos de Comunicación Serie: UART, SPI e I2C', hours: 9, activity: 'Comunicación entre microcontrolador y pantalla LCD automotriz.' },
          { week: 7, topic: 'Protocolo CAN Bus (Controller Area Network) e Interfaz MCP2515', hours: 9, activity: 'Transmisión y recepción de tramas CAN estándar ID 11 bits a 500 kbps.' },
          { week: 8, topic: 'Proyecto Integrador: Simulador de ECU Básica con Programación C', hours: 9, activity: 'Creación de un módulo simulador que lee sensor y activa inyector por PWM.' }
        ]),
        theoreticalActivities: 'Arquitectura de microcontroladores Harvard/Von Neumann y conjunto de instrucciones C.',
        practicalActivities: 'Programación en tarjeta de desarrollo con interfaz de hardware real.',
        labActivities: 'Laboratorio de microcontroladores equipados con analizador de lógica digital.',
        resources: 'Kits de desarrollo STM32/Arduino UNO, interfaz CAN MCP2515, osciloscopios digital y analizadores lógicos.',
        learningEvidences: 'Código fuente compilado sin advertencias, simulación en proteus/hardware y demostración funcional.',
        evaluationMethod: 'Evaluación de proyectos de programación (60%), Exámenes teóricos (40%).',
        evaluationInstruments: 'Rúbrica de revisión de código fuente C y prueba de ejecución en hardware.',
        bibliography: 'The C Programming Language (Kernighan & Ritchie); Embedded C Programming for Automotive Systems.',
        multimediaResources: 'Tutoriales paso a paso de configuración de periféricos de reloj e interrupciones en C.',
        practicalCases: 'Caso Real: Creación de un emulador de señal CKP inductivo programado en C para banquear ECUs.',
        safetyRules: 'Cuidado con descargas electrostáticas (ESD) usando pulsera antiestática al manipular microchips.',
        integratingProject: 'Diseño de un emulador de sensor de temperatura NTC con salida analógica programada.',
        weeklyStatus: 'COMPLETED',
        status: 'PUBLISHED'
      },
      {
        id: 'SYLL-SEM5-02',
        unitId: 'UNIT-SEM5-02',
        generalCompetency: 'Efectuar el mantenimiento, desarmado, metrología y reparación del motor de combustión interna ciclo Otto.',
        specificCompetency: 'Medir la ovalización y conicidad de cilindros, juego de lubricación de cigüeñal con Plastigage, alineación de ejes de levas y calado de distribución VVT.',
        learningOutcomes: 'Al finalizar el curso, el estudiante podrá: 1. Inspeccionar culata, válvulas y guías determinando planeidad. 2. Realizar la metrología completa del monoblock con alexómetro y micrómetro. 3. Sincronizar el sistema de distribución variable VVT.',
        capabilities: 'Manejo de instrumentos de metrología (micrómetro de exteriores, alexómetro, calibrador de láminas, indicador de carátula).',
        prerequisites: 'Fluidos y lubricantes automotrices (MEC-301).',
        weeklyDistribution: JSON.stringify([
          { week: 1, topic: 'Principios de Funcionamiento del Motor Otto 4 Tiempos y Cálculos Termodinámicos', hours: 10, activity: 'Cálculo de cilindrada total, relación de compresión y eficiencia.' },
          { week: 2, topic: 'Desmontaje y Desarmado Sistemático del Motor', hours: 10, activity: 'Marcado de tapas de bancada, bielas y organización de pernos.' },
          { week: 3, topic: 'Metrología de la Culata (Tapa de Cilindros) y Asiento de Válvulas', hours: 10, activity: 'Comprobación de deformación con regla de precisión y prueba de hermeticidad.' },
          { week: 4, topic: 'Metrología del Monoblock y Cilindros con Alexómetro', hours: 10, activity: 'Medición de conicidad y ovalización en 3 alturas del cilindro.' },
          { week: 5, topic: 'Metrología del Cigüeñal, Bielas y Pistones', hours: 10, activity: 'Medición de muñones de bancada/biela y juego de luz de aceite con Plastigage.' },
          { week: 6, topic: 'Sistemas de Distribución Fija y Variable (VVT-i, VANOS, VTEC)', hours: 10, activity: 'Sincronización de correa/cadena de distribución con herramientas de calado.' },
          { week: 7, topic: 'Armado, Torquéado Angular y Ajuste de Luz de Válvulas', hours: 10, activity: 'Aplicación de torque en espiral y goniómetro angular en pernos de culata.' },
          { week: 8, topic: 'Pruebas de Hermeticidad, Presión de Aceite y Puesta en Marcha en Banco', hours: 10, activity: 'Prueba de fugas de cilindro con manómetro y encendido de prueba en soporte.' },
          { week: 9, topic: 'Evaluación Final Práctica de Ensamblaje de Motor Otto', hours: 10, activity: 'Verificación de encendido parejo y ausencia de ruidos anómalos.' }
        ]),
        theoreticalActivities: 'Cálculos termodinámicos de ciclo Otto real vs teórico y diagramas de distribución.',
        practicalActivities: 'Desarmado completo de motores Toyota 1NZ-FE, Hyundai G4FA y Nissan QG18DE.',
        labActivities: 'Laboratorio de metrología automotriz con micrómetros calibrados.',
        resources: 'Motores en soporte orientable, alexómetros, micrómetros 0-100mm, torquímetros, Plastigage, herramental de calado.',
        learningEvidences: 'Ficha metrológica firmada con valores reales vs tolerancias de fabricante.',
        evaluationMethod: 'Evaluación de precisión metrológica (50%), Prueba de ensamblaje (30%), Examen teórico (20%).',
        evaluationInstruments: 'Ficha de metrología y lista de cotejo de armado.',
        bibliography: 'Manual de Reparación de Motores Chilton; Guía de Metrología Automotriz Mitutoyo.',
        multimediaResources: 'Videos HD de medición con alexómetro y secuencias de torquéado de culatas de aluminio.',
        practicalCases: 'Caso Real: Motor Hyundai G4FA con consumo de aceite excesivo por rayado de cilindros y desgaste de anillos.',
        safetyRules: 'Uso de grúa pluma para extracción de motor, zapatos de seguridad con puntera de acero.',
        integratingProject: 'Manual de reconstrucción de motor Otto con especificaciones técnicas de apriete.',
        weeklyStatus: 'COMPLETED',
        status: 'PUBLISHED'
      },
      {
        id: 'SYLL-SEM5-03',
        unitId: 'UNIT-SEM5-03',
        generalCompetency: 'Diagnosticar y corregir averías en sistemas de inyección electrónica de gasolina MPFI y GDI.',
        specificCompetency: 'Analizar los ajustes de combustible a corto y largo plazo (STFT y LTFT), probar inyectores GDI a alta presión (30-200 bar) y verificar sonda Lambda banda ancha.',
        learningOutcomes: 'Al finalizar el curso, el estudiante podrá: 1. Interpretar PIDs de STFT/LTFT para aislar fugas de vacío vs baja presión de riel. 2. Evaluar el estado de inyectores GDI en tina de ultrasonido. 3. Diagnosticar la bomba de alta presión mecánica impulsada por levas.',
        capabilities: 'Interpretación de live data de escáner, medición de presión de combustible con manómetro de 10 bar (MPFI) y lectura de sensor de alta presión (GDI).',
        prerequisites: 'Sensores y actuadores automotrices (MEC-206) y Motor Otto (MEC-502).',
        weeklyDistribution: JSON.stringify([
          { week: 1, topic: 'Evolución de la Inyección: Monopunto, Multipunto (MPFI) e Inyección Directa (GDI)', hours: 10, activity: 'Análisis comparativo de componentes e inyectores en motor de prueba.' },
          { week: 2, topic: 'Circuito de Combustible de Baja Presión, Bomba Eléctrica y Regulador', hours: 10, activity: 'Medición de presión y caudal de bomba con manómetro e interrupción de relé.' },
          { week: 3, topic: 'Estrategia de Control de Inyección en Bucle Abierto (Open Loop) y Cerrado (Closed Loop)', hours: 10, activity: 'Monitoreo en escáner de transición de bucle frío a caliente.' },
          { week: 4, topic: 'Ajustes de Combustible: Short Term Fuel Trim (STFT) y Long Term Fuel Trim (LTFT)', hours: 10, activity: 'Simulación de fuga de vacío y observación de enriquecimiento (+25% STFT).' },
          { week: 5, topic: 'Sistemas GDI: Bomba Mecánica de Alta Presión, Riel y Sensor FPR', hours: 10, activity: 'Medición de señal de solenoide de control de volumen de alta presión.' },
          { week: 6, topic: 'Inyectores GDI Piezoeléctricos y Solenoide: Activación con Alto Voltaje (65V-100V)', hours: 10, activity: 'Oscilograma de corriente de inyector GDI con pinza amperimétrica de precisión.' },
          { week: 7, topic: 'Sondas de Oxígeno de Banda Ancha (A/F Ratio Sensor) y Control de Corriente Pumping', hours: 10, activity: 'Medición de mA de sonda A/F con escáner y osciloscopio.' },
          { week: 8, topic: 'Diagnóstico de Fallas de Inyección: Mezcla Pobre (P0171) y Mezcla Rica (P0172)', hours: 10, activity: 'Localización de falla en motor con máquina de humo para fugas de admisión.' },
          { week: 9, topic: 'Evaluación de Diagnóstico en Motor GDI Real', hours: 10, activity: 'Prueba práctica de diagnóstico y solución de avería inducida.' }
        ]),
        theoreticalActivities: 'Química de la combustión, factor Lambda (λ=1.00) y termodinámica de inyección directa.',
        practicalActivities: 'Prueba de patrones de pulverización de inyectores en banco de prueba ultrasonido.',
        labActivities: 'Laboratorio de inyección electrónica provisto de motores GDI Hyundai/Kia/VW.',
        resources: 'Escáneres automotrices, máquina de ultrasonido de inyectores, generador de humo de fuga, manómetros de presión.',
        learningEvidences: 'Reporte de diagnóstico de Fuel Trims y oscilograma de pico de voltaje de inyectores GDI.',
        evaluationMethod: 'Evaluación técnica en escáner y osciloscopio (50%), Examen escrito (30%), Caso técnico (20%).',
        evaluationInstruments: 'Rúbrica de diagnóstico de inyección y cuestionario en plataforma.',
        bibliography: 'Gasoline Direct Injection Technology (SAE International); Bosch Gasoline Fuel-Injection System K-Jetronic/Motronic.',
        multimediaResources: 'Animación en video de inyección estratificada vs homogénea en motores GDI.',
        practicalCases: 'Caso Real: VW Golf 1.4 TSI con código P0191 por falla en la válvula reguladora de la bomba de alta presión GDI.',
        safetyRules: 'ADVERTENCIA: La alta presión GDI (hasta 200 bar) puede penetrar la piel. Despresurizar el riel antes de desconectar.',
        integratingProject: 'Manual de diagnóstico de códigos DTC P0171/P0172 con árbol de decisiones.',
        weeklyStatus: 'COMPLETED',
        status: 'PUBLISHED'
      },
      {
        id: 'SYLL-SEM5-04',
        unitId: 'UNIT-SEM5-04',
        generalCompetency: 'Reparar y banquear módulos de control electrónico (ECU/PCM) automotrices reemplazando componentes dañados en tarjeta PCB.',
        specificCompetency: 'Diagnosticar fuentes conmutadas de 5V, reemplazar MOSFETs de salida para bobinas e inyectores, reprogramar memoria EEPROM y probar el módulo en banco de simulación.',
        learningOutcomes: 'Al finalizar el curso, el estudiante podrá: 1. Aísla y repara cortocircuitos en la línea de regulación de 5V VREF de la ECU. 2. Remplazar transistores de potencia IGBT/MOSFET quemados. 3. Banquear una ECU en banco de pruebas con emulador de señales.',
        capabilities: 'Manejo de estación de soldadura de aire caliente SMD, uso de multímetro en prueba de diodos sobre circuito, trazador de curvas analógicas.',
        prerequisites: 'Mediciones de circuitos digitales (MEC-306) y Sensores/Actuadores (MEC-206).',
        weeklyDistribution: JSON.stringify([
          { week: 1, topic: 'Arquitectura Interna de una ECU: Procesador, memorias, drivers y fuentes conmutadas', hours: 10, activity: 'Desarmado e identificación visual de bloques en tarjeta PCB de ECU.' },
          { week: 2, topic: 'Sección de Alimentación: Regulador principal, condensadores electrolíticos y diodo Zener', hours: 10, activity: 'Medición de voltaje de entrada 12V y salidas de regulación 5V y 3.3V.' },
          { week: 3, topic: 'Drivers de Salida: Transistores MOSFET, IGBTs e Integrados Inteligentes (H-Bridge)', hours: 10, activity: 'Prueba de transistores de bobina con multímetro en prueba de diodo.' },
          { week: 4, topic: 'Desoldado y Soldadura de Componentes SMD con Estación de Aire Caliente', hours: 10, activity: 'Práctica de desoldado de chips SOIC, QFP y reemplazo de capacitores.' },
          { week: 5, topic: 'Trazador de Curvas Analógicas (VI Tracer) para Diagnóstico en Frío', hours: 10, activity: 'Comparación de huella de impedancia de canal dañado vs canal sano.' },
          { week: 6, topic: 'Banqueo de ECU en Mesa de Pruebas con Emulador CKP/CMP', hours: 10, activity: 'Conexión de pines de alimentación, masa, relé principal y simulación de arranque.' },
          { week: 7, topic: 'Comprobación de Comunicación CAN Bus en Banco con Escáner', hours: 10, activity: 'Verificación de resistencia de terminación de 120 ohms y escaneo en banco.' },
          { week: 8, topic: 'Reparación de Casos Reales de ECUs con Fallas de Inyección o Encendido', hours: 10, activity: 'Diagnóstico y reparación de ECU con canal de inyector abierto.' },
          { week: 9, topic: 'Evaluación Práctica de Banqueo y Reparación de ECU', hours: 10, activity: 'Reparación individual de módulo de control entregado con avería.' }
        ]),
        theoreticalActivities: 'Electrónica analógica y digital aplicada a tarjetas de control automotriz.',
        practicalActivities: 'Soldadura SMD con flux y microscopio digital estéreo.',
        labActivities: 'Laboratorio de laboratorio de reparación de ECUs equipado con banquetas de pruebas.',
        resources: 'Estaciones de soldadura de aire caliente, microscopios electrónicos, banquetas de banqueo, trazadores de curva VI.',
        learningEvidences: 'Tarjeta PCB reparada y probada con inyección de pulso parejo en banco.',
        evaluationMethod: 'Evaluación de soldadura SMD (40%), Banqueo de ECU exitoso (40%), Examen escrito (20%).',
        evaluationInstruments: 'Rúbrica de soldadura electrónica y lista de verificación de banqueo.',
        bibliography: 'Automotive ECU Repair Handbook; Practical Electronics for Inventors.',
        multimediaResources: 'Videos tutoriales de técnicas de desoldado BGA/SMD y diagnóstico de reguladores conmutados.',
        practicalCases: 'Caso Real: ECU Toyota 1ZZ-FE con falla de 5V VREF provocado por cortocircuito a masa en sensor TP.',
        safetyRules: 'Extracción de humos de soldadura obligatoria y uso de pulsera antiestática para evitar daño electrostático al microprocesador.',
        integratingProject: 'Construcción de un simulador de banquetas básico con potenciómetros y leds indicadoras.',
        weeklyStatus: 'COMPLETED',
        status: 'PUBLISHED'
      },
      {
        id: 'SYLL-SEM6-01',
        unitId: 'UNIT-SEM6-01',
        generalCompetency: 'Diagnosticar y realizar el mantenimiento mecánico integral de motores de combustión interna Diésel.',
        specificCompetency: 'Verificar la relación de compresión Diésel (20:1 a 24:1), comprobar la presión de soplado del turbocompresor VGT y ajustar la holgura de taqués hidráulicos/mecánicos.',
        learningOutcomes: 'Al finalizar el curso, el estudiante podrá: 1. Realizar prueba de compresión Diésel por el orificio de la bujía de precalentamiento. 2. Evaluar el estado del turbocompresor de geometría variable (VGT). 3. Inspeccionar el sistema de lubricación y enfriador de aceite (Oil Cooler).',
        capabilities: 'Uso de compresómetro Diésel de alta presión (hasta 70 bar), bomba de depresión de actuador VGT, manómetro de turbo.',
        prerequisites: 'Motor Otto (MEC-502).',
        weeklyDistribution: JSON.stringify([
          { week: 1, topic: 'Principios del Ciclo Diésel, Autoencendido y Termodinámica de Compresión', hours: 9, activity: 'Análisis de diagramas de presión vs volumen en motores Diésel.' },
          { week: 2, topic: 'Estructura Robusta del Motor Diésel: Bloque de hierro fundido, pistones articulados y bielas', hours: 9, activity: 'Desarmado parcial de motor Diésel Toyota 1KD-FTV / Nissan YD25.' },
          { week: 3, topic: 'Prueba de Compresión de Alta Presión y Fugas de Cilindro Diésel', hours: 9, activity: 'Medición de bar de compresión en frío y caliente por conducto de incandescencia.' },
          { week: 4, topic: 'Turbocompresores Convencionales y de Geometría Variable (VGT/VNT)', hours: 9, activity: 'Inspección de juego axial/radial del eje de turbo y prueba de actuador al vacío.' },
          { week: 5, topic: 'Sistema de Intercooler (Aire-Aire y Aire-Agua) y Circuito de Admisión', hours: 9, activity: 'Verificación de fugas de presión de sobrealimentación y limpieza de intercooler.' },
          { week: 6, topic: 'Sistema de Enfriamiento de Aceite y Filtrado de Combustible Diésel', hours: 9, activity: 'Desmontaje de enfriador de aceite e inspección de trampas de agua en filtro.' },
          { week: 7, topic: 'Bujías de Precalentamiento (Glow Plugs) y Módulo MGC', hours: 9, activity: 'Medición de resistencia en ohmios y corriente de consumo al encender contacto.' },
          { week: 8, topic: 'Puesta en Marcha y Calibración Final de Motor Diésel', hours: 9, activity: 'Prueba de funcionamiento en banco e inspección de emisión de humos.' }
        ]),
        theoreticalActivities: 'Termodinámica Diésel, mecánica de fluidos y lubricantes Diésel heavy duty.',
        practicalActivities: 'Desarmado de culata y cilindros en motores Cummins 4BT, Toyota 2KD, Isuzu 4JK1.',
        labActivities: 'Laboratorio de prueba de compresión e inspección con boroscopio industrial.',
        resources: 'Compresómetros Diésel 0-70 bar, boroscopios de inspección, motores diésel en soporte, manómetros de presión de aceite.',
        learningEvidences: 'Ficha de compresión por cilindro y reporte de estado de holgura de turbocompresor.',
        evaluationMethod: 'Prueba práctica de taller (50%), Examen escrito (30%), Caso técnico (20%).',
        evaluationInstruments: 'Rúbrica de taller Diésel e instrumento escrito de teoría.',
        bibliography: 'Diesel Engine Reference Book (L.R.C. Lilly); Manual de Motores Diesel Cummins & Toyota.',
        multimediaResources: 'Animación 3D del funcionamiento de los álabes móviles en un turbocompresor VGT.',
        practicalCases: 'Caso Real: Toyota Hilux 3.0 1KD con pérdida de potencia y humo negro por álabes pegados en turbo VGT.',
        safetyRules: 'Riesgo de alta temperatura en colectores de escape Diésel. Uso de guantes térmicos durante pruebas con motor caliente.',
        integratingProject: 'Protocolo de mantenimiento preventivo de 10,000 km para flota pesada Diésel.',
        weeklyStatus: 'COMPLETED',
        status: 'PUBLISHED'
      },
      {
        id: 'SYLL-SEM6-02',
        unitId: 'UNIT-SEM6-02',
        generalCompetency: 'Diagnosticar y reparar sistemas de inyección electrónicas Diésel Common Rail (CRDi).',
        specificCompetency: 'Comprobar bombas de alta presión (1600-2500 bar), inyectores magnéticos y piezoeléctricos en banco de retorno, reguladores SCV/DRV y sistemas anticontaminación DPF/AdBlue (SCR).',
        learningOutcomes: 'Al finalizar el curso, el estudiante podrá: 1. Medir la presión de riel en tiempo real durante el arranque (mínimo 250 bar). 2. Evaluar el caudal de retorno de inyectores Common Rail. 3. Realizar regeneración forzada de filtro de partículas DPF vía escáner.',
        capabilities: 'Manejo de probadores de retorno de inyector CRDi, osciloscopio de alta tensión para inyectores piezoeléctricos, escáner automotriz.',
        prerequisites: 'Motor Diésel (MEC-601) y Inyección Otto (MEC-503).',
        weeklyDistribution: JSON.stringify([
          { week: 1, topic: 'Fundamentos del Sistema Common Rail Diésel (CRDi): Presión, rampas y microinyecciones', hours: 10, activity: 'Análisis de diagrama de circuito de baja (0.5-5 bar) y alta presión (250-2200 bar).' },
          { week: 2, topic: 'Bombas de Alta Presión CRDi (Bosch CP1, CP3, CP4, Denso HP3, Delphi DFP3)', hours: 10, activity: 'Prueba de presión máxima de bomba e inspección de válvula reguladora SCV.' },
          { week: 3, topic: 'Riel Común de Inyección, Sensor FRP y Válvulas Reguladoras de Presión (DRV)', hours: 10, activity: 'Medición de señal de voltaje de sensor FRP vs manómetro hidráulico.' },
          { week: 4, topic: 'Inyectores Common Rail Inductivos y Piezoeléctricos (Evolución y Control de Piloto)', hours: 10, activity: 'Oscilograma de voltaje de inyector piezoeléctrico (hasta 180V) con sonda de atenuación.' },
          { week: 5, topic: 'Prueba de Retorno de Inyectores en Vehículo (Probeta de Retorno)', hours: 10, activity: 'Medición de ml/min de retorno por inyector en ralentí para detectar fugas internas.' },
          { week: 6, topic: 'Códigos IMA/QR y Codificación de Inyectores en la ECU', hours: 10, activity: 'Programación de código alfanumérico de compensación de caudal con escáner.' },
          { week: 7, topic: 'Sistemas de Control de Emisiones Diésel: EGR, DPF (Filtro de Partículas) y AdBlue/SCR', hours: 10, activity: 'Lectura de porcentaje de hollín en DPF y proceso de regeneración forzada.' },
          { week: 8, topic: 'Diagnóstico de Falla de Arranque en Frío / Falta de Presión de Riel', hours: 10, activity: 'Localización de falla inducida de descebe o fuga en solenoide DRV.' },
          { week: 9, topic: 'Evaluación Final Práctica de Diagnóstico CRDi', hours: 10, activity: 'Diagnóstico completo en vehículo diésel con informe técnico.' }
        ]),
        theoreticalActivities: 'Dinámica de inyección a ultra alta presión, atomización del combustible y reducción de emisiones NOx.',
        practicalActivities: 'Conexión de probadores de retorno transparente en motor Hyundai D4CB / Nissan YD25.',
        labActivities: 'Laboratorio Diésel provisto de banco de comprobación de inyectores Common Rail.',
        resources: 'Kit de probeta de retorno CRDi, atenuadores 10:1 para osciloscopio, escáneres Launch/Autel, maquetas CRDi.',
        learningEvidences: 'Reporte de mediciones de retorno de inyector en ml y código IMA registrado.',
        evaluationMethod: 'Evaluación práctica en motor Diésel (50%), Examen teórico (30%), Diagnóstico en escáner (20%).',
        evaluationInstruments: 'Rúbrica de taller Diésel CRDi y cuestionario.',
        bibliography: 'Bosch Common Rail System Technical Manual; Denso Common Rail Service Manual.',
        multimediaResources: 'Videos en HD del funcionamiento de la válvula piezoeléctrica y flujo de combustible a 2000 bar.',
        practicalCases: 'Caso Real: Kia Frontier D4CB no arranca por inyector #3 con retorno excesivo que cae la presión de riel por debajo de 180 bar.',
        safetyRules: 'PELIGRO EXTREMO: Jamás tocar o acercar las manos a una fuga de inyección Common Rail. El chorro de diésel a 2000 bar perfora la piel y causa gangrena.',
        integratingProject: 'Pauta de diagnóstico paso a paso de códigos P0087 (Presión de riel demasiado baja).',
        weeklyStatus: 'COMPLETED',
        status: 'PUBLISHED'
      },
      {
        id: 'SYLL-SEM6-07',
        unitId: 'UNIT-SEM6-07',
        generalCompetency: 'Diagnosticar y realizar mantenimiento seguro en sistemas de propulsión de vehículos Híbridos (HEV/PHEV) y Eléctricos (EV).',
        specificCompetency: 'Ejecutar el protocolo de desenergización de alta tensión (HV), comprobar el estado de salud (SOH) de la batería de tracción, probar el sistema BMS e inspeccionar el inversor trifásico.',
        learningOutcomes: 'Al finalizar el curso, el estudiante podrá: 1. Realizar el procedimiento de cero energía (Zero Energy Verification) de forma segura. 2. Medir la resistencia de aislamiento con megóhmetro (mínimo 500V DC / >10MΩ). 3. Interpretar códigos DTC de fallas de interlock o fuga de corriente HV.',
        capabilities: 'Uso de equipo de protección personal CAT IV 1000V, megóhmetro / comprobador de aislamiento, escáner para baterías de alta tensión.',
        prerequisites: 'Mediciones electrónicas automotrices (MEC-302) y Módulos electrónicos (MEC-504).',
        weeklyDistribution: JSON.stringify([
          { week: 1, topic: 'Clasificación de Vehículos Electrificados: Microhíbridos, HEV, PHEV y BEV 100% Eléctricos', hours: 10, activity: 'Análisis de arquitectura en Toyota Prius, Nissan Leaf y BYD Electric.' },
          { week: 2, topic: 'Seguridad en Alta Tensión (HV): Riesgos eléctricos, arcos eléctricos y EPP CAT IV', hours: 10, activity: 'Inspección de guantes dieléctricos con prueba de aire e inspección de herramientas aisladas.' },
          { week: 3, topic: 'Protocolo de Desconexión de Servicio (Service Plug) y Verificación de Cero Energía', hours: 10, activity: 'Prueba práctica de extracción de tapón de servicio y medición de 0V en inversor.' },
          { week: 4, topic: 'Baterías de Tracción (Ni-MH y Li-ion) y Sistema de Gestión de Batería (BMS)', hours: 10, activity: 'Escaneo de voltajes de bloques de celdas y cálculo de delta de voltaje.' },
          { week: 5, topic: 'Medición de Resistencia de Aislamiento de Alta Tensión con Megóhmetro (Megger)', hours: 10, activity: 'Prueba de aislamiento entre cableado HV naranja y chasis del vehículo a 500V DC.' },
          { week: 6, topic: 'Inversor / Conversor Trifásico, Generador MG1 y Motor Eléctrico MG2', hours: 10, activity: 'Comprobación de módulos IGBT del inversor y motor sincrónico de imanes permanentes.' },
          { week: 7, topic: 'Freno Regenerativo, Módulo de Control de Frenado e Hidroboost Eléctrico', hours: 10, activity: 'Verificación de la interacción entre freno mecánico hidráulico y regeneración MG2.' },
          { week: 8, topic: 'Diagnóstico de Códigos de Falla HV (P0A80, P0A0D, P3000, U0110)', hours: 10, activity: 'Solución de falla simulada de circuito interlock abierto en Prius.' },
          { week: 9, topic: 'Evaluación Final de Diagnóstico y Seguridad Híbrida / Eléctrica', hours: 10, activity: 'Evaluación individual de desenergización y aislamiento con rúbrica estricta de seguridad.' }
        ]),
        theoreticalActivities: 'Física de semiconductores de alta potencia (SiC/IGBT), electroquímica de litio y norma ISO 6469 de seguridad eléctrica.',
        practicalActivities: 'Protocolo real de desenergización de batería de Toyota Prius / Nissan Leaf en taller con EPP.',
        labActivities: 'Laboratorio de alta tensión con simulador de celdas Li-ion e inversor desarmado.',
        resources: 'Guantes dieléctricos Clase 0 (1000V), careta facial de protección de arco eléctrico, megóhmetro CAT IV 1000V, escáneres Híbridos.',
        learningEvidences: 'Lista de verificación de seguridad de alta tensión aprobada al 100% y reporte de aislamiento en MΩ.',
        evaluationMethod: 'Evaluación de seguridad e imprevistos (CRÍTICA 100% obligatoria) + Diagnóstico (50%) + Examen Teórico (50%).',
        evaluationInstruments: 'Rúbrica estricta de desenergización sin fallas de seguridad.',
        bibliography: 'Hybrid and Electric Vehicle Technology (SAE); Toyota Hybrid Service Training Manual.',
        multimediaResources: 'Videos 3D interactivos de flujo de potencia de MG1 y MG2 en transeje eCVT.',
        practicalCases: 'Caso Real: Toyota Prius con código P0A80 por deterioro de resistencia interna en el bloque de celda #8 de la batería de níquel-metal hidruro.',
        safetyRules: 'REGLA DE ORO DE SEGURIDAD HV: Si no cuenta con guantes dieléctricos probados y comprobador CAT IV verificado, ESTÁ PROHIBIDO tocar ningún cable o componente de color NARANJA.',
        integratingProject: 'Protocolo de rescate y desactivación de alta tensión para atención de emergencias en carretera.',
        weeklyStatus: 'COMPLETED',
        status: 'PUBLISHED'
      }
    ];

    for (const sys of pilotSyllabi) {
      insertSyllabus.run(
        sys.id, sys.unitId, sys.generalCompetency, sys.specificCompetency, sys.learningOutcomes,
        sys.capabilities, sys.prerequisites, sys.weeklyDistribution, sys.theoreticalActivities,
        sys.practicalActivities, sys.labActivities, sys.resources, sys.learningEvidences,
        sys.evaluationMethod, sys.evaluationInstruments, sys.bibliography, sys.multimediaResources,
        sys.practicalCases, sys.safetyRules, sys.integratingProject, sys.weeklyStatus, sys.status,
        new Date().toISOString()
      );
    }

    // 5. Research Videos & Internet Resources Engine
    const insertVideo = db.prepare(`
      INSERT INTO curriculum_videos (
        id, unitId, topicId, title, channel, url, platform, language, duration,
        category, level, topic, quality, source, dateChecked, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertVideo.run(
      'vid_01', 'UNIT-SEM1-05', 'top_elec_1',
      'Cómo usar el Multímetro en el Auto - Ley de Ohm y Caída de Tensión',
      'YOVE Academy & AutoTech Educational',
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'YouTube', 'es', '18:45',
      'Mediciones Eléctricas', 'NIVEL 1 — FUNDAMENTOS',
      'Multímetro Automotriz', '1080p HD',
      'Canal Académico Verificado', '2026-08-12', 'VALID_EDUCATIONAL'
    );

    insertVideo.run(
      'vid_02', 'UNIT-SEM2-06', 'top_sens_1',
      'Diagnóstico de Sensores Inductivos vs Hall CKP con Osciloscopio',
      'Mecatrónica Automotriz Global',
      'https://www.youtube.com/watch?v=3JZ_D3ELwOQ',
      'YouTube', 'es', '24:10',
      'Sensores y Actuadores', 'NIVEL 3 — DIAGNÓSTICO',
      'Osciloscopio CKP/CMP', '1080p HD',
      'Laboratorio Diagnóstico', '2026-08-12', 'VALID_EDUCATIONAL'
    );

    insertVideo.run(
      'vid_03', 'UNIT-SEM5-03', 'top_inj_1',
      'Cómo diagnosticar Inyección Directa GDI y Bombas de Alta Presión',
      'Ingeniería Automotriz Avanzada',
      'https://www.youtube.com/watch?v=2vjPBrBU-TM',
      'YouTube', 'es', '32:15',
      'Inyección Otto', 'NIVEL 3 — DIAGNÓSTICO',
      'Fuel Trims & GDI High Pressure', '1080p HD',
      'Investigación de Campo', '2026-08-12', 'VALID_EDUCATIONAL'
    );

    insertVideo.run(
      'vid_04', 'UNIT-SEM6-07', 'top_hv_1',
      'Procedimiento de Desenergización Segura en Vehículos Híbridos Prius',
      'High Voltage Auto Training',
      'https://www.youtube.com/watch?v=5qap5aO4i9A',
      'YouTube', 'es', '21:00',
      'Híbridos y Eléctricos', 'NIVEL 4 — ESPECIALIZACIÓN',
      'Seguridad Alta Tensión HV', '1080p HD',
      'Capacitación Técnica Oficial', '2026-08-12', 'VALID_EDUCATIONAL'
    );

    // 6. Curricular Comparison Matrix
    const insertComparison = db.prepare(`
      INSERT INTO curriculum_comparison (
        id, topicName, sourceAContent, sourceBContent, externalContent, yoveProposedContent, classification, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertComparison.run(
      'comp_01',
      'Mediciones Eléctricas y Ley de Ohm',
      'Módulo básico en Semestre I (45 hrs) enfocado en electricidad general y circuitos en taller.',
      'Unidad Didáctica de Mediciones Eléctricas Automotrices (72 hrs / 4 créditos) con uso de multímetro y pinza amperimétrica.',
      'Bosch Automotive Handbook: Análisis de densidad de corriente, resistividad y tolerancia térmica.',
      'SÍNTESIS YOVE: Integración de Ley de Ohm + Caídas de Tensión + Fugas Parasitarias en Reposo con simulador interactivo.',
      'COMMON',
      'Coincidencia alta en fundamentos. YOVE añade el simulador de fallas reales.'
    );

    insertComparison.run(
      'comp_02',
      'Diagnóstico de Sensores y Osciloscopio',
      'Incluido en Electrónica Automotriz V semestre con uso de escáner básico.',
      'Unidad Didáctica de Sensores y Actuadores (90 hrs / 5 créditos) en Semestre II.',
      'SAE J1979 & PicoScope Library: Formas de onda de referencia de sensores Hall, Inductivos y Piezoeléctricos.',
      'SÍNTESIS YOVE: Osciloscopía aplicada desde Semestre II + Biblioteca de oscilogramas `.psdata` en la nube.',
      'COMMON',
      'YOVE adelanta el diagnóstico con osciloscopio al semestre II para fortalecer destrezas tempranas.'
    );

    insertComparison.run(
      'comp_03',
      'Programación C y Microcontroladores para ECU',
      'No explícito como curso independiente en la malla base tradicional (integrado en controles generales).',
      'Programación lenguaje C para aplicación automotriz (72 hrs / 4 créditos) en Semestre IV.',
      'Standard ISO 26262 / Embedded C for Automotive Systems: Timers, ADC, CAN Controller y GPIO.',
      'SÍNTESIS YOVE: Programación en C sobre STM32/AVR enfocada en lectura de sensores y transmisión de tramas CAN Bus.',
      'SOURCE_B_ONLY',
      'Valor diferencial clave de la propuesta YOVE para especialización mecatrónica.'
    );

    insertComparison.run(
      'comp_04',
      'Vehículos Híbridos, Eléctricos (EV) y BMS',
      'Electiva de especialización o módulo corto en Semestre VI.',
      'Sistemas automotores eléctricos e híbridos (90 hrs / 5 créditos) en Semestre VI.',
      'Norma ISO 6469-3 / SAE J1772: Procedimiento de cero energía, comprobación de megóhmetro y BMS Li-ion.',
      'SÍNTESIS YOVE: Protocolo de Seguridad HV CAT IV + Medición de Aislamiento con Megger + Diagnóstico de BMS y celdas.',
      'YOVE_PROPOSED',
      'Modulo de máxima prioridad actual con actualización a tecnología EV 2026.'
    );

    // 7. Versions & Competency Matrix
    const insertVersion = db.prepare(`
      INSERT INTO curriculum_versions (id, versionName, description, status, releaseDate, changeLog)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertVersion.run(
      'ver_2026_1',
      'YOVE Master Curriculum 2026.1',
      'Alineamiento de Malla 6 Semestres con fuentes SENATI, Documento B, CNOF y Bosch Handbook. Sílabos detallados en 10 cursos piloto.',
      'CURRENT',
      '2026-08-12',
      'Inclusión de Osciloscopía Avanzada, Inyección Directa GDI, Reparación de ECUs, Programación C y Alta Tensión Híbridos/EVs.'
    );

    const insertMatrix = db.prepare(`
      INSERT INTO curriculum_competency_matrix (
        id, competencyName, courseCode, lessonTitle, practicalTitle, labTitle, caseTitle, examTitle, coverageStatus
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertMatrix.run(
      'mat_01',
      'Diagnóstico de caídas de tensión en masa y alimentación',
      'MEC-105',
      'Caídas de Tensión en Circuitos de Carga y Masa',
      'Prueba de caída de tensión en cable de masa de chasis',
      'Panel de simulación de circuitos con alta resistencia',
      'Caso Hilux: Falla de arranque por caída de 1.8V en masa',
      'Examen Práctico de Mediciones Eléctricas',
      'FULL'
    );

    insertMatrix.run(
      'mat_02',
      'Sincronismo de señales CKP y CMP con Osciloscopio',
      'MEC-206',
      'Sensores de Posición CKP y CMP',
      'Conexión de osciloscopio de 2 canales en arnés CKP/CMP',
      'Simulador de señales de motor con generador PWM',
      'Caso Nissan HR16DE: Falla de arranque por señal CKP atenuada',
      'Evaluación de Osciloscopía Automotriz',
      'FULL'
    );

    insertMatrix.run(
      'mat_03',
      'Protocolo de desenergización y verificación de Cero Energía en Híbridos/EV',
      'MEC-607',
      'Protocolo de Desconexión de Servicio y Cero Energía',
      'Extracción de Service Plug y comprobación de 0V DC',
      'Laboratorio de alta tensión con guantes dieléctricos CAT IV',
      'Caso Prius: Diagnóstico de código P0A80 en celda de batería',
      'Examen Estricto de Seguridad de Alta Tensión',
      'FULL'
    );

    console.log("[SeedCurriculumData] Curriculum database successfully seeded with Prompt 41 data!");

  } catch (error) {
    console.error("[SeedCurriculumData] Error seeding curriculum data:", error);
  }
}
