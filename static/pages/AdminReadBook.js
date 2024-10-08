import AdminNavbar from "../components/AdminNavbar.js";
import router from "../utils/router.js";
import store from "../utils/store.js";

const AdminReadBook = {
    template : `
        <div>
            <AdminNavbar/>
                <center>
                    <h3 style="font-family: Arial, sans-serif; color: #f70776; font-size: 3em; font-weight: bold; margin-top: 1%; text-shadow: 3px 3px 5px rgba(0, 0, 0, 0.5);">Read Book</h3>
                    <div class="card" style="width: 60rem;">
                        <div class="card-body" style="background-color: rgb(169, 187, 241);">
                            <h5 class="card-title">{{book_name}}</h5>
                            <p class="card-text" style="font-weight: 500;">Authors: {{authors}}</p>
                            <p class="card-text" style="font-weight: 500;">Book Content</p>
                            <p class="card-text" style="font-weight: 500;"><textarea name="" id="" cols="122" rows="30" readonly>{{content}}</textarea></p>
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