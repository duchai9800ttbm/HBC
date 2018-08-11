
import { Component, OnInit } from '@angular/core';
import { ProspectModel } from '../../../shared/models/prospect/prospect.model';
import { routerTransition } from '../../../router.animations';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-prospect-create',
  templateUrl: './prospect-create.component.html',
  styleUrls: ['./prospect-create.component.scss'],
  animations: [routerTransition()]
})
export class ProspectCreateComponent implements OnInit {

  prospectModel: ProspectModel = new ProspectModel();

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.prospectModel.phoneNumberpersonal = params.sdt;
    });
  }
}
