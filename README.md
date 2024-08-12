# Library Management System - V2

## Introduction

Welcome to the **Library Management System (LMS) - V2**. This application is designed to streamline library operations, offering a comprehensive solution for managing books, sections, users, and more. This guide will walk you through the steps required to set up and run the LMS on a Linux-based system or environment.


- Steps to run the application in linux based system/environment
    1. Install redis-server globally [sudo apt install redis-server]
    2. Create virtual environment [python3 -m venv env_name]
    3. Activate virtual environment [source env_name/bin/activate]
    4. Install all the dependencies from requirements.txt [pip install -r requirements.txt]
    5. Open 5 terminals (wsl in case of windows)
        - Terminal 1
            - Run redis-server [redis-server]   => globally
        - Terminal 2
            - Activate virtual environment [source env_name/bin/activate]
            - Run the application [python3 app.py]   => inside venv
        - Terminal 3
            - Activate virtual environment [source env_name/bin/activate]
            - Run MailHog server [~/go/bin/MailHog]   => inside venv
        - Terminal 4
            - Activate virtual environment [source env_name/bin/activate]
            - Run celery server for beat [celery -A app:celery_app beat -l INFO]   => inside venv
        - Terminal 5
            - Activate virtual environment [source env_name/bin/activate]
            - Run celery server for worker [celery -A app:celery_app worker -l INFO]   => inside venv
        

- Database will be created automatically after running the application with one admin and one user credentials
    - Admin [Email: admin@gmail.com, Password: Pass@123]
    - User [Email: user1@gmail.com, Password: Pass@123]