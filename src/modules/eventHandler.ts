import { User } from "./abstractClass";

export function checkLogin(inputUsername: string, inputPassword: string, users: User[]): boolean {
    try {
        const databaseUser = users.find(user => user.username === inputUsername);
        if (databaseUser && databaseUser.password === inputPassword) {
            localStorage.setItem("userLoggedIn", inputUsername);
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

export function logOutEvent(): void {
    localStorage.removeItem("userLoggedIn");
}