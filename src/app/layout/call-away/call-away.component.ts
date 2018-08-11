import { Component, OnInit } from '@angular/core';
import { DialogService, DialogRef, DialogCloseResult } from '@progress/kendo-angular-dialog';

@Component({
  selector: 'app-call-away',
  templateUrl: './call-away.component.html',
  styleUrls: ['./call-away.component.scss']
})
export class CallAwayComponent implements OnInit {
  constructor(private dialogService: DialogService) { }

  public result;

  ngOnInit() {

  }

  public showConfirmation() {
    const dialog: DialogRef = this.dialogService.open({
      title: 'Please confirm',
      content: 'Are you sure?',
      actions: [
        { text: 'No' },
        { text: 'Yes', primary: true }
      ],
      width: 450,
      height: 200,
      minWidth: 250
    });

    dialog.result.subscribe((result) => {
      if (result instanceof DialogCloseResult) {
      } else {
      }

      this.result = JSON.stringify(result);
    });
  }
}
