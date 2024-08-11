from extensions import db, security
from flask_security import UserMixin, RoleMixin
from flask_security.models import fsqla_v3 as fsq
from datetime import datetime, timedelta


fsq.FsModels.set_db_info(db)


# 1  -----------------------> user <-------------------
class User(db.Model, UserMixin):
    id = db.Column(db.Integer(), primary_key = True)
    fullName = db.Column(db.String(50), nullable = False)
    email = db.Column(db.String(50), nullable = False, unique = True)
    password = db.Column(db.String(50), nullable = False)
    active = db.Column(db.Boolean(), default = True)
    type = db.Column(db.String(), default="user")
    fs_uniquifier = db.Column(db.String(), nullable = False, unique = True)
    # Relationship
    roles = db.relationship("Role", secondary = "user_roles")


# 2  -----------------------> role <-------------------
class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer(), primary_key = True)
    name = db.Column(db.String(50), nullable = False, unique = True)
    description = db.Column(db.String())


# 3  -----------------------> user roles <-------------------
class UserRoles(db.Model):
    id = db.Column(db.Integer(), primary_key = True)
    user_id = db.Column(db.Integer(), db.ForeignKey("user.id"))
    role_id = db.Column(db.Integer(), db.ForeignKey("role.id"))


# 4  -----------------------> sections <-------------------
class Sections(db.Model):
    section_id = db.Column(db.Integer(), primary_key = True)
    section_name = db.Column(db.String(50), nullable = False)
    date_created = db.Column(db.DateTime(), default = datetime.now)
    last_updated = db.Column(db.DateTime(), default = datetime.now)
    description = db.Column(db.String(200))
    # Relationship
    books = db.relationship("Books", backref="section", lazy=True)


# 5  -----------------------> books <-------------------
class Books(db.Model):
    book_id = db.Column(db.Integer(), primary_key = True)
    book_name = db.Column(db.String(50), nullable = False)
    date_created = db.Column(db.DateTime(), default = datetime.now)
    last_updated = db.Column(db.DateTime(), default = datetime.now)
    description = db.Column(db.String(200))
    section_id = db.Column(db.Integer(), db.ForeignKey("sections.section_id"), nullable = False)
    content = db.Column(db.String(), nullable = False)
    authors = db.Column(db.String(), nullable = False)
    total_copies = db.Column(db.Integer(), nullable = False)
    available_copies = db.Column(db.Integer())
    issued_copies = db.Column(db.Integer())
    sold_copies = db.Column(db.Integer())
    book_price = db.Column(db.Integer(), default = 100)
    rating = db.Column(db.Float(), default = 0)


# 6  -----------------------> requested_books <-------------------
class RequestedBooks(db.Model):
    id = db.Column(db.Integer(), primary_key = True)
    book_id = db.Column(db.Integer(), db.ForeignKey("books.book_id"), nullable = False)
    user_id = db.Column(db.Integer(), db.ForeignKey("user.id"), nullable = False)
    date_requested = db.Column(db.DateTime(), default = datetime.now)
    days_requested = db.Column(db.Integer(), default = 7)

# 7  -----------------------> currently_issued_books <-------------------
class CurrentlyIssuedBooks(db.Model):
    id = db.Column(db.Integer(), primary_key = True)
    book_id = db.Column(db.Integer(), db.ForeignKey("books.book_id"))
    user_id = db.Column(db.Integer(), db.ForeignKey("user.id"))
    date_requested = db.Column(db.DateTime())
    date_issued = db.Column(db.DateTime())
    days_requested = db.Column(db.Integer(), nullable = False)


# 8  ------------------> sold_books <-----------------
class SoldBooks(db.Model):
    id = db.Column(db.Integer(), primary_key = True)
    book_id = db.Column(db.Integer(), db.ForeignKey("books.book_id"))
    user_id = db.Column(db.Integer(), db.ForeignKey("user.id"))
    date_sold = db.Column(db.DateTime(), default = datetime.now)



# 9  -------------------------> user_book_history_table <-----------------
class UserBookHistory(db.Model):
    id = db.Column(db.Integer(), primary_key = True)
    book_id = db.Column(db.Integer(), nullable = False)
    user_id = db.Column(db.Integer(), db.ForeignKey("user.id"), nullable = False)
    book_name = db.Column(db.String(), nullable = False)
    date_issued = db.Column(db.DateTime())
    date_returned = db.Column(db.DateTime())
    date_bought = db.Column(db.DateTime())
    is_bought = db.Column(db.Boolean(), default = False)


# 10  -------------------------> book_rating <-----------------
class BookRating(db.Model):
    id = db.Column(db.Integer(), primary_key = True)
    book_id = db.Column(db.Integer(), db.ForeignKey("books.book_id"))
    user_id = db.Column(db.Integer(), db.ForeignKey("user.id"))
    rating = db.Column(db.Integer(), nullable = False)
    review = db.Column(db.String())
    date_rated = db.Column(db.DateTime())