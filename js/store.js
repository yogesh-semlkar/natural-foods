/**
 * Store & State Management with LocalStorage Persistence
 * Handles Products, Cart, Orders, Coupons, and Store Settings
 */

const STORAGE_KEYS = {
  PRODUCTS: 'prakriti_products_v1',
  CART: 'prakriti_cart_v1',
  ORDERS: 'prakriti_orders_v1',
  SETTINGS: 'prakriti_settings_v1',
  APPLIED_COUPON: 'prakriti_coupon_v1'
};

const DEFAULT_SETTINGS = {
  storeName: "Prakriti Pure",
  tagline: "Khet Se Seedhe Aapke Rasoi Tak",
  phone: "+91 98765 43210",
  whatsapp: "919876543210",
  freeShippingThreshold: 799,
  standardShippingFee: 60,
  adminPassword: "admin"
};

const AVAILABLE_COUPONS = {
  'SHUDDH10': { type: 'percent', value: 10, label: '10% Off on Pure Organic Harvest' },
  'DESI50':   { type: 'flat', value: 50, label: '₹50 Flat Off on Bilona & Atta' },
  'FREESHIP': { type: 'shipping', value: 0, label: 'Free Express Shipping' }
};

class Store {
  constructor() {
    this.products = this.loadProducts();
    this.cart = this.loadCart();
    this.orders = this.loadOrders();
    this.settings = this.loadSettings();
    this.appliedCoupon = this.loadCoupon();
    this.listeners = [];
  }

  // Event subscription for UI reactivity
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notify() {
    this.listeners.forEach(cb => cb(this));
  }

  // Products
  loadProducts() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn("Could not load products from localStorage", e);
    }
    // Initialize with default dataset
    this.saveProducts(INITIAL_PRODUCTS);
    return INITIAL_PRODUCTS;
  }

  saveProducts(products) {
    this.products = products;
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    this.notify();
  }

  getProduct(id) {
    return this.products.find(p => p.id === id);
  }

  addProduct(newProduct) {
    const products = [newProduct, ...this.products];
    this.saveProducts(products);
  }

  toggleStock(id) {
    const products = this.products.map(p => {
      if (p.id === id) {
        return { ...p, inStock: !p.inStock };
      }
      return p;
    });
    this.saveProducts(products);
  }

  updatePrice(id, variantIndex, newPrice) {
    const products = this.products.map(p => {
      if (p.id === id) {
        const variants = [...p.variants];
        variants[variantIndex].price = Number(newPrice);
        return { ...p, variants };
      }
      return p;
    });
    this.saveProducts(products);
  }

  // Cart
  loadCart() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CART);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  saveCart() {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(this.cart));
    this.notify();
  }

  addToCart(productId, weightVariant, quantity = 1) {
    const product = this.getProduct(productId);
    if (!product || !product.inStock) return false;

    const variant = product.variants.find(v => v.weight === weightVariant) || product.variants[0];
    const existingIndex = this.cart.findIndex(
      item => item.productId === productId && item.weight === variant.weight
    );

    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += quantity;
    } else {
      this.cart.push({
        productId: product.id,
        name: product.name,
        hindiName: product.hindiName,
        image: product.image,
        category: product.category,
        weight: variant.weight,
        price: variant.price,
        originalPrice: variant.originalPrice,
        quantity: quantity
      });
    }

    this.saveCart();
    return true;
  }

  updateCartQty(productId, weightVariant, delta) {
    const index = this.cart.findIndex(
      item => item.productId === productId && item.weight === weightVariant
    );

    if (index > -1) {
      this.cart[index].quantity += delta;
      if (this.cart[index].quantity <= 0) {
        this.cart.splice(index, 1);
      }
      this.saveCart();
    }
  }

  removeFromCart(productId, weightVariant) {
    this.cart = this.cart.filter(
      item => !(item.productId === productId && item.weight === weightVariant)
    );
    this.saveCart();
  }

  clearCart() {
    this.cart = [];
    this.saveCart();
  }

  // Cart Calculations
  getCartTotals() {
    const count = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const originalSubtotal = this.cart.reduce((sum, item) => sum + ((item.originalPrice || item.price) * item.quantity), 0);
    const productSavings = Math.max(0, originalSubtotal - subtotal);

    // Shipping logic
    const freeShippingThreshold = this.settings.freeShippingThreshold;
    let shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : this.settings.standardShippingFee;
    
    // Coupon Discount
    let couponDiscount = 0;
    if (this.appliedCoupon && subtotal > 0) {
      if (this.appliedCoupon.type === 'percent') {
        couponDiscount = Math.round((subtotal * this.appliedCoupon.value) / 100);
      } else if (this.appliedCoupon.type === 'flat') {
        couponDiscount = Math.min(subtotal, this.appliedCoupon.value);
      } else if (this.appliedCoupon.type === 'shipping') {
        shippingFee = 0;
      }
    }

    const total = Math.max(0, subtotal - couponDiscount + shippingFee);
    const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
    const shippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

    return {
      count,
      subtotal,
      originalSubtotal,
      productSavings,
      couponDiscount,
      shippingFee,
      total,
      amountNeededForFreeShipping,
      shippingProgress
    };
  }

  // Coupons
  applyCoupon(code) {
    const cleanCode = (code || '').trim().toUpperCase();
    if (AVAILABLE_COUPONS[cleanCode]) {
      this.appliedCoupon = { code: cleanCode, ...AVAILABLE_COUPONS[cleanCode] };
      localStorage.setItem(STORAGE_KEYS.APPLIED_COUPON, JSON.stringify(this.appliedCoupon));
      this.notify();
      return { success: true, message: `Coupon applied: ${this.appliedCoupon.label}` };
    }
    return { success: false, message: 'Invalid or expired coupon code. Try SHUDDH10 or DESI50' };
  }

  removeCoupon() {
    this.appliedCoupon = null;
    localStorage.removeItem(STORAGE_KEYS.APPLIED_COUPON);
    this.notify();
  }

  loadCoupon() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.APPLIED_COUPON);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  // Orders
  loadOrders() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  saveOrder(orderData) {
    const order = {
      orderId: 'PKP-' + Math.floor(100000 + Math.random() * 900000),
      createdAt: new Date().toISOString(),
      status: 'Confirmed',
      items: [...this.cart],
      totals: this.getCartTotals(),
      ...orderData
    };

    this.orders.unshift(order);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(this.orders));
    this.clearCart();
    this.removeCoupon();
    this.notify();
    return order;
  }

  updateOrderStatus(orderId, newStatus) {
    this.orders = this.orders.map(o => {
      if (o.orderId === orderId) {
        return { ...o, status: newStatus };
      }
      return o;
    });
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(this.orders));
    this.notify();
  }

  // Settings
  loadSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  }

  saveSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings));
    this.notify();
  }
}

// Global store instance
window.appStore = new Store();
