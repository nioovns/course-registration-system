# Student Course Registration Management System

## Project Overview
The Student Course Registration Management System is a web-based application designed to simplify and automate course management and student enrollment in an academic environment.

The system supports three primary roles:
- **Admin**: manages courses and system data
- **Student**: browses, searches, and enrolls in courses
- **Professor**: monitors courses and manages enrolled students

The project follows a **decoupled architecture**, where the backend and frontend are completely separated:

- **Backend**: RESTful APIs built using Django and Django REST Framework
- **Frontend**: Independent client implemented with HTML, CSS, and JavaScript that consumes the APIs

All backend APIs are documented using Swagger (OpenAPI).

---

## System Architecture & Design Decisions
- Django REST Framework is used to build scalable and maintainable RESTful APIs.
- The frontend is implemented using vanilla JavaScript to remain lightweight and framework-independent.
- SQLite is used as the database for simplicity and easy setup, as this is an academic project.
- Backend and frontend communicate exclusively through HTTP-based APIs.

---

## Technology Stack

### Backend
- Python 3.9+
- Django
- Django REST Framework (DRF)
- SQLite

### Frontend
- HTML5
- CSS3
- JavaScript (Vanilla JS)

### Other Tools
- Git & GitHub
- Virtual Environment (venv)
- Swagger (OpenAPI)

---

## Prerequisites
Before running the project, ensure the following are installed:
- Python 3.9 or higher
- pip
- Git (optional)

Check Python installation:
```bash

python --version
```

### Downloading the Project

-If you received the project as a ZIP file, extract it first.

Or clone using Git:
```bash
    git clone <repository-url>
    cd course-registration-system
```

### Backend Setup
Creating a Virtual Environment
`python -m venv venv `

### Activating the Virtual Environment

-Windows

`venv\Scripts\activate`


### Linux / macOS

`source venv/bin/activate`

### Installing Dependencies
`pip install -r requirements.txt`

#### Database Setup (Migrations)
```bash
python manage.py makemigrations
python manage.py migrate
```

### Creating Admin (Superuser)
```python manage.py createsuperuser```
-Enter the required credentials (username and password).

### Running the Project

***Note: This project does not use Django render. The Backend and Frontend run completely separately.***

### Running Backend (Django API)
```python manage.py runserver```


### Backend URLs:
```bash
http://127.0.0.1:8000/
http://127.0.0.1:8000/admin/

```
### API Documentation (Swagger)

The backend APIs are fully documented using Swagger (OpenAPI).

Swagger UI is available at:
```bash
http://127.0.0.1:8000/swagger/
```
#### The documentation includes:

- Available API endpoints
- Request and response schemas
- Authentication requirements
- Role-based access information

### Authentication in Swagger

Some endpoints require authentication.

- To test protected endpoints:
- Obtain a token from the login endpoint
- Click the Authorize button in Swagger
Enter the token in the following format:
```
Bearer <your_access_token>
``` 
### Running the Frontend

The frontend runs independently and does not require Django rendering.

Navigate to the frontend directory:
```
cd frontend/Pages
```

Then open the login page directly in your browser:
```
login.html
```

Alternatively, run the frontend using a simple local server (recommended), for example with Live Server:
```bash 
http://127.0.0.1:5500/frontend/Pages/login.html

```

- The frontend communicates with the backend through RESTful APIs using JavaScript (Fetch API).

### User Management

Log in to the Django admin panel:
```bash 
http://127.0.0.1:8000/admin/

```

### Create users and assign one of the following roles:

- Admin
- Student
- Professor

After creating users, open login.html in your browser to use the system.

#### Features by Role

## Admin

- Admin authentication
- Create, update, delete, and view courses
- Set minimum and maximum allowed units

## Student

- View available courses
- Search courses
- Enroll in courses
- Drop enrolled courses

## Professor

- View assigned courses
- View enrolled students for each course
- Remove students from courses if necessary