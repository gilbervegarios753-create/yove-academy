import { db } from "../db";
import { randomUUID } from "crypto";
import { hashPassword } from "../auth";

export function registerInstitutionRoutes(app: any, requireAuth: any, requireRole: any) {

  // Helper to determine active organization for current user with tenant isolation
  function getActiveOrganization(req: any) {
    const userId = req.user.id;
    const isSuper = req.user.role === 'SUPER_ADMIN';

    // If super admin specifies orgId query or body param, use it
    const requestedOrgId = req.query.orgId || req.body?.orgId;
    if (isSuper && requestedOrgId) {
      const org = db.prepare("SELECT * FROM organizations WHERE id = ?").get(requestedOrgId) as any;
      if (org) return org;
    }

    // Query user's assigned organization
    const orgUser = db.prepare(`
      SELECT o.*, ou.role as org_user_role 
      FROM organization_users ou
      JOIN organizations o ON ou.organization_id = o.id
      WHERE ou.user_id = ? AND ou.status = 'ACTIVE'
    `).get(userId) as any;

    if (orgUser) return orgUser;

    // Fallback default organization for testing/admin
    const defaultOrg = db.prepare("SELECT * FROM organizations ORDER BY created_at ASC LIMIT 1").get() as any;
    return defaultOrg;
  }

  // 1. GET ALL ORGANIZATIONS (FOR SUPER ADMIN OR SELECTOR)
  app.get("/api/v1/institution/organizations", requireAuth, (req: any, res: any) => {
    try {
      const orgs = db.prepare(`
        SELECT o.*, 
          (SELECT COUNT(*) FROM organization_users ou WHERE ou.organization_id = o.id AND ou.role = 'STUDENT') as student_count,
          (SELECT COUNT(*) FROM organization_users ou WHERE ou.organization_id = o.id AND ou.role = 'INSTRUCTOR') as instructor_count,
          (SELECT total_licenses FROM organization_licenses ol WHERE ol.organization_id = o.id LIMIT 1) as total_licenses,
          (SELECT active_licenses FROM organization_licenses ol WHERE ol.organization_id = o.id LIMIT 1) as active_licenses
        FROM organizations o
        ORDER BY o.created_at DESC
      `).all();

      res.json({ success: true, organizations: orgs });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 2. INSTITUTION DASHBOARD METRICS
  app.get("/api/v1/institution/dashboard", requireAuth, (req: any, res: any) => {
    try {
      const org = getActiveOrganization(req);
      if (!org) {
        return res.status(404).json({ success: false, error: "No se encontró organización asociada a este usuario." });
      }

      const orgId = org.id;

      // Licenses status
      const license = db.prepare("SELECT * FROM organization_licenses WHERE organization_id = ?").get(orgId) as any || {
        total_licenses: 50, active_licenses: 0, available_licenses: 50, expired_licenses: 0, plan_type: 'ANNUAL'
      };

      // Student count
      const studentCount = (db.prepare(`
        SELECT COUNT(DISTINCT user_id) as cnt FROM organization_users 
        WHERE organization_id = ? AND role = 'STUDENT' AND status = 'ACTIVE'
      `).get(orgId) as any)?.cnt || 0;

      // Instructor count
      const instructorCount = (db.prepare(`
        SELECT COUNT(DISTINCT user_id) as cnt FROM organization_users 
        WHERE organization_id = ? AND role = 'INSTRUCTOR' AND status = 'ACTIVE'
      `).get(orgId) as any)?.cnt || 0;

      // Course count
      const courseCount = (db.prepare(`
        SELECT COUNT(*) as cnt FROM organization_courses WHERE organization_id = ? AND status = 'ACTIVE'
      `).get(orgId) as any)?.cnt || 0;

      // Group count
      const groupCount = (db.prepare(`
        SELECT COUNT(*) as cnt FROM organization_groups WHERE organization_id = ?
      `).get(orgId) as any)?.cnt || 0;

      // Total certificates issued to org students
      const certCount = (db.prepare(`
        SELECT COUNT(*) as cnt FROM certificates c
        JOIN organization_users ou ON c.userId = ou.user_id
        WHERE ou.organization_id = ? AND c.status = 'VALID'
      `).get(orgId) as any)?.cnt || 0;

      // Total study hours
      const totalHoursSum = (db.prepare(`
        SELECT SUM(u.study_hours) as sum_hours FROM users u
        JOIN organization_users ou ON u.id = ou.user_id
        WHERE ou.organization_id = ?
      `).get(orgId) as any)?.sum_hours || 0;

      // Quizzes & Evaluations Passed
      const quizPassedCount = (db.prepare(`
        SELECT COUNT(*) as cnt FROM quiz_attempts qa
        JOIN organization_users ou ON qa.user_id = ou.user_id
        WHERE ou.organization_id = ? AND (qa.passed = 1 OR qa.score >= 70)
      `).get(orgId) as any)?.cnt || 0;

      // Internal Ranking / Leaderboard
      const ranking = db.prepare(`
        SELECT u.id, u.full_name, u.email, u.xp, u.level_name, u.streak_days, u.study_hours,
          (SELECT COUNT(*) FROM certificates c WHERE c.userId = u.id AND c.status = 'VALID') as cert_count,
          (SELECT g.name FROM organization_group_students ogs JOIN organization_groups g ON ogs.group_id = g.id WHERE ogs.user_id = u.id LIMIT 1) as group_name
        FROM users u
        JOIN organization_users ou ON u.id = ou.user_id
        WHERE ou.organization_id = ? AND ou.role = 'STUDENT'
        ORDER BY u.xp DESC, u.study_hours DESC
        LIMIT 10
      `).all(orgId);

      res.json({
        success: true,
        organization: org,
        licenses: {
          total: license.total_licenses || 50,
          active: studentCount,
          available: Math.max(0, (license.total_licenses || 50) - studentCount),
          expired: license.expired_licenses || 0,
          planType: license.plan_type || 'ANNUAL',
          expirationDate: license.expiration_date || new Date(Date.now() + 180 * 24 * 3600 * 1000).toISOString()
        },
        counts: {
          students: studentCount,
          instructors: instructorCount,
          courses: courseCount,
          groups: groupCount,
          certificates: certCount,
          totalHours: totalHoursSum,
          evaluationsPassed: quizPassedCount
        },
        ranking
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 3. GESTIÓN: STUDENTS (ALUMNOS)
  app.get("/api/v1/institution/students", requireAuth, (req: any, res: any) => {
    try {
      const org = getActiveOrganization(req);
      if (!org) return res.status(404).json({ success: false, error: "Organización no encontrada." });

      const students = db.prepare(`
        SELECT u.id, u.email, u.full_name, u.country, u.xp, u.level_name, u.streak_days, u.study_hours, u.created_at,
          ou.joined_at, ou.status as membership_status,
          g.id as group_id, g.name as group_name,
          (SELECT COUNT(*) FROM certificates c WHERE c.userId = u.id AND c.status = 'VALID') as cert_count,
          (SELECT AVG(score) FROM quiz_attempts qa WHERE qa.user_id = u.id) as avg_quiz_score
        FROM organization_users ou
        JOIN users u ON ou.user_id = u.id
        LEFT JOIN organization_group_students ogs ON u.id = ogs.user_id
        LEFT JOIN organization_groups g ON ogs.group_id = g.id
        WHERE ou.organization_id = ? AND ou.role = 'STUDENT'
        ORDER BY ou.joined_at DESC
      `).all(org.id);

      res.json({ success: true, students });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post("/api/v1/institution/students", requireAuth, (req: any, res: any) => {
    try {
      const org = getActiveOrganization(req);
      if (!org) return res.status(404).json({ success: false, error: "Organización no encontrada." });

      const { email, full_name, password, groupId, country } = req.body;
      if (!email || !full_name) {
        return res.status(400).json({ success: false, error: "Email y nombre completo son obligatorios." });
      }

      // Check license availability
      const license = db.prepare("SELECT * FROM organization_licenses WHERE organization_id = ?").get(org.id) as any;
      const currentActive = (db.prepare("SELECT COUNT(*) as cnt FROM organization_users WHERE organization_id = ? AND role = 'STUDENT' AND status = 'ACTIVE'").get(org.id) as any)?.cnt || 0;
      const totalAllowed = license ? license.total_licenses : 50;

      if (currentActive >= totalAllowed) {
        return res.status(400).json({
          success: false,
          error: `Límite de licencias alcanzado (${currentActive}/${totalAllowed}). Solicita una ampliación de licencias para agregar más alumnos.`
        });
      }

      const now = new Date().toISOString();
      let user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;

      if (!user) {
        const userId = `usr_${randomUUID()}`;
        const pwdHash = hashPassword(password || "student123");
        db.prepare(`
          INSERT INTO users (id, email, password_hash, role, full_name, country, workshop_name, xp, level_name, streak_days, study_hours, subscription, created_at, updated_at, is_active)
          VALUES (?, ?, ?, 'STUDENT', ?, ?, ?, 0, 'Técnico Inicial', 1, 0, 'institutional', ?, ?, 1)
        `).run(userId, email, pwdHash, full_name, country || org.country || 'Global', org.name, now, now);
        user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId) as any;
      }

      // Assign to organization_users
      db.prepare(`
        INSERT OR REPLACE INTO organization_users (id, organization_id, user_id, role, status, joined_at)
        VALUES (?, ?, ?, 'STUDENT', 'ACTIVE', ?)
      `).run(`ou_${user.id}`, org.id, user.id, now);

      // Assign to group if provided
      if (groupId) {
        db.prepare(`
          INSERT OR REPLACE INTO organization_group_students (id, group_id, user_id, assigned_at)
          VALUES (?, ?, ?, ?)
        `).run(`ogs_${user.id}_${groupId}`, groupId, user.id, now);
      }

      // Update license active count
      if (license) {
        const newActive = currentActive + 1;
        const newAvail = Math.max(0, totalAllowed - newActive);
        db.prepare(`
          UPDATE organization_licenses SET active_licenses = ?, available_licenses = ? WHERE id = ?
        `).run(newActive, newAvail, license.id);
      }

      res.status(201).json({
        success: true,
        message: "Alumno registrado e inscrito con éxito bajo la licencia institucional.",
        student: user
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 4. GESTIÓN: INSTRUCTORS (INSTRUCTORES)
  app.get("/api/v1/institution/instructors", requireAuth, (req: any, res: any) => {
    try {
      const org = getActiveOrganization(req);
      if (!org) return res.status(404).json({ success: false, error: "Organización no encontrada." });

      const instructors = db.prepare(`
        SELECT u.id, u.email, u.full_name, u.country, oi.specialty, oi.created_at,
          (SELECT COUNT(*) FROM organization_groups g WHERE g.instructor_id = u.id AND g.organization_id = ?) as groups_count
        FROM organization_users ou
        JOIN users u ON ou.user_id = u.id
        LEFT JOIN organization_instructors oi ON u.id = oi.user_id AND oi.organization_id = ?
        WHERE ou.organization_id = ? AND ou.role = 'INSTRUCTOR'
      `).all(org.id, org.id, org.id);

      res.json({ success: true, instructors });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post("/api/v1/institution/instructors", requireAuth, (req: any, res: any) => {
    try {
      const org = getActiveOrganization(req);
      if (!org) return res.status(404).json({ success: false, error: "Organización no encontrada." });

      const { email, full_name, password, specialty } = req.body;
      if (!email || !full_name) {
        return res.status(400).json({ success: false, error: "Email y nombre del instructor son obligatorios." });
      }

      const now = new Date().toISOString();
      let user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;

      if (!user) {
        const userId = `usr_${randomUUID()}`;
        const pwdHash = hashPassword(password || "instructor123");
        db.prepare(`
          INSERT INTO users (id, email, password_hash, role, full_name, country, workshop_name, xp, level_name, streak_days, study_hours, subscription, created_at, updated_at, is_active)
          VALUES (?, ?, ?, 'INSTRUCTOR', ?, ?, ?, 2500, 'Instructor Máster', 30, 120, 'institutional', ?, ?, 1)
        `).run(userId, email, pwdHash, full_name, org.country || 'Global', org.name, now, now);
        user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId) as any;
      } else {
        db.prepare("UPDATE users SET role = 'INSTRUCTOR' WHERE id = ?").run(user.id);
      }

      db.prepare(`
        INSERT OR REPLACE INTO organization_users (id, organization_id, user_id, role, status, joined_at)
        VALUES (?, ?, ?, 'INSTRUCTOR', 'ACTIVE', ?)
      `).run(`ou_${user.id}`, org.id, user.id, now);

      db.prepare(`
        INSERT OR REPLACE INTO organization_instructors (id, organization_id, user_id, specialty, assigned_groups_count, status, created_at)
        VALUES (?, ?, ?, ?, 0, 'ACTIVE', ?)
      `).run(`oi_${user.id}`, org.id, user.id, specialty || 'Diagnóstico Electrónico y Sistemas Automotrices', now);

      res.status(201).json({
        success: true,
        message: "Instructor asignado exitosamente a la institución.",
        instructor: user
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 5. GESTIÓN: COURSES ASSIGNED TO INSTITUTION
  app.get("/api/v1/institution/courses", requireAuth, (req: any, res: any) => {
    try {
      const org = getActiveOrganization(req);
      if (!org) return res.status(404).json({ success: false, error: "Organización no encontrada." });

      const courses = db.prepare(`
        SELECT c.*, oc.assigned_at,
          (SELECT COUNT(*) FROM organization_groups g WHERE g.course_id = c.id AND g.organization_id = ?) as active_groups_count
        FROM organization_courses oc
        JOIN courses c ON oc.course_id = c.id
        WHERE oc.organization_id = ? AND oc.status = 'ACTIVE'
        ORDER BY oc.assigned_at DESC
      `).all(org.id, org.id);

      res.json({ success: true, courses });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post("/api/v1/institution/courses", requireAuth, (req: any, res: any) => {
    try {
      const org = getActiveOrganization(req);
      if (!org) return res.status(404).json({ success: false, error: "Organización no encontrada." });

      const { courseId } = req.body;
      if (!courseId) {
        return res.status(400).json({ success: false, error: "Especifica el ID del curso." });
      }

      const course = db.prepare("SELECT * FROM courses WHERE id = ?").get(courseId);
      if (!course) {
        return res.status(404).json({ success: false, error: "El curso no existe en el catálogo global." });
      }

      const now = new Date().toISOString();
      db.prepare(`
        INSERT OR REPLACE INTO organization_courses (id, organization_id, course_id, assigned_at, status)
        VALUES (?, ?, ?, ?, 'ACTIVE')
      `).run(`oc_${org.id}_${courseId}`, org.id, courseId, now);

      res.json({ success: true, message: "Curso agregado al catálogo de la institución.", courseId });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 6. GESTIÓN: GROUPS (GRUPOS / SECCIONES)
  app.get("/api/v1/institution/groups", requireAuth, (req: any, res: any) => {
    try {
      const org = getActiveOrganization(req);
      if (!org) return res.status(404).json({ success: false, error: "Organización no encontrada." });

      const groups = db.prepare(`
        SELECT g.*, 
          u.full_name as instructor_name,
          c.title as course_title,
          (SELECT COUNT(*) FROM organization_group_students ogs WHERE ogs.group_id = g.id) as student_count
        FROM organization_groups g
        LEFT JOIN users u ON g.instructor_id = u.id
        LEFT JOIN courses c ON g.course_id = c.id
        WHERE g.organization_id = ?
        ORDER BY g.created_at DESC
      `).all(org.id);

      res.json({ success: true, groups });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post("/api/v1/institution/groups", requireAuth, (req: any, res: any) => {
    try {
      const org = getActiveOrganization(req);
      if (!org) return res.status(404).json({ success: false, error: "Organización no encontrada." });

      const { name, code, instructorId, courseId, period } = req.body;
      if (!name) {
        return res.status(400).json({ success: false, error: "El nombre del grupo es obligatorio." });
      }

      const groupId = `grp_${randomUUID()}`;
      const groupCode = code || `GRP-${Math.floor(1000 + Math.random() * 9000)}`;
      const now = new Date().toISOString();

      db.prepare(`
        INSERT INTO organization_groups (id, organization_id, name, code, instructor_id, course_id, period, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(groupId, org.id, name, groupCode, instructorId || null, courseId || null, period || '2026-I', now);

      res.status(201).json({
        success: true,
        message: "Grupo académico creado exitosamente.",
        group: { id: groupId, name, code: groupCode, period: period || '2026-I' }
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 7. GESTIÓN: ASSIGNMENTS (ASIGNACIONES DE TAREAS)
  app.get("/api/v1/institution/assignments", requireAuth, (req: any, res: any) => {
    try {
      const org = getActiveOrganization(req);
      if (!org) return res.status(404).json({ success: false, error: "Organización no encontrada." });

      const assignments = db.prepare(`
        SELECT a.*, g.name as group_name, c.title as course_title, u.full_name as creator_name
        FROM organization_assignments a
        JOIN organization_groups g ON a.group_id = g.id
        LEFT JOIN courses c ON a.course_id = c.id
        LEFT JOIN users u ON a.created_by = u.id
        WHERE a.organization_id = ?
        ORDER BY a.created_at DESC
      `).all(org.id);

      res.json({ success: true, assignments });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post("/api/v1/institution/assignments", requireAuth, (req: any, res: any) => {
    try {
      const org = getActiveOrganization(req);
      if (!org) return res.status(404).json({ success: false, error: "Organización no encontrada." });

      const { groupId, title, description, courseId, dueDate } = req.body;
      if (!groupId || !title) {
        return res.status(400).json({ success: false, error: "Grupo y título de asignación son obligatorios." });
      }

      const id = `asgn_${randomUUID()}`;
      const now = new Date().toISOString();

      db.prepare(`
        INSERT INTO organization_assignments (id, organization_id, group_id, title, description, course_id, due_date, created_by, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(id, org.id, groupId, title, description || '', courseId || null, dueDate || null, req.user.id, now);

      res.status(201).json({ success: true, message: "Asignación publicada para el grupo." });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 8. REPORTES INSTITUCIONALES DETALLADOS
  app.get("/api/v1/institution/reports", requireAuth, (req: any, res: any) => {
    try {
      const org = getActiveOrganization(req);
      if (!org) return res.status(404).json({ success: false, error: "Organización no encontrada." });

      const { filterType, groupId, courseId, period } = req.query;

      // Group Performance Metrics
      const groupMetrics = db.prepare(`
        SELECT g.id, g.name, g.period,
          COUNT(DISTINCT ogs.user_id) as total_students,
          COALESCE(AVG(u.xp), 0) as avg_xp,
          COALESCE(AVG(u.study_hours), 0) as avg_hours,
          (SELECT COUNT(*) FROM certificates cert JOIN organization_group_students ogs2 ON cert.userId = ogs2.user_id WHERE ogs2.group_id = g.id AND cert.status = 'VALID') as certificates_issued
        FROM organization_groups g
        LEFT JOIN organization_group_students ogs ON g.id = ogs.group_id
        LEFT JOIN users u ON ogs.user_id = u.id
        WHERE g.organization_id = ?
        GROUP BY g.id
      `).all(org.id);

      // Course Completion Metrics
      const courseMetrics = db.prepare(`
        SELECT c.id, c.title,
          (SELECT COUNT(DISTINCT user_id) FROM enrollments e WHERE e.course_id = c.id) as enrolled_students,
          (SELECT COUNT(*) FROM certificates cert WHERE cert.courseId = c.id AND cert.status = 'VALID') as certs_count
        FROM organization_courses oc
        JOIN courses c ON oc.course_id = c.id
        WHERE oc.organization_id = ?
      `).all(org.id);

      // Student Detailed Reports
      const studentMetrics = db.prepare(`
        SELECT u.id, u.full_name, u.email, u.study_hours, u.xp, u.level_name,
          g.name as group_name,
          (SELECT COUNT(*) FROM certificates cert WHERE cert.userId = u.id AND cert.status = 'VALID') as certificates_count,
          (SELECT AVG(score) FROM quiz_attempts qa WHERE qa.user_id = u.id) as avg_quiz_score
        FROM organization_users ou
        JOIN users u ON ou.user_id = u.id
        LEFT JOIN organization_group_students ogs ON u.id = ogs.user_id
        LEFT JOIN organization_groups g ON ogs.group_id = g.id
        WHERE ou.organization_id = ? AND ou.role = 'STUDENT'
      `).all(org.id);

      res.json({
        success: true,
        period: period || '2026-I',
        reports: {
          groups: groupMetrics,
          courses: courseMetrics,
          students: studentMetrics
        }
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 9. LICENCIAS INSTITUCIONALES DETALLE
  app.get("/api/v1/institution/licenses", requireAuth, (req: any, res: any) => {
    try {
      const org = getActiveOrganization(req);
      if (!org) return res.status(404).json({ success: false, error: "Organización no encontrada." });

      const license = db.prepare("SELECT * FROM organization_licenses WHERE organization_id = ?").get(org.id) as any;
      const activeCount = (db.prepare("SELECT COUNT(*) as cnt FROM organization_users WHERE organization_id = ? AND role = 'STUDENT' AND status = 'ACTIVE'").get(org.id) as any)?.cnt || 0;

      res.json({
        success: true,
        license: {
          total: license?.total_licenses || 50,
          active: activeCount,
          available: Math.max(0, (license?.total_licenses || 50) - activeCount),
          expired: license?.expired_licenses || 0,
          planType: license?.plan_type || 'ANNUAL_STANDARD',
          startDate: license?.start_date || new Date().toISOString(),
          expirationDate: license?.expiration_date || new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString(),
          status: license?.status || 'ACTIVE'
        }
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });
}
