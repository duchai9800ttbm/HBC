import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { SummaryConditionComponent } from '../../summary-condition.component';
import { SummaryConditionFormComponent } from '../summary-condition-form.component';
import { TenderMaterialToSupplier } from '../../../../../../../../shared/models/package/tender-material-to-supplier';
import { DictionaryItemText } from '../../../../../../../../shared/models';
import { HoSoDuThauService } from '../../../../../../../../shared/services/ho-so-du-thau.service';
import { DanhSachVatTu } from '../../../../../../../../shared/models/ho-so-du-thau/danh-sach-vat-tu';
import { Router } from '../../../../../../../../../../node_modules/@angular/router';
import { PackageDetailComponent } from '../../../../../package-detail.component';

@Component({
  selector: 'app-summary-condition-form-main-material',
  templateUrl: './summary-condition-form-main-material.component.html',
  styleUrls: ['./summary-condition-form-main-material.component.scss']
})
export class SummaryConditionFormMainMaterialComponent implements OnInit {

  mainMaterialForm: FormGroup;
  mainMaterial = new Array<DanhSachVatTu>();
  isModeView = false;
  bidOpportunityId: number;
  get materialsFA(): FormArray {
    return this.mainMaterialForm.get('materials') as FormArray;
  }
  constructor(
    private fb: FormBuilder,
    private hoSoDuThauService: HoSoDuThauService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.bidOpportunityId = PackageDetailComponent.packageId;
    this.hoSoDuThauService.watchLiveformState().subscribe(data => {
      this.isModeView = data.isModeView;
    });
    this.loadData();
    this.createForm();
  }

  createForm() {
    this.mainMaterialForm = this.fb.group({
      materials: this.fb.array([])
    });

    this.mainMaterial.forEach(x => {
      const control = <FormArray>this.mainMaterialForm.controls.materials;
      control.push(this.fb.group({
        tenVatTu: {
          value: x.tenVatTu,
          disabled: this.isModeView
        },
        ghiChuThem: { value: x.ghiChuThem, disabled: this.isModeView }
      }));
    });

    this.mainMaterialForm.valueChanges.subscribe(data => {
      let obj = new Array<DanhSachVatTu>();
      obj = (data.materials || []).map(x => ({
        tenVatTu: x.tenVatTu,
        ghiChuThem: x.ghiChuThem
      }));
      this.hoSoDuThauService.emitDataStepMainMaterial(obj);
    });
  }

  loadData() {
    this.hoSoDuThauService.watchDataLiveForm().subscribe(data => {
      const mainMaterial = data.danhSachVatTu;
      if (mainMaterial && mainMaterial.length > 0) {
        this.mainMaterial = mainMaterial;
      } else {
        this.mainMaterial = [];
        this.mainMaterial.push({
          tenVatTu: '',
          ghiChuThem: ''
        });
      }
    });
  }


  addFormArrayControl(name: string, data?: DictionaryItemText) {
    const formArray = this.mainMaterialForm.get(name) as FormArray;
    const formItem = this.fb.group({
      tenVatTu: { value: data ? data.name : '', disabled: this.isModeView },
      ghiChuThem: { value: data ? data.desc : '', disabled: this.isModeView }
    });
    formArray.push(formItem);
  }

  removeFormArrayControl(name: string, idx: number) {
    const formArray = this.mainMaterialForm.get(name) as FormArray;
    formArray.removeAt(idx);
  }

  routerLink(e, link) {
    if (e.code === 'Enter') {
      this.router.navigate([`/package/detail/${this.bidOpportunityId}/attend/build/summary/form/create/${link}`]);
    }
  }
}
