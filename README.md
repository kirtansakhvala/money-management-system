# Smart Student Money Management System

Full-stack, mobile-first money management app for students.

## Tech Stack

- Frontend: React (Vite), Tailwind CSS, React Router, Axios, Chart.js, Framer Motion
- Backend: Node.js, Express.js, REST API, MVC architecture
- Database: MySQL
- Auth: JWT + bcrypt password hashing
- PWA: Service worker + installable app support

## Project Structure

```
money management/
  backend/
    src/
      config/ models/ controllers/ routes/ middleware/ utils/
    schema.sql
    .env.example
  frontend/
    src/
      api/ components/ contexts/ hooks/ pages/ utils/
    .env.example
```

## Features

- JWT Register/Login + protected routes
- Dashboard with total income, expenses, remaining balance
- Expense + income tracking
- Budget management with 80% warning
- Reports with pie chart + line chart
- Savings goals tracking
- Smart insights (AI-like suggestions)
- Toast notifications
- Date/category/search filters
- Mobile bottom nav + desktop sidebar
- Floating action button and swipe-to-delete transactions
- Voice expense input via Web Speech API
- PDF report export
- Dark/light mode toggle
- Loading skeletons/spinners + smooth animations
- Offline caching + PWA install support

## Database Setup

1. Create a MySQL database and run:
   - `backend/schema.sql`
2. This creates tables:
   - `users`
   - `income`
   - `expenses`
   - `budgets`
   - `goals`
3. Includes indexes for query performance and scalability.

## Environment Variables

### Backend (`backend/.env`)

Copy from `backend/.env.example`:

```
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=student_money_manager
JWT_SECRET=replace_with_secure_random_secret
```

### Frontend (`frontend/.env`)

Copy from `frontend/.env.example`:

```
VITE_API_URL=http://localhost:5000/api
```

## Run Locally

### 1) Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:5000`.

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## API Endpoints

### Auth
- `POST /api/register`
- `POST /api/login`

### Income
- `POST /api/income`
- `GET /api/income`

### Expense
- `POST /api/expense`
- `GET /api/expense`
- `DELETE /api/expense/:id`

### Budget
- `POST /api/budget`
- `GET /api/budget`

### Goals
- `POST /api/goals`
- `PUT /api/goals/:id`
- `GET /api/goals`

### Reports
- `GET /api/reports/summary`
- `GET /api/reports/analytics`
- `GET /api/reports/insights`

## Scalability and Production Notes

- Backend organized using MVC + middleware layers
- Pagination on list endpoints
- Indexed MySQL queries
- Centralized error handling
- Environment-based config
- API response caching on frontend
- Lazy-loaded pages for performance

## Deployment

- Frontend: Vercel
- Backend: Render
- Database: Railway or PlanetScale

Make sure to update environment variables in each deployment platform.
