import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { TenderPriceApproval } from '../../../../../../shared/models/price-review/price-review.model';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-price-review-form',
  templateUrl: './price-review-form.component.html',
  styleUrls: ['./price-review-form.component.scss']
})
export class PriceReviewFormComponent implements OnInit, AfterViewInit {
  number = 10;
  priceReviewForm: FormGroup;

  constructor(
    private fb: FormBuilder
  ) { }

  phanMong = false;
  @Input() model: TenderPriceApproval;
  @Input() type: string;
  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.priceReviewForm = this.fb.group({
      // Thông tin dự án
      phanMongCheck: this.model.projectInformation
        && this.model.projectInformation.foudationPart
        && this.model.projectInformation.foudationPart.scopeOfWorkIsInclude ?
        this.model.projectInformation.foudationPart.scopeOfWorkIsInclude : false,
      phanMongDesc: this.model.projectInformation
        && this.model.projectInformation.foudationPart
        && this.model.projectInformation.foudationPart.scopeOfWorkDesc,

      phanHamCheck: this.model.projectInformation
        && this.model.projectInformation.basementPart
        && this.model.projectInformation.basementPart.scopeOfWorkIsInclude ?
        this.model.projectInformation.basementPart.scopeOfWorkIsInclude : false,
      phanHamDesc: this.model.projectInformation
        && this.model.projectInformation.basementPart
        && this.model.projectInformation.basementPart.scopeOfWorkDesc,

      ketCauCheck: this.model.projectInformation
        && this.model.projectInformation.basementPartConstructionStructure
        && this.model.projectInformation.basementPartConstructionStructure.scopeOfWorkIsInclude ?
        this.model.projectInformation.basementPartConstructionStructure.scopeOfWorkIsInclude : false,
      ketCauDesc: this.model.projectInformation
        && this.model.projectInformation.basementPartConstructionStructure
        && this.model.projectInformation.basementPartConstructionStructure.scopeOfWorkDesc,

      hoanThienCheck: this.model.projectInformation
        && this.model.projectInformation.basementPartConstructionCompletion
        && this.model.projectInformation.basementPartConstructionCompletion.scopeOfWorkIsInclude ?
        this.model.projectInformation.basementPartConstructionCompletion.scopeOfWorkIsInclude : false,
      hoanThienDesc: this.model.projectInformation
        && this.model.projectInformation.basementPartConstructionCompletion
        && this.model.projectInformation.basementPartConstructionCompletion.scopeOfWorkDesc,

      congViecKhacCheck: this.model.projectInformation
        && this.model.projectInformation.basementPartOtherWork
        && this.model.projectInformation.basementPartOtherWork.scopeOfWorkIsInclude ?
        this.model.projectInformation.basementPartOtherWork.scopeOfWorkIsInclude : false,
      congViecKhacDesc: this.model.projectInformation
        && this.model.projectInformation.basementPartOtherWork
        && this.model.projectInformation.basementPartOtherWork.scopeOfWorkDesc,

      phanThanCheck: this.model.projectInformation
        && this.model.projectInformation.bodyPart
        && this.model.projectInformation.bodyPart.scopeOfWorkIsInclude ?
        this.model.projectInformation.basementPartOtherWork.scopeOfWorkIsInclude : false,
      phanThanDesc: this.model.projectInformation
        && this.model.projectInformation.bodyPart
        && this.model.projectInformation.bodyPart.scopeOfWorkDesc,


      phanThanKetCauCheck: this.model.projectInformation
        && this.model.projectInformation.bodyPartConstructionStructure
        && this.model.projectInformation.bodyPartConstructionStructure.scopeOfWorkIsInclude ?
        this.model.projectInformation.bodyPartConstructionStructure.scopeOfWorkIsInclude : false,
      phanThanKetCauDesc: this.model.projectInformation
        && this.model.projectInformation.bodyPartConstructionStructure
        && this.model.projectInformation.bodyPartConstructionStructure.scopeOfWorkDesc,

      phanThanHoanThienCheck: this.model.projectInformation
        && this.model.projectInformation.bodyPartConstructionCompletion
        && this.model.projectInformation.bodyPartConstructionCompletion.scopeOfWorkIsInclude ?
        this.model.projectInformation.bodyPartConstructionCompletion.scopeOfWorkIsInclude : false,
      phanThanhoanThienDesc: this.model.projectInformation
        && this.model.projectInformation.bodyPartConstructionCompletion
        && this.model.projectInformation.bodyPartConstructionCompletion.scopeOfWorkDesc,

      phanThancongViecKhacCheck: this.model.projectInformation
        && this.model.projectInformation.bodyPartOtherWork
        && this.model.projectInformation.bodyPartOtherWork.scopeOfWorkIsInclude ?
        this.model.projectInformation.bodyPartOtherWork.scopeOfWorkIsInclude : false,
      phanThancongViecKhacDesc: this.model.projectInformation
        && this.model.projectInformation.bodyPartOtherWork
        && this.model.projectInformation.bodyPartOtherWork.scopeOfWorkDesc,

      // Kỹ thuật
      tienDoThiCongYC: this.model.technique
        && this.model.technique.constructionProgress
        && this.model.technique.constructionProgress.folowTenderDocumentRequirement,
      tienDoThiCongDX: this.model.technique
        && this.model.technique.constructionProgress
        && this.model.technique.constructionProgress.suggestion,
      tienDoThiCongCY: this.model.technique
        && this.model.technique.constructionProgress
        && this.model.technique.constructionProgress.suggestion,

      bienPhapThiCongYC: this.model.technique
        && this.model.technique.specialFeatureOfConstructionMethod
        && this.model.technique.specialFeatureOfConstructionMethod.folowTenderDocumentRequirement,
      bienPhapThiCongDX: this.model.technique
        && this.model.technique.specialFeatureOfConstructionMethod
        && this.model.technique.specialFeatureOfConstructionMethod.suggestion,
      bienPhapThiCongCY: this.model.technique
        && this.model.technique.specialFeatureOfConstructionMethod
        && this.model.technique.specialFeatureOfConstructionMethod.suggestion,

      yeuCauAnToanYC: this.model.technique
        && this.model.technique.safetyRequirement
        && this.model.technique.safetyRequirement.folowTenderDocumentRequirement,
      yeuCauAntoanDX: this.model.technique
        && this.model.technique.safetyRequirement
        && this.model.technique.safetyRequirement.suggestion,
      yeuCauAnToanCY: this.model.technique
        && this.model.technique.safetyRequirement
        && this.model.technique.safetyRequirement.suggestion,

      yeuCauKhacYC: this.model.technique
        && this.model.technique.safetyRequirement
        && this.model.technique.safetyRequirement.folowTenderDocumentRequirement,
      // yeuCauKhacDX: this.model.technique
      //   && this.model.technique.safetyRequirement
      //   && this.model.technique.safetyRequirement.suggestion,
      yeuCauKhacCY: this.model.technique
        && this.model.technique.safetyRequirement
        && this.model.technique.safetyRequirement.suggestion,


      // Điều kiện hợp đồng

      tamUngYCPercent: this.model.contractCondition
        && this.model.contractCondition.advanceMoney
        && this.model.contractCondition.advanceMoney.tenderDocumentRequirementPercent,
      tamUngYCKhauTru: this.model.contractCondition
        && this.model.contractCondition.advanceMoney
        && this.model.contractCondition.advanceMoney.tenderDocumentRequirementDiscountPercent,
      tamUngDXPercent: this.model.contractCondition
        && this.model.contractCondition.advanceMoney
        && this.model.contractCondition.advanceMoney.suggestionPercent,
      tamUngDXKhauTru: this.model.contractCondition
        && this.model.contractCondition.advanceMoney
        && this.model.contractCondition.advanceMoney.suggestionDiscountPercent,
      tamUngCY: this.model.contractCondition
        && this.model.contractCondition.advanceMoney
        && this.model.contractCondition.advanceMoney.note,




      thoiGianYC: this.model.contractCondition
      && this.model.contractCondition.paymentTime
      && this.model.contractCondition.paymentTime.tenderDocumentRequirementDay,

      thoiGianDX: this.model.contractCondition
      && this.model.contractCondition.paymentTime
      && this.model.contractCondition.paymentTime.suggestionDay,

      thoiGianCY:   this.model.contractCondition
      && this.model.contractCondition.paymentTime
      && this.model.contractCondition.paymentTime.note,




      tienGiuLaiYCPercent: this.model.contractCondition
      && this.model.contractCondition.retainedMoney
      && this.model.contractCondition.retainedMoney.tenderDocumentRequirementPercent,

      tienGiuLaiYCKhauTru: this.model.contractCondition
      && this.model.contractCondition.retainedMoney
      && this.model.contractCondition.retainedMoney.tenderDocumentRequirementMaxPercent,

      tienGiuLaiDXPercent: this.model.contractCondition
      && this.model.contractCondition.retainedMoney
      && this.model.contractCondition.retainedMoney.requirementPercent,

      tienGiuLaiDXKhauTru: this.model.contractCondition
      && this.model.contractCondition.retainedMoney
      && this.model.contractCondition.retainedMoney.requirementMaxPercent,


      phatTienDoYCPercent: this.model.contractCondition
      && this.model.contractCondition.punishDelay
      && this.model.contractCondition.punishDelay.tenderDocumentRequirementPercent,

      phatTienDoYCMax: this.model.contractCondition
      && this.model.contractCondition.punishDelay
      && this.model.contractCondition.punishDelay.tenderDocumentRequirementMax


    });
  }


  ngAfterViewInit() {
  }


  submit() {
    console.log(this.priceReviewForm.value);
  }

}
