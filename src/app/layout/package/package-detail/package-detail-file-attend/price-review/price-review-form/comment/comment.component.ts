import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-comment-editor',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  commentEditor: string;

  constructor() { }

  ngOnInit() {
  }
  addCommentByKeyUpEnter(e) {
    const comment = e.target.value;
    console.log(this.commentEditor.trim().length);
    this.commentEditor = comment;
  }

  addCommentByIcon() {

  }
}
