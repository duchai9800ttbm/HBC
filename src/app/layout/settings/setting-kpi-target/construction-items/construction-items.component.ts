import { Component, OnInit, HostListener } from '@angular/core';
import { SettingService } from '../../../../shared/services/setting.service';
import { FormControl, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService, AlertService } from '../../../../shared/services';
import { Observable } from 'rxjs';
import { DictionaryItem } from '../../../../shared/models';

@Component({
  selector: 'app-construction-items',
  templateUrl: './construction-items.component.html',
  styleUrls: ['./construction-items.component.scss']
})
export class ConstructionItemsComponent implements OnInit {
  constructionCategoryForm: FormGroup;
  paramYear: number;
  paramAction: string;
  listMainBuildingCategory: DictionaryItem[];
  yearkpi: number;
  currentYear = (new Date()).getFullYear();
  get mainBuildFA(): FormArray {
    return this.constructionCategoryForm.get('mainBuild') as FormArray;
  }
  isSubmitCreate = false;
  listYearConfigured: number[];
  listYearNotConfigred: number[] = [];
  yearBackTemp: number;
  widthReport: number;
  constructor(
    private fb: FormBuilder,
    private settingService: SettingService,
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
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
    this.settingService.listYearConfigToKpiConstructionCategory().subscribe(reponseListYear => {
      this.listYearConfigured = reponseListYear;
      // list not configred
      for (let i = this.currentYear; this.listYearNotConfigred.length < 5; i++) {
        if (!this.listYearConfigured.includes(i)) {
          this.listYearNotConfigred.push(i);
        }
      }
    });
    this.settingService.getDetailConstructionCategory(this.yearkpi).subscribe(responseToYear => {
      if (responseToYear && (responseToYear || []).length !== 0) {
        this.createForm(responseToYear);
      }
      if (!(responseToYear && (responseToYear || []).length !== 0)) {
        this.dataService.getListMainConstructionComponents().subscribe(listMainBuildingCategory => {
          this.listMainBuildingCategory = listMainBuildingCategory;
          this.createForm(listMainBuildingCategory);
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

  createForm(listMainBuildingCategory: any) {
    this.constructionCategoryForm = this.fb.group({
      mainBuild: this.fb.array([]),
      targetTotal: null,
    });
    let totalTarget = 0;
    (listMainBuildingCategory || []).forEach(itemMainBuild => {
      totalTarget = totalTarget + (itemMainBuild.totalTarget ? itemMainBuild.totalTarget : 0);
      const formArrayItem = this.fb.group({
        constructionTypeId: itemMainBuild.constructionCategory ? itemMainBuild.constructionCategory.id : itemMainBuild.id,
        constructionTypeName: itemMainBuild.text ||
          (itemMainBuild.constructionCategory && itemMainBuild.constructionCategory.constructionCategoryName),
        total: itemMainBuild.total,
        percent: itemMainBuild.percent,
        totalTarget: itemMainBuild.totalTarget,
      });
      (this.constructionCategoryForm.get('mainBuild') as FormArray).push(formArrayItem);
    });
    this.constructionCategoryForm.get('targetTotal').patchValue(totalTarget);
  }

  changeYearTargetFuc() {
    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: { action: this.paramAction, year: this.yearkpi },
      });
    if (this.paramAction === 'view' || this.paramAction === 'edit') {
      this.settingService.getDetailConstructionCategory(this.yearkpi).subscribe(responseToYear => {
        if (this.constructionCategoryForm.get('mainBuild')) {
          this.constructionCategoryForm.removeControl('mainBuild');
        }
        this.constructionCategoryForm.addControl('mainBuild', this.fb.array([]));
        if (this.constructionCategoryForm.get('targetTotal')) {
          this.constructionCategoryForm.removeControl('targetTotal');
        }
        this.constructionCategoryForm.addControl('targetTotal', this.fb.control(null));
        if (responseToYear && (responseToYear || []).length !== 0) {
          this.createForm(responseToYear);
        }
        if (!(responseToYear && (responseToYear || []).length !== 0)) {
          this.settingService.readLocation('', 0, 1000).subscribe(response => {
            this.dataService.getListMainConstructionComponents().subscribe(listMainBuildingCategory => {
              this.listMainBuildingCategory = listMainBuildingCategory;
              this.createForm(listMainBuildingCategory);
            });
          });
        }
      });
    }
  }

  createOrEditConstructionCategory() {
    this.isSubmitCreate = true;
    if (this.yearkpi) {
      this.settingService.createOrEditConstructionCategory(this.yearkpi, this.constructionCategoryForm.get('mainBuild').value)
        .subscribe(response => {
          if (this.paramAction === 'create') {
            this.router.navigate(
              [],
              {
                relativeTo: this.activatedRoute,
                queryParams: { action: 'view', year: this.yearkpi },
              });
            this.alertService.success('Tạo mới chỉ tiêu kpi hạng mục thi công thành công');
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
            this.alertService.success('Chỉnh sửa chỉ tiêu kpi hạng mục thi công thành công');
          }
          this.isSubmitCreate = false;
        }, err => {
          if (this.paramAction === 'create') {
            this.alertService.error('Đã xảy lỗi. Tạo mới chỉ tiêu kpi hạng mục thi công không thành công.');
          }
          if (this.paramAction === 'edit') {
            this.alertService.error('Đã xảy lỗi. Chỉnh sửa chỉ tiêu kpi hạng mục thi công không thành công.');
          }
          this.isSubmitCreate = false;
        });
    }
  }

  calculTargetTotalToChangePercent(indexForm: number) {
    const totalTarget = this.mainBuildFA.controls[indexForm].get('total').value *
      this.mainBuildFA.controls[indexForm].get('percent').value / 100;
    this.mainBuildFA.controls[indexForm].get('totalTarget').patchValue(totalTarget);
    let totalTargetAll = 0;
    (this.mainBuildFA.value || []).forEach(itemFormMainBuild => {
      totalTargetAll = totalTargetAll + itemFormMainBuild.totalTarget;
    });
    this.constructionCategoryForm.get('targetTotal').patchValue(totalTargetAll);
  }

  calculTargetTotalToChangeTotal(indexForm: number) {
    const percent = this.mainBuildFA.controls[indexForm].get('totalTarget').value * 100
      / this.mainBuildFA.controls[indexForm].get('total').value;
    this.mainBuildFA.controls[indexForm].get('percent').patchValue(percent);
    let totalTargetAll = 0;
    (this.mainBuildFA.value || []).forEach(itemFormMainBuild => {
      totalTargetAll = totalTargetAll + itemFormMainBuild.totalTarget;
    });
    this.constructionCategoryForm.get('targetTotal').patchValue(totalTargetAll);
  }

  createConstructionCategory() {
    this.yearBackTemp = this.yearkpi;
    this.yearkpi = null;
    if (this.listMainBuildingCategory) {
      this.createNewForm(this.listMainBuildingCategory);
    }
    if (!this.listMainBuildingCategory) {
      this.dataService.getListMainConstructionComponents().subscribe(listMainBuildingCategory => {
        this.createNewForm(listMainBuildingCategory);
      });
    }
  }

  createNewForm(listMainBuildingCategory) {
    this.constructionCategoryForm.removeControl('mainBuild');
    this.constructionCategoryForm.addControl('mainBuild', this.fb.array([]));
    (listMainBuildingCategory || []).forEach(itemMainBuild => {
      const formArrayItem = this.fb.group({
        constructionTypeId: itemMainBuild.id,
        constructionTypeName: itemMainBuild.text,
        total: 0,
        percent: 100,
        totalTarget: 0,
      });
      (this.constructionCategoryForm.get('mainBuild') as FormArray).push(formArrayItem);
    });
    this.constructionCategoryForm.get('targetTotal').patchValue(0);
  }

  cancel() {
    if (this.paramAction === 'create' || this.paramAction === 'edit') {
      this.yearkpi = this.yearBackTemp ? this.yearBackTemp : this.currentYear;
      this.settingService.getDetailConstructionCategory(this.yearkpi).subscribe(responseToYear => {
        this.constructionCategoryForm.removeControl('mainBuild');
        this.constructionCategoryForm.addControl('mainBuild', this.fb.array([]));
        this.constructionCategoryForm.removeControl('targetTotal');
        this.constructionCategoryForm.addControl('targetTotal', this.fb.control(null));
        if (responseToYear && (responseToYear || []).length !== 0) {
          this.createForm(responseToYear);
        }
        if (!(responseToYear && (responseToYear || []).length !== 0)) {
          this.settingService.readLocation('', 0, 1000).subscribe(response => {
            this.dataService.getListMainConstructionComponents().subscribe(listMainBuildingCategory => {
              this.listMainBuildingCategory = listMainBuildingCategory;
              this.createForm(listMainBuildingCategory);
            });
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
