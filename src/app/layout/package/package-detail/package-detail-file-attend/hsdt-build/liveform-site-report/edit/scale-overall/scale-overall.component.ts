import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  AfterViewInit
} from '@angular/core';
import {
  ScaleOverall
} from '../../../../../../../../shared/models/site-survey-report/scale-overall.model';
import {
  FormGroup,
  FormBuilder,
  FormArray,
  FormControl
} from '@angular/forms';
import { PackageDetailComponent } from '../../../../../package-detail.component';
import { AlertService } from '../../../../../../../../shared/services';
import { SiteSurveyReportService } from '../../../../../../../../shared/services/site-survey-report.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { EditComponent } from '../edit.component';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-scale-overall',
  templateUrl: './scale-overall.component.html',
  styleUrls: ['./scale-overall.component.scss']
})
export class ScaleOverallComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('uploadPerspective') uploadPerspective;
  @ViewChild('uploadStructure') uploadStructure;
  @ViewChild('uploadRequirements') uploadRequirements;
  @ViewChild('autofocus') autofocus;
  scaleOverallForm: FormGroup;
  siteArea;
  totalBuildArea;
  floorNumbers;
  progress;
  loaiCongTrinhForm: FormGroup;
  loaiCongTrinhList = [];
  trangThaiCongTrinhForm: FormGroup;
  trangthaiCongTrinhList = [];
  valueOfOthers;
  showValueOfOther;
  perspectiveImageUrls = [];
  structureImageUrls = [];
  requirementsImageUrls = [];
  url;
  isViewMode = false;
  modalRef: BsModalRef;
  imageUrlArray = [];
  indexOfImage;
  showPopupViewImage = false;
  currentBidOpportunityId: number;
  scaleModel = new ScaleOverall();
  subscription: Subscription;
  get loaiCongTrinhListFA(): FormArray {
    return this.loaiCongTrinhForm.get('loaiCongTrinhList') as FormArray;
  }

  get trangthaiCongTrinhListFA(): FormArray {
    return this.trangThaiCongTrinhForm.get('trangthaiCongTrinhList') as FormArray;
  }
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
      if (this.scaleOverallForm && this.isViewMode) {
        this.scaleOverallForm.disable();
      }
      if (this.scaleOverallForm && !this.isViewMode) {
        this.scaleOverallForm.enable();
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
  createForm() {
    this.scaleOverallForm = this.fb.group({
      tenTaiLieu: [this.scaleModel.tenTaiLieu],
      lanPhongVan: [this.scaleModel.lanPhongVan],
      loaiCongTrinhList: [],
      trangthaiCongTrinhList: [],
      dienTichCongTruong: [this.scaleModel.quyMoDuAn && this.scaleModel.quyMoDuAn.dienTichCongTruong],
      tongDienTichXayDung: this.scaleModel.quyMoDuAn && this.scaleModel.quyMoDuAn.tongDienTichXayDung,
      soTang: [this.scaleModel.quyMoDuAn && this.scaleModel.quyMoDuAn.soTang],
      tienDo: this.scaleModel.quyMoDuAn && this.scaleModel.quyMoDuAn.tienDo,
      hinhAnhPhoiCanhDesc: [this.scaleModel.hinhAnhPhoiCanh && this.scaleModel.hinhAnhPhoiCanh.description],
      hinhAnhPhoiCanhList: [null],
      thongTinVeKetCauDesc: [this.scaleModel.thongTinVeKetCau && this.scaleModel.thongTinVeKetCau.description],
      thongTinVeKetCauList: [null],
      nhungYeuCauDacBietDesc: [this.scaleModel.nhungYeuCauDacBiet && this.scaleModel.nhungYeuCauDacBiet.description],
      nhungYeuCauDacBietList: [null]
    });
    const controlss = this.loaiCongTrinhList.map(c => new FormControl(false));
    this.loaiCongTrinhForm = this.fb.group({
      loaiCongTrinhList: new FormArray(controlss)
    });
    const controls = this.trangthaiCongTrinhList.map(c => new FormControl(false));
    this.trangThaiCongTrinhForm = this.fb.group({
      trangthaiCongTrinhList: new FormArray(controls)
    });
    if (this.scaleOverallForm && this.isViewMode) {
      this.scaleOverallForm.disable();
    }
    if (this.scaleOverallForm && !this.isViewMode) {
      this.scaleOverallForm.enable();
    }
    this.scaleOverallForm.valueChanges.subscribe(data => this.mappingToLiveFormData(data));
  }

  checkFlag() {
    this.isViewMode = EditComponent.actionMode === 'info';
  }
  ngAfterViewInit() {
    if (!this.isViewMode && this.scaleOverallForm) {
      this.autofocus.nativeElement.focus();
    }
  }

  initData() {
    const obj = EditComponent.liveformData.scaleOverall;
    if (obj) {
      this.scaleModel.tenTaiLieu = obj.tenTaiLieu ? obj.tenTaiLieu : '';
      this.scaleModel.lanPhongVan = obj.lanPhongVan ? obj.lanPhongVan : null;
      this.loaiCongTrinhList = obj.loaiCongTrinh;
      this.trangthaiCongTrinhList = obj.trangthaiCongTrinh;
      this.scaleModel.quyMoDuAn = obj.quyMoDuAn && {
        dienTichCongTruong: obj.quyMoDuAn.dienTichCongTruong,
        tongDienTichXayDung: obj.quyMoDuAn.tongDienTichXayDung,
        soTang: obj.quyMoDuAn.soTang,
        tienDo: obj.quyMoDuAn.tienDo,
        donViTienDo: obj.quyMoDuAn.donViTienDo
      };
      this.scaleModel.hinhAnhPhoiCanh = obj.hinhAnhPhoiCanh && {
        description: obj.hinhAnhPhoiCanh.description,
        images: obj.hinhAnhPhoiCanh.images
      };
      this.scaleModel.thongTinVeKetCau = obj.thongTinVeKetCau && {
        description: obj.thongTinVeKetCau.description,
        images: obj.thongTinVeKetCau.images
      };
      this.scaleModel.nhungYeuCauDacBiet = obj.nhungYeuCauDacBiet && {
        description: obj.nhungYeuCauDacBiet.description,
        images: obj.nhungYeuCauDacBiet.images
      };
      this.perspectiveImageUrls = this.scaleModel.hinhAnhPhoiCanh ? this.scaleModel.hinhAnhPhoiCanh.images : [];
      this.structureImageUrls = this.scaleModel.thongTinVeKetCau ? this.scaleModel.thongTinVeKetCau.images : [];
      this.requirementsImageUrls = this.scaleModel.nhungYeuCauDacBiet ? this.scaleModel.nhungYeuCauDacBiet.images : [];

      // Check Value Of Status-Other
      const other = this.trangthaiCongTrinhList.find(i => i.text === 'Khác (Other)');
      if (other) {
        this.valueOfOthers = (other.value !== 'null') ? other.value : '';
        this.showValueOfOther = other.checked;
      } else {
        this.showValueOfOther = false;
      }
    }
  }

  mappingToLiveFormData(data) {
    EditComponent.liveformData.scaleOverall = new ScaleOverall;
    EditComponent.liveformData.scaleOverall.tenTaiLieu = data.tenTaiLieu;
    EditComponent.liveformData.scaleOverall.lanPhongVan = data.lanPhongVan;
    EditComponent.liveformData.scaleOverall.loaiCongTrinh = this.loaiCongTrinhList;
    EditComponent.liveformData.scaleOverall.trangthaiCongTrinh = this.trangthaiCongTrinhList;
    EditComponent.liveformData.scaleOverall.quyMoDuAn = {
      dienTichCongTruong: data.dienTichCongTruong,
      tongDienTichXayDung: data.tongDienTichXayDung,
      soTang: data.soTang,
      tienDo: String(data.tienDo) + ' ' + (this.scaleModel.quyMoDuAn.donViTienDo && this.scaleModel.quyMoDuAn.donViTienDo.value),
      donViTienDo: null
    };
    EditComponent.liveformData.scaleOverall.hinhAnhPhoiCanh = {
      description: data.hinhAnhPhoiCanhDesc,
      images: this.perspectiveImageUrls
    };
    EditComponent.liveformData.scaleOverall.thongTinVeKetCau = {
      description: data.thongTinVeKetCauDesc,
      images: this.structureImageUrls
    };
    EditComponent.liveformData.scaleOverall.nhungYeuCauDacBiet = {
      description: data.nhungYeuCauDacBietDesc,
      images: this.requirementsImageUrls
    };
  }

  uploadPerspectiveImage(event) {
    const files = event.target.files;
    this.siteSurveyReportService
      .uploadImageSiteSurveyingReport(files, this.currentBidOpportunityId)
      .subscribe(res => {
        this.perspectiveImageUrls = [...this.perspectiveImageUrls, ...res];
        this.scaleOverallForm.get('hinhAnhPhoiCanhList').patchValue(this.perspectiveImageUrls);
        this.uploadPerspective.nativeElement.value = null;
      }, err => {
        this.alertService.error('Upload hình ảnh thất bại. Xin vui lòng thử lại!');
        this.perspectiveImageUrls.forEach(x => {
          if (!x.id) {
            const index = this.perspectiveImageUrls.indexOf(x);
            this.perspectiveImageUrls.splice(index, 1);
          }
        });
      });
  }

  deletePerspectiveImage(i) {
    const index = this.perspectiveImageUrls.indexOf(i);
    if (i.guid) {
      this.siteSurveyReportService.deleteImageSiteSurveyingReport(i.guid).subscribe(res => {
      }, err => {
        this.alertService.error('Đã xảy ra lỗi, hình ảnh xóa không thành công');
      });
    }
    this.perspectiveImageUrls.splice(index, 1);
    this.scaleOverallForm.get('hinhAnhPhoiCanhList').patchValue(this.perspectiveImageUrls);
  }

  uploadStructureImage(event) {
    const files = event.target.files;
    this.siteSurveyReportService
      .uploadImageSiteSurveyingReport(files, this.currentBidOpportunityId)
      .subscribe(res => {
        this.structureImageUrls = [...this.structureImageUrls, ...res];
        this.scaleOverallForm.get('thongTinVeKetCauList').patchValue(this.structureImageUrls);
        this.uploadStructure.nativeElement.value = null;
      }, err => {
        this.alertService.error('Upload hình ảnh thất bại. Xin vui lòng thử lại!');
        this.structureImageUrls.forEach(x => {
          if (!x.id) {
            const index = this.structureImageUrls.indexOf(x);
            this.structureImageUrls.splice(index, 1);
          }
        });
      });
  }
  deleteStructureImage(i) {
    const index = this.structureImageUrls.indexOf(i);
    if (i.guid) {
      this.siteSurveyReportService.deleteImageSiteSurveyingReport(i.guid).subscribe(res => {
      }, err => {
        this.alertService.error('Đã xảy ra lỗi, hình ảnh xóa không thành công');
      });
    }
    this.structureImageUrls.splice(index, 1);
    this.scaleOverallForm.get('thongTinVeKetCauList').patchValue(this.structureImageUrls);
  }
  uploadRequirementsImage(event) {
    const files = event.target.files;
    this.siteSurveyReportService
      .uploadImageSiteSurveyingReport(files, this.currentBidOpportunityId)
      .subscribe(res => {
        this.requirementsImageUrls = [...this.requirementsImageUrls, ...res];
        this.scaleOverallForm.get('nhungYeuCauDacBietList').patchValue(this.requirementsImageUrls);
        this.uploadRequirements.nativeElement.value = null;
      }, err => {
        this.alertService.error('Upload hình ảnh thất bại. Xin vui lòng thử lại!');
        this.requirementsImageUrls.forEach(x => {
          if (!x.id) {
            const index = this.requirementsImageUrls.indexOf(x);
            this.requirementsImageUrls.splice(index, 1);
          }
        });
      });
  }
  deleteRequirementsImage(i) {
    const index = this.requirementsImageUrls.indexOf(i);
    if (i.guid) {
      this.siteSurveyReportService.deleteImageSiteSurveyingReport(i.guid).subscribe(res => {
      }, err => {
        this.alertService.error('Đã xảy ra lỗi, hình ảnh xóa không thành công');
      });
    }
    this.requirementsImageUrls.splice(index, 1);
    this.scaleOverallForm.get('nhungYeuCauDacBietList').patchValue(this.requirementsImageUrls);
  }
  loaiCongTrinhChange() {
    this.scaleOverallForm.get('loaiCongTrinhList').patchValue(this.loaiCongTrinhList);
  }
  trangThaiCongTrinhChange() {
    const result = this.trangthaiCongTrinhList.find(obj => {
      return obj.text === 'Khác (Other)';
    });
    this.showValueOfOther = result.checked;
    this.scaleOverallForm.get('trangthaiCongTrinhList').patchValue(this.trangthaiCongTrinhList);
  }
  valueOfOther(event) {
    const result = this.trangthaiCongTrinhList.find(obj => {
      return obj.text === 'Khác (Other)';
    });
    result.value = this.valueOfOthers;
    this.trangThaiCongTrinhChange();
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
