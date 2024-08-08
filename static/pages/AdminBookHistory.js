import AdminNavbar from "../components/AdminNavbar.js";
import store from "../utils/store.js";
import router from "../utils/router.js";

const AdminBookHistory = {
    template : `
        <div>
            <AdminNavbar/>
            <center>
                <h3>User Book History</h3>
                <div>
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">S. No.</th>
                                <th scope="col">User</th>
                                <th scope="col">Book Name</th>
                                <th scope="col">Date of Issue</th>
                                <th scope="col">Date of Return</th>
                                <th scope="col">Date of Buying</th>
                                <th scope="col">Is Bought</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(book, index) in history">
                                <th scope="row">{{index + 1}}</th>
                                <td >{{book.user_name}}</td>
                                <td >{{book.book_name}}</td>
                                <td >{{book.date_issued}}</td>
                                <td >{{book.date_returned}}</td>
                                <td >{{book.date_bought}}</td>
                                <td >{{book.is_bought}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </center>
        </div>
    `,

    components : {
        AdminNavbar
    },

    data(){
        return{
            history : null,
        }
    },

    methods : {

    },

    async mounted(){
        const token = store.getters.getLoginData.token;

        const response = await fetch(window.location.origin + "/bookissuedhistory", {
            method : "GET",
            headers : {
                "Authentication-Token" : token
            }
        });

        if(response.status === 200){
            const data = await response.json();
            this.history = data;
            // console.log(data);
        }
    },


};

export default AdminBookHistory;