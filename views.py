from flask import render_template_string, render_template, jsonify, request
from flask_security import auth_required, current_user, roles_required, SQLAlchemySessionUserDatastore
from extensions import db, security
from flask_security.utils import hash_password
from models import *

def create_views(app):
    # homepage
    @app.route("/")
    def home():
        return render_template("index.html")

    # user signup
    @app.route("/usersignup", methods=["POST"])
    def usersignup():
        data = request.get_json()
        fullName = data.get("fullName")
        email = data.get("email")
        password = data.get("password")
        role = data.get("role")

        if not email or not password:
            return jasonify({"error": "Please provide email and password"}), 400

        signupDatastore = SQLAlchemySessionUserDatastore(db, User, Role)        

        if signupDatastore.find_user(email=email):
            return jasonify({"error": "User already exists"}), 400
        else:
            try:
                signupDatastore.create_user(
                    fullName=fullName,
                    email=email,
                    password=hash_password(password),
                    roles=[role]
                )
                db.session.commit()

                return jsonify({"message": "User created successfully"}), 201
            except:
                db.session.rollback()
                return jsonify({"error": "Something went wrong"}), 500



    @app.route("/userDashboard")
    # @roles_required("user")
    @auth_required("session", "token")
    def userDashboard():
        return render_template_string("""
        <h1> This is user dashboard </h1>
        <a href="/logout">Logout</a>
        """)