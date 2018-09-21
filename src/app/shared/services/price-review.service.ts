import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { TenderPriceApproval } from '../models/price-review/price-review.model';

@Injectable()
export class PriceReviewService {

  constructor(
    private apiService: ApiService
  ) { }

  view(bidOpportunityId: number) {
    const url = `bidopportunity/${bidOpportunityId}/tenderpriceapproval`;
    return this.apiService.get(url).map(response =>
      this.toTenderPriceApproval(response.result));
  }


  createOrEdit(formValue: any) {
    const url = `tenderpriceapproval/createorupdate`;
    const modelRequest = new TenderPriceApproval();
    modelRequest.bidOpportunityId = 238;
    modelRequest.projectInformation = {
      foudationPart: {
        scopeOfWorkIsInclude: formValue.phanMongCheck,
        scopeOfWorkDesc: formValue.phanMongDesc,
        gfa: 0
      },
      basementPart: {
        scopeOfWorkIsInclude: formValue.phanHamCheck,
        scopeOfWorkDesc: formValue.phanHamDesc,
        gfa: 0
      },
      basementPartConstructionStructure: {
        scopeOfWorkIsInclude: formValue.ketCauCheck,
        scopeOfWorkDesc: formValue.ketCauDesc,
        gfa: 0
      },
      basementPartConstructionCompletion: {
        scopeOfWorkIsInclude: formValue.hoanThienCheck,
        scopeOfWorkDesc: formValue.hoanThienDesc,
        gfa: 0
      },
      basementPartOtherWork: {
        scopeOfWorkIsInclude: formValue.congViecKhacCheck,
        scopeOfWorkDesc: formValue.congViecKhacDesc,
        gfa: 0
      },
      bodyPart: {
        scopeOfWorkIsInclude: formValue.phanThanCheck,
        scopeOfWorkDesc: formValue.phanThanDesc,
        gfa: 0
      },
      bodyPartConstructionStructure: {
        scopeOfWorkIsInclude: formValue.phanThanKetCauCheck,
        scopeOfWorkDesc: formValue.phanThanKetCauDesc,
        gfa: 0
      },
      bodyPartConstructionCompletion: {
        scopeOfWorkIsInclude: formValue.phanThanHoanThienCheck,
        scopeOfWorkDesc: formValue.phanThanhoanThienDesc,
        gfa: 0
      },
      bodyPartOtherWork: {
        scopeOfWorkIsInclude: formValue.phanThancongViecKhacCheck,
        scopeOfWorkDesc: formValue.phanThancongViecKhacDesc,
        gfa: 0
      }
    };
    modelRequest.technique = {
      constructionProgress: {
        folowTenderDocumentRequirement: formValue.tienDoThiCongYC,
        suggestion: formValue.tienDoThiCongDX,
        note: formValue.tienDoThiCongCY
      },
      specialFeatureOfConstructionMethod: {
        folowTenderDocumentRequirement: formValue.bienPhapThiCongYC,
        suggestion: formValue.bienPhapThiCongDX,
        note: formValue.bienPhapThiCongCY
      },
      safetyRequirement: {
        folowTenderDocumentRequirement: formValue.yeuCauAnToanYC,
        suggestion: formValue.yeuCauAntoanDX,
        note: formValue.yeuCauAnToanCY
      },
      otherSpecialRequirement: {
        folowTenderDocumentRequirement: formValue.yeuCauKhacYC,
        suggestion: null,
        note: formValue.yeuCauKhacCY
      }
    };
    console.log(modelRequest);
    return this.apiService.post(url, modelRequest)
      .map(response => this.toTenderPriceApproval(response.result));
  }

  toTenderPriceApproval(model: any): TenderPriceApproval {
    return {
      id: model.id,
      bidOpportunityId: model.bidOpportunityId,
      createdEmployee: model.createdEmployee && {
        employeeId: model.createdEmployee.employeeId,
        employeeNo: model.createdEmployee.employeeNo,
        employeeName: model.createdEmployee.employeeName,
        employeeAvatar: model.createdEmployee.employeeAvatar,
        employeeEmail: model.createdEmployee.employeeEmail
      },
      updatedEmployee: model.updatedEmployee && {
        employeeId: model.updatedEmployee.employeeId,
        employeeNo: model.updatedEmployee.employeeNo,
        employeeName: model.updatedEmployee.employeeName,
        employeeAvatar: model.updatedEmployee.employeeAvatar,
        employeeEmail: model.updatedEmployee.employeeEmail,
      },
      isDraftVersion: model.isDraftVersion,
      approvalDate: model.approvalDate,
      approvalTimes: model.approvalTimes,
      isApprovedByTenderLeader: model.isApprovedByTenderLeader,
      isApprovedByTenderManager: model.isApprovedByTenderManager,
      isApprovedByBoardOfDirector: model.isApprovedByBoardOfDirector,
      projectInformation: model.projectInformation && {
        foudationPart: model.projectInformation.foudationPart && {
          scopeOfWorkIsInclude: model.projectInformation.foudationPart.scopeOfWorkIsInclude,
          scopeOfWorkDesc: model.projectInformation.foudationPart.scopeOfWorkDesc,
          gfa: model.projectInformation.foudationPart.gfa
        },
        basementPart: model.projectInformation.basementPart && {
          scopeOfWorkIsInclude: model.projectInformation.basementPart.scopeOfWorkIsInclude,
          scopeOfWorkDesc: model.projectInformation.basementPart.scopeOfWorkDesc,
          gfa: model.projectInformation.basementPart.gfa,
        },
        basementPartConstructionStructure: model.projectInformation.basementPartConstructionStructure && {
          scopeOfWorkIsInclude: model.projectInformation.basementPartConstructionStructure.scopeOfWorkIsInclude,
          scopeOfWorkDesc: model.projectInformation.basementPartConstructionStructure.scopeOfWorkDesc,
          gfa: model.projectInformation.basementPartConstructionStructure.gfa
        },
        basementPartConstructionCompletion: model.projectInformation.basementPartConstructionCompletion && {
          scopeOfWorkIsInclude: model.projectInformation.basementPartConstructionCompletion.scopeOfWorkIsInclude,
          scopeOfWorkDesc: model.projectInformation.basementPartConstructionCompletion.scopeOfWorkDesc,
          gfa: model.projectInformation.basementPartConstructionCompletion.gfa
        },
        basementPartOtherWork: model.projectInformation.basementPartOtherWork && {
          scopeOfWorkIsInclude: model.projectInformation.basementPartOtherWork.scopeOfWorkIsInclude,
          scopeOfWorkDesc: model.projectInformation.basementPartOtherWork.scopeOfWorkDesc,
          gfa: model.projectInformation.basementPartOtherWork.gfa
        },
        bodyPart: model.projectInformation.bodyPart && {
          scopeOfWorkIsInclude: model.projectInformation.bodyPart.scopeOfWorkIsInclude,
          scopeOfWorkDesc: model.projectInformation.bodyPart.scopeOfWorkDesc,
          gfa: model.projectInformation.bodyPart.gfa
        },
        bodyPartConstructionStructure: model.projectInformation.bodyPartConstructionStructure && {
          scopeOfWorkIsInclude: model.projectInformation.bodyPartConstructionStructure.scopeOfWorkIsInclude,
          scopeOfWorkDesc: model.projectInformation.bodyPartConstructionStructure.scopeOfWorkDesc,
          gfa: model.projectInformation.bodyPartConstructionStructure.gfa
        },
        bodyPartConstructionCompletion: model.projectInformation.bodyPartConstructionCompletion && {
          scopeOfWorkIsInclude: model.projectInformation.bodyPartConstructionCompletion.scopeOfWorkIsInclude,
          scopeOfWorkDesc: model.projectInformation.bodyPartConstructionCompletion.scopeOfWorkDesc,
          gfa: model.projectInformation.bodyPartConstructionCompletion.gfa
        },
        bodyPartOtherWork: model.projectInformation.bodyPartConstructionCompletion && {
          scopeOfWorkIsInclude: model.projectInformation.bodyPartConstructionCompletion.scopeOfWorkIsInclude,
          scopeOfWorkDesc: model.projectInformation.bodyPartConstructionCompletion.scopeOfWorkDesc,
          gfa: model.projectInformation.bodyPartConstructionCompletion.gfa
        }
      },
      technique: model.technique && {
        constructionProgress: model.technique.constructionProgress && {
          folowTenderDocumentRequirement: model.technique.constructionProgress.folowTenderDocumentRequirement,
          suggestion: model.technique.constructionProgress.suggestion,
          note: model.technique.constructionProgress.note
        },
        specialFeatureOfConstructionMethod: model.technique.specialFeatureOfConstructionMethod && {
          folowTenderDocumentRequirement: model.technique.specialFeatureOfConstructionMethod.folowTenderDocumentRequirement,
          suggestion: model.technique.specialFeatureOfConstructionMethod.suggestion,
          note: model.technique.specialFeatureOfConstructionMethod.note
        },
        safetyRequirement: model.technique.safetyRequirement && {
          folowTenderDocumentRequirement: model.technique.safetyRequirement.folowTenderDocumentRequirement,
          suggestion: model.technique.safetyRequirement.suggestion,
          note: model.technique.safetyRequirement.note
        },
        otherSpecialRequirement: model.technique.otherSpecialRequirement && {
          folowTenderDocumentRequirement: model.technique.otherSpecialRequirement.folowTenderDocumentRequirement,
          suggestion: model.technique.otherSpecialRequirement.suggestion,
          note: model.technique.otherSpecialRequirement.note
        },
      },
      contractCondition: model.contractCondition && {
        advanceMoney: model.contractCondition.advanceMoney && {
          tenderDocumentRequirementPercent: model.contractCondition.advanceMoney.tenderDocumentRequirementPercent,
          tenderDocumentRequirementDiscountPercent: model.contractCondition.advanceMoney.tenderDocumentRequirementDiscountPercent,
          suggestionPercent: model.contractCondition.advanceMoney.suggestionPercent,
          suggestionDiscountPercent: model.contractCondition.advanceMoney.suggestionDiscountPercent,
          note: model.contractCondition.advanceMoney.note
        },
        paymentTime: model.contractCondition.paymentTime && {
          tenderDocumentRequirementDay: model.contractCondition.paymentTime.tenderDocumentRequirementDay,
          suggestionDay: model.contractCondition.paymentTime.suggestionDay,
          note: model.contractCondition.paymentTime.note,
        },
        retainedMoney: model.contractCondition.retainedMoney && {
          tenderDocumentRequirementPercent: model.contractCondition.retainedMoney.tenderDocumentRequirementPercent,
          tenderDocumentRequirementMaxPercent: model.contractCondition.retainedMoney.tenderDocumentRequirementMaxPercent,
          requirementPercent: model.contractCondition.retainedMoney.requirementPercent,
          requirementMaxPercent: model.contractCondition.retainedMoney.requirementMaxPercent,
          note: model.contractCondition.retainedMoney.requirementMaxPercent.note
        },
        punishDelay: model.contractCondition.punishDelay && {
          tenderDocumentRequirementPercent: model.contractCondition.punishDelay.tenderDocumentRequirementPercent,
          tenderDocumentRequirementMax: model.contractCondition.punishDelay.tenderDocumentRequirementMax,
          suggestionPercent: model.contractCondition.punishDelay.suggestionDiscountPercent,
          suggestionMax: model.contractCondition.punishDelay.suggestionMax,
          note: model.contractCondition.punishDelay.note
        },
        constructionWarrantyTime: model.contractCondition.constructionWarrantyTime && {
          percent: model.contractCondition.constructionWarrantyTime.percent,
          money: model.contractCondition.constructionWarrantyTime.money,
          bond: model.contractCondition.constructionWarrantyTime.bond,
          month: model.contractCondition.constructionWarrantyTime.month,
          note: model.contractCondition.constructionWarrantyTime.note
        },
        disadvantage: model.contractCondition.disadvantage && {
          disadvantageName: model.contractCondition.disadvantage.disadvantageName,
          note: model.contractCondition.disadvantage.note
        }
      },
      tentativeTenderPrice: model.tentativeTenderPrice && {
        costOfCapital: model.tentativeTenderPrice.costOfCapital && {
          baseTenderAmount: model.tentativeTenderPrice.costOfCapital.baseTenderAmount,
          baseTenderGFA: model.tentativeTenderPrice.costOfCapital.baseTenderGFA,
          alternativeTenderAmount: model.tentativeTenderPrice.costOfCapital.alternativeTenderAmount,
          alternativeTenderGFA: model.tentativeTenderPrice.costOfCapital.alternativeTenderGFA,
          note: model.tentativeTenderPrice.costOfCapital.note
        },
        costOfCapitalGeneralCost: model.tentativeTenderPrice.costOfCapitalGeneralCost && {
          baseTenderAmount: model.tentativeTenderPrice.costOfCapitalGeneralCost.baseTenderAmount,
          baseTenderGFA: model.tentativeTenderPrice.costOfCapitalGeneralCost.baseTenderGFA,
          alternativeTenderAmount: model.tentativeTenderPrice.costOfCapitalGeneralCost.alternativeTenderAmount,
          alternativeTenderGFA: model.tentativeTenderPrice.costOfCapitalGeneralCost.alternativeTenderGFA,
          note: model.tentativeTenderPrice.costOfCapitalGeneralCost.note
        },
        costOfCapitalValue: model.tentativeTenderPrice.costOfCapitalValue && {
          baseTenderAmount: model.tentativeTenderPrice.costOfCapitalValue.baseTenderAmount,
          baseTenderGFA: model.tentativeTenderPrice.costOfCapitalValue.baseTenderGFA,
          alternativeTenderAmount: model.tentativeTenderPrice.costOfCapitalValue.alternativeTenderAmount,
          alternativeTenderGFA: model.tentativeTenderPrice.costOfCapitalValue.alternativeTenderGFA,
          note: model.tentativeTenderPrice.costOfCapitalValue.note
        },
        costOfCapitalPCPSValue: model.tentativeTenderPrice.costOfCapitalPCPSValue && {
          baseTenderAmount: model.tentativeTenderPrice.costOfCapitalPCPSValue.baseTenderAmount,
          baseTenderGFA: model.tentativeTenderPrice.costOfCapitalPCPSValue.baseTenderGFA,
          alternativeTenderAmount: model.tentativeTenderPrice.costOfCapitalPCPSValue.alternativeTenderAmount,
          alternativeTenderGFA: model.tentativeTenderPrice.costOfCapitalPCPSValue.alternativeTenderGFA,
          note: model.tentativeTenderPrice.costOfCapitalPCPSValue.note
        },
        totalCostOfCapital: model.tentativeTenderPrice.totalCostOfCapital && {
          baseTenderAmount: model.tentativeTenderPrice.totalCostOfCapital.baseTenderAmount,
          baseTenderGFA: model.tentativeTenderPrice.totalCostOfCapital.baseTenderGFA,
          alternativeTenderAmount: model.tentativeTenderPrice.totalCostOfCapital.alternativeTenderAmount,
          alternativeTenderGFA: model.tentativeTenderPrice.totalCostOfCapital.alternativeTenderGFA,
          note: model.tentativeTenderPrice.totalCostOfCapital.note
        },
        totalCostOfCapitalProfitCost: model.tentativeTenderPrice.totalCostOfCapitalProfitCost && {
          baseTenderProfitCost: model.tentativeTenderPrice.totalCostOfCapitalProfitCost.baseTenderProfitCost,
          alternativeProfitCost: model.tentativeTenderPrice.totalCostOfCapitalProfitCost.alternativeProfitCost,
          note: model.tentativeTenderPrice.totalCostOfCapitalProfitCost.note
        },
        totalCostOfSubmission: model.tentativeTenderPrice.totalCostOfSubmission && {
          baseTenderAmount: model.tentativeTenderPrice.totalCostOfSubmission.baseTenderAmount,
          baseTenderGFA: model.tentativeTenderPrice.totalCostOfSubmission.baseTenderGFA,
          alternativeTenderAmount: model.tentativeTenderPrice.totalCostOfSubmission.alternativeTenderAmount,
          alternativeTenderGFA: model.tentativeTenderPrice.totalCostOfSubmission.alternativeTenderGFA,
          note: model.tentativeTenderPrice.totalCostOfSubmission.note
        },
        oAndPPercentOfTotalCost: model.tentativeTenderPrice.oAndPPercentOfTotalCost && {
          baseTenderAmount: model.tentativeTenderPrice.oAndPPercentOfTotalCost.baseTenderAmount,
          alternativeTenderAmount: model.tentativeTenderPrice.oAndPPercentOfTotalCost.alternativeTenderAmount,
          note: model.tentativeTenderPrice.oAndPPercentOfTotalCost.note
        }
      },
    };
  }

}
