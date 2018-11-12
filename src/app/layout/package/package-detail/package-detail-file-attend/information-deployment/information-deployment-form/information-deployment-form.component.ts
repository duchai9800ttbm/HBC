import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import '@progress/kendo-ui';
import { NgxSpinnerService } from 'ngx-spinner';
import { PackageService } from '../../../../../../shared/services/package.service';
import { PackageInfoModel } from '../../../../../../shared/models/package/package-info.model';
import { PackageDetailComponent } from '../../../package-detail.component';
import { DATATABLE_CONFIG } from '../../../../../../shared/configs';
// tslint:disable-next-line:import-blacklist
import { Subject, Observable, Subscription } from 'rxjs';
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
import { PermissionService } from '../../../../../../shared/services/permission.service';
import { PermissionModel } from '../../../../../../shared/models/permission/Permission.model';
import { StakeHolder } from '../../../../../../shared/models/ho-so-du-thau/stack-holder.model';
import { forkJoin } from '../../../../../../../../node_modules/rxjs/observable/forkJoin';
declare let kendo: any;

@Component({
    selector: 'app-information-deployment-form',
    templateUrl: './information-deployment-form.component.html',
    styleUrls: ['./information-deployment-form.component.scss']
})
export class InformationDeploymentFormComponent implements OnInit, OnDestroy {
    @ViewChild('ganttChart')
    ganttChart: ElementRef;
    gantt;
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
    submissionDate: Date;

    subscription: Subscription;
    listPermission: Array<PermissionModel>;
    listPermissionScreen = [];
    ThongBaoTrienKhai = false;
    XemEmail = false;
    TaoMoiBangPCTD = false;
    XemBangPCTD = false;
    SuaBangPCTD = false;
    XoaBangPCTD = false;
    InBangPCTD = false;
    XacNhanKyPrepared = false;
    XacNhanKyApproved = false;
    GuiPCTD = false;
    TaiTemplatePCTD = false;
    BatDauLapHSDT = false;
    isShowGantt = false;
    investor;
    isFormCreate;
    groupmembersList;
    distributorOfDocHSMT;
    suggestionsToParticipate;
    clarificationQuestion;
    surveyOrganization;
    checkVolumeHSMT;
    checkVolumeBPTC;
    clarifyQuestion;
    filterProfiles;
    requestQuote;
    constructionQuotes;
    filterAndSendRequest;
    generalCostCalculation;
    selectSubcontractor;
    entryPriceEstimates;
    siteLayout;
    basementBPTC;
    monitoring;
    formworkReinforcementConcrete;
    otherTechnicalRecords;
    calibrationCheckFinish;
    preparationLegalDoc;
    photoHungryPack;
    checkAndSaveConditions;
    askClarificationQuestions;
    constructor(
        private spinner: NgxSpinnerService,
        private packageService: PackageService,
        private userService: UserService,
        private fb: FormBuilder,
        private router: Router,
        private alertService: AlertService,
        private sessionService: SessionService,
        private confirmationService: ConfirmationService,
        private permissionService: PermissionService
    ) { }

    ngOnInit() {
        setTimeout(() => {
            this.dtTrigger.next();
        });
        this.routerAction = this.packageService.routerAction;
        this.bidOpportunityId = PackageDetailComponent.packageId;
        // Phân quyền

        this.subscription = this.permissionService.get().subscribe(data => {
            this.listPermission = data;
            const hsdt = this.listPermission.length &&
                this.listPermission.filter(x => x.bidOpportunityStage === 'HSDT')[0];
            if (!hsdt) {
                this.listPermissionScreen = [];
            }
            if (hsdt) {
                const screen = hsdt.userPermissionDetails.length
                    && hsdt.userPermissionDetails.filter(y => y.permissionGroup.value === 'TrienKhaiVaPhanCongTienDo')[0];
                if (!screen) {
                    this.listPermissionScreen = [];
                }
                if (screen) {
                    this.listPermissionScreen = screen.permissions.map(z => z.value);
                }
            }
            this.ThongBaoTrienKhai = this.listPermissionScreen.includes('ThongBaoTrienKhai');
            this.XemEmail = this.listPermissionScreen.includes('XemEmail');
            this.TaoMoiBangPCTD = this.listPermissionScreen.includes('TaoMoiBangPCTD');
            this.XemBangPCTD = this.listPermissionScreen.includes('XemBangPCTD');
            this.SuaBangPCTD = this.listPermissionScreen.includes('SuaBangPCTD');
            this.XoaBangPCTD = this.listPermissionScreen.includes('XoaBangPCTD');
            this.InBangPCTD = this.listPermissionScreen.includes('InBangPCTD');
            this.XacNhanKyPrepared = this.listPermissionScreen.includes('XacNhanKyPrepared');
            this.XacNhanKyApproved = this.listPermissionScreen.includes('XacNhanKyApproved');
            this.GuiPCTD = this.listPermissionScreen.includes('GuiPCTD');
            this.TaiTemplatePCTD = this.listPermissionScreen.includes('TaiTemplatePCTD');
            this.BatDauLapHSDT = this.listPermissionScreen.includes('BatDauLapHSDT');
        });
        this.userService.getAllUser('').subscribe(data => {
            this.userList = data;
        });
        this.checkAndCreateForm();
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    // getPackageInfo() {
    //     this.spinner.show();
    //     const getPackageInfo = this.packageService
    //         .getInforPackageID(this.bidOpportunityId)
    //         .switchMap(data => {
    //             this.packageInfo = data;
    //             this.submissionDate =
    //                 DateTimeConvertHelper.fromTimestampToDtObject(
    //                     this.packageInfo.submissionDate * 1000
    //                 );
    //             return this.packageService.getStakeHolders(this.bidOpportunityId);
    //         })
    //         .switchMap(stakeHolders => {
    //             (stakeHolders || []).some(item => {
    //                 if (item.groupName = 'ChuDauTu') {
    //                     this.investor = item.customers;
    //                     return true;
    //                 } else {
    //                     return false;
    //                 }
    //             });
    //             return this.packageService.getGroupmembers(+this.bidOpportunityId);
    //         })
    //         .subscribe(groupmembers => {
    //             this.checkAndCreateForm();
    //             this.spinner.hide();
    //             console.log('response-groupMenber', groupmembers);
    //         });
    //     this.subscription.add(getPackageInfo);
    // }

    // checkAndCreateForm() {
    //     if (this.routerAction === 'create') {
    //         this.packageService
    //             .getDefaultTenderPreparationPlanning()
    //             .subscribe(data => {
    //                 this.createForm(data, true);
    //             }
    //             );
    //     } else {
    //         this.packageService
    //             .getTenderPreparationPlanning(this.bidOpportunityId).subscribe(data => {
    //                 if (data) {
    //                     this.createForm(data);
    //                 } else {
    //                     this.packageService
    //                         .getDefaultTenderPreparationPlanning()
    //                         .subscribe(dataDefault => {
    //                             this.createForm(dataDefault, true);
    //                         });
    //                 }
    //             });
    //     }
    // }

    checkAndCreateForm() {
        if (this.routerAction === 'create') {
            this.isFormCreate = true;
            forkJoin(
                this.packageService.getDefaultTenderPreparationPlanning(),
                this.packageService.getInforPackageID(this.bidOpportunityId),
                this.packageService.getStakeHolders(this.bidOpportunityId),
                this.packageService.getGroupmembers(+this.bidOpportunityId)
            )
                .subscribe(([res1, res2, res3, res4]) => {
                    // res 2
                    this.packageInfo = res2;
                    this.submissionDate =
                        DateTimeConvertHelper.fromTimestampToDtObject(
                            this.packageInfo.submissionDate * 1000
                        );
                    // res 3
                    (res3 || []).some(item => {
                        if (item.groupName = 'ChuDauTu') {
                            this.investor = item.customers;
                            return true;
                        } else {
                            return false;
                        }
                    });
                    // res4
                    this.groupmembersList = res4;
                    console.log('this.groupmembersList', this.groupmembersList);
                    this.mappingLiveForm(this.groupmembersList);
                    // res 1
                    this.createForm(res1, true);
                });
        } else {
            this.packageService.getInforPackageID(this.bidOpportunityId).switchMap(getInforPackage => {
                this.packageInfo = getInforPackage;
                this.submissionDate =
                    DateTimeConvertHelper.fromTimestampToDtObject(
                        this.packageInfo.submissionDate * 1000
                    );
                return this.packageService
                    .getTenderPreparationPlanning(this.bidOpportunityId);
            })
                .subscribe(data => {
                    if (data) {
                        this.isFormCreate = false;
                        this.createForm(data);
                    } else {
                        this.isFormCreate = true;
                        forkJoin(
                            this.packageService.getDefaultTenderPreparationPlanning(),
                            this.packageService.getStakeHolders(this.bidOpportunityId),
                            this.packageService.getGroupmembers(+this.bidOpportunityId)
                        )
                            .subscribe(([res1, res2, res3]) => {
                                // res 2
                                (res2 || []).some(item => {
                                    if (item.groupName = 'ChuDauTu') {
                                        this.investor = item.customers;
                                        return true;
                                    } else {
                                        return false;
                                    }
                                });
                                // res3
                                this.groupmembersList = res3;
                                this.mappingLiveForm(this.groupmembersList);
                                // res 1
                                this.createForm(res1, true);
                            });
                    }
                });
        }
    }

    mappingLiveForm(groupmembersList) {
        groupmembersList.forEach((item, index) => {
            switch (item.groupName) {
                case 'ChuTriDuAn': {
                    // Đề xuất tham gia dự thầu
                    this.suggestionsToParticipate = item.users;
                    // Câu hỏi làm rõ HSMT
                    this.clarificationQuestion = item.users;
                    // Lựa chọn giá thầu phụ/ NCC
                    this.selectSubcontractor = item.users;
                    // Nhập giá dự toán + tích hợp lợi nhuận, check BoQ + trình duyệt giá
                    this.entryPriceEstimates = item.users;
                    break;
                }
                case 'NguoiPhanPhoiHoSo': {
                    // Phân phối HSMT và cập nhật cho các bộ phận liên quan
                    this.distributorOfDocHSMT = item.users;
                    break;
                }
                case 'ChuTriKhoiLuong': {
                    // Tính và kiểm tra khối lượng theo HSMT
                    this.checkVolumeHSMT = item.users;
                    break;
                }
                case 'ChuyenVienGoiGia': {
                    // Lọc hồ sơ, gửi yêu cầu báo giá cho thầu phụ/ NCC, làm rõ báo giá
                    this.filterProfiles = item.users;
                    break;
                }
                case 'ChuTriMEP': {
                    // Lọc hồ sơ, gửi yêu cầu báo giá cho thầu phụ/ NCC, làm rõ báo giá, lựa chọn giá TP/ NCC
                    this.filterAndSendRequest = item.users;
                    break;
                }
                case 'ChuNhiemGoiPrelims': {
                    // Tính toán chi phí chung
                    this.generalCostCalculation = item.users;
                    break;
                }
                case 'ChuNhiemPhanKyThuat': {
                    // Mặt bằng bố trí công trình
                    this.siteLayout = item.users;
                    break;
                }
                case 'ChuNhiemToHoSo': {
                    // Chuẩn bị các hồ sơ pháp lý theo yêu cầu HSMT
                    this.preparationLegalDoc = item.users;
                    break;
                }
                case 'ChuNhiemPhapLy': {
                    // Kiểm tra và lưu ý các điều kiện hợp đồng, tài chính đặc biệt để P.DT dự trù giá
                    this.checkAndSaveConditions = item.users;
                    break;
                }
            }
            this.surveyOrganization = [];
            // tslint:disable-next-line:max-line-length
            // Tổ chức đi khảo sát hiện trạng dự án
            this.surveyOrganization = ((this.surveyOrganization.concat(this.suggestionsToParticipate)).concat(this.generalCostCalculation)).concat(this.otherTechnicalRecords);
            // Tính và kiểm tra khối lượng BPTC
            this.checkVolumeBPTC = this.checkVolumeHSMT;
            // Làm rõ các thắc mắc trong quá trình tính toán khối lượng
            this.clarifyQuestion = this.checkVolumeHSMT;
            // Yêu cầu báo giá/phản hồi thông tin báo giá - quan trắc, trắc đạc, hạ mực nước ngầm công trình
            this.requestQuote = this.filterProfiles;
            // Báo giá biện pháp thi công
            this.constructionQuotes = this.filterProfiles;
            // BPTC tầng hầm
            this.basementBPTC = this.siteLayout;
            // Quan trắc
            this.monitoring = this.siteLayout;
            // BPTC cốp pha, cốt thép, bê tông
            this.formworkReinforcementConcrete = this.siteLayout;
            // Hồ sơ kỹ thuật khác
            this.otherTechnicalRecords = this.siteLayout;
            // Hiệu chỉnh, kiểm tra, hoàn thiện BPTC, chuyển giao BPTC cho tổ hồ sơ pháp lý
            this.calibrationCheckFinish = this.siteLayout;
            // Photo, đóng gói hồ sơ nộp thầu
            this.photoHungryPack = this.preparationLegalDoc;
            // Đặt câu hỏi làm rõ các điều khoản hợp đồng
            this.askClarificationQuestions = this.checkAndSaveConditions;
        });
    }

    createForm(planModel: TenderPreparationPlanningRequest, isCreate?) {
        console.log('tạo mới', isCreate);
        this.tenderPlan = planModel;
        const taskArr = [];
        planModel.tasks.forEach((i, index) => taskArr.push(this.createTaskItemFG(i, index, isCreate)));
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
        this.controlDisableForm = this.routerAction === 'view' ? true : false;

        this.tasksFA.controls.forEach((item, index) => {
            this.calculateTotalTime(index);
        });
        this.changeDirector(this.planForm.get('projectDirectorEmployeeId').value, 0);
        this.changeDirector(this.planForm.get('tenderDepartmentEmployeeId').value, 1);
        this.changeDirector(this.planForm.get('technicalDepartmentEmployeeId').value, 2);
        this.changeDirector(this.planForm.get('bimDepartmentEmployeeId').value, 3);
        setTimeout(() => {
            //  const a = this.planForm.value.tasks.max(x => x.startDate);
            console.log(this.planForm.value.tasks.filter(x => x.startDate > 0));
            const array = this.planForm.value.tasks.filter(x => x.startDate > 0).map(y => y.startDate);
            let minDate;
            if (array && array.length) {
                minDate = new Date(Math.min.apply(null, array));
            }
            if (this.ganttChart && this.planForm) {
                kendo.jQuery(this.ganttChart.nativeElement).kendoGantt({
                    //  toolbar: ['pdf'],
                    views: [
                        { type: 'day' },
                        { type: 'week', selected: true },
                        { type: 'month', slotSize: 250 },
                        //  { type: 'year', slotSize: 150}

                    ],
                    range: {
                        start: minDate
                    },
                    columns: [
                        { field: 'title', title: 'Công việc', width: 200 },
                        { field: 'employeeName', title: 'Phân công', width: 200 },

                    ],
                    tooltip: {
                        visible: true,
                        template: `<div style="display: flex; flex-direction: column;"><div>#= task.title # </div>
                        <div>#= kendo.format('{0:dd/MM/yyyy HH:mm}', task.start) #</div>
                        <div>#= kendo.format('{0:dd/MM/yyyy HH:mm}', task.end) #</div>`
                    },
                    // taskTemplate: `<div style="display: flex; flex-direction: column;"><div>#= data.employeeName # #= data.title #  </div>`,
                    // height: 3250,
                    // 2832
                    // listWidth: 400,
                    // showWorkHours: false,
                    // showWorkDays: true,
                    // workWeekStart: 1,
                    // workWeekEnd: 7,
                    editable: false,
                    // snap: false,
                    // workDayStart: new Date('01/01/1970'),
                    height: window.screen.availHeight * 0.7
                }).data('kendoGantt');
                this.updateGantt();
                this.planForm.valueChanges.subscribe(_ => {
                    this.updateGantt();
                    // this.enableCheckbox();
                });
            }
        }, 800);
    }

    // valueChangeNg() {
    // }

    getEmailUser(userId: number): string {
        // tslint:disable-next-line:triple-equals
        // tslint:disable-next-line:max-line-length
        return (this.userList && this.userList.find(i => i.employeeId === Number(userId))) ? this.userList.find(i => i.employeeId === Number(userId)).email : '';
    }

    changeDirector(userId, personnelType) {
        console.log('Value', this.tasksFA.controls[2].get('whoIsInChargeIds').value);
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
                    end: i.finishDate,
                    employeeName: i.employeeName ? i.employeeName : ''
                };
            })
        });
        this.gantt = kendo.jQuery(this.ganttChart.nativeElement).data('kendoGantt');
        this.gantt.setDataSource(dataSource);
    }

    createTaskItemFG(data: TenderPreparationPlanItem, indexForm: number, isCreate: boolean): FormGroup {
        let whoIsInChargeIds = [];
        if (isCreate) {
            switch (indexForm) {
                case 0: {
                    break;
                }
                case 1: {
                    if (this.distributorOfDocHSMT) {
                        whoIsInChargeIds = this.distributorOfDocHSMT;
                    }
                    break;
                }
                case 2: {
                    if (this.suggestionsToParticipate) {
                        whoIsInChargeIds = this.suggestionsToParticipate;
                    }
                    break;
                }
                case 3: {
                    if (this.clarificationQuestion) {
                        whoIsInChargeIds = this.clarificationQuestion;
                    }
                    break;
                }
                case 4: {
                    break;
                }
                case 5: {
                    if (this.surveyOrganization) {
                        whoIsInChargeIds = this.surveyOrganization;
                    }
                    break;
                }
                case 6: {
                    break;
                }
                case 7: {
                    if (this.checkVolumeHSMT) {
                        whoIsInChargeIds = this.checkVolumeHSMT;
                    }
                    break;
                }
                case 8: {
                    if (this.checkVolumeBPTC) {
                        whoIsInChargeIds = this.checkVolumeBPTC;
                    }
                    break;
                }
                case 9: {
                    if (this.clarifyQuestion) {
                        whoIsInChargeIds = this.clarifyQuestion;
                    }
                    break;
                }
                case 10: {
                    break;
                }
                case 11: {
                    if (this.filterProfiles) {
                        whoIsInChargeIds = this.filterProfiles;
                    }
                    break;
                }
                case 12: {
                    if (this.requestQuote) {
                        whoIsInChargeIds = this.requestQuote;
                    }
                    break;
                }
                case 13: {
                    if (this.constructionQuotes) {
                        whoIsInChargeIds = this.constructionQuotes;
                    }
                    break;
                }
                case 14: {
                    break;
                }
                case 15: {
                    if (this.filterAndSendRequest) {
                        whoIsInChargeIds = this.filterAndSendRequest;
                    }
                    break;
                }
                case 16: {
                    break;
                }
                case 17: {
                    if (this.generalCostCalculation) {
                        whoIsInChargeIds = this.generalCostCalculation;
                    }
                    break;
                }
                case 18: {
                    break;
                }
                case 19: {
                    if (this.selectSubcontractor) {
                        whoIsInChargeIds = this.selectSubcontractor;
                    }
                    break;
                }
                case 20: {
                    if (this.entryPriceEstimates) {
                        whoIsInChargeIds = this.entryPriceEstimates;
                    }
                    break;
                }
                case 21: {
                    break;
                }
                case 22: {
                    if (this.siteLayout) {
                        whoIsInChargeIds = this.siteLayout;
                    }
                    break;
                }
                case 23: {
                    if (this.basementBPTC) {
                        whoIsInChargeIds = this.basementBPTC;
                    }
                    break;
                }
                case 24: {
                    if (this.monitoring) {
                        whoIsInChargeIds = this.monitoring;
                    }
                    break;
                }
                case 25: {
                    if (this.formworkReinforcementConcrete) {
                        whoIsInChargeIds = this.formworkReinforcementConcrete;
                    }
                    break;
                }
                case 26: {
                    if (this.otherTechnicalRecords) {
                        whoIsInChargeIds = this.otherTechnicalRecords;
                    }
                    break;
                }
                case 27: {
                    if (this.calibrationCheckFinish) {
                        whoIsInChargeIds = this.calibrationCheckFinish;
                    }
                    break;
                }
                case 28: {
                    break;
                }
                case 29: {
                    if (this.preparationLegalDoc) {
                        whoIsInChargeIds = this.preparationLegalDoc;
                    }
                    break;
                }
                case 30: {
                    if (this.photoHungryPack) {
                        whoIsInChargeIds = this.photoHungryPack;
                    }
                    break;
                }
                case 31: {
                    break;
                }
                case 32: {
                    if (this.checkAndSaveConditions) {
                        whoIsInChargeIds = this.checkAndSaveConditions;
                    }
                    break;
                }
                case 33: {
                    if (this.askClarificationQuestions) {
                        whoIsInChargeIds = this.askClarificationQuestions;
                    }
                    break;
                }
            }
        }
        whoIsInChargeIds.forEach(item => {
            item.employeeName = item.userName;
        });
        console.log('whoIsInChargeIds', whoIsInChargeIds, isCreate, data.whoIsInCharges);
        const isFinishDisabled =
            (this.checkStatusPackage[this.packageInfo.stageStatus.id].id > this.checkStatusPackage.ThamGiaDuThau.id &&
                this.checkStatusPackage[this.packageInfo.stageStatus.id].id < this.checkStatusPackage.ChoKetQuaDuThau.id);
        return this.fb.group({
            itemId: data.itemId,
            itemNo: data.itemNo,
            itemName: data.itemName,
            itemDesc: {
                value: data.itemDesc,
                disabled: this.controlDisableForm,
            },
            employeeName: data.whoIsInCharge && data.whoIsInCharge.employeeName,
            whoIsInChargeId: {
                value: null,
                disabled: this.controlDisableForm,
            },
            // {
            //     value: data.whoIsInChargeId === 0 ? null : data.whoIsInChargeId,
            //     disabled: this.controlDisableForm,
            // },
            whoIsInChargeIds: {
                value: isCreate ? whoIsInChargeIds : ((data.whoIsInCharges && data.whoIsInCharges.length !== 0) ? data.whoIsInCharges : []),
                disabled: this.controlDisableForm,
            },
            // {
            //     value: (data.whoIsInCharges && data.whoIsInCharges.length !== 0) ? data.whoIsInCharges : [],
            //     disabled: this.controlDisableForm,
            // },
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
        if (this.checkQueryDeadline()) {
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
        } else {
            this.alertService.error(`Ngày đặt câu hỏi cần nhỏ hơn ngày nộp HSMT.`);
        }
    }

    checkQueryDeadline(): boolean {
        if (this.packageInfo && this.packageInfo.submissionDate && this.planForm.get('queryDeadline').value) {
            if (DateTimeConvertHelper.fromDtObjectToTimestamp(this.planForm.get('queryDeadline').value)
                > this.packageInfo.submissionDate) {
                return false;
            } else {
                return true;
            }
        } else {
            return true;
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



    calculateTotalTime(index) {
        const end = DateTimeConvertHelper.fromDtObjectToSecon((this.tasksFA.controls[index]).get('finishDate').value);
        const start = DateTimeConvertHelper.fromDtObjectToSecon((this.tasksFA.controls[index]).get('startDate').value);
        if (start && end) {
            this.tasksFA.controls[index].get('totalTime').patchValue(
                Math.floor((end - start) / (60 * 60 * 24)) + 1
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
        this.checkAndCreateForm();
    }


    showGantt() {
        this.isShowGantt = true;
        setTimeout(() => {
            this.updateGantt();
            window.dispatchEvent(new Event('resize'));
        }, 500);
    }

    updateGarttIsShow() {
        setTimeout(() => {
            if (this.ganttChart) {
                kendo.jQuery(this.ganttChart.nativeElement).kendoGantt({
                    views: [
                        { type: 'day', selected: true },
                        { type: 'week' },
                        'month'
                    ],
                    tooltip: {
                        visible: true,
                        template: `<div style="display: flex; flex-direction: column;"><div>#= task.title # </div>
                        <div>#= kendo.format('{0:dd/MM/yyyy HH:mm}', task.start) #</div>
                        <div>#= kendo.format('{0:dd/MM/yyyy HH:mm}', task.end) #</div>`
                    },

                    // height: 3250,
                    // 2832
                    // listWidth: 0,
                    showWorkHours: false,
                    showWorkDays: false,
                    editable: false,
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

}
