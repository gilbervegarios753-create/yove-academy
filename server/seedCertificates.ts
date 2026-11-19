import { db } from "./db";

export function seedCertificates() {
  try {
    const certCount = (db.prepare("SELECT COUNT(*) as count FROM certificates").get() as any).count;
    if (certCount === 0) {
      console.log("[SeedCertificates] Seeding initial certificates into database...");
      
      const insertCert = db.prepare(`
        INSERT INTO certificates (
          id, user_id, userId, userName, course_id, courseId, itemType, title, hours, level, issued_at, issuedAt,
          certificateNumber, verification_code, verificationCode, score, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const insertHistory = db.prepare(`
        INSERT INTO certificate_history (
          id, certificateId, action, performedBy, performedByName, userId,
          courseOrPathTitle, score, certificateNumber, verificationCode, timestamp, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const sampleCerts = [
        {
          id: 'cert_8849',
          userId: 'student-7892',
          userName: 'Técnico Alejandro Silva',
          courseId: 'sistemas-electricos',
          itemType: 'COURSE',
          title: 'Sistemas Eléctricos Automotrices',
          hours: '60 Horas',
          level: 'Intermedio',
          issuedAt: '2026-01-15T10:00:00.000Z',
          certificateNumber: 'YOVE-2026-8849',
          verificationCode: 'YV-CERT-8849',
          score: 95,
          status: 'VALID'
        },
        {
          id: 'cert_9102',
          userId: 'student-9102',
          userName: 'Ing. María López',
          courseId: 'vehiculos-electricos',
          itemType: 'COURSE',
          title: 'Vehículos Eléctricos e Híbridos',
          hours: '100 Horas',
          level: 'Avanzado',
          issuedAt: '2026-02-28T14:30:00.000Z',
          certificateNumber: 'YOVE-2026-9102',
          verificationCode: 'YV-CERT-9102',
          score: 98,
          status: 'VALID'
        },
        {
          id: 'cert_7731',
          userId: 'student-7892',
          userName: 'Técnico Alejandro Silva',
          courseId: 'path-diagnosta-master',
          itemType: 'PATH',
          title: 'Ruta Profesional: Diagnosta Máster Automotriz',
          hours: '180 Horas',
          level: 'Experto',
          issuedAt: '2026-03-10T16:00:00.000Z',
          certificateNumber: 'YOVE-2026-7731',
          verificationCode: 'YV-CERT-7731',
          score: 100,
          status: 'VALID'
        }
      ];

      sampleCerts.forEach(c => {
        insertCert.run(
          c.id, c.userId, c.userId, c.userName, c.courseId, c.courseId, c.itemType, c.title,
          c.hours, c.level, c.issuedAt, c.issuedAt, c.certificateNumber, c.verificationCode, c.verificationCode,
          c.score, c.status
        );

        insertHistory.run(
          `hist_${c.id}`, c.id, 'ISSUED', 'SYSTEM', 'Sistema de Acreditación YOVE',
          c.userId, c.title, c.score, c.certificateNumber, c.verificationCode,
          c.issuedAt, 'Acreditación oficial por cumplimiento de requisitos académicos.'
        );
      });

      console.log(`[SeedCertificates] Seeded ${sampleCerts.length} initial certificates with history records.`);
    }
  } catch (err: any) {
    console.error("[SeedCertificates] Error seeding certificates:", err.message);
  }
}
