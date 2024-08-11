import UserNavbar from "../components/UserNavbar.js";
import store from "../utils/store.js";
import router from "../utils/router.js";

const UserViewRating = {
    template : `
        <div>
            <UserNavbar/>
            <center>
                <h3 style="font-family: Arial, sans-serif; color: darkblue; font-weight: bold; margin-top: 2px; text-shadow: 3px 3px 5px rgba(0, 0, 0, 0.5);">Ratings</h3>
                <div card style="width: 30%; background-color: lightblue; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);">
                    <div v-for="rating in ratingData" class="card-body">                        
                        <h5 class="card-title">Book Name: {{rating.book_name}}</h5>
                        <p class="card-text">Rated: {{rating.rating}}</p>
                        <p class="card-text">Rated By: {{rating.fullName}}</p>
                        <p class="card-text">Date: {{rating.date_rated}}</p>
                        <textarea name="" id="" cols=50% rows=7% readonly>{{rating.review}}</textarea>
                    </div>
                </div>
            </center>
        </div>
    `,

    components : {
        UserNavbar
    },

    data(){
        return{
            ratingData : null,
        }
    },

    methods : {

    },

    async mounted(){
        const token = store.getters.getLoginData.token;

        const response = await fetch(window.location.origin + "/viewrating", {
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
                "Authentication-Token" : token
            },
            body : JSON.stringify({
                "book_id" : sessionStorage.getItem('book_id')
            })
        });

        if(response.status === 200){
            const data = await response.json();
            this.ratingData = data;
            console.log(data);
        }

        if(response.status === 404){
            const data = await response.json();
            alert(data.message);
            router.push("/userdashboard");
        }
    },

    beforeDestroy(){
        sessionStorage.removeItem('book_id');
    }

};

export default UserViewRating;