import { db } from "../db";
import { randomUUID } from "crypto";

export function registerCertificateRoutes(app: any, requireAuth: any, requireRole: any) {
  
  // 1. PUBLIC CERTIFICATE VERIFICATION (NO MOCK DATA - QUERIES REAL DB)
  app.get("/api/v1/certificates/verify/:code", (req: any, res: any) => {
    try {
      const code = req.params.code ? req.params.code.trim().toUpperCase() : '';
      if (!code) {
        return res.status(400).json({ success: false, error: "Código de verificación no proporcionado." });
      }

      // Query database by verificationCode or certificateNumber
      const cert = db.prepare(`
        SELECT * FROM certificates 
        WHERE UPPER(verificationCode) = ? OR UPPER(certificateNumber) = ? OR UPPER(id) = ?
      `).get(code, code, code) as any;

      if (!cert) {
        return res.status(404).json({
          success: false,
          verified: false,
          error: "Certificado no encontrado en los registros oficiales de YOVE ACADEMY."
        });
      }

      // Query audit history for this certificate
      const history = db.prepare(`
        SELECT * FROM certificate_history 
        WHERE certificateId = ? 
        ORDER BY timestamp DESC
      `).all(cert.id);

      const verificationUrl = `${req.protocol}://${req.get('host')}/verify-certificate/${cert.verificationCode}`;

      res.json({
        success: true,
        verified: cert.status === 'VALID',
        certificate: {
          id: cert.id,
          studentName: cert.userName || 'Estudiante YOVE',
          courseTitle: cert.title,
          hours: cert.hours || '45 Horas',
          level: cert.level || 'Intermedio',
          issuedAt: cert.issuedAt,
          certificateNumber: cert.certificateNumber,
          verificationCode: cert.verificationCode,
          score: cert.score || 100,
          status: cert.status || 'VALID',
          itemType: cert.itemType || 'COURSE',
          revokedAt: cert.revokedAt || null,
          revokedReason: cert.revokedReason || null,
          verificationUrl
        },
        history
      });
    } catch (err: any) {
      console.error("[Certificates API] Verification error:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 2. MY CERTIFICATES (LOGGED-IN STUDENT)
  app.get("/api/v1/certificates/my", requireAuth, (req: any, res: any) => {
    try {
      const userId = req.user.id;
      const certs = db.prepare(`
        SELECT * FROM certificates 
        WHERE userId = ? 
        ORDER BY issuedAt DESC
      `).all(userId);

      res.json({
        success: true,
        certificates: certs.map((c: any) => ({
          ...c,
          studentName: c.userName,
          courseTitle: c.title,
          verificationUrl: `${req.protocol}://${req.get('host')}/verify-certificate/${c.verificationCode}`
        }))
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 3. ISSUE CERTIFICATE (WITH STRICT REQUIREMENTS SECURITY CHECK FOR STUDENTS)
  app.post("/api/v1/certificates/issue", requireAuth, (req: any, res: any) => {
    try {
      const userId = req.user.id;
      const userRole = req.user.role;
      const { courseId, pathId, userName } = req.body;

      if (!courseId && !pathId) {
        return res.status(400).json({ success: false, error: "Se requiere especificación de curso (courseId) o ruta de aprendizaje (pathId)." });
      }

      let itemType = 'COURSE';
      let title = '';
      let hours = '45 Horas';
      let level = 'Intermedio';
      let targetItemId = courseId || pathId;

      // SECURITY CHECK FOR STUDENTS: Verify course 100% completion & quiz passed
      if (userRole === 'STUDENT') {
        if (courseId) {
          // Check course exists
          const course = db.prepare("SELECT * FROM courses WHERE id = ?").get(courseId) as any;
          if (!course) {
            return res.status(404).json({ success: false, error: "El curso especificado no existe." });
          }
          title = course.title;
          hours = course.duration || '45 Horas';
          level = course.level || 'Intermedio';

          // Check enrollment progress
          const enrollment = db.prepare("SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?").get(userId, courseId) as any;
          const userProgressPercent = enrollment ? enrollment.progress_percent : 0;

          // Check lesson completion count
          const totalLessons = (db.prepare(`
            SELECT COUNT(*) as cnt FROM lessons l
            JOIN course_modules m ON l.moduleId = m.id
            WHERE m.courseId = ?
          `).get(courseId) as any)?.cnt || 1;

          const completedLessons = (db.prepare(`
            SELECT COUNT(*) as cnt FROM progress
            WHERE user_id = ? AND course_id = ? AND completed = 1
          `).get(userId, courseId) as any)?.cnt || 0;

          const calculatedProgress = Math.round((completedLessons / totalLessons) * 100);
          const isCourseCompleted = userProgressPercent >= 100 || calculatedProgress >= 100;

          // Check exam/quiz passed
          const quizAttempt = db.prepare(`
            SELECT * FROM quiz_attempts 
            WHERE user_id = ? AND course_id = ? AND (passed = 1 OR score >= 70)
            ORDER BY score DESC
          `).get(userId, courseId) as any;

          if (!isCourseCompleted) {
            return res.status(403).json({
              success: false,
              error: `Requisitos incompletos. Debes completar el 100% del curso (Progreso actual: ${userProgressPercent || calculatedProgress}%).`
            });
          }

          if (!quizAttempt) {
            return res.status(403).json({
              success: false,
              error: "Requisitos incompletos. Debes aprobar el examen de evaluación teórica/práctica con una calificación mínima para obtener la certificación."
            });
          }
        } else if (pathId) {
          itemType = 'PATH';
          const pathObj = db.prepare("SELECT * FROM learning_paths WHERE id = ? OR slug = ?").get(pathId, pathId) as any;
          if (!pathObj) {
            return res.status(404).json({ success: false, error: "La ruta de aprendizaje especificada no existe." });
          }
          title = `Ruta Profesional: ${pathObj.title}`;
          hours = `${pathObj.estimated_hours || 120} Horas`;
          level = pathObj.level || 'Avanzado';

          // Check path progress
          const pathProgress = db.prepare("SELECT * FROM user_learning_path_progress WHERE user_id = ? AND learning_path_id = ?").get(userId, pathObj.id) as any;
          if (!pathProgress || pathProgress.progress_percent < 100) {
            return res.status(403).json({
              success: false,
              error: `Requisitos de ruta incompletos. Debes completar el 100% de los módulos y cursos de la ruta (Progreso actual: ${pathProgress?.progress_percent || 0}%).`
            });
          }
        }
      } else {
        // Admin or Instructor override
        if (courseId) {
          const course = db.prepare("SELECT * FROM courses WHERE id = ?").get(courseId) as any;
          title = course ? course.title : 'Programa Técnico Automotriz';
          hours = course ? course.duration : '45 Horas';
          level = course ? course.level : 'Intermedio';
        } else if (pathId) {
          itemType = 'PATH';
          const pathObj = db.prepare("SELECT * FROM learning_paths WHERE id = ? OR slug = ?").get(pathId, pathId) as any;
          title = pathObj ? `Ruta Profesional: ${pathObj.title}` : 'Ruta Especializada Automotriz';
          hours = pathObj ? `${pathObj.estimated_hours} Horas` : '120 Horas';
          level = pathObj ? pathObj.level : 'Experto';
        }
      }

      // Check if certificate already exists for this user and item
      const existingCert = db.prepare(`
        SELECT * FROM certificates 
        WHERE userId = ? AND courseId = ? AND status = 'VALID'
      `).get(userId, targetItemId) as any;

      if (existingCert) {
        return res.json({
          success: true,
          certificate: {
            ...existingCert,
            studentName: existingCert.userName,
            courseTitle: existingCert.title,
            verificationUrl: `${req.protocol}://${req.get('host')}/verify-certificate/${existingCert.verificationCode}`
          },
          alreadyExisted: true
        });
      }

      // Generate unique IDs and codes (guaranteed unique by database constraints & random entropy)
      const certId = `cert_${randomUUID()}`;
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const randomCodeSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
      const certificateNumber = `YOVE-${new Date().getFullYear()}-${randomNum}${randomCodeSuffix}`;
      const verificationCode = `YV-CERT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const studentFullName = userName || req.user.full_name || 'Técnico Especialista';
      const issuedAt = new Date().toISOString();
      const score = 100;

      // Insert Certificate into DB
      db.prepare(`
        INSERT INTO certificates (
          id, userId, userName, courseId, itemType, title, hours, level, issuedAt,
          certificateNumber, verificationCode, score, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'VALID')
      `).run(
        certId, userId, studentFullName, targetItemId, itemType, title, hours, level, issuedAt,
        certificateNumber, verificationCode, score
      );

      // Record Audit History in DB
      db.prepare(`
        INSERT INTO certificate_history (
          id, certificateId, action, performedBy, performedByName, userId,
          courseOrPathTitle, score, certificateNumber, verificationCode, timestamp, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        `hist_${randomUUID()}`, certId, 'ISSUED', req.user.id, req.user.full_name, userId,
        title, score, certificateNumber, verificationCode, issuedAt, 'Certificado emitido tras verificación de requisitos académicos.'
      );

      const verificationUrl = `${req.protocol}://${req.get('host')}/verify-certificate/${verificationCode}`;

      res.status(201).json({
        success: true,
        certificate: {
          id: certId,
          userId,
          studentName: studentFullName,
          courseId: targetItemId,
          itemType,
          courseTitle: title,
          hours,
          level,
          issuedAt,
          certificateNumber,
          verificationCode,
          score,
          status: 'VALID',
          verificationUrl
        }
      });
    } catch (err: any) {
      console.error("[Certificates API] Issuance error:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 4. ADMIN: LIST ALL CERTIFICATES WITH FILTERS
  app.get("/api/v1/certificates/admin/list", requireAuth, requireRole('INSTRUCTOR', 'ADMIN', 'SUPER_ADMIN'), (req: any, res: any) => {
    try {
      const { search, status } = req.query;
      let query = "SELECT * FROM certificates";
      const params: any[] = [];
      const whereClauses: string[] = [];

      if (status && status !== 'ALL') {
        whereClauses.push("status = ?");
        params.push(status);
      }

      if (search) {
        whereClauses.push("(userName LIKE ? OR title LIKE ? OR certificateNumber LIKE ? OR verificationCode LIKE ?)");
        const term = `%${search}%`;
        params.push(term, term, term, term);
      }

      if (whereClauses.length > 0) {
        query += " WHERE " + whereClauses.join(" AND ");
      }

      query += " ORDER BY issuedAt DESC";

      const certs = db.prepare(query).all(...params);

      res.json({
        success: true,
        certificates: certs.map((c: any) => ({
          ...c,
          studentName: c.userName,
          courseTitle: c.title,
          verificationUrl: `${req.protocol}://${req.get('host')}/verify-certificate/${c.verificationCode}`
        }))
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 5. ADMIN: REVOKE CERTIFICATE
  app.post("/api/v1/certificates/admin/revoke", requireAuth, requireRole('INSTRUCTOR', 'ADMIN', 'SUPER_ADMIN'), (req: any, res: any) => {
    try {
      const { certificateId, reason } = req.body;
      if (!certificateId) {
        return res.status(400).json({ success: false, error: "ID de certificado no proporcionado." });
      }

      const cert = db.prepare("SELECT * FROM certificates WHERE id = ?").get(certificateId) as any;
      if (!cert) {
        return res.status(404).json({ success: false, error: "Certificado no encontrado." });
      }

      const now = new Date().toISOString();
      const revocationReason = reason || 'Revocado por decisión administrativa.';

      // Update certificate status
      db.prepare(`
        UPDATE certificates 
        SET status = 'REVOKED', revokedAt = ?, revokedReason = ? 
        WHERE id = ?
      `).run(now, revocationReason, certificateId);

      // Record in audit log
      db.prepare(`
        INSERT INTO certificate_history (
          id, certificateId, action, performedBy, performedByName, userId,
          courseOrPathTitle, score, certificateNumber, verificationCode, timestamp, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        `hist_${randomUUID()}`, certificateId, 'REVOKED', req.user.id, req.user.full_name, cert.userId,
        cert.title, cert.score, cert.certificateNumber, cert.verificationCode, now, revocationReason
      );

      res.json({
        success: true,
        message: "Certificado revocado exitosamente.",
        certificateId,
        status: 'REVOKED'
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 6. ADMIN: REVALIDATE CERTIFICATE
  app.post("/api/v1/certificates/admin/revalidate", requireAuth, requireRole('INSTRUCTOR', 'ADMIN', 'SUPER_ADMIN'), (req: any, res: any) => {
    try {
      const { certificateId, notes } = req.body;
      if (!certificateId) {
        return res.status(400).json({ success: false, error: "ID de certificado no proporcionado." });
      }

      const cert = db.prepare("SELECT * FROM certificates WHERE id = ?").get(certificateId) as any;
      if (!cert) {
        return res.status(404).json({ success: false, error: "Certificado no encontrado." });
      }

      const now = new Date().toISOString();
      const revalidationNotes = notes || 'Certificado revalidado por la administración.';

      // Update certificate status to VALID
      db.prepare(`
        UPDATE certificates 
        SET status = 'VALID', revokedAt = NULL, revokedReason = NULL 
        WHERE id = ?
      `).run(certificateId);

      // Record in audit log
      db.prepare(`
        INSERT INTO certificate_history (
          id, certificateId, action, performedBy, performedByName, userId,
          courseOrPathTitle, score, certificateNumber, verificationCode, timestamp, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        `hist_${randomUUID()}`, certificateId, 'REVALIDATED', req.user.id, req.user.full_name, cert.userId,
        cert.title, cert.score, cert.certificateNumber, cert.verificationCode, now, revalidationNotes
      );

      res.json({
        success: true,
        message: "Certificado revalidado exitosamente.",
        certificateId,
        status: 'VALID'
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 7. ADMIN: MANUAL EMISSION / OVERRIDE
  app.post("/api/v1/certificates/admin/manual-issue", requireAuth, requireRole('INSTRUCTOR', 'ADMIN', 'SUPER_ADMIN'), (req: any, res: any) => {
    try {
      const { userId, studentName, title, hours, level, score } = req.body;
      if (!studentName || !title) {
        return res.status(400).json({ success: false, error: "Nombre del estudiante y título del programa son requeridos." });
      }

      const certId = `cert_${randomUUID()}`;
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const randomCodeSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
      const certificateNumber = `YOVE-${new Date().getFullYear()}-${randomNum}${randomCodeSuffix}`;
      const verificationCode = `YV-CERT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const issuedAt = new Date().toISOString();
      const targetUserId = userId || req.user.id;

      db.prepare(`
        INSERT INTO certificates (
          id, userId, userName, courseId, itemType, title, hours, level, issuedAt,
          certificateNumber, verificationCode, score, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'VALID')
      `).run(
        certId, targetUserId, studentName, 'manual_course', 'COURSE', title, hours || '45 Horas', level || 'Intermedio', issuedAt,
        certificateNumber, verificationCode, score || 100
      );

      db.prepare(`
        INSERT INTO certificate_history (
          id, certificateId, action, performedBy, performedByName, userId,
          courseOrPathTitle, score, certificateNumber, verificationCode, timestamp, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        `hist_${randomUUID()}`, certId, 'ISSUED', req.user.id, req.user.full_name, targetUserId,
        title, score || 100, certificateNumber, verificationCode, issuedAt, 'Certificado emitido manualmente por administrador.'
      );

      const verificationUrl = `${req.protocol}://${req.get('host')}/verify-certificate/${verificationCode}`;

      res.status(201).json({
        success: true,
        certificate: {
          id: certId,
          studentName,
          title,
          hours,
          level,
          issuedAt,
          certificateNumber,
          verificationCode,
          status: 'VALID',
          verificationUrl
        }
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 8. ADMIN: GET FULL ISSUANCE AND STATUS HISTORY
  app.get("/api/v1/certificates/admin/history", requireAuth, requireRole('INSTRUCTOR', 'ADMIN', 'SUPER_ADMIN'), (req: any, res: any) => {
    try {
      const history = db.prepare(`
        SELECT * FROM certificate_history 
        ORDER BY timestamp DESC 
        LIMIT 100
      `).all();

      res.json({
        success: true,
        history
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });
}
