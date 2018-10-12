import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { SummaryConditionFormComponent } from '../summary-condition-form.component';
import { TenderNonminatedSubContractor } from '../../../../../../../../shared/models/package/tender-nonminated-sub-contractor';
import { WorkPackage } from '../../../../../../../../shared/models/package/work-package';
import { DanhSachNhaThau } from '../../../../../../../../shared/models/ho-so-du-thau/danh-sach-nha-thau';
import { HoSoDuThauService } from '../../../../../../../../shared/services/ho-so-du-thau.service';

@Component({
  selector: 'app-summary-condition-form-nonminated-sub-constructor',
  templateUrl: './summary-condition-form-nonminated-sub-constructor.component.html',
  styleUrls: ['./summary-condition-form-nonminated-sub-constructor.component.scss']
})
export class SummaryConditionFormNonminatedSubConstructorComponent implements OnInit {

  nonminateForm: FormGroup;
  nhaThauPhu = new Array<DanhSachNhaThau>();
  get packageWorkFA(): FormArray {
    return this.nonminateForm.get('packageWork') as FormArray;
  }
  constructor(
    private fb: FormBuilder,
    private hoSoDuThauService: HoSoDuThauService
  ) { }

  ngOnInit() {
    this.loadData();
  }


  createForm() {
    this.nonminateForm = this.fb.group({
      packageWork: this.fb.array([])
    });

    this.nhaThauPhu.forEach(x => {
      const control = <FormArray>this.nonminateForm.controls.packageWork;
      control.push(this.fb.group({
        tenGoiCongViec: x.tenGoiCongViec,
        ghiChuThem: x.ghiChuThem,
        thanhTien: x.thanhTien,
      }));
    });

    this.nonminateForm.valueChanges.subscribe(data => {
      let obj = new Array<DanhSachNhaThau>();
      obj = data.packageWork.map(x => ({
        tenGoiCongViec: x.tenGoiCongViec,
        ghiChuThem: x.ghiChuThem,
        thanhTien: x.thanhTien
      }));

      this.hoSoDuThauService.emitDataStepSubContractor(obj);
    });

  }

  loadData() {
    this.hoSoDuThauService.watchDataLiveForm().subscribe(data => {
      const obj = data.danhSachNhaThau;
      if (obj && obj.length > 0) {
        this.nhaThauPhu = obj;
      } else {
        this.nhaThauPhu = [];
        this.nhaThauPhu.push({
          tenGoiCongViec: '',
          ghiChuThem: '',
          thanhTien: 0
        });
      }
      this.createForm();
    });
  }

  addFormArrayControl(name: string, data?: WorkPackage) {
    const formArray = this.nonminateForm.get(name) as FormArray;
    const formItem = this.fb.group({
      tenGoiCongViec: data ? data.name : '',
      ghiChuThem: data ? data.desc : '',
      thanhTien: data ? data.totalCost : 0
    });
    formArray.push(formItem);
  }

  removeFormArrayControl(name: string, idx: number) {
    const formArray = this.nonminateForm.get(name) as FormArray;
    formArray.removeAt(idx);
  }

}
