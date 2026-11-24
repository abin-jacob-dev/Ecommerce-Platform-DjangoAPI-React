<div align="center">
  <h1>🛒 E-Commerce Marketplace Platform</h1>
  <p><strong>A full-stack product marketplace built with Django REST Framework &amp; React (Vite)</strong></p>
  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#installation">Installation</a> •
    <a href="#api-route-reference">API Routes</a> •
    <a href="#frontend-routes">Frontend Routes</a> •
    <a href="#environment-variables">Environment</a> •
    <a href="#deployment">Deployment</a> •
    <a href="https://documenter.getpostman.com/view/53849222/2sBYPv3sgx#af36c990-47f3-4950-97a6-8ad4228eb1db">API Docs</a> •
    <a href="./docs/PROJECT_DETAILS.md">Deep Dive</a>
  </p>
</div>

<p align="center">
  <img alt="Django" src="https://img.shields.io/badge/Django-6.1.3-092E20?style=for-the-badge&logo=django">
  <img alt="DRF" src="https://img.shields.io/badge/Django_REST_Framework-3.18.3-red?style=for-the-badge">
  <img alt="Python" src="https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python">
  <img alt="React" src="https://img.shields.io/badge/React-19.3.1-61DAFB?style=for-the-badge&logo=react">
  <img alt="Vite" src="https://img.shields.io/badge/Vite-8.3.6-646CFF?style=for-the-badge&logo=vite">
  <img alt="Redux" src="https://img.shields.io/badge/Redux_Toolkit-2.15.0-764ABC?style=for-the-badge&logo=redux">
  <img alt="JWT" src="https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens">
  <img alt="Cloudinary" src="https://img.shields.io/badge/Cloudinary-Media-3448C5?style=for-the-badge&logo=cloudinary">
  <img alt="License" src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge">
</p>

---

## 📋 Overview

This project is a **full-stack marketplace platform** (branded **OLX** on the frontend) that lets users **buy and sell products**. It is split into two independently runnable applications:

- **Backend** — a **Django REST Framework** API that owns authentication, product CRUD, seller ownership, and a transactional checkout that marks products as sold.
- **Frontend** — a **React 19 + Vite** single-page application that consumes the API, manages auth state with Redux Toolkit, and provides a polished UI for browsing, creating, editing, and checking out products.

The backend exposes a stateless **JWT-based** authentication system (access + refresh tokens with rotation & blacklisting), stores product images on **Cloudinary**, and uses a custom exception handler so every error response has a consistent shape. The frontend persists tokens in `localStorage`, auto-refreshes expired access tokens through an Axios interceptor, and guards private routes behind an auth-initialized gate.

> 📖 For a deeper technical breakdown — architecture, data model, request flows, design decisions, security, and roadmap — see [`docs/PROJECT_DETAILS.md`](./docs/PROJECT_DETAILS.md).

---

## ✨ Features

### 🛍️ Customer / Buyer

- **Product Catalog** – Browse all available (not-yet-sold) products on the home page
- **Price Filtering** – Filter products by `min_price` / `max_price` query params
- **Product Details** – View a single product's title, description, price, location, and image
- **Shopping Cart** – Add products to a local cart, remove items individually, or clear the cart
- **Checkout** – Submit the cart to the API; products are atomically marked as sold
- **User Authentication** – Email + password registration and login
- **Session Persistence** – Tokens stored in `localStorage`; auto token refresh on 401
- **Protected Routes** – Cart, "My Products", Create/Edit Product require authentication

### 🧑‍💼 Seller

- **Create Product** – Title, description, price, location, and image upload (validated with react-hook-form)
- **My Products** – View all products owned by the logged-in seller with SOLD / AVAILABLE badges
- **Edit Product** – Update title, description, price, location, and optionally replace the image
- **Delete Product** – Remove a product with a confirmation prompt
- **Ownership Enforcement** – Only the seller who created a product can edit or delete it (backend `IsSellerOrReadOnly`)

### ⚙️ Platform / API

- **Custom User Model** – Email-based authentication (`USERNAME_FIELD = "email"`)
- **JWT Auth** – Access (30 min) + refresh (1 day) tokens, rotation, blacklisting on logout
- **Cloudinary Media** – Product images stored in the cloud and served via CDN
- **Custom Exception Handler** – Uniform `{ success, message, error }` error responses
- **CORS** – Configured for the Vite dev server (`http://localhost:5173`)
- **Transactional Checkout** – `select_for_update` + `transaction.atomic` prevents race conditions
- **Error Boundary** – React error boundary prevents full-app crashes

---

## 🛠️ Tech Stack

### Frontend (Client)

| Technology | Version | Purpose |
|:-----------|:--------|:--------|
| **React** | 19.3.1 | UI library |
| **React DOM** | 19.3.1 | React renderer for the web |
| **React Router DOM** | 7.18.6 | Client-side routing |
| **Redux Toolkit** | 2.15.0 | Global state management (auth, products, cart) |
| **React Redux** | 9.3.1 | React bindings for Redux |
| **Axios** | 1.21.1 | HTTP client with interceptors |
| **React Hook Form** | 7.92.0 | Form validation (register, create/edit product) |
| **Vite** | 8.3.6 | Dev server & bundler (HMR) |
| **ESLint** | 10.14.0 | Linting (react-hooks, react-refresh) |

### Backend (Server)

| Technology | Version | Purpose |
|:-----------|:--------|:--------|
| **Python** | 3.12 | Runtime |
| **Django** | 6.1.3 | Web framework |
| **Django REST Framework** | 3.18.3 | REST API toolkit |
| **SimpleJWT** | 5.5.1 | JWT authentication |
| **django-cors-headers** | 4.9.0 | CORS handling |
| **Cloudinary SDK** | 1.47.0 | Cloud media storage |
| **Pillow** | 13.0.0 | Image processing |
| **python-dotenv** | 1.2.4 | Environment variable loading |
| **PyJWT** | 2.15.1 | JWT support |
| **SQLite** | (built-in) | Development database |
| **asgiref / sqlparse** | — | Django internals |

### Key Python Packages (`backend/config/requirements.txt`)

| Package | Version |
|:--------|:--------|
| `Django` | 6.1.3 |
| `djangorestframework` | 3.18.3 |
| `djangorestframework_simplejwt` | 5.5.1 |
| `django-cors-headers` | 4.9.0 |
| `cloudinary` | 1.47.0 |
| `pillow` | 13.0.0 |
| `python-dotenv` | 1.2.4 |
| `PyJWT` | 2.15.1 |
| `asgiref` | 3.13.0 |
| `sqlparse` | 0.6.1 |
| `certifi` | 2026.11.20 |
| `urllib3` | 2.8.0 |
| `six` | 1.17.0 |

---

## 🔐 Environment Variables

The backend reads variables from a `.env` file (loaded via `python-dotenv`). Create `backend/config/config/.env` (or copy from `.env.example`):

```env
# Cloudinary (required for product image uploads)
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
```

> ⚠️ The current `settings.py` ships with a hard-coded `SECRET_KEY` and `DEBUG = True` for local development. For any non-local deployment you **must** move these into environment variables and set `DEBUG=False`. See the [Deep Dive](./docs/PROJECT_DETAILS.md#security-notes) for the recommended hardening steps.

### Frontend configuration

The frontend currently points at the backend via a hard-coded base URL in `frontend/src/services/api.jsx`:

```js
baseURL: 'http://localhost:8000/api/'
```

And the Cloudinary cloud name is hard-coded in several pages:

```js
const CLOUD_NAME = "campeon-ecommerce";
```

For production, move both into Vite environment variables (`import.meta.env`).

---

## 📦 Installation

### Prerequisites

- Python 3.12+ (project tested on 3.12)
- Node.js 18+ and npm
- Git
- A Cloudinary account (free tier works) for image uploads

### 1. Clone the repository

```bash
git clone https://github.com/abin-jacob-dev/Ecommerce-Platform-DjangoAPI-React.git
cd "Ecommerce-Platform-DjangoAPI-React"
```

### 2. Backend setup

```bash
cd backend/config

# Create & activate a virtual environment
python -m venv venv
source venv/bin/activate          # Linux/macOS
# venv\Scripts\activate           # Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment
# Create backend/config/config/.env and add your CLOUDINARY_URL

# Apply migrations
python manage.py makemigrations
python manage.py migrate

# (Optional) create an admin/superuser for Django admin
python manage.py createsuperuser

# Run the dev server
python manage.py runserver
```

The API is now available at **http://127.0.0.1:8000/** (API root: `http://127.0.0.1:8000/api/`).

### 3. Frontend setup

```bash
cd frontend

npm install
npm run dev
```

The Vite dev server runs at **http://localhost:5173/** and is already allowed by the backend's CORS config.

### 4. Build the frontend for production

```bash
cd frontend
npm run build        # outputs to frontend/dist
npm run preview      # preview the production build
```

---

## 🗺️ API Route Reference

Base URL: `http://localhost:8000/api/`

### Authentication

| Method | Endpoint | Auth | Description |
|:-------|:---------|:-----|:------------|
| `POST` | `/api/register/` | Public | Register a new user (email + password) |
| `POST` | `/api/login/` | Public | Obtain access & refresh JWT tokens |
| `POST` | `/api/logout/` | Authenticated | Blacklist the refresh token |
| `GET` | `/api/profile/` | Authenticated | Get the current user's profile |
| `POST` | `/api/token/` | Public | SimpleJWT token obtain (email/password) |
| `POST` | `/api/token/refresh/` | Public | Refresh an access token |
| `POST` | `/api/token/verify/` | Public | Verify a token |

### Products

| Method | Endpoint | Auth | Description |
|:-------|:---------|:-----|:------------|
| `GET` | `/api/products/` | Public | List available products (supports `?min_price=` `?max_price=`) |
| `POST` | `/api/products/` | Authenticated | Create a product (seller = current user) |
| `GET` | `/api/products/{id}/` | Public | Retrieve a product |
| `PUT/PATCH` | `/api/products/{id}/` | Authenticated (seller) | Update a product |
| `DELETE` | `/api/products/{id}/` | Authenticated (seller) | Delete a product |
| `GET` | `/api/my_products/` | Authenticated | List the current user's products |
| `POST` | `/api/checkout/` | Authenticated | Checkout (mark selected products as sold) |

### Example requests

```bash
# Register
curl -X POST http://localhost:8000/api/register/ \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"strongpassword123"}'

# Login
curl -X POST http://localhost:8000/api/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"strongpassword123"}'

# List products
curl http://localhost:8000/api/products/

# Filter by price
curl "http://localhost:8000/api/products/?min_price=100&max_price=500"

# Create a product (multipart/form-data)
curl -X POST http://localhost:8000/api/products/ \
  -H "Authorization: Bearer <access_token>" \
  -F "title=Vintage Camera" \
  -F "description=A classic film camera in great condition" \
  -F "price=250.00" \
  -F "location=New York" \
  -F "image=@/path/to/image.jpg"

# Checkout
curl -X POST http://localhost:8000/api/checkout/ \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"product_ids":[1,2,3]}'
```

---

## 📮 Postman Collection & API Documentation

- **Live API Documentation (Postman):** https://documenter.getpostman.com/view/53849222/2sBYPv3sgx#af36c990-47f3-4950-97a6-8ad4228eb1db
- A ready-to-import Postman collection is provided under [`postman/`](./postman/):

- `postman/Ecommerce_Platform_API.postman_collection.json` — all endpoints (auth + products + checkout) with methods, headers, bodies, and test scripts that auto-save tokens.
- `postman/Ecommerce_Platform.postman_environment.json` — environment variables (`base_url`, `access_token`, `refresh_token`, `product_id`).

**Import steps**

1. Open Postman → **Import** → select both JSON files (or drag-and-drop).
2. Select the **E-Commerce Platform - Local** environment.
3. Set `base_url` to your backend (default `http://localhost:8000`).
4. Run **Login** first — the test script stores `access_token` and `refresh_token` automatically.
5. All protected requests use `{{access_token}}` via Bearer auth.

## 🧭 Frontend Routes

| Path | Component | Protected | Description |
|:-----|:----------|:----------|:------------|
| `/` | `Home` | No | Product catalog + add to cart |
| `/login` | `Login` | No | User login |
| `/register` | `Register` | No | User registration |
| `/products/:id` | `ProductDetails` | No | Single product view |
| `/my_products` | `MyProducts` | Yes | Seller's own products |
| `/products/create` | `CreateProduct` | Yes | Create a new product |
| `/products/:id/edit` | `EditProduct` | Yes | Edit an existing product |
| `/cart` | `Cart` | Yes | Cart & checkout |

---

## 🧪 Usage

### Buyer flow

1. Visit `/` to browse available products.
2. Click **Add to Cart** on a product (confirm the prompt).
3. Open `/cart`, review items, remove any if needed.
4. Click **Checkout** to mark the selected products as sold.
5. On success you are redirected to `/my_products`.

### Seller flow

1. **Register** at `/register` and **Login** at `/login`.
2. Go to `/products/create`, fill in title/description/price/location and upload an image.
3. Manage your listings at `/my_products` — edit or delete, and see SOLD / AVAILABLE status.

### Admin (Django built-in)

1. Run `python manage.py createsuperuser`.
2. Visit `http://127.0.0.1:8000/admin/` and log in with superuser credentials.

---

## 🏗️ How It's Made (High Level)

```
┌──────────────────────┐        HTTP/JSON       ┌──────────────────────┐
│  React 19 + Vite     │  ───────────────────►  │  Django REST (DRF)   │
│  Redux Toolkit       │  ◄───────────────────  │  SimpleJWT auth      │
│  Axios (interceptor) │     JWT Bearer token   │  SQLite / Cloudinary │
└──────────────────────┘                        └──────────────────────┘
```

- **Stateless API** — the backend never renders HTML; it only serves JSON. The frontend is a pure SPA.
- **Auth** — email/password → JWT pair. Access token (30 min) is sent as `Authorization: Bearer …`. On 401, the Axios interceptor calls `/api/token/refresh/` and retries the original request; on failure it logs the user out.
- **Ownership** — products reference a `seller` FK. `IsSellerOrReadOnly` ensures only the owner can mutate.
- **Checkout safety** — `CheckoutAPIView` wraps the update in `transaction.atomic()` and uses `select_for_update()` to lock rows, preventing two buyers from purchasing the same product.
- **Media** — images are uploaded to Cloudinary via `CloudinaryField`; the frontend builds the CDN URL from the stored public id.
- **Errors** — `custom_exception_handler` normalizes DRF errors into `{ success, message, error }`.

> For the full architecture, data model, sequence diagrams, and design rationale, see [`docs/PROJECT_DETAILS.md`](./docs/PROJECT_DETAILS.md).

---

## 🚀 Deployment

### Backend (Django)

1. Set `DEBUG=False` and provide a strong `SECRET_KEY` via environment.
2. Configure `ALLOWED_HOSTS` with your domain.
3. Switch from SQLite to PostgreSQL (recommended) — update `DATABASES` in `settings.py`.
4. Run `python manage.py collectstatic`.
5. Serve with a WSGI server behind a reverse proxy:

   ```bash
   pip install gunicorn
   gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 4
   ```

6. Put Nginx (or similar) in front for static files and HTTPS (Let's Encrypt).

### Frontend (React/Vite)

1. Set the production API base URL (via Vite env vars).
2. Build: `npm run build`.
3. Serve the `dist/` folder with any static host (Nginx, Vercel, Netlify, S3+CloudFront).

### Checklist

- [ ] `DEBUG=False`
- [ ] Strong, unique `SECRET_KEY` (from env, not committed)
- [ ] `ALLOWED_HOSTS` configured
- [ ] PostgreSQL configured for production
- [ ] `CLOUDINARY_URL` set
- [ ] Frontend `baseURL` and `CLOUD_NAME` moved to env vars
- [ ] HTTPS enabled
- [ ] CORS origins restricted to the production frontend origin

---

## 📂 Project Structure

```
Ecommerce-Platform-DjangoAPI-React/
├── backend/
│   └── config/
│       ├── manage.py
│       ├── requirements.txt
│       ├── config/                 # Django project settings
│       │   ├── settings.py
│       │   ├── urls.py
│       │   ├── exceptions.py      # Custom DRF exception handler
│       │   ├── asgi.py / wsgi.py
│       │   └── .env.example
│       ├── accounts/               # Custom user model + auth views/serializers
│       │   ├── models.py
│       │   ├── serializers.py
│       │   ├── views.py
│       │   ├── urls.py
│       │   └── migrations/
│       └── products/               # Product CRUD + checkout
│           ├── models.py
│           ├── serializers.py
│           ├── views.py
│           ├── permissions.py     # IsSellerOrReadOnly
│           ├── urls.py
│           └── migrations/
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── eslint.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx                 # Routes
│       ├── app/store.jsx           # Redux store
│       ├── services/api.jsx        # Axios instance + interceptors
│       ├── components/             # Navbar, Footer, ErrorBoundary, ProtectedRoute
│       ├── features/               # auth, products, cart slices
│       └── pages/                  # Home, Login, Register, ProductDetails, ...
├── docs/
│   └── PROJECT_DETAILS.md          # Deep-dive architecture & rationale
├── .gitignore
└── README.md
```

---

## 👥 Authors

- **[@abin-jacob-dev](https://www.github.com/abin-jacob-dev)** – Full-stack developer and project maintainer

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for more details.

---

<div align="center">
  <br>
  <p>Built with ❤️ by <a href="https://www.github.com/abin-jacob-dev">@abin-jacob-dev</a></p>
  <p>
    <a href="https://github.com/abin-jacob-dev/Ecommerce-Platform-DjangoAPI-React/issues">Report Bug</a>
    •
    <a href="https://github.com/abin-jacob-dev/Ecommerce-Platform-DjangoAPI-React/issues">Request Feature</a>
  </p>
</div>
