import React, { useState } from 'react';
import { Course } from '../types';
import { X, CheckCircle2, Clock, BarChart, BookOpen, Award, ArrowRight, UserCheck, PlayCircle, ShieldCheck, Target, ShoppingBag } from 'lucide-react';
import { useYoveCart } from '../context/YoveCartContext';

interface CourseModalProps {
  course: Course | null;
  onClose: () => void;
  onEnroll: (courseName: string, studentName: string, email: string) => void;
  onStartCourse?: (course: Course) => void;
}

export const CourseModal: React.FC<CourseModalProps> = ({ course, onClose, onEnroll, onStartCourse }) => {
  const [studentName, setStudentName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { addToCart } = useYoveCart();

  if (!course) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !email) return;
    setSubmitted(true);
    onEnroll(course.title, studentName, email);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col border border-slate-200 text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl p-2 rounded-xl bg-white/10">{course.icon}</span>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                {course.categoryLabel} • Nivel {course.level}
              </span>
              <h2 className="text-2xl font-bold text-white mt-0.5">{course.title}</h2>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 max-w-xl">{course.description}</p>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 divide-y divide-slate-100">
          
          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <Clock className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Duración</div>
                <div className="text-xs font-bold text-slate-800">{course.duration}</div>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <BarChart className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Nivel</div>
                <div className="text-xs font-bold text-slate-800">{course.level}</div>
              </div>
            </div>
            <div className="col-span-2 sm:col-span-1 flex items-center gap-2.5 p-3 rounded-xl bg-blue-50 border border-blue-200">
              <Award className="w-5 h-5 text-blue-700 shrink-0" />
              <div>
                <div className="text-[10px] text-blue-600 uppercase font-bold">Instructor</div>
                <div className="text-xs font-extrabold text-blue-900 truncate">{course.instructor || 'Especialista YOVE'}</div>
              </div>
            </div>
          </div>

          {/* Objectives if present */}
          {course.objectives && (course.objectives || []).length > 0 && (
            <div className="pt-6 space-y-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-600" />
                Objetivos del Curso
              </h3>
              <ul className="space-y-1.5 pl-1">
                {(course.objectives || []).map((obj, i) => (
                  <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Detailed Overview */}
          <div className="pt-6">
            <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              Descripción del Programa
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{course.longDescription || course.description}</p>
          </div>

          {/* Syllabus Modules */}
          <div className="pt-6">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Estructura del Contenido:</h3>
            <div className="space-y-2">
              {(course.modules || []).length > 0 ? (
                (course.modules || []).map((mod: any, idx: number) => {
                  const modTitle = typeof mod === 'string' ? mod : mod.title;
                  const modDesc = typeof mod === 'string' ? '' : mod.description;
                  const lessonsCount = typeof mod === 'string' ? 0 : (mod.lessons ? mod.lessons.length : 0);

                  return (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium flex items-start gap-3">
                      <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div className="flex-1">
                        <div className="font-bold text-slate-900">{modTitle}</div>
                        {modDesc && <p className="text-[11px] text-slate-500 mt-0.5">{modDesc}</p>}
                        {lessonsCount > 0 && (
                          <span className="text-[10px] text-blue-600 font-semibold mt-1 block">
                            {lessonsCount} Lección(es) interactiva(s) con Quiz & Práctica
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
                  Estructura temática detallada en preparación por el equipo técnico docente.
                </div>
              )}
            </div>
          </div>

          {/* CTA & Quick Enrollment */}
          <div className="pt-6">
            <div className="bg-gradient-to-r from-blue-900 to-slate-900 p-5 rounded-2xl text-white space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Acceso Inmediato LMS</span>
                  <h4 className="text-base font-bold text-white">Comienza a Estudiar Este Curso</h4>
                  <p className="text-xs text-slate-300">Avanza a tu propio ritmo con lecciones interactivas, quizzes y certificado digital.</p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      addToCart({
                        productId: `prod_${course.id}`,
                        courseId: course.id,
                        name: course.title,
                        type: 'COURSE',
                        price: course.price || 149.0,
                        currency: 'PEN'
                      });
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-extrabold text-xs border border-slate-700 transition flex items-center justify-center gap-2 cursor-pointer shrink-0"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Añadir al Carrito (S/ {course.price || 149})</span>
                  </button>

                  {onStartCourse && (
                    <button
                      onClick={() => {
                        onClose();
                        onStartCourse(course);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-lg"
                    >
                      <PlayCircle className="w-4 h-4" />
                      <span>Iniciar Demo</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
