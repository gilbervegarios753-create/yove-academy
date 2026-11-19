import React, { useState } from 'react';
import { TESTIMONIALS_DATA } from '../data/academyData';
import { Testimonial } from '../types';
import { Star, MessageSquarePlus, Check, User } from 'lucide-react';
import { FadeInOnScroll } from './FadeInOnScroll';

export const TestimonialsSection: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(TESTIMONIALS_DATA);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newCourse, setNewCourse] = useState('Diagnóstico OBD-II');
  const [rating, setRating] = useState(5);
  const [submittedMessage, setSubmittedMessage] = useState(false);

  const handleAddTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newComment) return;

    const initials = newName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    const newEntry: Testimonial = {
      id: String(Date.now()),
      name: newName,
      role: newRole || 'Estudiante Yove Academy',
      avatarInitials: initials || 'YA',
      rating,
      comment: newComment,
      courseTaken: newCourse,
    };

    setTestimonials([newEntry, ...testimonials]);
    setSubmittedMessage(true);
    setTimeout(() => {
      setShowAddForm(false);
      setSubmittedMessage(false);
      setNewName('');
      setNewRole('');
      setNewComment('');
    }, 2000);
  };

  return (
    <section id="testimonios" className="py-20 bg-gradient-to-b from-[#f5f7fa] via-orange-50/20 to-blue-50/30 text-[#1a1a2e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <FadeInOnScroll direction="up">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#ff6f00]">
                Casos de Éxito
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a0e27] mt-1">
                Lo Que Dicen Nuestros Estudiantes
              </h2>
              <p className="text-base text-gray-600 mt-2 max-w-2xl">
                Técnicos, ingenieros y dueños de taller que transformaron su nivel profesional con nuestra metodología.
              </p>
            </div>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="mt-4 md:mt-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-[#0d47a1] text-xs font-bold shadow-sm hover:shadow-md hover:border-[#ff6f00] transition cursor-pointer"
            >
              <MessageSquarePlus className="w-4 h-4 text-[#ff6f00]" />
              Escribir Mi Opinión
            </button>
          </div>
        </FadeInOnScroll>

        {/* Add Testimonial Modal / Collapsible Form */}
        {showAddForm && (
          <div className="mb-10 bg-white p-6 rounded-2xl border border-orange-200 shadow-xl max-w-2xl mx-auto animate-in fade-in duration-300">
            {submittedMessage ? (
              <div className="text-center py-6 text-emerald-600 font-bold flex items-center justify-center gap-2">
                <Check className="w-6 h-6" />
                ¡Gracias por compartir tu testimonio con la comunidad!
              </div>
            ) : (
              <form onSubmit={handleAddTestimonial} className="space-y-4">
                <h3 className="text-base font-bold text-[#0a0e27]">Dejar Testimonio</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Tu Nombre completo"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border rounded-lg focus:ring-2 focus:ring-[#ff6f00] outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Tu Cargo / Taller (ej. Especialista ECU)"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full px-3 py-2 text-xs border rounded-lg focus:ring-2 focus:ring-[#ff6f00] outline-none"
                  />
                </div>
                <div>
                  <textarea
                    required
                    rows={3}
                    placeholder="Escribe tu experiencia con el curso..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full px-3 py-2 text-xs border rounded-lg focus:ring-2 focus:ring-[#ff6f00] outline-none"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-semibold mr-2">Calificación:</span>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setRating(s)}
                        className="text-amber-400 hover:scale-125 transition-transform"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            s <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-lg bg-[#ff6f00] text-white text-xs font-bold hover:bg-[#ff9100] shadow"
                  >
                    Publicar Reseña
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* 3 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <FadeInOnScroll key={t.id} direction="up" delay={index * 150} className="flex flex-col">
              <div
                className="bg-white rounded-xl p-8 border-t-4 border-t-[#ff6f00] shadow-[0_5px_15px_rgba(0,0,0,0.08)] hover:-translate-y-2.5 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between h-full"
              >
                <div>
                  {/* 5 Stars */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#ff6f00] text-[#ff6f00]" />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-xs sm:text-sm text-gray-600 italic leading-relaxed mb-6">
                    "{t.comment}"
                  </p>
                </div>

                {/* Author Footer */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#0d47a1] to-[#ff6f00] p-0.5 shrink-0">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-bold text-[#0d47a1] text-xs">
                      {t.avatarInitials}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-[#0a0e27] leading-snug">{t.name}</h4>
                    <p className="text-[11px] text-gray-500">{t.role}</p>
                    <span className="inline-block mt-0.5 text-[10px] font-semibold text-[#ff6f00]">
                      Curso: {t.courseTaken}
                    </span>
                  </div>
                </div>
              </div>
            </FadeInOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};
