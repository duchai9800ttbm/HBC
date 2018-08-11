import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-event-comment',
  templateUrl: './event-comment.component.html',
  styleUrls: ['./event-comment.component.scss']
})
export class EventCommentComponent implements OnInit {

  id: string;

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {

    this.route.parent.params.subscribe(value => this.id = value.id
 );
  }

}
