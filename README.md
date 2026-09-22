# Course Registration System

A Django foundation for building a course registration platform for students, instructors, and administrators.

The current repository contains the backend project structure, Django administration, SQLite development database configuration, and dependency setup. The application domain modules and user-facing frontend are intended to be added as the system evolves.

## Technology stack

- Python
- Django 5.2
- Django REST Framework
- SQLite for local development
- HTML/CSS/JavaScript or a separate frontend application

## Current structure

```text
course-registration-system/
├── backend/
│   └── core/
│       ├── core/
│       │   ├── settings.py
│       │   ├── urls.py
│       │   ├── asgi.py
│       │   └── wsgi.py
│       └── manage.py
├── frontend/
│   └── .gitkeep
└── requirements.txt
```

## Getting started

### Prerequisites

- Python 3.10 or newer
- pip
- Git

### Installation

```bash
git clone https://github.com/nioovns/course-registration-system.git
cd course-registration-system
```

Create and activate a virtual environment:

```bash
python -m venv .venv
```

macOS/Linux:

```bash
source .venv/bin/activate
```

Windows PowerShell:

```powershell
.venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Move to the Django backend:

```bash
cd backend/core
```

Apply migrations:

```bash
python manage.py migrate
```

Create an administrator account:

```bash
python manage.py createsuperuser
```

Start the development server:

```bash
python manage.py runserver
```

The application will be available at `http://127.0.0.1:8000/`.

Django Admin is available at `http://127.0.0.1:8000/admin/`.

## Development commands

Run database migrations:

```bash
python manage.py makemigrations
python manage.py migrate
```

Run the test suite:

```bash
python manage.py test
```

Open the Django shell:

```bash
python manage.py shell
```

Collect static files for deployment:

```bash
python manage.py collectstatic
```

## Planned domain modules

The project structure is ready to be extended with modules such as:

- Student profiles
- Instructor profiles
- Departments and academic terms
- Courses and prerequisites
- Course sections and schedules
- Enrollment, withdrawal, and waitlist workflows
- Capacity management
- Conflict detection for class schedules
- Role-based access control
- REST API endpoints for a frontend application
- Notifications for enrollment and course changes

## Suggested application structure

As the system grows, domain logic can be separated into Django apps:

```text
backend/core/
├── accounts/
├── courses/
├── enrollments/
├── schedules/
├── notifications/
├── api/
└── core/
```

This keeps course management, enrollment rules, authentication, and API concerns independent and easier to test.

## Security notes

The current configuration is intended for local development.

Before deploying to production:

- Move `SECRET_KEY` to an environment variable.
- Set `DEBUG=False`.
- Configure `ALLOWED_HOSTS`.
- Use PostgreSQL instead of SQLite.
- Enable HTTPS.
- Configure secure cookies and CSRF settings.
- Store credentials outside the repository.
- Add production logging, monitoring, and backup procedures.

## Roadmap

- [ ] Create core domain models
- [ ] Add role-based authentication
- [ ] Build course and section management
- [ ] Implement registration and withdrawal rules
- [ ] Add schedule conflict validation
- [ ] Expose REST API endpoints
- [ ] Build the frontend interface
- [ ] Add automated tests and CI
- [ ] Prepare Docker-based deployment

## License

No license has been specified yet. Add a license file before distributing or accepting external contributions.
