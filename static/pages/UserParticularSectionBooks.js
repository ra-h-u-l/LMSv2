import UserNavbar from "../components/UserNavbar.js";
import store from "../utils/store.js";
import router from "../utils/router.js";

const UserParticularSectionBooks = {
    template : `
        <div>
            <UserNavbar/>
            <center>
                <h3>All Books</h3>
                <div>
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">S. No.</th>
                                <th scope="col">Book Name</th>
                                <th scope="col">Section Name</th>
                                <th scope="col">Description</th>
                                <th scope="col">Created On</th>
                                <th scope="col">Updated On</th>
                                <th scope="col">Authors</th>
                                <th scope="col">Available Copies</th>
                                <th scope="col">Price</th>
                                <th scope="col">Rating</th>
                                <th scope="col">Borrow Book</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(book, index) in sectionBooks">
                                <th scope="row">{{index + 1}}</th>
                                <td >{{book["book_name"]}}</td>
                                <td >{{book.section_name}}</td>
                                <td>{{book.description}}</td>
                                <td>{{book.date_created}}</td>
                                <td>{{book.last_updated}}</td>
                                <td>{{book.authors}}</td>
                                <td>{{book.available_copies}}</td>
                                <td>₹ {{book.book_price}}</td>
                                <td>{{book.rating}}</td>
                                <td><button @click="borrowRequest(book)" type="button" class="btn btn-primary">Request to Borrow</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </center>
        </div>
    `,

    components : {
        UserNavbar
    },

    data(){
        return{
            sectionBooks : [],
        }
    },

    methods : {

        async borrowRequest(book){
            const user_id = store.state.id;
            const token = store.getters.getLoginData.token;

            const response = await fetch(window.location.origin + "/userborrowbook", {
                method : "POST",
                headers : {
                    "Content-Type": "application/json",
                    "Authentication-Token" : token
                },
                body : JSON.stringify({
                    "book_id" : book.book_id,
                    "user_id" : user_id
                })
            });

            if(response.status === 201){
                const data = await response.json();
                router.push("/userdashboard");
            }

            if(response.status === 400){
                const data = await response.json();
                alert(data.message);
            }
        },
        
    },

    async mounted(){
        const token = store.getters.getLoginData.token;
        const sid = sessionStorage.getItem('section_id');

        const response = await fetch(window.location.origin + "/sectionbooks", {
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
                "Authentication-Token" : token
            },
            body : JSON.stringify({
                section_id : sid
            })
        });

        if(response.status === 200){
            const bookList = await response.json();
            this.sectionBooks = bookList;
            console.log(bookList);
        }
    },

    beforeDestroy(){
        sessionStorage.removeItem('section_id');
    },

};

export default UserParticularSectionBooks;