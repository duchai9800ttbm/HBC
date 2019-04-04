import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HoSoDuThauService } from '../../../../../../../../shared/services/ho-so-du-thau.service';
import { Router } from '@angular/router';
import { AlertService } from '../../../../../../../../shared/services';
import { ThongTinDuAn } from '../../../../../../../../shared/models/ho-so-du-thau/thong-tin-du-an';
import { PackageDetailComponent } from '../../../../../package-detail.component';

@Component({
  selector: 'app-summary-condition-form-info',
  templateUrl: './summary-condition-form-info.component.html',
  styleUrls: ['./summary-condition-form-info.component.scss']
})
export class SummaryConditionFormInfoComponent implements OnInit {
  // @ViewChild('autofocus') autofocus;
  @ViewChild('uploadMasterplan') uploadMasterplan;
  @ViewChild('uploadMasterplanButton') uploadMasterplanButton;
  @ViewChild('uploadPhoiCanh') uploadPhoiCanh;
  @ViewChild('uploadPhoiCanhButton') uploadPhoiCanhButton;
  thongTinDuAnForm: FormGroup;
  hinhAnhPhoiCanhUrls = [];
  banVeMasterPlanUrls = [];
  dataStepInfo = new ThongTinDuAn();
  currentBidOpportunityId: number;
  showPopupViewImage = false;
  imageUrlArray = [];
  indexOfImage;
  viewMode;
  isModeView = false;

  constructor(
    private hoSoDuThauService: HoSoDuThauService,
    private alertService: AlertService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit() {

    this.currentBidOpportunityId = +PackageDetailComponent.packageId;
    this.hoSoDuThauService.watchLiveformState().subscribe(data => {
      this.isModeView = data.isModeView;
      if (!this.isModeView && this.thongTinDuAnForm) {
        this.thongTinDuAnForm.enable();
      }
    });
    this.loadData();
  }

  createForm() {
    this.thongTinDuAnForm = this.fb.group({
      tenTaiLieu: { value: this.dataStepInfo.tenTaiLieu, disabled: this.isModeView },
      hinhAnhPhoiCanh: this.dataStepInfo.hinhAnhPhoiCanh,
      banVeMasterPlan: this.dataStepInfo.banVeMasterPlan,
      lanPhongVan: { value: this.dataStepInfo.lanPhongVan > 0 ? this.dataStepInfo.lanPhongVan : 1, disabled: this.isModeView },
      dienGiaiThongTinDuAn: { value: this.dataStepInfo.dienGiaiThongTinDuAn, disabled: this.isModeView }
    });


    if (!this.isModeView) {
      this.thongTinDuAnForm.enable();
    }

    this.thongTinDuAnForm.valueChanges.subscribe(data => {
      let obj = new ThongTinDuAn();
      obj = {
        tenTaiLieu: data.tenTaiLieu,
        lanPhongVan: data.lanPhongVan ? data.lanPhongVan : 1,
        dienGiaiThongTinDuAn: data.dienGiaiThongTinDuAn,
        hinhAnhPhoiCanh: this.hinhAnhPhoiCanhUrls,
        banVeMasterPlan: this.banVeMasterPlanUrls
      };

      this.hoSoDuThauService.emitDataStepInfo(obj);
    });
    this.hoSoDuThauService.scrollToView(true);
  }
  loadData() {
    this.hoSoDuThauService.watchDataLiveForm().subscribe(data => {
      const objDataStepInfo = data.thongTinDuAn;
      if (objDataStepInfo) {
        this.dataStepInfo.tenTaiLieu = data.documentName;
        this.dataStepInfo.lanPhongVan = objDataStepInfo.lanPhongVan;
        this.dataStepInfo.hinhAnhPhoiCanh = objDataStepInfo.hinhAnhPhoiCanh;
        this.dataStepInfo.banVeMasterPlan = objDataStepInfo.banVeMasterPlan;
        this.hinhAnhPhoiCanhUrls = objDataStepInfo.hinhAnhPhoiCanh;
        this.banVeMasterPlanUrls = objDataStepInfo.banVeMasterPlan;
        this.dataStepInfo.dienGiaiThongTinDuAn = objDataStepInfo.dienGiaiThongTinDuAn;
      }
      if (!objDataStepInfo) {
        this.dataStepInfo = {
          tenTaiLieu: '',
          lanPhongVan: 0,
          hinhAnhPhoiCanh: [],
          banVeMasterPlan: [],
          dienGiaiThongTinDuAn: ''
        };
      }
      this.createForm();
    });
  }

  onFocus(check) {
    switch (check) {
      case 'uploadPhoiCanhButton': {
        this.uploadPhoiCanhButton.nativeElement.addEventListener('keyup', e => {
          if (e.keyCode === 13) {
            this.uploadPhoiCanh.nativeElement.click();
          }
        });
        break;
      }
      case 'uploadMasterplanButton': {
        this.uploadMasterplanButton.nativeElement.addEventListener('keyup', e => {
          if (e.keyCode === 13) {
            this.uploadMasterplan.nativeElement.click();
          }
        });
        break;
      }
    }
  }


  uploadPerspectiveImage(event) {
    const files = event.target.files;
    document.getElementById('uploadPhoiCanhLoading').classList.add('loader');
    this.hoSoDuThauService
      .uploadImage(files, this.currentBidOpportunityId)
      .subscribe(res => {
        document.getElementById('uploadPhoiCanhLoading').classList.remove('loader');
        if (this.hinhAnhPhoiCanhUrls) {
          this.hinhAnhPhoiCanhUrls = [...this.hinhAnhPhoiCanhUrls, ...res];
        }
        if (!this.hinhAnhPhoiCanhUrls) {
          this.hinhAnhPhoiCanhUrls = res;
        }
        this.thongTinDuAnForm.get('hinhAnhPhoiCanh').patchValue(this.hinhAnhPhoiCanhUrls);
        this.uploadPhoiCanh.nativeElement.value = null;
      }, err => {
        document.getElementById('uploadPhoiCanhLoading').classList.remove('loader');
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
    this.hoSoDuThauService.deleteImage(i.id).subscribe(res => {
    }, err => {
      this.alertService.error('Đã xảy ra lỗi, hình ảnh xóa không thành công');
    });
    this.hinhAnhPhoiCanhUrls.splice(index, 1);
    this.thongTinDuAnForm.get('hinhAnhPhoiCanh').patchValue(this.hinhAnhPhoiCanhUrls);
  }

  uploadBanVe(event) {
    const files = event.target.files;
    document.getElementById('uploadMasterplanLoading').classList.add('loader');
    this.hoSoDuThauService
      .uploadImage(files, this.currentBidOpportunityId)
      .subscribe(res => {
        document.getElementById('uploadMasterplanLoading').classList.remove('loader');
        if (this.banVeMasterPlanUrls) {
          this.banVeMasterPlanUrls = [...this.banVeMasterPlanUrls, ...res];
        }
        if (!this.banVeMasterPlanUrls) {
          this.banVeMasterPlanUrls = res;
        }
        this.thongTinDuAnForm.get('banVeMasterPlan').patchValue(this.banVeMasterPlanUrls);
        this.uploadMasterplan.nativeElement.value = null;

      }, err => {
        document.getElementById('uploadMasterplanLoading').classList.remove('loader');
        this.alertService.error('Upload hình ảnh thất bại. Xin vui lòng thử lại!');
        this.banVeMasterPlanUrls.forEach(x => {
          if (!x.id) {
            const index = this.banVeMasterPlanUrls.indexOf(x);
            this.banVeMasterPlanUrls.splice(index, 1);
          }
        });
      });
  }

  deleteBanVe(i) {
    const index = this.banVeMasterPlanUrls.indexOf(i);
    this.hoSoDuThauService.deleteImage(i.id).subscribe(res => {
    }, err => {
      this.alertService.error('Đã xảy ra lỗi, hình ảnh xóa không thành công');
    });
    this.banVeMasterPlanUrls.splice(index, 1);
    this.thongTinDuAnForm.get('banVeMasterPlan').patchValue(this.banVeMasterPlanUrls);
  }

  viewFullScreenImage(listImage, indexImage?) {
    this.showPopupViewImage = true;
    this.imageUrlArray = [...listImage];
    this.indexOfImage = indexImage;
  }

  closeView() {
    this.showPopupViewImage = false;
  }

}
