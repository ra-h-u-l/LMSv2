import AdminNavbar from "../components/AdminNavbar.js";
import router from "../utils/router.js";
import store from "../utils/store.js";

const AdminCreateBook = {
    template : `
        <div>
            <AdminNavbar/>
                <h3>Create a Book</h3>
                <form>
                    <div class="form-group">
                        <label for="book-name">Book Name</label>
                        <input v-model="bookName" type="text" class="form-control" id="book-name" aria-describedby="emailHelp" placeholder="Enter Book Name" required>
                    </div>
                    <div class="form-group">
                        <label>Section Name</label>
                        <br>
                        <select class="form-select" aria-label="Default select example" v-model="sectionId">
                            <option :value="section.section_id" v-for="section in allSections" :key="section.section_id"">{{section.section_name}}</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="book-description">Book Description</label>
                        <input v-model="bookDescription" type="text" class="form-control" id="book-description" placeholder="Enter Book Description" required>
                    </div>
                    <div class="form-group">
                        <label for="book-content">Book Content</label>
                        <textarea v-model="bookContent" type="text" class="form-control" id="book-content" cols="50" rows="10" placeholder="Enter Book Content" required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="book-author">Author(s)</label>
                        <input v-model="bookAuthor" type="text" class="form-control" id="book-author" placeholder="Enter Book Author" required>
                    </div>
                    <div class="form-group">
                        <label for="book-total-copies">Total Copies</label>
                        <input v-model="bookTotalCopies" type="number" class="form-control" id="book-total-copies" placeholder="Enter Book Total Copies" required>
                    </div>
                    <div class="form-group">
                        <label for="book-price">Book Price(₹)</label>
                        <input v-model="bookPrice" type="number" class="form-control" id="book-price" placeholder="Enter Book Price" required>
                    </div>
                    <button @click="addBook()" type="submit" class="btn btn-primary">Add</button>
                </form>
        </div>
    `,

    components : {
        AdminNavbar
    },

    data(){
        return{
            allSections : null,
            bookName : "",
            sectionId : null,
            bookDescription : "",
            bookContent : "",
            bookAuthor : "",
            bookTotalCopies : null,
            bookPrice : null,
        }
    },

    methods : {
        async setSection(section){
            this.sectionId = section.section_id;
            console.log(this.sectionId);
        },

        async addBook(){
            const token = store.getters.getLoginData.token;

            const response = await fetch(window.location.origin + "/api/books", {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json",
                    "Authentication-Token" : token
                },
                body : JSON.stringify({
                    book_name : this.bookName,
                    description : this.bookDescription,
                    section_id : this.sectionId,
                    content : this.bookContent,
                    authors : this.bookAuthor,
                    total_copies : this.bookTotalCopies,
                    book_price : this.bookPrice
                })
            });

            if(response.status === 201){
                const data = await response.json();
                // console.log(data);
                router.push("/adminallbooks");
            }

            if(response.status === 404){
                const data = await response.json();
                alert(data.message);
                // window.location.reload();
            }

            if(response.status === 400){
                const data = await response.json();
                alert(data.message);
                // window.location.reload();
            }

            
        },
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

export default AdminCreateBook;