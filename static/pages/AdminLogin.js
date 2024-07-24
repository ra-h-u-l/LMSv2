import router from "./../utils/router.js";
import Navbar from "./../components/Navbar.js";

const AdminLogin = {
    template: `
        <div>
            <Navbar/>
            <div id="login-signup">
                <h3>Admin Login</h3>
                <form>
                    <div class="form-group">
                        <label for="exampleInputEmail1">Email address</label>
                        <input v-model="email" type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email">
                    </div>
                    <div class="form-group">
                        <label for="exampleInputPassword1">Password</label>
                        <input v-model="password" type="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
                    </div>
                    <button @click="adminLogin" type="submit" class="btn btn-primary">Login</button>
                </form>
            </div>
        </div>
    `,

    data() {
        return {
            email : "",
            password : ""
        }
    },

    methods : {
        async adminLogin() {
            const url = window.location.origin
            const response = await fetch(url + "/admindashboard", {
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
                // router.push("/admindashboard");
                console.log("admin login");
            }

        }
    }
}

export default AdminLogin;