import { Component, OnInit } from '@angular/core';
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
  thongTinDuAnForm: FormGroup;
  hinhAnhPhoiCanhList = [];
  banVeMasterPlanList = [];
  dataStepInfo = new ThongTinDuAn();
  imageUrlArray = [];
  showPopupViewImage = false;
  currentBidOpportunityId: number;
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
    this.loadData();
    this.createForm();
    this.thongTinDuAnForm.valueChanges.subscribe(data => this.hoSoDuThauService.emitDataStepInfo(data));
  }
  createForm() {
    this.thongTinDuAnForm = this.fb.group({
      tenTaiLieu: { value: this.dataStepInfo.tenTaiLieu, disabled: this.isModeView },
      hinhAnhPhoiCanh: [],
      banVeMasterPlan: [],
      lanPhongVan: { value: this.dataStepInfo.lanPhongVan, disabled: this.isModeView },
      dienGiaiThongTinDuAn: { value: this.dataStepInfo.dienGiaiThongTinDuAn, disabled: this.isModeView }
    });

    this.thongTinDuAnForm.valueChanges.subscribe(data => {
      let obj = new ThongTinDuAn();
      obj = {
        tenTaiLieu: data.tenTaiLieu,
        lanPhongVan: data.lanPhongVan,
        dienGiaiThongTinDuAn: data.dienGiaiThongTinDuAn,
        hinhAnhPhoiCanh: data.hinhAnhPhoiCanh,
        banVeMasterPlan: data.banVeMasterPlan
      };
    });


  }
  loadData() {
    this.hoSoDuThauService.watchDataLiveForm().subscribe(data => {
      const objDataStepInfo = data.thongTinDuAn;
      if (objDataStepInfo) {
        this.dataStepInfo.tenTaiLieu = objDataStepInfo.tenTaiLieu;
        this.dataStepInfo.lanPhongVan = objDataStepInfo.lanPhongVan;
        this.hinhAnhPhoiCanhList = objDataStepInfo.hinhAnhPhoiCanh;
        this.banVeMasterPlanList = objDataStepInfo.banVeMasterPlan;
        this.dataStepInfo.dienGiaiThongTinDuAn = objDataStepInfo.dienGiaiThongTinDuAn;
      }
      if (!objDataStepInfo) {
        this.dataStepInfo = {
          tenTaiLieu: '',
          lanPhongVan: null,
          hinhAnhPhoiCanh: [],
          banVeMasterPlan: [],
          dienGiaiThongTinDuAn: ''
        };
      }
    });
  }


  uploadStructureImage(event) {
    const files = event.target.files;
    this.hoSoDuThauService
      .uploadImage(files, this.currentBidOpportunityId)
      .subscribe(res => {
        this.hinhAnhPhoiCanhList = [...this.hinhAnhPhoiCanhList, ...res];
        this.thongTinDuAnForm.get('hinhAnhPhoiCanh').patchValue(this.hinhAnhPhoiCanhList);
      }, err => {
        this.alertService.error('Upload hình ảnh thất bại. Xin vui lòng thử lại!');
        this.hinhAnhPhoiCanhList.forEach(x => {
          if (!x.id) {
            const index = this.hinhAnhPhoiCanhList.indexOf(x);
            this.hinhAnhPhoiCanhList.splice(index, 1);
          }
        });
      });
  }

  deleteStructureImage(i) {
    const index = this.hinhAnhPhoiCanhList.indexOf(i);
    this.hoSoDuThauService.deleteImage(i.id).subscribe(res => {
    }, err => {
      this.alertService.error('Đã xảy ra lỗi, hình ảnh xóa không thành công');
    });
    this.hinhAnhPhoiCanhList.splice(index, 1);
    this.thongTinDuAnForm.get('hinhAnhPhoiCanh').patchValue(this.hinhAnhPhoiCanhList);
  }

  uploadBanVe(event) {
    const files = event.target.files;
    this.hoSoDuThauService
      .uploadImage(files, this.currentBidOpportunityId)
      .subscribe(res => {
        this.banVeMasterPlanList = [...this.banVeMasterPlanList, ...res];
        this.thongTinDuAnForm.get('banVeMasterPlan').patchValue(this.banVeMasterPlanList);
      }, err => {
        this.alertService.error('Upload hình ảnh thất bại. Xin vui lòng thử lại!');
        this.banVeMasterPlanList.forEach(x => {
          if (!x.id) {
            const index = this.banVeMasterPlanList.indexOf(x);
            this.banVeMasterPlanList.splice(index, 1);
          }
        });
      });
  }

  deleteBanVe(i) {
    const index = this.banVeMasterPlanList.indexOf(i);
    this.hoSoDuThauService.deleteImage(i.id).subscribe(res => {
    }, err => {
      this.alertService.error('Đã xảy ra lỗi, hình ảnh xóa không thành công');
    });
    this.banVeMasterPlanList.splice(index, 1);
    this.thongTinDuAnForm.get('banVeMasterPlan').patchValue(this.banVeMasterPlanList);
  }

  viewFullScreenImage(listImage) {
    this.showPopupViewImage = true;
    this.imageUrlArray = [...listImage];
  }

  closeView() {
    this.showPopupViewImage = false;
  }
}
