
export interface User {
    userId: number;
    username: string;
    password: string;
    email: string;
    phoneNumber: string;
    major: string;
    createdAt: string;
    gender:string;
    hometown:string;
    mbti:string;
    nickname:string;
    bio:string;
}

export interface Post {
    postId: number,
    userId: number,
    title: string,
    postContent: string,
    commentCount: number,
    likeCount: number,
    createdAt: string,
    updatedTime: string,
    updatedAt: string,
    deletedAt:string,
    cover: string,
    topicId: number
}

export interface Topic {
    topicId: number,
    name: string,
    cover: string,
    description: string,
    postCount: number,
    followerCount: number,
    flag:string;
}

export interface Register {
    username: string;
    password: string;
    email: string;
}