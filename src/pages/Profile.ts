import { User, loginedUser } from "../modules/abstractClass";
import { logOutEvent } from "../modules/eventHandler";
import { IPage, TPageSwitcher } from "./IPage";
import { generatePostGUI } from "../modules/guiElements";
import { postStatus, fetchAllUsers, deleteUser } from "../modules/restAPI";

//Kolla LoginPage.ts för varför jag har gjort på detta sättet
export class ProfilePage implements IPage {
    private sectionHeader: HTMLElement;
    private sectionProfile: HTMLElement;

    constructor(
        private app: Element,
        private setPage: TPageSwitcher,
        private user: User,
        private isYourProfile: boolean
    ) {
        this.sectionHeader = this.renderHeader();
        this.sectionProfile = this.renderProfile();
    }

    render(): void {
        this.app.replaceChildren();
        document.title = this.user.username;
        this.app.append(this.sectionHeader, this.sectionProfile);
        this.syncPosts();
    }

    private onDashboard(): void {
        this.setPage('dashboard');
    }

    private onLogout(): void {
        logOutEvent();
        this.setPage('login');
    }

    private onDelete(): void {
        logOutEvent();
        this.setPage('login');
    }

    private renderHeader(): HTMLElement {
        const sectionHeader = document.createElement("section");
        sectionHeader.classList.add("header");

        const h1Element = document.createElement("h1");
        if(!this.isYourProfile){
            h1Element.textContent = `${this.user.username}'s profile`;
        }
        else {
        h1Element.textContent = "Your profile";
        }
        sectionHeader.appendChild(h1Element);

        const divNavInfo = document.createElement("div");
        divNavInfo.classList.add("nav-info");

        const buttonDashboard = document.createElement("button");
        buttonDashboard.classList.add("dashboard-btn");
        buttonDashboard.textContent = "Home";
        buttonDashboard.addEventListener('click', () => this.onDashboard());
        divNavInfo.appendChild(buttonDashboard);

        const buttonLogOut = document.createElement("button");
        buttonLogOut.classList.add("log-out-btn");
        buttonLogOut.textContent = "Log out";
        buttonLogOut.addEventListener("click", () => this.onLogout());
        divNavInfo.appendChild(buttonLogOut);

        if (this.isYourProfile) {
            // create button element with id "delete-account" and add it to divNavInfo
            const buttonDeleteAccount = document.createElement("button");
            buttonDeleteAccount.setAttribute("id", "delete-account");
            buttonDeleteAccount.textContent = "Delete my account";
            divNavInfo.appendChild(buttonDeleteAccount);

            // create div element with id "confirm-delete-popup" and class "popup"
            const divConfirmDeletePopup = document.createElement("div");
            divConfirmDeletePopup.setAttribute("id", "confirm-delete-popup");
            divConfirmDeletePopup.classList.add("popup");

            // create div element with class "popup-content" and add it to divConfirmDeletePopup
            const divPopupContent = document.createElement("div");
            divPopupContent.classList.add("popup-content");
            divConfirmDeletePopup.appendChild(divPopupContent);

            // create p element with text content and add it to divPopupContent
            const pDeleteConfirmation = document.createElement("p");
            pDeleteConfirmation.textContent = "Are you sure you want to delete? This change is permanent";
            divPopupContent.appendChild(pDeleteConfirmation);

            // create div element with class "popup-buttons" and add it to divPopupContent
            const divPopupButtons = document.createElement("div");
            divPopupButtons.classList.add("popup-buttons");
            divPopupContent.appendChild(divPopupButtons);

            // create button element with id "confirm-delete" and add it to divPopupButtons
            const buttonConfirmDelete = document.createElement("button");
            buttonConfirmDelete.setAttribute("id", "confirm-delete");
            buttonConfirmDelete.textContent = "Confirm";
            buttonConfirmDelete.addEventListener('click', () => this.deleteMyProfile())
            divPopupButtons.appendChild(buttonConfirmDelete);

            // create button element with id "cancel-delete" and add it to divPopupButtons
            const buttonCancelDelete = document.createElement("button");
            buttonCancelDelete.setAttribute("id", "cancel-delete");
            buttonCancelDelete.textContent = "Cancel";
            divPopupButtons.appendChild(buttonCancelDelete);

            // add divConfirmDeletePopup to divNavInfo
            divNavInfo.appendChild(divConfirmDeletePopup);
        }

        const divUserInfo = document.createElement("div");
        divUserInfo.classList.add("user-info");
        divNavInfo.appendChild(divUserInfo);

        sectionHeader.appendChild(divNavInfo);

        return sectionHeader;

    }
    private renderProfile(): HTMLElement {
        const sectionProfileContainer = document.createElement("section");
        sectionProfileContainer.classList.add("profile-container");

        const divProfilePosts = document.createElement("div");
        divProfilePosts.classList.add("profile-posts");

        if (this.isYourProfile) {
            const formNewPost = document.createElement("form");
            formNewPost.setAttribute("id", "newPostForm");
            divProfilePosts.appendChild(formNewPost);
            
            const inputNewPost = document.createElement("input");
            inputNewPost.setAttribute("type", "text");
            inputNewPost.setAttribute("placeholder", "Post positive message");
            inputNewPost.setAttribute("id", "new-post");
            formNewPost.appendChild(inputNewPost);

            const buttonPublish = document.createElement("button");
            buttonPublish.textContent = "Publish";
            formNewPost.appendChild(buttonPublish);

            formNewPost.addEventListener("submit", e => {
                e.preventDefault()
                this.publishPost();
            })
        }

        const divMyPosts = document.createElement("div");
        divMyPosts.setAttribute("id", "my-posts");
        divProfilePosts.appendChild(divMyPosts);

        sectionProfileContainer.appendChild(divProfilePosts);

        const divUserCard = document.createElement("div");
        divUserCard.classList.add("user-card");
        sectionProfileContainer.appendChild(divUserCard);

        const h3UserCard = document.createElement("h3");
        divUserCard.appendChild(h3UserCard);

        return sectionProfileContainer;

    }

    private async syncPosts() {
        const myPosts = document.querySelector('#my-posts') as HTMLDivElement;
        const users: User[] = await fetchAllUsers();
        const username = this.user.username
        const user = users.find(user => user.username === username)!;
        this.user = user;
        myPosts.replaceChildren();
        this.user.posts.reverse().forEach(post => {
            generatePostGUI(post, this.user, myPosts);
        })
    }

    private async publishPost() {
        const newPost: string = (document.querySelector('#new-post') as HTMLInputElement).value;

        const postObject = {
            message: newPost,
            timestamp: new Date().toISOString(),
        };

        const users: User[] = await fetchAllUsers();
        users.forEach((user) => {
            if (user && user.username === this.user.username) {
                const postIndex = user.posts.length;
                postStatus(postObject, user.userID, postIndex).then(() => this.syncPosts());
            }
        });
    }

    private async deleteMyProfile (){
        const users: User[] = await fetchAllUsers();
        const username = loginedUser()!;
        users.forEach((user) => {
        if (user && user.username === username) {
            deleteUser(user.userID).then(() => this.onDelete());
        }
    })
    }

}