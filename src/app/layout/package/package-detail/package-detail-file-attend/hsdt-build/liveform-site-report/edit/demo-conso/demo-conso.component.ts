import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { DemoConso } from '../../../../../../../../shared/models/site-survey-report/demo-conso.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { EditComponent } from '../edit.component';
import { PackageDetailComponent } from '../../../../../package-detail.component';
import { AlertService } from '../../../../../../../../shared/services';
import { SiteSurveyReportService } from '../../../../../../../../shared/services/site-survey-report.service';
import { Subscription } from 'rxjs';
import Utils from '../../../../../../../../shared/helpers/utils.helper';

@Component({
  selector: 'app-demo-conso',
  templateUrl: './demo-conso.component.html',
  styleUrls: ['./demo-conso.component.scss']
})
export class DemoConsoComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('uploadDemobilisation') uploadDemobilisation;
  @ViewChild('uploadConsolidation') uploadConsolidation;
  @ViewChild('uploaAdjacent') uploaAdjacent;
  @ViewChild('autofocus') autofocus;
  demoConsoForm: FormGroup;

  demobilisationImageUrls = [];
  consolidationImageUrls = [];
  adjacentImageUrls = [];
  url;
  isViewMode = false;
  imageUrlArray = [];
  indexOfImage;
  showPopupViewImage = false;
  currentBidOpportunityId: number;
  demoConsoModel = new DemoConso();
  subscription: Subscription;
  constructor(
    private siteSurveyReportService: SiteSurveyReportService,
    private alertService: AlertService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.currentBidOpportunityId = +PackageDetailComponent.packageId;
    this.checkFlag();
    const loadingData$ = this.siteSurveyReportService.watchingSignalLoad().subscribe(signal => {
      this.checkFlag();
      this.initData();
      this.createForm();
      loadingData$.unsubscribe();
    });
    this.subscription = this.siteSurveyReportService.watchingSignalEdit().subscribe(signal => {
      this.isViewMode = !signal;
      if (this.isViewMode && this.demoConsoForm) {
        this.demoConsoForm.disable();
      }
      if (!this.isViewMode && this.demoConsoForm) {
        this.demoConsoForm.enable();
      }
      this.checkFlag();
      this.initData();
      this.createForm();
      this.checkFlag();
    });
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  ngAfterViewInit() {
    if (!this.isViewMode) {
      this.autofocus.nativeElement.focus();
    }
  }
  createForm() {
    this.demoConsoForm = this.fb.group({
      phaVoKetCauDesc: [this.demoConsoModel.phaVoKetCau && this.demoConsoModel.phaVoKetCau.description],
      phaVoKetCauList: [null],
      giaCoKetCauDesc: [this.demoConsoModel.giaCoKetCau && this.demoConsoModel.giaCoKetCau.description],
      giaCoKetCauList: [null],
      dieuKienHinhAnhDesc: [this.demoConsoModel.dieuKien && this.demoConsoModel.dieuKien.description],
      dieuKienHinhAnhList: [null]
    });
    if (this.isViewMode && this.demoConsoForm) {
      this.demoConsoForm.disable();
    }
    if (!this.isViewMode && this.demoConsoForm) {
      this.demoConsoForm.enable();
    }
    this.demoConsoForm.valueChanges.subscribe(data => this.mappingToLiveFormData(data));
  }
  checkFlag() {
    this.isViewMode = EditComponent.actionMode === 'info';
  }

  initData() {
    const obj = EditComponent.liveformData.demoConso;
    if (obj) {
      this.demoConsoModel.phaVoKetCau = obj.phaVoKetCau && {
        description: obj.phaVoKetCau.description,
        images: obj.phaVoKetCau.images
      };
      this.demoConsoModel.giaCoKetCau = obj.giaCoKetCau && {
        description: obj.giaCoKetCau.description,
        images: obj.giaCoKetCau.images
      };
      this.demoConsoModel.dieuKien = obj.dieuKien && {
        description: obj.dieuKien.description,
        images: obj.dieuKien.images
      };
      this.demobilisationImageUrls = this.demoConsoModel.phaVoKetCau ? this.demoConsoModel.phaVoKetCau.images : [];
      this.consolidationImageUrls = this.demoConsoModel.giaCoKetCau ? this.demoConsoModel.phaVoKetCau.images : [];
      this.adjacentImageUrls = this.demoConsoModel.dieuKien ? this.demoConsoModel.dieuKien.images : [];
    }
  }

  mappingToLiveFormData(data) {
    EditComponent.liveformData.demoConso = new DemoConso;
    EditComponent.liveformData.demoConso.phaVoKetCau = {
      description: data.phaVoKetCauDesc,
      images: this.demobilisationImageUrls
    };
    EditComponent.liveformData.demoConso.giaCoKetCau = {
      description: data.giaCoKetCauDesc,
      images: this.consolidationImageUrls
    };
    EditComponent.liveformData.demoConso.dieuKien = {
      description: data.dieuKienHinhAnhDesc,
      images: this.adjacentImageUrls
    };
  }


  uploadDemobilisationImage(event) {
    const files = event.target.files;
    if (Utils.checkTypeFileImage(files)) {
      document.getElementById('uploadDemobilisationLoading').classList.add('loader');
      this.siteSurveyReportService
        .uploadImageSiteSurveyingReport(files, this.currentBidOpportunityId)
        .subscribe(res => {
          document.getElementById('uploadDemobilisationLoading').classList.remove('loader');
          this.demobilisationImageUrls = [...this.demobilisationImageUrls, ...res];
          this.demoConsoForm.get('phaVoKetCauList').patchValue(this.demobilisationImageUrls);
          this.uploadDemobilisation.nativeElement.value = null;
        }, err => {
          document.getElementById('uploadDemobilisationLoading').classList.remove('loader');
          this.alertService.error('Upload hình ảnh thất bại. Xin vui lòng thử lại!');
          this.demobilisationImageUrls.forEach(x => {
            if (!x.id) {
              const index = this.demobilisationImageUrls.indexOf(x);
              this.demobilisationImageUrls.splice(index, 1);
            }
          });
        });
    } else {
      this.alertService.error('Hệ thống không hỗ trợ upload loại file này. Những loại file được hỗ trợ bao gồm jpg, .jpeg');
    }
  }
  deleteDemobilisationImage(i) {
    const index = this.demobilisationImageUrls.indexOf(i);
    if (i.guid) {
      this.siteSurveyReportService.deleteImageSiteSurveyingReport(i.guid).subscribe(res => {

      }, err => {
        this.alertService.error('Đã xảy ra lỗi, hình ảnh xóa không thành công');
      });
    }
    this.demobilisationImageUrls.splice(index, 1);
    this.demoConsoForm.get('phaVoKetCauList').patchValue(this.demobilisationImageUrls);
  }

  uploadConsolidationImage(event) {
    const files = event.target.files;
    if (Utils.checkTypeFileImage(files)) {
      document.getElementById('uploadConsolidationLoading').classList.add('loader');
      this.siteSurveyReportService
        .uploadImageSiteSurveyingReport(files, this.currentBidOpportunityId)
        .subscribe(res => {
          document.getElementById('uploadConsolidationLoading').classList.remove('loader');
          this.consolidationImageUrls = [...this.consolidationImageUrls, ...res];
          this.demoConsoForm.get('giaCoKetCauList').patchValue(this.consolidationImageUrls);
          this.uploadConsolidation.nativeElement.value = null;
        }, err => {
          document.getElementById('uploadConsolidationLoading').classList.remove('loader');
          this.alertService.error('Upload hình ảnh thất bại. Xin vui lòng thử lại!');
          this.consolidationImageUrls.forEach(x => {
            if (!x.id) {
              const index = this.consolidationImageUrls.indexOf(x);
              this.consolidationImageUrls.splice(index, 1);
            }
          });
        });
    } else {
      this.alertService.error('Hệ thống không hỗ trợ upload loại file này. Những loại file được hỗ trợ bao gồm jpg, .jpeg');
    }
  }
  deleteConsolidationImage(i) {
    const index = this.consolidationImageUrls.indexOf(i);
    if (i.guid) {
      this.siteSurveyReportService.deleteImageSiteSurveyingReport(i.guid).subscribe(res => {

      }, err => {
        this.alertService.error('Đã xảy ra lỗi, hình ảnh xóa không thành công');
      });
    }
    this.consolidationImageUrls.splice(index, 1);
    this.demoConsoForm.get('giaCoKetCauList').patchValue(this.consolidationImageUrls);
  }

  uploaAdjacentImage(event) {
    const files = event.target.files;
    if (Utils.checkTypeFileImage(files)) {
      document.getElementById('uploaAdjacentLoading').classList.add('loader');
      this.siteSurveyReportService
        .uploadImageSiteSurveyingReport(files, this.currentBidOpportunityId)
        .subscribe(res => {
          document.getElementById('uploaAdjacentLoading').classList.remove('loader');
          this.adjacentImageUrls = [...this.adjacentImageUrls, ...res];
          this.demoConsoForm.get('dieuKienHinhAnhList').patchValue(this.adjacentImageUrls);
          this.uploaAdjacent.nativeElement.value = null;
        }, err => {
          document.getElementById('uploaAdjacentLoading').classList.remove('loader');
          this.alertService.error('Upload hình ảnh thất bại. Xin vui lòng thử lại!');
          this.adjacentImageUrls.forEach(x => {
            if (!x.id) {
              const index = this.adjacentImageUrls.indexOf(x);
              this.adjacentImageUrls.splice(index, 1);
            }
          });
        });
    } else {
      this.alertService.error('Hệ thống không hỗ trợ upload loại file này. Những loại file được hỗ trợ bao gồm jpg, .jpeg');
    }
  }
  deleteAdjacentImage(i) {
    const index = this.adjacentImageUrls.indexOf(i);
    if (i.guid) {
      this.siteSurveyReportService.deleteImageSiteSurveyingReport(i.guid).subscribe(res => {

      }, err => {
        this.alertService.error('Đã xảy ra lỗi, hình ảnh xóa không thành công');
      });
    }
    this.adjacentImageUrls.splice(index, 1);
    this.demoConsoForm.get('dieuKienHinhAnhList').patchValue(this.adjacentImageUrls);
  }
  viewFullScreenImage(listImage, indexImage?) {
    this.showPopupViewImage = true;
    this.imageUrlArray = [...listImage];
    this.indexOfImage = indexImage;
  }
  closeView() {
    this.showPopupViewImage = false;
  }
  onFocus(e) {
    const input = e.target.parentNode.firstElementChild;
    e.target.addEventListener('keyup', elem => {
      if (elem.keyCode === 13) {
        input.click();
      }
    });
  }
}
