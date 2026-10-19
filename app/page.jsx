'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import TrustStrip from '@/components/TrustStrip';
import ProductCard from '@/components/ProductCard';
import VedicStory from '@/components/VedicStory';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import CheckoutModal from '@/components/CheckoutModal';
import ReceiptModal from '@/components/ReceiptModal';
import QuickViewModal from '@/components/QuickViewModal';
import CustomerAuthModal from '@/components/CustomerAuthModal';

export default function HomePage() {
  const { products, toastMessage } = useStore();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSort, setCurrentSort] = useState('popular');

  // Filter products
  let filtered = [...products];

  if (activeCategory !== 'all') {
    filtered = filtered.filter(p => p.category === activeCategory);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.shortDesc.toLowerCase().includes(q) ||
      (p.hindiName && p.hindiName.includes(q))
    );
  }

  if (currentSort === 'price-low') {
    filtered.sort((a, b) => a.variants[0].price - b.variants[0].price);
  } else if (currentSort === 'price-high') {
    filtered.sort((a, b) => b.variants[0].price - a.variants[0].price);
  } else if (currentSort === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  return (
    <>
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <main>
        <Hero />
        <TrustStrip />

        <section className="shop-section" id="shop-now">
          <div className="container">
            <div className="section-head">
              <span className="section-tag">Pure Food Catalog</span>
              <h2 className="section-title">Khet Ka Taaza Khazana</h2>
              <p className="section-subtitle">
                Chunein shuddh desi atta, a2 ghee, bina polish ki daalein aur lakdi ghani tel.
              </p>
            </div>

            <div className="filter-bar-wrapper">
              <div className="category-tabs" role="tablist">
                <button
                  type="button"
                  className={`cat-tab ${activeCategory === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveCategory('all')}
                >
                  🌱 Sabhi Products
                </button>
                <button
                  type="button"
                  className={`cat-tab ${activeCategory === 'ghee' ? 'active' : ''}`}
                  onClick={() => setActiveCategory('ghee')}
                >
                  🍯 A2 Desi Ghee
                </button>
                <button
                  type="button"
                  className={`cat-tab ${activeCategory === 'atta' ? 'active' : ''}`}
                  onClick={() => setActiveCategory('atta')}
                >
                  🌾 Multigrain & Atta
                </button>
                <button
                  type="button"
                  className={`cat-tab ${activeCategory === 'pulses' ? 'active' : ''}`}
                  onClick={() => setActiveCategory('pulses')}
                >
                  🥣 Unpolished Pulses
                </button>
                <button
                  type="button"
                  className={`cat-tab ${activeCategory === 'oils' ? 'active' : ''}`}
                  onClick={() => setActiveCategory('oils')}
                >
                  🫒 Wood-Pressed Oils
                </button>
                <button
                  type="button"
                  className={`cat-tab ${activeCategory === 'sweeteners' ? 'active' : ''}`}
                  onClick={() => setActiveCategory('sweeteners')}
                >
                  🍯 Honey & Khand
                </button>
              </div>

              <div className="sort-wrapper">
                <label htmlFor="sort-select">Sort By:</label>
                <select
                  id="sort-select"
                  className="sort-select"
                  value={currentSort}
                  onChange={(e) => setCurrentSort(e.target.value)}
                >
                  <option value="popular">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            <div className="products-grid">
              {filtered.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                  <p style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🌾 Koi product nahi mila</p>
                  <p>Aap kisi doosre category ya search term ko try kar sakte hain.</p>
                </div>
              ) : (
                filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              )}
            </div>
          </div>
        </section>

        <VedicStory />
        <Testimonials />
        <FAQ />
      </main>

      <Footer />

      {/* Customer Modals */}
      <CartDrawer />
      <CheckoutModal />
      <ReceiptModal />
      <QuickViewModal />
      <CustomerAuthModal />

      {/* Global Toast */}
      {toastMessage && (
        <div className="toast-container">
          <div className="toast">{toastMessage}</div>
        </div>
      )}
    </>
  );
}
