import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-campaign-audit',
  templateUrl: './campaign-audit.component.html',
  styleUrls: ['./campaign-audit.component.scss']
})
export class CampaignAuditComponent implements OnInit {

  id: string;
  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.parent.params.subscribe(value => this.id = value.id);
  }

}
