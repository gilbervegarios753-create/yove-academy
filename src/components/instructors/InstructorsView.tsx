import React, { useState, useEffect } from 'react';
import { User, Award, ShieldCheck, Star, Layers, Users, Sparkles, BarChart3 } from 'lucide-react';
import { FadeInOnScroll } from '../FadeInOnScroll';
import { InstructorCourseCreator } from './InstructorCourseCreator';
import { Course } from '../../types';

interface InstructorsViewProps {
  onCourseCreated?: (newCourse: Course) => void;
}

export const InstructorsView: React.FC<InstructorsViewProps> = ({ onCourseCreated }) => {
  const [activeTab, setActiveTab] = useState<'faculty' | 'creator' | 'analytics'>('faculty');
  const [instructorMetrics, setInstructorMetrics] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('yove_token');
    if (token) {
      fetch('/api/v1/analytics/instructor', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setInstructorMetrics(data.instructorMetrics);
          }
        })
        .catch(err => console.error("Error loading instructor analytics:", err));
    }
  }, []);

  const instructors = [
    {
      id: 'i1',
      name: 'Ing. Fernando Varga',
      title: 'Máster en Diagnóstico y Redes Multiplexadas',
      experience: '18 años de experiencia en campo',
      bio: 'Especialista en redes CAN/LIN, reprogramación de unidades Bosch/Denso y osciloscopios de 4 canales.',
      avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300',
      rating: 4.9,
      students: 8400
    },
    {
      id: 'i2',
      name: 'Téc. Carlos Mendoza',
      title: 'Especialista en Vehículos Eléctricos e Híbridos (EV/HEV)',
      experience: '12 años certificado CAT III High Voltage',
      bio: 'Instructor internacional en seguridad de alto voltaje, balanceo de baterías BMS e inversores de frecuencia.',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
      rating: 4.95,
      students: 6200
    },
    {
      id: 'i3',
      name: 'Especialista Roberto Gómez',
      title: 'Docente en Reparación de ECUs & Chiptuning',
      experience: '15 años reconstruyendo módulos electrónicos',
      bio: 'Experto en microsoldadura SMD, clonación de computadoras de motor y reprogramación J2534 Passthru.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      rating: 4.98,
      students: 5100
    }
  ];

  return (
    <div className="py-12 bg-slate-50 min-h-screen text-slate-800 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Section */}
        <FadeInOnScroll direction="up">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold uppercase tracking-wider">
              <User className="w-3.5 h-3.5 text-blue-600" />
              Cuerpo Docente & Analítica de Instructor
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Aprende de Ingenieros & Supervisa tus Programas Técnicos
            </h1>
            <p className="text-sm sm:text-base text-slate-600">
              Nuestros instructores dirigen talleres automotrices y capacitan a técnicos en toda América Latina.
            </p>

            {/* View Switcher Tabs */}
            <div className="inline-flex items-center p-1 bg-slate-200 rounded-xl mt-4 border border-slate-300">
              <button
                onClick={() => setActiveTab('faculty')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'faculty'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Docentes Especialistas</span>
              </button>
              <button
                onClick={() => setActiveTab('creator')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'creator'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Portal de Creador</span>
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'analytics'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Mis Métricas</span>
              </button>
            </div>
          </div>
        </FadeInOnScroll>

        {/* TAB 1: FACULTY DIRECTORY */}
        {activeTab === 'faculty' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {instructors.map((inst) => (
              <div key={inst.id} className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={inst.avatarUrl}
                      alt={inst.name}
                      className="w-16 h-16 rounded-2xl border-2 border-blue-600 object-cover shadow-sm shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{inst.rating} ({inst.students}+ alumnos)</span>
                      </div>
                      <h2 className="text-base font-extrabold text-slate-900 mt-0.5">{inst.name}</h2>
                      <p className="text-xs text-blue-700 font-bold">{inst.title}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{inst.bio}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Instructor Verificado Oficial
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: INSTRUCTOR CREATOR TOOLS */}
        {activeTab === 'creator' && (
          <FadeInOnScroll direction="up">
            <InstructorCourseCreator onCourseCreated={onCourseCreated} />
          </FadeInOnScroll>
        )}

        {/* TAB 3: INSTRUCTOR ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Analítica de Mis Cursos Publicados
              </h2>
              <p className="text-xs text-slate-600">
                Alumnos, progreso, tasa de finalización, promedio de calificaciones y horas de práctica.
              </p>

              {instructorMetrics && instructorMetrics.courses && instructorMetrics.courses.length > 0 ? (
                <div className="space-y-4 pt-2">
                  {instructorMetrics.courses.map((c: any) => (
                    <div key={c.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{c.title}</div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">{c.category}</span>
                      </div>
                      <div className="flex items-center gap-6 text-xs font-bold">
                        <div className="text-center">
                          <div className="text-blue-600 text-base">{c.studentsCount}</div>
                          <div className="text-[10px] text-slate-500 uppercase">Alumnos</div>
                        </div>
                        <div className="text-center">
                          <div className="text-emerald-600 text-base">{c.completionRate}%</div>
                          <div className="text-[10px] text-slate-500 uppercase">Finalización</div>
                        </div>
                        <div className="text-center">
                          <div className="text-amber-600 text-base">{c.averageScore} pts</div>
                          <div className="text-[10px] text-slate-500 uppercase">Promedio</div>
                        </div>
                        <div className="text-center">
                          <div className="text-purple-600 text-base">{c.totalHours}h</div>
                          <div className="text-[10px] text-slate-500 uppercase">Práctica</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500 text-xs">
                  No hay cursos registrados o analíticas disponibles en este momento.
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
