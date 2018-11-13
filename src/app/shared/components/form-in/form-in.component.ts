import { Component, OnInit, Input } from '@angular/core';
import { DialogRef } from '../../../../../node_modules/@progress/kendo-angular-dialog';
import { ConfirmationService, AlertService } from '../../services';
import { Router } from '../../../../../node_modules/@angular/router';
import { PrintingDocumentService } from '../../services/printing-document.service';
import { Subject } from 'rxjs';
import { timer } from 'rxjs/observable/timer';

@Component({
  selector: 'app-form-in',
  templateUrl: './form-in.component.html',
  styleUrls: ['./form-in.component.scss']
})
export class FormInComponent implements OnInit {

  @Input() type: string;
  @Input() packageId: number;
  htmlContent: string;
  click$ = new Subject();
  isOpen = false;
  constructor(
    private dialogRef: DialogRef,
    private confirmationService: ConfirmationService,
    private alertService: AlertService,
    private router: Router,
    private printingDocumentService: PrintingDocumentService
  ) { }

  ngOnInit() {
    this.renderHtml();
    this.click$
      .debounce(() => timer(1000))
      .subscribe(() => this.print());
  }

  renderHtml() {
    switch (this.type) {
      case 'LiveFormTrinhDuyetGia': {
        this.printingDocumentService.printTenderPriceApproval(this.packageId)
          .subscribe(data => {
            this.htmlContent = data;
          });
        break;
      }
      case 'LiveFormPhieuDeNghiDuThau': {
        this.printingDocumentService.printProposedTenderParticipatinngReport(this.packageId)
          .subscribe(data => {
            this.htmlContent = data;
          });
        break;
      }
      case 'LiveFormTomTatDieuKienDuThau': {
        this.printingDocumentService.printTenderCondition(this.packageId)
          .subscribe(data => {
            this.htmlContent = data;
          });
        break;
      }
      case 'LiveFormPhanCongTienDo': {
        this.printingDocumentService.printTenderPreparationPlanningAssignment(this.packageId)
          .subscribe(data => {
            this.htmlContent = data;
          });
        break;
      }
      case 'LiveFormThamQuanBaoCaoCongTruong': {
        this.printingDocumentService.printSiteSurveyReport(this.packageId)
          .subscribe(data => {
            this.htmlContent = data;
          });
        break;
      }
      default: {

        break;
      }
    }
  }

  print() {
    if (!this.isOpen) {
      this.isOpen = true;
      const popupWindow = window
        .open('', '_blank', `width=600,height=700,headers=no,footers=no,scrollbars=no,menubar=no,toolbar=no,
        location=no,status=no,titlebar=no`);
      popupWindow.document.open();
      popupWindow.document.write(`${this.htmlContent}`);
      popupWindow.print();
      setTimeout(() => {
        popupWindow.document.close();
      }, 400);
    }
  }

}
