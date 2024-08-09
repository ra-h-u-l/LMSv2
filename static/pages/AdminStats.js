import AdminNavbar from "../components/AdminNavbar.js";
import store from "../utils/store.js";
import router from "../utils/router.js";

const AdminStats = {
    template : `
        <div>
            <AdminNavbar/>
            <center>
                <h3>Stats</h3>
                <div>
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">Total Read Books</th>
                                <th scope="col">Total Bought Books</th>
                                <th scope="col">Total Currently Issued Books</th>
                                <th scope="col">Total Pending Requests</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope="row">{{readBooks}}</th>
                                <td>{{boughtBooks}}</td>
                                <td>{{currentlyIssuedBooks}}</td>
                                <td>{{pendingRequests}}</td>
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
            readBooks : null,
            boughtBooks : null,
            currentlyIssuedBooks : null,
            pendingRequests : null,
        }
    },

    methods : {

        
    },

    async mounted(){
        const token = store.getters.getLoginData.token;

        const response = await fetch(window.location.origin + "/stats", {
            method : "GET",
            headers : {
                "Authentication-Token" : token
            }
        });

        if(response.status === 200){
            const data = await response.json();
            this.readBooks = data.readBooks;
            this.boughtBooks = data.boughtBooks;
            this.currentlyIssuedBooks = data.currentlyIssuedBooks;
            this.pendingRequests = data.pendingRequests;
        }
    },

};

export default AdminStats;