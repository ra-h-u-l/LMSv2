import UserNavbar from "../components/UserNavbar.js";

const UserDashboard = {
    template : `
        <div>
            <UserNavbar/>
            <h1>User Dashboard</h1>
        </div>
    `,
    components :{
        UserNavbar
    }
};

export default UserDashboard;