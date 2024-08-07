import UserNavbar from "../components/UserNavbar.js";
import store from "../utils/store.js";
import router from "../utils/router.js";

const UserAllSections = {
    template : `
        <div>
            <UserNavbar/>
            <center>
                <h3>All Sections</h3>
                <div>
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">S. No.</th>
                                <th scope="col">Section Name</th>
                                <th scope="col">Description</th>
                                <th scope="col">ViewBooks</th>
                                <th scope="col">Created On</th>
                                <th scope="col">Updated On</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(section, index) in allSections">
                                <th scope="row">{{index + 1}}</th>
                                <td >{{section.section_name}}</td>
                                <td >{{section.description}}</td>
                                <td><button @click="viewBooks(section.section_id)" type="button" class="btn btn-primary">View Books</button></td>
                                <td>{{section.date_created}}</td>
                                <td>{{section.last_updated}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </center>
        </div>
    `,

    components : {
        UserNavbar
    },

    data(){
        return{
            allSections : null,
        }
    },

    methods : {

        viewBooks(section_id){
            sessionStorage.setItem('section_id', section_id);
            router.push("/userparticularsectionbooks");
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
            console.log(data);
        }
    },

};

export default UserAllSections;