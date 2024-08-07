from flask import render_template_string, render_template, jsonify, request
from flask_security import auth_required, current_user, roles_required, roles_accepted, SQLAlchemyUserDatastore
from extensions import db, security
from flask_security.utils import hash_password, verify_password
# from models import User, Role
from models import *

userDatastore = SQLAlchemyUserDatastore(db, User, Role)

def create_views(app):
    # homepage
    @app.route("/")
    def home():
        return render_template("index.html")

    # admin login
    @app.route("/adminlogin", methods=["POST"])
    def adminLogin():
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"error": "Please provide all required fields"}), 400

        admin = userDatastore.find_user(email=email)
        if not admin:
            return jsonify({"error": "Invalid email or password"}), 401

        if verify_password(password, admin.password):
            return jsonify({"email" : admin.email,
                            "fullName" : admin.fullName,
                            "id" : admin.id,
                            "role" : admin.roles[0].name,
                            "token" : admin.get_auth_token()
                            }), 200
        else:
            return jsonify({"error": "Icorrect password"}), 401

    # admin dashboard
    @app.route("/admindashboard", methods=["GET", "POST"])
    @auth_required("token")
    @roles_required("admin")
    def adminDashboard():
        return jsonify({"message": "Admin Dashboard"}), 200

    # particular section books
    @app.route("/sectionbooks", methods=["POST"])
    @auth_required("token")
    @roles_accepted("admin", "user")
    def particularSectionBooks():
        data = request.get_json()
        section_id = data.get("section_id")

        if not section_id:
            return jsonify({"error": "Please provide all required fields"}), 400

        books = Books.query.filter_by(section_id=section_id).all()

        book_data = []
        for book in books:
            book_info = {}
            book_info["book_id"] = book.book_id
            book_info["book_name"] = book.book_name
            book_info["section_id"] = book.section.section_id
            book_info["section_name"] = book.section.section_name
            book_info["date_created"] = f"{book.date_created.strftime('%d')}-{book.date_created.strftime('%b')}-{book.date_created.strftime('%Y')}"
            book_info["last_updated"] = f"{book.last_updated.strftime('%d')}-{book.last_updated.strftime('%b')}-{book.last_updated.strftime('%Y')}"
            book_info["description"] = book.description
            book_info["content"] = book.content
            book_info["authors"] = book.authors
            book_info["total_copies"] = book.total_copies
            book_info["available_copies"] = book.available_copies
            book_info["issued_copies"] = book.issued_copies
            book_info["sold_copies"] = book.sold_copies
            book_info["book_price"] = book.book_price
            book_info["rating"] = book.rating
            book_data.append(book_info)

        return book_data, 200


    # user signup
    @app.route("/usersignup", methods=["POST"])
    def userSignup():
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
    def userLogin():
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"error": "Please provide all required fields"}), 400

        user = userDatastore.find_user(email=email)
        if not user:
            return jsonify({"error": "Invalid email or password"}), 401

        if verify_password(password, user.password):
            return jsonify({"email" : user.email,
                            "fullName" : user.fullName,
                            "id" : user.id,
                            "role" : user.roles[0].name,
                            "token" : user.get_auth_token()
                            }), 200
        else:
            return jsonify({"error": "Icorrect password"}), 401


    # user dashboard
    @app.route("/userdashboard", methods=["GET", "POST"])
    @auth_required("token")
    @roles_required("user")
    def userDashboard():
        return jsonify({"message": "User Dashboard"}), 200