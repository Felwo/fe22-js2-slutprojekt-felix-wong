import { IPage, TPageSwitcher } from "./IPage";
import { PostInfo, User, loginedUser } from "../modules/abstractClass";
import { fetchAllUsers} from "../modules/restAPI";
import { logOutEvent } from "../modules/eventHandler";
import { generatePostGUI } from "../modules/guiElements";
import { ProfilePage } from "./Profile";

//Kolla LoginPage.ts för varför jag har gjort på detta sättet
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
        // Fetches all users and retrieves the current logged in user's username
        const users: User[] = await fetchAllUsers();
        // If no user is logged in, redirects to the login page
        const username = loginedUser()
        if (!username) {
            this.setPage("login")
            return
        }
        // Finds the user object that matches the logged in user's username
        const user = users.find(user => user.username === username)
        if (!user) {
            this.setPage("login")
            return
        }
        // Redirects to the profile page for the logged in user
        this.setPage(new ProfilePage(this.app, this.setPage, user, true))
    }

    private onLogout(): void {
        // Logs out the current user and redirects to the login page
        logOutEvent();
        this.setPage('login');
    }

    private renderHeader(): HTMLElement {
        const sectionHeader = document.createElement("section");
        sectionHeader.classList.add("header");

        const h1Element = document.createElement("h1");
        h1Element.textContent = "Your feed";
        sectionHeader.appendChild(h1Element);

        const sectionNavInfo = document.createElement("section");
        sectionNavInfo.classList.add("nav-info");

        const buttonProfile = document.createElement("button");
        buttonProfile.classList.add("profile-btn");
        buttonProfile.textContent = "My profile";
        buttonProfile.addEventListener("click", () => this.onOpenMyProfile());
        sectionNavInfo.appendChild(buttonProfile);

        const buttonLogOut = document.createElement("button");
        buttonLogOut.classList.add("log-out-btn");
        buttonLogOut.textContent = "Log out";
        buttonLogOut.addEventListener("click", () => this.onLogout());
        sectionNavInfo.appendChild(buttonLogOut);

        const sectionUserInfo = document.createElement("section");
        sectionUserInfo.classList.add("user-info");
        sectionNavInfo.appendChild(sectionUserInfo);

        sectionHeader.appendChild(sectionNavInfo);

        return sectionHeader;
    }

    private renderFeed(): HTMLElement {
        const sectionFeedContainer = document.createElement("section");
        sectionFeedContainer.classList.add("feed-container");

        const sectionFeed = document.createElement("section");
        sectionFeed.classList.add("feed");
        sectionFeed.id = 'feed-list';
        sectionFeedContainer.appendChild(sectionFeed);

        const sectionAllUsers = document.createElement("section");
        sectionAllUsers.classList.add("user-container");

        const h3AllUsers = document.createElement("h3");
        h3AllUsers.textContent = "All user(s):";
        sectionAllUsers.appendChild(h3AllUsers);

        const userList = document.createElement("div")
        userList.id = "all-users";
        sectionAllUsers.appendChild(userList);

        sectionFeedContainer.appendChild(sectionAllUsers);

        return sectionFeedContainer;
    }

    private async syncAllUsers() {
        const allUsersDiv = document.querySelector("#all-users");
        if (!allUsersDiv) return;
        allUsersDiv.replaceChildren()

        const users: User[] = await fetchAllUsers();
        // Create an element for each user and add it to the container
        users.forEach((user) => {
            if (user) {
                const item = document.createElement("div");
                const a = document.createElement("a");
                
                // Set the username as the link text
                a.innerHTML = user.username

                // Add an event listener to the link that opens the user's profile page when clicked
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

        // Fetch all users from the firebase
        const allPosts: PostInfo[] = [];
        const users: User[] = await fetchAllUsers();

        // Loop through each user's posts and add them to the feed
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
        // Sort the posts by timestamp
        allPosts.sort((a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        // Create an element for each post and add it to the feed
        allPosts.forEach((post) => {
            generatePostGUI(post, post, feedContainer);
        });
    }
}