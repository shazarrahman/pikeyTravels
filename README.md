# PikeyTravels

A compact, configurable MERN travel marketplace — super-admin driven, provider self-registration, and live package customization.

## Overview

PikeyTravels is a full-stack (MERN) travel marketplace built for low-cost deployment. A single super admin controls branding, site content, providers, packages, and front-page visibility. Providers (hotels, cabs, guides) submit registrations for admin approval. Users can browse, customize packages (swap hotels/cabs, add optional services), and book trips.

## Key Features
- Super admin panel: site settings, navigation, categories, providers, packages, add-ons, reviews, and bookings
- Provider registration: hotels, cabs, guides (pending → approved flow)
- Package customizer: live price updates when changing hotel/cab/guide and toggling add-ons
- Runtime theming: fonts and colors injected from DB (no redeploy needed)
- Cloudinary image uploads, MongoDB Atlas, Express API, React + Vite frontend

## Tech Stack
- Frontend: React, Vite, Tailwind CSS, React Query
- Backend: Node.js, Express, Mongoose
- Storage & services: MongoDB Atlas, Cloudinary

## Quick Start (development)
1. Copy and update environment variables from `.env.example`.
2. Install dependencies and run both servers:

```bash
# Backend
cd src
npm install
npm run dev

# Frontend
cd ../www
npm install
npm run dev
```

## Folder Layout (top-level)
- `src/` — backend (API, models, controllers)
- `www/` — frontend (React + Vite)

## Current Status
Most core features and the admin UI are implemented; remaining work includes finishing provider management, bookings manager, reviews flow, and end-to-end booking polish. See `plan.md` for the full roadmap and phase breakdown.

## Contributing
Fork, create a branch, and open a PR. Follow code style in existing files.

---