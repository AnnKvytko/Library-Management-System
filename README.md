![Django](https://img.shields.io/badge/Django-5.x-green?logo=django)
![DRF](https://img.shields.io/badge/DRF-REST%20API-red)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?logo=postgresql)
![Redis](https://img.shields.io/badge/Redis-7-red?logo=redis)
![Celery](https://img.shields.io/badge/Celery-5.x-green)
![Docker](https://img.shields.io/badge/Docker-Compose-blue?logo=docker)

A full-stack **Library Management System** built with Django, Celery, Redis, PostgreSQL, and React.  
It supports user roles, book borrowing, automated reminders, and background task processing.

## Features

- JWT Authentication
- Google OAuth Login
- Role-based access control
- Book borrowing and tracking
- Favorite books
- Email notifications
- Automated order expiration
- Due date reminders
- REST API with Django REST Framework
- Background task processing with Celery
- Task scheduling with Celery Beat
- Redis message broker
- Dockerized development environment
- React frontend built with Vite

---

## Tech Stack

**Backend**
- Django 5+
- Django REST Framework
- PostgreSQL 15

**Async / Background Jobs**
- Celery
- Celery Beat
- Redis

**Frontend**
- React + Vite

**DevOps**
- Docker
- Docker Compose

---

## Core Functionality

### Authentication
- JWT Authentication
- Google OAuth Login
- Role-based authorization

### Book Management
- Create, update, and delete books
- Search and filter books
- Author management
- Favorite books

### Order Management
- Create borrowing requests
- Track order status
- Automatic expiration handling
- Due date calculations

### Notifications
- Order confirmation emails
- Due date reminders
- Expired order notifications

---

## 👥 User Roles

### Reader
- Browse books
- Add books to favorites
- Borrow books
- Track active and previous orders
- Manage profile information

### Librarian
- Manage books and authors
- View all users
- Manage orders
- Update order statuses
- Monitor library activity

---

📸 Screenshots

This section shows the main user interface of the application.

These screenshots help you quickly understand how the system looks and works.

🏠 Home Page

👉 Landing page of the application where users can browse available books.

📚 Books List

👉 Displays all available books with filtering and search functionality.

👤 User Profile

👉 Shows user information, borrowed books, and activity history.

📦 Orders Page

👉 Displays active, pending, and completed book orders.

🔐 Login Page

👉 Authentication page with email/password and Google OAuth login.

---

🐳 Quick Start (Recommended)

1. Clone repository
git clone https://github.com/AnnKvytko/Library-Management-System.git
cd Library-Management-System

2. Create environment file for a local configuration
cp .env.example .env

3. Run the project (Docker)
docker compose up --build

👉 This command will:

build Docker images
start backend (Django)
start frontend (React)
start database (PostgreSQL)
start Redis
start Celery worker
start Celery Beat

4. Run database migrations
docker compose exec web python manage.py migrate

5. Setup periodic tasks
docker compose exec web python manage.py setup_periodic_tasks

👉 This registers scheduled background tasks in the database.

6. Open the application
Backend API → http://localhost:8000
Frontend (React) → http://localhost:5173

---

💻 Local Setup (without Docker)

This setup is for running the project without Docker, using your local Python, Node.js, and PostgreSQL/Redis installations.

1. Clone repository
git clone https://github.com/AnnKvytko/Library-Management-System.git
cd Library-Management-System

2. Create environment file for a local configuration
cp .env.example .env

3. Create virtual environment
python -m venv venv

4. Activate virtual environment
Windows:
venv\Scripts\activate
Mac / Linux:
source venv/bin/activate

5. Install backend dependencies
pip install -r requirements.txt

6. Run database migrations
python manage.py migrate

7. ▶️ Start Django backend
python manage.py runserver

Backend will run at:
http://127.0.0.1:8000

8. Celery (Background Tasks)
You must run Celery in separate terminals.
Start Celery Worker:
celery -A library worker -l info

Handles background tasks like:
sending emails
updating orders
processing logic

9. Start Celery Beat (scheduler)
celery -A library beat -l info

Runs scheduled tasks like:
checking expired orders
sending reminders

10. Frontend (React)
You must also run the frontend separately.

Go to frontend folder:
cd frontend
Install dependencies:
npm install
Start React development server:
npm run dev

Frontend will run at:
http://127.0.0.1:5173

---

⚙️ Architecture Overview

Frontend (React)
        ↓
Backend (Django REST API)
        ↓
PostgreSQL (Database)
        ↓
Redis (Message Broker)
        ↓
Celery Worker (Background Tasks)
        ↑
Celery Beat (Task Scheduler)

---

📄 Environment Variables (.env)

This file contains all sensitive configuration for the project.
It is REQUIRED for the project to run.

Create .env file command
cp .env.example .env

🔐 SECURITY SETTINGS

SECRET_KEY=your-django-secret-key
DEBUG=True

DATABASE CONFIGURATION
DB_NAME=library
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=db
DB_PORT=5432

💡 Important:
Inside Docker → use db
Outside Docker → use localhost

CELERY / REDIS
CELERY_BROKER_URL=redis://redis:6379/0

FRONTEND CONFIGURATION
FRONTEND_URL=http://127.0.0.1:5173
VITE_API_URL=http://127.0.0.1:8000

EMAIL (Brevo SMTP)
EMAIL_HOST=smtp-relay.brevo.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-brevo-login-email
EMAIL_HOST_PASSWORD=your-brevo-smtp-key
EMAIL_USE_TLS=True

DEFAULT_FROM_EMAIL=library.managment.2026@gmail.com

EMAIL_HOST → SMTP server (Brevo)
EMAIL_PORT → connection port
EMAIL_HOST_USER → your Brevo email
EMAIL_HOST_PASSWORD → SMTP key (NOT your password)
EMAIL_USE_TLS → secure email connection
DEFAULT_FROM_EMAIL → sender email shown to users

GOOGLE OAUTH2
Used for Google login authentication:
GOOGLE_OAUTH2_KEY=your-google-client-id
GOOGLE_OAUTH2_SECRET=your-google-client-secret

GOOGLE_OAUTH2_KEY → identifies your app in Google system
GOOGLE_OAUTH2_SECRET → private authentication key

