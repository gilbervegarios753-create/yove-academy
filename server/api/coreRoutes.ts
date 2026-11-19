import { db } from "../db";

export function registerCoreRoutes(app: any) {
  // Courses
  app.get("/api/v1/courses", (req: any, res: any) => {
    try {
      const courses = db.prepare("SELECT * FROM courses WHERE isPublished = 1").all();
      res.json({ success: true, courses });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/v1/courses/:id", (req: any, res: any) => {
    try {
      const course = db.prepare("SELECT * FROM courses WHERE id = ?").get(req.params.id);
      if (!course) return res.status(404).json({ error: "Not found" });
      
      const modules = db.prepare("SELECT * FROM course_modules WHERE courseId = ? ORDER BY orderIndex ASC").all(req.params.id);
      modules.forEach((m: any) => {
        m.lessons = db.prepare("SELECT * FROM lessons WHERE moduleId = ? ORDER BY orderIndex ASC").all(m.id);
      });
      
      res.json({ success: true, course: { ...course, modules } });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/v1/categories", (req: any, res: any) => {
    try {
      const categories = db.prepare("SELECT * FROM course_categories WHERE status = 'ACTIVE'").all();
      res.json({ success: true, categories });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Vehicles
  app.get("/api/v1/vehicles/brands", (req: any, res: any) => {
    try {
      const brands = db.prepare("SELECT * FROM vehicle_brands WHERE status = 'ACTIVE'").all();
      res.json({ success: true, brands });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/v1/vehicles/models", (req: any, res: any) => {
    try {
      let query = "SELECT * FROM vehicle_models WHERE status = 'ACTIVE'";
      const brandId = req.query.brandId;
      if (brandId) {
        query += " AND brandId = ?";
        const models = db.prepare(query).all(brandId);
        return res.json({ success: true, models });
      }
      const models = db.prepare(query).all();
      res.json({ success: true, models });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/v1/vehicles/generations", (req: any, res: any) => {
    try {
      let query = "SELECT * FROM vehicle_generations WHERE status = 'ACTIVE'";
      const modelId = req.query.modelId;
      if (modelId) {
        query += " AND modelId = ?";
        const generations = db.prepare(query).all(modelId);
        return res.json({ success: true, generations });
      }
      const generations = db.prepare(query).all();
      res.json({ success: true, generations });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/v1/vehicles/engines", (req: any, res: any) => {
    try {
      const modelId = req.query.modelId;
      if (modelId) {
        const engines = db.prepare(`
          SELECT e.* FROM engines e
          JOIN vehicle_model_engines vme ON e.id = vme.engineId
          WHERE vme.modelId = ? AND e.status = 'ACTIVE'
        `).all(modelId);
        return res.json({ success: true, engines });
      }
      const engines = db.prepare("SELECT * FROM engines WHERE status = 'ACTIVE'").all();
      res.json({ success: true, engines });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/v1/vehicles/transmissions", (req: any, res: any) => {
    try {
      const modelId = req.query.modelId;
      if (modelId) {
        const transmissions = db.prepare(`
          SELECT t.* FROM transmissions t
          JOIN vehicle_model_transmissions vmt ON t.id = vmt.transmissionId
          WHERE vmt.modelId = ? AND t.status = 'ACTIVE'
        `).all(modelId);
        return res.json({ success: true, transmissions });
      }
      const transmissions = db.prepare("SELECT * FROM transmissions WHERE status = 'ACTIVE'").all();
      res.json({ success: true, transmissions });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/v1/vehicles/systems", (req: any, res: any) => {
    try {
      const systems = db.prepare("SELECT * FROM vehicle_systems").all();
      res.json({ success: true, systems });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/v1/vehicles/components", (req: any, res: any) => {
    try {
      let query = "SELECT * FROM components";
      const systemId = req.query.systemId;
      if (systemId) {
        query += " WHERE systemId = ?";
        const components = db.prepare(query).all(systemId);
        return res.json({ success: true, components });
      }
      const components = db.prepare(query).all();
      res.json({ success: true, components });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/v1/vehicles/ecus", (req: any, res: any) => {
    try {
      const ecus = db.prepare("SELECT * FROM ecus").all();
      res.json({ success: true, ecus });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
  
  app.get("/api/v1/vehicles/:id", (req: any, res: any) => {
     try {
       const vehicle = db.prepare("SELECT * FROM vehicle_models WHERE id = ?").get(req.params.id);
       if (!vehicle) return res.status(404).json({ error: "Not found" });
       res.json({ success: true, vehicle });
     } catch (err: any) {
       res.status(500).json({ error: err.message });
     }
  });

  // DTCs
  app.get("/api/v1/dtcs", (req: any, res: any) => {
    try {
      const dtcs = db.prepare("SELECT * FROM dtcs").all();
      res.json({ success: true, dtcs });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/v1/dtcs/:code", (req: any, res: any) => {
    try {
      const dtc = db.prepare("SELECT * FROM dtcs WHERE code = ?").get(req.params.code.toUpperCase());
      if (!dtc) return res.status(404).json({ error: "Not found" });
      res.json({ success: true, dtc });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Cases & Labs
  app.get("/api/v1/cases", (req: any, res: any) => {
    try {
      const cases = db.prepare("SELECT * FROM diagnostic_cases").all();
      res.json({ success: true, cases });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/v1/labs", (req: any, res: any) => {
    try {
      const labs = db.prepare("SELECT * FROM labs").all();
      res.json({ success: true, labs });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
  
  // Public Stats
  app.get("/api/v1/stats/public", (req: any, res: any) => {
    try {
      const coursesCount = (db.prepare("SELECT COUNT(*) as c FROM courses WHERE isPublished = 1").get() as any).c;
      const lessonsCount = (db.prepare("SELECT COUNT(*) as c FROM lessons WHERE isPublished = 1").get() as any).c;
      const studentsCount = (db.prepare("SELECT COUNT(*) as c FROM users WHERE role = 'STUDENT'").get() as any).c;
      const brandsCount = (db.prepare("SELECT COUNT(*) as c FROM vehicle_brands WHERE status = 'ACTIVE'").get() as any).c;
      const certificatesCount = (db.prepare("SELECT COUNT(*) as c FROM certificates WHERE status = 'VALID'").get() as any).c;

      res.json({
         success: true, 
         stats: {
           coursesCount,
           lessonsCount,
           studentsCount,
           brandsCount,
           certificatesCount
         }
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
}
