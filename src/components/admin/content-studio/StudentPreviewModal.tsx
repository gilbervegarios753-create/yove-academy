import React, { useState } from 'react';
import { Eye, X, BookOpen, Video, FileText, CheckCircle2, Play, Download, Award, ShieldAlert } from 'lucide-react';

interface StudentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: any;
}

export const StudentPreviewModal: React.FC<StudentPreviewModalProps> = ({
  isOpen,
  onClose,
  course
}) => {
  const [selectedLesson, setSelectedLesson] = useState<any>(null);

  if (!isOpen || !course) return null;

  const firstLesson = course.modules?.[0]?.lessons?.[0];
  const activeLesson = selectedLesson || firstLesson;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0b1021] border border-cyan-500/40 w-full max-w-6xl h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Top Preview Banner */}
        <div className="bg-gradient-to-r from-amber-600 to-yellow-600 text-white px-6 py-2 text-xs font-bold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Eye className="w-4 h-4" /> MODO PREVISUALIZACIÓN DE ESTUDIANTE ("Preview as Student")
          </span>
          <button onClick={onClose} className="hover:opacity-80 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Course Header */}
        <div className="p-6 bg-[#121936] border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 bg-cyan-950 border border-cyan-500/40 text-cyan-400 text-[10px] font-bold rounded-md uppercase">
                {course.code || 'YOVE-COURSE'}
              </span>
              <span className="text-xs text-slate-400">Semestre {course.semester || 'I'} • {course.duration || '40h'}</span>
            </div>
            <h2 className="text-xl font-bold text-white">{course.title}</h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">Instructor: <strong className="text-white">{course.instructor || 'Ing. Carlos Mendoza'}</strong></span>
          </div>
        </div>

        {/* Layout Split: Sidebar Modules & Main Lesson Viewer */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Modules Sidebar */}
          <div className="w-full lg:w-80 bg-[#0d142d] border-r border-slate-800 p-4 overflow-y-auto space-y-4 shrink-0">
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Módulos & Lecciones</h4>
            {course.modules?.map((mod: any, mIdx: number) => (
              <div key={mod.id} className="space-y-1">
                <p className="text-xs font-bold text-slate-300">Módulo {mIdx + 1}: {mod.title}</p>
                <div className="space-y-1 pl-2">
                  {mod.lessons?.map((les: any, lIdx: number) => (
                    <button
                      key={les.id}
                      onClick={() => setSelectedLesson(les)}
                      className={`w-full text-left p-2 rounded-xl text-xs flex items-center gap-2 transition ${
                        activeLesson?.id === les.id ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800'
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

          {/* Main Lesson Content */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-[#080c1d]">
            {activeLesson ? (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-white">{activeLesson.title}</h3>

                {/* Video Player or "Sin video" Fallback */}
                {activeLesson.videoUrl && activeLesson.videoUrl.trim().length > 0 ? (
                  <div className="aspect-video bg-black rounded-2xl overflow-hidden border border-slate-800">
                    <iframe
                      src={activeLesson.videoUrl.replace('watch?v=', 'embed/')}
                      title={activeLesson.title}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="p-8 border-2 border-dashed border-slate-800 rounded-2xl text-center bg-slate-900/40">
                    <Video className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                    <p className="text-slate-300 text-xs font-bold">Guía Teórica Guiada / Texto Técnico (Sin video)</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">Estudie detenidamente la información teórica y el procedimiento técnico a continuación.</p>
                  </div>
                )}

                {/* Academic Lesson Text */}
                <div className="p-6 bg-[#0e1633] border border-slate-800 rounded-2xl text-slate-200 text-sm whitespace-pre-line leading-relaxed">
                  {activeLesson.content || 'Sin texto registrado en esta lección.'}
                </div>
              </div>
            ) : (
              <div className="text-center py-20 text-slate-500 text-xs">
                Seleccione una lección del menú lateral para previsualizar.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
