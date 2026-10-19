import fs from 'fs/promises';
import path from 'path';
import { INITIAL_PRODUCTS } from '@/data/products';

const DB_DIR = path.join(process.cwd(), 'data', 'db');
const PRODUCTS_FILE = path.join(DB_DIR, 'products.json');
const ORDERS_FILE = path.join(DB_DIR, 'orders.json');
const SETTINGS_FILE = path.join(DB_DIR, 'settings.json');
const CUSTOMERS_FILE = path.join(DB_DIR, 'customers.json');

const DEFAULT_SETTINGS = {
  storeName: "Prakriti Pure",
  tagline: "Khet Se Seedhe Aapke Rasoi Tak",
  phone: "+91 98765 43210",
  whatsapp: "919876543210",
  freeShippingThreshold: 799,
  standardShippingFee: 60,
  adminPassword: "admin"
};

// Ensure directory and JSON stores exist
async function ensureDb() {
  try {
    await fs.mkdir(DB_DIR, { recursive: true });
  } catch (e) {}

  try {
    await fs.access(PRODUCTS_FILE);
  } catch {
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(INITIAL_PRODUCTS, null, 2), 'utf-8');
  }

  try {
    await fs.access(ORDERS_FILE);
  } catch {
    await fs.writeFile(ORDERS_FILE, JSON.stringify([], null, 2), 'utf-8');
  }

  try {
    await fs.access(SETTINGS_FILE);
  } catch {
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2), 'utf-8');
  }

  try {
    await fs.access(CUSTOMERS_FILE);
  } catch {
    await fs.writeFile(CUSTOMERS_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

// Products
export async function getProducts() {
  await ensureDb();
  const data = await fs.readFile(PRODUCTS_FILE, 'utf-8');
  return JSON.parse(data);
}

export async function getProductById(id) {
  const products = await getProducts();
  return products.find(p => p.id === id);
}

export async function saveProduct(product) {
  const products = await getProducts();
  const updated = [product, ...products];
  await fs.writeFile(PRODUCTS_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  return product;
}

export async function updateProduct(id, updates) {
  const products = await getProducts();
  let updatedProduct = null;
  const updated = products.map(p => {
    if (p.id === id) {
      updatedProduct = { ...p, ...updates };
      return updatedProduct;
    }
    return p;
  });
  await fs.writeFile(PRODUCTS_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  return updatedProduct;
}

// Orders
export async function getOrders() {
  await ensureDb();
  const data = await fs.readFile(ORDERS_FILE, 'utf-8');
  return JSON.parse(data);
}

export async function getOrderById(id) {
  const orders = await getOrders();
  return orders.find(o => o.orderId === id);
}

export async function createOrder(orderPayload) {
  const orders = await getOrders();
  const newOrder = {
    orderId: 'PKP-' + Math.floor(100000 + Math.random() * 900000),
    createdAt: new Date().toISOString(),
    status: 'Confirmed',
    ...orderPayload
  };
  orders.unshift(newOrder);
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
  return newOrder;
}

export async function updateOrderStatus(orderId, newStatus) {
  const orders = await getOrders();
  let updatedOrder = null;
  const updated = orders.map(o => {
    if (o.orderId === orderId) {
      updatedOrder = { ...o, status: newStatus };
      return updatedOrder;
    }
    return o;
  });
  await fs.writeFile(ORDERS_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  return updatedOrder;
}

export async function getCustomerOrders(phoneOrEmail) {
  const orders = await getOrders();
  const query = (phoneOrEmail || '').toString().toLowerCase().trim();
  if (!query) return [];

  return orders.filter(o => 
    (o.customer?.phone && o.customer.phone.toLowerCase().trim() === query) ||
    (o.customer?.email && o.customer.email.toLowerCase().trim() === query)
  );
}

// Customers
export async function getCustomers() {
  await ensureDb();
  const data = await fs.readFile(CUSTOMERS_FILE, 'utf-8');
  return JSON.parse(data);
}

export async function getCustomerById(id) {
  const customers = await getCustomers();
  return customers.find(c => c.id === id);
}

export async function getCustomerByPhoneOrEmail(identifier) {
  const customers = await getCustomers();
  const query = (identifier || '').toString().toLowerCase().trim();
  return customers.find(c => 
    (c.email && c.email.toLowerCase().trim() === query) ||
    (c.phone && c.phone.trim() === query)
  );
}

export async function createCustomer(customerPayload) {
  const customers = await getCustomers();
  const newCustomer = {
    id: 'CUST-' + Math.floor(100000 + Math.random() * 900000),
    createdAt: new Date().toISOString(),
    savedAddresses: [],
    ...customerPayload
  };
  customers.push(newCustomer);
  await fs.writeFile(CUSTOMERS_FILE, JSON.stringify(customers, null, 2), 'utf-8');
  return newCustomer;
}

export async function updateCustomer(id, updates) {
  const customers = await getCustomers();
  let updatedCustomer = null;
  const updated = customers.map(c => {
    if (c.id === id) {
      updatedCustomer = { ...c, ...updates };
      return updatedCustomer;
    }
    return c;
  });
  await fs.writeFile(CUSTOMERS_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  return updatedCustomer;
}

// Settings
export async function getSettings() {
  await ensureDb();
  const data = await fs.readFile(SETTINGS_FILE, 'utf-8');
  return JSON.parse(data);
}

export async function updateSettings(newSettings) {
  const current = await getSettings();
  const updated = { ...current, ...newSettings };
  await fs.writeFile(SETTINGS_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  return updated;
}
