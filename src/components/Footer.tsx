import React, { useState } from 'react';
import { Settings, Mail, Phone, MapPin, Youtube, Facebook, Instagram, Linkedin } from 'lucide-react';
import { LegalModal } from './common/LegalModal';

export const Footer: React.FC = () => {
  const [legalModalTab, setLegalModalTab] = useState<'terms' | 'privacy' | 'cookies' | 'ai' | 'disclaimer' | 'certificates' | null>(null);

  return (
    <footer className="bg-[#0a0e27] text-gray-300 pt-16 pb-8 border-t border-blue-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-gray-800">
          {/* Column 1: Brand & Overview */}
          <div className="space-y-4">
            <a href="#" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#ff6f00] to-[#ff9100] flex items-center justify-center text-white shadow-md">
                <Settings className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Yove <span className="text-[#ff6f00]">Academy</span>
              </span>
            </a>
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              Excelencia Técnica Automotriz. Formando la nueva generación de especialistas en mecatrónica, diagnóstico OBD-II, ECUs y vehículos eléctricos.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#ff6f00] text-gray-400 hover:text-white flex items-center justify-center transition">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#ff6f00] text-gray-400 hover:text-white flex items-center justify-center transition">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#ff6f00] text-gray-400 hover:text-white flex items-center justify-center transition">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#ff6f00] text-gray-400 hover:text-white flex items-center justify-center transition">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#cursos" className="hover:text-[#ff6f00] transition">Nuestros Cursos</a>
              </li>
              <li>
                <a href="#especialidades" className="hover:text-[#ff6f00] transition">Metodología & Especialidades</a>
              </li>
              <li>
                <a href="#beneficios" className="hover:text-[#ff6f00] transition">Estadísticas & Beneficios</a>
              </li>
              <li>
                <a href="#testimonios" className="hover:text-[#ff6f00] transition">Testimonios de Alumnos</a>
              </li>
              <li>
                <a href="#contacto" className="hover:text-[#ff6f00] transition">Contacto Directo</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Contacto</h4>
            <div className="space-y-2.5 text-xs text-gray-400">
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#ff6f00]" />
                contacto@yoveacademy.com
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#ff6f00]" />
                +51 987 654 321
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#ff6f00]" />
                Av. Tecnotrónica 450, Lima, Perú
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© 2026 Yove Academy. Todos los derechos reservados. Excelencia Técnica Automotriz.</p>
          <div className="flex gap-4">
            <button onClick={() => setLegalModalTab('terms')} className="hover:text-gray-300 cursor-pointer">Términos y Condiciones</button>
            <button onClick={() => setLegalModalTab('privacy')} className="hover:text-gray-300 cursor-pointer">Política de Privacidad</button>
            <button onClick={() => setLegalModalTab('certificates')} className="hover:text-gray-300 cursor-pointer">Verificar Certificado</button>
          </div>
        </div>
      </div>

      {legalModalTab && (
        <LegalModal
          initialTab={legalModalTab}
          onClose={() => setLegalModalTab(null)}
        />
      )}
    </footer>
  );
};
