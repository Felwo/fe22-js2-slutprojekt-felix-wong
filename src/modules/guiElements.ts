import { fetchAllUsers } from "./restAPI";
import { User, Post, PostInfo } from "./abstractClass";

const userLoggedIn = localStorage.getItem("userLoggedIn");

const profilePicMap: Record<string, string> = {
    pic1: "../images/BongoCat.png",
    pic2: "../images/BongoCat1.png",
    default: "../images/BongoCat2.png",
};

export async function generateUserInfo(): Promise<void> {
    const div = document.querySelector(".user-info") as HTMLDivElement;

    const users: User[] = await fetchAllUsers();
    users.forEach((user) => {
        if (user && user.username === userLoggedIn) {
            const usernameText: HTMLParagraphElement = document.createElement("p");
            const userProfilePic: HTMLImageElement = document.createElement("img");
            let imgURL: URL;

            div.append(usernameText, userProfilePic);
            usernameText.innerText = user.username;

            const profilePicURL = profilePicMap[user.profilePic] || profilePicMap.default;
            imgURL = new URL(profilePicURL, import.meta.url);
            userProfilePic.src = imgURL.href;
        }
    });
}

export function generatePostGUI(post: Post, fetchedData: User | PostInfo, appendTo: HTMLElement): void {
    const postElement = document.createElement("div");
    postElement.classList.add("post");

    const userNameAndPic = document.createElement("div");
    userNameAndPic.classList.add("userNameAndPic");

    const userProfilePicElement = document.createElement("img");
    userProfilePicElement.classList.add("profilePic");

    const usernameElement = document.createElement("div");
    usernameElement.classList.add("username");
    usernameElement.innerText = fetchedData.username;

    const messageElement = document.createElement("div");
    messageElement.classList.add("message");
    messageElement.innerText = post.message;

    const timestampElement = document.createElement("div");
    timestampElement.classList.add("timestamp");
    const date = new Date(post.timestamp);
    timestampElement.innerText = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

    const profilePic = fetchedData.profilePic;
    const imgURL = new URL(profilePicMap[profilePic], import.meta.url);

    userProfilePicElement.src = imgURL.href;
    userNameAndPic.append(userProfilePicElement, usernameElement);
    postElement.append(userNameAndPic, messageElement, timestampElement);

    appendTo.append(postElement);
}

export async function generateOtherUser(clickedOrLoggedinUser: string): Promise<void> {
    const userCard = document.querySelector(".user-card") as HTMLDivElement;
    const usernameH3 = document.querySelector(".user-card h3") as HTMLHeadingElement;
    usernameH3.innerText = clickedOrLoggedinUser;

    const users: User[] = await fetchAllUsers();
    users.forEach((user) => {
        if (user && user.username === clickedOrLoggedinUser) {
            const userProfilePic: HTMLImageElement = document.createElement("img");
            let imgUrl: URL;

            userCard.append(userProfilePic);
            if (user.profilePic in profilePicMap) {
                imgUrl = new URL(profilePicMap[user.profilePic], import.meta.url);
            } else {
                imgUrl = new URL(profilePicMap["default"], import.meta.url);
            }
            userProfilePic.src = imgUrl.href;
        }
    });
}
