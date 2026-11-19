import React, { useState, useMemo } from 'react';
import {
  DTCModel,
  DTCCategory,
  TestType,
  DiagnosticStep,
  Course,
  DiagnosticCase,
  LabSimulation
} from '../../types';
import { ContentService } from '../../services/contentService';
import {
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Cpu,
  BookOpen,
  Wrench,
  Sparkles,
  Zap,
  ArrowRight,
  Plus,
  Edit3,
  Layers,
  HelpCircle,
  FileText,
  ShieldAlert,
  ChevronRight,
  Car,
  X,
  Gauge,
  Radio,
  ExternalLink,
  Flame,
  Printer
} from 'lucide-react';
import { FadeInOnScroll } from '../FadeInOnScroll';

interface DtcProViewProps {
  onAskAI?: (promptText: string) => void;
  onNavigateToView?: (view: any) => void;
  onSelectCourse?: (course: Course) => void;
  onOpenLab?: (labType: 'oscilloscope' | 'multimeter' | 'canbus') => void;
  isAdmin?: boolean;
}

const CATEGORIES: { label: string; value: string }[] = [
  { label: 'Todas las Categorías', value: 'Todas' },
  { label: 'GENÉRICO OBD-II', value: 'GENÉRICO OBD-II' },
  { label: 'FABRICANTE', value: 'FABRICANTE' },
  { label: 'COMUNICACIÓN', value: 'COMUNICACIÓN' },
  { label: 'SENSOR', value: 'SENSOR' },
  { label: 'ACTUADOR', value: 'ACTUADOR' },
  { label: 'EMISIONES', value: 'EMISIONES' },
  { label: 'TRANSMISIÓN', value: 'TRANSMISIÓN' },
  { label: 'ABS', value: 'ABS' },
  { label: 'AIRBAG', value: 'AIRBAG' },
  { label: 'ECU', value: 'ECU' },
  { label: 'CAN', value: 'CAN' },
  { label: 'LIN', value: 'LIN' }
];

const SEVERITIES = ['Todas', 'Crítica', 'Alta', 'Media', 'Baja'];

const TEST_TYPE_BADGES: Record<TestType, { label: string; bg: string; text: string; icon: any }> = {
  visual: { label: 'Visión / Inspección', bg: 'bg-emerald-950/80 border-emerald-500/50', text: 'text-emerald-300', icon: EyeIcon },
  eléctrica: { label: 'Eléctrica / Voltaje', bg: 'bg-amber-950/80 border-amber-500/50', text: 'text-amber-300', icon: Zap },
  continuidad: { label: 'Continuidad / Arnés', bg: 'bg-blue-950/80 border-blue-500/50', text: 'text-blue-300', icon: Activity },
  alimentación: { label: 'Alimentación 12V/5V', bg: 'bg-red-950/80 border-red-500/50', text: 'text-red-300', icon: Zap },
  masa: { label: 'Masa / Tierra', bg: 'bg-gray-900/90 border-gray-500/50', text: 'text-gray-300', icon: Wrench },
  señal: { label: 'Análisis de Señal', bg: 'bg-cyan-950/80 border-cyan-500/50', text: 'text-cyan-300', icon: Radio },
  'datos en vivo': { label: 'Datos en Vivo PID', bg: 'bg-purple-950/80 border-purple-500/50', text: 'text-purple-300', icon: Gauge },
  osciloscopio: { label: 'Oscilograma 2-CH', bg: 'bg-amber-900/90 border-amber-400', text: 'text-amber-200', icon: Radio },
  presión: { label: 'Presión Hidráulica/Vacío', bg: 'bg-rose-950/80 border-rose-500/50', text: 'text-rose-300', icon: Flame },
  temperatura: { label: 'Temperatura Térmica', bg: 'bg-orange-950/80 border-orange-500/50', text: 'text-orange-300', icon: Flame },
  comunicación: { label: 'Trama CAN/LIN Bus', bg: 'bg-indigo-950/80 border-indigo-500/50', text: 'text-indigo-300', icon: Cpu }
};

function EyeIcon(props: any) {
  return (
    <svg className={props.className || 'w-3 h-3'} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

export function DtcProView({
  onAskAI,
  onNavigateToView,
  onSelectCourse,
  onOpenLab,
  isAdmin = false
}: DtcProViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedSeverity, setSelectedSeverity] = useState('Todas');
  const [selectedDtc, setSelectedDtc] = useState<DTCModel | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingDtc, setEditingDtc] = useState<Partial<DTCModel> | null>(null);

  // Fetch all DTCs from ContentService
  const allDtcs = ContentService.getAllDtcs();
  const dtcStats = ContentService.getDtcStats();

  // Filtered list
  const filteredDtcs = useMemo(() => {
    return ContentService.searchDtcs({
      query: searchQuery,
      category: selectedCategory,
      severity: selectedSeverity,
      status: isAdmin ? 'ALL' : 'PUBLISHED'
    });
  }, [searchQuery, selectedCategory, selectedSeverity, isAdmin, allDtcs]);

  const handleOpenDetail = (dtc: DTCModel) => {
    setSelectedDtc(dtc);
  };

  const handleConsultAI = (dtc: DTCModel) => {
    if (onAskAI) {
      const prompt = `Analiza el código DTC ${dtc.code} (${dtc.title || dtc.description}). Sistema: ${dtc.system}. Categoría: ${dtc.category}. Severidad: ${dtc.severity}.
Proporciona árboles de decisión, pruebas específicas con osciloscopio o multímetro y soluciones conocidas para vehículos como ${dtc.relatedVehicles.join(', ')}.`;
      onAskAI(prompt);
    }
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'Crítica':
        return 'bg-red-950/90 text-red-300 border-red-500/60';
      case 'Alta':
        return 'bg-orange-950/90 text-orange-300 border-orange-500/60';
      case 'Media':
        return 'bg-amber-950/90 text-amber-300 border-amber-500/60';
      default:
        return 'bg-blue-950/90 text-blue-300 border-blue-500/60';
    }
  };

  return (
    <div className="min-h-screen bg-[#070913] text-gray-100 pb-20">
      {/* Top Banner Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#0d1330] via-[#090d24] to-[#120a22] border-b border-white/10 pt-8 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#ff6f00]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#ff6f00]/20 border border-[#ff6f00]/40 text-[#ff9100] text-xs font-black uppercase tracking-widest flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  DTC PRO v4.0 — Base de Conocimiento
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  Sin Invención Técnica
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Biblioteca Estratégica de <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6f00] via-[#ff9100] to-amber-300">Códigos DTC</span>
              </h1>
              <p className="text-sm text-gray-300 max-w-3xl">
                Guías de diagnóstico metódico estructuradas en el flujo real: <span className="text-amber-300 font-bold">Síntoma → DTC → Inspección → Prueba → Resultado → Interpretación → Siguiente Paso</span>.
              </p>
            </div>

            {isAdmin && (
              <button
                onClick={() => {
                  setEditingDtc({
                    code: 'P0',
                    title: '',
                    description: '',
                    category: 'GENÉRICO OBD-II',
                    system: 'Inyección Electrónica',
                    severity: 'Media',
                    symptoms: [],
                    possibleCauses: [],
                    diagnosticApproach: '',
                    diagnosticProcedure: [],
                    recommendedTests: [],
                    relatedVehicles: [],
                    relatedCourses: [],
                    relatedCases: [],
                    relatedLabs: [],
                    status: 'PUBLISHED'
                  });
                  setIsEditorOpen(true);
                }}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#ff6f00] to-[#ff9100] text-white font-black text-xs shadow-lg hover:brightness-110 transition cursor-pointer flex items-center gap-2 self-start md:self-auto"
              >
                <Plus className="w-4 h-4" />
                Agregar Nuevo DTC
              </button>
            )}
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-orange-500/20 text-[#ff9100]">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">DTCs Totales</p>
                <p className="text-xl font-extrabold text-white">{dtcStats.total}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Procedimientos Paso a Paso</p>
                <p className="text-xl font-extrabold text-emerald-300">{dtcStats.withProcedures}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Casos Reales Vinculados</p>
                <p className="text-xl font-extrabold text-blue-300">{dtcStats.withCases}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Cursos LMS Relacionados</p>
                <p className="text-xl font-extrabold text-purple-300">{dtcStats.withCourses}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* Search & Filter Controls */}
        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-5 backdrop-blur-md shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Main Search Input */}
            <div className="md:col-span-6 relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por código (ej. P0171, U0100), síntoma, sistema o vehículo..."
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-black/60 border border-white/20 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#ff6f00] transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-3.5 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Severity Filter */}
            <div className="md:col-span-3 flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400 uppercase whitespace-nowrap">Severidad:</span>
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="w-full px-3 py-3 rounded-2xl bg-black/60 border border-white/20 text-white text-xs font-bold focus:outline-none focus:border-[#ff6f00]"
              >
                {SEVERITIES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Total Results Counter */}
            <div className="md:col-span-3 flex items-center justify-end">
              <span className="px-4 py-2 rounded-xl bg-black/40 border border-white/10 text-xs font-bold text-amber-400">
                {filteredDtcs.length} resultado{filteredDtcs.length !== 1 ? 's' : ''} encontrado{filteredDtcs.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-[#ff6f00]" />
              Filtrar por Clasificación Técnica:
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.value;
                return (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-[#ff6f00] text-white shadow-lg shadow-orange-950/50 scale-105'
                        : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* DTC Cards Grid */}
        {filteredDtcs.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl bg-white/5 border border-white/10 space-y-4">
            <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto opacity-70" />
            <h3 className="text-lg font-bold text-white">No se encontraron códigos DTC</h3>
            <p className="text-xs text-gray-400 max-w-md mx-auto">
              Prueba cambiando el término de búsqueda o selecciona "Todas las Categorías" para explorar la base de conocimiento.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Todas');
                setSelectedSeverity('Todas');
              }}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition cursor-pointer"
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDtcs.map((dtc) => {
              const severityStyle = getSeverityBadge(dtc.severity);
              const procedureStepsCount = dtc.diagnosticProcedure?.length || 0;

              return (
                <div
                  key={dtc.code}
                  className="group relative p-6 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 hover:border-[#ff6f00]/50 transition duration-300 flex flex-col justify-between space-y-4 shadow-xl hover:shadow-[#ff6f00]/10"
                >
                  <div className="space-y-3">
                    {/* Top Row: Code + Category + Severity */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-2xl font-black font-mono tracking-tight text-[#ff9100]">
                          {dtc.code}
                        </span>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="px-2 py-0.5 rounded-md bg-white/10 border border-white/15 text-[10px] font-bold text-gray-300">
                            {dtc.category}
                          </span>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-black border ${severityStyle}`}>
                            {dtc.severity}
                          </span>
                        </div>
                      </div>

                      {dtc.isVerified && (
                        <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center gap-1 border border-emerald-500/30" title="Verificado por Especialista YOVE">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Oficial
                        </span>
                      )}
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="font-extrabold text-base text-white group-hover:text-amber-200 transition line-clamp-1">
                        {dtc.title || dtc.description}
                      </h3>
                      <p className="text-xs text-gray-300 line-clamp-2 mt-1">
                        {dtc.description}
                      </p>
                    </div>

                    {/* System */}
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs">
                      <span className="text-gray-400 font-bold">Sistema: </span>
                      <span className="text-white font-semibold">{dtc.system}</span>
                    </div>

                    {/* Symptoms Tags */}
                    {dtc.symptoms && dtc.symptoms.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Síntomas Clave:</span>
                        <div className="flex flex-wrap gap-1">
                          {dtc.symptoms.slice(0, 2).map((symptom, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-red-950/40 border border-red-500/20 text-[10px] text-red-300 font-medium line-clamp-1">
                              • {symptom}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom Actions */}
                  <div className="pt-4 border-t border-white/10 space-y-2">
                    <button
                      onClick={() => handleOpenDetail(dtc)}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <Layers className="w-4 h-4 text-blue-200" />
                      Ver Procedimiento ({procedureStepsCount} Pasos)
                    </button>

                    <button
                      onClick={() => handleConsultAI(dtc)}
                      className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-gray-300 hover:text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Diagnosticar con YOVE AI
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* DTC DETAIL & DIAGNOSTIC PROCEDURE MODAL */}
      {selectedDtc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-4xl bg-[#0b0f26] border border-white/20 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-[#0f173f] via-[#131d4d] to-[#1a1133] border-b border-white/10 flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-lg bg-orange-950/80 border border-orange-500/50 text-[#ff9100] font-mono font-black text-xl">
                    {selectedDtc.code}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-white/10 border border-white/20 text-xs font-bold text-gray-200">
                    {selectedDtc.category}
                  </span>
                  <span className={`px-2.5 py-1 rounded-md text-xs font-extrabold border ${getSeverityBadge(selectedDtc.severity)}`}>
                    Severidad: {selectedDtc.severity}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-white">
                  {selectedDtc.title || selectedDtc.description}
                </h2>
                <p className="text-xs text-amber-300 font-semibold">
                  Sistema: {selectedDtc.system}
                </p>
              </div>

              <button
                onClick={() => setSelectedDtc(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Description & Approach */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <h4 className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4" />
                  Descripción Técnica Completa
                </h4>
                <p className="text-sm text-gray-200 leading-relaxed">
                  {selectedDtc.description}
                </p>
                {selectedDtc.diagnosticApproach && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <span className="text-xs font-bold text-blue-300 block mb-1">Enfoque de Diagnóstico Sugerido:</span>
                    <p className="text-xs text-gray-300 italic">{selectedDtc.diagnosticApproach}</p>
                  </div>
                )}
              </div>

              {/* DIAGNOSTIC PROCEDURE FLOWCHART STEPS */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-400" />
                    Procedimiento de Diagnóstico Estructurado Paso a Paso
                  </h3>
                  <span className="text-xs text-gray-400 font-mono">
                    Flujo Norma ISO/SAE
                  </span>
                </div>

                {selectedDtc.diagnosticProcedure && selectedDtc.diagnosticProcedure.length > 0 ? (
                  <div className="space-y-4 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-[#ff6f00] before:to-blue-600">
                    {selectedDtc.diagnosticProcedure.map((step, idx) => {
                      const testBadge = TEST_TYPE_BADGES[step.testType] || TEST_TYPE_BADGES['eléctrica'];
                      const TestIcon = testBadge.icon;

                      return (
                        <div key={idx} className="relative pl-12">
                          {/* Step Number Circle */}
                          <div className="absolute left-2.5 top-0 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-[#ff6f00] to-[#ff9100] text-white font-extrabold text-sm flex items-center justify-center shadow-lg border-2 border-[#0b0f26]">
                            {step.stepNumber || idx + 1}
                          </div>

                          <div className="p-5 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/15 space-y-3 shadow-lg hover:border-amber-400/40 transition">
                            {/* Step Header: Test Type Badge */}
                            <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
                              <span className={`px-2.5 py-1 rounded-lg border text-[11px] font-black flex items-center gap-1.5 ${testBadge.bg} ${testBadge.text}`}>
                                <TestIcon className="w-3.5 h-3.5" />
                                {testBadge.label}
                              </span>

                              <span className="text-[10px] font-mono font-bold text-gray-400">
                                Paso {step.stepNumber} ↓ {selectedDtc.code}
                              </span>
                            </div>

                            {/* Procedure Elements: Síntoma -> Inspección -> Prueba -> Resultado -> Interpretación -> Next */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                              {/* Left Column */}
                              <div className="space-y-2">
                                <div className="p-2.5 rounded-xl bg-red-950/30 border border-red-500/20">
                                  <span className="font-bold text-red-300 block mb-0.5">1. Síntoma Evaluado:</span>
                                  <span className="text-gray-200">{step.symptom}</span>
                                </div>

                                <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                                  <span className="font-bold text-amber-300 block mb-0.5">2. Inspección Previa:</span>
                                  <span className="text-gray-200">{step.inspection}</span>
                                </div>

                                <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/20">
                                  <span className="font-bold text-blue-300 block mb-0.5">3. Prueba Ejecutada:</span>
                                  <span className="text-gray-200">{step.test}</span>
                                </div>
                              </div>

                              {/* Right Column */}
                              <div className="space-y-2">
                                <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/20">
                                  <span className="font-bold text-purple-300 block mb-0.5">4. Resultado Obtenido:</span>
                                  <span className="text-gray-200 font-mono font-semibold">{step.result}</span>
                                </div>

                                <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20">
                                  <span className="font-bold text-emerald-300 block mb-0.5">5. Interpretación Técnica:</span>
                                  <span className="text-gray-200">{step.interpretation}</span>
                                </div>

                                <div className="p-2.5 rounded-xl bg-gradient-to-r from-orange-950/60 to-amber-950/60 border border-orange-500/30">
                                  <span className="font-extrabold text-[#ff9100] block mb-0.5">6. Siguiente Paso / Solución:</span>
                                  <span className="text-white font-bold">{step.nextStep}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center text-gray-400 text-xs">
                    No hay pasos estructurados registrados para este DTC aún.
                  </div>
                )}
              </div>

              {/* Causes & Recommended Tests Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <h4 className="text-xs font-black uppercase text-red-400 tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    Causas Posibles (Ordenadas por Probabilidad)
                  </h4>
                  <ul className="space-y-1.5 text-xs text-gray-300">
                    {selectedDtc.possibleCauses.map((cause, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-red-400 font-bold">•</span>
                        <span>{cause}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <h4 className="text-xs font-black uppercase text-emerald-400 tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Pruebas Recomendadas
                  </h4>
                  <ul className="space-y-1.5 text-xs text-gray-300">
                    {selectedDtc.recommendedTests.map((test, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span>{test}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Related Vehicles */}
              {selectedDtc.relatedVehicles && selectedDtc.relatedVehicles.length > 0 && (
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <h4 className="text-xs font-black uppercase text-blue-400 tracking-wider flex items-center gap-1.5">
                    <Car className="w-4 h-4" />
                    Vehículos con Mayor Incidencia Registrada
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDtc.relatedVehicles.map((v, i) => (
                      <span key={i} className="px-3 py-1 rounded-xl bg-blue-950/80 border border-blue-500/30 text-xs font-bold text-blue-200">
                        🚗 {v}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Platform Integrations */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-blue-950/40 border border-purple-500/30 space-y-3">
                <h4 className="text-xs font-black uppercase text-purple-300 tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Recursos Educativos e Integraciones
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => {
                      if (onNavigateToView) onNavigateToView('cursos');
                      setSelectedDtc(null);
                    }}
                    className="p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-left transition cursor-pointer group"
                  >
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Cursos LMS</p>
                    <p className="text-xs font-extrabold text-white group-hover:text-amber-300 flex items-center justify-between mt-1">
                      Ver Cursos OBD-II
                      <ChevronRight className="w-3.5 h-3.5" />
                    </p>
                  </button>

                  <button
                    onClick={() => {
                      if (onNavigateToView) onNavigateToView('cases');
                      setSelectedDtc(null);
                    }}
                    className="p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-left transition cursor-pointer group"
                  >
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Casos Reales</p>
                    <p className="text-xs font-extrabold text-white group-hover:text-amber-300 flex items-center justify-between mt-1">
                      Ver Casos Resueltos
                      <ChevronRight className="w-3.5 h-3.5" />
                    </p>
                  </button>

                  <button
                    onClick={() => {
                      if (onOpenLab) onOpenLab('oscilloscope');
                      setSelectedDtc(null);
                    }}
                    className="p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-left transition cursor-pointer group"
                  >
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Laboratorio Virtual</p>
                    <p className="text-xs font-extrabold text-white group-hover:text-amber-300 flex items-center justify-between mt-1">
                      Simular Osciloscopio
                      <ChevronRight className="w-3.5 h-3.5" />
                    </p>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 bg-black/60 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                Imprimir Guía de Diagnóstico
              </button>

              <button
                onClick={() => {
                  const currentDtc = selectedDtc;
                  setSelectedDtc(null);
                  handleConsultAI(currentDtc);
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#ff6f00] to-[#ff9100] text-white font-extrabold text-xs shadow-lg hover:brightness-110 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4 text-amber-200" />
                Iniciar Diagnóstico Interactivo con YOVE AI
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN DTC EDITOR MODAL */}
      {isEditorOpen && editingDtc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-[#0d1330] border border-white/20 rounded-3xl p-6 space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#ff6f00]" />
                Administrador: Agregar / Editar Código DTC
              </h3>
              <button onClick={() => setIsEditorOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-gray-400 font-bold block mb-1">Código DTC</label>
                <input
                  type="text"
                  value={editingDtc.code || ''}
                  onChange={(e) => setEditingDtc({ ...editingDtc, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white font-mono font-bold"
                  placeholder="Ej. P0171"
                />
              </div>

              <div>
                <label className="text-gray-400 font-bold block mb-1">Categoría</label>
                <select
                  value={editingDtc.category || 'GENÉRICO OBD-II'}
                  onChange={(e) => setEditingDtc({ ...editingDtc, category: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white font-bold"
                >
                  {CATEGORIES.filter(c => c.value !== 'Todas').map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-gray-400 font-bold block mb-1">Título del Código</label>
                <input
                  type="text"
                  value={editingDtc.title || ''}
                  onChange={(e) => setEditingDtc({ ...editingDtc, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white font-bold"
                  placeholder="Ej. Sistema Demasiado Magro (Banco 1)"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-gray-400 font-bold block mb-1">Descripción Técnica</label>
                <textarea
                  rows={2}
                  value={editingDtc.description || ''}
                  onChange={(e) => setEditingDtc({ ...editingDtc, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white text-xs"
                  placeholder="Explicación detallada de la lógica del ECM..."
                />
              </div>

              <div>
                <label className="text-gray-400 font-bold block mb-1">Sistema Afectado</label>
                <input
                  type="text"
                  value={editingDtc.system || ''}
                  onChange={(e) => setEditingDtc({ ...editingDtc, system: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white font-bold"
                  placeholder="Ej. Inyección y Control de Mezcla"
                />
              </div>

              <div>
                <label className="text-gray-400 font-bold block mb-1">Severidad</label>
                <select
                  value={editingDtc.severity || 'Media'}
                  onChange={(e) => setEditingDtc({ ...editingDtc, severity: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white font-bold"
                >
                  {SEVERITIES.filter(s => s !== 'Todas').map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
              <button
                onClick={() => setIsEditorOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/10 text-xs font-bold text-white hover:bg-white/20 cursor-pointer"
              >
                Cancelar
              </button>

              <button
                onClick={() => {
                  if (editingDtc.code) {
                    ContentService.addDtc({
                      id: editingDtc.id || `dtc-${editingDtc.code.toLowerCase()}`,
                      code: editingDtc.code,
                      title: editingDtc.title || editingDtc.code,
                      description: editingDtc.description || '',
                      category: editingDtc.category as DTCCategory || 'GENÉRICO OBD-II',
                      system: editingDtc.system || 'Gestión Electrónica',
                      severity: editingDtc.severity as any || 'Media',
                      symptoms: editingDtc.symptoms || ['Luz Check Engine encendida'],
                      possibleCauses: editingDtc.possibleCauses || ['Falla en sensor/arnés'],
                      diagnosticApproach: editingDtc.diagnosticApproach || 'Revisar datos en vivo con escáner.',
                      diagnosticProcedure: editingDtc.diagnosticProcedure || [],
                      recommendedTests: editingDtc.recommendedTests || ['Escaneo de datos en vivo'],
                      relatedVehicles: editingDtc.relatedVehicles || ['Modelos genéricos OBD-II'],
                      relatedCourses: editingDtc.relatedCourses || ['diagnostico-obd2'],
                      relatedCases: editingDtc.relatedCases || [],
                      relatedLabs: editingDtc.relatedLabs || [],
                      status: 'PUBLISHED',
                      isVerified: true
                    });
                    setIsEditorOpen(false);
                    setEditingDtc(null);
                  }
                }}
                className="px-5 py-2 rounded-xl bg-[#ff6f00] text-xs font-bold text-white hover:bg-[#ff9100] cursor-pointer"
              >
                Guardar Código DTC
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
