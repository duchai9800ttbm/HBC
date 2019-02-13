import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Route, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-kpi-chair',
  templateUrl: './kpi-chair.component.html',
  styleUrls: ['./kpi-chair.component.scss']
})
export class KpiChairComponent implements OnInit {
  groupKpiChair: FormGroup;
  param: string;
  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.param = params['action'];
    });
  }

  createForm() {
    this.groupKpiChair = this.fb.group({
    });
    // this.groupConfigForm.valueChanges
    //   .subscribe(data => this.onFormValueChanged(data));
  }

}
