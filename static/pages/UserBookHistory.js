import UserNavbar from "../components/UserNavbar.js";
import store from "../utils/store.js";
import router from "../utils/router.js";

const UserBookHistory = {
    template : `
        <div>
            <UserNavbar/>
            <center>
                <h3>My Reading History</h3>
                <div>
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">S. No.</th>
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
        UserNavbar
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
        const user_id = store.getters.getLoginData.id;

        const response = await fetch(window.location.origin + "/bookissuedhistory", {
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
                "Authentication-Token" : token
            },
            body : JSON.stringify({
                user_id : user_id
            })
        });

        if(response.status === 200){
            const data = await response.json();
            this.history = data;
            // console.log(data);
        }

        if(response.status === 404){
            const data = await response.json();
            alert(data.message);
        }
    },

    // beforeDestroy(){
    //     sessionStorage.removeItem('section_id');
    // },

};

export default UserBookHistory;