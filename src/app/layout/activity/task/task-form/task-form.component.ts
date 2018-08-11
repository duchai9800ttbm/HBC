import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { routerTransition } from '../../../../router.animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TaskRequest } from '../../../../shared/models/api-request/activity/task/task-request.model';
import { Observable } from 'rxjs/Observable';
import { DictionaryItem } from '../../../../shared/models/dictionary-item.model';
import { AlertService, DataService, SessionService, ActivityService, UserNotificationService } from '../../../../shared/services/index';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import ValidationHelper from '../../../../shared/helpers/validation.helper';
import { ActivityModel } from '../../../../shared/models/index';
import { DATETIME_PICKER_CONFIG } from '../../../../shared/configs/datepicker.config';
import DateTimeConvertHelper from '../../../../shared/helpers/datetime-convert-helper';
import CustomValidator from '../../../../shared/helpers/custom-validator.helper';
@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
  animations: [routerTransition()]
})
export class TaskFormComponent implements OnInit {

  @Input() task: ActivityModel;

  searchResults: DictionaryItem[];
  activityTypeList: Observable<DictionaryItem[]>;
  activityStatusList: Observable<DictionaryItem[]>;
  employeeList: Observable<DictionaryItem[]>;
  employeeGroupList: Observable<DictionaryItem[]>;

  taskForm: FormGroup;
  invalidMessages: any;
  isSubmitted: boolean;
  isCollapsedMain = false;
  isCollapsedAddress = false;
  isCollapsedDesc = false;

  datePickerConfig = DATETIME_PICKER_CONFIG;


  formErrors = {
    name: '',
    startDate: '',
    endDate: '',
    status: '',
  };
  constructor(
    private fb: FormBuilder,
    private activityService: ActivityService,
    private dataService: DataService,
    private sessionService: SessionService,
    private router: Router,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private userNotificationService: UserNotificationService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.createForm();
    this.employeeGroupList = this.dataService.getEmployeeGroups();
    this.employeeList = this.dataService.getEmployees();
    this.activityStatusList = this.dataService.getActivityStatus();
    this.activityTypeList = this.dataService.getActivityTypes();
  }

  createForm() {
    this.taskForm = this.fb.group({
      id: this.task.id,
      name: [this.task.name, CustomValidator.required],
      status: [this.task.status, Validators.required],
      startDate: [DateTimeConvertHelper.fromTimestampToDtObject(this.task.startDate), Validators.required],
      endDate: [DateTimeConvertHelper.fromTimestampToDtObject(this.task.endDate), Validators.required],
      address: this.task.address,
      specificRelated: {
        value: this.task.specificRelated && {
          id: this.task.specificRelated.id,
          text: this.task.specificRelated.name,
        },
        disabled: !this.task.relatedToType
      },
      relatedToType: this.task.relatedToType,
      description: this.task.description,
      assignTo: [(this.task.assignTo && this.task.assignTo.id) || `employee_${this.sessionService.currentUser.employeeId}`
        , CustomValidator.required]
    });
    this.cdr.detectChanges();
    this.taskForm.valueChanges
      .subscribe(data => this.onFormValueChanged(data));
  }

  onFormValueChanged(data?: any) {
    if (this.isSubmitted) {
      this.validateForm();
    }
  }

  validateForm() {
    this.invalidMessages = ValidationHelper.getInvalidMessages(this.taskForm, this.formErrors);
    return this.invalidMessages.length === 0;
  }

  onRelatedToTypeChange() {
    const relatedToTypeControl = this.taskForm.get('relatedToType');
    const specificRelatedControl = this.taskForm.get('specificRelated');
    specificRelatedControl.reset();

    if (relatedToTypeControl.value) {
      specificRelatedControl.enable();
    } else {
      specificRelatedControl.disable();
    }
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.validateForm()) {
     
    }
  }

  search(query) {
    this.dataService
      .searchAllByModuleName(this.taskForm.get('relatedToType').value, query)
      .subscribe(result => this.searchResults = result);
  }
}
