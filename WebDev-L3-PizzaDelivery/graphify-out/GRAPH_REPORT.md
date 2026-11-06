# Graph Report - WebDev-L3-PizzaDelivery  (2026-11-06)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 406 nodes · 1132 edges · 17 communities (15 shown, 2 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 43 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4df04e4a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- App.jsx
- orderController.js
- client/package.json
- CustomerFavorites.jsx
- UserDashboard.jsx
- OrderInventoryContext.jsx
- userController.js
- server/package.json
- app.js
- server.js
- dependencies
- cronJobs.js
- nodemailer
- scripts
- jsonwebtoken
- server/vercel.json
- client/vercel.json

## God Nodes (most connected - your core abstractions)
1. `Button()` - 42 edges
2. `react` - 39 edges
3. `useCart()` - 33 edges
4. `lucide-react` - 28 edges
5. `motion` - 28 edges
6. `AppContent()` - 23 edges
7. `useAuth()` - 22 edges
8. `mongoose` - 15 edges
9. `SectionHeader()` - 14 edges
10. `UserDashboard()` - 14 edges

## Surprising Connections (you probably didn't know these)
- `App()` --calls--> `OrderInventoryProvider()`  [EXTRACTED]
  client/src/App.jsx → client/src/context/OrderInventoryContext.jsx
- `AppContent()` --calls--> `UserDashboard()`  [EXTRACTED]
  client/src/App.jsx → client/src/components/dashboard/UserDashboard.jsx
- `AppContent()` --calls--> `QuickViewModal()`  [EXTRACTED]
  client/src/App.jsx → client/src/components/modals/QuickViewModal.jsx
- `AppContent()` --calls--> `LandingPage()`  [EXTRACTED]
  client/src/App.jsx → client/src/pages/LandingPage.jsx
- `ActiveOrderTracker()` --calls--> `Button()`  [EXTRACTED]
  client/src/components/dashboard/UserDashboard.jsx → client/src/components/common/Button.jsx

## Import Cycles
- None detected.

## Communities (17 total, 2 thin omitted)

### Community 0 - "App.jsx"
Cohesion: 0.10
Nodes (57): App(), AppContent(), FloatingRouteSwitcher(), ScrollToTop(), Button(), Toast(), AdminDashboard(), CATEGORY_COLORS (+49 more)

### Community 1 - "orderController.js"
Cohesion: 0.06
Nodes (39): mongoose, CUSTOM_PIZZA_PRICING, INGREDIENT_CONSUMPTION, INGREDIENT_MAPPING, stripe, getAllInventory(), updateInventoryItem(), cancelMyOrder() (+31 more)

### Community 2 - "client/package.json"
Cohesion: 0.05
Nodes (49): dependencies, axios@^1.21.0, canvas-confetti@^1.9.4, firebase@^13.2.0, lucide-react@^1.65.0, motion@^14.9.0, react@^19.3.1, react-dom@^19.3.1 (+41 more)

### Community 3 - "CustomerFavorites.jsx"
Cohesion: 0.11
Nodes (27): VegBadge(), BasilIcon(), CheeseIcon(), MushroomIcon(), TomatoIcon(), RatingStars(), SectionHeader(), QuickViewModal() (+19 more)

### Community 4 - "UserDashboard.jsx"
Cohesion: 0.15
Nodes (22): ActiveOrderTracker(), ConnectingLine(), EmptyState(), formatCurrency(), formatDate(), minutesAgo(), ORDER_STAGES, OrderHistoryCard() (+14 more)

### Community 5 - "OrderInventoryContext.jsx"
Cohesion: 0.16
Nodes (19): backendStatusToUiStatus(), INITIAL_INVENTORY, loadFromStorage(), normalizeBackendOrder(), OrderInventoryContext, OrderInventoryProvider(), saveToStorage(), STORAGE_KEYS (+11 more)

### Community 6 - "userController.js"
Cohesion: 0.20
Nodes (15): bcryptjs, getTransporter(), transporter, forgotPassword(), generateToken(), getUserProfile(), googleAuth(), loginUser() (+7 more)

### Community 7 - "server/package.json"
Cohesion: 0.14
Nodes (16): jest, mongodb-memory-server, nodemon, description, devDependencies, jest@^30.5.2, mongodb-memory-server@^11.3.0, nodemon@^3.1.14 (+8 more)

### Community 8 - "app.js"
Cohesion: 0.22
Nodes (9): express, supertest, express@^5.3.0, allowedOrigins, app, handleStripeWebhook(), errorHandler(), notFound() (+1 more)

### Community 9 - "server.js"
Cohesion: 0.25
Nodes (8): dotenv, handler(), startServer(), connectDB(), verifyEmailConnection(), inventoryItems, obsoleteInventoryItems, seedInventory()

### Community 10 - "dependencies"
Cohesion: 0.17
Nodes (12): bcrypt, cors, razorpay, stripe, dependencies, bcrypt@^6.0.0, bcryptjs@^3.0.3, cors@^2.8.6 (+4 more)

### Community 11 - "cronJobs.js"
Cohesion: 0.50
Nodes (4): node-cron, node-cron@^4.6.0, startCronJobs(), sendLowStockAlerts()

### Community 12 - "nodemailer"
Cohesion: 0.50
Nodes (4): nodemailer, nodemailer@^10.3.1, createTransporter(), sendEmail()

### Community 13 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, dev, seed, start, test

### Community 14 - "jsonwebtoken"
Cohesion: 0.50
Nodes (3): jsonwebtoken, jsonwebtoken@^9.0.3, runVerification()

## Knowledge Gaps
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `App.jsx` to `client/package.json`, `CustomerFavorites.jsx`, `UserDashboard.jsx`, `OrderInventoryContext.jsx`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09683544303797469 - nodes in this community are weakly interconnected._
- **Why does `mongoose` connect `orderController.js` to `server.js`, `dependencies`, `userController.js`, `server/package.json`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Should `orderController.js` be split into smaller, more focused modules?**
  _Cohesion score 0.060153776571687016 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `App.jsx` to `client/package.json`, `CustomerFavorites.jsx`, `UserDashboard.jsx`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Should `client/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05185185185185185 - nodes in this community are weakly interconnected._
- **Should `CustomerFavorites.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11236802413273002 - nodes in this community are weakly interconnected._