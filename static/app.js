import router from "./utils/router.js";
import store from "./utils/store.js";


new Vue({
    el : "#app",
    template : `<div>
                    <router-view/>
                </div>`,
    router,
    store,
    
});