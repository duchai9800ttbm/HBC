import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../../../../../../../node_modules/@progress/kendo-angular-dialog';
import { ReportEndInterviewComponent } from './report-end-interview/report-end-interview.component';
@Component({
  selector: 'app-end-interview',
  templateUrl: './end-interview.component.html',
  styleUrls: ['./end-interview.component.scss']
})
export class EndInterviewComponent implements OnInit {
  dialog;
  constructor(
    private dialogService: DialogService,
  ) { }

  ngOnInit(
  ) {
  }

  uploadReportInterview() {
    this.dialog = this.dialogService.open({
      content: ReportEndInterviewComponent,
      width: 600,
      minWidth: 250
    });
    const instance = this.dialog.content.instance;
    instance.callBack = () => this.closePopuup();
  }

  closePopuup() {
    this.dialog.close();
  }
}
