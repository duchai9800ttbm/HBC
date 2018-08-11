export class CommentModel {
    id: number;
    parentId: number;
    time: number;
    user: {
        userId: number;
        userName: string;
    };
    content: string;
    avatar: string;
    replyComments: CommentModel[];
}
