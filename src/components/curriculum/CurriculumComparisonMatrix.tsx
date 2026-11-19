import React, { useState } from 'react';
import {
  Layers, CheckCircle2, AlertTriangle, Sparkles, Filter,
  Search, ArrowRight, ShieldCheck, Cpu
} from 'lucide-react';

interface ComparisonMatrixProps {
  comparison?: any[];
}

export const CurriculumComparisonMatrix: React.FC<ComparisonMatrixProps> = ({
  comparison = []
}) => {
  const [filterClass, setFilterClass] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredData = (comparison || []).filter(item => {
    const matchClass = filterClass === 'all' || item.classification === filterClass;
    const matchSearch = !searchTerm || (
      item.topicName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.sourceA_Presence && item.sourceA_Presence.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.sourceB_Presence && item.sourceB_Presence.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    return matchClass && matchSearch;
  });

  const getBadgeColor = (classification: string) => {
    switch (classification) {
      case 'COMMON':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'SOURCE_A_ONLY':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'SOURCE_B_ONLY':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'EXTERNAL_ONLY':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'YOVE_PROPOSED':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-cyan-950 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              MATRIZ DE COMPARACIÓN CURRICULAR
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Traceability Rule: No Silent Blending
            </span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">Comparativa: Fuente A (SENATI) vs Fuente B (YOVE PDF) vs Estándares Externos</h3>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
            Identificación transparente de divergencias, vacíos de contenido y adiciones tecnológicas aprobadas en la propuesta de síntesis YOVE Master Curriculum 2026.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar tema de comparación..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterClass}
            onChange={e => setFilterClass(e.target.value)}
            className="w-full md:w-auto px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">Todas las Clasificaciones ({(comparison || []).length})</option>
            <option value="COMMON">Común en Fuentes A y B</option>
            <option value="SOURCE_A_ONLY">Exclusivo Fuente A (SENATI)</option>
            <option value="SOURCE_B_ONLY">Exclusivo Fuente B (YOVE PDF)</option>
            <option value="YOVE_PROPOSED">Propuesta Tecnológica YOVE</option>
          </select>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                <th className="py-3.5 px-4 min-w-[180px]">Módulo / Tema Comparado</th>
                <th className="py-3.5 px-4 min-w-[140px]">Fuente A (SENATI)</th>
                <th className="py-3.5 px-4 min-w-[140px]">Fuente B (YOVE PDF)</th>
                <th className="py-3.5 px-4 min-w-[140px]">Estándar Externo (Bosch/SAE)</th>
                <th className="py-3.5 px-4 min-w-[180px]">YOVE Proposed Synthesis</th>
                <th className="py-3.5 px-4">Clasificación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredData.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-950/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">
                    {item.topicName}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-slate-300">{item.sourceA_Presence || 'N/A'}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-slate-300">{item.sourceB_Presence || 'N/A'}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    {item.external_Presence || 'Bosch / SAE J1979'}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-cyan-300 bg-cyan-950/20">
                    {item.yoveProposedSynthesis}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-bold border ${getBadgeColor(item.classification)}`}>
                      {item.classification}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
