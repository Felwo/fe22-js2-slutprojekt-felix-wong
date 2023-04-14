import { IPage, TPageSwitcher } from "./IPage";
import { PostInfo, User, loginedUser } from "../modules/abstractClass";
import { fetchAllUsers, postStatus, deleteUser } from "../modules/restAPI";
import { logOutEvent } from "../modules/eventHandler";
import { generatePostGUI } from "../modules/guiElements";
import { ProfilePage } from "./Profile";

export class DashboardPage implements IPage {
    private sectionHeader: HTMLElement;
    private sectionFeed: HTMLElement;

    constructor(private app: Element, private setPage: TPageSwitcher) {
        this.sectionHeader = this.renderHeader();
        this.sectionFeed = this.renderFeed();

    }

    render(): void {
        this.app.replaceChildren();
        document.title = "Dashboard Page";
        this.app.append(this.sectionHeader, this.sectionFeed)
        this.syncFeed()
        this.syncAllUsers()
    }

    private async onOpenMyProfile() {
        const users: User[] = await fetchAllUsers();
        const username = loginedUser()
        if (!username) {
            this.setPage("login")
            return
        }
        const user = users.find(user => user.username === username)
        if (!user) {
            this.setPage("login")
            return
        }
        this.setPage(new ProfilePage(this.app, this.setPage, user, true))
    }

    private onLogout(): void {
        logOutEvent();
        this.setPage('login');
    }

    private renderHeader(): HTMLElement {
        // create section element with class "header"
        const sectionHeader = document.createElement("section");
        sectionHeader.classList.add("header");

        // create h1 element and add it to the sectionHeader
        const h1Element = document.createElement("h1");
        h1Element.textContent = "Your feed";
        sectionHeader.appendChild(h1Element);

        // create section element with class "nav-info"
        const sectionNavInfo = document.createElement("section");
        sectionNavInfo.classList.add("nav-info");

        // create button element with class "profile-btn" and add it to sectionNavInfo
        const buttonProfile = document.createElement("button");
        buttonProfile.classList.add("profile-btn");
        buttonProfile.textContent = "My profile";
        buttonProfile.addEventListener("click", () => this.onOpenMyProfile());
        sectionNavInfo.appendChild(buttonProfile);

        // create button element with class "log-out-btn" and add it to sectionNavInfo
        const buttonLogOut = document.createElement("button");
        buttonLogOut.classList.add("log-out-btn");
        buttonLogOut.textContent = "Log out";
        buttonLogOut.addEventListener("click", () => this.onLogout());
        sectionNavInfo.appendChild(buttonLogOut);

        // create section element with class "user-info" and add it to sectionNavInfo
        const sectionUserInfo = document.createElement("section");
        sectionUserInfo.classList.add("user-info");
        sectionNavInfo.appendChild(sectionUserInfo);

        // add sectionNavInfo to sectionHeader
        sectionHeader.appendChild(sectionNavInfo);

        return sectionHeader;
    }

    private renderFeed(): HTMLElement {
        // create section element with class "feed-container"
        const sectionFeedContainer = document.createElement("section");
        sectionFeedContainer.classList.add("feed-container");

        // create section element with class "feed" and add it to sectionFeedContainer
        const sectionFeed = document.createElement("section");
        sectionFeed.classList.add("feed");
        sectionFeed.id = 'feed-list';
        sectionFeedContainer.appendChild(sectionFeed);

        // create section element with class "all-users" and add it to sectionFeedContainer
        const sectionAllUsers = document.createElement("section");
        sectionAllUsers.classList.add("user-container");

        // create h3 element with "All user(s):" text content and add it to sectionAllUsers
        const h3AllUsers = document.createElement("h3");
        h3AllUsers.textContent = "All user(s):";
        sectionAllUsers.appendChild(h3AllUsers);

        const userList = document.createElement("div")
        userList.id = "all-users"
        sectionAllUsers.appendChild(userList);

        // add sectionAllUsers to sectionFeedContainer
        sectionFeedContainer.appendChild(sectionAllUsers);

        return sectionFeedContainer;
    }

    private async syncAllUsers() {
        const allUsersDiv = document.querySelector("#all-users");
        if (!allUsersDiv) return;
        allUsersDiv.replaceChildren()

        const users: User[] = await fetchAllUsers();
        users.forEach((user) => {
            if (user) {
                const item = document.createElement("div");
                const a = document.createElement("a");
                a.innerHTML = user.username
                a.addEventListener("click",
                    () => this.setPage(
                            new ProfilePage(this.app, this.setPage, user, false)
                        )
                    )
                item.append(a)
                allUsersDiv.appendChild(item)
            }
        });
    }

    private async syncFeed() {
        const feedContainer = document.querySelector("#feed-list")
        if (!feedContainer) return;
        feedContainer.replaceChildren()

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
}