import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { WorkPackage } from '../../../../../../../../shared/models/package/work-package';
import { DanhSachNhaThau } from '../../../../../../../../shared/models/ho-so-du-thau/danh-sach-nha-thau';
import { HoSoDuThauService } from '../../../../../../../../shared/services/ho-so-du-thau.service';
import { Router } from '../../../../../../../../../../node_modules/@angular/router';
import { PackageDetailComponent } from '../../../../../package-detail.component';
import { SummaryConditionFormComponent } from '../summary-condition-form.component';

@Component({
  selector: 'app-summary-condition-form-nonminated-sub-constructor',
  templateUrl: './summary-condition-form-nonminated-sub-constructor.component.html',
  styleUrls: ['./summary-condition-form-nonminated-sub-constructor.component.scss']
})
export class SummaryConditionFormNonminatedSubConstructorComponent implements OnInit {

  nonminateForm: FormGroup;
  nhaThauPhu = new Array<DanhSachNhaThau>();
  isModeView = false;
  bidOpportunityId: number;
  get packageWorkFA(): FormArray {
    return this.nonminateForm.get('packageWork') as FormArray;
  }
  constructor(
    private fb: FormBuilder,
    private hoSoDuThauService: HoSoDuThauService,
    private router: Router,
    private parent: SummaryConditionFormComponent
  ) { }

  ngOnInit() {
    this.bidOpportunityId = PackageDetailComponent.packageId;
    this.hoSoDuThauService.watchLiveformState().subscribe(data => {
      this.isModeView = data.isModeView;
    });
    this.loadData();
  }

  createForm() {
    this.nonminateForm = this.fb.group({
      packageWork: this.fb.array([])
    });

    this.nhaThauPhu.forEach(x => {
      const control = <FormArray>this.nonminateForm.controls.packageWork;
      control.push(this.fb.group({
        tenGoiCongViec: { value: x.tenGoiCongViec, disabled: this.isModeView },
        ghiChuThem: { value: x.ghiChuThem, disabled: this.isModeView },
        thanhTien: { value: x.thanhTien, disabled: this.isModeView },
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
    this.hoSoDuThauService.scrollToView(true);
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
          thanhTien: null
        });
      }
      this.createForm();
    });
  }

  addFormArrayControl(name: string, data?: WorkPackage) {
    const formArray = this.nonminateForm.get(name) as FormArray;
    const formItem = this.fb.group({
      tenGoiCongViec: { value: data ? data.name : '', disabled: this.isModeView },
      ghiChuThem: { value: data ? data.desc : '', disabled: this.isModeView },
      thanhTien: { value: data ? data.totalCost : null, disabled: this.isModeView }
    });
    formArray.push(formItem);
  }

  removeFormArrayControl(name: string, idx: number) {
    const formArray = this.nonminateForm.get(name) as FormArray;
    formArray.removeAt(idx);
  }

  routerLink(e, link) {
    if (e.code === 'Enter') {
      this.router.navigate([`/package/detail/${this.bidOpportunityId}/attend/build/summary/form/create/${link}`]);
    }
  }

  saveData() {
    this.parent.onSubmit(false, false);
  }
}
