# Al Rafa Roastery 🍫☕

> A full-stack web application for Al Rafa Roastery — Ras Al Khaimah's artisanal chocolatier and specialty coffee roastery.

![Tech Stack](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=flat-square&logo=react)
![Backend](https://img.shields.io/badge/Backend-ASP.NET%20Core-512BD4?style=flat-square&logo=dotnet)
![Database](https://img.shields.io/badge/Database-PostgreSQL-336791?style=flat-square&logo=postgresql)

---

## 🏗️ Project Structure

```
al-rafa-roastery/
├── frontend/          # React + Vite customer storefront
└── backend/           # ASP.NET Core 10 REST API
```

---

## ✨ Features

### Customer Storefront (`/`)
- Product browsing with category filters and search
- Quick View modal and Shopping Cart drawer
- WhatsApp order integration
- About and Contact sections
- Fully responsive design

### Admin Dashboard (`/admin`)
- Separate login & signup with JWT authentication
- Sidebar layout with Home, Products, and Profile tabs
- Full CRUD — add, edit, delete products live in PostgreSQL
- Dashboard overview with stats (total products, stock, categories, avg price)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router DOM |
| Backend | ASP.NET Core 10, Entity Framework Core |
| Database | PostgreSQL 18 |
| Auth | JWT Bearer tokens, BCrypt password hashing |
| Styling | Vanilla CSS with CSS variables |

---

## 🚀 Running Locally

### Prerequisites
- Node.js 18+
- .NET 10 SDK
- PostgreSQL 18 running on `localhost:5432`

### 1. Backend
```bash
cd backend
dotnet run --urls "http://localhost:5000"
```
The API auto-creates the database schema and seeds sample products on first run.

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
Opens at **http://localhost:5173**

---

## 🔑 Admin Access

| URL | Purpose |
|---|---|
| `/admin/signup` | Create your admin account |
| `/admin` | Admin login |
| `/admin/dashboard` | Protected product management dashboard |

---

## 📦 API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/products` | Public | List all products |
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
- Artisan hot-air roasted nuts
- Luxury dates & confections

📞 WhatsApp: [+971 56 221 1571](https://wa.me/971562211571)
