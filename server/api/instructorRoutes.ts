import { db } from "../db";

export function registerInstructorRoutes(app: any) {

  // GET instructor courses
  app.get("/api/v1/instructor/courses", (req: any, res: any) => {
    try {
      const { status, instructorId } = req.query;
      let sql = "SELECT * FROM courses WHERE 1=1";
      const params: any[] = [];

      if (status && status !== 'ALL') {
        sql += " AND status = ?";
        params.push(status);
      }

      if (instructorId) {
        sql += " AND (instructorId = ? OR instructor = ?)";
        params.push(instructorId, instructorId);
      }

      sql += " ORDER BY rowid DESC";
      const courses = db.prepare(sql).all(...params) as any[];

      // Map course items with module counts
      const enriched = courses.map((c: any) => {
        let modules: any[] = [];
        try {
          modules = db.prepare("SELECT * FROM course_modules WHERE courseId = ? ORDER BY orderIndex ASC").all(c.id);
          modules.forEach((m: any) => {
            m.lessons = db.prepare("SELECT * FROM lessons WHERE moduleId = ? ORDER BY orderIndex ASC").all(m.id);
          });
        } catch (e) {
          modules = [];
        }

        let objectives: string[] = [];
        try {
          if (c.objectives_json) {
            objectives = JSON.parse(c.objectives_json);
          }
        } catch (e) {
          objectives = [];
        }

        return {
          ...c,
          objectives: objectives.length > 0 ? objectives : (c.description ? [c.description] : []),
          modules: modules,
          level: c.level || 'Intermedio',
          duration: c.duration || '6 Semanas',
          price: c.price || 299,
          status: c.status || 'PUBLISHED'
        };
      });

      res.json({ success: true, courses: enriched });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST create / update course
  app.post("/api/v1/instructor/courses", (req: any, res: any) => {
    try {
      const {
        id,
        title,
        description,
        longDescription,
        objectives,
        level,
        duration,
        category,
        categoryLabel,
        thumbnail,
        icon,
        price,
        status,
        instructor,
        instructorId,
        modules
      } = req.body;

      if (!title || !description) {
        return res.status(400).json({ error: "Título y descripción son obligatorios." });
      }

      const courseId = id || `course_custom_${Date.now()}`;
      const now = new Date().toISOString();
      const courseStatus = status || 'DRAFT';
      const isPublishedNum = (courseStatus === 'PUBLISHED') ? 1 : 0;
      const objectivesJson = JSON.stringify(objectives || []);

      const existing = db.prepare("SELECT id FROM courses WHERE id = ?").get(courseId);

      if (existing) {
        db.prepare(`
          UPDATE courses SET
            title = ?,
            description = ?,
            longDescription = ?,
            objectives_json = ?,
            level = ?,
            duration = ?,
            category = ?,
            categoryLabel = ?,
            thumbnail = ?,
            icon = ?,
            price = ?,
            status = ?,
            isPublished = ?,
            updatedAt = ?
          WHERE id = ?
        `).run(
          title,
          description,
          longDescription || description,
          objectivesJson,
          level || 'Intermedio',
          duration || '6 Semanas',
          category || 'mechanical',
          categoryLabel || 'Automotriz',
          thumbnail || '',
          icon || '📚',
          price || 0,
          courseStatus,
          isPublishedNum,
          now,
          courseId
        );
      } else {
        db.prepare(`
          INSERT INTO courses (
            id, title, description, longDescription, objectives_json, level, duration,
            category, categoryLabel, thumbnail, icon, price, status, isPublished,
            instructor, instructorId, createdAt, updatedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          courseId,
          title,
          description,
          longDescription || description,
          objectivesJson,
          level || 'Intermedio',
          duration || '6 Semanas',
          category || 'mechanical',
          categoryLabel || 'Automotriz',
          thumbnail || '',
          icon || '📚',
          price || 0,
          courseStatus,
          isPublishedNum,
          instructor || 'Ing. Docente YOVE',
          instructorId || 'inst_default',
          now,
          now
        );
      }

      // Save Modules & Lessons if provided
      if (Array.isArray(modules)) {
        // Clear old modules for this course
        db.prepare("DELETE FROM course_modules WHERE courseId = ?").run(courseId);
        
        modules.forEach((mod: any, mIdx: number) => {
          const moduleId = mod.id || `mod_${Date.now()}_${mIdx}`;
          db.prepare(`
            INSERT INTO course_modules (id, courseId, title, description, orderIndex, createdAt)
            VALUES (?, ?, ?, ?, ?, ?)
          `).run(moduleId, courseId, mod.title, mod.description || '', mIdx, now);

          if (Array.isArray(mod.lessons)) {
            db.prepare("DELETE FROM lessons WHERE moduleId = ?").run(moduleId);
            mod.lessons.forEach((les: any, lIdx: number) => {
              const lessonId = les.id || `les_${Date.now()}_${lIdx}`;
              db.prepare(`
                INSERT INTO lessons (id, moduleId, title, description, contentType, content, videoUrl, durationMinutes, orderIndex, isPublished, createdAt)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
              `).run(
                lessonId,
                moduleId,
                les.title,
                les.textContent || les.description || '',
                (les.type || 'video').toUpperCase(),
                JSON.stringify(les),
                les.contentUrl || '',
                parseInt(les.duration || '15') || 15,
                lIdx,
                now
              );
            });
          }
        });
      }

      const savedCourse = db.prepare("SELECT * FROM courses WHERE id = ?").get(courseId);
      res.json({ success: true, course: { ...savedCourse, modules: modules || [] }, message: "Curso guardado con éxito." });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // PUT update course status (DRAFT, REVIEW, PUBLISHED, ARCHIVED)
  app.put("/api/v1/instructor/courses/:id/status", (req: any, res: any) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const validStatuses = ['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED'];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Estado no válido. Opciones: DRAFT, REVIEW, PUBLISHED, ARCHIVED" });
      }

      const isPublishedNum = status === 'PUBLISHED' ? 1 : 0;
      db.prepare("UPDATE courses SET status = ?, isPublished = ?, updatedAt = datetime('now') WHERE id = ?").run(status, isPublishedNum, id);

      res.json({ success: true, message: `Estado del curso actualizado a ${status}` });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // DELETE course
  app.delete("/api/v1/instructor/courses/:id", (req: any, res: any) => {
    try {
      const { id } = req.params;
      db.prepare("DELETE FROM courses WHERE id = ?").run(id);
      res.json({ success: true, message: "Curso eliminado correctamente." });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST Create Diagnostic Case (Case Builder)
  app.post("/api/v1/instructor/cases", (req: any, res: any) => {
    try {
      const {
        id,
        title,
        vehicle,
        symptom,
        dtcCode,
        category,
        difficulty,
        pistas,
        pruebas,
        resultados,
        solucion
      } = req.body;

      if (!title || !vehicle || !symptom) {
        return res.status(400).json({ error: "Título, vehículo y síntoma son obligatorios." });
      }

      const caseId = id || `case_custom_${Date.now()}`;
      const now = new Date().toISOString();

      db.prepare(`
        INSERT INTO diagnostic_cases (
          id, title, vehicle, symptom, dtc, category, difficulty, hints_json, tests_json, results_json, solution_json, createdAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          title = excluded.title,
          vehicle = excluded.vehicle,
          symptom = excluded.symptom,
          dtc = excluded.dtc,
          category = excluded.category,
          difficulty = excluded.difficulty,
          hints_json = excluded.hints_json,
          tests_json = excluded.tests_json,
          results_json = excluded.results_json,
          solution_json = excluded.solution_json
      `).run(
        caseId,
        title,
        vehicle,
        symptom,
        dtcCode || '',
        category || 'Diagnóstico General',
        difficulty || 'Intermedio',
        JSON.stringify(pistas || []),
        JSON.stringify(pruebas || []),
        JSON.stringify(resultados || []),
        JSON.stringify(solucion || {}),
        now
      );

      res.json({ success: true, caseId, message: "Caso de diagnóstico creado con éxito." });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST Create Virtual Lab Definition (Lab Builder)
  app.post("/api/v1/instructor/labs", (req: any, res: any) => {
    try {
      const {
        id,
        title,
        objective,
        instrument,
        parameters,
        activity,
        evaluation
      } = req.body;

      if (!title || !objective || !instrument) {
        return res.status(400).json({ error: "Título, objetivo e instrumento son requeridos." });
      }

      const labId = id || `lab_custom_${Date.now()}`;
      const now = new Date().toISOString();

      db.prepare(`
        INSERT INTO labs (
          id, title, description, category, type, parameters_json, activity_json, evaluation_json, createdAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          title = excluded.title,
          description = excluded.description,
          parameters_json = excluded.parameters_json,
          activity_json = excluded.activity_json,
          evaluation_json = excluded.evaluation_json
      `).run(
        labId,
        title,
        objective,
        'Laboratorio Docente',
        instrument || 'multimeter',
        JSON.stringify(parameters || []),
        JSON.stringify(activity || {}),
        JSON.stringify(evaluation || {}),
        now
      );

      res.json({ success: true, labId, message: "Laboratorio virtual registrado con éxito." });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET enrolled students for instructor dashboard
  app.get("/api/v1/instructor/students", (req: any, res: any) => {
    try {
      const students = db.prepare(`
        SELECT id, email, full_name, country, workshop_name, xp, level_name, subscription, created_at
        FROM users
        WHERE role = 'STUDENT'
        ORDER BY xp DESC
        LIMIT 50
      `).all() as any[];

      const enrichedStudents = students.map((s: any) => {
        const completedCoursesCount = (db.prepare("SELECT COUNT(*) as cnt FROM progress WHERE user_id = ? AND completed = 1").get(s.id) as any)?.cnt || 0;
        const certsCount = (db.prepare("SELECT COUNT(*) as cnt FROM certificates WHERE user_id = ?").get(s.id) as any)?.cnt || 0;
        const quizAvg = (db.prepare("SELECT AVG(score) as avgScore FROM quiz_attempts WHERE user_id = ?").get(s.id) as any)?.avgScore || 85;

        return {
          id: s.id,
          name: s.full_name || 'Técnico Estudiante',
          email: s.email,
          country: s.country || 'Global',
          workshopName: s.workshop_name || 'Taller Particular',
          xp: s.xp,
          levelName: s.level_name,
          progress: Math.min(100, Math.round((s.xp / 1000) * 100)),
          completedCourses: completedCoursesCount,
          certificates: certsCount,
          quizScoreAvg: Math.round(quizAvg),
          status: certsCount > 0 ? 'Graduado' : 'Activo'
        };
      });

      res.json({ success: true, students: enrichedStudents });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET instructor analytics
  app.get("/api/v1/instructor/analytics", (req: any, res: any) => {
    try {
      const totalCourses = (db.prepare("SELECT COUNT(*) as cnt FROM courses").get() as any)?.cnt || 0;
      const publishedCourses = (db.prepare("SELECT COUNT(*) as cnt FROM courses WHERE isPublished = 1").get() as any)?.cnt || 0;
      const draftCourses = (db.prepare("SELECT COUNT(*) as cnt FROM courses WHERE status = 'DRAFT'").get() as any)?.cnt || 0;
      const reviewCourses = (db.prepare("SELECT COUNT(*) as cnt FROM courses WHERE status = 'REVIEW'").get() as any)?.cnt || 0;
      const totalStudents = (db.prepare("SELECT COUNT(*) as cnt FROM users WHERE role = 'STUDENT'").get() as any)?.cnt || 0;
      const totalCertificates = (db.prepare("SELECT COUNT(*) as cnt FROM certificates WHERE status = 'valid'").get() as any)?.cnt || 0;
      const avgQuizScore = (db.prepare("SELECT AVG(score) as avg FROM quiz_attempts").get() as any)?.avg || 88.5;

      res.json({
        success: true,
        metrics: {
          totalCourses,
          publishedCourses,
          draftCourses,
          reviewCourses,
          totalStudents,
          totalCertificates,
          avgQuizScore: Math.round(avgQuizScore * 10) / 10,
          satisfactionRating: 4.92,
          completionRate: 84.5,
          activeHours: 1420
        }
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

}
