import { Component, OnInit, Input } from '@angular/core';
import { DialogRef } from '../../../../../node_modules/@progress/kendo-angular-dialog';
import { ConfirmationService, AlertService } from '../../services';
import { Router } from '../../../../../node_modules/@angular/router';

@Component({
  selector: 'app-print-email',
  templateUrl: './print-email.component.html',
  styleUrls: ['./print-email.component.scss']
})
export class PrintEmailComponent implements OnInit {

  @Input() emailId: number;
  @Input() callBack: Function;
  constructor(
    private dialogRef: DialogRef,
    private confirmationService: ConfirmationService,
    private alertService: AlertService,
    private router: Router,
  ) { }

  ngOnInit() {
  }
  printToCart(printSectionId: string) {
    //   let popupWinindow;
    //   const innerContents = document.getElementById(printSectionId).innerHTML;
    //   popupWinindow = window
    //     .open('', '_blank', 'width=600,height=700,headers=no,footers=no,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
    //   popupWinindow.document.open();
    //   popupWinindow.document
    //     .write(`<html>
    //   <head>
    //   <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    //   <style type="text/css">
    //   </style></head><body onload="window.print()">` + innerContents + '</html>');
    //   popupWinindow.document.close();
    //   this.dialogRef.close();
    // }
    this.callBack();
  }
}
