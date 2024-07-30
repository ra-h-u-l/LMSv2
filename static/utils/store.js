const store = new Vuex.Store({
    state : {
        email : "",
        fullName : "",
        id : "",
        role : "",
        token : "",
        isLoggedIn : false
    },

    mutations : {
        setLoginData(state, loginData) {
            state.email = loginData.email;
            state.fullName = loginData.fullName;
            state.id = loginData.id;
            state.role = loginData.role;
            state.token = loginData.token;
            state.isLoggedIn = true;
            sessionStorage.setItem('store', JSON.stringify(state));
        },
        clearLoginData(state) {
            state.email = "";
            state.fullName = "";
            state.id = "";
            state.role = "";
            state.token = "";
            state.isLoggedIn = false;
            sessionStorage.setItem('store', JSON.stringify(state));
        },
    },

    actions : {
        login({commit}, loginData) {
            commit("setLoginData", loginData);
        },
        logout({commit}) {
            commit("clearLoginData");
        },
    },

    getters : {
        getLoginData(state) {
            return {email : state.email,
                    fullName : state.fullName,
                    id : state.id,
                    role : state.role,
                    token : state.token,
                    isLoggedIn : state.isLoggedIn
                    };
        },
        
    }
});

// Load state from sessionStorage
const savedState = sessionStorage.getItem('store');
if (savedState) {
    store.replaceState(Object.assign(store.state, JSON.parse(savedState)));
}

export default store;