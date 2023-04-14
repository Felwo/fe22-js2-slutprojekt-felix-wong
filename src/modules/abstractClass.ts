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
    timestamp: number;
}

export type PostInfo = {
    username: string;
    profilePic: string;
    message: string;
    timestamp: string;
}