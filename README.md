# Al Rafa Roastery 🍫☕

> A full-stack web application for Al Rafa Roastery — Ras Al Khaimah's artisanal chocolatier and specialty coffee roastery.

![Tech Stack](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=flat-square&logo=react)
![Backend](https://img.shields.io/badge/Backend-ASP.NET%20Core-512BD4?style=flat-square&logo=dotnet)
![Database](https://img.shields.io/badge/Database-PostgreSQL-336791?style=flat-square&logo=postgresql)

---

## 🏗️ Project Architecture

The application is split into two independent React applications and one shared ASP.NET Core REST API:

```
al-rafa-roastery/
├── frontend/          # Customer Storefront (Vercel Project 1: port 5173)
├── frontend-admin/    # Admin Management Portal (Vercel Project 2: port 5174)
└── backend/           # ASP.NET Core 10 REST API (Render / Docker)
```

---

## ✨ Features

### 🛍️ Customer Storefront (`frontend`)
- Product browsing with category filters, live search, and sorting
- Quick View modal and Shopping Cart drawer
- WhatsApp direct order integration
- Brand story (Our Story) & Location (Ras Al Khaimah, UAE)
- Mobile-first responsive layout with luxury dark & gold aesthetics

### 🔐 Admin Portal (`frontend-admin`)
- Independent admin web application deployable to its own Vercel domain
- JWT authentication with secure login and registration
- Protected dashboard (`/dashboard`) with Home, Products, and Profile tabs
- Real-time catalog CRUD (Create, Read, Update, Delete products live in PostgreSQL)
- Stock availability toggle and image URL preview
- Direct link to customer storefront

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Customer Frontend | React 19, Vite, Lucide Icons (Port 5173) |
| Admin Frontend | React 19, Vite, Lucide Icons (Port 5174) |
| Backend | ASP.NET Core 10, Entity Framework Core 9 |
| Database | PostgreSQL |
| Auth | JWT Bearer tokens, BCrypt password hashing |
| Styling | Vanilla CSS with luxury gold & dark roast tokens |

---

## 🚀 Running Locally

### Prerequisites
- Node.js 18+
- .NET 10 SDK
- PostgreSQL running locally or remote on Render / Supabase

### 1. Backend
```bash
cd backend
dotnet run --urls "http://localhost:5000"
```
The API is available at `http://localhost:5000` (Swagger UI at `/swagger`).

### 2. Customer Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs at **http://localhost:5173**

### 3. Admin Frontend
```bash
cd frontend-admin
npm install
npm run dev
```
Runs at **http://localhost:5174**

---

## ☁️ Deploying to Vercel (Two Independent Apps)

You can deploy both frontend applications from the same GitHub repository by creating two projects in Vercel:

### Project 1: Customer Storefront
1. In Vercel, click **Add New...** → **Project** and select this repository.
2. Under **Root Directory**, click **Edit** and choose `frontend`.
3. In **Environment Variables**, optionally set:
   - `VITE_API_URL`: `https://alrafaroastery.onrender.com/api` (defaults to production backend)
4. Click **Deploy**.

### Project 2: Admin Portal
1. In Vercel, click **Add New...** → **Project** and select this repository again.
2. Under **Project Name**, enter something like `al-rafa-roastery-admin`.
3. Under **Root Directory**, click **Edit** and choose `frontend-admin`.
4. In **Environment Variables**, configure:
   - `VITE_API_URL`: `https://alrafaroastery.onrender.com/api`
   - `VITE_STORE_URL`: Your customer storefront Vercel URL (e.g. `https://al-rafa-roastery-afhyb7jjp-sufiya3.vercel.app`)
5. Click **Deploy**.

*Note: Both `frontend/` and `frontend-admin/` include `vercel.json` with SPA routing rules to prevent 404 errors on browser page reloads.*

---

## 📦 API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/products` | Public | List all products |
| GET | `/api/products/{id}` | Public | Get single product |
| POST | `/api/products` | 🔒 JWT | Add a product |
| PUT | `/api/products/{id}` | 🔒 JWT | Update a product |
| DELETE | `/api/products/{id}` | 🔒 JWT | Delete a product |
| POST | `/api/auth/signup` | Public | Register admin |
| POST | `/api/auth/login` | Public | Login, receive JWT |

---

## 📍 About Al Rafa Roastery
Located in **Ras Al Khaimah, UAE** — specializing in:
- 100% Arabica specialty coffee (fresh daily roasting)
- Belgian-style handmade chocolates
- Artisan hot-air roasted nuts & luxury dates

📞 WhatsApp: [+971 56 221 1571](https://wa.me/971562211571)
