import React from 'react';

export default function VedicStory() {
  return (
    <section className="story-section" id="purity-story">
      <div className="container">
        <div className="story-grid">
          <div className="story-content">
            <span className="section-tag">Authentic Vedic Process</span>
            <h2>Bazaru Adulteration Vs Asli Shuddh Prakriti</h2>
            <p>
              Market me milne wala 90% ghee factory me bache hue butter ko boil karke banta hai jisme koi poshan nahi hota. Humare yahan har ek step 5,000 saal purane Vedic niyam ke anusaar hota hai:
            </p>

            <div className="process-steps">
              <div className="step-card">
                <div className="step-num">1</div>
                <div className="step-info">
                  <h4>Desi Gir Cow A2 Milk</h4>
                  <p>Khule khet me charne wali Gir gaay ka taaza A2 doodh mitti ke bartano me ubhaala jata hai.</p>
                </div>
              </div>

              <div className="step-card">
                <div className="step-num">2</div>
                <div className="step-info">
                  <h4>Whole Curd Wooden Bilona Churning</h4>
                  <p>Subah Brahma Muhurta me lakdi ke bilona se dahi ko chhaachh aur makkhan me alag kiya jata hai.</p>
                </div>
              </div>

              <div className="step-card">
                <div className="step-num">3</div>
                <div className="step-info">
                  <h4>Slow Simmered on Low Flame</h4>
                  <p>Taaza makkhan ko dheemi aanch par kadd kar danedaar, sugandhit aur sunhera shuddh ghee taiyar hota hai.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="story-visual-card">
            <img src="/images/desi-ghee.jpg" alt="Pure Vedic A2 Desi Cow Ghee" className="story-img" />
            <div className="purity-badge-floating">
              <div className="badge-col">
                <h5>100% Purity</h5>
                <span>Lab Certified & FSSAI Compliant</span>
              </div>
              <div className="badge-col" style={{ textAlign: 'right' }}>
                <h5>Zero Chemicals</h5>
                <span>No Artificial Fragrance / Colors</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
