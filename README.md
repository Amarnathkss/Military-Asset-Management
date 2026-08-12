# Military Asset Management System

A role-based military asset management system for tracking equipment inventory, purchases, transfers, assignments, expenditures, and audit activity across military bases.

## Features

- JWT-based authentication
- Role-Based Access Control (RBAC)
- Base-level access restriction for Base Commanders
- Dashboard with inventory movement metrics
- Dashboard filtering by base, equipment type, and date range
- Net Movement breakdown modal
- Inventory visibility by base and equipment type
- Purchase recording and purchase history
- Inter-base equipment transfers
- Transfer history
- Personnel assignments
- Equipment expenditures
- Insufficient inventory validation
- Transaction-safe transfer operations
- Audit logging
- Admin-only audit log viewer
- Toast notifications
- Responsive React interface

## User Roles

### ADMIN

Global administrative access.

Capabilities include:

- Dashboard
- Inventory
- Purchases
- Transfers
- Assignments
- Expenditures
- Audit Logs
- User management

### LOGISTICS_OFFICER

Global logistics access.

Capabilities include:

- Dashboard
- Inventory
- Purchases
- Transfers
- Purchase History
- Transfer History

### BASE_COMMANDER

Restricted to the user's assigned base.

Capabilities include:

- Dashboard for assigned base
- Inventory for assigned base
- Assignments
- Expenditures

A Base Commander cannot select or operate on another base.

## Technology Stack

### Frontend

- React 19
- Vite
- React Router
- React Hot Toast
- Lucide React
- CSS/Tailwind-based UI

### Backend

- Node.js
- Express 5
- PostgreSQL
- node-postgres (`pg`)
- JSON Web Tokens
- bcryptjs
- Helmet
- CORS

## Architecture

```text
┌───────────────────────────┐
│      React Frontend       │
│                           │
│ Pages / Components        │
│ Auth Context              │
│ Protected Routes          │
│ API Services              │
└─────────────┬─────────────┘
              │ HTTP / JSON
              ▼
┌───────────────────────────┐
│     Express Backend       │
│                           │
│ Routes                    │
│ Controllers               │
│ Authentication Middleware │
│ RBAC Middleware           │
│ Inventory Service         │
└─────────────┬─────────────┘
              │ node-postgres
              ▼
┌───────────────────────────┐
│       PostgreSQL          │
│                           │
│ Users                     │
│ Bases                     │
│ Equipment                 │
│ Purchases                 │
│ Transfers                 │
│ Assignments               │
│ Expenditures              │
│ Audit Logs                │
└───────────────────────────┘

**Project Structure**

Military-Asset-Management/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── assetController.js
│   │   ├── assignmentController.js
│   │   ├── auditController.js
│   │   ├── authController.js
│   │   ├── expenditureController.js
│   │   ├── purchaseController.js
│   │   └── transferController.js
│   │
│   ├── db/
│   │   ├── schema.sql
│   │   └── seed.js
│   │
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   └── rbacMiddleware.js
│   │
│   ├── routes/
│   │   ├── assetRoutes.js
│   │   ├── assignmentRoutes.js
│   │   ├── auditRoutes.js
│   │   ├── authRoutes.js
│   │   ├── expenditureRoutes.js
│   │   ├── purchaseRoutes.js
│   │   ├── transferRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── services/
│   │   └── inventoryService.js
│   │
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ProtectedRoute.jsx
    │   │   └── Sidebar.jsx
    │   │
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   │
    │   ├── layouts/
    │   │   └── DashboardLayout.jsx
    │   │
    │   ├── pages/
    │   │   ├── Assignments.jsx
    │   │   ├── AuditLogs.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Expenditures.jsx
    │   │   ├── Inventory.jsx
    │   │   ├── Login.jsx
    │   │   ├── Purchases.jsx
    │   │   └── Transfers.jsx
    │   │
    │   └── services/
    │       ├── api.js
    │       ├── assignmentService.js
    │       ├── auditService.js
    │       ├── expenditureService.js
    │       ├── inventoryService.js
    │       ├── purchaseService.js
    │       └── transferService.js
    │
    └── package.json

## Demo Credentials

Use these accounts to test the deployed application.

| Role | Username | Password |
|---|---|---|
| Admin | `admin_user` | `AdminPass123!` |
| Logistics Officer | `logistics_officer` | `LogisticsPass123!` |
| Base Commander | `commander_alpha` | `CommandPass123!` |

### Role Access

- **Admin** — Full system access
- **Logistics Officer** — Inventory, purchases, transfers and related logistics operations
- **Base Commander** — Base-specific inventory, assignments and expenditures
- **Commander Alpha** — Restricted to **Fort Alpha**