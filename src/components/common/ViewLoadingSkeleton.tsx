import React from 'react';
import { Cpu } from 'lucide-react';

export const ViewLoadingSkeleton: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center" role="status" aria-label="Cargando contenido">
      <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 animate-bounce mb-4 shadow-lg">
        <Cpu className="w-6 h-6 animate-spin" />
      </div>
      <h3 className="text-lg font-bold text-white mb-1">Cargando Módulo YOVE Academy 3.0</h3>
      <p className="text-xs text-slate-400 max-w-sm">
        Optimizando recursos, imágenes y simuladores interactivos...
      </p>
      <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-4">
        <div className="h-full bg-gradient-to-r from-orange-500 to-amber-400 animate-pulse w-3/4 rounded-full" />
      </div>
    </div>
  );
};
