import React from 'react';

export default function Testimonials() {
  return (
    <section style={{ padding: '70px 0', background: 'var(--bg-sand)' }}>
      <div className="container">
        <div className="section-head">
          <span className="section-tag">Customer Love</span>
          <h2 className="section-title">Kareeb 10,000+ Parivaron Ka Bharosa</h2>
          <p className="section-subtitle">
            Janein Bharat bhar ke grahak hamare shuddh anaj aur desi ghee ke baare me kya keh rahe hain.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          <div style={{ background: 'var(--surface-card)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-border)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ color: 'var(--accent-warm)', marginBottom: '8px', fontSize: '1.1rem' }}>★★★★★</div>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-body)', marginBottom: '16px', lineHeight: 1.5 }}>
              "Maine pehli baar inka Multigrain Atta order kiya tha. Rotiyan itni mulayam banti hain aur pet me koi bhaari-pan nahi lagta. Puraane zamane ke swad ki yaad aa gayi!"
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-100)', color: 'var(--primary-800)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>RS</div>
              <div>
                <strong style={{ fontSize: '0.9rem' }}>Rajesh Sharma</strong><br />
                <small style={{ color: 'var(--text-muted)' }}>Verified Buyer • New Delhi</small>
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--surface-card)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-border)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ color: 'var(--accent-warm)', marginBottom: '8px', fontSize: '1.1rem' }}>★★★★★</div>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-body)', marginBottom: '16px', lineHeight: 1.5 }}>
              "A2 Bilona Ghee ka aroma kholte hi kitchen me mehak jata hai. Danedaar texture hai aur daal me ek chammach daalte hi swad 10 guna badh jata hai. Highly recommended!"
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-100)', color: 'var(--primary-800)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>PS</div>
              <div>
                <strong style={{ fontSize: '0.9rem' }}>Pooja Singhal</strong><br />
                <small style={{ color: 'var(--text-muted)' }}>Verified Buyer • Mumbai</small>
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--surface-card)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-border)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ color: 'var(--accent-warm)', marginBottom: '8px', fontSize: '1.1rem' }}>★★★★★</div>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-body)', marginBottom: '16px', lineHeight: 1.5 }}>
              "Dals bina polish ki hain, boil karne par jo natural fragrance aati hai wo market ki polished dal me kabhi nahi milti. Pure health package!"
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-100)', color: 'var(--primary-800)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>AK</div>
              <div>
                <strong style={{ fontSize: '0.9rem' }}>Anand Kulkarni</strong><br />
                <small style={{ color: 'var(--text-muted)' }}>Verified Buyer • Bengaluru</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
