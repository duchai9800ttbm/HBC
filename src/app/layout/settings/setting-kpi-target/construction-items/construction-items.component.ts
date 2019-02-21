import { Component, OnInit } from '@angular/core';
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

    this.settingService.getDetailConstructionCategory(this.yearkpi).subscribe(responseToYear => {
      if (responseToYear) {
        this.createForm(responseToYear);
      }
      if (!responseToYear) {
        this.dataService.getListMainConstructionComponents().subscribe(listMainBuildingCategory => {
          this.listMainBuildingCategory = listMainBuildingCategory;
          this.createForm(listMainBuildingCategory);
        });
      }
    });
  }

  createForm(listMainBuildingCategory) {
    this.constructionCategoryForm = this.fb.group({
      mainBuild: this.fb.array([]),
      targetTotal: null,
    });
    let totalTarget = 0;
    (listMainBuildingCategory || []).forEach(itemMainBuild => {
      console.log('this.itemMainBuild', itemMainBuild.totalTarget);
      totalTarget = totalTarget + (itemMainBuild.totalTarget ? itemMainBuild.totalTarget : 0);
      const formArrayItem = this.fb.group({
        constructionTypeId: itemMainBuild && itemMainBuild.id,
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
    if (this.paramAction === 'view') {
      this.settingService.getDetailConstructionCategory(this.yearkpi).subscribe(responseToYear => {
        this.constructionCategoryForm.removeControl('mainBuild');
        this.constructionCategoryForm.addControl('mainBuild', this.fb.array([]));
        this.constructionCategoryForm.removeControl('targetTotal');
        this.constructionCategoryForm.addControl('targetTotal', this.fb.control(null));
        if (responseToYear) {
          this.createForm(responseToYear);
        }
        if (!responseToYear) {
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
      }, err => {
        if (this.paramAction === 'create') {
          this.alertService.error('Đã xảy lỗi. Tạo mới chỉ tiêu kpi hạng mục thi công không thành công.');
        }
        if (this.paramAction === 'edit') {
          this.alertService.error('Đã xảy lỗi. Tạo mới chỉ tiêu kpi hạng mục thi công không thành công.');
        }
      });
  }

  calculTargetTotal(indexForm: number) {
    const totalTarget = this.mainBuildFA.controls[indexForm].get('total').value *
      this.mainBuildFA.controls[indexForm].get('percent').value / 100;
    this.mainBuildFA.controls[indexForm].get('totalTarget').patchValue(totalTarget);
    let totalTargetAll = 0;
    (this.mainBuildFA.value || []).forEach(itemFormMainBuild => {
      totalTargetAll = totalTargetAll + itemFormMainBuild.totalTarget;
    });
    this.constructionCategoryForm.get('totalTarget').patchValue(totalTargetAll);
  }

}
