'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import { PINCODE_MAP } from '@/data/products';

export default function CheckoutModal() {
  const {
    cart,
    customer,
    isCheckoutOpen,
    setIsCheckoutOpen,
    getTotals,
    placeOrder
  } = useStore();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    pincode: '',
    city: '',
    state: ''
  });

  const [pincodeMessage, setPincodeMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');

  const handlePincodeChange = (pin) => {
    setFormData(prev => ({ ...prev, pincode: pin }));
    if (pin && pin.length === 6) {
      const prefix = pin.substring(0, 2);
      const info = PINCODE_MAP[prefix] || { city: 'Regional Hub', state: 'India', days: '2-4 Days' };
      setFormData(prev => ({
        ...prev,
        city: prev.city || info.city,
        state: prev.state || info.state
      }));
      setPincodeMessage(`✓ Delivering to ${info.city}, ${info.state} in ${info.days}`);
    } else {
      setPincodeMessage('');
    }
  };

  // Auto-fill customer details if logged in
  useEffect(() => {
    if (customer) {
      const defaultAddr = customer.savedAddresses?.[0] || {};
      setFormData({
        fullName: customer.name || '',
        phone: customer.phone || '',
        email: customer.email || '',
        address: defaultAddr.address || '',
        city: defaultAddr.city || '',
        state: defaultAddr.state || '',
        pincode: defaultAddr.pincode || ''
      });
      if (defaultAddr.pincode) {
        handlePincodeChange(defaultAddr.pincode);
      }
    }
  }, [customer, isCheckoutOpen]);

  if (!isCheckoutOpen) return null;

  const totals = getTotals();


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address || !formData.pincode) {
      alert("Kripya saari zaroori details (Naam, Phone, Address, Pincode) bharein.");
      return;
    }

    await placeOrder(
      formData,
      paymentMethod === 'upi' ? 'Online UPI (GPay/PhonePe)' : 'Online Cards & Netbanking'
    );
  };

  return (
    <div className="modal-overlay active">
      <div className="modal-card">
        <div className="modal-header">
          <h3>Secure Checkout (सुरक्षित ऑर्डर)</h3>
          <button className="modal-close-btn" onClick={() => setIsCheckoutOpen(false)}>✕</button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div style={{ background: 'var(--surface-tint)', padding: '14px', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '18px' }}>
              <div style={{ fontWeight: 700, marginBottom: '8px', color: 'var(--primary-900)' }}>
                Order Items ({totals.count}):
              </div>
              {cart.map((i) => (
                <div key={`${i.productId}-${i.weight}`} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>{i.name} ({i.weight}) x{i.quantity}</span>
                  <strong>₹{i.price * i.quantity}</strong>
                </div>
              ))}
              <hr style={{ border: 'none', borderTop: '1px dashed var(--surface-border)', margin: '8px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1rem', color: 'var(--primary-900)' }}>
                <span>Total Payable:</span>
                <span>₹{totals.total}</span>
              </div>
            </div>

            {customer && (
              <div style={{ background: 'var(--primary-50)', border: '1px solid var(--primary-100)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.82rem', marginBottom: '16px', color: 'var(--primary-900)' }}>
                ✓ Logged in as <strong>{customer.name}</strong>. Details auto-filled from your profile.
              </div>
            )}

            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: '12px' }}>
              1. Customer & Delivery Address
            </h4>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Aapka Pura Naam *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Ramesh Kumar"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">WhatsApp / Mobile No *</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="10-digit mobile number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email ID (for Invoice)</label>
              <input
                type="email"
                className="form-input"
                placeholder="name@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Ghar / Flat No. & Street Address *</label>
              <textarea
                className="form-textarea"
                rows={2}
                placeholder="House no, Building, Street, Landmark"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Pincode (6 Digits) *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 110001"
                  maxLength={6}
                  value={formData.pincode}
                  onChange={(e) => handlePincodeChange(e.target.value)}
                  required
                />
                {pincodeMessage && (
                  <div style={{ fontSize: '0.75rem', marginTop: '4px', color: 'var(--badge-green)', fontWeight: 600 }}>
                    {pincodeMessage}
                  </div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">City / Shehar</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">State / Rajya</label>
              <input
                type="text"
                className="form-input"
                placeholder="State"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              />
            </div>

            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-900)', marginTop: '20px', marginBottom: '12px' }}>
              2. Payment Method (Online UPI / Cards)
            </h4>

            <div className="payment-methods-grid">
              <label className={`payment-radio-box ${paymentMethod === 'upi' ? 'selected' : ''}`} onClick={() => setPaymentMethod('upi')}>
                <input type="radio" name="payMethod" checked={paymentMethod === 'upi'} readOnly />
                <div>
                  <strong>Instant UPI / QR Code</strong><br />
                  <small style={{ color: 'var(--text-muted)' }}>Google Pay, PhonePe, Paytm, BHIM</small>
                </div>
                <div className="upi-apps-icons">GPay • PhonePe • Paytm</div>
              </label>

              <label className={`payment-radio-box ${paymentMethod === 'card' ? 'selected' : ''}`} onClick={() => setPaymentMethod('card')}>
                <input type="radio" name="payMethod" checked={paymentMethod === 'card'} readOnly />
                <div>
                  <strong>Debit / Credit Card & Netbanking</strong><br />
                  <small style={{ color: 'var(--text-muted)' }}>Visa, MasterCard, RuPay, All Indian Banks</small>
                </div>
              </label>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '15px', marginTop: '12px' }}>
              <span>Pay <strong>₹{totals.total}</strong> & Place Order</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
