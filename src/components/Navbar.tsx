import React, { useState, useEffect, useRef } from 'react';
import { ViewMode } from '../types';
import {
  Menu, X, Settings, Search, User, Cpu, Car, BookOpen, MessageSquare, Award, Wrench,
  ShieldCheck, Sparkles, Trophy, Activity, Building2, Layers, ShoppingBag, DollarSign,
  Edit3, ChevronDown, Shield, FileText, Zap, Compass, Users, CheckCircle2, Stethoscope, BarChart3
} from 'lucide-react';
import { NotificationBell } from './notifications/NotificationBell';
import { useYoveCart } from '../context/YoveCartContext';

interface NavbarProps {
  currentView: ViewMode;
  onNavigateView: (view: ViewMode) => void;
  studentXp?: number;
  studentLevel?: string;
  onOpenEnrollModal?: () => void;
}

interface NavCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  items: {
    id: ViewMode;
    label: string;
    description: string;
    icon: React.ReactNode;
    badge?: string;
  }[];
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigateView,
  studentXp = 1250,
  studentLevel = 'Técnico Avanzado',
  onOpenEnrollModal
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { openCart, itemsCount } = useYoveCart();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigateView('cursos');
    }
  };

  const menuCategories: NavCategory[] = [
    {
      id: 'academia',
      label: 'Academia 3.0',
      icon: <BookOpen className="w-4 h-4 text-cyan-400" />,
      badge: '3.0',
      items: [
        { id: 'cursos', label: 'Catálogo de Cursos', description: 'Módulos teóricos y prácticos con videos en HD', icon: <BookOpen className="w-4 h-4 text-cyan-400" /> },
        { id: 'curriculum', label: 'Malla Curricular 3.0', description: 'Semestres del I al VI con mapa de competencias', icon: <Layers className="w-4 h-4 text-emerald-400" />, badge: 'NUEVO' },
        { id: 'rutas', label: 'Rutas de Aprendizaje', description: 'Especializaciones guiadas paso a paso', icon: <Compass className="w-4 h-4 text-amber-400" /> },
        { id: 'marcas', label: 'Marcas & Fabricantes', description: 'Línea directa Toyota, Nissan, Hyundai, VAG', icon: <Car className="w-4 h-4 text-blue-400" /> },
        { id: 'garage', label: 'Mi Garaje Virtual', description: 'Gestor de vehículos de clientes y pruebas', icon: <Car className="w-4 h-4 text-purple-400" /> },
      ]
    },
    {
      id: 'diagnostico',
      label: 'Diagnóstico & IA',
      icon: <Cpu className="w-4 h-4 text-amber-400" />,
      badge: 'PRO',
      items: [
        { id: 'dtc', label: 'DTC PRO Scanner', description: 'Buscador inteligente de códigos de falla P, C, B, U', icon: <Activity className="w-4 h-4 text-orange-400" />, badge: 'PRO' },
        { id: 'ai', label: 'YOVE AI Copilot', description: 'Asistente de diagnóstico en tiempo real', icon: <Sparkles className="w-4 h-4 text-amber-400" />, badge: 'IA' },
        { id: 'lab', label: 'Laboratorio Interactivo', description: 'Simulaciones multímetro, osciloscopio y ECU', icon: <Cpu className="w-4 h-4 text-cyan-400" /> },
        { id: 'cases', label: 'Casos de Estudio', description: 'Fallas reales en taller con oscilogramas', icon: <ShieldCheck className="w-4 h-4 text-emerald-400" /> },
        { id: 'evaluaciones', label: 'Exámenes & Quizzes', description: 'Certificación por módulos con temporizador', icon: <Trophy className="w-4 h-4 text-yellow-400" /> },
        { id: 'shield', label: 'Shield AI Security', description: 'Auditoría de diagnósticos y seguridad vehicular', icon: <Shield className="w-4 h-4 text-red-400" /> },
      ]
    },
    {
      id: 'comunidad',
      label: 'Comunidad & Red',
      icon: <Users className="w-4 h-4 text-blue-400" />,
      items: [
        { id: 'comunidad', label: 'Foro Técnico Global', description: 'Consultas de fallas entre técnicos internacionales', icon: <MessageSquare className="w-4 h-4 text-blue-400" /> },
        { id: 'instructores', label: 'Instructores Máster', description: 'Ingenieros automotrices certificados', icon: <Users className="w-4 h-4 text-purple-400" /> },
        { id: 'mi-aprendizaje', label: 'App Móvil & Offline', description: 'Instala la PWA y descarga clases para el taller', icon: <Zap className="w-4 h-4 text-amber-400" /> },
      ]
    },
    {
      id: 'b2b',
      label: 'Planes & B2B',
      icon: <Building2 className="w-4 h-4 text-emerald-400" />,
      items: [
        { id: 'planes', label: 'Planes Suscripción', description: 'Standard, Premium y Pro para talleres', icon: <Award className="w-4 h-4 text-emerald-400" />, badge: 'OFERTA' },
        { id: 'institucion', label: 'Planes Institucionales', description: 'Licencias masivas para institutos y talleres', icon: <Building2 className="w-4 h-4 text-blue-400" /> },
        { id: 'arquitectura-cloud', label: 'Infraestructura Scale', description: 'SLA y arquitectura cloud de alta concurrencia', icon: <Layers className="w-4 h-4 text-cyan-400" /> },
      ]
    },
    {
      id: 'studio',
      label: 'Studio & Admin',
      icon: <Edit3 className="w-4 h-4 text-cyan-400" />,
      badge: 'CMS',
      items: [
        { id: 'content-studio', label: 'Content Studio CMS 4.0', description: 'Creador de cursos, videos y sílabos', icon: <Edit3 className="w-4 h-4 text-cyan-400" />, badge: 'CMS' },
        { id: 'admin', label: 'Panel de Administración', description: 'Gestión global de alumnos, pagos y cursos', icon: <Wrench className="w-4 h-4 text-purple-400" /> },
        { id: 'ventas-admin', label: 'Centro de Ventas & Finanzas', description: 'Métricas de ingresos, suscripciones y pasarelas', icon: <BarChart3 className="w-4 h-4 text-emerald-400" /> },
      ]
    }
  ];

  // Quick Direct Access Links for Top Navbar Pill Bar
  const quickNavLinks: { id: ViewMode; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'inicio', label: 'Inicio', icon: <Zap className="w-3.5 h-3.5 text-amber-400" /> },
    { id: 'cursos', label: 'Cursos', icon: <BookOpen className="w-3.5 h-3.5 text-cyan-400" /> },
    { id: 'curriculum', label: 'Malla 3.0', icon: <Layers className="w-3.5 h-3.5 text-emerald-400" />, badge: '3.0' },
    { id: 'dtc', label: 'DTC PRO', icon: <Activity className="w-3.5 h-3.5 text-orange-400" />, badge: 'PRO' },
    { id: 'ai', label: 'YOVE AI', icon: <Sparkles className="w-3.5 h-3.5 text-amber-400" /> },
    { id: 'lab', label: 'Lab', icon: <Cpu className="w-3.5 h-3.5 text-cyan-400" /> },
    { id: 'content-studio', label: 'Studio CMS', icon: <Edit3 className="w-3.5 h-3.5 text-purple-400" />, badge: 'CMS' },
    { id: 'mi-aprendizaje', label: 'Mi Panel', icon: <User className="w-3.5 h-3.5 text-blue-400" /> },
  ];

  return (
    <header
      ref={dropdownRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#060a19]/98 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.7)] border-b border-cyan-500/30 py-1'
          : 'bg-gradient-to-r from-[#060a19] via-[#0b1638] to-[#060a19] border-b border-blue-900/30 py-2'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Main Header Top Row */}
        <div className="flex items-center justify-between gap-2 sm:gap-4 h-[60px]">
          
          {/* Brand Logo - YOVE Academy 3.0 */}
          <button
            onClick={() => {
              onNavigateView('inicio');
              setActiveDropdown(null);
            }}
            className="flex items-center gap-2.5 group shrink-0 text-left cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#ff6f00] via-[#ff8f00] to-[#00d2ff] p-0.5 shadow-lg shadow-orange-950/40 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[#070d24] rounded-[10px] flex items-center justify-center text-amber-400 group-hover:rotate-12 transition-transform duration-500">
                <Settings className="w-5 h-5" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="font-black text-lg sm:text-xl tracking-tight text-white flex items-center gap-1.5 leading-none">
                Yove <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6f00] via-[#ff9100] to-cyan-400">Academy</span>
                <span className="text-[10px] font-black px-1.5 py-0.2 rounded-md bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm">
                  3.0
                </span>
              </div>
              <span className="text-[9px] uppercase tracking-wider text-cyan-300/80 font-bold mt-0.5">
                Plataforma Educativa Automotriz
              </span>
            </div>
          </button>

          {/* Global Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden xl:flex items-center bg-black/60 border border-slate-700/80 hover:border-cyan-500/60 focus-within:border-cyan-400 rounded-full px-3.5 py-1.5 w-64 focus-within:w-80 transition-all duration-300 shadow-inner"
          >
            <Search className="w-4 h-4 text-cyan-400 shrink-0 mr-2" />
            <input
              type="text"
              placeholder="Buscar DTC (P0171), Marcas, Cursos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none w-full font-medium"
            />
          </form>

          {/* Main Categorized Dropdown Menu Items (Encabezado 3.0) */}
          <nav className="hidden lg:flex items-center gap-1">
            {menuCategories.map((cat) => {
              const isOpen = activeDropdown === cat.id;
              const isCategoryActive = cat.items.some(i => i.id === currentView);

              return (
                <div key={cat.id} className="relative">
                  <button
                    onClick={() => setActiveDropdown(isOpen ? null : cat.id)}
                    onMouseEnter={() => setActiveDropdown(cat.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      isCategoryActive
                        ? 'bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 shadow-md'
                        : 'text-slate-200 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {cat.icon}
                    <span>{cat.label}</span>
                    {cat.badge && (
                      <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 uppercase">
                        {cat.badge}
                      </span>
                    )}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-cyan-400' : 'text-slate-400'}`} />
                  </button>

                  {/* Mega-Menu Dropdown Panel */}
                  {isOpen && (
                    <div
                      onMouseLeave={() => setActiveDropdown(null)}
                      className="absolute top-full left-0 mt-1.5 w-80 bg-[#090f28]/98 border border-cyan-500/30 rounded-2xl p-2.5 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-200 z-50 space-y-1"
                    >
                      <div className="px-3 py-1.5 border-b border-slate-800 text-[10px] font-extrabold uppercase tracking-wider text-cyan-400 flex items-center justify-between">
                        <span>{cat.label}</span>
                        <span className="text-slate-500">YOVE 3.0</span>
                      </div>

                      {cat.items.map((subItem) => {
                        const isSubActive = currentView === subItem.id;
                        return (
                          <button
                            key={subItem.id}
                            onClick={() => {
                              onNavigateView(subItem.id);
                              setActiveDropdown(null);
                            }}
                            className={`w-full p-2.5 rounded-xl text-left transition flex items-start gap-3 cursor-pointer group ${
                              isSubActive
                                ? 'bg-cyan-600/20 border border-cyan-500/50 text-white'
                                : 'hover:bg-slate-800/80 text-slate-300 hover:text-white'
                            }`}
                          >
                            <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg group-hover:scale-110 transition-transform shrink-0 mt-0.5">
                              {subItem.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                                  {subItem.label}
                                </span>
                                {subItem.badge && (
                                  <span className="text-[9px] font-black px-1.5 py-0.2 rounded-md bg-amber-400 text-slate-950 uppercase shrink-0">
                                    {subItem.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                                {subItem.description}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right Action Section (XP, Cart, Notifications, Enroll CTA) */}
          <div className="flex items-center gap-2">
            <NotificationBell onNavigate={onNavigateView} />

            <button
              onClick={openCart}
              className="relative p-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-amber-400/80 text-amber-400 transition cursor-pointer shadow-md"
              title="Ver Carrito de Compras"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              {itemsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-[10px] font-black rounded-full flex items-center justify-center animate-pulse shadow-md">
                  {itemsCount}
                </span>
              )}
            </button>

            {/* Student XP Badge */}
            <button
              onClick={() => onNavigateView('mi-aprendizaje')}
              className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                currentView === 'mi-aprendizaje'
                  ? 'bg-blue-900/50 border-cyan-400 text-white'
                  : 'bg-slate-900/80 border-slate-700 hover:border-slate-500 text-slate-200'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#ff6f00] to-amber-400 text-slate-950 text-[10px] font-black flex items-center justify-center shadow-md">
                XP
              </div>
              <div className="text-left text-[11px]">
                <div className="font-black text-[#ff9100] leading-none">{studentXp} XP</div>
                <div className="text-[9px] text-slate-400 leading-none mt-0.5">{studentLevel}</div>
              </div>
            </button>

            {/* CTA Enroll */}
            <button
              onClick={onOpenEnrollModal}
              className="hidden md:block rounded-xl bg-gradient-to-r from-[#ff6f00] via-[#ff8f00] to-[#00d2ff] p-0.5 shadow-lg shadow-orange-950/40 hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <div className="px-3.5 py-1.5 bg-[#0a0e27] hover:bg-transparent text-white font-black text-xs rounded-[10px] transition-colors flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>Inscribirse 3.0</span>
              </div>
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-white p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition cursor-pointer"
              aria-label="Abrir Menú Completo"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#ff6f00]" /> : <Menu className="w-6 h-6 text-cyan-400" />}
            </button>
          </div>
        </div>

        {/* Secondary Header Strip: Fast Access Navigation Bar (Pill Bar) */}
        <div className="hidden lg:flex items-center gap-1.5 py-1.5 border-t border-slate-800/80 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400 shrink-0 mr-1 flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" /> Acceso Directo:
          </span>

          {quickNavLinks.map((link) => {
            const isActive = currentView === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  onNavigateView(link.id);
                  setActiveDropdown(null);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-[#ff6f00] text-white shadow-md shadow-orange-950/50'
                    : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-[9px] font-black px-1 py-0.1 rounded bg-cyan-400 text-slate-950 uppercase">
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Nav Drawer - Full Categorized Navigation for 3.0 */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#060a19]/98 border-b border-cyan-500/30 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-4 shadow-2xl animate-in slide-in-from-top-2 duration-300 max-h-[85vh] overflow-y-auto">
          {/* Search Input Mobile */}
          <form onSubmit={handleSearchSubmit} className="flex items-center bg-black/70 border border-slate-700 rounded-xl px-3 py-2">
            <Search className="w-4 h-4 text-cyan-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Buscar en YOVE 3.0 (DTC, Cursos, etc.)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none w-full"
            />
          </form>

          {/* Categorized Mobile Accordion / Groups */}
          <div className="space-y-4">
            {menuCategories.map((cat) => (
              <div key={cat.id} className="space-y-1.5">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400 flex items-center gap-1 px-1">
                  {cat.icon}
                  <span>{cat.label}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {cat.items.map((item) => {
                    const isActive = currentView === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onNavigateView(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-bold text-left transition cursor-pointer ${
                          isActive
                            ? 'bg-gradient-to-r from-[#ff6f00] to-orange-600 text-white shadow-md'
                            : 'bg-slate-900/80 text-slate-200 hover:bg-slate-800 border border-slate-800'
                        }`}
                      >
                        <div className="p-1.5 bg-slate-950 rounded-lg shrink-0">
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span>{item.label}</span>
                            {item.badge && (
                              <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 uppercase">
                                {item.badge}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => {
                onNavigateView('mi-aprendizaje');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-xs font-bold text-[#ff9100]"
            >
              <Trophy className="w-4 h-4" />
              <span>Mi Panel ({studentXp} XP)</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenEnrollModal) onOpenEnrollModal();
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#ff6f00] to-cyan-500 text-xs font-bold text-white shadow-lg"
            >
              Inscribirse 3.0
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
