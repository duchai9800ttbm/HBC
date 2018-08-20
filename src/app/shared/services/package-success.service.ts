import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { DocumentItem } from '../models/document-item'

@Injectable()
export class PackageSuccessService {
    documentType = ['Bảo vệ', 'Cuốn hồ sơ mới','Tiêu chuẩn kỹ thuật','BOQ','Khảo sát địa chật'];
    documentRom = ['Phòng hành chính', 'Phòng lưu trữ'];
    documentNumber = ['30 Ngày', '30 Ngày'];
    dateNo = ['01/01/2018', '01/02/2018'];
    interviewNo = [1, 2];
    documentName = ['Tài liệu BV','Hồ sơ','Kỹ thuật','BOQ','Khảo sát'];
    documentData = [];
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
                documentData: this.documentData[Math.floor(Math.random() * (this.documentData.length))]
            });
        }
    }
    ngOnInit() {
    }
    getdataDocuments() {
        return this.dataDocuments;
    }

}
