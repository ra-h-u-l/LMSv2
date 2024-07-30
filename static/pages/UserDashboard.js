import UserNavbar from "../components/UserNavbar.js";
import store from "../utils/store.js";
import router from "../utils/router.js";

const UserDashboard = {
    template : `
        <div>
            <UserNavbar/>
            <h1>User Dashboard</h1>
        </div>
    `,

    components :{
        UserNavbar
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
            router.push("/userlogin");
            return;
        }

        const response = await fetch(window.location.origin + "/userdashboard", {
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
            router.push("/userlogin");
        }
    }
};

export default UserDashboard;