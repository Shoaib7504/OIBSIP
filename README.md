# 🍕 PizzaCrave - Artisan Pizza Delivery & Inventory Management System

[![Live Demo](https://img.shields.io/badge/Live%20Demo-pizzacravehub.vercel.app-941508?style=for-the-badge&logo=vercel)](https://pizzacravehub.vercel.app)
[![API Server](https://img.shields.io/badge/API%20Server-pizzacraveserver.vercel.app-F49A13?style=for-the-badge&logo=express)](https://pizzacraveserver.vercel.app)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-339933?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)
[![Stripe](https://img.shields.io/badge/Payments-Stripe%20Checkout-635BFF?style=for-the-badge&logo=stripe)](https://stripe.com)

A modern, production-ready full-stack MERN (MongoDB, Express 5, React 19, Node.js) web application delivering an artisanal pizza ordering experience. Built with a warm, authentic pizzeria aesthetic, interactive custom pizza builder, secure Google & JWT authentication, seamless Stripe Checkout integration, real-time visual order tracking, and an administrative inventory control center with automated low-stock email alerts.

> **Project Location:** Source code is located in [`/WebDev-L3-PizzaDelivery`](./WebDev-L3-PizzaDelivery)

---

## 🌟 Project Overview

**PizzaCrave** bridges the gap between artisan culinary craft and modern web engineering. Designed with consumer delight and operational control in mind, the platform provides:
- **For Customers**: An immersive landing experience featuring an animated 3D rotating pizza splash screen, interactive custom pizza builder with live ingredient pricing, cart management, instant checkout via Stripe, and visual active order tracking with festive celebratory rewards.
- **For Kitchen & Administrators**: An administrative command center featuring live order stage transitions (Received → In Kitchen → Sent to Delivery → Delivered), dynamic stock level tracking, and automated inventory depletion & restoration.
- **For Reliability**: Automated background cron jobs monitoring low-stock items with Nodemailer transactional email dispatches, serverless-ready persistent MongoDB connection pooling, and idempotent Stripe webhook reconciliation.

---

## 🌐 Live Deployment Links

| Resource | URL | Status |
| :--- | :--- | :--- |
| **Frontend Web App** | [https://pizzacravehub.vercel.app](https://pizzacravehub.vercel.app) | 🟢 Live (Vercel) |
| **Backend REST API** | [https://pizzacraveserver.vercel.app](https://pizzacraveserver.vercel.app) | 🟢 Live (Vercel Serverless) |
| **API Health Check** | [https://pizzacraveserver.vercel.app/api/health](https://pizzacraveserver.vercel.app/api/health) | 🟢 Operational |

---

## ✨ Key Features

### 🛒 Customer Experience
- **Animated 3D Pizza Splash Screen**: 60 FPS continuous hardware-accelerated 3D rotating pizza, orbiting floating ingredients (pepperoni, basil, cheese, tomato), rising steam plumes, synchronized loading percentage bar, and seamless exit transition.
- **Artisan Pizza Catalog**: Browse curated chef specials and favorites with dietary badges, real-time stock counters, prices, and modal quick views.
- **Interactive Pizza Customizer**: Choose crusts, sauces, cheeses, and veggie/meat toppings with real-time price calculations and live visual feedback.
- **Cart & Smooth Checkout**: Sliding drawer cart, dynamic coupon codes, delivery fee calculations, and instant transition to Stripe Checkout.
- **Live Active Order Tracker**: Stepper-based real-time order progression (Order Received, In Kitchen, Sent to Delivery, Delivered) with celebratory canvas-confetti on delivery.
- **Google SSO & Profile Photo System**: Sign in with Email/Password or 1-click Google Sign-In. Automatic profile photo syncing, branded fallback avatars via `ui-avatars.com`, and photo uploads via Firebase Storage.

### 🛡️ Administrative Command Center (`/admin`)
- **Fulfillment Pipeline**: Transition orders across kitchen stages and mark orders complete.
- **Real-Time Inventory Management**: Monitor and update ingredient quantities; instant low-stock alerts when inventory dips below thresholds.
- **Order Management & Live Metrics**: View order histories, customer contact information, delivery destinations, and payment statuses.

### ⚙️ Automation & Reliability
- **Automated Cron Jobs (`node-cron`)**: Scheduled hourly background audits checking ingredient inventory levels.
- **Transactional Email Notifications (`nodemailer`)**: Automatic email alerts dispatched to store administrators when ingredients reach critical low-stock thresholds.
- **Stock Depletion & Safety Restoration**: Stock is safely reserved upon checkout. If a customer cancels an unpaid order, inventory is restored automatically.

---

## 💳 Stripe Integration & Why Stripe Over Razorpay

The platform uses **Stripe** (via Stripe Checkout and Stripe Webhooks) as its primary payment processor.

### 🔍 কেন Razorpay-এর পরিবর্তে Stripe বেছে নেওয়া হয়েছে? (Why Stripe Instead of Razorpay?)

| বিষয় (Criterion) | Stripe | Razorpay | PizzaCrave-এর সিদ্ধান্ত (Rationale) |
| :--- | :--- | :--- | :--- |
| **আন্তর্জাতিক প্রবেশাধিকার (Global Accessibility)** | বিশ্বব্যাপী ১৩৫+ দেশে ও মুদ্রায় (USD, EUR, GBP ইত্যাদি) সরাসরি কার্ড পেমেন্ট গ্রহণ করতে পারে। | মূলত ভারত (INR) ভিত্তিক লেনদেন এবং UPI/NetBanking-এর জন্য অপ্টিমাইজড। আন্তর্জাতিক পেমেন্ট সক্রিয় করার জন্য ভারতীয় ব্যাংক অ্যাকাউন্ট ও GSTIN প্রয়োজন। | PizzaCrave একটি আন্তর্জাতিক ও মাল্টি-কারেন্সি বান্ধব প্ল্যাটফর্ম হিসেবে ডিজাইন করা হয়েছে, যা Stripe দিয়ে অনায়াসে সম্ভব। |
| **নিরাপত্তা ও PCI-DSS কমপ্লায়েন্স (Security & Compliance)** | **PCI-DSS Level 1** কমপ্লায়েন্ট হোস্টেড Stripe Checkout সেশন। কার্ডের কোনো সংবেদনশীল তথ্য মার্চেন্ট সার্ভারে আসে না। | স্ট্যান্ডার্ড কার্ড ও পপআপ ইন্টারফেস প্রদান করে, তবে বৈশ্বিক আন্তর্জাতিক টেস্ট ও প্রোডাকশন কনফিগারেশন তুলনামূলক জটিল। | Stripe Checkout ক্লায়েন্ট-সাইড কোনো সংবেদনশীল ডেটা হ্যান্ডেল না করে শতভাগ নিরাপদ পেমেন্ট নিশ্চিত করে। |
| **সার্ভারলেস সামঞ্জস্য (Serverless Resilience)** | Stripe Checkout Session ক্লাউডে সেশন আইডি ধরে রাখে। Vercel Serverless আর্কিটেকচারে কানেকশন ড্রপ বা কোল্ড স্টার্ট হলেও সেশন স্টেট নিরাপদে থাকে। | ক্লায়েন্ট ড্রপ বা নেটওয়ার্ক ল্যাগ হলে স্টেট সিঙ্ক করতে অতিরিক্ত ট্র্যাকিং প্রয়োজন হয়। | Stripe সেশন আইডি দিয়ে যেকোনো সময় `/api/payments/session-status/:sessionId` থেকে নির্ভরযোগ্যভাবে পেমেন্ট কনফার্ম করা যায়। |
| **টেস্টিং ও স্যান্ডবক্স সুবিধা (Sandbox & Developer UX)** | তাৎক্ষণিক গ্লোবাল টেস্ট কার্ড (Visa, Mastercard, 3D Secure, Insufficient Funds, Decline) দিয়ে প্রতিটি দৃশ্যকল্প নিখুঁতভাবে টেস্ট করা যায়। | স্যান্ডবক্স টেস্টিং মূলত ভারতীয় ফোন নম্বর ও ডামি ওটিপি যাচাইকরণের উপর নির্ভরশীল। | Stripe-এর স্যান্ডবক্সে 23/23 টি অটোমেটেড ইন্টিগ্রেশন টেস্ট শতভাগ সফলভাবে চালানো সম্ভব হয়েছে। |
| **আইডেমপোটেন্ট ওয়েবহুক (Webhook Idempotency)** | ক্রিপ্টোগ্রাফিক সিগনেচার ভেরিফিকেশন (`stripe-signature`) এবং বিল্ট-ইন আইডেমপোটেন্সি। একই ওয়েবহুক ইভেন্ট বারবার এলেও ডুপ্লিকেট অর্ডার বা দ্বৈত চার্জ হয় না। | ওয়েবহুক সিগনেচার যাচাইয়ে অতিরিক্ত ম্যানুয়াল হ্যাশিং ও আলাদা স্টেট হ্যান্ডলিং প্রয়োজন। | পেমেন্ট নিরাপত্তা ও ডুপ্লিকেট পেমেন্ট প্রতিরোধে Stripe Webhooks অত্যন্ত নির্ভরযোগ্য। |

---

## 🛠️ Technologies Used

### Frontend (`client/`)
- **React 19** — Next-generation functional component architecture.
- **Vite 8** — Ultra-fast development server and optimized rollup bundling.
- **Tailwind CSS v4** — High-performance utility-first styling with custom artisan theme tokens.
- **Motion (`motion/react`)** — Fluid 60 FPS hardware-accelerated animations and spring physics.
- **TanStack React Query** — Caching, optimistic updates, and background data synchronization.
- **Firebase Authentication & Storage** — Google Sign-In and secure profile photo uploads.
- **Lucide React** — Crisp, lightweight vector iconography.
- **Canvas Confetti** — Delightful celebratory particle bursts upon order completion.

### Backend (`server/`)
- **Node.js** & **Express 5** — Modern, modular RESTful API architecture.
- **MongoDB & Mongoose 8** — Schema-validated document persistence with singleton serverless connection caching.
- **Stripe SDK** — Hosted checkout sessions, status polling, and cryptographic webhook verification.
- **JSON Web Tokens (JWT) & bcryptjs** — Secure stateless token authentication and salted password hashing.
- **Nodemailer & node-cron** — Scheduled background audits and transactional email dispatches.
- **Supertest & Jest** — Comprehensive test suites for API endpoints and payment workflows.

---

## 📸 Screenshots

| 🍕 Animated 3D Splash Screen | 🍕 Artisan Menu & Deals |
| :---: | :---: |
| *Continuous 60 FPS rotating 3D pizza, orbiting ingredients, and loading percentage.* | *Curated pizzas with dietary badges, prices, and quick customization.* |
| **🛠️ Custom Pizza Builder** | **📦 Real-Time Order Tracker** |
| *Interactive crust, sauce, and topping selector with dynamic pricing.* | *Live status stepper (Received → Kitchen → Delivery → Completed).* |
| **💳 Seamless Stripe Checkout** | **🛡️ Admin Inventory & Orders** |
| *PCI-compliant global card checkout with instant return status.* | *Kitchen pipeline controls, stock adjustments, and low-stock alerts.* |

---

## 🚀 Installation & Local Setup

### Prerequisites
- **Node.js** v18 or higher ([Download](https://nodejs.org))
- **MongoDB** (Local instance or free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)
- **Stripe Account** (Free test API keys from [Stripe Dashboard](https://dashboard.stripe.com/register))
- **Firebase Project** (Optional for Google Auth / Storage)

---

### 1. Clone the Repository
```bash
git clone https://github.com/Shoaib7504/OIBSIP.git
cd OIBSIP/WebDev-L3-PizzaDelivery
```

---

### 2. Backend Setup (`/server`)

```bash
cd server
npm install
```

Create a `.env` file inside the `server/` directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Database Connection
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/pizzacrave?retryWrites=true&w=majority

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Stripe Payment Gateway
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret_here

# Email Service (Nodemailer / SMTP for Low Stock Alerts)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password

# Client URL (For CORS & Redirects)
CLIENT_URL=http://localhost:5173
```

Seed initial pizza menu and inventory data:
```bash
npm run seed
```

Start the backend server:
```bash
npm run dev
```
*(Server runs on `http://localhost:5000`)*

---

### 3. Frontend Setup (`/client`)

Open a new terminal window:
```bash
cd client
npm install
```

Create a `.env` file inside the `client/` directory:
```env
# Backend API Base URLs
VITE_API_URL=http://localhost:5000
VITE_SERVER_URL=http://localhost:5000

# Firebase Configuration (Google Auth & Storage)
VITE_FIREBASE_API_KEY=AIzaSy...your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=776245041410
VITE_FIREBASE_APP_ID=1:776245041410:web:342da436f2c005a3ca0a1b
VITE_FIREBASE_MEASUREMENT_ID=G-2PYWZTE565
```

Start the Vite development server:
```bash
npm run dev
```
*(Frontend runs on `http://localhost:5173`)*

---

## 🔐 Environment Variables Reference

### Backend (`server/.env`)
| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `PORT` | Local server port | `5000` |
| `NODE_ENV` | Environment mode | `development` / `production` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `your_secret_key` |
| `JWT_EXPIRES_IN` | Token expiration lifespan | `7d` |
| `STRIPE_SECRET_KEY` | Stripe secret test/live API key | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET`| Stripe webhook signing secret | `whsec_...` |
| `SMTP_HOST` | SMTP server host | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP port | `587` |
| `SMTP_USER` | Email username for alerts | `admin@pizzacrave.com` |
| `SMTP_PASS` | Email app-specific password | `xxxx xxxx xxxx xxxx` |
| `CLIENT_URL` | Frontend origin for CORS | `http://localhost:5173` |

### Frontend (`client/.env`)
| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `VITE_API_URL` | Backend API root endpoint | `http://localhost:5000` (Dev) / `https://pizzacraveserver.vercel.app` (Prod) |
| `VITE_SERVER_URL` | Server base address | `http://localhost:5000` |
| `VITE_FIREBASE_API_KEY` | Firebase Web API Key | `AIzaSy...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | `pizzacrave-b9765.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID | `pizzacrave-b9765` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket | `pizzacrave-b9765.firebasestorage.app` |

---

## 📑 Backend REST API Documentation

Base URL: `https://pizzacraveserver.vercel.app/api` (Production) or `http://localhost:5000/api` (Local)

### 1. Health Check
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Server and database connection status | Public |

### 2. User & Authentication Endpoints (`/api/users`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/users/register` | Register new user with email & password | Public |
| `POST` | `/users/login` | Authenticate user & return JWT token | Public |
| `POST` | `/users/google-auth` | Authenticate / sync Google OAuth Firebase profile | Public |
| `GET` | `/users/verify-email` | Verify email address via signed token | Public |
| `POST` | `/users/resend-verification` | Resend verification email | Public |
| `POST` | `/users/forgot-password` | Request password reset email | Public |
| `POST` | `/users/reset-password` | Reset password using reset token | Public |
| `GET` | `/users/profile` | Get current authenticated user details | Private |
| `PATCH` | `/users/profile` | Update profile (name, phone, address, photoURL) | Private (Self-only) |

### 3. Pizza Menu Endpoints (`/api/pizzas`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/pizzas` | Get all available pizzas | Public |
| `GET` | `/pizzas/:id` | Get single pizza details by ID | Public |
| `POST` | `/pizzas` | Create a new pizza | Admin Only |
| `PUT` | `/pizzas/:id` | Update pizza recipe, pricing, or stock | Admin Only |
| `DELETE` | `/pizzas/:id` | Delete a pizza item | Admin Only |

### 4. Order Management Endpoints (`/api/orders`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/orders` | Create a new pizza order (reserves inventory) | Private |
| `GET` | `/orders/my-orders` | Get order history for the logged-in customer | Private |
| `GET` | `/orders/:id` | Get details of a specific order | Private |
| `GET` | `/orders` | Get all customer orders across the platform | Admin Only |
| `PATCH` | `/orders/:id/status` | Advance fulfillment stage (`received`, `kitchen`, etc.) | Admin Only |
| `PATCH` | `/orders/:id/cancel` | Cancel an unpaid order (restores inventory) | Private / Admin |

### 5. Inventory Management Endpoints (`/api/inventory`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/inventory` | Get all ingredient inventory stock levels | Admin Only |
| `PATCH` | `/inventory/:id` | Update ingredient quantity or threshold | Admin Only |

### 6. Payment & Checkout Endpoints (`/api/payments`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/payments/create-checkout-session/:orderId` | Create Stripe Checkout session for an order | Private |
| `GET` | `/payments/session-status/:sessionId` | Check payment status & confirm order completion | Optional Auth / Public |
| `POST` | `/stripe-webhook` | Process Stripe webhook events (`checkout.session.completed`) | Stripe Server Only |

---

## 🧪 Testing Suite

PizzaCrave features automated test coverage for payment flows and serverless safety:

```bash
cd WebDev-L3-PizzaDelivery/server
node test-stripe-integration.js
```

**Results:**
- ✅ **Order Schema Integrity**: Validates `Stripe` payment method, `USD` currency, and `stripeCheckoutSessionId`.
- ✅ **Payment Security**: Strict rejection of unauthorized paymentStatus tampering.
- ✅ **Webhook Idempotency**: Duplicate webhook signals handled safely without double-crediting.
- ✅ **Amount & Currency Tamper Proofing**: Rejects mismatches in session amounts or currency.
- ✅ **Cancellation & Stock Restoration**: Unpaid order cancellations automatically replenish deducted ingredients.
- ✅ **23/23 Tests Passed (100%)**.

---

## 👥 Contributors & Acknowledgements

- **Developer**: [Shoaib](https://github.com/Shoaib7504)
- **Organization**: OASIS INFOBYTE (OIBSIP) Web Development Internship — Level 3 Task
- **Design Inspiration**: Italian Artisan Wood-Fired Pizzerias

