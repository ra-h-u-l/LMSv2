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
import AdminReadBook from "./../pages/AdminReadBook.js";
import AdminParticularSectionBooks from "./../pages/AdminParticularSectionBooks.js";
import AdminBookHistory from "./../pages/AdminBookHistory.js";
import AdminSearchResuslts from "./../pages/AdminSearchResuslts.js";
// Pages (User) ================================================================
import UserSignup from "./../pages/UserSignup.js";
import UserLogin from "./../pages/UserLogin.js";
import UserDashboard from "./../pages/UserDashboard.js";
import UserAllSections from "./../pages/UserAllSections.js";
import UserParticularSectionBooks from "./../pages/UserParticularSectionBooks.js";
import UserAllBooks from "./../pages/UserAllBooks.js";
import UserReadBook from "./../pages/UserReadBook.js";
import UserBookHistory from "./../pages/UserBookHistory.js";
import UserRateBook from "./../pages/UserRateBook.js";
import UserSearchResults from "./../pages/UserSearchResults.js";


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
    {path: "/adminreadbook", component : AdminReadBook},
    {path: "/adminparticularsectionbooks", component : AdminParticularSectionBooks},
    {path: "/adminbookhistory", component : AdminBookHistory},
    {path: "/adminsearchresults", component : AdminSearchResuslts},
    // User Pages =================================================================
    {path: "/usersignup", component : UserSignup},
    {path: "/userlogin", component : UserLogin},
    {path: "/userdashboard", component : UserDashboard},
    {path: "/userallsections", component : UserAllSections},
    {path: "/userparticularsectionbooks", component : UserParticularSectionBooks},
    {path: "/userallbooks", component : UserAllBooks},
    {path: "/userreadbook", component : UserReadBook},
    {path: "/userbookhistory", component : UserBookHistory},
    {path: "/userratebook", component : UserRateBook},
    {path: "/usersearchresults", component : UserSearchResults},
]

const router = new VueRouter({
    routes,
})

export default router;