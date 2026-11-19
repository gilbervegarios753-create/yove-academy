import React, { useState, useEffect } from 'react';
import { BookOpen, FileSpreadsheet, Plus, Upload, CheckCircle2, Download, Layers, Calendar, Award, RefreshCw, Save } from 'lucide-react';

interface Syllabus {
  id: string;
  courseId?: string;
  code: string;
  semester: string;
  title: string;
  competencies_json?: string;
  outcomes_json?: string;
  hours: number;
  credits: number;
  topics_json?: string;
  bibliography_json?: string;
  status: string;
  createdAt: string;
}

export const SyllabusCurriculumEditor: React.FC = () => {
  const [syllabi, setSyllabi] = useState<Syllabus[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'import' | 'grid'>('editor');

  // Form State
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [semester, setSemester] = useState('I');
  const [hours, setHours] = useState(45);
  const [credits, setCredits] = useState(3);
  const [competencies, setCompetencies] = useState('1. Comprender la arquitectura de la ECU y red CAN-Bus\n2. Realizar diagnóstico de sensores inductivos y Hall');
  const [topics, setTopics] = useState('Semana 1: Introducción a la Mecatrónica\nSemana 2: Sensores de Posición de Cigueñal (CKP/CMP)\nSemana 3: Diagnóstico con Osciloscopio');
  const [bibliography, setBibliography] = useState('1. Bosch Automotive Handbook 10th Ed.\n2. Manual Técnico de Sensores - YOVE Press');

  // Import State
  const [importJsonText, setImportJsonText] = useState('');
  const [importStatus, setImportStatus] = useState('');

  const fetchSyllabi = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/content-studio/syllabi');
      const data = await res.json();
      if (data.success) {
        setSyllabi(data.syllabi);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSyllabi();
  }, []);

  const handleCreateSyllabus = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/content-studio/syllabi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          code: code || `SYL-${Math.floor(100+Math.random()*900)}`,
          semester,
          hours: Number(hours),
          credits: Number(credits),
          competencies: competencies.split('\n').filter(Boolean),
          topics: topics.split('\n').filter(Boolean),
          bibliography: bibliography.split('\n').filter(Boolean)
        })
      });
      const data = await res.json();
      if (data.success) {
        setTitle('');
        setCode('');
        fetchSyllabi();
        alert('Sílabo académico registrado con éxito.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleBulkImport = async () => {
    try {
      setImportStatus('Procesando datos masivos...');
      let parsed = [];
      try {
        parsed = JSON.parse(importJsonText);
      } catch (err) {
        throw new Error('El formato JSON no es válido. Asegúrese de ingresar un arreglo JSON bien formado.');
      }

      const res = await fetch('/api/v1/content-studio/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coursesData: parsed })
      });
      const data = await res.json();
      if (data.success) {
        setImportStatus(`¡Importación exitosa! Agregados: ${data.summary.added}, Actualizados: ${data.summary.updated}`);
        fetchSyllabi();
      }
    } catch (err: any) {
      setImportStatus(`Error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Tabs */}
      <div className="flex items-center justify-between bg-[#0f172a] border border-cyan-500/30 p-2 rounded-2xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${activeTab === 'editor' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <BookOpen className="w-4 h-4" /> Editor de Sílabos
          </button>
          <button
            onClick={() => setActiveTab('grid')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${activeTab === 'grid' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <Layers className="w-4 h-4" /> Malla Curricular (Semestres I-VI)
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${activeTab === 'import' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <FileSpreadsheet className="w-4 h-4" /> Carga Masiva (Bulk Importer)
          </button>
        </div>
      </div>

      {/* Editor View */}
      {activeTab === 'editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <form onSubmit={handleCreateSyllabus} className="lg:col-span-1 bg-[#0f172a] border border-cyan-500/30 p-6 rounded-3xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-cyan-400" /> Crear / Registrar Sílabo
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Título de la Asignatura</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Inyección Electrónica y Redes CAN-Bus"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Código</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="MEC-201"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Semestre</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="I">Semestre I</option>
                  <option value="II">Semestre II</option>
                  <option value="III">Semestre III</option>
                  <option value="IV">Semestre IV</option>
                  <option value="V">Semestre V</option>
                  <option value="VI">Semestre VI</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Horas Totales</label>
                <input
                  type="number"
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Créditos</label>
                <input
                  type="number"
                  value={credits}
                  onChange={(e) => setCredits(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Competencias (una por línea)</label>
              <textarea
                value={competencies}
                onChange={(e) => setCompetencies(e.target.value)}
                rows={3}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Unidades y Temario por Semanas</label>
              <textarea
                value={topics}
                onChange={(e) => setTopics(e.target.value)}
                rows={3}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition"
            >
              <Save className="w-4 h-4" /> Guardar Sílabo
            </button>
          </form>

          {/* List */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span>Sílabos Académicos Registrados ({syllabi.length})</span>
              <button onClick={fetchSyllabi} className="text-xs text-cyan-400 flex items-center gap-1 hover:underline">
                <RefreshCw className="w-3.5 h-3.5" /> Actualizar
              </button>
            </h3>

            {syllabi.map((item) => (
              <div key={item.id} className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded-md uppercase mr-2">{item.code}</span>
                    <span className="text-[10px] text-slate-400">Semestre {item.semester}</span>
                    <h4 className="text-sm font-bold text-white mt-1">{item.title}</h4>
                  </div>
                  <div className="text-right text-xs text-slate-400">
                    <p><strong>{item.hours}h</strong> | <strong>{item.credits} Cr.</strong></p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid View */}
      {activeTab === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {['I', 'II', 'III', 'IV', 'V', 'VI'].map((sem) => (
            <div key={sem} className="bg-[#0f172a] border border-cyan-500/20 p-5 rounded-3xl space-y-3">
              <h4 className="text-sm font-bold text-cyan-400 border-b border-slate-800 pb-2">
                🎓 Semestre {sem}
              </h4>
              <div className="space-y-2">
                {syllabi.filter(s => s.semester === sem).length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-4">Sin sílabos asignados a este semestre.</p>
                ) : (
                  syllabi.filter(s => s.semester === sem).map(s => (
                    <div key={s.id} className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs">
                      <p className="font-bold text-white">{s.title}</p>
                      <p className="text-[10px] text-slate-400">{s.code} • {s.hours} horas • {s.credits} créditos</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bulk Importer */}
      {activeTab === 'import' && (
        <div className="bg-[#0f172a] border border-cyan-500/30 p-6 rounded-3xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-cyan-400" /> Carga Masiva de Cursos y Sílabos (JSON / CSV / XLSX)
          </h3>
          <p className="text-xs text-slate-400">
            Pegue la estructura de datos JSON con cursos y sílabos para importar masivamente al catálogo. El sistema validará duplicados y creará registros en borrador.
          </p>

          <textarea
            value={importJsonText}
            onChange={(e) => setImportJsonText(e.target.value)}
            placeholder={`[\n  {\n    "code": "MEC-101",\n    "title": "Electrónica Automotriz I",\n    "semester": "I",\n    "description": "Fundamentos de electricidad...",\n    "hours": 40,\n    "credits": 3\n  }\n]`}
            rows={10}
            className="w-full bg-[#0a0e27] border border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-200 outline-none focus:ring-2 focus:ring-cyan-500"
          />

          {importStatus && (
            <div className="p-3 bg-slate-900 border border-cyan-500/40 rounded-xl text-xs text-cyan-300">
              {importStatus}
            </div>
          )}

          <button
            onClick={handleBulkImport}
            className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition"
          >
            <Upload className="w-4 h-4" /> Procesar E Importar Datos
          </button>
        </div>
      )}
    </div>
  );
};
