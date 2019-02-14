import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Route, ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { BehaviorSubject } from 'rxjs';
@Component({
  selector: 'app-kpi-chair',
  templateUrl: './kpi-chair.component.html',
  styleUrls: ['./kpi-chair.component.scss']
})
export class KpiChairComponent implements OnInit {
  groupKpiChairsArray: FormGroup;
  param: string;
  modalRef: BsModalRef;
  searchTerm$ = new BehaviorSubject<string>('');
  yearkpi: string | number;
  get groupKpiChairFA(): FormArray {
    return this.groupKpiChairsArray.get('groupKpiChair') as FormArray;
  }
  get chairEmployeesFA(): FormArray {
    return this.groupKpiChairFA.get('chairEmployees') as FormArray;
  }
  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private modalService: BsModalService,
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.param = params['action'];
    });
    this.createForm();
    console.log('this.groupKpiChairsArray', this.groupKpiChairsArray);
  }

  createForm() {
    this.groupKpiChairsArray = this.fb.group({
      groupKpiChair: this.fb.array([])
    });
    // this.groupConfigForm.valueChanges
    //   .subscribe(data => this.onFormValueChanged(data));
    if (this.groupKpiChairFA.controls.length === 0) {
      const formArrayItem = this.fb.group({
        groupName: {
          value: null,
          disabled: false,
        },
        chairEmployees: {
          value: this.fb.array([]),
          disabled: false,
        },
      });
      const formArrayControl = this.groupKpiChairFA as FormArray;
      // formArrayItem.addControl('stateProvinceID', this.fb.control(null));
      // formArrayItem.addControl('districtID', this.fb.control(null));
      // formArrayItem.addControl('communeID', this.fb.control(null));
      // formArrayItem.addControl('districts', this.fb.control([]));
      // formArrayItem.addControl('communes', this.fb.control([]));
      formArrayControl.push(formArrayItem);


      // const control = <FormArray>this.nonminateForm.controls.packageWork;
      // control.push(this.fb.group({
      //   tenGoiCongViec: { value: x.tenGoiCongViec, disabled: this.isModeView },
      //   ghiChuThem: { value: x.ghiChuThem, disabled: this.isModeView },
      //   thanhTien: { value: x.thanhTien, disabled: this.isModeView },
      // }));

    }
  }

  addChairToGroupFuc(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {
      class: 'gray modal-lg'
    });
  }

  closedPopup() {
    this.modalRef.hide();
  }

  changeYearKpiFuc() {
    this.groupKpiChairsArray.removeControl('groupKpiChair');
    this.groupKpiChairsArray.addControl('groupKpiChair', this.fb.array([]));

    const formArrayItem = this.fb.group({
      groupName: {
        value: 'Tender HCM',
        disabled: false,
      },
      chairEmployees: {
        value: this.fb.array([]),
        disabled: false,
      },
    });
    const formArrayControl = this.groupKpiChairFA as FormArray;
    formArrayControl.push(formArrayItem);

  }

}
