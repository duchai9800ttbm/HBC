import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../../../../../../../../shared/services';
import { HoSoDuThauService } from '../../../../../../../../shared/services/ho-so-du-thau.service';
import { CacBenLienQuan } from '../../../../../../../../shared/models/ho-so-du-thau/cac-ben-lien-quan';

@Component({
  selector: 'app-summary-condition-form-related-parties',
  templateUrl: './summary-condition-form-related-parties.component.html',
  styleUrls: ['./summary-condition-form-related-parties.component.scss']
})
export class SummaryConditionFormRelatedPartiesComponent implements OnInit {
  cacBenLienQuanForm: FormGroup;
  dataStepRelate = new CacBenLienQuan();
  lienHeChuDauTuList = [];
  lienHeQuanLyDuAnList = [];
  lienHeQuanLyChiPhiList = [];
  lienHeThietKeKTList = [];
  lienHeThietKeKCList = [];
  thietKeCoDien = [];
  lienHeKhacList = [];

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
      donViChuDauTu: this.dataStepRelate.chuDauTu && this.dataStepRelate.chuDauTu.donVi,
      lienHeChuDauTuList: [],
      ghiChuChuDauTu: this.dataStepRelate.chuDauTu && this.dataStepRelate.chuDauTu.ghiChu,

      donViQuanLyDuAn: this.dataStepRelate.quanLyDuAn && this.dataStepRelate.quanLyDuAn.donVi,
      lienHeQuanLyDuAnList: [],
      ghiChuQuanLyDuAn: this.dataStepRelate.quanLyDuAn && this.dataStepRelate.quanLyDuAn.ghiChu,

      donViQuanLyChiPhi: this.dataStepRelate.quanLyChiPhi && this.dataStepRelate.quanLyChiPhi.donVi,
      lienHeQuanLyChiPhiList: [],
      ghiChuQuanLyChiPhi: this.dataStepRelate.quanLyChiPhi && this.dataStepRelate.quanLyChiPhi.ghiChu,

      donViThietKeKT: this.dataStepRelate.thietKeKienTruc && this.dataStepRelate.thietKeKienTruc.donVi,
      lienHeThietKeKT: [],
      ghiChuThietKeKT: this.dataStepRelate.thietKeKienTruc && this.dataStepRelate.thietKeKienTruc.ghiChu,

      donViThietKeKC: this.dataStepRelate.thietKeKetCau && this.dataStepRelate.thietKeKetCau.donVi,
      lienHeThietKeKCList: null,
      ghiChuThietKeKC: this.dataStepRelate.thietKeKetCau && this.dataStepRelate.thietKeKetCau.ghiChu,

      donViThietKeCDList: [],
      lienHeThietKeCDList: [null],
      ghiChuThietKeCDList: [],

      donViKhac: this.dataStepRelate.thongTinKhac && this.dataStepRelate.thongTinKhac.donVi,
      lienHeKhacList: [null],
      ghiChuKhac: this.dataStepRelate.thongTinKhac && this.dataStepRelate.thongTinKhac.ghiChu,
    });
  }
  loadData() {
    this.hoSoDuThauService.watchDataLiveForm().subscribe(data => {
      const objDataStepRelate = data.cacBenLienQuan;
      if (objDataStepRelate) {
        this.dataStepRelate.chuDauTu = objDataStepRelate.chuDauTu && {
          donVi: objDataStepRelate.chuDauTu.donVi,
          lienHe: objDataStepRelate.chuDauTu.lienHe,
          ghiChu: objDataStepRelate.chuDauTu.ghiChu
        };
        this.lienHeChuDauTuList = this.dataStepRelate.chuDauTu && this.dataStepRelate.chuDauTu.lienHe;

        this.dataStepRelate.quanLyDuAn = objDataStepRelate.quanLyDuAn && {
          donVi: objDataStepRelate.quanLyDuAn.donVi,
          lienHe: objDataStepRelate.quanLyDuAn.lienHe,
          ghiChu: objDataStepRelate.quanLyDuAn.ghiChu
        };
        this.lienHeQuanLyDuAnList = this.dataStepRelate.quanLyDuAn && this.dataStepRelate.quanLyDuAn.lienHe;

        this.dataStepRelate.quanLyChiPhi = objDataStepRelate.quanLyChiPhi && {
          donVi: objDataStepRelate.quanLyChiPhi.donVi,
          lienHe: objDataStepRelate.quanLyChiPhi.lienHe,
          ghiChu: objDataStepRelate.quanLyChiPhi.ghiChu
        };
        this.lienHeQuanLyChiPhiList = this.dataStepRelate.quanLyChiPhi && this.dataStepRelate.quanLyChiPhi.lienHe;

        this.dataStepRelate.thietKeKienTruc = objDataStepRelate.thietKeKienTruc && {
          donVi: objDataStepRelate.thietKeKienTruc.donVi,
          lienHe: objDataStepRelate.thietKeKienTruc.lienHe,
          ghiChu: objDataStepRelate.thietKeKienTruc.ghiChu
        };
        this.lienHeThietKeKTList = this.dataStepRelate.thietKeKienTruc && this.dataStepRelate.thietKeKienTruc.lienHe;

        this.dataStepRelate.thietKeKetCau = objDataStepRelate.thietKeKetCau && {
          donVi: objDataStepRelate.thietKeKetCau.donVi,
          lienHe: objDataStepRelate.thietKeKetCau.lienHe,
          ghiChu: objDataStepRelate.thietKeKetCau.ghiChu
        };
        this.lienHeThietKeKCList = this.dataStepRelate.thietKeKetCau && this.dataStepRelate.thietKeKetCau.lienHe;

        this.dataStepRelate.thietKeCoDien = objDataStepRelate.thietKeCoDien;
        this.thietKeCoDien = this.dataStepRelate && this.dataStepRelate.thietKeCoDien;

        this.dataStepRelate.thongTinKhac = objDataStepRelate.thongTinKhac && {
          donVi: objDataStepRelate.thongTinKhac.donVi,
          lienHe: objDataStepRelate.thongTinKhac.lienHe,
          ghiChu: objDataStepRelate.thongTinKhac.ghiChu
        };
        this.lienHeKhacList = objDataStepRelate.thongTinKhac && objDataStepRelate.thongTinKhac.lienHe;
      }
    });
  }


}
