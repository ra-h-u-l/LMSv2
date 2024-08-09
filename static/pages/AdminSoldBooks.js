import AdminNavbar from "../components/AdminNavbar.js";
import store from "../utils/store.js";
import router from "../utils/router.js";

const AdminSoldBooks = {
    template : `
        <div>
            <AdminNavbar/>
            <center>
                <h3>Sold Books</h3>
                <div>
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">S. No.</th>
                                <th scope="col">User</th>
                                <th scope="col">Book Name</th>
                                <th scope="col">Section Name</th>
                                <th scope="col">Date of Selling</th>
                                <th scope="col">Authors</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(book, index) in soldBooks">
                                <th scope="row">{{index + 1}}</th>
                                <td >{{book.fullName}}</td>
                                <td >{{book.book_name}}</td>
                                <td >{{book.section_name}}</td>
                                <td >{{book.date_bought}}</td>
                                <td >{{book.authors}}</td>
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
            soldBooks : null,
        }
    },

    methods : {
        
    },

    async mounted(){
        const token = store.getters.getLoginData.token;

        const response = await fetch(window.location.origin + "/soldbooks", {
            method : "GET",
            headers : {
                "Authentication-Token" : token
            }
        });

        if(response.status === 200){
            const data = await response.json();
            this.soldBooks = data;
            console.log(data);
        }
    },


};

export default AdminSoldBooks;