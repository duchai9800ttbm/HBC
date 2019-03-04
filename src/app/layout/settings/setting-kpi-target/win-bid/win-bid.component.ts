import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingService } from '../../../../shared/services/setting.service';
import { AlertService } from '../../../../shared/services';

@Component({
  selector: 'app-win-bid',
  templateUrl: './win-bid.component.html',
  styleUrls: ['./win-bid.component.scss']
})
export class WinBidComponent implements OnInit {
  targetWinBid: FormGroup;
  paramAction: string;
  paramYear: number;
  currentYear = (new Date()).getFullYear();
  yearkpi: number | string;
  isSubmitCreate = false;
  listYearConfigured: number[];
  listYearNotConfigred: number[] = [];
  yearBackTemp: string | number;
  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private settingService: SettingService,
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
    if (this.paramAction === 'create') {
      this.yearkpi = null;
    }
    this.settingService.listYearConfigToWinBid().subscribe(reponseListYear => {
      this.listYearConfigured = (reponseListYear || []).filter(item => item.isConfigured === true).map(i => i.year);
      // list not configred
      this.listYearNotConfigred = (reponseListYear || []).filter(item => item.isConfigured === false).map(i => i.year);
    });
    this.settingService.getDetailTargetWinBidToYear(+this.yearkpi).subscribe(response => {
      this.createForm(response);
    });
  }

  getDetailTargetWinBidToYear() {
    this.settingService.getDetailTargetWinBidToYear(+this.yearkpi).subscribe(response => {
    });
  }

  createForm(dataTargetWinBid) {
    this.targetWinBid = this.fb.group({
      id: dataTargetWinBid && dataTargetWinBid.id,
      total: [dataTargetWinBid && dataTargetWinBid.total],
      percent: [dataTargetWinBid && dataTargetWinBid.percent, [Validators.max(100), Validators.min(0)]],
      totalTarget: [dataTargetWinBid && dataTargetWinBid.totalTarget]
    });
  }

  changeYearTargetFuc() {
    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: { action: this.paramAction, year: this.yearkpi },
      });
    if (this.paramAction === 'view' || this.paramAction === 'edit' || this.paramAction === 'create') {
      this.settingService.getDetailTargetWinBidToYear(+this.yearkpi).subscribe(response => {
        if (this.targetWinBid.get('id')) {
          this.targetWinBid.removeControl('id');
        }
        this.targetWinBid.addControl('id', this.fb.control(response.id));
        if (this.targetWinBid.get('total')) {
          this.targetWinBid.removeControl('total');
        }
        this.targetWinBid.addControl('total', this.fb.control(response.total));
        if (this.targetWinBid.get('percent')) {
          this.targetWinBid.removeControl('percent');
        }
        this.targetWinBid.addControl('percent', this.fb.control(response.percent));
        if (this.targetWinBid.get('totalTarget')) {
          this.targetWinBid.removeControl('totalTarget');
        }
        this.targetWinBid.addControl('totalTarget', this.fb.control(response.totalTarget));
      });
    }
  }

  addTargetForYear() {
    this.yearBackTemp = this.yearkpi;
    this.yearkpi = null;
    this.removeForm();
  }

  removeForm() {
    this.targetWinBid.removeControl('id');
    this.targetWinBid.removeControl('total');
    this.targetWinBid.removeControl('percent');
    this.targetWinBid.removeControl('totalTarget');
  }

  calculValueReach() {
    const valueReach = this.targetWinBid.get('total').value * this.targetWinBid.get('percent').value / 100;
    this.targetWinBid.get('totalTarget').patchValue(valueReach);
  }

  calculPercent() {
    const percent = this.targetWinBid.get('totalTarget').value * 100 / this.targetWinBid.get('total').value;
    this.targetWinBid.get('percent').patchValue(percent);
  }

  createOrEditTargetWinBid() {
    this.isSubmitCreate = true;
    if (this.yearkpi) {
      this.settingService.editTargetWinBidToYear(this.targetWinBid.value).subscribe(response => {
        if (this.paramAction === 'create') {
          this.router.navigate(
            [],
            {
              relativeTo: this.activatedRoute,
              queryParams: { action: 'view', year: this.yearkpi },
            });
          this.alertService.success('Tạo mới chỉ tiêu trúng thầu thành công.');
          this.listYearConfigured.push(+this.yearkpi);
          this.listYearNotConfigred = [];
          for (let i = this.currentYear; this.listYearNotConfigred.length < 5; i++) {
            if (!this.listYearConfigured.includes(i)) {
              this.listYearNotConfigred.push(i);
            }
          }
        }
        if (this.paramAction === 'edit') {
          this.router.navigate(
            [],
            {
              relativeTo: this.activatedRoute,
              queryParams: { action: 'view', year: this.yearkpi },
            });
          this.alertService.success('Chỉnh sửa chỉ tiêu trúng thầu thành công.');
        }
        this.isSubmitCreate = false;
      }, err => {
        if (this.paramAction === 'create') {
          this.alertService.error('Tạo mới chỉ tiêu trúng thầu không thành công.');
        }
        if (this.paramAction === 'edit') {
          this.alertService.error('Chỉnh sửa chỉ tiêu trúng thầu không thành công.');
        }
        this.isSubmitCreate = false;
      });
    }
  }

  cancel() {
    if (this.paramAction === 'create') {
      this.yearkpi = this.yearBackTemp ? this.yearBackTemp : this.currentYear;
      this.settingService.getDetailTargetWinBidToYear(+this.yearkpi).subscribe(response => {
        this.targetWinBid.removeControl('id');
        this.targetWinBid.addControl('id', this.fb.control(response.id));
        this.targetWinBid.removeControl('total');
        this.targetWinBid.addControl('total', this.fb.control(response.total));
        this.targetWinBid.removeControl('percent');
        this.targetWinBid.addControl('percent', this.fb.control(response.percent));
        this.targetWinBid.removeControl('totalTarget');
        this.targetWinBid.addControl('totalTarget', this.fb.control(response.totalTarget));
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
