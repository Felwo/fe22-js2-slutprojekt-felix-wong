import { User } from "../modules/abstractClass";
import { logOutEvent } from "../modules/eventHandler";
import { IPage, TPageSwitcher } from "./IPage";

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
    }

    private onDashboard (): void {
        this.setPage('dashboard');
    }

    private onLogout (): void {
        logOutEvent();
        this.setPage('login');
    }

    private renderHeader(): HTMLElement {
        // create section element with class "header"
        const sectionHeader = document.createElement("section");
        sectionHeader.classList.add("header");

        // create h1 element and add it to the sectionHeader
        const h1Element = document.createElement("h1");
        h1Element.textContent = "Din profil";
        sectionHeader.appendChild(h1Element);

        // create div element with class "nav-info"
        const divNavInfo = document.createElement("div");
        divNavInfo.classList.add("nav-info");

        // create button element with class "feed-btn" and add it to divNavInfo
        const buttonDashboard = document.createElement("button");
        buttonDashboard.classList.add("dashboard-btn");
        buttonDashboard.textContent = "Home";
        buttonDashboard.addEventListener('click', () => this.onDashboard());
        divNavInfo.appendChild(buttonDashboard);

        // create button element with class "log-out-btn" and add it to divNavInfo
        const buttonLogOut = document.createElement("button");
        buttonLogOut.classList.add("log-out-btn");
        buttonLogOut.textContent = "Log out";
        buttonLogOut.addEventListener("click", () => this.onLogout());
        divNavInfo.appendChild(buttonLogOut);

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
        divPopupButtons.appendChild(buttonConfirmDelete);

        // create button element with id "cancel-delete" and add it to divPopupButtons
        const buttonCancelDelete = document.createElement("button");
        buttonCancelDelete.setAttribute("id", "cancel-delete");
        buttonCancelDelete.textContent = "Cancel";
        divPopupButtons.appendChild(buttonCancelDelete);

        // add divConfirmDeletePopup to divNavInfo
        divNavInfo.appendChild(divConfirmDeletePopup);

        // create div element with class "user-info" and add it to divNavInfo
        const divUserInfo = document.createElement("div");
        divUserInfo.classList.add("user-info");
        divNavInfo.appendChild(divUserInfo);

        // add divNavInfo to sectionHeader
        sectionHeader.appendChild(divNavInfo);

        return sectionHeader;

    }
    private renderProfile(): HTMLElement {
        // create section element with class "profile-container"
        const sectionProfileContainer = document.createElement("section");
        sectionProfileContainer.classList.add("profile-container");

        // create div element with class "profile-posts"
        const divProfilePosts = document.createElement("div");
        divProfilePosts.classList.add("profile-posts");

        // create form element with id "newPostForm" and add it to divProfilePosts
        const formNewPost = document.createElement("form");
        formNewPost.setAttribute("id", "newPostForm");
        divProfilePosts.appendChild(formNewPost);

        // create input element with type "text", placeholder text, and id "new-post" and add it to formNewPost
        const inputNewPost = document.createElement("input");
        inputNewPost.setAttribute("type", "text");
        inputNewPost.setAttribute("placeholder", "Post positive message");
        inputNewPost.setAttribute("id", "new-post");
        formNewPost.appendChild(inputNewPost);

        // create button element with text content "Publish" and add it to formNewPost
        const buttonPublish = document.createElement("button");
        buttonPublish.textContent = "Publish";
        formNewPost.appendChild(buttonPublish);

        // create div element with id "my-posts" and add it to divProfilePosts
        const divMyPosts = document.createElement("div");
        divMyPosts.setAttribute("id", "my-posts");
        divProfilePosts.appendChild(divMyPosts);

        // add divProfilePosts to sectionProfileContainer
        sectionProfileContainer.appendChild(divProfilePosts);

        // create div element with class "user-card" and add it to sectionProfileContainer
        const divUserCard = document.createElement("div");
        divUserCard.classList.add("user-card");
        sectionProfileContainer.appendChild(divUserCard);

        // create h3 element and add it to divUserCard
        const h3UserCard = document.createElement("h3");
        divUserCard.appendChild(h3UserCard);

        return sectionProfileContainer;

    }
}