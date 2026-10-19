'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen,
    updateCartQty,
    removeFromCart,
    getTotals,
    applyCoupon
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const totals = getTotals();

  if (!isCartOpen) return null;

  const handleApply = (e) => {
    e.preventDefault();
    if (applyCoupon(couponInput)) {
      setCouponInput('');
    }
  };

  const handleProceed = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <>
      <div className="cart-drawer-overlay active" onClick={() => setIsCartOpen(false)} />
      <aside className="cart-drawer active" role="dialog" aria-modal="true" aria-label="Aapka Shopping Cart">
        <div className="cart-header">
          <h3><span>🛍️ Aapka Cart</span></h3>
          <button type="button" className="close-cart-btn" onClick={() => setIsCartOpen(false)} aria-label="Close cart">
            ✕
          </button>
        </div>

        {cart.length > 0 && (
          <div className="shipping-bar-box">
            <div className="shipping-bar-text">
              {totals.amountNeededForFreeShipping > 0 ? (
                <>Add <strong>₹{totals.amountNeededForFreeShipping}</strong> more to unlock <strong>FREE Delivery</strong> across India! 🚚</>
              ) : (
                <>🎉 Congratulations! You have unlocked <strong>FREE Express Delivery</strong>!</>
              )}
            </div>
            <div className="shipping-progress-track">
              <div className="shipping-progress-fill" style={{ width: `${totals.shippingProgress}%` }}></div>
            </div>
          </div>
        )}

        <div className="cart-items-list">
          {cart.length === 0 ? (
            <div className="cart-empty-state">
              <div className="cart-empty-icon">🌾</div>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--primary-900)', marginBottom: '8px' }}>
                Aapka cart khaali hai
              </h4>
              <p style={{ fontSize: '0.85rem', marginBottom: '20px' }}>
                Shuddh desi ghee aur multigrain atta explore karein!
              </p>
              <button className="btn-primary" onClick={() => setIsCartOpen(false)}>
                Browse Products
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={`${item.productId}-${item.weight}`} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-img" />
                <div className="cart-item-info">
                  <h4 className="cart-item-title">{item.name}</h4>
                  <div className="cart-item-variant">Pack: <strong>{item.weight}</strong></div>
                  <div className="cart-item-bottom">
                    <div className="cart-qty-stepper">
                      <button className="qty-btn" onClick={() => updateCartQty(item.productId, item.weight, -1)}>-</button>
                      <span className="qty-val">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => updateCartQty(item.productId, item.weight, 1)}>+</button>
                    </div>
                    <div>
                      <span className="cart-item-price">₹{item.price * item.quantity}</span>
                      <button className="cart-item-remove" onClick={() => removeFromCart(item.productId, item.weight)}>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <form onSubmit={handleApply} className="coupon-row">
              <input
                type="text"
                className="coupon-input"
                placeholder="Coupon (e.g. SHUDDH10)"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
              />
              <button type="submit" className="apply-coupon-btn">Apply</button>
            </form>

            <div className="cart-calc-row">
              <span>Items Subtotal:</span>
              <strong>₹{totals.subtotal}</strong>
            </div>

            {totals.couponDiscount > 0 && (
              <div className="cart-calc-row" style={{ color: 'var(--badge-green)' }}>
                <span>Coupon Discount:</span>
                <strong>-₹{totals.couponDiscount}</strong>
              </div>
            )}

            <div className="cart-calc-row">
              <span>Delivery Fee (Pan-India):</span>
              <span>{totals.shippingFee === 0 ? <strong style={{ color: 'var(--badge-green)' }}>FREE</strong> : `₹${totals.shippingFee}`}</span>
            </div>

            <div className="cart-calc-row total">
              <span>Kul Rashi (Total):</span>
              <span>₹{totals.total}</span>
            </div>

            <button type="button" className="checkout-btn" onClick={handleProceed}>
              <span>🔒 Proceed to Secure Checkout</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
