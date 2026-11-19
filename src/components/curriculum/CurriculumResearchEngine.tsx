import React, { useState } from 'react';
import {
  Video, ExternalLink, Search, Filter, Plus, ShieldCheck,
  Youtube, CheckCircle2, AlertCircle, Clock, Play, FileText
} from 'lucide-react';

interface ResearchEngineProps {
  videos?: any[];
  onRefresh: () => void;
}

export const CurriculumResearchEngine: React.FC<ResearchEngineProps> = ({
  videos = [],
  onRefresh
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const safeVideos = videos || [];

  const filteredVideos = safeVideos.filter(vid => {
    const matchesStatus = statusFilter === 'all' || vid.status === statusFilter;
    const matchesSearch = !searchTerm || (
      vid.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vid.channel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vid.topic.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return matchesStatus && matchesSearch;
  });

  const [formData, setFormData] = useState({
    unitId: 'U_SEM1_02',
    title: '',
    channel: '',
    url: '',
    duration: '15:00',
    category: 'Sensores y Actuadores',
    level: 'NIVEL 1',
    topic: 'Diagnóstico con Osciloscopio',
    quality: '1080p HD',
    source: 'YouTube Educational',
    status: 'VALID_EDUCATIONAL'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/curriculum/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setFormData({
          unitId: 'U_SEM1_02',
          title: '',
          channel: '',
          url: '',
          duration: '15:00',
          category: 'Sensores y Actuadores',
          level: 'NIVEL 1',
          topic: 'Diagnóstico con Osciloscopio',
          quality: '1080p HD',
          source: 'YouTube Educational',
          status: 'VALID_EDUCATIONAL'
        });
        onRefresh();
      }
    } catch (error) {
      console.error("Error adding video:", error);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950 via-slate-900 to-emerald-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              INTERNET RESEARCH ENGINE
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Strict Verification: No Broken Links / Only Valid Educational
            </span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">Motor de Búsqueda y Validación Audiovisual</h3>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Indexación técnica de demostraciones prácticas, mediciones con osciloscopio y procedimientos reales de taller automotriz asociados a los temas del sílabo.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Indexar Nuevo Video Educativo
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por título, canal o tema..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full md:w-auto px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">Todos los Estados de Verificación ({safeVideos.length})</option>
            <option value="VALID_EDUCATIONAL">VALID_EDUCATIONAL (Verificado)</option>
            <option value="PARTIALLY_RELEVANT">PARTIALLY_RELEVANT</option>
            <option value="REJECTED">REJECTED (Rechazado)</option>
          </select>
        </div>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((vid) => (
          <div key={vid.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-lg group">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> {vid.status}
                </span>
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> {vid.duration}
                </span>
              </div>

              <h4 className="text-base font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors line-clamp-2">
                {vid.title}
              </h4>

              <p className="text-xs text-slate-400 mb-1">
                <strong>Canal:</strong> {vid.channel}
              </p>
              <p className="text-xs text-slate-400 mb-3">
                <strong>Tema:</strong> {vid.topic}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
              <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                {vid.quality || '1080p HD'}
              </span>
              <a
                href={vid.url}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs inline-flex items-center gap-1.5 transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-slate-950" /> Ver Video <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Video */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Indexar Video Educativo Verificado</h3>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Título del Video</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ej: Medición de Sensor CKP Inductivo con Osciloscopio"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Canal / Creador</label>
                  <input
                    type="text"
                    required
                    value={formData.channel}
                    onChange={e => setFormData({ ...formData, channel: e.target.value })}
                    placeholder="Ej: AutoTronic TV / Bosch Tech"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Duración (MM:SS)</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={e => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="15:30"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">URL Completa de YouTube</label>
                <input
                  type="url"
                  required
                  value={formData.url}
                  onChange={e => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Tema Asociado</label>
                  <input
                    type="text"
                    value={formData.topic}
                    onChange={e => setFormData({ ...formData, topic: e.target.value })}
                    placeholder="Ej: Osciloscopio y Sensores"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Estado de Validación</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  >
                    <option value="VALID_EDUCATIONAL">VALID_EDUCATIONAL</option>
                    <option value="PARTIALLY_RELEVANT">PARTIALLY_RELEVANT</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 font-bold"
                >
                  Indexar Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
