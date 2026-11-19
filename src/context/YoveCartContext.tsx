import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  productId: string;
  courseId?: string;
  name: string;
  type: 'COURSE' | 'PROGRAM' | 'CERTIFICATION' | 'BUNDLE' | 'SUBSCRIPTION' | 'DIGITAL_PRODUCT';
  price: number;
  currency: string;
  image?: string;
  quantity: number;
  isAlreadyEnrolled?: boolean;
}

interface YoveCartContextType {
  items: CartItem[];
  isCartOpen: boolean;
  couponCode: string;
  couponDiscount: number;
  couponMessage: string;
  isCouponValid: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  subtotal: number;
  total: number;
  itemsCount: number;
}

const YoveCartContext = createContext<YoveCartContextType | undefined>(undefined);

export const YoveCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('yove_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');
  const [isCouponValid, setIsCouponValid] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('yove_cart_items', JSON.stringify(items));
    } catch (e) {
      console.error("Error saving cart to localStorage:", e);
    }
  }, [items]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (newItem: Omit<CartItem, 'quantity'>) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === newItem.productId);
      if (existing) {
        return prev; // Do not duplicate single digital courses
      }
      return [...prev, { ...newItem, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const clearCart = () => {
    setItems([]);
    setCouponCode('');
    setCouponDiscount(0);
    setIsCouponValid(false);
    setCouponMessage('');
  };

  const applyCoupon = async (code: string): Promise<boolean> => {
    if (!code.trim()) return false;
    try {
      const token = localStorage.getItem('yove_auth_token');
      const res = await fetch('/api/v1/payments/coupons/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({
          code,
          subtotal: items.reduce((acc, i) => acc + i.price * i.quantity, 0),
          items
        })
      });

      const data = await res.json();
      if (data.valid) {
        setCouponCode(code.toUpperCase());
        setCouponDiscount(data.discountAmount || 0);
        setIsCouponValid(true);
        setCouponMessage(data.message || 'Cupón aplicado con éxito');
        return true;
      } else {
        setCouponDiscount(0);
        setIsCouponValid(false);
        setCouponMessage(data.message || 'Cupón inválido');
        return false;
      }
    } catch (err) {
      setCouponDiscount(0);
      setIsCouponValid(false);
      setCouponMessage('Error al validar cupón');
      return false;
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setCouponDiscount(0);
    setIsCouponValid(false);
    setCouponMessage('');
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = Math.max(0, subtotal - couponDiscount);
  const itemsCount = items.length;

  return (
    <YoveCartContext.Provider
      value={{
        items,
        isCartOpen,
        couponCode,
        couponDiscount,
        couponMessage,
        isCouponValid,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        subtotal,
        total,
        itemsCount
      }}
    >
      {children}
    </YoveCartContext.Provider>
  );
};

export const useYoveCart = () => {
  const context = useContext(YoveCartContext);
  if (!context) {
    throw new Error('useYoveCart debe usarse dentro de un YoveCartProvider');
  }
  return context;
};
