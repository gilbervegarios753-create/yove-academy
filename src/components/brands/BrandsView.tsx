import React, { useState, useEffect } from 'react';
import { ContentService, SearchResultItem } from '../../services/contentService';
import { useBrandsData } from '../../hooks/useBrandsData';
import { CoreApi } from '../../services/api/coreApi';
import { Brand, VehicleModel, Course, DTCInfo, DiagnosticCase, LabSimulation } from '../../types';
import { Car, Search, ShieldAlert, ChevronRight, Cpu, Wrench, ArrowLeft, Plus, Sparkles, BookOpen, Layers, Activity, Filter, HelpCircle, CheckCircle2 } from 'lucide-react';
import { FadeInOnScroll } from '../FadeInOnScroll';

interface BrandsViewProps {
  onSelectVehicleInGarage?: (brandId: string, modelId: string) => void;
  onNavigateToView?: (view: any) => void;
  onAskAI?: (promptText: string) => void;
}

export const BrandsView: React.FC<BrandsViewProps> = ({
  onSelectVehicleInGarage,
  onNavigateToView,
  onAskAI
}) => {
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedSystemFilter, setSelectedSystemFilter] = useState<string>('all');
  
  const [selectedBrandModels, setSelectedBrandModels] = useState<any[]>([]);

  const { brands: allBrands, loading, fetchBrands } = useBrandsData();

  useEffect(() => {
    if (selectedBrand) {
      CoreApi.getModels(selectedBrand.id).then(models => {
        setSelectedBrandModels(models);
      });
    } else {
      setSelectedBrandModels([]);
    }
  }, [selectedBrand]);

  // Custom brand modal state for administration
  const [showAddBrandModal, setShowAddBrandModal] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandCountry, setNewBrandCountry] = useState('Japón');
  const [newBrandLogo, setNewBrandLogo] = useState('🚗');
  const [newBrandModels, setNewBrandModels] = useState('');

  const systems15 = ContentService.get15Systems();

  // Search Results using ContentService deep hierarchy search
  const searchResults = searchFilter.trim().length > 1
    ? ContentService.searchHierarchy(searchFilter, { systemKey: selectedSystemFilter !== 'all' ? selectedSystemFilter : undefined })
    : [];

  const filteredBrands = allBrands.filter(b => {
    const matchesSearch = !searchFilter ||
      b.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      b.country.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesSearch;
  });

  // Related Content for currently selected brand/vehicle
  const relatedContent = ContentService.getRelatedContentForVehicle({
    brandName: selectedBrand?.name || '',
    systemCategory: selectedSystemFilter !== 'all' ? selectedSystemFilter : undefined,
    dtcCode: searchFilter.startsWith('P') || searchFilter.startsWith('C') || searchFilter.startsWith('U') || searchFilter.startsWith('B') ? searchFilter : ''
  });

  const handleCreateCustomBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName) return;

    const brandObj: Brand = {
      id: newBrandName.toLowerCase().replace(/\s+/g, '-'),
      name: newBrandName,
      logo: newBrandLogo || '🚗',
      country: newBrandCountry,
      popularModels: newBrandModels ? newBrandModels.split(',').map(s => s.trim()) : ['Modelo Base'],
      disclaimer: `Contenido educativo independiente. YOVE Academy no está afiliada ni respaldada por ${newBrandName}.`,
      isCustomBrand: true
    };

    ContentService.addBrand(brandObj);
    setShowAddBrandModal(false);
    setNewBrandName('');
    setNewBrandModels('');
  };

  return (
    <div className="py-12 bg-[#0a0e27] min-h-screen text-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <FadeInOnScroll direction="up">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/60 text-[#ff9100] text-xs font-bold uppercase tracking-wider border border-blue-700/50">
              <Car className="w-3.5 h-3.5" />
              Directorio de Marcas & Arquitecturas Automotrices (26+ Marcas)
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Estructura Multimarcas: Marca → Modelo → Motor → Sistema → DTC
            </h1>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              Explora las arquitecturas electrónicas, esquemas de inyección, redes multiplexadas y códigos de falla por fabricante automotriz.
            </p>

            {/* Legal Disclaimer */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 flex items-center justify-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
              <span>
                <strong>Aviso Legal & Educativo:</strong> Las marcas se utilizan estrictamente para clasificación didáctica. YOVE Academy no afirma afiliación oficial con ningún fabricante.
              </span>
            </div>
          </div>
        </FadeInOnScroll>

        {/* Top Controls: Search + System Filters + Add Brand */}
        <div className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Multi-Dimensional Search */}
            <div className="w-full md:w-2/3 relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por marca, modelo, motor, sistema, componente o código DTC (ej: Toyota, Yaris, 1NZ-FE, CKP, P0335)..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/50 border border-white/20 text-white placeholder-gray-400 text-xs sm:text-sm focus:outline-none focus:border-[#ff6f00]"
              />
            </div>

            {/* Admin Action: Add New Brand */}
            <button
              onClick={() => setShowAddBrandModal(true)}
              className="w-full md:w-auto px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar Marca (Admin)</span>
            </button>
          </div>

          {/* 15 Systems Filter Pills */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
              <Filter className="w-3.5 h-3.5 text-[#ff9100]" />
              <span>Filtrar por uno de los 15 Sistemas Automotrices:</span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              <button
                onClick={() => setSelectedSystemFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  selectedSystemFilter === 'all'
                    ? 'bg-[#ff6f00] text-white shadow-sm'
                    : 'bg-black/40 text-gray-300 hover:bg-white/10'
                }`}
              >
                Todos los Sistemas
              </button>
              {systems15.map(sys => (
                <button
                  key={sys.id}
                  onClick={() => setSelectedSystemFilter(sys.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    selectedSystemFilter === sys.id
                      ? 'bg-[#ff6f00] text-white shadow-sm'
                      : 'bg-black/40 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <span>{sys.icon}</span>
                  <span>{sys.name}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Global Deep Search Results (If query active) */}
        {searchFilter.trim().length > 1 && (
          <div className="p-6 bg-slate-900/90 rounded-2xl border border-blue-800/60 space-y-4">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-[#ff9100]" />
              Resultados de Búsqueda Jerárquica ({searchResults.length})
            </h3>

            {searchResults.length === 0 ? (
              <p className="text-xs text-gray-400">No se encontraron coincidencias exactas para "{searchFilter}". Pruebe buscar con otra marca, motor o DTC.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-1">
                {searchResults.map((res, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1 hover:border-[#ff6f00] transition">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase text-[#ff9100]">
                      <span>{res.type}</span>
                      {res.dtcCode && <span className="font-mono bg-amber-500/20 px-1.5 py-0.5 rounded text-amber-300">{res.dtcCode}</span>}
                    </div>
                    <h4 className="text-xs font-bold text-white">{res.title}</h4>
                    <p className="text-[11px] text-gray-300">{res.subtitle}</p>
                    <p className="text-[10px] text-gray-400 italic line-clamp-1">{res.details}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* BRAND DETAIL VIEW OR BRANDS GRID */}
        {selectedBrand ? (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Back Button */}
            <button
              onClick={() => setSelectedBrand(null)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al Catálogo de Marcas
            </button>

            {/* Selected Brand Banner */}
            <div className="bg-gradient-to-r from-blue-900/60 via-[#0a0e27] to-slate-900/80 p-6 sm:p-8 rounded-2xl border border-blue-800/50 space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-4xl p-3 bg-black/50 rounded-2xl border border-white/10 shadow-lg">{selectedBrand.logo}</span>
                <div>
                  <span className="text-xs font-bold text-[#ff9100] uppercase tracking-wider">
                    Origen: {selectedBrand.country}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">{selectedBrand.name}</h2>
                  <p className="text-xs text-gray-300 mt-1">{selectedBrand.disclaimer}</p>
                </div>
              </div>
            </div>

            {/* Hierarchical Vehicles List: Marca -> Modelo -> Generación -> Año -> Motor -> Transmisión -> Sistema -> Componente -> DTC */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-[#ff6f00]" />
                Jerarquía Técnica de Modelos ({selectedBrandModels.length})
              </h3>

              {selectedBrandModels.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedBrandModels.map((model) => (
                    <div
                      key={model.id}
                      className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-[#ff6f00]/50 transition-all space-y-4 shadow-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-bold text-white">{selectedBrand.name} {model.name}</h4>
                          <span className="text-xs text-gray-400">
                            Años: {(model.years || []).length > 0 ? `${model.years[0]} - ${model.years[model.years.length - 1]}` : 'N/A'}
                          </span>
                        </div>
                        {onSelectVehicleInGarage && (
                          <button
                            onClick={() => onSelectVehicleInGarage(selectedBrand.id, model.id)}
                            className="px-3.5 py-1.5 rounded-xl bg-[#ff6f00] hover:bg-[#ff8f00] text-xs font-bold text-white transition flex items-center gap-1 cursor-pointer shadow"
                          >
                            <Wrench className="w-3.5 h-3.5" />
                            Abrir en Garage
                          </button>
                        )}
                      </div>

                      {/* Generaciones / Motores */}
                      <div className="space-y-3 pt-2">
                        {(model.engines || []).map((eng) => (
                          <div key={eng.code} className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-3">
                            <div className="flex items-center justify-between text-xs font-bold">
                              <span className="text-emerald-400">Motor {eng.code} ({eng.displacement})</span>
                              <span className="text-gray-300">{eng.power} // {eng.fuelType}</span>
                            </div>

                            {/* Transmisiones */}
                            {eng.transmissions && eng.transmissions.length > 0 && (
                              <div className="text-[11px] text-gray-400 flex items-center gap-2 bg-white/5 p-2 rounded-lg">
                                <span className="font-bold text-blue-300">Transmisión:</span>
                                <span>{(eng.transmissions || []).map((t: any) => t.name).join(' / ')}</span>
                              </div>
                            )}

                            {/* Sistemas & Componentes */}
                            {(eng.systems || []).map((sys) => (
                              <div key={sys.id} className="text-xs text-gray-300 space-y-2 pt-2 border-t border-white/10">
                                <div className="font-bold text-white flex items-center justify-between">
                                  <span>• {sys.name}</span>
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-900/60 text-blue-300">
                                    {sys.category.toUpperCase()}
                                  </span>
                                </div>

                                <div className="grid grid-cols-1 gap-1.5 pl-3">
                                  {(sys.components || []).map((comp) => (
                                    <div key={comp.id} className="p-2 rounded bg-white/5 text-[11px] text-gray-300 space-y-1">
                                      <div className="flex items-center justify-between font-bold text-white">
                                        <span>{comp.name}</span>
                                        <span className="text-amber-400 font-mono">DTC: {(comp.dtcs || []).join(', ')}</span>
                                      </div>
                                      <p className="text-[10px] text-gray-400">{comp.description}</p>
                                      {comp.referenceValues && (
                                        <div className="text-[10px] text-emerald-300 font-mono">
                                          Ref: {comp.referenceValues}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center space-y-3">
                  <p className="text-sm text-gray-300">
                    Modelos populares de {selectedBrand.name} configurados en la base de datos:
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {(selectedBrand.popularModels || []).map((m, idx) => (
                      <span key={idx} className="px-3.5 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs font-bold text-blue-300">
                        {selectedBrand.name} {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RELATED CONTENT SECTION: Cursos + Lecciones + Casos + Laboratorios + YOVE AI */}
            <div className="p-6 bg-slate-900/90 rounded-2xl border border-blue-800/60 space-y-6">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#ff9100] uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    Contenido Educativo Relacionado con {selectedBrand.name}
                  </div>
                  <h3 className="text-lg font-extrabold text-white mt-0.5">
                    Cursos, Lecciones, Casos Reales & Laboratorios
                  </h3>
                </div>

                {onAskAI && (
                  <button
                    onClick={() => onAskAI(`Consulta técnica sobre vehículos ${selectedBrand.name}: arquitecturas de motor, diagnóstico OBD-II y DTCs comunes.`)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-extrabold rounded-xl transition flex items-center gap-2 shadow-md cursor-pointer shrink-0"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Consultar YOVE AI sobre {selectedBrand.name}</span>
                  </button>
                )}
              </div>

              {/* Grid of Related Items */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                
                {/* Related Courses */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                  <h4 className="text-xs font-bold text-blue-300 uppercase flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    Cursos Recomendados ({(relatedContent?.courses || []).length})
                  </h4>
                  <div className="space-y-2">
                    {(relatedContent?.courses || []).slice(0, 3).map(c => (
                      <div key={c.id} className="p-2.5 rounded-lg bg-black/40 text-xs space-y-1">
                        <div className="font-bold text-white">{c.title}</div>
                        <div className="text-[10px] text-gray-400">{c.duration} • Nivel {c.level}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Related Cases */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                  <h4 className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5" />
                    Casos de Diagnóstico ({(relatedContent?.cases || []).length})
                  </h4>
                  <div className="space-y-2">
                    {(relatedContent?.cases || []).map(cs => (
                      <div key={cs.id} className="p-2.5 rounded-lg bg-black/40 text-xs space-y-1">
                        <div className="font-bold text-white">{cs.title}</div>
                        <div className="text-[10px] text-amber-300">DTC: {cs.dtcCode} // Vehículo: {cs.vehicle}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Related Labs & DTCs */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5" />
                    Prácticas de Laboratorio ({(relatedContent?.labs || []).length})
                  </h4>
                  <div className="space-y-2">
                    {(relatedContent?.labs || []).map(lb => (
                      <div key={lb.id} className="p-2.5 rounded-lg bg-black/40 text-xs space-y-1">
                        <div className="font-bold text-white">{lb.title}</div>
                        <div className="text-[10px] text-gray-400">{lb.objective}</div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </div>
        ) : (
          /* ALL 26 BRANDS GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredBrands.map((brand, idx) => (
              <FadeInOnScroll key={brand.id} direction="up" delay={idx * 30}>
                <div
                  onClick={() => setSelectedBrand(brand)}
                  className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-[#ff6f00]/60 p-6 rounded-2xl transition-all hover:-translate-y-1 cursor-pointer group shadow-xl space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-3xl p-2 rounded-xl bg-black/40 border border-white/10">{brand.logo}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-900/50 text-blue-300 border border-blue-700/40">
                      {brand.country}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-white group-hover:text-[#ff9100] transition">
                      {brand.name}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                      {(brand.popularModels || []).join(', ')}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-bold text-[#ff9100]">
                    <span>Explorar Sistemas</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </FadeInOnScroll>
            ))}
          </div>
        )}

        {/* MODAL: ADD CUSTOM BRAND (ADMIN) */}
        {showAddBrandModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 text-white shadow-2xl">
              <h3 className="text-base font-extrabold text-white">Agregar Nueva Marca al Sistema</h3>
              <form onSubmit={handleCreateCustomBrand} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Nombre de la Marca *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Lexus, Genesis, Cupra..."
                    value={newBrandName}
                    onChange={e => setNewBrandName(e.target.value)}
                    className="w-full px-3 py-2 bg-black/60 border border-white/20 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">País de Origen</label>
                  <input
                    type="text"
                    placeholder="Ej: Japón, Alemania, España..."
                    value={newBrandCountry}
                    onChange={e => setNewBrandCountry(e.target.value)}
                    className="w-full px-3 py-2 bg-black/60 border border-white/20 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Icono / Logo (Emoji)</label>
                  <input
                    type="text"
                    placeholder="🏎️"
                    value={newBrandLogo}
                    onChange={e => setNewBrandLogo(e.target.value)}
                    className="w-full px-3 py-2 bg-black/60 border border-white/20 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Modelos Populares (Separados por coma)</label>
                  <input
                    type="text"
                    placeholder="IS300, RX350, NX200t"
                    value={newBrandModels}
                    onChange={e => setNewBrandModels(e.target.value)}
                    className="w-full px-3 py-2 bg-black/60 border border-white/20 rounded-xl text-xs text-white"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddBrandModal(false)}
                    className="px-4 py-2 bg-white/10 text-xs font-bold rounded-xl hover:bg-white/20 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white rounded-xl transition"
                  >
                    Guardar Marca
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
