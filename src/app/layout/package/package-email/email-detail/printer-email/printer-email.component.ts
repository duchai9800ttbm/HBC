import { Component, OnInit } from '@angular/core';
import { DialogRef } from '../../../../../../../node_modules/@progress/kendo-angular-dialog';

@Component({
  selector: 'app-printer-email',
  templateUrl: './printer-email.component.html',
  styleUrls: ['./printer-email.component.scss']
})
export class PrinterEmailComponent implements OnInit {

  constructor(
    private dialogRef: DialogRef
  ) { }

  ngOnInit() {
  }

  printToCart(printSectionId: string) {
    let popupWinindow
    const innerContents = document.getElementById(printSectionId).innerHTML;
    popupWinindow = window.open('', '_blank', 'width=600,height=700,headers=no,footers=no,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
    popupWinindow.document.open();
    popupWinindow.document.write(`<html><head><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <style type="text/css">
    .set-size-logo {
      width: 100%;
    }
    .panel_logo {
      width: 100%;
    }
    .del-pad {
      padding: 0px;
    }
    .color-title {
      color: #3c9369;
    }
    td {
      border: 0.5px solid black;
      padding: 2px;
      font-size: 22px !important;
    }
    .no-pad {
      padding: 0px;
    }
    .center {
      text-align: center;
    }
    .A4-landscape {
      padding: 35px 30px;
      height: 842px;
      width: 595px;
      font-family: 'MyriadPro' , Fallback, sans-serif;
      color: black;
    }
    .tite {
      font-size: 30px !important;
    }
    .font-content {
      font-size: 22px !important;
    }
    .font-note {
      font-size: 17px;
    }
    .A4-landscape .box {
      height: 90px !important;
      text-align: center;
    }
    .th {
      text-align: center;
      font-size: 22px !important;
      font-weight: 500;
    }
    .tfoot {
      text-align: center;
    }
    .money {
      text-align: right;
    }
    td {
      font-size: 11px;
      border: 0.5px solid black;
      padding: 2px;
    }
    .center {
      text-align: center;
    }
    </style></head><body onload="window.print()">` + innerContents + '</html>');
    popupWinindow.document.close();
    this.dialogRef.close();
  }
}
