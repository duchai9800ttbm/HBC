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
import { StateLiveFormSummaryCondition } from '../models/ho-so-du-thau/stateLiveFormSummaryCondition';
import { HistoryLiveForm } from '../models/ho-so-du-thau/history-liveform.model';

@Injectable()
export class HoSoDuThauService {

  static tempDataLiveFormDKDT = new BehaviorSubject<DuLieuLiveFormDKDT>(new DuLieuLiveFormDKDT());
  static detectChangeRouter = new BehaviorSubject<boolean>(false);
  static uploadDocReload = new BehaviorSubject<boolean>(false);
  static stateLiveFormSummaryCondition = new BehaviorSubject<StateLiveFormSummaryCondition>(new StateLiveFormSummaryCondition());
  static idTenderDocumentTypesData;

  private static toHistoryLiveForm(result: any): HistoryLiveForm {
    return {
      employee: {
        employeeId: result.employee.employeeId,
        employeeNo: result.employee.employeeNo,
        employeeName: result.employee.employeeName,
        employeeAvatar: result.employee.employeeAvatar,
        employeeEmail: result.employee.employeeEmail,
      },
      changedTime: result.changedTime,
      changedTimes: result.changedTimes,
      updateDesc: result.updateDesc,
      liveFormChangeds: result.liveFormChangeds ? result.liveFormChangeds.map(item =>
        ({
          liveFormStep: item.liveFormStep,
          liveFormSubject: item.liveFormSubject,
          liveFormTitle: item.liveFormTitle,
          oldValue: item.oldValue,
          newValue: item.newValue,
        })
      ) : []
    };
  }

  private static createFilterParams(filter: HsdtFilterModel): URLSearchParams {
    const numCreatedDate = DateTimeConvertHelper.fromDtObjectToSecon(filter.createdDate);
    const urlFilterParams = new URLSearchParams();
    urlFilterParams.append('status', filter.status);
    urlFilterParams.append('uploadedEmployeeId', `${filter.uploadedEmployeeId ? filter.uploadedEmployeeId : ''}`);
    urlFilterParams.append('interViewTimes', `${filter.interViewTimes ? filter.interViewTimes : ''}`);
    urlFilterParams.append('createdDate', `${numCreatedDate ? numCreatedDate : ''}`);
    return urlFilterParams;
  }
  private static toDocumentTypeItem(result: any): DanhSachBoHsdtItem {
    return {
      id: result.id,
      tenderDocumentTypeId: result.tenderDocumentType.id,
      tenderDocumentType: result.tenderDocumentType && {
        id: result.tenderDocumentType.id,
        parentId: result.tenderDocumentType.parentId,
        name: result.tenderDocumentType.name,
        count: result.tenderDocumentType.count
      },
      documentName: result.documentName,
      version: result.version,
      status: result.status,
      uploadedBy: result.uploadedBy && {
        employeeId: result.uploadedBy.employeeId,
        employeeNo: result.uploadedBy.employeeNo,
        employeeName: result.uploadedBy.employeeName,
        employeeAvatar: result.uploadedBy.employeeAvatar,
        employeeEmail: result.uploadedBy.employeeEmail
      },
      uploadedDate: result.uploadedDate,
      fileGuid: result.fileGuid,
      fileUrl: result.fileUrl,
      interViewTimes: result.interViewTimes,
      desc: result.desc
    };
  }

  constructor(
    private apiService: ApiService,
    private instantSearchService: InstantSearchService,
    private sessionService: SessionService
  ) { }

  emitIsModeView(value: boolean) {
    const obj = new StateLiveFormSummaryCondition();
    obj.isModeView = value;
    HoSoDuThauService.stateLiveFormSummaryCondition.next(obj);
  }

  watchLiveformState() {
    return HoSoDuThauService.stateLiveFormSummaryCondition;
  }

  // get Employee ID
  get employeeId() {
    return this.sessionService.currentUser.employeeId;
  }
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
  watchChangingUpload() {
    return HoSoDuThauService.uploadDocReload;
  }
  detectUploadFile(event) {
    HoSoDuThauService.uploadDocReload.next(event);
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

  // Upload ảnh - chung cho các form upload
  uploadImageService(imageFile: File) {
    const url = `image/upload`;
    const formData = new FormData();
    formData.append('imageFile', imageFile);
    return this.apiService.postFile(url, formData).map(res => res.result);
  }
  // Xóa ảnh trên server - chung cho các form upload
  deleteImageService(guid) {
    const url = `image/delete`;
    return this.apiService.post(url, guid);
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
    interviewTimes: number,
    imageIds: any
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
    for (let image of imageIds) {
      formData.append('Images', image);
    }
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
  // Group Document theo Loại
  groupDocumentTypeId(source: DanhSachBoHsdtItem[]) {
    const groupedObj = source.reduce((prev, cur) => {
      if (!prev[cur['documentType']]) {
        prev[cur['documentType']] = [cur];
      } else {
        prev[cur['documentType']].push(cur);
      }
      return prev;
    }, {});
    const groupBeforeSort = Object.keys(groupedObj).map(documentType => (
      {
        documentType,
        items: groupedObj[documentType],
        id: 0
      }
    ));
    // Sorted by design
    groupBeforeSort.forEach(item => {
      switch (item.documentType) {
        case 'Quyển HSMT':
          item['id'] = 0;
          break;
        case 'Bản vẽ thuyết minh':
          item['id'] = 1;
          break;
        case 'BOQ':
          item['id'] = 2;
          break;
        case 'Tiêu chí kĩ thuật (Specs)':
          item['id'] = 3;
          break;
        case 'Các báo cáo và các tài liệu khác (KSDQ)':
          item['id'] = 4;
          break;
      }
    });
    groupBeforeSort.sort(function (a, b) {
      return a.id - b.id;
    });
    return groupBeforeSort;
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
          items: (res.items || []).map(HoSoDuThauService.toDocumentTypeItem)
        };
      });
  }
  // Get All File Without Search Param
  getFileNoSearch(bidOpportunityId: number): Observable<PagedResult<DanhSachBoHsdtItem>> {
    const url = `bidopportunity/${bidOpportunityId}/tenderdocuments/0/1000`;
    return this.apiService.get(url).map(res => {
      const response = res.result;
      return {
        currentPage: response.pageIndex,
        pageSize: response.pageSize,
        pageCount: response.totalPages,
        total: response.totalCount,
        items: (response.items || []).map(HoSoDuThauService.toDocumentTypeItem)
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
  emitDataStepRelate(obj: StakeHolder[]) {
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
  emitDataStepSpecial(obj: TableYeuCauDacBiet) {
    HoSoDuThauService.tempDataLiveFormDKDT.value.yeuCauDacBietKhac = obj;
  }
  emitDataUpdateDescription(text: string) {
    HoSoDuThauService.tempDataLiveFormDKDT.value.noiDungCapNhat = text;
  }
  emitFormCacBenLienQuan(isChangeForm: boolean) {
    HoSoDuThauService.tempDataLiveFormDKDT.value.isChangeFormCacBenLienQuan = isChangeForm;
  }
  // gọi API create or update liveform tóm tắt đkdt
  createOrUpdateLiveFormTomTat(): Observable<any> {
    const url = `tenderconditionalsummary/createorupdate`;
    const obj = HoSoDuThauService.tempDataLiveFormDKDT.value;
    const infoReport = {
      bidOpportunityId: obj.bidOpportunityId,
      createdEmployeeId: obj.createdEmployeeId ? obj.createdEmployeeId : this.employeeId,
      updatedEmployeeId: this.employeeId,
      isDraftVersion: obj.isDraftVersion,
      documentName: obj.thongTinDuAn && obj.thongTinDuAn.tenTaiLieu ? obj.thongTinDuAn.tenTaiLieu : '',
      updatedDesc: obj.noiDungCapNhat,
      projectInformation: obj.thongTinDuAn && {
        projectInformation: obj.thongTinDuAn.dienGiaiThongTinDuAn,
        interviewTimes: obj.thongTinDuAn.lanPhongVan,
        perspectiveImageUrls: obj.thongTinDuAn.hinhAnhPhoiCanh,
        masterPlanImageUrls: obj.thongTinDuAn.banVeMasterPlan
      },
      stakeholder: {
        stakeholderGroups: (obj.cacBenLienQuan || []).map(x => ({
          groupId: x.id,
          customers: (x.customers || []).map(customer => ({
            id: customer.customerId,
            note: customer.note,
            customerContacts: (customer.contacts || []).map(contact => ({
              id: contact.id,
              name: contact.name
            }))
          }))
        }))
      }, // TODO: Map lại chỗ này, tạm thời bỏ qua
      scopeOfWork: obj.phamViCongViec && {
        includedWorks: (obj.phamViCongViec.phamViBaoGom || []).map(x => ({
          name: x.congTac,
          desc: x.dienGiaiCongTac
        })),
        nonIncludedWorks: (obj.phamViCongViec.phamViKhongBaoGom || []).map(x => ({
          name: x.congTac,
          desc: x.dienGiaiCongTac
        }))
      },
      nonminatedSubContractor: obj.danhSachNhaThau && {
        workPackages: (obj.danhSachNhaThau || []).map(x => ({
          name: x.tenGoiCongViec,
          desc: x.ghiChuThem,
          totalCost: x.thanhTien
        }))
      },
      materialsTobeSuppliedOrAppointedByOwner: obj.danhSachVatTu && {
        materials: (obj.danhSachVatTu || []).map(x => ({
          name: x.tenVatTu,
          desc: x.ghiChuThem
        }))
      },
      mainItemOfTenderSubmission: obj.hoSoDangLuuY && {
        attentiveDocuments: obj.hoSoDangLuuY.taiLieuLuuY,
        quantity: obj.hoSoDangLuuY.soLuong,
        languages: obj.hoSoDangLuuY.ngonNgu
      },
      requestDocument: obj.dienGiaiYeuCauHoSo && {
        destination: obj.dienGiaiYeuCauHoSo.noiNop,
        receivedPerson: obj.dienGiaiYeuCauHoSo.nguoiNhan,
        closingTime: obj.dienGiaiYeuCauHoSo.hanNop ? obj.dienGiaiYeuCauHoSo.hanNop : 0
      },
      requestTenderClarification: obj.dienGiaiYeuCauLamRo && {
        consultant: obj.dienGiaiYeuCauLamRo.nhaTuVan && {
          companyName: obj.dienGiaiYeuCauLamRo.nhaTuVan.tenCongTy,
          companyAddress: obj.dienGiaiYeuCauLamRo.nhaTuVan.diaChiCongTy,
          contactPerson: obj.dienGiaiYeuCauLamRo.nhaTuVan.nguoiLienHe && {
            name: obj.dienGiaiYeuCauLamRo.nhaTuVan.nguoiLienHe.hoVaTen,
            address: obj.dienGiaiYeuCauLamRo.nhaTuVan.nguoiLienHe.diaChi,
            email: obj.dienGiaiYeuCauLamRo.nhaTuVan.nguoiLienHe.email,
            level: obj.dienGiaiYeuCauLamRo.nhaTuVan.nguoiLienHe.viTri
          }
        },
        employer: obj.dienGiaiYeuCauLamRo.nhaSuDung && {
          companyName: obj.dienGiaiYeuCauLamRo.nhaSuDung.tenCongTy,
          companyAddress: obj.dienGiaiYeuCauLamRo.nhaSuDung.diaChiCongTy,
          contactPerson: obj.dienGiaiYeuCauLamRo.nhaSuDung.nguoiLienHe && {
            name: obj.dienGiaiYeuCauLamRo.nhaSuDung.nguoiLienHe.hoVaTen,
            address: obj.dienGiaiYeuCauLamRo.nhaSuDung.nguoiLienHe.diaChi,
            email: obj.dienGiaiYeuCauLamRo.nhaSuDung.nguoiLienHe.email,
            level: obj.dienGiaiYeuCauLamRo.nhaSuDung.nguoiLienHe.viTri
          }
        },
        closingTime: obj.dienGiaiYeuCauLamRo && {
          closingTime: obj.dienGiaiYeuCauLamRo.ngayHetHan,
          desc: obj.dienGiaiYeuCauLamRo.ghiChuThem
        }
      },
      contractCondition: obj.dienGiaiDieuKienHopDong && {
        contractType: obj.dienGiaiDieuKienHopDong.loaiHopDong && {
          contractType: obj.dienGiaiDieuKienHopDong.loaiHopDong.name,
          desc: obj.dienGiaiDieuKienHopDong.loaiHopDong.desc
        },
        hsmtContractCondition: obj.dienGiaiDieuKienHopDong.dieuKienTheoHSMT && {
          executiveGuaranteePercent:
            (obj.dienGiaiDieuKienHopDong.dieuKienTheoHSMT.baoLanhThucHien) ?
              obj.dienGiaiDieuKienHopDong.dieuKienTheoHSMT.baoLanhThucHien.phanTram : 0,

          executiveGuaranteeEfficiency:
            (obj.dienGiaiDieuKienHopDong.dieuKienTheoHSMT.baoLanhThucHien) ?
              obj.dienGiaiDieuKienHopDong.dieuKienTheoHSMT.baoLanhThucHien.hieuLuc : '',

          advanceGuaranteePercent:
            (obj.dienGiaiDieuKienHopDong.dieuKienTheoHSMT.baoLanhTamUng) ?
              obj.dienGiaiDieuKienHopDong.dieuKienTheoHSMT.baoLanhTamUng.phanTram : 0,

          advanceGuaranteeEfficiency:
            (obj.dienGiaiDieuKienHopDong.dieuKienTheoHSMT.baoLanhTamUng) ?
              obj.dienGiaiDieuKienHopDong.dieuKienTheoHSMT.baoLanhTamUng.hieuLuc : '',

          paymentType:
            (obj.dienGiaiDieuKienHopDong.dieuKienTheoHSMT.thanhToan) ?
              obj.dienGiaiDieuKienHopDong.dieuKienTheoHSMT.thanhToan.loaiThanhToan : '',

          paymentTime:
            (obj.dienGiaiDieuKienHopDong.dieuKienTheoHSMT.thanhToan) ?
              obj.dienGiaiDieuKienHopDong.dieuKienTheoHSMT.thanhToan.thoiGianThanhToan : '',

          paymentMaterialOnSite:
            (obj.dienGiaiDieuKienHopDong.dieuKienTheoHSMT.thanhToan) ?
              obj.dienGiaiDieuKienHopDong.dieuKienTheoHSMT.thanhToan.thanhToanKhiTapKet : '',

          retainedPercent:
            (obj.dienGiaiDieuKienHopDong.dieuKienTheoHSMT.tienGiuLai) ?
              obj.dienGiaiDieuKienHopDong.dieuKienTheoHSMT.tienGiuLai.phanTram : 0,

          retainedLimit:
            obj.dienGiaiDieuKienHopDong.dieuKienTheoHSMT.tienGiuLai ?
              obj.dienGiaiDieuKienHopDong.dieuKienTheoHSMT.tienGiuLai.gioiHanTienGiuLai : 0,

          retainedPayment:
            (obj.dienGiaiDieuKienHopDong.dieuKienTheoHSMT.tienGiuLai) ?
              obj.dienGiaiDieuKienHopDong.dieuKienTheoHSMT.tienGiuLai.thanhToanTienGui : '',
          punishhOverduePercent:
            (obj.dienGiaiDieuKienHopDong.dieuKienTheoHSMT.phatTreTienDo) ?
              obj.dienGiaiDieuKienHopDong.dieuKienTheoHSMT.phatTreTienDo.phanTram : 0,
          punishhOverdueLimit:
            (obj.dienGiaiDieuKienHopDong.dieuKienTheoHSMT.phatTreTienDo) ?
              obj.dienGiaiDieuKienHopDong.dieuKienTheoHSMT.phatTreTienDo.gioiHanPhatTienDo : '',
          guaranteeDuration: obj.dienGiaiDieuKienHopDong.dieuKienTheoHSMT.thoiGianBaoHanh,
          insurranceMachineOfContractor: (obj.dienGiaiDieuKienHopDong.dieuKienTheoHSMT.baoHiem.baoHiemMayMoc || []).map(x => x),
          insurancePersonOfContractor:
            (obj.dienGiaiDieuKienHopDong.dieuKienTheoHSMT.baoHiem) ?
              obj.dienGiaiDieuKienHopDong.dieuKienTheoHSMT.baoHiem.baoHiemConNguoi : '',
          insurranceConstructionAnd3rdPart:
            (obj.dienGiaiDieuKienHopDong.dieuKienTheoHSMT.baoHiem) ?
              obj.dienGiaiDieuKienHopDong.dieuKienTheoHSMT.baoHiem.baoHiemCongTrinh : ''
        },
        hbcContractCondition: obj.dienGiaiDieuKienHopDong.dieuKienTheoHBC && {
          executiveGuaranteePercent:
            (obj.dienGiaiDieuKienHopDong.dieuKienTheoHBC.baoLanhThucHien) ?
              +obj.dienGiaiDieuKienHopDong.dieuKienTheoHBC.baoLanhThucHien.phanTram : 0,
          executiveGuaranteeEfficiency:
            (obj.dienGiaiDieuKienHopDong.dieuKienTheoHBC.baoLanhThucHien) ?
              obj.dienGiaiDieuKienHopDong.dieuKienTheoHBC.baoLanhThucHien.hieuLuc : '',
          advanceGuaranteePercent:
            (obj.dienGiaiDieuKienHopDong.dieuKienTheoHBC.baoLanhTamUng) ?
              +obj.dienGiaiDieuKienHopDong.dieuKienTheoHBC.baoLanhTamUng.phanTram : 0,
          advanceGuaranteeEfficiency:
            (obj.dienGiaiDieuKienHopDong.dieuKienTheoHBC.baoLanhTamUng) ?
              obj.dienGiaiDieuKienHopDong.dieuKienTheoHBC.baoLanhTamUng.hieuLuc : '',
          paymentType:
            (obj.dienGiaiDieuKienHopDong.dieuKienTheoHBC.thanhToan) ?
              obj.dienGiaiDieuKienHopDong.dieuKienTheoHBC.thanhToan.loaiThanhToan : '',
          paymentTime:
            (obj.dienGiaiDieuKienHopDong.dieuKienTheoHBC.thanhToan) ?
              obj.dienGiaiDieuKienHopDong.dieuKienTheoHBC.thanhToan.thoiGianThanhToan : '',
          paymentMaterialOnSite:
            (obj.dienGiaiDieuKienHopDong.dieuKienTheoHBC.thanhToan) ?
              obj.dienGiaiDieuKienHopDong.dieuKienTheoHBC.thanhToan.thanhToanKhiTapKet : '',
          retainedPercent:
            (obj.dienGiaiDieuKienHopDong.dieuKienTheoHBC.tienGiuLai) ?
              obj.dienGiaiDieuKienHopDong.dieuKienTheoHBC.tienGiuLai.phanTram : 0,
          retainedLimit:
            obj.dienGiaiDieuKienHopDong.dieuKienTheoHBC.tienGiuLai ?
              (obj.dienGiaiDieuKienHopDong.dieuKienTheoHBC.tienGiuLai.gioiHanTienGiuLai ?
                obj.dienGiaiDieuKienHopDong.dieuKienTheoHBC.tienGiuLai.gioiHanTienGiuLai : 0) : 0,
          retainedPayment:
            (obj.dienGiaiDieuKienHopDong.dieuKienTheoHBC.tienGiuLai) ?
              obj.dienGiaiDieuKienHopDong.dieuKienTheoHBC.tienGiuLai.thanhToanTienGui : '',
          punishhOverduePercent:
            (obj.dienGiaiDieuKienHopDong.dieuKienTheoHBC.phatTreTienDo) ?
              obj.dienGiaiDieuKienHopDong.dieuKienTheoHBC.phatTreTienDo.phanTram : 0,
          punishhOverdueLimit:
            (obj.dienGiaiDieuKienHopDong.dieuKienTheoHBC.phatTreTienDo) ?
              obj.dienGiaiDieuKienHopDong.dieuKienTheoHBC.phatTreTienDo.gioiHanPhatTienDo : '',
          guaranteeDuration: obj.dienGiaiDieuKienHopDong.dieuKienTheoHBC.thoiGianBaoHanh,
          insurranceMachineOfContractor: (obj.dienGiaiDieuKienHopDong.dieuKienTheoHBC.baoHiem.baoHiemMayMoc || []).map(x => x),
          insurancePersonOfContractor:
            (obj.dienGiaiDieuKienHopDong.dieuKienTheoHBC.baoHiem) ?
              obj.dienGiaiDieuKienHopDong.dieuKienTheoHBC.baoHiem.baoHiemConNguoi : '',
          insurranceConstructionAnd3rdPart:
            (obj.dienGiaiDieuKienHopDong.dieuKienTheoHBC.baoHiem) ?
              obj.dienGiaiDieuKienHopDong.dieuKienTheoHBC.baoHiem.baoHiemCongTrinh : ''
        }

      },
      tenderCondition: obj.dienGiaiDieuKienHSMT && {
        hbcTenderCondition: obj.dienGiaiDieuKienHSMT.theoHBC && {
          tenderGuaranteeValue: (obj.dienGiaiDieuKienHSMT.theoHBC.baoLanhDuThau) ?
            obj.dienGiaiDieuKienHSMT.theoHBC.baoLanhDuThau.giaTri : '',
          tenderGuaranteeEfficiency:
            (obj.dienGiaiDieuKienHSMT.theoHBC.baoLanhDuThau) ?
              obj.dienGiaiDieuKienHSMT.theoHBC.baoLanhDuThau.hieuLuc : '',
          tenderEfficiency: obj.dienGiaiDieuKienHSMT.theoHBC.hieuLucHoSo,
          progressStartDate: (obj.dienGiaiDieuKienHSMT.theoHBC.tienDo) ?
            obj.dienGiaiDieuKienHSMT.theoHBC.tienDo.ngayKhoiCong : '',
          progressComletionDate: (obj.dienGiaiDieuKienHSMT.theoHBC.tienDo) ?
            obj.dienGiaiDieuKienHSMT.theoHBC.tienDo.thoiGianHoanThanh : '',

          taxTypes: (obj.dienGiaiDieuKienHSMT.theoHBC.cacLoaiThue) ?
            (obj.dienGiaiDieuKienHSMT.theoHBC.cacLoaiThue || []).map(x => ({
              key: '',
              value: '',
              displayText: x
            })) : [],
          currency: obj.dienGiaiDieuKienHSMT.theoHBC && {
            key: '',
            value: '',
            displayText: obj.dienGiaiDieuKienHSMT.theoHBC.donViTienTe
          }
        },
        hsmtTenderCondition: obj.dienGiaiDieuKienHSMT.theoHSMT && {
          tenderGuaranteeValue: (obj.dienGiaiDieuKienHSMT.theoHSMT.baoLanhDuThau) ?
            obj.dienGiaiDieuKienHSMT.theoHSMT.baoLanhDuThau.giaTri : '',
          tenderGuaranteeEfficiency:
            (obj.dienGiaiDieuKienHSMT.theoHSMT.baoLanhDuThau) ?
              obj.dienGiaiDieuKienHSMT.theoHSMT.baoLanhDuThau.hieuLuc : '',
          tenderEfficiency: obj.dienGiaiDieuKienHSMT.theoHSMT.hieuLucHoSo,
          progressStartDate: (obj.dienGiaiDieuKienHSMT.theoHSMT.tienDo) ?
            obj.dienGiaiDieuKienHSMT.theoHSMT.tienDo.ngayKhoiCong : '',
          progressComletionDate: (obj.dienGiaiDieuKienHSMT.theoHSMT.tienDo) ?
            obj.dienGiaiDieuKienHSMT.theoHSMT.tienDo.thoiGianHoanThanh : '',
          taxTypes: (obj.dienGiaiDieuKienHSMT.theoHSMT.cacLoaiThue) ?
            (obj.dienGiaiDieuKienHSMT.theoHSMT.cacLoaiThue || []).map(x => ({
              key: '',
              value: '',
              displayText: x
            })) : [],
          currency: obj.dienGiaiDieuKienHSMT.theoHSMT && {
            key: '',
            value: '',
            displayText: obj.dienGiaiDieuKienHSMT.theoHSMT.donViTienTe
          }
        }
      },
      otherSpecialRequirement: obj.yeuCauDacBietKhac && {
        // TODO: Map lại chỗ này
        greenBuildingStandardName: obj.yeuCauDacBietKhac.greenBuildingStandardName,
        greenBuildingStandardLink: obj.yeuCauDacBietKhac.greenBuildingStandardLink,
        tenderEvaluationStep1: obj.yeuCauDacBietKhac.tenderEvaluationStep1,
        tenderEvaluationStep2: obj.yeuCauDacBietKhac.tenderEvaluationStep2,
        profitValue: obj.yeuCauDacBietKhac.profitValue,
        profitDesc: obj.yeuCauDacBietKhac.profitDesc
      }
    };
    return this.apiService.post(url, infoReport).map(res => res);
  }

  // Thông tin bảng tóm tắt ĐKDT
  getInfoTenderConditionalSummary(bidOpportunityId: number): Observable<any> {
    const url = `bidopportunity/${bidOpportunityId}/tenderconditionalsummary`;
    return this.apiService.get(url).map(res => {
      if (!res.result) {
        return null;
      }
      return this.toTenderConditionalSummary(res.result, bidOpportunityId);
    });
  }

  toTenderConditionalSummary(model: any, bidOpportunityId: number) {
    const dataOut = new DuLieuLiveFormDKDT();
    if (model) {
      dataOut.ngayTao = model.createdDate;
      dataOut.id = model.id;
      dataOut.bidOpportunityId = model.bidOpportunityId;
      dataOut.documentName = model.documentName;
      dataOut.createdEmployeeId = model.createdEmployee && model.createdEmployee.employeeId;
      dataOut.createdEmployee = model.createdEmployee && {
        employeeAvatar: model.createdEmployee.employeeAvatar && {
          guid: model.createdEmployee.employeeAvatar.guid,
          largeSizeUrl: model.createdEmployee.employeeAvatar.largeSizeUrl,
          thumbSizeUrl: model.createdEmployee.employeeAvatar.thumbSizeUrl
        },
        employeeEmail: model.createdEmployee.employeeEmail,
        employeeId: model.createdEmployee.employeeId,
        employeeName: model.createdEmployee.employeeName,
        employeeNo: model.createdEmployee.employeeNo
      };
      dataOut.updatedEmployee = model.updatedEmployee && {
        employeeAvatar: model.updatedEmployee.employeeAvatar && {
          guid: model.updatedEmployee.employeeAvatar.guid,
          largeSizeUrl: model.updatedEmployee.employeeAvatar.largeSizeUrl,
          thumbSizeUrl: model.updatedEmployee.employeeAvatar.thumbSizeUrl
        },
        employeeEmail: model.updatedEmployee.employeeEmail,
        employeeId: model.updatedEmployee.employeeId,
        employeeName: model.updatedEmployee.employeeName,
        employeeNo: model.updatedEmployee.employeeNo
      };
      dataOut.updatedEmployeeId = model.updatedEmployee && model.updatedEmployee.employeeId;
      dataOut.isDraftVersion = model.isDraftVersion;
      dataOut.thongTinDuAn = model.projectInformation && {
        tenTaiLieu: model.documentName,
        lanPhongVan: (model.projectInformation.interviewTimes) ? model.projectInformation.interviewTimes : 0,
        hinhAnhPhoiCanh: model.projectInformation.perspectiveImageUrls,
        banVeMasterPlan: model.projectInformation.masterPlanImageUrls,
        dienGiaiThongTinDuAn: model.projectInformation.projectInformation
      };
      // TODO: Map lại chỗ StackHolder
      dataOut.cacBenLienQuan = model.stakeholder && (model.stakeholder.stakeholderGroups || []).map(x => ({
        id: x.groupId,
        customers: (x.customers || []).map(customer => ({
          customerId: customer.id,
          note: customer.note,
          contacts: (customer.customerContacts || []).map(contact => ({
            id: contact.id,
            name: contact.name
          }))
        }))
      }));
      dataOut.phamViCongViec = model.scopeOfWork && {
        phamViBaoGom: (model.scopeOfWork.includedWorks || []).map(x => ({
          congTac: x.name,
          dienGiaiCongTac: x.desc
        })),
        phamViKhongBaoGom: (model.scopeOfWork.nonIncludedWorks || []).map(x => ({
          congTac: x.name,
          dienGiaiCongTac: x.desc
        }))
      };
      dataOut.danhSachNhaThau = model.nonminatedSubContractor && (model.nonminatedSubContractor.workPackages || []).map(x => ({
        tenGoiCongViec: x.name,
        ghiChuThem: x.desc,
        thanhTien: x.totalCost
      }));
      dataOut.danhSachVatTu = (model.materialsTobeSuppliedOrAppointedByOwner.materials || []).map(x => ({
        tenVatTu: x.name,
        ghiChuThem: x.desc
      }));
      dataOut.hoSoDangLuuY = model.mainItemOfTenderSubmission && {
        taiLieuLuuY: model.mainItemOfTenderSubmission.attentiveDocuments,
        soLuong: model.mainItemOfTenderSubmission.quantity,
        ngonNgu: model.mainItemOfTenderSubmission.languages
      };
      dataOut.dienGiaiYeuCauHoSo = model.requestDocument && {
        noiNop: model.requestDocument.destination,
        nguoiNhan: model.requestDocument.receivedPerson,
        hanNop: model.requestDocument.closingTime
      };
      dataOut.dienGiaiYeuCauLamRo = model.requestTenderClarification && {
        nhaTuVan: model.requestTenderClarification.consultant && {
          tenCongTy: model.requestTenderClarification.consultant.companyName,
          diaChiCongTy: model.requestTenderClarification.consultant.companyAddress,
          nguoiLienHe: model.requestTenderClarification.consultant.contactPerson && {
            hoVaTen: model.requestTenderClarification.consultant.contactPerson.name,
            diaChi: model.requestTenderClarification.consultant.contactPerson.address,
            email: model.requestTenderClarification.consultant.contactPerson.email,
            viTri: model.requestTenderClarification.consultant.contactPerson.level
          }
        },
        nhaSuDung: model.requestTenderClarification.employer && {
          tenCongTy: model.requestTenderClarification.employer.companyName,
          diaChiCongTy: model.requestTenderClarification.employer.companyAddress,
          nguoiLienHe: model.requestTenderClarification.employer.contactPerson && {
            hoVaTen: model.requestTenderClarification.employer.contactPerson.name,
            diaChi: model.requestTenderClarification.employer.contactPerson.address,
            email: model.requestTenderClarification.employer.contactPerson.email,
            viTri: model.requestTenderClarification.employer.contactPerson.level
          }
        },
        ngayHetHan: model.requestTenderClarification.closingTime.closingTime,
        ghiChuThem: model.requestTenderClarification.closingTime.desc
      };
      dataOut.dienGiaiDieuKienHopDong = model.contractCondition && {
        loaiHopDong: model.contractCondition.contractType && {
          name: model.contractCondition.contractType.contractType,
          desc: model.contractCondition.contractType.desc
        },
        dieuKienTheoHSMT: model.contractCondition.hsmtContractCondition && {
          baoLanhThucHien: model.contractCondition.hsmtContractCondition && {
            phanTram: (model.contractCondition.hsmtContractCondition.executiveGuaranteePercent) ?
              model.contractCondition.hsmtContractCondition.executiveGuaranteePercent : 0,
            hieuLuc: (model.contractCondition.hsmtContractCondition.executiveGuaranteeEfficiency) ?
              model.contractCondition.hsmtContractCondition.executiveGuaranteeEfficiency : 0
          },
          baoLanhTamUng: model.contractCondition.hsmtContractCondition && {
            phanTram: (model.contractCondition.hsmtContractCondition.advanceGuaranteePercent) ?
              model.contractCondition.hsmtContractCondition.advanceGuaranteePercent : 0,
            hieuLuc: (model.contractCondition.hsmtContractCondition.advanceGuaranteeEfficiency) ?
              model.contractCondition.hsmtContractCondition.advanceGuaranteeEfficiency : 0
          },
          thanhToan: model.contractCondition.hsmtContractCondition && {
            loaiThanhToan: model.contractCondition.hsmtContractCondition.paymentType,
            thoiGianThanhToan: (model.contractCondition.hsmtContractCondition.paymentTime) ?
              model.contractCondition.hsmtContractCondition.paymentTime : 0,
            thanhToanKhiTapKet: model.contractCondition.hsmtContractCondition.paymentMaterialOnSite
          },
          tienGiuLai: model.contractCondition.hsmtContractCondition && {
            phanTram: (model.contractCondition.hsmtContractCondition.retainedPercent) ?
              model.contractCondition.hsmtContractCondition.retainedPercent : 0,
            gioiHanTienGiuLai: (model.contractCondition.hsmtContractCondition.retainedLimit) ?
              (model.contractCondition.hsmtContractCondition.retainedLimit ?
                model.contractCondition.hsmtContractCondition.retainedLimit : 0) : 0,
            thanhToanTienGui: (model.contractCondition.hsmtContractCondition.retainedPayment) ?
              model.contractCondition.hsmtContractCondition.retainedPayment : 0
          },
          phatTreTienDo: model.contractCondition.hsmtContractCondition && {
            phanTram: (model.contractCondition.hsmtContractCondition.punishhOverduePercent) ?
              model.contractCondition.hsmtContractCondition.punishhOverduePercent : 0,
            gioiHanPhatTienDo: (model.contractCondition.hsmtContractCondition.punishhOverdueLimit) ?
              model.contractCondition.hsmtContractCondition.punishhOverdueLimit : 0
          },
          thoiGianBaoHanh: (model.contractCondition.hsmtContractCondition.guaranteeDuration) ?
            model.contractCondition.hsmtContractCondition.guaranteeDuration : 0,
          baoHiem: model.contractCondition.hsmtContractCondition && {
            baoHiemMayMoc: model.contractCondition.hsmtContractCondition.insurranceMachineOfContractor,
            baoHiemConNguoi: model.contractCondition.hsmtContractCondition.insurancePersonOfContractor,
            baoHiemCongTrinh: model.contractCondition.hsmtContractCondition.insurranceConstructionAnd3rdPart
          }
        },
        dieuKienTheoHBC: model.contractCondition.hbcContractCondition && {
          baoLanhThucHien: model.contractCondition.hbcContractCondition && {
            phanTram: (model.contractCondition.hbcContractCondition.executiveGuaranteePercent) ?
              model.contractCondition.hbcContractCondition.executiveGuaranteePercent : 0,
            hieuLuc: (model.contractCondition.hbcContractCondition.executiveGuaranteeEfficiency) ?
              model.contractCondition.hbcContractCondition.executiveGuaranteeEfficiency : 0
          },
          baoLanhTamUng: model.contractCondition.hbcContractCondition && {
            phanTram: model.contractCondition.hbcContractCondition.advanceGuaranteePercent,
            hieuLuc: model.contractCondition.hbcContractCondition.advanceGuaranteeEfficiency
          },
          thanhToan: model.contractCondition.hbcContractCondition && {
            loaiThanhToan: model.contractCondition.hbcContractCondition.paymentType,
            thoiGianThanhToan: model.contractCondition.hbcContractCondition.paymentTime,
            thanhToanKhiTapKet: model.contractCondition.hbcContractCondition.paymentMaterialOnSite
          },
          tienGiuLai: model.contractCondition.hbcContractCondition && {
            phanTram: model.contractCondition.hbcContractCondition.retainedPercent,
            gioiHanTienGiuLai: model.contractCondition.hbcContractCondition.retainedLimit ?
              model.contractCondition.hbcContractCondition.retainedLimit : 0,
            thanhToanTienGui: model.contractCondition.hbcContractCondition.retainedPayment
          },
          phatTreTienDo: model.contractCondition.hbcContractCondition && {
            phanTram: model.contractCondition.hbcContractCondition.punishhOverduePercent,
            gioiHanPhatTienDo: model.contractCondition.hbcContractCondition.punishhOverdueLimit
          },
          thoiGianBaoHanh: model.contractCondition.hbcContractCondition.guaranteeDuration,
          baoHiem: model.contractCondition.hbcContractCondition && {
            baoHiemMayMoc: model.contractCondition.hbcContractCondition.insurranceMachineOfContractor,
            baoHiemConNguoi: model.contractCondition.hbcContractCondition.insurancePersonOfContractor,
            baoHiemCongTrinh: model.contractCondition.hbcContractCondition.insurranceConstructionAnd3rdPart
          }
        }
      };
      dataOut.dienGiaiDieuKienHSMT = model.tenderCondition && {
        theoHBC: model.tenderCondition.hbcTenderCondition && {
          baoLanhDuThau: model.tenderCondition.hbcTenderCondition && {
            giaTri: (model.tenderCondition.hbcTenderCondition.tenderGuaranteeValue) ?
              model.tenderCondition.hbcTenderCondition.tenderGuaranteeValue : 0,
            hieuLuc: (model.tenderCondition.hbcTenderCondition.tenderGuaranteeEfficiency) ?
              model.tenderCondition.hbcTenderCondition.tenderGuaranteeEfficiency : 0
          },
          hieuLucHoSo: model.tenderCondition.hbcTenderCondition.tenderEfficiency,
          tienDo: model.tenderCondition.hbcTenderCondition && {
            ngayKhoiCong: model.tenderCondition.hbcTenderCondition.progressStartDate,
            thoiGianHoanThanh: model.tenderCondition.hbcTenderCondition.progressComletionDate
          },

          // TODO: Chú ý map lại ID, KEY, DISPLAYTEXT
          cacLoaiThue: (model.tenderCondition.hbcTenderCondition.taxTypes || []).map(x => x.displayText),
          donViTienTe: model.tenderCondition.hbcTenderCondition.currency && model.tenderCondition.hbcTenderCondition.currency.displayText
        },
        theoHSMT: model.tenderCondition.hsmtTenderCondition && {
          baoLanhDuThau: model.tenderCondition.hsmtTenderCondition && {
            giaTri: (model.tenderCondition.hsmtTenderCondition.tenderGuaranteeValue) ?
              model.tenderCondition.hsmtTenderCondition.tenderGuaranteeValue : 0,
            hieuLuc: (model.tenderCondition.hsmtTenderCondition.tenderGuaranteeEfficiency) ?
              model.tenderCondition.hsmtTenderCondition.tenderGuaranteeEfficiency : 0
          },
          hieuLucHoSo: model.tenderCondition.hsmtTenderCondition.tenderEfficiency,
          tienDo: model.tenderCondition.hsmtTenderCondition && {
            ngayKhoiCong: model.tenderCondition.hsmtTenderCondition.progressStartDate,
            thoiGianHoanThanh: model.tenderCondition.hsmtTenderCondition.progressComletionDate
          },
          // TODO: Chú ý map lại ID, KEY, DISPLAYTEXT
          cacLoaiThue: (model.tenderCondition.hsmtTenderCondition.taxTypes || []).map(x => x.displayText),
          donViTienTe: model.tenderCondition.hsmtTenderCondition.currency && model.tenderCondition.hsmtTenderCondition.currency.displayText
        }
      };
      // TODO: Map lại chỗ này
      dataOut.yeuCauDacBietKhac = model.otherSpecialRequirement && {
        greenBuildingStandardName: model.otherSpecialRequirement.greenBuildingStandardName,
        greenBuildingStandardLink: model.otherSpecialRequirement.greenBuildingStandardLink,
        tenderEvaluationStep1: model.otherSpecialRequirement.tenderEvaluationStep1,
        tenderEvaluationStep2: model.otherSpecialRequirement.tenderEvaluationStep2,
        profitValue: model.otherSpecialRequirement.profitValue,
        profitDesc: model.otherSpecialRequirement.profitDesc
      };
      dataOut.noiDungCapNhat = '';
    }
    return dataOut;
  }


  // Xóa ảnh
  deleteImage(guid) {
    const url = `tenderconditionalsummary/deleteimage`;
    return this.apiService.post(url, guid);
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

  // Lịch sử thay đổi liveform
  getChangeHistoryListProposedTender(
    bidOpportunityId: number,
    page: number | string,
    pageSize: number | string): Observable<PagedResult<HistoryLiveForm>> {
    const url = `bidopportunity/${bidOpportunityId}/tenderconditionalsummary/changedhistory/${page}/${pageSize}`;
    return this.apiService.get(url).map(response => {
      const result = response.result;
      return {
        currentPage: result.pageIndex,
        pageSize: result.pageSize,
        pageCount: result.totalPages,
        total: result.totalCount,
        items: (result.items || []).map(
          HoSoDuThauService.toHistoryLiveForm
        )
      };
    });
  }
}
