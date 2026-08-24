# NexCart

NexCart is a full-stack e-commerce application with a responsive Next.js storefront and an Express/MongoDB API. It includes product discovery, authentication, cart and wishlist management, checkout/order tracking, reviews, email notifications, and an admin product workspace.

## Features

- Product catalog with categories, search-friendly product pages, ratings, reviews, stock, badges, and image galleries
- Login and registration using email or phone number
- Protected account, cart, wishlist, and orders pages
- Persistent cart, wishlist, profile, addresses, payments, coupons, and orders through browser storage
- Product reviews for authenticated users
- Admin product create, update, delete, and image upload workflows
- Product image optimization to WebP using Sharp
- Order and welcome email notifications through Nodemailer
- Responsive UI with Framer Motion animations, Tailwind CSS, and React Icons

## Tech Stack

### Frontend

- Next.js 16 App Router
- React 19 and TypeScript
- Tailwind CSS 4
- Axios, Framer Motion, React Hot Toast, React Icons

### Backend

- Node.js and Express 5
- MongoDB with Mongoose
- JWT authentication and bcrypt password hashing
- Multer and Sharp for image uploads
- Nodemailer for email notifications

## Project Structure

```text
NexCart/
├── backend/
│   ├── config/          # Database connection
│   ├── middleware/      # Authentication and admin guards
│   ├── models/          # User and Product schemas
│   ├── public/uploads/  # Optimized uploaded product images
│   ├── routes/          # Auth, products, upload, and email APIs
│   ├── index.js         # Express server entrypoint
│   └── seed.js          # Default product catalog seeder
└── frontend/
    ├── app/             # Next.js routes and pages
    └── src/              # Components, contexts, layouts, and views
```

## Requirements

- Node.js 18.18 or newer
- npm
- MongoDB running locally or a MongoDB connection URI

## Local Setup

Clone the repository and install dependencies separately for each application:

```bash
cd backend
npm install

cd ../frontend
npm install
```

### Backend environment

Create `backend/.env`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/nexcart
PORT=5000
FRONTEND_ORIGIN=http://localhost:3000
JWT_SECRET=replace_with_a_long_random_secret

# Optional SMTP configuration for real email delivery
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_app_password
SMTP_FROM="NexCart Support" <noreply@nexcart.com>
```

`MONGO_URI`, `PORT`, `FRONTEND_ORIGIN`, and `JWT_SECRET` have development fallbacks. Use a strong, unique `JWT_SECRET` outside local development. SMTP variables are optional; without them, the mailer uses an Ethereal test account or JSON fallback.

### Frontend environment

Copy `frontend/.env.example` to `frontend/.env.local` and set the API base URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Do not commit `.env` or `.env.local` files. The frontend also has a Next.js rewrite for `/api/*` requests.

## Running Locally

Start MongoDB first, then run the backend and frontend in separate terminals.

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The backend health endpoint is available at [http://localhost:5000/api/health](http://localhost:5000/api/health).

## Database Seeding

To replace the current product catalog with the default 11-product catalog:

```bash
cd backend
npm run seed
```

Seeding deletes existing products before inserting the defaults. Make sure the configured MongoDB database is the one you intend to modify.

## Available Scripts

### Backend

| Command | Description |
| --- | --- |
| `npm run dev` | Start the API with Nodemon |
| `npm start` | Start the API with Node.js |
| `npm run seed` | Clear and seed the product catalog |

### Frontend

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create a production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Frontend Routes

| Route | Purpose |
| --- | --- |
| `/` | Store homepage |
| `/auth` | Login and registration |
| `/categories` | Product categories |
| `/categories/[id]` | Products filtered by category |
| `/products/[id]` | Product details, gallery, bundle options, and reviews |
| `/cart` | Cart and checkout |
| `/orders` | Order history and delivery timeline |
| `/wishlist` | Saved products |
| `/account` | Profile, addresses, payments, coupons, and rewards |
| `/admin` | Admin product management |

Account, cart, wishlist, and order pages require authentication. Admin product actions additionally require an admin account.

## API Overview

- `GET /api/health` - API health check
- `POST /api/auth/register` - Register a user
- `POST /api/auth/login` - Log in with email or phone
- `GET /api/auth/me` - Get the authenticated user
- `GET /api/products` - List products
- `GET /api/products/:id` - Get a product
- `POST /api/products` - Create a product (admin)
- `PUT /api/products/:id` - Update a product (admin)
- `DELETE /api/products/:id` - Delete a product (admin)
- `POST /api/products/:id/reviews` - Add a review (authenticated)
- `POST /api/upload` - Upload and optimize a product image (admin)
- `POST /api/email/welcome` - Send a welcome email
- `POST /api/email/order-event` - Send an order status email

Protected API requests use a JWT bearer token in the `Authorization` header.
