import AdminNavbar from "../components/AdminNavbar.js";
import store from "../utils/store.js";
import router from "../utils/router.js";

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
                                <td >{{section.section_name}}</td>
                                <td >{{section.description}}</td>
                                <td>{{section.date_created}}</td>
                                <td>{{section.last_updated}}</td>
                                <td><button @click="updateSection(section)" type="button" class="btn btn-warning">Update</button></td>
                                <td><button @click="deleteSection(section)" type="button" class="btn btn-danger">Delete</button></td>
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
            allSections : null,
        }
    },

    methods : {
        updateSection(sec){
            store.state.section_id = sec.section_id;
            store.state.section_name = sec.section_name;
            store.state.section_description = sec.description;
            // console.log(sec);
            // console.log(store.state);
            router.push("/adminupdatesection");
        },

        async deleteSection(sec){
            const token = store.getters.getLoginData.token;
            const response = await fetch(window.location.origin + "/api/sections", {
                method : "DELETE",
                headers : {
                    "Content-Type" : "application/json",
                    "Authentication-Token" : token
                },
                body : JSON.stringify({
                    id : sec.section_id
                })
            });

            if(response.status === 200){
                const data = await response.json();
                console.log(data);
                window.location.reload();
            }

            if(response.status === 404){
                const data = await response.json();
                console.log(data);
                alert(data.message);
            }

            if(response.status === 400){
                const data = await response.json();
                console.log(data);
                alert(data.message);
                window.location.reload();
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
            console.log(data);
        }
    }

};

export default AdminAllSections;