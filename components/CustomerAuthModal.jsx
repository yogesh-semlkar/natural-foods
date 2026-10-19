'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';

export default function CustomerAuthModal() {
  const { isCustomerAuthOpen, setIsCustomerAuthOpen, setCustomer, showToast } = useStore();
  const [isSignup, setIsSignup] = useState(false);

  // Form states
  const [identifier, setIdentifier] = useState(''); // phone or email for login
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isCustomerAuthOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignup) {
        if (!name || !phone || !password) {
          throw new Error("Name, Phone, and Password are required.");
        }

        const res = await fetch('/api/customer/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, phone, email, password, address, pincode })
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Failed to create account.');
        }

        setCustomer(data.customer);
        showToast(`🎉 Welcome to Prakriti Pure, ${data.customer.name}!`);
        setIsCustomerAuthOpen(false);
      } else {
        if (!identifier || !password) {
          throw new Error("Please enter your Phone/Email and Password.");
        }

        const res = await fetch('/api/customer/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier, password })
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Invalid credentials.');
        }

        setCustomer(data.customer);
        showToast(`🌿 Welcome back, ${data.customer.name}!`);
        setIsCustomerAuthOpen(false);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay active">
      <div className="modal-card" style={{ maxWidth: '460px' }}>
        <div className="modal-header">
          <h3>{isSignup ? 'Create Customer Account' : 'Customer Sign In'}</h3>
          <button className="modal-close-btn" onClick={() => setIsCustomerAuthOpen(false)}>✕</button>
        </div>

        <div className="modal-body">
          <div style={{ display: 'flex', background: 'var(--surface-tint)', borderRadius: 'var(--radius-sm)', padding: '4px', marginBottom: '20px' }}>
            <button
              type="button"
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '0.85rem',
                background: !isSignup ? '#fff' : 'transparent',
                color: !isSignup ? 'var(--primary-900)' : 'var(--text-muted)',
                boxShadow: !isSignup ? 'var(--shadow-xs)' : 'none'
              }}
              onClick={() => { setIsSignup(false); setError(''); }}
            >
              Sign In (लॉग इन)
            </button>
            <button
              type="button"
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '0.85rem',
                background: isSignup ? '#fff' : 'transparent',
                color: isSignup ? 'var(--primary-900)' : 'var(--text-muted)',
                boxShadow: isSignup ? 'var(--shadow-xs)' : 'none'
              }}
              onClick={() => { setIsSignup(true); setError(''); }}
            >
              New Account (नया खाता)
            </button>
          </div>

          {error && (
            <div style={{ background: '#FDE8E8', border: '1px solid #F98080', color: '#9B1C1C', padding: '10px 14px', borderRadius: '8px', fontSize: '0.84rem', marginBottom: '16px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {isSignup ? (
              <>
                <div className="form-group">
                  <label className="form-label">Aapka Pura Naam *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Ramesh Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Mobile Number *</label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="10-digit number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email ID</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="name@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Create Password *</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Default Delivery Address (Optional)</label>
                  <textarea
                    className="form-textarea"
                    rows={2}
                    placeholder="House, Street, Area"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="form-group">
                  <label className="form-label">Registered Phone or Email *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 9876543210 or name@gmail.com"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password *</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: '10px' }}
            >
              {loading ? 'Processing...' : (isSignup ? 'Create Account & Continue' : 'Sign In to Account')}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '16px' }}>
            🔒 100% Safe & Secure. Quick checkout & saved order history across India.
          </p>
        </div>
      </div>
    </div>
  );
}
