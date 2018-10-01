import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CacBenLienQuan } from '../../../../../../../../shared/models/ho-so-du-thau/tom-tat-dkdt.model';
import { Router } from '@angular/router';
import { AlertService } from '../../../../../../../../shared/services';
import { HoSoDuThauService } from '../../../../../../../../shared/services/ho-so-du-thau.service';

@Component({
  selector: 'app-summary-condition-form-related-parties',
  templateUrl: './summary-condition-form-related-parties.component.html',
  styleUrls: ['./summary-condition-form-related-parties.component.scss']
})
export class SummaryConditionFormRelatedPartiesComponent implements OnInit {
  cacBenLienQuanForm: FormGroup;
  dataStepRelate = new CacBenLienQuan();
  constructor(
    private hoSoDuThauService: HoSoDuThauService,
    private alertService: AlertService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.loadData();
    this.createForm();
    this.cacBenLienQuanForm.valueChanges.subscribe(data => this.hoSoDuThauService.emitDataStepRelate(data));
  }
  createForm() {
    this.cacBenLienQuanForm = this.fb.group({
      donViChuDauTu: null,
      lienHeChuDauTu: null,
      ghiChuChuDauTu: null,

      donViQuanLyDuAn: null,
      lienHeQuanLyDuAn: null,
      ghiChuQuanLyDuAn: null,

      donViQuanLyChiPhi: null,
      lienHeQuanLyChiPhi: null,
      ghiChuQuanLyChiPhi: null,

      donViThietKeKT: null,
      lienHeThietKeKT: null,
      ghiChuThietKeKT: null,

      donViThietKeKC: null,
      lienHeThietKeKC: null,
      ghiChuThietKeKC: null,

      donViThietKeCD: null,
      lienHeThietKeCD: null,
      ghiChuThietKeCD: null,

      donViKhac: null,
      lienHeKhac: null,
      ghiChuKhac: null,
    });
  }
  loadData() {
    this.hoSoDuThauService.watchDataLiveForm().subscribe(data => {
      // const objDataStepInfo = data.thongTinDuAn;
      // if (objDataStepInfo) {
      //   this.dataStepRelate.tenTaiLieu = objDataStepInfo.tenTaiLieu;
      //   this.dataStepRelate.lanPhongVan = objDataStepInfo.lanPhongVan;
      //   this.dataStepRelate.dienGiaiThongTinDuAn = objDataStepInfo.dienGiaiThongTinDuAn;
      // }
    });
  }

}
