import { Component, OnInit, Input } from '@angular/core';
import { CommentService } from '../../../../../../../shared/services/comment.service';
import { PackageDetailComponent } from '../../../../package-detail.component';
import { moment } from '../../../../../../../../../node_modules/ngx-bootstrap/chronos/test/chain';
import { CommentItem } from '../../../../../../../shared/models/comment/comment.model';
import { PagedResult } from '../../../../../../../shared/models';

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
  constructor(private commentService: CommentService) { }

  ngOnInit() {
    this.packageId = PackageDetailComponent.packageId;
    this.commentService.getComment(this.packageId, 0, 10).subscribe(data => {
      this.pagedResult = data;
      this.comments = this.pagedResult.items;
      this.showButtonLoadMore = (this.pagedResult.items.length > 0) &&
        (+this.pagedResult.currentPage + 1 < +this.pagedResult.pageCount);
      console.log(this.showButtonLoadMore);
      console.log(this.pagedResult);
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
          console.log(this.showButtonLoadMore);
          console.log(this.pagedResult);
        });
      });
  }

  addCommentByIcon() {
    const comment = this.commentEditor.trim();
    this.commentEditor = null;
    if (comment === '') {
      return null;
    }
    this.commentService.createComment(this.packageId, comment)
      .subscribe(data => {
        this.commentService.getComment(this.packageId, 0, 10).subscribe(result => {
          this.pagedResult = result;
          this.comments = this.pagedResult.items;
        });
      });
  }

  loadMore() {

    this.commentService.getComment(this.packageId, +this.pagedResult.currentPage + 1, +this.pagedResult.pageSize).subscribe(result => {
      this.pagedResult = result;
      this.showButtonLoadMore = (this.pagedResult.items.length > 0) && (+this.pagedResult.currentPage + 1 < this.pagedResult.pageCount);
      this.comments = this.comments.concat(this.pagedResult.items);
      console.log(this.showButtonLoadMore);
      console.log(this.pagedResult);
    });

  }
}
