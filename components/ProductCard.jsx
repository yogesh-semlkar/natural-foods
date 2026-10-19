'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';

export default function ProductCard({ product }) {
  const { addToCart, setActiveQuickView } = useStore();
  const [selectedWeight, setSelectedWeight] = useState(product.variants[0].weight);
  const [isAdded, setIsAdded] = useState(false);

  const currentVariant = product.variants.find(v => v.weight === selectedWeight) || product.variants[0];

  const handleAdd = (e) => {
    e.stopPropagation();
    const success = addToCart(product.id, selectedWeight, 1);
    if (success) {
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1200);
    }
  };

  return (
    <article className="product-card">
      <div className="card-img-wrap" onClick={() => setActiveQuickView(product)}>
        <span className={`card-badge ${product.badgeType || 'badge-organic'}`}>{product.badge}</span>
        {currentVariant.originalPrice && (
          <span className="badge-discount">Save ₹{currentVariant.originalPrice - currentVariant.price}</span>
        )}
        <img src={product.image} alt={product.name} className="card-img" loading="lazy" />
        <button
          type="button"
          className="quick-view-btn"
          onClick={(e) => {
            e.stopPropagation();
            setActiveQuickView(product);
          }}
        >
          🔍 Quick Details
        </button>
      </div>

      <div className="card-body">
        <div className="card-rating">
          <span>★</span>
          <strong>{product.rating}</strong>
          <span className="rating-text">({product.reviewCount} reviews)</span>
        </div>

        <h3 className="card-title" onClick={() => setActiveQuickView(product)}>
          {product.name}
        </h3>
        <p className="card-subtitle">{product.shortDesc}</p>

        <div className="weight-selector-label">Select Pack Size:</div>
        <div className="weight-pills">
          {product.variants.map((v) => (
            <button
              key={v.weight}
              type="button"
              className={`weight-pill ${v.weight === selectedWeight ? 'selected' : ''}`}
              onClick={() => setSelectedWeight(v.weight)}
            >
              {v.weight}
            </button>
          ))}
        </div>

        <div className="card-footer">
          <div className="card-price-block">
            <span className="price-current">₹{currentVariant.price}</span>
            {currentVariant.originalPrice && (
              <span className="price-original">₹{currentVariant.originalPrice}</span>
            )}
          </div>

          <button
            type="button"
            className={`add-cart-btn ${isAdded ? 'added' : ''}`}
            onClick={handleAdd}
          >
            <span>{isAdded ? '✓ Added!' : '🛒 Add to Cart'}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
