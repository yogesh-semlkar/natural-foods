import React from 'react';

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-banner">
          <img src="/images/hero-farm.jpg" alt="Organic Indian Farm with Golden Harvest" className="hero-bg-img" />
          <div className="hero-overlay"></div>

          <div className="hero-content">
            <span className="hero-tag">🌾 Farm-To-Kitchen Direct</span>
            <h2 className="hero-title">Shuddh. Poshtik. <em>Asli Swad.</em> Khet Se Seedhe Rasoi Tak.</h2>
            <p className="hero-description">
              Chemical aur adulteration se door, Vedic Bilona method se bana A2 Desi Cow Ghee, pathar chakkhi ka Multigrain Atta, aur bina polish ki daalein. Aapke parivar ki sehat ke liye 100% shuddh.
            </p>
            <div className="hero-cta-group">
              <a href="#shop-now" className="btn-primary">
                <span>🛒 Shop Fresh Harvest</span>
              </a>
              <a href="#purity-story" className="btn-secondary">
                <span>🌾 Our Purity Story</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
