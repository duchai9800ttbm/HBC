import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { TenderPriceApproval } from '../models/price-review/price-review.model';

@Injectable()
export class PriceReviewService {

  constructor(
    private apiService: ApiService
  ) { }

  truongNhomDuyet(bidOpportunityId: number) {
    const url = `bidopportunity/${bidOpportunityId}/approvedbytenderleader`;
    return this.apiService.post(url);
  }

  truongNhomKhongDuyet(bidOpportunityId: number) {
    const url = `bidopportunity/${bidOpportunityId}/unapprovedbytenderleader`;
    return this.apiService.post(url);
  }

  truongPhongDuyet(bidOpportunityId: number) {
    const url = `bidopportunity/${bidOpportunityId}/approvedbytendermanager`;
    return this.apiService.post(url);
  }

  truongPhongKhongDuyet(bidOpportunityId: number) {
    const url = `bidopportunity/${bidOpportunityId}/unapprovedbytendermanager`;
    return this.apiService.post(url);
  }

  giamDocDuyet(bidOpportunityId: number) {
    const url = `bidopportunity/${bidOpportunityId}/approvedbyboardofdirector`;
    return this.apiService.post(url);
  }

  giamDocKhongDuyet(bidOpportunityId: number) {
    const url = `bidopportunity/${bidOpportunityId}/unapprovedbyboardofdirector`;
    return this.apiService.post(url);
  }

  view(bidOpportunityId: number) {
    const url = `bidopportunity/${bidOpportunityId}/tenderpriceapproval`;
    return this.apiService.get(url).map(response => {
      if (response.result) {
        this.toTenderPriceApproval(response.result);
      } else {
        return null;
      }
    });
  }


  createOrEdit(formValue: any) {
    const url = `tenderpriceapproval/createorupdate`;
    const modelRequest = new TenderPriceApproval();
    modelRequest.bidOpportunityId = 238;
    modelRequest.projectInformation = {
      foudationPart: {
        scopeOfWorkIsInclude: formValue.phanMongCheck ? formValue.phanMongCheck : false,
        scopeOfWorkDesc: formValue.phanMongDesc,
      },
      basementPart: {
        scopeOfWorkIsInclude: formValue.phanHamCheck ? formValue.phanHamCheck : false,
        scopeOfWorkDesc: formValue.phanHamDesc,
      },
      basementPartConstructionStructure: {
        scopeOfWorkIsInclude: formValue.ketCauCheck ? formValue.ketCauCheck : false,
        scopeOfWorkDesc: formValue.ketCauDesc,
      },
      basementPartConstructionCompletion: {
        scopeOfWorkIsInclude: formValue.hoanThienCheck ? formValue.hoanThienCheck : false,
        scopeOfWorkDesc: formValue.hoanThienDesc,
      },
      basementPartOtherWork: {
        scopeOfWorkIsInclude: formValue.congViecKhacCheck ? formValue.congViecKhacCheck : false,
        scopeOfWorkDesc: formValue.congViecKhacDesc,
      },
      bodyPart: {
        scopeOfWorkIsInclude: formValue.phanThanCheck ? formValue.phanThanCheck : false,
        scopeOfWorkDesc: formValue.phanThanDesc,
      },
      bodyPartConstructionStructure: {
        scopeOfWorkIsInclude: formValue.phanThanKetCauCheck ? formValue.phanThanKetCauCheck : false,
        scopeOfWorkDesc: formValue.phanThanKetCauDesc,
      },
      bodyPartConstructionCompletion: {
        scopeOfWorkIsInclude: formValue.phanThanHoanThienCheck ? formValue.phanThanHoanThienCheck : false,
        scopeOfWorkDesc: formValue.phanThanhoanThienDesc,
      },
      bodyPartOtherWork: {
        scopeOfWorkIsInclude: formValue.phanThancongViecKhacCheck ? formValue.phanThancongViecKhacCheck : false,
        scopeOfWorkDesc: formValue.phanThancongViecKhacDesc,
      },
      gfa: formValue.infoGfa
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
        },
        basementPart: model.projectInformation.basementPart && {
          scopeOfWorkIsInclude: model.projectInformation.basementPart.scopeOfWorkIsInclude,
          scopeOfWorkDesc: model.projectInformation.basementPart.scopeOfWorkDesc,
        },
        basementPartConstructionStructure: model.projectInformation.basementPartConstructionStructure && {
          scopeOfWorkIsInclude: model.projectInformation.basementPartConstructionStructure.scopeOfWorkIsInclude,
          scopeOfWorkDesc: model.projectInformation.basementPartConstructionStructure.scopeOfWorkDesc,
        },
        basementPartConstructionCompletion: model.projectInformation.basementPartConstructionCompletion && {
          scopeOfWorkIsInclude: model.projectInformation.basementPartConstructionCompletion.scopeOfWorkIsInclude,
          scopeOfWorkDesc: model.projectInformation.basementPartConstructionCompletion.scopeOfWorkDesc,
        },
        basementPartOtherWork: model.projectInformation.basementPartOtherWork && {
          scopeOfWorkIsInclude: model.projectInformation.basementPartOtherWork.scopeOfWorkIsInclude,
          scopeOfWorkDesc: model.projectInformation.basementPartOtherWork.scopeOfWorkDesc,
        },
        bodyPart: model.projectInformation.bodyPart && {
          scopeOfWorkIsInclude: model.projectInformation.bodyPart.scopeOfWorkIsInclude,
          scopeOfWorkDesc: model.projectInformation.bodyPart.scopeOfWorkDesc,
        },
        bodyPartConstructionStructure: model.projectInformation.bodyPartConstructionStructure && {
          scopeOfWorkIsInclude: model.projectInformation.bodyPartConstructionStructure.scopeOfWorkIsInclude,
          scopeOfWorkDesc: model.projectInformation.bodyPartConstructionStructure.scopeOfWorkDesc,
        },
        bodyPartConstructionCompletion: model.projectInformation.bodyPartConstructionCompletion && {
          scopeOfWorkIsInclude: model.projectInformation.bodyPartConstructionCompletion.scopeOfWorkIsInclude,
          scopeOfWorkDesc: model.projectInformation.bodyPartConstructionCompletion.scopeOfWorkDesc,
        },
        bodyPartOtherWork: model.projectInformation.bodyPartConstructionCompletion && {
          scopeOfWorkIsInclude: model.projectInformation.bodyPartConstructionCompletion.scopeOfWorkIsInclude,
          scopeOfWorkDesc: model.projectInformation.bodyPartConstructionCompletion.scopeOfWorkDesc,
        },
        gfa: model.projectInformation.gfa
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
