import AdminNavbar from "../components/AdminNavbar.js";
import router from "../utils/router.js";
import store from "../utils/store.js";

const AdminCreateSection = {
    template : `
        <div>
            <AdminNavbar/>
                <h3>Create a Section</h3>
                <form>
                    <div class="form-group">
                        <label for="section-name">Section Name</label>
                        <input v-model="sectionName" type="text" class="form-control" id="section-name" aria-describedby="emailHelp" placeholder="Enter Section Name">
                    </div>
                    <div class="form-group">
                        <label for="section-description">Section Description</label>
                        <input v-model="sectionDescription" type="text" class="form-control" id="section-description" placeholder="Enter Section Description">
                    </div>
                    <button @click="addSection()" type="submit" class="btn btn-primary">Add</button>
                </form>
        </div>
    `,

    components : {
        AdminNavbar
    },

    data(){
        return{
            sectionName : "",
            sectionDescription : "",
        }
    },

    methods : {
        async addSection(){
            const token = store.getters.getLoginData.token;

            const response = await fetch(window.location.origin + "/api/sections", {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json",
                    "Authentication-Token" : token
                },
                body : JSON.stringify({
                    section_name : this.sectionName,
                    description : this.sectionDescription
                })
            });

            if(response.status === 201){
                const data = await response.json();
                // console.log(data);
                router.push("/adminallsections");
            }

            if(response.status === 400){
                const data = await response.json();
                console.log(data);
                alert(data.message);
                // router.push("/adminallsections");
                window.location.reload();
            }
        }
    },

};

export default AdminCreateSection;