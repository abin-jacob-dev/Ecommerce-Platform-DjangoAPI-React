# Project Deep Dive — E-Commerce Marketplace Platform

> Companion document to [`README.md`](../README.md). This file collects the architecture, data model, request flows, design decisions, security notes, and roadmap that are too detailed for the main README.

---

## 1. Architecture

### 1.1 High-level

```
┌────────────────────────────┐           ┌────────────────────────────┐
│        React 19 SPA        │  HTTPS    │      Django 6.1.3 API      │
│  (Vite dev server :5173)   │ ────────► │  DRF + SimpleJWT           │
│                            │ ◄──────── │  (runserver :8000)         │
│  Redux Toolkit             │   JSON    │                            │
│  React Router 7            │           │  SQLite (dev)              │
│  Axios + interceptor       │           │  Cloudinary (media)        │
└────────────────────────────┘           └────────────────────────────┘
```

- **Stateless backend**: Django never renders HTML; it only serves JSON under `/api/`. The frontend is a pure SPA served by Vite in dev and by a static host in prod.
- **Decoupled deployability**: backend and frontend can be deployed, versioned, and scaled independently.
- **Token-based auth**: no server-side sessions; identity is carried by JWTs in the `Authorization` header.

### 1.2 Backend layers

| Layer | Location | Responsibility |
|:------|:---------|:---------------|
| Project config | `backend/config/config/` | Settings, root URLs, WSGI/ASGI, custom exception handler |
| Accounts app | `backend/config/accounts/` | Custom `User` model, registration, login, logout, profile |
| Products app | `backend/config/products/` | Product CRUD, ownership permission, checkout transaction |

### 1.3 Frontend layers

| Layer | Location | Responsibility |
|:------|:---------|:---------------|
| Entry | `src/main.jsx` | StrictMode, Redux Provider, interceptor setup |
| Routing | `src/App.jsx` | Route table, auth bootstrap effect |
| State | `src/features/*` | Redux slices (auth, products, cart) |
| Services | `src/services/api.jsx` | Axios instance + 401 refresh interceptor |
| UI | `src/pages`, `src/components` | Screens and reusable components |

---

## 2. Data Model

### 2.1 `accounts.User`

Extends Django's `AbstractUser` but switches the login identifier to email.

| Field | Type | Notes |
|:------|:-----|:------|
| `id` | BigAutoField | PK |
| `email` | EmailField (unique, required) | `USERNAME_FIELD` |
| `username` | CharField(150, unique) | Inherited; set equal to email on registration |
| `password` | CharField(128) | Hashed |
| `is_staff`, `is_superuser`, `is_active` | Boolean | Standard Django flags |
| `date_joined`, `last_login` | DateTime | Standard |
| `groups`, `user_permissions` | M2M | Standard |

Custom `UserManager` provides `create_user` / `create_superuser` keyed on email.

### 2.2 `products.Product`

| Field | Type | Notes |
|:------|:-----|:------|
| `id` | BigAutoField | PK |
| `title` | CharField(50) | |
| `description` | TextField | |
| `price` | DecimalField(10,2) | |
| `location` | CharField(150) | Free-text location string |
| `image` | CloudinaryField | Folder `DRF/products`, nullable |
| `seller` | FK → User (CASCADE) | `related_name="products"` |
| `is_sold` | BooleanField (default False) | Flipped by checkout |
| `created_at` | DateTimeField (auto_now_add) | |
| `updated_at` | DateTimeField (auto_now) | |

### 2.3 Relationships

```
User 1 ──── * Product   (seller)
```

There is **no Order model** in the current schema — checkout only flips `is_sold`. Adding an `Order`/`OrderItem` model is on the roadmap (see §7).

---

## 3. Authentication Flow

### 3.1 Registration

1. Frontend `Register` page validates email/password with react-hook-form (email pattern, min 8 chars).
2. Dispatches `registerUser` → `POST /api/register/` with `{ email, password }`.
3. Backend `RegisterSerializer` creates a user with `username = email`.
4. Frontend shows "Registration Successful".

### 3.2 Login

1. Frontend `Login` page collects email/password.
2. Dispatches `loginUser` → `POST /api/login/` → `EmailTokenObtainPairSerializer` authenticates by email and returns `{ access, refresh }`.
3. Tokens are stored in `localStorage` and Redux state.
4. `fetchProfile` is called with the access token → `GET /api/profile/` → user object stored in Redux; `isAuthenticated = true`.
5. Redirect to `/`.

### 3.3 Token refresh (automatic)

The Axios response interceptor (`src/services/api.jsx`) watches for `401` responses. When one occurs and a refresh token exists, it calls `POST /api/token/refresh/`, stores the new access (and rotated refresh) token, and replays the original request. On refresh failure it dispatches `auth/logout`, clearing tokens and redirecting the user to login.

### 3.4 Logout

1. Frontend calls `POST /api/logout/` with `{ refresh }` and the access token header.
2. Backend `LogoutAPIView` (SimpleJWT `TokenBlacklistView`) blacklists the refresh token.
3. Frontend clears tokens from `localStorage` and Redux.

### 3.5 JWT configuration

```python
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME":  timedelta(minutes=30),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "ROTATE_REFRESH_TOKENS":  True,
    "BLACKLIST_AFTER_ROTATION": True,
    "AUTH_HEADER_TYPES":      ("Bearer",),
}
```

---

## 4. Request / Data Flows

### 4.1 Browse products

```
Home mount → dispatch(fetchProducts())
  → GET /api/products/
  → ProductListCreateAPIView.get_queryset()
      filters is_sold=False, applies min_price/max_price
  → ProductSerializer (seller read-only)
  → Redux products.products
  → grid render with Cloudinary image URLs
```

### 4.2 Create product

```
CreateProduct submit → FormData (title, description, price, location, image)
  → dispatch(createProduct) → POST /api/products/ (Bearer)
  → ProductListCreateAPIView.perform_create sets seller=request.user
  → CloudinaryField uploads image to folder DRF/products
  → returns serialized product
  → Redux products.products.push(...)
  → navigate('/my_products')
```

### 4.3 Edit product

```
EditProduct mount → fetchProductById(id) → GET /api/products/{id}/
  → reset form with product values
submit → FormData (optional image)
  → PATCH /api/products/{id}/ (Bearer)
  → IsSellerOrReadOnly checks obj.seller == request.user
  → update + optional image replace
  → navigate('/my_products')  (note: not awaited)
```

### 4.4 Delete product

```
MyProducts → confirm → DELETE /api/products/{id}/ (Bearer)
  → ownership check → delete
  → Redux removes from products & myProducts
```

### 4.5 Checkout (transactional)

```
Cart → handleCheckout → dispatch(createCheckout({ product_ids, accessToken }))
  → POST /api/checkout/ (Bearer)
  → CheckoutAPIView.post:
      with transaction.atomic():
        products = Product.objects.select_for_update().filter(id__in=product_ids)
        validate count == len(product_ids)
        validate none are already sold
        products.update(is_sold=True)
  → 200 { message: "Checkout successful" }  or 400 { error }
  → on success: clear cart, alert, navigate('/my_products')
```

`select_for_update()` locks the rows for the duration of the transaction, preventing two concurrent buyers from purchasing the same product.

---

## 5. Why These Choices (Design Rationale)

| Decision | Why |
|:---------|:----|
| **Django REST Framework + React SPA** instead of server-rendered Django templates | Clean separation of concerns; the API can serve a web app, mobile app, or third party without changes. Frontend gets HMR and modern tooling. |
| **JWT (SimpleJWT)** instead of session cookies | Stateless auth fits a decoupled SPA and avoids CSRF complexity; refresh rotation + blacklisting limit token theft windows. |
| **Email as `USERNAME_FIELD`** | Users remember emails, not usernames; aligns with modern SaaS UX. |
| **Cloudinary** instead of local media | No media server to operate; CDN delivery and automatic transformations; survives ephemeral container filesystems. |
| **`is_sold` boolean on Product** instead of a separate inventory table | Minimal schema for an MVP marketplace; keeps queries simple (`filter(is_sold=False)`). |
| **`transaction.atomic` + `select_for_update`** in checkout | Correctness over speed: prevents overselling under concurrency. |
| **Object-level `IsSellerOrReadOnly`** | Enforces ownership at the API boundary, not just the UI, so a crafted request can't modify someone else's product. |
| **Custom exception handler** | Guarantees a uniform error envelope (`{ success, message, error }`) so the frontend can parse failures consistently. |
| **Redux Toolkit** | Reduces boilerplate for async flows (createAsyncThunk) and keeps auth/product/cart state centralized. |
| **Vite** | Fast dev server with HMR; modern ESM-first build. |
| **react-hook-form** | Performant, uncontrolled forms with declarative validation; avoids re-rendering the whole form on each keystroke. |

---

## 6. Security Notes (and gaps to close before production)

**Already in place**
- Passwords hashed via Django's default validators (similarity, min length, common, numeric).
- JWT access tokens short-lived (30 min); refresh rotated and blacklisted.
- Ownership enforced server-side via `IsSellerOrReadOnly`.
- Checkout uses row-level locking to prevent races.
- CORS restricted to the Vite dev origin.

**Gaps / hardening required before production**
1. `SECRET_KEY` is hard-coded in `settings.py` and committed — move to an env var and rotate.
2. `DEBUG = True` and `ALLOWED_HOSTS = []` — set `DEBUG=False`, populate `ALLOWED_HOSTS`.
3. `CLOUDINARY_URL` is the only env var documented; add `SECRET_KEY`, `DEBUG`, `ALLOWED_HOSTS`, DB credentials, `CORS_ALLOWED_ORIGINS`.
4. No HTTPS enforcement / secure cookie settings (not applicable to JWT, but HSTS/SSL redirect needed at the proxy).
5. Frontend hard-codes `baseURL` and `CLOUD_NAME` — move to Vite env vars.
6. Tokens are stored in `localStorage` (XSS-exposed). For a higher-security posture, prefer httpOnly cookies or keep tokens in memory with refresh via cookie.
7. No rate limiting on auth endpoints (consider DRF throttling).
8. `accounts` and `products` models are **not registered** in Django admin — no admin UI exists yet.
9. No tests (both `tests.py` files are empty).
10. `User.username` is still required/unique at DB level even though login is email-based; consider a fully custom user without username.
11. Migration `0002_alter_user_managers` sets managers to `[]` — verify the custom manager is still wired at runtime (it is, via `objects = UserManager()` on the model, but the migration is misleading).

---

## 7. Roadmap

- [ ] **Order model** — persist checkout as `Order` + `OrderItem` with status (pending/paid/shipped/delivered).
- [ ] **Payment integration** — Stripe/Razorpay for real payments (currently checkout just marks sold).
- [ ] **Search & filters** — full-text search, category, location filtering, sorting.
- [ ] **Pagination** on product list.
- [ ] **Image gallery** — multiple images per product.
- [ ] **User profile** — edit name, avatar, contact info.
- [ ] **Reviews & ratings**.
- [ ] **Wishlist / favorites**.
- [ ] **Notifications** — email on sale/purchase.
- [ ] **Admin dashboard** — register models, custom admin views, sales analytics.
- [ ] **Tests** — unit + integration tests for auth, products, checkout (target ≥80% coverage).
- [ ] **Docker** — containerize backend + frontend + Postgres.
- [ ] **CI/CD** — GitHub Actions for lint, tests, build.
- [ ] **PostgreSQL** in production; SQLite only for dev.
- [ ] **Move secrets to env** and add `.env.example` for both apps.
- [ ] **TypeScript** migration for the frontend.

---

## 8. Lessons Learned

- **Decoupling pays off**: keeping Django as a pure JSON API means the frontend can be rewritten or a mobile client added without touching the backend.
- **Ownership must be enforced server-side**: UI-only guards are insufficient; `IsSellerOrReadOnly` is the real gate.
- **Concurrency is real**: even a simple "mark as sold" needs `select_for_update` + `atomic` once two users can act at once.
- **Token refresh UX**: an Axios interceptor that silently refreshes and replays requests keeps the user logged in without interrupting their flow.
- **Consistent error shapes**: normalizing errors in one place (`custom_exception_handler`) saves defensive code in every frontend call.
- **Cloudinary integration**: storing only the public id and building the CDN URL on the client keeps DB rows small and lets you change transformations later.

---

## 9. Troubleshooting

| Symptom | Likely cause | Fix |
|:--------|:-------------|:----|
| CORS error in browser | Frontend origin not in `CORS_ALLOWED_ORIGINS` | Add `http://localhost:5173` (or your origin) to settings |
| `401 Unauthorized` on protected routes | Access token expired / missing | Login again; check interceptor refresh logic |
| Image not rendering | Wrong `CLOUD_NAME` or Cloudinary URL | Verify cloud name and that `CLOUDINARY_URL` is set |
| `Product image upload fails` | Missing `CLOUDINARY_URL` | Add to `backend/config/config/.env` |
| Migrations out of sync | Schema changed without migration | Run `makemigrations` then `migrate` |
| Frontend can't reach API | Backend not running or wrong `baseURL` | Start `runserver`; check `api.jsx` |
| `no such table` on first run | DB not migrated | Run `python manage.py migrate` |

---

## 10. API Quick Reference (compact)

```
POST   /api/register/            public
POST   /api/login/                public  → { access, refresh }
POST   /api/logout/               auth    body { refresh }
GET    /api/profile/              auth
POST   /api/token/                public
POST   /api/token/refresh/        public  body { refresh }
POST   /api/token/verify/         public
GET    /api/products/             public  ?min_price=&max_price=
POST   /api/products/             auth    multipart/form-data
GET    /api/products/{id}/        public
PUT    /api/products/{id}/        auth (seller)
PATCH  /api/products/{id}/        auth (seller)
DELETE /api/products/{id}/        auth (seller)
GET    /api/my_products/          auth
POST   /api/checkout/             auth    body { product_ids: [..] }
```

---

<div align="center">
  <p>See also: <a href="../README.md">README.md</a> · <a href="https://github.com/abin-jacob-dev/Ecommerce-Platform-DjangoAPI-React">Repository</a></p>
</div>
