
import { Component, OnInit } from '@angular/core';
import { OpportunityModel } from '../../../shared/models/opportunity/opportunity.model';
import * as moment from 'moment';
import { routerTransition } from '../../../router.animations';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-opportunity-create',
  templateUrl: './opportunity-create.component.html',
  styleUrls: ['./opportunity-create.component.scss'],
  animations: [routerTransition()]
})
export class OpportunityCreateComponent implements OnInit {
  opportunityModel: OpportunityModel = new OpportunityModel();
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params.moduleName === 'customer') {
        this.opportunityModel.customer = {
          id: params.moduleItemId,
          name:  params.moduleItemName,
        };
      }
      if (params.moduleName === 'contact') {
        this.opportunityModel.contact = {
          id: params.moduleItemId,
          salutation: '',
          lastName: params.moduleItemLastName,
          firstName: params.moduleItemFirstName,
        };
      }
    });
  }

}
