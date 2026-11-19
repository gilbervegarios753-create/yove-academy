import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole, Permission, ROLE_DETAILS } from '../../types/roles';
import { ShieldAlert, Lock, UserCheck } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requiredPermission?: Permission;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  requiredPermission
}) => {
  const { role, hasPermission, hasRole, switchRole } = useAuth();

  let isAuthorized = true;

  if (allowedRoles && !hasRole(allowedRoles)) {
    isAuthorized = false;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    isAuthorized = false;
  }

  if (!isAuthorized) {
    const currentDetails = ROLE_DETAILS[role];

    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-slate-900 border border-red-500/30 rounded-2xl p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500" />
          
          <div className="inline-flex p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 mb-2">
            <ShieldAlert className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white tracking-wide">Acceso Restringido</h2>
            <p className="text-sm text-slate-400">
              Esta sección requiere permisos elevados que no están asignados a tu rol actual (<span className="text-white font-semibold">{currentDetails?.label}</span>).
            </p>
          </div>

          {allowedRoles && allowedRoles.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-left space-y-2">
              <div className="text-xs uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-orange-400" />
                Roles Autorizados:
              </div>
              <div className="flex flex-wrap gap-2">
                {allowedRoles.map(r => (
                  <span key={r} className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${ROLE_DETAILS[r]?.badgeBg}`}>
                    {ROLE_DETAILS[r]?.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-slate-800 space-y-3">
            <p className="text-xs text-slate-500">
              ¿Deseas probar esta función en modo demo? Selecciona un rol con acceso:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {(allowedRoles || ['ADMIN', 'SUPER_ADMIN']).map(r => (
                <button
                  key={r}
                  onClick={() => switchRole(r)}
                  className="px-3 py-1.5 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 text-orange-300 text-xs font-medium transition flex items-center gap-1"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  Cambiar a {ROLE_DETAILS[r]?.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
