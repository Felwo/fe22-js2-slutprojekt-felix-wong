/* 
Anledning till varför jag gjorde på detta sättet, är pga parcel gillade inte flera html filer när man kör npm run dev eller något liknade.
Så jag gjorde om hela min kod till rent typescript som render html elementer som byter pages beroende vad .ts filen innehåller. 
Vilket funkade bättre än att bråka med parcel när man hade flera entrypoints, det var väldigt buggy när man hade flera src/html/(filnamn) i package.json scripten.
Så jag körde med att göra detta på en html fil istället. 
Anledning till varför det funkar ibland när man använder "npm run dev": https://github.com/parcel-bundler/parcel/pull/1119#issuecomment-1501818059
*/
import { IPage, TPageSwitcher } from "./IPage";
import { User } from "../modules/abstractClass";
import { fetchAllUsers, registerUser } from "../modules/restAPI";
import { loginedUser } from "../modules/abstractClass";
import { checkLogin } from "../modules/eventHandler";

import BongoCat1 from "../images/BongoCat.png"
import BongoCat2 from "../images/BongoCat1.png"
import BongoCat3 from "../images/BongoCat2.png"

const IMAGE_LIST = [
    BongoCat1,
    BongoCat2,
    BongoCat3
]

// This class represents the LoginPage of the app
export class LoginPage implements IPage {
    private loginForm: HTMLFormElement
    private registerForm: HTMLFormElement

    // The constructor sets up the login and registration forms, and attaches event listeners
    constructor(private app: Element, private setPage: TPageSwitcher) {
        this.loginForm = this.renderLoginForm()
        this.registerForm = this.renderRegisterForm()

        // Add event listeners for form submissions
        this.loginForm.addEventListener('submit', (e) => this.onLogin(e))
        this.registerForm.addEventListener('submit', (e) => this.onRegister(e))
    }

    // This method is called when the page is rendered
    render(): void {
        // Clear the app element and set the title
        this.app.replaceChildren();
        document.title = 'Login Page';

        // Append the login and registration forms
        this.app.append(
            this.loginForm,
            this.registerForm
        )
        // If a user is already logged in, redirect to the dashboard
        if (loginedUser()) this.setPage("dashboard")
    }

    // This method handles the login form submission
    private async onLogin(e: SubmitEvent) {
        e.preventDefault()
        const inputUsername: string = (document.querySelector("#login-username") as HTMLInputElement).value;
        const inputPassword: string = (document.querySelector("#login-password") as HTMLInputElement).value;

        const users = await fetchAllUsers();
        const checkStatus = checkLogin(inputUsername, inputPassword, users);

        if (!checkStatus) {
            alert("Couldn't find your username or password, make sure you have a valid username and password");
        } else {
            this.setPage('dashboard')
        }
    }
    
    // This method handles the registration form submission
    private async onRegister(e: SubmitEvent) {
        e.preventDefault()
        const username: string = (document.querySelector("#register-username") as HTMLInputElement).value;
        const password: string = (document.querySelector("#register-password") as HTMLInputElement).value;
        const profilePic: string = (document.querySelector('input[name="avatarPic"]:checked') as HTMLInputElement).value;
        const timestamp: string = new Date().toISOString();
        const userObj = new User('', username, password, profilePic, [{ message: "Hello world, first status message", timestamp: timestamp }]);

        // Fetch all users and check if the username is already taken
        const users: User[] = await fetchAllUsers();
        const isDuplicate = users.find(u => u.username === username);
        if (!isDuplicate) {
            registerUser(userObj);
            alert(`Welcome! ${username} you are now registered`);
        } else {
            alert("Name already taken!")
        }

    }

    // Private method for rendering the login form
    private renderLoginForm(): HTMLFormElement {
        const form = document.createElement('form');
        form.classList.add('login-form');

        const title = document.createElement('h2');
        title.innerHTML = 'Login';

        const inputUsername = document.createElement('input');
        inputUsername.placeholder = 'Username';
        inputUsername.id = 'login-username';

        const inputPassword = document.createElement('input');
        inputPassword.placeholder = 'Password';
        inputPassword.id = 'login-password';
        inputPassword.type = 'password';

        const button = document.createElement('button');
        button.innerHTML = 'Log in';

        form.append(title, inputUsername, inputPassword, button);
        return form
    }

    // Private method for rendering the register form
    private renderRegisterForm(): HTMLFormElement {
        const form = document.createElement('form');
        form.classList.add('register-form');

        const title = document.createElement('h2');
        title.innerHTML = 'Register user';

        const inputUsername = document.createElement('input');
        inputUsername.placeholder = 'Username';
        inputUsername.id = 'register-username';

        const inputPassword = document.createElement('input');
        inputPassword.placeholder = 'Password';
        inputPassword.id = 'register-password';
        inputPassword.type = 'password';

        const button = document.createElement('button');
        button.innerHTML = 'Register';

        const section = document.createElement('section');
        const sectionTitle = document.createElement('h3');
        sectionTitle.innerHTML = 'Choose avatars';
        const imageContainer = document.createElement('div')
        imageContainer.classList.add('avatars-container');

        //Loops through and display images as input radio 
        for (let i = 0; i < IMAGE_LIST.length; i++) {
            const url = IMAGE_LIST[i]
            const label = document.createElement('label')
            const inputRadio = document.createElement('input');
            inputRadio.type = 'radio';
            inputRadio.name = 'avatarPic';
            inputRadio.value = `pic${i}`;
            if (i === 0) {
                inputRadio.checked = true;
            }
            const img = document.createElement('img');
            img.src = url;
            label.append(inputRadio, img);
            imageContainer.append(label);
        }

        form.append(title, inputUsername, inputPassword, button, imageContainer);
        return form
    }
}