import UserNavbar from "../components/UserNavbar.js";
import store from "../utils/store.js";
import router from "../utils/router.js";

const UserStats = {
    template : `
        <div>
            <UserNavbar/>
            <center>
                <h3 style="font-family: Arial, sans-serif; color: darkblue; font-weight: bold; margin-top: 2px; text-shadow: 3px 3px 5px rgba(0, 0, 0, 0.5);">Stats</h3>
                <table class="table" style="width: 70%;">
                    <thead>
                        <tr style="background-color: darkblue; color: white;">
                            <th scope="col">Total Read Books</th>
                            <th scope="col">Total Bought Books</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="background-color: #5B9FC8; color: black; font-weight: 500;">
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