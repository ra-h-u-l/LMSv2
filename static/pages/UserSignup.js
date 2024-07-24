import router from "./../utils/router.js";

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
                        <input v-model="password" type="password" class="form-control" id="password" placeholder="Password" required>
                    </div>
                    <button @click="signupData()" type="submit" class="btn btn-primary">Signup</button>
                </form>
            </div>
        </div>
    `,

    data() {
        return {
            fullName : "",
            email : "",
            password : ""
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
                router.push("/userlogin");
            }else{
                const errorData = await res.json();
                console.log("Signup failed: ",errorData);
            }
        }
    }
}

export default UserSignup;