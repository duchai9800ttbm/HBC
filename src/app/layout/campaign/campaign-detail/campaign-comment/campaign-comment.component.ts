import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-campaign-comment',
  templateUrl: './campaign-comment.component.html',
  styleUrls: ['./campaign-comment.component.scss']
})
export class CampaignCommentComponent implements OnInit {

  id: string;

  constructor(
    private route: ActivatedRoute,

  ) { }

  ngOnInit() {
    this.route.parent.params.subscribe(value => this.id = value.id);

  }

}
