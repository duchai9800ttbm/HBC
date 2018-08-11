import { routerTransition } from '../../../../router.animations';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ActivityModel } from '../../../../shared/models/index';
import { ActivatedRoute } from '@angular/router';
import Utils from '../../../../shared/helpers/utils.helper';
@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.scss'],
  animations: [routerTransition()]
})
export class TaskCreateComponent implements OnInit {

  constructor( private route: ActivatedRoute) { }
  taskModel: ActivityModel = new ActivityModel();
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.taskModel.relatedToType = Utils.capitalizeFirstLetter(params.moduleName);
      this.taskModel.specificRelated = {
        id: params.moduleItemId,
        name: params.moduleItemName,
      };
    });
  }
}
