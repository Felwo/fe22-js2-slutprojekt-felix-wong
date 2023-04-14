export class User {
    constructor(
    public readonly username: string,
    public readonly password: string,
    public profilePic: string,
    public posts: Post[] = []
    ) {}
}

export type Post = {
    message: string;
    timestamp: string;
}

export type PostInfo = {
    username: string;
    profilePic: string;
    message: string;
    timestamp: string;
}

export function loginedUser(): string | null  {
    return localStorage.getItem("userLoggedIn")
}