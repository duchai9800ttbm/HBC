import { Injectable } from '@angular/core';
import { SessionService } from './session.service';
import { ApiService } from './api.service';
import { Observable } from 'rxjs/Observable';
import { DictionaryItem, PagedResult } from '../models';
import { SiteReportChangedHistory } from '../models/site-survey-report/site-report-changed-history';
import { SiteSurveyReport } from '../models/site-survey-report/site-survey-report';
import { ScaleOverall } from '../models/site-survey-report/scale-overall.model';
import { ImageItem } from '../models/site-survey-report/image';
import { AlertService } from './alert.service';
import * as FileSaver from 'file-saver';
import { DanhSachBoHsdtItem } from '../models/ho-so-du-thau/danh-sach-bo-hsdt-item.model';
import { HsdtFilterModel } from '../models/ho-so-du-thau/hsdt-filter.model';
import { URLSearchParams } from '@angular/http';
import { InstantSearchService } from './instant-search.service';
import { DuLieuLiveFormDKDT } from '../models/ho-so-du-thau/tom-tat-dkdt.model';
// tslint:disable-next-line:import-blacklist
import { BehaviorSubject } from 'rxjs';
import { ThongTinDuAn } from '../models/ho-so-du-thau/thong-tin-du-an';
import { CacBenLienQuan } from '../models/ho-so-du-thau/cac-ben-lien-quan';
import { PhamViCongViec } from '../models/ho-so-du-thau/pham-vi-cong-viec';
import { DanhSachNhaThau } from '../models/ho-so-du-thau/danh-sach-nha-thau';
import { DanhSachVatTu, HoSoDangLuuY, DienGiaiYeuCauHoSo } from '../models/ho-so-du-thau/danh-sach-vat-tu';
import { DienGiaiYeuCauLamRo, DienGiaiDieuKienHopDong, DienGiaiDieuKienHSMT } from '../models/ho-so-du-thau/dien-giai-yeu-cau';
import { TableYeuCauDacBiet } from '../models/ho-so-du-thau/table-yeu-cau';
import DateTimeConvertHelper from '../helpers/datetime-convert-helper';
import { StakeHolder } from '../models/ho-so-du-thau/stack-holder.model';

@Injectable()
export class HoSoDuThauService {

  static tempDataLiveFormDKDT = new BehaviorSubject<DuLieuLiveFormDKDT>(new DuLieuLiveFormDKDT());
  static detectChangeRouter = new BehaviorSubject<boolean>(false);
  static idTenderDocumentTypesData;

  private static createFilterParams(filter: HsdtFilterModel): URLSearchParams {
    const numCreatedDate = DateTimeConvertHelper.fromDtObjectToSecon(filter.createdDate);
    const urlFilterParams = new URLSearchParams();
    urlFilterParams.append('status', filter.status);
    urlFilterParams.append('uploadedEmployeeId', `${filter.uploadedEmployeeId ? filter.uploadedEmployeeId : ''}`);
    urlFilterParams.append('interViewTimes', `${filter.interViewTimes ? filter.interViewTimes : ''}`);
    urlFilterParams.append('createdDate', `${numCreatedDate ? numCreatedDate : ''}`);
    return urlFilterParams;
  }

  constructor(
    private apiService: ApiService,
    private instantSearchService: InstantSearchService
  ) { }
  // get Danh sách các bên liên quan
  getGroupMemberStackHolder(bidOpportunityId: number): Observable<any> {
    const url = `bidopportunity/${bidOpportunityId}/bidusergroupmembersofstakeholders`;
    return this.apiService.get(url).map(res => res.result);
  }
  // emit data to child component
  transporterData(id) {
    HoSoDuThauService.idTenderDocumentTypesData = id;
  }
  watchChangingRouter() {
    return HoSoDuThauService.detectChangeRouter;
  }
  detectChangingRouter(id) {
    HoSoDuThauService.detectChangeRouter.next(id);
  }
  // get Danh Sách User
  getDataUser(
    page: number,
    pageSize: number
  ) {
    const url = `user/${page}/${pageSize}`;
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
  // Tải lên hồ sơ dự thầu
  taiLenHoSoDuThau(
    bidOpportunityId: number,
    tenderDocumentTypeId: number,
    tenderDocumentName: string,
    tenderDocumentDesc: string,
    tenderDocumentFile: File,
    link: string,
    version: number,
    interviewTimes: number
  ) {
    const url = `tenderdocument/upload`;
    const formData = new FormData();
    formData.append('BidOpportunityId', `${bidOpportunityId}`);
    formData.append('TenderDocumentTypeId', `${tenderDocumentTypeId}`);
    formData.append('TenderDocumentName', tenderDocumentName);
    formData.append('TenderDocumentDesc', tenderDocumentDesc);
    formData.append('TenderDocumentFile', tenderDocumentFile);
    formData.append('Url', link);
    formData.append('Version', `${version ? version : ''}`);
    formData.append('InterviewTimes', `${interviewTimes ? interviewTimes : ''}`);
    return this.apiService.postFile(url, formData).map(response => response).share();
  }
  // Tải Template
  taiTemplateHSDT(): Observable<any> {
    const url = `tenderdocument/template/download`;
    return this.apiService.getFile(url).map(response => {
      return FileSaver.saveAs(
        new Blob([response.file], {
          type: `${response.file.type}`,
        }), response.fileName
      );
    });
  }
  // Tải hồ sơ dự thầu
  taiHoSoDuThau(tenderDocumentId: number) {
    const url = `tenderdocument/${tenderDocumentId}/download`;
    return this.apiService.getFile(url).map(response => {
      return FileSaver.saveAs(
        new Blob([response.file], {
          type: `${response.file.type}`,
        }), response.fileName
      );
    });
  }
  // Xóa 1 hồ sơ dự thầu
  xoaMotHoSoDuThau(tenderDocumentId: number) {
    const url = `tenderdocument/${tenderDocumentId}/delete`;
    return this.apiService.post(url).map(res => res);
  }
  // Xóa nhiều hồ sơ dự thầu
  xoaNhieuHoSoDuThau(tenderDocumentIds: any[]) {
    const url = `tenderdocument/deletemultiple`;
    const model = {
      ids: tenderDocumentIds
    };
    return this.apiService.post(url, model).map(res => res);
  }
  // get Danh sách loại tài liệu hồ sơ dự thầu (kèm số lượng file của mỗi loại tài liệu) theo gói thầu
  getDanhSachLoaiTaiLieu(bidOpportunityId: number): Observable<any> {
    // GET /api/hbc/bidopportunity/{bidOpportunityId}/tenderdocumentmajortypes
    const url = `bidopportunity/${bidOpportunityId}/tenderdocumentmajortypes`;
    return this.apiService.get(url).map(res => res.result);
  }
  // Chốt hồ sơ dự thầu
  chotHoSoDuThau(bidOpportunityId): Observable<any> {
    const url = `bidopportunity/hsdt/${bidOpportunityId}/chothosoduthau`;
    return this.apiService.post(url).map(res => res);
  }
  // Danh sách bộ hồ sơ dự thầu theo gói thầu; tìm kiếm theo tên tài liệu, lọc theo trạng thái, người upload, ngày upload; có phân trang
  danhSachBoHoSoDuThau(
    bidOpportunityId: number | string,
    searchTerm: string,
    hsdtFilter: HsdtFilterModel,
    page: number,
    pageSize: number,
  ): Observable<PagedResult<DanhSachBoHsdtItem>> {
    const url = `bidopportunity/${bidOpportunityId}/tenderdocuments/${page}/${pageSize}?searchTerm=${searchTerm}`;
    const urlParams = HoSoDuThauService.createFilterParams(hsdtFilter);

    return this.apiService.get(url, urlParams).map(res => {
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
  // GET /api/hbc/bidopportunity/{bidOpportunityId}/tenderdocuments/{page}/{pageSize}
  danhSachBoHoSoDuThauInstantSearch(
    bidOpportunityId: number,
    searchTerm: Observable<string>,
    hsdtFilter: HsdtFilterModel,
    page: number,
    pageSize: number
  ): Observable<PagedResult<DanhSachBoHsdtItem>> {
    const url = `bidopportunity/${bidOpportunityId}/tenderdocuments/${page}/${pageSize}?searchTerm=`;
    const urlParams = HoSoDuThauService.createFilterParams(hsdtFilter);
    return this.instantSearchService
      .searchWithFilter(url, searchTerm, urlParams)
      .map(res => {
        return {
          currentPage: res.pageIndex,
          pageSize: res.pageSize,
          pageCount: res.totalPages,
          total: res.totalCount,
          items: (res.items || [])
        };
      });
  }

  updateStatus(tenderDocumentId: number, status: string) {
    const url = `tenderdocument/${tenderDocumentId}/${status.toLocaleLowerCase()}`;
    return this.apiService.post(url).map(response => response);
  }

  // LiveForm Tóm tắt điều kiện dự thầu
  watchDataLiveForm(): Observable<DuLieuLiveFormDKDT> {
    return HoSoDuThauService.tempDataLiveFormDKDT;
  }
  // Các hàm emit data LiveForm tóm tắt đkdt
  emitDataAll(obj: DuLieuLiveFormDKDT) {
    HoSoDuThauService.tempDataLiveFormDKDT.next(obj);
  }
  emitDataStepInfo(obj: ThongTinDuAn) {
    HoSoDuThauService.tempDataLiveFormDKDT.value.thongTinDuAn = obj;
  }
  emitDataStepRelate(obj: CacBenLienQuan) {
    HoSoDuThauService.tempDataLiveFormDKDT.value.cacBenLienQuan = obj;
  }
  emitDataStepScope(obj: PhamViCongViec) {
    HoSoDuThauService.tempDataLiveFormDKDT.value.phamViCongViec = obj;
  }
  emitDataStepSubContractor(obj: DanhSachNhaThau[]) {
    HoSoDuThauService.tempDataLiveFormDKDT.value.danhSachNhaThau = obj;
  }
  emitDataStepMainMaterial(obj: DanhSachVatTu[]) {
    HoSoDuThauService.tempDataLiveFormDKDT.value.danhSachVatTu = obj;
  }
  emitDataStepTenderSubmit(obj: HoSoDangLuuY) {
    HoSoDuThauService.tempDataLiveFormDKDT.value.hoSoDangLuuY = obj;
  }
  emitDataStepDestination(obj: DienGiaiYeuCauHoSo) {
    HoSoDuThauService.tempDataLiveFormDKDT.value.dienGiaiYeuCauHoSo = obj;
  }
  emitDataStepClarification(obj: DienGiaiYeuCauLamRo) {
    HoSoDuThauService.tempDataLiveFormDKDT.value.dienGiaiYeuCauLamRo = obj;
  }
  emitDataStepConditionContract(obj: DienGiaiDieuKienHopDong) {
    HoSoDuThauService.tempDataLiveFormDKDT.value.dienGiaiDieuKienHopDong = obj;
  }
  emitDataStepConditionTender(obj: DienGiaiDieuKienHSMT) {
    HoSoDuThauService.tempDataLiveFormDKDT.value.dienGiaiDieuKienHSMT = obj;
  }
  emitDataStepSpecial(obj: TableYeuCauDacBiet[]) {
    HoSoDuThauService.tempDataLiveFormDKDT.value.yeuCauDacBietKhac = obj;
  }
  emitDataUpdateDescription(text: string) {
    HoSoDuThauService.tempDataLiveFormDKDT.value.noiDungCapNhat = text;
  }
  // gọi API create or update liveform tóm tắt đkdt
  // createOrUpdateLiveFormTomTat(obj: DuLieuLiveFormDKDT): Observable<any> {
  //   const url = `tenderconditionalsummary/createorupdate`;
  //   const infoReport = {


  //     bidOpportunityId: obj.bidOpportunityId,
  //     createdEmployeeId: obj.createdEmployeeId,
  //     updatedEmployeeId: obj.updatedEmployeeId,
  //     isDraftVersion: obj.isDraftVersion,
  //     documentName: obj.documentName,
  //     updatedDesc: obj.updatedDesc,
  //     projectInformation: {
  //       projectInformation: obj.thongTinDuAn.dienGiaiThongTinDuAn,
  //       interviewTimes: obj.thongTinDuAn.lanPhongVan
  //     },
  //     stakeholder: obj.cacBenLienQuan,
  //     scopeOfWork: obj.phamViCongViec && {
  //       includedWorks: obj.phamViCongViec.phamViBaoGom.forEach(x => ({
  //         name: x.congTac,
  //         desc: x.dienGiaiCongTac
  //       })),
  //       nonIncludedWorks: obj.phamViCongViec.phamViKhongBaoGom.forEach(x => ({
  //         name: x.congTac,
  //         desc: x.dienGiaiCongTac
  //       }))
  //     },
  //     nonminatedSubContractor: obj.danhSachNhaThau && {
  //       workPackages: obj.danhSachNhaThau.forEach(x => ({
  //         name: x.tenGoiCongViec,
  //         desc: x.ghiChuThem,
  //         totalCost: x.thanhTien
  //       }))
  //     },
  //     materialsTobeSuppliedOrAppointedByOwner: obj.danhSachVatTu && {
  //       materials: obj.danhSachVatTu.forEach(x => ({
  //         name: x.tenVatTu,
  //         desc: x.ghiChuThem
  //       }))
  //     },
  //     mainItemOfTenderSubmission: obj.hoSoDangLuuY && {
  //       attentiveDocuments: [...obj.hoSoDangLuuY.taiLieuLuuY],
  //       quantity: obj.hoSoDangLuuY.soLuong,
  //       languages: obj.hoSoDangLuuY.ngonNgu
  //     },
  //     requestDocument: obj.dienGiaiYeuCauHoSo && {
  //       destination: obj.dienGiaiYeuCauHoSo.noiNop,
  //       receivedPerson: obj.dienGiaiYeuCauHoSo.nguoiNhan,
  //       closingTime: obj.dienGiaiYeuCauHoSo.hanNop
  //     },
  //     requestTenderClarification: obj.dienGiaiYeuCauLamRo && {
  //       consultant: obj.dienGiaiYeuCauLamRo.nhaTuVan && {
  //         companyName: obj.dienGiaiYeuCauLamRo.nhaTuVan.tenCongTy,
  //         companyAddress: obj.dienGiaiYeuCauLamRo.nhaTuVan.diaChiCongTy,
  //         contactPerson: obj.dienGiaiYeuCauLamRo.nhaTuVan.nguoiLienHe && {
  //           name: obj.dienGiaiYeuCauLamRo.nhaTuVan.nguoiLienHe.hoVaTen,
  //           address: obj.dienGiaiYeuCauLamRo.nhaTuVan.nguoiLienHe.diaChi,
  //           email: obj.dienGiaiYeuCauLamRo.nhaTuVan.nguoiLienHe.email,
  //           level: obj.dienGiaiYeuCauLamRo.nhaTuVan.nguoiLienHe.viTri
  //         }
  //       },
  //       employer: obj.dienGiaiYeuCauLamRo.nhaSuDung && {
  //         companyName: obj.dienGiaiYeuCauLamRo.nhaSuDung.tenCongTy,
  //         companyAddress: obj.dienGiaiYeuCauLamRo.nhaSuDung.diaChiCongTy,
  //         contactPerson: obj.dienGiaiYeuCauLamRo.nhaSuDung.nguoiLienHe && {
  //           name: obj.dienGiaiYeuCauLamRo.nhaSuDung.nguoiLienHe.hoVaTen,
  //           address: obj.dienGiaiYeuCauLamRo.nhaSuDung.nguoiLienHe.diaChi,
  //           email: obj.dienGiaiYeuCauLamRo.nhaSuDung.nguoiLienHe.email,
  //           level: obj.dienGiaiYeuCauLamRo.nhaSuDung.nguoiLienHe.viTri
  //         }
  //       },
  //       closingTime: obj.dienGiaiYeuCauLamRo && {
  //         closingTime: obj.dienGiaiYeuCauLamRo.ngayHetHan,
  //         desc: obj.dienGiaiYeuCauLamRo.ghiChuThem
  //       }
  //     },
  //     "contractCondition": {
  //       "contractType": "string",
  //       "desc": "string",
  //       "contractCondition": {
  //         "executiveGuaranteePercent": 0,
  //         "executiveGuaranteeEfficiency": 0,
  //         "advanceGuaranteePercent": 0,
  //         "advanceGuaranteeEfficiency": 0,
  //         "paymentType": "string",
  //         "paymentTime": 0,
  //         "paymentMaterialOnSite": "string",
  //         "retainedPercent": 0,
  //         "retainedLimit": 0,
  //         "retainedPayment": 0,
  //         "punishhOverduePercent": 0,
  //         "punishhOverdueLimit": 0,
  //         "guaranteeDuration": 0,
  //         "insurranceMachineOfContractor": "string",
  //         "insurrancePersonOfContractor": "string",
  //         "insurranceConstructionAnd3rdPart": "string"
  //       }
  //     },
  //     "jsonTenderCondition": {
  //       "tenderGuaranteeValue": 0,
  //       "tenderGuaranteeEfficiency": 0,
  //       "tenderEfficiency": 0,
  //       "progressStartDate": 0,
  //       "progressComletionDate": 0,
  //       "taxTypes": [
  //         {
  //           "key": "string",
  //           "value": "string",
  //           "displayText": "string"
  //         }
  //       ],
  //       "currency": {
  //         "key": "string",
  //         "value": "string",
  //         "displayText": "string"
  //       }
  //     },
  //     "otherSpecialRequirement": {
  //       "requirements": [
  //         {
  //           "name": "string",
  //           "desc": "string",
  //           "link": "string"
  //         }
  //       ]
  //     }









  //   };
  //   return this.apiService.post(url, infoReport).map(res => res);
  // }


  // Xóa ảnh
  deleteImage(guid): Observable<any> {
    const url = `tenderconditionalsummary/deleteimage`;
    return null; // tạm thời disable
    // return this.apiService.post(url, guid);
  }

  // Upload ảnh
  uploadImage(
    listImage: any,
    bidOpportunityId: number
  ) {
    const url = `tenderconditionalsummary/uploadimage`;
    const imageUploadForm = new FormData();
    for (const image of listImage) {
      imageUploadForm.append('Images', image);
    }
    imageUploadForm.append('BidOpportunityId', `${bidOpportunityId}`);
    return this.apiService
      .postFile(url, imageUploadForm)
      .map(res => res.result)
      .share();
  }

  deleleLiveFormTTDKDuThau(bidOpportunityId: number) {
    const url = `bidopportunity/${bidOpportunityId}/tenderconditionalsummary/delete`;
    return this.apiService.post(url).map(response => response);
  }

  getStackHolders(bidOpportunityId: number): Observable<StakeHolder[]> {
    const url = `bidopportunity/${bidOpportunityId}/bidusergroupmembersofstakeholders`;
    return this.apiService.get(url).map(response => response.result);
  }
}
