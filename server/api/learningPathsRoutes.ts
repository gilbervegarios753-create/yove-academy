import { Router, Request, Response } from 'express';
import { db } from '../db';
import { LEARNING_PATHS_DATA } from '../../src/data/pathsData';

const router = Router();

// Helper to calculate student's real progress on a path
function calculatePathProgress(userId: string, pathId: string) {
  // Get all courses for this path from DB or static
  const dbPath = db.prepare("SELECT * FROM learning_paths WHERE id = ? OR slug = ?").get(pathId, pathId) as any;
  if (!dbPath) return null;

  const dbCourses = db.prepare(`
    SELECT * FROM learning_path_courses 
    WHERE learning_path_id = ? 
    ORDER BY step_number ASC
  `).all(dbPath.id) as any[];

  const dbReqs = db.prepare(`
    SELECT * FROM learning_path_requirements
    WHERE learning_path_id = ?
  `).all(dbPath.id) as any[];

  // Get user's enrolled / completed courses
  let userEnrollments: any[] = [];
  let userXP = 0;

  if (userId) {
    userEnrollments = db.prepare(`
      SELECT course_id, status, completed_at 
      FROM enrollments 
      WHERE user_id = ?
    `).all(userId) as any[];

    const userObj = db.prepare("SELECT xp FROM users WHERE id = ?").get(userId) as any;
    if (userObj) {
      userXP = userObj.xp || 0;
    }
  }

  const completedCourseIds = new Set(
    userEnrollments.filter(e => e.status === 'completed' || e.status === 'COMPLETED').map(e => e.course_id)
  );
  const enrolledCourseIds = new Set(
    userEnrollments.map(e => e.course_id)
  );

  const totalCourses = dbCourses.length;
  let completedCount = 0;
  let currentCourseId: string | null = null;
  let nextCourseId: string | null = null;

  for (let i = 0; i < dbCourses.length; i++) {
    const c = dbCourses[i];
    if (completedCourseIds.has(c.course_id)) {
      completedCount++;
    } else if (!currentCourseId) {
      currentCourseId = c.course_id;
      if (i + 1 < dbCourses.length) {
        nextCourseId = dbCourses[i + 1].course_id;
      }
    }
  }

  if (!currentCourseId && dbCourses.length > 0) {
    currentCourseId = dbCourses[dbCourses.length - 1].course_id;
  }

  const progressPercent = totalCourses > 0 ? Math.round((completedCount / totalCourses) * 100) : 0;
  
  // Check requirements
  const unmetRequirements: string[] = [];
  let requirementsMet = true;

  for (const req of dbReqs) {
    if (req.min_xp > 0 && userXP < req.min_xp) {
      requirementsMet = false;
      unmetRequirements.push(`Requiere mínimo ${req.min_xp} XP (Tienes ${userXP} XP)`);
    }
    if (req.prerequisite_path_id) {
      // Check if user completed prerequisite path
      const prereqProgress = db.prepare(`
        SELECT status FROM user_learning_path_progress 
        WHERE user_id = ? AND learning_path_id = ?
      `).get(userId, req.prerequisite_path_id) as any;

      if (!prereqProgress || prereqProgress.status !== 'COMPLETED') {
        const prereqPathObj = db.prepare("SELECT title FROM learning_paths WHERE id = ?").get(req.prerequisite_path_id) as any;
        const pTitle = prereqPathObj ? prereqPathObj.title : req.prerequisite_path_id;
        requirementsMet = false;
        unmetRequirements.push(`Requiere completar la ruta previa: "${pTitle}"`);
      }
    }
  }

  const isCertificateEligible = progressPercent >= 100 && requirementsMet;

  // Get existing certificate if any
  let certificateId: string | null = null;
  if (userId) {
    const existingCert = db.prepare(`
      SELECT id FROM certificates 
      WHERE user_id = ? AND (course_id = ? OR verification_code LIKE ?)
    `).get(userId, pathId, `%${pathId}%`) as any;
    if (existingCert) {
      certificateId = existingCert.id;
    }
  }

  return {
    pathId: dbPath.id,
    pathTitle: dbPath.title,
    pathBadge: dbPath.badge,
    status: progressPercent >= 100 ? 'COMPLETED' : (progressPercent > 0 || enrolledCourseIds.size > 0 ? 'IN_PROGRESS' : 'NOT_STARTED'),
    progressPercent,
    completedCoursesCount: completedCount,
    totalCoursesCount: totalCourses,
    currentCourseId,
    nextCourseId,
    requirementsMet,
    unmetRequirements,
    isCertificateEligible,
    certificateId
  };
}

// 1. GET /api/v1/learning-paths
router.get('/', (req: Request, res: Response) => {
  try {
    const userId = (req.headers['x-user-id'] as string) || (req.query.userId as string) || '';

    const paths = db.prepare("SELECT * FROM learning_paths ORDER BY rowid ASC").all() as any[];

    // If DB is empty, use static fallback
    if (!paths || paths.length === 0) {
      return res.json({
        success: true,
        data: LEARNING_PATHS_DATA.map(p => ({
          ...p,
          progress: userId ? {
            progressPercent: 0,
            completedCoursesCount: 0,
            totalCoursesCount: p.courses.length,
            status: 'NOT_STARTED',
            requirementsMet: true,
            unmetRequirements: []
          } : null
        }))
      });
    }

    const result = paths.map(p => {
      const dbCourses = db.prepare(`
        SELECT course_id as courseId, step_number as 'order', level_name as levelName, is_required as required, case_id as caseId, lab_id as labId
        FROM learning_path_courses
        WHERE learning_path_id = ?
        ORDER BY step_number ASC
      `).all(p.id);

      const dbReqs = db.prepare(`
        SELECT prerequisite_path_id as prerequisitePathId, required_level as requiredLevel, min_xp as minXp, description
        FROM learning_path_requirements
        WHERE learning_path_id = ?
      `).all(p.id);

      const progress = userId ? calculatePathProgress(userId, p.id) : null;

      return {
        id: p.id,
        slug: p.slug,
        title: p.title,
        badge: p.badge,
        description: p.description,
        estimatedHours: p.estimated_hours,
        targetRole: p.target_role,
        level: p.level,
        certificateTitle: p.certificate_title,
        courses: dbCourses,
        requirements: dbReqs,
        progress
      };
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error("[LearningPaths API Error]:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. GET /api/v1/learning-paths/recommendations
router.get('/recommendations', (req: Request, res: Response) => {
  try {
    const userId = (req.headers['x-user-id'] as string) || (req.query.userId as string) || '';

    const allPaths = db.prepare("SELECT * FROM learning_paths").all() as any[];
    if (!allPaths || allPaths.length === 0) {
      return res.json({ success: true, data: LEARNING_PATHS_DATA.slice(0, 3) });
    }

    let userXP = 0;
    let completedCourseIds = new Set<string>();

    if (userId) {
      const userObj = db.prepare("SELECT xp FROM users WHERE id = ?").get(userId) as any;
      if (userObj) userXP = userObj.xp || 0;

      const enrollments = db.prepare("SELECT course_id, status FROM enrollments WHERE user_id = ?").all(userId) as any[];
      enrollments.forEach(e => {
        if (e.status === 'completed' || e.status === 'COMPLETED') {
          completedCourseIds.add(e.course_id);
        }
      });
    }

    // Score paths based on user XP, completed courses, and level matching
    const scoredPaths = allPaths.map(p => {
      const progress = calculatePathProgress(userId, p.id);
      let score = 50; // base score

      if (progress) {
        if (progress.status === 'IN_PROGRESS') score += 40; // prioritize paths in progress
        if (progress.status === 'COMPLETED') score -= 100; // lower score for already finished paths
        if (progress.requirementsMet) score += 20;
      }

      // Bonus score if user has completed a prerequisite course
      const dbCourses = db.prepare("SELECT course_id FROM learning_path_courses WHERE learning_path_id = ?").all(p.id) as any[];
      const matchingCourses = dbCourses.filter(c => completedCourseIds.has(c.course_id)).length;
      score += matchingCourses * 15;

      return { path: p, score, progress };
    });

    scoredPaths.sort((a, b) => b.score - a.score);

    const recommended = scoredPaths.slice(0, 3).map(sp => {
      const p = sp.path;
      return {
        id: p.id,
        slug: p.slug,
        title: p.title,
        badge: p.badge,
        description: p.description,
        estimatedHours: p.estimated_hours,
        targetRole: p.target_role,
        level: p.level,
        progress: sp.progress,
        reason: sp.progress?.status === 'IN_PROGRESS' 
          ? 'Sigue avanzando en esta ruta que tienes en curso.'
          : (userXP > 500 ? 'Apropiado para tu nivel actual de XP y experiencia.' : 'Excelente ruta recomendada para comenzar tu formación mecatrónica.')
      };
    });

    res.json({ success: true, data: recommended });
  } catch (error: any) {
    console.error("[LearningPaths Recommendations Error]:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. GET /api/v1/learning-paths/:id
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req.headers['x-user-id'] as string) || (req.query.userId as string) || '';

    const path = db.prepare("SELECT * FROM learning_paths WHERE id = ? OR slug = ?").get(id, id) as any;
    if (!path) {
      const staticPath = LEARNING_PATHS_DATA.find(p => p.id === id || p.slug === id);
      if (staticPath) {
        return res.json({ success: true, data: staticPath });
      }
      return res.status(404).json({ success: false, error: 'Learning path not found' });
    }

    const dbCourses = db.prepare(`
      SELECT course_id as courseId, step_number as 'order', level_name as levelName, is_required as required, case_id as caseId, lab_id as labId
      FROM learning_path_courses
      WHERE learning_path_id = ?
      ORDER BY step_number ASC
    `).all(path.id);

    const dbReqs = db.prepare(`
      SELECT prerequisite_path_id as prerequisitePathId, required_level as requiredLevel, min_xp as minXp, description
      FROM learning_path_requirements
      WHERE learning_path_id = ?
    `).all(path.id);

    const progress = calculatePathProgress(userId, path.id);

    res.json({
      success: true,
      data: {
        id: path.id,
        slug: path.slug,
        title: path.title,
        badge: path.badge,
        description: path.description,
        estimatedHours: path.estimated_hours,
        targetRole: path.target_role,
        level: path.level,
        certificateTitle: path.certificate_title,
        courses: dbCourses,
        requirements: dbReqs,
        progress
      }
    });
  } catch (error: any) {
    console.error("[LearningPath Detail API Error]:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. POST /api/v1/learning-paths/:id/enroll
router.get('/:id/enroll', (req: Request, res: Response) => {
  res.status(405).json({ success: false, error: 'Use POST method to enroll' });
});

router.post('/:id/enroll', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req.body.userId || req.headers['x-user-id']) as string;

    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId parameter required' });
    }

    const path = db.prepare("SELECT * FROM learning_paths WHERE id = ? OR slug = ?").get(id, id) as any;
    if (!path) {
      return res.status(404).json({ success: false, error: 'Path not found' });
    }

    // Insert user_learning_path_progress entry
    const dbCourses = db.prepare("SELECT course_id FROM learning_path_courses WHERE learning_path_id = ? ORDER BY step_number ASC").all(path.id) as any[];
    const firstCourseId = dbCourses.length > 0 ? dbCourses[0].course_id : null;

    db.prepare(`
      INSERT INTO user_learning_path_progress (
        id, user_id, learning_path_id, status, completed_courses_count, total_courses_count, progress_percent, current_course_id, updated_at
      ) VALUES (?, ?, ?, 'IN_PROGRESS', 0, ?, 0, ?, datetime('now'))
      ON CONFLICT(user_id, learning_path_id) DO UPDATE SET
        updated_at = datetime('now')
    `).run(`ulpp_${userId}_${path.id}`, userId, path.id, dbCourses.length, firstCourseId);

    // Auto-enroll user in the first course if not already enrolled
    if (firstCourseId) {
      db.prepare(`
        INSERT OR IGNORE INTO enrollments (id, user_id, course_id, status, enrolled_at)
        VALUES (?, ?, ?, 'active', datetime('now'))
      `).run(`enroll_${userId}_${firstCourseId}`, userId, firstCourseId);
    }

    const updatedProgress = calculatePathProgress(userId, path.id);

    res.json({
      success: true,
      message: `Enrolled in ${path.title}`,
      data: updatedProgress
    });
  } catch (error: any) {
    console.error("[LearningPath Enroll Error]:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. POST /api/v1/learning-paths/:id/claim-certificate
router.post('/:id/claim-certificate', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req.body.userId || req.headers['x-user-id']) as string;

    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId is required' });
    }

    const path = db.prepare("SELECT * FROM learning_paths WHERE id = ? OR slug = ?").get(id, id) as any;
    if (!path) {
      return res.status(404).json({ success: false, error: 'Path not found' });
    }

    const progress = calculatePathProgress(userId, path.id);
    if (!progress || !progress.isCertificateEligible) {
      return res.status(400).json({
        success: false,
        error: 'Requirements not fulfilled for certification.',
        unmetRequirements: progress?.unmetRequirements || ['Cursos requeridos incompletos']
      });
    }

    // Check if certificate already exists
    const existingCert = db.prepare(`
      SELECT * FROM certificates WHERE user_id = ? AND verification_code = ?
    `).get(userId, `CERT-PATH-${path.id}-${userId}`) as any;

    if (existingCert) {
      return res.json({
        success: true,
        message: 'Certificate already issued',
        certificate: existingCert
      });
    }

    // Generate new official certificate
    const certId = `cert_path_${Date.now()}`;
    const certNum = `YOVE-PATH-${Math.floor(100000 + Math.random() * 900000)}`;
    const verCode = `CERT-PATH-${path.id}-${userId}`;

    db.prepare(`
      INSERT INTO certificates (
        id, user_id, course_id, verification_code, certificateNumber, verificationCode, issued_at, issuedAt, score, hours, status
      ) VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'), 100, ?, 'valid')
    `).run(certId, userId, path.id, verCode, certNum, verCode, `${path.estimated_hours}h`);

    // Log gamification reward (e.g. +500 XP for path certificate)
    db.prepare(`
      INSERT INTO gamification_log (id, user_id, action_type, xp_earned, timestamp)
      VALUES (?, ?, 'PATH_CERTIFICATE', 500, datetime('now'))
    `).run(`game_${Date.now()}`, userId);

    db.prepare("UPDATE users SET xp = xp + 500 WHERE id = ?").run(userId);

    res.json({
      success: true,
      message: `¡Felicidades! Se ha emitido tu Certificado en ${path.title}`,
      certificate: {
        id: certId,
        certificateNumber: certNum,
        verificationCode: verCode,
        issuedAt: new Date().toISOString(),
        title: path.certificate_title || path.title,
        badge: path.badge
      }
    });
  } catch (error: any) {
    console.error("[Claim Certificate Error]:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
