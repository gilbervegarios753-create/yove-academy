import React, { useState, useEffect } from 'react';
import { SUBSCRIPTION_PLANS } from '../../data/monetizationData';
import { SubscriptionTier } from '../../types';
import { Check, ShieldCheck, Zap, Sparkles, HelpCircle, AlertCircle, ArrowRight, FileText, Building2, CreditCard } from 'lucide-react';
import { FadeInOnScroll } from '../FadeInOnScroll';
import { useAuth } from '../../context/AuthContext';

interface PricingViewProps {
  currentTier?: SubscriptionTier;
  onSelectTier?: (tier: SubscriptionTier) => void;
  onClose?: () => void;
}

export const PricingView: React.FC<PricingViewProps> = ({
  currentTier = 'free',
  onSelectTier,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'plans' | 'billing' | 'institution'>('plans');
  const [isAnnual, setIsAnnual] = useState(true);
  const [selectedSuccessTier, setSelectedSuccessTier] = useState<SubscriptionTier | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [invoices, setInvoices] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [institution, setInstitution] = useState<any>(null);
  const { user, token } = useAuth();

  useEffect(() => {
    if (token) {
      fetch('/api/v1/subscriptions/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setSubscription(data.subscription);
            setInvoices(data.invoices || []);
          }
        })
        .catch(err => console.error("Error loading subscription:", err));

      fetch('/api/v1/institutions/portal', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setInstitution(data.institution);
          }
        })
        .catch(err => console.error("Error loading institution:", err));
    }
  }, [token]);

  const handleChoosePlan = async (tier: SubscriptionTier, price: number) => {
    setErrorMsg('');
    try {
      const res = await fetch('/api/v1/subscriptions/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          tier,
          billing_cycle: isAnnual ? 'annual' : 'monthly',
          amount: price,
          gateway: 'stripe'
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al procesar suscripción');
      }

      setSelectedSuccessTier(tier);
      setSubscription(data.subscription);
      if (onSelectTier) {
        onSelectTier(tier);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al actualizar suscripción');
    }
  };

  return (
    <div className="py-12 bg-[#0a0e27] min-h-screen text-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header & Tabs */}
        <FadeInOnScroll direction="up">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-900/60 text-amber-400 text-xs font-bold uppercase tracking-wider border border-blue-700/50">
              <Zap className="w-3.5 h-3.5" />
              Planes de Suscripción & Monetización Profesional
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Acelera tu Carrera con la Plataforma Líder en Diagnóstico
            </h1>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              Selecciona tu plan, revisa tu historial de facturación y administra licencias institucionales.
            </p>

            {/* Navigation Tabs */}
            <div className="flex justify-center gap-2 pt-2">
              <button
                onClick={() => setActiveTab('plans')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'plans' ? 'bg-[#ff6f00] text-white shadow' : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                <Zap className="w-4 h-4" />
                Planes Académicos
              </button>
              <button
                onClick={() => setActiveTab('billing')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'billing' ? 'bg-[#ff6f00] text-white shadow' : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                <FileText className="w-4 h-4" />
                Facturación ({invoices.length})
              </button>
              <button
                onClick={() => setActiveTab('institution')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'institution' ? 'bg-[#ff6f00] text-white shadow' : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                <Building2 className="w-4 h-4" />
                Portal Institution
              </button>
            </div>
          </div>
        </FadeInOnScroll>

        {/* Success Banner if Tier selected */}
        {selectedSuccessTier && (
          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-center space-y-2 animate-in fade-in">
            <div className="text-emerald-300 font-extrabold text-sm flex items-center justify-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              ¡Plan Actualizado con Éxito a: {SUBSCRIPTION_PLANS.find(p => p.tier === selectedSuccessTier)?.title}!
            </div>
            <p className="text-xs text-gray-300">
              Suscripción activa en base de datos. Pasarela Stripe / Mercado Pago lista para producción.
            </p>
          </div>
        )}

        {/* TAB 1: PLANS */}
        {activeTab === 'plans' && (
          <div className="space-y-8">
            {/* Monthly / Annual Billing Toggle */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-3 p-1.5 rounded-2xl bg-white/5 border border-white/10">
                <button
                  onClick={() => setIsAnnual(false)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    !isAnnual ? 'bg-[#ff6f00] text-white shadow-lg' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Facturación Mensual
                </button>
                <button
                  onClick={() => setIsAnnual(true)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    isAnnual ? 'bg-[#ff6f00] text-white shadow-lg' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <span>Facturación Anual</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold">
                    AHORRA 20%
                  </span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {SUBSCRIPTION_PLANS.map((plan) => {
                const isCurrent = currentTier === plan.tier || subscription?.plan === plan.tier;
                const price = isAnnual ? plan.priceAnnual : plan.priceMonthly;

                return (
                  <div
                    key={plan.tier}
                    className={`rounded-3xl p-6 border transition-all flex flex-col justify-between space-y-6 relative ${
                      plan.popular
                        ? 'bg-gradient-to-b from-[#101c54] via-[#0d163a] to-[#0a0e27] border-amber-500/60 shadow-2xl scale-105 z-10'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    {plan.badge && (
                      <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black text-[10px] font-black uppercase tracking-wider shadow">
                        {plan.badge}
                      </div>
                    )}

                    <div className="space-y-4">
                      <div>
                        <h3 className="font-extrabold text-lg text-white">{plan.title}</h3>
                        <p className="text-xs text-gray-400 mt-1 min-h-[36px]">{plan.description}</p>
                      </div>

                      <div className="border-y border-white/10 py-4 space-y-1">
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black text-white">${price}</span>
                          <span className="text-xs text-gray-400">
                            USD {isAnnual ? '/ año' : '/ mes'}
                          </span>
                        </div>
                        {isAnnual && plan.priceMonthly > 0 && (
                          <div className="text-[10px] text-emerald-400 font-bold">
                            Equivalente a ${(price / 12).toFixed(1)} USD/mes
                          </div>
                        )}
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="font-bold text-gray-300 uppercase text-[10px] tracking-wider">
                          Incluye:
                        </div>
                        <ul className="space-y-2 text-gray-300">
                          {plan.features.map((feat, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>

                        {plan.limitations && (
                          <div className="pt-2 space-y-1">
                            {plan.limitations.map((lim, idx) => (
                              <div key={idx} className="text-[11px] text-gray-500 flex items-center gap-1.5">
                                <AlertCircle className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                                <span>{lim}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleChoosePlan(plan.tier, price)}
                      disabled={isCurrent}
                      className={`w-full py-3 rounded-xl font-extrabold text-xs transition shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                        isCurrent
                          ? 'bg-white/10 text-gray-400 border border-white/25 cursor-default'
                          : plan.popular
                          ? 'bg-gradient-to-r from-[#ff6f00] to-[#ff9100] text-white hover:opacity-90'
                          : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                      }`}
                    >
                      <span>{isCurrent ? 'Plan Actual' : plan.ctaText}</span>
                      {!isCurrent && <ArrowRight className="w-4 h-4" />}
                    </button>

                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: BILLING & INVOICES */}
        {activeTab === 'billing' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#ff9100]" />
                Estado de Suscripción & Historial de Facturas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs bg-black/40 p-4 rounded-xl border border-white/10">
                <div>
                  <div className="text-gray-400">Plan Actual:</div>
                  <div className="text-sm font-black text-amber-400 uppercase mt-0.5">{subscription?.plan || currentTier}</div>
                </div>
                <div>
                  <div className="text-gray-400">Estado:</div>
                  <div className="text-sm font-black text-emerald-400 mt-0.5">{subscription?.status || 'ACTIVE'}</div>
                </div>
                <div>
                  <div className="text-gray-400">Pasarela Configurada:</div>
                  <div className="text-sm font-black text-blue-400 mt-0.5 uppercase">{subscription?.provider || 'Stripe / Mercado Pago'}</div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold text-gray-300 uppercase">Facturas Emitidas</div>
                {invoices.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-xs bg-black/30 rounded-xl">
                    No hay facturas registradas en este momento.
                  </div>
                ) : (
                  invoices.map((inv) => (
                    <div key={inv.id} className="p-4 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-xs">
                      <div className="space-y-1">
                        <div className="font-bold text-white">Factura #{inv.id}</div>
                        <div className="text-[10px] text-gray-400">{new Date(inv.invoice_date).toLocaleDateString()} • USD ${inv.amount}</div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                        {inv.status.toUpperCase()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: INSTITUTION PORTAL */}
        {activeTab === 'institution' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-400" />
                    {institution?.name || 'Portal Institucional'}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">Gestión corporativa de licencias, alumnos e instructores técnicos.</p>
                </div>
                <span className="px-3 py-1 rounded-lg bg-blue-900/60 text-blue-300 text-xs font-bold border border-blue-700/50">
                  Plan Institution
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                  <div className="text-2xl font-black text-white">{institution?.licensesTotal || 50}</div>
                  <div className="text-[10px] text-gray-400 uppercase mt-1">Licencias Totales</div>
                </div>
                <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                  <div className="text-2xl font-black text-emerald-400">{institution?.licensesUsed || 18}</div>
                  <div className="text-[10px] text-gray-400 uppercase mt-1">Licencias Asignadas</div>
                </div>
                <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                  <div className="text-2xl font-black text-blue-400">{institution?.studentsCount || 18}</div>
                  <div className="text-[10px] text-gray-400 uppercase mt-1">Alumnos Activos</div>
                </div>
                <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                  <div className="text-2xl font-black text-amber-400">{institution?.instructorsCount || 4}</div>
                  <div className="text-[10px] text-gray-400 uppercase mt-1">Instructores</div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold text-gray-300 uppercase">Cursos Asignados al Instituto</div>
                <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-xs flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">Osciloscopio Automotriz & Pruebas de Sensores</div>
                    <div className="text-[10px] text-gray-400">18 de 50 alumnos completando</div>
                  </div>
                  <span className="text-emerald-400 font-bold">Activo</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security & Payment Notice */}
        <div className="p-6 rounded-2xl bg-black/40 border border-white/10 text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-bold text-amber-400 flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            Seguridad Bancaria & Pasarelas Preparadas (Stripe & Mercado Pago)
          </div>
          <p className="text-[11px] text-gray-400 leading-relaxed">
            Nunca almacenamos datos de tarjetas ni CVV. La arquitectura backend está conectada con Webhooks idempotentes listos para producción.
          </p>
        </div>

      </div>
    </div>
  );
};

