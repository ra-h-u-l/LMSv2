import router from "./../utils/router.js";
import Navbar from "./../components/Navbar.js";
import store from "../utils/store.js";

const UserLogin = {
    template: `
        <div>
            <Navbar/>
            <div id="login-signup">
                <h3>User Login</h3>
                <form>
                    <div class="form-group">
                        <label for="exampleInputEmail1">Email address</label>
                        <input v-model="email" type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" required>
                    </div>
                    <div class="form-group">
                        <label for="exampleInputPassword1">Password</label>
                        <input v-model="password" type="password" class="form-control" id="exampleInputPassword1" placeholder="Password" required pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}">
                    </div>
                    <button @click="userLogin()" type="submit" class="btn btn-primary">Login</button>
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
        async userLogin() {
            const origin = window.location.origin;
            const url = `${origin}/userlogin`;
            const res = await fetch(url, {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify({
                    email : this.email,
                    password : this.password
                }),
                credentials : "same-origin"
            });

            if(res.ok){
                const data = await res.json();

                // store data in vuex
                store.dispatch("login", data);
                // console.log(store.getters.getLoginData);

                router.push("/userdashboard");
                console.log("User logged in successfully");

            }else{
                console.log("Login failed");
            }
        }
    }
}

export default UserLogin;