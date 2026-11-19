import { db } from "../db";
import { randomUUID } from "crypto";

export function registerCurriculumRoutes(app: any, requireAuth: any, requireRole: any) {

  // 1. Get Summary Metrics
  app.get("/api/curriculum/summary", (req: any, res: any) => {
    try {
      const totalSources = (db.prepare("SELECT COUNT(*) as count FROM curriculum_sources").get() as any)?.count || 0;
      const totalSemesters = (db.prepare("SELECT COUNT(*) as count FROM curriculum_semesters").get() as any)?.count || 0;
      const totalUnits = (db.prepare("SELECT COUNT(*) as count FROM curriculum_units").get() as any)?.count || 0;
      const totalCredits = (db.prepare("SELECT SUM(credits) as sum FROM curriculum_units").get() as any)?.sum || 0;
      const totalHours = (db.prepare("SELECT SUM(hours) as sum FROM curriculum_units").get() as any)?.sum || 0;
      const totalSyllabi = (db.prepare("SELECT COUNT(*) as count FROM curriculum_syllabi").get() as any)?.count || 0;
      const totalPublishedSyllabi = (db.prepare("SELECT COUNT(*) as count FROM curriculum_syllabi WHERE status = 'PUBLISHED'").get() as any)?.count || 0;
      const totalVerifiedVideos = (db.prepare("SELECT COUNT(*) as count FROM curriculum_videos WHERE status = 'VALID_EDUCATIONAL'").get() as any)?.count || 0;
      const totalComparisonTopics = (db.prepare("SELECT COUNT(*) as count FROM curriculum_comparison").get() as any)?.count || 0;
      const totalCompetencies = (db.prepare("SELECT COUNT(*) as count FROM curriculum_competency_matrix").get() as any)?.count || 0;

      res.json({
        success: true,
        summary: {
          totalSources,
          totalSemesters,
          totalUnits,
          totalCredits,
          totalHours,
          totalSyllabi,
          totalPublishedSyllabi,
          totalVerifiedVideos,
          totalComparisonTopics,
          totalCompetencies,
          version: '2026.1 (6 Semestres Mecatrónica Automotriz)'
        }
      });
    } catch (error: any) {
      console.error("Error fetching curriculum summary:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 2. Sources Registry
  app.get("/api/curriculum/sources", (req: any, res: any) => {
    try {
      const sources = db.prepare("SELECT * FROM curriculum_sources ORDER BY name ASC").all();
      res.json({ success: true, sources });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/curriculum/sources", (req: any, res: any) => {
    try {
      const { name, type, institution, country, language, description, url, documentPath, version, notes } = req.body;
      const id = 'src_' + randomUUID().substring(0, 8);
      const accessDate = new Date().toISOString().split('T')[0];

      db.prepare(`
        INSERT INTO curriculum_sources (
          id, name, type, institution, country, language, description, url, documentPath, version, accessDate, status, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE', ?)
      `).run(id, name, type, institution, country || 'Perú', language || 'es', description, url, documentPath, version || '2026', accessDate, notes);

      res.json({ success: true, message: "Fuente registrada exitosamente", id });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 3. Semesters & Master Curriculum
  app.get("/api/curriculum/semesters", (req: any, res: any) => {
    try {
      const semesters = db.prepare("SELECT * FROM curriculum_semesters ORDER BY semesterNumber ASC").all() as any[];
      const units = db.prepare("SELECT * FROM curriculum_units ORDER BY semesterNumber ASC, code ASC").all() as any[];

      const semestersWithUnits = semesters.map(sem => {
        const semUnits = units.filter(u => u.semesterNumber === sem.semesterNumber);
        const creditSum = semUnits.reduce((acc, curr) => acc + (curr.credits || 0), 0);
        const hourSum = semUnits.reduce((acc, curr) => acc + (curr.hours || 0), 0);
        return {
          ...sem,
          creditTotal: creditSum,
          hoursTotal: hourSum,
          units: semUnits
        };
      });

      res.json({ success: true, semesters: semestersWithUnits });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 4. Units List & Filter
  app.get("/api/curriculum/units", (req: any, res: any) => {
    try {
      const { semesterNumber, level, status, search } = req.query;
      let query = "SELECT * FROM curriculum_units WHERE 1=1";
      const params: any[] = [];

      if (semesterNumber) {
        query += " AND semesterNumber = ?";
        params.push(Number(semesterNumber));
      }
      if (level) {
        query += " AND level LIKE ?";
        params.push(`%${level}%`);
      }
      if (status) {
        query += " AND status = ?";
        params.push(status);
      }
      if (search) {
        query += " AND (name LIKE ? OR code LIKE ? OR notes LIKE ?)";
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }

      query += " ORDER BY semesterNumber ASC, code ASC";
      const units = db.prepare(query).all(...params);

      res.json({ success: true, units });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 5. Unit Detail with 27-Point Syllabus & Associated Data
  app.get("/api/curriculum/units/:id", (req: any, res: any) => {
    try {
      const { id } = req.params;
      const unit = db.prepare("SELECT * FROM curriculum_units WHERE id = ? OR code = ?").get(id, id) as any;

      if (!unit) {
        return res.status(404).json({ success: false, error: "Unidad didáctica no encontrada" });
      }

      const syllabus = db.prepare("SELECT * FROM curriculum_syllabi WHERE unitId = ?").get(unit.id) as any;
      const practicals = db.prepare("SELECT * FROM curriculum_practicals WHERE unitId = ?").all(unit.id);
      const labs = db.prepare("SELECT * FROM curriculum_labs WHERE unitId = ?").all(unit.id);
      const cases = db.prepare("SELECT * FROM curriculum_cases WHERE unitId = ?").all(unit.id);
      const videos = db.prepare("SELECT * FROM curriculum_videos WHERE unitId = ?").all(unit.id);
      const resources = db.prepare("SELECT * FROM curriculum_resources WHERE unitId = ?").all(unit.id);

      // Parse weekly distribution JSON if available
      let parsedWeekly = [];
      if (syllabus?.weeklyDistribution) {
        try {
          parsedWeekly = JSON.parse(syllabus.weeklyDistribution);
        } catch (e) {
          parsedWeekly = [];
        }
      }

      res.json({
        success: true,
        unit,
        syllabus: syllabus ? { ...syllabus, weeklyDistributionParsed: parsedWeekly } : null,
        practicals,
        labs,
        cases,
        videos,
        resources
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 6. Update or Create Syllabus
  app.post("/api/curriculum/syllabi", (req: any, res: any) => {
    try {
      const {
        unitId, generalCompetency, specificCompetency, learningOutcomes, capabilities,
        prerequisites, weeklyDistribution, theoreticalActivities, practicalActivities,
        labActivities, resources, learningEvidences, evaluationMethod, evaluationInstruments,
        bibliography, multimediaResources, practicalCases, safetyRules, integratingProject, status
      } = req.body;

      if (!unitId) {
        return res.status(400).json({ success: false, error: "unitId es requerido" });
      }

      const existing = db.prepare("SELECT id FROM curriculum_syllabi WHERE unitId = ?").get(unitId) as any;

      const stringifiedWeekly = typeof weeklyDistribution === 'string'
        ? weeklyDistribution
        : JSON.stringify(weeklyDistribution || []);

      if (existing) {
        db.prepare(`
          UPDATE curriculum_syllabi SET
            generalCompetency = ?, specificCompetency = ?, learningOutcomes = ?, capabilities = ?,
            prerequisites = ?, weeklyDistribution = ?, theoreticalActivities = ?, practicalActivities = ?,
            labActivities = ?, resources = ?, learningEvidences = ?, evaluationMethod = ?,
            evaluationInstruments = ?, bibliography = ?, multimediaResources = ?, practicalCases = ?,
            safetyRules = ?, integratingProject = ?, status = ?, updatedAt = ?
          WHERE unitId = ?
        `).run(
          generalCompetency, specificCompetency, learningOutcomes, capabilities,
          prerequisites, stringifiedWeekly, theoreticalActivities, practicalActivities,
          labActivities, resources, learningEvidences, evaluationMethod,
          evaluationInstruments, bibliography, multimediaResources, practicalCases,
          safetyRules, integratingProject, status || 'PUBLISHED', new Date().toISOString(), unitId
        );
      } else {
        const id = 'SYLL-' + randomUUID().substring(0, 8);
        db.prepare(`
          INSERT INTO curriculum_syllabi (
            id, unitId, generalCompetency, specificCompetency, learningOutcomes, capabilities,
            prerequisites, weeklyDistribution, theoreticalActivities, practicalActivities,
            labActivities, resources, learningEvidences, evaluationMethod, evaluationInstruments,
            bibliography, multimediaResources, practicalCases, safetyRules, integratingProject,
            weeklyStatus, status, updatedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'COMPLETED', ?, ?)
        `).run(
          id, unitId, generalCompetency, specificCompetency, learningOutcomes, capabilities,
          prerequisites, stringifiedWeekly, theoreticalActivities, practicalActivities,
          labActivities, resources, learningEvidences, evaluationMethod, evaluationInstruments,
          bibliography, multimediaResources, practicalCases, safetyRules, integratingProject,
          status || 'PUBLISHED', new Date().toISOString()
        );
      }

      // Update unit status to SYLLABUS_DEFINED or PUBLISHED
      db.prepare("UPDATE curriculum_units SET status = ? WHERE id = ?").run(status || 'PUBLISHED', unitId);

      res.json({ success: true, message: "Sílabo actualizado correctamente" });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 7. Curricular Comparison Matrix
  app.get("/api/curriculum/comparison", (req: any, res: any) => {
    try {
      const matrix = db.prepare("SELECT * FROM curriculum_comparison ORDER BY topicName ASC").all();
      res.json({ success: true, comparison: matrix });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 8. Research Videos & Resources Engine
  app.get("/api/curriculum/videos", (req: any, res: any) => {
    try {
      const { unitId, status, category, search } = req.query;
      let query = "SELECT * FROM curriculum_videos WHERE 1=1";
      const params: any[] = [];

      if (unitId) {
        query += " AND unitId = ?";
        params.push(unitId);
      }
      if (status) {
        query += " AND status = ?";
        params.push(status);
      }
      if (category) {
        query += " AND category LIKE ?";
        params.push(`%${category}%`);
      }
      if (search) {
        query += " AND (title LIKE ? OR channel LIKE ? OR topic LIKE ?)";
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }

      query += " ORDER BY title ASC";
      const videos = db.prepare(query).all(...params);

      res.json({ success: true, videos });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/curriculum/videos", (req: any, res: any) => {
    try {
      const { unitId, title, channel, url, duration, category, level, topic, quality, source, status } = req.body;
      const id = 'vid_' + randomUUID().substring(0, 8);
      const dateChecked = new Date().toISOString().split('T')[0];

      db.prepare(`
        INSERT INTO curriculum_videos (
          id, unitId, title, channel, url, platform, language, duration, category, level, topic, quality, source, dateChecked, status
        ) VALUES (?, ?, ?, ?, ?, 'YouTube', 'es', ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(id, unitId, title, channel, url, duration || '15:00', category || 'General', level || 'NIVEL 1', topic || 'General', quality || '1080p HD', source || 'YouTube Educational', dateChecked, status || 'VALID_EDUCATIONAL');

      res.json({ success: true, message: "Video de investigación registrado exitosamente", id });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 9. Competency Coverage Matrix
  app.get("/api/curriculum/competencies", (req: any, res: any) => {
    try {
      const competencies = db.prepare("SELECT * FROM curriculum_competency_matrix ORDER BY competencyName ASC").all();
      res.json({ success: true, competencies });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
}
