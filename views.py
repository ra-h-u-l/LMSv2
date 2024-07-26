from flask import render_template_string, render_template, jsonify, request
from flask_security import auth_required, current_user, roles_required, roles_accepted, SQLAlchemyUserDatastore
from extensions import db, security
from flask_security.utils import hash_password, verify_password
from models import User, Role

userDatastore = SQLAlchemyUserDatastore(db, User, Role)

def create_views(app):
    # homepage
    @app.route("/")
    def home():
        return render_template("index.html")

    # admin login
    @app.route("/adminlogin", methods=["POST"])
    def adminlogin():
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"error": "Please provide all required fields"}), 400

        admin = userDatastore.find_user(email=email)
        if not admin:
            return jsonify({"error": "Invalid email or password"}), 401

        if verify_password(password, admin.password):
            return jsonify({"message": "Login successful"}), 200
        else:
            return jsonify({"error": "Icorrect password"}), 401

    # user signup
    @app.route("/usersignup", methods=["POST"])
    def usersignup():
        data = request.get_json()
        fullName = data.get("fullName")
        email = data.get("email")
        password = data.get("password")
        role = data.get("role")

        if not email or not password or not fullName:
            return jsonify({"error": "Please provide all required fields"}), 400


        if userDatastore.find_user(email=email):
            return jsonify({"error": "User already exists"}), 400
        else:
            user_role = userDatastore.find_or_create_role(role)
            userDatastore.create_user(
                fullName=fullName,
                email=email,
                password=hash_password(password),
                roles=[user_role]
            )
            db.session.commit()

            return jsonify({"message": "User created successfully"}), 201

    # user login
    @app.route("/userlogin", methods=["POST"])
    def userlogin():
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"error": "Please provide all required fields"}), 400

        user = userDatastore.find_user(email=email)
        if not user:
            return jsonify({"error": "Invalid email or password"}), 401

        if verify_password(password, user.password):
            return jsonify({"message": "Login successful"}), 200
        else:
            return jsonify({"error": "Icorrect password"}), 401

    @app.route("/userdashboard")
    # @auth_required("session", "token")
    def userDashboard():
        return jsonify({"message": "User Dashboard"}), 200