import React from 'react';
import { ViewMode } from '../../types';
import { Home, BookOpen, Car, Sparkles, FlaskConical, Wrench, Menu } from 'lucide-react';

interface MobileBottomBarProps {
  currentView: ViewMode;
  onNavigateView: (view: ViewMode) => void;
  onOpenMoreMenu: () => void;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  currentView,
  onNavigateView,
  onOpenMoreMenu
}) => {
  const items: { view: ViewMode; label: string; icon: React.ReactNode }[] = [
    { view: 'inicio', label: 'Inicio', icon: <Home className="w-5 h-5" /> },
    { view: 'cursos', label: 'Cursos', icon: <BookOpen className="w-5 h-5" /> },
    { view: 'garage', label: 'Garage', icon: <Car className="w-5 h-5" /> },
    { view: 'ai', label: 'YOVE AI', icon: <Sparkles className="w-5 h-5" /> },
    { view: 'lab', label: 'Lab', icon: <FlaskConical className="w-5 h-5" /> },
    { view: 'cases', label: 'Casos', icon: <Wrench className="w-5 h-5" /> }
  ];

  return (
    <nav 
      aria-label="Navegación inferior móvil" 
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-2 py-1 flex items-center justify-around shadow-2xl safe-area-pb"
    >
      {items.map((item) => {
        const isActive = currentView === item.view;
        return (
          <button
            key={item.view}
            onClick={() => onNavigateView(item.view)}
            className={`flex flex-col items-center justify-center py-1.5 px-2 min-w-[52px] min-h-[48px] rounded-xl transition cursor-pointer ${
              isActive 
                ? 'text-orange-400 font-bold bg-orange-500/10' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
            aria-label={`Ir a ${item.label}`}
            aria-current={isActive ? 'page' : undefined}
          >
            {item.icon}
            <span className="text-[10px] font-medium tracking-tight mt-0.5">{item.label}</span>
          </button>
        );
      })}

      <button
        onClick={onOpenMoreMenu}
        className="flex flex-col items-center justify-center py-1.5 px-2 min-w-[52px] min-h-[48px] rounded-xl text-slate-400 hover:text-slate-200 transition cursor-pointer"
        aria-label="Abrir menú completo de navegación"
      >
        <Menu className="w-5 h-5" />
        <span className="text-[10px] font-medium tracking-tight mt-0.5">Menú</span>
      </button>
    </nav>
  );
};
