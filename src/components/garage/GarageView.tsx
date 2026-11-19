import React, { useState, useEffect } from 'react';
import { ContentService } from '../../services/contentService';
import { useGarageData } from '../../hooks/useGarageData';
import { Brand, VehicleModel, EngineInfo, TransmissionInfo, VehicleSystem, ComponentInfo } from '../../types';
import { useAuth } from '../../context/AuthContext';
import {
  Wrench,
  Car,
  Cpu,
  Search,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  BookOpen,
  Layers,
  ShieldAlert,
  Sparkles,
  Activity,
  Gauge,
  Zap,
  Settings,
  Radio,
  FileText,
  HelpCircle,
  Info,
  Sliders,
  ArrowRight,
  GraduationCap,
  ExternalLink,
  Database,
  Heart,
  Clock,
  Bookmark,
  Loader2
} from 'lucide-react';
import { FadeInOnScroll } from '../FadeInOnScroll';

interface GarageViewProps {
  onOpenLabWithComponent?: (type: 'oscilloscope' | 'multimeter' | 'canbus') => void;
  onAskAI?: (promptText: string) => void;
  onNavigateToView?: (view: any) => void;
  onOpenCourse?: (course: any) => void;
}

export const GarageView: React.FC<GarageViewProps> = ({
  onOpenLabWithComponent,
  onAskAI,
  onNavigateToView,
  onOpenCourse
}) => {
  const { user, token } = useAuth();
  
  const [selectedBrandId, setSelectedBrandId] = useState<string>('toyota');
  const [selectedModelId, setSelectedModelId] = useState<string>('');
  const [selectedSystemCategory, setSelectedSystemCategory] = useState<string>('all');
  
  const { 
    brands, 
    models: brandModels, 
    generations,
    engines,
    transmissions: hookTransmissions,
    systems,
    components,
    ecus,
    loading: modelsLoading 
  } = useGarageData(selectedBrandId, selectedModelId, selectedSystemCategory !== 'all' ? selectedSystemCategory : undefined);
  
  const [selectedYear, setSelectedYear] = useState<number>(2019);
  const [selectedEngineCode, setSelectedEngineCode] = useState<string>('');
  const [selectedTransId, setSelectedTransId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<
    'overview' | 'general' | 'motor' | 'transmision' | 'sensores' | 'actuadores' | 'ecu' | 'dtc' | 'cursos' | 'casos' | 'labs'
  >('overview');
  const [searchDtc, setSearchDtc] = useState('');
  const [favorites, setFavorites] = useState<any[]>([]);
  const [recentVehicles, setRecentVehicles] = useState<any[]>([]);
  const [savedDbVehicles, setSavedDbVehicles] = useState<any[]>([]);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  useEffect(() => {
    if (brandModels.length > 0 && !selectedModelId) {
      setSelectedModelId(brandModels[0].id);
    }
  }, [brandModels, selectedModelId]);

  const fetchDbVehicles = async () => {
    if (!user || !token) return;
    try {
      const res = await fetch(`/api/v1/garage/vehicles/${user.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setSavedDbVehicles(data.vehicles);
      }
    } catch (e) {}
  };

  const handleSaveToDbGarage = async () => {
    if (!user || !token) return;
    try {
      const res = await fetch(`/api/v1/garage/vehicles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          user_id: user.id,
          title: `${brand.name} ${model.name} (${selectedYear})`,
          brand: brand.name,
          model: model.name,
          year: selectedYear,
          engine: engine.code,
          transmission: transmission?.name || '',
          fuel_type: engine.fuelType || 'Gasolina'
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchDbVehicles();
      }
    } catch (e) {}
  };

  const handleDeleteFromDbGarage = async (vehicleId: string) => {
    if (!user || !token) return;
    try {
      const res = await fetch(`/api/v1/garage/vehicles/${vehicleId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        fetchDbVehicles();
      }
    } catch (e) {}
  };

  const defaultBrand: Brand = {
    id: 'toyota',
    name: 'Toyota',
    country: 'Japón',
    logo: '🚗',
    popularModels: ['Corolla', 'Yaris', 'Hilux', 'RAV4'],
    disclaimer: 'Contenido independiente con fines educativos.'
  };

  const defaultModel: VehicleModel = {
    id: 'corolla-2019',
    brandId: 'toyota',
    name: 'Corolla 1.8 Dual VVT-i',
    years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
    bodyType: 'Sedan',
    engines: []
  };

  const defaultEngine: EngineInfo = {
    code: '2ZR-FAE / 1ZR-FE',
    displacement: '1.8L DOHC 16V',
    fuelType: 'Gasolina',
    power: '138 HP @ 6400 RPM',
    torque: '173 Nm @ 4000 RPM',
    ecuModel: 'Denso 32-bit RISC',
    systems: []
  };

  const defaultTransmission: TransmissionInfo = {
    id: 'cvt-multidrive',
    name: 'Transmisión Automática CVT Multidrive 7V',
    type: 'CVT',
    gears: '7 Velocidades Simuladas',
    fluidType: 'Toyota Genuine ATF WS / CVT Fluid FE',
    controlModule: 'TCM Denso / Aisin'
  };

  const brand = (brands && brands.find(b => b.id === selectedBrandId)) || brands[0] || defaultBrand;
  const model = (brandModels && brandModels.find((m: any) => m.id === selectedModelId)) || brandModels[0] || defaultModel;
  const engine = (engines && engines.find((e: any) => e.code === selectedEngineCode || e.id === selectedEngineCode)) || engines[0] || defaultEngine;
  const transmissions = (engine && (engine as any).transmissions) || (hookTransmissions && hookTransmissions.length > 0 ? hookTransmissions : [defaultTransmission]);
  const transmission = (transmissions && transmissions.find((t: any) => t.id === selectedTransId)) || transmissions[0] || defaultTransmission;

  const modelId = model?.id || defaultModel.id;

  useEffect(() => {
    if (user && token && modelId) {
      fetchDbVehicles();

      fetch(`/api/v1/garage/favorites/${user.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data && data.success && Array.isArray(data.favorites)) {
            setFavorites(data.favorites);
            setIsFavorite(data.favorites.some((f: any) => f.item_id === modelId));
          }
        }).catch(() => {});

      fetch(`/api/v1/garage/recent/${user.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data && data.success && Array.isArray(data.recent)) setRecentVehicles(data.recent);
        }).catch(() => {});

      fetch(`/api/v1/garage/recent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          user_id: user.id,
          vehicle_title: `${brand.name} ${model.name} (${selectedYear})`,
          vehicle_id: modelId,
          brand_name: brand.name
        })
      }).catch(() => {});
    }
  }, [user, token, modelId, selectedYear]);

  const toggleFavorite = async () => {
    if (!user || !token) return;
    try {
      const res = await fetch(`/api/v1/garage/favorites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          user_id: user.id,
          item_type: 'vehicle',
          item_id: model.id,
          item_data: { brand: brand.name, model: model.name, year: selectedYear, engine: engine.code }
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsFavorite(data.action === 'added');
        // Refresh favorites
        const favRes = await fetch(`/api/v1/garage/favorites/${user.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const favData = await favRes.json();
        if (favData.success) setFavorites(favData.favorites);
      }
    } catch (e) {}
  };



  // Systems filtering
  const allSystems = systems || [];
  const filteredSystems = selectedSystemCategory === 'all'
    ? allSystems
    : allSystems.filter((s: any) => s.category === selectedSystemCategory);

  // Components (Sensors & Actuators)
  const allComponents = components || [];
  const sensors = allComponents.filter((c: any) => c.type === 'sensor' || c.name.toLowerCase().includes('sensor') || c.name.toLowerCase().includes('sonda'));
  const actuators = allComponents.filter((c: any) => c.type === 'actuator' || c.name.toLowerCase().includes('válvula') || c.name.toLowerCase().includes('actuador') || c.name.toLowerCase().includes('inyector') || c.name.toLowerCase().includes('bobina'));
  // ecus variable is already destructured from useGarageData, so we'll just alias it for local use
  const filteredEcus = ecus || [];

  // Related Content from LMS
  const relatedContent = ContentService.getRelatedContentForVehicle({
    brandName: brand?.name,
    modelName: model?.name,
    engineCode: engine?.code,
    systemCategory: selectedSystemCategory !== 'all' ? selectedSystemCategory : undefined
  });

  // Safe spec display helper
  const renderSpecValue = (val?: string) => {
    if (!val || val.trim() === '' || val.toLowerCase().includes('inventada')) {
      return <span className="text-amber-400/90 font-mono italic text-xs">Información no disponible</span>;
    }
    return <span className="text-white font-semibold">{val}</span>;
  };

  return (
    <div className="py-12 bg-[#0a0e27] min-h-screen text-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Title */}
        <FadeInOnScroll direction="up">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-900/60 text-[#ff9100] text-xs font-extrabold uppercase tracking-wider border border-blue-700/50 shadow-md">
              <Wrench className="w-3.5 h-3.5 text-[#ff9100]" />
              YOVE Garage // Perfil Inteligente del Vehículo
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Taller Virtual & Ficha Técnica Educativa Multimarca
            </h1>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              Selecciona marca, modelo, año, motor, transmisión y sistema para desplegar la arquitectura electrónica oficial, oscilogramas, pines de ECU, códigos DTC y conectar directamente con la suite LMS y YOVE AI.
            </p>
          </div>
        </FadeInOnScroll>

        {/* Vehicle Selection Bar (Marca, Modelo, Año, Motor, Transmisión, Sistema) */}
        <div className="bg-gradient-to-r from-blue-950/90 via-[#0d1436] to-slate-900/90 p-6 rounded-2xl border border-blue-800/50 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-xs font-black text-[#ff9100] uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4" />
              Selector Completo de Especificaciones Técnicas
            </span>
            <span className="text-[11px] text-gray-400 font-medium">
              Base de Datos Homologada: <strong>26 Fabricantes Globales</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
            
            {/* 1. Marca */}
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-gray-300 uppercase tracking-wider block">Marca</label>
              <select
                value={selectedBrandId}
                onChange={(e) => {
                  setSelectedBrandId(e.target.value);
                  setSelectedModelId('');
                  setSelectedEngineCode('');
                  setSelectedTransId('');
                }}
                className="w-full px-3 py-2.5 rounded-xl bg-black/70 border border-white/20 text-white text-xs font-bold focus:outline-none focus:border-[#ff6f00] cursor-pointer"
              >
                {brands.map(b => (
                  <option key={b.id} value={b.id} className="bg-black text-white">
                    {b.logo} {b.name} ({b.country})
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Modelo */}
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-gray-300 uppercase tracking-wider block">Modelo</label>
              <select
                value={selectedModelId}
                onChange={(e) => {
                  setSelectedModelId(e.target.value);
                  setSelectedEngineCode('');
                  setSelectedTransId('');
                }}
                className="w-full px-3 py-2.5 rounded-xl bg-black/70 border border-white/20 text-white text-xs font-bold focus:outline-none focus:border-[#ff6f00] cursor-pointer"
              >
                {brandModels.map(m => (
                  <option key={m.id} value={m.id} className="bg-black text-white">
                    {m.name} ({(m.years || []).length > 0 ? `${m.years[0]}-${m.years[m.years.length - 1]}` : 'N/A'})
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Año */}
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-gray-300 uppercase tracking-wider block">Año</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-black/70 border border-white/20 text-white text-xs font-bold focus:outline-none focus:border-[#ff6f00] cursor-pointer"
              >
                {(model.years || [2018, 2019, 2020, 2021, 2022, 2023, 2024]).map(y => (
                  <option key={y} value={y} className="bg-black text-white">
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Motor */}
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-gray-300 uppercase tracking-wider block">Motor</label>
              <select
                value={selectedEngineCode}
                onChange={(e) => {
                  setSelectedEngineCode(e.target.value);
                  const eng = engines.find(x => x.code === e.target.value);
                  if (eng && eng.transmissions?.length) {
                    setSelectedTransId(eng.transmissions[0].id);
                  }
                }}
                className="w-full px-3 py-2.5 rounded-xl bg-black/70 border border-white/20 text-white text-xs font-bold focus:outline-none focus:border-[#ff6f00] cursor-pointer"
              >
                {engines.map(e => (
                  <option key={e.code} value={e.code} className="bg-black text-white">
                    {e.code} ({e.displacement})
                  </option>
                ))}
              </select>
            </div>

            {/* 5. Transmisión */}
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-gray-300 uppercase tracking-wider block">Transmisión</label>
              <select
                value={selectedTransId}
                onChange={(e) => setSelectedTransId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-black/70 border border-white/20 text-white text-xs font-bold focus:outline-none focus:border-[#ff6f00] cursor-pointer"
              >
                {transmissions.map(t => (
                  <option key={t.id} value={t.id} className="bg-black text-white">
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 6. Sistema */}
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-gray-300 uppercase tracking-wider block">Sistema a Filtrar</label>
              <select
                value={selectedSystemCategory}
                onChange={(e) => setSelectedSystemCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-black/70 border border-white/20 text-white text-xs font-bold focus:outline-none focus:border-[#ff6f00] cursor-pointer"
              >
                <option value="all" className="bg-black text-white">
                  Todos los Sistemas ({allSystems.length})
                </option>
                {ContentService.get15Systems().map(sys => (
                  <option key={sys.id} value={sys.id} className="bg-black text-white">
                    {sys.name}
                  </option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* Selected Vehicle Overview Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/80 via-[#0d163a] to-slate-900/90 border border-blue-700/50 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#ff6f00] to-[#ff9100] flex items-center justify-center text-4xl text-white font-black shadow-xl shrink-0">
              {brand?.logo || '🚗'}
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-blue-900/80 text-blue-300 text-[10px] font-extrabold uppercase border border-blue-600/50">
                  {engine.fuelType}
                </span>
                <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-extrabold uppercase border border-amber-500/30">
                  {transmission.type}
                </span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Perfil Verificado YOVE
                </span>
              </div>

              <div className="flex items-center gap-3">
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {brand?.name} {model.name} ({selectedYear})
                </h2>
                <button
                  onClick={toggleFavorite}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                    isFavorite
                      ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                  title={isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-400 text-rose-400' : 'text-slate-400'}`} />
                  <span>{isFavorite ? 'Favorito' : 'Guardar'}</span>
                </button>

                <button
                  onClick={handleSaveToDbGarage}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600/30 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-600/50 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                  title="Guardar este vehículo de forma persistente en SQLite"
                >
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span>Guardar en Flota SQLite</span>
                </button>
              </div>

              <p className="text-xs sm:text-sm text-gray-300 font-medium">
                Motor: <strong className="text-white font-bold">{engine.code}</strong> // {engine.displacement} // Potencia: <strong className="text-white">{engine.power}</strong>
              </p>

              {recentVehicles.length > 0 && (
                <div className="flex items-center gap-2 pt-2 overflow-x-auto pb-1">
                  <span className="text-[10px] uppercase font-extrabold text-gray-400 flex items-center gap-1 shrink-0">
                    <Clock className="w-3 h-3 text-[#ff9100]" />
                    Recientes:
                  </span>
                  {recentVehicles.slice(0, 4).map((rv: any) => (
                    <span
                      key={rv.id}
                      className="px-2 py-0.5 rounded-lg bg-black/60 border border-white/10 text-[10px] text-gray-300 shrink-0 font-medium"
                    >
                      {rv.vehicle_title}
                    </span>
                  ))}
                </div>
              )}

              {savedDbVehicles.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10 mt-2">
                  <span className="text-[10px] uppercase font-extrabold text-emerald-400 flex items-center gap-1 shrink-0">
                    <Database className="w-3 h-3 text-emerald-400" />
                    Mi Flota SQLite ({savedDbVehicles.length}):
                  </span>
                  {savedDbVehicles.map((sv: any) => (
                    <div
                      key={sv.id}
                      className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-600/40 text-[11px] text-emerald-200 font-bold flex items-center gap-2"
                    >
                      <span>{sv.title} - {sv.engine}</span>
                      <button
                        onClick={() => handleDeleteFromDbGarage(sv.id)}
                        className="text-emerald-400 hover:text-red-400 font-bold text-xs"
                        title="Eliminar de SQLite"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Prompt 05 Explicit Action Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2 w-full lg:w-auto">
            
            {/* Action 1: "Aprender este vehículo" */}
            <button
              onClick={() => {
                if (onOpenCourse && (relatedContent?.courses || []).length > 0) {
                  onOpenCourse(relatedContent.courses[0]);
                } else if (onNavigateToView) {
                  onNavigateToView('cursos');
                }
              }}
              className="px-3 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-extrabold text-[11px] flex items-center justify-center gap-1.5 shadow-lg transition cursor-pointer"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              Aprender
            </button>

            {/* Action 2: "Diagnosticar" */}
            <button
              onClick={() => {
                if (onNavigateToView) {
                  onNavigateToView('cases');
                } else {
                  setActiveTab('casos');
                }
              }}
              className="px-3 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-[11px] flex items-center justify-center gap-1.5 shadow-lg transition cursor-pointer"
            >
              <Wrench className="w-3.5 h-3.5" />
              Diagnosticar
            </button>

            {/* Action 3: "Ver cursos" */}
            <button
              onClick={() => {
                if (onNavigateToView) {
                  onNavigateToView('cursos');
                } else {
                  setActiveTab('cursos');
                }
              }}
              className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-gray-200 font-extrabold text-[11px] flex items-center justify-center gap-1.5 border border-white/20 transition cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#ff9100]" />
              Ver cursos
            </button>

            {/* Action 4: "Ver DTC" */}
            <button
              onClick={() => setActiveTab('dtc')}
              className="px-3 py-2.5 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-500/50 font-extrabold text-[11px] flex items-center justify-center gap-1.5 shadow transition cursor-pointer"
            >
              <AlertCircle className="w-3.5 h-3.5 text-red-400" />
              Ver DTC
            </button>

            {/* Action 5: "Abrir laboratorio" */}
            <button
              onClick={() => {
                if (onOpenLabWithComponent) {
                  onOpenLabWithComponent('oscilloscope');
                } else {
                  setActiveTab('labs');
                }
              }}
              className="px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[11px] flex items-center justify-center gap-1.5 shadow transition cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5" />
              Laboratorio
            </button>

            {/* Action 6: "Consultar YOVE AI" */}
            <button
              onClick={() => {
                const prompt = `Proporciona un diagnóstico guiado de taller para ${brand?.name} ${model.name} (${selectedYear}) motor ${engine.code} (${engine.fuelType}). Incluye señal de osciloscopio para sensores principales, causas comunes de falla y procedimiento paso a paso.`;
                if (onAskAI) {
                  onAskAI(prompt);
                }
              }}
              className="px-3 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-[11px] flex items-center justify-center gap-1.5 shadow transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              YOVE AI
            </button>

          </div>
        </div>

        {/* Navigation Tabs Bar for Organized Educational Specs */}
        <div className="flex items-center gap-1.5 border-b border-white/15 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'overview'
                ? 'bg-[#ff6f00] text-white shadow'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            Resumen del Vehículo
          </button>

          <button
            onClick={() => setActiveTab('general')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'general'
                ? 'bg-[#ff6f00] text-white shadow'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            Información General
          </button>

          <button
            onClick={() => setActiveTab('motor')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'motor'
                ? 'bg-[#ff6f00] text-white shadow'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Motor
          </button>

          <button
            onClick={() => setActiveTab('transmision')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'transmision'
                ? 'bg-[#ff6f00] text-white shadow'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            Transmisión
          </button>

          <button
            onClick={() => setActiveTab('sensores')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'sensores'
                ? 'bg-[#ff6f00] text-white shadow'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            Sensores ({(sensors || []).length})
          </button>

          <button
            onClick={() => setActiveTab('actuadores')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'actuadores'
                ? 'bg-[#ff6f00] text-white shadow'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            Actuadores ({(actuators || []).length})
          </button>

          <button
            onClick={() => setActiveTab('ecu')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'ecu'
                ? 'bg-[#ff6f00] text-white shadow'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            ECU & Módulos ({(ecus || []).length})
          </button>

          <button
            onClick={() => setActiveTab('dtc')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'dtc'
                ? 'bg-[#ff6f00] text-white shadow'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            Códigos DTC
          </button>

          <button
            onClick={() => setActiveTab('cursos')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'cursos'
                ? 'bg-[#ff6f00] text-white shadow'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Cursos ({(relatedContent?.courses || []).length})
          </button>

          <button
            onClick={() => setActiveTab('casos')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'casos'
                ? 'bg-[#ff6f00] text-white shadow'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            Casos ({(relatedContent?.cases || []).length})
          </button>

          <button
            onClick={() => setActiveTab('labs')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'labs'
                ? 'bg-[#ff6f00] text-white shadow'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Laboratorios
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: Ficha Rápida del Motor */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4 shadow-xl">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#ff9100]" />
                    Motorización Seleccionada
                  </h3>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50">
                    {engine.code}
                  </span>
                </div>

                <div className="space-y-2.5 text-xs text-gray-300">
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span>Cilindrada / Tipo:</span>
                    <strong className="text-white">{engine.displacement}</strong>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span>Combustible:</span>
                    <strong className="text-white">{engine.fuelType}</strong>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span>Potencia Máxima:</span>
                    <strong className="text-white">{engine.power}</strong>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span>Torque Máximo:</span>
                    {renderSpecValue(engine.torque)}
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span>Relación Compresión:</span>
                    {renderSpecValue(engine.compressionRatio)}
                  </div>
                  <div className="flex justify-between">
                    <span>Distribución:</span>
                    {renderSpecValue(engine.timingType)}
                  </div>
                </div>
              </div>

              {/* Card 2: Ficha Rápida de Transmisión */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4 shadow-xl">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <Settings className="w-4 h-4 text-[#ff9100]" />
                    Caja de Cambios / Transmisión
                  </h3>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {transmission.type}
                  </span>
                </div>

                <div className="space-y-2.5 text-xs text-gray-300">
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span>Nombre:</span>
                    <strong className="text-white">{transmission.name}</strong>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span>Relación / Marchas:</span>
                    {renderSpecValue(transmission.gears)}
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span>Módulo de Control TCM:</span>
                    {renderSpecValue(transmission.controlModule)}
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span>Solenoides / Mandos:</span>
                    {renderSpecValue(transmission.solenoids)}
                  </div>
                  <div className="flex justify-between">
                    <span>Especificación Fluido:</span>
                    {renderSpecValue(transmission.fluidType)}
                  </div>
                </div>
              </div>

              {/* Card 3: Arquitectura Electrónica y Diagnóstico */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4 shadow-xl">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#ff9100]" />
                    Diagnóstico & Redes CAN
                  </h3>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    OBD-II
                  </span>
                </div>

                <div className="space-y-2.5 text-xs text-gray-300">
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span>Protocolo OBD:</span>
                    {renderSpecValue(engine.obdProtocol)}
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span>Ubicación DLC:</span>
                    {renderSpecValue(model.obdLocation)}
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span>Norma Emisiones:</span>
                    {renderSpecValue(engine.emissionsStandard)}
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span>Arquitectura Voltaje:</span>
                    {renderSpecValue(model.voltageArchitecture)}
                  </div>
                  <div className="flex justify-between">
                    <span>Sistemas Registrados:</span>
                    <strong className="text-white">{filteredSystems.length} Sistemas</strong>
                  </div>
                </div>
              </div>

            </div>

            {/* Grid of Automotive Systems */}
            <div className="space-y-3 pt-2">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#ff9100]" />
                Sistemas de Gestión Electrónica Disponibles ({filteredSystems.length})
              </h3>

              {filteredSystems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredSystems.map(system => (
                    <div key={system.id} className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 space-y-3 transition shadow-lg">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-white flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          {system.name}
                        </h4>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 uppercase">
                          {system.category}
                        </span>
                      </div>

                      <p className="text-xs text-gray-300">
                        {system.description || 'Sistema electrónico de gestión e integración vehicular con unidades ECU en red CAN.'}
                      </p>

                      <div className="pt-2 flex items-center justify-between text-xs text-gray-400 border-t border-white/10">
                        <span>{(system.components || []).length} Componentes registrados</span>
                        <button
                          onClick={() => setActiveTab('sensores')}
                          className="text-[#ff9100] font-bold hover:underline flex items-center gap-1 text-[11px]"
                        >
                          Ver sensores <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center space-y-2">
                  <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
                  <p className="text-sm font-bold text-gray-300">Información no disponible para el sistema filtrado</p>
                  <p className="text-xs text-gray-400">Selecciona "Todos los Sistemas" o cambia la combinación de motor/transmisión.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Información General */}
        {activeTab === 'general' && (
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <Info className="w-5 h-5 text-[#ff9100]" />
                Información General del Vehículo y Homologación
              </h3>
              <span className="text-xs font-mono text-gray-400">ID: {model.id}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-xs font-bold text-gray-400 uppercase">Fabricante / Marca:</span>
                <p className="font-extrabold text-white text-base">{brand?.name} ({brand?.country})</p>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-xs font-bold text-gray-400 uppercase">Modelo & Generación:</span>
                <p className="font-extrabold text-white text-base">{model.name} ({selectedYear})</p>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-xs font-bold text-gray-400 uppercase">Carrocería / Plataforma:</span>
                <div className="font-semibold">{renderSpecValue(model.bodyType)}</div>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-xs font-bold text-gray-400 uppercase">Arquitectura Eléctrica:</span>
                <div className="font-semibold">{renderSpecValue(model.voltageArchitecture)}</div>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-xs font-bold text-gray-400 uppercase">Conector DLC (OBD-II):</span>
                <div className="font-semibold">{renderSpecValue(model.obdLocation)}</div>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-xs font-bold text-gray-400 uppercase">Norma de Emisiones:</span>
                <div className="font-semibold">{renderSpecValue(engine.emissionsStandard)}</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-800/40 text-xs text-blue-200 space-y-1">
              <strong className="text-amber-400 font-extrabold">Aviso Técnico YOVE Academy:</strong>
              <p>
                Las especificaciones generales reflejan los datos técnicos verificados por nuestro equipo de ingenieros para {brand?.name} {model.name}. En caso de que una variante específica no cuente con registro de fábrica en la base de datos, se indicará expresamente como <em>"Información no disponible"</em> en lugar de estimaciones ficticias.
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Motor */}
        {activeTab === 'motor' && (
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#ff9100]" />
                Ficha Técnica Detallada del Motor
              </h3>
              <span className="px-3 py-1 rounded bg-blue-900/60 text-blue-300 font-mono text-xs font-bold">
                {engine.code}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-[11px] font-bold text-gray-400 uppercase">Código de Motor:</span>
                <p className="font-bold text-white">{engine.code}</p>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-[11px] font-bold text-gray-400 uppercase">Cilindrada / Tipo:</span>
                <p className="font-bold text-white">{engine.displacement}</p>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-[11px] font-bold text-gray-400 uppercase">Tipo de Combustible:</span>
                <p className="font-bold text-white">{engine.fuelType}</p>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-[11px] font-bold text-gray-400 uppercase">Potencia Máxima:</span>
                <p className="font-bold text-white">{engine.power}</p>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-[11px] font-bold text-gray-400 uppercase">Torque Máximo:</span>
                <div>{renderSpecValue(engine.torque)}</div>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-[11px] font-bold text-gray-400 uppercase">Relación de Compresión:</span>
                <div>{renderSpecValue(engine.compressionRatio)}</div>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-[11px] font-bold text-gray-400 uppercase">Tipo de Distribución:</span>
                <div>{renderSpecValue(engine.timingType)}</div>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-[11px] font-bold text-gray-400 uppercase">Alimentación / Inyección:</span>
                <div>{renderSpecValue(engine.injectionType)}</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Transmisión */}
        {activeTab === 'transmision' && (
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#ff9100]" />
                Especificaciones Técnicas de la Transmisión
              </h3>
              <span className="px-3 py-1 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-bold">
                {transmission.type}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-xs font-bold text-gray-400 uppercase">Denominación / Tipo:</span>
                <p className="font-extrabold text-white">{transmission.name}</p>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-xs font-bold text-gray-400 uppercase">Número de Marchas:</span>
                <div>{renderSpecValue(transmission.gears)}</div>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-xs font-bold text-gray-400 uppercase">Módulo de Control TCM:</span>
                <div>{renderSpecValue(transmission.controlModule)}</div>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-xs font-bold text-gray-400 uppercase">Solenoides de Mando:</span>
                <div>{renderSpecValue(transmission.solenoids)}</div>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-xs font-bold text-gray-400 uppercase">Fluido Recomendado:</span>
                <div>{renderSpecValue(transmission.fluidType)}</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Sensores */}
        {activeTab === 'sensores' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#ff9100]" />
                Sensores del Vehículo ({sensors.length})
              </h3>
            </div>

            {sensors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {sensors.map(sensor => (
                  <div key={sensor.id} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 shadow-lg flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-extrabold text-sm text-white">{sensor.name}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                          Sensor
                        </span>
                      </div>

                      <p className="text-xs text-gray-300">{sensor.description}</p>

                      <div className="space-y-1 text-xs text-gray-300 pt-1">
                        <div><strong>Ubicación:</strong> {sensor.location}</div>
                        <div><strong>Señal típica:</strong> {sensor.typicalSignals}</div>
                        <div className="text-emerald-400 font-mono text-[11px] pt-1">
                          <strong>Prueba / Ref:</strong> {renderSpecValue(sensor.referenceValues)}
                        </div>
                      </div>

                      {sensor.dtcs && sensor.dtcs.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1 pt-1">
                          <span className="text-[10px] font-bold text-gray-400">DTCs:</span>
                          {sensor.dtcs.map(dtc => (
                            <span key={dtc} className="px-1.5 py-0.5 rounded bg-red-950/80 border border-red-500/40 text-[10px] font-mono text-red-300 font-bold">
                              {dtc}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <button
                        onClick={() => onOpenLabWithComponent && onOpenLabWithComponent('oscilloscope')}
                        className="px-3 py-1.5 rounded-lg bg-[#ff6f00] hover:bg-[#ff8f00] font-bold text-xs text-white flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Activity className="w-3.5 h-3.5" />
                        Probar en Osciloscopio
                      </button>

                      <button
                        onClick={() => onAskAI && onAskAI(`Diagnóstico del sensor ${sensor.name} en ${brand?.name} ${model.name} (${selectedYear}) motor ${engine.code}: valores de prueba y falla frecuente.`)}
                        className="text-xs text-purple-300 hover:text-purple-200 font-bold flex items-center gap-1"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        Consultar IA
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center space-y-2">
                <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
                <p className="text-sm font-bold text-gray-300">Información no disponible</p>
                <p className="text-xs text-gray-400">No hay registros de sensores específicos para el sistema o filtro actual.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 6: Actuadores */}
        {activeTab === 'actuadores' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#ff9100]" />
                Actuadores del Vehículo ({actuators.length})
              </h3>
            </div>

            {actuators.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {actuators.map(act => (
                  <div key={act.id} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 shadow-lg flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-extrabold text-sm text-white">{act.name}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                          Actuador
                        </span>
                      </div>

                      <p className="text-xs text-gray-300">{act.description}</p>

                      <div className="space-y-1 text-xs text-gray-300 pt-1">
                        <div><strong>Ubicación:</strong> {act.location}</div>
                        <div><strong>Señal de Control:</strong> {act.typicalSignals}</div>
                        <div className="text-amber-300 font-mono text-[11px] pt-1">
                          <strong>Valores de Referencia:</strong> {renderSpecValue(act.referenceValues)}
                        </div>
                      </div>

                      {act.dtcs && act.dtcs.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1 pt-1">
                          <span className="text-[10px] font-bold text-gray-400">DTCs:</span>
                          {act.dtcs.map(dtc => (
                            <span key={dtc} className="px-1.5 py-0.5 rounded bg-red-950/80 border border-red-500/40 text-[10px] font-mono text-red-300 font-bold">
                              {dtc}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <button
                        onClick={() => onOpenLabWithComponent && onOpenLabWithComponent('multimeter')}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 font-bold text-xs text-white flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Gauge className="w-3.5 h-3.5" />
                        Medir Multímetro
                      </button>

                      <button
                        onClick={() => onAskAI && onAskAI(`Diagnóstico del actuador ${act.name} en ${brand?.name} ${model.name} (${selectedYear}): pulso PWM y prueba activa.`)}
                        className="text-xs text-purple-300 hover:text-purple-200 font-bold flex items-center gap-1"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        Consultar IA
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center space-y-2">
                <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
                <p className="text-sm font-bold text-gray-300">Información no disponible</p>
                <p className="text-xs text-gray-400">No hay actuadores específicos cargados para la combinación seleccionada.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 7: ECU & Módulos */}
        {activeTab === 'ecu' && (
          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#ff9100]" />
              Módulos Electrónicos de Control (ECU / PCM / TCM / BMS)
            </h3>

            {ecus.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ecus.map(ecu => (
                  <div key={ecu.id} className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <h4 className="font-extrabold text-base text-white">{ecu.name}</h4>
                      <span className="text-[10px] font-extrabold px-2.5 py-1 rounded bg-purple-900/60 text-purple-300 border border-purple-700/50 uppercase">
                        Unidad de Control
                      </span>
                    </div>

                    <p className="text-xs text-gray-300">{ecu.description}</p>

                    <div className="space-y-2 text-xs text-gray-300">
                      <div className="flex justify-between border-b border-white/5 pb-1">
                        <span>Ubicación en Vehículo:</span>
                        <strong className="text-white">{ecu.location}</strong>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-1">
                        <span>Protocolos de Red:</span>
                        <strong className="text-white">{ecu.typicalSignals}</strong>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-1">
                        <span>Alimentación / Tensión:</span>
                        <strong className="text-emerald-400 font-mono">{ecu.referenceValues || '12.6V - 14.2V DC'}</strong>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <button
                        onClick={() => onOpenLabWithComponent && onOpenLabWithComponent('canbus')}
                        className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-xs text-white flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Activity className="w-3.5 h-3.5" />
                        Analizar Red CAN
                      </button>

                      <button
                        onClick={() => onAskAI && onAskAI(`Pinout y diagrama de alimentación para ECU de ${brand?.name} ${model.name} (${selectedYear}) motor ${engine.code}.`)}
                        className="text-xs text-amber-400 hover:underline font-bold flex items-center gap-1"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        Consultar Pinout con IA
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center space-y-2">
                <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
                <p className="text-sm font-bold text-gray-300">Información no disponible</p>
                <p className="text-xs text-gray-400">Los esquemas de conectores y pinout específico están en proceso de homologación por el equipo docente YOVE.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 8: DTC Database */}
        {activeTab === 'dtc' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  Base de Códigos de Falla (DTC) Asociados
                </h3>
                <p className="text-xs text-gray-400">
                  Códigos de diagnóstico de la marca y banco maestro YOVE DTC PRO
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => onNavigateToView && onNavigateToView('dtc')}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#ff6f00] to-[#ff9100] text-white font-extrabold text-xs flex items-center gap-1.5 shadow cursor-pointer whitespace-nowrap"
                >
                  <Activity className="w-3.5 h-3.5" />
                  Abrir DTC PRO Completo
                </button>

                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Filtrar por código (P0171, P0335)..."
                    value={searchDtc}
                    onChange={(e) => setSearchDtc(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/60 border border-white/20 text-xs text-white focus:outline-none focus:border-[#ff6f00]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(brand?.commonDtcs || ContentService.getAllDtcs())
                .filter(d => d.code.toLowerCase().includes(searchDtc.toLowerCase()) || d.description.toLowerCase().includes(searchDtc.toLowerCase()))
                .map((dtc) => (
                  <div key={dtc.code} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 shadow-lg">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-lg bg-red-950/80 border border-red-500/50 font-mono text-sm font-bold text-red-200">
                        {dtc.code}
                      </span>
                      <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider">
                        Gravedad: {dtc.severity}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-white">{dtc.system} — {dtc.code}</h4>
                    <p className="text-xs text-gray-300">{dtc.description}</p>

                    <div className="p-3 rounded-xl bg-black/50 border border-white/10 space-y-1.5 text-xs">
                      <strong className="text-emerald-400">Causas Frecuentes de Taller:</strong>
                      <ul className="list-disc list-inside text-gray-300 text-[11px] space-y-0.5">
                        {(dtc.possibleCauses || []).map((cause, i) => (
                          <li key={i}>{cause}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => onAskAI && onAskAI(`Procedimiento paso a paso para diagnosticar el código ${dtc.code} (${dtc.description}) en ${brand?.name} ${model.name} (${selectedYear}).`)}
                        className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        Diagnosticar DTC con YOVE AI
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Tab 9: Cursos LMS */}
        {activeTab === 'cursos' && (
          <div className="p-6 bg-slate-900/90 rounded-2xl border border-blue-800/60 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#ff9100]" />
                Cursos del LMS Vinculados con {brand?.name} {model.name}
              </h3>
              <button
                onClick={() => onNavigateToView && onNavigateToView('cursos')}
                className="text-xs font-bold text-[#ff9100] hover:underline flex items-center gap-1"
              >
                Ver catálogo completo <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {(relatedContent?.courses || []).map(course => (
                <div key={course.id} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 flex flex-col justify-between shadow-lg">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 uppercase">
                        {course.categoryLabel}
                      </span>
                      <span className="text-[11px] text-amber-400 font-bold">★ {course.rating}</span>
                    </div>

                    <h4 className="font-extrabold text-sm text-white">{course.title}</h4>
                    <p className="text-xs text-gray-300 line-clamp-2">{course.description}</p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-400">{course.duration}</span>
                    <button
                      onClick={() => {
                        if (onOpenCourse) {
                          onOpenCourse(course);
                        } else if (onNavigateToView) {
                          onNavigateToView('cursos');
                        }
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-[#ff6f00] hover:bg-[#ff8f00] text-white font-extrabold text-xs flex items-center gap-1 transition"
                    >
                      Aprender <PlayCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 10: Casos */}
        {activeTab === 'casos' && (
          <div className="p-6 bg-slate-900/90 rounded-2xl border border-blue-800/60 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Wrench className="w-4 h-4 text-[#ff9100]" />
                Casos Reales de Taller Relacionados
              </h3>
              <button
                onClick={() => onNavigateToView && onNavigateToView('cases')}
                className="text-xs font-bold text-[#ff9100] hover:underline flex items-center gap-1"
              >
                Ver todos los casos <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {(relatedContent?.cases || []).map(cs => (
                <div key={cs.id} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-red-950 border border-red-500/40 text-red-300">
                      DTC: {cs.dtcCode}
                    </span>
                    <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                      Caso Resuelto
                    </span>
                  </div>

                  <h4 className="font-extrabold text-sm text-white">{cs.title}</h4>
                  <p className="text-xs text-gray-300"><strong>Síntoma:</strong> {cs.symptom}</p>
                  <p className="text-xs text-emerald-300"><strong>Explicación / Solución:</strong> {cs.finalExplanation}</p>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => onNavigateToView && onNavigateToView('cases')}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-extrabold text-xs flex items-center gap-1"
                    >
                      Ver Diagnóstico Completo <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 11: Laboratorios */}
        {activeTab === 'labs' && (
          <div className="p-6 bg-slate-900/90 rounded-2xl border border-blue-800/60 space-y-6 shadow-2xl">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#ff9100]" />
              Simulaciones Interactivas de Laboratorio
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 text-center">
                <Activity className="w-8 h-8 text-[#ff9100] mx-auto" />
                <h4 className="font-extrabold text-sm text-white">Osciloscopio Automotriz</h4>
                <p className="text-xs text-gray-300">Captura de ondas inductivas, hall y PWM para {brand?.name} {model.name}.</p>
                <button
                  onClick={() => onOpenLabWithComponent && onOpenLabWithComponent('oscilloscope')}
                  className="w-full py-2 rounded-xl bg-[#ff6f00] hover:bg-[#ff8f00] text-white font-extrabold text-xs transition cursor-pointer"
                >
                  Abrir Osciloscopio
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 text-center">
                <Gauge className="w-8 h-8 text-blue-400 mx-auto" />
                <h4 className="font-extrabold text-sm text-white">Multímetro Digital</h4>
                <p className="text-xs text-gray-300">Medición de caída de tensión, resistencia de bobinas e inyectores.</p>
                <button
                  onClick={() => onOpenLabWithComponent && onOpenLabWithComponent('multimeter')}
                  className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs transition cursor-pointer"
                >
                  Abrir Multímetro
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 text-center">
                <Radio className="w-8 h-8 text-purple-400 mx-auto" />
                <h4 className="font-extrabold text-sm text-white">Analizador CAN & LIN Bus</h4>
                <p className="text-xs text-gray-300">Monitoreo de tramas de comunicación CAN High / CAN Low a 500kbps.</p>
                <button
                  onClick={() => onOpenLabWithComponent && onOpenLabWithComponent('canbus')}
                  className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs transition cursor-pointer"
                >
                  Abrir Analizador CAN
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
