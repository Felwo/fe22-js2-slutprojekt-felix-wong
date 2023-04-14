import { User } from "./abstractClass";
import { logOutBtn, feedBtn, logOut } from "./feed";
import { userLoggedIn } from "./abstractClass";
import { fetchAllUsers, postStatus, deleteUser } from "./restAPI";
import { generatePostGUI, generateUserInfo, generateDesiredUser } from "./guiElements";

if (userLoggedIn) {
    generateUserInfo();
    generateDesiredUser(userLoggedIn);
    displayMyPosts();
} else {
    location.assign("../index.html");
}

async function displayMyPosts(): Promise<void> {
    const myPosts = document.querySelector('#my-posts') as HTMLDivElement;
    myPosts.innerHTML = '';
    const users: User[] = await fetchAllUsers();
    users.forEach(user => {
        if (user && user.username === userLoggedIn) {
            user.posts.reverse().forEach(post => {
                generatePostGUI(post, user, myPosts);
            })
        }
    });

}

const newPostForm: HTMLFormElement | null = document.querySelector('#new-post');

if (newPostForm) {
    newPostForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const newPost: string = (document.querySelector('#new-post') as HTMLInputElement).value;

        const postObject = {
            message: newPost,
            timestamp: new Date().toLocaleString(),
        };

        const users: User[] = await fetchAllUsers();
        users.forEach((user, index) => {
            if (user && user.username === userLoggedIn) {
                const userIndex = index;
                const postIndex = user.posts.length;
                postStatus(postObject, userIndex, postIndex).then(displayMyPosts);
            }
        });
    });
}

// const deleteAccBtn = document.querySelector('#delete-account') as HTMLButtonElement;
// const confirmDeleteBtn = document.querySelector('#confirm-delete') as HTMLButtonElement;

// const confirmDeletePopup = document.querySelector('#confirm-delete-popup') as HTMLButtonElement;
// const cancelDeleteBtn = document.querySelector('#cancel-delete') as HTMLButtonElement;

// deleteAccBtn.addEventListener("click", () => {
//     confirmDeletePopup.style.display = "block";
// });

// cancelDeleteBtn.addEventListener("click", () => {
//     confirmDeletePopup.style.display = "none";
// });

// confirmDeleteBtn.addEventListener('click', async () => {
//     const users: User[] = await fetchAllUsers();
//     users.forEach((user, index) => {
//         if (user && user.username === userLoggedIn) {
//             deleteUser(index).then(logOut);
//         }
//     })
//     confirmDeletePopup.style.display = "none";
// });

logOutBtn.addEventListener("click", () => {
    logOut();
});

feedBtn.addEventListener("click", () => {
    location.assign("./profile.html");
});