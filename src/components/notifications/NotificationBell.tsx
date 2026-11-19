import React, { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { 
  Bell, CheckCheck, ExternalLink, Info, Award, MessageSquare, 
  BookOpen, TrendingUp, FileCheck, Wrench, FlaskConical, Sparkles, CreditCard, Trash2, Filter 
} from 'lucide-react';

interface NotificationBellProps {
  onNavigate?: (view: any) => void;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ onNavigate }) => {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    filterType,
    setFilterType,
    filterRead,
    setFilterRead 
  } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const getIcon = (type: string) => {
    switch (type) {
      case 'Certificado':
        return <Award className="w-4 h-4 text-emerald-400" />;
      case 'Community':
        return <MessageSquare className="w-4 h-4 text-blue-400" />;
      case 'Curso':
        return <BookOpen className="w-4 h-4 text-amber-400" />;
      case 'Progreso':
        return <TrendingUp className="w-4 h-4 text-purple-400" />;
      case 'Examen':
        return <FileCheck className="w-4 h-4 text-pink-400" />;
      case 'Case':
        return <Wrench className="w-4 h-4 text-orange-400" />;
      case 'Lab':
        return <FlaskConical className="w-4 h-4 text-teal-400" />;
      case 'YOVE AI':
        return <Sparkles className="w-4 h-4 text-yellow-400" />;
      case 'Suscripción':
        return <CreditCard className="w-4 h-4 text-indigo-400" />;
      case 'Sistema':
      default:
        return <Info className="w-4 h-4 text-slate-400" />;
    }
  };

  const typesList = ['all', 'Curso', 'Progreso', 'Certificado', 'Examen', 'Community', 'Case', 'Lab', 'YOVE AI', 'Suscripción', 'Sistema'];

  const filteredNotifications = notifications.filter(n => {
    if (filterType !== 'all' && n.type !== filterType) return false;
    if (filterRead === 'unread' && n.isRead) return false;
    if (filterRead === 'read' && !n.isRead) return false;
    return true;
  });

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
        title="Notificaciones"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-extrabold flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 sm:w-[420px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl py-3 z-50 overflow-hidden text-xs">
            
            {/* Header */}
            <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">Centro de Notificaciones</span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-[10px] font-semibold">
                    {unreadCount} sin leer
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-slate-400 hover:text-white transition flex items-center gap-1 text-[11px]"
                    title="Marcar todas como leídas"
                  >
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Todas leídas</span>
                  </button>
                )}
              </div>
            </div>

            {/* Filters Bar */}
            <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800 flex flex-wrap gap-1.5 items-center">
              <div className="flex items-center gap-1 text-slate-400 text-[10px] uppercase font-bold mr-1">
                <Filter className="w-3 h-3" /> Filtrar:
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-slate-200 text-[11px] rounded px-2 py-1 outline-none"
              >
                <option value="all">Todos los Tipos</option>
                {typesList.filter(t => t !== 'all').map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>

              <select
                value={filterRead}
                onChange={(e) => setFilterRead(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-slate-200 text-[11px] rounded px-2 py-1 outline-none"
              >
                <option value="all">Todos (Leídas y No leídas)</option>
                <option value="unread">No leídas</option>
                <option value="read">Leídas</option>
              </select>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto divide-y divide-slate-800/50">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  No hay notificaciones para los filtros seleccionados.
                </div>
              ) : (
                filteredNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3.5 hover:bg-slate-800/80 transition flex gap-3 relative group ${
                      !notif.isRead ? 'bg-slate-800/40 border-l-2 border-l-orange-500' : 'opacity-80'
                    }`}
                  >
                    <div 
                      onClick={() => {
                        if (!notif.isRead) markAsRead(notif.id);
                        if (notif.linkUrl && onNavigate) {
                          onNavigate(notif.linkUrl);
                          setIsOpen(false);
                        }
                      }}
                      className="flex gap-3 flex-1 cursor-pointer min-w-0"
                    >
                      <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 h-fit mt-0.5 shrink-0">
                        {getIcon(notif.type)}
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-1">
                          <div className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[9px] font-bold uppercase">
                              {notif.type}
                            </span>
                            <span className={`font-semibold text-white ${!notif.isRead ? 'text-orange-200' : ''}`}>
                              {notif.title}
                            </span>
                          </div>
                          {!notif.isRead && (
                            <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                          )}
                        </div>
                        <p className="text-slate-400 line-clamp-2 leading-relaxed">
                          {notif.message}
                        </p>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] text-slate-500">
                            {new Date(notif.createdAt).toLocaleDateString()} {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {notif.linkUrl && (
                            <span className="inline-flex items-center gap-1 text-orange-400 font-medium text-[10px] hover:underline">
                              Ver detalle <ExternalLink className="w-2.5 h-2.5" />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Delete button on hover */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notif.id);
                      }}
                      className="absolute right-2 top-2 p-1 text-slate-500 hover:text-red-400 bg-slate-900/80 rounded opacity-0 group-hover:opacity-100 transition"
                      title="Eliminar notificación"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-slate-800 text-center text-[10px] text-slate-500">
              Sistema de Notificaciones Persistente YOVE 3.0 • Tiempo Real (SSE)
            </div>

          </div>
        </>
      )}
    </div>
  );
};
