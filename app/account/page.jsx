'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';

export default function CustomerAccountPage() {
  const router = useRouter();
  const { customer, setCustomer, showToast } = useStore();

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [newAddress, setNewAddress] = useState({ label: 'Home', address: '', city: '', state: '', pincode: '' });

  useEffect(() => {
    async function loadCustomerData() {
      try {
        const meRes = await fetch('/api/customer/me');
        const meData = await meRes.json();

        if (!meRes.ok || !meData.authenticated) {
          router.push('/');
          return;
        }

        setCustomer(meData.customer);

        // Fetch customer orders
        const ordersRes = await fetch('/api/customer/orders');
        const ordersData = await ordersRes.json();
        if (ordersData.success) {
          setOrders(ordersData.data);
        }
      } catch (err) {
        console.error("Account load error", err);
      } finally {
        setLoading(false);
      }
    }

    loadCustomerData();
  }, [router, setCustomer]);

  const handleLogout = async () => {
    await fetch('/api/customer/auth/logout', { method: 'POST' });
    setCustomer(null);
    showToast("You have been signed out.");
    router.push('/');
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.address || !newAddress.pincode) {
      alert("Please enter address and pincode");
      return;
    }

    try {
      const currentAddrs = customer.savedAddresses || [];
      const updated = [
        ...currentAddrs,
        { id: `addr-${Date.now()}`, ...newAddress }
      ];

      const res = await fetch('/api/customer/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ savedAddresses: updated })
      });

      const data = await res.json();
      if (data.success) {
        setCustomer(data.customer);
        setNewAddress({ label: 'Home', address: '', city: '', state: '', pincode: '' });
        showToast("Delivery address saved!");
      }
    } catch {
      alert("Failed to save address");
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAF7F2' }}>
        <p style={{ fontWeight: 700, color: '#1B3D28' }}>Loading customer account...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2' }}>
      {/* Account Header */}
      <header style={{
        background: '#fff',
        borderBottom: '1px solid #E8DFD5',
        padding: '16px 24px'
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: 'var(--primary-900)' }}>
            <span>🌱</span>
            <span>Prakriti Pure Store</span>
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <a href="/" style={{ fontSize: '0.88rem', color: 'var(--primary-800)', fontWeight: 600 }}>← Back to Shopping</a>
            <button
              type="button"
              onClick={handleLogout}
              style={{
                background: 'var(--surface-tint)',
                border: '1px solid var(--surface-border)',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#C53030'
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="container" style={{ padding: '36px 20px', maxWidth: '960px' }}>
        {/* Customer Profile Banner */}
        <div style={{
          background: 'linear-gradient(135deg, var(--primary-900), var(--primary-800))',
          borderRadius: '16px',
          padding: '28px 32px',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '28px',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div>
            <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#FFD480', fontWeight: 700 }}>
              Verified Organic Customer
            </span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: '#fff', marginTop: '4px' }}>
              Namaste, {customer?.name}! 🙏
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#CBD8D0', marginTop: '4px' }}>
              📱 {customer?.phone} {customer?.email ? `• ✉️ ${customer?.email}` : ''}
            </p>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            padding: '12px 20px',
            borderRadius: '12px',
            textAlign: 'center',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <span style={{ fontSize: '0.75rem', color: '#CBD8D0' }}>Total Orders</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFD480' }}>{orders.length}</div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="admin-tabs" style={{ marginBottom: '24px' }}>
          <button
            type="button"
            className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            📦 My Orders & Tracking ({orders.length})
          </button>
          <button
            type="button"
            className={`admin-tab ${activeTab === 'addresses' ? 'active' : ''}`}
            onClick={() => setActiveTab('addresses')}
          >
            📍 Saved Delivery Addresses ({(customer?.savedAddresses || []).length})
          </button>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <div>
            {orders.length === 0 ? (
              <div style={{ background: '#fff', padding: '48px 24px', borderRadius: '16px', textAlign: 'center', boxShadow: 'var(--shadow-xs)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🌾</div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: 'var(--primary-900)', marginBottom: '8px' }}>
                  Aapka koi purana order nahi hai
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '20px' }}>
                  Shuddh A2 Desi Ghee aur Pathar Chakkhi Multigrain Atta explore karein!
                </p>
                <a href="/#shop-now" className="btn-primary" style={{ display: 'inline-flex' }}>
                  Explore Fresh Harvest
                </a>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {orders.map((o) => (
                  <div key={o.orderId} style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid var(--surface-border)', boxShadow: 'var(--shadow-xs)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--surface-tint)', paddingBottom: '14px', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                      <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Order ID:</span>
                        <strong style={{ fontSize: '1.05rem', color: 'var(--primary-900)', marginLeft: '6px' }}>#{o.orderId}</strong>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          Placed on {new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className="badge-pill badge-organic" style={{ fontSize: '0.8rem', padding: '4px 12px' }}>
                          ● {o.status}
                        </span>
                        <button
                          type="button"
                          onClick={() => window.print()}
                          style={{
                            background: 'var(--surface-tint)',
                            border: '1px solid var(--surface-border)',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: 'var(--primary-800)'
                          }}
                        >
                          🖨️ Invoice
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                      {o.items.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                          <div>
                            <strong>{item.name}</strong> <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>({item.weight})</span> x{item.quantity}
                          </div>
                          <strong>₹{item.price * item.quantity}</strong>
                        </div>
                      ))}
                    </div>

                    <div style={{ background: 'var(--surface-tint)', padding: '12px 16px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.88rem' }}>
                      <div style={{ color: 'var(--text-muted)' }}>
                        Delivery Address: <strong>{o.customer.address}, {o.customer.city} ({o.customer.pincode})</strong>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block' }}>Total Paid</span>
                        <strong style={{ fontSize: '1.15rem', color: 'var(--primary-900)' }}>₹{o.totals?.total || 0}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Saved Addresses */}
        {activeTab === 'addresses' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
            {/* List */}
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--primary-900)', marginBottom: '14px' }}>
                Your Delivery Addresses
              </h3>
              {(customer?.savedAddresses || []).length === 0 ? (
                <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Koi saved address nahi hai. Right side me address add karein!
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {customer.savedAddresses.map((addr) => (
                    <div key={addr.id} style={{ background: '#fff', padding: '18px', borderRadius: '12px', border: '1px solid var(--surface-border)' }}>
                      <span className="badge-pill badge-bilona" style={{ fontSize: '0.72rem', marginBottom: '6px', display: 'inline-block' }}>
                        {addr.label || 'Home'}
                      </span>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-dark)', margin: '4px 0' }}>
                        {addr.address}
                      </p>
                      <small style={{ color: 'var(--text-muted)' }}>
                        {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                      </small>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add Address Form */}
            <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid var(--surface-border)' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: '14px' }}>
                Add New Address
              </h4>
              <form onSubmit={handleAddAddress}>
                <div className="form-group">
                  <label className="form-label">Address Label</label>
                  <select
                    className="form-select"
                    value={newAddress.label}
                    onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                  >
                    <option value="Home">Home</option>
                    <option value="Office">Office</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">House No, Building & Street *</label>
                  <textarea
                    className="form-textarea"
                    rows={2}
                    placeholder="House, Street, Area"
                    value={newAddress.address}
                    onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                    required
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Pincode *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. 110001"
                      maxLength={6}
                      value={newAddress.pincode}
                      onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="City"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    />
                  </div>
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '10px' }}>
                  Save Address
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
