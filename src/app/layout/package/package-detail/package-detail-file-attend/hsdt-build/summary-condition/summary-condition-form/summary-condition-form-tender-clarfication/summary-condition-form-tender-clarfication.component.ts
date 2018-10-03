import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SummaryConditionFormComponent } from '../summary-condition-form.component';
import DateTimeConvertHelper from '../../../../../../../../shared/helpers/datetime-convert-helper';
import { DienGiaiYeuCauLamRo } from '../../../../../../../../shared/models/ho-so-du-thau/dien-giai-yeu-cau';
import { HoSoDuThauService } from '../../../../../../../../shared/services/ho-so-du-thau.service';

@Component({
  selector: 'app-summary-condition-form-tender-clarfication',
  templateUrl: './summary-condition-form-tender-clarfication.component.html',
  styleUrls: ['./summary-condition-form-tender-clarfication.component.scss']
})
export class SummaryConditionFormTenderClarficationComponent implements OnInit {

  yeuCauLamRoForm: FormGroup;
  yeuCauLamRo = new DienGiaiYeuCauLamRo();
  isModeView = false;
  constructor(
    private fb: FormBuilder,
    private hoSoDuThauService: HoSoDuThauService,
  ) { }

  ngOnInit() {
    this.loadData();
    this.createForm();

  }

  loadData() {
    this.hoSoDuThauService.watchDataLiveForm().subscribe(data => {
      const model = data.dienGiaiYeuCauLamRo;
      if (model) {
        this.yeuCauLamRo = {
          nhaTuVan: model.nhaTuVan && {
            tenCongTy: model.nhaTuVan.tenCongTy,
            diaChiCongTy: model.nhaTuVan.diaChiCongTy,
            nguoiLienHe: model.nhaTuVan.nguoiLienHe && {
              hoVaTen: model.nhaTuVan.nguoiLienHe.hoVaTen,
              diaChi: model.nhaTuVan.nguoiLienHe.diaChi,
              email: model.nhaTuVan.nguoiLienHe.email,
              viTri: model.nhaTuVan.nguoiLienHe.viTri
            }
          },
          nhaSuDung: model.nhaSuDung && {
            tenCongTy: model.nhaSuDung.tenCongTy,
            diaChiCongTy: model.nhaSuDung.diaChiCongTy,
            nguoiLienHe: model.nhaSuDung.nguoiLienHe && {
              hoVaTen: model.nhaSuDung.nguoiLienHe.hoVaTen,
              diaChi: model.nhaSuDung.nguoiLienHe.diaChi,
              email: model.nhaSuDung.nguoiLienHe.email,
              viTri: model.nhaSuDung.nguoiLienHe.viTri
            }
          },
          ngayHetHan: model.ngayHetHan,
          ghiChuThem: model.ghiChuThem
        };
      }
    });
  }

  createForm() {
    this.yeuCauLamRoForm = this.fb.group({

      consultant: this.fb.group({
        companyName: {
          value: this.yeuCauLamRo && this.yeuCauLamRo.nhaTuVan && this.yeuCauLamRo.nhaTuVan.tenCongTy,
          disabled: this.isModeView
        },
        companyAddress: {
          value: this.yeuCauLamRo && this.yeuCauLamRo.nhaTuVan && this.yeuCauLamRo.nhaTuVan.diaChiCongTy,
          disabled: this.isModeView
        },
        contactPerson: this.fb.group({
          name: {
            value: this.yeuCauLamRo && this.yeuCauLamRo.nhaTuVan && this.yeuCauLamRo.nhaTuVan.nguoiLienHe
              && this.yeuCauLamRo.nhaTuVan.nguoiLienHe.hoVaTen,
            disabled: this.isModeView
          },
          address: {
            value: this.yeuCauLamRo && this.yeuCauLamRo.nhaTuVan && this.yeuCauLamRo.nhaTuVan.nguoiLienHe
              && this.yeuCauLamRo.nhaTuVan.nguoiLienHe.diaChi,
            disabled: this.isModeView
          },
          email: {
            value: this.yeuCauLamRo && this.yeuCauLamRo.nhaTuVan && this.yeuCauLamRo.nhaTuVan.nguoiLienHe
              && this.yeuCauLamRo.nhaTuVan.nguoiLienHe.email,
            disabled: this.isModeView
          },
          level: {
            value: this.yeuCauLamRo && this.yeuCauLamRo.nhaTuVan && this.yeuCauLamRo.nhaTuVan.nguoiLienHe
              && this.yeuCauLamRo.nhaTuVan.nguoiLienHe.viTri,
            disabled: this.isModeView
          },
        })
      }),

      employer: this.fb.group({
        companyName: {
          value: this.yeuCauLamRo && this.yeuCauLamRo.nhaSuDung && this.yeuCauLamRo.nhaSuDung.tenCongTy,
          disabled: this.isModeView
        },
        companyAddress: {
          value: this.yeuCauLamRo && this.yeuCauLamRo.nhaSuDung && this.yeuCauLamRo.nhaSuDung.diaChiCongTy,
          disabled: this.isModeView
        },
        contactPerson: this.fb.group({
          name: {
            value: this.yeuCauLamRo && this.yeuCauLamRo.nhaSuDung && this.yeuCauLamRo.nhaSuDung.nguoiLienHe
              && this.yeuCauLamRo.nhaSuDung.nguoiLienHe.hoVaTen,
            disabled: this.isModeView
          },
          address: {
            value: this.yeuCauLamRo && this.yeuCauLamRo.nhaSuDung && this.yeuCauLamRo.nhaSuDung.nguoiLienHe
              && this.yeuCauLamRo.nhaSuDung.nguoiLienHe.diaChi,
            disabled: this.isModeView
          },
          email: {
            value: this.yeuCauLamRo && this.yeuCauLamRo.nhaSuDung && this.yeuCauLamRo.nhaSuDung.nguoiLienHe
              && this.yeuCauLamRo.nhaSuDung.nguoiLienHe.email,
            disabled: this.isModeView
          },
          level: {
            value: this.yeuCauLamRo && this.yeuCauLamRo.nhaSuDung && this.yeuCauLamRo.nhaSuDung.nguoiLienHe
              && this.yeuCauLamRo.nhaSuDung.nguoiLienHe.viTri,
            disabled: this.isModeView
          }
        })
      }),

      closingTime: {
        value: DateTimeConvertHelper.fromTimestampToDtObject(this.yeuCauLamRo.ngayHetHan * 1000),
        disabled: this.isModeView
      },

      note: {
        value: this.yeuCauLamRo.ghiChuThem,
        disabled: this.isModeView
      },
    });

    this.yeuCauLamRoForm.valueChanges.subscribe(data => {
      let obj = new DienGiaiYeuCauLamRo();
      obj = {
        nhaTuVan: data.consultant && {
          tenCongTy: data.consultant.companyName,
          diaChiCongTy: data.consultant.companyAddress,
          nguoiLienHe: data.consultant.contactPerson && {
            hoVaTen: data.consultant.contactPerson.name,
            diaChi: data.consultant.contactPerson.address,
            email: data.consultant.contactPerson.email,
            viTri: data.consultant.contactPerson.level
          }
        },
        nhaSuDung: data.employer && {
          tenCongTy: data.employer.companyName,
          diaChiCongTy: data.employer.companyAddress,
          nguoiLienHe: data.employer.contactPerson && {
            hoVaTen: data.employer.contactPerson.name,
            diaChi: data.employer.contactPerson.address,
            email: data.employer.contactPerson.email,
            viTri: data.employer.contactPerson.level
          }
        },
        ngayHetHan: DateTimeConvertHelper.fromDtObjectToTimestamp(data.closingTime),
        ghiChuThem: data.note
      };
      this.hoSoDuThauService.emitDataStepClarification(obj);
    });
  }

}
