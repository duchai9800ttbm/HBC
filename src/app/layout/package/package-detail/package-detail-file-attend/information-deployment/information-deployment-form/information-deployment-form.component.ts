import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import '@progress/kendo-ui';
import { NgxSpinnerService } from 'ngx-spinner';
import { PackageService } from '../../../../../../shared/services/package.service';
import { PackageInfoModel } from '../../../../../../shared/models/package/package-info.model';
import { PackageDetailComponent } from '../../../package-detail.component';
import { DATATABLE_CONFIG } from '../../../../../../shared/configs';
// tslint:disable-next-line:import-blacklist
import { Subject, Observable } from 'rxjs';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { TenderPreparationPlanItem } from '../../../../../../shared/models/package/tender-preparation-plan-item';
import DateTimeConvertHelper from '../../../../../../shared/helpers/datetime-convert-helper';
import { UserService, AlertService, SessionService, ConfirmationService } from '../../../../../../shared/services';
import { UserItemModel } from '../../../../../../shared/models/user/user-item.model';
import { TenderPreparationPlanningRequest } from '../../../../../../shared/models/api-request/package/tender-preparation-planning-request';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { BidStatus } from '../../../../../../shared/constants/bid-status';
import { CheckStatusPackage } from '../../../../../../shared/constants/check-status-package';
declare let kendo: any;

@Component({
    selector: 'app-information-deployment-form',
    templateUrl: './information-deployment-form.component.html',
    styleUrls: ['./information-deployment-form.component.scss']
})
export class InformationDeploymentFormComponent implements OnInit {
    @ViewChild('ganttChart')
    ganttChart: ElementRef;
    bidOpportunityId;
    packageInfo: PackageInfoModel;
    dtOptions: any = DATATABLE_CONFIG;
    planForm: FormGroup;
    dtTrigger: Subject<any> = new Subject();
    fakeArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    userList: UserItemModel[];
    routerAction: string;
    bidStatus = BidStatus;
    isShowChanges = false;
    updatedDetail = '';
    tenderPlan: TenderPreparationPlanningRequest;
    mailPersonnel = ['', '', '', ''];
    taskNoAssignment = '';
    whoIsInChargeIdSurvey;
    get tasksFA(): FormArray {
        return this.planForm.get('tasks') as FormArray;
    }
    controlDisableForm: boolean;
    checkStatusPackage = CheckStatusPackage;
    constructor(
        private spinner: NgxSpinnerService,
        private packageService: PackageService,
        private userService: UserService,
        private fb: FormBuilder,
        private router: Router,
        private alertService: AlertService,
        private sessionService: SessionService,
        private confirmationService: ConfirmationService
    ) { }

    ngOnInit() {
        setTimeout(() => {
            this.dtTrigger.next();
        });
        this.routerAction = this.packageService.routerAction;
        this.bidOpportunityId = PackageDetailComponent.packageId;
        this.userService.getAllUser('').subscribe(data => {
            this.userList = data;
        });
        this.getPackageInfo();
    }

    getPackageInfo() {
        this.spinner.show();
        this.packageService
            .getInforPackageID(this.bidOpportunityId)
            .subscribe(data => {
                this.packageInfo = data;
                this.checkAndCreateForm();
                this.spinner.hide();
            });
    }

    checkAndCreateForm() {
        if (this.routerAction === 'create') {
            this.packageService
                .getDefaultTenderPreparationPlanning()
                .subscribe(data => {
                    this.createForm(data, true);
                }
                );
        } else {
            this.packageService.getTenderPreparationPlanning(this.bidOpportunityId).subscribe(data => {
                this.createForm(data);
            });
        }
    }
    // disableForm() {
    //     this.planForm.controls.forEach( item => {
    //         if ( item === FormArray) {
    //             console.log('a', a);
    //         }
    //     })
    // }

    createForm(planModel: TenderPreparationPlanningRequest, isCreate?) {
        this.tenderPlan = planModel;
        const taskArr = [];
        this.controlDisableForm = this.routerAction === 'view' ? true : false;
        planModel.tasks.forEach(i => taskArr.push(this.createTaskItemFG(i)));
        this.planForm = this.fb.group({
            id: planModel.id,
            isDraftVersion: isCreate ? true : planModel.isDraftVersion,
            projectDirectorEmployeeId: {
                value: planModel.projectDirectorEmployee && planModel.projectDirectorEmployee.employeeId,
                disabled: this.controlDisableForm,
            },
            tenderDepartmentEmployeeId: {
                value: planModel.tenderDepartmentEmployee && planModel.tenderDepartmentEmployee.employeeId,
                disabled: this.controlDisableForm,
            },
            technicalDepartmentEmployeeId: {
                value: planModel.technicalDepartmentEmployee && planModel.technicalDepartmentEmployee.employeeId,
                disabled: this.controlDisableForm,
            },
            queryDeadline: {
                value: planModel.queryDeadline
                    ? DateTimeConvertHelper.fromTimestampToDtObject(
                        planModel.queryDeadline * 1000
                    )
                    : null,
                disabled: this.controlDisableForm,
            },
            bimDepartmentEmployeeId: {
                value: planModel.bimDepartmentEmployee && planModel.bimDepartmentEmployee.employeeId,
                disabled: this.controlDisableForm,
            },
            isSignedByPreparedPerson: planModel.isSignedByPreparedPerson,
            isSignedByApprovalPerson: planModel.isSignedByApprovalPerson,
            updatedDesc: '',
            projectInformation: {
                value: planModel.projectInformation ? planModel.projectInformation : 'Bảng phân công tiến độ',
                disabled: this.controlDisableForm,
            },
            tasks: this.fb.array(taskArr)
        });
        this.tasksFA.controls.forEach((item, index) => {
            this.calculateTotalTime(index);
        });
        this.changeDirector(this.planForm.get('projectDirectorEmployeeId').value, 0);
        this.changeDirector(this.planForm.get('tenderDepartmentEmployeeId').value, 1);
        this.changeDirector(this.planForm.get('technicalDepartmentEmployeeId').value, 2);
        this.changeDirector(this.planForm.get('bimDepartmentEmployeeId').value, 3);
        setTimeout(() => {
            if (this.ganttChart) {
                kendo.jQuery(this.ganttChart.nativeElement).kendoGantt({
                    views: [
                        { type: 'day', selected: true },
                        { type: 'week' },
                        'month'
                    ],
                    height: 3250,
                    // 2832
                    listWidth: 0,
                    showWorkHours: false,
                    showWorkDays: false,
                    snap: false
                }).data('kendoGantt');
                this.updateGantt();
                this.planForm.valueChanges.subscribe(_ => {
                    this.updateGantt();
                    // this.enableCheckbox();
                });
            }
        }, 500);
    }

    // valueChangeNg() {
    //     console.log('this.valueChange', this.planForm);
    // }

    getEmailUser(userId: number): string {
        // tslint:disable-next-line:triple-equals
        // tslint:disable-next-line:max-line-length
        return (this.userList && this.userList.find(i => i.employeeId === Number(userId))) ? this.userList.find(i => i.employeeId === Number(userId)).email : '';
    }

    changeDirector(userId, personnelType) {
        if (userId) {
            if (personnelType === 0) {
                this.mailPersonnel[0] = this.getEmailUser(userId);
            }
            if (personnelType === 1) {
                this.mailPersonnel[1] = this.getEmailUser(userId);
            }
            if (personnelType === 2) {
                this.mailPersonnel[2] = this.getEmailUser(userId);
            }
            if (personnelType === 3) {
                this.mailPersonnel[3] = this.getEmailUser(userId);
            }
        }
    }

    updateGantt() {
        const dataSource = new kendo.data.GanttDataSource({
            data: this.planForm.value.tasks.map(i => {
                return {
                    id: i.itemId,
                    orderId: i.itemId,
                    // parentId: i.itemId,
                    title: i.itemName,
                    start: i.startDate,
                    end: i.finishDate
                };
            })
        });
        const gantt = kendo.jQuery(this.ganttChart.nativeElement).data('kendoGantt');
        gantt.setDataSource(dataSource);
    }

    createTaskItemFG(data: TenderPreparationPlanItem): FormGroup {
        const isFinishDisabled =
            (this.checkStatusPackage[this.packageInfo.stageStatus.id].id > this.checkStatusPackage.ThamGiaDuThau.id &&
                this.checkStatusPackage[this.packageInfo.stageStatus.id].id < this.checkStatusPackage.ChoKetQuaDuThau.id);
        console.log('isFinishDisabled', isFinishDisabled);
        return this.fb.group({
            itemId: data.itemId,
            itemNo: data.itemNo,
            itemName: data.itemName,
            itemDesc: {
                value: data.itemDesc,
                disabled: this.controlDisableForm,
            },
            whoIsInChargeId: {
                value: data.whoIsInChargeId === 0 ? null : data.whoIsInChargeId,
                disabled: this.controlDisableForm,
            },
            whoIsInChargeIds: {
                value: (data.whoIsInCharges && data.whoIsInCharges.length !== 0) ? data.whoIsInCharges : [],
                disabled: this.controlDisableForm,
            },
            startDate: {
                value: data.startDate
                    ? DateTimeConvertHelper.fromTimestampToDtObject(
                        data.startDate * 1000
                    )
                    : null,
                disabled: this.controlDisableForm,
            },
            finishDate: {
                value: data.finishDate
                    ? DateTimeConvertHelper.fromTimestampToDtObject(
                        data.finishDate * 1000
                    )
                    : null,
                disabled: this.controlDisableForm,
            },
            duration: data.duration,
            isFinish: {
                value: data.isFinish,
                disabled: !isFinishDisabled,
            },
            totalTime: '',
        });
    }

    getFormData(): TenderPreparationPlanningRequest {
        const formData = Object.assign({}, this.planForm.value);
        formData.tasks.forEach(element => {
            // element.startDate = DateTimeConvertHelper.fromDtObjectToSecon(element.startDate);
            // element.finishDate = DateTimeConvertHelper.fromDtObjectToSecon(element.finishDate);
            element.whoIsInChargeId = Number(element.whoIsInChargeId);
            // if (element.startDate && element.finishDate) {
            //     element.duration = Math.abs(element.startDate - element.finishDate) / (60 * 60 * 24);
            // }
        });
        return formData as TenderPreparationPlanningRequest;
    }

    validateForm(formData: TenderPreparationPlanningRequest, isDraft: boolean): boolean {
        if (isDraft) {
            // lưu nháp thì ko cần validate
            return true;
        } else if (formData.tasks.every(i =>
            (i.whoIsInChargeId === 0 || i.whoIsInChargeId == null) &&
            (i.whoIsInChargeIds === null || (i.whoIsInChargeIds && i.whoIsInChargeIds.length) === 0))
        ) {
            if (this.planForm.get('isDraftVersion').value === false) {
                this.alertService.error('Bạn chưa hoàn tất phân công tiến độ!');
            } else {
                this.alertService.error('Bạn chưa hoàn tất phân công tiến độ, chọn "Lưu nháp" nếu muốn thực hiện sau.');
            }
            return false;
        } else {
            return this.checkPlanItems(formData.tasks);
        }
    }

    checkPlanItems(data: TenderPreparationPlanItem[]): boolean {
        // let i = 1;
        // let result = true;
        // data.forEach(e => {
        //     if (!(e.whoIsInChargeId && e.startDate && e.finishDate)) {
        //         this.alertService.error('Bạn chưa chọn thời gian bắt đầu và thời gian kết thúc cho công việc số ' + i);
        //         result = false;
        //     } else {
        //         i++;
        //     }
        // });
        // if (data.find(i => i.whoIsInChargeId && i.startDate && i.finishDate)) {

        // }
        if (data.some(i => i.whoIsInChargeId != null || i.whoIsInChargeId !== 0 ||
            i.whoIsInChargeIds != null || i.whoIsInChargeIds.length !== 0)) {
            return true;
        }
        return false;
    }

    checkChooseAllTask() {
        return this.tasksFA.value.every(item => {
            return (item.whoIsInChargeId && item.whoIsInChargeId !== 0) || (item.whoIsInChargeIds && item.whoIsInChargeIds.length !== 0);
        });
    }

    checkAssignment(): boolean {
        return this.tasksFA.value.every(item => {
            if (item.whoIsInChargeId && item.whoIsInChargeId !== 0) {
                this.taskNoAssignment = item.itemName;
                return (item.startDate && item.finishDate);
            } else if (item.whoIsInChargeIds && item.whoIsInChargeIds.length !== 0) {
                this.taskNoAssignment = item.itemName;
                return (item.startDate && item.finishDate);
            } else {
                return true;
            }
        });
    }

    submitForm(isDraft: boolean) {
        if (isDraft) { // Lưu nháp
            this.actionSubmit(isDraft);
        } else {
            // Lưu chính thức
            if (this.checkAssignment()) {
                if (this.checkChooseAllTask()) {
                    this.actionSubmit(isDraft);
                } else {
                    this.confirmationService.confirm(
                        'Chưa hoàn tất phân công tiến độ, bạn có muốn tiếp tục hay không?',
                        () => {
                            this.actionSubmit(isDraft);
                        }
                    );
                }
            } else {
                this.alertService.error(`Bạn cần chọn ngày bắt đầu và ngày kết thúc cho công việc "${this.taskNoAssignment}"`);
            }
        }
    }

    actionSubmit(isDraft) {
        const data = this.getFormData();
        const isValid = this.validateForm(data, isDraft);
        if (!isValid) {
            return;
        }
        if (data.id && !isDraft) {
            this.isShowChanges = true;
        } else {
            this.saveTenderPlan(isDraft);
        }
    }

    saveTenderPlan(isDraft: boolean) {
        const data = this.getFormData();
        data.isDraftVersion = isDraft;
        data.bidOpportunityId = this.bidOpportunityId;
        if (data.createdEmployeeId) {
            data.updatedEmployeeId = this.sessionService.currentUser.employeeId;
        } else {
            data.createdEmployeeId = this.sessionService.currentUser.employeeId;
        }
        // data.updatedDesc = this.updatedDetail;
        this.spinner.show();
        data.tasks.forEach(item => {
            item.itemName = '';
        });
        this.packageService.createOrUpdateTenderPreparationPlanning(data).subscribe(res => {
            this.spinner.hide();
            this.router.navigateByUrl(`package/detail/${this.bidOpportunityId}/attend/infomation-deployment`);
            if (data.id) {
                this.alertService.success('Cập nhật bảng phân công tiến độ thành công!');
            } else {
                this.alertService.success('Tạo mới bảng phân công tiến độ thành công!');
            }
        }, err => {
            this.spinner.hide();
            if (data.id) {
                this.alertService.error('Cập nhật bảng phân công tiến độ thất bại');
            } else {
                this.alertService.error('Tạo mới bảng phân công tiến độ thất bại');
            }
        });
    }

    saveChangesLiveForm() {
        this.isShowChanges = false;
        this.saveTenderPlan(false);
    }

    // getItemDuration(start: Date, end: Date): string {
    //     if (start && end) {
    //         // tslint:disable-next-line:max-line-length
    //         return Math.abs(DateTimeConvertHelper.fromDtObjectToSecon(start) - DateTimeConvertHelper.fromDtObjectToSecon(end)) / (60 * 60 * 24) + '';
    //     } else {
    //         return '';
    //     }
    // }

    calculateTotalTime(index) {
        const end = DateTimeConvertHelper.fromDtObjectToSecon((this.tasksFA.controls[index]).get('finishDate').value);
        const start = DateTimeConvertHelper.fromDtObjectToSecon((this.tasksFA.controls[index]).get('startDate').value);
        if (start && end) {
            this.tasksFA.controls[index].get('totalTime').patchValue(
                Math.floor((end - start) / (60 * 60 * 24))
            );
        } else {
            this.tasksFA.controls[index].get('totalTime').patchValue('');
        }
    }

    getDateStr(data: number) {
        return data ? DateTimeConvertHelper.fromTimestampToDtStr(data) : '';
    }

    changeFinishStatus(value) {
    }

    checkFinishTenderPlanItem(itemId: number) {
        // tạm thời chưa dùng, khi phân quyền sẽ dùng
        this.packageService.checkOrUncheckTenderPreparationPlanningItem(this.bidOpportunityId, itemId).subscribe(success => {
        }, err => {
            this.alertService.error('Đã có lỗi xảy ra, vui lòng thử lại!');
        });
    }

    changeRouterAction(dataRouter: string) {
        this.routerAction = dataRouter;
        this.controlDisableForm = (this.routerAction === 'view') ? true : false;
        this.planForm.enable();
    }

    closeShowChanges() {
        this.isShowChanges = false;
        this.updatedDetail = '';
    }

    clickSignPrepare() {
        this.planForm.get('isSignedByPreparedPerson').patchValue(true);
    }

    clickSignApproved() {
        if (this.planForm.get('id').value) {
            // update
            if (!this.planForm.get('isSignedByPreparedPerson').value) {
                this.alertService.error('Chưa được ký bởi người lập');
            } else {
                this.packageService.signApprovedPreparationPlanning(this.bidOpportunityId)
                    .subscribe(data => this.planForm.get('isSignedByApprovalPerson').patchValue(true));
            }
        } else {
            if (!this.planForm.get('isSignedByPreparedPerson').value) {
                this.alertService.error('Chưa được ký bởi người lập');
            } else {
                this.planForm.get('isSignedByApprovalPerson').patchValue(true);
            }
        }
    }

    refesh() {
        this.packageService.getTenderPreparationPlanning(this.bidOpportunityId).subscribe(data => this.createForm(data));
        this.getPackageInfo();
    }

    // enableCheckbox() {
    //     this.tasksFA.value.every(item => {
    //         if (item.whoIsInChargeId && item.startDate && item.finishDate) {
    //             console.log(item.isFinish);
    //         }
    //     });
    // }
}
