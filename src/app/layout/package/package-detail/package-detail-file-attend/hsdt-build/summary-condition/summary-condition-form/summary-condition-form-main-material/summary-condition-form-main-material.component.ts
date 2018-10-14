import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { SummaryConditionComponent } from '../../summary-condition.component';
import { SummaryConditionFormComponent } from '../summary-condition-form.component';
import { TenderMaterialToSupplier } from '../../../../../../../../shared/models/package/tender-material-to-supplier';
import { DictionaryItemText } from '../../../../../../../../shared/models';
import { HoSoDuThauService } from '../../../../../../../../shared/services/ho-so-du-thau.service';
import { DanhSachVatTu } from '../../../../../../../../shared/models/ho-so-du-thau/danh-sach-vat-tu';

@Component({
  selector: 'app-summary-condition-form-main-material',
  templateUrl: './summary-condition-form-main-material.component.html',
  styleUrls: ['./summary-condition-form-main-material.component.scss']
})
export class SummaryConditionFormMainMaterialComponent implements OnInit {

  mainMaterialForm: FormGroup;
  mainMaterial = new Array<DanhSachVatTu>();

  get materialsFA(): FormArray {
    return this.mainMaterialForm.get('materials') as FormArray;
  }
  constructor(
    private fb: FormBuilder,
    private hoSoDuThauService: HoSoDuThauService
  ) { }

  ngOnInit() {

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
        tenVatTu: x.tenVatTu,
        ghiChuThem: x.ghiChuThem
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
      tenVatTu: data ? data.name : '',
      ghiChuThem: data ? data.desc : ''
    });
    formArray.push(formItem);
  }

  removeFormArrayControl(name: string, idx: number) {
    const formArray = this.mainMaterialForm.get(name) as FormArray;
    formArray.removeAt(idx);
  }

}
