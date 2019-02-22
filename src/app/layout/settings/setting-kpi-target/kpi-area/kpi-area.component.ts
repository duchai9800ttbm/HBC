import { Component, OnInit } from '@angular/core';
import { SettingService } from '../../../../shared/services/setting.service';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationListItem } from '../../../../shared/models/setting/location-list-item';
import { AlertService } from '../../../../shared/services';
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
    this.settingService.listYearConfigToWinBid().subscribe(reponseListYear => {
      console.log('this.reponseListYear', reponseListYear);
      this.listYearConfigured = reponseListYear;
      // list not configred
      for (let i = this.currentYear; this.listYearNotConfigred.length < 5; i++) {
        if (!this.listYearConfigured.includes(i)) {
          this.listYearNotConfigred.push(i);
        }
      }
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

  handlData(responseToYear): any {
    const listLocation = (responseToYear.curYearTarget || []).map(itemCurYearTarget => {
      itemCurYearTarget.location['curYearTarget'] = itemCurYearTarget.amount;
      return itemCurYearTarget.location;
    });
    listLocation.forEach(itemCurYearTarget => {
      const itemFind = responseToYear.preYearTarget.find(itemPreYearTarget =>
        itemPreYearTarget.location.id === itemCurYearTarget.id);
      if (itemFind) {
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
    if (this.paramAction === 'view') {
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
          this.alertService.error('Đã xảy lỗi. Tạo mới chỉ tiêu khu vực không thành công.');
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
        this.createForm(response.items);
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
    if (this.paramAction === 'create') {
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
