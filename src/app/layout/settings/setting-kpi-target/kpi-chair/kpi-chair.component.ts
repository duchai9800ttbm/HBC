import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-kpi-chair',
  templateUrl: './kpi-chair.component.html',
  styleUrls: ['./kpi-chair.component.scss']
})
export class KpiChairComponent implements OnInit {
  groupKpiChair: FormGroup;
  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
  }

  createForm() {
    this.groupKpiChair = this.fb.group({
    });
    // this.groupConfigForm.valueChanges
    //   .subscribe(data => this.onFormValueChanged(data));
  }

}
