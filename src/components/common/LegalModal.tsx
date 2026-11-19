import React, { useState } from 'react';
import { X, ShieldCheck, FileText, Lock, Cookie, Bot, Award } from 'lucide-react';

interface LegalModalProps {
  initialTab?: 'terms' | 'privacy' | 'cookies' | 'ai' | 'disclaimer' | 'certificates';
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ initialTab = 'terms', onClose }) => {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'cookies' | 'ai' | 'disclaimer' | 'certificates'>(initialTab);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0e1438] border border-blue-900/60 rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#070a1e] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#ff9100]" />
            <h3 className="font-extrabold text-white text-base">Marco Legal & Políticas de YOVE Academy 3.0</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 text-gray-300 hover:text-white transition"
            aria-label="Cerrar modal legal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-2 bg-black/40 border-b border-white/5 flex gap-2 overflow-x-auto text-xs font-bold text-gray-300">
          <button
            onClick={() => setActiveTab('terms')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'terms' ? 'bg-[#ff6f00] text-white' : 'hover:bg-white/5'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Términos
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'privacy' ? 'bg-[#ff6f00] text-white' : 'hover:bg-white/5'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            Privacidad
          </button>

          <button
            onClick={() => setActiveTab('cookies')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'cookies' ? 'bg-[#ff6f00] text-white' : 'hover:bg-white/5'
            }`}
          >
            <Cookie className="w-3.5 h-3.5" />
            Cookies
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'ai' ? 'bg-[#ff6f00] text-white' : 'hover:bg-white/5'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            Uso de IA
          </button>

          <button
            onClick={() => setActiveTab('disclaimer')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'disclaimer' ? 'bg-[#ff6f00] text-white' : 'hover:bg-white/5'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            Disclaimer Educativo
          </button>

          <button
            onClick={() => setActiveTab('certificates')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'certificates' ? 'bg-[#ff6f00] text-white' : 'hover:bg-white/5'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-purple-400" />
            Certificados
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-gray-300 leading-relaxed font-sans">
          {activeTab === 'terms' && (
            <div className="space-y-3">
              <h4 className="text-sm font-extrabold text-white">1. Términos y Condiciones de Uso</h4>
              <p>
                Al acceder y utilizar YOVE Academy 3.0, el usuario acepta de manera íntegra los presentes términos. La suscripción concede una licencia personal, no transferible ni exclusiva para el acceso al catálogo de cursos, simuladores de laboratorio y herramientas de diagnóstico mecatrónico.
              </p>
              <p>
                Queda estrictamente prohibida la redistribución, copia o ingeniería inversa de los algoritmos de simulación de osciloscopio, contenido audiovisual o bases de conocimientos técnicos.
              </p>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-3">
              <h4 className="text-sm font-extrabold text-white">2. Política de Privacidad & Protección de Datos</h4>
              <p>
                YOVE Academy recopila únicamente los datos estrictamente necesarios para la prestación del servicio educativo: nombre, correo electrónico, país, progreso académico, registros de vehículos en Garage y métricas de simulación.
              </p>
              <p>
                Todas las contraseñas son almacenadas mediante algoritmos criptográficos unidireccionales con sal (salt). Los datos personales nunca serán comercializados ni transferidos a terceros.
              </p>
            </div>
          )}

          {activeTab === 'cookies' && (
            <div className="space-y-3">
              <h4 className="text-sm font-extrabold text-white">3. Política de Cookies & Almacenamiento Local</h4>
              <p>
                La plataforma utiliza cookies esenciales de sesión e IndexedDB / LocalStorage para habilitar el <strong>Modo Offline</strong>, permitir la sincronización posterior de progreso y mantener la racha de estudio del alumno.
              </p>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-3">
              <h4 className="text-sm font-extrabold text-white">4. Política de Uso de Inteligencia Artificial (YOVE AI)</h4>
              <p>
                El asistente de IA (YOVE AI) está diseñado con propósitos exclusivamente educativos, pedagógicos y de apoyo a la resolución de problemas mecatrónicos en entorno de aprendizaje.
              </p>
              <p>
                La IA procesa datos de contexto de vehículos (DTC, motor, síntomas) para armar hipótesis de trabajo. No debe utilizarse como fuente primaria para intervenciones en vehículos sin previa verificación física.
              </p>
            </div>
          )}

          {activeTab === 'disclaimer' && (
            <div className="space-y-3">
              <h4 className="text-sm font-extrabold text-amber-300">5. Disclaimer Técnico & Exención de Responsabilidad</h4>
              <p className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-100 font-semibold">
                YOVE AI y los contenidos de YOVE Academy no se presentan como sustitutos de la documentación oficial del fabricante del vehículo.
              </p>
              <p className="text-white font-extrabold">
                "Verificar especificaciones y procedimientos en la documentación técnica correspondiente al vehículo antes de realizar reparaciones físicas o sustituciones de componentes en taller."
              </p>
            </div>
          )}

          {activeTab === 'certificates' && (
            <div className="space-y-3">
              <h4 className="text-sm font-extrabold text-white">6. Emisión y Verificación de Certificados Digitales</h4>
              <p>
                Los diplomas y certificados emitidos por YOVE Academy certifican la finalización satisfactoria de los módulos teóricos y las evaluaciones con nota mínima de aprobación del 80%. Cada certificado cuenta con un Hash / Código QR de verificación pública en el servidor.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#070a1e] border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#ff6f00] hover:bg-[#ff9100] text-white font-bold text-xs transition cursor-pointer"
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
};
