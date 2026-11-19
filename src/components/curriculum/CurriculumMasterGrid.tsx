import React, { useState } from 'react';
import {
  BookOpen, Layers, Award, Clock, Search, Filter, Sparkles,
  CheckCircle2, AlertCircle, ChevronRight, FileText, ArrowUpRight,
  ShieldCheck, Wrench
} from 'lucide-react';

interface CurriculumMasterGridProps {
  semesters?: any[];
  onSelectUnit: (unit: any) => void;
}

export const CurriculumMasterGrid: React.FC<CurriculumMasterGridProps> = ({
  semesters = [],
  onSelectUnit
}) => {
  const [selectedSemester, setSelectedSemester] = useState<number | 'all'>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const levels = [
    'NIVEL 1 — FUNDAMENTOS',
    'NIVEL 2 — TÉCNICO',
    'NIVEL 3 — DIAGNÓSTICO',
    'NIVEL 4 — ESPECIALIZACIÓN',
    'NIVEL 5 — PROFESIONAL'
  ];

  const getFilteredUnits = (units: any[]) => {
    return units.filter(u => {
      const matchLevel = selectedLevel === 'all' || u.level === selectedLevel;
      const matchSearch = !searchTerm || (
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.notes && u.notes.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      return matchLevel && matchSearch;
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por curso, código o tema..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Semester Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedSemester('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedSemester === 'all'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Todos (I - VI)
          </button>
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <button
              key={num}
              onClick={() => setSelectedSemester(num)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedSemester === num
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Sem. {num}
            </button>
          ))}
        </div>

        {/* Level Dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="w-full md:w-auto px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">Todos los Niveles Pedagogicos (1-5)</option>
            {levels.map((lvl) => (
              <option key={lvl} value={lvl}>{lvl}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Semesters & Units Accordion / Grid */}
      <div className="space-y-8">
        {(semesters || [])
          .filter(sem => selectedSemester === 'all' || sem.semesterNumber === selectedSemester)
          .map((sem) => {
            const filteredUnits = getFilteredUnits(sem.units || []);

            if (filteredUnits.length === 0 && (searchTerm || selectedLevel !== 'all')) {
              return null;
            }

            return (
              <div key={sem.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
                
                {/* Semester Header */}
                <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/40 p-5 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        SEMESTRE {sem.semesterNumber}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {sem.hoursTotal} Horas | {sem.creditTotal} Créditos
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white tracking-tight">{sem.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{sem.description}</p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800/80 self-start md:self-auto">
                    <BookOpen className="w-4 h-4 text-cyan-400" />
                    <span>{filteredUnits.length} Unidades Didácticas</span>
                  </div>
                </div>

                {/* Units List Grid */}
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredUnits.map((unit) => {
                    const isPilot = unit.status === 'PUBLISHED';

                    return (
                      <div
                        key={unit.id}
                        onClick={() => onSelectUnit(unit)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between group ${
                          isPilot
                            ? 'bg-slate-950/80 border-cyan-500/40 hover:border-cyan-400 shadow-lg shadow-cyan-950/20 hover:scale-[1.01]'
                            : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-950/60'
                        }`}
                      >
                        <div>
                          
                          {/* Unit Badges & Status */}
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
                              {unit.code}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isPilot
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}>
                              {isPilot ? 'Sílabo Publicado (Piloto)' : unit.status}
                            </span>
                          </div>

                          {/* Unit Title */}
                          <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 mb-2">
                            {unit.name}
                          </h4>

                          <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                            {unit.notes || 'Unidad didáctica del plan mecatrónico.'}
                          </p>

                        </div>

                        {/* Card Footer Info */}
                        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                          <span className="font-medium text-slate-300 truncate max-w-[130px]">
                            {unit.level.split('—')[0]}
                          </span>
                          <span className="font-mono text-cyan-400 font-semibold group-hover:underline flex items-center gap-1">
                            Ver Sílabo <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </div>

                      </div>
                    );
                  })}
                </div>

              </div>
            );
          })}
      </div>

    </div>
  );
};
