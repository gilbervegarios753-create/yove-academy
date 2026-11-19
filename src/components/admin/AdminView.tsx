import React, { useState, useEffect } from 'react';
import { ALL_COURSES_DATA } from '../../data/coursesData';
import { SAMPLE_CERTIFICATES } from '../../data/gamificationData';
import { INITIAL_USER_ACCOUNTS, INITIAL_REPORTS, INITIAL_ANALYTICS_DATA } from '../../data/monetizationData';
import { BRANDS_DATA, VEHICLE_BRANDS } from '../../data/brandsData';
import { MASTER_DTC_DATABASE as DTCS_DATABASE } from '../../data/dtcData';
import { ContentService } from '../../services/contentService';
import { UserAccount, ReportItem, UserRole, SubscriptionTier } from '../../types';
import {
  Settings,
  TrendingUp,
  Users,
  BookOpen,
  Award,
  ShieldCheck,
  Plus,
  Edit3,
  Trash2,
  Search,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Car,
  Cpu,
  BarChart3,
  ShieldAlert,
  Lock,
  DollarSign,
  Flag,
  Wrench,
  HelpCircle,
  Eye,
  Zap,
  Layers,
  Database
} from 'lucide-react';
import { FadeInOnScroll } from '../FadeInOnScroll';

interface AdminViewProps {
  currentRole?: UserRole;
  onChangeRole?: (role: UserRole) => void;
  onNavigateToView?: (view: any) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  currentRole = 'admin',
  onChangeRole,
  onNavigateToView
}) => {
  const [activeTab, setActiveTab] = useState<
    | 'stats'
    | 'users'
    | 'courses'
    | 'vehicle-hierarchy'
    | 'dtcs'
    | 'cases-labs'
    | 'certificates'
    | 'moderation'
    | 'ai-config'
  >('stats');

  const [analyticsPeriod, setAnalyticsPeriod] = useState<'7d' | '30d' | '90d' | '12m'>('30d');
  const [adminMetrics, setAdminMetrics] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('yove_token');
    if (token) {
      fetch(`/api/v1/analytics/admin?period=${analyticsPeriod}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setAdminMetrics(data.metrics);
          }
        })
        .catch(err => console.error("Error loading admin analytics:", err));
    }
  }, [analyticsPeriod]);

  // State management for users
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USER_ACCOUNTS);
  const [userSearch, setUserSearch] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');

  // State for moderation reports
  const [reports, setReports] = useState<ReportItem[]>(INITIAL_REPORTS);

  // Search in courses
  const [courseSearch, setCourseSearch] = useState('');

  // DTC search
  const [dtcSearch, setDtcSearch] = useState('');

  // Role Security Check
  if (currentRole !== 'admin') {
    return (
      <div className="py-24 bg-[#0a0e27] min-h-screen text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/5 border border-red-500/40 p-8 rounded-3xl text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-900/50 border border-red-500/50 flex items-center justify-center text-red-400">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-white">Acceso Restringido</h2>
          <p className="text-xs text-gray-300 leading-relaxed">
            Esta sección está reservada exclusivamente para el rol de **Administrador YOVE**. No tienes permisos para modificar configuraciones o datos sensibles.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onChangeRole && onChangeRole('admin')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff6f00] to-[#ff9100] font-extrabold text-xs text-white hover:opacity-90 shadow-lg cursor-pointer"
            >
              Simular Rol Administrador (Modo Demo)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = selectedRoleFilter === 'all' || u.role === selectedRoleFilter;
    return matchesSearch && matchesRole;
  });

  const handleToggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newStatus = u.status === 'active' ? 'suspended' : 'active';
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
  };

  const handleChangeUserTier = (userId: string, newTier: SubscriptionTier) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, subscriptionTier: newTier } : u))
    );
  };

  const handleResolveReport = (reportId: string, action: 'approve' | 'dismiss') => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: action === 'approve' ? 'approved' : 'dismissed' } : r))
    );
  };

  return (
    <div className="py-12 bg-[#0a0e27] min-h-screen text-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header with Role Switcher */}
        <FadeInOnScroll direction="up">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-900/60 text-[#ff9100] text-xs font-bold uppercase tracking-wider border border-blue-700/50">
                <Settings className="w-3.5 h-3.5 text-amber-400" />
                YOVE Admin // Control Panel v2.0
              </div>
              <h1 className="text-3xl font-extrabold text-white mt-1">
                Panel General de Administración & Analítica
              </h1>
              <p className="text-xs sm:text-sm text-gray-300">
                Supervisa el rendimiento académico, gestión de catálogo, usuarios, jerarquía de vehículos, IA y moderación.
              </p>
            </div>

            {/* Role Demo Switcher & Architecture Direct Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => onNavigateToView && onNavigateToView('content-studio')}
                className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-black px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition shadow-lg shadow-cyan-500/30 border border-cyan-400/40 animate-pulse"
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
                YOVE Content Studio (CMS)
              </button>

              <button
                onClick={() => onNavigateToView && onNavigateToView('arquitectura-cloud')}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition shadow-lg shadow-cyan-500/20"
              >
                <Layers className="w-4 h-4 text-cyan-200" />
                Arquitectura Cloud (100k)
              </button>
              <button
                onClick={() => onNavigateToView && onNavigateToView('ventas-admin')}
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition shadow-lg shadow-amber-500/20"
              >
                <DollarSign className="w-4 h-4 text-amber-200" />
                Centro de Ventas
              </button>
              <div className="flex items-center gap-2 bg-black/50 p-1.5 rounded-2xl border border-white/10">
                <span className="text-[10px] font-bold text-gray-400 uppercase pl-2">Rol Actual:</span>
                <select
                  value={currentRole}
                  onChange={(e) => onChangeRole && onChangeRole(e.target.value as UserRole)}
                  className="bg-[#0f173a] text-xs font-bold text-amber-400 px-3 py-1 rounded-xl border border-white/20 focus:outline-none cursor-pointer"
                >
                  <option value="admin">Administrador (Acceso Total)</option>
                  <option value="instructor">Instructor</option>
                  <option value="student">Estudiante</option>
                </select>
              </div>
            </div>
          </div>
        </FadeInOnScroll>

        {/* Global Analytics Overview Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <div className="text-[10px] text-gray-400 font-bold uppercase">Usuarios Activos</div>
            <div className="text-2xl font-black text-white">{INITIAL_ANALYTICS_DATA.activeUsersMonthly.toLocaleString()}</div>
            <div className="text-[9px] text-emerald-400 font-bold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              +14% mensual
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <div className="text-[10px] text-gray-400 font-bold uppercase">Cursos Vistos</div>
            <div className="text-2xl font-black text-[#ff9100]">{INITIAL_ANALYTICS_DATA.totalCoursesViewed.toLocaleString()}</div>
            <div className="text-[9px] text-gray-400">50+ Cursos Activos</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <div className="text-[10px] text-gray-400 font-bold uppercase">Tasa Finalización</div>
            <div className="text-2xl font-black text-emerald-400">{INITIAL_ANALYTICS_DATA.averageCompletionRate}%</div>
            <div className="text-[9px] text-emerald-300">Promedio general</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <div className="text-[10px] text-gray-400 font-bold uppercase">Horas Lectivas</div>
            <div className="text-2xl font-black text-blue-400">{INITIAL_ANALYTICS_DATA.totalStudyHours.toLocaleString()}h</div>
            <div className="text-[9px] text-blue-300">Taller y Teoría</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <div className="text-[10px] text-gray-400 font-bold uppercase">Consultas IA YOVE</div>
            <div className="text-2xl font-black text-amber-400">{INITIAL_ANALYTICS_DATA.totalAIQueriesHandled.toLocaleString()}</div>
            <div className="text-[9px] text-amber-300">Asistente Diagnóstico</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <div className="text-[10px] text-gray-400 font-bold uppercase">Ingresos Est. (Susc)</div>
            <div className="text-2xl font-black text-emerald-400">${INITIAL_ANALYTICS_DATA.monthlyRevenueEstUSD.toLocaleString()}</div>
            <div className="text-[9px] text-gray-400">USD / mes</div>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 border-b border-white/10">
          <button
            onClick={() => onNavigateToView && onNavigateToView('ventas-admin')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:from-amber-400 hover:to-amber-500 shadow-md transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Ventas YOVE PAYMENTS</span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'stats' ? 'bg-[#ff6f00] text-white shadow' : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Analítica</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'users' ? 'bg-[#ff6f00] text-white shadow' : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Usuarios & Suscripciones</span>
          </button>

          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'courses' ? 'bg-[#ff6f00] text-white shadow' : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Cursos ({ALL_COURSES_DATA.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('vehicle-hierarchy')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'vehicle-hierarchy' ? 'bg-[#ff6f00] text-white shadow' : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>Marcas, Modelos & Motores</span>
          </button>

          <button
            onClick={() => setActiveTab('dtcs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'dtcs' ? 'bg-[#ff6f00] text-white shadow' : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Códigos DTC ({DTCS_DATABASE.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('cases-labs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'cases-labs' ? 'bg-[#ff6f00] text-white shadow' : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Casos & Labs</span>
          </button>

          <button
            onClick={() => setActiveTab('certificates')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'certificates' ? 'bg-[#ff6f00] text-white shadow' : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Certificados</span>
          </button>

          <button
            onClick={() => setActiveTab('moderation')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'moderation' ? 'bg-[#ff6f00] text-white shadow' : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            <Flag className="w-3.5 h-3.5" />
            <span>Moderación ({reports.filter(r => r.status === 'pending').length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ai-config')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'ai-config' ? 'bg-[#ff6f00] text-white shadow' : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>IA & Config</span>
          </button>
        </div>

        {/* TAB 1: STATS & ANALYTICS */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#ff9100]" />
                Analítica del Sistema Basada en Datos Reales
              </h3>
              
              <div className="flex bg-black/40 p-1 rounded-xl border border-white/10 text-xs font-bold">
                {(['7d', '30d', '90d', '12m'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setAnalyticsPeriod(p)}
                    className={`px-3 py-1.5 rounded-lg transition ${
                      analyticsPeriod === p ? 'bg-[#ff6f00] text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {p === '7d' ? '7 días' : p === '30d' ? '30 días' : p === '90d' ? '90 días' : '12 meses'}
                  </button>
                ))}
              </div>
            </div>

            {adminMetrics ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-[10px] text-gray-400 font-bold uppercase">Estudiantes Activos</div>
                  <div className="text-2xl font-black text-white">{adminMetrics.activeStudents}</div>
                  <div className="text-[9px] text-emerald-400 font-bold">Con actividad en periodo</div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-[10px] text-gray-400 font-bold uppercase">Usuarios Nuevos</div>
                  <div className="text-2xl font-black text-[#ff9100]">{adminMetrics.newUsers}</div>
                  <div className="text-[9px] text-gray-400">Registrados en periodo</div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-[10px] text-gray-400 font-bold uppercase">Cursos Inscritos</div>
                  <div className="text-2xl font-black text-blue-400">{adminMetrics.coursesEnrolled}</div>
                  <div className="text-[9px] text-blue-300">Total acumulado</div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-[10px] text-gray-400 font-bold uppercase">Cursos Iniciados</div>
                  <div className="text-2xl font-black text-amber-400">{adminMetrics.coursesStarted}</div>
                  <div className="text-[9px] text-amber-300">En periodo</div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-[10px] text-gray-400 font-bold uppercase">Cursos Completados</div>
                  <div className="text-2xl font-black text-emerald-400">{adminMetrics.coursesCompleted}</div>
                  <div className="text-[9px] text-emerald-300">Total histórico</div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-[10px] text-gray-400 font-bold uppercase">Lecciones Completadas</div>
                  <div className="text-2xl font-black text-purple-400">{adminMetrics.lessonsCompleted}</div>
                  <div className="text-[9px] text-purple-300">En periodo</div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-[10px] text-gray-400 font-bold uppercase">Quizzes / Exámenes</div>
                  <div className="text-2xl font-black text-pink-400">{adminMetrics.quizzesCompleted} / {adminMetrics.examsCompleted}</div>
                  <div className="text-[9px] text-pink-300">Evaluaciones rendidas</div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-[10px] text-gray-400 font-bold uppercase">Certificados Emitidos</div>
                  <div className="text-2xl font-black text-amber-300">{adminMetrics.certificatesIssued}</div>
                  <div className="text-[9px] text-gray-400">En periodo</div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-[10px] text-gray-400 font-bold uppercase">Casos & Labs</div>
                  <div className="text-2xl font-black text-blue-300">{adminMetrics.casesCount} / {adminMetrics.labsCount}</div>
                  <div className="text-[9px] text-gray-400">Prácticas realizadas</div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-[10px] text-gray-400 font-bold uppercase">YOVE AI Consultas</div>
                  <div className="text-2xl font-black text-amber-400">{adminMetrics.aiRequestsCount}</div>
                  <div className="text-[9px] text-gray-400">Asistente virtual</div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-[10px] text-gray-400 font-bold uppercase">Publicaciones Comunidad</div>
                  <div className="text-2xl font-black text-emerald-400">{adminMetrics.communityPostsCount}</div>
                  <div className="text-[9px] text-gray-400">En periodo</div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-[10px] text-gray-400 font-bold uppercase">Búsquedas Totales</div>
                  <div className="text-2xl font-black text-blue-400">{adminMetrics.searchesCount}</div>
                  <div className="text-[9px] text-gray-400">En periodo</div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-gray-400 text-xs">Cargando analíticas reales...</div>
            )}

            {/* Subscriptions breakdown */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                Distribución de Cuentas & Suscripciones (Base Real)
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                {adminMetrics?.subscriptionsBreakdown?.map((sub: any) => (
                  <div key={sub.subscription} className="p-4 rounded-xl bg-black/40 border border-white/10">
                    <div className="text-[10px] font-bold text-gray-400 uppercase">{sub.subscription}</div>
                    <div className="text-2xl font-black text-white mt-1">{sub.cnt}</div>
                    <div className="text-[10px] text-emerald-400 font-bold">cuentas</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USERS & SUBSCRIPTIONS */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Buscar usuario por nombre o email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-white text-xs focus:outline-none focus:border-[#ff6f00]"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-bold">Filtrar Rol:</span>
                <select
                  value={selectedRoleFilter}
                  onChange={(e) => setSelectedRoleFilter(e.target.value)}
                  className="bg-black/50 text-xs font-bold text-white px-3 py-2 rounded-xl border border-white/20"
                >
                  <option value="all">Todos los Roles</option>
                  <option value="student">Estudiantes</option>
                  <option value="instructor">Instructores</option>
                  <option value="admin">Administradores</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5">
              <table className="w-full text-left text-xs">
                <thead className="bg-black/40 text-gray-400 uppercase font-bold border-b border-white/10">
                  <tr>
                    <th className="p-4">Usuario</th>
                    <th className="p-4">Rol</th>
                    <th className="p-4">Plan / Suscripción</th>
                    <th className="p-4">País</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-white/5 transition">
                      <td className="p-4 font-bold text-white flex items-center gap-3">
                        <img
                          src={u.avatarUrl}
                          alt={u.fullName}
                          className="w-8 h-8 rounded-full object-cover border border-white/20"
                        />
                        <div>
                          <div>{u.fullName}</div>
                          <div className="text-[10px] text-gray-400 font-normal">{u.email}</div>
                        </div>
                      </td>
                      <td className="p-4 font-bold capitalize">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${
                          u.role === 'admin' ? 'bg-purple-900/60 text-purple-300' :
                          u.role === 'instructor' ? 'bg-blue-900/60 text-blue-300' :
                          'bg-gray-800 text-gray-300'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 font-bold uppercase">
                        <select
                          value={u.subscriptionTier}
                          onChange={(e) => handleChangeUserTier(u.id, e.target.value as SubscriptionTier)}
                          className="bg-black/60 text-[10px] font-bold text-amber-400 px-2.5 py-1 rounded-lg border border-white/20"
                        >
                          <option value="free">FREE</option>
                          <option value="premium">PREMIUM</option>
                          <option value="pro">PRO</option>
                          <option value="institution">INSTITUTION</option>
                        </select>
                      </td>
                      <td className="p-4">{u.country || 'N/A'}</td>
                      <td className="p-4 font-bold">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${
                          u.status === 'active' ? 'bg-emerald-900/60 text-emerald-300' : 'bg-red-900/60 text-red-300'
                        }`}>
                          {u.status === 'active' ? 'Activo' : 'Suspendido'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleToggleUserStatus(u.id)}
                          className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-xs font-bold text-white cursor-pointer"
                        >
                          {u.status === 'active' ? 'Suspender' : 'Activar'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: COURSES & CATEGORIES */}
        {activeTab === 'courses' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-base text-white">Catálogo de Cursos ({ALL_COURSES_DATA.length})</h3>
              <button className="px-4 py-2 rounded-xl bg-[#ff6f00] hover:bg-[#ff8f00] font-bold text-xs text-white flex items-center gap-1 cursor-pointer">
                <Plus className="w-4 h-4" />
                Agregar Curso
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5">
              <table className="w-full text-left text-xs">
                <thead className="bg-black/40 text-gray-400 uppercase font-bold border-b border-white/10">
                  <tr>
                    <th className="p-4">Curso</th>
                    <th className="p-4">Categoría</th>
                    <th className="p-4">Duración</th>
                    <th className="p-4">Precio</th>
                    <th className="p-4">Nivel</th>
                    <th className="p-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300">
                  {ALL_COURSES_DATA.map((course) => (
                    <tr key={course.id} className="hover:bg-white/5 transition">
                      <td className="p-4 font-bold text-white flex items-center gap-2">
                        <span>{course.icon}</span>
                        <span>{course.title}</span>
                      </td>
                      <td className="p-4">{course.categoryLabel}</td>
                      <td className="p-4">{course.duration}</td>
                      <td className="p-4 text-emerald-400 font-bold">${course.price} USD</td>
                      <td className="p-4">{course.level}</td>
                      <td className="p-4 text-right space-x-2">
                        <button className="p-1.5 rounded bg-white/10 hover:bg-white/20 text-white cursor-pointer">
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: VEHICLE HIERARCHY (MARCAS, MODELOS, MOTORES, SISTEMAS) */}
        {activeTab === 'vehicle-hierarchy' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Car className="w-5 h-5 text-amber-400" />
                  Jerarquía de Marcas Automotrices Reguladas
                </h3>
                <button className="px-3.5 py-1.5 rounded-xl bg-[#ff6f00] text-xs font-bold text-white flex items-center gap-1 cursor-pointer">
                  <Plus className="w-4 h-4" />
                  Nueva Marca
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {VEHICLE_BRANDS.map((brand) => (
                  <div key={brand.id} className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-extrabold text-sm text-white flex items-center gap-1.5">
                        <span>{brand.logo}</span>
                        <span>{brand.name}</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-900/60 text-blue-300">
                        {brand.country}
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-400">
                      <strong>Modelos Populares:</strong> {brand.popularModels.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: DTCS */}
        {activeTab === 'dtcs' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base text-white">Banco Maestro DTC PRO ({ContentService.getAllDtcs().length})</h3>
                <p className="text-xs text-gray-400">Base de datos estructurada con árbol de procedimientos de diagnóstico paso a paso</p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5">
              <table className="w-full text-left text-xs">
                <thead className="bg-black/40 text-gray-400 uppercase font-bold border-b border-white/10">
                  <tr>
                    <th className="p-4">Código DTC</th>
                    <th className="p-4">Categoría</th>
                    <th className="p-4">Título / Descripción</th>
                    <th className="p-4">Sistema</th>
                    <th className="p-4">Procedimiento</th>
                    <th className="p-4">Severidad</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300">
                  {ContentService.getAllDtcs().map((dtc) => (
                    <tr key={dtc.code} className="hover:bg-white/5 transition">
                      <td className="p-4 font-mono font-black text-[#ff9100] text-sm">{dtc.code}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-bold text-gray-300 border border-white/15">
                          {dtc.category}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-white">{dtc.title || dtc.code}</div>
                        <div className="text-[11px] text-gray-400 line-clamp-1">{dtc.description}</div>
                      </td>
                      <td className="p-4">{dtc.system}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
                          {dtc.diagnosticProcedure?.length || 0} Pasos ISO
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          dtc.severity === 'Crítica' ? 'bg-red-900/60 text-red-300' :
                          dtc.severity === 'Alta' ? 'bg-orange-900/60 text-orange-300' :
                          'bg-blue-900/60 text-blue-300'
                        }`}>
                          {dtc.severity}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: CASES & LABS */}
        {activeTab === 'cases-labs' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                Casos Diagnósticos Reales (3,210 Solucionados)
              </h3>
              <p className="text-xs text-gray-300">
                Banco de fallas documentadas con vehículo, código DTC, árbol de fallas y oscilogramas de referencia.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-blue-400" />
                Laboratorios Virtuales & Simuladores (15 Módulos)
              </h3>
              <p className="text-xs text-gray-300">
                Simuladores interactivos de osciloscopio 4 canales, generador PWM de inyectores y escáner CAN Bus.
              </p>
            </div>
          </div>
        )}

        {/* TAB 7: CERTIFICATES */}
        {activeTab === 'certificates' && (
          <div className="space-y-4">
            <h3 className="font-bold text-base text-white">Certificados Oficiales Emitidos</h3>
            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5">
              <table className="w-full text-left text-xs">
                <thead className="bg-black/40 text-gray-400 uppercase font-bold border-b border-white/10">
                  <tr>
                    <th className="p-4">Código Único</th>
                    <th className="p-4">Estudiante</th>
                    <th className="p-4">Especialización</th>
                    <th className="p-4">Fecha Emisión</th>
                    <th className="p-4">Horas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300">
                  {SAMPLE_CERTIFICATES.map((cert) => (
                    <tr key={cert.code} className="hover:bg-white/5 transition">
                      <td className="p-4 font-mono font-bold text-[#ff9100]">{cert.code}</td>
                      <td className="p-4 font-bold text-white">{cert.studentName}</td>
                      <td className="p-4">{cert.courseTitle}</td>
                      <td className="p-4">{cert.issueDate}</td>
                      <td className="p-4">{cert.hours} hrs</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 8: MODERATION */}
        {activeTab === 'moderation' && (
          <div className="space-y-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Flag className="w-5 h-5 text-red-400" />
              Cola de Publicaciones Reportadas por la Comunidad
            </h3>

            {reports.length === 0 ? (
              <div className="p-8 text-center bg-white/5 rounded-2xl border border-white/10 text-xs text-gray-400">
                No hay publicaciones pendientes de revisión.
              </div>
            ) : (
              <div className="space-y-3">
                {reports.map((rep) => (
                  <div key={rep.id} className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="font-bold text-sm text-white">{rep.postTitle}</div>
                      <div className="text-xs text-amber-300 mt-0.5">Motivo: {rep.reason}</div>
                      <div className="text-[10px] text-gray-400">Reportado por {rep.reporterName} • {rep.date}</div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {rep.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => handleResolveReport(rep.id, 'dismiss')}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white cursor-pointer"
                          >
                            Aprobar Post (Conservar)
                          </button>
                          <button
                            onClick={() => handleResolveReport(rep.id, 'approve')}
                            className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-xs font-bold text-white cursor-pointer"
                          >
                            Eliminar Publicación
                          </button>
                        </>
                      ) : (
                        <span className="text-xs font-bold text-emerald-400">Revisado ({rep.status})</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 9: AI CONFIG & SECURITY */}
        {activeTab === 'ai-config' && (
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-6">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Configuración del Modelo de Inteligencia Artificial (YOVE AI)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-gray-400 font-bold uppercase text-[10px]">SDK & Modelo Activo</label>
                <input
                  type="text"
                  value="@google/genai (gemini-3.6-flash)"
                  disabled
                  className="w-full p-3 rounded-xl bg-black/60 border border-white/20 text-emerald-400 font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 font-bold uppercase text-[10px]">Arquitectura de Seguridad</label>
                <input
                  type="text"
                  value="Servidor Full-Stack (/api/ai/chat) - Sin exposición de API Keys"
                  disabled
                  className="w-full p-3 rounded-xl bg-black/60 border border-white/20 text-blue-300 font-mono font-bold"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-amber-500/30 text-xs space-y-2">
              <div className="font-bold text-amber-400 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" />
                Seguridad de API Keys Cumplida
              </div>
              <p className="text-gray-300 leading-relaxed text-[11px]">
                Las claves sensibles están almacenadas de forma segura en las variables de entorno del servidor sin exponerlas en el código del cliente.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
