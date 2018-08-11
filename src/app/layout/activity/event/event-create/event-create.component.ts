
import { Component, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { ActivityModel } from '../../../../shared/models';
import { routerTransition } from '../../../../router.animations';
import { ActivatedRoute, ParamMap } from '@angular/router';
import Utils from '../../../../shared/helpers/utils.helper';
@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.scss'],
  animations: [routerTransition()]
})
export class EventCreateComponent implements OnInit {
  constructor(
    private route: ActivatedRoute
  ) { }

  eventModel: ActivityModel = new ActivityModel();

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.eventModel.relatedToType = Utils.capitalizeFirstLetter(params.moduleName);
      this.eventModel.specificRelated = {
        id: params.moduleItemId,
        name: params.moduleItemName,
      };
    });
  }

}
