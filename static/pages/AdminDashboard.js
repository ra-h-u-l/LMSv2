import AdminNavbar from "../components/AdminNavbar.js";

const AdminDashboard = {
    template : `
        <div>
            <AdminNavbar/>
            <h1>Admin Dashboard</h1>
        </div>
    `,
    // router,
    components : {
        AdminNavbar
    }
};

export default AdminDashboard;