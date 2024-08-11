import AdminNavbar from "../components/AdminNavbar.js";
import store from "../utils/store.js";
import router from "../utils/router.js";

const AdminStats = {
    template : `
        <div>
            <AdminNavbar/>
            <center>
                <h3 style="font-family: Arial, sans-serif; color: darkblue; font-weight: bold; margin-top: 2px; text-shadow: 3px 3px 5px rgba(0, 0, 0, 0.5);">Stats</h3>
                <div>
                    <table class="table" style="width: 80%;">
                        <thead>
                            <tr style="background-color: darkblue; color: white;">
                                <th scope="col">Total Read Books</th>
                                <th scope="col">Total Bought Books</th>
                                <th scope="col">Total Currently Issued Books</th>
                                <th scope="col">Total Pending Requests</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="background-color: #5B9FC8; color: black; font-weight: 500;">
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