// User-klassen representerar en användare med en unik ID, användarnamn, lösenord, profilbild och en array av poster.
export class User {
    constructor(
        public readonly userID: string,
        public readonly username: string,
        public readonly password: string,
        public profilePic: string,
        public posts: Post[] = []
        ) {}
    }
    
    // Post-typen representerar en post med ett meddelande och en tidsstämpel.
    export type Post = {
        message: string;
        timestamp: string;
    }
    
    // PostInfo-typen representerar en post med ytterligare information såsom användarnamn och profilbild för den användare som skapade posten.
    export type PostInfo = {
        username: string;
        profilePic: string;
        message: string;
        timestamp: string;
    }
    
    // Koden inkluderar också en funktion för att hämta ID för den inloggade användaren från lokal lagring (local storage).
    export function loginedUser(): string | null  {
    return localStorage.getItem("userLoggedIn")
}