import UserNavbar from "../components/UserNavbar.js";
import store from "../utils/store.js";
import router from "../utils/router.js";

const UserStats = {
    template : `
        <div>
            <UserNavbar/>
            <center>
                <h3>Stats</h3>
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">Total Read Books</th>
                            <th scope="col">Total Bought Books</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{readBooks}}</td>
                            <td>{{boughtBooks}}</td>
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
            readBooks : null,
            boughtBooks : null,
        }
    },

    methods : {
        
    },

    async mounted(){
        const user_id = store.state.id;
        const token = store.getters.getLoginData.token;

        const response = await fetch(window.location.origin + "/stats", {
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
                "Authentication-Token" : token
            },
            body : JSON.stringify({
                "user_id" : user_id
            })
        });

        if(response.status === 200){
            const data = await response.json();
            this.readBooks = data.readBooks;
            this.boughtBooks = data.boughtBooks;
        }
    },


};

export default UserStats;