import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ApiService, SessionService } from "./index";
import { CommentModel } from "../modules/comments/comment.model";
import { Observable } from "rxjs/Observable";
import { PagedResult } from "../models/index";

@Injectable()
export class CommentService {
    constructor(
        private apiService: ApiService,
        private sessionService: SessionService
    ) {}

    get employeeId() {
        return this.sessionService.currentUser.employeeId;
    }

    read(
        moduleName: string,
        moduleItemId: number,
        page: number | string,
        pageSize: number | string
    ): Observable<PagedResult<CommentModel>> {
        const url = `/employee/${
            this.employeeId
        }/comments/${moduleName}/${moduleItemId}/${page}/${pageSize}`;
        return this.apiService
            .get(url)
            .map(response => {
                const result = response.result;
                return {
                    currentPage: result.page,
                    pageSize: pageSize,
                    pageCount: result.pageCount,
                    total: result.recordCount,
                    items: (result.data || []).map(
                        CommentService.toCommentModel
                    )
                };
            })
            .share();
    }

    create(moduleName: string, moduleItemId: number, newComment: CommentModel) {
        const url = `/employee/${this.employeeId}/comment`;

        const requestModel = {
            type: moduleName,
            objectId: moduleItemId,
            description: newComment.content,
            parentId: newComment.parentId
        };

        return this.apiService
            .post(url, requestModel)
            .map(response => response.result);
    }

    // tslint:disable-next-line:member-ordering
    private static toCommentModel(resultItem: any): CommentModel {
        const comment = CommentService.toCommentItem(resultItem);

        if (resultItem.children && resultItem.children.length > 0) {
            comment.replyComments = resultItem.children
                .sort((d1, d2) => d1.createdDate - d2.createdDate)
                .map(CommentService.toCommentItem);
        }

        return comment;
    }

    // tslint:disable-next-line:member-ordering
    private static toCommentItem(item: any) {
        return {
            id: item.id,
            parentId: item.parentId,
            time: item.createdDate,
            content: item.description,
            user: item.employee && {
                userId: item.employee.id,
                userName: item.employee.name
            },
            replyComments: [],
            avatar: ""
        };
    }
}
