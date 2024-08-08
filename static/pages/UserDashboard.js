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

                    <br>

                <h3>Borrowed Books</h3>
                <h4 v-if="!issueList">No Requests</h4>
                <table v-if="issueList" class="table">
                    <thead>
                        <tr>
                            <th scope="col"></th>
                            <th scope="col">Book Name</th>
                            <th scope="col">Date of Request</th>
                            <th scope="col">Date of Issue</th>
                            <th scope="col">Read Book</th>
                            <th scope="col">Rating</th>
                            <th scope="col">Return Book</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(book, index) in issueList" v-if="book.user_id == user_id">
                            <td >&#128214;</td>
                            <td >{{book.book_name}}</td>
                            <td >{{book.date_requested}}</td>
                            <td >{{book.date_issued}}</td>
                            <td ><button @click="readBook(book)" type="button" class="btn btn-success">Read</button></td>
                            <td><button @click="rateBook(book)" type="button" class="btn btn-success">Rate this book</button></td>
                            <td ><button @click="returnBook(book)" type="button" class="btn btn-warning">Return</button></td>
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
            issueList : null,
            user_id : store.state.id,
        }
    },

    methods : {
        // read book
        readBook(book){
            sessionStorage.setItem("book_id", book.book_id);
            router.push("/userreadbook");
        },

        // rate book
        rateBook(book){
            sessionStorage.setItem("book_id", book.book_id);
            sessionStorage.setItem("book_name", book.book_name);
            router.push("/userratebook");
        },


        // return book
        async returnBook(book){
            const token = store.getters.getLoginData.token;
            const response = await fetch(window.location.origin + "/returnbook", {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json",
                    "Authentication-Token" : token
                },
                body : JSON.stringify({
                    "book_id" : book.book_id,
                    "user_id" : book.user_id
                })
            });

            if(response.status === 200){
                const data = await response.json();
                console.log(data);
                window.location.reload();
            }

            if(response.status === 404){
                const data = await response.json();
                alert(data);
            }

            if(response.status === 400){
                const data = await response.json();
                alert(data);
            }
        },
        
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

        // issueList
        const response3 = await fetch(window.location.origin + "/currentlyissuedbooks", {
            method : "GET",
            headers : {
                "Authentication-Token" : token
            }
        });

        if(response3.status === 200){
            const data = await response3.json();
            this.issueList = data;
            console.log("List:", data);
        }
    }
};

export default UserDashboard;