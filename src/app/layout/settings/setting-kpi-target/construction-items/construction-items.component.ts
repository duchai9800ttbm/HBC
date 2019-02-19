import { Component, OnInit } from '@angular/core';
import { SettingService } from '../../../../shared/services/setting.service';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-construction-items',
  templateUrl: './construction-items.component.html',
  styleUrls: ['./construction-items.component.scss']
})
export class ConstructionItemsComponent implements OnInit {
  constructionCategoryForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private settingService: SettingService,
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.constructionCategoryForm = this.fb.group({});
  }

}
