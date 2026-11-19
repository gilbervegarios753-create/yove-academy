import React, { useState } from 'react';
import {
  Building2, ShieldCheck, ExternalLink, Plus, BookOpen, FileText,
  Clock, CheckCircle2, AlertCircle, Search, Layers, RefreshCw
} from 'lucide-react';

interface SourceRegistryProps {
  sources?: any[];
  onRefresh: () => void;
}

export const CurriculumSourceRegistry: React.FC<SourceRegistryProps> = ({
  sources = [],
  onRefresh
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'DOCUMENTO_PDF_OFICIAL',
    institution: '',
    country: 'Perú',
    language: 'es',
    description: '',
    url: '',
    version: '2026',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/curriculum/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setFormData({
          name: '',
          type: 'DOCUMENTO_PDF_OFICIAL',
          institution: '',
          country: 'Perú',
          language: 'es',
          description: '',
          url: '',
          version: '2026',
          notes: ''
        });
        onRefresh();
      }
    } catch (error) {
      console.error("Error adding source:", error);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Actions */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/80 via-slate-900 to-indigo-950/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              REGISTRO OFICIAL DE FUENTES
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Traceability Rule: No Content Without Declared Source
            </span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">Registro de Fuentes Curriculares Base</h3>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Todas las unidades didácticas y sílabos de YOVE Academy conservan estrictamente la procedencia y la fecha de verificación de su documento base de referencia.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Registrar Nueva Fuente Oficial
        </button>
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(sources || []).map((src) => (
          <div key={src.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-lg">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-800 text-cyan-400 border border-slate-700">
                  {src.type}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" /> VERIFICADA
                </span>
              </div>

              <h4 className="text-base font-bold text-white mb-1">{src.name}</h4>
              <p className="text-xs text-cyan-300 font-medium mb-3 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" /> {src.institution} ({src.country})
              </p>

              <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-4">
                {src.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-2 text-xs text-slate-400 font-mono">
              <div className="flex items-center justify-between">
                <span>Versión / Año:</span>
                <strong className="text-slate-200">{src.version}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Fecha Acceso:</span>
                <strong className="text-slate-200">{src.accessDate || '2026-02-12'}</strong>
              </div>
              {src.documentPath && (
                <div className="mt-2 text-[11px] text-slate-400 truncate bg-slate-950 p-2 rounded border border-slate-800">
                  📄 {src.documentPath}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Source */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Registrar Nueva Fuente Curricular</h3>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Nombre de la Fuente / Documento</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Malla Curricular SENATI Mecatrónica 2026"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Tipo de Fuente</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  >
                    <option value="DOCUMENTO_PDF_OFICIAL">Documento PDF Oficial</option>
                    <option value="ESTÁNDAR_INTERNACIONAL">Estándar Internacional (SAE/ISO)</option>
                    <option value="MANUAL_FABRICANTE">Manual de Fabricante</option>
                    <option value="PROPUESTA_MAESTRA_YOVE">Propuesta Maestra YOVE</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Institución / Autor</label>
                  <input
                    type="text"
                    required
                    value={formData.institution}
                    onChange={e => setFormData({ ...formData, institution: e.target.value })}
                    placeholder="Ej: SENATI / Bosch / SAE"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Descripción / Alcance</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Resumen del contenido curricular..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
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
                  className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-bold"
                >
                  Guardar Fuente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
