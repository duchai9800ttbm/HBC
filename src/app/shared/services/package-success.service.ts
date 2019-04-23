import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs/Rx';
import { PagedResult } from '../models/paging-result.model';
import { CancelItem } from '../models/reason/cancel-item';
import { DocumentItem } from '../models/document-item';
import { SETTING_REASON } from '../configs/common.config';
import DateTimeConvertHelper from '../helpers/datetime-convert-helper';

@Injectable()
export class PackageSuccessService {
    documentType = [
        'Bảo vệ',
        'Cuốn hồ sơ mới',
        'Tiêu chuẩn kỹ thuật',
        'BOQ',
        'Khảo sát địa chật'
    ];
    documentRom = ['Phòng hành chính', 'Phòng lưu trữ'];
    documentNumber = ['30 Ngày', '30 Ngày'];
    dateNo = ['30 ngày'];
    interviewNo = [1, 2];
    documentName = ['Tài liệu BV', 'Hồ sơ', 'Kỹ thuật', 'BOQ', 'Khảo sát'];
    timeTransfer = ['22/08/2018, 09:56'];
    documentData = [];
    status = [];
    type = [1, 2];
    version = [1, 1.1];
    employeeName = ['Oliver Dinh', 'Van Dinh'];
    dataDocuments: DocumentItem[] = [];
    resultData: any = [
        {
            id: 1,
            documentName: 'Tài liệu cung cấp vật tư',
            version: 1,
            description: 'Danh sách tài liệu cung cấp vật tư  ',
            employeeName: 'Oliver Dinh',
            createdDate: '01/01/2018 ,09:00',
            upDate: '01/01/2018',
            interview: 1
        },
        {
            id: 2,
            documentName: 'Tài liệu cung cấp giấy tờ liên quan',
            version: 1.1,
            description: '',
            employeeName: 'Van Dinh',
            createdDate: '02/02/2018,09:00',
            upDate: '02/02/2018',
            interview: 1
        }
    ];

    dataGetDocument: any = [
        {
            id: 1,
            documentType: 'Bảo vệ',
            documentName: 'Tài liệu kho sản xuất',
            documentNumber: '30/08/2018',
            interviewNo: 1,
            timeTransfer: '01/08/2018, 09:00',
            documentRom: 'Phòng hành chính',
            documentData: 'Cuốn hồ sơ mời thầu',
            status: 1,
            type: 1
        },
        {
            id: 2,
            documentType: 'Cuốn hồ sơ mời thầu',
            documentName: 'Tài liệu kho sản xuất',
            documentNumber: '30/09/2018',
            interviewNo: 1,
            timeTransfer: '22/08/2018, 09:56',
            documentRom: 'Phòng hành chính',
            documentData: 'kho sản xuất vật tư',
            status: 1,
            type: 1
        },

        {
            id: 3,
            documentType: 'Bản tóm tắt DKDT',
            documentName: 'Tài liệu Maketing Slide',
            documentNumber: '30/09/2018',
            interviewNo: 1,
            timeTransfer: '22/08/2018, 09:56',
            documentRom: 'Phòng lưu trữ',
            documentData: 'Maketing online',
            status: 2,
            type: 2
        },
        {
            id: 4,
            documentType: 'Yêu cầu báo giá vật tư thầu phụ',
            documentName: 'Tài liệu Maketing Slide',
            documentNumber: '30/09/2018',
            interviewNo: 1,
            timeTransfer: '22/08/2018, 09:56',
            documentRom: 'Phòng lưu trữ',
            documentData: 'Maketing online',
            status: 2,
            type: 2
        }
    ];
    constructor(private apiService: ApiService) {
        // for (let i = 1; i < 6; i++) {
        //     this.dataDocuments.unshift({
        //         id: i,
        //         documentName: this.documentName[Math.floor(Math.random() * (this.documentName.length))],
        //         documentRom: this.documentRom[Math.floor(Math.random() * (this.documentRom.length))],
        //         documentNumber: this.documentNumber[Math.floor(Math.random() * (this.documentNumber.length))],
        //         interviewNo: this.interviewNo[Math.floor(Math.random() * (this.interviewNo.length))],
        //         dateNo: this.dateNo[Math.floor(Math.random() * (this.dateNo.length))],
        //         documentType: this.documentType[Math.floor(Math.random() * (this.documentType.length))],
        //         documentData: this.documentData[Math.floor(Math.random() * (this.documentData.length))],
        //         timeTransfer: this.timeTransfer[Math.floor(Math.random() * (this.timeTransfer.length))],
        //         status: this.status[Math.floor(Math.random() * (this.status.length))],
        //         type: this.type[Math.floor(Math.random() * (this.type.length))],
        //         version:this.version[Math.floor(Math.random() * (this.version.length))],
        //         employeeName:this.employeeName[Math.floor(Math.random() * (this.employeeName.length))]
        //     });
        // }
    }

    getdataDocuments() {
        return this.dataDocuments;
    }
    getdataGetDocument() {
        return this.dataGetDocument;
    }
    getDataResult() {
        return this.resultData;
    }
    // Get ds lý do  hủy thầu
    getReasonCancel(
        page: number | string,
        pageSize: number | string
    ): Observable<PagedResult<CancelItem>> {
        const url = `bidopportunitycancelreason/getall/${page}/${pageSize}`;
        return this.apiService
            .get(url)
            .map(response => {
                const result = response.result;
                return {
                    currentPage: result.pageIndex,
                    pageSize: result.pageSize,
                    pageCount: result.totalPages,
                    total: result.totalCount,
                    items: result.items
                };
            })
            .share();
    }

    // get ds lý tro trật thầu
    getReasonLose(
        page: number | string,
        pageSize: number | string
    ): Observable<PagedResult<CancelItem>> {
        const url = `bidopportunitylosereason/getall/${page}/${pageSize}`;
        return this.apiService
            .get(url)
            .map(response => {
                const result = response.result;
                return {
                    currentPage: result.pageIndex,
                    pageSize: result.pageSize,
                    pageCount: result.totalPages,
                    total: result.totalCount,
                    items: result.items
                };
            })
            .share();
    }
    // Det ds lý do trúng thầu
    getReasonWin(
        page: number | string,
        pageSize: number | string
    ): Observable<PagedResult<CancelItem>> {
        const url = `bidopportunitywinreason/getall/${page}/${pageSize}`;
        return this.apiService
            .get(url)
            .map(response => {
                const result = response.result;
                return {
                    currentPage: result.pageIndex,
                    pageSize: result.pageSize,
                    pageCount: result.totalPages,
                    total: result.totalCount,
                    items: result.items
                };
            })
            .share();
    }
    // Nhận kết quả dự thầu
    receiveBidResult(bidOpportunityId: number) {
        const url = `bidopportunity/kqdt/${bidOpportunityId}/nhanketquaduthau`;
        return this.apiService.post(url);
    }

    // kết quả dự thầu: trúng/trật/hủy thầu
    sendBidResult(bidOpportunityId: number, reasonId: number, type: string, receiveResultDate: Date): Observable<any> {
        let url = `bidopportunity/kqdt/${bidOpportunityId}/`;
        switch (type) {
            case SETTING_REASON.Win:
                url += `trungthau/${reasonId}`;
                break;
            case SETTING_REASON.Lose:
                url += `tratthau/${reasonId}`;
                break;
            case SETTING_REASON.Cancel:
                url += `huythau/${reasonId}`;
                break;
        }
        if (receiveResultDate) {
            switch (type) {
                case SETTING_REASON.Win:
                    url += `?receiveWinResultDate=${DateTimeConvertHelper.fromDtObjectToTimestamp(receiveResultDate)}`;
                    break;
                case SETTING_REASON.Lose:
                    url += `?receiveLoseResultDate=${DateTimeConvertHelper.fromDtObjectToTimestamp(receiveResultDate)}`;
                    break;
                case SETTING_REASON.Cancel:
                    url += `?receiveCancelResultDate=${DateTimeConvertHelper.fromDtObjectToTimestamp(receiveResultDate)}`;
                    break;
            }
        }
        return this.apiService.post(url).map(response => response.result);
    }
}
