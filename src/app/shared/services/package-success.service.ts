import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { DocumentItem } from '../models/document-item'
import { dateFieldName } from '@progress/kendo-angular-intl';

@Injectable()
export class PackageSuccessService {
    documentType = ['Bảo vệ', 'Cuốn hồ sơ mới', 'Tiêu chuẩn kỹ thuật', 'BOQ', 'Khảo sát địa chật'];
    documentRom = ['Phòng hành chính', 'Phòng lưu trữ'];
    documentNumber = ['30 Ngày', '30 Ngày'];
    dateNo = ['30 ngày'];
    interviewNo = [1, 2];
    documentName = ['Tài liệu BV', 'Hồ sơ', 'Kỹ thuật', 'BOQ', 'Khảo sát'];
    timeTransfer = ['22/08/2018, 09:56'];
    documentData = [];
    status = [];
    type=[1,2];
    dataDocuments: DocumentItem[] = [];
    constructor() {
        for (let i = 1; i < 6; i++) {
            this.dataDocuments.unshift({
                id: i,
                documentName: this.documentName[Math.floor(Math.random() * (this.documentName.length))],
                documentRom: this.documentRom[Math.floor(Math.random() * (this.documentRom.length))],
                documentNumber: this.documentNumber[Math.floor(Math.random() * (this.documentNumber.length))],
                interviewNo: this.interviewNo[Math.floor(Math.random() * (this.interviewNo.length))],
                dateNo: this.dateNo[Math.floor(Math.random() * (this.dateNo.length))],
                documentType: this.documentType[Math.floor(Math.random() * (this.documentType.length))],
                documentData: this.documentData[Math.floor(Math.random() * (this.documentData.length))],
                timeTransfer: this.timeTransfer[Math.floor(Math.random() * (this.timeTransfer.length))],
                status: this.status[Math.floor(Math.random() * (this.status.length))],
                type:this.type[Math.floor(Math.random() * (this.type.length))]
            });
        }
    }
    ngOnInit() {
    }
    getdataDocuments() {
        return this.dataDocuments;
    }
    getdataGetDocument() {
        return this.dataGetDocument;
    }
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
            type:1

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
            type:1

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
            type:2
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
            type:2


        },

    ]

}
