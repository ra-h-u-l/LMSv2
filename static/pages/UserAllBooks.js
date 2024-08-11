import UserNavbar from "../components/UserNavbar.js";
import store from "../utils/store.js";
import router from "../utils/router.js";

const UserAllBooks = {
    template : `
        <div>
            <UserNavbar/>
            <center>
                <h3 style="font-family: Arial, sans-serif; color: darkblue; font-weight: bold; margin-top: 2px; text-shadow: 3px 3px 5px rgba(0, 0, 0, 0.5);">All Books</h3>
                <div>
                    <table class="table" style="width: 98%;">
                        <thead>
                            <tr style="background-color: darkblue; color: white;">
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
                                <th scope="col">View Rating</th>
                                <th scope="col">Borrow Book</th>
                                <th scope="col">Buy Book</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(book, index) in allBooks" style="background-color: #5B9FC8; color: black; font-weight: 500;">
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
                                <td><button @click="viewRating(book)" type="button" class="btn btn-primary" style="font-weight: 500;">View Ratings</button></td>
                                <td><button @click="borrowRequest(book)" type="button" class="btn btn-primary" style="font-weight: 500;">Request to Borrow</button></td>
                                <td><button @click="buy(book)" type="button" class="btn btn-primary" style="font-weight: 500;">Buy Now</button></td>
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
            allBooks : null,
        }
    },

    methods : {
        viewRating(book){
            sessionStorage.setItem('book_id', book.book_id);
            router.push("/userviewrating");    
        },

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

        buy(book){
            sessionStorage.setItem("book_id", book.book_id);
            sessionStorage.setItem("book_name", book.book_name);
            sessionStorage.setItem("book_price", book.book_price);
            router.push("/userpaymentpage");
        }
        
    },

    async mounted(){
        const token = store.getters.getLoginData.token;

        const response = await fetch(window.location.origin + "/api/books", {
            method : "GET",
            headers : {
                "Authentication-Token" : token
            },
        });

        if(response.status === 200){
            const data = await response.json();
            this.allBooks = data;
            console.log(data);
        }
    },

};

export default UserAllBooks;