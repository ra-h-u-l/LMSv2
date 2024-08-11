import UserNavbar from "../components/UserNavbar.js";
import store from "../utils/store.js";
import router from "../utils/router.js";

const UserDashboard = {
    template : `
        <div>
            <UserNavbar/>
            <center>
                <h3 style="font-family: Arial, sans-serif; color: darkblue; font-weight: bold; margin-top: 2px; text-shadow: 3px 3px 5px rgba(0, 0, 0, 0.5);">Requested Books</h3>
                <p v-if="!requestList">No Requests</p>
                <table v-if="requestList" class="table" style="width: 90%;">
                    <thead>
                        <tr style="background-color: darkblue; color: white;">
                            <th scope="col"></th>
                            <th scope="col">Book Name</th>
                            <th scope="col">Date of Request</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(book, index) in requestList" v-if="book.user_id == user_id" style="background-color: #5B9FC8; color: black; font-weight: 500;">
                            <td >&#128214;</td>
                            <td >{{book.book_name}}</td>
                            <td >{{book.date_requested}}</td>
                        </tr>
                    </tbody>
                </table>

                <br>

                <h3 style="font-family: Arial, sans-serif; color: darkblue; font-weight: bold; margin-top: 2px; text-shadow: 3px 3px 5px rgba(0, 0, 0, 0.5);">Borrowed Books</h3>
                <p v-if="issueList == null">No Borrowed Books</p>
                <table v-if="issueList" class="table" style="width: 90%;">
                    <thead>
                        <tr style="background-color: darkblue; color: white;">
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
                        <tr v-for="(book, index) in issueList" v-if="book.user_id == user_id" style="background-color: #5B9FC8; color: black; font-weight: 500;">
                            <td >&#128214;</td>
                            <td >{{book.book_name}}</td>
                            <td >{{book.date_requested}}</td>
                            <td >{{book.date_issued}}</td>
                            <td ><button @click="readBook(book)" type="button" class="btn btn-success" style="font-weight: 500;">Read</button></td>
                            <td><button @click="rateBook(book)" type="button" class="btn btn-success" style="font-weight: 500;">Rate this book</button></td>
                            <td ><button @click="returnBook(book)" type="button" class="btn btn-warning" style="font-weight: 500;">Return</button></td>
                        </tr>
                    </tbody>
                </table>

                <br>

                <h3 style="font-family: Arial, sans-serif; color: darkblue; font-weight: bold; margin-top: 2px; text-shadow: 3px 3px 5px rgba(0, 0, 0, 0.5);">Bought Books</h3>
                <p v-if="!boughtBooks">No Books Bought</p>
                <table v-if="boughtBooks" class="table" style="width: 90%;">
                    <thead>
                        <tr style="background-color: darkblue; color: white;">
                            <th scope="col"></th>
                            <th scope="col">Book Name</th>
                            <th scope="col">Date of Purchase</th>
                            <th scope="col">Read Book</th>
                            <th scope="col">Rating</th>
                            <th scope="col">Download</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(book, index) in boughtBooks" style="background-color: #5B9FC8; color: black; font-weight: 500;">
                            <td >&#128214;</td>
                            <td >{{book.book_name}}</td>
                            <td >{{book.date_bought}}</td>
                            <td ><button @click="readBook(book)" type="button" class="btn btn-success" style="font-weight: 500;">Read</button></td>
                            <td><button @click="rateBook(book)" type="button" class="btn btn-success" style="font-weight: 500;">Rate this book</button></td>
                            <td><button @click="downloadBook(book)" type="button" class="btn btn-success" style="font-weight: 500;">Download</button></td>
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
            boughtBooks : null
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

        async downloadBook(book){
            const token = store.getters.getLoginData.token;
            const response = await fetch(window.location.origin + "/downloadbook", {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json",
                    "Authentication-Token" : token
                },
                body : JSON.stringify({
                    "book_id" : book.book_id,
                    "user_id" : store.state.id
                })
            });

            if (response.status === 200) {
                const blob = await response.blob(); // Get the PDF as a Blob
                const url = window.URL.createObjectURL(blob); // Create a URL for the Blob
                const a = document.createElement('a'); // Create a download link element
                a.href = url;
                a.download = `${book.book_name}.pdf`; // Set the download file name
                document.body.appendChild(a);
                a.click(); // Trigger the download
                document.body.removeChild(a); // Clean up
                window.URL.revokeObjectURL(url); // Release the object URL
            } else {
                console.error("Failed to download book");
            }
        }
        
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
            console.log("issueList:", data);
        }

        if(response3.status === 404){
            const data = await response3.json();
            console.log(data);
        }

        // Bought Books
        const response4 = await fetch(window.location.origin + "/soldbooks", {
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
                "Authentication-Token" : token
            },
            body : JSON.stringify({
                "user_id" : this.user_id
            })
        });

        if(response4.status === 200){
            const data = await response4.json();
            this.boughtBooks = data;
            // console.log("Bought List:", this.boughtBooks);
        }

        if(response4.status === 404){
            const data = await response4.json();
            console.log(data);
        }
    }
};

export default UserDashboard;