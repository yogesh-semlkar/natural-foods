# 🌿 Prakriti Pure - Natural Foods E-Commerce (Fullstack Next.js 14)

Namaste! Yeh website ab **Next.js 14 App Router** par based hai with **Real Server APIs, Centralized Database, Dedicated Founder Admin, and Full Customer Account Management (Sign In, My Orders, Address Book)**.

---

## 🚀 Local Run Kaise Karein

Terminal / PowerShell me run karein:
```bash
npm run dev
```
Browser me open karein:
- **Public Customer Storefront:** 👉 **[http://localhost:3000/](http://localhost:3000/)**
- **Customer My Account & Orders:** 👉 **[http://localhost:3000/account](http://localhost:3000/account)**
- **Protected Founder Admin Panel:** 👉 **[http://localhost:3000/admin](http://localhost:3000/admin)**

---

## 👤 Customer Accounts & Profile Features

Customer ke liye ab **complete account lifecycle** ready hai:

1. **1-Click Sign In / Register:**
   - Storefront ke top bar me **"👤 Sign In"** button par click karte hi modal popup open hota hai.
   - Customer apna Mobile Number / Email aur Password daal kar login ya new account create kar sakta hai.
2. **"My Orders" (Live Order Tracking):**
   - Customer apne [Account Page](/account) par jaakar apne saare purane orders dekh sakta hai.
   - Har order ka Order ID, items, delivery address, aur live status (*Confirmed, Packed, Shipped, Delivered*) live track hota hai.
   - Customer 1-click me apna **Tax Invoice / Bill print** kar sakta hai.
3. **Saved Delivery Address Book:**
   - Customer apne multiple delivery addresses (Home, Office) save kar sakta hai.
4. **Checkout Auto-Fill:**
   - Agar customer logged-in hai, toh checkout form me unka Naam, Mobile, Email, Address, aur Pincode **automatically pre-fill** ho jata hai!

---

## 🔒 Founder Admin Portal & Security

Admin panel storefront se **completely isolated** hai:

1. **Admin Route:** [`/admin`](http://localhost:3000/admin) (Automatically redirects to `/admin/login` if not authenticated).
2. **Default Admin Credentials:**
   - **Username / Email:** `admin@prakriti.com` (ya `admin`)
   - **Password:** `admin123`
3. **Security:**
   - Cryptographically signed HMAC tokens in `HttpOnly` session cookies.
   - Admin APIs (`GET /api/orders`, `PATCH /api/orders/[id]`, `POST /api/products`, `PATCH /api/products/[id]`, `POST /api/settings`) are **401 Protected**.

---

## 📡 Complete REST API Suite

| Category | Endpoint | Method | Security | Kaam |
| :--- | :--- | :--- | :--- | :--- |
| **Customer** | `/api/customer/auth/signup` | `POST` | Public | Naya customer account create karta hai |
| **Customer** | `/api/customer/auth/login` | `POST` | Public | Mobile/Email & password se customer login |
| **Customer** | `/api/customer/auth/logout` | `POST` | Public | Customer session clear karta hai |
| **Customer** | `/api/customer/me` | `GET/PATCH`| Customer | Customer profile & saved addresses |
| **Customer** | `/api/customer/orders` | `GET` | Customer | Customer ke purane orders fetch karta hai |
| **Orders** | `/api/orders` | `POST` | Public | Order validate karke server DB me create karta hai |
| **Orders** | `/api/orders` | `GET` | **Admin Only** | Admin ke liye saare orders fetch karta hai (401 Protected) |
| **Orders** | `/api/orders/[id]` | `PATCH` | **Admin Only** | Order fulfillment status update karta hai |
| **Products** | `/api/products` | `GET` | Public | Active products fetch karta hai |
| **Products** | `/api/products` | `POST` | **Admin Only** | Naya product DB me add karta hai |
| **Products** | `/api/products/[id]`| `PATCH` | **Admin Only** | Stock status ya price change karta hai |
| **Settings** | `/api/settings` | `GET/POST`| Protected | Store identity & shipping fees settings |
| **Admin Auth**| `/api/auth/login` | `POST` | Public | Founder admin login |
| **Admin Auth**| `/api/auth/logout` | `POST` | Public | Founder admin logout |
