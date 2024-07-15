from flask import render_template_string, render_template
from flask_security import auth_required, current_user, roles_required

def create_views(app):
    # homepage
    @app.route("/")
    def home():
        return render_template("index.html")

    @app.route("/userDashboard")
    # @roles_required("user")
    @auth_required("session", "token")
    def userDashboard():
        return render_template_string("""
        <h1> This is user dashboard </h1>
        <a href="/logout">Logout</a>
        """)