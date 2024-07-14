from flask import render_template_string
from flask_security import auth_required, current_user, roles_required

def create_views(app):
    # homepage
    @app.route("/")
    def home():
        return render_template_string("""
        <h1> This is home page </h1>
        <a href="/userDashboard">User Dashboard</a>
        """)

    @app.route("/userDashboard")
    # @roles_required("user")
    @auth_required("session", "token")
    def userDashboard():
        return render_template_string("""
        <h1> This is user dashboard </h1>
        <a href="/logout">Logout</a>
        """)