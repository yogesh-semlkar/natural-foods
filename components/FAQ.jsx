import React from 'react';

export default function FAQ() {
  return (
    <section style={{ padding: '70px 0', background: 'var(--surface-card)', borderTop: '1px solid var(--surface-border)' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="section-head">
          <span className="section-tag">Aksar Puche Jane Wale Sawal</span>
          <h2 className="section-title">Frequently Asked Questions</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <details style={{ background: 'var(--surface-tint)', padding: '16px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-border)', cursor: 'pointer' }}>
            <summary style={{ fontWeight: 700, color: 'var(--primary-900)', fontSize: '0.98rem' }}>
              Kya aapka A2 Ghee 100% Gir Cow ka hai?
            </summary>
            <p style={{ marginTop: '10px', fontSize: '0.88rem', color: 'var(--text-body)', lineHeight: 1.5 }}>
              Ji haan! Humara A2 Ghee certified indigenous Gir gaay ke curd se traditional wooden bilona method dwara banaya jata hai. Isme kisi bhi prakaar ka artificial essence ya chemical nahi hota.
            </p>
          </details>

          <details style={{ background: 'var(--surface-tint)', padding: '16px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-border)', cursor: 'pointer' }}>
            <summary style={{ fontWeight: 700, color: 'var(--primary-900)', fontSize: '0.98rem' }}>
              Multigrain Atta me kaun-kaun se anaaj hain?
            </summary>
            <p style={{ marginTop: '10px', fontSize: '0.88rem', color: 'var(--text-body)', lineHeight: 1.5 }}>
              Isme Desi Sharbati Gehun, Bajra, Jowar, Ragi, Jau (Barley), Oats aur Roasted Chana ka scientific ratio mix hota hai jo high-fiber aur low-glycemic hota hai.
            </p>
          </details>

          <details style={{ background: 'var(--surface-tint)', padding: '16px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-border)', cursor: 'pointer' }}>
            <summary style={{ fontWeight: 700, color: 'var(--primary-900)', fontSize: '0.98rem' }}>
              Delivery kitne din me hoti hai?
            </summary>
            <p style={{ marginTop: '10px', fontSize: '0.88rem', color: 'var(--text-body)', lineHeight: 1.5 }}>
              Hum poore Bharat (Pan-India) me deliver karte hain. Metro cities me 2-3 din aur anya shehron me 3-5 din me safe eco-friendly packaging ke sath parcel pahuchta hai.
            </p>
          </details>
        </div>
      </div>
    </section>
  );
}
