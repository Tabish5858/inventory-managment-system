# Inventory Management System

A complete inventory management solution built with Next.js frontend and Django REST Framework backend.

## Features

- **Product Management**: Add, edit, and delete products with detailed information
- **Category Management**: Organize products with custom categories
- **Transaction Tracking**: Record sales, purchases, returns, and inventory adjustments
- **Dashboard**: View inventory metrics and low stock alerts at a glance
- **Search & Filter**: Easily find products and transactions

## Tech Stack

- **Frontend**: Next.js with TypeScript
- **Backend**: Django REST Framework
- **Database**: SQLite (development), can be upgraded to PostgreSQL for production
- **Styling**: Tailwind CSS

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies (preferably in a virtual environment):

```bash
pip install -r requirements.txt  # If requirements.txt exists
# OR
pip install django djangorestframework django-cors-headers django-filter
```

3. Run migrations:

```bash
python manage.py migrate
```

4. Create a superuser (for admin access):

```bash
python manage.py createsuperuser
```

5. Start the Django development server:

```bash
python manage.py runserver
```

The Django backend will be available at http://localhost:8000/

### Frontend Setup

1. From the project root, install frontend dependencies:

```bash
npm install
```

2. Start the Next.js development server:

```bash
npm run dev
```

The frontend will be available at http://localhost:3000/

## Usage

1. Start both backend and frontend servers
2. Access the admin interface at http://localhost:8000/admin to manage data directly
3. Access the web application at http://localhost:3000

## API Endpoints

- **Products**: `/api/products/`
- **Categories**: `/api/categories/`
- **Transactions**: `/api/transactions/`

## Development Notes

- The backend uses Django's built-in SQLite database for simplicity in development
- For production, consider switching to PostgreSQL or another production-ready database
- Authentication is currently set to AllowAny for demonstration purposes - implement proper authentication for production use

## Project Structure

- `/app`: Next.js frontend code
  - `/app/services`: API services for communicating with the backend
  - `/app/products`, `/app/categories`, `/app/transactions`: Frontend pages
- `/backend`: Django backend code
  - `/backend/products`: Django app for products, categories, and transactions
  - `/backend/inventory_api`: Main Django project settings
