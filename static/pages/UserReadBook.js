import UserNavbar from "../components/UserNavbar.js";
import router from "../utils/router.js";
import store from "../utils/store.js";

const UserReadBook = {
    template : `
        <div>
            <UserNavbar/>
                <center>
                    <h3>Read Book</h3>
                    <div class="card" style="width: 60rem;" v-if="book">
                        <div class="card-body">
                            <h5 class="card-title">{{book.book_name}}</h5>
                            <p class="card-text">Authors: {{book.authors}}</p>
                            <p class="card-text">Book Content</p>
                            <p class="card-text"><textarea name="" id="" cols="122" rows="30" readonly>{{book.content}}</textarea></p>
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
            book : null
        }
    },

    async mounted(){
        const token = store.getters.getLoginData.token;
        const book_id = sessionStorage.getItem('book_id');
        const response = await fetch(window.location.origin + "/userreadbook", {
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
                "Authentication-Token" : token
            },
            body : JSON.stringify({
                "book_id" : book_id
            })
        });

        if(response.status === 200){
            const data = await response.json();
            console.log(data);
            this.book = data;
        }
    },

    beforeDestroy(){
        sessionStorage.removeItem('book_id');
    }

    
};

export default UserReadBook;