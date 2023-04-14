import { DashboardPage } from "./pages/Dashboard";
import { IPage } from "./pages/IPage";
import { LoginPage } from "./pages/LoginPage";

async function main() {
    const app = document.querySelector('#app');
    if (!app) throw new Error("No app container found");

    const pages = new Map<string, IPage>();
    let currentPage: IPage | undefined = undefined
    function setPage(page: string | IPage) {
        if (typeof page === "string")
            currentPage = pages.get(page)
        else if (typeof page === "object")
            currentPage = page
        else throw new Error("Not a valid page")

        if (currentPage) currentPage.render()
    }

    const login = new LoginPage(app, setPage)
    const dashboard = new DashboardPage(app, setPage)
    pages.set('login', login)
    pages.set('dashboard', dashboard)
    setPage('login')
}

window.onload = main



// if (userLoggedIn) {
//     location.assign("./html/feed.html");
// }

// const registerUserForm: HTMLFormElement | null = document.querySelector("#register-form");
// if (registerUserForm) {
//     registerUserForm.addEventListener("submit", async (event) => {
//         event.preventDefault();
//         const username: string = (document.querySelector("#input-username-new") as HTMLInputElement).value;
//         const password: string = (document.querySelector("#input-password-new") as HTMLInputElement).value;
//         const profilePic: string = (document.querySelector('input[name="avatarPic"]:checked') as HTMLInputElement).value;
//         const timestamp: string = new Date().toLocaleString();
//         const userObj = new User(username, password, profilePic, [{ message: "Hello world, first status message", timestamp: timestamp }]);

//         const users: User[] = await fetchAllUsers();
//         const index: number = users ? Object.keys(users).length : 0; // Use the length of the object keys to get the number of users

//         registerUser(userObj, index);

//         alert(`Welcome! ${username} you are now registered`);
//     });
// }

// const loginForm: HTMLFormElement | null = document.querySelector("#login-form");
// if (loginForm) {
//     loginForm.addEventListener("submit", async (event) => {
//         event.preventDefault();
//         const inputUsername: string = (document.querySelector("#input-username") as HTMLInputElement).value;
//         const inputPassword: string = (document.querySelector("#input-password") as HTMLInputElement).value;

//         const users: User[] = await fetchAllUsers();
//         const checkStatus = checkLogin(inputUsername, inputPassword, users);

//         if (!checkStatus) {
//             alert("Couldn't find your username or password, make sure you have a valid username and password");
//         }
//     });
// }

