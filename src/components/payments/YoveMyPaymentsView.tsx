import React, { useEffect, useState } from 'react';
import { CreditCard, FileText, CheckCircle2, Clock, AlertCircle, ShoppingBag, Download } from 'lucide-react';

export const YoveMyPaymentsView: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyPayments();
  }, []);

  const fetchMyPayments = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('yove_auth_token');
      const res = await fetch('/api/v1/payments/my-payments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
        setInvoices(data.invoices || []);
      } else {
        setError(data.error || 'Error al cargar historial de compras');
      }
    } catch (err: any) {
      setError(err.message || 'Error al conectar con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-slate-400">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs">Cargando tus compras y comprobantes de pago...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Mis Compras y Comprobantes</h2>
            <p className="text-xs text-slate-400">Historial completo de órdenes, boletas y facturas electrónicas</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 bg-slate-900/60 font-bold text-sm text-white flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-amber-400" />
          <span>Órdenes de Compra Adquiridas</span>
        </div>

        {orders.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-slate-600" />
            <p className="text-sm font-semibold text-slate-300">Aún no has realizado ninguna compra</p>
            <p className="text-xs text-slate-500 mt-1">Explora nuestro catálogo de cursos para empezar tu aprendizaje mecatrónico.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/80 text-slate-400 uppercase font-mono border-b border-slate-800">
                <tr>
                  <th className="p-4">ID Orden</th>
                  <th className="p-4">Fecha</th>
                  <th className="p-4">Detalle Cursos</th>
                  <th className="p-4">Pasarela</th>
                  <th className="p-4">Monto</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-right">Comprobante</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 font-mono text-amber-400 font-bold">{order.id}</td>
                    <td className="p-4 text-slate-400">{new Date(order.created_at).toLocaleDateString('es-PE')}</td>
                    <td className="p-4 max-w-xs">
                      <div className="space-y-1">
                        {order.items?.map((it: any, idx: number) => (
                          <div key={idx} className="truncate text-slate-200 font-medium">
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
                      {order.status === 'PAID' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-bold text-[10px] uppercase">
                          <CheckCircle2 className="w-3 h-3" /> Pagado
                        </span>
                      ) : order.status === 'PENDING' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full font-bold text-[10px] uppercase">
                          <Clock className="w-3 h-3" /> Pendiente
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full font-bold text-[10px] uppercase">
                          {order.status}
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {order.doc_number ? (
                        <span className="inline-flex items-center gap-1 text-slate-300 font-mono text-[11px] bg-slate-800 px-2.5 py-1 rounded border border-slate-700">
                          <FileText className="w-3.5 h-3.5 text-amber-400" /> {order.doc_type || 'BOLETA'}: {order.doc_number}
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[11px]">En procesamiento</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
