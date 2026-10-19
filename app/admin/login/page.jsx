'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('admin@prakriti.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Login failed. Please check credentials.');
      }

      router.push('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0F2417 0%, #1B3D28 100%)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '420px',
        width: '100%',
        background: '#FFFFFF',
        borderRadius: '16px',
        padding: '36px 32px',
        boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #1B3D28, #0F2417)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFD480',
          fontSize: '1.8rem',
          margin: '0 auto 16px'
        }}>
          🔒
        </div>

        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', color: '#0F2417', marginBottom: '6px' }}>
          Founder Admin Portal
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#6C7A72', marginBottom: '24px' }}>
          Secure access to manage orders, inventory, and store settings.
        </p>

        {error && (
          <div style={{
            background: '#FDE8E8',
            border: '1px solid #F98080',
            color: '#9B1C1C',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '0.84rem',
            marginBottom: '18px',
            textAlign: 'left'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#1C241F', marginBottom: '6px' }}>
              Username or Email
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              placeholder="admin@prakriti.com"
              required
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#1C241F', marginBottom: '6px' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="••••••••"
              required
            />
            <small style={{ fontSize: '0.74rem', color: '#6C7A72', marginTop: '4px', display: 'block' }}>
              Default credentials: <code>admin@prakriti.com</code> / <code>admin123</code>
            </small>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #E8DFD5' }}>
          <a href="/" style={{ fontSize: '0.82rem', color: '#2E6644', fontWeight: 600 }}>
            ← Back to Customer Storefront
          </a>
        </div>
      </div>
    </div>
  );
}
