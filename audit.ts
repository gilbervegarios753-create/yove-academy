import { COURSES_50_CATALOG } from './src/data/courses50Data.ts';
import { BRANDS_DATA } from './src/data/brandsData.ts';
import { DIAGNOSTIC_CASES_DATA } from './src/data/casesData.ts';
import { LABS_DATA } from './src/data/labsData.ts';
import { AUTOMOTIVE_15_SYSTEMS } from './src/data/systemsData.ts';
import { AUTOMOTIVE_CATEGORIES } from './src/data/categoriesData.ts';
import { SAMPLE_CERTIFICATES } from './src/data/gamificationData.ts';
import { INITIAL_USER_ACCOUNTS } from './src/data/monetizationData.ts';

console.log("=== METRICAS REALES ===");
console.log("Cursos:", COURSES_50_CATALOG.length);
console.log("Categorías:", AUTOMOTIVE_CATEGORIES.length);

let totalModules = 0;
let totalLessons = 0;
let totalQuizzes = 0;
let totalExams = 0;
let completeCourses = 0;

COURSES_50_CATALOG.forEach(c => {
    let hasContent = false;
    if (c.modules && c.modules.length > 0) {
        totalModules += c.modules.length;
        c.modules.forEach(m => {
            if (m.lessons && m.lessons.length > 0) {
                totalLessons += m.lessons.length;
                hasContent = true;
                m.lessons.forEach(l => {
                    if (l.title && l.title.includes('Quiz')) totalQuizzes++;
                    if (l.title && l.title.includes('Examen')) totalExams++;
                });
            }
        });
    }
    if (hasContent) completeCourses++;
});

console.log("Módulos:", totalModules);
console.log("Lecciones:", totalLessons);
console.log("Quizzes:", totalQuizzes);
console.log("Exámenes:", totalExams);
console.log("Cursos con contenido completo (al menos 1 lección):", completeCourses);
console.log("Cursos solo visuales (sin lecciones):", COURSES_50_CATALOG.length - completeCourses);

console.log("Marcas:", BRANDS_DATA.length);
let models = 0, generations = 0, engines = 0, transmissions = 0;
BRANDS_DATA.forEach((b: any) => {
    if (b.models) {
        models += b.models.length;
        b.models.forEach((m: any) => {
            if (m.generations) {
                generations += m.generations.length;
                m.generations.forEach((g: any) => {
                    if (g.engines) engines += g.engines.length;
                    if (g.transmissions) transmissions += g.transmissions.length;
                });
            }
        });
    }
});
console.log("Modelos:", models);
console.log("Motores:", engines);
console.log("Transmisiones:", transmissions);

console.log("Sistemas:", AUTOMOTIVE_15_SYSTEMS.length);
let components = 0;
let dtcs = 0;
AUTOMOTIVE_15_SYSTEMS.forEach((s: any) => {
    if (s.components || s.keyComponents) {
        const comps = s.components || s.keyComponents;
        components += comps.length;
        comps.forEach((c: any) => {
            if (c.commonDTCs) dtcs += c.commonDTCs.length;
        });
    }
});
console.log("Componentes:", components);
console.log("DTC:", dtcs);
console.log("Cases:", DIAGNOSTIC_CASES_DATA.length);
console.log("Labs:", LABS_DATA.length);
console.log("Usuarios:", INITIAL_USER_ACCOUNTS ? INITIAL_USER_ACCOUNTS.length : 0);
console.log("Certificados:", SAMPLE_CERTIFICATES ? SAMPLE_CERTIFICATES.length : 0);

