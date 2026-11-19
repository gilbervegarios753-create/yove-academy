import React, { useEffect, useState } from 'react';
import { DollarSign, ShoppingBag, CreditCard, ShieldAlert, RefreshCw, AlertTriangle, CheckCircle, Search, Filter, RotateCcw } from 'lucide-react';

export const YoveSalesCenterView: React.FC = () => {
  const [metrics, setMetrics] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedOrderForRefund, setSelectedOrderForRefund] = useState<any | null>(null);
  const [refundReason, setRefundReason] = useState('');
  const [isRefunding, setIsRefunding] = useState(false);
  const [refundSuccessMsg, setRefundSuccessMsg] = useState('');

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('yove_auth_token');
      const res = await fetch('/api/v1/payments/admin/sales', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setMetrics(data.metrics);
      } else {
        setError(data.error || 'Error al obtener métricas de ventas');
      }
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProcessRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForRefund || !refundReason) return;
    setIsRefunding(true);
    setRefundSuccessMsg('');

    try {
      const token = localStorage.getItem('yove_auth_token');
      const res = await fetch('/api/v1/payments/admin/refunds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          orderId: selectedOrderForRefund.id,
          reason: refundReason
        })
      });

      const data = await res.json();
      if (data.success) {
        setRefundSuccessMsg(`Reembolso de S/ ${selectedOrderForRefund.total} PEN procesado con éxito.`);
        setSelectedOrderForRefund(null);
        setRefundReason('');
        fetchSalesData();
      } else {
        setError(data.error || 'Error al procesar el reembolso');
      }
    } catch (err: any) {
      setError(err.message || 'Error al ejecutar el reembolso');
    } finally {
      setIsRefunding(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-slate-400">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs">Cargando Centro de Ventas y Finanzas YOVE PAYMENTS...</p>
      </div>
    );
  }

  const filteredOrders = (metrics?.recentOrders || []).filter((o: any) => {
    const q = searchTerm.toLowerCase();
    return (
      o.id?.toLowerCase().includes(q) ||
      o.customer_name?.toLowerCase().includes(q) ||
      o.customer_email?.toLowerCase().includes(q) ||
      o.payment_provider?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">YOVE PAYMENTS — Centro de Ventas & Finanzas</h2>
            <p className="text-xs text-slate-400">Panel de Control E-commerce, Auditoría de Transacciones y Reembolsos</p>
          </div>
        </div>
        <button
          onClick={fetchSalesData}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-2 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Actualizar Datos</span>
        </button>
      </div>

      {refundSuccessMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{refundSuccessMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Ventas Totales Brutas</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            S/ {metrics?.totalSales?.toFixed(2)} PEN
          </div>
          <p className="text-[10px] text-slate-500">Ingresos procesados por Culqi, Mercado Pago y Stripe</p>
        </div>

        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Órdenes Confirmadas</span>
            <ShoppingBag className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">
            {metrics?.totalOrders}
          </div>
          <p className="text-[10px] text-slate-500">Total de compras completadas con matrícula</p>
        </div>

        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Total Reembolsos</span>
            <RotateCcw className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-black text-red-400 font-mono">
            S/ {metrics?.totalRefunds?.toFixed(2)} PEN
          </div>
          <p className="text-[10px] text-slate-500">Devoluciones procesadas por administradores</p>
        </div>

        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Ingreso Neto Limpio</span>
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            S/ {metrics?.netRevenue?.toFixed(2)} PEN
          </div>
          <p className="text-[10px] text-slate-500">Bruto menos devoluciones</p>
        </div>
      </div>

      {/* Orders Management Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60">
          <div className="font-bold text-sm text-white flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-amber-400" />
            <span>Últimas Transacciones Registradas</span>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar por cliente, email u orden..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-xs text-white pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 uppercase font-mono border-b border-slate-800">
              <tr>
                <th className="p-4">Orden</th>
                <th className="p-4">Cliente</th>
                <th className="p-4">Cursos Adquiridos</th>
                <th className="p-4">Pasarela</th>
                <th className="p-4">Monto Total</th>
                <th className="p-4">Fraude Risk</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredOrders.map((order: any) => (
                <tr key={order.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 font-mono text-amber-400 font-bold">{order.id}</td>
                  <td className="p-4">
                    <div className="font-semibold text-slate-200">{order.customer_name}</div>
                    <div className="text-[11px] text-slate-400">{order.customer_email}</div>
                  </td>
                  <td className="p-4 max-w-xs">
                    <div className="space-y-0.5 truncate">
                      {order.items?.map((it: any, idx: number) => (
                        <div key={idx} className="truncate text-slate-300">
                          • {it.name}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 uppercase font-mono text-slate-400">{order.payment_provider}</td>
                  <td className="p-4 font-bold text-emerald-400 font-mono">
                    S/ {order.total?.toFixed(2)} {order.currency}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                      order.fraud_score >= 50
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      Score: {order.fraud_score || 0}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase ${
                      order.status === 'PAID'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : order.status === 'REFUNDED'
                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {order.status === 'PAID' && (
                      <button
                        onClick={() => setSelectedOrderForRefund(order)}
                        className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ml-auto"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Reembolsar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Refund Modal */}
      {selectedOrderForRefund && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Procesar Reembolso Oficial</h3>
              <button
                onClick={() => setSelectedOrderForRefund(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-1">
              <p><strong>Orden:</strong> <span className="font-mono text-amber-400">{selectedOrderForRefund.id}</span></p>
              <p><strong>Cliente:</strong> {selectedOrderForRefund.customer_name}</p>
              <p><strong>Monto a Reembolsar:</strong> <span className="text-emerald-400 font-bold">S/ {selectedOrderForRefund.total} PEN</span></p>
            </div>

            <form onSubmit={handleProcessRefund} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Motivo del Reembolso (Auditoría Admin)</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Escriba la razón de la devolución..."
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForRefund(null)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleProcessRefund}
                  disabled={isRefunding || !refundReason.trim()}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs transition-all disabled:opacity-50"
                >
                  {isRefunding ? 'Procesando...' : 'Confirmar Reembolso'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
