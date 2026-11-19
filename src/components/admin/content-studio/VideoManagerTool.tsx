import React, { useState } from 'react';
import { Youtube, CheckCircle2, AlertTriangle, Music, XCircle, Eye, Play, Info, Video, Link2 } from 'lucide-react';

interface VideoManagerToolProps {
  videoUrl: string;
  videoStatus?: string;
  onChangeUrl: (url: string, status: string) => void;
}

export const VideoManagerTool: React.FC<VideoManagerToolProps> = ({
  videoUrl,
  videoStatus = 'VALID',
  onChangeUrl
}) => {
  const [inputUrl, setInputUrl] = useState(videoUrl || '');
  const [loading, setLoading] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [flagSelection, setFlagSelection] = useState<string[]>([]);

  const handleValidate = async () => {
    if (!inputUrl || inputUrl.trim().length === 0) {
      onChangeUrl('', 'VALID');
      setValidationResult(null);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/v1/content-studio/videos/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: inputUrl, flags: flagSelection })
      });
      const data = await res.json();
      setValidationResult(data);
      if (data.success) {
        onChangeUrl(inputUrl, data.status);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleFlag = (flag: string) => {
    let nextFlags = [...flagSelection];
    if (nextFlags.includes(flag)) {
      nextFlags = nextFlags.filter(f => f !== flag);
    } else {
      nextFlags.push(flag);
    }
    setFlagSelection(nextFlags);
  };

  return (
    <div className="bg-[#0f172a] border border-cyan-500/30 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <Youtube className="w-5 h-5 text-red-500" />
          Gestión de Video Educativo (YouTube & Enlaces)
        </h4>
        <span className="text-xs text-slate-400">Verificación y Control de Calidad Académica</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Link2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="Pegue la URL del video de YouTube (ej: https://www.youtube.com/watch?v=...)"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-200 focus:ring-2 focus:ring-cyan-500 outline-none"
          />
        </div>
        <button
          type="button"
          onClick={handleValidate}
          disabled={loading}
          className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition shrink-0"
        >
          {loading ? 'Validando...' : 'Validar Video'}
        </button>
      </div>

      {/* Flag controls */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 font-medium">Marcas de calidad:</span>
        <button
          type="button"
          onClick={() => toggleFlag('MUSIC')}
          className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition ${flagSelection.includes('MUSIC') ? 'bg-red-950/80 border-red-500 text-red-300' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
        >
          🎵 Video Musical (No Permitido)
        </button>
        <button
          type="button"
          onClick={() => toggleFlag('UNRELATED')}
          className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition ${flagSelection.includes('UNRELATED') ? 'bg-amber-950/80 border-amber-500 text-amber-300' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
        >
          🚫 No Relacionado con Mecatrónica
        </button>
        <button
          type="button"
          onClick={() => toggleFlag('PRIVATE')}
          className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition ${flagSelection.includes('PRIVATE') ? 'bg-purple-950/80 border-purple-500 text-purple-300' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
        >
          🔒 Video Privado / No Disponible
        </button>
      </div>

      {/* Result Status Display */}
      {validationResult && (
        <div className={`p-4 rounded-xl border text-xs ${
          validationResult.status === 'VALID' ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' :
          validationResult.status === 'MUSIC' || validationResult.status === 'UNRELATED' ? 'bg-red-950/40 border-red-500/40 text-red-300' :
          'bg-amber-950/40 border-amber-500/40 text-amber-300'
        }`}>
          <div className="flex items-center gap-2 font-bold mb-1">
            {validationResult.status === 'VALID' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-red-400" />}
            <span>Estado del Video: {validationResult.status}</span>
          </div>
          <p>{validationResult.message}</p>
          {(validationResult.status === 'MUSIC' || validationResult.status === 'UNRELATED') && (
            <p className="mt-1 font-semibold text-red-400">
              ⚠️ Regla de Calidad YOVE: Los videos marcados como música o no relacionados NO pueden asociarse a lecciones publicadas.
            </p>
          )}
        </div>
      )}

      {/* Video Preview Frame or "Sin video" Fallback */}
      {validationResult && validationResult.embedUrl ? (
        <div className="aspect-video bg-black rounded-xl overflow-hidden border border-slate-800 relative">
          <iframe
            src={validationResult.embedUrl}
            title="Vista Previa de Video Educativo"
            className="w-full h-full"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="p-8 border-2 border-dashed border-slate-800 rounded-xl text-center bg-slate-900/40">
          <Video className="w-10 h-10 mx-auto text-slate-600 mb-2" />
          <p className="text-slate-300 text-xs font-bold">Sin Video Registrado</p>
          <p className="text-slate-500 text-[11px] mt-0.5">
            Si no se adjunta video, los estudiantes verán el contenido en formato Guía Teórica Guiada / Texto Técnico ("Sin video").
          </p>
        </div>
      )}
    </div>
  );
};
