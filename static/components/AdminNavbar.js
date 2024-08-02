import router from "./../utils/router.js";
import store from "./../utils/store.js";


const AdminNavbar = {
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
                            <router-link class="nav-link active" to="/">Admin Dashboard</router-link>
                        </li>    
                        <li class="nav-item">
                            <router-link class="nav-link active" to="/adminallsections">All Sections</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link active" to="/">All Books</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link active" to="/">Stats</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link active" to="/">Add Section</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link active" to="/">Add Book</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link active" to="/">Book Issue History</router-link>
                        </li>
                    </ul>
                    <form class="d-flex" role="search">
                        <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
                        <button class="btn btn-outline-success" type="submit">Search</button>
                    </form>
                    <button @click="adminLogout()" class="btn btn-outline-danger" type="submit">Logout</button>
                </div>
            </div>
        </nav>
        `,

    methods : {
        adminLogout() {
            store.dispatch("logout");
            router.push("/adminlogin");
        }
    }

}

export default AdminNavbar;