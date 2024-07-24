import Home from "./../pages/Home.js";
import AdminLogin from "./../pages/AdminLogin.js";
import UserLogin from "./../pages/UserLogin.js";
import UserSignup from "./../pages/UserSignup.js";


const routes = [
    {path : "/", component : Home},
    {path: "/adminlogin", component : AdminLogin},
    {path: "/userlogin", component : UserLogin},
    {path: "/usersignup", component : UserSignup},
    // {path: "/admindashboard", component : AdminDashboard},
    // {path: "/userdashboard", component : UserDashboard},
]

const router = new VueRouter({
    routes,
})

export default router;