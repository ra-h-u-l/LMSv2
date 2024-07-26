import Home from "./../pages/Home.js";
import AdminLogin from "./../pages/AdminLogin.js";
import AdminDashboard from "./../pages/AdminDashboard.js";
import UserSignup from "./../pages/UserSignup.js";
import UserLogin from "./../pages/UserLogin.js";
import UserDashboard from "./../pages/UserDashboard.js";


const routes = [
    {path : "/", component : Home},
    {path: "/adminlogin", component : AdminLogin},
    {path: "/admindashboard", component : AdminDashboard},
    {path: "/usersignup", component : UserSignup},
    {path: "/userlogin", component : UserLogin},
    {path: "/userdashboard", component : UserDashboard},
]

const router = new VueRouter({
    routes,
})

export default router;