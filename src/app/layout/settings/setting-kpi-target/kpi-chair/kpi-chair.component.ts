import { Component, OnInit, TemplateRef, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Route, ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { SettingService } from '../../../../shared/services/setting.service';
import { GroupKPIList } from '../../../../shared/models/setting/targets-kpi/group-kpi/group-kpi-list.model';
import { PackageService } from '../../../../shared/services/package.service';
import { GroupChaired } from '../../../../shared/models/package/group-chaired.model';
import { AlertService } from '../../../../shared/services';
import { ChairToYear } from '../../../../shared/models/setting/targets-kpi/to-chair/chair-to-year.model';
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
  yearBackTemp: string | number;
  listGroupkpi: GroupKPIList[];
  listChairEmployee: GroupChaired[];
  GroupNameAddChair = new GroupKPIList();
  get groupKpiChairFA(): FormArray {
    return this.groupKpiChairsArray.get('groupKpiChair') as FormArray;
  }
  get targetTotalFC() {
    return this.groupKpiChairsArray.get('targetTotal').value;
  }
  get isEdit() {
    if (this.currentYear - +this.yearkpi <= 0) {
      return true;
    } else {
      return false;
    }
  }
  get arrayGroupChoosed() {
    if (this.groupKpiChairsArray && this.groupKpiChairFA) {
      return this.groupKpiChairFA.value.map(itemGroup => itemGroup.groupName && itemGroup.groupName.id);
    } else {
      return [];
    }
  }
  currentYear = (new Date()).getFullYear();
  listChairEmployeeCanChoosedTemp = [];
  selectChairEmployeeCanChoosedTemp: any;
  listChairEmployeeChoosedTemp = [];
  selectChairEmployeeChoosedTemp: any;
  listYearConfigured: number[];
  listYearNotConfigred: number[] = [];
  isSubmitCreate = false;
  isValidateGroup = false;
  loadingListChairEmployeeCanChoosedTemp = false;
  widthReport: number;
  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private modalService: BsModalService,
    private router: Router,
    private settingService: SettingService,
    private packageService: PackageService,
    private alertService: AlertService
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
    this.settingService.listYearConfigToChair().subscribe(reponseListYear => {
      this.listYearConfigured = reponseListYear;
      // list not configred
      for (let i = this.currentYear; this.listYearNotConfigred.length < 5; i++) {
        if (!this.listYearConfigured.includes(i)) {
          this.listYearNotConfigred.push(i);
        }
      }
    });
    this.getListChairToYearFuc(+this.yearkpi);
    this.getListGroupkpi();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.widthReport = document.getElementById('wrapper-report-child').offsetWidth;
    if (this.widthReport <= 730) {
      document.getElementById('year').classList.remove('col-md-3');
      document.getElementById('target').classList.remove('col-md-5');
      document.getElementById('action').classList.remove('col-md-4');
      document.getElementById('year').classList.add('col-md-4');
      document.getElementById('target').classList.add('col-md-3', 'pr-0');
      document.getElementById('action').classList.add('col-md-5');
    }
    if (!(this.widthReport <= 730)) {
      document.getElementById('year').classList.remove('col-md-4');
      document.getElementById('target').classList.remove('col-md-3', 'pr-0');
      document.getElementById('action').classList.remove('col-md-5');
      document.getElementById('year').classList.add('col-md-3');
      document.getElementById('target').classList.add('col-md-5');
      document.getElementById('action').classList.add('col-md-4');
    }
  }

  getListChairToYearFuc(year: number) {
    if (this.paramAction === 'view' || this.paramAction === 'edit') {
      this.settingService.getListChairToYear(year).subscribe(response => {
        console.log('this.listYear', response);
        this.createForm(response[0]);
      });
    }
    if (this.paramAction === 'create') {
      this.yearkpi = null;
      this.createForm(null);
    }
  }

  getListGroupkpi() {
    this.settingService.getListGroupKPI('', 0, 1000).subscribe(response => {
      this.listGroupkpi = response.items;
    });
  }

  createForm(groupChairCallAPI) {
    this.groupKpiChairsArray = this.fb.group({
      groupKpiChair: this.fb.array([]),
      targetTotal: groupChairCallAPI && groupChairCallAPI.targetTotal
    });
    if (groupChairCallAPI) {
      this.setValueGroupKpiChairFormControl(groupChairCallAPI);
    }
    if (this.groupKpiChairFA.controls.length === 0) {
      const formArrayItem = this.fb.group({
        groupName: {
          value: null,
          disabled: false,
        },
        chairEmployees: this.fb.array([]),
        targetGroup: null
      });
      const formArrayControl = this.groupKpiChairFA as FormArray;
      formArrayControl.push(formArrayItem);
    }
    this.groupKpiChairsArray.valueChanges.subscribe(valueChange => {
      if (this.isSubmitCreate) {
        this.isValidateGroup = !this.groupKpiChairFA.value.some(item => item.groupName);
      }
    });
  }

  setValueGroupKpiChairFormControl(groupChairCallAPI) {
    let targetTotal = 0;
    (groupChairCallAPI.kpiGroupChairs || []).forEach(itemKpiGroupChair => {
      let targetGroup = 0;
      const formArrayItem = this.fb.group({
        groupName: {
          value: itemKpiGroupChair.kpiGroup,
          disabled: false,
        },
        chairEmployees: this.fb.array(itemKpiGroupChair.chairDetail.map(itemChairDetail => {
          targetGroup = targetGroup + itemChairDetail.kpiTarget;
          const itemFormGroup = this.fb.group({
            employee: {
              value: {
                employeeId: itemChairDetail.employee.employeeId,
                employeeName: itemChairDetail.employee.employeeName,
              },
              disabled: false,
            },
            targetskpi: {
              value: itemChairDetail.kpiTarget,
              disabled: false,
            },
          });
          return itemFormGroup;
        })),
        targetGroup: targetGroup
      });
      (this.groupKpiChairFA as FormArray).push(formArrayItem);
      targetTotal = targetTotal + targetGroup;
    });
    this.groupKpiChairsArray.get('targetTotal').patchValue(targetTotal);
  }

  addChairToGroupFuc(template: TemplateRef<any>, indexForm: number) {
    this.modalRef = this.modalService.show(template, {
      class: 'gray modal-lg'
    });
    this.GroupNameAddChair = (this.groupKpiChairFA.controls[indexForm].value
      && this.groupKpiChairFA.controls[indexForm].value.groupName) ? (this.groupKpiChairFA.controls[indexForm].value
        && this.groupKpiChairFA.controls[indexForm].value.groupName) : new GroupKPIList();
    this.GroupNameAddChair['indexForm'] = indexForm;
    this.listChairEmployeeChoosedTemp = this.groupKpiChairFA.value[indexForm].chairEmployees.map(item => {
      const itemEmployeeAndTarget = item.employee;
      itemEmployeeAndTarget['targetskpi'] = item.targetskpi;
      return itemEmployeeAndTarget;
    });

    // Các chủ trì đã chọn của các nhóm
    console.log('this.groupKpiChairsArray.get.value', this.groupKpiChairsArray.get('groupKpiChair').value);
    const arrayChairUsed = [];
    this.groupKpiChairsArray.get('groupKpiChair').value.forEach(itemGroupKpiChair => {
      itemGroupKpiChair.chairEmployees.forEach(itemChairEmployees => {
        arrayChairUsed.push(itemChairEmployees.employee.employeeId);
      });
    });
    console.log('arrayChairUsed-arrayChairUsed', arrayChairUsed);
    this.loadingListChairEmployeeCanChoosedTemp = true;
    this.packageService.searchKeyWordListGroupChaired(0, 1000, this.searchTermChairName$).subscribe(response => {
      // const arraySelectChoosedTemp = this.listChairEmployeeChoosedTemp.map(itemSelect => itemSelect.employeeId);
      this.listChairEmployeeCanChoosedTemp = response.items.filter(item => {
        return !arrayChairUsed.includes(item.employeeId);
        // !arraySelectChoosedTemp.includes(item.employeeId) &&
      });
      this.listChairEmployee = response.items;
      this.loadingListChairEmployeeCanChoosedTemp = false;
    });
  }

  closedPopup() {
    this.listChairEmployeeChoosedTemp = [];
    this.modalRef.hide();
  }

  changeYearKpiFuc() {
    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: { action: this.paramAction, year: this.yearkpi },
      });
    if (this.paramAction === 'view') {
      this.settingService.getListChairToYear(+this.yearkpi).subscribe(response => {
        if (response && (response || []).length !== 0) {
          this.groupKpiChairsArray.removeControl('groupKpiChair');
          this.groupKpiChairsArray.addControl('groupKpiChair', this.fb.array([]));
          this.setValueGroupKpiChairFormControl(response[0]);
        } else {
          this.setFormNotValue();
        }
      });
    }
  }

  setFormNotValue() {
    if (this.groupKpiChairsArray.get('groupKpiChair')) {
      this.groupKpiChairsArray.removeControl('groupKpiChair');
    }
    this.groupKpiChairsArray.addControl('groupKpiChair', this.fb.array([]));

    const formArrayItem = this.fb.group({
      groupName: {
        value: null,
        disabled: false,
      },
      chairEmployees: this.fb.array([]),
      targetGroup: 0
    });
    const formArrayControl = this.groupKpiChairFA as FormArray;
    formArrayControl.push(formArrayItem);
    this.groupKpiChairsArray.get('targetTotal').patchValue(0);
  }


  addTargetForYear() {
    this.paramAction = 'create';
    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: { action: 'create', year: null },
      });
    this.yearBackTemp = this.yearkpi;
    this.yearkpi = null;
    this.setFormNotValue();
  }

  addAllChairEmployee() {
    this.listChairEmployeeCanChoosedTemp.forEach(item => {
      this.listChairEmployeeChoosedTemp.push(item);
    });
    this.listChairEmployeeCanChoosedTemp = [];
  }

  addSelectChairEmployee() {
    if (this.selectChairEmployeeCanChoosedTemp) {
      this.selectChairEmployeeCanChoosedTemp.forEach(item => {
        this.listChairEmployeeChoosedTemp.push(item);
      });
      const arraySelectCanChooseTemp = this.selectChairEmployeeCanChoosedTemp.map(itemSelect => itemSelect.employeeId);
      this.listChairEmployeeCanChoosedTemp = this.listChairEmployeeCanChoosedTemp.filter(item => {
        return !arraySelectCanChooseTemp.includes(item.employeeId);
      });
    }
  }

  removeSelectChairEmployee() {
    if (this.selectChairEmployeeChoosedTemp) {
      this.selectChairEmployeeChoosedTemp.forEach(item => {
        this.listChairEmployeeCanChoosedTemp.push(item);
      });
      const arraySelectChoosedTemp = this.selectChairEmployeeChoosedTemp.map(itemSelect => itemSelect.employeeId);
      this.listChairEmployeeChoosedTemp = this.listChairEmployeeChoosedTemp.filter(item => {
        return !arraySelectChoosedTemp.includes(item.employeeId);
      });
    }
  }

  removeAllChairEmployee() {
    // this.listChairEmployeeCanChoosedTemp = this.listChairEmployee;
    this.listChairEmployeeChoosedTemp.forEach(item => {
      this.listChairEmployeeCanChoosedTemp.push(item);
    });
    this.listChairEmployeeChoosedTemp = [];
  }

  addGroupChairEmployeeInGroupKpi() {
    (this.groupKpiChairFA.controls[this.GroupNameAddChair['indexForm']] as FormGroup).removeControl('chairEmployees');
    (this.groupKpiChairFA.controls[this.GroupNameAddChair['indexForm']] as FormGroup).addControl('chairEmployees', this.fb.array([]));
    (this.listChairEmployeeChoosedTemp || []).forEach(item => {
      const itemFormGroup = this.fb.group({
        employee: {
          value: {
            employeeId: item.employeeId,
            employeeName: item.employeeName,
          },
          disabled: false,
        },
        targetskpi: {
          value: item.targetskpi ? item.targetskpi : 0,
          disabled: false,
        },
      });
      (this.groupKpiChairFA.controls[this.GroupNameAddChair['indexForm']].get('chairEmployees') as FormArray).push(itemFormGroup);
    });
    this.closedPopup();
  }

  saveTargetkpiToChair() {
    this.isSubmitCreate = true;
    this.isValidateGroup = !this.groupKpiChairFA.value.some(item => item.groupName);
    if (this.yearkpi && this.groupKpiChairFA && this.groupKpiChairFA.value.some(item => item.groupName)) {
      this.settingService.createOrEditGroupChairEmployee(+this.yearkpi, this.groupKpiChairsArray.value).subscribe(response => {
        switch (this.paramAction) {
          case 'create': {
            this.router.navigate(
              [],
              {
                relativeTo: this.activatedRoute,
                queryParams: { action: 'view', year: this.yearkpi },
              });
            this.alertService.success('Tạo mới KPI theo chủ trì thành công');
            break;
          }
          case 'edit': {
            this.router.navigate(
              [],
              {
                relativeTo: this.activatedRoute,
                queryParams: { action: 'view', year: this.yearkpi },
              });
            this.alertService.success('Chỉnh sửa KPI theo chủ trì thành công');
          }
        }
        this.isSubmitCreate = false;
        this.isValidateGroup = false;
      }, err => {
        if (this.paramAction === 'create') {
          this.alertService.error('Đã xảy ra lỗi. Tạo mới KPI theo chủ trì không thành công');
        }
        if (this.paramAction === 'edit') {
          this.alertService.error('Đã xảy ra lỗi. Chỉnh sửa KPI theo chủ trì không thành công');
        }
        this.isSubmitCreate = false;
        this.isValidateGroup = false;
      });
    }
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  calculTargetTotal(indexFormGroupKpiChair: number) {
    console.log(this.groupKpiChairFA.controls[indexFormGroupKpiChair].get('chairEmployees').value);
    let targetGroup = 0;
    (this.groupKpiChairFA.controls[indexFormGroupKpiChair].get('chairEmployees').value || []).forEach(item => {
      targetGroup = targetGroup + +item.targetskpi;
    });
    this.groupKpiChairFA.controls[indexFormGroupKpiChair].get('targetGroup').patchValue(targetGroup);
    let targetTotal = 0;
    (this.groupKpiChairFA.value || []).forEach(item => {
      targetTotal = targetTotal + +item.targetGroup;
    });
    this.groupKpiChairsArray.get('targetTotal').patchValue(targetTotal);
  }

  addGroupToForm() {
    const formArrayItem = this.fb.group({
      groupName: {
        value: null,
        disabled: false,
      },
      chairEmployees: this.fb.array([]),
      targetGroup: null
    });
    const formArrayControl = this.groupKpiChairFA as FormArray;
    formArrayControl.push(formArrayItem);
  }

  removeGroupToForm(indexForm: number) {
    this.groupKpiChairFA.removeAt(indexForm);
  }

  cancel() {
    if (this.paramAction === 'create') {
      this.yearkpi = this.yearBackTemp ? this.yearBackTemp : this.currentYear;
      this.settingService.getListChairToYear(+this.yearkpi).subscribe(response => {
        if (response && (response || []).length !== 0) {
          this.groupKpiChairsArray.removeControl('groupKpiChair');
          this.groupKpiChairsArray.addControl('groupKpiChair', this.fb.array([]));
          this.setValueGroupKpiChairFormControl(response[0]);
        } else {
          this.setFormNotValue();
        }
      });
    }
    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: { action: 'view', year: null },
      });
  }

}
