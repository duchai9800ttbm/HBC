import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OpportunityService } from '../../../../shared/services/index';

@Component({
  selector: 'app-opportunity-activity',
  templateUrl: './opportunity-activity.component.html',
  styleUrls: ['./opportunity-activity.component.scss']
})
export class OpportunityActivityComponent implements OnInit {

  id: string;
  name: string;
  constructor(
    private route: ActivatedRoute,
    private opportunityService: OpportunityService,
  ) { }

  ngOnInit() {
    this.route.parent.params.subscribe(value => {
      this.id = value.id;
      this.opportunityService.view(this.id)
      .subscribe(result => this.name = result.name);
    } );
  }

}
