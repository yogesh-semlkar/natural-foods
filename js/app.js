/**
 * Master Application Controller
 * Handles Storefront rendering, Cart Drawer, Modals, Filters, Search & Checkout Flow
 */

let activeCategory = 'all';
let searchQuery = '';
let currentSort = 'popular';
let selectedVariants = {}; // Map of productId -> selected weight string

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  renderProducts();
  updateCartUI();
  setupEventListeners();

  // Subscribe store changes
  window.appStore.subscribe(() => {
    updateCartUI();
  });
}

function setupEventListeners() {
  // Category tabs
  document.querySelectorAll('.cat-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
      e.currentTarget.classList.add('active');
      activeCategory = e.currentTarget.dataset.category;
      renderProducts();
    });
  });

  // Search input
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderProducts();
    });
  }

  // Sort select
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      renderProducts();
    });
  }

  // Cart Drawer open/close
  const cartBtn = document.getElementById('cart-toggle-btn');
  const closeCartBtn = document.getElementById('close-cart-btn');
  const cartOverlay = document.getElementById('cart-drawer-overlay');

  if (cartBtn) cartBtn.addEventListener('click', openCartDrawer);
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCartDrawer);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCartDrawer);

  // Scroll Header Shadow
  window.addEventListener('scroll', () => {
    const header = document.querySelector('.site-header');
    if (header) {
      if (window.scrollY > 20) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    }
  });
}

// Render Products Grid
function renderProducts() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  let list = [...window.appStore.products];

  // Category filter
  if (activeCategory !== 'all') {
    list = list.filter(p => p.category === activeCategory);
  }

  // Search filter
  if (searchQuery) {
    list = list.filter(p => 
      p.name.toLowerCase().includes(searchQuery) ||
      p.shortDesc.toLowerCase().includes(searchQuery) ||
      (p.hindiName && p.hindiName.includes(searchQuery))
    );
  }

  // Sorting
  if (currentSort === 'price-low') {
    list.sort((a, b) => a.variants[0].price - b.variants[0].price);
  } else if (currentSort === 'price-high') {
    list.sort((a, b) => b.variants[0].price - a.variants[0].price);
  } else if (currentSort === 'rating') {
    list.sort((a, b) => b.rating - a.rating);
  }

  if (list.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
        <p style="font-size: 1.5rem; margin-bottom: 8px;">🌾 Koi product nahi mila</p>
        <p>Aap kisi doosre category ya search term ko try kar sakte hain.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = list.map(product => {
    const selectedWeight = selectedVariants[product.id] || product.variants[0].weight;
    const currentVariant = product.variants.find(v => v.weight === selectedWeight) || product.variants[0];

    return `
      <article class="product-card" data-id="${product.id}">
        <div class="card-img-wrap" onclick="openQuickView('${product.id}')">
          <span class="card-badge ${product.badgeType || 'badge-organic'}">${product.badge}</span>
          ${currentVariant.originalPrice ? `<span class="badge-discount">Save ₹${currentVariant.originalPrice - currentVariant.price}</span>` : ''}
          <img src="${product.image}" alt="${product.name}" class="card-img" loading="lazy">
          <button class="quick-view-btn" onclick="event.stopPropagation(); openQuickView('${product.id}')">
            🔍 Quick Details
          </button>
        </div>

        <div class="card-body">
          <div class="card-rating">
            <span>★</span>
            <strong>${product.rating}</strong>
            <span class="rating-text">(${product.reviewCount} reviews)</span>
          </div>

          <h3 class="card-title" onclick="openQuickView('${product.id}')">${product.name}</h3>
          <p class="card-subtitle">${product.shortDesc}</p>

          <div class="weight-selector-label">Select Pack Size:</div>
          <div class="weight-pills">
            ${product.variants.map(v => `
              <button type="button" 
                      class="weight-pill ${v.weight === selectedWeight ? 'selected' : ''}" 
                      onclick="selectCardVariant('${product.id}', '${v.weight}')">
                ${v.weight}
              </button>
            `).join('')}
          </div>

          <div class="card-footer">
            <div class="card-price-block">
              <span class="price-current">₹${currentVariant.price}</span>
              ${currentVariant.originalPrice ? `<span class="price-original">₹${currentVariant.originalPrice}</span>` : ''}
            </div>

            <button class="add-cart-btn" id="btn-add-${product.id}" onclick="handleAddToCart('${product.id}')">
              <span>🛒 Add to Cart</span>
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

// Select weight variant on a product card
function selectCardVariant(productId, weight) {
  selectedVariants[productId] = weight;
  renderProducts();
}

// Handle Add to Cart with visual bounce
function handleAddToCart(productId) {
  const product = window.appStore.getProduct(productId);
  if (!product) return;

  const selectedWeight = selectedVariants[productId] || product.variants[0].weight;
  const success = window.appStore.addToCart(productId, selectedWeight, 1);

  if (success) {
    const btn = document.getElementById(`btn-add-${productId}`);
    if (btn) {
      const originalHtml = btn.innerHTML;
      btn.classList.add('added');
      btn.innerHTML = `<span>✓ Added!</span>`;
      setTimeout(() => {
        btn.classList.remove('added');
        btn.innerHTML = originalHtml;
      }, 1200);
    }
    showToast(`🌿 Added ${product.name} (${selectedWeight}) to Cart!`);
  }
}

// Cart Drawer open/close
function openCartDrawer() {
  document.getElementById('cart-drawer-overlay').classList.add('active');
  document.getElementById('cart-drawer').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCartDrawer() {
  document.getElementById('cart-drawer-overlay').classList.remove('active');
  document.getElementById('cart-drawer').classList.remove('active');
  document.body.style.overflow = '';
}

// Update Cart Drawer UI
function updateCartUI() {
  const cart = window.appStore.cart;
  const totals = window.appStore.getCartTotals();

  // Badges
  const cartBadges = document.querySelectorAll('.cart-count');
  cartBadges.forEach(b => b.textContent = totals.count);

  // Cart Items List
  const itemsContainer = document.getElementById('cart-items-list');
  const emptyState = document.getElementById('cart-empty-state');
  const footer = document.getElementById('cart-footer');
  const shippingBar = document.getElementById('shipping-bar-box');

  if (!itemsContainer) return;

  if (cart.length === 0) {
    itemsContainer.style.display = 'none';
    if (emptyState) emptyState.style.display = 'block';
    if (footer) footer.style.display = 'none';
    if (shippingBar) shippingBar.style.display = 'none';
    return;
  }

  itemsContainer.style.display = 'flex';
  if (emptyState) emptyState.style.display = 'none';
  if (footer) footer.style.display = 'block';
  if (shippingBar) shippingBar.style.display = 'block';

  // Shipping goal calculation
  const progressFill = document.getElementById('shipping-progress-fill');
  const shippingText = document.getElementById('shipping-bar-text');
  if (progressFill && shippingText) {
    progressFill.style.width = `${totals.shippingProgress}%`;
    if (totals.amountNeededForFreeShipping > 0) {
      shippingText.innerHTML = `Add <strong>₹${totals.amountNeededForFreeShipping}</strong> more to unlock <strong>FREE Delivery</strong> across India! 🚚`;
    } else {
      shippingText.innerHTML = `🎉 Congratulations! You have unlocked <strong>FREE Express Delivery</strong>!`;
    }
  }

  // Render items
  itemsContainer.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-info">
        <h4 class="cart-item-title">${item.name}</h4>
        <div class="cart-item-variant">Pack: <strong>${item.weight}</strong></div>
        <div class="cart-item-bottom">
          <div class="cart-qty-stepper">
            <button class="qty-btn" onclick="window.appStore.updateCartQty('${item.productId}', '${item.weight}', -1)">-</button>
            <span class="qty-val">${item.quantity}</span>
            <button class="qty-btn" onclick="window.appStore.updateCartQty('${item.productId}', '${item.weight}', 1)">+</button>
          </div>
          <div>
            <span class="cart-item-price">₹${item.price * item.quantity}</span>
            <button class="cart-item-remove" onclick="window.appStore.removeFromCart('${item.productId}', '${item.weight}')">Remove</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  // Cart summary totals
  const subtotalEl = document.getElementById('cart-subtotal');
  const discountRow = document.getElementById('cart-discount-row');
  const discountEl = document.getElementById('cart-discount');
  const deliveryEl = document.getElementById('cart-delivery');
  const totalEl = document.getElementById('cart-grand-total');

  if (subtotalEl) subtotalEl.textContent = `₹${totals.subtotal}`;
  
  if (discountRow && discountEl) {
    if (totals.couponDiscount > 0) {
      discountRow.style.display = 'flex';
      discountEl.textContent = `-₹${totals.couponDiscount}`;
    } else {
      discountRow.style.display = 'none';
    }
  }

  if (deliveryEl) {
    deliveryEl.innerHTML = totals.shippingFee === 0 ? '<span style="color:var(--badge-green); font-weight:700;">FREE</span>' : `₹${totals.shippingFee}`;
  }

  if (totalEl) totalEl.textContent = `₹${totals.total}`;
}

// Apply Coupon from Cart Input
function handleApplyCoupon() {
  const input = document.getElementById('cart-coupon-input');
  if (!input) return;
  const res = window.appStore.applyCoupon(input.value);
  showToast(res.message);
  if (res.success) {
    input.value = '';
  }
}

// Quick View Modal
function openQuickView(productId) {
  const product = window.appStore.getProduct(productId);
  if (!product) return;

  const modal = document.getElementById('quick-view-modal');
  const body = document.getElementById('quick-view-body');
  if (!modal || !body) return;

  const selectedWeight = selectedVariants[product.id] || product.variants[0].weight;
  const currentVariant = product.variants.find(v => v.weight === selectedWeight) || product.variants[0];

  body.innerHTML = `
    <div class="quick-view-grid">
      <div>
        <img src="${product.image}" alt="${product.name}" class="quick-view-img">
        <div style="margin-top:16px; background:var(--primary-50); border:1px solid var(--primary-100); padding:14px; border-radius:var(--radius-md);">
          <strong style="color:var(--primary-800); font-size:0.85rem;">🌱 100% Sourced Direct from Farmers</strong>
          <p style="font-size:0.8rem; color:var(--text-muted); margin-top:4px;">No intermediate traders, cold-chain packed in eco-friendly jars and pouches.</p>
        </div>
      </div>
      <div>
        <span class="card-badge ${product.badgeType || 'badge-organic'}" style="position:static; display:inline-block; margin-bottom:10px;">${product.badge}</span>
        <h2 style="font-family:var(--font-heading); font-size:1.8rem; color:var(--primary-900); margin-bottom:4px;">${product.name}</h2>
        <p style="font-size:0.9rem; color:var(--accent-warm); font-weight:700; margin-bottom:12px;">${product.hindiName || ''}</p>
        
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:16px;">
          <span style="color:var(--accent-warm); font-weight:700;">★ ${product.rating}</span>
          <span style="color:var(--text-muted); font-size:0.85rem;">(${product.reviewCount} verified organic buyer reviews)</span>
        </div>

        <div style="display:flex; align-items:baseline; gap:10px; margin-bottom:20px;">
          <span style="font-family:var(--font-heading); font-size:2rem; font-weight:700; color:var(--primary-900);">₹${currentVariant.price}</span>
          ${currentVariant.originalPrice ? `<span style="text-decoration:line-through; color:var(--text-muted); font-size:1.1rem;">₹${currentVariant.originalPrice}</span>` : ''}
          <span style="color:var(--badge-green); font-size:0.85rem; font-weight:700;">(${currentVariant.perUnit})</span>
        </div>

        <div style="margin-bottom:20px;">
          <label style="font-size:0.8rem; font-weight:700; text-transform:uppercase; color:var(--text-muted); display:block; margin-bottom:8px;">Choose Variant:</label>
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            ${product.variants.map(v => `
              <button class="weight-pill ${v.weight === selectedWeight ? 'selected' : ''}" 
                      onclick="selectCardVariant('${product.id}', '${v.weight}'); openQuickView('${product.id}')">
                ${v.weight} - ₹${v.price}
              </button>
            `).join('')}
          </div>
        </div>

        <p style="color:var(--text-body); font-size:0.92rem; line-height:1.6; margin-bottom:20px;">${product.purityStory}</p>

        <!-- Nutrition Table -->
        <h4 style="font-size:0.9rem; font-weight:700; color:var(--primary-900); margin-bottom:8px;">Nutritional Facts & Testing</h4>
        <div style="background:var(--surface-tint); border-radius:var(--radius-sm); padding:10px 14px; margin-bottom:24px; font-size:0.82rem;">
          ${Object.entries(product.nutrition || {}).map(([k, v]) => `
            <div style="display:flex; justify-content:space-between; padding:4px 0; border-bottom:1px solid rgba(0,0,0,0.05);">
              <span style="color:var(--text-muted); font-weight:600;">${k}</span>
              <strong style="color:var(--text-dark);">${v}</strong>
            </div>
          `).join('')}
        </div>

        <button class="btn-primary" style="width:100%; justify-content:center; padding:14px;" 
                onclick="handleAddToCart('${product.id}'); closeModal('quick-view-modal'); openCartDrawer();">
          🛒 Add ${currentVariant.weight} to Cart - ₹${currentVariant.price}
        </button>
      </div>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
}

// Checkout Flow
function openCheckoutModal() {
  const cart = window.appStore.cart;
  if (cart.length === 0) {
    showToast("Aapka cart khaali hai!");
    return;
  }

  closeCartDrawer();
  const totals = window.appStore.getCartTotals();

  const checkoutModal = document.getElementById('checkout-modal');
  const amountEl = document.getElementById('checkout-pay-amount');
  if (amountEl) amountEl.textContent = `₹${totals.total}`;

  // Update breakdown
  const summaryEl = document.getElementById('checkout-order-summary');
  if (summaryEl) {
    summaryEl.innerHTML = `
      <div style="background:var(--surface-tint); padding:14px; border-radius:var(--radius-md); font-size:0.85rem; margin-bottom:18px;">
        <div style="font-weight:700; margin-bottom:8px; color:var(--primary-900);">Order Items (${totals.count}):</div>
        ${cart.map(i => `<div style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>${i.name} (${i.weight}) x${i.quantity}</span><strong>₹${i.price * i.quantity}</strong></div>`).join('')}
        <hr style="border:none; border-top:1px dashed var(--surface-border); margin:8px 0;">
        <div style="display:flex; justify-content:space-between; font-weight:800; font-size:1rem; color:var(--primary-900);">
          <span>Total Payable:</span>
          <span>₹${totals.total}</span>
        </div>
      </div>
    `;
  }

  checkoutModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Handle Pincode Auto-detect in Checkout
function handleCheckoutPincodeChange(pincode) {
  const statusEl = document.getElementById('checkout-pincode-status');
  const cityInput = document.getElementById('checkout-city');
  const stateInput = document.getElementById('checkout-state');

  if (!pincode || pincode.length < 6) {
    if (statusEl) statusEl.textContent = '';
    return;
  }

  const res = lookupPincode(pincode);
  if (res.valid) {
    if (cityInput && !cityInput.value) cityInput.value = res.city;
    if (stateInput && !stateInput.value) stateInput.value = res.state;
    if (statusEl) {
      statusEl.innerHTML = `<span style="color:var(--badge-green); font-weight:600;">✓ ${res.message}</span>`;
    }
  } else {
    if (statusEl) {
      statusEl.innerHTML = `<span style="color:#C53030;">${res.message}</span>`;
    }
  }
}

// Complete Order Submission
function submitOrder(e) {
  if (e) e.preventDefault();

  const fullName = document.getElementById('checkout-name').value.trim();
  const phone = document.getElementById('checkout-phone').value.trim();
  const email = document.getElementById('checkout-email').value.trim();
  const address = document.getElementById('checkout-address').value.trim();
  const pincode = document.getElementById('checkout-pincode').value.trim();
  const city = document.getElementById('checkout-city').value.trim();
  const state = document.getElementById('checkout-state').value.trim();

  if (!fullName || !phone || !address || !pincode) {
    alert("Kripya saari zaroori details (Naam, Phone, Address, Pincode) bharein.");
    return;
  }

  const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
  const totals = window.appStore.getCartTotals();

  // Save order in store
  const order = window.appStore.saveOrder({
    customer: {
      fullName,
      phone,
      email,
      address,
      pincode,
      city: city || 'Local',
      state: state || 'India'
    },
    paymentMethod: paymentMethod === 'upi' ? 'Online UPI (GPay/PhonePe)' : (paymentMethod === 'card' ? 'Online Cards / Netbanking' : 'Cash on Delivery')
  });

  closeModal('checkout-modal');
  openReceiptModal(order);
}

// Receipt Modal
function openReceiptModal(order) {
  const modal = document.getElementById('receipt-modal');
  const body = document.getElementById('receipt-body');
  if (!modal || !body) return;

  const upiInfo = getUpiDetails(order.totals.total, order.orderId);

  body.innerHTML = `
    <div class="receipt-card">
      <div class="receipt-check-icon">✓</div>
      <h3 style="font-family:var(--font-heading); font-size:1.6rem; color:var(--primary-900);">Order Placed Successfully!</h3>
      <p style="color:var(--text-muted); font-size:0.9rem;">Dhanyawaad <strong>${order.customer.fullName}</strong>! Aapka order receive ho gaya hai.</p>

      <div style="background:var(--primary-50); border:1px solid var(--primary-100); padding:12px; border-radius:var(--radius-md); margin:16px 0; font-size:0.95rem;">
        Order Reference ID: <strong style="color:var(--primary-900);">#${order.orderId}</strong>
      </div>

      <table class="receipt-details-table">
        <tr><td>Delivery Address:</td><td>${order.customer.address}, ${order.customer.city} (${order.customer.pincode})</td></tr>
        <tr><td>Phone Number:</td><td>${order.customer.phone}</td></tr>
        <tr><td>Payment Mode:</td><td>${order.paymentMethod}</td></tr>
        <tr><td>Total Amount:</td><td style="font-size:1.1rem; color:var(--primary-900);">₹${order.totals.total}</td></tr>
      </table>

      <!-- UPI QR Box for Instant Payment -->
      <div class="upi-qr-box">
        <p style="font-size:0.85rem; font-weight:700; color:var(--primary-800); margin-bottom:8px;">Instant UPI Pay (Scan with GPay / PhonePe / Paytm):</p>
        <img src="${upiInfo.qrUrl}" alt="Scan to Pay">
        <p style="font-size:0.75rem; color:var(--text-muted);">UPI ID: <strong>${upiInfo.upiId}</strong></p>
      </div>

      <div style="display:flex; flex-direction:column; gap:10px; margin-top:20px;">
        <button class="btn-primary" style="justify-content:center; background:#25D366; box-shadow:0 4px 14px rgba(37,211,102,0.3);" 
                onclick="sendWhatsAppOrder(${JSON.stringify(order).replace(/"/g, '&quot;')})">
          💬 Send Order Confirmation on WhatsApp
        </button>
        <button class="btn-secondary" style="justify-content:center; color:var(--text-dark); border-color:var(--surface-border);" 
                onclick="window.print()">
          🖨️ Print Tax Invoice / Bill
        </button>
      </div>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function viewReceiptModal(orderId) {
  const order = window.appStore.orders.find(o => o.orderId === orderId);
  if (order) openReceiptModal(order);
}

// Admin Panel Toggle
function openAdminModal() {
  const entered = prompt("Founder Access: Kripya Admin password dalein (Default: admin):", "admin");
  if (entered !== window.appStore.settings.adminPassword && entered !== "admin") {
    alert("Galat Password!");
    return;
  }

  const modal = document.getElementById('admin-modal');
  if (!modal) return;

  // Fill store settings values
  const settings = window.appStore.settings;
  const storeNameInput = document.getElementById('setting-store-name');
  const phoneInput = document.getElementById('setting-phone');
  const whatsappInput = document.getElementById('setting-whatsapp');
  const freeShipInput = document.getElementById('setting-free-shipping');

  if (storeNameInput) storeNameInput.value = settings.storeName;
  if (phoneInput) phoneInput.value = settings.phone;
  if (whatsappInput) whatsappInput.value = settings.whatsapp;
  if (freeShipInput) freeShipInput.value = settings.freeShippingThreshold;

  // Render stats
  const orders = window.appStore.orders;
  const totalRev = orders.reduce((s, o) => s + (o.totals ? o.totals.total : 0), 0);
  const revEl = document.getElementById('admin-stat-revenue');
  const ordersEl = document.getElementById('admin-stat-orders');
  const productsEl = document.getElementById('admin-stat-products');

  if (revEl) revEl.textContent = `₹${totalRev}`;
  if (ordersEl) ordersEl.textContent = orders.length;
  if (productsEl) productsEl.textContent = window.appStore.products.length;

  renderAdminProducts();
  renderAdminOrders();

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function switchAdminTab(tabName) {
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.admin-tab-pane').forEach(p => p.style.display = 'none');

  const activeTabBtn = document.getElementById(`tab-btn-${tabName}`);
  const activePane = document.getElementById(`tab-pane-${tabName}`);

  if (activeTabBtn) activeTabBtn.classList.add('active');
  if (activePane) activePane.style.display = 'block';
}

// Add New Product from Admin Form
function handleAddNewProduct(e) {
  if (e) e.preventDefault();

  const name = document.getElementById('new-prod-name').value.trim();
  const hindiName = document.getElementById('new-prod-hindi').value.trim();
  const category = document.getElementById('new-prod-category').value;
  const price = Number(document.getElementById('new-prod-price').value);
  const weight = document.getElementById('new-prod-weight').value.trim();
  const desc = document.getElementById('new-prod-desc').value.trim();
  const image = document.getElementById('new-prod-image').value.trim() || 'assets/images/multigrain-atta.jpg';

  if (!name || !price || !weight) {
    alert("Kripya Product Name, Price, aur Weight zaroor bharein.");
    return;
  }

  const newProd = {
    id: `prod-${Date.now()}`,
    name,
    hindiName: hindiName || name,
    category,
    badge: "Fresh Sourced",
    badgeType: "badge-organic",
    image,
    rating: 5.0,
    reviewCount: 1,
    shortDesc: desc || "Pure traditional natural food fresh from organic farms.",
    purityStory: desc || "Stone ground / traditional harvested without chemicals.",
    nutrition: {
      "Purity": "100% Farm Fresh",
      "Chemicals": "Zero"
    },
    inStock: true,
    variants: [
      { weight, price, originalPrice: Math.round(price * 1.15), perUnit: `₹${price}/${weight}` }
    ]
  };

  window.appStore.addProduct(newProd);
  renderAdminProducts();
  renderProducts();
  showToast(`🌾 Naya Product "${name}" store me live ho gaya!`);
  document.getElementById('admin-add-product-form').reset();
  switchAdminTab('products');
}

// Toast notification helper
function showToast(message) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

// Header Pincode Checker Widget
function promptCheckPincode() {
  const pin = prompt("Apna 6-digit Indian Pincode dalein delivery time janne ke liye:", "110001");
  if (pin) {
    const res = lookupPincode(pin);
    alert(res.message);
  }
}
