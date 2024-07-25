import router from "./../utils/router.js";

const UserLogin = {
    template: `
        <div>
            <Navbar/>
            <div id="login-signup">
                <h3>User Login</h3>
                <form>
                    <div class="form-group">
                        <label for="exampleInputEmail1">Email address</label>
                        <input v-model="email" type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email">
                    </div>
                    <div class="form-group">
                        <label for="exampleInputPassword1">Password</label>
                        <input v-model="password" type="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
                    </div>
                    <button @click="userLogin()" type="submit" class="btn btn-primary">Login</button>
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
                router.push("/userdashboard");
            }else{
                console.log("Login failed");
            }
        }
    }
}

export default UserLogin;