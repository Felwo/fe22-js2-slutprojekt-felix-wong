import { User } from "./abstractClass";

// Kontrollerar om det givna användarnamnet och lösenordet matchar en användare i listan av användare.
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

// Tar bort den inloggade användaren från lokal lagring (local storage).
export function logOutEvent(): void {
    localStorage.removeItem("userLoggedIn");
}