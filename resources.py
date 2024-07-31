from flask_restful import Resource, Api, reqparse
from models import *
from extensions import db
from flask_security import auth_required, roles_required, roles_accepted

api = Api()

# To convert data to dictionary
parser = reqparse.RequestParser()

# Api will accept these arguments as request body
parser.add_argument("id", type = int)
parser.add_argument("section_name", type = str)
parser.add_argument("description", type = str)

class SectionsApi(Resource):
    @auth_required("token")
    @roles_accepted("admin", "user")
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


# api endpoints
api.add_resource(SectionsApi, "/api/sections")