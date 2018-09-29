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

@Injectable()
export class HoSoDuThauService {

  constructor(
    private alertService: AlertService,
    private apiService: ApiService,
    private sessionService: SessionService
  ) { }
  // Tải lên hồ sơ dự thầu
  taiLenHoSoDuThau(
    bidOpportunityId: number,
    tenderDocumentTypeId: number,
    tenderDocumentName: string,
    tenderDocumentDesc: string,
    tenderDocumentFile: File,
    link: string
  ) {
    const url = `tenderdocument/upload`;
    const formData = new FormData();
    formData.append('BidOpportunityId', `${bidOpportunityId}`);
    formData.append('TenderDocumentTypeId', `${tenderDocumentTypeId}`);
    formData.append('TenderDocumentName', tenderDocumentName);
    formData.append('TenderDocumentDesc', tenderDocumentDesc);
    formData.append('TenderDocumentFile', tenderDocumentFile);
    formData.append('Url', link);
    return this.apiService.postFile(url, formData).map(response => response).share();
  }
  // Tải Template
  taiTemplateHSDT(): Observable<any> {
    const url = `tenderdocument/template/downoad`;
    return this.apiService.getFile(url).map(response => {
      return FileSaver.saveAs(
        new Blob([response.file], {
          type: `${response.file.type}`,
        }), response.fileName
      );
    });
  }
  // Tải hồ sơ dự thầu
  taiHoSoDuThau(tenderDocumentId: number): Observable<any> {
    const url = `tenderdocument/${tenderDocumentId}/download`;
    return this.apiService.get(url).map(res => res.result);
  }
  // Xóa 1 hồ sơ dự thầu
  xoaMotHoSoDuThau(tenderDocumentId: number): Observable<any> {
    const url = `tenderdocument/${tenderDocumentId}/delete`;
    return this.apiService.post(url, tenderDocumentId).map(res => res);
  }
  // get Danh sách loại tài liệu hồ sơ dự thầu (kèm số lượng file của mỗi loại tài liệu) theo gói thầu
  getDanhSachLoaiTaiLieu(bidOpportunityId: number): Observable<any> {
    const url = `bidopportunity/${bidOpportunityId}/tenderdocumenttypes`;
    return this.apiService.get(url).map(res => res.result);
  }
  // Chốt hồ sơ dự thầu
  chotHoSoDuThau(bidOpportunityId): Observable<any> {
    const url = `bidopportunity/hsdt/${bidOpportunityId}/chothosoduthau`;
    return this.apiService.post(url, bidOpportunityId)
      .map(res => res);
  }
  // Danh sách bộ hồ sơ dự thầu theo gói thầu; tìm kiếm theo tên tài liệu, lọc theo trạng thái, người upload, ngày upload; có phân trang
  danhSachBoHoSoDuThau(bidOpportunityId: number, page: number, pageSize: number): Observable<PagedResult<DanhSachBoHsdtItem>> {
    const url = `bidOpportunity/${bidOpportunityId}/${page}/${pageSize}`;
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
}
