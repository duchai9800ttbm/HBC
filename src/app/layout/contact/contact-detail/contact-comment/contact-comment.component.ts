import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-contact-comment',
  templateUrl: './contact-comment.component.html',
  styleUrls: ['./contact-comment.component.scss']
})
export class ContactCommentComponent implements OnInit {
  id: string;
  constructor(
    private route: ActivatedRoute,
  ) { }
  ngOnInit() {
    this.route.parent.params.subscribe(value => this.id = value.id);
  }

}
