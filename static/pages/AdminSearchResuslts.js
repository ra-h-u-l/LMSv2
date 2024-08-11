import AdminNavbar from "../components/AdminNavbar.js";
import store from "../utils/store.js";
import router from "../utils/router.js";

const AdminSearchResuslts = {
    template : `
        <div>
            <AdminNavbar/>
            <center>
                <h3 style="font-family: Arial, sans-serif; color: darkblue; font-weight: bold; margin-top: 2px; text-shadow: 3px 3px 5px rgba(0, 0, 0, 0.5);">Search Results</h3>
                <div>
                    <table class="table">
                        <thead>
                            <tr style="background-color: darkblue; color: white;">
                                <th scope="col">S. No.</th>
                                <th scope="col">Book Name</th>
                                <th scope="col">Section Name</th>
                                <th scope="col">Description</th>
                                <th scope="col">Created On</th>
                                <th scope="col">Updated On</th>
                                <th scope="col">Authors</th>
                                <th scope="col">Total Copies</th>
                                <th scope="col">Available Copies</th>
                                <th scope="col">Issued Copies</th>
                                <th scope="col">Sold Copies</th>
                                <th scope="col">Price</th>
                                <th scope="col">Rating</th>
                                <th scope="col">Read Book</th>
                                <th scope="col">Update</th>
                                <th scope="col">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(book, index) in searchResults" style="background-color: #5B9FC8; color: black; font-weight: 500;">
                                <th scope="row">{{index + 1}}</th>
                                <td >{{book.book_name}}</td>
                                <td ><button @click="viewSection(book.section_id)" style="background-color: transparent; border: none; font-weight: 500;">{{book.section_name}}</button></td>
                                <td>{{book.description}}</td>
                                <td>{{book.date_created}}</td>
                                <td>{{book.last_updated}}</td>
                                <td>{{book.authors}}</td>
                                <td>{{book.total_copies}}</td>
                                <td>{{book.available_copies}}</td>
                                <td>{{book.issued_copies}}</td>
                                <td>{{book.sold_copies}}</td>
                                <td>₹ {{book.book_price}}</td>
                                <td>{{book.rating}}</td>
                                <td><button @click="readBook(book)" type="button" class="btn btn-primary" style="font-weight: 500;">Read</button></td>
                                <td><button @click="updateBook(book)" type="button" class="btn btn-warning" style="font-weight: 500;">Update</button></td>
                                <td><button @click="deleteBook(book)" type="button" class="btn btn-danger" style="font-weight: 500;">Delete</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </center>
        </div>
    `,

    components : {
        AdminNavbar
    },

    data(){
        return{
            searchResults : null,
        }
    },

    methods : {
        viewSection(section_id){
            sessionStorage.setItem('section_id', section_id);
            router.push("/adminparticularsectionbooks");
        },

        readBook(book){
            sessionStorage.setItem('book_name', book.book_name);
            sessionStorage.setItem('authors', book.authors);
            sessionStorage.setItem('content', book.content);
            router.push("/adminreadbook");
        },

        updateBook(book){
            store.state.book_id = book.book_id;
            store.state.book_name = book.book_name;
            store.state.book_description = book.description;
            store.state.section_id1 = book.section_id;
            store.state.content = book.content;
            store.state.authors = book.authors;
            store.state.total_copies = book.total_copies;
            store.state.book_price = book.book_price;
            // console.log(sec);
            // console.log(store.state);
            router.push("/adminupdatebook");
        },

        async deleteBook(book){
            const token = store.getters.getLoginData.token;
            const response = await fetch(window.location.origin + "/api/books", {
                method : "DELETE",
                headers : {
                    "Content-Type" : "application/json",
                    "Authentication-Token" : token
                },
                body : JSON.stringify({
                    id : book.book_id
                })
            });

            if(response.status === 200){
                const data = await response.json();
                console.log(data);
                window.location.reload();
            }

            if(response.status === 400){
                const data = await response.json();
                console.log(data);
                alert(data.message);
            }


        }
        
    },

    async mounted(){
        const token = store.getters.getLoginData.token;

        const response = await fetch(window.location.origin + "/search", {
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
                "Authentication-Token" : token
            },
            body : JSON.stringify({
                keyword : sessionStorage.getItem('keyword')
            })
        });

        if(response.status === 200){
            const data = await response.json();
            this.searchResults = data;
            // console.log(data);
        }

        if(response.status === 404){
            const data = await response.json();
            alert(data.message);
        }
    },

    beforeDestroy(){
        sessionStorage.removeItem('keyword');
    }

};

export default AdminSearchResuslts;