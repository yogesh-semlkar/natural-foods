'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [authChecking, setAuthChecking] = useState(true);
  const [adminUser, setAdminUser] = useState(null);

  // Data states
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [settings, setSettings] = useState({
    storeName: 'Prakriti Pure',
    phone: '+91 98765 43210',
    whatsapp: '919876543210',
    freeShippingThreshold: 799
  });

  const [activeTab, setActiveTab] = useState('orders');
  const [toast, setToast] = useState('');

  // Add Product Form state
  const [newProd, setNewProd] = useState({
    name: '',
    hindiName: '',
    category: 'atta',
    price: '',
    weight: '1 kg',
    desc: '',
    image: '/images/multigrain-atta.jpg'
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // Check auth
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (!res.ok || !data.authenticated) {
          router.push('/admin/login');
          return;
        }
        setAdminUser(data.user);
        await loadDashboardData();
      } catch (err) {
        router.push('/admin/login');
      } finally {
        setAuthChecking(false);
      }
    }
    checkAuth();
  }, [router]);

  async function loadDashboardData() {
    try {
      const [pRes, oRes, sRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/orders'),
        fetch('/api/settings')
      ]);

      const [pData, oData, sData] = await Promise.all([
        pRes.json(),
        oRes.json(),
        sRes.json()
      ]);

      if (pData.success) setProducts(pData.data);
      if (oData.success) setOrders(oData.data);
      if (sData.success) setSettings(sData.data);
    } catch (e) {
      console.error("Failed to load dashboard data", e);
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const handleToggleStock = async (productId, currentStatus) => {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inStock: !currentStatus })
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.map(p => p.id === productId ? data.data : p));
        showToast("Product stock status updated on server!");
      }
    } catch {
      alert("Failed to update stock");
    }
  };

  const handleEditPrice = async (productId, currentPrice, weight) => {
    const newPrice = prompt(`Enter new price for (${weight}):`, currentPrice);
    if (newPrice && !isNaN(newPrice) && Number(newPrice) > 0) {
      try {
        const res = await fetch(`/api/products/${productId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ price: Number(newPrice), variantIndex: 0 })
        });
        const data = await res.json();
        if (data.success) {
          setProducts(prev => prev.map(p => p.id === productId ? data.data : p));
          showToast(`Updated price to ₹${newPrice}`);
        }
      } catch {
        alert("Failed to update price");
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.map(o => o.orderId === orderId ? data.data : o));
        showToast(`Order #${orderId} marked as ${newStatus}`);
      }
    } catch {
      alert("Failed to update status");
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProd.name || !newProd.price || !newProd.weight) {
      alert("Please fill name, price, and weight");
      return;
    }

    try {
      const payload = {
        name: newProd.name,
        hindiName: newProd.hindiName || newProd.name,
        category: newProd.category,
        shortDesc: newProd.desc || '100% natural, farm sourced food.',
        purityStory: newProd.desc || 'Traditional process, zero chemicals.',
        image: newProd.image || '/images/multigrain-atta.jpg',
        nutrition: { "Purity": "100% Organic" },
        variants: [
          {
            weight: newProd.weight,
            price: Number(newProd.price),
            originalPrice: Math.round(Number(newProd.price) * 1.15),
            perUnit: `₹${newProd.price}/${newProd.weight}`
          }
        ]
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        setProducts(prev => [data.data, ...prev]);
        showToast(`Product "${newProd.name}" added to server DB!`);
        setNewProd({
          name: '',
          hindiName: '',
          category: 'atta',
          price: '',
          weight: '1 kg',
          desc: '',
          image: '/images/multigrain-atta.jpg'
        });
        setActiveTab('products');
      }
    } catch {
      alert("Failed to add product");
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (data.success) {
        setSettings(data.data);
        showToast("Settings saved to server database!");
      }
    } catch {
      alert("Failed to save settings");
    }
  };

  const exportCSV = () => {
    if (orders.length === 0) {
      alert("No orders to export yet!");
      return;
    }
    const headers = ["Order ID", "Date", "Customer Name", "Phone", "Email", "Address", "City", "State", "Pincode", "Items", "Total Amount", "Payment Method", "Status"];
    const rows = orders.map(o => [
      o.orderId,
      new Date(o.createdAt).toLocaleString(),
      `"${o.customer.fullName}"`,
      `"${o.customer.phone}"`,
      `"${o.customer.email || ''}"`,
      `"${o.customer.address.replace(/"/g, '""')}"`,
      `"${o.customer.city}"`,
      `"${o.customer.state}"`,
      o.customer.pincode,
      `"${o.items.map(i => `${i.name} (${i.weight}) x${i.quantity}`).join('; ')}"`,
      o.totals?.total || 0,
      o.paymentMethod,
      o.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Orders_PrakritiPure_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Orders CSV exported successfully!");
  };

  if (authChecking) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAF7F2' }}>
        <p style={{ fontWeight: 700, color: '#1B3D28' }}>Checking secure admin session...</p>
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totals?.total || 0), 0);

  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2' }}>
      {/* Top Admin Bar */}
      <header style={{
        background: '#0F2417',
        color: '#fff',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #1B3D28'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '1.5rem' }}>🌱</span>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', color: '#fff', margin: 0 }}>
              {settings.storeName} — Admin Dashboard
            </h2>
            <small style={{ color: '#A3B8AC' }}>Logged in as {adminUser?.name || 'Administrator'}</small>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            style={{
              color: '#FFD480',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            ↗ Open Customer Storefront
          </a>
          <button
            type="button"
            onClick={handleLogout}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff',
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 600
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Admin Area */}
      <div className="container" style={{ padding: '36px 20px' }}>
        {/* Metric Cards */}
        <div className="admin-stats-grid" style={{ marginBottom: '28px' }}>
          <div className="admin-stat-card">
            <span>Total Orders Revenue</span>
            <h3>₹{totalRevenue}</h3>
          </div>
          <div className="admin-stat-card">
            <span>Total Orders Placed</span>
            <h3>{orders.length}</h3>
          </div>
          <div className="admin-stat-card">
            <span>Active Products</span>
            <h3>{products.length}</h3>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="admin-tabs">
          <button
            type="button"
            className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            📋 Customer Orders ({orders.length})
          </button>
          <button
            type="button"
            className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            📦 Products Catalog & Stock ({products.length})
          </button>
          <button
            type="button"
            className={`admin-tab ${activeTab === 'add' ? 'active' : ''}`}
            onClick={() => setActiveTab('add')}
          >
            ➕ Add New Product
          </button>
          <button
            type="button"
            className={`admin-tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ Store Settings
          </button>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: '#0F2417', margin: 0 }}>
                  Live Orders Placed on Server
                </h3>
                <small style={{ color: '#6C7A72' }}>All orders submitted by customers across web and mobile.</small>
              </div>
              <button type="button" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }} onClick={exportCSV}>
                📥 Export Orders to CSV / Excel
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer Info</th>
                    <th>Items Ordered</th>
                    <th>Total Amount</th>
                    <th>Fulfillment Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#6C7A72' }}>
                        Abhi tak koi orders nahi aaye hain. Customer website par order karega toh yahan turant dikhega!
                      </td>
                    </tr>
                  ) : (
                    orders.map((o) => (
                      <tr key={o.orderId}>
                        <td>
                          <strong>#{o.orderId}</strong><br />
                          <small style={{ color: '#6C7A72' }}>{new Date(o.createdAt).toLocaleString('en-IN')}</small>
                        </td>
                        <td>
                          <strong>{o.customer.fullName}</strong><br />
                          <small>{o.customer.phone}</small><br />
                          <small style={{ color: '#6C7A72' }}>{o.customer.address}, {o.customer.city} ({o.customer.pincode})</small>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.82rem' }}>
                            {o.items.map((i, idx) => (
                              <div key={idx}>• {i.name} ({i.weight}) x{i.quantity}</div>
                            ))}
                          </div>
                        </td>
                        <td>
                          <strong style={{ fontSize: '1rem', color: '#0F2417' }}>₹{o.totals?.total || 0}</strong><br />
                          <small style={{ color: '#18794E', fontWeight: 700 }}>{o.paymentMethod}</small>
                        </td>
                        <td>
                          <select
                            style={{ padding: '6px 10px', borderRadius: '8px', fontSize: '0.82rem', border: '1.5px solid #E8DFD5' }}
                            value={o.status}
                            onChange={(e) => handleUpdateOrderStatus(o.orderId, e.target.value)}
                          >
                            <option value="Confirmed">Confirmed</option>
                            <option value="Packed">Packed</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Products */}
        {activeTab === 'products' && (
          <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: '#0F2417', marginBottom: '16px' }}>
              Active Product Inventory
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product Details</th>
                    <th>Base Price</th>
                    <th>Stock Toggle</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => {
                    const mainVariant = p.variants[0];
                    return (
                      <tr key={p.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img src={p.image} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} alt="" />
                            <div>
                              <strong>{p.name}</strong><br />
                              <small style={{ color: '#6C7A72' }}>{p.category.toUpperCase()} • {p.variants.length} pack variants</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <strong>₹{mainVariant.price}</strong> <small style={{ color: '#6C7A72' }}>({mainVariant.weight})</small>
                        </td>
                        <td>
                          <button
                            type="button"
                            className={`badge-pill ${p.inStock ? 'badge-organic' : 'badge-discount'}`}
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleToggleStock(p.id, p.inStock)}
                          >
                            {p.inStock ? '● In Stock' : '✕ Out of Stock'}
                          </button>
                        </td>
                        <td>
                          <button
                            type="button"
                            style={{ color: '#2E6644', fontWeight: 700, fontSize: '0.85rem' }}
                            onClick={() => handleEditPrice(p.id, mainVariant.price, mainVariant.weight)}
                          >
                            ✏️ Edit Price
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Add Product */}
        {activeTab === 'add' && (
          <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', boxShadow: 'var(--shadow-sm)', maxWidth: '720px' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', color: '#0F2417', marginBottom: '20px' }}>
              Add New Organic Product
            </h3>
            <form onSubmit={handleAddProduct}>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Product English Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Organic Chana Sattu"
                    value={newProd.name}
                    onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Hindi Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. शुद्ध चना सत्तू"
                    value={newProd.hindiName}
                    onChange={(e) => setNewProd({ ...newProd, hindiName: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    className="form-select"
                    value={newProd.category}
                    onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                  >
                    <option value="atta">Atta & Flours</option>
                    <option value="ghee">Desi Ghee</option>
                    <option value="pulses">Pulses & Dals</option>
                    <option value="oils">Cold-Pressed Oils</option>
                    <option value="sweeteners">Honey & Sweeteners</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Base Price (₹) *</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="e.g. 150"
                    value={newProd.price}
                    onChange={(e) => setNewProd({ ...newProd, price: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Pack Size / Weight *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 1 kg"
                    value={newProd.weight}
                    onChange={(e) => setNewProd({ ...newProd, weight: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Image Path</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="/images/multigrain-atta.jpg"
                    value={newProd.image}
                    onChange={(e) => setNewProd({ ...newProd, image: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Product Description</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  placeholder="Quality and sourcing details for customers"
                  value={newProd.desc}
                  onChange={(e) => setNewProd({ ...newProd, desc: e.target.value })}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ padding: '12px 28px' }}>
                Publish to Server Database
              </button>
            </form>
          </div>
        )}

        {/* Tab 4: Settings */}
        {activeTab === 'settings' && (
          <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', boxShadow: 'var(--shadow-sm)', maxWidth: '640px' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', color: '#0F2417', marginBottom: '20px' }}>
              Store Identity & Logistics Settings
            </h3>
            <form onSubmit={handleSaveSettings}>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Store / Brand Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={settings.storeName}
                    onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Support Phone</label>
                  <input
                    type="text"
                    className="form-input"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">WhatsApp Number (Order Sync)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={settings.whatsapp}
                    onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Free Delivery Minimum Value (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={settings.freeShippingThreshold}
                    onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ padding: '12px 28px' }}>
                Save Settings to Server
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Admin Toast */}
      {toast && (
        <div className="toast-container">
          <div className="toast">{toast}</div>
        </div>
      )}
    </div>
  );
}
