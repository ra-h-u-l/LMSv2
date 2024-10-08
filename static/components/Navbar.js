const Navbar = {
    template: `
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
            <div class="container-fluid">
                <router-link class="navbar-brand" to="/">LMS</router-link>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                        <router-link class="nav-link active" to="/adminlogin">Admin Login</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link active" to="/userlogin">User Login</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link active" to="/usersignup">User Signup</router-link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        `,

}

export default Navbar;