from flask import Flask
import views
from extensions import db, security
import create_initial_data


def create_app():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = "secret_key_not_to_be_exposed"
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
    app.config["SECURITY_PASSWORD_SALT"] = "password_salt_not_to_be_exposed"
    
    db.init_app(app)

    with app.app_context():
        from models import User, Role
        from flask_security import SQLAlchemyUserDatastore

        user_datastore = SQLAlchemyUserDatastore(db, User, Role)
        security.init_app(app, user_datastore)
        db.create_all()
        create_initial_data.create_data(user_datastore)
        db.session.commit()

    views.create_views(app)

    return app


if __name__=="__main__":
    app = create_app()
    app.run(debug=True)