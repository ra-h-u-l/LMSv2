import router from "./../utils/router.js";
import Navbar from "./../components/Navbar.js";

const UserSignup = {
    template: `
        <div>
            <Navbar/>
            <div id="login-signup">
                <h3>User Signup</h3>
                <form>
                    <div class="form-group">
                        <label for="full-name">Full Name</label>
                        <input v-model="fullName" type="text" class="form-control" id="full-name" aria-describedby="emailHelp" placeholder="EnterFull Name" required>
                    </div>
                    <div class="form-group">
                        <label for="exampleInputEmail1">Email address</label>
                        <input v-model="email" type="email" class="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email" required>
                    </div>
                    <div class="form-group">
                        <label for="exampleInputPassword1">Password</label>
                        <input v-model="password" type="password" class="form-control" id="password" placeholder="Password" required pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}">
                    </div>
                    <button @click="signupData()" type="submit" class="btn btn-primary">Signup</button>
                </form>
                <div v-if="flashMessage">{{flashMessage}}</div>
            </div>
        </div>
    `,
    components : {
        Navbar
    },

    data() {
        return {
            fullName : "",
            email : "",
            password : "",
            flashMessage : ""
        }
    },

    methods : {
        async signupData() {
            const origin = window.location.origin;
            const url = `${origin}/usersignup`;
            const res = await fetch(url, {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify({
                    fullName : this.fullName,
                    email : this.email,
                    password : this.password,
                    role : "user"
                }),
                credentials : "same-origin"
            });

            if(res.ok){
                const data = await res.json();
                console.log(data);
                this.flashMessage = "Signup successful";
                setTimeout(() => {
                    this.flashMessage = null;
                    router.push("/userlogin");
                }, 3000)

            }else{
                const errorData = await res.json();
                console.log("Signup failed: ",errorData);
            }
        }
    }
}

export default UserSignup;