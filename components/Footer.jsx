'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';

export default function Footer() {
  const { settings, setIsCartOpen } = useStore();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3>{settings.storeName}</h3>
            <p>
              Humara sankalp hai har ghar tak shuddh, rasayan-mukt, aur khet se seedhe aane wala taaza anaj aur desi ghee pahunchana. Sehatmand Bharat ka aadhar.
            </p>
            <div className="fssai-badge">
              <span>🛡️ FSSAI Lic. No: 10022051000124</span>
            </div>
          </div>

          <div className="footer-links">
            <h4>Hamare Products</h4>
            <ul>
              <li><a href="#shop-now">A2 Gir Cow Bilona Ghee</a></li>
              <li><a href="#shop-now">Stone-Ground Multigrain Atta</a></li>
              <li><a href="#shop-now">Traditional Khapli Wheat</a></li>
              <li><a href="#shop-now">Unpolished Native Dals</a></li>
              <li><a href="#shop-now">Wood-Pressed Yellow Mustard Oil</a></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Customer Care</h4>
            <ul>
              <li><a href="#purity-story">Our Vedic Process</a></li>
              <li><button type="button" onClick={() => setIsCartOpen(true)} style={{ color: '#CBD8D0', fontSize: '0.88rem' }}>View Shopping Cart</button></li>
              <li><a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp Order Support</a></li>
              <li><a href="#shop-now">Track Orders</a></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Safe & Secure</h4>
            <p style={{ fontSize: '0.85rem', color: '#CBD8D0', marginBottom: '12px' }}>
              100% Secure Payment Gateways. UPI, RuPay, Google Pay, PhonePe, Cards supported.
            </p>
            <div style={{ fontSize: '1.4rem', display: 'flex', gap: '10px' }}>
              <span>💳</span><span>📱</span><span>🔒</span><span>🚚</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 {settings.storeName}. All Rights Reserved. Crafted for Purity & Good Health.</p>
          <p>Pan-India Express Shipping • Safe Eco-Friendly Packaging</p>
        </div>
      </div>
    </footer>
  );
}
