import { db } from "./db";
import { hashPassword } from "./auth";

export function seedInstitutionData() {
  try {
    const orgCount = (db.prepare("SELECT COUNT(*) as count FROM organizations").get() as any).count;
    if (orgCount === 0) {
      console.log("[SeedInstitutionData] Seeding initial organizations and institutional data...");

      const now = new Date().toISOString();
      const expDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

      // 1. Insert Organizations
      const insertOrg = db.prepare(`
        INSERT INTO organizations (
          id, name, code, type, logo, country, address, contact_email, contact_phone, status, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE', ?, ?)
      `);

      const orgs = [
        {
          id: 'org_itay_01',
          name: 'Instituto Técnico Automotriz YOVE (ITAY)',
          code: 'INST-ITAY-01',
          type: 'INSTITUTE',
          logo: 'https://images.unsplash.com/photo-1562774053-701939374585?w=150&auto=format&fit=crop&q=80',
          country: 'México',
          address: 'Av. Industrial Automotriz 450, Monterrey',
          contact_email: 'contacto@itay.edu.mx',
          contact_phone: '+52 81 8123 4567'
        },
        {
          id: 'org_eima_02',
          name: 'Escuela de Ingeniería Mecatrónica Automotriz (EIMA)',
          code: 'INST-EIMA-02',
          type: 'UNIVERSITY',
          logo: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=150&auto=format&fit=crop&q=80',
          country: 'Colombia',
          address: 'Calle de la Innovación 102, Bogotá',
          contact_email: 'admisiones@eima.edu.co',
          contact_phone: '+57 1 600 7890'
        },
        {
          id: 'org_cft_03',
          name: 'Centro de Formación Técnica Heavy Duty & EV',
          code: 'INST-CFT-03',
          type: 'TECHNICAL_SCHOOL',
          logo: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=150&auto=format&fit=crop&q=80',
          country: 'Chile',
          address: 'Av. Gran Avenida 8800, Santiago',
          contact_email: 'info@cftheavyduty.cl',
          contact_phone: '+56 2 2987 6543'
        },
        {
          id: 'org_workshop_04',
          name: 'Red de Talleres Máster Multimarca',
          code: 'INST-WORKSHOP-04',
          type: 'WORKSHOP',
          logo: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=150&auto=format&fit=crop&q=80',
          country: 'Perú',
          address: 'Av. Los Faisanes 320, Lima',
          contact_email: 'capacitacion@talleresmaster.pe',
          contact_phone: '+51 1 456 7890'
        }
      ];

      orgs.forEach(o => {
        insertOrg.run(
          o.id, o.name, o.code, o.type, o.logo, o.country, o.address,
          o.contact_email, o.contact_phone, now, now
        );
      });

      // 2. Insert Organization Licenses
      const insertLicense = db.prepare(`
        INSERT INTO organization_licenses (
          id, organization_id, total_licenses, active_licenses, available_licenses, expired_licenses,
          plan_type, start_date, expiration_date, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE', ?)
      `);

      const licenses = [
        { id: 'lic_itay', orgId: 'org_itay_01', total: 100, active: 85, available: 15, expired: 0, plan: 'ANNUAL_PRO' },
        { id: 'lic_eima', orgId: 'org_eima_02', total: 200, active: 160, available: 40, expired: 0, plan: 'CAMPUS_ENTERPRISE' },
        { id: 'lic_cft', orgId: 'org_cft_03', total: 50, active: 30, available: 15, expired: 5, plan: 'ANNUAL_STANDARD' },
        { id: 'lic_workshop', orgId: 'org_workshop_04', total: 25, active: 20, available: 5, expired: 0, plan: 'WORKSHOP_FLEET' }
      ];

      licenses.forEach(l => {
        insertLicense.run(l.id, l.orgId, l.total, l.active, l.available, l.expired, l.plan, now, expDate, now);
      });

      // 3. Insert Demo Institutional Users & Memberships
      const insertUser = db.prepare(`
        INSERT OR IGNORE INTO users (
          id, email, password_hash, role, full_name, country, workshop_name, xp, level_name, streak_days, study_hours, subscription, created_at, updated_at, is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'institutional', ?, ?, 1)
      `);

      const insertOrgUser = db.prepare(`
        INSERT OR IGNORE INTO organization_users (
          id, organization_id, user_id, role, status, joined_at
        ) VALUES (?, ?, ?, ?, 'ACTIVE', ?)
      `);

      const defaultPasswordHash = hashPassword("password123");

      const instUsers = [
        // ITAY Director & Admin
        {
          id: 'inst_admin_1',
          email: 'director.itay@yove.edu',
          fullName: 'Ing. Roberto Gómez - Director ITAY',
          role: 'INSTITUTION_ADMIN',
          orgId: 'org_itay_01',
          country: 'México',
          workshop: 'Instituto ITAY'
        },
        // EIMA Decano
        {
          id: 'inst_admin_2',
          email: 'decano.eima@yove.edu',
          fullName: 'Dra. Elena Ramos - Decana EIMA',
          role: 'INSTITUTION_ADMIN',
          orgId: 'org_eima_02',
          country: 'Colombia',
          workshop: 'Universidad EIMA'
        },
        // Instructors
        {
          id: 'inst_teacher_1',
          email: 'profesor.rodriguez@yove.edu',
          fullName: 'Prof. Gabriel Rodríguez',
          role: 'INSTRUCTOR',
          orgId: 'org_itay_01',
          country: 'México',
          workshop: 'Laboratorio de Diagnóstico CAN Bus'
        },
        {
          id: 'inst_teacher_2',
          email: 'profesora.morales@yove.edu',
          fullName: 'Ing. Patricia Morales',
          role: 'INSTRUCTOR',
          orgId: 'org_itay_01',
          country: 'México',
          workshop: 'Taller de Alta Tensión & EV'
        },
        // Students
        {
          id: 'inst_student_1',
          email: 'alumno.carlos@yove.edu',
          fullName: 'Carlos Manuel Mendoza',
          role: 'STUDENT',
          orgId: 'org_itay_01',
          country: 'México',
          workshop: 'ITAY - Grupo 3A'
        },
        {
          id: 'inst_student_2',
          email: 'alumna.valeria@yove.edu',
          fullName: 'Valeria Fernández',
          role: 'STUDENT',
          orgId: 'org_itay_01',
          country: 'México',
          workshop: 'ITAY - Grupo 3A'
        },
        {
          id: 'inst_student_3',
          email: 'alumno.diego@yove.edu',
          fullName: 'Diego Alejandro Torres',
          role: 'STUDENT',
          orgId: 'org_itay_01',
          country: 'México',
          workshop: 'ITAY - Grupo 4B'
        },
        {
          id: 'inst_student_4',
          email: 'alumno.sofia@yove.edu',
          fullName: 'Sofía Isabel Castro',
          role: 'STUDENT',
          orgId: 'org_itay_01',
          country: 'México',
          workshop: 'ITAY - Grupo EV-1'
        }
      ];

      instUsers.forEach(u => {
        insertUser.run(
          u.id, u.email, defaultPasswordHash, u.role, u.fullName, u.country, u.workshop,
          1250, 'Técnico Avanzado', 12, 48, now, now
        );

        insertOrgUser.run(
          `ou_${u.id}`, u.orgId, u.id, u.role, now
        );
      });

      // 4. Insert Instructors table records
      const insertInstructor = db.prepare(`
        INSERT OR IGNORE INTO organization_instructors (
          id, organization_id, user_id, specialty, assigned_groups_count, status, created_at
        ) VALUES (?, ?, ?, ?, ?, 'ACTIVE', ?)
      `);

      insertInstructor.run('oi_teacher_1', 'org_itay_01', 'inst_teacher_1', 'Sistemas Eléctricos y Diagnóstico CAN Bus', 2, now);
      insertInstructor.run('oi_teacher_2', 'org_itay_01', 'inst_teacher_2', 'Vehículos Eléctricos e Híbridos (Alta Tensión)', 1, now);

      // 5. Insert Groups (Secciones/Aulas)
      const insertGroup = db.prepare(`
        INSERT OR IGNORE INTO organization_groups (
          id, organization_id, name, code, instructor_id, course_id, period, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const groups = [
        { id: 'grp_itay_3a', orgId: 'org_itay_01', name: 'Grupo 3A - Electricidad y Mux CAN', code: 'GRP-3A-2026', instructorId: 'inst_teacher_1', courseId: 'sistemas-electricos', period: '2026-I' },
        { id: 'grp_itay_4b', orgId: 'org_itay_01', name: 'Grupo 4B - Inyección y Diagnóstico', code: 'GRP-4B-2026', instructorId: 'inst_teacher_1', courseId: 'sistemas-inyeccion', period: '2026-I' },
        { id: 'grp_itay_ev1', orgId: 'org_itay_01', name: 'Grupo EV-1 - Especialidad Alta Tensión', code: 'GRP-EV1-2026', instructorId: 'inst_teacher_2', courseId: 'vehiculos-electricos', period: '2026-I' }
      ];

      groups.forEach(g => {
        insertGroup.run(g.id, g.orgId, g.name, g.code, g.instructorId, g.courseId, g.period, now);
      });

      // 6. Assign Students to Groups
      const insertGroupStudent = db.prepare(`
        INSERT OR IGNORE INTO organization_group_students (
          id, group_id, user_id, assigned_at
        ) VALUES (?, ?, ?, ?)
      `);

      insertGroupStudent.run('ogs_1', 'grp_itay_3a', 'inst_student_1', now);
      insertGroupStudent.run('ogs_2', 'grp_itay_3a', 'inst_student_2', now);
      insertGroupStudent.run('ogs_3', 'grp_itay_4b', 'inst_student_3', now);
      insertGroupStudent.run('ogs_4', 'grp_itay_ev1', 'inst_student_4', now);

      // 7. Insert Organization Courses
      const insertOrgCourse = db.prepare(`
        INSERT OR IGNORE INTO organization_courses (
          id, organization_id, course_id, assigned_at, status
        ) VALUES (?, ?, ?, ?, 'ACTIVE')
      `);

      const orgCourses = [
        { id: 'oc_1', orgId: 'org_itay_01', courseId: 'sistemas-electricos' },
        { id: 'oc_2', orgId: 'org_itay_01', courseId: 'sistemas-inyeccion' },
        { id: 'oc_3', orgId: 'org_itay_01', courseId: 'vehiculos-electricos' },
        { id: 'oc_4', orgId: 'org_itay_01', courseId: 'osciloscopio-automotriz' }
      ];

      orgCourses.forEach(oc => {
        insertOrgCourse.run(oc.id, oc.orgId, oc.courseId, now);
      });

      // 8. Insert Assignments
      const insertAssignment = db.prepare(`
        INSERT OR IGNORE INTO organization_assignments (
          id, organization_id, group_id, title, description, course_id, due_date, created_by, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const assignments = [
        {
          id: 'asgn_1',
          orgId: 'org_itay_01',
          groupId: 'grp_itay_3a',
          title: 'Práctica de Laboratorio: Medición de Bus CAN High y Low con Osciloscopio',
          description: 'Capturar formas de onda de red CAN HS 500kbps, identificar la resistencia de terminación de 60 ohmios y adjuntar reporte de fallas.',
          courseId: 'sistemas-electricos',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          createdBy: 'inst_teacher_1'
        },
        {
          id: 'asgn_2',
          orgId: 'org_itay_01',
          groupId: 'grp_itay_ev1',
          title: 'Procedimiento de Desconexión de Servicio y Verificación de Ausencia de Tensión',
          description: 'Verificar los 5 pasos de seguridad de Alta Tensión en batería HV antes de la apertura del contactor principal.',
          courseId: 'vehiculos-electricos',
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          createdBy: 'inst_teacher_2'
        }
      ];

      assignments.forEach(a => {
        insertAssignment.run(a.id, a.orgId, a.groupId, a.title, a.description, a.courseId, a.dueDate, a.createdBy, now);
      });

      console.log(`[SeedInstitutionData] Seeded ${orgs.length} organizations, ${instUsers.length} institutional users, ${groups.length} groups, ${assignments.length} assignments.`);
    }
  } catch (err: any) {
    console.error("[SeedInstitutionData] Error seeding institution data:", err.message);
  }
}
