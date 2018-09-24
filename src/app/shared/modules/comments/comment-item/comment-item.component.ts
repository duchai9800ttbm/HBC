import { EditorComponent } from '../editor/editor.component';
import { Component, OnInit, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { CommentModel } from '../comment.model';
import * as moment from 'moment';
import { SessionService, UserService } from '../../../services/index';
import { CommentService } from '../../../services/comment.service';
import { UserModel } from '../../../models/user/user.model';
const defaultAvatarSrc = 'assets/images/no-avatar.png';

@Component({
  selector: 'app-comment-item',
  templateUrl: './comment-item.component.html',
  styleUrls: ['./comment-item.component.scss']
})
export class CommentItemComponent implements OnInit {

  @Input() moduleName: string;
  @Input() moduleItemId: number;
  // The time of the comment as a timestamp
  @Input() comment: CommentModel;
  @Input() parentId: number;
  @Input() commentList: CommentModel[];

  @Input() index: number;

  @Input() isReplyComment: boolean;

  // If a comment was edited this event will be emitted
  @Output() commentEdited = new EventEmitter();


  @ViewChild(EditorComponent) newCommentEditor: EditorComponent;

  showReplyBox = false;

  commentActionType: number;
  commentActionTypes = {
    reply: 0,
    edit: 1,
    delete: 2,
  };
  avatarSrc: string;
  userProfile: UserModel;

  onContentSaved(content) {
    this.commentEdited.next(content);
  }

  constructor(
    private sessionService: SessionService,
    private commentService: CommentService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.userProfile = this.sessionService.userInfo;
    this.avatarSrc = this.userProfile.avatarUrl ? `data:image/jpeg;base64,${this.userProfile.avatarUrl}` : null;
    const id = this.comment.user.userId;
    if (id !== this.sessionService.currentUser.employeeId) {
      this.userService.getAvatarByUserId(id)
        .subscribe(result => {
          this.comment.avatar = result.avatar ? `data:image/jpeg;base64,${result.avatar}` : null;
        });
    } else {
      this.comment.avatar = this.avatarSrc;
    }

  }

  submitComment() {
    const newComment = {
      id: 0,
      parentId: this.parentId,
      user: {
        userId: this.sessionService.currentUser.employeeId,
        userName: this.sessionService.userInfo.fullName,
      },
      time: +moment(),
      content: this.newCommentEditor.getEditableContent(),
      avatar: '',
      replyComments: [],
    };

    if (this.isReplyComment) {
      this.commentList.push(newComment);
    }

    switch (this.commentActionType) {
      case this.commentActionTypes.reply:
        this.comment.replyComments.push(newComment);
        // Emit event so the updated comment list can be persisted 
        // outside the component
        //this.commentsUpdated.next(this.comments);
        break;

      case this.commentActionTypes.edit:
        this.comment.content = this.newCommentEditor.getEditableContent();
        break;

    }

    // this.commentService
    //   .create(this.moduleName, this.moduleItemId, newComment)
    //   .subscribe(result => {
      
    //   });

    // We reset the content of the editor
    this.newCommentEditor.setEditableContent('');

    this.showReplyBox = false;
  }

  reply() {
    this.showReplyBox = true;
    this.commentActionType = this.commentActionTypes.reply;
  }

  edit() {
    this.showReplyBox = true;
    this.newCommentEditor.setEditableContent(this.comment.content);
    this.commentActionType = this.commentActionTypes.edit;
  }

  delete() {
    // this.comment = null;
    this.commentActionType = this.commentActionTypes.reply;
    this.commentList.splice(this.index, 1);
  }

}
