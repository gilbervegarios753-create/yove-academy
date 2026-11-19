import React, { useState } from 'react';
import { useYoveCart } from '../../context/YoveCartContext';
import { CreditCard, ShieldCheck, CheckCircle2, Lock, FileText, Smartphone, RefreshCw, X, AlertTriangle } from 'lucide-react';

interface YoveCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const YoveCheckoutModal: React.FC<YoveCheckoutModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { items, total, subtotal, couponDiscount, couponCode, clearCart } = useYoveCart();

  const [docType, setDocType] = useState<'DNI' | 'RUC' | 'CE'>('DNI');
  const [docNumber, setDocNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [provider, setProvider] = useState<'culqi' | 'mercadopago' | 'stripe'>('culqi');
  const [paymentMethodType, setPaymentMethodType] = useState<'card' | 'yape' | 'plin' | 'pagoefectivo'>('card');
  const [cardToken, setCardToken] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsProcessing(true);

    try {
      const token = localStorage.getItem('yove_auth_token');
      if (!token) {
        throw new Error("Debe iniciar sesión para realizar la compra.");
      }

      // 1. Create order on server with idempotency
      const orderRes = await fetch('/api/v1/payments/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          customerEmail,
          customerName,
          customerDocType: docType,
          customerDocNumber: docNumber,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          couponCode,
          paymentProvider: provider,
          idempotencyKey: `idemp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
        })
      });

      const orderData = await orderRes.json();
      if (!orderData.success) {
        throw new Error(orderData.error || "No se pudo crear la orden en el servidor.");
      }

      const order = orderData.order;

      // 2. Execute checkout on server
      const checkoutRes = await fetch('/api/v1/payments/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          orderId: order.id,
          paymentMethodType,
          paymentMethodToken: cardToken || 'tok_test_yove_card'
        })
      });

      const checkoutData = await checkoutRes.json();
      if (!checkoutData.success) {
        throw new Error(checkoutData.error || "El pago fue rechazado por la pasarela de pagos.");
      }

      setPaymentSuccess(checkoutData);
      clearCart();

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al procesar el pago. Por favor intente nuevamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl text-slate-100 overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide">YOVE PAYMENTS — Finalizar Compra</h2>
              <p className="text-xs text-slate-400">Checkout Seguro Cifrado de Extremo a Extremo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {paymentSuccess ? (
          /* Success Screen */
          <div className="p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white">¡Pago Confirmado y Matrícula Liberada!</h3>
              <p className="text-sm text-slate-300 mt-2 max-w-md mx-auto">
                Tu transacción ha sido verificada en el servidor. Tu acceso a los cursos o programas adquiridos ha sido activado de forma inmediata.
              </p>
            </div>

            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/80 text-left text-xs space-y-2 max-w-md mx-auto font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Estado de Orden:</span>
                <span className="text-emerald-400 font-bold uppercase">PAID (CONFIRMADO)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Comprobante de Pago:</span>
                <span className="text-slate-200">{docType === 'RUC' ? 'FACTURA ELECTRÓNICA' : 'BOLETA ELECTRÓNICA'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Monto Total Pagado:</span>
                <span className="text-amber-400 font-bold">S/ {total.toFixed(2)} PEN</span>
              </div>
            </div>

            <div className="pt-4 flex gap-3 justify-center">
              <button
                onClick={() => {
                  onClose();
                  window.location.reload();
                }}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg transition-all"
              >
                Ir a Mis Cursos / Aula Virtual
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleProcessPayment} className="p-6 space-y-6">
            {errorMsg && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-400 text-xs">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Step 1: Customer Info & Invoicing */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <FileText className="w-4 h-4" /> 1. Datos del Comprador y Comprobante (Perú)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Nombre Completo / Razón Social</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Juan Pérez Ramos"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Correo Electrónico para Factura</label>
                  <input
                    type="email"
                    required
                    placeholder="correo@ejemplo.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Tipo de Documento</label>
                  <select
                    value={docType}
                    onChange={(e: any) => setDocType(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="DNI">DNI (Boleta de Venta)</option>
                    <option value="RUC">RUC (Factura Electrónica)</option>
                    <option value="CE">Carné de Extranjería / Pasaporte</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Número de Documento / RUC</label>
                  <input
                    type="text"
                    required
                    placeholder={docType === 'RUC' ? '10/20...' : '72839102'}
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Provider Selection */}
            <div className="space-y-4 pt-2 border-t border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <CreditCard className="w-4 h-4" /> 2. Selección de Pasarela y Método de Pago
              </h3>

              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setProvider('culqi');
                    setPaymentMethodType('card');
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    provider === 'culqi'
                      ? 'border-amber-500 bg-amber-500/10 text-white'
                      : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-xs">Culqi (Perú)</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Yape, Tarjetas, PagoEfectivo</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setProvider('mercadopago');
                    setPaymentMethodType('card');
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    provider === 'mercadopago'
                      ? 'border-amber-500 bg-amber-500/10 text-white'
                      : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-xs">Mercado Pago</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Checkout Perú / LATAM</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setProvider('stripe');
                    setPaymentMethodType('card');
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    provider === 'stripe'
                      ? 'border-amber-500 bg-amber-500/10 text-white'
                      : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-xs">Stripe</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">International USD / EUR</div>
                </button>
              </div>

              {provider === 'culqi' && (
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethodType('card')}
                    className={`flex-1 p-2.5 rounded-lg border text-xs flex items-center justify-center gap-2 ${
                      paymentMethodType === 'card'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                        : 'border-slate-700 bg-slate-800 text-slate-400'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Tarjeta Crédito/Débito</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethodType('yape')}
                    className={`flex-1 p-2.5 rounded-lg border text-xs flex items-center justify-center gap-2 ${
                      paymentMethodType === 'yape'
                        ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                        : 'border-slate-700 bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Yape QR (Perú)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="p-4 bg-slate-800/50 border border-slate-700/80 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal ({items.length} productos)</span>
                <span>S/ {subtotal.toFixed(2)} PEN</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Descuento ({couponCode})</span>
                  <span>- S/ {couponDiscount.toFixed(2)} PEN</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>IGV (18% Perú incluido)</span>
                <span>S/ {(total * 0.18).toFixed(2)} PEN</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-700">
                <span>Total a Pagar</span>
                <span className="text-amber-400 text-base font-mono">S/ {total.toFixed(2)} PEN</span>
              </div>
            </div>

            {/* Security Guarantee */}
            <div className="flex items-center gap-3 text-xs text-slate-400 bg-slate-800/30 p-3 rounded-xl border border-slate-800">
              <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span>Transacción 100% segura con la protección de <strong>YOVE SHIELD AI</strong>. No almacenamos datos sensibles de tu tarjeta.</span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="flex-1 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verificando con Servidor...</span>
                  </>
                ) : (
                  <span>Confirmar y Pagar S/ {total.toFixed(2)} PEN</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
