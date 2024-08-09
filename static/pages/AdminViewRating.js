import AdminNavbar from "../components/AdminNavbar.js";
import store from "../utils/store.js";
import router from "../utils/router.js";

const AdminViewRating = {
    template : `
        <div>
            <AdminNavbar/>
            <center>
                <h3>Ratings</h3>
                <div card style="width: 30%; background-color: white">
                    <div v-for="rating in ratingData" class="card-body">                        
                        <h5 class="card-title">Book Name: {{rating.book_name}}</h5>
                        <p class="card-text">Rated: {{rating.rating}}</p>
                        <p class="card-text">Rated By: {{rating.fullName}}</p>
                        <p class="card-text">Date: {{rating.date_rated}}</p>
                        <textarea name="" id="" cols="70" rows="10" readonly>{{rating.review}}</textarea>
                    </div>
                </div>
            </center>
        </div>
    `,

    components : {
        AdminNavbar
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
            router.push("/admindashboard");
        }
    },

    beforeDestroy(){
        sessionStorage.removeItem('book_id');
    }

};

export default AdminViewRating;