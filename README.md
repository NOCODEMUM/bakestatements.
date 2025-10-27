# BakeStatements - Complete Internal Architecture

BakeStatements is a financial management platform for home bakers with a fully internal backend API, authentication system, and database.

## Architecture Overview

This application has been completely rebuilt with an internal architecture:

### Backend (Node.js/Express)
- Custom JWT-based authentication with refresh tokens
- PostgreSQL database with comprehensive migrations
- RESTful API for all operations
- Stripe payment integration for subscriptions
- Email notifications via Nodemailer
- Security middleware (Helmet, CORS, rate limiting)

### Frontend (React + Vite)
- React 18 with TypeScript
- Tailwind CSS for styling
- React Router v7 for navigation
- Custom API client layer (no Supabase dependency)
- Context API for state management

### Database (PostgreSQL)
- User management with authentication
- Orders, expenses, recipes, ingredients tracking
- Invoices and customer enquiries
- Automated timestamp triggers
- Comprehensive indexing for performance

## Quick Start with Docker

The easiest way to run the complete stack:

```bash
# Start all services (frontend, backend, database)
docker-compose up -d

# Run database migrations
docker-compose exec backend npm run db:migrate

# Access the application
# Frontend: http://localhost:5173
# Backend API: http://localhost:3001
# PostgreSQL: localhost:5432
```

## Manual Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### 1. Database Setup

```bash
# Create database and user
createdb bakestatements
createuser bakestatements_user -P
# Password: bakestatements_dev_password
```

### 2. Backend Setup

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your configuration
npm run db:migrate
npm run dev
```

Backend will run at: http://localhost:3001

### 3. Frontend Setup

```bash
# From project root
npm install
echo "VITE_API_URL=http://localhost:3001/api" > .env
npm run dev
```

Frontend will run at: http://localhost:5173

## API Documentation

All API endpoints require authentication (except /auth/* endpoints).
Include JWT token in Authorization header: `Bearer <token>`

### Authentication Endpoints
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Sign in
- `POST /api/auth/logout` - Sign out
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/profile` - Get current user
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/forgot-password` - Request reset
- `POST /api/auth/reset-password` - Reset password

### Resource Endpoints
- **Orders**: `/api/orders` (GET, POST, PUT/:id, DELETE/:id)
- **Expenses**: `/api/expenses` (GET, POST, PUT/:id, DELETE/:id)
  - `GET /api/expenses/summary` - Category breakdown
- **Recipes**: `/api/recipes` (GET, POST, PUT/:id, DELETE/:id)
  - `GET /api/recipes/:id/cost` - Calculate cost
- **Ingredients**: `/api/ingredients` (GET, POST, PUT/:id, DELETE/:id)
- **Stripe**:
  - `POST /api/stripe/create-checkout` - Create payment session
  - `POST /api/stripe/webhook` - Handle Stripe events
  - `GET /api/stripe/subscription-status` - Check subscription

## Environment Variables

### Backend (server/.env)
```env
NODE_ENV=development
PORT=3001
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=bakestatements_user
DATABASE_PASSWORD=your_secure_password
DATABASE_NAME=bakestatements
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
STRIPE_SECRET_KEY=your_stripe_key
FRONTEND_URL=http://localhost:5173
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api
```

## Development Commands

### Backend
```bash
cd server
npm run dev          # Development with hot reload
npm run build        # TypeScript compilation
npm start            # Production server
npm run db:migrate   # Run database migrations
```

### Frontend
```bash
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview build locally
npm run lint         # Run ESLint
```

## Features

### User Management
- Email/password authentication
- 7-day free trial for new users
- Password reset via email
- Profile management (business name, ABN, phone)

### Subscription Management
- Monthly plan: $19 AUD/month
- Annual plan: $199 AUD/year
- Lifetime plan: $299 AUD (one-time)
- Stripe payment processing
- Webhook handling for subscription events

### Business Operations
- Order tracking with status management
- ATO-compliant expense categorization
- Recipe costing with ingredient tracking
- Invoice generation
- Customer enquiry management
- Dashboard with analytics

### Security Features
- JWT tokens with 15-minute expiry
- Refresh tokens with 7-day expiry
- Bcrypt password hashing
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Helmet security headers
- SQL injection protection

## Database Schema

### Main Tables
- **users**: Authentication and profile data
- **refresh_tokens**: JWT refresh token management
- **orders**: Customer orders and deliveries
- **expenses**: Business expenses with ATO categories
- **recipes**: Baking recipes and instructions
- **ingredients**: Ingredient inventory and costs
- **recipe_ingredients**: Recipe-ingredient relationships
- **invoices**: Generated invoices
- **enquiries**: Customer enquiries

All tables include:
- UUID primary keys
- Timestamps (created_at, updated_at)
- Foreign key constraints
- Indexed columns for performance

## Production Deployment

### 1. Prepare Environment
```bash
# Set NODE_ENV=production
# Configure production database
# Set strong JWT secrets
# Configure production Stripe keys
# Set up SMTP for emails
```

### 2. Build Applications
```bash
# Backend
cd server
npm install --production
npm run build

# Frontend
cd ..
npm install --production
npm run build
```

### 3. Deploy
- Deploy frontend `dist/` folder to CDN or static host
- Deploy backend to Node.js hosting (e.g., Railway, Render, DigitalOcean)
- Run migrations on production database
- Configure Stripe webhooks to point to your domain

## Troubleshooting

### Database Connection Failed
```bash
# Check PostgreSQL is running
sudo service postgresql status

# Test connection
psql -h localhost -U bakestatements_user -d bakestatements
```

### Port Already in Use
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Or change PORT in server/.env
```

### JWT Token Errors
- Check JWT_SECRET is set in server/.env
- Ensure frontend is sending token in Authorization header
- Verify token hasn't expired (tokens expire after 15 minutes)

### Email Not Sending
- For Gmail: Enable "App Passwords" in Google Account settings
- Use app password instead of regular password
- Check EMAIL_HOST, EMAIL_USER, EMAIL_PASSWORD in server/.env

## Project Structure

```
bakestatements/
├── server/                     # Backend API
│   ├── src/
│   │   ├── config/            # Database, environment config
│   │   ├── controllers/       # Business logic handlers
│   │   ├── middleware/        # Auth, validation, security
│   │   ├── routes/            # Express route definitions
│   │   ├── utils/             # JWT, email helpers
│   │   └── index.ts           # Express app entry
│   ├── .env                   # Backend environment vars
│   ├── package.json
│   └── tsconfig.json
├── src/                        # Frontend React app
│   ├── components/            # Reusable UI components
│   ├── contexts/              # React Context providers
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # API client, utilities
│   ├── pages/                 # Page components
│   └── main.tsx               # React entry point
├── public/                     # Static assets (images, etc)
├── .env                        # Frontend environment vars
├── docker-compose.yml          # Docker orchestration
├── package.json
└── README.md
```

## Migration from Supabase

This application was originally built with Supabase but has been completely rebuilt with:

### Replaced:
- ❌ Supabase Auth → ✅ Custom JWT authentication
- ❌ Supabase Database → ✅ Self-hosted PostgreSQL
- ❌ Supabase Edge Functions → ✅ Express API endpoints
- ❌ Supabase Realtime → ✅ REST API with manual refresh
- ❌ @supabase/supabase-js → ✅ Custom API client

### Benefits:
- Complete data ownership
- No external service dependencies
- Lower long-term costs
- Full customization capability
- Easier debugging and monitoring
- Can deploy anywhere (no vendor lock-in)

## Support

For issues or questions about the internal architecture:
1. Check this README thoroughly
2. Review server logs: `docker-compose logs backend`
3. Check database migrations: `server/src/config/migrate.ts`
4. Verify environment variables are set correctly

## License

Proprietary - BakeStatements © 2025
