import { fetchAllUsers } from "./restAPI";
import { userLoggedIn } from "..";
import { User, PostInfo } from "./abstractClass";
import { generateUserInfo, generatePostGUI } from "./guiElements";

export const logOutBtn = document.querySelector(".log-out-btn") as HTMLButtonElement;
export const profileBtn = document.querySelector(".profile-btn") as HTMLButtonElement;
export const feedBtn = document.querySelector(".feed-btn") as HTMLButtonElement;

export function logOut(): void {
    localStorage.removeItem("userLoggedIn");
    location.assign("../index.html");
}

if (userLoggedIn) {
    generateUserInfo();
    displayAllUsers();
    displayFeed();
} else {
    // location.assign("../index.html");
}

function createUserLink(user: User): HTMLAnchorElement {
    const userLink = document.createElement("a");
    userLink.innerText = user.username;
    userLink.addEventListener("click", () => {
        const profileUrl = new URL("./users.html", window.location.href);
        profileUrl.searchParams.set("name", user.username);
        location.assign(profileUrl.href);
    });
    return userLink;
}

async function displayAllUsers(): Promise<void> {
    const allUsersDiv = document.querySelector(".all-users") as HTMLDivElement;
    const users: User[] = await fetchAllUsers();
    users.forEach((user) => {
        if (user) {
            allUsersDiv.append(createUserLink(user));
        }
    });
}

async function displayFeed(): Promise<void> {
    const feedContainer = document.querySelector(".feed") as HTMLDivElement;

    const allPosts: PostInfo[] = [];
    const users: User[] = await fetchAllUsers();

    users.forEach((user) => {
        if (user) {
            const username = user.username;
            const profilePic = user.profilePic;

            user.posts.forEach((post) => {
                const message = post.message;
                const timestamp = post.timestamp;
                allPosts.push({ username, profilePic, message, timestamp });
            });
        }
    });
    allPosts.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    allPosts.forEach((post) => {
        generatePostGUI(post, post, feedContainer);
    });
}

logOutBtn.addEventListener("click", () => {
    logOut();
});

profileBtn.addEventListener("click", () => {
    location.assign("./profile.html");
});