import AdminNavbar from "../components/AdminNavbar.js";
import router from "../utils/router.js";
import store from "../utils/store.js";

const AdminUpdateSection = {
    template : `
        <div>
            <AdminNavbar/>
                <h3>Update Section</h3>
                <form>
                    <div class="form-group">
                        <label for="section-name">Section Name</label>
                        <input v-model="sectionName" type="text" class="form-control" id="section-name" aria-describedby="emailHelp" placeholder=sectionDescription>
                    </div>
                    <div class="form-group">
                        <label for="section-description">Section Description</label>
                        <input v-model="sectionDescription" type="text" class="form-control" id="section-description" placeholder=sectionDescription>
                    </div>
                    <button @click="updateSection()" type="submit" class="btn btn-primary">Update</button>
                </form>
        </div>
    `,

    components : {
        AdminNavbar
    },

    data(){
        return{
            sectionName : store.state.section_name,
            sectionDescription : store.state.section_description,
        }
    },

    methods : {
        async updateSection(){
            const token = store.getters.getLoginData.token;

            const response = await fetch(window.location.origin + "/api/sections", {
                method : "PUT",
                headers : {
                    "Content-Type" : "application/json",
                    "Authentication-Token" : token
                },
                body : JSON.stringify({
                    id : store.state.section_id,
                    section_name : this.sectionName,
                    description : this.sectionDescription
                })
            });

            if(response.status === 200){
                const data = await response.json();

                store.state.section_id = null;
                store.state.section_name = "";
                store.state.section_description = "";

                router.push("/adminallsections");
            }

            if(response.status === 404){
                const data = await response.json();

                alert(data.message);
                
                router.push("/adminallsections");
            }
        }
    },

};

export default AdminUpdateSection;