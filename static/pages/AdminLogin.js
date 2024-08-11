import router from "./../utils/router.js";
import Navbar from "./../components/Navbar.js";
import store from "../utils/store.js";

const AdminLogin = {
    template: `
        <div>
            <Navbar/>
            <div id="login-signup">
                <h3>Admin Login</h3>
                <form >
                    <div class="form-group">
                        <label for="exampleInputEmail1">Email address</label>
                        <input v-model="email" type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email">
                    </div>
                    <div class="form-group">
                        <label for="exampleInputPassword1">Password</label>
                        <input v-model="password" type="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
                    </div>
                    <button @click="adminLogin()" type="submit" class="btn btn-primary">Login</button>
                </form>
            </div>
        </div>
    `,

    components : {
        Navbar
    },

    data() {
        return {
            email : "",
            password : ""
        }
    },

    methods : {
        async adminLogin() {
            const url = window.location.origin
            const response = await fetch(url + "/adminlogin", {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify({
                    email : this.email,
                    password : this.password
                })
            });
            if(response.ok) {
                const data = await response.json();

                // store data in vuex
                store.dispatch("login", data);
                // console.log(store.getters.getLoginData);

                router.push("/admindashboard");
                console.log("Admin logged in successfully");

            }else{
                console.log("Admin login failed");
            }

        }
    }
}

export default AdminLogin;