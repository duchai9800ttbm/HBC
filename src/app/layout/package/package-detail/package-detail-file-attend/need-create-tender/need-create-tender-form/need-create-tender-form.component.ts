import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProposeTenderParticipateRequest } from '../../../../../../shared/models/api-request/package/propose-tender-participate-request';
import { PackageService } from '../../../../../../shared/services/package.service';
import {
    AlertService,
    SessionService,
    ConfirmationService
} from '../../../../../../shared/services';
import { NgxSpinnerService } from 'ngx-spinner';
import { PackageDetailComponent } from '../../../package-detail.component';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { PackageInfoModel } from '../../../../../../shared/models/package/package-info.model';
import { switchMap } from 'rxjs/operators';
import { NeedCreateTenderComponent } from '../need-create-tender.component';
import { BidStatus } from '../../../../../../shared/constants/bid-status';
import DateTimeConvertHelper from '../../../../../../shared/helpers/datetime-convert-helper';
import { ScrollToTopService } from '../../../../../../shared/services/scroll-to-top.service';
import { EstimatedBudgetPackage } from '../../../../../../shared/models/package/estimated-budget-package';
import { Currency } from '../../../../../../shared/models/currency';
import { FeeTenderInvitationDocument } from '../../../../../../shared/models/package/fee-tender-invitation-document';
import { ContractConditionTenderParticipate } from '../../../../../../shared/models/package/contract-condition-tender-participate';
import { TenderDirectorProposal } from '../../../../../../shared/models/package/tender-director-proposal';
import { DecisionBoardGeneralDirector } from '../../../../../../shared/models/package/decision-board-general-director';
import { PermissionService } from '../../../../../../shared/services/permission.service';
import { PermissionModel } from '../../../../../../shared/models/permission/Permission.model';

@Component({
    selector: 'app-need-create-tender-form',
    templateUrl: './need-create-tender-form.component.html',
    styleUrls: ['./need-create-tender-form.component.scss']
})
export class NeedCreateTenderFormComponent implements OnInit, OnDestroy {
    static formModel: ProposeTenderParticipateRequest;
    bidOpportunityId;
    packageInfo: PackageInfoModel;
    routerAction: string;
    dataModel: ProposeTenderParticipateRequest;
    dataModelCopy: ProposeTenderParticipateRequest;
    bidStatus = BidStatus;
    isShowDialog = false;
    dateApproveBid = new Date();
    totalTime = '';
    draftsOrOfficially = true;
    isShowChanges = false;
    updatedDetail = '';
    listPermission: Array<PermissionModel>;
    listPermissionScreen = [];
    TaoMoiDNDT = false;
    XemDNDT = false;
    SuaDNDT = false;
    XoaDNDT = false;
    InDNDT = false;
    XacNhanKy = false;
    GuiDuyetDNDT = false;
    ChapThuanKhongChapThuan = false;
    TaiTemplate = false;
    constructor(
        private packageService: PackageService,
        private alertService: AlertService,
        private spinner: NgxSpinnerService,
        private router: Router,
        private sessionService: SessionService,
        private scrollTopService: ScrollToTopService,
        private confirmService: ConfirmationService,
        private permissionService: PermissionService
    ) { }

    ngOnInit() {
        this.scrollTopService.isScrollTop = false;
        this.routerAction = this.packageService.routerAction;
        // phân quyền
        this.permissionService.get().subscribe(data => {
            this.listPermission = data;
            const hsdt = this.listPermission.length &&
                this.listPermission.filter(x => x.bidOpportunityStage === 'HSDT')[0];
            console.log(this.listPermission);
            if (!hsdt) {
                this.listPermissionScreen = [];
            }
            if (hsdt) {
                const screen = hsdt.userPermissionDetails.length
                    && hsdt.userPermissionDetails.filter(y => y.permissionGroup.value === 'PhieuDeNghiDuThau')[0];
                if (!screen) {
                    this.listPermissionScreen = [];
                }
                if (screen) {
                    this.listPermissionScreen = screen.permissions.map(z => z.value);
                }
            }
            this.TaoMoiDNDT = this.listPermissionScreen.includes('TaoMoiDNDT');
            this.XemDNDT = this.listPermissionScreen.includes('XemDNDT');
            this.SuaDNDT = this.listPermissionScreen.includes('SuaDNDT');
            this.XoaDNDT = this.listPermissionScreen.includes('XoaDNDT');
            this.InDNDT = this.listPermissionScreen.includes('InDNDT');
            this.XacNhanKy = this.listPermissionScreen.includes('XacNhanKy');
            this.GuiDuyetDNDT = this.listPermissionScreen.includes('GuiDuyetDNDT');
            this.ChapThuanKhongChapThuan = this.listPermissionScreen.includes('ChapThuanKhongChapThuan');
            this.TaiTemplate = this.listPermissionScreen.includes('TaiTemplate');
        });
        this.packageService.routerAction$.subscribe(
            router => {
                this.routerAction = router;
                if (this.routerAction === 'create') {
                    // ======================
                    // EstimatedBudgetPackage
                    NeedCreateTenderFormComponent.formModel.estimatedBudgetOfPakage = new EstimatedBudgetPackage();
                    NeedCreateTenderFormComponent.formModel.estimatedBudgetOfPakage.draftBudgetOfPackageCurrency = new Currency();
                    NeedCreateTenderFormComponent.formModel.estimatedBudgetOfPakage.draftBudgetOfPackageCurrency.key = 'VNĐ';
                    NeedCreateTenderFormComponent.formModel.estimatedBudgetOfPakage.draftBudgetOfPackageCurrency.value = 'VNĐ';
                    NeedCreateTenderFormComponent.formModel.estimatedBudgetOfPakage.draftBudgetOfPackageCurrency.displayText = 'VNĐ';
                    // =======================
                    // FeeTenderInvitationDocument
                    NeedCreateTenderFormComponent.formModel.feeOfTenderInvitationDocument = new FeeTenderInvitationDocument();
                    // tslint:disable-next-line:max-line-length
                    NeedCreateTenderFormComponent.formModel.feeOfTenderInvitationDocument.feeOfTenderInvitationDocumentCurrency = new Currency();
                    NeedCreateTenderFormComponent.formModel.feeOfTenderInvitationDocument.feeOfTenderInvitationDocumentCurrency.key = 'VNĐ';
                    // tslint:disable-next-line:max-line-length
                    NeedCreateTenderFormComponent.formModel.feeOfTenderInvitationDocument.feeOfTenderInvitationDocumentCurrency.value = 'VNĐ';
                    // tslint:disable-next-line:max-line-length
                    NeedCreateTenderFormComponent.formModel.feeOfTenderInvitationDocument.feeOfTenderInvitationDocumentCurrency.displayText = 'VNĐ';
                    NeedCreateTenderFormComponent.formModel.feeOfTenderInvitationDocument.tenderDocumentDepositCurrency = new Currency();
                    NeedCreateTenderFormComponent.formModel.feeOfTenderInvitationDocument.tenderDocumentDepositCurrency.key = 'VNĐ';
                    NeedCreateTenderFormComponent.formModel.feeOfTenderInvitationDocument.tenderDocumentDepositCurrency.value = 'VNĐ';
                    NeedCreateTenderFormComponent.formModel.feeOfTenderInvitationDocument.tenderDocumentDepositCurrency.displayText = 'VNĐ';
                    // ======================
                    // ContractConditionTenderParticipate
                    NeedCreateTenderFormComponent.formModel.contractCondition = new ContractConditionTenderParticipate();
                    NeedCreateTenderFormComponent.formModel.contractCondition.timeForCompletion = 0;
                    NeedCreateTenderFormComponent.formModel.contractCondition.timeForCompletionUnit = new Currency();
                    NeedCreateTenderFormComponent.formModel.contractCondition.timeForCompletionUnit.key = 'Ngày';
                    NeedCreateTenderFormComponent.formModel.contractCondition.timeForCompletionUnit.value = 'Ngày';
                    NeedCreateTenderFormComponent.formModel.contractCondition.timeForCompletionUnit.displayText = 'Ngày';
                    NeedCreateTenderFormComponent.formModel.contractCondition.warrantyPeriod = 0;
                    NeedCreateTenderFormComponent.formModel.contractCondition.warrantyPeriodUnit = new Currency();
                    NeedCreateTenderFormComponent.formModel.contractCondition.warrantyPeriodUnit.key = 'Ngày';
                    NeedCreateTenderFormComponent.formModel.contractCondition.warrantyPeriodUnit.value = 'Ngày';
                    NeedCreateTenderFormComponent.formModel.contractCondition.warrantyPeriodUnit.displayText = 'Ngày';
                    NeedCreateTenderFormComponent.formModel.contractCondition.tenderSecurity = 0;
                    NeedCreateTenderFormComponent.formModel.contractCondition.tenderSecurityCurrency = new Currency();
                    NeedCreateTenderFormComponent.formModel.contractCondition.tenderSecurityCurrency.key = 'VNĐ';
                    NeedCreateTenderFormComponent.formModel.contractCondition.tenderSecurityCurrency.value = 'VNĐ';
                    NeedCreateTenderFormComponent.formModel.contractCondition.tenderSecurityCurrency.displayText = 'VNĐ';
                    NeedCreateTenderFormComponent.formModel.contractCondition.performanceSecurity = 0;
                    NeedCreateTenderFormComponent.formModel.contractCondition.delayDamagesForTheWorks = 0;
                    NeedCreateTenderFormComponent.formModel.contractCondition.advancePayment = 0;
                    NeedCreateTenderFormComponent.formModel.contractCondition.retentionMoney = 0;
                    // =====================
                    // TenderDirectorProposal
                    NeedCreateTenderFormComponent.formModel.tenderDirectorProposal = new TenderDirectorProposal();
                    // tslint:disable-next-line:max-line-length
                    NeedCreateTenderFormComponent.formModel.tenderDirectorProposal.expectedDate = DateTimeConvertHelper.fromDtObjectToTimestamp(new Date());
                    NeedCreateTenderFormComponent.formModel.tenderDirectorProposal.date = DateTimeConvertHelper.fromDtObjectToTimestamp(new Date());
                    NeedCreateTenderFormComponent.formModel.tenderDirectorProposal.isSigned = false;
                    NeedCreateTenderFormComponent.formModel.tenderDirectorProposal.isAgreed = true;
                    NeedCreateTenderFormComponent.formModel.tenderDirectorProposal.reason = '';
                    // ====================
                    // DecisionBoardGeneralDirector
                    NeedCreateTenderFormComponent.formModel.decisionOfBoardOfGeneralDirector = new DecisionBoardGeneralDirector();
                    NeedCreateTenderFormComponent.formModel.decisionOfBoardOfGeneralDirector.reason = '';
                }
            }
        );
        if (!NeedCreateTenderFormComponent.formModel) {
        }
        this.dataModel = NeedCreateTenderFormComponent.formModel;
        this.dataModelCopy = Object.assign({}, this.dataModel);
        // tslint:disable-next-line:max-line-length
        this.dateApproveBid =
            this.dataModel &&
                this.dataModel.tenderDirectorProposal &&
                this.dataModel.tenderDirectorProposal.expectedDate
                ? DateTimeConvertHelper.fromTimestampToDtObject(
                    this.dataModel.tenderDirectorProposal.expectedDate * 1000
                )
                : new Date();
        this.bidOpportunityId = PackageDetailComponent.packageId;
        if (!NeedCreateTenderFormComponent.formModel) {
            this.router.navigate([
                `package/detail/${
                PackageDetailComponent.packageId
                }/attend/create-request`
            ]);
        } else {
            this.getPackageInfo();
        }
    }

    refresh() {
        this.getPackageInfo();
        this.packageService
            .getProposedTenderParticipateReport(this.bidOpportunityId)
            .subscribe(
                data => {
                    if (data) {
                        NeedCreateTenderFormComponent.formModel = data;
                    } else {
                        NeedCreateTenderFormComponent.formModel = new ProposeTenderParticipateRequest();
                    }
                    this.spinner.hide();
                },
                err => {
                    this.spinner.hide();
                    this.alertService.error(
                        'Lấy thông tin phiếu đề nghị dự thầu thất bại!'
                    );
                }
            );
    }

    getPackageInfo() {
        this.spinner.show();
        this.packageService
            .getInforPackageID(this.bidOpportunityId)
            .subscribe(data => {
                this.packageInfo = data;
                this.spinner.hide();
                this.totalTime = '';
                if (
                    this.packageInfo.submissionDate &&
                    this.packageInfo.startTrackingDate
                ) {
                    const day =
                        Math.abs(
                            this.packageInfo.submissionDate -
                            this.packageInfo.startTrackingDate
                        ) /
                        (60 * 60 * 24);
                    this.totalTime = `${day} ngày (days)`;
                }
            });
    }

    onSubmit(isDraf: boolean) {
        NeedCreateTenderFormComponent.formModel.isDraftVersion = isDraf;
        NeedCreateTenderFormComponent.formModel.bidOpportunityId = this.bidOpportunityId;
        if (NeedCreateTenderFormComponent.formModel.createdEmployeeId) {
            NeedCreateTenderFormComponent.formModel.updatedEmployeeId = this.sessionService.currentUser.employeeId;
        } else {
            NeedCreateTenderFormComponent.formModel.createdEmployeeId = this.sessionService.currentUser.employeeId;
        }
        // NeedCreateTenderFormComponent.formModel.isAgreedParticipating = false;
        NeedCreateTenderFormComponent.formModel.isAgreedParticipating
            = NeedCreateTenderFormComponent.formModel.tenderDirectorProposal ?
                NeedCreateTenderFormComponent.formModel.tenderDirectorProposal.isAgreed : true;
        this.spinner.show();
        this.packageService
            .createOrUpdateProposedTenderParticipateReport(
                NeedCreateTenderFormComponent.formModel
            )
            .subscribe(
                data => {
                    this.spinner.hide();
                    this.router.navigate([
                        `package/detail/${
                        PackageDetailComponent.packageId
                        }/attend/create-request`
                    ]);
                    if (NeedCreateTenderFormComponent.formModel.id) {
                        this.alertService.success(
                            'Cập nhật phiếu đề nghị dự thầu thành công!'
                        );
                    } else {
                        this.alertService.success(
                            'Tạo phiếu đề nghị dự thầu thành công!'
                        );
                    }
                },
                err => {
                    if (NeedCreateTenderFormComponent.formModel.id) {
                        this.alertService.error(
                            'Cập nhật phiếu đề nghị dự thầu thất bại!'
                        );
                    } else {
                        this.alertService.error(
                            'Tạo phiếu đề nghị dự thầu thất bại!'
                        );
                    }
                    this.spinner.hide();
                }
            );
    }

    cancel() {
        NeedCreateTenderFormComponent.formModel = Object.assign(
            {},
            this.dataModelCopy
        );
        this.packageService.setRouterAction('view');
        this.router.navigate([
            `package/detail/${
            this.bidOpportunityId
            }/attend/create-request`
        ]);
    }

    edit() {
        this.packageService.setRouterAction('edit');
        this.router.navigate([
            `package/detail/${
            this.bidOpportunityId
            }/attend/create-request/form/edit`
        ]);
    }

    sendApproveBidProposal() {
        this.spinner.show();
        this.packageService
            .sendApproveBidProposal(
                this.bidOpportunityId,
                DateTimeConvertHelper.fromDtObjectToSecon(this.dateApproveBid)
            )
            .subscribe(
                data => {
                    this.getProposedTenderParticipateReportInfo();
                    this.spinner.hide();
                    this.isShowDialog = false;
                    // this.getPackageInfo();
                    this.router.navigate([
                        `package/detail/${
                        this.bidOpportunityId
                        }/attend/create-request`
                    ]);
                    this.alertService.success(
                        'Gửi duyệt đề nghị dự thầu thành công!'
                    );
                },
                err => {
                    this.spinner.hide();
                    this.alertService.error(
                        'Gửi duyệt đề nghị dự thầu thất bại!'
                    );
                    this.isShowDialog = false;
                }
            );
    }

    getProposedTenderParticipateReportInfo() {
        this.spinner.show();
        this.packageService.getProposedTenderParticipateReport(this.bidOpportunityId).subscribe(data => {
            if (data) {
                NeedCreateTenderFormComponent.formModel = data;
            } else {
                NeedCreateTenderFormComponent.formModel = new ProposeTenderParticipateRequest();
            }
            this.spinner.hide();
        }, err => {
            this.spinner.hide();
            // this.alertService.error('Lấy thông tin phiếu đề nghị dự thầu thất bại!');
        });
    }

    closeDialog() {
        this.isShowDialog = false;
        // this.isNotAgreeParticipating = false;
    }

    closeShowChanges() {
        this.isShowChanges = false;
        this.updatedDetail = '';
    }

    ngOnDestroy() {
        this.scrollTopService.isScrollTop = true;
    }

    saveDrafts() {
        // this.isShowChanges = true;
        // this.draftsOrOfficially = true;
        this.onSubmit(true);
    }

    saveOfficially() {
        // this.draftsOrOfficially = false;
        if (NeedCreateTenderFormComponent.formModel.id) {
            if (NeedCreateTenderFormComponent.formModel && !NeedCreateTenderFormComponent.formModel.isDraftVersion) {
                this.isShowChanges = true;
            } else {
                this.onSubmit(false);
            }
        } else {
            this.onSubmit(false);
        }
    }

    saveChangesLiveForm() {
        NeedCreateTenderFormComponent.formModel.updatedDesc = this.updatedDetail;
        this.onSubmit(false);
        this.updatedDetail = '';
    }

    checkSigned() {
        if (NeedCreateTenderFormComponent.formModel.tenderDirectorProposal.isSigned) {
            this.isShowDialog = true;
        } else {
            this.isShowDialog = false;
            this.confirmService.missAction('Đề nghị dự thầu chưa được xác nhận ký bởi giám đốc dự thầu',
                `/package/detail/${this.bidOpportunityId}/attend/create-request/form/edit/director-proposal`);
        }
    }
    actionSaveChangesLiveForm(e) {
        if (e.code === 'Enter') {
            this.saveChangesLiveForm();
        }
    }
}
