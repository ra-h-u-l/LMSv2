import UserNavbar from "../components/UserNavbar.js";
import store from "../utils/store.js";
import router from "../utils/router.js";

const UserPaymentPage = {
    template : `
        <div>
            <UserNavbar/>
            <center>
                <h3>Payment Page</h3>
                <div class="card" style="width: 35%;">
                    <div class="card-body">
                        <h5 class="card-title">Book Name: {{book_name}}</h5>
                        <p class="card-text">Amount: ₹ {{amount}}</p>
                        <button @click="pay" type="button" class="btn btn-primary">Pay</button>
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
            book_name : sessionStorage.getItem('book_name'),
            amount : sessionStorage.getItem('book_price'),
        }
    },

    methods : {
        async pay(){
            const token = store.getters.getLoginData.token;
            const user_id = store.state.id;
            const book_id = sessionStorage.getItem('book_id');
            
            const response = await fetch(window.location.origin + "/buybook", {
                method : "POST",
                headers : {
                    "Content-Type": "application/json",
                    "Authentication-Token" : token
                },
                body : JSON.stringify({
                    "user_id" : user_id,
                    "book_id" : book_id
                })
            });

            if(response.status === 200){
                const data = await response.json();
                router.push("/userdashboard");
            }

            if(response.status === 400){
                const data = await response.json();
                alert(data.message);
            }

            if(response.status === 404){
                const data = await response.json();
                alert(data.message);
            }
        }
        
    },

    beforeDestroy(){
        sessionStorage.removeItem('book_id');
        sessionStorage.removeItem('book_name');
        sessionStorage.removeItem('book_price');
    }

};

export default UserPaymentPage;