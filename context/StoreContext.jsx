'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PRODUCTS, AVAILABLE_COUPONS } from '@/data/products';

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [settings, setSettings] = useState({
    storeName: "Prakriti Pure",
    tagline: "Khet Se Seedhe Aapke Rasoi Tak",
    phone: "+91 98765 43210",
    whatsapp: "919876543210",
    freeShippingThreshold: 799,
    standardShippingFee: 60
  });
  const [coupon, setCoupon] = useState(null);

  // Modals & UI States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCustomerAuthOpen, setIsCustomerAuthOpen] = useState(false);
  const [activeQuickView, setActiveQuickView] = useState(null);
  const [lastOrderReceipt, setLastOrderReceipt] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Fetch real data from server APIs on mount
  useEffect(() => {
    async function initData() {
      try {
        const [pRes, sRes, cRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/settings'),
          fetch('/api/customer/me')
        ]);

        const [pData, sData, cData] = await Promise.all([
          pRes.json(),
          sRes.json(),
          cRes.json()
        ]);

        if (pData.success && pData.data.length > 0) {
          setProducts(pData.data);
        }

        if (sData.success) {
          setSettings(prev => ({ ...prev, ...sData.data }));
        }

        if (cData.authenticated && cData.customer) {
          setCustomer(cData.customer);
        }
      } catch (err) {
        console.warn("Could not connect to server APIs, using fallback", err);
      }
    }

    initData();

    // Load user's local cart
    try {
      const storedCart = localStorage.getItem('pkp_cart_v2');
      if (storedCart) setCart(JSON.parse(storedCart));
    } catch {}
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Cart Operations
  const addToCart = (productId, weightVariant, quantity = 1) => {
    const product = products.find(p => p.id === productId);
    if (!product || !product.inStock) return false;

    const variant = product.variants.find(v => v.weight === weightVariant) || product.variants[0];

    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(
        i => i.productId === productId && i.weight === variant.weight
      );

      let newCart;
      if (existingIndex > -1) {
        newCart = [...prevCart];
        newCart[existingIndex].quantity += quantity;
      } else {
        newCart = [
          ...prevCart,
          {
            productId: product.id,
            name: product.name,
            hindiName: product.hindiName,
            image: product.image,
            category: product.category,
            weight: variant.weight,
            price: variant.price,
            originalPrice: variant.originalPrice,
            quantity
          }
        ];
      }
      localStorage.setItem('pkp_cart_v2', JSON.stringify(newCart));
      return newCart;
    });

    showToast(`🌿 Added ${product.name} (${variant.weight}) to Cart!`);
    return true;
  };

  const updateCartQty = (productId, weight, delta) => {
    setCart(prevCart => {
      let newCart = prevCart.map(item => {
        if (item.productId === productId && item.weight === weight) {
          return { ...item, quantity: item.quantity + delta };
        }
        return item;
      }).filter(item => item.quantity > 0);

      localStorage.setItem('pkp_cart_v2', JSON.stringify(newCart));
      return newCart;
    });
  };

  const removeFromCart = (productId, weight) => {
    setCart(prevCart => {
      const newCart = prevCart.filter(i => !(i.productId === productId && i.weight === weight));
      localStorage.setItem('pkp_cart_v2', JSON.stringify(newCart));
      return newCart;
    });
    showToast("Item removed from Cart");
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('pkp_cart_v2');
  };

  // Totals & Calculations
  const getTotals = () => {
    const count = cart.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    const originalSubtotal = cart.reduce((sum, i) => sum + ((i.originalPrice || i.price) * i.quantity), 0);
    const savings = Math.max(0, originalSubtotal - subtotal);

    let shippingFee = subtotal >= settings.freeShippingThreshold || subtotal === 0 ? 0 : settings.standardShippingFee;
    let couponDiscount = 0;

    if (coupon && subtotal > 0) {
      if (coupon.type === 'percent') {
        couponDiscount = Math.round((subtotal * coupon.value) / 100);
      } else if (coupon.type === 'flat') {
        couponDiscount = Math.min(subtotal, coupon.value);
      } else if (coupon.type === 'shipping') {
        shippingFee = 0;
      }
    }

    const total = Math.max(0, subtotal - couponDiscount + shippingFee);
    const amountNeededForFreeShipping = Math.max(0, settings.freeShippingThreshold - subtotal);
    const shippingProgress = Math.min(100, Math.round((subtotal / settings.freeShippingThreshold) * 100));

    return {
      count,
      subtotal,
      savings,
      couponDiscount,
      shippingFee,
      total,
      amountNeededForFreeShipping,
      shippingProgress
    };
  };

  const applyCoupon = (code) => {
    const clean = (code || '').trim().toUpperCase();
    if (AVAILABLE_COUPONS[clean]) {
      setCoupon({ code: clean, ...AVAILABLE_COUPONS[clean] });
      showToast(`Coupon applied: ${AVAILABLE_COUPONS[clean].label}`);
      return true;
    }
    showToast("Invalid coupon. Try SHUDDH10 or DESI50");
    return false;
  };

  // Real Server Order Submission via POST /api/orders
  const placeOrder = async (customerData, paymentMethod) => {
    const totals = getTotals();

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: customer?.id || null,
          customer: customerData,
          items: cart,
          totals,
          paymentMethod
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit order to server.');
      }

      const createdOrder = data.data;
      clearCart();
      setCoupon(null);
      setLastOrderReceipt(createdOrder);
      setIsCheckoutOpen(false);
      return createdOrder;
    } catch (err) {
      alert(`Order placement error: ${err.message}`);
      return null;
    }
  };

  return (
    <StoreContext.Provider value={{
      products,
      cart,
      customer,
      setCustomer,
      settings,
      coupon,
      isCartOpen,
      setIsCartOpen,
      isCheckoutOpen,
      setIsCheckoutOpen,
      isCustomerAuthOpen,
      setIsCustomerAuthOpen,
      activeQuickView,
      setActiveQuickView,
      lastOrderReceipt,
      setLastOrderReceipt,
      toastMessage,
      showToast,
      addToCart,
      updateCartQty,
      removeFromCart,
      clearCart,
      getTotals,
      applyCoupon,
      placeOrder
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}
