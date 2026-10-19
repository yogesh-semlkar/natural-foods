'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';

export default function AdminModal() {
  const {
    products,
    orders,
    settings,
    isAdminOpen,
    setIsAdminOpen,
    toggleStock,
    updatePrice,
    updateOrderStatus,
    addProduct,
    saveSettings,
    showToast
  } = useStore();

  const [activeTab, setActiveTab] = useState('products');

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

  // Settings form state
  const [storeSettingsForm, setStoreSettingsForm] = useState({
    storeName: settings.storeName,
    phone: settings.phone,
    whatsapp: settings.whatsapp,
    freeShippingThreshold: settings.freeShippingThreshold
  });

  if (!isAdminOpen) return null;

  const totalRev = orders.reduce((sum, o) => sum + (o.totals?.total || 0), 0);

  const handleEditPrice = (productId, currentPrice, weight) => {
    const newPrice = prompt(`Enter new price for (${weight}):`, currentPrice);
    if (newPrice && !isNaN(newPrice) && Number(newPrice) > 0) {
      updatePrice(productId, 0, Number(newPrice));
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newProd.name || !newProd.price || !newProd.weight) {
      alert("Please fill all required product fields");
      return;
    }

    const created = {
      id: `prod-${Date.now()}`,
      name: newProd.name,
      hindiName: newProd.hindiName || newProd.name,
      category: newProd.category,
      badge: "Fresh Sourced",
      badgeType: "badge-organic",
      image: newProd.image || '/images/multigrain-atta.jpg',
      rating: 5.0,
      reviewCount: 1,
      shortDesc: newProd.desc || "Pure traditional natural food fresh from organic farms.",
      purityStory: newProd.desc || "Stone ground / traditional harvested without chemicals.",
      nutrition: {
        "Purity": "100% Farm Fresh",
        "Chemicals": "Zero"
      },
      inStock: true,
      variants: [
        {
          weight: newProd.weight,
          price: Number(newProd.price),
          originalPrice: Math.round(Number(newProd.price) * 1.15),
          perUnit: `₹${newProd.price}/${newProd.weight}`
        }
      ]
    };

    addProduct(created);
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
  };

  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    saveSettings({
      storeName: storeSettingsForm.storeName,
      phone: storeSettingsForm.phone,
      whatsapp: storeSettingsForm.whatsapp,
      freeShippingThreshold: Number(storeSettingsForm.freeShippingThreshold)
    });
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
      o.totals.total,
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

  return (
    <div className="modal-overlay active">
      <div className="modal-card admin-modal-card">
        <div className="modal-header">
          <h3>🌱 Founder Store Manager (Admin Panel)</h3>
          <button className="modal-close-btn" onClick={() => setIsAdminOpen(false)}>✕</button>
        </div>
        <div className="modal-body">
          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <span>Total Revenue</span>
              <h3>₹{totalRev}</h3>
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

          <div className="admin-tabs">
            <button
              type="button"
              className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              📦 Products & Stock
            </button>
            <button
              type="button"
              className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              📋 Orders & Shipping
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

          {activeTab === 'products' && (
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Base Price</th>
                    <th>Stock Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => {
                    const mainVariant = p.variants[0];
                    return (
                      <tr key={p.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img src={p.image} style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} alt="" />
                            <div>
                              <strong>{p.name}</strong><br />
                              <small style={{ color: 'var(--text-muted)' }}>{p.category.toUpperCase()} • {p.variants.length} Variants</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <strong>₹{mainVariant.price}</strong> <small style={{ color: 'var(--text-muted)' }}>({mainVariant.weight})</small>
                        </td>
                        <td>
                          <button
                            type="button"
                            className={`badge-pill ${p.inStock ? 'badge-organic' : 'badge-discount'}`}
                            style={{ cursor: 'pointer' }}
                            onClick={() => toggleStock(p.id)}
                          >
                            {p.inStock ? '● In Stock' : '✕ Out of Stock'}
                          </button>
                        </td>
                        <td>
                          <button
                            type="button"
                            style={{ color: 'var(--primary-700)', fontWeight: 700, fontSize: '0.8rem' }}
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
          )}

          {activeTab === 'orders' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                  Real-time customer orders with delivery details.
                </p>
                <button type="button" className="btn-primary" style={{ padding: '6px 14px', fontSize: '0.8rem' }} onClick={exportCSV}>
                  📥 Export Orders to Excel / CSV
                </button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer Info</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                          Abhi tak koi orders nahi aaye hain. Jaise hi customers order karenge, yahan live show honge!
                        </td>
                      </tr>
                    ) : (
                      orders.map((o) => (
                        <tr key={o.orderId}>
                          <td>
                            <strong>#{o.orderId}</strong><br />
                            <small style={{ color: 'var(--text-muted)' }}>{new Date(o.createdAt).toLocaleDateString()}</small>
                          </td>
                          <td>
                            <strong>{o.customer.fullName}</strong><br />
                            <small>{o.customer.phone}</small><br />
                            <small style={{ color: 'var(--text-muted)' }}>{o.customer.city}, {o.customer.pincode}</small>
                          </td>
                          <td>
                            <div style={{ fontSize: '0.8rem' }}>
                              {o.items.map((i, idx) => (
                                <div key={idx}>{i.name} ({i.weight}) x{i.quantity}</div>
                              ))}
                            </div>
                          </td>
                          <td>
                            <strong>₹{o.totals.total}</strong><br />
                            <small style={{ color: 'var(--badge-green)', fontWeight: 700 }}>{o.paymentMethod}</small>
                          </td>
                          <td>
                            <select
                              style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', border: '1px solid var(--surface-border)' }}
                              value={o.status}
                              onChange={(e) => updateOrderStatus(o.orderId, e.target.value)}
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

          {activeTab === 'add' && (
            <form onSubmit={handleAddSubmit}>
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
                  <label className="form-label">Product Image Path</label>
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
                  placeholder="Tell customers about the quality and sourcing"
                  value={newProd.desc}
                  onChange={(e) => setNewProd({ ...newProd, desc: e.target.value })}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ padding: '12px 24px' }}>
                Publish Product to Website
              </button>
            </form>
          )}

          {activeTab === 'settings' && (
            <form onSubmit={handleSettingsSubmit}>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Brand / Store Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={storeSettingsForm.storeName}
                    onChange={(e) => setStoreSettingsForm({ ...storeSettingsForm, storeName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Customer Support Phone</label>
                  <input
                    type="text"
                    className="form-input"
                    value={storeSettingsForm.phone}
                    onChange={(e) => setStoreSettingsForm({ ...storeSettingsForm, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">WhatsApp Number (For Order Sync)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={storeSettingsForm.whatsapp}
                    onChange={(e) => setStoreSettingsForm({ ...storeSettingsForm, whatsapp: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Free Shipping Minimum Cart Value (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={storeSettingsForm.freeShippingThreshold}
                    onChange={(e) => setStoreSettingsForm({ ...storeSettingsForm, freeShippingThreshold: e.target.value })}
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ padding: '12px 24px' }}>
                Save Settings
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
