import AdminNavbar from "../components/AdminNavbar.js";
import store from "../utils/store.js";
import router from "../utils/router.js";

const AdminDashboard = {
    template : `
        <div>
            <AdminNavbar/>
            <center>
                <h3 style="background-color: lightgreen; margin: 2px">Requested Books</h3>
                <h4 v-if="!requestList">No Requests</h4>
                <table v-if="requestList" class="table">
                        <thead>
                            <tr style="background-color: lightblue; margin: 2px">
                                <th scope="col">S. No.</th>
                                <th scope="col">User</th>
                                <th scope="col">Book Name</th>
                                <th scope="col">Date of Request</th>
                                <th scope="col">Grant</th>
                                <th scope="col">Cancel Request</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(book, index) in requestList">
                                <th scope="row">{{index + 1}}</th>
                                <td >{{book.user_name}}</td>
                                <td >{{book.book_name}}</td>
                                <td >{{book.date_requested}}</td>
                                <td><button @click="grantBook(book)" type="button" class="btn btn-success">Grant</button></td>
                                <td><button @click="cancelRequest(book)" type="button" class="btn btn-danger">Cancel Request</button></td>
                            </tr>
                        </tbody>
                    </table>

                    <br>

                    <h3 style="background-color: lightgreen; margin: 2px">Issued Books</h3>
                    <h4 v-if="!issueList">No Requests</h4>
                    <table v-if="issueList" class="table">
                            <thead>
                                <tr style="background-color: lightblue; margin: 2px">
                                    <th scope="col">S. No.</th>
                                    <th scope="col">User</th>
                                    <th scope="col">Book Name</th>
                                    <th scope="col">Date of Request</th>
                                    <th scope="col">Date of Issue</th>
                                    <th scope="col">Revoke/Take Back</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(book, index) in issueList">
                                    <th scope="row">{{index + 1}}</th>
                                    <td >{{book.user_name}}</td>
                                    <td >{{book.book_name}}</td>
                                    <td >{{book.date_requested}}</td>
                                    <td >{{book.date_issued}}</td>
                                    <td><button @click="revokeBook(book)" type="button" class="btn btn-danger">Revoke/Take Back</button></td>
                                </tr>
                            </tbody>
                        </table>
            </center>
        </div>
    `,
    
    components : {
        AdminNavbar
    },
    data(){
        return{
            requestList : null,
            issueList : null
        }
    },

    methods : {
        // grant book
        async grantBook(book){
            const token = store.getters.getLoginData.token;
            const response = await fetch(window.location.origin + "/grantbook", {
                method : "POST",
                headers : {
                    "Content-Type": "application/json",
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

        // cancel request
        async cancelRequest(book){
            const token = store.getters.getLoginData.token;
            const response = await fetch(window.location.origin + "/cancelbookrequest", {
                method : "POST",
                headers : {
                    "Content-Type": "application/json",
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

        // return/revoke/take back book
        async revokeBook(book){
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
            router.push("/adminlogin");
            return;
        }

        const response = await fetch(window.location.origin + "/admindashboard", {
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
            router.push("/adminlogin");
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
            // console.log("List:", data);
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
            // console.log("List:", data);
        }
        
    }
};

export default AdminDashboard;