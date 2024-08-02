import AdminNavbar from "../components/AdminNavbar.js";
import store from "../utils/store.js";

const AdminAllSections = {
    template : `
        <div>
            <AdminNavbar/>
            <center>
                <h3>All Sections</h3>
                <div>
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">S. No.</th>
                                <th scope="col">Section Name</th>
                                <th scope="col">Description</th>
                                <th scope="col">Created On</th>
                                <th scope="col">Updated On</th>
                                <th scope="col">Update</th>
                                <th scope="col">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(section, index) in allSections">
                                <th scope="row">{{index + 1}}</th>
                                <td>{{section.section_name}}</td>
                                <td>{{section.description}}</td>
                                <td>{{section.date_created}}</td>
                                <td>{{section.last_updated}}</td>
                                <td><button type="button" class="btn btn-warning">Update</button></td>
                                <td><button type="button" class="btn btn-danger">Delete</button></td>
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
            allSections : null
        }
    },

    methods : {
        
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
            console.log(data);
        }
    }

};

export default AdminAllSections;