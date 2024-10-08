from flask import render_template_string, render_template, jsonify, request, send_file, after_this_request
from flask_security import auth_required, current_user, roles_required, roles_accepted, SQLAlchemyUserDatastore
from extensions import db, security
from flask_security.utils import hash_password, verify_password
from models import *
from datetime import datetime, timedelta
from fpdf import FPDF
from celery.result import AsyncResult
from tasks import add, create_csv_report

userDatastore = SQLAlchemyUserDatastore(db, User, Role)

def create_views(app):
    # celery (for demo) - backend jobs ==============================================================
    @app.route("/celerydemo")
    def celery_demo():
        task = add.delay(10, 20)
        return jsonify({"task_id": task.id}), 200

    @app.route("/get-task/<task_id>")
    def get_task(task_id):
        result = AsyncResult(task_id)

        if result.ready():
            return jsonify({"result": result.result}), 200
        else:
            return "task not ready", 405

    # generate report (actual backend jobs) ============================================================
    @app.route("/admingeneratereport", methods=["GET"])
    @auth_required("token")
    @roles_required("admin")
    def adminGenerateReport():
        if request.method == "GET":
            task = create_csv_report.delay()
            return jsonify({"task_id": task.id}), 200

    # get generated report
    @app.route("/admingetreport/<task_id>")
    @auth_required("token")
    @roles_required("admin")
    def adminGetReport(task_id):
        result = AsyncResult(task_id)

        if result.ready():
            return send_file("./downloads/report.csv", as_attachment=True), 200
        else:
            return jsonify({"result": "File is not ready for download. Please wait."}), 405



    # homepage =======================================================================================
    @app.route("/")
    def home():
        return render_template("index.html")

    # admin login ====================================================================================
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

    # admin dashboard ================================================================================
    @app.route("/admindashboard", methods=["GET", "POST"])
    @auth_required("token")
    @roles_required("admin")
    def adminDashboard():
        return jsonify({"message": "Admin Dashboard"}), 200

    # particular section books ========================================================================
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

    # admin grant book request ========================================================================
    @app.route("/grantbook", methods=["POST"])
    @auth_required("token")
    @roles_required("admin")
    def grantBook():
        if request.method == "POST":
            data = request.get_json()
            book_id = data.get("book_id")
            user_id = data.get("user_id")

            if not book_id or not user_id:
                return jsonify({"error": "Please provide all required fields"}), 400

            book = RequestedBooks.query.filter_by(book_id=book_id, user_id=user_id).first()

            if not book:
                return jsonify({"error": "Book request not found"}), 404

            granted_book = CurrentlyIssuedBooks(
                book_id = book_id,
                user_id = user_id,
                date_requested = book.date_requested,
                date_issued = datetime.now(),
                days_requested = 7
            )
            actual_book = Books.query.get(book_id)
            actual_book.available_copies = actual_book.available_copies - 1
            actual_book.issued_copies = actual_book.issued_copies + 1

            history_update = UserBookHistory(
                book_id = book_id,
                user_id = user_id,
                book_name = actual_book.book_name,
                date_issued = datetime.now()
            )

            db.session.add(granted_book)
            db.session.add(history_update)
            db.session.delete(book)
            db.session.commit()

            return jsonify({"message": "Book issued/granted successfully"}), 200

    # currently issued books ===========================================================================
    @app.route("/currentlyissuedbooks", methods=["GET"])
    @auth_required("token")
    @roles_accepted("admin", "user")
    def currentlyIssuedBooks():
        books = CurrentlyIssuedBooks.query.all()
        if not books:
            return jsonify({"error": "No books currently issued"}), 404
        book_data = []
        for book in books:
            book_info = {}
            book_info["book_id"] = book.book_id
            book_info["book_name"] = Books.query.get(book.book_id).book_name
            book_info["user_id"] = book.user_id
            book_info["user_name"] = User.query.get(book.user_id).fullName
            book_info["date_issued"] = f"{book.date_issued.strftime('%d')}-{book.date_issued.strftime('%b')}-{book.date_issued.strftime('%Y')}"
            book_info["date_requested"] = f"{book.date_requested.strftime('%d')}-{book.date_requested.strftime('%b')}-{book.date_requested.strftime('%Y')}"
            book_data.append(book_info)

        return book_data, 200

    # admin cancel book request =======================================================================
    @app.route("/cancelbookrequest", methods=["POST"])
    @auth_required("token")
    @roles_required("admin")
    def adminCancelBookRequest():
        if request.method == "POST":
            data = request.get_json()
            book_id = data.get("book_id")
            user_id = data.get("user_id")

            if not book_id or not user_id:
                return jsonify({"error": "Please provide all required fields"}), 400

            book = RequestedBooks.query.filter_by(book_id=book_id, user_id=user_id).first()

            if not book:
                return jsonify({"error": "Book request not found"}), 404

            db.session.delete(book)
            db.session.commit()

            return jsonify({"message": "Book request canceled successfully"}), 200


    # user signup =======================================================================
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

    # user login ======================================================================
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


    # user dashboard ===================================================================
    @app.route("/userdashboard", methods=["GET", "POST"])
    @auth_required("token")
    @roles_required("user")
    def userDashboard():
        return jsonify({"message": "User Dashboard"}), 200

    # user borrow book =================================================================
    @app.route("/userborrowbook", methods=["GET","POST"])
    @auth_required("token")
    @roles_accepted("admin", "user")
    def userBorrowBook():
        if request.method == "GET":
            requestedBooksList = []
            reqBooks = RequestedBooks.query.all()

            if not reqBooks:
                return jsonify({"message": "No books requested"}), 404

            for reqBook in reqBooks:
                reqBookInfo = {}
                reqBookInfo["book_id"] = reqBook.book_id
                reqBookInfo["book_name"] = Books.query.get(reqBook.book_id).book_name
                reqBookInfo["user_id"] = reqBook.user_id
                reqBookInfo["user_name"] = User.query.get(reqBook.user_id).fullName
                reqBookInfo["date_requested"] = f"{reqBook.date_requested.strftime('%d')}-{reqBook.date_requested.strftime('%b')}-{reqBook.date_requested.strftime('%Y')}"
                requestedBooksList.append(reqBookInfo)

            return requestedBooksList, 200

        if request.method == "POST":
            data = request.get_json()

            if SoldBooks.query.filter_by(book_id = data["book_id"], user_id = data["user_id"]).first():
                return jsonify({"message": "You have already bought this book"}), 400

            available_copies = Books.query.get(data["book_id"]).available_copies
            if available_copies == 0:
                return jsonify({"message": "Book not available for borrowing"}), 400

            if RequestedBooks.query.filter_by(book_id = data["book_id"], user_id = data["user_id"]).first():
                return jsonify({"message": "Book already requested"}), 400

            requested_books_count = RequestedBooks.query.filter_by(user_id = data["user_id"]).count()
            issued_books_count = CurrentlyIssuedBooks.query.filter_by(user_id = data["user_id"]).count()
            print(requested_books_count, issued_books_count)

            if requested_books_count + issued_books_count >= 5:
                return jsonify({"message": "You can't request more than 5 books"}), 400

            newRequest = RequestedBooks(book_id = data["book_id"], user_id = data["user_id"])
            db.session.add(newRequest)
            db.session.commit()
            return jsonify({"message": "Book requested successfully"}), 201

    # user read book ===================================================================
    @app.route("/userreadbook", methods=["POST"])
    @auth_required("token")
    @roles_accepted("user")
    def userReadBook():
        if request.method == "POST":
            data = request.get_json()
            book = Books.query.get(data["book_id"])
            if not book:
                return jsonify({"message": "Book not found"}), 404

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

            return book_info, 200

    # return book ======================================================================
    @app.route("/returnbook", methods=["POST"])
    @auth_required("token")
    @roles_accepted("user", "admin")
    def returnBook():
        if request.method == "POST":
            data = request.get_json()
            user_id = data["user_id"]
            book_id = data["book_id"]
            book = Books.query.get(data["book_id"])
            if not book:
                return jsonify({"message": "Book not found"}), 404

            book.available_copies += 1
            book.issued_copies -= 1

            currently_issued_book = CurrentlyIssuedBooks.query.filter_by(user_id = user_id, book_id = book_id).first()

            if not currently_issued_book:
                return jsonify({"message": "Book not issued"}), 400

            from sqlalchemy import desc

            history_record = UserBookHistory.query.filter_by(user_id=user_id, book_id=book_id).order_by(UserBookHistory.date_issued.desc()).first()
            history_record.date_returned = datetime.now()

            db.session.delete(currently_issued_book)
            db.session.commit()
            return jsonify({"message": "Book returned successfully"}), 200

    # book issued history ==============================================================
    @app.route("/bookissuedhistory", methods=["GET", "POST"])
    @auth_required("token")
    @roles_accepted("user", "admin")
    def bookissuedhistory():
        if request.method == "GET":
            history = UserBookHistory.query.order_by(UserBookHistory.date_issued.desc()).all()

            if not history:
                return jsonify({"message": "No history found"}), 404

            historyList = []

            for record in history:
                historyRecord = {}
                historyRecord["user_id"] = record.user_id
                historyRecord["user_name"] = User.query.get(record.user_id).fullName
                historyRecord["book_id"] = record.book_id
                historyRecord["book_name"] = record.book_name
                if record.date_issued:
                    historyRecord["date_issued"] = f"{record.date_issued.strftime('%d')}-{record.date_issued.strftime('%b')}-{record.date_issued.strftime('%Y')}"
                if record.date_returned:
                    historyRecord["date_returned"] = f"{record.date_returned.strftime('%d')}-{record.date_returned.strftime('%b')}-{record.date_returned.strftime('%Y')}"
                else:
                    historyRecord["date_returned"] = "Currently Issued"
                if record.date_bought:
                    historyRecord["date_bought"] = f"{record.date_bought.strftime('%d')}-{record.date_bought.strftime('%b')}-{record.date_bought.strftime('%Y')}"
                else:
                    historyRecord["date_bought"] = "NA"
                if record.is_bought:
                    historyRecord["is_bought"] = "Yes"
                    historyRecord["date_returned"] = None
                else:
                    historyRecord["is_bought"] = "No"
                historyList.append(historyRecord)

            return historyList, 200

        if request.method == "POST":
            data = request.get_json()
            user_id = data["user_id"]

            history = UserBookHistory.query.filter_by(user_id = user_id).order_by(UserBookHistory.date_issued.desc()).all()

            if not history:
                return jsonify({"message": "No history found"}), 404

            historyList = []

            for record in history:
                historyRecord = {}
                historyRecord["user_id"] = record.user_id
                historyRecord["user_name"] = User.query.get(record.user_id).fullName
                historyRecord["book_id"] = record.book_id
                historyRecord["book_name"] = record.book_name
                if record.date_issued:
                    historyRecord["date_issued"] = f"{record.date_issued.strftime('%d')}-{record.date_issued.strftime('%b')}-{record.date_issued.strftime('%Y')}"
                if record.date_returned:
                    historyRecord["date_returned"] = f"{record.date_returned.strftime('%d')}-{record.date_returned.strftime('%b')}-{record.date_returned.strftime('%Y')}"
                else:
                    historyRecord["date_returned"] = "Currently Issued"
                if record.date_bought:
                    historyRecord["date_bought"] = f"{record.date_bought.strftime('%d')}-{record.date_bought.strftime('%b')}-{record.date_bought.strftime('%Y')}"
                else:
                    historyRecord["date_bought"] = "NA"
                if record.is_bought:
                    historyRecord["is_bought"] = "Yes"
                else:
                    historyRecord["is_bought"] = "No"
                historyList.append(historyRecord)

            return historyList, 200

    # rate book ============================================================
    @app.route("/ratebook", methods=["POST"])
    @auth_required("token")
    @roles_accepted("user")
    def ratebook():
        if request.method == "POST":
            data = request.get_json()
            user_id = data["user_id"]
            book_id = data["book_id"]
            rating = data["rating"]
            review = data["review"]
            
            myRatingRecord = BookRating.query.filter_by(user_id = user_id, book_id = book_id).first()
            if myRatingRecord:
                return jsonify({"message": "You have already rated this book"}), 400

            book = Books.query.get(book_id)

            if not book:
                return jsonify({"message": "Book not found"}), 404

            ratingData = BookRating(
                book_id = book_id,
                user_id = user_id,
                rating = rating,
                review = review,
                date_rated = datetime.now()
            )
            db.session.add(ratingData)
            db.session.commit()

            bookRatingRecords = BookRating.query.filter_by(book_id = book_id).all()
            if bookRatingRecords:
                book = Books.query.get(book_id)
                totalRatings = 0
                count = 0

                for record in bookRatingRecords:
                    totalRatings += record.rating
                    count += 1
                
                book.rating = round((totalRatings/count), 1)
                
                db.session.commit()

            return jsonify({"message": "Rating updated successfully"}), 200

    # stats ========================================================================================================
    @app.route("/stats", methods=["GET", "POST"])
    @auth_required("token")
    @roles_accepted("admin", "user")
    def stats():
        if request.method == "GET":
            from sqlalchemy import func
            distinct_subquery = db.session.query(
                                                    UserBookHistory.book_id, UserBookHistory.user_id
                                                ).distinct().subquery()
        
            # Count the number of rows in the subquery
            readBooks = db.session.query(func.count()).select_from(distinct_subquery).scalar()
        
            boughtBooks = SoldBooks.query.count()
            currentlyIssuedBooks = CurrentlyIssuedBooks.query.count()
            pendingRequests = RequestedBooks.query.count()
            return {"readBooks": readBooks, "boughtBooks": boughtBooks, "currentlyIssuedBooks": currentlyIssuedBooks, "pendingRequests": pendingRequests}, 200

        if request.method == "POST":
            data = request.get_json()
            user_id = data["user_id"]
            
            from sqlalchemy import func
            readBooks = (
                        db.session.query(func.count(UserBookHistory.book_id.distinct()))
                        .filter_by(user_id=user_id)
                        .scalar()
                    )

            boughtBooks = SoldBooks.query.filter_by(user_id = user_id).count()

            return {"readBooks": readBooks, "boughtBooks": boughtBooks}, 200




    # search ================================================================================================
    @app.route("/search", methods=["POST"])
    @auth_required("token")
    @roles_accepted("admin", "user")
    def search():
        if request.method == "POST":
            data = request.get_json()
            keyword = data["keyword"]
            results = Books.query.all()
            if not results:
                return jsonify({"message": "No results found"}), 404
            
            finalResults = []
            for book in results:
                if keyword.lower() in (book.book_name + book.section.section_name + book.authors).lower():
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
                    finalResults.append(book_info)

            return finalResults, 200

    # buy book ================================================================================================
    @app.route("/buybook", methods=["POST"])
    @auth_required("token")
    @roles_accepted("user")
    def buybook():
        if request.method == "POST":
            data = request.get_json()
            user_id = data["user_id"]
            book_id = data["book_id"]

            already_bought = UserBookHistory.query.filter_by(user_id = user_id, book_id = book_id).all()
            if already_bought:
                for record in already_bought:
                    if record.is_bought == True:
                        return jsonify({"message": "Book already bought"}), 400

            book = Books.query.get(book_id)
            if not book:
                return jsonify({"message": "Book not found"}), 404

            if book.available_copies == 0:
                return jsonify({"message": "Book not available"}), 400

            book.available_copies -= 1
            book.sold_copies += 1
            db.session.commit()

            history = UserBookHistory(
                user_id = user_id,
                book_id = book_id,
                book_name = book.book_name,
                date_bought = datetime.now(),
                is_bought = True,
            )
            db.session.add(history)

            sold = SoldBooks(
                user_id = user_id,
                book_id = book_id,
                date_sold = datetime.now(),
            )
            db.session.add(sold)

            db.session.commit()

            return jsonify({"message": "Book bought successfully"}), 200

    # sold books ==============================================================================================
    @app.route("/soldbooks", methods=["GET", "POST"])
    @auth_required("token")
    @roles_accepted("admin", "user")
    def soldbooks():
        if request.method == "GET":
            history = UserBookHistory.query.filter_by(is_bought = True).all()

            if not history:
                return jsonify({"message": "No books sold"}), 404

            soldBooks = []
            for record in history:
                book_info = {}
                book_info["date_bought"] = f"{record.date_bought.strftime('%d')}-{record.date_bought.strftime('%b')}-{record.date_bought.strftime('%Y')}"
                book_info["fullName"] = User.query.get(record.user_id).fullName
                book = Books.query.get(record.book_id)
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
                soldBooks.append(book_info)

            return soldBooks, 200

        if request.method == "POST":
            data = request.get_json()
            user_id = data["user_id"]
            
            history = UserBookHistory.query.filter_by(user_id = user_id, is_bought = True).all()

            if not history:
                return jsonify({"message": "No books Bought"}), 404

            boughtBooks = []

            for record in history:
                book = Books.query.get(record.book_id)
                book_info = {}
                book_info["date_bought"] = f"{record.date_bought.strftime('%d')}-{record.date_bought.strftime('%b')}-{record.date_bought.strftime('%Y')}"
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
                boughtBooks.append(book_info)

            return boughtBooks, 200

    # download book =============================================================================================
    @app.route("/downloadbook", methods=["POST"])
    @auth_required("token")
    @roles_accepted("user")
    def downloadbook():
        if request.method == "POST":
            data = request.get_json()
            book_id = data["book_id"]
            user_id = data["user_id"]
            book = Books.query.get(book_id)
            if not book:
                return jsonify({"message": "Book doesn't exist"}), 404

            content = book.content

            # Generate pdf file
            pdf = FPDF()
            pdf.add_page()
            pdf.set_font("Arial", size = 12)
            # Add content to PDF
            lines = content.split("\n")
            for line in lines:
                while len(line) > 95:
                    pdf.cell(200, 10, txt=line[:95], ln=True)
                    line = line[95:]
                pdf.cell(200, 10, txt=line, ln=True)

            # Save the PDF to a file
            file_path = f"static/{user_id}_{book.book_name}.pdf"
            pdf.output(file_path)

            @after_this_request
            def remove_file(response):
                try:
                    os.remove(file_path)
                except Exception as error:
                    print(f"Error removing or closing downloaded file handle: {error}")
                return response
            
            return send_file(file_path, as_attachment=True), 200

    # view rating ===============================================================================================
    @app.route("/viewrating", methods=["GET", "POST"])
    @auth_required("token")
    @roles_accepted("admin", "user")
    def viewrating():
        if request.method == "POST":
            data = request.get_json()
            book_id = data["book_id"]
            ratings = BookRating.query.filter_by(book_id = book_id).all()
            if not ratings:
                return jsonify({"message": "No ratings found"}), 404

            data = []

            for rating in ratings:
                rating_info = {}
                rating_info["book_id"] = rating.book_id
                rating_info["book_name"] = Books.query.get(rating.book_id).book_name
                rating_info["user_id"] = rating.user_id
                rating_info["fullName"] = User.query.get(rating.user_id).fullName
                rating_info["rating"] = rating.rating
                rating_info["review"] = rating.review
                rating_info["date_rated"] = f"{rating.date_rated.strftime('%d')}-{rating.date_rated.strftime('%b')}-{rating.date_rated.strftime('%Y')}"
                data.append(rating_info)

            return data, 200