import { Component, OnInit, Input } from '@angular/core';
import { CommentService } from '../../../../../../../shared/services/comment.service';
import { PackageDetailComponent } from '../../../../package-detail.component';
import { moment } from '../../../../../../../../../node_modules/ngx-bootstrap/chronos/test/chain';

@Component({
  selector: 'app-comment-editor',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  commentEditor: string;
  @Input() packageId: number;
  constructor(private commentService: CommentService) { }

  ngOnInit() {
    this.packageId = PackageDetailComponent.packageId;
  }
  addCommentByKeyUpEnter(e) {
    const comment = e.target.value.trim();
    this.commentEditor = null;
    this.commentService.createComment(this.packageId, comment)
      .subscribe(data => {
        
      });
  }

  addCommentByIcon() {

  }
}
