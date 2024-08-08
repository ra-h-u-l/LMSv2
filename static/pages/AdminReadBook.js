import AdminNavbar from "../components/AdminNavbar.js";
import router from "../utils/router.js";
import store from "../utils/store.js";

const AdminReadBook = {
    template : `
        <div>
            <AdminNavbar/>
                <center>
                    <h3>Read Book</h3>
                    <div class="card" style="width: 60rem;">
                        <div class="card-body">
                            <h5 class="card-title">{{book_name}}</h5>
                            <p class="card-text">Authors: {{authors}}</p>
                            <p class="card-text">Book Content</p>
                            <p class="card-text"><textarea name="" id="" cols="122" rows="30">{{content}}</textarea></p>
                        </div>
                    </div>
                </center>
        </div>
    `,

    components : {
        AdminNavbar
    },

    data(){
        return{
            book_name : sessionStorage.getItem('book_name'),
            content : sessionStorage.getItem('content'),
            authors : sessionStorage.getItem('authors'),
        }
    },

    beforeDestroy(){
        sessionStorage.removeItem('book_name');
        sessionStorage.removeItem('content');
        sessionStorage.removeItem('authors');
    }

    
};

export default AdminReadBook;