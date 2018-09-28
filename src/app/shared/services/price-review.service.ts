import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { TenderPriceApproval, TenderPriceApprovalShort, ItemHSDTChinhThuc, PriceReviewItemChangedHistory } from '../models/price-review/price-review.model';
import { SessionService } from './session.service';
import DateTimeConvertHelper from '../helpers/datetime-convert-helper';
import * as FileSaver from 'file-saver';
import { Observable } from '../../../../node_modules/rxjs/Observable';
import { PagedResult } from '../models';
import { SiteReportChangedHistory } from '../models/site-survey-report/site-report-changed-history';

@Injectable()
export class PriceReviewService {

  constructor(
    private apiService: ApiService,
    private sessionService: SessionService
  ) { }

  get employeeId() {
    return this.sessionService.currentUser.employeeId;
  }

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

  guiDuyetTrinhDuyetGia(bidOpportunityId: number) {
    const url = `bidopportunity/hsdt/${bidOpportunityId}/guiduyettrinhduyetgia`;
    return this.apiService.post(url);
  }

  guiDuyetLaiTrinhDuyetGia(bidOpportunityId: number) {
    const url = `bidopportunity/hsdt/${bidOpportunityId}/guilaiduyettrinhduyetgia`;
    return this.apiService.post(url);
  }

  chotHoSo(bidOpportunityId: number) {
    const url = `bidopportunity/hsdt/${bidOpportunityId}/chothoso`;
    return this.apiService.post(url);
  }

  hieuChinhHSDT(bidOpportunityId: number) {
    const url = `bidopportunity/hsdt/${bidOpportunityId}/hieuchinhhsdt`;
    return this.apiService.post(url);
  }

  getDanhSachHSDTChinhThuc(bidOpportunityId: number) {
    const url = `bidopportunity/${bidOpportunityId}/approvaltenderdocs`;
    return this.apiService.get(url).map(response => response.result.map(this.toItemHSDTChinhThuc));
  }

  changedHistoryPriceReview(bidOpportunityId: number, page: string | number, pageSize: number | string)
    : Observable<PagedResult<PriceReviewItemChangedHistory>> {
    const url = `${bidOpportunityId}/tenderpriceapproval/changedhistory/${page}/${pageSize}`;
    return this.apiService.get(url).map(res => {
      const response = res.result;
      return {
        currentPage: response.pageIndex,
        pageSize: response.pageSize,
        pageCount: response.totalPages,
        total: response.totalCount,
        items: (response.items || [])
      };
    });
  }

  toItemHSDTChinhThuc(model: any): ItemHSDTChinhThuc {
    return {
      typeName: model.typeName,
      document: model.document && {
        type: model.document.type,
        id: model.document.id,
        name: model.document.name,
        interviewTime: model.document.interviewTime
      },
      childs: model.childs ? model.childs : []
    };
  }

  upload(
    id: number,
    documentName: string,
    description: string,
    file: File,
    link: string,
  ) {
    const url = `tenderpriceapproval/document/upload`;
    const formData = new FormData();
    formData.append('BidOpportunityId', `${id}`);
    formData.append('Name', documentName);
    formData.append('Desc', description);
    formData.append('File', file);
    formData.append('Url', link);
    return this.apiService.postFile(url, formData)
      .map(response => response)
      .share();
  }

  download(tenderPriceApprovalDocumentId: number) {
    const url = `tenderpriceapproval/document/${tenderPriceApprovalDocumentId}/download`;
    return this.apiService.getFile(url).map(response => {
      return FileSaver.saveAs(
        new Blob([response.file], {
          type: `${response.file.type}`,
        }), response.fileName
      );
    });
  }

  downloadTemplate() {
    const url = `tenderpriceapproval/template`;
    return this.apiService.getFile(url).map(response => {
      return FileSaver.saveAs(
        new Blob([response.file], {
          type: `${response.file.type}`,
        }), response.fileName
      );
    });
  }

  view(bidOpportunityId: number) {
    const url = `bidopportunity/${bidOpportunityId}/tenderpriceapproval`;
    return this.apiService.get(url).map(response => {
      if (!response.result) {
        return null;
      }
      return this.toTenderPriceApproval(response.result);
    });
  }

  viewShort(bidOpportunityId: number) {
    const url = `bidopportunity/${bidOpportunityId}/tenderpriceapproval/getshortinformation`;
    return this.apiService.get(url).map(response => {
      if (!response.result) {
        return null;
      }
      return this.toTenderPriceApprovalShort(response.result);
    });
  }

  delete(bidOpportunityId: number) {
    const url = `bidopportunity/${bidOpportunityId}/tenderpriceapproval/delete`;
    return this.apiService.post(url);
  }

  createOrEdit(formValue: any, bidopportunityId: number) {
    const url = `tenderpriceapproval/createorupdate`;
    const modelRequest = new TenderPriceApproval();
    modelRequest.bidOpportunityId = bidopportunityId;
    modelRequest.createdEmployeeId = formValue.id ? formValue.createdEmployeeId : this.employeeId;
    modelRequest.updatedEmployeeId = this.employeeId;
    modelRequest.isDraftVersion = formValue.isDraftVersion ? formValue.isDraftVersion : false;
    modelRequest.approvalDate = DateTimeConvertHelper.fromDtObjectToTimestamp(formValue.approvalDate) / 1000;
    modelRequest.approvalTimes = formValue.approvalTimes;
    modelRequest.interviewTimes = formValue.interviewTimes;
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
    modelRequest.contractCondition = {
      advanceMoney: {
        tenderDocumentRequirementPercent: formValue.tamUngYCPercent,
        tenderDocumentRequirementDiscountPercent: formValue.tamUngYCKhauTru,
        suggestionPercent: formValue.tamUngDXPercent,
        suggestionDiscountPercent: formValue.tamUngDXKhauTru,
        note: formValue.tamUngCY,
      },
      paymentTime: {
        tenderDocumentRequirementDay: formValue.thoiGianYC,
        suggestionDay: formValue.thoiGianDX,
        note: formValue.thoiGianCY
      },
      retainedMoney: {
        tenderDocumentRequirementPercent: formValue.tienGiuLaiYCPercent,
        tenderDocumentRequirementMaxPercent: formValue.tienGiuLaiYCKhauTru,
        requirementPercent: formValue.tienGiuLaiDXPercent,
        requirementMaxPercent: formValue.tienGiuLaiDXKhauTru,
        note: formValue.tienGiuLaiCY
      },
      punishDelay: {
        tenderDocumentRequirementPercent: formValue.phatTienDoYCPercent,
        tenderDocumentRequirementMax: formValue.phatTienDoYCMax,
        suggestionPercent: formValue.phatTienDoDXPercent,
        suggestionMax: formValue.phatTienDoDXMax,
        note: formValue.phatTienDoCY
      },
      constructionWarrantyTime: {
        percent: formValue.thoiGianBHYCPercent,
        money: formValue.thoiGianBHYCAmount,
        bond: formValue.thoiGianBHDXBond,
        month: formValue.thoiGianBHMonth,
        note: formValue.thoiGianBHCY,
      },
      disadvantage: {
        disadvantageName: formValue.dieuKienDacBiet,
        note: formValue.dieuKienDacBietCY
      }

    };

    modelRequest.tentativeTenderPrice = {
      costOfCapital: {
        baseTenderAmount: formValue.giaVonBaseAmount,
        baseTenderGFA: formValue.giaVonBaseGfa,
        alternativeTenderAmount: formValue.giaVonAlterAmount,
        alternativeTenderGFA: formValue.giaVonAlterGfa,
        note: formValue.giaVonCY
      },
      costOfCapitalGeneralCost: {
        baseTenderAmount: formValue.chiPhiBaseAmount,
        baseTenderGFA: formValue.chiPhiBaseGfa,
        alternativeTenderAmount: formValue.chiPhiAlterAmount,
        alternativeTenderGFA: formValue.chiPhiAlterGfa,
        note: formValue.chiPhiAlterNote
      },
      costOfCapitalValue: {
        baseTenderAmount: formValue.giaTriBaseAmount,
        baseTenderGFA: formValue.giaTriBaseGfa,
        alternativeTenderAmount: formValue.giaTriAlterAmount,
        alternativeTenderGFA: formValue.giaTriAlterGfa,
        note: formValue.giaTriNote
      },
      costOfCapitalPCPSValue: {
        baseTenderAmount: formValue.giaTriPCBaseAmount,
        baseTenderGFA: formValue.giaTriPCBaseGfa,
        alternativeTenderAmount: formValue.giaTriPCAlterAmount,
        alternativeTenderGFA: formValue.giaTriPCAlterGfa,
        note: formValue.giaTriPCNote
      },
      totalCostOfCapital: {
        baseTenderAmount: formValue.totalGiaVonAmount,
        baseTenderGFA: formValue.totalGiaVonGfa,
        alternativeTenderAmount: null,
        alternativeTenderGFA: null,
        note: formValue.totalGiaVonNote
      },
      totalCostOfCapitalProfitCost: {
        baseTenderProfitCost: formValue.chiPhiLoiNhuanAmountGfa,
        alternativeProfitCost: formValue.chiPhiLoiNhuanAlterAmountGfa,
        note: formValue.chiPhiLoiNhuanNote
      },
      totalCostOfSubmission: {
        baseTenderAmount: formValue.giaDiNopThauAmount,
        baseTenderGFA: formValue.giaDiNopThauGfa,
        alternativeTenderAmount: formValue.giaDiNopThauAlterAmount,
        alternativeTenderGFA: formValue.giaDiNopThauAlterGfa,
        note: formValue.giaDiNopThauNote
      },
      oAndPPercentOfTotalCost: {
        baseTenderAmount: formValue.tyLeGfa,
        alternativeTenderAmount: null,
        note: formValue.tyLeNote
      }
    };
    console.log(modelRequest);
    return this.apiService.post(url, modelRequest)
      .map(response => this.toTenderPriceApproval(response.result));
  }

  toTenderPriceApprovalShort(model: any): TenderPriceApprovalShort {
    return {
      id: model.id,
      name: model.name,
      files: model.files.map(x => ({
        id: x.id,
        name: x.name,
        guid: x.guid,
        url: x.url,
        desc: x.desc,
        uploadDate: x.uploadDate
      })),
      interviewTimes: model.interviewTimes,
      isDraftVersion: model.isDraftVersion,
      approvalTimes: model.approvalTimes,
      createdEmployee: model.createdEmployee && {
        employeeId: model.createdEmployee.employeeId,
        employeeNo: model.createdEmployee.employeeNo,
        employeeName: model.createdEmployee.employeeName,
        employeeAvatar: model.createdEmployee.employeeAvatar,
        employeeEmail: model.createdEmployee.employeeEmail
      },
      createdDate: model.createdDate
    };
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
          note: model.contractCondition.retainedMoney.note
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
      // chờ Nghĩa map lại
      interviewTimes: null,
      createdEmployeeId: null,
      updatedEmployeeId: null
    };
  }

}
