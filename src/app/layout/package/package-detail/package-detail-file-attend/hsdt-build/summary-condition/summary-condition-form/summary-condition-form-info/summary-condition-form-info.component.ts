import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HoSoDuThauService } from '../../../../../../../../shared/services/ho-so-du-thau.service';
import { Router } from '@angular/router';
import { AlertService } from '../../../../../../../../shared/services';
import { ThongTinDuAn } from '../../../../../../../../shared/models/ho-so-du-thau/thong-tin-du-an';
import { SiteSurveyReportService } from '../../../../../../../../shared/services/site-survey-report.service';
import { PackageDetailComponent } from '../../../../../package-detail.component';

@Component({
  selector: 'app-summary-condition-form-info',
  templateUrl: './summary-condition-form-info.component.html',
  styleUrls: ['./summary-condition-form-info.component.scss']
})
export class SummaryConditionFormInfoComponent implements OnInit {
  thongTinDuAnForm: FormGroup;
  hinhAnhPhoiCanhUrls = [];
  banVeMasterPlanUrl = [];
  dataStepInfo = new ThongTinDuAn();
  currentBidOpportunityId: number;
  showPopupViewImage = false;
  imageUrlArray = [];

  constructor(
    private hoSoDuThauService: HoSoDuThauService,
    private alertService: AlertService,
    private router: Router,
    private siteSurveyReportService: SiteSurveyReportService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.currentBidOpportunityId = +PackageDetailComponent.packageId;
    this.loadData();
    this.createForm();
    this.thongTinDuAnForm.valueChanges.subscribe(data => this.hoSoDuThauService.emitDataStepInfo(data));
  }
  createForm() {
    this.thongTinDuAnForm = this.fb.group({
      tenTaiLieu: this.dataStepInfo.tenTaiLieu,
      hinhAnhPhoiCanh: [],
      banVeMasterPlan: [],
      lanPhongVan: this.dataStepInfo.lanPhongVan,
      thongTinDuAn: this.dataStepInfo.dienGiaiThongTinDuAn
    });
  }
  loadData() {
    this.hoSoDuThauService.watchDataLiveForm().subscribe(data => {
      const objDataStepInfo = data.thongTinDuAn;
      if (objDataStepInfo) {
        this.dataStepInfo.tenTaiLieu = objDataStepInfo.tenTaiLieu;
        this.dataStepInfo.lanPhongVan = objDataStepInfo.lanPhongVan;
        this.hinhAnhPhoiCanhUrls = objDataStepInfo.hinhAnhPhoiCanh;
        this.banVeMasterPlanUrl = objDataStepInfo.banVeMasterPlan;
        this.dataStepInfo.dienGiaiThongTinDuAn = objDataStepInfo.dienGiaiThongTinDuAn;
      }
    });
  }
  uploadPerspectiveImage(event) {
    const files = event.target.files;
    this.siteSurveyReportService
      .uploadImageSiteSurveyingReport(files, this.currentBidOpportunityId)
      .subscribe(res => {
        this.hinhAnhPhoiCanhUrls = [...this.hinhAnhPhoiCanhUrls, ...res];
        this.thongTinDuAnForm.get('hinhAnhPhoiCanh').patchValue(this.hinhAnhPhoiCanhUrls);
      }, err => {
        this.alertService.error('Upload hình ảnh thất bại. Xin vui lòng thử lại!');
        this.hinhAnhPhoiCanhUrls.forEach(x => {
          if (!x.id) {
            const index = this.hinhAnhPhoiCanhUrls.indexOf(x);
            this.hinhAnhPhoiCanhUrls.splice(index, 1);
          }
        });
      });
  }
  deletePerspectiveImage(i) {
    const index = this.hinhAnhPhoiCanhUrls.indexOf(i);
    this.siteSurveyReportService.deleteImageSiteSurveyingReport(i.id).subscribe(res => {
    }, err => {
      this.alertService.error('Đã xảy ra lỗi, hình ảnh xóa không thành công');
    });
    this.hinhAnhPhoiCanhUrls.splice(index, 1);
    this.thongTinDuAnForm.get('hinhAnhPhoiCanh').patchValue(this.hinhAnhPhoiCanhUrls);
  }
  viewFullScreenImage(listImage) {
    this.showPopupViewImage = true;
    this.imageUrlArray = [...listImage];
  }
  closeView() {
    this.showPopupViewImage = false;
  }
}
