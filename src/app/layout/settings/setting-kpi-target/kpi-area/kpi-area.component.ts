import { Component, OnInit, HostListener } from '@angular/core';
import { SettingService } from '../../../../shared/services/setting.service';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationListItem } from '../../../../shared/models/setting/location-list-item';
import { AlertService } from '../../../../shared/services';
import { empty } from 'rxjs/Observer';
@Component({
  selector: 'app-kpi-area',
  templateUrl: './kpi-area.component.html',
  styleUrls: ['./kpi-area.component.scss']
})
export class KpiAreaComponent implements OnInit {
  kpiLocation: FormGroup;
  yearkpi: number;
  paramYear: number;
  paramAction: string;
  currentYear = (new Date()).getFullYear();
  listLocation: LocationListItem[];
  get locationFA(): FormArray {
    return this.kpiLocation.get('location') as FormArray;
  }
  isSubmitCreate = false;
  listYearConfigured: number[];
  listYearNotConfigred: number[] = [];
  yearBackTemp: number;
  widthReport: number;
  constructor(
    private settingService: SettingService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
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
    this.settingService.listYearConfigToKpiArea().subscribe(reponseListYear => {
      this.listYearConfigured = reponseListYear;
      this.listYearConfigured.sort();
      // list not configred
      for (let i = this.currentYear; this.listYearNotConfigred.length < 5; i++) {
        if (!this.listYearConfigured.includes(i)) {
          this.listYearNotConfigred.push(i);
        }
      }
      this.listYearNotConfigred.sort();
    });
    this.settingService.getDetailKpiLocationToYear(this.yearkpi).subscribe(responseToYear => {
      if (responseToYear) {
        const listLocation = this.handlData(responseToYear);
        this.createForm(listLocation);
      }
      if (!responseToYear) {
        this.settingService.readLocation('', 0, 1000).subscribe(response => {
          this.listLocation = response.items;
          this.createForm(response.items);
        });
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.widthReport = document.getElementById('wrapper-report-child').offsetWidth;
    if (this.widthReport <= 730) {
      document.getElementById('year').classList.remove('col-md-3');
      document.getElementById('target').classList.remove('col-md-9');
      // document.getElementById('action').classList.remove('col-md-4');
      document.getElementById('year').classList.add('col-md-4');
      document.getElementById('target').classList.add('col-md-8', 'pr-0');
      // document.getElementById('action').classList.add('col-md-5');
    }
    if (!(this.widthReport <= 730)) {
      document.getElementById('year').classList.remove('col-md-4');
      document.getElementById('target').classList.remove('col-md-8', 'pr-0');
      // document.getElementById('action').classList.remove('col-md-5');
      document.getElementById('year').classList.add('col-md-3');
      document.getElementById('target').classList.add('col-md-9');
      // document.getElementById('action').classList.add('col-md-4');
    }
  }

  handlData(responseToYear): any {
    let listLocation = (responseToYear.curYearTarget || []).map(itemCurYearTarget => {
      if (itemCurYearTarget.location) {
        itemCurYearTarget.location['curYearTarget'] = itemCurYearTarget.amount;
      }
      return itemCurYearTarget.location;
    });
    listLocation = listLocation.filter(item => item);
    listLocation.forEach(itemCurYearTarget => {
      const itemFind = responseToYear.preYearTarget.find(itemPreYearTarget =>
        (itemPreYearTarget.location && itemPreYearTarget.location.id) === (itemCurYearTarget && itemCurYearTarget.id));
      if (itemFind && itemCurYearTarget) {
        itemCurYearTarget['preYearTarget'] = itemFind.amount;
      }
    });
    return listLocation;
  }

  createForm(listLocation) {
    this.kpiLocation = this.fb.group({
      location: this.fb.array([]),
      targetTotal: null,
    });
    let totalTarget = 0;
    (listLocation || []).forEach(itemLocation => {
      totalTarget = totalTarget + (itemLocation && itemLocation.curYearTarget ? itemLocation.curYearTarget : 0);
      const formArrayItem = this.fb.group({
        locationId: {
          value: itemLocation && itemLocation.id,
          disabled: false,
        },
        locationName: {
          value: itemLocation && itemLocation.locationName,
          disabled: false,
        },
        preYearTarget: {
          value: itemLocation && itemLocation.preYearTarget,
          disabled: false,
        },
        curYearTarget: {
          value: itemLocation && itemLocation.curYearTarget,
          disabled: false,
        },
      });
      (this.locationFA as FormArray).push(formArrayItem);
    });
    this.kpiLocation.get('targetTotal').patchValue(totalTarget);
  }

  calculTargetTotal() {
    let targetTotal = 0;
    (this.locationFA.value || []).forEach(itemLocationForm => {
      targetTotal = targetTotal + (+itemLocationForm.curYearTarget);
    });
    this.kpiLocation.get('targetTotal').patchValue(targetTotal);
  }

  changeYearTargetFuc() {
    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: { action: this.paramAction, year: this.yearkpi },
      });
    if (this.paramAction === 'view' || this.paramAction === 'edit') {
      this.settingService.getDetailKpiLocationToYear(this.yearkpi).subscribe(responseToYear => {
        if (this.kpiLocation.get('location')) {
          this.kpiLocation.removeControl('location');
        }
        this.kpiLocation.addControl('location', this.fb.array([]));
        if (this.kpiLocation.get('targetTotal')) {
          this.kpiLocation.removeControl('targetTotal');
        }
        this.kpiLocation.addControl('targetTotal', this.fb.control(null));
        if (responseToYear) {
          const listLocation = this.handlData(responseToYear);
          this.createForm(listLocation);
        }
        if (!responseToYear) {
          return this.settingService.readLocation('', 0, 1000).subscribe(response => {
            this.listLocation = response.items;
            this.createForm(response.items);
          });
        }
      });
    }
    if (this.paramAction === 'create') {
      this.settingService.getDetailKpiLocationToYear(this.yearkpi).subscribe(responseToYear => {
        if (responseToYear && responseToYear.preYearTarget) {
          const listLocationPreYear = (responseToYear.preYearTarget || []).map(itemPreYearTarget => {
            if (itemPreYearTarget.location) {
              itemPreYearTarget.location['preYearTarget'] = itemPreYearTarget.amount;
            }
            return itemPreYearTarget.location;
          });
          this.locationFA.value.forEach((itemForm, index) => {
            const itemFind = listLocationPreYear.find(itemPer => itemPer.id === itemForm.locationId);
            this.locationFA.controls[index].get('preYearTarget').patchValue(
              itemFind && itemFind['preYearTarget'] ? itemFind['preYearTarget'] : 0);
          });
        }
      });
    }
  }

  editkpiArea() {
    this.yearBackTemp = this.yearkpi;
  }

  createOrEditKpiLocation() {
    this.isSubmitCreate = true;
    if (this.yearkpi) {
      this.settingService.createOrEditKpiLocation(this.yearkpi, this.kpiLocation.get('location').value).subscribe(response => {
        if (this.paramAction === 'create') {
          this.router.navigate(
            [],
            {
              relativeTo: this.activatedRoute,
              queryParams: { action: 'view', year: this.yearkpi },
            });
          this.alertService.success('Tạo mới chỉ tiêu khu vực thành công');
          this.listYearConfigured.push(+this.yearkpi);
          this.listYearConfigured.sort();
          this.listYearNotConfigred = [];
          for (let i = this.currentYear; this.listYearNotConfigred.length < 5; i++) {
            if (!this.listYearConfigured.includes(i)) {
              this.listYearNotConfigred.push(i);
            }
          }
          this.listYearNotConfigred.sort();
        }
        if (this.paramAction === 'edit') {
          this.router.navigate(
            [],
            {
              relativeTo: this.activatedRoute,
              queryParams: { action: 'view', year: this.yearkpi },
            });
          this.alertService.success('Chỉnh sửa chỉ tiêu khu vực thành công');
        }
        this.isSubmitCreate = false;
      }, err => {
        if (this.paramAction === 'create') {
          this.alertService.error('Đã xảy lỗi. Tạo mới chỉ tiêu khu vực không thành công.');
        }
        if (this.paramAction === 'edit') {
          this.alertService.error('Đã xảy lỗi. Chỉnh sửa chỉ tiêu khu vực không thành công.');
        }
        this.isSubmitCreate = false;
      });
    }
  }

  createKpiArea() {
    this.yearBackTemp = this.yearkpi;
    this.yearkpi = null;
    if (this.listLocation) {
      this.createNewForm(this.listLocation);
    }
    if (!this.listLocation) {
      this.settingService.readLocation('', 0, 1000).subscribe(response => {
        this.createNewForm(response.items);
      });
    }
  }
  createNewForm(listLocation) {
    this.kpiLocation.removeControl('location');
    this.kpiLocation.addControl('location', this.fb.array([]));
    (listLocation || []).forEach(itemLocation => {
      const formArrayItem = this.fb.group({
        locationId: {
          value: itemLocation && itemLocation.id,
          disabled: false,
        },
        locationName: {
          value: itemLocation && itemLocation.locationName,
          disabled: false,
        },
        preYearTarget: {
          value: 0,
          disabled: false,
        },
        curYearTarget: {
          value: 0,
          disabled: false,
        },
      });
      (this.locationFA as FormArray).push(formArrayItem);
    });
    this.kpiLocation.get('targetTotal').patchValue(0);
  }


  cancel() {
    if (this.paramAction === 'create' || this.paramAction === 'edit') {
      this.yearkpi = this.yearBackTemp ? this.yearBackTemp : this.currentYear;
      this.settingService.getDetailKpiLocationToYear(this.yearkpi).subscribe(responseToYear => {
        this.kpiLocation.removeControl('location');
        this.kpiLocation.addControl('location', this.fb.array([]));
        this.kpiLocation.removeControl('targetTotal');
        this.kpiLocation.addControl('targetTotal', this.fb.control(null));
        if (responseToYear) {
          const listLocation = this.handlData(responseToYear);
          this.createForm(listLocation);
        }
        if (!responseToYear) {
          return this.settingService.readLocation('', 0, 1000).subscribe(response => {
            this.listLocation = response.items;
            this.createForm(response.items);
          });
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
