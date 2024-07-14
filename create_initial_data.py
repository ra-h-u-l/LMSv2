from flask_security import SQLAlchemyUserDatastore
from flask_security.utils import hash_password



def create_data(user_datastore):
    # create roles
    user_datastore.find_or_create_role(name="admin", description="Administrator")
    user_datastore.find_or_create_role(name="user", description="General User")

    # create user data
    if not user_datastore.find_user(email="admin@gmail.com"):
        user_datastore.create_user(
                                    email="admin@gmail.com",
                                    password=hash_password("123"),
                                    type="admin",
                                    active=True,
                                    roles=["admin"]
                                )

    if not user_datastore.find_user(email="user1@gmail.com"):
        user_datastore.create_user(
                                    email="user1@gmail.com",
                                    password=hash_password("user123"),
                                    type="user",
                                    active=True,
                                    roles=["user"]
                                )

    
    print("data created successfully")
