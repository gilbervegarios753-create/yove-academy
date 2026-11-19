import { db } from "./db";
import { LEARNING_PATHS_DATA } from "../src/data/pathsData";

export function seedLearningPaths() {
  console.log("[Seed] Seeding 10 Learning Paths into SQLite database...");

  const existingCount = (db.prepare("SELECT COUNT(*) as count FROM learning_paths").get() as any)?.count || 0;
  
  // We can upsert learning paths so they are always up to date
  const insertPath = db.prepare(`
    INSERT INTO learning_paths (
      id, slug, title, badge, description, estimated_hours, target_role, level, certificate_title, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    ON CONFLICT(id) DO UPDATE SET
      slug = excluded.slug,
      title = excluded.title,
      badge = excluded.badge,
      description = excluded.description,
      estimated_hours = excluded.estimated_hours,
      target_role = excluded.target_role,
      level = excluded.level,
      certificate_title = excluded.certificate_title,
      updated_at = datetime('now')
  `);

  const deleteCourses = db.prepare("DELETE FROM learning_path_courses WHERE learning_path_id = ?");
  const insertCourse = db.prepare(`
    INSERT INTO learning_path_courses (
      id, learning_path_id, course_id, step_number, level_name, is_required, case_id, lab_id, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `);

  const deleteReqs = db.prepare("DELETE FROM learning_path_requirements WHERE learning_path_id = ?");
  const insertReq = db.prepare(`
    INSERT INTO learning_path_requirements (
      id, learning_path_id, prerequisite_path_id, required_level, min_xp, description, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
  `);

  try {
    db.exec("BEGIN TRANSACTION");
    for (const path of LEARNING_PATHS_DATA) {
      insertPath.run(
        path.id,
        path.slug || path.id,
        path.title,
        path.badge,
        path.description,
        path.estimatedHours,
        path.targetRole,
        path.level,
        path.certificateTitle || path.title,
      );

      deleteCourses.run(path.id);
      if (path.courses && path.courses.length > 0) {
        path.courses.forEach((c, idx) => {
          const lpcId = `lpc_${path.id}_${c.courseId}`;
          insertCourse.run(
            lpcId,
            path.id,
            c.courseId,
            c.order || (idx + 1),
            c.levelName || `Nivel ${c.order || idx + 1}`,
            c.required ? 1 : 0,
            c.caseId || null,
            c.labId || null
          );
        });
      }

      deleteReqs.run(path.id);
      if (path.requirements && path.requirements.length > 0) {
        path.requirements.forEach((r, idx) => {
          const lprId = `lpr_${path.id}_${idx}`;
          insertReq.run(
            lprId,
            path.id,
            r.prerequisitePathId || null,
            r.requiredLevel || null,
            r.minXp || 0,
            r.description || ''
          );
        });
      }
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    console.error("[Seed] Error in seedLearningPaths transaction:", err);
  }

  console.log(`[Seed] Successfully seeded ${LEARNING_PATHS_DATA.length} Learning Paths into database.`);
}
