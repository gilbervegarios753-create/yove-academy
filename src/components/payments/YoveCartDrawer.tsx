import React, { useState } from 'react';
import { useYoveCart } from '../../context/YoveCartContext';
import { ShoppingBag, X, Trash2, Tag, ShieldCheck, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';

interface YoveCartDrawerProps {
  onOpenCheckout: () => void;
}

export const YoveCartDrawer: React.FC<YoveCartDrawerProps> = ({ onOpenCheckout }) => {
  const {
    items,
    isCartOpen,
    closeCart,
    removeFromCart,
    subtotal,
    total,
    couponCode,
    couponDiscount,
    couponMessage,
    isCouponValid,
    applyCoupon,
    removeCoupon
  } = useYoveCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [isSubmittingCoupon, setIsSubmittingCoupon] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    setIsSubmittingCoupon(true);
    await applyCoupon(inputCoupon);
    setIsSubmittingCoupon(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm transition-opacity animate-in fade-in">
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 text-slate-100 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400 border border-amber-500/20">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-wide">Mi Carrito de Compras</h2>
                <p className="text-xs text-slate-400">{items.length} {items.length === 1 ? 'producto' : 'productos'} seleccionado(s)</p>
              </div>
            </div>
            <button
              onClick={closeCart}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-12 px-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-slate-800/80 rounded-full flex items-center justify-center text-slate-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-slate-300">Tu carrito está vacío</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Explora nuestro catálogo de educación mecatrónica y añade los cursos o programas que deseas aprender.
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.productId}
                  className="p-4 bg-slate-800/50 border border-slate-700/60 rounded-xl relative group hover:border-slate-600 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded mb-1">
                        {item.type}
                      </span>
                      <h4 className="text-sm font-semibold text-slate-100 leading-snug line-clamp-2">
                        {item.name}
                      </h4>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm font-bold text-emerald-400">
                          S/ {item.price.toFixed(2)} PEN
                        </span>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-slate-400 hover:text-red-400 p-1.5 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Eliminar producto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Coupon & Summary Footer */}
          {items.length > 0 && (
            <div className="p-5 border-t border-slate-800 bg-slate-900/90 space-y-4">
              {/* Coupon Form */}
              <div>
                {!isCouponValid ? (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Código de Cupón (ej. YOVE2026)"
                        value={inputCoupon}
                        onChange={(e) => setInputCoupon(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 text-white text-xs pl-9 pr-3 py-2.5 rounded-lg focus:outline-none focus:border-amber-500 uppercase font-mono tracking-wider"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmittingCoupon || !inputCoupon.trim()}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-amber-500 text-slate-200 hover:text-slate-950 font-semibold text-xs rounded-lg border border-slate-700 transition-all disabled:opacity-50"
                    >
                      Aplicar
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-lg text-emerald-400 text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span className="font-mono font-bold">Cupón {couponCode} aplicado (-S/ {couponDiscount.toFixed(2)})</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-slate-400 hover:text-red-400 text-xs underline ml-2"
                    >
                      Quitar
                    </button>
                  </div>
                )}
                {couponMessage && !isCouponValid && (
                  <div className="flex items-center gap-1.5 text-[11px] text-red-400 mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{couponMessage}</span>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                <div className="flex justify-between">
                  <span className="text-slate-400">Subtotal</span>
                  <span>S/ {subtotal.toFixed(2)} PEN</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-medium">
                    <span>Descuento Promocional</span>
                    <span>- S/ {couponDiscount.toFixed(2)} PEN</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400">
                  <span>IGV (18% Perú incluido)</span>
                  <span>S/ {(total * 0.18).toFixed(2)} PEN</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-slate-700">
                  <span>Total a Pagar</span>
                  <span className="text-amber-400 font-mono text-lg">S/ {total.toFixed(2)} PEN</span>
                </div>
              </div>

              {/* Security Banner */}
              <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-slate-800/40 p-2.5 rounded-lg border border-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Pago cifrado y protegido por <strong>YOVE SHIELD AI</strong> & Culqi</span>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  closeCart();
                  onOpenCheckout();
                }}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
              >
                <span>Proceder al Pago Seguro</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
