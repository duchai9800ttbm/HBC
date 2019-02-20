import { Component, OnInit } from '@angular/core';
import { ReportFollowService } from '../../../shared/services/report-follow.service';

@Component({
  selector: 'app-report-win-rate-contractors',
  templateUrl: './report-win-rate-contractors.component.html',
  styleUrls: ['./report-win-rate-contractors.component.scss']
})
export class ReportWinRateContractorsComponent implements OnInit {

  constructor(
    private reportFollowService: ReportFollowService
  ) { }

  ngOnInit() {
  }

}
