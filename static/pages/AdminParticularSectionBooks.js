import AdminNavbar from "../components/AdminNavbar.js";
import store from "../utils/store.js";
import router from "../utils/router.js";

const AdminParticularSectionBooks = {
    template : `
        <div>
            <AdminNavbar/>
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
                                <th scope="col">Total Copies</th>
                                <th scope="col">Available Copies</th>
                                <th scope="col">Issued Copies</th>
                                <th scope="col">Sold Copies</th>
                                <th scope="col">Price</th>
                                <th scope="col">Rating</th>
                                <th scope="col">ViewRating</th>
                                <th scope="col">Read Book</th>
                                <th scope="col">Update</th>
                                <th scope="col">Delete</th>
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
                                <td>{{book.total_copies}}</td>
                                <td>{{book.available_copies}}</td>
                                <td>{{book.issued_copies}}</td>
                                <td>{{book.sold_copies}}</td>
                                <td>₹ {{book.book_price}}</td>
                                <td>{{book.rating}}</td>
                                <td><button @click="viewRating(book)" type="button" class="btn btn-primary">View Ratings</button></td>
                                <td><button @click="readBook(book)" type="button" class="btn btn-primary">Read</button></td>
                                <td><button @click="updateBook(book)" type="button" class="btn btn-warning">Update</button></td>
                                <td><button @click="deleteBook(book)" type="button" class="btn btn-danger">Delete</button></td>
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
            sectionBooks : []
        }
    },

    methods : {
        viewRating(book){
            sessionStorage.setItem('book_id', book.book_id);
            router.push("/adminviewrating");    
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
            // console.log(bookList);
        }
    },

    beforeDestroy(){
        sessionStorage.removeItem('section_id');
    },
    



};

export default AdminParticularSectionBooks;