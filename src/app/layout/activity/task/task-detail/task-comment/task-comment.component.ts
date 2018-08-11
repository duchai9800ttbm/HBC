import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-task-comment',
  templateUrl: './task-comment.component.html',
  styleUrls: ['./task-comment.component.scss']
})
export class TaskCommentComponent implements OnInit {

  id: string;

  constructor(
    private route: ActivatedRoute,

  ) { }

  ngOnInit() {
    this.route.parent.params.subscribe(value => this.id = value.id);

  }

}
