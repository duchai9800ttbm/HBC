import { Component, OnInit } from '@angular/core';
import { SettingService } from '../../../../shared/services/setting.service';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-construction-items',
  templateUrl: './construction-items.component.html',
  styleUrls: ['./construction-items.component.scss']
})
export class ConstructionItemsComponent implements OnInit {
  constructionCategoryForm: FormGroup;
  paramYear: number;
  paramAction: string;
  constructor(
    private fb: FormBuilder,
    private settingService: SettingService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.paramAction = params['action'];
      this.paramYear = params['year'];
    });
    this.createForm();
  }

  createForm() {
    this.constructionCategoryForm = this.fb.group({});
  }

}
