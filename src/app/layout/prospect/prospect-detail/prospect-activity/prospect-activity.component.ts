import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProspectService } from '../../../../shared/services/index';
import { Observable } from "rxjs/Observable";
import { ProspectModel } from '../../../../shared/models/index';

@Component({
  selector: 'app-prospect-activity',
  templateUrl: './prospect-activity.component.html',
  styleUrls: ['./prospect-activity.component.scss']
})
export class ProspectActivityComponent implements OnInit {

  id: string;
  name: string;
  constructor(
    private route: ActivatedRoute,
    private prospectService: ProspectService,
  ) { }
  prospect$: Observable<ProspectModel>;
  ngOnInit() {
    this.route.parent.params.subscribe(value => {
      this.id = value.id;
      this.prospectService.view(this.id).subscribe(result => this.name = `${result.lastName} ${result.firstName}`);
    });
  }

}
