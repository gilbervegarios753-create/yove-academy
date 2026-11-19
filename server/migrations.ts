import { db } from "./db";
import { seedLearningPaths } from "./seedLearningPaths";
import { seedCertificates } from "./seedCertificates";
import { seedInstitutionData } from "./seedInstitutionData";
import { seedCurriculumData } from "./seedCurriculumData";
import { initPaymentsDatabase } from "./payments/dbSchema";

export function runMigrations() {
  console.log("[Migrations] Running database migrations...");

  try {
    initPaymentsDatabase();
  } catch (err) {
    console.error("[Migrations] Error running initPaymentsDatabase:", err);
  }
  
  // Alter existing tables safely
  const alterTableSafe = (tableName: string, columnName: string, columnDef: string) => {
    try {
      db.prepare(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnDef}`).run();
    } catch (e: any) {
      if (!e.message.includes('duplicate column name')) {
        console.error(`[Migrations] Error altering ${tableName}:`, e.message);
      }
    }
  };

  alterTableSafe('users', 'status', 'TEXT DEFAULT "ACTIVE"');
  alterTableSafe('users', 'phone', 'TEXT');
  alterTableSafe('users', 'email_verified', 'INTEGER DEFAULT 1');
  alterTableSafe('users', 'last_password_change', 'TEXT');

  alterTableSafe('sessions', 'ip_address', 'TEXT');
  alterTableSafe('sessions', 'user_agent', 'TEXT');
  alterTableSafe('sessions', 'last_activity_at', 'TEXT');

  db.exec(`
    CREATE TABLE IF NOT EXISTS password_resets (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token_hash TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      used INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS email_verification_codes (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      code TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      used INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    );
  `);

  alterTableSafe('courses', 'slug', 'TEXT');
  alterTableSafe('courses', 'shortDescription', 'TEXT');
  alterTableSafe('courses', 'categoryId', 'TEXT');
  alterTableSafe('courses', 'language', 'TEXT DEFAULT "es"');
  alterTableSafe('courses', 'durationMinutes', 'INTEGER');
  alterTableSafe('courses', 'thumbnail', 'TEXT');
  alterTableSafe('courses', 'status', 'TEXT DEFAULT "DRAFT"');
  alterTableSafe('courses', 'isPublished', 'INTEGER DEFAULT 0');
  alterTableSafe('courses', 'price', 'REAL DEFAULT 299');
  alterTableSafe('courses', 'createdAt', 'TEXT');
  alterTableSafe('courses', 'updatedAt', 'TEXT');

  alterTableSafe('vehicle_brands', 'slug', 'TEXT');
  alterTableSafe('vehicle_brands', 'status', 'TEXT DEFAULT "ACTIVE"');
  
  alterTableSafe('enrollments', 'status', 'TEXT DEFAULT "ACTIVE"');
  alterTableSafe('enrollments', 'enrolledAt', 'TEXT');
  alterTableSafe('enrollments', 'completedAt', 'TEXT');
  alterTableSafe('enrollments', 'lastAccessedAt', 'TEXT');

  alterTableSafe('quiz_attempts', 'passed', 'INTEGER DEFAULT 0');
  alterTableSafe('quiz_attempts', 'startedAt', 'TEXT');
  alterTableSafe('quiz_attempts', 'completedAt', 'TEXT');
  alterTableSafe('quiz_attempts', 'quizId', 'TEXT');
  
  alterTableSafe('certificates', 'userId', 'TEXT');
  alterTableSafe('certificates', 'userName', 'TEXT');
  alterTableSafe('certificates', 'courseId', 'TEXT');
  alterTableSafe('certificates', 'itemType', 'TEXT DEFAULT "COURSE"');
  alterTableSafe('certificates', 'title', 'TEXT');
  alterTableSafe('certificates', 'hours', 'TEXT');
  alterTableSafe('certificates', 'level', 'TEXT DEFAULT "Intermedio"');
  alterTableSafe('certificates', 'issuedAt', 'TEXT');
  alterTableSafe('certificates', 'certificateNumber', 'TEXT');
  alterTableSafe('certificates', 'verificationCode', 'TEXT');
  alterTableSafe('certificates', 'score', 'INTEGER DEFAULT 100');
  alterTableSafe('certificates', 'status', 'TEXT DEFAULT "VALID"');
  alterTableSafe('certificates', 'revokedAt', 'TEXT');
  alterTableSafe('certificates', 'revokedReason', 'TEXT');

  db.exec(`
    CREATE TABLE IF NOT EXISTS certificate_history (
      id TEXT PRIMARY KEY,
      certificateId TEXT NOT NULL,
      action TEXT NOT NULL,
      performedBy TEXT NOT NULL,
      performedByName TEXT NOT NULL,
      userId TEXT NOT NULL,
      courseOrPathTitle TEXT NOT NULL,
      score INTEGER,
      certificateNumber TEXT NOT NULL,
      verificationCode TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      notes TEXT
    );
  `);

  alterTableSafe('ai_usage_logs', 'duration_ms', 'INTEGER DEFAULT 0');
  alterTableSafe('ai_usage_logs', 'prompt_tokens', 'INTEGER DEFAULT 0');
  alterTableSafe('ai_usage_logs', 'candidate_tokens', 'INTEGER DEFAULT 0');

  // New tables for courses & content
  db.exec(`
    CREATE TABLE IF NOT EXISTS course_categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE,
      description TEXT,
      icon TEXT,
      status TEXT DEFAULT 'ACTIVE',
      createdAt TEXT,
      updatedAt TEXT
    );

    CREATE TABLE IF NOT EXISTS course_modules (
      id TEXT PRIMARY KEY,
      courseId TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      orderIndex INTEGER DEFAULT 0,
      durationMinutes INTEGER,
      createdAt TEXT,
      updatedAt TEXT,
      FOREIGN KEY (courseId) REFERENCES courses(id)
    );

    CREATE TABLE IF NOT EXISTS lessons (
      id TEXT PRIMARY KEY,
      moduleId TEXT NOT NULL,
      title TEXT NOT NULL,
      slug TEXT,
      description TEXT,
      contentType TEXT DEFAULT 'VIDEO',
      content TEXT,
      videoUrl TEXT,
      durationMinutes INTEGER,
      orderIndex INTEGER DEFAULT 0,
      isPublished INTEGER DEFAULT 0,
      createdAt TEXT,
      updatedAt TEXT,
      FOREIGN KEY (moduleId) REFERENCES course_modules(id)
    );

    CREATE TABLE IF NOT EXISTS learning_objectives (
      id TEXT PRIMARY KEY,
      courseId TEXT NOT NULL,
      description TEXT NOT NULL,
      orderIndex INTEGER DEFAULT 0,
      FOREIGN KEY (courseId) REFERENCES courses(id)
    );

    CREATE TABLE IF NOT EXISTS course_prerequisites (
      courseId TEXT NOT NULL,
      prerequisiteCourseId TEXT NOT NULL,
      PRIMARY KEY (courseId, prerequisiteCourseId),
      FOREIGN KEY (courseId) REFERENCES courses(id),
      FOREIGN KEY (prerequisiteCourseId) REFERENCES courses(id)
    );

    CREATE TABLE IF NOT EXISTS lesson_progress (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      courseId TEXT NOT NULL,
      lessonId TEXT NOT NULL,
      completed INTEGER DEFAULT 0,
      progressPercent INTEGER DEFAULT 0,
      startedAt TEXT,
      completedAt TEXT,
      updatedAt TEXT,
      UNIQUE(userId, lessonId),
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (courseId) REFERENCES courses(id),
      FOREIGN KEY (lessonId) REFERENCES lessons(id)
    );

    CREATE TABLE IF NOT EXISTS quizzes (
      id TEXT PRIMARY KEY,
      lessonId TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      passingScore INTEGER DEFAULT 70,
      timeLimitSeconds INTEGER,
      attemptsAllowed INTEGER DEFAULT 3,
      FOREIGN KEY (lessonId) REFERENCES lessons(id)
    );

    CREATE TABLE IF NOT EXISTS quiz_questions (
      id TEXT PRIMARY KEY,
      quizId TEXT NOT NULL,
      question TEXT NOT NULL,
      questionType TEXT DEFAULT 'MULTIPLE_CHOICE',
      explanation TEXT,
      orderIndex INTEGER DEFAULT 0,
      FOREIGN KEY (quizId) REFERENCES quizzes(id)
    );

    CREATE TABLE IF NOT EXISTS quiz_answers (
      id TEXT PRIMARY KEY,
      questionId TEXT NOT NULL,
      answer TEXT NOT NULL,
      isCorrect INTEGER DEFAULT 0,
      explanation TEXT,
      orderIndex INTEGER DEFAULT 0,
      FOREIGN KEY (questionId) REFERENCES quiz_questions(id)
    );

    CREATE TABLE IF NOT EXISTS exams (
      id TEXT PRIMARY KEY,
      courseId TEXT NOT NULL,
      title TEXT NOT NULL,
      passingScore INTEGER DEFAULT 80,
      timeLimitSeconds INTEGER,
      attemptsAllowed INTEGER DEFAULT 1,
      isCertificationExam INTEGER DEFAULT 0,
      FOREIGN KEY (courseId) REFERENCES courses(id)
    );
  `);

  alterTableSafe('courses', 'code', 'TEXT');
  alterTableSafe('courses', 'semester', 'TEXT');
  alterTableSafe('courses', 'credits', 'INTEGER DEFAULT 3');
  alterTableSafe('courses', 'hours', 'INTEGER DEFAULT 45');
  alterTableSafe('courses', 'reviewStatus', 'TEXT DEFAULT "DRAFT"');
  alterTableSafe('courses', 'completenessScore', 'INTEGER DEFAULT 0');
  alterTableSafe('courses', 'trafficLight', 'TEXT DEFAULT "RED"');
  alterTableSafe('courses', 'prerequisites', 'TEXT');
  alterTableSafe('courses', 'outcomes', 'TEXT');

  alterTableSafe('lessons', 'videoStatus', 'TEXT DEFAULT "VALID"');
  alterTableSafe('lessons', 'objective', 'TEXT');
  alterTableSafe('lessons', 'status', 'TEXT DEFAULT "DRAFT"');

  // Media Library Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS media_library (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      originalName TEXT,
      fileType TEXT NOT NULL,
      mimeType TEXT,
      sizeBytes INTEGER,
      url TEXT NOT NULL,
      dimensions TEXT,
      author TEXT,
      sourceType TEXT DEFAULT 'YOVE_ORIGINAL',
      sourceName TEXT,
      license TEXT,
      notes TEXT,
      uploadedBy TEXT,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS syllabi (
      id TEXT PRIMARY KEY,
      courseId TEXT,
      code TEXT,
      semester TEXT,
      title TEXT NOT NULL,
      competencies_json TEXT,
      outcomes_json TEXT,
      hours INTEGER,
      credits INTEGER,
      topics_json TEXT,
      bibliography_json TEXT,
      status TEXT DEFAULT 'DRAFT',
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS content_versions (
      id TEXT PRIMARY KEY,
      entityType TEXT NOT NULL,
      entityId TEXT NOT NULL,
      versionNumber INTEGER NOT NULL,
      contentJson TEXT NOT NULL,
      createdBy TEXT,
      notes TEXT,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      userId TEXT,
      userName TEXT,
      action TEXT NOT NULL,
      entityType TEXT NOT NULL,
      entityId TEXT NOT NULL,
      detailsJson TEXT,
      timestamp TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS lesson_videos (
      id TEXT PRIMARY KEY,
      lessonId TEXT NOT NULL,
      url TEXT NOT NULL,
      videoId TEXT,
      title TEXT,
      channel TEXT,
      author TEXT,
      duration TEXT,
      sourceType TEXT DEFAULT 'YOUTUBE',
      status TEXT DEFAULT 'VALID',
      reviewedBy TEXT,
      reviewedAt TEXT,
      updatedAt TEXT NOT NULL
    );
  `);

  // New tables for Vehicles & Auto Knowledge Graph
  db.exec(`
    CREATE TABLE IF NOT EXISTS vehicle_models (
      id TEXT PRIMARY KEY,
      brandId TEXT NOT NULL,
      name TEXT NOT NULL,
      slug TEXT,
      segment TEXT,
      status TEXT DEFAULT 'ACTIVE',
      FOREIGN KEY (brandId) REFERENCES vehicle_brands(id)
    );

    CREATE TABLE IF NOT EXISTS vehicle_generations (
      id TEXT PRIMARY KEY,
      modelId TEXT NOT NULL,
      name TEXT NOT NULL,
      startYear INTEGER,
      endYear INTEGER,
      code TEXT,
      status TEXT DEFAULT 'ACTIVE',
      FOREIGN KEY (modelId) REFERENCES vehicle_models(id)
    );

    CREATE TABLE IF NOT EXISTS engines (
      id TEXT PRIMARY KEY,
      manufacturer TEXT,
      code TEXT NOT NULL,
      name TEXT,
      displacement REAL,
      fuelType TEXT,
      aspiration TEXT,
      cylinders INTEGER,
      configuration TEXT,
      status TEXT DEFAULT 'ACTIVE'
    );

    CREATE TABLE IF NOT EXISTS vehicle_model_engines (
      modelId TEXT NOT NULL,
      engineId TEXT NOT NULL,
      startYear INTEGER,
      endYear INTEGER,
      PRIMARY KEY (modelId, engineId),
      FOREIGN KEY (modelId) REFERENCES vehicle_models(id),
      FOREIGN KEY (engineId) REFERENCES engines(id)
    );

    CREATE TABLE IF NOT EXISTS transmissions (
      id TEXT PRIMARY KEY,
      manufacturer TEXT,
      code TEXT,
      name TEXT NOT NULL,
      type TEXT,
      gears INTEGER,
      status TEXT DEFAULT 'ACTIVE'
    );

    CREATE TABLE IF NOT EXISTS vehicle_model_transmissions (
      modelId TEXT NOT NULL,
      transmissionId TEXT NOT NULL,
      startYear INTEGER,
      endYear INTEGER,
      PRIMARY KEY (modelId, transmissionId),
      FOREIGN KEY (modelId) REFERENCES vehicle_models(id),
      FOREIGN KEY (transmissionId) REFERENCES transmissions(id)
    );

    CREATE TABLE IF NOT EXISTS vehicle_systems (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT,
      description TEXT,
      category TEXT
    );

    CREATE TABLE IF NOT EXISTS components (
      id TEXT PRIMARY KEY,
      systemId TEXT NOT NULL,
      name TEXT NOT NULL,
      slug TEXT,
      description TEXT,
      FOREIGN KEY (systemId) REFERENCES vehicle_systems(id)
    );

    CREATE TABLE IF NOT EXISTS sensors (
      id TEXT PRIMARY KEY,
      componentId TEXT NOT NULL,
      name TEXT NOT NULL,
      type TEXT,
      description TEXT,
      FOREIGN KEY (componentId) REFERENCES components(id)
    );

    CREATE TABLE IF NOT EXISTS actuators (
      id TEXT PRIMARY KEY,
      componentId TEXT NOT NULL,
      name TEXT NOT NULL,
      type TEXT,
      description TEXT,
      FOREIGN KEY (componentId) REFERENCES components(id)
    );

    CREATE TABLE IF NOT EXISTS ecus (
      id TEXT PRIMARY KEY,
      manufacturer TEXT,
      model TEXT,
      type TEXT,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS vehicle_networks (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      protocol TEXT,
      speed TEXT,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS vehicle_ecus (
      vehicleModelId TEXT NOT NULL,
      ecuId TEXT NOT NULL,
      systemId TEXT,
      yearFrom INTEGER,
      yearTo INTEGER,
      PRIMARY KEY (vehicleModelId, ecuId),
      FOREIGN KEY (vehicleModelId) REFERENCES vehicle_models(id),
      FOREIGN KEY (ecuId) REFERENCES ecus(id),
      FOREIGN KEY (systemId) REFERENCES vehicle_systems(id)
    );
  `);

  // DTC & relations
  db.exec(`
    CREATE TABLE IF NOT EXISTS dtcs (
      id TEXT PRIMARY KEY,
      code TEXT NOT NULL UNIQUE,
      systemId TEXT,
      title TEXT NOT NULL,
      description TEXT,
      severity TEXT,
      category TEXT,
      symptoms TEXT,
      possibleCauses TEXT,
      diagnosticNotes TEXT,
      createdAt TEXT,
      updatedAt TEXT,
      FOREIGN KEY (systemId) REFERENCES vehicle_systems(id)
    );

    CREATE TABLE IF NOT EXISTS vehicle_dtcs (
      vehicleModelId TEXT NOT NULL,
      dtcId TEXT NOT NULL,
      yearFrom INTEGER,
      yearTo INTEGER,
      PRIMARY KEY (vehicleModelId, dtcId),
      FOREIGN KEY (vehicleModelId) REFERENCES vehicle_models(id),
      FOREIGN KEY (dtcId) REFERENCES dtcs(id)
    );

    CREATE TABLE IF NOT EXISTS course_dtcs (
      courseId TEXT NOT NULL,
      dtcId TEXT NOT NULL,
      PRIMARY KEY (courseId, dtcId),
      FOREIGN KEY (courseId) REFERENCES courses(id),
      FOREIGN KEY (dtcId) REFERENCES dtcs(id)
    );

    CREATE TABLE IF NOT EXISTS case_dtcs (
      caseId TEXT NOT NULL,
      dtcId TEXT NOT NULL,
      PRIMARY KEY (caseId, dtcId),
      FOREIGN KEY (caseId) REFERENCES diagnostic_cases(id),
      FOREIGN KEY (dtcId) REFERENCES dtcs(id)
    );
    
    CREATE TABLE IF NOT EXISTS course_systems (
      courseId TEXT NOT NULL,
      systemId TEXT NOT NULL,
      PRIMARY KEY (courseId, systemId),
      FOREIGN KEY (courseId) REFERENCES courses(id),
      FOREIGN KEY (systemId) REFERENCES vehicle_systems(id)
    );

    CREATE TABLE IF NOT EXISTS course_vehicle_models (
      courseId TEXT NOT NULL,
      vehicleModelId TEXT NOT NULL,
      PRIMARY KEY (courseId, vehicleModelId),
      FOREIGN KEY (courseId) REFERENCES courses(id),
      FOREIGN KEY (vehicleModelId) REFERENCES vehicle_models(id)
    );
  `);

  // Diagnostic Cases detailed tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS diagnostic_case_steps (
      id TEXT PRIMARY KEY,
      caseId TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      orderIndex INTEGER DEFAULT 0,
      FOREIGN KEY (caseId) REFERENCES diagnostic_cases(id)
    );

    CREATE TABLE IF NOT EXISTS diagnostic_case_hints (
      id TEXT PRIMARY KEY,
      caseId TEXT NOT NULL,
      hint TEXT NOT NULL,
      xpCost INTEGER DEFAULT 0,
      orderIndex INTEGER DEFAULT 0,
      FOREIGN KEY (caseId) REFERENCES diagnostic_cases(id)
    );

    CREATE TABLE IF NOT EXISTS diagnostic_case_results (
      id TEXT PRIMARY KEY,
      caseId TEXT NOT NULL,
      userId TEXT NOT NULL,
      score INTEGER,
      completedAt TEXT,
      FOREIGN KEY (caseId) REFERENCES diagnostic_cases(id),
      FOREIGN KEY (userId) REFERENCES users(id)
    );
  `);

  // Labs
  db.exec(`
    CREATE TABLE IF NOT EXISTS labs (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      difficulty TEXT,
      createdAt TEXT,
      updatedAt TEXT
    );
    
    CREATE TABLE IF NOT EXISTS lab_steps (
      id TEXT PRIMARY KEY,
      labId TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      orderIndex INTEGER DEFAULT 0,
      FOREIGN KEY (labId) REFERENCES labs(id)
    );

    CREATE TABLE IF NOT EXISTS lab_parameters (
      id TEXT PRIMARY KEY,
      labId TEXT NOT NULL,
      keyName TEXT NOT NULL,
      valueType TEXT,
      defaultValue TEXT,
      FOREIGN KEY (labId) REFERENCES labs(id)
    );

    CREATE TABLE IF NOT EXISTS lab_results (
      id TEXT PRIMARY KEY,
      labId TEXT NOT NULL,
      userId TEXT NOT NULL,
      score INTEGER,
      completedAt TEXT,
      FOREIGN KEY (labId) REFERENCES labs(id),
      FOREIGN KEY (userId) REFERENCES users(id)
    );

    -- Learning Paths Architecture (PROMPT 36)
    CREATE TABLE IF NOT EXISTS learning_paths (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      badge TEXT,
      description TEXT,
      estimated_hours INTEGER DEFAULT 0,
      target_role TEXT,
      level TEXT DEFAULT 'Inicial',
      certificate_title TEXT,
      created_at TEXT,
      updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS learning_path_courses (
      id TEXT PRIMARY KEY,
      learning_path_id TEXT NOT NULL,
      course_id TEXT NOT NULL,
      step_number INTEGER NOT NULL,
      level_name TEXT NOT NULL,
      is_required INTEGER DEFAULT 1,
      case_id TEXT,
      lab_id TEXT,
      created_at TEXT,
      FOREIGN KEY (learning_path_id) REFERENCES learning_paths(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS learning_path_requirements (
      id TEXT PRIMARY KEY,
      learning_path_id TEXT NOT NULL,
      prerequisite_path_id TEXT,
      required_level TEXT,
      min_xp INTEGER DEFAULT 0,
      description TEXT NOT NULL,
      created_at TEXT,
      FOREIGN KEY (learning_path_id) REFERENCES learning_paths(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS user_learning_path_progress (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      learning_path_id TEXT NOT NULL,
      status TEXT DEFAULT 'IN_PROGRESS',
      completed_courses_count INTEGER DEFAULT 0,
      total_courses_count INTEGER DEFAULT 0,
      progress_percent INTEGER DEFAULT 0,
      current_course_id TEXT,
      next_course_id TEXT,
      completed_at TEXT,
      updated_at TEXT,
      UNIQUE(user_id, learning_path_id)
    );

    -- Prompt 39: Institutional Platform Tables
    CREATE TABLE IF NOT EXISTS organizations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      code TEXT UNIQUE NOT NULL,
      type TEXT DEFAULT 'INSTITUTE',
      logo TEXT,
      country TEXT,
      address TEXT,
      contact_email TEXT,
      contact_phone TEXT,
      status TEXT DEFAULT 'ACTIVE',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS organization_users (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      role TEXT NOT NULL,
      status TEXT DEFAULT 'ACTIVE',
      joined_at TEXT NOT NULL,
      FOREIGN KEY (organization_id) REFERENCES organizations(id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE(organization_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS organization_instructors (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      specialty TEXT,
      assigned_groups_count INTEGER DEFAULT 0,
      status TEXT DEFAULT 'ACTIVE',
      created_at TEXT NOT NULL,
      FOREIGN KEY (organization_id) REFERENCES organizations(id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE(organization_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS organization_courses (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL,
      course_id TEXT NOT NULL,
      assigned_at TEXT NOT NULL,
      status TEXT DEFAULT 'ACTIVE',
      FOREIGN KEY (organization_id) REFERENCES organizations(id),
      FOREIGN KEY (course_id) REFERENCES courses(id),
      UNIQUE(organization_id, course_id)
    );

    CREATE TABLE IF NOT EXISTS organization_licenses (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL,
      total_licenses INTEGER DEFAULT 50,
      active_licenses INTEGER DEFAULT 0,
      available_licenses INTEGER DEFAULT 50,
      expired_licenses INTEGER DEFAULT 0,
      plan_type TEXT DEFAULT 'ANNUAL',
      start_date TEXT NOT NULL,
      expiration_date TEXT NOT NULL,
      status TEXT DEFAULT 'ACTIVE',
      created_at TEXT NOT NULL,
      FOREIGN KEY (organization_id) REFERENCES organizations(id)
    );

    CREATE TABLE IF NOT EXISTS organization_groups (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL,
      name TEXT NOT NULL,
      code TEXT,
      instructor_id TEXT,
      course_id TEXT,
      period TEXT DEFAULT '2026-I',
      created_at TEXT NOT NULL,
      FOREIGN KEY (organization_id) REFERENCES organizations(id)
    );

    CREATE TABLE IF NOT EXISTS organization_group_students (
      id TEXT PRIMARY KEY,
      group_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      assigned_at TEXT NOT NULL,
      FOREIGN KEY (group_id) REFERENCES organization_groups(id),
      UNIQUE(group_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS organization_assignments (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL,
      group_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      course_id TEXT,
      due_date TEXT,
      created_by TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (organization_id) REFERENCES organizations(id),
      FOREIGN KEY (group_id) REFERENCES organization_groups(id)
    );
  `);
  
  // Prompt 41 Curriculum + Syllabus + Internet Research Engine Tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS curriculum_sources (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      institution TEXT,
      country TEXT DEFAULT 'Perú',
      language TEXT DEFAULT 'es',
      description TEXT,
      url TEXT,
      documentPath TEXT,
      version TEXT,
      publicationDate TEXT,
      accessDate TEXT,
      status TEXT DEFAULT 'ACTIVE',
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS curriculum_semesters (
      id TEXT PRIMARY KEY,
      semesterNumber INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      creditTotal INTEGER DEFAULT 0,
      hoursTotal INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS curriculum_units (
      id TEXT PRIMARY KEY,
      semesterId TEXT NOT NULL,
      semesterNumber INTEGER NOT NULL,
      code TEXT NOT NULL,
      name TEXT NOT NULL,
      credits INTEGER DEFAULT 0,
      hours INTEGER DEFAULT 0,
      level TEXT DEFAULT 'NIVEL 1 — FUNDAMENTOS',
      status TEXT DEFAULT 'SYLLABUS_DEFINED',
      sourceId TEXT,
      sourceType TEXT,
      sourceTitle TEXT,
      sourceInstitution TEXT,
      sourceUrl TEXT,
      sourceReference TEXT,
      dateAccessed TEXT,
      notes TEXT,
      FOREIGN KEY (semesterId) REFERENCES curriculum_semesters(id),
      FOREIGN KEY (sourceId) REFERENCES curriculum_sources(id)
    );

    CREATE TABLE IF NOT EXISTS curriculum_syllabi (
      id TEXT PRIMARY KEY,
      unitId TEXT NOT NULL UNIQUE,
      generalCompetency TEXT,
      specificCompetency TEXT,
      learningOutcomes TEXT,
      capabilities TEXT,
      prerequisites TEXT,
      weeklyDistribution TEXT,
      theoreticalActivities TEXT,
      practicalActivities TEXT,
      labActivities TEXT,
      resources TEXT,
      learningEvidences TEXT,
      evaluationMethod TEXT,
      evaluationInstruments TEXT,
      bibliography TEXT,
      multimediaResources TEXT,
      practicalCases TEXT,
      safetyRules TEXT,
      integratingProject TEXT,
      weeklyStatus TEXT DEFAULT 'COMPLETED',
      status TEXT DEFAULT 'SYLLABUS_DEFINED',
      updatedAt TEXT,
      FOREIGN KEY (unitId) REFERENCES curriculum_units(id)
    );

    CREATE TABLE IF NOT EXISTS curriculum_modules (
      id TEXT PRIMARY KEY,
      unitId TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      orderIndex INTEGER DEFAULT 0,
      FOREIGN KEY (unitId) REFERENCES curriculum_units(id)
    );

    CREATE TABLE IF NOT EXISTS curriculum_topics (
      id TEXT PRIMARY KEY,
      moduleId TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      orderIndex INTEGER DEFAULT 0,
      FOREIGN KEY (moduleId) REFERENCES curriculum_modules(id)
    );

    CREATE TABLE IF NOT EXISTS curriculum_practicals (
      id TEXT PRIMARY KEY,
      unitId TEXT NOT NULL,
      topicId TEXT,
      title TEXT NOT NULL,
      objective TEXT,
      tools TEXT,
      materials TEXT,
      procedure TEXT,
      measurements TEXT,
      safetyCriteria TEXT,
      expectedResult TEXT,
      evidence TEXT,
      evaluation TEXT,
      type TEXT DEFAULT 'OFFICIAL',
      FOREIGN KEY (unitId) REFERENCES curriculum_units(id)
    );

    CREATE TABLE IF NOT EXISTS curriculum_labs (
      id TEXT PRIMARY KEY,
      unitId TEXT NOT NULL,
      topicId TEXT,
      labName TEXT NOT NULL,
      instrument TEXT,
      activity TEXT,
      expectedOutcome TEXT,
      FOREIGN KEY (unitId) REFERENCES curriculum_units(id)
    );

    CREATE TABLE IF NOT EXISTS curriculum_cases (
      id TEXT PRIMARY KEY,
      unitId TEXT NOT NULL,
      topicId TEXT,
      title TEXT NOT NULL,
      symptom TEXT,
      vehicleContext TEXT,
      diagnosticSteps TEXT,
      solution TEXT,
      FOREIGN KEY (unitId) REFERENCES curriculum_units(id)
    );

    CREATE TABLE IF NOT EXISTS curriculum_resources (
      id TEXT PRIMARY KEY,
      unitId TEXT NOT NULL,
      topicId TEXT,
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      url TEXT,
      accessLevel TEXT DEFAULT 'FREE',
      description TEXT,
      sourceId TEXT,
      FOREIGN KEY (unitId) REFERENCES curriculum_units(id)
    );

    CREATE TABLE IF NOT EXISTS curriculum_videos (
      id TEXT PRIMARY KEY,
      unitId TEXT NOT NULL,
      topicId TEXT,
      title TEXT NOT NULL,
      channel TEXT,
      url TEXT NOT NULL,
      platform TEXT DEFAULT 'YouTube',
      language TEXT DEFAULT 'es',
      duration TEXT,
      category TEXT,
      level TEXT,
      topic TEXT,
      quality TEXT DEFAULT '1080p HD',
      source TEXT,
      dateChecked TEXT,
      status TEXT DEFAULT 'VALID_EDUCATIONAL',
      FOREIGN KEY (unitId) REFERENCES curriculum_units(id)
    );

    CREATE TABLE IF NOT EXISTS curriculum_comparison (
      id TEXT PRIMARY KEY,
      topicName TEXT NOT NULL,
      sourceAContent TEXT,
      sourceBContent TEXT,
      externalContent TEXT,
      yoveProposedContent TEXT,
      classification TEXT DEFAULT 'COMMON',
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS curriculum_versions (
      id TEXT PRIMARY KEY,
      versionName TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'CURRENT',
      releaseDate TEXT,
      changeLog TEXT
    );

    CREATE TABLE IF NOT EXISTS curriculum_competency_matrix (
      id TEXT PRIMARY KEY,
      competencyName TEXT NOT NULL,
      courseCode TEXT,
      lessonTitle TEXT,
      practicalTitle TEXT,
      labTitle TEXT,
      caseTitle TEXT,
      examTitle TEXT,
      coverageStatus TEXT DEFAULT 'FULL'
    );
  `);

  // Create Indices
  db.exec(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_certificates_cert_num ON certificates(certificateNumber);
    CREATE UNIQUE INDEX IF NOT EXISTS idx_certificates_ver_code ON certificates(verificationCode);
    CREATE UNIQUE INDEX IF NOT EXISTS idx_dtcs_code ON dtcs(code);
    CREATE UNIQUE INDEX IF NOT EXISTS idx_learning_paths_slug ON learning_paths(slug);
    CREATE UNIQUE INDEX IF NOT EXISTS idx_organizations_code ON organizations(code);
    CREATE UNIQUE INDEX IF NOT EXISTS idx_curriculum_units_code ON curriculum_units(code);
  `);

  try {
    seedLearningPaths();
  } catch (err) {
    console.error("[Migrations] Error running seedLearningPaths:", err);
  }

  try {
    seedCertificates();
  } catch (err) {
    console.error("[Migrations] Error running seedCertificates:", err);
  }

  try {
    seedInstitutionData();
  } catch (err) {
    console.error("[Migrations] Error running seedInstitutionData:", err);
  }

  try {
    seedCurriculumData();
  } catch (err) {
    console.error("[Migrations] Error running seedCurriculumData:", err);
  }

  console.log("[Migrations] Migrations applied successfully.");
}
