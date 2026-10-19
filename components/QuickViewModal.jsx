'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';

export default function QuickViewModal() {
  const { activeQuickView, setActiveQuickView, addToCart, setIsCartOpen } = useStore();
  const [selectedWeight, setSelectedWeight] = useState(
    activeQuickView ? activeQuickView.variants[0].weight : ''
  );

  if (!activeQuickView) return null;

  const product = activeQuickView;
  const currentWeight = selectedWeight || product.variants[0].weight;
  const currentVariant = product.variants.find(v => v.weight === currentWeight) || product.variants[0];

  const handleAddAndOpenCart = () => {
    addToCart(product.id, currentWeight, 1);
    setActiveQuickView(null);
    setIsCartOpen(true);
  };

  return (
    <div className="modal-overlay active">
      <div className="modal-card" style={{ maxWidth: '780px' }}>
        <div className="modal-header">
          <h3>Product Details</h3>
          <button className="modal-close-btn" onClick={() => setActiveQuickView(null)}>✕</button>
        </div>
        <div className="modal-body">
          <div className="quick-view-grid">
            <div>
              <img src={product.image} alt={product.name} className="quick-view-img" />
              <div style={{ marginTop: '16px', background: 'var(--primary-50)', border: '1px solid var(--primary-100)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                <strong style={{ color: 'var(--primary-800)', fontSize: '0.85rem' }}>🌱 100% Sourced Direct from Farmers</strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  No intermediate traders, packed fresh in eco-friendly jars and pouches.
                </p>
              </div>
            </div>

            <div>
              <span className={`card-badge ${product.badgeType || 'badge-organic'}`} style={{ position: 'static', display: 'inline-block', marginBottom: '10px' }}>
                {product.badge}
              </span>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--primary-900)', marginBottom: '4px' }}>
                {product.name}
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--accent-warm)', fontWeight: 700, marginBottom: '12px' }}>
                {product.hindiName || ''}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ color: 'var(--accent-warm)', fontWeight: 700 }}>★ {product.rating}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>({product.reviewCount} verified organic buyer reviews)</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '20px' }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700, color: 'var(--primary-900)' }}>
                  ₹{currentVariant.price}
                </span>
                {currentVariant.originalPrice && (
                  <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                    ₹{currentVariant.originalPrice}
                  </span>
                )}
                <span style={{ color: 'var(--badge-green)', fontSize: '0.85rem', fontWeight: 700 }}>
                  ({currentVariant.perUnit})
                </span>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                  Choose Variant:
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {product.variants.map((v) => (
                    <button
                      key={v.weight}
                      type="button"
                      className={`weight-pill ${v.weight === currentWeight ? 'selected' : ''}`}
                      onClick={() => setSelectedWeight(v.weight)}
                    >
                      {v.weight} - ₹{v.price}
                    </button>
                  ))}
                </div>
              </div>

              <p style={{ color: 'var(--text-body)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '20px' }}>
                {product.purityStory}
              </p>

              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: '8px' }}>
                Nutritional Facts & Testing
              </h4>
              <div style={{ background: 'var(--surface-tint)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', marginBottom: '24px', fontSize: '0.82rem' }}>
                {Object.entries(product.nutrition || {}).map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{k}</span>
                    <strong style={{ color: 'var(--text-dark)' }}>{v}</strong>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
                onClick={handleAddAndOpenCart}
              >
                🛒 Add {currentVariant.weight} to Cart - ₹{currentVariant.price}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
