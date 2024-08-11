import AdminNavbar from "../components/AdminNavbar.js";
import router from "../utils/router.js";
import store from "../utils/store.js";

const AdminUpdateBook = {
    template : `
        <div>
            <AdminNavbar/>
            <center>
                <h3 style="font-family: Arial, sans-serif; color: darkblue; font-weight: bold; margin-top: 2px; text-shadow: 3px 3px 5px rgba(0, 0, 0, 0.5);">Update Book</h3>
                <form style="width: 50%; margin-bottom: 20px; shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); background-color: #5B9FC8; padding: 20px;">
                    <div class="form-group">
                        <label for="book-name">Book Name</label>
                        <input v-model="book_name" type="text" class="form-control" id="book-name" aria-describedby="emailHelp" placeholder=book_name required>
                    </div>
                    <div class="form-group">
                        <label>Section Name</label>
                        <br>
                        <select class="form-select" aria-label="Default select example" v-model="section_id1">
                            <option :value="section.section_id" v-for="section in allSections" :key="section.section_id"">{{section.section_name}}</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="book-description">Book Description</label>
                        <input v-model="book_description" type="text" class="form-control" id="book-description" placeholder=book_description required>
                    </div>
                    <div class="form-group">
                        <label for="book-content">Book Content</label>
                        <textarea v-model="content" type="text" class="form-control" id="book-content" cols="50" rows="10" placeholder=content required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="book-author">Author(s)</label>
                        <input v-model="authors" type="text" class="form-control" id="book-author" placeholder=authors required>
                    </div>
                    <div class="form-group">
                        <label for="book-total-copies">Total Copies</label>
                        <input v-model="total_copies" type="number" class="form-control" id="book-total-copies" placeholder=total_copies required>
                    </div>
                    <div class="form-group">
                        <label for="book-price">Book Price(₹)</label>
                        <input v-model="book_price" type="number" class="form-control" id="book-price" placeholder=book_price required>
                    </div>
                    <button @click="updateBook()" type="submit" class="btn btn-primary" style="font-weight: 500;">Update</button>
                </form>
            </center>
        </div>
    `,

    components : {
        AdminNavbar
    },

    data(){
        return{
            allSections : null,
            book_id : store.state.book_id,
            book_name : store.state.book_name,
            book_description : store.state.book_description,
            section_id1 : store.state.section_id1,
            content : store.state.content,
            authors : store.state.authors,
            total_copies : store.state.total_copies,
            book_price : store.state.book_price,
        }
    },

    methods : {
        async updateBook(){
            const token = store.getters.getLoginData.token;

            const response = await fetch(window.location.origin + "/api/books", {
                method : "PUT",
                headers : {
                    "Content-Type" : "application/json",
                    "Authentication-Token" : token
                },
                body : JSON.stringify({
                    id : store.state.book_id,
                    book_name : this.book_name,
                    section_id : this.section_id1,
                    description : this.book_description,
                    content : this.content,
                    authors : this.authors,
                    total_copies : this.total_copies,
                    book_price : this.book_price
                })
            });

            if(response.status === 200){
                const data = await response.json();

                store.state.book_id = null;
                store.state.book_name = "";
                store.state.book_description = "";
                store.state.section_id1 = null;
                store.state.content = "";
                store.state.authors = "";
                store.state.total_copies = null;
                store.state.book_price = null;

                router.push("/adminallbooks");
            }

            if(response.status === 404){
                const data = await response.json();

                alert(data.message);
                
                // router.push("/adminallsections");
            }

            if(response.status === 400){
                const data = await response.json();

                alert(data.message);
                
                // router.push("/adminallsections");
            }
        }
    },

    async mounted(){
        const token = store.getters.getLoginData.token;

        const response = await fetch(window.location.origin + "/api/sections", {
            method : "GET",
            headers : {
                "Authentication-Token" : token
            }
        });

        if(response.status === 200){
            const data = await response.json();
            this.allSections = data;
            // console.log(data);
            // console.log("All Sections: ", this.allSections);
        }
    }

};

export default AdminUpdateBook;