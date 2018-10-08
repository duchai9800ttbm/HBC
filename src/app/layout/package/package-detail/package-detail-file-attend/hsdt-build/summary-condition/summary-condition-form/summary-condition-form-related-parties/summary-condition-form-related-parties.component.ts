import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../../../../../../../../shared/services';
import { HoSoDuThauService } from '../../../../../../../../shared/services/ho-so-du-thau.service';
import { CacBenLienQuan } from '../../../../../../../../shared/models/ho-so-du-thau/cac-ben-lien-quan';
import { ThongTinCacBen } from '../../../../../../../../shared/models/ho-so-du-thau/thong-tin-cac-ben';
import { PackageService } from '../../../../../../../../shared/services/package.service';
import { PackageDetailComponent } from '../../../../../package-detail.component';

@Component({
  selector: 'app-summary-condition-form-related-parties',
  templateUrl: './summary-condition-form-related-parties.component.html',
  styleUrls: ['./summary-condition-form-related-parties.component.scss']
})
export class SummaryConditionFormRelatedPartiesComponent implements OnInit {
  cacBenLienQuanForm: FormGroup;
  dataStepRelate = new CacBenLienQuan();
  packageId;
  listOfBidUserStackholder = [];

  get chudautuFA(): FormArray {
    return this.cacBenLienQuanForm.get('chudautu') as FormArray;
  }
  get quanlyduanFA(): FormArray {
    return this.cacBenLienQuanForm.get('quanlyduan') as FormArray;
  }
  get quanlychiphiFA(): FormArray {
    return this.cacBenLienQuanForm.get('quanlychiphi') as FormArray;
  }
  get thietkekientrucFA(): FormArray {
    return this.cacBenLienQuanForm.get('thietkekientruc') as FormArray;
  }
  get thietkeketcauFA(): FormArray {
    return this.cacBenLienQuanForm.get('thietkeketcau') as FormArray;
  }
  get thietkecodienFA(): FormArray {
    return this.cacBenLienQuanForm.get('thietkecodien') as FormArray;
  }
  get thongtinkhacFA(): FormArray {
    return this.cacBenLienQuanForm.get('thongtinkhac') as FormArray;
  }

  constructor(
    private hoSoDuThauService: HoSoDuThauService,
    private alertService: AlertService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.packageId = +PackageDetailComponent.packageId;
    this.getBidUserStackeholder();
    this.loadData();
    this.createForm();
  }
  getBidUserStackeholder() {
    this.hoSoDuThauService.getGroupMemberStackHolder(this.packageId).subscribe(data => {
      this.listOfBidUserStackholder = data;
      console.log(this.listOfBidUserStackholder);
    }, err => {
      this.alertService.error(`Đã có lỗi khi tải danh sách các bên liên quan. Xin vui lòng thử lại!`);
    });
  }
  createForm() {
    this.cacBenLienQuanForm = this.fb.group({
      chudautu: this.fb.array([]),
      quanlyduan: this.fb.array([]),
      quanlychiphi: this.fb.array([]),
      thietkekientruc: this.fb.array([]),
      thietkeketcau: this.fb.array([]),
      thietkecodien: this.fb.array([]),
      thongtinkhac: this.fb.array([])
    });
    this.cacBenLienQuanForm.valueChanges.subscribe(data => this.hoSoDuThauService.emitDataStepRelate(data));
  }
  loadData() {
    this.hoSoDuThauService.watchDataLiveForm().subscribe(data => {
      const objDataStepRelate = data.cacBenLienQuan;
      if (objDataStepRelate) {

      }
    });
  }


}
