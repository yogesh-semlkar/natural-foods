/**
 * Founder Admin Panel
 * Easy, non-technical dashboard to manage catalog, orders, and store settings
 */

function renderAdminProducts() {
  const container = document.getElementById('admin-products-table-body');
  if (!container) return;

  const products = window.appStore.products;
  container.innerHTML = products.map(p => {
    const mainVariant = p.variants[0];
    return `
      <tr>
        <td>
          <div style="display:flex; align-items:center; gap:10px;">
            <img src="${p.image}" style="width:40px; height:40px; border-radius:6px; object-fit:cover;" alt="">
            <div>
              <strong>${p.name}</strong><br>
              <small style="color:var(--text-muted);">${p.category.toUpperCase()} • ${p.variants.length} Variants</small>
            </div>
          </div>
        </td>
        <td>
          <strong>₹${mainVariant.price}</strong> 
          <small style="color:var(--text-muted);">(${mainVariant.weight})</small>
        </td>
        <td>
          <button class="badge-pill ${p.inStock ? 'badge-organic' : 'badge-discount'}" 
                  style="cursor:pointer;" 
                  onclick="toggleStockStatus('${p.id}')">
            ${p.inStock ? '● In Stock' : '✕ Out of Stock'}
          </button>
        </td>
        <td>
          <button style="color:var(--primary-700); font-weight:700; font-size:0.8rem; margin-right:8px;" 
                  onclick="promptEditPrice('${p.id}')">
            ✏️ Edit Price
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function renderAdminOrders() {
  const container = document.getElementById('admin-orders-table-body');
  if (!container) return;

  const orders = window.appStore.orders;
  if (orders.length === 0) {
    container.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center; padding:30px; color:var(--text-muted);">
          Abhi tak koi orders nahi aaye hain. Jaise hi customers order karenge, yahan live show honge!
        </td>
      </tr>
    `;
    return;
  }

  container.innerHTML = orders.map(o => {
    const dateFormatted = new Date(o.createdAt).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    });
    return `
      <tr>
        <td><strong>#${o.orderId}</strong><br><small style="color:var(--text-muted);">${dateFormatted}</small></td>
        <td>
          <strong>${o.customer.fullName}</strong><br>
          <small>${o.customer.phone}</small><br>
          <small style="color:var(--text-muted);">${o.customer.city}, ${o.customer.pincode}</small>
        </td>
        <td>
          <div style="font-size:0.8rem;">
            ${o.items.map(i => `${i.name} (${i.weight}) x${i.quantity}`).join('<br>')}
          </div>
        </td>
        <td><strong>₹${o.totals.total}</strong><br><small style="color:var(--badge-green); font-weight:700;">${o.paymentMethod}</small></td>
        <td>
          <select style="padding:4px 8px; border-radius:6px; font-size:0.8rem; border:1px solid var(--surface-border);" 
                  onchange="updateOrderStatus('${o.orderId}', this.value)">
            <option value="Confirmed" ${o.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
            <option value="Packed" ${o.status === 'Packed' ? 'selected' : ''}>Packed</option>
            <option value="Shipped" ${o.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
            <option value="Delivered" ${o.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
          </select>
        </td>
        <td>
          <button style="background:var(--primary-50); border:1px solid var(--primary-100); color:var(--primary-800); padding:4px 8px; border-radius:4px; font-size:0.75rem; font-weight:700;"
                  onclick="viewReceiptModal('${o.orderId}')">
            View Bill
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function updateOrderStatus(orderId, status) {
  window.appStore.updateOrderStatus(orderId, status);
  showToast(`Order #${orderId} status updated to ${status}`);
}

function toggleStockStatus(productId) {
  window.appStore.toggleStock(productId);
  renderAdminProducts();
  showToast("Product stock status updated!");
}

function promptEditPrice(productId) {
  const product = window.appStore.getProduct(productId);
  if (!product) return;
  const currentPrice = product.variants[0].price;
  const newPrice = prompt(`Enter new price for ${product.name} (${product.variants[0].weight}):`, currentPrice);
  if (newPrice && !isNaN(newPrice) && Number(newPrice) > 0) {
    window.appStore.updatePrice(productId, 0, Number(newPrice));
    renderAdminProducts();
    showToast(`Updated price for ${product.name} to ₹${newPrice}`);
  }
}

// Export Orders to CSV for Logistics / Shipping Labels
function exportOrdersToCSV() {
  const orders = window.appStore.orders;
  if (orders.length === 0) {
    alert("Export karne ke liye koi orders nahi hain!");
    return;
  }

  const headers = ["Order ID", "Date", "Customer Name", "Phone", "Email", "Address", "City", "State", "Pincode", "Items", "Total Amount", "Payment Method", "Status"];
  
  const rows = orders.map(o => [
    o.orderId,
    new Date(o.createdAt).toLocaleString(),
    `"${o.customer.fullName}"`,
    `"${o.customer.phone}"`,
    `"${o.customer.email}"`,
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
  showToast("Orders CSV file downloaded successfully!");
}

// Save Store Settings
function saveStoreSettingsFromForm(e) {
  if (e) e.preventDefault();
  const storeName = document.getElementById('setting-store-name').value.trim();
  const phone = document.getElementById('setting-phone').value.trim();
  const whatsapp = document.getElementById('setting-whatsapp').value.trim();
  const freeShipping = Number(document.getElementById('setting-free-shipping').value);

  window.appStore.saveSettings({
    storeName: storeName || "Prakriti Pure",
    phone: phone,
    whatsapp: whatsapp,
    freeShippingThreshold: freeShipping || 799
  });

  // Update visible store brand names on page
  document.querySelectorAll('.store-brand-name').forEach(el => el.textContent = storeName);
  showToast("Store settings saved successfully!");
}
