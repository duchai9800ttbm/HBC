import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-prospect-comment-history',
  templateUrl: './prospect-comment-history.component.html',
  styleUrls: ['./prospect-comment-history.component.scss']
})
export class ProspectCommentHistoryComponent implements OnInit {
  id: string;

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.parent.params.subscribe(value => this.id = value.id);

  }

}
