import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Route, ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { SettingService } from '../../../../shared/services/setting.service';
import { GroupKPIList } from '../../../../shared/models/setting/targets-kpi/group-kpi/group-kpi-list.model';
import { PackageService } from '../../../../shared/services/package.service';
import { GroupChaired } from '../../../../shared/models/package/group-chaired.model';
@Component({
  selector: 'app-kpi-chair',
  templateUrl: './kpi-chair.component.html',
  styleUrls: ['./kpi-chair.component.scss']
})
export class KpiChairComponent implements OnInit {
  groupKpiChairsArray: FormGroup;
  paramAction: string;
  paramYear: number | string;
  modalRef: BsModalRef;
  searchTermChairName$ = new BehaviorSubject<string>('');
  yearkpi: string | number;
  listGroupkpi: GroupKPIList[];
  listChairEmployee: GroupChaired[];
  GroupNameAddChair = new GroupKPIList();
  get groupKpiChairFA(): FormArray {
    return this.groupKpiChairsArray.get('groupKpiChair') as FormArray;
  }
  // get chairEmployeesFA(): FormArray {
  //   return this.groupKpiChairFA.get('chairEmployees') as FormArray;
  // }
  currentYear = (new Date()).getFullYear();
  listChairEmployeeChoosedTemp = [];
  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private modalService: BsModalService,
    private router: Router,
    private settingService: SettingService,
    private packageService: PackageService
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.paramAction = params['action'];
      this.paramYear = params['year'];
    });
    if (this.paramYear) {
      this.yearkpi = this.paramYear;
    } else {
      this.yearkpi = this.currentYear;
    }
    this.getListChairToYearFuc(+this.yearkpi);
    this.getListGroupkpi();
    this.createForm();
  }

  getListChairToYearFuc(year: number) {
    this.settingService.getListChairToYear(year).subscribe(response => {
      console.log('this.listYear', response);
    });
  }

  getListGroupkpi() {
    this.settingService.getListGroupKPI('', 0, 1000).subscribe(response => {
      console.log('this', response.items);
      this.listGroupkpi = response.items;
    });
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
        chairEmployees: this.fb.array([]),
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

  addChairToGroupFuc(template: TemplateRef<any>, indexForm: number) {
    this.modalRef = this.modalService.show(template, {
      class: 'gray modal-lg'
    });
    this.GroupNameAddChair = (this.groupKpiChairFA.controls[indexForm].value
      && this.groupKpiChairFA.controls[indexForm].value.groupName) ? (this.groupKpiChairFA.controls[indexForm].value
        && this.groupKpiChairFA.controls[indexForm].value.groupName) : new GroupKPIList();
    this.GroupNameAddChair['indexForm'] = indexForm;
    this.packageService.searchKeyWordListGroupChaired(0, 1000, this.searchTermChairName$).subscribe(response => {
      this.listChairEmployee = response.items;
    });
  }

  closedPopup() {
    this.modalRef.hide();
  }

  changeYearKpiFuc() {
    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: { action: this.paramAction, year: this.yearkpi },
      });
    this.setFormNotValue();
  }

  setFormNotValue() {
    this.groupKpiChairsArray.removeControl('groupKpiChair');
    this.groupKpiChairsArray.addControl('groupKpiChair', this.fb.array([]));

    const formArrayItem = this.fb.group({
      groupName: {
        value: null,
        disabled: false,
      },
      chairEmployees: this.fb.array([]),
    });
    const formArrayControl = this.groupKpiChairFA as FormArray;
    formArrayControl.push(formArrayItem);
  }


  addTargetForYear() {
    this.paramAction = 'create';
    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: { action: 'create', year: this.yearkpi },
      });
    this.setFormNotValue();
  }

  addAllChairEmployee() {
    this.listChairEmployeeChoosedTemp = this.listChairEmployee;
  }

  addGroupChairEmployeeInGroupKpi() {
    console.log('this.groupKpiChairFA', this.groupKpiChairFA);
    (this.listChairEmployeeChoosedTemp || []).forEach(item => {
      const itemFormGroup = this.fb.group({
        employee: {
          value: {
            idEmployee: item.employeeId,
            employeeName: item.employeeName,
          },
          disabled: false,
        },
        targetskpi: {
          value: 0,
          disabled: false,
        },
      });
      (this.groupKpiChairFA.controls[this.GroupNameAddChair['indexForm']].get('chairEmployees') as FormArray).push(itemFormGroup);
    });
    this.closedPopup();
  }

  saveTargetkpiToChair() {
    console.log('thiss.formArray', this.groupKpiChairsArray);
    this.settingService.createOrEditGroupChairEmployee(+this.yearkpi, this.groupKpiChairsArray.value).subscribe(response => {
      console.log('respsone', response);
    });
  }

}
