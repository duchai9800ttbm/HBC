import {
  Component,
  OnInit
} from '@angular/core';
import {
  ScaleOverall
} from '../../../../../../../../shared/models/site-survey-report/scale-overall.model';
import {
  Router
} from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  FormArray,
  FormControl
} from '@angular/forms';
import {
  EditComponent
} from '../edit.component';
import {
  Image,
  ImageItem
} from '../../../../../../../../shared/models/site-survey-report/image';
import { LiveformSiteReportComponent } from '../../liveform-site-report.component';
import { PackageDetailComponent } from '../../../../../package-detail.component';
import { AlertService } from '../../../../../../../../shared/services';
import { SiteSurveyReportService } from '../../../../../../../../shared/services/site-survey-report.service';
@Component({
  selector: 'app-scale-overall',
  templateUrl: './scale-overall.component.html',
  styleUrls: ['./scale-overall.component.scss']
})
export class ScaleOverallComponent implements OnInit {
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
  viewMode;
  currentBidOpportunityId: number;
  scaleModel = new ScaleOverall();

  get loaiCongTrinhListFA(): FormArray {
    return this.loaiCongTrinhForm.get('loaiCongTrinhList') as FormArray;
  }

  get trangthaiCongTrinhListFA(): FormArray {
    return this.trangThaiCongTrinhForm.get('trangthaiCongTrinhList') as FormArray;
  }
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
    this.scaleOverallForm = this.fb.group({
      tenTaiLieu: [this.scaleModel.tenTaiLieu],
      lanPhongVan: [this.scaleModel.lanPhongVan],
      loaiCongTrinhList: [null],
      trangthaiCongTrinhList: [null],
      dienTichCongTruong: [this.scaleModel.quyMoDuAn && this.scaleModel.quyMoDuAn.dienTichCongTruong],
      tongDienTichXayDung: [this.scaleModel.quyMoDuAn && this.scaleModel.quyMoDuAn.tongDienTichXayDung],
      soTang: [this.scaleModel.quyMoDuAn && this.scaleModel.quyMoDuAn.soTang],
      tienDo: [this.scaleModel.quyMoDuAn && this.scaleModel.quyMoDuAn.tienDo],
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
    this.scaleOverallForm.valueChanges.subscribe(data => this.mappingToLiveFormData(data));
  }

  checkFlag() {
    if (LiveformSiteReportComponent.formModel.isCreateOrEdit) {
      const flag = LiveformSiteReportComponent.viewFlag;
      this.viewMode = flag;
      if (flag) {
        const inputs = document.getElementsByTagName('input');
        for (let i = 0; i < inputs.length; i++) {
          inputs[i].style.pointerEvents = 'none';
        }
      }
    } else {
      this.router.navigate([`/package/detail/${this.currentBidOpportunityId}/attend/build/liveformsite`]);
    }
  }

  initData() {
    const obj = LiveformSiteReportComponent.formModel.scaleOverall;
    if (obj) {
      this.scaleModel.tenTaiLieu = obj.tenTaiLieu ? obj.tenTaiLieu : '';
      this.scaleModel.lanPhongVan = obj.lanPhongVan ? obj.lanPhongVan : null;
      this.loaiCongTrinhList = obj.loaiCongTrinh;
      this.trangthaiCongTrinhList = (obj.trangthaiCongTrinh.length) ? obj.trangthaiCongTrinh : [
        {
          text: 'Mới (New)',
          value: '',
          checked: false
        },
        {
          text: 'Thay đổi & bổ sung (Alteration & Additional)',
          value: '',
          checked: false
        },
        {
          text: 'Khác (Other)',
          value: '',
          checked: false
        },
        {
          text: 'Nâng cấp, cải tiến (Renovation)',
          value: '',
          checked: false
        }, {
          text: 'Tháo dỡ & cải tiến (Demolishment & Renovation)',
          value: '',
          checked: false
        }
      ];
      this.scaleModel.quyMoDuAn = obj.quyMoDuAn && {
        dienTichCongTruong: obj.quyMoDuAn.dienTichCongTruong,
        tongDienTichXayDung: obj.quyMoDuAn.tongDienTichXayDung,
        soTang: obj.quyMoDuAn.soTang,
        tienDo: obj.quyMoDuAn.tienDo
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
    }
    const res = this.trangthaiCongTrinhList.find(other => {
      return other.text === 'Khác (Other)';
    });
    this.valueOfOthers = (res.value !== 'null') ? res.value : '';
    this.showValueOfOther = res.checked;
  }

  mappingToLiveFormData(data) {
    LiveformSiteReportComponent.formModel.scaleOverall = new ScaleOverall;
    LiveformSiteReportComponent.formModel.scaleOverall.tenTaiLieu = data.tenTaiLieu;
    LiveformSiteReportComponent.formModel.scaleOverall.lanPhongVan = data.lanPhongVan;
    LiveformSiteReportComponent.formModel.scaleOverall.loaiCongTrinh = this.loaiCongTrinhList;
    LiveformSiteReportComponent.formModel.scaleOverall.trangthaiCongTrinh = this.trangthaiCongTrinhList;
    LiveformSiteReportComponent.formModel.scaleOverall.quyMoDuAn = {
      dienTichCongTruong: data.dienTichCongTruong,
      tongDienTichXayDung: data.tongDienTichXayDung,
      soTang: data.soTang,
      tienDo: data.tienDo
    };
    LiveformSiteReportComponent.formModel.scaleOverall.hinhAnhPhoiCanh = {
      description: data.hinhAnhPhoiCanhDesc,
      images: this.perspectiveImageUrls
    };
    LiveformSiteReportComponent.formModel.scaleOverall.thongTinVeKetCau = {
      description: data.thongTinVeKetCauDesc,
      images: this.structureImageUrls
    };
    LiveformSiteReportComponent.formModel.scaleOverall.nhungYeuCauDacBiet = {
      description: data.nhungYeuCauDacBietDesc,
      images: this.requirementsImageUrls
    };
  }

  uploadPerspectiveImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        if (file.size < 10485760) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.perspectiveImageUrls.push({
              id: null,
              thumbSizeUrl: null,
              largeSizeUrl: null,
              file: file,
              base64: e.target.result
            });
            this.scaleOverallForm.get('hinhAnhPhoiCanhList').patchValue(this.perspectiveImageUrls);
          };
          reader.readAsDataURL(file);
        } else {
          this.alertService.error(`Hình ảnh ${file.name} quá lớn! Vui lòng chọn hình ảnh khác`);
        }
      }
    }
    this.siteSurveyReportService
      .uploadImageSiteSurveyingReport(this.perspectiveImageUrls, this.currentBidOpportunityId)
      .subscribe(res => {
        this.perspectiveImageUrls = res;
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
    if (i.id) {
      this.siteSurveyReportService.deleteImageSiteSurveyingReport(i.id).subscribe(res => {

      }, err => {
        this.alertService.error('Đã xảy ra lỗi, hình ảnh xóa không thành công');
      });
    }
    this.perspectiveImageUrls.splice(index, 1);
    this.scaleOverallForm.get('hinhAnhPhoiCanhList').patchValue(this.perspectiveImageUrls);
  }

  uploadStructureImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        if (file.size < 10485760) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.structureImageUrls.push({
              id: null,
              thumbSizeUrl: null,
              largeSizeUrl: null,
              file: file,
              base64: e.target.result
            });
            this.scaleOverallForm.get('thongTinVeKetCauList').patchValue(this.structureImageUrls);
          };
          reader.readAsDataURL(file);
        } else {
          this.alertService.error(`Hình ảnh ${file.name} quá lớn! Vui lòng chọn hình ảnh khác`);
        }
      }
    }
    this.siteSurveyReportService
      .uploadImageSiteSurveyingReport(this.structureImageUrls, this.currentBidOpportunityId)
      .subscribe(res => {
        this.structureImageUrls = res;
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
    if (i.id) {
      this.siteSurveyReportService.deleteImageSiteSurveyingReport(i.id).subscribe(res => {

      }, err => {
        this.alertService.error('Đã xảy ra lỗi, hình ảnh xóa không thành công');
      });
    }
    this.structureImageUrls.splice(index, 1);
    this.scaleOverallForm.get('thongTinVeKetCauList').patchValue(this.structureImageUrls);
  }
  uploadRequirementsImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        if (file.size < 10485760) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.requirementsImageUrls.push({
              id: null,
              thumbSizeUrl: null,
              largeSizeUrl: null,
              file: file,
              base64: e.target.result
            });
            this.scaleOverallForm.get('nhungYeuCauDacBietList').patchValue(this.requirementsImageUrls);
          };
          reader.readAsDataURL(file);
        } else {
          this.alertService.error(`Hình ảnh ${file.name} quá lớn! Vui lòng chọn hình ảnh khác`);
        }
      }
    }
    this.siteSurveyReportService
      .uploadImageSiteSurveyingReport(this.requirementsImageUrls, this.currentBidOpportunityId)
      .subscribe(res => {
        this.requirementsImageUrls = res;
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
    if (i.id) {
      this.siteSurveyReportService.deleteImageSiteSurveyingReport(i.id).subscribe(res => {

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
    this.scaleOverallForm.get('trangthaiCongTrinhList').patchValue(this.trangthaiCongTrinhList);
    const result = this.trangthaiCongTrinhList.find(obj => {
      return obj.text === 'Khác (Other)';
    });
    this.showValueOfOther = result.checked;
  }
  valueOfOther(event) {
    const result = this.trangthaiCongTrinhList.find(obj => {
      return obj.text === 'Khác (Other)';
    });
    result.value = this.valueOfOthers;
    this.trangThaiCongTrinhChange();
  }
}
