import React, { useState } from 'react';
import { ContactFormData } from '../types';
import { Send, CheckCircle2, PhoneCall, Mail, MapPin, MessageSquare, Sparkles } from 'lucide-react';
import { FadeInOnScroll } from './FadeInOnScroll';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    email: '',
    phone: '',
    courseInterest: 'Sistemas Eléctricos',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) return;

    setSubmittedName(formData.fullName);
    setSubmitted(true);

    // Reset form data after 6 seconds or keep state confirmation
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      courseInterest: 'Sistemas Eléctricos',
      message: '',
    });
  };

  return (
    <section id="contacto" className="py-20 bg-gradient-to-br from-[#0a0e27] via-[#0d47a1] to-[#0a0e27] text-white relative overflow-hidden">
      {/* Background Subtle Tech Shapes */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#ff6f00]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Contact Left Information */}
          <div className="lg:col-span-5">
            <FadeInOnScroll direction="right" className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#ff9100] text-xs font-bold uppercase tracking-wider border border-white/10">
                <Sparkles className="w-3.5 h-3.5" />
                Atención Directa
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Solicita Información de Cursos
              </h2>

              <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed">
                Nuestro equipo de asesores técnicos y profesores responderá todas tus dudas sobre horarios, temarios, facilidades de pago y becas de estudio.
              </p>

              {/* Direct Contact Cards */}
              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
                  <div className="p-2.5 rounded-lg bg-[#ff6f00] text-white">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase text-gray-400 font-bold">Teléfono / WhatsApp</h4>
                    <p className="text-sm font-bold text-white mt-0.5">+51 987 654 321</p>
                    <p className="text-[11px] text-blue-200">Atención de Lunes a Sábado (8am - 8pm)</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
                  <div className="p-2.5 rounded-lg bg-[#ff6f00] text-white">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase text-gray-400 font-bold">Correo Académico</h4>
                    <p className="text-sm font-bold text-white mt-0.5">contacto@yoveacademy.com</p>
                    <p className="text-[11px] text-blue-200">Respuesta en menos de 2 horas</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
                  <div className="p-2.5 rounded-lg bg-[#ff6f00] text-white">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase text-gray-400 font-bold">Sede Central de Prácticas</h4>
                    <p className="text-sm font-bold text-white mt-0.5">Av. Tecnotrónica 450, Lima, Perú</p>
                    <p className="text-[11px] text-blue-200">Aulas Teóricas y Laboratorio de ECUs</p>
                  </div>
                </div>
              </div>
            </FadeInOnScroll>
          </div>

          {/* Contact Right Form Container */}
          <div className="lg:col-span-7">
            <FadeInOnScroll direction="left" delay={150}>
              <div className="bg-white text-gray-900 rounded-2xl p-6 sm:p-8 shadow-2xl border border-gray-100 max-w-[650px] mx-auto">
              {submitted ? (
                <div className="py-12 text-center space-y-4 animate-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#0a0e27]">
                    ¡Gracias, {submittedName}!
                  </h3>
                  <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                    Hemos recibido tu solicitud de información. Un asesor académico especializado te contactará en breve por WhatsApp o Correo Electrónico.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-6 py-2.5 rounded-lg bg-[#0d47a1] text-white text-xs font-bold hover:bg-[#1565c0] transition"
                  >
                    Enviar otra consulta
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="border-b border-gray-100 pb-3 mb-2">
                    <h3 className="text-xl font-extrabold text-[#0a0e27] flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-[#ff6f00]" />
                      Solicita Información
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Completa tus datos y nos pondremos en contacto directo contigo.
                    </p>
                  </div>

                  {/* Nombre Completo */}
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="Tu nombre y apellidos"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full p-3 text-xs sm:text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff6f00] focus:border-transparent transition bg-gray-50/50 focus:bg-white"
                    />
                  </div>

                  {/* Correo Electrónico & Teléfono */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        Correo Electrónico *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="tu@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-3 text-xs sm:text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff6f00] focus:border-transparent transition bg-gray-50/50 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        Teléfono / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="+51 987 654 321"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full p-3 text-xs sm:text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff6f00] focus:border-transparent transition bg-gray-50/50 focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* ¿Qué curso te interesa? */}
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      ¿Qué curso te interesa? *
                    </label>
                    <select
                      name="courseInterest"
                      value={formData.courseInterest}
                      onChange={handleChange}
                      className="w-full p-3 text-xs sm:text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff6f00] focus:border-transparent transition bg-gray-50/50 focus:bg-white cursor-pointer"
                    >
                      <option value="Sistemas Eléctricos">🔌 Sistemas Eléctricos ($299 USD)</option>
                      <option value="Electrónica Automotriz">🤖 Electrónica Automotriz ($349 USD)</option>
                      <option value="Diagnóstico OBD-II">🚗 Diagnóstico OBD-II ($399 USD)</option>
                      <option value="Sistemas Mecánicos">⚙️ Sistemas Mecánicos ($279 USD)</option>
                      <option value="Vehículos Eléctricos y Híbridos">🔋 Vehículos Eléctricos ($499 USD)</option>
                      <option value="Certificación Máster en Mecatrónica">🎓 Certificación Máster ($899 USD)</option>
                      <option value="Información General">ℹ️ Información General / Varios</option>
                    </select>
                  </div>

                  {/* Mensaje */}
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Mensaje (Opcional)
                    </label>
                    <textarea
                      name="message"
                      rows={3}
                      placeholder="¿Tienes alguna duda específica sobre el temario u horarios?"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full p-3 text-xs sm:text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff6f00] focus:border-transparent transition bg-gray-50/50 focus:bg-white min-h-[100px] resize-y"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#ff6f00] to-[#ff9100] hover:from-[#ff9100] hover:to-[#ff6f00] text-white font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Enviar Solicitud
                  </button>
                </form>
              )}
              </div>
            </FadeInOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
};
