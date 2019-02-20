import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SettingService } from '../../../../shared/services/setting.service';

@Component({
  selector: 'app-type-construction',
  templateUrl: './type-construction.component.html',
  styleUrls: ['./type-construction.component.scss']
})
export class TypeConstructionComponent implements OnInit {
  constructionTypeForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private settingService: SettingService,
  ) { }

  ngOnInit() {
  }

  createForm() {
    this.constructionTypeForm = this.fb.group({});
  }

}
