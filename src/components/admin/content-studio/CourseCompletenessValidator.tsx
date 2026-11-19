import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, ShieldAlert, BookOpen, Video, FileText, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export interface ValidationRule {
  id: string;
  label: string;
  description: string;
  passed: boolean;
  weight: number; // percentage weight towards 100%
  category: 'STRUCTURE' | 'CONTENT' | 'VIDEO' | 'METADATA';
}

export interface CourseCompletenessResult {
  score: number;
  status: 'GREEN' | 'YELLOW' | 'RED';
  label: 'Completo' | 'Incompleto' | 'Vacío';
  canPublish: boolean;
  rules: ValidationRule[];
  modulesCount: number;
  lessonsCount: number;
  videosCount: number;
  totalTextLength: number;
}

interface CourseCompletenessValidatorProps {
  course: any;
  onPublish?: () => void;
  onEditStructure?: () => void;
  compact?: boolean;
}

export const evaluateCourseCompleteness = (course: any): CourseCompletenessResult => {
  if (!course) {
    return {
      score: 0,
      status: 'RED',
      label: 'Vacío',
      canPublish: false,
      rules: [],
      modulesCount: 0,
      lessonsCount: 0,
      videosCount: 0,
      totalTextLength: 0,
    };
  }

  const modules = course.modules || [];
  const modulesCount = modules.length;

  let lessonsCount = 0;
  let videosCount = 0;
  let totalTextLength = 0;
  let validVideosCount = 0;

  modules.forEach((mod: any) => {
    const lessons = mod.lessons || [];
    lessonsCount += lessons.length;

    lessons.forEach((les: any) => {
      const content = les.content || '';
      totalTextLength += content.trim().length;

      if (les.videoUrl && les.videoUrl.trim().length > 0) {
        videosCount++;
        if (les.videoStatus === 'VALID' || !les.videoStatus) {
          validVideosCount++;
        }
      }
    });
  });

  const rules: ValidationRule[] = [
    {
      id: 'METADATA',
      label: 'Información Básica & Código',
      description: 'Título, código oficial y descripción del curso asignados.',
      passed: Boolean(course.title && course.code && course.description && course.description.trim().length > 10),
      weight: 15,
      category: 'METADATA'
    },
    {
      id: 'HAS_MODULES',
      label: 'Estructura con Módulos',
      description: 'El curso debe tener al menos 1 módulo temático registrado.',
      passed: modulesCount >= 1,
      weight: 20,
      category: 'STRUCTURE'
    },
    {
      id: 'HAS_LESSONS',
      label: 'Contenido en Lecciones',
      description: 'Contar con al menos 2 lecciones en la malla del curso.',
      passed: lessonsCount >= 2,
      weight: 25,
      category: 'STRUCTURE'
    },
    {
      id: 'TEACHING_TEXT',
      label: 'Teoría & Texto Académico',
      description: 'Lecciones con teoría redactada (>150 caracteres acumulados).',
      passed: totalTextLength >= 150,
      weight: 20,
      category: 'CONTENT'
    },
    {
      id: 'VIDEO_COVERAGE',
      label: 'Videos Educativos Válidos',
      description: 'Al menos el 50% de las lecciones con video filtrado de YouTube.',
      passed: lessonsCount > 0 && (videosCount / lessonsCount) >= 0.5,
      weight: 20,
      category: 'VIDEO'
    }
  ];

  let score = 0;
  rules.forEach(rule => {
    if (rule.passed) score += rule.weight;
  });

  score = Math.min(100, Math.max(0, score));

  let status: 'GREEN' | 'YELLOW' | 'RED' = 'RED';
  let label: 'Completo' | 'Incompleto' | 'Vacío' = 'Vacío';
  let canPublish = false;

  if (score >= 80 && modulesCount >= 1 && lessonsCount >= 1) {
    status = 'GREEN';
    label = 'Completo';
    canPublish = true;
  } else if (score >= 40 && modulesCount >= 1) {
    status = 'YELLOW';
    label = 'Incompleto';
    canPublish = false;
  } else {
    status = 'RED';
    label = 'Vacío';
    canPublish = false;
  }

  return {
    score,
    status,
    label,
    canPublish,
    rules,
    modulesCount,
    lessonsCount,
    videosCount,
    totalTextLength
  };
};

export const CourseCompletenessValidator: React.FC<CourseCompletenessValidatorProps> = ({
  course,
  onPublish,
  onEditStructure,
  compact = false
}) => {
  const result = evaluateCourseCompleteness(course);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800">
          <span className={`w-2.5 h-2.5 rounded-full ${
            result.status === 'GREEN' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' :
            result.status === 'YELLOW' ? 'bg-yellow-500 shadow-[0_0_8px_#eab308]' :
            'bg-red-500 shadow-[0_0_8px_#ef4444]'
          }`} />
          <span className={`text-[11px] font-bold ${
            result.status === 'GREEN' ? 'text-emerald-400' :
            result.status === 'YELLOW' ? 'text-yellow-400' :
            'text-red-400'
          }`}>
            {result.status === 'GREEN' ? '🟢 Completo' : result.status === 'YELLOW' ? '🟡 Incompleto' : '🔴 Vacío'}
          </span>
          <span className="text-[10px] text-slate-400 font-mono font-bold">({result.score}%)</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0b1024] border border-cyan-500/30 p-6 rounded-3xl space-y-6 shadow-xl">
      {/* Header & Traffic Light Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-cyan-950 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold rounded-md uppercase">
              Semáforo de Calidad CMS
            </span>
            <span className="text-xs text-slate-400">Verificación en Tiempo Real</span>
          </div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            Validación de Completitud Académica
          </h3>
        </div>

        {/* Traffic Light Graphic */}
        <div className="flex items-center gap-3 bg-slate-950 p-2.5 rounded-2xl border border-slate-800 shrink-0">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-900 rounded-xl border border-slate-800">
            <div className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
              result.status === 'RED' ? 'bg-red-500 shadow-[0_0_12px_#ef4444] scale-110' : 'bg-red-950/60 opacity-40'
            }`} />
            <div className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
              result.status === 'YELLOW' ? 'bg-yellow-500 shadow-[0_0_12px_#eab308] scale-110' : 'bg-yellow-950/60 opacity-40'
            }`} />
            <div className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
              result.status === 'GREEN' ? 'bg-emerald-500 shadow-[0_0_12px_#10b981] scale-110' : 'bg-emerald-950/60 opacity-40'
            }`} />
          </div>

          <div className="text-right">
            <p className={`text-sm font-black ${
              result.status === 'GREEN' ? 'text-emerald-400' :
              result.status === 'YELLOW' ? 'text-yellow-400' :
              'text-red-400'
            }`}>
              {result.label} ({result.score}%)
            </p>
            <p className="text-[10px] text-slate-400">
              {result.canPublish ? 'Listo para Publicar 🟢' : 'Bloqueado para Publicación 🔴'}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">Progreso de Estructura Académica</span>
          <span className="font-mono font-bold text-cyan-400">{result.score} / 100 PTS</span>
        </div>
        <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              result.status === 'GREEN' ? 'bg-gradient-to-r from-emerald-600 to-teal-400' :
              result.status === 'YELLOW' ? 'bg-gradient-to-r from-yellow-600 to-amber-400' :
              'bg-gradient-to-r from-red-600 to-rose-400'
            }`}
            style={{ width: `${result.score}%` }}
          />
        </div>
      </div>

      {/* Course Stats Metrics Row */}
      <div className="grid grid-cols-4 gap-2 text-center bg-slate-900/60 p-3 rounded-2xl border border-slate-800 text-xs">
        <div>
          <p className="text-[10px] text-slate-500 uppercase font-bold">Módulos</p>
          <p className="font-bold text-white mt-0.5">{result.modulesCount}</p>
        </div>
        <div>
          <p className="text-[10px] text-slate-500 uppercase font-bold">Lecciones</p>
          <p className="font-bold text-white mt-0.5">{result.lessonsCount}</p>
        </div>
        <div>
          <p className="text-[10px] text-slate-500 uppercase font-bold">Videos</p>
          <p className="font-bold text-white mt-0.5">{result.videosCount}</p>
        </div>
        <div>
          <p className="text-[10px] text-slate-500 uppercase font-bold">Caracteres</p>
          <p className="font-bold text-white mt-0.5">{result.totalTextLength}</p>
        </div>
      </div>

      {/* Validation Checklist */}
      <div className="space-y-2">
        <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">Criterios de Calidad Exigidos</p>
        <div className="space-y-2">
          {result.rules.map((rule) => (
            <div
              key={rule.id}
              className={`p-3 rounded-2xl border transition flex items-center justify-between text-xs ${
                rule.passed
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-200'
                  : 'bg-red-950/20 border-red-500/30 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                {rule.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                )}
                <div>
                  <p className="font-bold text-white">{rule.label}</p>
                  <p className="text-[11px] text-slate-400">{rule.description}</p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold shrink-0 ${
                rule.passed ? 'bg-emerald-900/60 text-emerald-300' : 'bg-red-900/60 text-red-300'
              }`}>
                +{rule.weight}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
        {onEditStructure && (
          <button
            onClick={onEditStructure}
            className="w-full sm:w-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 transition flex items-center justify-center gap-2"
          >
            Completar Estructura en Editor
          </button>
        )}

        {onPublish && (
          <button
            onClick={onPublish}
            disabled={!result.canPublish}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg ${
              result.canPublish
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/50'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            {result.canPublish ? 'Publicar Curso en Catálogo Oficial' : 'Bloqueado (Requiere min. 80%)'}
          </button>
        )}
      </div>
    </div>
  );
};
