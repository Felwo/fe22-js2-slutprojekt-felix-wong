import { User } from "./abstractClass"

// URL för basadressen för Firebase Realtime Database API.
const baseURL: string = 'https://socialmediaplatform-368e0-default-rtdb.europe-west1.firebasedatabase.app/'

// Hämtar alla användare från Firebase Realtime Database API och konverterar dem till en array av User-objekt.
export async function fetchAllUsers(): Promise<User[]> {
    const url: string = `${baseURL}.json`;

    const reponse = await fetch(url);
    const data = await reponse.json();

    const users: User[] = []

    if (data && typeof data === 'object') {
        for (const [key, value] of Object.entries(data)) {
            if (typeof value === 'object') {
                const incomingUser = value as any
                users.push({
                    userID: key,
                    username: incomingUser.username,
                    password: incomingUser.password,
                    posts: incomingUser.posts,
                    profilePic: incomingUser.profilePic
                })
            }
        }
    }

    return users;
}

// Registrerar en användare i Firebase Realtime Database API och returnerar det nya användar-ID:et.
export async function registerUser(obj: User): Promise<string> {
    const url = `${baseURL}.json`;

    const init = {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
        }
    };
    return await fetch(url, init)
        .then(res => res.json())
        .then(user => user.name)
}

// Tar bort en användare från Firebase Realtime Database API baserat på användar-ID.
export async function deleteUser(userID: string): Promise<void> {
    const url = `${baseURL}${userID}.json`;

    const init = {
        method: 'DELETE',
    };

    await fetch(url, init);
}

// Skickar ett nytt statusinlägg till Firebase Realtime Database API för en användare baserat på användar-ID och index för statusinlägget.
export async function postStatus(obj: {message: string, timestamp: string}, userID: string, postIndex: number): Promise<void> {
    const url = `${baseURL}${userID}/posts/${postIndex}.json`;

    const init = {
        method: 'PUT',
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json; charset=uUTFtf-8",
        }
    }

    await fetch(url, init);
}