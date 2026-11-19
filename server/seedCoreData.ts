import { db } from "./db";
import { ALL_COURSES_DATA } from "../src/data/coursesData";
import { AUTOMOTIVE_CATEGORIES } from "../src/data/categoriesData";
import { BRANDS_DATA, VEHICLE_MODELS_DATA } from "../src/data/brandsData";
import { AUTOMOTIVE_15_SYSTEMS } from "../src/data/systemsData";
import { getLessonVideoUrl } from "../src/utils/courseMediaEnricher";
import { randomUUID } from "crypto";

export function seedCoreData() {
  console.log("[SeedCoreData] Starting migration of static data into database...");

  // 1. Categories
  const catCount = (db.prepare("SELECT COUNT(*) as count FROM course_categories").get() as any).count;
  if (catCount === 0) {
    const insertCat = db.prepare("INSERT INTO course_categories (id, name, slug, description, icon) VALUES (?, ?, ?, ?, ?)");
    AUTOMOTIVE_CATEGORIES.forEach(c => {
      insertCat.run(c.id, c.name, c.id, c.description, c.icon);
    });
    console.log(`[SeedCoreData] Seeded ${AUTOMOTIVE_CATEGORIES.length} categories.`);
  }

  // 2. Brands & Comprehensive Models
  const brandCount = (db.prepare("SELECT COUNT(*) as count FROM vehicle_brands").get() as any).count;
  if (brandCount === 0) {
    const insertBrand = db.prepare("INSERT INTO vehicle_brands (id, name, slug, country, logo) VALUES (?, ?, ?, ?, ?)");
    const insertModel = db.prepare("INSERT OR REPLACE INTO vehicle_models (id, brandId, name, slug, segment) VALUES (?, ?, ?, ?, ?)");
    const insertGeneration = db.prepare("INSERT OR IGNORE INTO vehicle_generations (id, modelId, name, code, startYear, endYear) VALUES (?, ?, ?, ?, ?, ?)");
    const insertEngine = db.prepare("INSERT OR IGNORE INTO engines (id, manufacturer, code, name, displacement, fuelType, aspiration) VALUES (?, ?, ?, ?, ?, ?, ?)");
    const insertModelEngine = db.prepare("INSERT OR IGNORE INTO vehicle_model_engines (modelId, engineId, startYear, endYear) VALUES (?, ?, ?, ?)");
    const insertTransmission = db.prepare("INSERT OR IGNORE INTO transmissions (id, manufacturer, code, name, type) VALUES (?, ?, ?, ?, ?)");
    const insertModelTransmission = db.prepare("INSERT OR IGNORE INTO vehicle_model_transmissions (modelId, transmissionId, startYear, endYear) VALUES (?, ?, ?, ?)");
    
    let modelCounter = 0;
    
    BRANDS_DATA.forEach(b => {
      insertBrand.run(b.id, b.name, b.id, b.country || null, b.logo || null);
      if (b.popularModels) {
        b.popularModels.forEach((m, idx) => {
          const modelId = `${b.id}-model-${idx}`;
          const slug = m.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          insertModel.run(modelId, b.id, m, slug, null);
          modelCounter++;
        });
      }
    });

    if (VEHICLE_MODELS_DATA) {
      VEHICLE_MODELS_DATA.forEach((model: any) => {
        insertModel.run(model.id, model.brandId, model.name, model.id, model.bodyType || 'General');
        
        const processEnginesAndTransmissions = (engines: any[], genStartYear: number, genEndYear: number) => {
          if (!engines) return;
          engines.forEach((engine: any) => {
            const engineId = engine.code;
            insertEngine.run(engineId, model.brandId, engine.code, engine.code, parseFloat(engine.displacement) || 0, engine.fuelType, engine.timingType || null);
            insertModelEngine.run(model.id, engineId, genStartYear, genEndYear);
            
            if (engine.transmissions) {
              engine.transmissions.forEach((trans: any) => {
                insertTransmission.run(trans.id, model.brandId, trans.id, trans.name, trans.type);
                insertModelTransmission.run(model.id, trans.id, genStartYear, genEndYear);
              });
            }
          });
        };

        if (model.generations && model.generations.length > 0) {
          model.generations.forEach((gen: any) => {
            const genId = gen.id || randomUUID();
            const startYear = gen.years?.[0] || model.years?.[0];
            const endYear = gen.years?.[gen.years.length - 1] || model.years?.[model.years.length - 1];
            insertGeneration.run(genId, model.id, gen.name, gen.code || null, startYear, endYear);
            processEnginesAndTransmissions(gen.engines, startYear, endYear);
          });
        } else if (model.engines) {
          const startYear = model.years?.[0];
          const endYear = model.years?.[model.years.length - 1];
          processEnginesAndTransmissions(model.engines, startYear, endYear);
        }
      });
    }
    
    console.log(`[SeedCoreData] Seeded ${BRANDS_DATA.length} brands and comprehensive model data.`);
  }

  // 3. Systems
  const sysCount = (db.prepare("SELECT COUNT(*) as count FROM vehicle_systems").get() as any).count;
  if (sysCount === 0) {
    const insertSys = db.prepare("INSERT INTO vehicle_systems (id, name, slug, description, category) VALUES (?, ?, ?, ?, ?)");
    const insertComp = db.prepare("INSERT INTO components (id, systemId, name, slug, description) VALUES (?, ?, ?, ?, ?)");
    const insertDtc = db.prepare("INSERT OR IGNORE INTO dtcs (id, code, systemId, title, description, severity, possibleCauses, diagnosticNotes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    
    let compCount = 0;
    let dtcCount = 0;

    AUTOMOTIVE_15_SYSTEMS.forEach(s => {
      insertSys.run(s.id, s.name, s.id, s.description || null, (s as any).relatedCourseCategory || null);
      
      if ((s as any).keyComponents) {
        (s as any).keyComponents.forEach((cName: string) => {
          const slug = cName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          const compId = `${s.id}-${slug}`;
          insertComp.run(compId, s.id, cName, slug, null);
          compCount++;
        });
      }
    });
    
    // Also inject DTCs from Brands if they exist
    BRANDS_DATA.forEach(b => {
      if (b.commonDtcs) {
        b.commonDtcs.forEach(d => {
          const dtcId = `dtc-${d.code}`;
          insertDtc.run(
            dtcId,
            d.code,
            null, // we don't map to a system here
            d.description || d.code,
            d.description || null,
            d.severity || 'Medium',
            d.possibleCauses ? JSON.stringify(d.possibleCauses) : null,
            d.recommendedTests ? JSON.stringify(d.recommendedTests) : null
          );
          dtcCount++;
        });
      }
    });

    console.log(`[SeedCoreData] Seeded ${AUTOMOTIVE_15_SYSTEMS.length} systems, ${compCount} components, ${dtcCount} DTCs.`);
  }

  // 4. Courses & Complete Curriculum (50 Full Courses, 65+ Modules, 230+ Lessons)
  const courseCount = (db.prepare("SELECT COUNT(*) as count FROM courses").get() as any).count;
  const lessonCount = (db.prepare("SELECT COUNT(*) as count FROM lessons").get() as any).count;

  if (courseCount === 0 || lessonCount < 100) {
    if (lessonCount < 100 && courseCount > 0) {
      console.log("[SeedCoreData] Re-seeding courses table with full 50 priority courses and video lessons...");
      db.prepare("DELETE FROM lessons").run();
      db.prepare("DELETE FROM course_modules").run();
      db.prepare("DELETE FROM courses").run();
    }

    const insertCourse = db.prepare(`
      INSERT OR REPLACE INTO courses (id, slug, title, description, shortDescription, categoryId, level, durationMinutes, thumbnail, status, isPublished, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'PUBLISHED', 1, ?, ?)
    `);
    const insertModule = db.prepare(`
      INSERT OR REPLACE INTO course_modules (id, courseId, title, description, orderIndex)
      VALUES (?, ?, ?, ?, ?)
    `);
    const insertLesson = db.prepare(`
      INSERT OR REPLACE INTO lessons (id, moduleId, title, slug, description, contentType, content, videoUrl, durationMinutes, orderIndex, isPublished)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `);

    let modCounter = 0;
    let lessCounter = 0;
    const now = new Date().toISOString();

    ALL_COURSES_DATA.forEach(c => {
      let categoryId = c.category; // string
      
      let durationNum = 0;
      if (c.duration) { 
         const match = c.duration.match(/(\d+)/);
         if (match) durationNum = parseInt(match[1]) * 60;
      }

      insertCourse.run(
        c.id, c.id, c.title, c.longDescription || c.description, c.description, categoryId, c.level || 'Intermediate',
        durationNum, (c as any).image || null, now, now
      );

      if (c.modules) {
        c.modules.forEach((m, mIdx) => {
          insertModule.run(m.id, c.id, m.title, m.description || null, mIdx);
          modCounter++;
          if (m.lessons) {
            m.lessons.forEach((l, lIdx) => {
              let cType = 'VIDEO';
              if ((l as any).type === 'reading') cType = 'TEXT';
              if (l.type === 'interactive') cType = 'INTERACTIVE';
              if (l.title && l.title.toLowerCase().includes('quiz')) cType = 'QUIZ';

              let duration = 0;
              if (l.duration) {
                const match = l.duration.match(/(\d+)/);
                if (match) duration = parseInt(match[1]);
              }

              const videoUrl = getLessonVideoUrl(l.title, c.category, l.contentUrl);

              insertLesson.run(
                l.id, m.id, l.title, l.id, null, cType,
                l.textContent || JSON.stringify((l as any).activity) || null,
                videoUrl,
                duration, lIdx
              );
              lessCounter++;
            });
          }
        });
      }
    });

    console.log(`[SeedCoreData] Seeded ${ALL_COURSES_DATA.length} complete courses, ${modCounter} modules, ${lessCounter} lessons with video URLs.`);
  }

  console.log("[SeedCoreData] Migration completed.");
}
