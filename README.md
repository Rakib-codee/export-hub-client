# Import Export Hub (Client)

Live Site: <your-live-url-here>

Import Export Hub is a modern SPA to browse global products, add your own exports, and import desired products into your personal list with one click. Built with React, TailwindCSS, and Firebase Auth; backed by an Express + MongoDB API.

Features:
- Latest 6 products on Home, 3‑column product grid and details view
- One‑click Import with quantity modal and real‑time stock decrement
- Private routes for My Imports, My Exports and Add Export
- Email/password and Google sign‑in via Firebase; session persists on refresh
- Search on All Products; CSV download for My Exports; responsive, dark/light mode

Local Setup:
1) Create a `.env` file with:
```
VITE_API_BASE_URL=http://localhost:3000
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_APP_ID=...
```
**Note**: A `.env.example` file is provided for reference.
2) Install and run:
```
npm install
npm run dev
```
