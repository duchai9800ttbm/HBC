import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Route, ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { BehaviorSubject } from 'rxjs';
@Component({
  selector: 'app-kpi-chair',
  templateUrl: './kpi-chair.component.html',
  styleUrls: ['./kpi-chair.component.scss']
})
export class KpiChairComponent implements OnInit {
  groupKpiChair: FormGroup;
  param: string;
  modalRef: BsModalRef;
  searchTerm$ = new BehaviorSubject<string>('');
  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private modalService: BsModalService,
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.param = params['action'];
    });
    this.createForm();
  }

  createForm() {
    this.groupKpiChair = this.fb.group({
    });
    // this.groupConfigForm.valueChanges
    //   .subscribe(data => this.onFormValueChanged(data));
  }

  addChairToGroupFuc(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {
      class: 'gray modal-lg'
    });
  }

  closedPopup() {
    this.modalRef.hide();
  }

}
