/**
 * Checkout & Payment Engine
 * Indian Pincode Lookup, UPI QR Generator, Razorpay Simulator & WhatsApp Order Sync
 */

const PINCODE_MAP = {
  '11': { city: 'New Delhi', state: 'Delhi', days: '1-2 Days' },
  '12': { city: 'Gurugram / Faridabad', state: 'Haryana', days: '1-2 Days' },
  '20': { city: 'Noida / Ghaziabad', state: 'Uttar Pradesh', days: '1-2 Days' },
  '40': { city: 'Mumbai', state: 'Maharashtra', days: '2-3 Days' },
  '41': { city: 'Pune', state: 'Maharashtra', days: '2-3 Days' },
  '56': { city: 'Bengaluru', state: 'Karnataka', days: '2-3 Days' },
  '50': { city: 'Hyderabad', state: 'Telangana', days: '2-3 Days' },
  '60': { city: 'Chennai', state: 'Tamil Nadu', days: '3-4 Days' },
  '70': { city: 'Kolkata', state: 'West Bengal', days: '3-4 Days' },
  '30': { city: 'Jaipur', state: 'Rajasthan', days: '2-3 Days' },
  '38': { city: 'Ahmedabad', state: 'Gujarat', days: '2-3 Days' },
  '45': { city: 'Indore', state: 'Madhya Pradesh', days: '2-3 Days' },
  '14': { city: 'Chandigarh / Ludhiana', state: 'Punjab', days: '2-3 Days' }
};

// Check Indian Pincode details
function lookupPincode(pincode) {
  const pin = (pincode || '').toString().trim();
  if (pin.length !== 6 || !/^\d{6}$/.test(pin)) {
    return { valid: false, message: 'Please enter a valid 6-digit Indian Pincode' };
  }

  const prefix = pin.substring(0, 2);
  const info = PINCODE_MAP[prefix] || { city: 'Regional Hub', state: 'Pan-India', days: '3-5 Days' };

  return {
    valid: true,
    pincode: pin,
    city: info.city,
    state: info.state,
    deliveryTime: info.days,
    message: `Delivering to ${info.city}, ${info.state} in ${info.days}`
  };
}

// Generate UPI payment URI & QR Code
function getUpiDetails(totalAmount, orderId) {
  const upiId = "prakritipure@upi";
  const payeeName = "Prakriti Pure Organics";
  const note = `Order ${orderId}`;
  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${totalAmount}&cu=INR&tn=${encodeURIComponent(note)}`;
  
  // Use quickchart or api.qrserver for reliable instant QR rendering
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiUrl)}`;

  return { upiId, upiUrl, qrUrl };
}

// Open pre-formatted WhatsApp Order
function sendWhatsAppOrder(order) {
  const settings = window.appStore.settings;
  const whatsappNumber = settings.whatsapp || "919876543210";

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
*Subtotal:* ₹${order.totals.subtotal}
*Discount:* ₹${order.totals.couponDiscount}
*Delivery:* ${order.totals.shippingFee === 0 ? 'FREE' : '₹' + order.totals.shippingFee}
*TOTAL AMOUNT:* ₹${order.totals.total}
*Payment Method:* ${order.paymentMethod}
*Status:* ${order.status}
----------------------------------------
Please confirm order dispatch. Dhanyawaad! 🙏`;

  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}
