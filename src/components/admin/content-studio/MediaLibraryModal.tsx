import React, { useState, useEffect } from 'react';
import { FileText, Image as ImageIcon, File, Upload, Trash2, Search, ExternalLink, ShieldAlert, CheckCircle2, X, Download, Filter } from 'lucide-react';

interface MediaItem {
  id: string;
  name: string;
  originalName: string;
  fileType: 'PDF' | 'IMAGE' | 'PRESENTATION' | 'DOCUMENT' | 'VIDEO' | 'OTHER';
  mimeType: string;
  sizeBytes: number;
  url: string;
  author?: string;
  sourceType?: string;
  sourceName?: string;
  license?: string;
  notes?: string;
  createdAt: string;
}

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMedia?: (media: MediaItem) => void;
}

export const MediaLibraryModal: React.FC<MediaLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectMedia
}) => {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Upload state
  const [uploadOpen, setUploadOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState<'PDF' | 'IMAGE' | 'PRESENTATION' | 'DOCUMENT'>('PDF');
  const [author, setAuthor] = useState('YOVE Studio');
  const [sourceType, setSourceType] = useState('YOVE_ORIGINAL');
  const [sourceName, setSourceName] = useState('YOVE Content Studio');
  const [license, setLicense] = useState('Proprietary Educational License');
  const [notes, setNotes] = useState('');
  const [base64File, setBase64File] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [mimeType, setMimeType] = useState('');
  const [uploadError, setUploadError] = useState('');

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/content-studio/media?fileType=${filterType}&search=${encodeURIComponent(searchTerm)}`);
      const data = await res.json();
      if (data.success) {
        setMediaList(data.media);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen, filterType, searchTerm]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFileName(file.name);
    setFileName(file.name.replace(/\.[^/.]+$/, ""));
    setMimeType(file.type);

    const reader = new FileReader();
    reader.onloadend = () => {
      setBase64File(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError('');

    if (!base64File) {
      setUploadError('Por favor seleccione un archivo para subir.');
      return;
    }

    try {
      const res = await fetch('/api/v1/content-studio/media/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fileName,
          originalName: selectedFileName,
          fileType,
          mimeType,
          base64Data: base64File,
          author,
          sourceType,
          sourceName,
          license,
          notes
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Error subiendo archivo');
      }

      setUploadOpen(false);
      setBase64File(null);
      setSelectedFileName('');
      fetchMedia();
    } catch (err: any) {
      setUploadError(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Está seguro de eliminar este recurso de la biblioteca multimedia?')) return;
    try {
      await fetch(`/api/v1/content-studio/media/${id}`, { method: 'DELETE' });
      fetchMedia();
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0f172a] border border-cyan-500/30 w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-[#1e293b]/80 border-b border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-cyan-950/60 border border-cyan-500/40 rounded-2xl text-cyan-400">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Biblioteca Multimedia Académica (Media Library)</h3>
              <p className="text-xs text-slate-400">Gestione PDFs, Imágenes, Documentos y Recursos Educativos reutilizables.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar & Filter */}
        <div className="p-4 bg-[#0a0e27] border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-[280px]">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Buscar recursos por título, autor o fuente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:ring-2 focus:ring-cyan-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 p-1 rounded-xl">
              {['ALL', 'PDF', 'IMAGE', 'DOCUMENT', 'PRESENTATION'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition ${filterType === type ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setUploadOpen(!uploadOpen)}
            className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-cyan-900/40 transition"
          >
            <Upload className="w-4 h-4" /> Subir Nuevo Recurso
          </button>
        </div>

        {/* Upload Drawer / Form */}
        {uploadOpen && (
          <form onSubmit={handleUploadSubmit} className="p-6 bg-[#131d38] border-b border-cyan-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                <Upload className="w-4 h-4" /> Carga Segura de Archivos Educativos
              </h4>
              <span className="text-xs text-slate-400">PDF, PNG, JPG, WEBP, DOCX, XLSX (Máx 50MB)</span>
            </div>

            {uploadError && (
              <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-xs text-red-300 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400" /> {uploadError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Seleccionar Archivo</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.png,.jpg,.jpeg,.webp,.svg,.docx,.xlsx,.pptx"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-slate-300 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-cyan-600 file:text-white hover:file:bg-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Nombre del Recurso</label>
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="Ej: Manual de Inyección GDI Bosch"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Tipo de Recurso</label>
                <select
                  value={fileType}
                  onChange={(e: any) => setFileType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="PDF">PDF (Guía / Manual Técnico)</option>
                  <option value="IMAGE">IMAGEN (Diagrama / Esquema / Foto)</option>
                  <option value="DOCUMENT">DOCUMENTO (Word / Excel / Documento)</option>
                  <option value="PRESENTATION">PRESENTACIÓN (Diapositivas PPT/PDF)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Autor / Institución</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Ej: YOVE Academy / Bosch / Toyota OEM"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            {/* Copyright Warning */}
            <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
              <span>
                <strong>Aviso de Propiedad Intelectual:</strong> Verifique que posee autorización o que el recurso permite el uso educativo previo a su publicación en YOVE Academy.
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setUploadOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs hover:bg-slate-700 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition"
              >
                <CheckCircle2 className="w-4 h-4" /> Guardar en Galería
              </button>
            </div>
          </form>
        )}

        {/* Media Grid */}
        <div className="p-6 overflow-y-auto flex-1 bg-[#0a0e27]">
          {loading ? (
            <div className="text-center py-12 text-slate-400 text-xs">Cargando biblioteca multimedia...</div>
          ) : mediaList.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-slate-800 rounded-2xl">
              <FileText className="w-12 h-12 mx-auto text-slate-600 mb-2" />
              <p className="text-slate-400 text-sm font-semibold">No se encontraron recursos multimedia.</p>
              <p className="text-slate-500 text-xs mt-1">Haga clic en "Subir Nuevo Recurso" para cargar manuales, esquemas o diagramas.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mediaList.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 p-4 rounded-2xl flex flex-col justify-between space-y-3 transition group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2.5 bg-slate-800 rounded-xl text-cyan-400">
                        {item.fileType === 'IMAGE' ? <ImageIcon className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                      </div>
                      <div className="overflow-hidden">
                        <h5 className="text-xs font-bold text-white truncate" title={item.name}>{item.name}</h5>
                        <p className="text-[10px] text-slate-400 truncate">{item.originalName}</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold rounded-md uppercase">
                      {item.fileType}
                    </span>
                  </div>

                  {item.fileType === 'IMAGE' && item.url && (
                    <div className="h-28 bg-black/40 rounded-xl overflow-hidden flex items-center justify-center border border-slate-800">
                      <img src={item.url} alt={item.name} className="h-full object-contain" />
                    </div>
                  )}

                  <div className="text-[10px] text-slate-400 space-y-1">
                    <p><strong>Autor:</strong> {item.author || 'YOVE Academy'}</p>
                    <p><strong>Tamaño:</strong> {(item.sizeBytes / 1024).toFixed(1)} KB</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-400 hover:underline flex items-center gap-1 font-medium text-[11px]"
                    >
                      <Download className="w-3.5 h-3.5" /> Descargar / Ver
                    </a>

                    <div className="flex items-center gap-2">
                      {onSelectMedia && (
                        <button
                          onClick={() => {
                            onSelectMedia(item);
                            onClose();
                          }}
                          className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg text-[10px]"
                        >
                          Usar en Lección
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition"
                        title="Eliminar Recurso"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
