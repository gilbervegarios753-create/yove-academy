import { db } from "../db";
import { MediaStorageService } from "../services/mediaStorageService";
import { randomUUID } from "crypto";

export function registerContentStudioRoutes(app: any) {
  // Helper to extract YouTube ID
  function extractYouTubeId(url: string): string | null {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

  // Helper for completeness calculation
  function calculateCourseCompleteness(courseId: string) {
    const course: any = db.prepare("SELECT * FROM courses WHERE id = ?").get(courseId);
    if (!course) return { score: 0, trafficLight: "RED", checks: {} };

    const modules: any[] = db.prepare("SELECT * FROM course_modules WHERE courseId = ?").all(courseId);
    let lessonsCount = 0;
    let videoLessonsCount = 0;
    let quizCount = 0;

    modules.forEach(m => {
      const lessons: any[] = db.prepare("SELECT * FROM lessons WHERE moduleId = ?").all(m.id);
      lessonsCount += lessons.length;
      lessons.forEach(l => {
        if (l.videoUrl && l.videoUrl.trim().length > 0 && l.videoStatus !== 'MUSIC' && l.videoStatus !== 'UNRELATED') {
          videoLessonsCount++;
        }
      });
    });

    const hasTitle = Boolean(course.title && course.title.trim().length > 3);
    const hasDescription = Boolean(course.description && course.description.trim().length > 10);
    const hasCategory = Boolean(course.category || course.categoryId);
    const hasModules = modules.length > 0;
    const hasLessons = lessonsCount >= 1;
    const hasVideos = videoLessonsCount >= 1;

    let totalPoints = 0;
    if (hasTitle) totalPoints += 15;
    if (hasDescription) totalPoints += 15;
    if (hasCategory) totalPoints += 10;
    if (hasModules) totalPoints += 20;
    if (hasLessons) totalPoints += 20;
    if (hasVideos) totalPoints += 20;

    let trafficLight = "RED";
    if (totalPoints >= 80) trafficLight = "GREEN";
    else if (totalPoints >= 40) trafficLight = "YELLOW";

    return {
      score: totalPoints,
      trafficLight,
      checks: {
        hasTitle,
        hasDescription,
        hasCategory,
        hasModules,
        hasLessons,
        hasVideos,
        modulesCount: modules.length,
        lessonsCount,
        videoLessonsCount
      }
    };
  }

  // Helper for audit logging
  function logAuditAction(userId: string, userName: string, action: string, entityType: string, entityId: string, details: any) {
    try {
      db.prepare(`
        INSERT INTO audit_logs (id, userId, userName, action, entityType, entityId, detailsJson, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        `audit-${randomUUID()}`,
        userId || 'usr_superadmin',
        userName || 'Super Admin',
        action,
        entityType,
        entityId,
        JSON.stringify(details || {}),
        new Date().toISOString()
      );
    } catch (e) {
      console.error("Error creating audit log:", e);
    }
  }

  // 1. Dashboard Real Statistics
  app.get("/api/v1/content-studio/stats", (req: any, res: any) => {
    try {
      const totalCourses = (db.prepare("SELECT COUNT(*) as cnt FROM courses").get() as any).cnt;
      const publishedCourses = (db.prepare("SELECT COUNT(*) as cnt FROM courses WHERE isPublished = 1").get() as any).cnt;
      const draftCourses = (db.prepare("SELECT COUNT(*) as cnt FROM courses WHERE status = 'DRAFT' OR status IS NULL").get() as any).cnt;
      const reviewCourses = (db.prepare("SELECT COUNT(*) as cnt FROM courses WHERE status = 'REVIEW'").get() as any).cnt;

      const totalModules = (db.prepare("SELECT COUNT(*) as cnt FROM course_modules").get() as any).cnt;
      const totalLessons = (db.prepare("SELECT COUNT(*) as cnt FROM lessons").get() as any).cnt;
      const totalVideos = (db.prepare("SELECT COUNT(*) as cnt FROM lessons WHERE videoUrl IS NOT NULL AND videoUrl != ''").get() as any).cnt;

      const totalMedia = (db.prepare("SELECT COUNT(*) as cnt FROM media_library").get() as any).cnt;
      const pdfsCount = (db.prepare("SELECT COUNT(*) as cnt FROM media_library WHERE fileType = 'PDF'").get() as any).cnt;
      const imagesCount = (db.prepare("SELECT COUNT(*) as cnt FROM media_library WHERE fileType = 'IMAGE'").get() as any).cnt;
      const docsCount = (db.prepare("SELECT COUNT(*) as cnt FROM media_library WHERE fileType = 'DOCUMENT'").get() as any).cnt;

      const totalSyllabi = (db.prepare("SELECT COUNT(*) as cnt FROM syllabi").get() as any).cnt;
      const totalCases = (db.prepare("SELECT COUNT(*) as cnt FROM diagnostic_cases").get() as any).cnt;
      const totalQuizzes = (db.prepare("SELECT COUNT(*) as cnt FROM quizzes").get() as any).cnt;

      res.json({
        success: true,
        stats: {
          totalCourses,
          publishedCourses,
          draftCourses,
          reviewCourses,
          totalModules,
          totalLessons,
          totalVideos,
          totalMedia,
          pdfsCount,
          imagesCount,
          docsCount,
          totalSyllabi,
          totalCases,
          totalQuizzes
        }
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 2. Course List with Filters & Validator Score
  app.get("/api/v1/content-studio/courses", (req: any, res: any) => {
    try {
      const { status, category, semester, level, search } = req.query;
      let sql = "SELECT * FROM courses WHERE 1=1";
      const params: any[] = [];

      if (status && status !== 'ALL') {
        sql += " AND (status = ? OR reviewStatus = ?)";
        params.push(status, status);
      }
      if (category && category !== 'ALL') {
        sql += " AND (category = ? OR categoryId = ?)";
        params.push(category, category);
      }
      if (semester && semester !== 'ALL') {
        sql += " AND semester = ?";
        params.push(semester);
      }
      if (level && level !== 'ALL') {
        sql += " AND level = ?";
        params.push(level);
      }
      if (search) {
        sql += " AND (title LIKE ? OR description LIKE ? OR code LIKE ?)";
        const query = `%${search}%`;
        params.push(query, query, query);
      }

      sql += " ORDER BY updatedAt DESC, createdAt DESC";
      const courses = db.prepare(sql).all(...params);

      // Attach modules count & completeness
      courses.forEach((c: any) => {
        const completeness = calculateCourseCompleteness(c.id);
        c.completenessScore = completeness.score;
        c.trafficLight = completeness.trafficLight;
        c.checks = completeness.checks;
      });

      res.json({ success: true, courses });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 3. Get Course Full Detail
  app.get("/api/v1/content-studio/courses/:id", (req: any, res: any) => {
    try {
      const course = db.prepare("SELECT * FROM courses WHERE id = ?").get(req.params.id);
      if (!course) return res.status(404).json({ error: "Curso no encontrado" });

      const modules: any[] = db.prepare("SELECT * FROM course_modules WHERE courseId = ? ORDER BY orderIndex ASC").all(req.params.id);
      modules.forEach((m: any) => {
        m.lessons = db.prepare("SELECT * FROM lessons WHERE moduleId = ? ORDER BY orderIndex ASC").all(m.id);
      });

      const completeness = calculateCourseCompleteness(req.params.id);

      res.json({
        success: true,
        course: {
          ...course,
          modules,
          completenessScore: completeness.score,
          trafficLight: completeness.trafficLight,
          checks: completeness.checks
        }
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 4. Create Course
  app.post("/api/v1/content-studio/courses", (req: any, res: any) => {
    try {
      const {
        title, code, description, shortDescription, category, semester, level,
        duration, hours, credits, instructor, prerequisites, outcomes, image, thumbnail
      } = req.body;

      if (!title) return res.status(400).json({ error: "El título del curso es obligatorio" });

      const id = `course-${randomUUID()}`;
      const now = new Date().toISOString();
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

      db.prepare(`
        INSERT INTO courses (
          id, title, slug, code, description, shortDescription, category, categoryId,
          semester, level, duration, hours, credits, instructor, prerequisites, outcomes,
          image, thumbnail, status, isPublished, completenessScore, trafficLight, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'DRAFT', 0, 0, 'RED', ?, ?)
      `).run(
        id, title, slug, code || `YOVE-${Math.floor(100 + Math.random() * 900)}`,
        description || '', shortDescription || '', category || 'mechatronics', category || 'mechatronics',
        semester || 'I', level || 'Intermedio', duration || '40 horas', hours || 40, credits || 3,
        instructor || 'Ing. Carlos Mendoza', prerequisites || '', outcomes || '',
        image || 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&q=80&w=800',
        thumbnail || 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&q=80&w=800',
        now, now
      );

      logAuditAction(req.body.userId, req.body.userName, "CREATE_COURSE", "COURSE", id, { title });

      const newCourse = db.prepare("SELECT * FROM courses WHERE id = ?").get(id);
      res.json({ success: true, course: newCourse });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 5. Update Course
  app.put("/api/v1/content-studio/courses/:id", (req: any, res: any) => {
    try {
      const courseId = req.params.id;
      const existing: any = db.prepare("SELECT * FROM courses WHERE id = ?").get(courseId);
      if (!existing) return res.status(404).json({ error: "Curso no encontrado" });

      const {
        title, code, description, shortDescription, category, semester, level,
        duration, hours, credits, instructor, prerequisites, outcomes, image, thumbnail, status
      } = req.body;

      const now = new Date().toISOString();

      db.prepare(`
        UPDATE courses SET
          title = COALESCE(?, title),
          code = COALESCE(?, code),
          description = COALESCE(?, description),
          shortDescription = COALESCE(?, shortDescription),
          category = COALESCE(?, category),
          categoryId = COALESCE(?, categoryId),
          semester = COALESCE(?, semester),
          level = COALESCE(?, level),
          duration = COALESCE(?, duration),
          hours = COALESCE(?, hours),
          credits = COALESCE(?, credits),
          instructor = COALESCE(?, instructor),
          prerequisites = COALESCE(?, prerequisites),
          outcomes = COALESCE(?, outcomes),
          image = COALESCE(?, image),
          thumbnail = COALESCE(?, thumbnail),
          status = COALESCE(?, status),
          updatedAt = ?
        WHERE id = ?
      `).run(
        title, code, description, shortDescription, category, category,
        semester, level, duration, hours, credits, instructor, prerequisites, outcomes,
        image, thumbnail, status, now, courseId
      );

      const completeness = calculateCourseCompleteness(courseId);
      db.prepare("UPDATE courses SET completenessScore = ?, trafficLight = ? WHERE id = ?").run(
        completeness.score, completeness.trafficLight, courseId
      );

      logAuditAction(req.body.userId, req.body.userName, "UPDATE_COURSE", "COURSE", courseId, { title: title || existing.title });

      const updated = db.prepare("SELECT * FROM courses WHERE id = ?").get(courseId);
      res.json({ success: true, course: updated });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 6. Duplicate Course
  app.post("/api/v1/content-studio/courses/:id/duplicate", (req: any, res: any) => {
    try {
      const sourceId = req.params.id;
      const source: any = db.prepare("SELECT * FROM courses WHERE id = ?").get(sourceId);
      if (!source) return res.status(404).json({ error: "Curso origen no encontrado" });

      const newId = `course-${randomUUID()}`;
      const now = new Date().toISOString();
      const newTitle = `${source.title} (Copia)`;

      db.prepare(`
        INSERT INTO courses (
          id, title, slug, code, description, shortDescription, category, categoryId,
          semester, level, duration, hours, credits, instructor, prerequisites, outcomes,
          image, thumbnail, status, isPublished, completenessScore, trafficLight, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'DRAFT', 0, 0, 'RED', ?, ?)
      `).run(
        newId, newTitle, `${source.slug}-copia`, `${source.code || 'YOVE'}-COPY`,
        source.description, source.shortDescription, source.category, source.categoryId,
        source.semester, source.level, source.duration, source.hours, source.credits,
        source.instructor, source.prerequisites, source.outcomes, source.image, source.thumbnail,
        now, now
      );

      // Copy modules & lessons
      const modules: any[] = db.prepare("SELECT * FROM course_modules WHERE courseId = ?").all(sourceId);
      modules.forEach(m => {
        const newModId = `mod-${randomUUID()}`;
        db.prepare(`
          INSERT INTO course_modules (id, courseId, title, description, orderIndex, durationMinutes, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(newModId, newId, m.title, m.description, m.orderIndex, m.durationMinutes, now, now);

        const lessons: any[] = db.prepare("SELECT * FROM lessons WHERE moduleId = ?").all(m.id);
        lessons.forEach(l => {
          const newLesId = `les-${randomUUID()}`;
          db.prepare(`
            INSERT INTO lessons (id, moduleId, title, slug, description, contentType, content, videoUrl, durationMinutes, orderIndex, isPublished, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)
          `).run(newLesId, newModId, l.title, l.slug, l.description, l.contentType, l.content, l.videoUrl, l.durationMinutes, l.orderIndex, now, now);
        });
      });

      logAuditAction(req.body.userId, req.body.userName, "DUPLICATE_COURSE", "COURSE", newId, { sourceId, newTitle });

      const duplicated = db.prepare("SELECT * FROM courses WHERE id = ?").get(newId);
      res.json({ success: true, course: duplicated });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 7. Publish Course (Enforce rules: Empty courses CANNOT be published)
  app.post("/api/v1/content-studio/courses/:id/publish", (req: any, res: any) => {
    try {
      const courseId = req.params.id;
      const completeness = calculateCourseCompleteness(courseId);

      if (completeness.checks.lessonsCount === 0 || completeness.checks.modulesCount === 0) {
        return res.status(400).json({
          error: "Un curso totalmente vacío o sin lecciones no se puede publicar. Agregue módulos y lecciones primero.",
          checks: completeness.checks
        });
      }

      const now = new Date().toISOString();
      db.prepare(`
        UPDATE courses SET
          isPublished = 1,
          status = 'PUBLISHED',
          reviewStatus = 'PUBLISHED',
          completenessScore = ?,
          trafficLight = ?,
          updatedAt = ?
        WHERE id = ?
      `).run(completeness.score, completeness.trafficLight, now, courseId);

      logAuditAction(req.body.userId, req.body.userName, "PUBLISH_COURSE", "COURSE", courseId, { completenessScore: completeness.score });

      const updated = db.prepare("SELECT * FROM courses WHERE id = ?").get(courseId);
      res.json({ success: true, course: updated, message: "Curso publicado con éxito en YOVE Academy" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 8. Unpublish / Archive Course
  app.post("/api/v1/content-studio/courses/:id/archive", (req: any, res: any) => {
    try {
      const courseId = req.params.id;
      const now = new Date().toISOString();

      db.prepare(`
        UPDATE courses SET
          isPublished = 0,
          status = 'ARCHIVED',
          reviewStatus = 'ARCHIVED',
          updatedAt = ?
        WHERE id = ?
      `).run(now, courseId);

      logAuditAction(req.body.userId, req.body.userName, "ARCHIVE_COURSE", "COURSE", courseId, {});

      res.json({ success: true, message: "Curso archivado correctamente" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 9. Module CRUD
  app.post("/api/v1/content-studio/modules", (req: any, res: any) => {
    try {
      const { courseId, title, description, orderIndex } = req.body;
      if (!courseId || !title) return res.status(400).json({ error: "courseId y title son obligatorios" });

      const id = `mod-${randomUUID()}`;
      const now = new Date().toISOString();

      db.prepare(`
        INSERT INTO course_modules (id, courseId, title, description, orderIndex, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(id, courseId, title, description || '', orderIndex || 0, now, now);

      logAuditAction(req.body.userId, req.body.userName, "CREATE_MODULE", "MODULE", id, { courseId, title });

      const mod = db.prepare("SELECT * FROM course_modules WHERE id = ?").get(id);
      res.json({ success: true, module: mod });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/v1/content-studio/modules/:id", (req: any, res: any) => {
    try {
      const { title, description, orderIndex } = req.body;
      const now = new Date().toISOString();

      db.prepare(`
        UPDATE course_modules SET
          title = COALESCE(?, title),
          description = COALESCE(?, description),
          orderIndex = COALESCE(?, orderIndex),
          updatedAt = ?
        WHERE id = ?
      `).run(title, description, orderIndex, now, req.params.id);

      const mod = db.prepare("SELECT * FROM course_modules WHERE id = ?").get(req.params.id);
      res.json({ success: true, module: mod });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/v1/content-studio/modules/:id", (req: any, res: any) => {
    try {
      db.prepare("DELETE FROM lessons WHERE moduleId = ?").run(req.params.id);
      db.prepare("DELETE FROM course_modules WHERE id = ?").run(req.params.id);
      res.json({ success: true, message: "Módulo eliminado" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 10. Lesson CRUD
  app.post("/api/v1/content-studio/lessons", (req: any, res: any) => {
    try {
      const { moduleId, title, contentType, content, videoUrl, durationMinutes, orderIndex } = req.body;
      if (!moduleId || !title) return res.status(400).json({ error: "moduleId y title son obligatorios" });

      const id = `les-${randomUUID()}`;
      const now = new Date().toISOString();

      db.prepare(`
        INSERT INTO lessons (id, moduleId, title, contentType, content, videoUrl, durationMinutes, orderIndex, isPublished, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
      `).run(id, moduleId, title, contentType || 'VIDEO', content || '', videoUrl || '', durationMinutes || 15, orderIndex || 0, now, now);

      logAuditAction(req.body.userId, req.body.userName, "CREATE_LESSON", "LESSON", id, { moduleId, title });

      const lesson = db.prepare("SELECT * FROM lessons WHERE id = ?").get(id);
      res.json({ success: true, lesson });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/v1/content-studio/lessons/:id", (req: any, res: any) => {
    try {
      const { title, contentType, content, videoUrl, videoStatus, durationMinutes, orderIndex, isPublished } = req.body;
      const now = new Date().toISOString();

      db.prepare(`
        UPDATE lessons SET
          title = COALESCE(?, title),
          contentType = COALESCE(?, contentType),
          content = COALESCE(?, content),
          videoUrl = COALESCE(?, videoUrl),
          videoStatus = COALESCE(?, videoStatus),
          durationMinutes = COALESCE(?, durationMinutes),
          orderIndex = COALESCE(?, orderIndex),
          isPublished = COALESCE(?, isPublished),
          updatedAt = ?
        WHERE id = ?
      `).run(title, contentType, content, videoUrl, videoStatus, durationMinutes, orderIndex, isPublished, now, req.params.id);

      const lesson = db.prepare("SELECT * FROM lessons WHERE id = ?").get(req.params.id);
      res.json({ success: true, lesson });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/v1/content-studio/lessons/:id", (req: any, res: any) => {
    try {
      db.prepare("DELETE FROM lessons WHERE id = ?").run(req.params.id);
      res.json({ success: true, message: "Lección eliminada" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 11. YouTube Video Validator Tool
  app.post("/api/v1/content-studio/videos/validate", (req: any, res: any) => {
    try {
      const { url, flags = [] } = req.body;
      if (!url) return res.status(400).json({ error: "La URL de video es requerida" });

      const videoId = extractYouTubeId(url);
      if (!videoId) {
        return res.json({
          success: false,
          status: "INVALID",
          message: "No se pudo extraer un ID de video de YouTube válido."
        });
      }

      // Check for flags
      let status = "VALID";
      if (flags.includes('MUSIC')) status = "MUSIC";
      else if (flags.includes('UNRELATED')) status = "UNRELATED";
      else if (flags.includes('PRIVATE')) status = "PRIVATE";

      res.json({
        success: true,
        videoId,
        embedUrl: `https://www.youtube.com/embed/${videoId}`,
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        status,
        message: status === 'VALID' ? 'Video educativo de YouTube verificado correctamente.' : `Atención: Video marcado como ${status}`
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 12. Media Library APIs
  app.get("/api/v1/content-studio/media", (req: any, res: any) => {
    try {
      const { fileType, search } = req.query;
      const media = MediaStorageService.listMedia({ fileType, search });
      res.json({ success: true, media });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/v1/content-studio/media/upload", async (req: any, res: any) => {
    try {
      const { name, originalName, fileType, mimeType, base64Data, externalUrl, author, sourceType, sourceName, license, notes } = req.body;

      const media = await MediaStorageService.saveMedia({
        name: name || originalName || 'Recurso Educativo',
        originalName: originalName || name || 'file.pdf',
        fileType: fileType || 'DOCUMENT',
        mimeType: mimeType || 'application/pdf',
        base64Data,
        externalUrl,
        author,
        sourceType,
        sourceName,
        license,
        notes
      });

      res.json({ success: true, media });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.delete("/api/v1/content-studio/media/:id", (req: any, res: any) => {
    try {
      MediaStorageService.deleteMedia(req.params.id);
      res.json({ success: true, message: "Recurso eliminado" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 13. Syllabi & Curriculum Bulk Import
  app.get("/api/v1/content-studio/syllabi", (req: any, res: any) => {
    try {
      const syllabi = db.prepare("SELECT * FROM syllabi ORDER BY updatedAt DESC").all();
      res.json({ success: true, syllabi });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/v1/content-studio/syllabi", (req: any, res: any) => {
    try {
      const { title, courseId, code, semester, competencies, outcomes, hours, credits, topics, bibliography } = req.body;
      const id = `syl-${randomUUID()}`;
      const now = new Date().toISOString();

      db.prepare(`
        INSERT INTO syllabi (id, courseId, code, semester, title, competencies_json, outcomes_json, hours, credits, topics_json, bibliography_json, status, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PUBLISHED', ?, ?)
      `).run(
        id, courseId || '', code || 'SYL-YOVE', semester || 'I', title,
        JSON.stringify(competencies || []), JSON.stringify(outcomes || []),
        hours || 45, credits || 3, JSON.stringify(topics || []),
        JSON.stringify(bibliography || []), now, now
      );

      res.json({ success: true, syllabus: db.prepare("SELECT * FROM syllabi WHERE id = ?").get(id) });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 14. Bulk Import Content Parser
  app.post("/api/v1/content-studio/import", (req: any, res: any) => {
    try {
      const { coursesData = [] } = req.body;
      let added = 0;
      let updated = 0;
      const now = new Date().toISOString();

      coursesData.forEach((item: any) => {
        const existing: any = db.prepare("SELECT * FROM courses WHERE code = ? OR title = ?").get(item.code || '', item.title);
        if (existing) {
          db.prepare(`
            UPDATE courses SET
              description = COALESCE(?, description),
              category = COALESCE(?, category),
              semester = COALESCE(?, semester),
              hours = COALESCE(?, hours),
              credits = COALESCE(?, credits),
              updatedAt = ?
            WHERE id = ?
          `).run(item.description, item.category, item.semester, item.hours, item.credits, now, existing.id);
          updated++;
        } else {
          const newId = `course-${randomUUID()}`;
          db.prepare(`
            INSERT INTO courses (id, title, slug, code, description, category, semester, level, hours, credits, status, isPublished, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'DRAFT', 0, ?, ?)
          `).run(
            newId, item.title, item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'), item.code || `YOVE-IMP-${Math.floor(Math.random()*1000)}`,
            item.description || '', item.category || 'mechatronics', item.semester || 'I', item.level || 'Intermedio',
            item.hours || 40, item.credits || 3, now, now
          );
          added++;
        }
      });

      res.json({ success: true, summary: { added, updated, totalProcessed: coursesData.length } });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
}
