import React, { useState, useEffect } from 'react';
import { CoreApi } from '../services/api/coreApi';
import { Course } from '../types';
import { Search, Sparkles, Star, Clock, User, Filter, CheckCircle2, Info, ArrowRight, BookOpen, Loader2, ShoppingBag } from 'lucide-react';
import { FadeInOnScroll } from './FadeInOnScroll';
import { useYoveCart } from '../context/YoveCartContext';

interface CoursesSectionProps {
  onSelectCourse: (course: Course) => void;
}

export const CoursesSection: React.FC<CoursesSectionProps> = ({ onSelectCourse }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { addToCart } = useYoveCart();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [coursesData, catsData] = await Promise.all([
          CoreApi.getCourses(),
          CoreApi.getCategories()
        ]);
        setCourses(coursesData);
        setCategories(catsData);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredCourses = courses.filter((course) => {
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.categoryLabel?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesLevel && matchesSearch;
  });

  return (
    <section id="cursos" className="py-16 bg-[#f8fafc] text-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header Section */}
        <FadeInOnScroll direction="up">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Catálogo Unificado YOVE Academy (50 Cursos)
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Programas Especializados de Formación Técnica
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Explora nuestros 50 cursos organizados en las 14 áreas fundamentales de la ingeniería y diagnóstico automotriz.
            </p>
          </div>
        </FadeInOnScroll>

        {/* Search & Filter Bar */}
        <FadeInOnScroll direction="up" delay={100}>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            
            {/* Search Input and Level Selector */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por curso, ECU, osciloscopio, sensor, marca..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600"
                  >
                    Limpiar
                  </button>
                )}
              </div>

              {/* Level selector */}
              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-slate-500" />
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                >
                  <option value="all">Todos los Niveles</option>
                  <option value="Inicial">Inicial / Basico</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Avanzado">Avanzado</option>
                  <option value="Experto">Experto / Máster</option>
                </select>
              </div>
            </div>

            {/* 14 Categories Pills Bar */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Categorías Especializadas ({categories.length})
                </span>
                <span className="text-xs font-semibold text-slate-600">
                  Mostrando {filteredCourses.length} de {courses.length} cursos
                </span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                    selectedCategory === 'all'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  🌐 Todas las Categorías ({courses.length})
                </button>

                {categories.map((cat) => {
                  const count = courses.filter(c => c.category === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition cursor-pointer ${
                        selectedCategory === cat.id
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        selectedCategory === cat.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </FadeInOnScroll>

        {/* Courses Cards Grid */}
        {filteredCourses.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
            <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No se encontraron cursos</h3>
            <p className="text-xs text-slate-500">Intenta cambiando el filtro de búsqueda o de categoría.</p>
            <button
              onClick={() => { setSelectedCategory('all'); setSelectedLevel('all'); setSearchQuery(''); }}
              className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition"
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group hover:border-blue-300 relative overflow-hidden"
              >
                {/* Status / Level Badge */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <span>{course.icon}</span>
                      <span>{course.categoryLabel}</span>
                    </span>

                    {course.isDemoExample ? (
                      <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-semibold flex items-center gap-1" title="Estructura demostrativa preconfigurada para el catálogo">
                        <Info className="w-3 h-3 text-amber-600" />
                        Ejemplo
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Verificado
                      </span>
                    )}
                  </div>

                  {/* Title & Level */}
                  <div>
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                      Nivel {course.level} • {course.duration}
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors mt-1 line-clamp-2">
                      {course.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {course.description}
                  </p>

                  {/* Highlights / Features list preview */}
                  {course.features && course.features.length > 0 && (
                    <div className="space-y-1 pt-2">
                      {course.features.slice(0, 2).map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Footer & CTA */}
                <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-xs font-bold text-slate-800">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{course.rating || 4.9}</span>
                      <span className="text-slate-400 font-normal">({course.reviewsCount || 100})</span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <User className="w-3 h-3 text-slate-400" />
                      <span>{course.instructor || 'Especialista YOVE'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        addToCart({
                          productId: `prod_${course.id}`,
                          courseId: course.id,
                          name: course.title,
                          type: 'COURSE',
                          price: course.price || 149.0,
                          currency: 'PEN'
                        })
                      }
                      className="p-2 rounded-xl bg-amber-500/10 text-amber-600 hover:bg-amber-500 hover:text-slate-950 font-bold transition flex items-center justify-center border border-amber-500/30 cursor-pointer"
                      title="Añadir al Carrito"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onSelectCourse(course)}
                      className="px-3 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition flex items-center gap-1 shadow-sm cursor-pointer"
                    >
                      <span>Ver</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
