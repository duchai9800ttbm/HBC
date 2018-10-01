import { Component, OnInit, AfterViewInit, Input, AfterViewChecked, AfterContentChecked } from '@angular/core';
import { TenderPriceApproval } from '../../../../../../shared/models/price-review/price-review.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import DateTimeConvertHelper from '../../../../../../shared/helpers/datetime-convert-helper';
import { PriceReviewService } from '../../../../../../shared/services/price-review.service';
import { PackageDetailComponent } from '../../../package-detail.component';
import { NgxSpinnerService } from '../../../../../../../../node_modules/ngx-spinner';
import { PackageInfoModel } from '../../../../../../shared/models/package/package-info.model';
import { PackageService } from '../../../../../../shared/services/package.service';
import { Router } from '../../../../../../../../node_modules/@angular/router';

@Component({
  selector: 'app-price-review-form',
  templateUrl: './price-review-form.component.html',
  styleUrls: ['./price-review-form.component.scss']
})
export class PriceReviewFormComponent implements OnInit, AfterViewInit {
  priceReviewForm: FormGroup;
  package = new PackageInfoModel();

  constructor(
    private fb: FormBuilder,
    private priceReviewService: PriceReviewService,
    private spinner: NgxSpinnerService,
    private packageService: PackageService,
    private router: Router
  ) { }
  isModeView;
  isModeCreate;
  isModeEdit;
  packageId;
  @Input() model: TenderPriceApproval;
  @Input() type: string;

  ngOnInit() {
    //  document.getElementById('content-right').style.maxHeight = `${elementHeight}`;
    this.getModeScreen();
    this.packageId = PackageDetailComponent.packageId;
    this.getInfoPackge();
    this.createForm();
    this.checkDuyet();
  }

  ngAfterViewInit() {
    const tableReview = $('#table-review').height();
    $('#comment-scroll').height(tableReview + 29);
    $('#comment-scroll').css('min-height', `${tableReview + 29}px`);
  }
  onResize() {
    const tableReview = $('#table-review').height();
    $('#comment-scroll').height(tableReview + 29);
    $('#comment-scroll').css('min-height', `${tableReview + 29}px`);
  }
  getModeScreen() {
    this.isModeView = this.type === 'detail';
    this.isModeCreate = this.type === 'create';
    this.isModeEdit = this.type === 'edit';
  }

  getInfoPackge() {
    this.spinner.show();
    this.packageService.getInforPackageID(this.packageId).subscribe(result => {
      this.package = result;
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
    });
  }
  createForm() {
    this.priceReviewForm = this.fb.group({
      // Thông tin dự án
      id: this.model.id,
      infoGfa: {
        value: this.model.projectInformation && this.model.projectInformation.gfa,
        disabled: this.isModeView
      },
      phanMongCheck: {
        value: this.model.projectInformation
          && this.model.projectInformation.foudationPart
          && this.model.projectInformation.foudationPart.scopeOfWorkIsInclude ?
          this.model.projectInformation.foudationPart.scopeOfWorkIsInclude : null,
        disabled: this.isModeView
      },
      phanMongDesc: {
        value: this.model.projectInformation
          && this.model.projectInformation.foudationPart
          && this.model.projectInformation.foudationPart.scopeOfWorkDesc,
        disabled: this.isModeView
      },

      phanHamCheck: {
        value: this.model.projectInformation
          && this.model.projectInformation.basementPart
          && this.model.projectInformation.basementPart.scopeOfWorkIsInclude ?
          this.model.projectInformation.basementPart.scopeOfWorkIsInclude : null,
        disabled: this.isModeView
      },
      phanHamDesc: {
        value: this.model.projectInformation
          && this.model.projectInformation.basementPart
          && this.model.projectInformation.basementPart.scopeOfWorkDesc,
        disabled: this.isModeView
      },

      ketCauCheck: {
        value: this.model.projectInformation
          && this.model.projectInformation.basementPartConstructionStructure
          && this.model.projectInformation.basementPartConstructionStructure.scopeOfWorkIsInclude ?
          this.model.projectInformation.basementPartConstructionStructure.scopeOfWorkIsInclude : null,
        disabled: this.isModeView

      },
      ketCauDesc: {
        value: this.model.projectInformation
          && this.model.projectInformation.basementPartConstructionStructure
          && this.model.projectInformation.basementPartConstructionStructure.scopeOfWorkDesc,
        disabled: this.isModeView
      },

      hoanThienCheck: {
        value: this.model.projectInformation
          && this.model.projectInformation.basementPartConstructionCompletion
          && this.model.projectInformation.basementPartConstructionCompletion.scopeOfWorkIsInclude ?
          this.model.projectInformation.basementPartConstructionCompletion.scopeOfWorkIsInclude : null,
        disabled: this.isModeView
      },

      hoanThienDesc: {
        value: this.model.projectInformation
          && this.model.projectInformation.basementPartConstructionCompletion
          && this.model.projectInformation.basementPartConstructionCompletion.scopeOfWorkDesc,
        disabled: this.isModeView

      },
      congViecKhacCheck: {
        value: this.model.projectInformation
          && this.model.projectInformation.basementPartOtherWork
          && this.model.projectInformation.basementPartOtherWork.scopeOfWorkIsInclude ?
          this.model.projectInformation.basementPartOtherWork.scopeOfWorkIsInclude : null,
        disabled: this.isModeView
      },
      congViecKhacDesc: {
        value: this.model.projectInformation
          && this.model.projectInformation.basementPartOtherWork
          && this.model.projectInformation.basementPartOtherWork.scopeOfWorkDesc,
        disabled: this.isModeView
      },
      phanThanCheck: {
        value: this.model.projectInformation
          && this.model.projectInformation.bodyPart
          && this.model.projectInformation.bodyPart.scopeOfWorkIsInclude ?
          this.model.projectInformation.basementPartOtherWork.scopeOfWorkIsInclude : null,
        disabled: this.isModeView

      },
      phanThanDesc: {
        value: this.model.projectInformation
          && this.model.projectInformation.bodyPart
          && this.model.projectInformation.bodyPart.scopeOfWorkDesc,
        disabled: this.isModeView
      },

      phanThanKetCauCheck: {
        value: this.model.projectInformation
          && this.model.projectInformation.bodyPartConstructionStructure
          && this.model.projectInformation.bodyPartConstructionStructure.scopeOfWorkIsInclude ?
          this.model.projectInformation.bodyPartConstructionStructure.scopeOfWorkIsInclude : null,
        disabled: this.isModeView
      },

      phanThanKetCauDesc: {
        value: this.model.projectInformation
          && this.model.projectInformation.bodyPartConstructionStructure
          && this.model.projectInformation.bodyPartConstructionStructure.scopeOfWorkDesc,
        disabled: this.isModeView
      },
      phanThanHoanThienCheck: {
        value: this.model.projectInformation
          && this.model.projectInformation.bodyPartConstructionCompletion
          && this.model.projectInformation.bodyPartConstructionCompletion.scopeOfWorkIsInclude ?
          this.model.projectInformation.bodyPartConstructionCompletion.scopeOfWorkIsInclude : null,
        disabled: this.isModeView
      },

      phanThanhoanThienDesc: {
        value: this.model.projectInformation
          && this.model.projectInformation.bodyPartConstructionCompletion
          && this.model.projectInformation.bodyPartConstructionCompletion.scopeOfWorkDesc,
        disabled: this.isModeView
      },

      phanThancongViecKhacCheck: {
        value: this.model.projectInformation
          && this.model.projectInformation.bodyPartOtherWork
          && this.model.projectInformation.bodyPartOtherWork.scopeOfWorkIsInclude ?
          this.model.projectInformation.bodyPartOtherWork.scopeOfWorkIsInclude : null,
        disabled: this.isModeView
      },

      phanThancongViecKhacDesc: {
        value: this.model.projectInformation
          && this.model.projectInformation.bodyPartOtherWork
          && this.model.projectInformation.bodyPartOtherWork.scopeOfWorkDesc,
        disabled: this.isModeView
      },
      // Kỹ thuật
      tienDoThiCongYC: {
        value: this.model.technique
          && this.model.technique.constructionProgress
          && this.model.technique.constructionProgress.folowTenderDocumentRequirement,
        disabled: this.isModeView
      },

      tienDoThiCongDX: {
        value: this.model.technique
          && this.model.technique.constructionProgress
          && this.model.technique.constructionProgress.suggestion,
        disabled: this.isModeView
      },

      tienDoThiCongCY: {
        value: this.model.technique
          && this.model.technique.constructionProgress
          && this.model.technique.constructionProgress.note,
        disabled: this.isModeView
      },

      bienPhapThiCongYC: {
        value: this.model.technique
          && this.model.technique.specialFeatureOfConstructionMethod
          && this.model.technique.specialFeatureOfConstructionMethod.folowTenderDocumentRequirement,
        disabled: this.isModeView
      },

      bienPhapThiCongDX: {
        value: this.model.technique
          && this.model.technique.specialFeatureOfConstructionMethod
          && this.model.technique.specialFeatureOfConstructionMethod.suggestion,
        disabled: this.isModeView
      },

      bienPhapThiCongCY: {
        value: this.model.technique
          && this.model.technique.specialFeatureOfConstructionMethod
          && this.model.technique.specialFeatureOfConstructionMethod.note,
        disabled: this.isModeView
      },
      yeuCauAnToanYC: {
        value: this.model.technique
          && this.model.technique.safetyRequirement
          && this.model.technique.safetyRequirement.folowTenderDocumentRequirement,
        disabled: this.isModeView
      },
      yeuCauAntoanDX: {
        value: this.model.technique
          && this.model.technique.safetyRequirement
          && this.model.technique.safetyRequirement.suggestion,
        disabled: this.isModeView
      },
      yeuCauAnToanCY: {
        value: this.model.technique
          && this.model.technique.safetyRequirement
          && this.model.technique.safetyRequirement.note,
        disabled: this.isModeView
      },

      yeuCauKhacYC: {
        value: this.model.technique
          && this.model.technique.otherSpecialRequirement
          && this.model.technique.otherSpecialRequirement.folowTenderDocumentRequirement,
        disabled: this.isModeView
      },
      yeuCauKhacCY: {
        value: this.model.technique
          && this.model.technique.otherSpecialRequirement
          && this.model.technique.otherSpecialRequirement.note,
        disabled: this.isModeView
      },

      // Điều kiện hợp đồng

      tamUngYCPercent: {
        value: this.model.contractCondition
          && this.model.contractCondition.advanceMoney
          && this.model.contractCondition.advanceMoney.tenderDocumentRequirementPercent,
        disabled: this.isModeView
      },

      tamUngYCKhauTru: {
        value: this.model.contractCondition
          && this.model.contractCondition.advanceMoney
          && this.model.contractCondition.advanceMoney.tenderDocumentRequirementDiscountPercent,
        disabled: this.isModeView
      },

      tamUngDXPercent: {
        value: this.model.contractCondition
          && this.model.contractCondition.advanceMoney
          && this.model.contractCondition.advanceMoney.suggestionPercent,
        disabled: this.isModeView
      },

      tamUngDXKhauTru: {
        value: this.model.contractCondition
          && this.model.contractCondition.advanceMoney
          && this.model.contractCondition.advanceMoney.suggestionDiscountPercent,
        disabled: this.isModeView
      },
      tamUngCY: {
        value: this.model.contractCondition
          && this.model.contractCondition.advanceMoney
          && this.model.contractCondition.advanceMoney.note,
        disabled: this.isModeView
      },



      thoiGianYC: {
        value: this.model.contractCondition
          && this.model.contractCondition.paymentTime
          && this.model.contractCondition.paymentTime.tenderDocumentRequirementDay,
        disabled: this.isModeView
      },
      thoiGianDX: {
        value: this.model.contractCondition
          && this.model.contractCondition.paymentTime
          && this.model.contractCondition.paymentTime.suggestionDay,
        disabled: this.isModeView
      },
      thoiGianCY: {
        value: this.model.contractCondition
          && this.model.contractCondition.paymentTime
          && this.model.contractCondition.paymentTime.note,
        disabled: this.isModeView
      },



      tienGiuLaiYCPercent: {
        value: this.model.contractCondition
          && this.model.contractCondition.retainedMoney
          && this.model.contractCondition.retainedMoney.tenderDocumentRequirementPercent,
        disabled: this.isModeView
      },
      tienGiuLaiYCKhauTru: {
        value: this.model.contractCondition
          && this.model.contractCondition.retainedMoney
          && this.model.contractCondition.retainedMoney.tenderDocumentRequirementMaxPercent,
        disabled: this.isModeView
      },
      tienGiuLaiDXPercent: {
        value: this.model.contractCondition
          && this.model.contractCondition.retainedMoney
          && this.model.contractCondition.retainedMoney.requirementPercent,
        disabled: this.isModeView
      },
      tienGiuLaiDXKhauTru: {
        value: this.model.contractCondition
          && this.model.contractCondition.retainedMoney
          && this.model.contractCondition.retainedMoney.requirementMaxPercent,
        disabled: this.isModeView
      },
      tienGiuLaiCY: {
        value: this.model.contractCondition
          && this.model.contractCondition.retainedMoney
          && this.model.contractCondition.retainedMoney.note,
        disabled: this.isModeView
      },

      phatTienDoYCPercent: {
        value: this.model.contractCondition
          && this.model.contractCondition.punishDelay
          && this.model.contractCondition.punishDelay.tenderDocumentRequirementPercent,
        disabled: this.isModeView
      },
      phatTienDoYCMax: {
        value: this.model.contractCondition
          && this.model.contractCondition.punishDelay
          && this.model.contractCondition.punishDelay.tenderDocumentRequirementMax,
        disabled: this.isModeView
      },
      phatTienDoDXPercent: {
        value: this.model.contractCondition
          && this.model.contractCondition.punishDelay
          && this.model.contractCondition.punishDelay.suggestionPercent,
        disabled: this.isModeView
      },
      phatTienDoDXMax: {
        value: this.model.contractCondition
          && this.model.contractCondition.punishDelay
          && this.model.contractCondition.punishDelay.suggestionMax,
        disabled: this.isModeView
      },
      phatTienDoCY: {
        value: this.model.contractCondition
          && this.model.contractCondition.punishDelay
          && this.model.contractCondition.punishDelay.note,
        disabled: this.isModeView
      },


      thoiGianBHYCPercent: {
        value: this.model.contractCondition
          && this.model.contractCondition.constructionWarrantyTime
          && this.model.contractCondition.constructionWarrantyTime.percent,
        disabled: this.isModeView
      },
      thoiGianBHYCAmount: {
        value: this.model.contractCondition
          && this.model.contractCondition.constructionWarrantyTime
          && this.model.contractCondition.constructionWarrantyTime.money,
        disabled: this.isModeView
      },
      thoiGianBHDXBond: {
        value: this.model.contractCondition
          && this.model.contractCondition.constructionWarrantyTime
          && this.model.contractCondition.constructionWarrantyTime.bond,
        disabled: this.isModeView
      },
      thoiGianBHMonth: {
        value: this.model.contractCondition
          && this.model.contractCondition.constructionWarrantyTime
          && this.model.contractCondition.constructionWarrantyTime.month,
        disabled: this.isModeView
      },
      thoiGianBHCY: {
        value: this.model.contractCondition
          && this.model.contractCondition.constructionWarrantyTime
          && this.model.contractCondition.constructionWarrantyTime.note,
        disabled: this.isModeView
      },
      dieuKienDacBiet: {
        value: this.model.contractCondition
          && this.model.contractCondition.disadvantage
          && this.model.contractCondition.disadvantage.disadvantageName,
        disabled: this.isModeView
      },
      dieuKienDacBietCY: {
        value: this.model.contractCondition
          && this.model.contractCondition.disadvantage
          && this.model.contractCondition.disadvantage.note,
        disabled: this.isModeView
      },
      // Gia thau

      giaVonBaseAmount: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.costOfCapital
          && this.model.tentativeTenderPrice.costOfCapital.baseTenderAmount,
        disabled: this.isModeView
      },
      giaVonBaseGfa: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.costOfCapital
          && this.model.tentativeTenderPrice.costOfCapital.baseTenderGFA,
        disabled: this.isModeView
      },
      giaVonAlterAmount: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.costOfCapital
          && this.model.tentativeTenderPrice.costOfCapital.alternativeTenderAmount,
        disabled: this.isModeView
      },
      giaVonAlterGfa: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.costOfCapital
          && this.model.tentativeTenderPrice.costOfCapital.alternativeTenderGFA,
        disabled: this.isModeView
      },
      giaVonCY: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.costOfCapital
          && this.model.tentativeTenderPrice.costOfCapital.note,
        disabled: this.isModeView
      },
      chiPhiBaseAmount: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.costOfCapitalGeneralCost
          && this.model.tentativeTenderPrice.costOfCapitalGeneralCost.baseTenderAmount,
        disabled: this.isModeView
      },
      chiPhiBaseGfa: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.costOfCapitalGeneralCost
          && this.model.tentativeTenderPrice.costOfCapitalGeneralCost.baseTenderGFA,
        disabled: this.isModeView
      },
      chiPhiAlterAmount: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.costOfCapitalGeneralCost
          && this.model.tentativeTenderPrice.costOfCapitalGeneralCost.alternativeTenderAmount,
        disabled: this.isModeView
      },
      chiPhiAlterGfa: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.costOfCapitalGeneralCost
          && this.model.tentativeTenderPrice.costOfCapitalGeneralCost.alternativeTenderGFA,
        disabled: this.isModeView
      },
      chiPhiAlterNote: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.costOfCapitalGeneralCost
          && this.model.tentativeTenderPrice.costOfCapitalGeneralCost.note,
        disabled: this.isModeView
      },
      giaTriBaseAmount: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.costOfCapitalValue
          && this.model.tentativeTenderPrice.costOfCapitalValue.baseTenderAmount,
        disabled: this.isModeView
      },
      giaTriBaseGfa: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.costOfCapitalValue
          && this.model.tentativeTenderPrice.costOfCapitalValue.baseTenderGFA,
        disabled: this.isModeView
      },
      giaTriAlterAmount: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.costOfCapitalValue
          && this.model.tentativeTenderPrice.costOfCapitalValue.alternativeTenderAmount,
        disabled: this.isModeView
      },
      giaTriAlterGfa: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.costOfCapitalValue
          && this.model.tentativeTenderPrice.costOfCapitalValue.alternativeTenderGFA,
        disabled: this.isModeView
      },
      giaTriNote: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.costOfCapitalValue
          && this.model.tentativeTenderPrice.costOfCapitalValue.note,
        disabled: this.isModeView
      },

      giaTriPCBaseAmount: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.costOfCapitalPCPSValue
          && this.model.tentativeTenderPrice.costOfCapitalPCPSValue.baseTenderAmount,
        disabled: this.isModeView
      },
      giaTriPCBaseGfa: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.costOfCapitalPCPSValue
          && this.model.tentativeTenderPrice.costOfCapitalPCPSValue.baseTenderGFA,
        disabled: this.isModeView
      },
      giaTriPCAlterAmount: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.costOfCapitalPCPSValue
          && this.model.tentativeTenderPrice.costOfCapitalPCPSValue.alternativeTenderAmount,
        disabled: this.isModeView
      },
      giaTriPCAlterGfa: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.costOfCapitalPCPSValue
          && this.model.tentativeTenderPrice.costOfCapitalPCPSValue.alternativeTenderGFA,
        disabled: this.isModeView
      },
      giaTriPCNote: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.costOfCapitalPCPSValue
          && this.model.tentativeTenderPrice.costOfCapitalPCPSValue.note,
        disabled: this.isModeView
      },

      totalGiaVonAmount: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.totalCostOfCapital
          && this.model.tentativeTenderPrice.totalCostOfCapital.baseTenderAmount,
        disabled: this.isModeView
      },
      totalGiaVonGfa: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.totalCostOfCapital
          && this.model.tentativeTenderPrice.totalCostOfCapital.baseTenderGFA,
        disabled: this.isModeView
      },
      totalGiaVonNote: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.totalCostOfCapital
          && this.model.tentativeTenderPrice.totalCostOfCapital.note,
        disabled: this.isModeView
      },

      chiPhiLoiNhuanAmountGfa: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.totalCostOfCapitalProfitCost
          && this.model.tentativeTenderPrice.totalCostOfCapitalProfitCost.baseTenderProfitCost,
        disabled: this.isModeView
      },
      chiPhiLoiNhuanAlterAmountGfa: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.totalCostOfCapitalProfitCost
          && this.model.tentativeTenderPrice.totalCostOfCapitalProfitCost.alternativeProfitCost,
        disabled: this.isModeView
      },
      chiPhiLoiNhuanNote: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.totalCostOfCapitalProfitCost
          && this.model.tentativeTenderPrice.totalCostOfCapitalProfitCost.note,
        disabled: this.isModeView
      },


      giaDiNopThauAmount: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.totalCostOfSubmission
          && this.model.tentativeTenderPrice.totalCostOfSubmission.baseTenderAmount,
        disabled: this.isModeView
      },
      giaDiNopThauGfa: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.totalCostOfSubmission
          && this.model.tentativeTenderPrice.totalCostOfSubmission.baseTenderGFA,
        disabled: this.isModeView
      },
      giaDiNopThauAlterAmount: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.totalCostOfSubmission
          && this.model.tentativeTenderPrice.totalCostOfSubmission.alternativeTenderAmount,
        disabled: this.isModeView
      },
      giaDiNopThauAlterGfa: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.totalCostOfSubmission
          && this.model.tentativeTenderPrice.totalCostOfSubmission.alternativeTenderGFA,
        disabled: this.isModeView
      },
      giaDiNopThauNote: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.totalCostOfSubmission
          && this.model.tentativeTenderPrice.totalCostOfSubmission.note,
        disabled: this.isModeView
      },

      tyLeGfa: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.oAndPPercentOfTotalCost
          && this.model.tentativeTenderPrice.oAndPPercentOfTotalCost.baseTenderAmount,
        disabled: this.isModeView
      },
      tyLeNote: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.oAndPPercentOfTotalCost
          && this.model.tentativeTenderPrice.oAndPPercentOfTotalCost.note,
        disabled: this.isModeView
      },
      approvalDate: [{
        value:
          DateTimeConvertHelper.fromTimestampToDtObject(
            this.model.approvalDate * 1000
          ),
        //  disabled: this.isModeView
      }],
      approvalTimes: {
        value: this.model.approvalTimes,
        disabled: true
      },
      interviewTimes: {
        value: this.model.interviewTimes,
        disabled: this.isModeView
      },
      isApprovedByTenderLeader: this.model.isApprovedByTenderLeader,
      isApprovedByTenderManager: this.model.isApprovedByTenderManager,
      isApprovedByBoardOfDirector: this.model.isApprovedByBoardOfDirector,
      bidOpportunityId: this.model.bidOpportunityId ? this.model.bidOpportunityId : this.packageId,
      createdEmployeeId: this.model.createdEmployee && this.model.createdEmployee.employeeId,
      updatedEmployeeId: this.model.updatedEmployee && this.model.updatedEmployee.employeeId,
      isDraftVersion: this.model.isDraftVersion
    });
  }



  submit(isSaveDraft: boolean) {
    if (isSaveDraft) {
      this.priceReviewForm.get('isDraftVersion').patchValue(true);
    }
    this.priceReviewService.createOrEdit(this.priceReviewForm.value, this.packageId).subscribe(() => {
      this.router.navigate([`/package/detail/${this.packageId}/attend/price-review/detail`]);
    });
  }

  refresh() {
    this.createForm();
  }


  truongNhomKhongDuyet() {
    const isApprovedByTenderLeader = this.priceReviewForm.get('isApprovedByTenderLeader').value;
    if (isApprovedByTenderLeader) {
      this.spinner.show();
      this.priceReviewService.truongNhomKhongDuyet(this.packageId).subscribe(() => {
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
      });
    }
  }

  truongNhomDuyet() {
    const isApprovedByTenderLeader = this.priceReviewForm.get('isApprovedByTenderLeader').value;
    if (!isApprovedByTenderLeader) {
      this.spinner.show();
      this.priceReviewService.truongNhomDuyet(this.packageId).subscribe(() => {
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
      });
    }
  }

  truongPhongDuyet() {
    const isApprovedByTenderManager = this.priceReviewForm.get('isApprovedByTenderManager').value;
    if (!isApprovedByTenderManager) {
      this.spinner.show();
      this.priceReviewService.truongPhongDuyet(this.packageId).subscribe(() => {
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
      });
    }
  }

  truongPhongKhongDuyet() {
    const isApprovedByTenderManager = this.priceReviewForm.get('isApprovedByTenderManager').value;
    if (isApprovedByTenderManager) {
      this.spinner.show();
      this.priceReviewService.truongPhongKhongDuyet(this.packageId).subscribe(() => {
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
      });
    }
  }

  giamDocDuyet() {
    const isApprovedByBoardOfDirector = this.priceReviewForm.get('isApprovedByBoardOfDirector').value;
    if (!isApprovedByBoardOfDirector) {
      this.spinner.show();
      this.priceReviewService.giamDocDuyet(this.packageId).subscribe(() => {
        this.checkDuyet();
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
      });
    }
  }

  giamDocKhongDuyet() {
    const isApprovedByBoardOfDirector = this.priceReviewForm.get('isApprovedByBoardOfDirector').value;
    if (isApprovedByBoardOfDirector) {
      this.spinner.show();
      this.priceReviewService.giamDocKhongDuyet(this.packageId).subscribe(() => {
        this.checkDuyet();
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
      });
    }
  }

  checkDuyet() {
    const isApprovedByBoardOfDirector = this.priceReviewForm.get('isApprovedByBoardOfDirector').value;
    if (isApprovedByBoardOfDirector) {
      this.priceReviewForm.controls['isApprovedByBoardOfDirector'].disable();
      this.priceReviewForm.controls['isApprovedByTenderManager'].disable();
      this.priceReviewForm.controls['isApprovedByTenderManager'].disable();
    }
  }

}
