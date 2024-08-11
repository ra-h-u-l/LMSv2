import AdminNavbar from "../components/AdminNavbar.js";
import store from "../utils/store.js";
import router from "../utils/router.js";

const AdminSoldBooks = {
    template : `
        <div>
            <AdminNavbar/>
            <center>
                <h3 style="font-family: Arial, sans-serif; color: darkblue; font-weight: bold; margin-top: 2px; text-shadow: 3px 3px 5px rgba(0, 0, 0, 0.5);">Sold Books</h3>
                <div>
                    <table class="table" style="width: 98%;">
                        <thead>
                            <tr style="background-color: darkblue; color: white;">
                                <th scope="col">S. No.</th>
                                <th scope="col">User</th>
                                <th scope="col">Book Name</th>
                                <th scope="col">Section Name</th>
                                <th scope="col">Date of Selling</th>
                                <th scope="col">Authors</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(book, index) in soldBooks" style="background-color: #5B9FC8; color: black; font-weight: 500;">
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