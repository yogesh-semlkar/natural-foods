'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';

export default function Header({ searchQuery, setSearchQuery }) {
  const { customer, getTotals, setIsCartOpen, setIsCustomerAuthOpen } = useStore();
  const totals = getTotals();

  const handlePincodeClick = () => {
    const pin = prompt("Apna 6-digit Indian Pincode dalein delivery time check karne ke liye:", "110001");
    if (pin && pin.length === 6) {
      alert(`Pincode ${pin}: Express Delivery available in 2-3 business days across India! 🚚`);
    }
  };

  return (
    <>
      <aside className="announcement-bar" role="region" aria-label="Announcement">
        <span>🌿 <strong>100% Certified Organic & Lab Tested</strong> • Free Express Delivery across India on orders over ₹799!</span>
        <span className="badge-pill">Code: SHUDDH10 (10% OFF)</span>
      </aside>

      <header className="site-header">
        <div className="container nav-wrapper">
          <a href="/" className="brand-logo" aria-label="Prakriti Pure Home">
            <div className="brand-icon">🌱</div>
            <div className="brand-text">
              <h1>Prakriti Pure</h1>
              <span>100% Natural & Organic</span>
            </div>
          </a>

          <div className="header-search">
            <div className="search-input-wrap">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Desi Ghee, Multigrain Atta, Dals..."
                aria-label="Search products"
              />
            </div>
          </div>

          <div className="header-actions">
            <button type="button" className="pincode-btn" onClick={handlePincodeClick} title="Check Delivery Pincode">
              <span>📍</span>
              <span>Check Pincode</span>
            </button>

            {/* Customer Account Button */}
            {customer ? (
              <a
                href="/account"
                className="pincode-btn"
                style={{
                  background: 'var(--primary-100)',
                  borderColor: 'var(--primary-500)',
                  color: 'var(--primary-900)'
                }}
                title="My Account & Orders"
              >
                <span>👤</span>
                <span>Hi, {customer.name.split(' ')[0]}</span>
              </a>
            ) : (
              <button
                type="button"
                className="pincode-btn"
                onClick={() => setIsCustomerAuthOpen(true)}
                title="Customer Sign In / Register"
              >
                <span>👤</span>
                <span>Sign In</span>
              </button>
            )}

            {/* Cart Button */}
            <button
              type="button"
              className="cart-btn"
              onClick={() => setIsCartOpen(true)}
              aria-label="View Shopping Cart"
            >
              <span>🛒</span>
              <span className="cart-count">{totals.count}</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
