import { ALL_COURSES_DATA } from "../../src/data/coursesData";
import { MASTER_DTC_DATABASE } from "../../src/data/dtcData";
import { LABS_DATA } from "../../src/data/labsData";
import { DIAGNOSTIC_CASES_DATA } from "../../src/data/casesData";
import { BRANDS_DATA } from "../../src/data/brandsData";
import { db } from "../db";

export interface RAGResult {
  courses: Array<{ id: string; title: string; category: string; description: string }>;
  dtcs: Array<{ code: string; title: string; description: string; causes: string[] }>;
  labs: Array<{ id: string; title: string; type: string; componentName?: string; objective: string }>;
  cases: Array<{ id: string; title: string; vehicle: string; dtc?: string; symptom: string }>;
  brands: Array<{ id: string; name: string; country?: string }>;
  summaryText: string;
}

export function sanitizePromptInput(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  // 1. Cap length to 4000 chars to avoid memory overload / token spam
  let clean = input.trim().substring(0, 4000);

  // 2. Neutralize typical prompt injection patterns
  const injectionPatterns = [
    /ignore\s+(all\s+)?previous\s+instructions/gi,
    /system\s+override/gi,
    /you\s+are\s+now\s+unrestricted/gi,
    /reveal\s+(the\s+)?(api\s+key|secret|system\s+prompt)/gi,
    /forget\s+all\s+rules/gi,
    /jailbreak/gi,
    /dan\s+mode/gi
  ];

  for (const pattern of injectionPatterns) {
    clean = clean.replace(pattern, '[FILTRADO]');
  }

  return clean;
}

export function performRAGRetrieval(query: string, vehicleContext?: any): RAGResult {
  const sanitizedQuery = sanitizePromptInput(query);
  const qLower = sanitizedQuery.toLowerCase();
  const dtcCodeInQuery = query.match(/[P|C|B|U][0-3][0-9A-F]{3}/i)?.[0]?.toUpperCase() || vehicleContext?.dtc?.toUpperCase();
  const brandInQuery = vehicleContext?.brand?.toLowerCase() || '';

  // 1. Search Courses
  const matchingCourses = ALL_COURSES_DATA.filter(c => {
    const tags = (c as any).tags ? (c as any).tags.join(' ') : '';
    const text = `${c.title} ${c.description} ${c.category} ${tags}`.toLowerCase();
    return text.includes(qLower) || (dtcCodeInQuery && text.includes(dtcCodeInQuery.toLowerCase())) || (vehicleContext?.system && text.includes(vehicleContext.system.toLowerCase()));
  }).slice(0, 3).map(c => ({
    id: c.id,
    title: c.title,
    category: c.category,
    description: c.description
  }));

  // Fallback courses if none matched directly
  if (matchingCourses.length === 0) {
    ALL_COURSES_DATA.slice(0, 2).forEach(c => {
      matchingCourses.push({
        id: c.id,
        title: c.title,
        category: c.category,
        description: c.description
      });
    });
  }

  // 2. Search DTC Database
  const matchingDtcs: Array<{ code: string; title: string; description: string; causes: string[] }> = [];
  if (dtcCodeInQuery) {
    const found = MASTER_DTC_DATABASE.find(d => d.code.toUpperCase() === dtcCodeInQuery);
    if (found) {
      matchingDtcs.push({
        code: found.code,
        title: found.title,
        description: found.description,
        causes: found.possibleCauses || []
      });
    }
  }

  // Search DTC by query text if not matched by code
  if (matchingDtcs.length === 0) {
    MASTER_DTC_DATABASE.filter(d => {
      return d.title.toLowerCase().includes(qLower) || d.description.toLowerCase().includes(qLower);
    }).slice(0, 2).forEach(d => {
      matchingDtcs.push({
        code: d.code,
        title: d.title,
        description: d.description,
        causes: d.possibleCauses || []
      });
    });
  }

  // 3. Search Labs
  const matchingLabs = LABS_DATA.filter(l => {
    const text = `${l.title} ${l.componentName} ${l.objective} ${l.category}`.toLowerCase();
    return text.includes(qLower) || (dtcCodeInQuery && text.includes('dtc')) || (vehicleContext?.system && text.includes(vehicleContext.system.toLowerCase()));
  }).slice(0, 3).map(l => ({
    id: l.id,
    title: l.title,
    type: l.type,
    componentName: l.componentName,
    objective: l.objective
  }));

  if (matchingLabs.length === 0) {
    LABS_DATA.slice(0, 2).forEach(l => {
      matchingLabs.push({
        id: l.id,
        title: l.title,
        type: l.type,
        componentName: l.componentName,
        objective: l.objective
      });
    });
  }

  // 4. Search Diagnostic Cases
  const matchingCases = DIAGNOSTIC_CASES_DATA.filter(c => {
    const text = `${c.title} ${c.vehicle} ${c.symptom} ${c.dtcCode || ''}`.toLowerCase();
    return text.includes(qLower) || (dtcCodeInQuery && (c.dtcCode || '').toUpperCase().includes(dtcCodeInQuery));
  }).slice(0, 3).map(c => ({
    id: c.id,
    title: c.title,
    vehicle: c.vehicle,
    dtc: c.dtcCode,
    symptom: c.symptom
  }));

  if (matchingCases.length === 0) {
    DIAGNOSTIC_CASES_DATA.slice(0, 2).forEach(c => {
      matchingCases.push({
        id: c.id,
        title: c.title,
        vehicle: c.vehicle,
        dtc: c.dtcCode,
        symptom: c.symptom
      });
    });
  }

  // 5. Search Brands
  const matchingBrands = BRANDS_DATA.filter(b => {
    return b.name.toLowerCase().includes(brandInQuery) || b.name.toLowerCase().includes(qLower);
  }).slice(0, 2).map(b => ({
    id: b.id,
    name: b.name,
    country: b.country
  }));

  // Construct Summary Text to insert into Gemini Context
  const summaryParts: string[] = [];

  if (matchingDtcs.length > 0) {
    summaryParts.push(`• BASE DTC YOVE: [${matchingDtcs[0].code}] ${matchingDtcs[0].title}: ${matchingDtcs[0].description}. Posibles causas registradas: ${matchingDtcs[0].causes.slice(0, 3).join(', ')}.`);
  }

  if (matchingCourses.length > 0) {
    const courseTitles = matchingCourses.map(c => `"${c.title}" (ID: ${c.id})`).join(', ');
    summaryParts.push(`• CURSOS YOVE RELEVANTES: ${courseTitles}.`);
  }

  if (matchingLabs.length > 0) {
    const labTitles = matchingLabs.map(l => `"${l.title}" (ID: ${l.id}, Tipo: ${l.type})`).join(', ');
    summaryParts.push(`• LABORATORIOS VIRTUALES YOVE: ${labTitles}.`);
  }

  if (matchingCases.length > 0) {
    const caseTitles = matchingCases.map(c => `"${c.title}" (ID: ${c.id})`).join(', ');
    summaryParts.push(`• CASOS REALES RELEVANTES: ${caseTitles}.`);
  }

  const summaryText = summaryParts.length > 0 ? summaryParts.join('\n') : 'No se encontraron coincidencias explícitas en el catálogo, responder basándose en el estándar técnico mecatrónico.';

  return {
    courses: matchingCourses,
    dtcs: matchingDtcs,
    labs: matchingLabs,
    cases: matchingCases,
    brands: matchingBrands,
    summaryText
  };
}
