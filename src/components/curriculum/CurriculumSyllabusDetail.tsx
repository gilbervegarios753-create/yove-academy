import React, { useState } from 'react';
import {
  X, BookOpen, Clock, Award, ShieldAlert, CheckCircle2,
  FileText, ExternalLink, Video, Layers, AlertCircle, Wrench,
  Cpu, Activity, Building2, Sparkles, UserCheck, Calendar
} from 'lucide-react';

interface SyllabusDetailProps {
  unit: any;
  syllabus: any;
  practicals: any[];
  labs: any[];
  cases: any[];
  videos: any[];
  resources: any[];
  onClose: () => void;
}

export const CurriculumSyllabusDetail: React.FC<SyllabusDetailProps> = ({
  unit,
  syllabus,
  practicals = [],
  labs = [],
  cases = [],
  videos = [],
  resources = [],
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'datos' | 'semanas' | 'practicas' | 'videos' | 'seguridad'>('datos');

  if (!unit) return null;

  const safePracticals = practicals || [];
  const safeLabs = labs || [];
  const safeCases = cases || [];
  const safeVideos = videos || [];
  const safeResources = resources || [];

  const weeklyList = syllabus?.weeklyDistributionParsed || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 p-6 border-b border-slate-800 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {unit.code} — SEMESTRE {unit.semesterNumber}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {unit.level}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                {unit.credits} Créditos | {unit.hours} Horas
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">{unit.name}</h2>
            <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-cyan-400" />
              Fuente de Trazabilidad: <span className="text-cyan-300 font-medium">{unit.sourceTitle || 'YOVE Master Curriculum'}</span> ({unit.sourceInstitution || 'YOVE Reference'})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="bg-slate-950/80 px-6 border-b border-slate-800 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('datos')}
            className={`py-3 px-4 font-medium text-sm border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'datos'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" /> 1. Datos & Competencias (27 Puntos)
          </button>
          <button
            onClick={() => setActiveTab('semanas')}
            className={`py-3 px-4 font-medium text-sm border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'semanas'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4" /> 2. Distribución Semanal ({weeklyList.length} Semanas)
          </button>
          <button
            onClick={() => setActiveTab('practicas')}
            className={`py-3 px-4 font-medium text-sm border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'practicas'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wrench className="w-4 h-4" /> 3. Taller, Labs & Casos ({safePracticals.length + safeLabs.length + safeCases.length})
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`py-3 px-4 font-medium text-sm border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'videos'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Video className="w-4 h-4" /> 4. Videos & Recursos Verificados ({safeVideos.length})
          </button>
          <button
            onClick={() => setActiveTab('seguridad')}
            className={`py-3 px-4 font-medium text-sm border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'seguridad'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-4 h-4" /> 5. Seguridad & Evaluación
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-300">
          
          {activeTab === 'datos' && (
            <div className="space-y-6">
              
              {/* General & Specific Competencies */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-1.5">
                    <Award className="w-4 h-4" /> Competencia General
                  </h4>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    {syllabus?.generalCompetency || 'Competencia general registrada en desarrollo según norma técnica.'}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Competencia Específica
                  </h4>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    {syllabus?.specificCompetency || 'Competencia específica de ejecución técnica y diagnóstico.'}
                  </p>
                </div>
              </div>

              {/* Learning Outcomes with Observable Verbs */}
              <div className="p-5 rounded-xl bg-cyan-950/20 border border-cyan-800/40">
                <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-cyan-400" /> Resultados de Aprendizaje (Verbos Observables)
                </h4>
                <p className="text-sm text-cyan-100 leading-relaxed whitespace-pre-line">
                  {syllabus?.learningOutcomes || 'Al finalizar la unidad didáctica, el estudiante podrá identificar, medir, interpretar y diagnosticar los sistemas asignados.'}
                </p>
              </div>

              {/* Capabilities & Prerequisites */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5">
                    <Activity className="w-4 h-4" /> Capacidades Previas
                  </h4>
                  <p className="text-sm text-slate-300">
                    {syllabus?.capabilities || 'Comprensión de circuitos eléctricos, lectura de esquemas y seguridad técnica.'}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
                    <Layers className="w-4 h-4" /> Prerrequisitos Académicos
                  </h4>
                  <p className="text-sm text-slate-300">
                    {syllabus?.prerequisites || 'Sin prerrequisitos estrictos previa aprobación de ciclo anterior.'}
                  </p>
                </div>
              </div>

              {/* Bibliography & References */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <FileText className="w-4 h-4" /> Bibliografía & Manuales de Referencia
                </h4>
                <p className="text-sm text-slate-200">
                  {syllabus?.bibliography || 'Bosch Automotive Handbook 10th Ed.; Manuales Oficiales de Servicio del Fabricante.'}
                </p>
              </div>

            </div>
          )}

          {activeTab === 'semanas' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div>
                  <h4 className="text-sm font-semibold text-white">Cronograma de Ejecución Semanal</h4>
                  <p className="text-xs text-slate-400">Desglose de horas, contenidos teóricos y actividades prácticas por semana.</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  {weeklyList.length > 0 ? `${weeklyList.length} Semanas Programadas` : 'Distribución en Revisión'}
                </span>
              </div>

              {weeklyList.length > 0 ? (
                <div className="space-y-3">
                  {weeklyList.map((weekItem: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800/60 flex items-center justify-center font-bold text-xs">
                          S{weekItem.week}
                        </span>
                        <div>
                          <h5 className="text-sm font-semibold text-white">{weekItem.topic}</h5>
                          <p className="text-xs text-slate-400 mt-1">{weekItem.activity}</p>
                        </div>
                      </div>
                      <span className="flex-shrink-0 text-xs font-mono bg-slate-800 px-3 py-1 rounded text-slate-300">
                        {weekItem.hours} horas
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-950/40 rounded-xl border border-slate-800 text-slate-400 text-sm">
                  <AlertCircle className="w-8 h-8 mx-auto text-amber-400 mb-2" />
                  <p className="font-semibold text-slate-200">PENDING_WEEKLY_DISTRIBUTION</p>
                  <p className="text-xs text-slate-400 mt-1">La fuente original proporciona las competencias globales de la unidad. La distribución semanal se genera conforme al calendario del ciclo académico.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'practicas' && (
            <div className="space-y-6">
              
              {/* Practicals */}
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-2">
                  <Wrench className="w-4 h-4" /> Prácticas de Taller Declaradas
                </h4>
                {safePracticals.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {safePracticals.map((p, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-sm font-semibold text-white">{p.title}</h5>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.type === 'PRACTICA_YOVE_PROPOSED' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'}`}>
                            {p.type || 'OFICIAL'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mb-2"><strong>Objetivo:</strong> {p.objective}</p>
                        <p className="text-xs text-slate-400"><strong>Herramientas:</strong> {p.tools}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic bg-slate-950/40 p-3 rounded-lg border border-slate-800">
                    Propuesta de práctica en taller según protocolo estándar YOVE Academy.
                  </p>
                )}
              </div>

              {/* Practical Cases */}
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Casos Prácticos de Diagnóstico
                </h4>
                <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40">
                  <p className="text-sm text-amber-200 leading-relaxed font-mono">
                    {syllabus?.practicalCases || 'Casos de simulación de fallas reales e interpretación de DTCs en taller.'}
                  </p>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'videos' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div>
                  <h4 className="text-sm font-semibold text-white">Recursos Audiovisuales & Documentación Externa</h4>
                  <p className="text-xs text-slate-400">Videos y recursos filtrados sin enlaces rotos ni contenido irrelevante.</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {safeVideos.length} Videos Verificados
                </span>
              </div>

              {safeVideos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {safeVideos.map((vid, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            {vid.status}
                          </span>
                          <span className="text-xs font-mono text-slate-400">{vid.duration}</span>
                        </div>
                        <h5 className="text-sm font-semibold text-white mb-1 line-clamp-2">{vid.title}</h5>
                        <p className="text-xs text-slate-400">Canal: {vid.channel}</p>
                      </div>
                      <a
                        href={vid.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors"
                      >
                        Ver Video Educativo <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic bg-slate-950/40 p-4 rounded-lg border border-slate-800 text-center">
                  Búsqueda de recursos multimedia verificados en proceso en la biblioteca digital YOVE.
                </p>
              )}
            </div>
          )}

          {activeTab === 'seguridad' && (
            <div className="space-y-6">
              
              {/* Safety Rules */}
              <div className="p-5 rounded-xl bg-rose-950/30 border border-rose-800/40">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-300 mb-2 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-400" /> Normas de Seguridad & EPP Obligatorio
                </h4>
                <p className="text-sm text-rose-100 leading-relaxed">
                  {syllabus?.safetyRules || 'Uso obligatorio de EPP, gafas de protección y protocolo de desactivación de energía.'}
                </p>
              </div>

              {/* Evaluation & Instruments */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">Método de Evaluación</h4>
                  <p className="text-sm text-slate-200">{syllabus?.evaluationMethod || 'Evaluación continua basada en desempeño en taller y exámenes de teoría.'}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">Instrumentos de Evaluación</h4>
                  <p className="text-sm text-slate-200">{syllabus?.evaluationInstruments || 'Rúbrica de taller y cuestionario automatizado.'}</p>
                </div>
              </div>

              {/* Integrating Project */}
              {syllabus?.integratingProject && (
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">Proyecto Integrador de Unidad</h4>
                  <p className="text-sm text-slate-200">{syllabus.integratingProject}</p>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Estado del Sílabo: <strong className="text-emerald-400 uppercase">{syllabus?.status || 'PUBLISHED'}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
          >
            Cerrar Sílabo
          </button>
        </div>

      </div>
    </div>
  );
};
