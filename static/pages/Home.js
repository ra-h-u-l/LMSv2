import Navbar from "./../components/Navbar.js";

const Home = {
    template: `
        <div>
            <Navbar/>
            <center>
                <h1 style="font-family: Arial, sans-serif; color: #f70776; font-size: 3em; font-weight: bold; margin-top: 20%; text-shadow: 3px 3px 5px rgba(0, 0, 0, 0.5);">
                    Welcome to Library Management System
                </h1>
            </center>
        </div>
    `,
    components : {
        Navbar
    },
}

export default Home;