import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole, ROLE_DETAILS } from '../../types/roles';
import { Shield, ChevronDown, Check, User, Sparkles, LogIn, LogOut } from 'lucide-react';
import { AuthModal } from './AuthModal';

export const RoleSwitcherBar: React.FC = () => {
  const { role, profile, user, isAuthenticated, switchRole, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const currentRoleInfo = ROLE_DETAILS[role];

  const rolesList: UserRole[] = ['SUPER_ADMIN', 'ADMIN', 'INSTITUTION_ADMIN', 'INSTRUCTOR', 'STUDENT', 'MODERATOR'];

  return (
    <>
      <div className="relative z-50">
        <div className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-xs py-1.5 px-4 flex items-center justify-between text-slate-300">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-slate-200">YOVE Academy 3.0 (Auth Real & RBAC)</span>
            <span className="hidden sm:inline text-slate-500">•</span>
            <span className="hidden sm:inline text-slate-400">{profile.fullName} ({user.email})</span>
          </div>

          <div className="flex items-center gap-2">
            {!isAuthenticated ? (
              <button
                onClick={() => { setAuthMode('login'); setAuthModalOpen(true); }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-600 hover:bg-orange-500 text-white font-medium transition cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Ingresar / Registrarse</span>
              </button>
            ) : (
              <button
                onClick={() => logout()}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium transition cursor-pointer"
                title="Cerrar sesión"
              >
                <LogOut className="w-3.5 h-3.5 text-red-400" />
                <span className="hidden sm:inline">Cerrar Sesión</span>
              </button>
            )}

            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium transition cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-orange-400" />
                <span>Rol: <strong className="text-orange-300">{currentRoleInfo.label}</strong></span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              {isOpen && (
                <>
                  <div className="fixed inset-0" onClick={() => setIsOpen(false)} />
                  <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-3 py-2 border-b border-slate-800 bg-slate-950/50">
                      <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-orange-400" />
                        Simulador RBAC Multimódulo
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Selecciona un rol para validar permisos y vistas adaptativas
                      </p>
                    </div>

                    <div className="py-1 space-y-0.5 max-h-80 overflow-y-auto">
                      {rolesList.map((r) => {
                        const info = ROLE_DETAILS[r];
                        const isSelected = r === role;
                        return (
                          <button
                            key={r}
                            onClick={() => {
                              switchRole(r);
                              setIsOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 flex items-start gap-2.5 hover:bg-slate-800 transition ${isSelected ? 'bg-slate-800/80' : ''}`}
                          >
                            <div className={`p-1.5 rounded-md border mt-0.5 ${info.badgeBg}`}>
                              <User className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-slate-200 text-xs">{info.label}</span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                              </div>
                              <p className="text-[10px] text-slate-400 leading-tight mt-0.5 line-clamp-2">
                                {info.description}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode={authMode}
      />
    </>
  );
};
