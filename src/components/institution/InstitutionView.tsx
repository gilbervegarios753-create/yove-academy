import React, { useState, useEffect } from 'react';
import {
  Building2,
  Users,
  GraduationCap,
  BookOpen,
  Award,
  Clock,
  Trophy,
  ShieldCheck,
  Plus,
  Key,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Layers,
  ChevronRight,
  Filter,
  UserCheck,
  Briefcase,
  Calendar,
  Lock,
  X,
  RefreshCw,
  Sparkles,
  TrendingUp,
  FileText
} from 'lucide-react';

interface Organization {
  id: string;
  name: string;
  code: string;
  type: string;
  logo: string;
  country: string;
  address: string;
  contact_email: string;
  contact_phone: string;
  status: string;
}

interface LicenseInfo {
  total: number;
  active: number;
  available: number;
  expired: number;
  planType: string;
  expirationDate: string;
}

interface CountsInfo {
  students: number;
  instructors: number;
  courses: number;
  groups: number;
  certificates: number;
  totalHours: number;
  evaluationsPassed: number;
}

interface StudentItem {
  id: string;
  email: string;
  full_name: string;
  country: string;
  xp: number;
  level_name: string;
  streak_days: number;
  study_hours: number;
  group_name?: string;
  cert_count: number;
  avg_quiz_score?: number;
}

interface InstructorItem {
  id: string;
  email: string;
  full_name: string;
  specialty?: string;
  groups_count: number;
}

interface GroupItem {
  id: string;
  name: string;
  code: string;
  instructor_name?: string;
  course_title?: string;
  period: string;
  student_count: number;
}

interface CourseItem {
  id: string;
  title: string;
  description: string;
  level: string;
  active_groups_count: number;
}

interface AssignmentItem {
  id: string;
  title: string;
  description: string;
  group_name: string;
  course_title?: string;
  due_date?: string;
  creator_name?: string;
}

export function InstitutionView() {
  const [activeTab, setActiveTab] = useState<'panel' | 'alumnos' | 'instructores' | 'cursos' | 'grupos' | 'asignaciones' | 'reportes' | 'licencias'>('panel');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<string>('');

  const [orgData, setOrgData] = useState<Organization | null>(null);
  const [licenses, setLicenses] = useState<LicenseInfo>({ total: 50, active: 0, available: 50, expired: 0, planType: 'ANNUAL', expirationDate: '' });
  const [counts, setCounts] = useState<CountsInfo>({ students: 0, instructors: 0, courses: 0, groups: 0, certificates: 0, totalHours: 0, evaluationsPassed: 0 });
  const [ranking, setRanking] = useState<StudentItem[]>([]);

  // Management Lists
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [instructors, setInstructors] = useState<InstructorItem[]>([]);
  const [groups, setGroups] = useState<GroupItem[]>([]);
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [assignments, setAssignments] = useState<AssignmentItem[]>([]);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [reportFilter, setReportFilter] = useState<'curso' | 'grupo' | 'alumno' | 'instructor' | 'periodo'>('curso');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('2026-I');

  // Modals
  const [modalType, setModalType] = useState<'alumno' | 'instructor' | 'curso' | 'grupo' | 'asignacion' | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Form states
  const [studentForm, setStudentForm] = useState({ full_name: '', email: '', groupId: '', password: '' });
  const [instructorForm, setInstructorForm] = useState({ full_name: '', email: '', specialty: '', password: '' });
  const [groupForm, setGroupForm] = useState({ name: '', code: '', instructorId: '', courseId: '', period: '2026-I' });
  const [courseForm, setCourseForm] = useState({ courseId: 'sistemas-electricos' });
  const [assignmentForm, setAssignmentForm] = useState({ title: '', description: '', groupId: '', courseId: '', dueDate: '' });

  const fetchDashboard = async (orgId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = orgId ? `/api/v1/institution/dashboard?orgId=${orgId}` : '/api/v1/institution/dashboard';
      const res = await fetch(url, { headers: { Authorization: `Bearer demo_token` } });
      const data = await res.json();
      if (data.success) {
        setOrgData(data.organization);
        setSelectedOrgId(data.organization.id);
        setLicenses(data.licenses);
        setCounts(data.counts);
        setRanking(data.ranking || []);
      } else {
        setError(data.error || 'Error al cargar datos de la institución');
      }
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrgs = async () => {
    try {
      const res = await fetch('/api/v1/institution/organizations');
      const data = await res.json();
      if (data.success) {
        setOrganizations(data.organizations || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchTabContent = async (tabName: string) => {
    try {
      const queryParam = selectedOrgId ? `?orgId=${selectedOrgId}` : '';
      if (tabName === 'alumnos') {
        const res = await fetch(`/api/v1/institution/students${queryParam}`);
        const data = await res.json();
        if (data.success) setStudents(data.students || []);
      } else if (tabName === 'instructores') {
        const res = await fetch(`/api/v1/institution/instructors${queryParam}`);
        const data = await res.json();
        if (data.success) setInstructors(data.instructors || []);
      } else if (tabName === 'cursos') {
        const res = await fetch(`/api/v1/institution/courses${queryParam}`);
        const data = await res.json();
        if (data.success) setCourses(data.courses || []);
      } else if (tabName === 'grupos') {
        const res = await fetch(`/api/v1/institution/groups${queryParam}`);
        const data = await res.json();
        if (data.success) setGroups(data.groups || []);
      } else if (tabName === 'asignaciones') {
        const res = await fetch(`/api/v1/institution/assignments${queryParam}`);
        const data = await res.json();
        if (data.success) setAssignments(data.assignments || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchOrgs();
    fetchDashboard();
  }, []);

  useEffect(() => {
    if (activeTab !== 'panel') {
      fetchTabContent(activeTab);
    }
  }, [activeTab, selectedOrgId]);

  const handleOrgChange = (newOrgId: string) => {
    setSelectedOrgId(newOrgId);
    fetchDashboard(newOrgId);
  };

  // Submit handlers
  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSuccess(null);
    setError(null);
    try {
      const res = await fetch('/api/v1/institution/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...studentForm, orgId: selectedOrgId })
      });
      const data = await res.json();
      if (data.success) {
        setFormSuccess('Alumno registrado e inscrito con éxito.');
        setStudentForm({ full_name: '', email: '', groupId: '', password: '' });
        fetchTabContent('alumnos');
        fetchDashboard(selectedOrgId);
        setTimeout(() => { setModalType(null); setFormSuccess(null); }, 1500);
      } else {
        setError(data.error || 'Error al agregar alumno');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAddInstructor = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSuccess(null);
    setError(null);
    try {
      const res = await fetch('/api/v1/institution/instructors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...instructorForm, orgId: selectedOrgId })
      });
      const data = await res.json();
      if (data.success) {
        setFormSuccess('Instructor asignado con éxito.');
        setInstructorForm({ full_name: '', email: '', specialty: '', password: '' });
        fetchTabContent('instructores');
        fetchDashboard(selectedOrgId);
        setTimeout(() => { setModalType(null); setFormSuccess(null); }, 1500);
      } else {
        setError(data.error || 'Error al registrar instructor');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAddGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSuccess(null);
    setError(null);
    try {
      const res = await fetch('/api/v1/institution/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...groupForm, orgId: selectedOrgId })
      });
      const data = await res.json();
      if (data.success) {
        setFormSuccess('Grupo académico creado con éxito.');
        setGroupForm({ name: '', code: '', instructorId: '', courseId: '', period: '2026-I' });
        fetchTabContent('grupos');
        fetchDashboard(selectedOrgId);
        setTimeout(() => { setModalType(null); setFormSuccess(null); }, 1500);
      } else {
        setError(data.error || 'Error al crear grupo');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSuccess(null);
    setError(null);
    try {
      const res = await fetch('/api/v1/institution/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: courseForm.courseId, orgId: selectedOrgId })
      });
      const data = await res.json();
      if (data.success) {
        setFormSuccess('Curso habilitado en el catálogo institucional.');
        fetchTabContent('cursos');
        fetchDashboard(selectedOrgId);
        setTimeout(() => { setModalType(null); setFormSuccess(null); }, 1500);
      } else {
        setError(data.error || 'Error al asignar curso');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAddAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSuccess(null);
    setError(null);
    try {
      const res = await fetch('/api/v1/institution/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...assignmentForm, orgId: selectedOrgId })
      });
      const data = await res.json();
      if (data.success) {
        setFormSuccess('Asignación o tarea grupal publicada.');
        setAssignmentForm({ title: '', description: '', groupId: '', courseId: '', dueDate: '' });
        fetchTabContent('asignaciones');
        setTimeout(() => { setModalType(null); setFormSuccess(null); }, 1500);
      } else {
        setError(data.error || 'Error al publicar asignación');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      {/* HEADER BAR */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              {orgData?.logo ? (
                <img src={orgData.logo} alt="Logo" className="w-full h-full object-cover rounded-[14px]" />
              ) : (
                <Building2 className="w-8 h-8 text-white" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 uppercase tracking-wide">
                  {orgData?.type || 'INSTITUTO TÉCNICO'}
                </span>
                <span className="text-xs text-slate-400 font-mono">Código: {orgData?.code || 'INST-01'}</span>
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
                {orgData?.name || 'YOVE Institution Platform'}
              </h1>
              <p className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                <span>📍 {orgData?.country || 'Internacional'}</span>
                <span>•</span>
                <span>✉️ {orgData?.contact_email || 'contacto@yove.edu'}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Institution Switcher (for Admins / Multi-tenant) */}
            {organizations.length > 0 && (
              <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-1.5 text-xs">
                <Building2 className="w-4 h-4 text-cyan-400" />
                <select
                  value={selectedOrgId}
                  onChange={(e) => handleOrgChange(e.target.value)}
                  className="bg-transparent text-slate-200 outline-none font-medium cursor-pointer"
                >
                  {organizations.map((o) => (
                    <option key={o.id} value={o.id} className="bg-slate-900 text-slate-200">
                      {o.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <Lock className="w-3.5 h-3.5" />
              <span>Aislamiento Multitenant Activo</span>
            </div>

            <button
              onClick={() => fetchDashboard(selectedOrgId)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Actualizar datos"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* TABS NAVIGATION */}
        <div className="flex items-center gap-2 overflow-x-auto mt-6 pb-2 scrollbar-none border-b border-slate-800">
          <button
            onClick={() => setActiveTab('panel')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'panel'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            Panel Institucional
          </button>

          <button
            onClick={() => setActiveTab('alumnos')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'alumnos'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Alumnos ({counts.students})
          </button>

          <button
            onClick={() => setActiveTab('instructores')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'instructores'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            Instructores ({counts.instructors})
          </button>

          <button
            onClick={() => setActiveTab('cursos')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'cursos'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Cursos ({counts.courses})
          </button>

          <button
            onClick={() => setActiveTab('grupos')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'grupos'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Grupos / Aulas ({counts.groups})
          </button>

          <button
            onClick={() => setActiveTab('asignaciones')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'asignaciones'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            Asignaciones
          </button>

          <button
            onClick={() => setActiveTab('reportes')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'reportes'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            Reportes
          </button>

          <button
            onClick={() => setActiveTab('licencias')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'licencias'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Key className="w-4 h-4" />
            Licencias ({licenses.active}/{licenses.total})
          </button>
        </div>
      </div>

      {/* MAIN CONTAINER CONTENT */}
      <div className="max-w-7xl mx-auto space-y-8">

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)}><X className="w-4 h-4" /></button>
          </div>
        )}

        {/* 1. PANEL INSTITUCIONAL (DASHBOARD) */}
        {activeTab === 'panel' && (
          <div className="space-y-8">
            {/* Quick Management Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" /> Acciones Rápidas de Gestión
              </h2>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => { setModalType('alumno'); setError(null); }}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-cyan-500/10"
                >
                  <Plus className="w-4 h-4" /> + Agregar Alumno
                </button>
                <button
                  onClick={() => { setModalType('instructor'); setError(null); }}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-semibold text-xs border border-cyan-500/30 transition-all"
                >
                  <Plus className="w-4 h-4" /> + Agregar Instructor
                </button>
                <button
                  onClick={() => { setModalType('grupo'); setError(null); }}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all"
                >
                  <Plus className="w-4 h-4" /> + Crear Grupo
                </button>
                <button
                  onClick={() => { setModalType('curso'); setError(null); }}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all"
                >
                  <Plus className="w-4 h-4" /> + Asignar Curso
                </button>
                <button
                  onClick={() => { setModalType('asignacion'); setError(null); }}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all"
                >
                  <Plus className="w-4 h-4" /> + Asignar Tarea
                </button>
              </div>
            </div>

            {/* STAT CARDS GRID */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
                <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
                  <span>Alumnos Activos</span>
                  <GraduationCap className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-bold text-white">{counts.students}</div>
                <p className="text-[11px] text-slate-400 mt-1">Licencias ocupadas: {licenses.active}/{licenses.total}</p>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div
                    className="bg-cyan-500 h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, (licenses.active / Math.max(1, licenses.total)) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
                <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
                  <span>Instructores</span>
                  <Users className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-white">{counts.instructors}</div>
                <p className="text-[11px] text-slate-400 mt-1">Docentes asignados</p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
                <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
                  <span>Cursos Habilitados</span>
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-2xl font-bold text-white">{counts.courses}</div>
                <p className="text-[11px] text-slate-400 mt-1">Catálogo institucional</p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
                <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
                  <span>Horas de Práctica</span>
                  <Clock className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold text-white">{counts.totalHours} hrs</div>
                <p className="text-[11px] text-emerald-400 mt-1">Acumuladas por alumnos</p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
                <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
                  <span>Certificados Emitidos</span>
                  <Award className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-bold text-white">{counts.certificates}</div>
                <p className="text-[11px] text-slate-400 mt-1">Aprobaciones verificadas</p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
                <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
                  <span>Evaluaciones Aprobadas</span>
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                </div>
                <div className="text-2xl font-bold text-white">{counts.evaluationsPassed}</div>
                <p className="text-[11px] text-slate-400 mt-1">Exámenes prácticos</p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
                <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
                  <span>Grupos Activos</span>
                  <Briefcase className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-bold text-white">{counts.groups}</div>
                <p className="text-[11px] text-slate-400 mt-1">Aulas y secciones</p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
                <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
                  <span>Licencias Disponibles</span>
                  <Key className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-bold text-cyan-400">{licenses.available}</div>
                <p className="text-[11px] text-slate-400 mt-1">De {licenses.total} contratadas</p>
              </div>
            </div>

            {/* RANKING INTERNO (INTERNAL LEADERBOARD) */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-400" /> Ranking Interno Institucional
                  </h3>
                  <p className="text-xs text-slate-400">Tabla de honor de los alumnos con mayor rendimiento de la institución</p>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  Periodo Actual: {selectedPeriod}
                </span>
              </div>

              {ranking.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">No hay datos de rendimiento disponibles aún.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-800 text-xs text-slate-400 uppercase tracking-wider">
                        <th className="py-3 px-4">Posición</th>
                        <th className="py-3 px-4">Alumno</th>
                        <th className="py-3 px-4">Grupo / Aula</th>
                        <th className="py-3 px-4">XP Acumulados</th>
                        <th className="py-3 px-4">Horas Prácticas</th>
                        <th className="py-3 px-4">Certificados</th>
                        <th className="py-3 px-4">Nivel Rango</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {ranking.map((st, idx) => (
                        <tr key={st.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-slate-300">
                            {idx === 0 && <span className="text-amber-400 text-base">🥇 #1</span>}
                            {idx === 1 && <span className="text-slate-300 text-base">🥈 #2</span>}
                            {idx === 2 && <span className="text-amber-600 text-base">🥉 #3</span>}
                            {idx > 2 && <span className="text-slate-500">#{idx + 1}</span>}
                          </td>
                          <td className="py-3.5 px-4 font-medium text-white">
                            <div>{st.full_name}</div>
                            <div className="text-xs text-slate-400">{st.email}</div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-300">
                            {st.group_name || <span className="text-slate-500 italic">Sin grupo</span>}
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">{st.xp} XP</td>
                          <td className="py-3.5 px-4 text-slate-300">{st.study_hours} hrs</td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded-full text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30">
                              {st.cert_count} certs
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-xs font-semibold text-indigo-400">{st.level_name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. TAB ALUMNOS */}
        {activeTab === 'alumnos' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-cyan-400" /> Alumnos de la Institución
                </h3>
                <p className="text-xs text-slate-400">Administra matrículas, asignaciones de grupos y seguimiento de aprendizaje</p>
              </div>
              <button
                onClick={() => { setModalType('alumno'); setError(null); }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all"
              >
                <Plus className="w-4 h-4" /> Agregar Alumno
              </button>
            </div>

            <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, email o grupo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-sm text-slate-200 outline-none w-full"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-xs text-slate-400 uppercase">
                    <th className="py-3 px-4">Alumno</th>
                    <th className="py-3 px-4">Grupo / Aula</th>
                    <th className="py-3 px-4">País</th>
                    <th className="py-3 px-4">Progreso / XP</th>
                    <th className="py-3 px-4">Certificados</th>
                    <th className="py-3 px-4">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {students.filter(s => s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || s.email.toLowerCase().includes(searchQuery.toLowerCase())).map(st => (
                    <tr key={st.id} className="hover:bg-slate-800/40">
                      <td className="py-3.5 px-4 font-medium text-white">
                        <div>{st.full_name}</div>
                        <div className="text-xs text-slate-400">{st.email}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {st.group_name || <span className="text-slate-500 italic">Sin grupo</span>}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">{st.country || 'Global'}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-mono text-cyan-400 font-bold">{st.xp} XP</div>
                        <div className="text-[11px] text-slate-400">{st.study_hours} hrs de estudio</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30">
                          {st.cert_count} emitidos
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium">
                          Licencia Activa
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. TAB INSTRUCTORES */}
        {activeTab === 'instructores' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-cyan-400" /> Plantel Docente e Instructores
                </h3>
                <p className="text-xs text-slate-400">Instructores asignados a cursos y grupos de la institución</p>
              </div>
              <button
                onClick={() => { setModalType('instructor'); setError(null); }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all"
              >
                <Plus className="w-4 h-4" /> Agregar Instructor
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {instructors.map(ins => (
                <div key={ins.id} className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center text-xl font-bold">
                    {ins.full_name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-bold text-white">{ins.full_name}</h4>
                    <p className="text-xs text-slate-400">{ins.email}</p>
                    <p className="text-xs text-cyan-400 font-medium mt-2">Specialty: {ins.specialty || 'General'}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                      <span>👥 Grupos asignados: <strong>{ins.groups_count}</strong></span>
                      <span className="text-emerald-400 font-medium">✓ Verificado</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. TAB CURSOS */}
        {activeTab === 'cursos' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-cyan-400" /> Catálogo de Cursos Institucionales
                </h3>
                <p className="text-xs text-slate-400">Cursos asignados al plan académico de tu instituto</p>
              </div>
              <button
                onClick={() => { setModalType('curso'); setError(null); }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all"
              >
                <Plus className="w-4 h-4" /> Habilitar Curso
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {courses.map(c => (
                <div key={c.id} className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 uppercase">
                      {c.level || 'Avanzado'}
                    </span>
                    <h4 className="text-base font-bold text-white mt-2">{c.title}</h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{c.description}</p>
                  </div>
                  <div className="border-t border-slate-800 mt-4 pt-3 flex items-center justify-between text-xs text-slate-400">
                    <span>Grupos dictando: {c.active_groups_count || 1}</span>
                    <span className="text-cyan-400 font-semibold">Catálogo Activo</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. TAB GRUPOS / AULAS */}
        {activeTab === 'grupos' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-cyan-400" /> Grupos y Secciones
                </h3>
                <p className="text-xs text-slate-400">Organización por aulas, turnos y especialidades</p>
              </div>
              <button
                onClick={() => { setModalType('grupo'); setError(null); }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all"
              >
                <Plus className="w-4 h-4" /> Crear Grupo
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {groups.map(g => (
                <div key={g.id} className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-cyan-400">{g.code}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">{g.period}</span>
                  </div>
                  <h4 className="text-base font-bold text-white">{g.name}</h4>
                  <p className="text-xs text-slate-400">Instructor: <span className="text-slate-200 font-medium">{g.instructor_name || 'No asignado'}</span></p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                    <span className="text-slate-400">Alumnos inscritos:</span>
                    <span className="font-bold text-cyan-400">{g.student_count} alumnos</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. TAB ASIGNACIONES */}
        {activeTab === 'asignaciones' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-400" /> Asignaciones y Tareas Grupales
                </h3>
                <p className="text-xs text-slate-400">Publica talleres prácticos, mediciones de osciloscopio y entregables a grupos</p>
              </div>
              <button
                onClick={() => { setModalType('asignacion'); setError(null); }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all"
              >
                <Plus className="w-4 h-4" /> Publicar Tarea
              </button>
            </div>

            <div className="space-y-4">
              {assignments.map(a => (
                <div key={a.id} className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                      Grupo: {a.group_name}
                    </span>
                    <span className="text-xs text-amber-400 font-medium">📅 Vence: {a.due_date ? new Date(a.due_date).toLocaleDateString() : 'Sin fecha'}</span>
                  </div>
                  <h4 className="text-base font-bold text-white">{a.title}</h4>
                  <p className="text-xs text-slate-300">{a.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. TAB REPORTES */}
        {activeTab === 'reportes' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-cyan-400" /> Módulo de Reportes Institucionales
                </h3>
                <p className="text-xs text-slate-400">Genera reportes detallados por curso, grupo, alumno, instructor y periodo</p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={reportFilter}
                  onChange={(e: any) => setReportFilter(e.target.value)}
                  className="bg-slate-950 text-xs text-slate-200 border border-slate-800 rounded-xl px-3 py-2"
                >
                  <option value="curso">Por Curso</option>
                  <option value="grupo">Por Grupo</option>
                  <option value="alumno">Por Alumno</option>
                  <option value="instructor">Por Instructor</option>
                  <option value="periodo">Por Periodo</option>
                </select>

                <button
                  onClick={() => alert("Reporte CSV descargado exitosamente.")}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Exportar CSV
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <h4 className="text-sm font-bold text-white mb-3">Resumen de Rendimiento Académico - {selectedPeriod}</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="text-slate-400">Tasa de Finalización de Cursos</div>
                  <div className="text-xl font-bold text-emerald-400 mt-1">87.4%</div>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="text-slate-400">Promedio General en Evaluaciones</div>
                  <div className="text-xl font-bold text-cyan-400 mt-1">92.5 / 100</div>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="text-slate-400">Horas Totales de Práctica Simulada</div>
                  <div className="text-xl font-bold text-amber-400 mt-1">{counts.totalHours} Horas</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 8. TAB LICENCIAS */}
        {activeTab === 'licencias' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-cyan-400" /> Gestión de Licencias Institucionales
              </h3>
              <p className="text-xs text-slate-400">Monitoreo en tiempo real de licencias activas, disponibles y fecha de vencimiento</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl">
                <div className="text-xs text-slate-400">Licencias Totales Contratadas</div>
                <div className="text-3xl font-bold text-white mt-1">{licenses.total}</div>
                <span className="text-[11px] text-cyan-400">Plan: {licenses.planType}</span>
              </div>
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl">
                <div className="text-xs text-slate-400">Licencias Activas (Alumnos)</div>
                <div className="text-3xl font-bold text-emerald-400 mt-1">{licenses.active}</div>
                <span className="text-[11px] text-slate-400">Actualmente asignadas</span>
              </div>
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl">
                <div className="text-xs text-slate-400">Licencias Disponibles</div>
                <div className="text-3xl font-bold text-cyan-400 mt-1">{licenses.available}</div>
                <span className="text-[11px] text-slate-400">Libres para nuevos alumnos</span>
              </div>
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl">
                <div className="text-xs text-slate-400">Licencias Expiradas</div>
                <div className="text-3xl font-bold text-slate-500 mt-1">{licenses.expired}</div>
                <span className="text-[11px] text-slate-400">Bajas temporales</span>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-white">Estado de la Suscripción Institucional</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Vencimiento: <strong className="text-slate-200">{licenses.expirationDate ? new Date(licenses.expirationDate).toLocaleDateString() : 'Activa (Anual)'}</strong>
                </p>
              </div>

              <button
                onClick={() => alert("Solicitud de ampliación de licencias enviada a soporte YOVE Academy. Un asesor comercial institucional se pondrá en contacto.")}
                className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-cyan-500/10"
              >
                + Solicitar Ampliación de Licencias
              </button>
            </div>
          </div>
        )}

      </div>

      {/* MODALS FOR MANAGEMENT */}
      {modalType && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white uppercase tracking-wider">
                {modalType === 'alumno' && 'Agregar Nuevo Alumno'}
                {modalType === 'instructor' && 'Agregar Nuevo Instructor'}
                {modalType === 'grupo' && 'Crear Grupo / Aula'}
                {modalType === 'curso' && 'Habilitar Curso'}
                {modalType === 'asignacion' && 'Publicar Asignación'}
              </h3>
              <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formSuccess && (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
                {formSuccess}
              </div>
            )}

            {/* ALUMNO FORM */}
            {modalType === 'alumno' && (
              <form onSubmit={handleAddStudent} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Nombre Completo *</label>
                  <input
                    type="text" required
                    value={studentForm.full_name}
                    onChange={(e) => setStudentForm({ ...studentForm, full_name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 outline-none focus:border-cyan-500"
                    placeholder="Ej. Juan Pérez"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Correo Electrónico *</label>
                  <input
                    type="email" required
                    value={studentForm.email}
                    onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 outline-none focus:border-cyan-500"
                    placeholder="alumno@ejemplo.edu"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Asignar a Grupo (Opcional)</label>
                  <select
                    value={studentForm.groupId}
                    onChange={(e) => setStudentForm({ ...studentForm, groupId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 outline-none focus:border-cyan-500"
                  >
                    <option value="">-- Ninguno / General --</option>
                    {groups.map(g => (
                      <option key={g.id} value={g.id}>{g.name} ({g.code})</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl mt-4 transition-all"
                >
                  Registrar Alumno
                </button>
              </form>
            )}

            {/* INSTRUCTOR FORM */}
            {modalType === 'instructor' && (
              <form onSubmit={handleAddInstructor} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Nombre del Instructor *</label>
                  <input
                    type="text" required
                    value={instructorForm.full_name}
                    onChange={(e) => setInstructorForm({ ...instructorForm, full_name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 outline-none focus:border-cyan-500"
                    placeholder="Ej. Ing. Carlos Rodríguez"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Correo Electrónico *</label>
                  <input
                    type="email" required
                    value={instructorForm.email}
                    onChange={(e) => setInstructorForm({ ...instructorForm, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 outline-none focus:border-cyan-500"
                    placeholder="profesor@ejemplo.edu"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Especialidad Principal</label>
                  <input
                    type="text"
                    value={instructorForm.specialty}
                    onChange={(e) => setInstructorForm({ ...instructorForm, specialty: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 outline-none focus:border-cyan-500"
                    placeholder="Ej. Diagnóstico CAN Bus / Vehículos Eléctricos"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl mt-4 transition-all"
                >
                  Registrar Instructor
                </button>
              </form>
            )}

            {/* GRUPO FORM */}
            {modalType === 'grupo' && (
              <form onSubmit={handleAddGroup} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Nombre del Grupo *</label>
                  <input
                    type="text" required
                    value={groupForm.name}
                    onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 outline-none focus:border-cyan-500"
                    placeholder="Ej. Grupo 3A - Electricidad Automotriz"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Código del Grupo</label>
                  <input
                    type="text"
                    value={groupForm.code}
                    onChange={(e) => setGroupForm({ ...groupForm, code: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 outline-none focus:border-cyan-500"
                    placeholder="GRP-3A-2026"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Periodo Lectivo</label>
                  <select
                    value={groupForm.period}
                    onChange={(e) => setGroupForm({ ...groupForm, period: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 outline-none focus:border-cyan-500"
                  >
                    <option value="2026-I">2026 - Ciclo I</option>
                    <option value="2026-II">2026 - Ciclo II</option>
                    <option value="2026-ANUAL">2026 - Anual</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl mt-4 transition-all"
                >
                  Crear Grupo
                </button>
              </form>
            )}

            {/* CURSO FORM */}
            {modalType === 'curso' && (
              <form onSubmit={handleAddCourse} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Seleccionar Curso del Catálogo Global *</label>
                  <select
                    value={courseForm.courseId}
                    onChange={(e) => setCourseForm({ courseId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 outline-none focus:border-cyan-500"
                  >
                    <option value="sistemas-electricos">Sistemas Eléctricos y Mux CAN Bus</option>
                    <option value="sistemas-inyeccion">Inyección Electrónica y Diagnóstico OBD2</option>
                    <option value="vehiculos-electricos">Vehículos Eléctricos e Híbridos (Alta Tensión)</option>
                    <option value="osciloscopio-automotriz">Osciloscopio Automotriz y Captura de Senales</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl mt-4 transition-all"
                >
                  Habilitar para mi Institución
                </button>
              </form>
            )}

            {/* ASIGNACION FORM */}
            {modalType === 'asignacion' && (
              <form onSubmit={handleAddAssignment} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Grupo Destino *</label>
                  <select
                    required
                    value={assignmentForm.groupId}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, groupId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 outline-none focus:border-cyan-500"
                  >
                    <option value="">-- Selecciona un grupo --</option>
                    {groups.map(g => (
                      <option key={g.id} value={g.id}>{g.name} ({g.code})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Título de la Tarea / Asignación *</label>
                  <input
                    type="text" required
                    value={assignmentForm.title}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 outline-none focus:border-cyan-500"
                    placeholder="Ej. Medición de oscilograma en Bus CAN High"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Descripción / Instrucciones</label>
                  <textarea
                    rows={3}
                    value={assignmentForm.description}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 outline-none focus:border-cyan-500"
                    placeholder="Instrucciones para los alumnos..."
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Fecha de Vencimiento</label>
                  <input
                    type="date"
                    value={assignmentForm.dueDate}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, dueDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 outline-none focus:border-cyan-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl mt-4 transition-all"
                >
                  Publicar Asignación
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
