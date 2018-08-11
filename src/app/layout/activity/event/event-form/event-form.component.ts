import {
    Component,
    Input,
    OnInit,
    Output,
    EventEmitter,
    ViewChild,
    ChangeDetectorRef
} from "@angular/core";
import * as moment from "moment";
import {
    FormGroup,
    FormBuilder,
    AbstractControl,
    Validators
} from "@angular/forms";
import { ActivityModel } from "../../../../shared/models";
import {
    SessionService,
    AlertService,
    DataService,
    ActivityService,
    UserNotificationService
} from "../../../../shared/services/";
import { Observable } from "rxjs/Observable";
import { DictionaryItem } from "../../../../shared/models/dictionary-item.model";
import { EventRequest } from "../../../../shared/models/api-request/activity/event/event-request.model";
import { Router, ActivatedRoute } from "@angular/router";
import ValidationHelper from "../../../../shared/helpers/validation.helper";
import { DATETIME_PICKER_CONFIG } from "../../../../shared/configs/datepicker.config";
import DateTimeConvertHelper from "../../../../shared/helpers/datetime-convert-helper";
import CustomValidator from "../../../../shared/helpers/custom-validator.helper";

@Component({
    selector: "app-event-form",
    templateUrl: "./event-form.component.html",
    styleUrls: ["./event-form.component.scss"]
})
export class EventFormComponent implements OnInit {
    @Input() event: ActivityModel;

    eventForm: FormGroup;
    invalidMessages: string[];
    formErrors = {
        name: "",
        startDate: "",
        endDate: "",
        status: ""
    };

    searchResults: DictionaryItem[];
    eventTypeList: Observable<DictionaryItem[]>;
    activityTypeList: Observable<DictionaryItem[]>;
    employeeList: Observable<DictionaryItem[]>;
    activityStatusList: Observable<DictionaryItem[]>;

    isCollapsedMain = false;
    isCollapsedAddress = false;
    isCollapsedDesc = false;
    isSubmitted: boolean;

    datePickerConfig = DATETIME_PICKER_CONFIG;
    employeeGroupList: Observable<DictionaryItem[]>;
    constructor(
        private fb: FormBuilder,
        private activityService: ActivityService,
        private sessionService: SessionService,
        private alertService: AlertService,
        private dataService: DataService,
        private router: Router,
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
        this.eventTypeList = this.dataService.getEventTypes();
    }

    createForm() {
        this.eventForm = this.fb.group({
            id: this.event.id,
            name: [this.event.name, CustomValidator.required],
            status: [this.event.status, Validators.required],
            startDate: [
                DateTimeConvertHelper.fromTimestampToDtObject(
                    this.event.startDate
                ),
                Validators.required
            ],
            endDate: [
                DateTimeConvertHelper.fromTimestampToDtObject(
                    this.event.endDate
                ),
                Validators.required
            ],
            address: this.event.address,
            type: this.event.eventType,
            specificRelated: {
                value: this.event.specificRelated && {
                    id: this.event.specificRelated.id,
                    text: this.event.specificRelated.name
                },
                disabled: !this.event.relatedToType
            },
            relatedToType: this.event.relatedToType,
            description: this.event.description,
            assignTo: [
                (this.event.assignTo && this.event.assignTo.id) ||
                `employee_${this.sessionService.currentUser.employeeId}`,
                CustomValidator.required
            ]
        });
        this.cdr.detectChanges();
        this.eventForm.valueChanges.subscribe(data =>
            this.onFormValueChanged(data)
        );
    }

    onFormValueChanged(data?: any) {
        if (this.isSubmitted) {
            this.validateForm();
        }
    }

    validateForm() {
        this.invalidMessages = ValidationHelper.getInvalidMessages(
            this.eventForm,
            this.formErrors
        );
        return this.invalidMessages.length === 0;
    }

    onRelatedToTypeChange() {
        const relatedToTypeControl = this.eventForm.get("relatedToType");
        const specificRelatedControl = this.eventForm.get("specificRelated");
        specificRelatedControl.reset();

        if (relatedToTypeControl.value) {
            specificRelatedControl.enable();
        } else {
            specificRelatedControl.disable();
        }
    }

    submitForm() {
        this.isSubmitted = true;
        if (this.validateForm()) {

        }
    }

    search(query) {
        this.dataService
            .searchAllByModuleName(
                this.eventForm.get("relatedToType").value,
                query
            )
            .subscribe(result => (this.searchResults = result), err => { });
    }
}
