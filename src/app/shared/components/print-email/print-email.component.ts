import { Component, OnInit, Input } from '@angular/core';
import { DialogRef } from '../../../../../node_modules/@progress/kendo-angular-dialog';
import { ConfirmationService, AlertService } from '../../services';
import { Router } from '../../../../../node_modules/@angular/router';
import { EmailItemModel } from '../../models/email/email-item.model';

@Component({
  selector: 'app-print-email',
  templateUrl: './print-email.component.html',
  styleUrls: ['./print-email.component.scss']
})
export class PrintEmailComponent implements OnInit {

  @Input() emailId: number;
  @Input() email: EmailItemModel;
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
      let popupWinindow;
      const innerContents = document.getElementById(printSectionId).innerHTML;
      popupWinindow = window
        .open('', '_blank', 'width=600,height=700,headers=no,footers=no,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
      popupWinindow.document.open();
      popupWinindow.document
        .write(`<html>
      <head>
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
      <style type="text/css">
      .set-size-logo {
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
      }
      .th {
        text-align: center;
        font-weight: bold;
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
        font-size: 10px;
        font-family: 'Times New Roman';
        color: black;
      }
      .A4-landscape .order-title {
        font-size: 20px;
      }
      .A4-landscape .order-title .saleOrder {
        font-size: 20px !important;
      }
      .A4-landscape .number-order {
        text-align: center;
      }
      .A4-landscape .box {
        height: 90px !important;
        text-align: center;
      }
      .panel_logo {
        width: 100%;
      }
      :host() {
        color: #495b69;
        font-weight: 550;
      }
      .title {
        height: 60px;
        border-bottom: 1px solid #f1f1f1;
        margin: 0 10px;
      }
      .title .content {
        margin: 0 10px;
      }
      .title .content .reject {
        color: #44505e;
        font-size: 18px;
      }
      .title .icon {
        cursor: pointer;
      }
      .title-item {
        margin: 0 20px;
        min-height: 50px;
        border-bottom: 1px solid #f1f1f1;
      }
      .custom-btn {
        background-color: #fff;
        border: 1px solid #f1f1f1;
        width: 30px;
        height: 30px;
        border-radius: 3px;
        color: #44505e;
        cursor: pointer;
      }
      .custom-btn:hover {
        background-color: #00a0e3;
        color: #fff;
        border: 1px solid #00a0e3;
      }
      .action-bar {
        padding: 20px 0px;
      }
      .content-email {
        margin: 0 20px;
        padding: 20px 0px;
      }
      .attach-file {
        padding: 0px 10px;
        padding-bottom: 20px;
      }
      .attach-file .file-item {
        box-sizing: border-box;
        width: 151px;
        height: 181px;
        border: 1px solid #f1f1f1;
      }
      .attach-file .file-item .file-name {
        background-color: #f4f4f4 !important;
        height: 50px;
        width: 88px;
      }
      .attach {
        border-top: 1px solid #f1f1f1;
        margin: 0 10px;
      }
      .to {
        width: calc(100% - 300px);
      }
      .date-time {
        width: 300px;
      }
      
      </style></head><body onload="window.print()">` + innerContents + '</html>');
      popupWinindow.document.close();
      this.dialogRef.close();
    
  }
}
