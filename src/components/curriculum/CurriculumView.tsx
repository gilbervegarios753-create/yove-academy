import React, { useState, useEffect } from 'react';
import {
  BookOpen, Layers, Building2, Search, Video, FileText,
  Award, ShieldCheck, Sparkles, RefreshCw, BarChart2,
  CheckCircle2, Clock, Globe, ArrowRight
} from 'lucide-react';
import { CurriculumMasterGrid } from './CurriculumMasterGrid';
import { CurriculumSourceRegistry } from './CurriculumSourceRegistry';
import { CurriculumComparisonMatrix } from './CurriculumComparisonMatrix';
import { CurriculumResearchEngine } from './CurriculumResearchEngine';
import { CurriculumSyllabusDetail } from './CurriculumSyllabusDetail';

export const CurriculumView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'malla' | 'fuentes' | 'comparacion' | 'investigacion'>('malla');
  const [summary, setSummary] = useState<any>(null);
  const [sources, setSources] = useState<any[]>([]);
  const [semesters, setSemesters] = useState<any[]>([]);
  const [comparison, setComparison] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Selected Unit for Syllabus Modal Detail
  const [selectedUnit, setSelectedUnit] = useState<any>(null);
  const [unitDetailData, setUnitDetailData] = useState<any>(null);
  const [loadingUnit, setLoadingUnit] = useState<boolean>(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [sumRes, srcRes, semRes, compRes, vidRes] = await Promise.all([
        fetch('/api/curriculum/summary').then(r => r.json()),
        fetch('/api/curriculum/sources').then(r => r.json()),
        fetch('/api/curriculum/semesters').then(r => r.json()),
        fetch('/api/curriculum/comparison').then(r => r.json()),
        fetch('/api/curriculum/videos').then(r => r.json())
      ]);

      if (sumRes.success) setSummary(sumRes.summary);
      if (srcRes.success) setSources(srcRes.sources);
      if (semRes.success) setSemesters(semRes.semesters);
      if (compRes.success) setComparison(compRes.comparison);
      if (vidRes.success) setVideos(vidRes.videos);
    } catch (error) {
      console.error("Error fetching curriculum data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUnit = async (unit: any) => {
    setSelectedUnit(unit);
    setLoadingUnit(true);
    try {
      const res = await fetch(`/api/curriculum/units/${unit.id}`);
      const data = await res.json();
      if (data.success) {
        setUnitDetailData(data);
      }
    } catch (error) {
      console.error("Error fetching unit details:", error);
    } finally {
      setLoadingUnit(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header & Dashboard Stats */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 tracking-wide uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> YOVE ACADEMY 4.0 — ARQUITECTURA ACADÉMICA
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                Mecatrónica Automotriz
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Malla Curricular, Sílabos & Motor de Investigación
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Estructura académica de 6 Semestres con trazabilidad de origen declarada (Fuente A SENATI vs Fuente B YOVE PDF), desglose de sílabos en 27 puntos y validación audiovisual.
            </p>
          </div>

          <button
            onClick={fetchAllData}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-2 border border-slate-700 transition-all self-start md:self-auto"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} /> Sincronizar Datos
          </button>
        </div>

        {/* Dashboard Metrics Grid */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 relative z-10">
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Duración</span>
            <span className="text-lg font-bold text-white font-mono">6 Semestres</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Unidades</span>
            <span className="text-lg font-bold text-cyan-400 font-mono">{summary?.totalUnits || 10} Cursos</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Carga Horaria</span>
            <span className="text-lg font-bold text-indigo-400 font-mono">{summary?.totalHours || 600}h Total</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Sílabos Piloto</span>
            <span className="text-lg font-bold text-emerald-400 font-mono">{summary?.totalPublishedSyllabi || 10} Publicados</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Fuentes Base</span>
            <span className="text-lg font-bold text-amber-400 font-mono">{summary?.totalSources || 6} Registradas</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Videos Verificados</span>
            <span className="text-lg font-bold text-cyan-300 font-mono">{summary?.totalVerifiedVideos || 10} Indexados</span>
          </div>
        </div>

      </div>

      {/* Primary Navigation Tabs */}
      <div className="bg-slate-900 p-1.5 rounded-2xl border border-slate-800 flex items-center gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('malla')}
          className={`flex-1 min-w-[180px] py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'malla'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <BookOpen className="w-4 h-4" /> 1. Malla Curricular Maestra (6 Semestres)
        </button>

        <button
          onClick={() => setActiveTab('fuentes')}
          className={`flex-1 min-w-[180px] py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'fuentes'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Building2 className="w-4 h-4" /> 2. Registro de Fuentes Base (Trazabilidad)
        </button>

        <button
          onClick={() => setActiveTab('comparacion')}
          className={`flex-1 min-w-[180px] py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'comparacion'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Layers className="w-4 h-4" /> 3. Matriz de Comparación (A vs B)
        </button>

        <button
          onClick={() => setActiveTab('investigacion')}
          className={`flex-1 min-w-[180px] py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'investigacion'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Video className="w-4 h-4" /> 4. Motor de Investigación Audiovisual
        </button>
      </div>

      {/* Tab Content Display */}
      {loading ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
          <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-300">Cargando arquitectura curricular de YOVE Academy 4.0...</p>
        </div>
      ) : (
        <>
          {activeTab === 'malla' && (
            <CurriculumMasterGrid
              semesters={semesters}
              onSelectUnit={handleSelectUnit}
            />
          )}

          {activeTab === 'fuentes' && (
            <CurriculumSourceRegistry
              sources={sources}
              onRefresh={fetchAllData}
            />
          )}

          {activeTab === 'comparacion' && (
            <CurriculumComparisonMatrix
              comparison={comparison}
            />
          )}

          {activeTab === 'investigacion' && (
            <CurriculumResearchEngine
              videos={videos}
              onRefresh={fetchAllData}
            />
          )}
        </>
      )}

      {/* Syllabus Detail Modal */}
      {selectedUnit && (
        <CurriculumSyllabusDetail
          unit={selectedUnit}
          syllabus={unitDetailData?.syllabus}
          practicals={unitDetailData?.practicals || []}
          labs={unitDetailData?.labs || []}
          cases={unitDetailData?.cases || []}
          videos={unitDetailData?.videos || []}
          resources={unitDetailData?.resources || []}
          onClose={() => {
            setSelectedUnit(null);
            setUnitDetailData(null);
          }}
        />
      )}

    </div>
  );
};
