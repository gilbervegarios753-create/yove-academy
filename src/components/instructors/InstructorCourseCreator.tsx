import React, { useState, useEffect } from 'react';
import { Course, CourseModule, Lesson, Quiz, QuizQuestion, CourseCategory } from '../../types';
import { AUTOMOTIVE_CATEGORIES } from '../../data/categoriesData';
import { QuizBuilderModal } from './QuizBuilderModal';
import { CaseBuilderModal } from './CaseBuilderModal';
import { LabBuilderModal } from './LabBuilderModal';
import { 
  Plus, Trash2, Edit3, Save, CheckCircle2, Users, BookOpen, HelpCircle, FileText, 
  Play, Layers, Award, ShieldCheck, ArrowRight, Stethoscope, Cpu, BarChart3, 
  RefreshCw, Filter, Eye, Copy, Lock, Clock, DollarSign
} from 'lucide-react';

interface InstructorCourseCreatorProps {
  onCourseCreated?: (newCourse: Course) => void;
}

export const InstructorCourseCreator: React.FC<InstructorCourseCreatorProps> = ({ onCourseCreated }) => {
  const [activeTab, setActiveTab] = useState<'courses' | 'editor' | 'cases' | 'labs' | 'students' | 'analytics'>('courses');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modals state
  const [quizModalOpen, setQuizModalOpen] = useState<boolean>(false);
  const [caseModalOpen, setCaseModalOpen] = useState<boolean>(false);
  const [labModalOpen, setLabModalOpen] = useState<boolean>(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | undefined>(undefined);

  // Active Editing Course State
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [courseTitle, setCourseTitle] = useState('');
  const [category, setCategory] = useState<CourseCategory>('mechatronics');
  const [level, setLevel] = useState<'Inicial' | 'Intermedio' | 'Avanzado' | 'Experto' | 'Todos los Niveles'>('Intermedio');
  const [duration, setDuration] = useState('6 Semanas (45 hrs)');
  const [price, setPrice] = useState(299);
  const [description, setDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [instructorName, setInstructorName] = useState('Ing. Docente YOVE');
  const [objectivesInput, setObjectivesInput] = useState('');
  const [publicationStatus, setPublicationStatus] = useState<'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED'>('DRAFT');

  // Modules & Lessons State
  const [modules, setModules] = useState<CourseModule[]>([
    {
      id: 'mod-init-1',
      title: 'Módulo 1: Introducción y Diagnóstico Inicial',
      description: 'Fundamentos básicos, protocolos de diagnóstico y esquemas técnicos.',
      lessons: [
        {
          id: 'les-init-1',
          title: 'Lección 1.1: Diagnóstico Físico y Medición de Parámetros',
          duration: '20 min',
          type: 'video',
          contentUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          textContent: 'Aprende los procedimientos de medición de voltaje, caída de tensión y resistencia en componentes de motor.'
        }
      ]
    }
  ]);

  // Adding New Module State
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [newModuleDesc, setNewModuleDesc] = useState('');

  // Adding New Lesson State
  const [selectedModuleId, setSelectedModuleId] = useState<string>('mod-init-1');
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonDuration, setLessonDuration] = useState('15 min');
  const [lessonType, setLessonType] = useState<'video' | 'interactive' | 'pdf' | 'quiz' | 'lab'>('video');
  const [lessonContentUrl, setLessonContentUrl] = useState('');
  const [lessonTextContent, setLessonTextContent] = useState('');
  const [lessonQuiz, setLessonQuiz] = useState<Quiz | undefined>(undefined);

  // Students & Analytics Data
  const [students, setStudents] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);

  // Fetch Courses & Data from Backend API
  const fetchInstructorCourses = () => {
    setLoading(true);
    fetch(`/api/v1/instructor/courses?status=${statusFilter}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.courses)) {
          setCourses(data.courses);
        }
      })
      .catch(err => console.error("Error fetching courses:", err))
      .finally(() => setLoading(false));
  };

  const fetchStudentsAndAnalytics = () => {
    fetch('/api/v1/instructor/students')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.students)) setStudents(data.students);
      })
      .catch(err => console.error(err));

    fetch('/api/v1/instructor/analytics')
      .then(res => res.json())
      .then(data => {
        if (data.success) setAnalytics(data.metrics);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchInstructorCourses();
    fetchStudentsAndAnalytics();
  }, [statusFilter]);

  // Load a course into the editor
  const handleEditCourse = (course: Course) => {
    setEditingCourseId(course.id);
    setCourseTitle(course.title);
    setCategory(course.category || 'mechatronics');
    setLevel(course.level || 'Intermedio');
    setDuration(course.duration || '6 Semanas');
    setPrice(course.price || 299);
    setDescription(course.description || '');
    setLongDescription(course.longDescription || course.description || '');
    setObjectivesInput(Array.isArray(course.objectives) ? course.objectives.join('\n') : '');
    setPublicationStatus(course.status || 'DRAFT');
    setModules(course.modules || []);
    setActiveTab('editor');
  };

  // Create New Course
  const handleStartNewCourse = () => {
    setEditingCourseId(null);
    setCourseTitle('');
    setDescription('');
    setLongDescription('');
    setObjectivesInput('');
    setPrice(299);
    setPublicationStatus('DRAFT');
    setModules([]);
    setActiveTab('editor');
  };

  // Change Course Publication Status
  const handleStatusChange = (courseId: string, newStatus: 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED') => {
    fetch(`/api/v1/instructor/courses/${courseId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          fetchInstructorCourses();
        }
      })
      .catch(err => console.error("Error updating course status:", err));
  };

  // Add Module
  const handleAddModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModuleTitle) return;
    const newMod: CourseModule = {
      id: `mod-${Date.now()}`,
      title: newModuleTitle,
      description: newModuleDesc || 'Descripción del módulo.',
      lessons: []
    };
    setModules(prev => [...prev, newMod]);
    setSelectedModuleId(newMod.id);
    setNewModuleTitle('');
    setNewModuleDesc('');
  };

  // Add Lesson
  const handleAddLessonToModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTitle || !selectedModuleId) return;

    const newLes: Lesson = {
      id: `les-${Date.now()}`,
      title: lessonTitle,
      duration: lessonDuration,
      type: lessonType,
      contentUrl: lessonContentUrl || undefined,
      textContent: lessonTextContent || undefined,
      quiz: lessonType === 'quiz' ? lessonQuiz : undefined
    };

    setModules(prev =>
      prev.map(mod =>
        mod.id === selectedModuleId
          ? { ...mod, lessons: [...mod.lessons, newLes] }
          : mod
      )
    );

    setLessonTitle('');
    setLessonContentUrl('');
    setLessonTextContent('');
    setLessonQuiz(undefined);
  };

  // Save Full Course to Backend Persistence
  const handleSaveCourse = () => {
    if (!courseTitle || !description) {
      alert('Por favor ingresa el título y descripción del curso.');
      return;
    }

    const categoryObj = AUTOMOTIVE_CATEGORIES.find(c => c.id === category);

    const payload = {
      id: editingCourseId,
      title: courseTitle,
      category,
      categoryLabel: categoryObj ? categoryObj.name : 'Mecatrónica',
      description,
      longDescription: longDescription || description,
      objectives: objectivesInput.split('\n').filter(line => line.trim().length > 0),
      level,
      duration,
      price: Number(price),
      status: publicationStatus,
      instructor: instructorName,
      instructorId: 'inst_01',
      modules
    };

    setLoading(true);
    fetch('/api/v1/instructor/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert('¡Curso guardado correctamente en la base de datos!');
          fetchInstructorCourses();
          setActiveTab('courses');
        } else {
          alert(`Error al guardar: ${data.error}`);
        }
      })
      .catch(err => alert(`Error de red: ${err.message}`))
      .finally(() => setLoading(false));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-slate-800">
      
      {/* Top Header Bar */}
      <div className="bg-slate-900 p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 text-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white">YOVE INSTRUCTOR STUDIO 4.0</h2>
            <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
              • Entorno de Autoría Profesional y Gestión de Cursos
            </span>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'courses' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            Mis Cursos ({courses.length})
          </button>
          <button
            onClick={handleStartNewCourse}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${
              activeTab === 'editor' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Editor de Cursos</span>
          </button>
          <button
            onClick={() => setCaseModalOpen(true)}
            className="px-3 py-1.5 rounded-lg text-purple-300 hover:text-purple-200 hover:bg-purple-900/50 transition flex items-center gap-1"
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Case Builder</span>
          </button>
          <button
            onClick={() => setLabModalOpen(true)}
            className="px-3 py-1.5 rounded-lg text-cyan-300 hover:text-cyan-200 hover:bg-cyan-900/50 transition flex items-center gap-1"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Lab Builder</span>
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'students' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            Estudiantes
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'analytics' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            Analítica
          </button>
        </div>
      </div>

      {/* VIEW 1: MIS CURSOS (COURSE ROSTER) */}
      {activeTab === 'courses' && (
        <div className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Mis Cursos Automotrices</h3>
              <p className="text-xs text-slate-500">Gestión de estados de publicación y edición de contenido técnico.</p>
            </div>

            {/* Filter by Status */}
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
              <span className="text-slate-500 px-2 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                Estado:
              </span>
              {['ALL', 'DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED'].map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg uppercase tracking-wider text-[10px] transition ${
                    statusFilter === st ? 'bg-blue-600 text-white' : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  {st === 'ALL' ? 'Todos' : st === 'DRAFT' ? 'Borrador' : st === 'REVIEW' ? 'Revisión' : st === 'PUBLISHED' ? 'Publicado' : 'Archivado'}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
              <span>Cargando catálogo de programas...</span>
            </div>
          ) : courses.length === 0 ? (
            <div className="p-10 border-2 border-dashed border-slate-200 rounded-2xl text-center space-y-3 bg-slate-50">
              <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
              <h4 className="text-sm font-bold text-slate-800">No hay cursos creados en este filtro</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Crea un nuevo programa con módulos, lecciones, quizzes, casos de diagnóstico y laboratorios virtuales.
              </p>
              <button
                onClick={handleStartNewCourse}
                className="px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition"
              >
                Crear Nuevo Curso
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {courses.map(course => (
                <div key={course.id} className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{course.icon || '📚'}</span>
                      <span className={`px-2.5 py-0.5 rounded-full font-extrabold text-[10px] uppercase tracking-wider ${
                        course.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800' :
                        course.status === 'REVIEW' ? 'bg-blue-100 text-blue-800' :
                        course.status === 'ARCHIVED' ? 'bg-rose-100 text-rose-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {course.status || 'DRAFT'}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-base text-slate-900">{course.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">{course.description}</p>
                    </div>

                    <div className="flex items-center gap-4 text-[11px] font-bold text-slate-600">
                      <span>🏷️ {course.categoryLabel || course.category}</span>
                      <span>⏱️ {course.duration}</span>
                      <span>🎓 {course.level}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleEditCourse(course)}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs rounded-lg transition flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </button>

                    {/* Status Toggle Quick Selector */}
                    <select
                      value={course.status || 'DRAFT'}
                      onChange={e => handleStatusChange(course.id, e.target.value as any)}
                      className="px-2 py-1 bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 cursor-pointer"
                    >
                      <option value="DRAFT">Borrador</option>
                      <option value="REVIEW">En Revisión</option>
                      <option value="PUBLISHED">Publicado</option>
                      <option value="ARCHIVED">Archivado</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: COURSE EDITOR & STRUCTURE BUILDER */}
      {activeTab === 'editor' && (
        <div className="p-6 space-y-8">
          
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">
                {editingCourseId ? `Editando Curso: ${courseTitle || 'Sin título'}` : 'Crear Nuevo Programa Educativo'}
              </h3>
              <p className="text-xs text-slate-500">Configura metadatos, estado de publicación y estructura de lecciones.</p>
            </div>

            {/* Publication Status Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Estado de Publicación:</span>
              <select
                value={publicationStatus}
                onChange={e => setPublicationStatus(e.target.value as any)}
                className="px-3 py-1.5 bg-slate-900 text-amber-400 font-extrabold text-xs rounded-xl border border-slate-800"
              >
                <option value="DRAFT">BORRADOR (DRAFT)</option>
                <option value="REVIEW">EN REVISIÓN (REVIEW)</option>
                <option value="PUBLISHED">PUBLICADO (PUBLISHED)</option>
                <option value="ARCHIVED">ARCHIVADO (ARCHIVED)</option>
              </select>
            </div>
          </div>

          {/* Section 1: Course Metadata */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              1. Metadatos del Curso
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">Título del Curso *</label>
                <input
                  type="text"
                  value={courseTitle}
                  onChange={e => setCourseTitle(e.target.value)}
                  placeholder="Ej: Especialista en Osciloscopio y Análisis de Formas de Onda"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Categoría Técnica *</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as CourseCategory)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                >
                  {AUTOMOTIVE_CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nivel Didáctico *</label>
                <select
                  value={level}
                  onChange={e => setLevel(e.target.value as any)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                >
                  <option value="Inicial">Inicial</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Avanzado">Avanzado</option>
                  <option value="Experto">Experto / Máster</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Duración Estimada</label>
                <input
                  type="text"
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                  placeholder="Ej: 6 Semanas (40 hrs)"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Precio ($ USD)</label>
                <input
                  type="number"
                  value={price}
                  onChange={e => setPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">Descripción Breve *</label>
                <input
                  type="text"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Resumen del contenido técnico..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">Objetivos del Programa (Uno por línea)</label>
                <textarea
                  rows={3}
                  value={objectivesInput}
                  onChange={e => setObjectivesInput(e.target.value)}
                  placeholder="Aprender el uso de osciloscopio digital&#10;Interpretar señales de sensor CKP Hall&#10;Localizar fallas de red CAN Bus"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Structure Builder (Modules & Lessons) */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              2. Constructor de Módulos y Lecciones
            </h4>

            {/* Module Adding Form */}
            <form onSubmit={handleAddModule} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <h5 className="text-xs font-bold text-slate-800">Añadir Nuevo Módulo</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Nombre del Módulo (ej: Módulo 1: Fundamentos de Osciloscopios)"
                  value={newModuleTitle}
                  onChange={e => setNewModuleTitle(e.target.value)}
                  className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                />
                <input
                  type="text"
                  placeholder="Descripción del Módulo"
                  value={newModuleDesc}
                  onChange={e => setNewModuleDesc(e.target.value)}
                  className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition"
              >
                + Añadir Módulo
              </button>
            </form>

            {/* Lesson Adding Form */}
            <form onSubmit={handleAddLessonToModule} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <h5 className="text-xs font-bold text-slate-800">Añadir Lección a Módulo Existente</h5>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Módulo Destino</label>
                  <select
                    value={selectedModuleId}
                    onChange={e => setSelectedModuleId(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                  >
                    {modules.map(m => (
                      <option key={m.id} value={m.id}>{m.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Tipo de Lección</label>
                  <select
                    value={lessonType}
                    onChange={e => setLessonType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                  >
                    <option value="video">Texto / Video Clase</option>
                    <option value="quiz">Quiz Teórico (Quiz Builder)</option>
                    <option value="interactive">Práctica Interactiva</option>
                    <option value="pdf">Documento PDF / Manual</option>
                    <option value="lab">Laboratorio Virtual</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Duración</label>
                  <input
                    type="text"
                    value={lessonDuration}
                    onChange={e => setLessonDuration(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Título de la Lección *</label>
                <input
                  type="text"
                  value={lessonTitle}
                  onChange={e => setLessonTitle(e.target.value)}
                  placeholder="Ej: Medición de señales inductivas vs Hall en motores Toyota"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>

              {lessonType === 'quiz' && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                  <span className="text-xs text-blue-900 font-bold">
                    {lessonQuiz ? `Quiz Configurado (${lessonQuiz.questions.length} preguntas)` : 'No se ha adjuntado un Quiz todavía'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuizModalOpen(true)}
                    className="px-3 py-1.5 bg-blue-600 text-white font-bold text-xs rounded-lg shadow"
                  >
                    Abrir Quiz Builder Modal
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition"
              >
                + Añadir Lección al Módulo
              </button>
            </form>

            {/* Rendered Modules & Lessons Tree */}
            <div className="space-y-3 pt-2">
              {modules.map((mod, mIdx) => (
                <div key={mod.id} className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-blue-900 bg-blue-50 px-2.5 py-1 rounded-lg">
                      Módulo {mIdx + 1}: {mod.title}
                    </span>
                    <button
                      onClick={() => setModules(prev => prev.filter(m => m.id !== mod.id))}
                      className="text-xs text-rose-600 font-bold hover:underline"
                    >
                      Eliminar
                    </button>
                  </div>
                  
                  <div className="space-y-1.5 pl-4 border-l-2 border-slate-100">
                    {mod.lessons.map((les, lIdx) => (
                      <div key={les.id} className="p-2 bg-slate-50 rounded-lg text-xs flex items-center justify-between">
                        <div>
                          <strong className="text-slate-800">{lIdx + 1}. {les.title}</strong>
                          <span className="ml-2 text-[10px] px-2 py-0.5 rounded bg-slate-200 text-slate-700 uppercase font-bold">
                            {les.type}
                          </span>
                        </div>
                        <span className="text-slate-400 text-[11px]">{les.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Save Button */}
          <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
            <button
              onClick={() => setActiveTab('courses')}
              className="px-5 py-2.5 rounded-xl bg-slate-200 font-bold text-xs text-slate-700 hover:bg-slate-300"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveCourse}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 font-extrabold text-xs text-white shadow-md flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Programa en el Servidor</span>
            </button>
          </div>

        </div>
      )}

      {/* VIEW 3: ESTUDIANTES */}
      {activeTab === 'students' && (
        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">Nómina de Estudiantes Inscritos</h3>
            <p className="text-xs text-slate-500">Monitoreo de rendimiento, progreso general y exámenes aprobados.</p>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                  <th className="p-3">Estudiante</th>
                  <th className="p-3">Taller / País</th>
                  <th className="p-3">XP</th>
                  <th className="p-3">Progreso</th>
                  <th className="p-3">Prom. Quizzes</th>
                  <th className="p-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {students.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{s.name}</div>
                      <div className="text-[11px] text-slate-400">{s.email}</div>
                    </td>
                    <td className="p-3 font-medium text-slate-600">{s.workshopName} ({s.country})</td>
                    <td className="p-3 font-bold text-amber-600">{s.xp} XP</td>
                    <td className="p-3 font-bold text-blue-600">{s.progress}%</td>
                    <td className="p-3 font-bold text-emerald-600">{s.quizScoreAvg}%</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 4: ANALÍTICA */}
      {activeTab === 'analytics' && (
        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">Métricas Globales de Instructor</h3>
            <p className="text-xs text-slate-500">Rendimiento académico y estadísticas de interacción.</p>
          </div>

          {analytics && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-1">
                <span className="text-xs font-bold text-blue-700 uppercase">Cursos Totales</span>
                <div className="text-2xl font-extrabold text-blue-900">{analytics.totalCourses}</div>
                <div className="text-[11px] text-blue-600 font-semibold">{analytics.publishedCourses} Publicados</div>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                <span className="text-xs font-bold text-emerald-700 uppercase">Estudiantes Activos</span>
                <div className="text-2xl font-extrabold text-emerald-900">{analytics.totalStudents}</div>
                <div className="text-[11px] text-emerald-600 font-semibold">{analytics.totalCertificates} Certificados</div>
              </div>
              <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 space-y-1">
                <span className="text-xs font-bold text-purple-700 uppercase">Promedio Quizzes</span>
                <div className="text-2xl font-extrabold text-purple-900">{analytics.avgQuizScore}%</div>
                <div className="text-[11px] text-purple-600 font-semibold">Tasa Aprobación: 88%</div>
              </div>
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
                <span className="text-xs font-bold text-amber-700 uppercase">Satisfacción Alumnos</span>
                <div className="text-2xl font-extrabold text-amber-900">⭐ {analytics.satisfactionRating} / 5</div>
                <div className="text-[11px] text-amber-600 font-semibold">{analytics.completionRate}% Finalización</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* QUIZ BUILDER MODAL */}
      {quizModalOpen && (
        <QuizBuilderModal
          initialQuiz={lessonQuiz}
          onSaveQuiz={(q) => {
            setLessonQuiz(q);
            setQuizModalOpen(false);
          }}
          onClose={() => setQuizModalOpen(false)}
        />
      )}

      {/* CASE BUILDER MODAL */}
      {caseModalOpen && (
        <CaseBuilderModal
          onSaveCase={(compiledCase) => {
            fetch('/api/v1/instructor/cases', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(compiledCase)
            })
              .then(res => res.json())
              .then(data => {
                if (data.success) {
                  alert('¡Caso de diagnóstico registrado correctamente!');
                  setCaseModalOpen(false);
                }
              })
              .catch(err => alert(`Error: ${err.message}`));
          }}
          onClose={() => setCaseModalOpen(false)}
        />
      )}

      {/* LAB BUILDER MODAL */}
      {labModalOpen && (
        <LabBuilderModal
          onSaveLab={(compiledLab) => {
            fetch('/api/v1/instructor/labs', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(compiledLab)
            })
              .then(res => res.json())
              .then(data => {
                if (data.success) {
                  alert('¡Laboratorio virtual creado con éxito!');
                  setLabModalOpen(false);
                }
              })
              .catch(err => alert(`Error: ${err.message}`));
          }}
          onClose={() => setLabModalOpen(false)}
        />
      )}

    </div>
  );
};
