import { Component, OnInit, Input } from '@angular/core';
import { CommentService } from '../../../../../../../shared/services/comment.service';
import { PackageDetailComponent } from '../../../../package-detail.component';
import { moment } from '../../../../../../../../../node_modules/ngx-bootstrap/chronos/test/chain';
import { CommentItem } from '../../../../../../../shared/models/comment/comment.model';
import { PagedResult } from '../../../../../../../shared/models';
import { AlertService } from '../../../../../../../shared/services';

@Component({
  selector: 'app-comment-editor',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  commentEditor: string;
  @Input() packageId: number;
  comments: CommentItem[] = [];
  public showButtonLoadMore = false;
  pagedResult: PagedResult<CommentItem> = new PagedResult<CommentItem>();
  constructor(
    private commentService: CommentService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.packageId = PackageDetailComponent.packageId;
    this.commentService.getComment(this.packageId, 0, 10).subscribe(data => {
      this.pagedResult = data;
      this.comments = this.pagedResult.items;
      this.showButtonLoadMore = (this.pagedResult.items.length > 0) &&
        (+this.pagedResult.currentPage + 1 < +this.pagedResult.pageCount);
    });
  }

  addCommentByKeyUpEnter(e) {
    const comment = e.target.value.trim();
    this.commentEditor = null;
    if (comment === '') {
      return null;
    }
    this.commentService.createComment(this.packageId, comment)
      .subscribe(data => {
        this.commentService.getComment(this.packageId, 0, 10).subscribe(result => {
          this.pagedResult = result;
          this.showButtonLoadMore = (this.pagedResult.items.length > 0) &&
            (+this.pagedResult.currentPage + 1 < +this.pagedResult.pageCount);
          this.comments = this.pagedResult.items;
        });
      });
  }

  addCommentByIcon() {
    let comment = '';
    if (this.commentEditor && this.commentEditor !== '') {
      comment = this.commentEditor.trim();
    }
    if (comment === '') {
      this.alertService.error('Bạn chưa nhập nội dung bình luận.');
      return null;
    }
    this.commentService.createComment(this.packageId, comment)
      .subscribe(data => {
        this.commentEditor = null;
        this.commentService.getComment(this.packageId, 0, 10).subscribe(result => {
          this.pagedResult = result;
          this.comments = this.pagedResult.items;
        });
      }, err => {
        if (err.json().errorCode === 'InternalServerError') {
          this.alertService.error('Nội dung bình luận quá dài.');
        } else {
          this.alertService.error('Đã có lỗi xảy ra. Vui lòng thử lại!');
        }
      });
  }

  loadMore() {

    this.commentService.getComment(this.packageId, +this.pagedResult.currentPage + 1, +this.pagedResult.pageSize).subscribe(result => {
      this.pagedResult = result;
      this.showButtonLoadMore = (this.pagedResult.items.length > 0) && (+this.pagedResult.currentPage + 1 < this.pagedResult.pageCount);
      this.comments = this.comments.concat(this.pagedResult.items);
    });

  }
}
