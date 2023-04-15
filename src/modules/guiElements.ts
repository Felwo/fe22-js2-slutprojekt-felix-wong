import { fetchAllUsers } from "./restAPI";
import { User, Post, PostInfo } from "./abstractClass";

import BongoCat1 from "../images/BongoCat.png"
import BongoCat2 from "../images/BongoCat1.png"
import BongoCat3 from "../images/BongoCat2.png"

const userLoggedIn = localStorage.getItem("userLoggedIn");

const profilePicMap: Record<string, string> = {
    pic0: BongoCat1,
    pic1: BongoCat2,
    pic2: BongoCat3,
    default: BongoCat3,
};

// Generate user info and display on the page
export async function generateUserInfo(): Promise<void> {
    const div = document.querySelector(".user-info") as HTMLDivElement;

    // Fetch all users and loop through each user to find the logged-in user
    const users: User[] = await fetchAllUsers();
    users.forEach((user) => {
        if (user && user.username === userLoggedIn) {
            // Create and append a paragraph element to display the username
            const usernameText: HTMLParagraphElement = document.createElement("p");
            const userProfilePic: HTMLImageElement = document.createElement("img");
            let imgURL: URL;

            div.append(usernameText, userProfilePic);
            usernameText.innerText = user.username;

            // Create and append an image element to display the user's profile picture
            const profilePicURL = profilePicMap[user.profilePic] || profilePicMap.default;
            imgURL = new URL(profilePicURL, import.meta.url);
            userProfilePic.src = imgURL.href;
        }
    });
}

/**
 * Creates a post element for the given post and appends it to the provided element.
 * @param post - The post to create an element for.
 * @param fetchedData - The user or post info associated with the post.
 * @param appendTo - The element to append the post element to.
 */
export function generatePostGUI(post: Post, fetchedData: User | PostInfo, appendTo: Element): void {
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

    userProfilePicElement.src = profilePicMap[profilePic]
    userNameAndPic.append(userProfilePicElement, usernameElement);
    postElement.append(userNameAndPic, messageElement, timestampElement);

    appendTo.append(postElement);
}

/**
Fetches all users and generates the user card for the desired user.
@param {string} desiredUser - The username of the desired user to generate the card for.
@returns {Promise<void>} Promise that resolves when the user card is generated.
*/
export async function generateDesiredUser(desiredUser: string): Promise<void> {
    const userCard = document.querySelector(".user-card") as HTMLDivElement;
    const usernameH3 = document.querySelector(".user-card h3") as HTMLHeadingElement;
    usernameH3.innerText = desiredUser;

    const users: User[] = await fetchAllUsers();
    users.forEach((user) => {
        if (user && user.username === desiredUser) {
            const userProfilePic: HTMLImageElement = document.createElement("img");
            let imgUrl: string 

            userCard.append(userProfilePic);
            if (user.profilePic in profilePicMap) {
                imgUrl = profilePicMap[user.profilePic]
            } else {
                imgUrl = profilePicMap["default"]
            }
            userProfilePic.src = imgUrl;
        }
    });
}
