import { UploadItem } from '../../shared/models/upload/upload-item.model';
import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
export class DataUploadService implements OnInit {    
    name = ['File khảo sát dự án KBS lần 1','File khảo sát dự án KBS lần 2','File khảo sát dự án KBS lần 3'];
    description = ['File dữ liệu khảo sát 1','File dữ liệu khảo sát 2','File dữ liệu khảo sát 3'];
     version = [1,1.2,1.3];
    createDate = ['01/08/2018', '02/08/2018', '03/08/2018'];
    userId = [1, 2];
    status =[1,2]
    
    dataUpload: UploadItem[] = []; 
    dataUploadSelect: UploadItem[] = []; 
    constructor() {
        for (let i = 1; i < 4; i++) {
            this.dataUpload.unshift({
                id: i,
                name: this.name[Math.floor(Math.random() * (this.name.length))],
                description: this.description[Math.floor(Math.random() * (this.description.length))],
                version: this.version[Math.floor(Math.random() * (this.version.length))],
                createDate: this.createDate[Math.floor(Math.random() * (this.createDate.length))],
                userId: this.userId[Math.floor(Math.random() * (this.userId.length))],
                status: this.status[Math.floor(Math.random() * (this.status.length))],
               
            });
        }

        for (let i = 1; i < 2; i++) {
            this.dataUploadSelect.unshift({
                id: i,
                name: this.name[Math.floor(Math.random() * (this.name.length))],
                description: this.description[Math.floor(Math.random() * (this.description.length))],
                version: this.version[Math.floor(Math.random() * (this.version.length))],
                createDate: this.createDate[Math.floor(Math.random() * (this.createDate.length))],
                userId: this.userId[Math.floor(Math.random() * (this.userId.length))],
                status: 2,
               
            });
        }
    }
    ngOnInit() {
    }
    
    getdataUploadFile() {
        return this.dataUpload;
    }

    getdataUploadFileSelect() {
        return this.dataUploadSelect;
    }
   
}

