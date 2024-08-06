// Home ========================================================================
import Home from "./../pages/Home.js";
// Pages (Admin) ===============================================================
import AdminLogin from "./../pages/AdminLogin.js";
import AdminDashboard from "./../pages/AdminDashboard.js";
import AdminAllSections from "./../pages/AdminAllSections.js";
import AdminCreateSection from "./../pages/AdminCreateSection.js";
import AdminUpdateSection from "./../pages/AdminUpdateSection.js";
import AdminAllBooks from "./../pages/AdminAllBooks.js";
import AdminCreateBook from "./../pages/AdminCreateBook.js";
import AdminUpdateBook from "./../pages/AdminUpdateBook.js";
// Pages (User) ================================================================
import UserSignup from "./../pages/UserSignup.js";
import UserLogin from "./../pages/UserLogin.js";
import UserDashboard from "./../pages/UserDashboard.js";


const routes = [
    // Home ========================================================================
    {path : "/", component : Home},
    // Admin Pages ================================================================
    {path: "/adminlogin", component : AdminLogin},
    {path: "/admindashboard", component : AdminDashboard},
    {path: "/adminallsections", component : AdminAllSections},
    {path: "/admincreatesection", component : AdminCreateSection},
    {path: "/adminupdatesection", component : AdminUpdateSection},
    {path: "/adminallbooks", component : AdminAllBooks},
    {path: "/admincreatebook", component : AdminCreateBook},
    {path: "/adminupdatebook", component : AdminUpdateBook},
    // User Pages =================================================================
    {path: "/usersignup", component : UserSignup},
    {path: "/userlogin", component : UserLogin},
    {path: "/userdashboard", component : UserDashboard},
]

const router = new VueRouter({
    routes,
})

export default router;