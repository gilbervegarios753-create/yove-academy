import React, { useState, useEffect } from 'react';
import {
  Layers, BookOpen, FileText, Video, HelpCircle, Wrench, Sparkles, Plus, Search,
  Filter, CheckCircle2, AlertTriangle, Eye, Copy, Trash2, Edit3, Upload, RefreshCw,
  Award, ShieldAlert, Check, X, ArrowRight, Play, ExternalLink, Settings, Shield,
  Grid, FolderPlus, List, ChevronRight, BarChart3, Database, Bot
} from 'lucide-react';

import { AcademicRichTextEditor } from './AcademicRichTextEditor';
import { MediaLibraryModal } from './MediaLibraryModal';
import { VideoManagerTool } from './VideoManagerTool';
import { SyllabusCurriculumEditor } from './SyllabusCurriculumEditor';
import { QuizExamBuilder } from './QuizExamBuilder';
import { CaseLabBuilder } from './CaseLabBuilder';
import { AiContentAssistantModal } from './AiContentAssistantModal';
import { StudentPreviewModal } from './StudentPreviewModal';
import { CourseCompletenessValidator } from './CourseCompletenessValidator';
import { useContentStudioRouter, ContentStudioView } from './useContentStudioRouter';

export const ContentStudioDashboard: React.FC = () => {
  // Content Studio Sub-Router Hook
  const router = useContentStudioRouter('DASHBOARD');

  // Course Completeness Audit Modal State
  const [selectedValidationCourse, setSelectedValidationCourse] = useState<any>(null);

  // DB Metrics State
  const [stats, setStats] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Filter State
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [semesterFilter, setSemesterFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Course Modal & Editor State
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [isStructureModalOpen, setIsStructureModalOpen] = useState(false);

  // New Course Form State
  const [courseTitle, setCourseTitle] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [courseCategory, setCourseCategory] = useState('mechatronics');
  const [courseSemester, setCourseSemester] = useState('I');
  const [courseLevel, setCourseLevel] = useState('Intermedio');
  const [courseDescription, setCourseDescription] = useState('');

  // Active Module & Lesson for Structure Editor
  const [selectedModule, setSelectedModule] = useState<any>(null);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);

  // Lesson Edit State
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonContent, setLessonContent] = useState('');
  const [lessonVideoUrl, setLessonVideoUrl] = useState('');
  const [lessonVideoStatus, setLessonVideoStatus] = useState('VALID');

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/v1/content-studio/stats');
      const data = await res.json();
      if (data.success) setStats(data.stats);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/content-studio/courses?status=${statusFilter}&semester=${semesterFilter}&search=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data.success) setCourses(data.courses);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchCourses();
  }, [statusFilter, semesterFilter, searchQuery]);

  // Create Course Handler
  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/content-studio/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: courseTitle,
          code: courseCode || `YOVE-${Math.floor(100+Math.random()*900)}`,
          category: courseCategory,
          semester: courseSemester,
          level: courseLevel,
          description: courseDescription
        })
      });
      const data = await res.json();
      if (data.success) {
        router.setCreateCourseModalOpen(false);
        setCourseTitle('');
        setCourseCode('');
        setCourseDescription('');
        fetchCourses();
        fetchStats();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Open Full Detail Structure Editor
  const handleOpenStructure = async (courseId: string) => {
    try {
      const res = await fetch(`/api/v1/content-studio/courses/${courseId}`);
      const data = await res.json();
      if (data.success) {
        setSelectedCourse(data.course);
        if (data.course.modules?.length > 0) {
          setSelectedModule(data.course.modules[0]);
          if (data.course.modules[0].lessons?.length > 0) {
            const les = data.course.modules[0].lessons[0];
            setSelectedLesson(les);
            setLessonTitle(les.title);
            setLessonContent(les.content || '');
            setLessonVideoUrl(les.videoUrl || '');
            setLessonVideoStatus(les.videoStatus || 'VALID');
          }
        }
        setIsStructureModalOpen(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Save Lesson Changes
  const handleSaveLesson = async () => {
    if (!selectedLesson) return;
    try {
      const res = await fetch(`/api/v1/content-studio/lessons/${selectedLesson.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: lessonTitle,
          content: lessonContent,
          videoUrl: lessonVideoUrl,
          videoStatus: lessonVideoStatus
        })
      });
      const data = await res.json();
      if (data.success) {
        alert('Lección actualizada correctamente.');
        if (selectedCourse) handleOpenStructure(selectedCourse.id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Add Module Handler
  const handleAddModule = async () => {
    if (!selectedCourse) return;
    const title = prompt('Nombre del nuevo módulo:');
    if (!title) return;
    try {
      await fetch('/api/v1/content-studio/modules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: selectedCourse.id,
          title,
          orderIndex: (selectedCourse.modules?.length || 0) + 1
        })
      });
      handleOpenStructure(selectedCourse.id);
    } catch (e) {
      console.error(e);
    }
  };

  // Add Lesson Handler
  const handleAddLesson = async (moduleId: string) => {
    const title = prompt('Nombre de la nueva lección:');
    if (!title) return;
    try {
      await fetch('/api/v1/content-studio/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleId,
          title,
          contentType: 'VIDEO'
        })
      });
      if (selectedCourse) handleOpenStructure(selectedCourse.id);
    } catch (e) {
      console.error(e);
    }
  };

  // Publish Course (With Empty Check Rule Enforcement)
  const handlePublishCourse = async (courseId: string) => {
    try {
      const res = await fetch(`/api/v1/content-studio/courses/${courseId}/publish`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(`❌ No se puede publicar el curso:\n\n${data.error}`);
        return;
      }
      alert('🟢 ¡Curso publicado exitosamente en el catálogo oficial de YOVE Academy!');
      fetchCourses();
      fetchStats();
    } catch (e: any) {
      alert(`Error publicando curso: ${e.message}`);
    }
  };

  // Duplicate Course
  const handleDuplicateCourse = async (courseId: string) => {
    try {
      const res = await fetch(`/api/v1/content-studio/courses/${courseId}/duplicate`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert('Copia del curso creada en borrador.');
        fetchCourses();
        fetchStats();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b19] text-slate-100 flex flex-col md:flex-row font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#090e24] border-r border-slate-800/80 p-5 flex flex-col justify-between shrink-0 space-y-6">
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="p-2.5 bg-gradient-to-br from-cyan-600 to-blue-700 rounded-2xl shadow-lg shadow-cyan-900/40 text-white">
              <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white tracking-wide uppercase">YOVE STUDIO</h2>
              <p className="text-[10px] text-cyan-400 font-bold">CMS Académico 4.0</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5">
            {[
              { id: 'DASHBOARD', label: 'Cursos & Estado', icon: BookOpen, badge: stats?.totalCourses || 0 },
              { id: 'COURSE_BUILDER', label: 'Módulos & Estructura', icon: Layers, badge: stats?.draftCourses ? `${stats.draftCourses} draft` : undefined },
              { id: 'MEDIA_LIBRARY', label: 'Videos & Biblioteca', icon: Video, badge: stats?.totalVideos || 0 },
              { id: 'SYLLABUS_EDITOR', label: 'Sílabos & Malla', icon: FileText, badge: 'I - VI' },
              { id: 'QUIZ_BUILDER', label: 'Exámenes & Quizzes', icon: HelpCircle },
              { id: 'CASE_BUILDER', label: 'Casos & Labs', icon: Wrench },
            ].map((item) => {
              const IconComp = item.icon;
              const isActive = router.currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'MEDIA_LIBRARY') {
                      router.openMediaLibrary();
                    } else if (item.id === 'COURSE_BUILDER') {
                      if (courses.length > 0) {
                        handleOpenStructure(courses[0].id);
                      }
                      router.openCourseBuilder();
                    } else if (item.id === 'SYLLABUS_EDITOR') {
                      router.openSyllabusEditor();
                    } else if (item.id === 'QUIZ_BUILDER') {
                      router.openQuizBuilder();
                    } else if (item.id === 'CASE_BUILDER') {
                      router.openCaseBuilder();
                    } else {
                      router.backToDashboard();
                    }
                  }}
                  className={`w-full px-3.5 py-3 rounded-2xl text-xs font-bold transition flex items-center justify-between ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-900/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <IconComp className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Bottom Quick Tools */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <button
            onClick={() => router.setAiAssistantOpen(true)}
            className="w-full py-2.5 bg-gradient-to-r from-purple-900/40 to-indigo-900/40 hover:from-purple-900/60 hover:to-indigo-900/60 border border-purple-500/30 text-purple-300 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition"
          >
            <Bot className="w-4 h-4 text-purple-400" /> YOVE AI Content Assistant
          </button>

          <button
            onClick={() => router.setCreateCourseModalOpen(true)}
            className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition"
          >
            <Plus className="w-4 h-4" /> Crear Nuevo Curso
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 space-y-8 overflow-y-auto">
        {/* Studio Top Banner */}
        <div className="bg-gradient-to-r from-cyan-950 via-[#0f172a] to-blue-950 border border-cyan-500/30 p-6 md:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-0.5 bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[10px] font-bold rounded-full uppercase tracking-wider">
                  Panel de Control Super Admin
                </span>
                <span className="text-xs text-slate-400">YOVE Content Studio v4.0</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-3">
                CONTENT STUDIO DASHBOARD
              </h1>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Gestión completa e inteligente de contenidos mecátronicos, lecciones guiadas, videos filtrados, recursos PDF, sílabos y evaluaciones.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => router.openMediaLibrary()}
                className="px-4 py-2.5 bg-slate-900 border border-slate-700 hover:border-cyan-500 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-2 transition"
              >
                <Upload className="w-4 h-4 text-cyan-400" /> Biblioteca Media
              </button>
              <button
                onClick={() => router.setCreateCourseModalOpen(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-cyan-900/50 transition"
              >
                <Plus className="w-4 h-4" /> Crear Nuevo Curso
              </button>
            </div>
          </div>
        </div>

        {/* Quick Metric Counters Overview */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" /> Estadísticas Reales de Base de Datos
            </h3>
            <button
              onClick={() => {
                fetchStats();
                fetchCourses();
              }}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Actualizar Datos
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              {
                label: 'Cursos Totales',
                val: stats?.totalCourses || 0,
                sub: `${stats?.publishedCourses || 0} Pub. | ${stats?.draftCourses || 0} Borr.`,
                icon: BookOpen,
                color: 'text-cyan-400',
                bg: 'border-cyan-500/30 bg-cyan-950/20 hover:border-cyan-500/50'
              },
              {
                label: 'Cursos Publicados',
                val: stats?.publishedCourses || 0,
                sub: 'Catálogo Activo 🟢',
                icon: CheckCircle2,
                color: 'text-emerald-400',
                bg: 'border-emerald-500/30 bg-emerald-950/20 hover:border-emerald-500/50'
              },
              {
                label: 'Borradores / Vacíos',
                val: stats?.draftCourses || 0,
                sub: 'Requieren Revisión 🔴',
                icon: AlertTriangle,
                color: 'text-red-400',
                bg: 'border-red-500/30 bg-red-950/20 hover:border-red-500/50'
              },
              {
                label: 'Lecciones & Videos',
                val: stats?.totalVideos || 0,
                sub: `De ${stats?.totalLessons || 0} Lecciones`,
                icon: Video,
                color: 'text-purple-400',
                bg: 'border-purple-500/30 bg-purple-950/20 hover:border-purple-500/50'
              },
              {
                label: 'Documentos PDF & Media',
                val: stats?.totalMedia || 0,
                sub: `${stats?.pdfsCount || 0} PDFs / ${stats?.imagesCount || 0} Img`,
                icon: FileText,
                color: 'text-blue-400',
                bg: 'border-blue-500/30 bg-blue-950/20 hover:border-blue-500/50'
              },
              {
                label: 'Sílabos & Casos',
                val: (stats?.totalSyllabi || 0) + (stats?.totalCases || 0),
                sub: `${stats?.totalSyllabi || 0} Sílabos / ${stats?.totalCases || 0} Casos`,
                icon: Wrench,
                color: 'text-amber-400',
                bg: 'border-amber-500/30 bg-amber-950/20 hover:border-amber-500/50'
              },
            ].map((m, idx) => {
              const IconComp = m.icon;
              return (
                <div key={idx} className={`p-4 rounded-2xl border ${m.bg} transition-all duration-200 flex flex-col justify-between shadow-lg`}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] text-slate-400 font-bold uppercase truncate">{m.label}</p>
                    <IconComp className={`w-5 h-5 opacity-90 ${m.color}`} />
                  </div>
                  <div>
                    <p className={`text-2xl font-black ${m.color}`}>{m.val}</p>
                    <p className="text-[10px] text-slate-400 font-medium mt-1 truncate">{m.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Section Viewer */}
        {router.currentView === 'DASHBOARD' && (
          <div className="space-y-6">
            {/* Filters Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0d142d] p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-3 flex-1 min-w-[280px]">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Buscar curso por código, título o tema..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="ALL">Todos los Estados</option>
                  <option value="PUBLISHED">Publicados (🟢)</option>
                  <option value="DRAFT">Borradores / Incompletos (🔴)</option>
                  <option value="REVIEW">En Revisión (🟡)</option>
                </select>

                <select
                  value={semesterFilter}
                  onChange={(e) => setSemesterFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="ALL">Todos los Semestres</option>
                  <option value="I">Semestre I</option>
                  <option value="II">Semestre II</option>
                  <option value="III">Semestre III</option>
                  <option value="IV">Semestre IV</option>
                  <option value="V">Semestre V</option>
                  <option value="VI">Semestre VI</option>
                </select>
              </div>

              <button
                onClick={() => { fetchCourses(); fetchStats(); }}
                className="p-2 text-cyan-400 hover:bg-slate-800 rounded-xl transition"
                title="Actualizar catálogo"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* Courses Table / Cards */}
            {loading ? (
              <div className="text-center py-20 text-slate-400 text-xs">Cargando catálogo de YOVE Content Studio...</div>
            ) : courses.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-3xl bg-[#0a0e27]">
                <BookOpen className="w-12 h-12 mx-auto text-slate-600 mb-2" />
                <p className="text-slate-300 text-sm font-bold">No se encontraron cursos con los filtros seleccionados.</p>
                <button
                  onClick={() => router.setCreateCourseModalOpen(true)}
                  className="mt-3 px-4 py-2 bg-cyan-600 text-white rounded-xl text-xs font-bold hover:bg-cyan-500 transition"
                >
                  + Crear Primer Curso
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((c) => (
                  <div
                    key={c.id}
                    className="bg-[#0e1633] border border-slate-800 hover:border-cyan-500/50 p-5 rounded-3xl space-y-4 transition flex flex-col justify-between group shadow-lg"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 bg-cyan-950 border border-cyan-500/40 text-cyan-400 text-[10px] font-bold rounded-md uppercase">
                          {c.code || 'YOVE'}
                        </span>

                        {/* Traffic Light Semáforo Badge */}
                        <div
                          onClick={() => setSelectedValidationCourse(c)}
                          className="cursor-pointer hover:opacity-80 transition"
                          title="Clic para ver auditoría de completitud"
                        >
                          <CourseCompletenessValidator course={c} compact={true} />
                        </div>
                      </div>

                      <h4 className="text-base font-bold text-white line-clamp-2">{c.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2">{c.description || 'Sin descripción registrada.'}</p>
                    </div>

                    {/* Completeness details & Auditor Link */}
                    <div className="p-3 bg-slate-900/80 rounded-2xl text-[11px] text-slate-400 flex items-center justify-between">
                      <div>
                        <p>Módulos: <strong>{c.modules?.length || c.checks?.modulesCount || 0}</strong> | Lecciones: <strong>{c.checks?.lessonsCount || 0}</strong></p>
                        <p>Videos Educativos: <strong>{c.checks?.videoLessonsCount || 0}</strong></p>
                      </div>
                      <button
                        onClick={() => setSelectedValidationCourse(c)}
                        className="px-2.5 py-1 bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold rounded-lg transition shrink-0"
                      >
                        Auditoría 🔍
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-800 gap-2">
                      <button
                        onClick={() => handleOpenStructure(c.id)}
                        className="px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition flex-1 justify-center"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Editar Estructura
                      </button>

                      <button
                        onClick={() => {
                          setSelectedCourse(c);
                          router.setPreviewOpen(true);
                        }}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
                        title="Vista Previa de Estudiante"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDuplicateCourse(c.id)}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
                        title="Duplicar Curso"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      {c.isPublished ? (
                        <span className="px-2.5 py-1 bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-bold rounded-xl text-[10px]">
                          Publicado
                        </span>
                      ) : (
                        <button
                          onClick={() => handlePublishCourse(c.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-[10px] transition"
                        >
                          Publicar
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {router.currentView === 'SYLLABUS_EDITOR' && <SyllabusCurriculumEditor />}
        {router.currentView === 'QUIZ_BUILDER' && <QuizExamBuilder />}
        {router.currentView === 'CASE_BUILDER' && <CaseLabBuilder />}
        {router.currentView === 'MEDIA_LIBRARY' && (
          <div className="p-6 bg-[#090e24] border border-cyan-500/30 rounded-3xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Video className="w-5 h-5 text-cyan-400" /> Biblioteca Media & Gestor de Contenidos
              </h3>
              <button
                onClick={() => router.backToDashboard()}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition"
              >
                ← Volver
              </button>
            </div>
            <VideoManagerTool videoUrl={lessonVideoUrl} onChangeUrl={(url, status) => setLessonVideoUrl(url)} />
          </div>
        )}
      </main>

      {/* Structure & Content Editor Modal */}
      {isStructureModalOpen && selectedCourse && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0b1021] border border-cyan-500/40 w-full max-w-6xl h-[92vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-6 bg-[#131b3b] border-b border-cyan-500/20 flex items-center justify-between">
              <div>
                <span className="px-2.5 py-0.5 bg-cyan-950 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold rounded-md uppercase">
                  {selectedCourse.code}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">Estructura & Editor Académico: {selectedCourse.title}</h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => router.setPreviewOpen(true)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Eye className="w-4 h-4 text-amber-400" /> Vista Previa Estudiante
                </button>

                <button
                  onClick={() => setIsStructureModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Split Builder Screen */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
              {/* Module/Lesson Tree Column */}
              <div className="w-full lg:w-80 bg-[#0e1533] border-r border-slate-800 p-4 overflow-y-auto space-y-4 shrink-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Módulos & Lecciones</h4>
                  <button
                    onClick={handleAddModule}
                    className="p-1 text-cyan-400 hover:bg-slate-800 rounded-lg text-xs font-bold"
                  >
                    + Módulo
                  </button>
                </div>

                {selectedCourse.modules?.map((mod: any, mIdx: number) => (
                  <div key={mod.id} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white truncate">M{mIdx + 1}: {mod.title}</span>
                      <button
                        onClick={() => handleAddLesson(mod.id)}
                        className="text-[10px] text-cyan-400 hover:underline font-bold"
                      >
                        + Lección
                      </button>
                    </div>

                    <div className="space-y-1">
                      {mod.lessons?.map((les: any, lIdx: number) => (
                        <button
                          key={les.id}
                          onClick={() => {
                            setSelectedLesson(les);
                            setLessonTitle(les.title);
                            setLessonContent(les.content || '');
                            setLessonVideoUrl(les.videoUrl || '');
                            setLessonVideoStatus(les.videoStatus || 'VALID');
                          }}
                          className={`w-full text-left p-2 rounded-xl text-xs flex items-center gap-2 transition ${
                            selectedLesson?.id === les.id ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                          }`}
                        >
                          <Play className="w-3 h-3 shrink-0" />
                          <span className="truncate">{lIdx + 1}. {les.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Lesson Active Content Editor Pane */}
              <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-[#070b19]">
                {selectedLesson ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 mr-4">
                        <label className="block text-xs font-medium text-slate-400 mb-1">Título de la Lección</label>
                        <input
                          type="text"
                          value={lessonTitle}
                          onChange={(e) => setLessonTitle(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-sm text-white font-bold outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                      </div>

                      <button
                        onClick={handleSaveLesson}
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-lg transition shrink-0"
                      >
                        Guardar Lección
                      </button>
                    </div>

                    {/* Video Tool */}
                    <VideoManagerTool
                      videoUrl={lessonVideoUrl}
                      videoStatus={lessonVideoStatus}
                      onChangeUrl={(url, status) => {
                        setLessonVideoUrl(url);
                        setLessonVideoStatus(status);
                      }}
                    />

                    {/* Academic Rich Text Editor */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-slate-300">Contenido Académico & Teoría Guiada</label>
                        <button
                          onClick={() => router.setMediaLibraryModalOpen(true)}
                          className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
                        >
                          + Insertar PDF / Diagrama de Biblioteca Media
                        </button>
                      </div>

                      <AcademicRichTextEditor
                        value={lessonContent}
                        onChange={setLessonContent}
                        onOpenAiAssistant={() => router.setAiAssistantOpen(true)}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-24 text-slate-500 text-xs">
                    Seleccione o agregue una lección en el panel izquierdo para editar.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Course Modal */}
      {router.isCreateCourseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleCreateCourse} className="bg-[#0f172a] border border-cyan-500/40 w-full max-w-xl rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-cyan-400" /> Crear Nuevo Curso Académico
              </h3>
              <button type="button" onClick={() => router.setCreateCourseModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Título del Curso</label>
                <input
                  type="text"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  placeholder="Ej: Inyección Electrónica Directa GDI Bosch"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Código Asignado</label>
                  <input
                    type="text"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    placeholder="MEC-301"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Semestre Académico</label>
                  <select
                    value={courseSemester}
                    onChange={(e) => setCourseSemester(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="I">Semestre I</option>
                    <option value="II">Semestre II</option>
                    <option value="III">Semestre III</option>
                    <option value="IV">Semestre IV</option>
                    <option value="V">Semestre V</option>
                    <option value="VI">Semestre VI</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Descripción y Alcance Pedagógico</label>
                <textarea
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-200 outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => router.setCreateCourseModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs hover:bg-slate-700 transition"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition"
              >
                Crear Curso en Borrador
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Auxiliary Modals */}
      <MediaLibraryModal
        isOpen={router.isMediaLibraryModalOpen}
        onClose={() => router.setMediaLibraryModalOpen(false)}
        onSelectMedia={(media) => {
          if (media.fileType === 'IMAGE') {
            setLessonContent((prev) => prev + `\n![${media.name}](${media.url})\n`);
          } else {
            setLessonContent((prev) => prev + `\n📄 **Documento Adjunto:** [${media.name}](${media.url})\n`);
          }
        }}
      />

      <AiContentAssistantModal
        isOpen={router.isAiAssistantOpen}
        onClose={() => router.setAiAssistantOpen(false)}
        onApplyDraft={(draftText) => setLessonContent((prev) => prev + '\n' + draftText)}
        topicContext={selectedLesson?.title || selectedCourse?.title}
      />

      <StudentPreviewModal
        isOpen={router.isPreviewOpen}
        onClose={() => router.setPreviewOpen(false)}
        course={selectedCourse}
      />

      {/* Course Completeness Audit Modal */}
      {selectedValidationCourse && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setSelectedValidationCourse(null)}
                className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-700 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <CourseCompletenessValidator
              course={selectedValidationCourse}
              onPublish={() => {
                handlePublishCourse(selectedValidationCourse.id);
                setSelectedValidationCourse(null);
              }}
              onEditStructure={() => {
                handleOpenStructure(selectedValidationCourse.id);
                setSelectedValidationCourse(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
