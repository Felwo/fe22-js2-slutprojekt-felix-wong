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

export class LoginPage implements IPage {
    private loginForm: HTMLFormElement
    private registerForm: HTMLFormElement

    constructor(private app: Element, private setPage: TPageSwitcher) {
        this.loginForm = this.renderLoginForm()
        this.registerForm = this.renderRegisterForm()

        this.loginForm.addEventListener('submit', (e) => this.onLogin(e))
        this.registerForm.addEventListener('submit', (e) => this.onRegister(e))
    }

    render(): void {
        this.app.replaceChildren();
        document.title = 'Login Page';
        this.app.append(
            this.loginForm,
            this.registerForm
        )
        if (loginedUser()) this.setPage("dashboard")
    }

    private async onLogin(e: SubmitEvent) {
        e.preventDefault()
        const inputUsername: string = (document.querySelector("#login-username") as HTMLInputElement).value;
        const inputPassword: string = (document.querySelector("#login-password") as HTMLInputElement).value;
        
        const users: User[] = await fetchAllUsers();
        const checkStatus = checkLogin(inputUsername, inputPassword, users);

        if (!checkStatus) {
            alert("Couldn't find your username or password, make sure you have a valid username and password");
        } else {
            this.setPage('dashboard')
        }
    }
    private async onRegister(e: SubmitEvent) {
        e.preventDefault()
        const username: string = (document.querySelector("#register-username") as HTMLInputElement).value;
        const password: string = (document.querySelector("#register-password") as HTMLInputElement).value;
        const profilePic: string = (document.querySelector('input[name="avatarPic"]:checked') as HTMLInputElement).value;
        const timestamp: string = new Date().toLocaleString();
        const userObj = new User(username, password, profilePic, [{ message: "Hello world, first status message", timestamp: timestamp }]);

        // const users: User[] = await fetchAllUsers();
        // const index: number = users ? Object.keys(users).length : 0; // Use the length of the object keys to get the number of users

        // registerUser(userObj, index);

        alert(`Welcome! ${username} you are now registered`);
    }

    private renderLoginForm(): HTMLFormElement {
        const form = document.createElement('form');
        // TODO: Add CSS class for design later
        
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

    private renderRegisterForm(): HTMLFormElement {
        const form = document.createElement('form');
        // TODO: Add CSS class for design later
        
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

        for (let i = 0; i < IMAGE_LIST.length; i++) {
            const url = IMAGE_LIST[i]
            const label = document.createElement('label')
            const inputRadio = document.createElement('input');
            inputRadio.type = 'radio';
            inputRadio.name = 'avatarPic';
            inputRadio.value = `pic${i}`;
            if(i === 0) {
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