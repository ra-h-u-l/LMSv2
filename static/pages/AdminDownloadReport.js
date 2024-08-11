import AdminNavbar from "../components/AdminNavbar.js";
import store from "../utils/store.js";
import router from "../utils/router.js";

const AdminDownloadReport = {
    template : `
        <div>
            <AdminNavbar/>
            <center>
                <h3 style="font-family: Arial, sans-serif; color: darkblue; font-weight: bold; margin-top: 2px; text-shadow: 3px 3px 5px rgba(0, 0, 0, 0.5); margin-top: 5%; background-color: #5B9FC8; width: 30%; padding: 10px;">CSV Report : <button @click="adminDownloadReport()" class="btn btn-outline-success" type="submit" style="color: darkblue; font-weight: 500;">Download Report</button></h3>
                
            </center>
        </div>
    `,

    components : {
        AdminNavbar
    },

    data(){
        return{
            allBooks : null,
        }
    },

    methods : {
        async adminDownloadReport(){
            const token = store.getters.getLoginData.token;
            const task_id = sessionStorage.getItem('task_id');
            const response = await fetch(window.location.origin + "/admingetreport/" + task_id, {
                method : "GET",
                headers : {
                    "Authentication-Token" : token
                }
            });

            if(response.status === 200) {
                const blob = await response.blob();
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = "report.csv";
                document.body.appendChild(link);
                link.click();
                link.remove();
                console.log("Report Downloaded");
            }

            if(response.status === 405) {
                const data = await response.json();
                console.log(data);
                alert(data.result);
            }
        },

    },

    beforeDestroy(){
        sessionStorage.removeItem('task_id');
    }


};

export default AdminDownloadReport;