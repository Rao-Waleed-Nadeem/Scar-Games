# Game Store (DB-Project-Game-Store)

This repository contains a small full-stack game store:

- **Backend**: Express + SQL Server (mssql)
- **Frontend**: React + Vite + Redux Toolkit

---

## Top-level structure

```
DB-Project-Game-Store/
  Backend/
    src/
      server.js
      routes/
      controllers/
      models/
      middlewares/
      utils/
    database/
      schema.sql
      seed.sql
      setup-db.js
    docker-compose.yml
  Frontend/
    src/
      pages/
      routes/
      components/
      *.store/ (Redux slices + thunks)
      utils/
  README.md
```

---

## Backend

### Entry point

- **`Backend/src/server.js`**
  - Creates the Express app, configures CORS + JSON parsing, connects to SQL Server, and mounts API routes.
  - API base path used by the frontend: `http://localhost:8000/api/v1`.

### Routing

- **`Backend/src/routes/`** defines the URL structure and maps endpoints to controller functions.

Routes by feature:

- **`Backend/src/routes/userRoutes.js`**
  - `POST /api/v1/users/signup`
  - `POST /api/v1/users/login`
  - `POST /api/v1/users/logout`
  - `GET  /api/v1/users/current`

- **`Backend/src/routes/gameRoutes.js`**
  - `GET    /api/v1/games`
  - `GET    /api/v1/games/:id`
  - `POST   /api/v1/games`
  - `PUT    /api/v1/games` (expects full game payload in body)
  - `DELETE /api/v1/games/:id`

- **`Backend/src/routes/inventoryRoutes.js`**
  - `POST   /api/v1/inventory`
  - `GET    /api/v1/inventory`
  - `GET    /api/v1/inventory/:game_id`
  - `PUT    /api/v1/inventory/:game_id`
  - `DELETE /api/v1/inventory/:game_id`

- **`Backend/src/routes/orderRoutes.js`**
  - `POST   /api/v1/orders`
  - `GET    /api/v1/orders`
  - `GET    /api/v1/orders/user/:id`
  - `GET    /api/v1/orders/:id`
  - `PUT    /api/v1/orders/:id`
  - `DELETE /api/v1/orders/:id`

- **`Backend/src/routes/orderItemRoutes.js`**
  - `POST   /api/v1/orderitem`
  - `GET    /api/v1/orderitem`
  - `GET    /api/v1/orderitem/order/:order_id`
  - `PUT    /api/v1/orderitem/:order_item_id`
  - `DELETE /api/v1/orderitem/:order_item_id`

- **`Backend/src/routes/paymentRoutes.js`**
  - `POST   /api/v1/payment`
  - `GET    /api/v1/payment`
  - `GET    /api/v1/payment/order/:order_id`
  - `PUT    /api/v1/payment/:payment_id`
  - `DELETE /api/v1/payment/:payment_id`

### Controllers

Controllers implement the request handlers for each feature.

- **`Backend/src/controllers/userController.js`**
  - Handles signup/login JWT flow and user lookup.
  - Note: some session-related code is commented out.

- **`Backend/src/controllers/gameController.js`**
  - Implements create/update/delete and list/fetch for games.

- **`Backend/src/controllers/inventoryController.js`**
  - Implements create/update/delete and list/fetch for inventory.

- **`Backend/src/controllers/orderController.js`**
  - Implements order create/update/delete and order listing.
  - `getALLUserOrders` returns “orders with details” (payment + items) via the model.

- **`Backend/src/controllers/orderItemController.js`**
  - Implements order item create/update/delete and item listing.

- **`Backend/src/controllers/paymentController.js`**
  - Implements payment create/update/delete and payment listing.

### Models

Models implement DB operations (SQL queries) used by controllers.

- **`Backend/src/utils/db.js`**
  - Creates a SQL Server connection configuration from env vars.
  - Exports `connectDB()` and `sql` for use with `sql.query`.
  - `connectDB()` connects once at server startup.

- **`Backend/src/models/userModel.js`**
  - User CRUD and lookup queries.
  - Contains `fixBigInt()` helper to normalize SQL results.

- **`Backend/src/models/gameModel.js`**
  - Inserts/updates/deletes games and reads games.
  - **Complex area**: `deleteGame(game_id)` updates/removes dependent order totals/payments/orderitems/inventory before deleting the game.

- **`Backend/src/models/inventoryModel.js`**
  - Inventory CRUD and reads.

- **`Backend/src/models/orderModel.js`**
  - Creates orders and returns detailed order structures.
  - **Complex area**: `getAllOrders()` and `getUserOrders()` iterate orders and for each order fetch:
    - payment record
    - user (username/email)
    - order items + joined game details
  - `getOrderById()` returns raw order rows.

- **`Backend/src/models/orderItemModel.js`**
  - Creates and manages order items.

- **`Backend/src/models/paymentModel.js`**
  - Creates/updates/deletes payments.
  - `getAllPayments()` returns `result.recordsets`.

### Database setup

- **`Backend/database/schema.sql`**: SQL Server schema (tables + constraints + indexes).
- **`Backend/database/seed.sql`**: minimal seed data for demo usage.
- **`Backend/database/setup-db.js`**
  - Reads `schema.sql` + `seed.sql` and executes them in `GO`-separated batches.
  - Uses `database/` directory relative to `process.cwd()`.

### Docker

- **`Backend/docker-compose.yml`**
  - Runs SQL Server container (port `1433`) with a named volume for persistence.

---

## Frontend

### App / routing

- **`Frontend/src/App.jsx`**
  - Wraps the application with `Header`, `Footer`, and `AppRoutes`.

- **`Frontend/src/routes/AppRoutes.jsx`**
  - Defines UI routes and renders pages.
  - Main paths include:
    - `/` → `Home`
    - `/product/:id` → `ProductDetail`
    - `/cart` → `Cart`
    - `/order-summary` → `OrderSummary`
    - `/payment/:order_id` → `Payment`
    - `/login`, `/logout`, `/signup`
    - `/admin-dashboard`, `/admin/orders`
    - `/add-game`, `/update-game`, `/delete-game`

### Pages

Pages define the screens.

Notable complex pages:

- **`Frontend/src/pages/Home.jsx`**
  - Fetches games + inventories, applies genre filtering, and navigates to product detail while selecting inventory.
  - Uses a carousel and stock-aware UI (“OUT OF STOCK”).

- **`Frontend/src/pages/ProductDetail.jsx`**
  - Fetches game + inventory by id and controls “Add to cart” based on stock.
  - Adds/updates cart state via Redux thunks.

- **`Frontend/src/pages/OrderSummary.jsx`**
  - Builds order items from cart contents, calls backend to create an order and associated order items, then navigates to payment.

- **`Frontend/src/pages/Payment.jsx`**
  - Handles payment method selection and payment submission.
  - Validates input fields depending on chosen method.
  - Checks payment status by fetching payment data.

- **`Frontend/src/pages/Login.jsx`**
  - Dispatches login thunk and redirects using `redirectAfterLogin` stored in `localStorage`.

- **`Frontend/src/pages/Admin.jsx`**
  - Simple role-based guard: navigates away if user is missing or role is `Customer`.

### Redux stores

Redux “stores” group slice state + thunk actions.

- **`Frontend/src/utils/api.js`**
  - Axios instance configured with:
    - `baseURL: http://localhost:8000/api/v1`
    - `withCredentials: true`
  - Request interceptor ensures JSON content-type.

- **`Frontend/src/utils/store.js`**
  - Configures Redux Toolkit store.
  - Uses `redux-persist` to persist store state in browser storage.
  - Combines reducers from slices.

Thunks (async action creators) shown in opened tabs:

- **`Frontend/src/user.store/userThunk.js`**
  - Signup/login/current-user/logout thunks.
  - Uses `sessionStorage` to store `accessToken`.
  - Adds `Authorization: Bearer <token>` when calling current-user.

- **`Frontend/src/cart.store/cartThunk.js`**
  - Manages cart persistence via `cartStorage`.
  - Updates cart state locally (no backend calls in these thunks).

Other slice files exist under `*.store/` (game, inventory, order, orderItem, payment) and follow the same Redux Toolkit patterns (slice + thunk).

### UI utils

- **`Frontend/src/utils/httpMessages.js`**
  - Centralized mapping of status codes to user-friendly message strings.

---

## How to understand flows quickly

- **Frontend → Backend**
  - Frontend uses axios from `Frontend/src/utils/api.js`.
  - Routes in `Backend/src/server.js` mount feature routers under `/api/v1/*`.
  - Routers map request handlers to controller functions.
  - Controllers call model functions that run SQL queries against SQL Server.

- **Cart and Orders**
  - Cart is maintained in Redux + persisted to local storage.
  - `OrderSummary` creates `Orders` and `OrderItems` by calling backend endpoints.
  - `Payment` records a row in `Payments`.
