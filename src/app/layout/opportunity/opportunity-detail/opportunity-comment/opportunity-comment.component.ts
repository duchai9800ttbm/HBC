import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-opportunity-comment',
  templateUrl: './opportunity-comment.component.html',
  styleUrls: ['./opportunity-comment.component.scss']
})
export class OpportunityCommentComponent implements OnInit {

  id: string;

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.parent.params.subscribe(value => this.id = value.id);

  }

}
