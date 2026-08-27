# Natural Tea Shop — React Version

This is a conversion of the original plain HTML/CSS/JS "Natural Tea Shop" project
into a **React** app (built with Vite + React Router), as required for using a
JS frontend framework.

## What changed vs. the original

- Every `.html` page (`index.html`, `about.html`, `services.html`, `contact.html`,
  `login.html`, `admin-dashboard.html`) is now a React **component** under `src/pages/`.
- Client-side routing is handled by **React Router** (`react-router-dom`) instead
  of separate `.html` files — see `src/App.jsx` for the routes.
- The navbar's login/logout/admin-link behavior is now a **React Context**
  (`src/context/AuthContext.jsx`) instead of a `<script>` block repeated on every page.
- The shopping cart (add/remove/qty/checkout) is a **React Context**
  (`src/context/CartContext.jsx`) instead of global variables + `innerHTML`.
- The admin dashboard's orders/products tables, modals, and toasts are all
  driven by React `useState`, instead of manually toggling CSS classes with
  `document.getElementById(...)`.
- All data is still persisted the same way as before — in **`localStorage`**
  (`isLoggedIn`, `userRole`, `currentUser`, `ntCart`, `ntOrders`, `ntProducts`) —
  so the app behaves identically to your original version.
- Added a simple `/register` page (was linked from the login page in the
  original but the file wasn't included) so the "sign up" link works.

## Project structure

```
src/
  main.jsx              entry point
  App.jsx                routes
  index.css              global styles (from the original style.css)
  context/
    AuthContext.jsx       login/logout state
    CartContext.jsx        cart state
  components/
    Navbar.jsx
    Footer.jsx
    RequireAdmin.jsx       guards the /admin route
  data/
    products.js            menu/product list
  pages/
    Home.jsx, About.jsx, Services.jsx (+ Services.css),
    Contact.jsx, Login.jsx, Register.jsx,
    AdminDashboard.jsx (+ AdminDashboard.css)
public/
  images/                 same product photos as before
```

## How to run it

1. Install [Node.js](https://nodejs.org/) (v18 or newer).
2. Open a terminal in this folder and run:
   ```
   npm install
   npm run dev
   ```
3. Open the URL it prints (usually `http://localhost:5173`).

To create a production build:
```
npm run build
```
The output goes to `dist/` — you can deploy that folder anywhere static
files are served (Netlify, Vercel, GitHub Pages, etc.), or use it with
a backend of your choice (Firebase, Supabase, Strapi, etc.).

## Test accounts (same as before)

- User: `user@gmail.com` / `123456`
- Admin: `admin@teashop.com` / `admin123`
