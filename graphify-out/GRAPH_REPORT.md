# Graph Report - OIBSIP  (2026-11-07)

## Corpus Check
- 103 files · ~1,066,683 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 3, .css 2)

## Summary
- 449 nodes · 1221 edges · 13 communities (11 shown, 2 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 48 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9f08c5c6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- app.js
- react
- client/package.json
- userController.js
- server/package.json
- App.jsx
- OrderInventoryContext.jsx
- UserDashboard.jsx
- 🍕 PizzaDelivery - Full-Stack MERN Pizza Ordering & Inventory System
- PizzaCustomizerSection.jsx
- React + Vite
- server/vercel.json
- client/vercel.json

## God Nodes (most connected - your core abstractions)
1. `react` - 44 edges
2. `Button()` - 42 edges
3. `useCart()` - 33 edges
4. `motion` - 33 edges
5. `lucide-react` - 29 edges
6. `AppContent()` - 24 edges
7. `useAuth()` - 24 edges
8. `mongoose` - 15 edges
9. `SectionHeader()` - 14 edges
10. `OrderInventoryProvider()` - 14 edges

## Surprising Connections (you probably didn't know these)
- `FloatingIngredients()` --indirect_call--> `BasilIcon()`  [INFERRED]
  WebDev-L3-PizzaDelivery/client/src/components/common/SplashScreen/FloatingIngredients.jsx → WebDev-L3-PizzaDelivery/client/src/components/common/IngredientIcons.jsx
- `FloatingIngredients()` --indirect_call--> `CheeseIcon()`  [INFERRED]
  WebDev-L3-PizzaDelivery/client/src/components/common/SplashScreen/FloatingIngredients.jsx → WebDev-L3-PizzaDelivery/client/src/components/common/IngredientIcons.jsx
- `FloatingIngredients()` --indirect_call--> `ChiliIcon()`  [INFERRED]
  WebDev-L3-PizzaDelivery/client/src/components/common/SplashScreen/FloatingIngredients.jsx → WebDev-L3-PizzaDelivery/client/src/components/common/IngredientIcons.jsx
- `FloatingIngredients()` --indirect_call--> `PepperoniIcon()`  [INFERRED]
  WebDev-L3-PizzaDelivery/client/src/components/common/SplashScreen/FloatingIngredients.jsx → WebDev-L3-PizzaDelivery/client/src/components/common/IngredientIcons.jsx
- `FloatingIngredients()` --indirect_call--> `TomatoIcon()`  [INFERRED]
  WebDev-L3-PizzaDelivery/client/src/components/common/SplashScreen/FloatingIngredients.jsx → WebDev-L3-PizzaDelivery/client/src/components/common/IngredientIcons.jsx

## Import Cycles
- None detected.

## Communities (13 total, 2 thin omitted)

### Community 0 - "app.js"
Cohesion: 0.06
Nodes (40): dotenv, mongoose, supertest, handler(), dotenv@^18.0.9, startServer(), allowedOrigins, app (+32 more)

### Community 1 - "react"
Cohesion: 0.11
Nodes (37): canvas-confetti, lucide-react, motion, react, react-hook-form, react-router-dom, VegBadge(), Button() (+29 more)

### Community 2 - "client/package.json"
Cohesion: 0.05
Nodes (49): axios, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, firebase, globals, react-dom (+41 more)

### Community 3 - "userController.js"
Cohesion: 0.09
Nodes (34): bcryptjs, express, express@^5.3.0, getTransporter(), transporter, getAllInventory(), updateInventoryItem(), getSessionStatus() (+26 more)

### Community 4 - "server/package.json"
Cohesion: 0.06
Nodes (41): bcrypt, cors, jest, jsonwebtoken, mongodb-memory-server, node-cron, nodemailer, nodemon (+33 more)

### Community 5 - "App.jsx"
Cohesion: 0.12
Nodes (34): App(), AppContent(), FloatingRouteSwitcher(), ScrollToTop(), Toast(), CartDrawer(), FacebookIcon(), Footer() (+26 more)

### Community 6 - "OrderInventoryContext.jsx"
Cohesion: 0.11
Nodes (24): AdminDashboard(), CATEGORY_COLORS, minutesAgo(), STATUS_CONFIG, backendStatusToUiStatus(), INITIAL_INVENTORY, loadFromStorage(), normalizeBackendOrder() (+16 more)

### Community 7 - "UserDashboard.jsx"
Cohesion: 0.13
Nodes (24): ActiveOrderTracker(), ConnectingLine(), EmptyState(), formatCurrency(), formatDate(), minutesAgo(), ORDER_STAGES, OrderHistoryCard() (+16 more)

### Community 8 - "🍕 PizzaDelivery - Full-Stack MERN Pizza Ordering & Inventory System"
Cohesion: 0.07
Nodes (26): 1. Authentication Endpoints (`/api/auth`), 1. Clone the Repository, 2. Menu & Pizzas (`/api/pizzas`), 2. Server Setup (`/server`), 3. Client Setup (`/client`), 3. Orders (`/api/orders`), 4. Inventory (`/api/inventory`), 5. Payments (`/api/payments`) (+18 more)

### Community 9 - "PizzaCustomizerSection.jsx"
Cohesion: 0.28
Nodes (13): BasilIcon(), CheeseIcon(), ChiliIcon(), MushroomIcon(), PepperoniIcon(), TomatoIcon(), FloatingIngredients(), ProgressBar() (+5 more)

### Community 10 - "React + Vite"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + Vite

## Knowledge Gaps
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `client/package.json`, `App.jsx`, `OrderInventoryContext.jsx`, `UserDashboard.jsx`, `PizzaCustomizerSection.jsx`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **Should `app.js` be split into smaller, more focused modules?**
  _Cohesion score 0.05664568678267309 - nodes in this community are weakly interconnected._
- **Why does `mongoose` connect `app.js` to `userController.js`, `server/package.json`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.11225266362252663 - nodes in this community are weakly interconnected._
- **Why does `motion` connect `react` to `PizzaCustomizerSection.jsx`, `client/package.json`, `OrderInventoryContext.jsx`, `UserDashboard.jsx`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Should `client/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05185185185185185 - nodes in this community are weakly interconnected._
- **Should `userController.js` be split into smaller, more focused modules?**
  _Cohesion score 0.08776595744680851 - nodes in this community are weakly interconnected._