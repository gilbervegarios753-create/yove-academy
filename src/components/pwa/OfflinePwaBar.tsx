import React from 'react';
import { useOffline } from '../../context/OfflineContext';
import { Wifi, WifiOff, RefreshCw, Download, CheckCircle2 } from 'lucide-react';

export const OfflinePwaBar: React.FC = () => {
  const { isOnline, pendingCount, isSyncing, canInstallPwa, installPwa, triggerSync, lastSyncedAt } = useOffline();

  return (
    <div 
      role="status" 
      aria-live="polite" 
      className="bg-slate-950/90 border-b border-slate-800 px-4 py-1.5 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-2 z-30"
    >
      <div className="flex items-center gap-2">
        {/* Status indicator badge */}
        {isOnline ? (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold text-[11px]">
            <Wifi className="w-3.5 h-3.5" />
            <span>En línea</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-[11px] animate-pulse">
            <WifiOff className="w-3.5 h-3.5" />
            <span>Modo Offline (Progreso Seguro)</span>
          </span>
        )}

        {/* Pending event count */}
        {pendingCount > 0 && (
          <span className="inline-flex items-center gap-1 text-slate-300 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
            <span>{pendingCount} {pendingCount === 1 ? 'cambio pendiente' : 'cambios pendientes por sincronizar'}</span>
          </span>
        )}

        {/* Syncing indicator */}
        {isSyncing && (
          <span className="inline-flex items-center gap-1 text-orange-400 font-medium text-[11px]">
            <RefreshCw className="w-3 h-3 animate-spin" />
            <span>Sincronizando...</span>
          </span>
        )}

        {/* Last synced timestamp */}
        {!isSyncing && lastSyncedAt && pendingCount === 0 && (
          <span className="hidden sm:inline-flex items-center gap-1 text-slate-400 text-[10px]">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Sincronizado {lastSyncedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Manual Sync Button if pending */}
        {pendingCount > 0 && isOnline && !isSyncing && (
          <button
            onClick={triggerSync}
            className="px-2.5 py-1 rounded bg-orange-600 hover:bg-orange-500 text-white font-bold text-[11px] transition flex items-center gap-1 cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-400"
            aria-label="Sincronizar cambios ahora"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Sincronizar</span>
          </button>
        )}

        {/* PWA Install Button */}
        {canInstallPwa && (
          <button
            onClick={installPwa}
            className="px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-[11px] shadow transition flex items-center gap-1 cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-300"
            aria-label="Instalar aplicación YOVE Academy en su dispositivo"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Instalar App PWA</span>
          </button>
        )}
      </div>
    </div>
  );
};
