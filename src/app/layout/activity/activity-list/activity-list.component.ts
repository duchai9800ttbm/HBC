import { Component, OnInit } from "@angular/core";
import { routerTransition } from "../../../router.animations";
import { DATATABLE_CONFIG } from "../../../shared/configs";
import {
    AlertService,
    ConfirmationService,
    DataService
} from "../../../shared/services/";
// tslint:disable-next-line:import-blacklist
import { Subject, BehaviorSubject, Observable } from "rxjs";
import { ActivityListItem } from "../../../shared/models/activity/activity-list-item.model";
import { Router } from "@angular/router";
import { ActivityService } from "../../../shared/services/activity.service";
import { PagedResult, DictionaryItem } from "../../../shared/models";
import { ActivityFilter } from "../../../shared/models/activity/activity-filter.model";
import { ExcelService } from "../../../shared/services/excel.service";
import { TranslateService } from "@ngx-translate/core";
import * as moment from "moment";
import { DATETIME_PICKER_CONFIG } from "../../../shared/configs/datepicker.config";
import { DownloadTemplateService } from "../../../shared/services/download-template.service";
import { FormGroup } from "@angular/forms/src/model";
import { FormBuilder, Validators } from "@angular/forms";
import ValidationHelper from "../../../shared/helpers/validation.helper";
import DateTimeConvertHelper from "../../../shared/helpers/datetime-convert-helper";
import { NgxSpinnerService } from "ngx-spinner";
@Component({
    selector: "app-activity-list",
    templateUrl: "./activity-list.component.html",
    styleUrls: ["./activity-list.component.scss"],
    animations: [routerTransition()]
})
export class ActivityListComponent implements OnInit {
    activityStatusList: Observable<DictionaryItem[]>;
    checkboxSeclectAll: boolean;
    dtOptions: any = DATATABLE_CONFIG;
    dtTrigger: Subject<any> = new Subject();
    filterModel = new ActivityFilter();
    pagedResult: PagedResult<ActivityListItem> = new PagedResult<
        ActivityListItem
        >();
    datePickerConfig = DATETIME_PICKER_CONFIG;
    activityForm: FormGroup;
    formErrors = {
        startDate: "",
        endDate: ""
    };

    isSubmitted: boolean;
    invalidMessages: string[];
    constructor(
        private activityService: ActivityService,
        private alertService: AlertService,
        private dataService: DataService,
        private confirmationService: ConfirmationService,
        private router: Router,
        private excelService: ExcelService,
        private translateService: TranslateService,
        private downloadTemplate: DownloadTemplateService,
        private fb: FormBuilder,
        private spinner: NgxSpinnerService

    ) { }

    searchTerm$ = new BehaviorSubject<string>("");

    ngOnInit() {
        window.scrollTo(0, 0);

        this.dtOptions = DATATABLE_CONFIG;
        this.createForm();
        this.activityStatusList = this.dataService.getActivityStatus();
        this.spinner.show();
        this.activityService
            .instantSearchWithFilter(this.searchTerm$, this.filterModel, 0, 10)
            .subscribe(result => {
                this.rerender(result);
                this.spinner.hide();
            }, err => {
                this.spinner.hide();
            });

    }
    createForm() {
        this.activityForm = this.fb.group({
            startDate: [
                DateTimeConvertHelper.fromTimestampToDtObject(
                    moment().valueOf()
                ),
                Validators.required
            ],
            endDate: [""]
        });
        this.activityForm.valueChanges.subscribe(data =>
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
            this.activityForm,
            this.formErrors
        );
        return this.invalidMessages.length === 0;
    }

    onClick(moduleName, moduleItemId) {
        this.router.navigate([
            `/${moduleName.toLowerCase()}/detail/${moduleItemId}`
        ]);
    }
    pagedResultChange(pagedResult: any) {
        this.refresh();
    }

    delete(ids: any | any[], activityType?: string) {
        const that = this;
        let deleteIds = [];
        if (!(ids instanceof Array)) {
            deleteIds = [{ id: ids, activityType: activityType }];
        } else {
            deleteIds = ids;
        }

        this.confirmationService.confirm(
            "Bạn có chắc chắn muốn xóa hoạt động này?",
            () => {
                that.activityService.delete(deleteIds).subscribe(_ => {
                    if (
                        this.pagedResult.items.length === deleteIds.length &&
                        +this.pagedResult.currentPage > 0
                    ) {
                        this.pagedResult.currentPage =
                            +this.pagedResult.currentPage - 1;
                    }
                    that.alertService.success("Đã xóa hoạt động!");
                    that.refresh();
                });
            }
        );
    }

    multiDelete() {
        const deleteIds = this.pagedResult.items
            .filter(x => x.checkboxSelected)
            .map(x => {
                return {
                    id: +x.id,
                    activityType: x.activityType ? x.activityType.toLowerCase() : ''
                };
            });
        if (deleteIds.length === 0) {
            this.alertService.error(
                "Bạn phải chọn ít nhất một đối tượng để xóa!"
            );
        } else {
            this.delete(deleteIds);
        }
    }
    filter(clear: boolean = false) {
        if (clear) {
            this.spinner.show();
            this.activityService
                .filter(
                    this.searchTerm$.value,
                    this.filterModel,
                    0,
                    this.pagedResult.pageSize
                )
                .subscribe(result => {
                    this.rerender(result);
                    this.spinner.hide();
                }, err => {
                    this.spinner.hide();
                });
            this.createForm();
        }
        const today = new Date(
            moment(this.activityForm.value.startDate).unix() * 1000
        );
        const h = today.getHours();
        const m = today.getMinutes();
        const s = today.getSeconds();
        this.filterModel.fromDate =
            (moment(this.activityForm.value.startDate).unix() -
                h * 60 * 60 -
                m * 60 -
                s) *
            1000;
        this.filterModel.toDate =
            (moment(this.activityForm.value.endDate).unix() +
                24 * 60 * 60 -
                1) *
            1000;
        this.spinner.show();
        this.activityService
            .filter(
                this.searchTerm$.value,
                this.filterModel,
                0,
                this.pagedResult.pageSize
            )
            .subscribe(result => {
                this.rerender(result);
                this.spinner.hide();
            }, err => this.spinner.hide());
    }

    clearFilter() {
        this.filterModel = new ActivityFilter();
        this.filter(true);
    }

    fileChange(event) {
        const fileList: FileList = event.target.files;
        const that = this;
        if (fileList.length > 0) {
            const file = fileList[0];
            this.activityService.importFile(file).subscribe(
                result => {
                    that.refresh();
                    this.alertService.success(
                        "Bạn đã nhập dữ liệu thành công!"
                    );
                },
                err => {
                    this.alertService.error(
                        "Bạn đã nhập dữ liệu thất bại, vui lòng nhập đúng template!"
                    );
                }
            );
        }
    }

    refresh(displayAlert: boolean = false): void {
        this.spinner.show();
        this.activityService
            .filter(
                this.searchTerm$.value,
                this.filterModel,
                this.pagedResult.currentPage,
                this.pagedResult.pageSize
            )
            .subscribe(result => {
                this.rerender(result);
                this.spinner.hide();
                if (displayAlert) {
                    this.alertService.success(
                        "Dữ liệu đã được cập nhật mới nhất"
                    );
                }
            }, err => this.spinner.hide());
    }

    rerender(pagedResult: any) {
        this.checkboxSeclectAll = false;
        this.pagedResult = pagedResult;
        this.dtTrigger.next();
    }

    onSelectAll(value: boolean) {
        this.pagedResult.items.forEach(x => (x.checkboxSelected = value));
    }

    exportFileExcel() {
        const exportItems = this.pagedResult.items.map(x => {
            return {
                "Tiêu đề": x.name ? x.name : "",
                Loại: this.translateService.instant(x.activityType || "null"),
                "Ngày giờ bắt đầu": `${moment(x.startDate).format(
                    "L"
                )} ${moment(x.startDate).format("LT")}`,
                "Ngày giờ kết thúc": `${moment(x.endDate).format("L")} ${moment(
                    x.endDate
                ).format("LT")}`,
                "Trạng thái": this.translateService.instant(x.status || "null"),
                "Vị trí": x.address ? x.address : "",
                "Liên quan đến loại": this.translateService.instant(
                    x.relatedToType || "null"
                ),
                "Cụ thể liên quan": x.specificRelated
                    ? `${x.specificRelated.name ? x.specificRelated.name : ""}`
                    : "",
                "Phân công cho": x.assignTo ? x.assignTo : ""
            };
        });
        this.excelService.exportAsExcelFile(exportItems, "HoatDong");
    }

    downTemplate() {
        this.downloadTemplate
            .downloadTemplate("activity")
            .subscribe(result => result);
    }
}
