'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';

export default function ReceiptModal() {
  const { lastOrderReceipt, setLastOrderReceipt, settings } = useStore();

  if (!lastOrderReceipt) return null;

  const order = lastOrderReceipt;
  const upiId = "prakritipure@upi";
  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(settings.storeName)}&am=${order.totals.total}&cu=INR&tn=${encodeURIComponent(`Order ${order.orderId}`)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiUrl)}`;

  const handleWhatsApp = () => {
    let itemsList = order.items.map(i => `• ${i.name} (${i.weight}) x ${i.quantity} = ₹${i.price * i.quantity}`).join('\n');
    const text = `*🌿 NEW ORDER - ${settings.storeName}*
----------------------------------------
*Order ID:* #${order.orderId}
*Customer:* ${order.customer.fullName}
*Phone:* ${order.customer.phone}
*Address:* ${order.customer.address}, ${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}
----------------------------------------
*ITEMS ORDERED:*
${itemsList}
----------------------------------------
*Total Amount:* ₹${order.totals.total}
*Payment Method:* ${order.paymentMethod}
*Status:* ${order.status}
----------------------------------------
Please confirm order dispatch. Dhanyawaad! 🙏`;

    window.open(`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="modal-overlay active">
      <div className="modal-card">
        <div className="modal-header">
          <h3>Order Receipt & Bill</h3>
          <button className="modal-close-btn" onClick={() => setLastOrderReceipt(null)}>✕</button>
        </div>
        <div className="modal-body">
          <div className="receipt-card">
            <div className="receipt-check-icon">✓</div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', color: 'var(--primary-900)' }}>
              Order Placed Successfully!
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Dhanyawaad <strong>{order.customer.fullName}</strong>! Aapka order receive ho gaya hai.
            </p>

            <div style={{ background: 'var(--primary-50)', border: '1px solid var(--primary-100)', padding: '12px', borderRadius: 'var(--radius-md)', margin: '16px 0', fontSize: '0.95rem' }}>
              Order Reference ID: <strong style={{ color: 'var(--primary-900)' }}>#{order.orderId}</strong>
            </div>

            <table className="receipt-details-table">
              <tbody>
                <tr><td>Delivery Address:</td><td>{order.customer.address}, {order.customer.city} ({order.customer.pincode})</td></tr>
                <tr><td>Phone Number:</td><td>{order.customer.phone}</td></tr>
                <tr><td>Payment Mode:</td><td>{order.paymentMethod}</td></tr>
                <tr><td>Total Amount:</td><td style={{ fontSize: '1.1rem', color: 'var(--primary-900)' }}>₹{order.totals.total}</td></tr>
              </tbody>
            </table>

            <div className="upi-qr-box">
              <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-800)', marginBottom: '8px' }}>
                Instant UPI Pay (Scan with GPay / PhonePe / Paytm):
              </p>
              <img src={qrUrl} alt="Scan to Pay" style={{ margin: '0 auto 10px', maxWidth: '160px', borderRadius: '8px' }} />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>UPI ID: <strong>{upiId}</strong></p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
              <button
                type="button"
                className="btn-primary"
                style={{ justifyContent: 'center', background: '#25D366', boxShadow: '0 4px 14px rgba(37,211,102,0.3)' }}
                onClick={handleWhatsApp}
              >
                💬 Send Order Confirmation on WhatsApp
              </button>
              <button
                type="button"
                className="btn-secondary"
                style={{ justifyContent: 'center', color: 'var(--text-dark)', borderColor: 'var(--surface-border)' }}
                onClick={() => window.print()}
              >
                🖨️ Print Tax Invoice / Bill
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
