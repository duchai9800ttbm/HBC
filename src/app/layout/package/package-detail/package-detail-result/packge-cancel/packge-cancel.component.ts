import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PackageDetailComponent } from '../../package-detail.component';
import { ConfirmationService, AlertService } from '../../../../../shared/services';
import { slideToBottom, slideToTop } from '../../../../../router.animations';
import { DetailResultPackageService } from '../../../../../shared/services/detail-result-package.service';
@Component({
  selector: 'app-packge-cancel',
  templateUrl: './packge-cancel.component.html',
  styleUrls: ['./packge-cancel.component.scss'],
  animations: [slideToTop()]
})
export class PackgeCancelComponent implements OnInit {
  currentPackageId: number;
  constructor(
    private alertService: AlertService,
    private detailResultPackageService: DetailResultPackageService
  ) { }

  ngOnInit() {
    this.currentPackageId = +PackageDetailComponent.packageId;
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
}
