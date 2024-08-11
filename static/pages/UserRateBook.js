import UserNavbar from "../components/UserNavbar.js";
import store from "../utils/store.js";
import router from "../utils/router.js";

const UserRateBook = {
    template : `
        <div>
            <UserNavbar/>
            <center>
                <h3 style="font-family: Arial, sans-serif; color: darkblue; font-weight: bold; margin-top: 2px; text-shadow: 3px 3px 5px rgba(0, 0, 0, 0.5);">Rate Book</h3>
                <div class="card" style="width: 30%;">
                    <div class="card-body">
                        <h5 class="card-title" style="font-weight: 500;">Rate Book: {{book_name}}</h5>
                        <p class="card-text" style="font-weight: 500;">Rate: <select v-model="rating" class="form-select" aria-label="Default select example" required>
                                <option selected></option>
                                <option type="number" value="1">1</option>
                                <option type="number" value="2">2</option>
                                <option type="number" value="3">3</option>
                                <option type="number" value="4">4</option>
                                <option type="number" value="5">5</option>
                            </select></p>
                        <p class="card-text" style="font-weight: 500;">Review</p>
                        <p class="card-text"><textarea v-model="review" name="" id="" cols=50% rows=5% placeholder="Write your review" required></textarea></p>
                        <button @click="rate()" v-if="!rating || !review" type="submit" class="btn btn-primary" disabled style="font-weight: 500;">Submit</button>
                        <button @click="rate()" v-if="rating && review" type="submit" class="btn btn-primary" style="font-weight: 500;">Submit</button>
                    </div>
                </div>
            </center>
        </div>
    `,

    components :{
        UserNavbar
    },

    data(){
        return{
            book_name : sessionStorage.getItem('book_name'),
            rating : null,
            review : null
        }
    },

    methods : {
        async rate(){
            const user_id = store.state.id;
            const book_id = sessionStorage.getItem('book_id');
            const rating = this.rating;
            const review = this.review;
            // console.log(user_id, book_id, rating, review);
            const token = store.getters.getLoginData.token;

            const response = await fetch(window.location.origin + "/ratebook", {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json",
                    "Authentication-Token" : token
                },
                body : JSON.stringify({
                    "user_id" : user_id,
                    "book_id" : book_id,
                    "rating" : rating,
                    "review" : review
                })
            });

            if(response.status === 200){
                const data = await response.json();
                console.log(data);
                router.push("/userdashboard");
            }

            if(response.status === 404){
                const data = await response.json();
                // console.log(data);
                alert(data.message);
            }

            if(response.status === 400){
                const data = await response.json();
                // console.log(data);
                alert(data.message);
            }
        }
    },

    async mounted(){
        
    },

    beforeDestroy(){
        sessionStorage.removeItem('book_id');
        sessionStorage.removeItem('book_name');
    }

};

export default UserRateBook;