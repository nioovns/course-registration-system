Course Registration System (Backend)

This project is the backend implementation of a university course registration platform built with Django and Django REST Framework (DRF). The system manages user roles (Students, Professors, Admins), handles secure authentication, and provides essential APIs for course selection and user management.

By the end of Sprint 1, the system includes:

Custom user model with multiple roles

JWT-based authentication (login, logout, token refresh)

Role-Based Access Control (RBAC)

Fully documented API via Swagger UI and ReDoc

Features
1. Authentication and Security

JWT authentication using SimpleJWT (Access and Refresh tokens)

Role-Based Access Control (Admin, Professor, Student)

Token blacklisting for secure logout

2. User Management

Custom user model extending Django's AbstractUser

Role-specific fields:

student_id for Students

professor_code for Professors

Built-in validation for ensuring data consistency

3. API Documentation

Automatic API documentation generated using Swagger UI and ReDoc

Browser-based interactive API testing

Prerequisites

Before installation, ensure the following tools are available:

Python 3.10 or higher

Git

Installation
1. Clone the Repository
git clone <your-repository-url>
cd course-registration-system

2. Create and Activate Virtual Environment

Windows:

python -m venv .venv
.\.venv\Scripts\activate


Linux/macOS:

python3 -m venv .venv
source .venv/bin/activate

3. Install Dependencies
pip install -r requirements.txt


If the file is missing, manually install:

django
djangorestframework
djangorestframework-simplejwt
drf-yasg

4. Database Setup
cd backend/core
python manage.py makemigrations
python manage.py migrate

5. Create Superuser
python manage.py createsuperuser

6. Run the Development Server
python manage.py runserver


Application will be available at:

http://127.0.0.1:8000

Important URLs
Service	URL	Description
Swagger UI	http://127.0.0.1:8000/swagger/
	Interactive API testing interface
Redoc	http://127.0.0.1:8000/redoc/
	Text-based API documentation
Admin Panel	http://127.0.0.1:8000/admin/
	Django admin interface
API Usage Guide (via Swagger)
1. Obtain a Token (Login)

Navigate to the POST route /api/auth/login/

Click "Try it out", enter username and password

Copy the access token returned

2. Authorize

Click the "Authorize" button and enter:

Bearer <your_access_token>

3. Access Role-Based Dashboards

Example for admin:

Navigate to /api/users/dashboard/admin/

Execute the request

Expected response: 200 OK

Running Tests

Run the automated test suite:

python manage.py test users


Expected output:

Ran X tests in Y seconds
OK

Project Structure
backend/
  └── core/
       ├── manage.py
       ├── core/                 # Project settings and root URLs
       └── users/                # Users application
            ├── models.py        # Custom user model
            ├── serializers.py   # Serializers and JWT customization
            ├── views.py         # Login, logout, dashboards
            ├── urls.py          # App routing
            ├── permissions.py   # Role-based permissions
            └── tests/           # Authentication and permission tests

