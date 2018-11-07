import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DescribeOverall } from '../../../../../../../../shared/models/site-survey-report/describe-overall.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { EditComponent } from '../edit.component';
import { LiveformSiteReportComponent } from '../../liveform-site-report.component';
import { PackageDetailComponent } from '../../../../../package-detail.component';
import { Router } from '@angular/router';
import { AlertService } from '../../../../../../../../shared/services';
import { SiteSurveyReportService } from '../../../../../../../../shared/services/site-survey-report.service';

@Component({
  selector: 'app-describe-overall',
  templateUrl: './describe-overall.component.html',
  styleUrls: ['./describe-overall.component.scss']
})
export class DescribeOverallComponent implements OnInit, AfterViewInit {
  @ViewChild('uploadTopography') uploadTopography;
  @ViewChild('uploadExistingBuild') uploadExistingBuild;
  @ViewChild('uploadStacale') uploadStacale;
  @ViewChild('autofocus') autofocus;
  describeForm: FormGroup;

  topographyImageUrls = [];
  existingBuildImageUrls = [];
  stacaleImageUrls = [];
  url;
  isViewMode = false;
  imageUrlArray = [];
  indexOfImage;
  showPopupViewImage = false;
  currentBidOpportunityId: number;
  describeModel = new DescribeOverall();
  constructor(
    private siteSurveyReportService: SiteSurveyReportService,
    private alertService: AlertService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.currentBidOpportunityId = +PackageDetailComponent.packageId;
    this.checkFlag();
    this.initData();
    this.describeForm = this.fb.group({
      chiTietDiaHinhDesc: [this.describeModel.chiTietDiaHinh && this.describeModel.chiTietDiaHinh.description],
      chiTietDiaHinhList: [null],
      kienTrucHienHuuDesc: [this.describeModel.kienTrucHienHuu && this.describeModel.kienTrucHienHuu.description],
      kienTrucHienHuuList: [null],
      yeuCauChuongNgaiDesc: [this.describeModel.yeuCauChuongNgai && this.describeModel.yeuCauChuongNgai.description],
      yeuCauChuongNgaiList: [null],
    });
    if (this.isViewMode) {
      this.describeForm.disable();
    }
    this.describeForm.valueChanges.subscribe(data => this.mappingToLiveFormData(data));
  }
  ngAfterViewInit() {
    if (!this.isViewMode) {
      this.autofocus.nativeElement.focus();
    }
  }
  checkFlag() {
    this.isViewMode = LiveformSiteReportComponent.actionMode === 'viewMode';
  }

  initData() {
    const obj = LiveformSiteReportComponent.formModel.describeOverall;
    if (obj) {
      this.describeModel.chiTietDiaHinh = obj.chiTietDiaHinh && {
        description: obj.chiTietDiaHinh.description,
        images: obj.chiTietDiaHinh.images
      };
      this.describeModel.kienTrucHienHuu = obj.kienTrucHienHuu && {
        description: obj.kienTrucHienHuu.description,
        images: obj.kienTrucHienHuu.images
      };
      this.describeModel.yeuCauChuongNgai = obj.yeuCauChuongNgai && {
        description: obj.yeuCauChuongNgai.description,
        images: obj.yeuCauChuongNgai.images
      };
      this.topographyImageUrls = this.describeModel.chiTietDiaHinh ? this.describeModel.chiTietDiaHinh.images : [];
      this.existingBuildImageUrls = this.describeModel.kienTrucHienHuu ? this.describeModel.kienTrucHienHuu.images : [];
      this.stacaleImageUrls = this.describeModel.yeuCauChuongNgai ? this.describeModel.yeuCauChuongNgai.images : [];
    }
  }

  mappingToLiveFormData(data) {
    LiveformSiteReportComponent.formModel.describeOverall = new DescribeOverall;
    LiveformSiteReportComponent.formModel.describeOverall.chiTietDiaHinh = {
      description: data.chiTietDiaHinhDesc,
      images: this.topographyImageUrls
    };
    LiveformSiteReportComponent.formModel.describeOverall.kienTrucHienHuu = {
      description: data.kienTrucHienHuuDesc,
      images: this.existingBuildImageUrls
    };
    LiveformSiteReportComponent.formModel.describeOverall.yeuCauChuongNgai = {
      description: data.yeuCauChuongNgaiDesc,
      images: this.stacaleImageUrls
    };
  }

  uploadTopographyImage(event) {
    const files = event.target.files;
    this.siteSurveyReportService
      .uploadImageSiteSurveyingReport(files, this.currentBidOpportunityId)
      .subscribe(res => {
        this.topographyImageUrls = [...this.topographyImageUrls, ...res];
        this.describeForm.get('chiTietDiaHinhList').patchValue(this.topographyImageUrls);
        this.uploadTopography.nativeElement.value = null;
      }, err => {
        this.alertService.error('Upload hình ảnh thất bại. Xin vui lòng thử lại!');
        this.topographyImageUrls.forEach(x => {
          if (!x.id) {
            const index = this.topographyImageUrls.indexOf(x);
            this.topographyImageUrls.splice(index, 1);
          }
        });
      });
  }
  deleteTopographyImage(i) {
    const index = this.topographyImageUrls.indexOf(i);
    if (i.guid) {
      this.siteSurveyReportService.deleteImageSiteSurveyingReport(i.guid).subscribe(res => {

      }, err => {
        this.alertService.error('Đã xảy ra lỗi, hình ảnh xóa không thành công');
      });
    }
    this.topographyImageUrls.splice(index, 1);
    this.describeForm.get('chiTietDiaHinhList').patchValue(this.topographyImageUrls);
  }

  uploadExistingBuildImage(event) {
    const files = event.target.files;
    this.siteSurveyReportService
      .uploadImageSiteSurveyingReport(files, this.currentBidOpportunityId)
      .subscribe(res => {
        this.existingBuildImageUrls = [...this.existingBuildImageUrls, ...res];
        this.describeForm.get('kienTrucHienHuuList').patchValue(this.existingBuildImageUrls);
        this.uploadExistingBuild.nativeElement.value = null;
      }, err => {
        this.alertService.error('Upload hình ảnh thất bại. Xin vui lòng thử lại!');
        this.existingBuildImageUrls.forEach(x => {
          if (!x.id) {
            const index = this.existingBuildImageUrls.indexOf(x);
            this.existingBuildImageUrls.splice(index, 1);
          }
        });
      });
  }
  deleteExistingBuildImage(i) {
    const index = this.existingBuildImageUrls.indexOf(i);
    if (i.guid) {
      this.siteSurveyReportService.deleteImageSiteSurveyingReport(i.guid).subscribe(res => {

      }, err => {
        this.alertService.error('Đã xảy ra lỗi, hình ảnh xóa không thành công');
      });
    }
    this.existingBuildImageUrls.splice(index, 1);
    this.describeForm.get('kienTrucHienHuuList').patchValue(this.existingBuildImageUrls);
  }

  uploadStacaleImage(event) {
    const files = event.target.files;
    this.siteSurveyReportService
      .uploadImageSiteSurveyingReport(files, this.currentBidOpportunityId)
      .subscribe(res => {
        this.stacaleImageUrls = [...this.stacaleImageUrls, ...res];
        this.describeForm.get('yeuCauChuongNgaiList').patchValue(this.stacaleImageUrls);
        this.uploadStacale.nativeElement.value = null;
      }, err => {
        this.alertService.error('Upload hình ảnh thất bại. Xin vui lòng thử lại!');
        this.stacaleImageUrls.forEach(x => {
          if (!x.id) {
            const index = this.stacaleImageUrls.indexOf(x);
            this.stacaleImageUrls.splice(index, 1);
          }
        });
      });
  }
  deleteStacaleImage(i) {
    const index = this.stacaleImageUrls.indexOf(i);
    if (i.guid) {
      this.siteSurveyReportService.deleteImageSiteSurveyingReport(i.guid).subscribe(res => {

      }, err => {
        this.alertService.error('Đã xảy ra lỗi, hình ảnh xóa không thành công');
      });
    }
    this.stacaleImageUrls.splice(index, 1);
    this.describeForm.get('yeuCauChuongNgaiList').patchValue(this.stacaleImageUrls);
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
