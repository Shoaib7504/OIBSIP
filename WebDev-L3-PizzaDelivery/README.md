# 🍕 PizzaDelivery - Full-Stack MERN Pizza Ordering & Inventory System

A feature-rich, full-stack MERN (MongoDB, Express, React, Node.js) pizza delivery web application. Built with modern UI design principles (React 19, Tailwind CSS v4, Motion), robust JWT & Firebase authentication, secure Stripe and Razorpay payment integrations, automated inventory management with cron jobs, and real-time order tracking.

---

## 🌟 Project Overview

**WebDev-L3-PizzaDelivery** is engineered for seamless user ordering experiences and comprehensive administrative control. Users can browse artisanal pizza menus, customize their own pizzas with dynamic ingredient pricing, securely check out via Stripe or Razorpay, and track their active orders in real time. Administrators have access to a dedicated dashboard to manage inventory, track low-stock warnings, update order fulfillment stages, and monitor overall business metrics.

---

## ✨ Features

### 🛒 Customer Experience
- **Interactive Pizza Menu & Custom Builder:** Browse curated favorites or build custom pizzas with selectable crusts, sauces, cheeses, and toppings with real-time dynamic pricing.
- **Cart & Secure Checkout:** Full cart management with instant pricing calculation, coupon support, and multi-gateway checkout (Stripe & Razorpay).
- **Active Order Tracker & History:** Real-time visual order tracking through prep, baking, out-for-delivery, and delivered stages, complete with confetti celebrations on completion.
- **User Profiles & Google Authentication:** Integrated Firebase & Google login, profile photo management (Google sync, direct upload, and branded avatar fallbacks).
- **Customer Favorites:** Save favorite pizzas for lightning-fast re-ordering.

### 🛡️ Administrative Control (`/admin`)
- **Admin Dashboard:** Overview of orders, revenue, and fulfillment queues.
- **Inventory & Stock Management:** Real-time tracking of ingredient stock levels with automated low-stock warnings.
- **Order Stage Management:** Update order statuses seamlessly as they move through the kitchen pipeline.

### ⚙️ Backend & Automation
- **Automated Cron Jobs:** Scheduled background tasks (`node-cron`) for low-stock inventory alerts.
- **Email Notifications:** Transactional emails powered by `nodemailer` for order confirmations and alerts.
- **Testing Suite:** Comprehensive unit and integration test suites using Jest, Supertest, and MongoDB Memory Server.

---

## 🛠️ Technologies Used

### Frontend (`client/`)
- **React 19** & **Vite** — High-performance UI rendering and rapid bundling.
- **Tailwind CSS v4** — Modern utility-first styling.
- **TanStack React Query** — Efficient server state synchronization and caching.
- **Motion (Framer Motion)** — Fluid animations and micro-interactions.
- **Lucide React** — Clean, scalable vector iconography.
- **Firebase** — Client authentication & Google SSO.
- **Canvas Confetti** — Delightful celebratory UI effects.

### Backend (`server/`)
- **Node.js** & **Express 5** — Robust, lightweight REST API architecture.
- **MongoDB & Mongoose** — Flexible NoSQL data modeling with schema validation.
- **JSON Web Tokens (JWT) & bcrypt** — Secure password hashing and stateless authentication.
- **Stripe & Razorpay** — Industry-standard payment gateway integrations.
- **Nodemailer & Node-Cron** — Automated email dispatchers and scheduled cron jobs.
- **Jest & Supertest** — Automated testing pipeline.

---

## 📸 Screenshots

| Landing Page & Menu | Custom Pizza Builder |
| :---: | :---: |
| *Browse curated pizzas with dietary tags, ratings, and quick-view modals.* | *Select custom crusts, sauces, and toppings with dynamic price calculation.* |
| **User Active Order Tracker** | **Admin Inventory Dashboard** |
| *Track real-time order progression from kitchen to doorstep.* | *Monitor stock levels, ingredient consumption, and low-stock alerts.* |

---

## 🌐 Live Demo URL

> **[https://pizza-delivery-demo.example.com](https://pizza-delivery-demo.example.com)** *(Placeholder)*

---

## 🚀 Installation & Setup Instructions

### Prerequisites
- **Node.js** (v18+ recommended)
- **MongoDB** (Local instance or MongoDB Atlas URI)
- **Stripe & Razorpay** account keys (optional for test mode)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/WebDev-L3-PizzaDelivery.git
cd WebDev-L3-PizzaDelivery
```

### 2. Server Setup (`/server`)
```bash
cd server
npm install
```
Create a `.env` file in the `server/` directory based on `.env.example` (see below).

Run database seeder (optional):
```bash
npm run seed
```

Start the development server:
```bash
npm run dev
```
*(Server runs on `http://localhost:5000`)*

### 3. Client Setup (`/client`)
Open a new terminal window:
```bash
cd client
npm install
```
Create a `.env` file in the `client/` directory based on `.env.example` (see below).

Start the Vite development server:
```bash
npm run dev
```
*(Client runs on `http://localhost:5173`)*

---

## 🔐 Environment Variable Examples

### Server Environment (`server/.env`)
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/pizzadb?retryWrites=true&w=majority

# Authentication Secret
JWT_SECRET=your_super_secret_jwt_key_here

# Payment Gateway (Stripe)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret_here

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID=rzp_test_your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Email Service (Nodemailer / SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-email-app-password
```

### Client Environment (`client/.env`)
```env
# API Base URL
VITE_API_URL=http://localhost:5000

# Firebase Configuration (Optional for Google Auth)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## 📑 API Documentation

Base URL: `http://localhost:5000/api`

### 1. Authentication Endpoints (`/api/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | Register a new user account | Public |
| `POST` | `/login` | Authenticate user & return JWT token | Public |
| `POST` | `/google-auth` | Sync Google Firebase user with backend | Public |
| `GET` | `/profile` | Retrieve authenticated user profile | Private |
| `PUT` | `/profile` | Update profile details / avatar | Private |

### 2. Menu & Pizzas (`/api/pizzas`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Get all available menu items | Public |
| `GET` | `/:id` | Get single pizza details by ID | Public |
| `POST` | `/` | Create a new menu item | Admin |
| `PUT` | `/:id` | Update menu item | Admin |
| `DELETE` | `/:id` | Remove menu item | Admin |

### 3. Orders (`/api/orders`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/` | Place a new pizza order | Private |
| `GET` | `/my-orders` | Get order history for logged-in user | Private |
| `GET` | `/:id` | Get order details by ID | Private |
| `GET` | `/admin/all` | Get all system orders | Admin |
| `PUT` | `/:id/status` | Update order fulfillment stage | Admin |
| `DELETE` | `/:id/cancel` | Cancel an active order | Private/Admin |

### 4. Inventory (`/api/inventory`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Get current ingredient stock levels | Admin |
| `PUT` | `/:id` | Update ingredient stock quantity | Admin |
| `GET` | `/low-stock` | Get list of low-stock ingredients | Admin |

### 5. Payments (`/api/payments`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/create-stripe-intent` | Initialize Stripe payment intent | Private |
| `POST` | `/razorpay-order` | Create Razorpay order | Private |
| `POST` | `/webhook` | Stripe webhook event listener | Public |

---

## 🤖 Attribution
🤖 Generated with [Claude Code](https://claude.com/claude-code)
