from flask_security import SQLAlchemyUserDatastore
from flask_security.utils import hash_password
from extensions import db

def create_data(user_datastore):
    # create roles
    admin_role = user_datastore.find_or_create_role(name="admin", description="Administrator")
    user_role = user_datastore.find_or_create_role(name="user", description="General User")

    # create user data
    if not user_datastore.find_user(email="admin@gmail.com"):
        user_datastore.create_user(
            fullName="Rahul Kumar",
            email="admin@gmail.com",
            password=hash_password("Pass@123"),
            type="admin",
            active=True,
            roles=[admin_role]
        )

    if not user_datastore.find_user(email="user1@gmail.com"):
        user_datastore.create_user(
            fullName="Ravi Kumar",
            email="user1@gmail.com",
            password=hash_password("Pass@123"),
            active=True,
            roles=[user_role]
        )

    db.session.commit()
    print("Data created successfully")
