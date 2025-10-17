# BakeStatements Backend API

Backend server for BakeStatements - a financial management platform for home bakers.

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up PostgreSQL database:
```bash
createdb bakestatements
createuser bakestatements_user -P
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Run database migrations:
```bash
npm run db:migrate
```

5. Start development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/profile` - Get user profile (authenticated)
- `PUT /api/auth/profile` - Update user profile (authenticated)

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order

### Expenses
- `GET /api/expenses` - Get all expenses
- `GET /api/expenses/summary` - Get expenses summary by category
- `GET /api/expenses/:id` - Get single expense
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Recipes
- `GET /api/recipes` - Get all recipes
- `GET /api/recipes/:id` - Get single recipe with ingredients
- `GET /api/recipes/:id/cost` - Calculate recipe cost
- `POST /api/recipes` - Create new recipe
- `PUT /api/recipes/:id` - Update recipe
- `DELETE /api/recipes/:id` - Delete recipe

### Ingredients
- `GET /api/ingredients` - Get all ingredients
- `GET /api/ingredients/:id` - Get single ingredient
- `POST /api/ingredients` - Create new ingredient
- `PUT /api/ingredients/:id` - Update ingredient
- `DELETE /api/ingredients/:id` - Delete ingredient

### Stripe/Payments
- `POST /api/stripe/create-checkout` - Create Stripe checkout session
- `POST /api/stripe/webhook` - Handle Stripe webhooks
- `GET /api/stripe/subscription-status` - Get subscription status

## Development

```bash
npm run dev     # Start development server with hot reload
npm run build   # Build for production
npm start       # Start production server
```

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. Set production environment variables in `.env`

3. Run migrations:
```bash
npm run db:migrate
```

4. Start the server:
```bash
npm start
```

## Environment Variables

See `.env.example` for all required environment variables.
