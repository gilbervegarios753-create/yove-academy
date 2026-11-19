import { db } from "../../db";
import { PaymentOrderItem } from "../types";

export class EnrollmentEngine {
  public static enrollUserFromOrder(params: {
    userId: string;
    orderId: string;
    items: PaymentOrderItem[];
  }): { success: boolean; enrolledCourses: string[]; alreadyEnrolledCourses: string[] } {
    const { userId, orderId, items } = params;
    const now = new Date().toISOString();
    const enrolledCourses: string[] = [];
    const alreadyEnrolledCourses: string[] = [];

    console.log(`[EnrollmentEngine] Processing course access release for User ${userId} | Order ${orderId}`);

    for (const item of items) {
      // Determine target course IDs
      let targetCourseIds: string[] = [];

      if (item.type === 'COURSE' && item.courseId) {
        targetCourseIds.push(item.courseId);
      } else if (item.type === 'BUNDLE' || item.type === 'PROGRAM') {
        // Find all courses associated with bundle or all published courses
        const courses = db.prepare("SELECT id FROM courses WHERE isPublished = 1").all() as any[];
        targetCourseIds = courses.map(c => c.id);
      } else if (item.type === 'SUBSCRIPTION') {
        // Upgrade user subscription tier
        db.prepare("UPDATE users SET subscription = 'pro', updated_at = ? WHERE id = ?").run(now, userId);
      }

      for (const courseId of targetCourseIds) {
        // Check if user is already enrolled
        const existingEnrollment = db.prepare("SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?").get(userId, courseId);

        if (existingEnrollment) {
          // Update status to ACTIVE if it was suspended
          db.prepare("UPDATE enrollments SET status = 'ACTIVE', lastAccessedAt = ? WHERE user_id = ? AND course_id = ?").run(now, userId, courseId);
          alreadyEnrolledCourses.push(courseId);
        } else {
          // Create new enrollment
          const enrollId = `enr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
          db.prepare(`
            INSERT INTO enrollments (id, user_id, course_id, enrolledAt, status, progress_percent, lastAccessedAt)
            VALUES (?, ?, ?, ?, 'ACTIVE', 0, ?)
          `).run(enrollId, userId, courseId, now, now);

          enrolledCourses.push(courseId);
        }
      }
    }

    // Send internal in-app notification to student
    try {
      const notifId = `notif_pay_${Date.now()}`;
      db.prepare(`
        INSERT INTO notifications (id, user_id, title, message, type, read, created_at)
        VALUES (?, ?, '¡Inscripción Confirmada!', 'Tu pago ha sido procesado exitosamente. Ya tienes acceso inmediato a tus cursos.', 'payment_success', 0, ?)
      `).run(notifId, userId, now);
    } catch (err: any) {
      console.error("[EnrollmentEngine] Error creating notification:", err.message);
    }

    return {
      success: true,
      enrolledCourses,
      alreadyEnrolledCourses
    };
  }
}
