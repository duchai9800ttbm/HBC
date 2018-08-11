import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProspectService } from '../../../../shared/services/index';

@Component({
  selector: 'app-prospect-activity-history',
  templateUrl: './prospect-activity-history.component.html',
  styleUrls: ['./prospect-activity-history.component.scss']
})
export class ProspectActivityHistoryComponent implements OnInit {
  id: string;
  name: string;
  constructor(
    private route: ActivatedRoute,
    private prospectService: ProspectService,
  ) { }

  ngOnInit() {
    this.route.parent.params.subscribe(value => {
      this.id = value.id;
     // this.prospectService.viewHistory(this.id).subscribe(result => this.name = `${result.lastName} ${result.firstName}`);
    });
  }

}
