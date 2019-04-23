import { Injectable } from '@angular/core';
import { SessionService, ApiService } from '.';
import { CommentModel } from '../modules/comments/comment.model';
import { CommentItem } from '../models/comment/comment.model';
import { Observable } from '../../../../node_modules/rxjs/Observable';
import { PagedResult } from '../models';

@Injectable()
export class CommentService {

    constructor(
        private apiService: ApiService,
        private sessionService: SessionService
    ) { }

    get employeeId() {
        return this.sessionService.currentUser.employeeId;
    }

    createComment(bidOpportunityId: number, commentContent: string) {
        const url = `tenderpriceapproval/comment/create`;
        const model = {
            bidOpportunityId,
            commentContent
        };
        return this.apiService.post(url, model).map(response => this.toCommentItemModel(response.result));
    }

    getComment(bidOpportunityId: number, page: number, pageSize: number): Observable<PagedResult<CommentItem>> {
        const url = `${bidOpportunityId}/tenderpriceapproval/comments/${page}/${pageSize}`;
        return this.apiService.get(url).map(response => {
            const result = response.result;
            return{
                currentPage: result.pageIndex,
                pageSize: result.pageSize,
                pageCount: result.totalPages,
                total: result.totalCount,
                items: (result.items || []).map(
                    this.toCommentItemModel
                )
            };
        });
    }

    toCommentItemModel(result: any): CommentItem {
        return {
            id: result.id,
            author: result.author && {
                id: result.author.id,
                employeeId: result.author.employeeId,
                employeeNo: result.author.employeeNo,
                employeeName: result.author.employeeName,
                employeeAddress: result.author.employeeAddress,
                employeeDob: result.author.employeeDob,
                employeeTel: result.author.employeeTel,
                employeeTel1: result.author.employeeTel1,
                departmentName: result.author.departmentName,
                levelName: result.author.levelName,
                employeeAvatar: result.author.employeeAvatar,
                departmentRoomName: result.author.departmentRoomName,
                branchName: result.author.branchName,
                employeeBirthPlace: result.author.employeeBirthPlace,
                employeeIDNumber: result.author.employeeIDNumber,
                employeeGender: result.author.employeeGender,
                employeeTaxNumber: result.author.employeeTaxNumber,
                employeeBankAccount: result.author.employeeBankAccount,
            },
            createdTime: result.createdTime,
            commentContent: result.commentContent
        };
    }

}
