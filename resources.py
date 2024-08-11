from flask_restful import Resource, Api, reqparse
from models import *
from extensions import db, cache
from flask_security import auth_required, roles_required, roles_accepted

api = Api()

# To convert data to dictionary
parser = reqparse.RequestParser()

# Api will accept these arguments as request body
parser.add_argument("id", type = int)
parser.add_argument("section_name", type = str)
parser.add_argument("description", type = str)
parser.add_argument("book_name", type = str)
parser.add_argument("section_id", type = int)
parser.add_argument("content", type = str)
parser.add_argument("authors", type = str)
parser.add_argument("total_copies", type = int)
parser.add_argument("book_price", type = int)


# Sections API ================================================================================================
class SectionsApi(Resource):
    @auth_required("token")
    @roles_accepted("admin", "user")
    @cache.cached(timeout = 30)
    def get(self):
        all_sections = Sections.query.all()
        all_sections_data = []
        for sec in all_sections:
            sec_info = {}
            sec_info["section_id"] = sec.section_id
            sec_info["section_name"] = sec.section_name
            sec_info["date_created"] = f"{sec.date_created.strftime('%d')}-{sec.date_created.strftime('%b')}-{sec.date_created.strftime('%Y')}"
            sec_info["last_updated"] = f"{sec.last_updated.strftime('%d')}-{sec.last_updated.strftime('%b')}-{sec.last_updated.strftime('%Y')}"
            sec_info["description"] = sec.description
            all_sections_data.append(sec_info)

        return all_sections_data, 200

    @auth_required("token")
    @roles_required("admin")
    def post(self):
        data = parser.parse_args()
        existing_section = Sections.query.filter_by(section_name = data["section_name"]).first()
        if existing_section:
            return {"message": "Section already exists"}, 400

        new_section = Sections(section_name = data["section_name"], description = data["description"])
        db.session.add(new_section)
        db.session.commit()
        return {"message": "Section created successfully"}, 201

    @auth_required("token")
    @roles_required("admin")
    def put(self):
        data = parser.parse_args()
        section = Sections.query.get(data["id"])
        if not section:
            return {"message": "Section doesn't exist"}, 404

        section.section_name = data["section_name"]
        section.last_updated = datetime.now()
        section.description = data["description"]
        db.session.commit()
        return {"message": "Section updated successfully"}, 200

    @auth_required("token")
    @roles_required("admin")
    def delete(self):
        data = parser.parse_args()
        section = Sections.query.get(data["id"])
        if not section:
            return {"message": "Section doesn't exist"}, 404

        books = Books.query.filter_by(section_id = section.section_id).all()
        if books:
            return {"message": "Section can't be deleted as it has books"}, 400

        db.session.delete(section)
        db.session.commit()
        return {"message": "Section deleted successfully"}, 200


# Books API ================================================================================================
class BooksApi(Resource):
    @auth_required("token")
    @roles_accepted("admin", "user")
    @cache.cached(timeout = 30)
    def get(self):
        all_books = Books.query.all()
        all_books_data = []
        for book in all_books:
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
            all_books_data.append(book_info)

        return all_books_data, 200

    @auth_required("token")
    @roles_required("admin")
    def post(self):
        data = parser.parse_args()
        existing_book = Books.query.filter_by(book_name = data["book_name"]).first()
        if existing_book:
            return {"message": "Book already exists"}, 400

        new_book = Books(
                book_name = data["book_name"],
                description = data["description"],
                section_id = data["section_id"],
                content = data["content"],
                authors = data["authors"],
                total_copies = data["total_copies"],
                available_copies = data["total_copies"],
                issued_copies = 0,
                sold_copies = 0,
                book_price = data["book_price"]
            )
        section = Sections.query.get(data["section_id"])
        if  not section:
            return {"message": "Section doesn't exist"}, 404

        db.session.add(new_book)
        db.session.commit()
        return {"message": "Book created successfully"}, 201

    @auth_required("token")
    @roles_required("admin")
    def put(self):
        data = parser.parse_args()
        book = Books.query.get(data["id"])
        if not book:
            return {"message": "Book doesn't exist"}, 404

        book.book_name = data["book_name"]
        book.last_updated = datetime.now()
        book.description = data["description"]
        book.section_id = data["section_id"]
        book.content = data["content"]
        book.authors = data["authors"]
        if data["total_copies"] < (book.issued_copies + book.sold_copies):
            return {"message": "Total copies can't be less than issued and sold copies"}, 400
        book.total_copies = data["total_copies"]
        book.available_copies = data["total_copies"] - (book.issued_copies + book.sold_copies)
        book.book_price = data["book_price"]
        db.session.commit()
        return {"message": "Book updated successfully"}, 200

    @auth_required("token")
    @roles_required("admin")
    def delete(self):
        data = parser.parse_args()
        book = Books.query.get(data["id"])
        if not book:
            return {"message": "Book doesn't exist"}, 404

        history = UserBookHistory.query.filter_by(book_id = data["id"]).all()
        if history:
            return {"message": "Book can't be deleted as it has user history"}, 400

        requested = RequestedBooks.query.filter_by(book_id = data["id"]).all()
        if requested:
            return {"message": "Book can't be deleted as it has user requests"}, 400

        current = CurrentlyIssuedBooks.query.filter_by(book_id = data["id"]).all()
        if current:
            return {"message": "Book can't be deleted as it is currently issued"}, 400

        sold = SoldBooks.query.filter_by(book_id = data["id"]).all()
        if sold:
            return {"message": "Book can't be deleted as it is sold"}, 400

        rated = BookRating.query.filter_by(book_id = data["id"]).all()
        if rated:
            return {"message": "Book can't be deleted as it is rated"}, 400
            
        db.session.delete(book)
        db.session.commit()
        return {"message": "Book deleted successfully"}, 200


# API endpoints ====================================================================================================
api.add_resource(SectionsApi, "/api/sections")
api.add_resource(BooksApi, "/api/books")