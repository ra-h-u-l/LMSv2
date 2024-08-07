import UserNavbar from "../components/UserNavbar.js";
import store from "../utils/store.js";
import router from "../utils/router.js";

const UserDashboard = {
    template : `
        <div>
            <UserNavbar/>
            <center>
                <h3>Requested Books</h3>
                <h4 v-if="!requestList">No Requests</h4>
                <table v-if="requestList" class="table">
                        <thead>
                            <tr>
                                <th scope="col"></th>
                                <th scope="col">Book Name</th>
                                <th scope="col">Date of Request</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(book, index) in requestList" v-if="book.user_id == user_id">
                                <td >&#128214;</td>
                                <td >{{book.book_name}}</td>
                                <td >{{book.date_requested}}</td>
                            </tr>
                        </tbody>
                    </table>
            </center>
        </div>
    `,

    components :{
        UserNavbar
    },

    data(){
        return{
            requestList : null,
            user_id : store.state.id,
        }
    },

    methods : {
        
    },

    async mounted(){
        const token = store.getters.getLoginData.token;

        if(!token){
            store.dispatch("logout");
            router.push("/userlogin");
            return;
        }

        const response = await fetch(window.location.origin + "/userdashboard", {
            method : "GET",
            headers : {
                "Authentication-Token" : token
            }
        });

        if(response.ok){
            const data = await response.json();
            console.log(data);
        }else{
            store.dispatch("logout");
            router.push("/userlogin");
        }

        // requestList
        const response2 = await fetch(window.location.origin + "/userborrowbook", {
            method : "GET",
            headers : {
                "Authentication-Token" : token
            }
        });

        if(response2.status === 200){
            const data = await response2.json();
            this.requestList = data;
            console.log("List:", data);
        }

        if(response2.status === 404){
            const data = await response2.json();
            console.log(data);
        }
    }
};

export default UserDashboard;