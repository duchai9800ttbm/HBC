import { Component, OnInit, AfterViewInit, Input, AfterViewChecked, AfterContentChecked } from '@angular/core';
import { TenderPriceApproval, TenderPriceApprovalShort } from '../../../../../../shared/models/price-review/price-review.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import DateTimeConvertHelper from '../../../../../../shared/helpers/datetime-convert-helper';
import { PriceReviewService } from '../../../../../../shared/services/price-review.service';
import { PackageDetailComponent } from '../../../package-detail.component';
import { NgxSpinnerService } from '../../../../../../../../node_modules/ngx-spinner';
import { PackageInfoModel } from '../../../../../../shared/models/package/package-info.model';
import { PackageService } from '../../../../../../shared/services/package.service';
import { Router } from '../../../../../../../../node_modules/@angular/router';
import { AlertService, ConfirmationService } from '../../../../../../shared/services';
import { BidStatus } from '../../../../../../shared/constants/bid-status';

@Component({
  selector: 'app-price-review-form',
  templateUrl: './price-review-form.component.html',
  styleUrls: ['./price-review-form.component.scss']
})
export class PriceReviewFormComponent implements OnInit, AfterViewInit {
  priceReviewForm: FormGroup;
  package = new PackageInfoModel();
  priceReview: TenderPriceApprovalShort;
  bidStatus = BidStatus;

  constructor(
    private fb: FormBuilder,
    private priceReviewService: PriceReviewService,
    private spinner: NgxSpinnerService,
    private packageService: PackageService,
    private confirmService: ConfirmationService,
    private alertService: AlertService,
    private router: Router
  ) { }
  isModeView;
  isModeCreate;
  isModeEdit;
  packageId;
  listCustomer;
  showPopupConfirm = false;
  // Variable Check
  valuePcps = false;
  valueOnP = false;

  @Input() model: TenderPriceApproval;
  @Input() type: string;

  ngOnInit() {
    this.getModeScreen();
    this.packageId = PackageDetailComponent.packageId;
    this.getAllCustomer();
    this.getInfoPackge();
    this.createForm();
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
      if (this.package.stageStatus && this.priceReviewForm.value) {
        if (this.package.stageStatus.id === 'DaDuyetTrinhDuyetGia'
          || this.package.stageStatus.id === 'ChotHoSo'
          || this.package.stageStatus.id === 'DaNopHSDT') {
          this.priceReviewForm.controls['isApprovedByBoardOfDirector'].disable();
        }
      }
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
    });
  }
  createForm() {
    this.priceReviewForm = this.fb.group({
      // Thông tin dự án
      id: this.model.id,
      otherCompanyCustomerId: (this.model.otherCompanyCustomerId) ? this.model.otherCompanyCustomerId : '',
      createdDate: (this.model.createdDate) ? this.model.createdDate : 0,
      infoGfa: {
        value: this.model.projectInformation && this.model.projectInformation.gfa,
        disabled: this.isModeView
      },
      phanMongCheck: {
        value: this.model.projectInformation
          && this.model.projectInformation.foudationPart
          && this.model.projectInformation.foudationPart.scopeOfWorkIsInclude,
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
          && this.model.projectInformation.basementPart.scopeOfWorkIsInclude,
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
          && this.model.projectInformation.basementPartConstructionStructure.scopeOfWorkIsInclude,
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
          && this.model.projectInformation.basementPartConstructionCompletion.scopeOfWorkIsInclude,
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
          && this.model.projectInformation.basementPartOtherWork.scopeOfWorkIsInclude,
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
          && this.model.projectInformation.bodyPart.scopeOfWorkIsInclude,
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
          && this.model.projectInformation.bodyPartConstructionStructure.scopeOfWorkIsInclude,
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
          && this.model.projectInformation.bodyPartConstructionCompletion.scopeOfWorkIsInclude,
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
          && this.model.projectInformation.bodyPartOtherWork.scopeOfWorkIsInclude,
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
        disabled: true
      },
      giaVonBaseGfa: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.costOfCapital
          && this.model.tentativeTenderPrice.costOfCapital.baseTenderGFA,
        disabled: true
      },
      giaVonAlterAmount: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.costOfCapital
          && this.model.tentativeTenderPrice.costOfCapital.alternativeTenderAmount,
        disabled: true
      },
      giaVonAlterGfa: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.costOfCapital
          && this.model.tentativeTenderPrice.costOfCapital.alternativeTenderGFA,
        disabled: true
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
        disabled: true
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
        disabled: true
      },
      totalGiaVonGfa: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.totalCostOfCapital
          && this.model.tentativeTenderPrice.totalCostOfCapital.baseTenderGFA,
        disabled: this.isModeView
      },
      totalAlterAmount: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.totalCostOfCapital
          && this.model.tentativeTenderPrice.totalCostOfCapital.alternativeTenderAmount,
        disabled: true
      },
      totalAlterGfa: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.totalCostOfCapital
          && this.model.tentativeTenderPrice.totalCostOfCapital.alternativeTenderGFA,
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

      // TODO: Mapping
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

      // TODO: mapping under
      tyleAmount: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.oAndPPercentOfTotalCost
          && this.model.tentativeTenderPrice.oAndPPercentOfTotalCost.baseTenderAmount,
        disabled: this.isModeView
      },
      tyleGfa: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.oAndPPercentOfTotalCost
          && this.model.tentativeTenderPrice.oAndPPercentOfTotalCost.baseTenderGFA,
        disabled: this.isModeView
      },
      tyleAlter: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.oAndPPercentOfTotalCost
          && this.model.tentativeTenderPrice.oAndPPercentOfTotalCost.alternativeTenderAmount,
        disabled: this.isModeView
      },
      tyLeNote: {
        value: this.model.tentativeTenderPrice
          && this.model.tentativeTenderPrice.oAndPPercentOfTotalCost
          && this.model.tentativeTenderPrice.oAndPPercentOfTotalCost.note,
        disabled: this.isModeView
      },

      // TODO: mapping phần trên
      approvalDate:
        DateTimeConvertHelper.fromTimestampToDtObject(
          this.model.approvalDate * 1000),
      approvalTimes: {
        value: this.model.approvalTimes,
        disabled: true
      },
      interviewTimes: {
        value: this.model.interviewTimes,
        disabled: this.isModeView
      },
      isApprovedByTenderLeader: { value: this.model.isApprovedByTenderLeader, disabled: this.isModeEdit },
      isApprovedByTenderManager: { value: this.model.isApprovedByTenderManager, disabled: this.isModeEdit },
      isApprovedByBoardOfDirector: { value: this.model.isApprovedByBoardOfDirector, disabled: this.isModeEdit },
      bidOpportunityId: this.model.bidOpportunityId ? this.model.bidOpportunityId : this.packageId,
      createdEmployeeId: this.model.createdEmployee && this.model.createdEmployee.employeeId,
      updatedEmployeeId: this.model.updatedEmployee && this.model.updatedEmployee.employeeId,
      isDraftVersion: this.model.isDraftVersion,
      documentName: {
        value: this.model.documentName,
        disabled: this.isModeView
      },
      updatedDesc: ''
    });

    // this.priceReviewForm.valueChanges.subscribe(data => {
    //   const giaTriPCBaseAmount = data.giaTriPCBaseAmount;
    //   const giaTriBaseAmount = data.giaTriBaseAmount;
    //   const chiPhiBaseAmount = data.chiPhiBaseAmount;
    //   const totalGiaVonAmount = giaTriPCBaseAmount + giaTriBaseAmount + chiPhiBaseAmount;
    //   console.log(data);
    //   console.log(totalGiaVonAmount);
    //   this.priceReviewForm.get('totalGiaVonAmount').patchValue(totalGiaVonAmount);
    // });
    if (this.package.stageStatus && this.priceReviewForm.value) {
      if (this.package.stageStatus.id === 'DaDuyetTrinhDuyetGia'
        || this.package.stageStatus.id === 'ChotHoSo'
        || this.package.stageStatus.id === 'DaNopHSDT') {
        this.priceReviewForm.controls['isApprovedByBoardOfDirector'].disable();
      }
    }
    if (this.priceReviewForm.value) {
      const value = this.model.approvalDate;
      if (!value) {
        this.packageService.getProposedTenderParticipateReport(this.packageId).subscribe(data => {
          const valueApprovalDate = data.tenderDirectorProposal.expectedDate;
          this.priceReviewForm.get('approvalDate').patchValue(DateTimeConvertHelper.fromTimestampToDtObject(valueApprovalDate * 1000));
        });
      }
      this.checkDuyet();
    }
  }



  submit(isSaveDraft: boolean) {
    if (isSaveDraft) {
      this.priceReviewForm.get('isDraftVersion').patchValue(true);
      this.priceReviewForm.get('updatedDesc').patchValue('');
      this.priceReviewService.createOrEdit(this.priceReviewForm.value, this.packageId).subscribe(() => {
        this.router.navigate([`/package/detail/${this.packageId}/attend/price-review`]);
      });
    } else {
      this.priceReviewForm.get('isDraftVersion').patchValue(false);
      if (this.isModeCreate) {
        this.priceReviewForm.get('updatedDesc').patchValue('');
        this.priceReviewService.createOrEdit(this.priceReviewForm.value, this.packageId).subscribe(() => {
          this.router.navigate([`/package/detail/${this.packageId}/attend/price-review`]);
        });
      } else {
        this.showPopupConfirm = true;
      }
    }
  }
  submitLiveForm(check) {
    if (check === false) {
      this.showPopupConfirm = false;
    } else {
      this.priceReviewForm.get('updatedDesc').patchValue(check);
      this.priceReviewService.createOrEdit(this.priceReviewForm.value, this.packageId).subscribe(() => {
        this.router.navigate([`/package/detail/${this.packageId}/attend/price-review`]);
        const message = (this.isModeCreate) ? 'Tạo' : 'Cập nhật';
        this.alertService.success(`${message} Trình duyệt giá thành công!`);
      }, err => {
        const message = (this.isModeCreate) ? 'Tạo' : 'Cập nhật';
        this.alertService.error(`Đã có lỗi xảy ra. ${message} Trình duyệt giá không thành công!`);
      });
    }
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
    this.spinner.show();
    this.priceReviewService.giamDocKhongDuyet(this.packageId).subscribe(() => {
      this.checkDuyet();
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
    });
  }

  checkDuyet() {

    if (this.isModeView) {
      this.priceReviewForm.controls['approvalDate'].disable();
    }

  }
  getAllCustomer() {
    this.priceReviewService.getAllCustomer().subscribe(customers => {
      this.listCustomer = customers;
    });
  }

  // Count Total Gía vốn
  countTotalBase(event) {
    const chiPhiBaseAmount = (this.priceReviewForm.get('chiPhiBaseAmount').value) ?
      this.priceReviewForm.get('chiPhiBaseAmount').value : 0;

    const giaTriBaseAmount = (this.priceReviewForm.get('giaTriBaseAmount').value) ?
      this.priceReviewForm.get('giaTriBaseAmount').value : 0;

    const giaTriPCBaseAmount = (this.priceReviewForm.get('giaTriPCBaseAmount').value) ?
      this.priceReviewForm.get('giaTriPCBaseAmount').value : 0;

    const totalValue = +chiPhiBaseAmount + +giaTriBaseAmount + +giaTriPCBaseAmount;
    this.priceReviewForm.get('totalGiaVonAmount').patchValue(+(totalValue));
  }
  countTotalAlter(event) {
    const chiPhiAlterAmount = (this.priceReviewForm.get('chiPhiAlterAmount').value) ?
      this.priceReviewForm.get('chiPhiAlterAmount').value : 0;

    const giaTriAlterAmount = (this.priceReviewForm.get('giaTriAlterAmount').value) ?
      this.priceReviewForm.get('giaTriAlterAmount').value : 0;

    const giaTriPCAlterAmount = (this.priceReviewForm.get('giaTriPCAlterAmount').value) ?
      this.priceReviewForm.get('giaTriPCAlterAmount').value : 0;

    const totalValue = +chiPhiAlterAmount + +giaTriAlterAmount + +giaTriPCAlterAmount;
    this.priceReviewForm.get('totalAlterAmount').patchValue(+(totalValue));
  }
  // GFA
  getValueField() {
    const chiPhiBaseGfa = this.priceReviewForm.get('chiPhiBaseGfa').value;
    const giaTriBaseGfa = this.priceReviewForm.get('giaTriBaseGfa').value;
    const chiPhiLoiNhuanAmountGfa = this.priceReviewForm.get('chiPhiLoiNhuanAmountGfa').value;

    if (chiPhiBaseGfa && giaTriBaseGfa) {
      this.priceReviewForm.get('giaTriPCBaseGfa').patchValue((+giaTriBaseGfa) / (+chiPhiBaseGfa));
      this.valuePcps = true;
    } else { this.valuePcps = false; }
    if (chiPhiBaseGfa && chiPhiLoiNhuanAmountGfa) {
      this.priceReviewForm.get('tyleGfa').patchValue((+chiPhiLoiNhuanAmountGfa) / (+chiPhiBaseGfa));
      this.valueOnP = true;
    } else { this.valueOnP = false; }
  }
  // Gủi duyệt
  guiDuyet() {
    const that = this;
    if (this.model.isDraftVersion) {
      this.alertService.error('Chưa đủ bản chính thức!');
      return null;
    }
    this.confirmService.confirm('Bạn có chắc muốn gửi duyệt trình duyệt giá?', () => {
      this.priceReviewService.guiDuyetTrinhDuyetGia(this.packageId).subscribe(data => {
        that.alertService.success('Gửi duyệt trình duyệt giá thành công!');
      }, err => {
        that.alertService.error('Gửi duyệt trình duyệt giá thất bại, vui lòng thử lại sau!');
      });
    });

  }
}
