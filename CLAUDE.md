# Project Structure

## Overview
Logiciel de gestion de stock - application web complete pour la gestion d'inventaire avec suivi des produits, mouvements de stock, fournisseurs et alertes de stock bas.

## Tech Stack
- Framework: Next.js 15 (App Router)
- Database: Supabase (PostgreSQL) via nubase
- UI: shadcn/ui + Tailwind CSS + Radix UI
- Auth: Supabase Auth avec email/password
- State: React hooks + Context API
- Icons: Lucide React

## Directory Structure
```
src/
├── app/
│   ├── (auth)/           # Auth pages (login, register)
│   ├── (dashboard)/      # Protected dashboard pages
│   │   ├── dashboard/    # Dashboard overview
│   │   ├── products/     # Products management
│   │   ├── movements/    # Stock movements
│   │   ├── suppliers/    # Suppliers management
│   │   ├── categories/   # Categories management
│   │   └── alerts/       # Low stock alerts
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page (redirect)
├── components/
│   ├── auth/             # Auth components
│   ├── dashboard/        # Dashboard components (sidebar)
│   ├── products/         # Product dialog
│   ├── stock/            # Movement dialog
│   ├── suppliers/        # Supplier dialog
│   └── ui/               # shadcn/ui components
├── hooks/
│   ├── useAuth.tsx       # Authentication hook
│   └── use-toast.ts      # Toast notifications
└── integrations/
    └── supabase/         # Supabase client config
```

## Database Schema

### Tables
- **profiles**: User profiles linked to auth.users
- **user_roles**: User roles (admin, manager, user)
- **categories**: Product categories
- **suppliers**: Suppliers/vendors
- **products**: Product catalog with stock levels
- **stock_movements**: Stock entries, exits, adjustments

### Key Features
- Automatic stock update via database triggers
- Row Level Security (RLS) policies
- Role-based access control

## Core Systems

### Authentication
- Status: Implemented
- Location: src/hooks/useAuth.tsx
- Description: Email/password authentication with Supabase, role checking (admin, manager, user)

### Dashboard
- Status: Implemented
- Location: src/app/(dashboard)/dashboard/page.tsx
- Description: Overview with KPIs (total products, value, low stock count, recent movements)

### Products Management
- Status: Implemented
- Location: src/app/(dashboard)/products/
- Description: CRUD operations, search, stock status badges

### Stock Movements
- Status: Implemented
- Location: src/app/(dashboard)/movements/
- Description: Entry/exit/return/adjustment tracking, automatic stock updates

### Suppliers
- Status: Implemented
- Location: src/app/(dashboard)/suppliers/
- Description: Supplier management with contact info

### Categories
- Status: Implemented
- Location: src/app/(dashboard)/categories/
- Description: Product categorization

### Low Stock Alerts
- Status: Implemented
- Location: src/app/(dashboard)/alerts/
- Description: Products below minimum stock level with severity indicators

## Current State
- [x] Database schema with RLS
- [x] Authentication (login, register, logout)
- [x] Role-based access (admin, manager, user)
- [x] Dashboard with statistics
- [x] Products CRUD
- [x] Stock movements tracking
- [x] Suppliers management
- [x] Categories management
- [x] Low stock alerts
- [x] Sample data seeded

## Maintenance Log
- 2026-05-03: Initial implementation - Stock management system with authentication, products, movements, suppliers, categories, and alerts
