import AdminNavbar from "../components/AdminNavbar.js";
import store from "../utils/store.js";
import router from "../utils/router.js";

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
    },
    data(){
        return{
            
        }
    },

    methods : {
        
    },

    async mounted(){
        const token = store.getters.getLoginData.token;

        if(!token){
            store.dispatch("logout");
            router.push("/adminlogin");
            return;
        }

        const response = await fetch(window.location.origin + "/admindashboard", {
            method : "GET",
            headers : {
                "Authentication-Token" : token
            }
        });

        if(response.ok){
            const data = await response.json();
            console.log(data);
        }else{
            store.dispatch("logout");
            router.push("/adminlogin");
        }
        
    }
};

export default AdminDashboard;