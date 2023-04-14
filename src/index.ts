import { User } from "./modules/abstractClass";
import { fetchAllUsers, registerUser } from "./modules/restAPI";

export const userLoggedIn = localStorage.getItem("userLoggedIn") as string;
if (userLoggedIn) {
    location.assign("../html/feed.html");
}

const registerUserForm: HTMLFormElement | null = document.querySelector("#register-form");
if (registerUserForm) {
    registerUserForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const username: string = (document.querySelector("#input-username-new") as HTMLInputElement).value;
        const password: string = (document.querySelector("#input-password-new") as HTMLInputElement).value;
        const profilePic: string = (document.querySelector('input[name="avatarPic"]:checked') as HTMLInputElement).value;
        const timestamp: string = new Date().toLocaleString();
        const userObj = new User(username, password, profilePic, [{ message: "Hello world, first status message", timestamp: timestamp }]);

        const users: User[] = await fetchAllUsers();
        const index: number = users ? Object.keys(users).length : 0; // Use the length of the object keys to get the number of users

        registerUser(userObj, index);

        alert(`Welcome! ${username} you are now registered`);
    });
}

const loginForm: HTMLFormElement | null = document.querySelector("#login-form");
if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        console.log("eejejjejejejeje");
        event.preventDefault();
        const inputUsername: string = (document.querySelector("#input-username") as HTMLInputElement).value;
        const inputPassword: string = (document.querySelector("#input-password") as HTMLInputElement).value;

        
        

        const users: User[] = await fetchAllUsers();
        const checkStatus = checkLogin(inputUsername, inputPassword, users);

        if (!checkStatus) {
            alert("Couldn't find your username or password, make sure you have a valid username and password");
        }
    });
}

function checkLogin(inputUsername: string, inputPassword: string, users: User[]): boolean {
    try {
    
        
        const databaseUser = users.find(user => user.username === inputUsername);
        if (databaseUser && databaseUser.password === inputPassword) {
            localStorage.setItem("userLoggedIn", inputUsername);
            location.assign("/html/feed.html");
            return true;
        } else {
            alert("wrong password");
            return false;
        }
    } catch (error) {
        alert("an error occurred");
        return false;
    }
}
