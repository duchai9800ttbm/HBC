import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PackageDetailComponent } from '../../package-detail.component';
import { ConfirmationService, AlertService } from '../../../../../shared/services';
import { slideToBottom, slideToTop } from '../../../../../router.animations';
import { DetailResultPackageService } from '../../../../../shared/services/detail-result-package.service';
import { DialogService } from '../../../../../../../node_modules/@progress/kendo-angular-dialog';
import { ThanksLetterCancelComponent } from './thanks-letter-cancel/thanks-letter-cancel.component';
import { DocumentResultList } from '../../../../../shared/models/result-attend/document-result-list.model';
@Component({
  selector: 'app-packge-cancel',
  templateUrl: './packge-cancel.component.html',
  styleUrls: ['./packge-cancel.component.scss'],
  animations: [slideToTop()]
})
export class PackgeCancelComponent implements OnInit {
  currentPackageId: number;
  dialogUploadThanksLetter;
  listThanksLetter: DocumentResultList[];
  currentFieldSort;
  statusSort;
  constructor(
    private alertService: AlertService,
    private detailResultPackageService: DetailResultPackageService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.currentPackageId = +PackageDetailComponent.packageId;
    this.refesh(false);
    this.detailResultPackageService.watchListThanksLetter().subscribe(response => {
      this.refesh(false);
    });
  }

  downloadTemplate(type) {
    switch (type) {
      case 'LostBid': {
        this.detailResultPackageService.downloadTemplateLostBid().subscribe(response => {
        },
          err => {
            this.alertService.error('Tải về template không thành công.');
          });
        break;
      }
      case 'WinBid': {
        this.detailResultPackageService.downloadTemplateWinBid().subscribe(response => {
        },
          err => {
            this.alertService.error('Tải về template không thành công.');
          });
        break;
      }
      case 'LessonLearn': {
        this.detailResultPackageService.downloadTemplateLessonLearn().subscribe(response => {
        },
          err => {
            this.alertService.error('Tải về template không thành công.');
          });
        break;
      }
    }
  }

  uploadkqdt() {
    this.dialogUploadThanksLetter = this.dialogService.open({
      content: ThanksLetterCancelComponent,
      width: 650,
      minWidth: 250
    });
    const instance = this.dialogUploadThanksLetter.content.instance;
    instance.callBack = () => this.closePopuup();
    // instance.version = this.maxVersion + 1;
    // instance.interviewTimes = this.maxInterviewTimes + 1;
    // instance.winOrLost = true;
    // instance.updateStatusPackage = updateStatusPackage;
  }

  closePopuup() {
    this.dialogUploadThanksLetter.close();
  }

  downloadFileItem(tenderThankLetterDocId) {
    this.detailResultPackageService.downloadThanksLetter(tenderThankLetterDocId).subscribe(response => {
    },
      err => {
        this.alertService.error('Thư cảm ơn này không có file đính kèm.');
      });
  }

  refesh(alert: boolean) {
    this.detailResultPackageService.getListThanksLetter(this.currentPackageId).subscribe(response => {
      this.listThanksLetter = response;
      if (alert) {
        this.alertService.success('Dữ liệu đã được cập nhật mới nhất!');
      }
    }, err => {
      this.alertService.error('Đã xảy ra lỗi!');
    });
  }

  onSelectAll(value: boolean) {
    this.listThanksLetter.forEach(x => (x['checkboxSelected'] = value));
  }

  sortField(fieldSort: string, statusSort: string) {
    this.currentFieldSort = fieldSort;
    this.statusSort = statusSort;
    switch (this.statusSort) {
      case 'asc': {
        switch (fieldSort) {
          case 'name': {
            this.listThanksLetter = this.listThanksLetter.sort((a, b) => {
              return ('' + a.name).localeCompare(b.name);
            });
            break;
          }
          case 'version': {
            this.listThanksLetter = this.listThanksLetter.sort((a, b) => a.version - b.version);
            break;
          }
          case 'employeeName': {
            this.listThanksLetter = this.listThanksLetter.sort((a, b) => {
              return ('' + a.uploadBy.employeeName).localeCompare(b.uploadBy.employeeName);
            });
            break;
          }
          case 'uploadDate': {
            this.listThanksLetter = this.listThanksLetter.sort((a, b) => a.uploadDate - b.uploadDate);
            break;
          }
          case 'interviewTimes': {
            this.listThanksLetter = this.listThanksLetter.sort((a, b) => a.interviewTimes - b.interviewTimes);
            break;
          }
        }
        break;
      }
      case 'desc': {
        switch (fieldSort) {
          case 'name': {
            this.listThanksLetter = this.listThanksLetter.sort((a, b) => {
              return ('' + b.name).localeCompare(a.name);
            });
            break;
          }
          case 'version': {
            this.listThanksLetter = this.listThanksLetter.sort((a, b) => b.version - a.version);
            break;
          }
          case 'employeeName': {
            this.listThanksLetter = this.listThanksLetter.sort((a, b) => {
              return ('' + b.uploadBy.employeeName).localeCompare(a.uploadBy.employeeName);
            });
            break;
          }
          case 'uploadDate': {
            this.listThanksLetter = this.listThanksLetter.sort((a, b) => b.uploadDate - a.uploadDate);
            break;
          }
          case 'interviewTimes': {
            this.listThanksLetter = this.listThanksLetter.sort((a, b) => b.interviewTimes - a.interviewTimes);
            break;
          }
        }
        break;
      }
      case '': {
        this.listThanksLetter = this.listThanksLetter.sort((a, b) => a.id - b.id);
        break;
      }
    }
  }
  deleteFileItem(tenderResultDocumentId: number) {
    this.confirmationService.confirm(
      'Bạn có chắc chắn muốn xóa thư cảm ơn được chọn?',
      () => {
        this.detailResultPackageService.deleteThanksLetter(tenderResultDocumentId).subscribe(response => {
          this.refesh(false);
          this.alertService.success('Xóa thư cảm ơn thành công!');
        },
          err => {
            this.alertService.error('Xóa thư cảm ơn không thành công!');
          });
      });
  }

  deleteFileResult() {
    const listItemCheckbox = [];
    this.listThanksLetter.forEach(x => {
      if (x['checkboxSelected'] === true) {
        listItemCheckbox.push(x.id);
      }
    });
    switch (listItemCheckbox.length) {
      case 0: {
        this.alertService.error('Bạn chưa chọn thư cảm ơn cần xóa!');
        break;
      }
      case 1: {
        this.confirmationService.confirm(
          'Bạn có chắc chắn muốn xóa thư cảm ơn được chọn?',
          () => {
            this.detailResultPackageService.deleteThanksLetter(listItemCheckbox[0]).subscribe(response => {
              this.refesh(false);
              this.alertService.success('Xóa thư cảm ơn thành công!');
            },
              err => {
                this.alertService.error('Xóa thư cảm ơn không thành công!');
              });
          });
        break;
      }
      default: {
        this.confirmationService.confirm(
          'Bạn có chắc chắn muốn xóa thư cảm ơn được chọn?',
          () => {
            this.detailResultPackageService.deleteMutipleThanksLetter(listItemCheckbox).subscribe(response => {
              this.refesh(false);
              this.alertService.success('Xóa thư cảm ơn thành công!');
            },
              err => {
                this.alertService.error('Xóa thư cảm ơn không thành công!');
              });
          });
      }
    }
  }
}
