# Django + Gatsby : Auction Application

This is a demo application built with Django and Gatsby.

The project hierarchy is as follows:

```
Root
    |
    |__ backend
    |__ frontend
    |__ README.md
    |__ requirements.txt
```

Clone the repository in your local storage.

## Prerequisites

Project Backend is built with Django and frontend with Gatsby. It has been tested with the following:

### Backend
1. Python 3.6.8
2. virtualenv 20.2.2


### Frontend
1. npm@7.3.0
2. Gatsby CLI version: 3.4.0
3. Gatsby version: 3.14.2

## How to run the Backend
In a Terminal:

1. First go to the root directory.
2. Create a virtual enviornment with `virualenv env`
3. Activate the virual enviornment:
    - Windows: `env\Scripts\activate`
    - Linux: `source env/bin/activate`
4. Install requirements `pip install -r requirements.txt`
5. Goto the backend directory `cd backend`.
6. Create all the database migrations `python manage.py makemigrations`.
7. Run all the created database migrations `python manage.py migrate`.
8. Create a super user `python manage.py createsuperuser` and follow the wizard.
9. Load dummy data `python manage.py loaddata data.js`.
10. Run the project `python manage.py runserver`

## How to run the Frontend
In a Terminal

1. From the root goto the frontend directory `cd frontend`.
2. Install the requirements `npm install`
3. Run the project `npm run develop`.

## Accessing the Backend

You can access the backend admin section when running the default dev server with `http://localhost:8000/admin` with the admin credentials that you setup in the step 8 above. Backend API is exposed on the base URL `http://localhost:8000/api`

## Accessing the Frontend

Access the frontend with `http://localhost:3500/`

There are two users created when running the dummy data command above in step 9 with the following credentials:

```
username: user1
password: 123
```

```
username: user2
password: 123
```

You can login with these to test out the system.
