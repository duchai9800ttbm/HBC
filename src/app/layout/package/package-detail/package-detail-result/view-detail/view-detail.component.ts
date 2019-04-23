import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { DetailResultPackageService } from '../../../../../shared/services/detail-result-package.service';
import { AlertService } from '../../../../../shared/services';

@Component({
  selector: 'app-view-detail',
  templateUrl: './view-detail.component.html',
  styleUrls: ['./view-detail.component.scss']
})
export class ViewDetailComponent implements OnInit {
  @Input() callBack: Function;
  @Input() content;
  constructor(
    private detailResultPackageService: DetailResultPackageService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
  }

  close() {
    this.callBack();
  }

  dowloadDocument(tenderResultDocumentId) {
    this.detailResultPackageService.downloadFileResult(tenderResultDocumentId).subscribe(response => {
    },
      err => {
        this.alertService.error('Tài liệu kết quả dự thầu này không có file đính kèm.');
      });
  }

}
