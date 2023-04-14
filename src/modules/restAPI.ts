import { User } from "./abstractClass"

const baseURL: string = 'https://socialmedia-e7c98-default-rtdb.europe-west1.firebasedatabase.app/'

export async function fetchAllUsers(): Promise<User[]> {
    const url: string = `${baseURL}.json`;

    const reponse = await fetch(url);
    const data = await reponse.json();
    return data;
}

export async function registerUser(obj: User, index: number): Promise<void> {
    const url = `${baseURL}${index}.json`;

    const init = {
        method: 'PUT',
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
        }
    };
    await fetch(url, init);
}

export async function deleteUser(userIndex: number): Promise<void> {
    const url = `${baseURL}${userIndex}.json`;

    const init = {
        method: 'DELETE',
    };

    await fetch(url, init);
}

export async function postStatus(obj: {message: string, timestamp: string}, userIndex: number, postIndex: number): Promise<void> {
    const url = `${baseURL}${userIndex}/posts/${postIndex}.json`;

    const init = {
        method: 'PUT',
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json; charset=uUTFtf-8",
        }
    }

    await fetch(url, init);
}