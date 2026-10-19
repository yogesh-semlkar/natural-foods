import React from 'react';

export default function TrustStrip() {
  return (
    <div className="container">
      <div className="trust-strip">
        <div className="trust-item">
          <div className="trust-icon">🥛</div>
          <div className="trust-info">
            <h4>Vedic Bilona Ghee</h4>
            <p>Gir cow curd hand-churned in wooden bilona at sunrise</p>
          </div>
        </div>

        <div className="trust-item">
          <div className="trust-icon">⚙️</div>
          <div className="trust-info">
            <h4>Stone-Ground Atta</h4>
            <p>Slow cold-chakkhi grinding keeps natural wheat germ & fiber</p>
          </div>
        </div>

        <div className="trust-item">
          <div className="trust-icon">🥣</div>
          <div className="trust-info">
            <h4>Unpolished Pulses</h4>
            <p>Zero leather or oil polish. Pure native protein & nutrients</p>
          </div>
        </div>

        <div className="trust-item">
          <div className="trust-icon">🚚</div>
          <div className="trust-info">
            <h4>Pan-India Delivery</h4>
            <p>Fresh batch packed in eco-friendly glass & kraft paper</p>
          </div>
        </div>
      </div>
    </div>
  );
}
