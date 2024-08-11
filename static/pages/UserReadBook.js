import UserNavbar from "../components/UserNavbar.js";
import router from "../utils/router.js";
import store from "../utils/store.js";

const UserReadBook = {
    template : `
        <div>
            <UserNavbar/>
                <center>
                    <h3 style="font-family: Arial, sans-serif; color: #f70776; font-size: 3em; font-weight: bold; margin-top: 1%; text-shadow: 3px 3px 5px rgba(0, 0, 0, 0.5);">Read Book</h3>
                    <div class="card" style="width: 60rem;" v-if="book">
                        <div class="card-body" style="background-color: rgb(169, 187, 241);">
                            <h5 class="card-title" style="font-weight: 500;">{{book.book_name}}</h5>
                            <p class="card-text" style="font-weight: 500;">Authors: {{book.authors}}</p>
                            <p class="card-text" style="font-weight: 500;">Book Content</p>
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