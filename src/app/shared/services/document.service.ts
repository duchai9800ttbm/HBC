import { Injectable } from '@angular/core';
import { SessionService } from './session.service';
import { ApiService } from './api.service';
import { Observable } from '../../../../node_modules/rxjs/Observable';
import { BidDocumentModel } from '../models/document/bid-document.model';
import { BidDocumentGroupModel } from '../models/document/bid-document-group.model';
import { BidDocumentFilter } from '../models/document/bid-document-filter.model';
import * as moment from 'moment';
import { FilterPipe } from '../../../../node_modules/ngx-filter-pipe';
import * as FileSaver from 'file-saver';
import { InstantSearchService } from './instant-search.service';
import { URLSearchParams } from '@angular/http';
import { PagedResult } from '../models/paging-result.model';
import { SiteSurveyReport } from '../models/site-survey-report/site-survey-report';
import { TenderSiteSurveyingReport } from '../models/api-request/package/tender-site-surveying-report';
import { guid } from '@progress/kendo-angular-grid/dist/es2015/utils';
import { ScaleOverall } from '../models/site-survey-report/scale-overall.model';
import { Image, ImageItem } from '../models/site-survey-report/image';
import { DictionaryItem } from '../models';
import { SiteReportChangedHistory } from '../models/site-survey-report/site-report-changed-history';

@Injectable()
export class DocumentService {
    constructor(
        private sessionService: SessionService,
        private apiService: ApiService,
        private filterService: FilterPipe,
        private instantSearchService: InstantSearchService,
    ) { }
    private static createFilterParams(filter: BidDocumentFilter): URLSearchParams {
        const urlFilterParams = new URLSearchParams();
        urlFilterParams.append('status', filter.status);
        urlFilterParams.append('uploadedEmployeeId', filter.uploadedEmployeeId ? filter.uploadedEmployeeId.toString() : '');
        urlFilterParams.append('createdDate', filter.createDate ? filter.createDate.toString() : '');
        urlFilterParams.append('receivedDate', filter.receivedDate ? filter.receivedDate.toString() : '');

        return urlFilterParams;
    }
    private static toRecordInvitation(result: any): any {
        return {
            id: result.id,
            typeOfDocument: result.documentType,
            fileName: result.documentName,
            version: result.version,
            status: result.status,
            uploadPeople: result.uploadedBy.employeeName,
            uploadDate: result.createdDate,
            receivedDate: result.receivedDate
            // fileGuid: result.fileGuid,
        };
    }

    private static toDocumentListItem(result: any): BidDocumentModel {
        if (!result) {
            return new BidDocumentModel();
        }
        return {
            id: result.id,
            documentType: result.documentType && result.documentType.value,
            documentName: result.documentName,
            version: result.version,
            status: result.status,
            uploadedBy: result.uploadedBy && {
                employeeId: result.uploadedBy.employeeId,
                employeeNo: result.uploadedBy.employeeNo,
                employeeName: result.uploadedBy.employeeName,
                employeeAvatar: result.uploadedBy.employeeAvatar,
            },
            createdDate: result.createdDate,
            receivedDate: result.receivedDate,
            desc: result.description,
            fileGuid: result.fileGuid,
            url: result.url
        };
    }
    get employeeId() {
        return this.sessionService.currentUser.employeeId;
    }
    get userId() {
        return this.sessionService.currentUser.userId;
    }

    read(opportunityId: number | string, bidDocumentMajorTypeId: number | string): Observable<BidDocumentGroupModel[]> {
        const url = `bidopportunity/${opportunityId}/biddocumenttypes/${bidDocumentMajorTypeId}/biddocuments/filter/0/1000`;
        return this.apiService.get(url)
            .map(response => {
                if (!response) {
                    return this.group([]);
                }
                const list = ((response.result && response.result.items) || []).map(DocumentService.toDocumentListItem);
                return this.group(list);
            });
    }

    bidDocumentMajortypes(): Observable<any> {
        const url = `biddocumentmajortypes`;
        return this.apiService.get(url).map(response => {
            const result = response.result;
            return result.map(i => {
                return {
                    id: i.key,
                    text: i.value
                };
            });
        });
    }

    bidDocumentMajorTypeByParent(parentId: number): Observable<any> {
        const url = `biddocumenttypes/${parentId}/child`;
        return this.apiService.get(url).map(response => {
            const result = response.result;
            return result.map(i => {
                return {
                    id: i.key,
                    text: i.value
                };
            });
        });
    }

    bidDocumentType(): Observable<any> {
        const url = `biddocumenttypes`;
        return this.apiService.get(url).map(response => {
            const result = response.result;
            return result.map(i => {
                return {
                    id: i.key,
                    text: i.value
                };
            });
        });
    }

    readAndGroup(opportunityId: number | string): Observable<BidDocumentGroupModel[]> {
        const url = `bidopportunity/${opportunityId}/biddocuments`;
        return this.apiService.get(url)
            .map(response => this.group(response.result));
    }

    bidDocumentsFilter(
        opportunityId: number,
        terms: Observable<string>,
        filter: BidDocumentFilter,
        page: number | string,
        pageSize: number | string
    ): Observable<any> {
        const searchUrl = `bidopportunity/${opportunityId}/biddocuments/filter/${page}/${pageSize}`;
        return this.instantSearchService.searchWithFilter(
            searchUrl,
            terms,
            DocumentService.createFilterParams(filter),
        )
            .map(result => {
                return {
                    currentPage: result.pageIndex,
                    pageSize: result.pageSize,
                    pageCount: result.totalPages,
                    total: result.totalCount,
                    items: (result.items || []).map(DocumentService.toRecordInvitation),
                };
            });
    }

    updateStatus(bidDocumentId: number | string, status: string) {
        const url = `biddocument/${bidDocumentId}/${status.toLocaleLowerCase()}`;
        return this.apiService.post(url).map(response => response);
    }

    delete(bidDocumentId: number) {
        const url = `biddocument/${bidDocumentId}/delete `;
        return this.apiService.post(url).map(response => response);
    }
    multiDelete(ids: any[]) {
        const url = `biddocument/multidelete`;
        const model = {
            ids: ids
        };
        return this.apiService.post(url, model).map(res => res);
    }

    download(bidDocumentId: number) {
        const url = `biddocument/${bidDocumentId}/download `;
        return this.apiService.getFile(url).map(response => {
            return FileSaver.saveAs(
                new Blob([response.file], {
                    type: `${response.file.type}`,
                }), response.fileName
            );
        });
    }

    upload(
        id: number,
        documentName: string,
        documentTypeId: string,
        description: string,
        receivedDate: number,
        file: File,
        link: string,
        version: string
    ) {
        const url = `biddocument/upload`;
        const formData = new FormData();
        formData.append('BidOpportunityId', `${id}`);
        formData.append('DocumentTypeId', documentTypeId);
        formData.append('DocumentName', documentName);
        formData.append('DocumentDesc', description);
        formData.append('ReceivedDate', `${moment(receivedDate).unix()}`);
        formData.append('DocumentFile', file);
        formData.append('Url', link);
        formData.append('Version', version);
        return this.apiService.postFile(url, formData)
            .map(response => response)
            .share();
    }

    filter(searchTerm: string, filterModel: BidDocumentFilter, source: BidDocumentGroupModel[]) {
        const listNoGroup = this.convertNestedJson(source);
        const listAfterFilter = this.sortAndSearch(searchTerm, filterModel, listNoGroup);
        const listFormat = this.formatJson(listAfterFilter);
        const listGroup = this.group(listFormat);
        return listGroup;
    }
    // convert list => listGroup
    group(source: BidDocumentModel[]): BidDocumentGroupModel[] {
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

    convertNestedJson(source: any[]) {
        const arr = source.map(x => {
            return x.items.map(y => {
                const day = moment.utc(y.createdDate * 1000).get('date');
                const month = moment.utc(y.createdDate * 1000).get('month');
                const year = moment.utc(y.createdDate * 1000).get('year');
                const day2 = moment.utc(y.receivedDate * 1000).get('date');
                const month2 = moment.utc(y.receivedDate * 1000).get('month');
                const year2 = moment.utc(y.receivedDate * 1000).get('year');
                return {
                    id: y.id,
                    documentType: y.documentType,
                    documentName: y.documentName,
                    version: y.version,
                    status: y.status,
                    uploadedBy: y.uploadedBy,
                    createdDate: y.createdDate,
                    receivedDate: y.receivedDate,
                    day: day,
                    month: month + 1,
                    year: year,
                    day2: day2,
                    month2: month2 + 1,
                    year2: year2,
                    employeeId: y.uploadedBy.employeeId
                };
            });
        }).concat();
        return ([]).concat(...arr);
    }

    unGroup(source: any[]) {
        const arr = source.map(x => {
            return x.items.map(y => {
                return {
                    id: y.id,
                    documentType: y.documentType,
                    documentName: y.documentName,
                    version: y.version,
                    status: y.status,
                    uploadedBy: y.uploadedBy,
                    createdDate: y.createdDate,
                    receivedDate: y.receivedDate,
                    checkboxSelected: y.checkboxSelected,
                    employeeId: y.uploadedBy.employeeId
                };
            });
        }).concat();
        return ([]).concat(...arr);
    }

    formatJson(source: any[]) {
        source.forEach(element => {
            delete element.day;
            delete element.month;
            delete element.year;
            delete element.day2;
            delete element.month2;
            delete element.year2;
            delete element.employeeId;
        });
        return source;
    }

    sortAndSearch(searchTerm: string, filterModel: BidDocumentFilter, source: any[]) {
        let day = null, month = null, year = null;
        let day2 = null, month2 = null, year2 = null;

        if (filterModel.createDate) {
            const today = new Date(
                moment(filterModel.createDate).unix()
            );
            day = moment(filterModel.createDate).get('date');
            month = moment(filterModel.createDate).get('month') + 1;
            year = moment(filterModel.createDate).get('year');

        }
        if (filterModel.receivedDate) {
            const today2 = new Date(
                moment(filterModel.receivedDate).unix()
            );
            day2 = moment(filterModel.receivedDate).get('date');
            month2 = moment(filterModel.receivedDate).get('month') + 1;
            year2 = moment(filterModel.receivedDate).get('year');
        }

        return this.filterService
            .transform(source,
                {
                    documentName: `${searchTerm ? searchTerm : ''}`,
                    status: `${filterModel.status ? filterModel.status : ''}`,
                    employeeId: filterModel.uploadedEmployeeId ? +filterModel.uploadedEmployeeId : null,
                    day: `${day ? day : ''}`,
                    month: `${month ? month : ''}`,
                    year: `${year ? year : ''}`,
                    day2: `${day2 ? day2 : ''}`,
                    month2: `${month2 ? month2 : ''}`,
                    year2: `${year2 ? year2 : ''}`
                });
    }

    getListConstructionType(): Observable<DictionaryItem> {
        const url = `bidconstructiontype/constructiontypes`;
        return this.apiService.get(url).map(res =>
            res.result.map(response => ({
                text: response.value,
                value: '',
                checked: false
            }))
        );
    }
    // Xóa ảnh báo cáo công trình - view UseFulInfo
    deleteImageSiteReport() { }
    // Lịch sử thay đổi báo cáo công trình
    changedHistoryTenderSiteReport(bidOpportunityId: number, page: number, pageSize: number)
        : Observable<PagedResult<SiteReportChangedHistory>> {
        const url = `bidopportunity/${bidOpportunityId}/tendersitesurveyingreport/changedhistory/${page}/${pageSize}`;
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
    // Thông tin bảng báo cáo công trình
    tenderSiteSurveyingReport(bidOpportunityId: number): Observable<SiteSurveyReport> {
        const url = `bidopportunity/${bidOpportunityId}/tendersitesurveyingreport`;
        return this.apiService.get(url).map(res => this.toSiteSurveyReport(res.result, bidOpportunityId));
    }
    // Mapping data - thông tin bảng báo cáo công trình
    toSiteSurveyReport(model: any, bidOpportunityId: number) {
        const dataFormated = new SiteSurveyReport();
        // case: CREATE
        if (!model) {
            dataFormated.bidOpportunityId = bidOpportunityId;
            dataFormated.nguoiTao = {
                id: this.userId,
                name: ''
            };
            dataFormated.scaleOverall = new ScaleOverall();
            dataFormated.scaleOverall.loaiCongTrinh = new Array;
            dataFormated.scaleOverall.trangthaiCongTrinh = [
                {
                    text: 'Mới (New)',
                    value: '',
                    checked: false
                },
                {
                    text: 'Thay đổi & bổ sung (Alteration & Additional)',
                    value: '',
                    checked: false
                },
                {
                    text: 'Khác (Other)',
                    value: '',
                    checked: false
                },
                {
                    text: 'Nâng cấp, cải tiến (Renovation)',
                    value: '',
                    checked: false
                }, {
                    text: 'Tháo dỡ & cải tiến (Demolishment & Renovation)',
                    value: '',
                    checked: false
                }
            ];
            return dataFormated;
        } else {
            // case: EDIT
            dataFormated.id = model.id;
            dataFormated.bidOpportunityId = model.bidOpportunityId;
            dataFormated.nguoiTao = model.createdEmployee && {
                id: model.createdEmployee.employeeId,
                name: model.createdEmployee.employeeName
            };
            dataFormated.ngayTao = model.createTime;
            dataFormated.lanCapNhat = null;
            dataFormated.nguoiCapNhat = model.updatedEmployee && {
                id: model.updatedEmployee.employeeId,
                name: model.updatedEmployee.employeeName
            };
            dataFormated.ngayCapNhat = model.updateTime;
            dataFormated.noiDungCapNhat = '';
            dataFormated.tenTaiLieu = (model.projectStatistic.projectStatistic) ?
                model.projectStatistic.projectStatistic.projectScale.documentName : '';
            dataFormated.lanPhongVan = (model.projectStatistic.projectStatistic) ?
                model.projectStatistic.projectStatistic.projectScale.interviewTimes : null;
            dataFormated.scaleOverall = {
                tenTaiLieu: (model.projectStatistic.projectStatistic) ?
                    model.projectStatistic.projectStatistic.projectScale.documentName : '',
                lanPhongVan: (model.projectStatistic.projectStatistic) ?
                    model.projectStatistic.projectStatistic.projectScale.interviewTimes : null,
                loaiCongTrinh: (model.projectStatistic.projectStatistic.constructionType || []).map(x => ({
                    value: x.value,
                    text: x.text,
                    checked: x.checked
                })),
                trangthaiCongTrinh: (model.projectStatistic.projectStatistic.constructionStatus || []).map(x => ({
                    value: x.value,
                    text: x.text,
                    checked: x.checked
                })),
                quyMoDuAn: model.projectStatistic.projectStatistic.projectScale && {
                    dienTichCongTruong: model.projectStatistic.projectStatistic.projectScale.siteArea,
                    tongDienTichXayDung: model.projectStatistic.projectStatistic.projectScale.grossFloorArea,
                    soTang: model.projectStatistic.projectStatistic.projectScale.totalNumberOfFloor,
                    tienDo: model.projectStatistic.projectStatistic.projectScale.constructionPeriod
                },
                hinhAnhPhoiCanh: model.projectStatistic.perspectiveImageOfProject && {
                    description: (model.projectStatistic.perspectiveImageOfProject.desc),
                    images: (model.projectStatistic.perspectiveImageOfProject.imageUrls || []).map(x => ({
                        id: x.guid,
                        image: { file: x.largeSizeUrl, base64: null }
                    }))
                },
                thongTinVeKetCau: model.projectStatistic.existingStructure && {
                    description: model.projectStatistic.existingStructure.desc,
                    images: (model.projectStatistic.existingStructure.imageUrls || []).map(x => ({
                        id: x.guid,
                        image: { file: x.largeSizeUrl, base64: null }
                    }))
                },
                nhungYeuCauDacBiet: model.projectStatistic.specialRequirement && {
                    description: model.projectStatistic.specialRequirement.desc,
                    images: (model.projectStatistic.specialRequirement.imageUrls || []).map(x => ({
                        id: x.guid,
                        image: { file: x.largeSizeUrl, base64: null }
                    }))
                }
            };
            dataFormated.describeOverall = model.siteInformation && {
                chiTietDiaHinh: model.siteInformation.topography && {
                    description: model.siteInformation.topography.desc,
                    images: (model.siteInformation.topography.imageUrls || []).map(x => ({
                        id: x.guid,
                        image: { file: x.largeSizeUrl, base64: null }
                    }))
                },
                kienTrucHienHuu: model.siteInformation.existBuildingOnTheSite && {
                    description: model.siteInformation.existBuildingOnTheSite.desc,
                    images: (model.siteInformation.existBuildingOnTheSite.imageUrls || []).map(x => ({
                        id: x.guid,
                        image: { file: x.largeSizeUrl, base64: null }
                    }))
                },
                yeuCauChuongNgai: model.siteInformation.existObstacleOnTheSite && {
                    description: model.siteInformation.existObstacleOnTheSite.desc,
                    images: (model.siteInformation.existObstacleOnTheSite.imageUrls || []).map(x => ({
                        id: x.guid,
                        image: { file: x.largeSizeUrl, base64: null }
                    }))
                }
            };
            dataFormated.traffic = model.transportationAndSiteEntranceCondition && {
                chiTietDiaHinhKhoKhan: model.transportationAndSiteEntranceCondition.disadvantage && {
                    description: model.transportationAndSiteEntranceCondition.disadvantage.desc,
                    images: (model.transportationAndSiteEntranceCondition.disadvantage.imageUrls || []).map(x => ({
                        id: x.guid,
                        image: { file: x.largeSizeUrl, base64: null }
                    }))
                },
                chiTietDiaHinhThuanLoi: model.transportationAndSiteEntranceCondition.advantage && {
                    description: model.transportationAndSiteEntranceCondition.advantage.desc,
                    images: (model.transportationAndSiteEntranceCondition.advantage.imageUrls || []).map(x => ({
                        id: x.guid,
                        image: { file: x.largeSizeUrl, base64: null }
                    }))
                },
                loiVaoCongTrinhHuongVao: model.transportationAndSiteEntranceCondition.directionOfSiteEntrance && {
                    description: model.transportationAndSiteEntranceCondition.directionOfSiteEntrance.desc,
                    images: (model.transportationAndSiteEntranceCondition.directionOfSiteEntrance.imageUrls || []).map(x => ({
                        id: x.guid,
                        image: { file: x.largeSizeUrl, base64: null }
                    }))
                },
                loiVaoCongTrinhDuongHienCo: model.transportationAndSiteEntranceCondition.existingRoadOnSite && {
                    description: model.transportationAndSiteEntranceCondition.existingRoadOnSite.desc,
                    images: (model.transportationAndSiteEntranceCondition.existingRoadOnSite.imageUrls || []).map(x => ({
                        id: x.guid,
                        image: { file: x.largeSizeUrl, base64: null }
                    }))
                },
                loiVaoCongTrinhYeuCauDuongTam: model.transportationAndSiteEntranceCondition.temporatyRoadRequirement && {
                    description: model.transportationAndSiteEntranceCondition.temporatyRoadRequirement.desc,
                    images: (model.transportationAndSiteEntranceCondition.temporatyRoadRequirement.imageUrls || []).map(x => ({
                        id: x.guid,
                        image: { file: x.largeSizeUrl, base64: null }
                    }))
                },
                loiVaoCongTrinhYeuCauHangRao: model.transportationAndSiteEntranceCondition.temporaryFenceRequirement && {
                    description: model.transportationAndSiteEntranceCondition.temporaryFenceRequirement.desc,
                    images: (model.transportationAndSiteEntranceCondition.temporaryFenceRequirement.imageUrls || []).map(x => ({
                        id: x.guid,
                        image: { file: x.largeSizeUrl, base64: null }
                    }))
                },
            };
            dataFormated.demoConso = model.demobilisationAndConsolidation && {
                phaVoKetCau: model.demobilisationAndConsolidation.demobilisationExistingStructureOrBuilding && {
                    description: model.demobilisationAndConsolidation.demobilisationExistingStructureOrBuilding.desc,
                    images: (model.demobilisationAndConsolidation.demobilisationExistingStructureOrBuilding.imageUrls || []).map(x => ({
                        id: x.guid,
                        image: { file: x.largeSizeUrl, base64: null }
                    }))
                },
                giaCoKetCau: model.demobilisationAndConsolidation.consolidationExistingStructureOrBuilding && {
                    description: model.demobilisationAndConsolidation.consolidationExistingStructureOrBuilding.desc,
                    images: (model.demobilisationAndConsolidation.consolidationExistingStructureOrBuilding.imageUrls || []).map(x => ({
                        id: x.guid,
                        image: { file: x.largeSizeUrl, base64: null }
                    }))
                },
                dieuKien: model.demobilisationAndConsolidation.adjacentBuildingConditions && {
                    description: model.demobilisationAndConsolidation.adjacentBuildingConditions.desc,
                    images: (model.demobilisationAndConsolidation.adjacentBuildingConditions.imageUrls || []).map(x => ({
                        id: x.guid,
                        image: { file: x.largeSizeUrl, base64: null }
                    }))
                }
            };
            dataFormated.serviceConstruction = model.temporaryBuildingServiceForConstruction && {
                heThongNuocHeThongHienHuu: model.temporaryBuildingServiceForConstruction.supplyWaterSystemExistingSystem && {
                    description: model.temporaryBuildingServiceForConstruction.supplyWaterSystemExistingSystem.desc,
                    images: (model.temporaryBuildingServiceForConstruction.supplyWaterSystemExistingSystem.imageUrls || []).map(x => ({
                        id: x.guid,
                        image: { file: x.largeSizeUrl, base64: null }
                    }))
                },
                heThongNuocDiemDauNoi: model.temporaryBuildingServiceForConstruction.supplyWaterSystemExistingConnectionPoint && {
                    description: model.temporaryBuildingServiceForConstruction.supplyWaterSystemExistingConnectionPoint.desc,
                    images: (model.temporaryBuildingServiceForConstruction.supplyWaterSystemExistingConnectionPoint.imageUrls || [])
                        .map(x => ({
                            id: x.guid,
                            image: { file: x.largeSizeUrl, base64: null }
                        }))
                },
                heThongNuocThoatHeThongHienHuu: model.temporaryBuildingServiceForConstruction.drainageWaterSystemExistingSystem && {
                    description: model.temporaryBuildingServiceForConstruction.drainageWaterSystemExistingSystem.desc,
                    images: (model.temporaryBuildingServiceForConstruction.drainageWaterSystemExistingSystem.imageUrls || [])
                        .map(x => ({
                            id: x.guid,
                            image: { file: x.largeSizeUrl, base64: null }
                        }))
                },
                heThongNuocThoatDiemDauNoi: model.temporaryBuildingServiceForConstruction.drainageWaterSystemExistingConnectionPoint && {
                    description: model.temporaryBuildingServiceForConstruction.drainageWaterSystemExistingConnectionPoint.desc,
                    images: (model.temporaryBuildingServiceForConstruction.drainageWaterSystemExistingConnectionPoint.imageUrls || [])
                        .map(x => ({
                            id: x.guid,
                            image: { file: x.largeSizeUrl, base64: null }
                        }))
                },
                heThongDienTramHaThe: model.temporaryBuildingServiceForConstruction.transformerStation && {
                    description: model.temporaryBuildingServiceForConstruction.transformerStation.desc,
                    images: (model.temporaryBuildingServiceForConstruction.transformerStation.imageUrls || []).map(x => ({
                        id: x.guid,
                        image: { file: x.largeSizeUrl, base64: null }
                    }))
                },
                heThongDienDuongDayTrungThe: model.temporaryBuildingServiceForConstruction.existingMediumVoltageSystem && {
                    description: model.temporaryBuildingServiceForConstruction.existingMediumVoltageSystem.desc,
                    images: (model.temporaryBuildingServiceForConstruction.existingMediumVoltageSystem.imageUrls || []).map(x => ({
                        id: x.guid,
                        image: { file: x.largeSizeUrl, base64: null }
                    }))
                },
                heThongDienThongTinKhac: model.temporaryBuildingServiceForConstruction.others && {
                    description: model.temporaryBuildingServiceForConstruction.others.desc,
                    images: (model.temporaryBuildingServiceForConstruction.others.imageUrls || []).map(x => ({
                        id: x.guid,
                        image: { file: x.largeSizeUrl, base64: null }
                    }))
                }
            };
            dataFormated.soilCondition = model.reportExistingSoilCondition && {
                nenMongHienCo: model.reportExistingSoilCondition.existingFooting && {
                    description: model.reportExistingSoilCondition.existingFooting.desc,
                    images: (model.reportExistingSoilCondition.existingFooting.imageUrls || []).map(x => ({
                        id: guid,
                        image: { file: x.largeSizeUrl, base64: null }
                    }))
                },
                thongTinCongTrinhGanDo: model.reportExistingSoilCondition.soilInvestigation && {
                    description: model.reportExistingSoilCondition.soilInvestigation.desc,
                    images: (model.reportExistingSoilCondition.soilInvestigation.imageUrls || []).map(x => ({
                        id: guid,
                        image: { file: x.largeSizeUrl, base64: null }
                    }))
                }
            };
            dataFormated.usefulInfo = (model.usefulInFormations || []).map(x => ({
                title: x.title,
                content: x.content.map(i => ({
                    name: i.name,
                    detail: i.detail,
                    images: i.imageUrls.map(e => ({
                        id: e.guid,
                        image: { file: e.largeSizeUrl, base64: null }
                    }))
                }))
            }));
            dataFormated.updateDescription = '';
            return dataFormated;
        }
    }
    // Tạo mới - cập nhật báo cáo công trình
    createOrUpdateSiteSurveyingReport(obj: SiteSurveyReport) {
        const url = `bidopportunity/tendersitesurveyingreport/createorupdate`;
        const objDataSiteReport = new FormData();
        objDataSiteReport.append('BidOpportunityId', `${obj.bidOpportunityId}`);
        if (obj.nguoiTao) {
            objDataSiteReport.append('CreatedEmployeeId', `${obj.nguoiTao.id}`);
        } else { objDataSiteReport.append('CreatedEmployeeId', `${this.userId}`); }
        if (obj.nguoiCapNhat) {
            objDataSiteReport.append('UpdatedEmployeeId', `${obj.nguoiCapNhat.id}`);
        } else {
            if (obj.nguoiTao) {
                objDataSiteReport.append('UpdatedEmployeeId', `${obj.nguoiTao.id}`);
            } else {
                objDataSiteReport.append('UpdatedEmployeeId', `${this.userId}`);
            }
        }
        obj.scaleOverall.loaiCongTrinh.forEach((x, i) => {
            const paramAppendText = `ProjectStatistic.ProjectStatistic.ConstructionType[${i}].Text`;
            const paramAppendValue = `ProjectStatistic.ProjectStatistic.ConstructionType[${i}].Value`;
            const paramAppendChecked = `ProjectStatistic.ProjectStatistic.ConstructionType[${i}].Checked`;
            objDataSiteReport.append(paramAppendText, x.text);
            objDataSiteReport.append(paramAppendValue, x.value);
            objDataSiteReport.append(paramAppendChecked, `${x.checked}`);
        });
        obj.scaleOverall.trangthaiCongTrinh.forEach((x, i) => {
            const paramAppendText = `ProjectStatistic.ProjectStatistic.ConstructionStatus[${i}].Text`;
            const paramAppendValue = `ProjectStatistic.ProjectStatistic.ConstructionStatus[${i}].Value`;
            const paramAppendChecked = `ProjectStatistic.ProjectStatistic.ConstructionStatus[${i}].Checked`;
            objDataSiteReport.append(paramAppendText, x.text);
            objDataSiteReport.append(paramAppendValue, x.value);
            objDataSiteReport.append(paramAppendChecked, `${x.checked}`);
        });
        if (obj.scaleOverall) {
            objDataSiteReport.append('ProjectStatistic.ProjectStatistic.ProjectScale.DocumentName', obj.scaleOverall.tenTaiLieu);
        } else { objDataSiteReport.append('ProjectStatistic.ProjectStatistic.ProjectScale.DocumentName', ''); }
        if (obj.scaleOverall) {
            objDataSiteReport.append('ProjectStatistic.ProjectStatistic.ProjectScale.InterviewTimes',
                `${(obj.scaleOverall.lanPhongVan) ? obj.scaleOverall.lanPhongVan : null}`);
        } else {
            objDataSiteReport.append('ProjectStatistic.ProjectStatistic.ProjectScale.InterviewTimes', `${0}`);
        }
        if (obj.scaleOverall.quyMoDuAn.dienTichCongTruong) {
            objDataSiteReport.append('ProjectStatistic.ProjectStatistic.ProjectScale.SiteArea',
                `${obj.scaleOverall.quyMoDuAn.dienTichCongTruong}`);
        } else {
            objDataSiteReport.append('ProjectStatistic.ProjectStatistic.ProjectScale.SiteArea', `${0}`);
        }
        if (obj.scaleOverall.quyMoDuAn.tongDienTichXayDung) {
            objDataSiteReport.append('ProjectStatistic.ProjectStatistic.ProjectScale.GrossFloorArea',
                `${obj.scaleOverall.quyMoDuAn.tongDienTichXayDung}`);
        } else {
            objDataSiteReport.append('ProjectStatistic.ProjectStatistic.ProjectScale.GrossFloorArea', `${0}`);
        }
        if (obj.scaleOverall.quyMoDuAn.tienDo) {
            objDataSiteReport.append('ProjectStatistic.ProjectStatistic.ProjectScale.ConstructionPeriod',
                `${obj.scaleOverall.quyMoDuAn.tienDo}`);
        } else {
            objDataSiteReport.append('ProjectStatistic.ProjectStatistic.ProjectScale.ConstructionPeriod', `${0}`);
        }
        if (obj.scaleOverall.quyMoDuAn.soTang) {
            objDataSiteReport.append('ProjectStatistic.ProjectStatistic.ProjectScale.TotalNumberOfFloor',
                obj.scaleOverall.quyMoDuAn.soTang);
        } else {
            objDataSiteReport.append('ProjectStatistic.ProjectStatistic.ProjectScale.TotalNumberOfFloor', '');
        }
        if (obj.scaleOverall.hinhAnhPhoiCanh) {
            objDataSiteReport.append('ProjectStatistic.PerspectiveImageOfProject.Desc', obj.scaleOverall.hinhAnhPhoiCanh.description);
            obj.scaleOverall.hinhAnhPhoiCanh.images.forEach(x => {
                (x.id) ?
                    objDataSiteReport.append('ProjectStatistic.PerspectiveImageOfProject.ImageUrls', x.id) :
                    objDataSiteReport.append('ProjectStatistic.PerspectiveImageOfProject.Images', x.image.file);
            });
        } else {
            objDataSiteReport.append('ProjectStatistic.PerspectiveImageOfProject.Desc', '');
            objDataSiteReport.append('ProjectStatistic.PerspectiveImageOfProject.ImageUrls', null);
            objDataSiteReport.append('ProjectStatistic.PerspectiveImageOfProject.Images', null);
        }
        if (obj.scaleOverall.thongTinVeKetCau) {
            objDataSiteReport.append('ProjectStatistic.ExistingStructure.Desc', obj.scaleOverall.thongTinVeKetCau.description);
            obj.scaleOverall.thongTinVeKetCau.images.forEach(x => {
                (x.id) ?
                    objDataSiteReport.append('ProjectStatistic.ExistingStructure.ImageUrls', x.id) :
                    objDataSiteReport.append('ProjectStatistic.ExistingStructure.Images', x.image.file);
            });
        } else {
            objDataSiteReport.append('ProjectStatistic.ExistingStructure.Desc', '');
            objDataSiteReport.append('ProjectStatistic.ExistingStructure.ImageUrls', null);
            objDataSiteReport.append('ProjectStatistic.ExistingStructure.Images', null);
        }
        if (obj.scaleOverall.nhungYeuCauDacBiet) {
            objDataSiteReport.append('ProjectStatistic.SpecialRequirement.Desc', obj.scaleOverall.nhungYeuCauDacBiet.description);
            obj.scaleOverall.nhungYeuCauDacBiet.images.forEach(x => {
                (x.id) ?
                    objDataSiteReport.append('ProjectStatistic.SpecialRequirement.ImageUrls', x.id) :
                    objDataSiteReport.append('ProjectStatistic.SpecialRequirement.Images', x.image.file);
            });
        } else {
            objDataSiteReport.append('ProjectStatistic.SpecialRequirement.Desc', '');
            objDataSiteReport.append('ProjectStatistic.SpecialRequirement.ImageUrls', null);
            objDataSiteReport.append('ProjectStatistic.SpecialRequirement.Images', null);
        }
        // Describe
        if (obj.describeOverall) {
            if (obj.describeOverall.chiTietDiaHinh) {
                objDataSiteReport.append('SiteInformation.Topography.Desc', obj.describeOverall.chiTietDiaHinh.description);
                obj.describeOverall.chiTietDiaHinh.images.forEach(x => {
                    (x.id) ?
                        objDataSiteReport.append('SiteInformation.Topography.ImageUrls', x.id) :
                        objDataSiteReport.append('SiteInformation.Topography.Images', x.image.file);
                });
            } else {
                objDataSiteReport.append('SiteInformation.Topography.Desc', '');
                objDataSiteReport.append('SiteInformation.Topography.ImageUrls', null);
                objDataSiteReport.append('SiteInformation.Topography.Images', null);
            }
        }
        if (obj.describeOverall) {
            if (obj.describeOverall.kienTrucHienHuu) {
                objDataSiteReport.append('SiteInformation.ExistBuildingOnTheSite.Desc', obj.describeOverall.kienTrucHienHuu.description);
                obj.describeOverall.kienTrucHienHuu.images.forEach(x => {
                    (x.id) ?
                        objDataSiteReport.append('SiteInformation.ExistBuildingOnTheSite.ImageUrls', x.id) :
                        objDataSiteReport.append('SiteInformation.ExistBuildingOnTheSite.Images', x.image.file);
                });
            } else {
                objDataSiteReport.append('SiteInformation.ExistBuildingOnTheSite.Desc', '');
                objDataSiteReport.append('SiteInformation.ExistBuildingOnTheSite.ImageUrls', null);
                objDataSiteReport.append('SiteInformation.ExistBuildingOnTheSite.Images', null);
            }
        }
        if (obj.describeOverall) {
            if (obj.describeOverall.yeuCauChuongNgai) {
                objDataSiteReport.append('SiteInformation.ExistObstacleOnTheSite.Desc', obj.describeOverall.yeuCauChuongNgai.description);
                obj.describeOverall.yeuCauChuongNgai.images.forEach(x => {
                    (x.id) ?
                        objDataSiteReport.append('SiteInformation.ExistObstacleOnTheSite.ImageUrls', x.id) :
                        objDataSiteReport.append('SiteInformation.ExistObstacleOnTheSite.Images', x.image.file);
                });
            } else {
                objDataSiteReport.append('SiteInformation.ExistObstacleOnTheSite.Desc', '');
                objDataSiteReport.append('SiteInformation.ExistObstacleOnTheSite.ImageUrls', null);
                objDataSiteReport.append('SiteInformation.ExistObstacleOnTheSite.Images', null);
            }
        }
        // Traffice
        if (obj.traffic) {
            if (obj.traffic.chiTietDiaHinhKhoKhan) {
                objDataSiteReport.append('TransportationAndSiteEntranceCondition.Disadvantage.Desc',
                    obj.traffic.chiTietDiaHinhKhoKhan.description);
                obj.traffic.chiTietDiaHinhKhoKhan.images.forEach(x => {
                    (x.id) ?
                        objDataSiteReport.append('TransportationAndSiteEntranceCondition.Disadvantage.ImageUrls', x.id) :
                        objDataSiteReport.append('TransportationAndSiteEntranceCondition.Disadvantage.Images', x.image.file);
                });
            } else {
                objDataSiteReport.append('TransportationAndSiteEntranceCondition.Disadvantage.Desc', '');
                objDataSiteReport.append('TransportationAndSiteEntranceCondition.Disadvantage.ImageUrls', null);
                objDataSiteReport.append('TransportationAndSiteEntranceCondition.Disadvantage.Images', null);
            }
        }
        if (obj.traffic) {
            if (obj.traffic.chiTietDiaHinhThuanLoi) {
                objDataSiteReport.append('TransportationAndSiteEntranceCondition.Advantage.Desc',
                    obj.traffic.chiTietDiaHinhThuanLoi.description);
                obj.traffic.chiTietDiaHinhThuanLoi.images.forEach(x => {
                    (x.id) ?
                        objDataSiteReport.append('TransportationAndSiteEntranceCondition.Advantage.ImageUrls', x.id) :
                        objDataSiteReport.append('TransportationAndSiteEntranceCondition.Advantage.Images', x.image.file);
                });
            } else {
                objDataSiteReport.append('TransportationAndSiteEntranceCondition.Advantage.Desc', '');
                objDataSiteReport.append('TransportationAndSiteEntranceCondition.Advantage.ImageUrls', null);
                objDataSiteReport.append('TransportationAndSiteEntranceCondition.Advantage.Images', null);
            }
            if (obj.traffic.loiVaoCongTrinhHuongVao) {
                objDataSiteReport.append('TransportationAndSiteEntranceCondition.DirectionOfSiteEntrance.Desc',
                    obj.traffic.loiVaoCongTrinhHuongVao.description);
                obj.traffic.loiVaoCongTrinhHuongVao.images.forEach(x => {
                    (x.id) ?
                        objDataSiteReport.append('TransportationAndSiteEntranceCondition.DirectionOfSiteEntrance.ImageUrls', x.id) :
                        objDataSiteReport.append('TransportationAndSiteEntranceCondition.DirectionOfSiteEntrance.Images', x.image.file);
                });
            } else {
                objDataSiteReport.append('TransportationAndSiteEntranceCondition.DirectionOfSiteEntrance.Desc', '');
                objDataSiteReport.append('TransportationAndSiteEntranceCondition.DirectionOfSiteEntrance.ImageUrls', null);
                objDataSiteReport.append('TransportationAndSiteEntranceCondition.DirectionOfSiteEntrance.Images', null);
            }
            if (obj.traffic.loiVaoCongTrinhDuongHienCo) {
                objDataSiteReport.append('TransportationAndSiteEntranceCondition.ExistingRoadOnSite.Desc',
                    obj.traffic.loiVaoCongTrinhDuongHienCo.description);
                obj.traffic.loiVaoCongTrinhDuongHienCo.images.forEach(x => {
                    (x.id) ?
                        objDataSiteReport.append('TransportationAndSiteEntranceCondition.ExistingRoadOnSite.ImageUrls', x.id) :
                        objDataSiteReport.append('TransportationAndSiteEntranceCondition.ExistingRoadOnSite.Images', x.image.file);
                });
            } else {
                objDataSiteReport.append('TransportationAndSiteEntranceCondition.ExistingRoadOnSite.Desc', '');
                objDataSiteReport.append('TransportationAndSiteEntranceCondition.ExistingRoadOnSite.ImageUrls', null);
                objDataSiteReport.append('TransportationAndSiteEntranceCondition.ExistingRoadOnSite.Images', null);
            }
            if (obj.traffic.loiVaoCongTrinhYeuCauDuongTam) {
                objDataSiteReport.append('TransportationAndSiteEntranceCondition.TemporatyRoadRequirement.Desc',
                    obj.traffic.loiVaoCongTrinhYeuCauDuongTam.description);
                obj.traffic.loiVaoCongTrinhYeuCauDuongTam.images.forEach(x => {
                    (x.id) ?
                        objDataSiteReport.append('TransportationAndSiteEntranceCondition.TemporatyRoadRequirement.ImageUrls', x.id) :
                        objDataSiteReport.append('TransportationAndSiteEntranceCondition.TemporatyRoadRequirement.Images', x.image.file);
                });
            } else {
                objDataSiteReport.append('TransportationAndSiteEntranceCondition.TemporatyRoadRequirement.Desc', '');
                objDataSiteReport.append('TransportationAndSiteEntranceCondition.TemporatyRoadRequirement.ImageUrls', null);
                objDataSiteReport.append('TransportationAndSiteEntranceCondition.TemporatyRoadRequirement.Images', null);
            }
            if (obj.traffic.loiVaoCongTrinhYeuCauHangRao) {
                objDataSiteReport.append('TransportationAndSiteEntranceCondition.TemporaryFenceRequirement.Desc',
                    obj.traffic.loiVaoCongTrinhYeuCauHangRao.description);
                obj.traffic.loiVaoCongTrinhYeuCauHangRao.images.forEach(x => {
                    (x.id) ?
                        objDataSiteReport.append('TransportationAndSiteEntranceCondition.TemporaryFenceRequirement.ImageUrls', x.id) :
                        objDataSiteReport.append('TransportationAndSiteEntranceCondition.TemporaryFenceRequirement.Images', x.image.file);
                });
            } else {
                objDataSiteReport.append('TransportationAndSiteEntranceCondition.TemporaryFenceRequirement.Desc', '');
                objDataSiteReport.append('TransportationAndSiteEntranceCondition.TemporaryFenceRequirement.ImageUrls', null);
                objDataSiteReport.append('TransportationAndSiteEntranceCondition.TemporaryFenceRequirement.Images', null);
            }
        }
        // Demo
        if (obj.demoConso) {
            if (obj.demoConso.phaVoKetCau) {
                objDataSiteReport.append('DemobilisationAndConsolidation.DemobilisationExistingStructureOrBuilding.Desc',
                    obj.demoConso.phaVoKetCau.description);
                obj.demoConso.phaVoKetCau.images.forEach(x => {
                    (x.id) ?
                        objDataSiteReport.append('DemobilisationAndConsolidation.DemobilisationExistingStructureOrBuilding.ImageUrls',
                            x.id) :
                        objDataSiteReport.append('DemobilisationAndConsolidation.DemobilisationExistingStructureOrBuilding.Images',
                            x.image);
                });
            } else {
                objDataSiteReport.append('DemobilisationAndConsolidation.DemobilisationExistingStructureOrBuilding.Desc', '');
                objDataSiteReport.append('DemobilisationAndConsolidation.DemobilisationExistingStructureOrBuilding.ImageUrls', null);
                objDataSiteReport.append('DemobilisationAndConsolidation.DemobilisationExistingStructureOrBuilding.Images', null);
            }
            if (obj.demoConso.giaCoKetCau) {
                objDataSiteReport.append('DemobilisationAndConsolidation.ConsolidationExistingStructureOrBuilding.Desc',
                    obj.demoConso.giaCoKetCau.description);
                obj.demoConso.giaCoKetCau.images.forEach(x => {
                    (x.id) ?
                        objDataSiteReport.append('DemobilisationAndConsolidation.ConsolidationExistingStructureOrBuilding.ImageUrls',
                            x.id) :
                        objDataSiteReport.append('DemobilisationAndConsolidation.ConsolidationExistingStructureOrBuilding.Images',
                            x.image.file);
                });
            } else {
                objDataSiteReport.append('DemobilisationAndConsolidation.ConsolidationExistingStructureOrBuilding.Desc', '');
                objDataSiteReport.append('DemobilisationAndConsolidation.ConsolidationExistingStructureOrBuilding.ImageUrls', null);
                objDataSiteReport.append('DemobilisationAndConsolidation.ConsolidationExistingStructureOrBuilding.Images', null);
            }
            if (obj.demoConso.dieuKien) {
                objDataSiteReport.append('DemobilisationAndConsolidation.AdjacentBuildingConditions.Desc',
                    obj.demoConso.dieuKien.description);
                obj.demoConso.dieuKien.images.forEach(x => {
                    (x.id) ?
                        objDataSiteReport.append('DemobilisationAndConsolidation.AdjacentBuildingConditions.ImageUrls', x.id) :
                        objDataSiteReport.append('DemobilisationAndConsolidation.AdjacentBuildingConditions.Images', x.image.file);
                });
            } else {
                objDataSiteReport.append('DemobilisationAndConsolidation.AdjacentBuildingConditions.Desc', '');
                objDataSiteReport.append('DemobilisationAndConsolidation.AdjacentBuildingConditions.ImageUrls', null);
                objDataSiteReport.append('DemobilisationAndConsolidation.AdjacentBuildingConditions.Images', null);
            }
        }
        // ServiceCOnstruction
        if (obj.serviceConstruction) {
            if (obj.serviceConstruction.heThongNuocHeThongHienHuu) {
                objDataSiteReport.append('TemporaryBuildingServiceForConstruction.SupplyWaterSystemExistingSystem.Desc',
                    obj.serviceConstruction.heThongNuocHeThongHienHuu.description);
                obj.serviceConstruction.heThongNuocHeThongHienHuu.images.forEach(x => {
                    (x.id) ?
                        objDataSiteReport.append('TemporaryBuildingServiceForConstruction.SupplyWaterSystemExistingSystem.ImageUrls',
                            x.id) :
                        objDataSiteReport.append('TemporaryBuildingServiceForConstruction.SupplyWaterSystemExistingSystem.Images',
                            x.image.file);
                });
            } else {
                objDataSiteReport.append('TemporaryBuildingServiceForConstruction.SupplyWaterSystemExistingSystem.Desc', '');
                objDataSiteReport.append('TemporaryBuildingServiceForConstruction.SupplyWaterSystemExistingSystem.ImageUrls', null);
                objDataSiteReport.append('TemporaryBuildingServiceForConstruction.SupplyWaterSystemExistingSystem.Images', null);
            }
            if (obj.serviceConstruction.heThongNuocDiemDauNoi) {
                objDataSiteReport.append('TemporaryBuildingServiceForConstruction.SupplyWaterSystemExistingConnectionPoint.Desc',
                    obj.serviceConstruction.heThongNuocDiemDauNoi.description);
                obj.serviceConstruction.heThongNuocDiemDauNoi.images.forEach(x => {
                    (x.id) ?
                        objDataSiteReport.append
                            ('TemporaryBuildingServiceForConstruction.SupplyWaterSystemExistingConnectionPoint.ImageUrls', x.id) :
                        objDataSiteReport.append('TemporaryBuildingServiceForConstruction.SupplyWaterSystemExistingConnectionPoint.Images',
                            x.image);
                });
            } else {
                objDataSiteReport.append('TemporaryBuildingServiceForConstruction.SupplyWaterSystemExistingConnectionPoint.Desc', '');
                objDataSiteReport.append('TemporaryBuildingServiceForConstruction.SupplyWaterSystemExistingConnectionPoint.ImageUrls',
                    null);
                objDataSiteReport.append('TemporaryBuildingServiceForConstruction.SupplyWaterSystemExistingConnectionPoint.Images',
                    null);
            }
            if (obj.serviceConstruction.heThongNuocThoatHeThongHienHuu) {
                objDataSiteReport.append('TemporaryBuildingServiceForConstruction.DrainageWaterSystemExistingSystem.Desc',
                    obj.serviceConstruction.heThongNuocThoatHeThongHienHuu.description);
                obj.serviceConstruction.heThongNuocThoatHeThongHienHuu.images.forEach(x => {
                    (x.id) ?
                        objDataSiteReport.append
                            ('TemporaryBuildingServiceForConstruction.DrainageWaterSystemExistingSystem.ImageUrls', x.id) :
                        objDataSiteReport.append
                            ('TemporaryBuildingServiceForConstruction.DrainageWaterSystemExistingSystem.Images', x.image.file);
                });
            } else {
                objDataSiteReport.append('TemporaryBuildingServiceForConstruction.DrainageWaterSystemExistingSystem.Desc', '');
                objDataSiteReport.append('TemporaryBuildingServiceForConstruction.DrainageWaterSystemExistingSystem.ImageUrls', null);
                objDataSiteReport.append('TemporaryBuildingServiceForConstruction.DrainageWaterSystemExistingSystem.Images', null);
            }
            if (obj.serviceConstruction.heThongNuocThoatDiemDauNoi) {
                objDataSiteReport.append('TemporaryBuildingServiceForConstruction.DrainageWaterSystemExistingConnectionPoint.Desc',
                    obj.serviceConstruction.heThongNuocThoatDiemDauNoi.description);
                obj.serviceConstruction.heThongNuocThoatDiemDauNoi.images.forEach(x => {
                    (x.id) ?
                        objDataSiteReport.append
                            ('TemporaryBuildingServiceForConstruction.DrainageWaterSystemExistingConnectionPoint.ImageUrls', x.id) :
                        objDataSiteReport.append
                            ('TemporaryBuildingServiceForConstruction.DrainageWaterSystemExistingConnectionPoint.Images', x.image.file);
                });
            } else {
                objDataSiteReport.append('TemporaryBuildingServiceForConstruction.DrainageWaterSystemExistingConnectionPoint.Desc', '');
                objDataSiteReport.append('TemporaryBuildingServiceForConstruction.DrainageWaterSystemExistingConnectionPoint.ImageUrls',
                    null);
                objDataSiteReport.append('TemporaryBuildingServiceForConstruction.DrainageWaterSystemExistingConnectionPoint.Images',
                    null);
            }
            if (obj.serviceConstruction.heThongDienTramHaThe) {
                objDataSiteReport.append('TemporaryBuildingServiceForConstruction.TransformerStation.Desc',
                    obj.serviceConstruction.heThongDienTramHaThe.description);
                obj.serviceConstruction.heThongDienTramHaThe.images.forEach(x => {
                    (x.id) ?
                        objDataSiteReport.append('TemporaryBuildingServiceForConstruction.TransformerStation.ImageUrls', x.id) :
                        objDataSiteReport.append('TemporaryBuildingServiceForConstruction.TransformerStation.Images', x.image.file);
                });
            } else {
                objDataSiteReport.append('TemporaryBuildingServiceForConstruction.TransformerStation.Desc', '');
                objDataSiteReport.append('TemporaryBuildingServiceForConstruction.TransformerStation.ImageUrls', null);
                objDataSiteReport.append('TemporaryBuildingServiceForConstruction.TransformerStation.Images', null);
            }
            if (obj.serviceConstruction.heThongDienDuongDayTrungThe) {
                objDataSiteReport.append('TemporaryBuildingServiceForConstruction.ExistingMediumVoltageSystem.Desc',
                    obj.serviceConstruction.heThongDienDuongDayTrungThe.description);
                obj.serviceConstruction.heThongDienDuongDayTrungThe.images.forEach(x => {
                    (x.id) ?
                        objDataSiteReport.append('TemporaryBuildingServiceForConstruction.ExistingMediumVoltageSystem.ImageUrls', x.id) :
                        objDataSiteReport.append('TemporaryBuildingServiceForConstruction.ExistingMediumVoltageSystem.Images',
                            x.image.file);
                });
            } else {
                objDataSiteReport.append('TemporaryBuildingServiceForConstruction.ExistingMediumVoltageSystem.Desc', '');
                objDataSiteReport.append('TemporaryBuildingServiceForConstruction.ExistingMediumVoltageSystem.ImageUrls', null);
                objDataSiteReport.append('TemporaryBuildingServiceForConstruction.ExistingMediumVoltageSystem.Images', null);
            }
            if (obj.serviceConstruction.heThongDienThongTinKhac) {
                objDataSiteReport.append('TemporaryBuildingServiceForConstruction.Others.Desc',
                    obj.serviceConstruction.heThongDienThongTinKhac.description);
                obj.serviceConstruction.heThongDienThongTinKhac.images.forEach(x => {
                    (x.id) ?
                        objDataSiteReport.append('TemporaryBuildingServiceForConstruction.Others.ImageUrls', x.id) :
                        objDataSiteReport.append('TemporaryBuildingServiceForConstruction.Others.Images', x.image.file);
                });
            } else {
                objDataSiteReport.append('TemporaryBuildingServiceForConstruction.Others.Desc', '');
                objDataSiteReport.append('TemporaryBuildingServiceForConstruction.Others.ImageUrls', null);
                objDataSiteReport.append('TemporaryBuildingServiceForConstruction.Others.Images', null);
            }
        }
        if (obj.soilCondition) {
            if (obj.soilCondition.nenMongHienCo) {
                objDataSiteReport.append('ExistingSoilCondition.ExistingFooting.Desc',
                    obj.soilCondition.nenMongHienCo.description);
                obj.soilCondition.nenMongHienCo.images.forEach(x => {
                    (x.id) ?
                        objDataSiteReport.append('ExistingSoilCondition.ExistingFooting.ImageUrls', x.id) :
                        objDataSiteReport.append('ExistingSoilCondition.ExistingFooting.Images', x.image.file);
                });
            } else {
                objDataSiteReport.append('ExistingSoilCondition.ExistingFooting.Desc', '');
                objDataSiteReport.append('ExistingSoilCondition.ExistingFooting.ImageUrls', null);
                objDataSiteReport.append('ExistingSoilCondition.ExistingFooting.Images', null);
            }
            if (obj.soilCondition.thongTinCongTrinhGanDo) {
                objDataSiteReport.append('ExistingSoilCondition.SoilInvestigation.Desc',
                    obj.soilCondition.thongTinCongTrinhGanDo.description);
                obj.soilCondition.thongTinCongTrinhGanDo.images.forEach(x => {
                    (x.id) ?
                        objDataSiteReport.append('ExistingSoilCondition.SoilInvestigation.ImageUrls', x.id) :
                        objDataSiteReport.append('ExistingSoilCondition.SoilInvestigation.Images', x.image.file);
                });
            } else {
                objDataSiteReport.append('ExistingSoilCondition.SoilInvestigation.Desc', '');
                objDataSiteReport.append('ExistingSoilCondition.SoilInvestigation.ImageUrls', null);
                objDataSiteReport.append('ExistingSoilCondition.SoilInvestigation.Images', null);
            }
        }
        if (obj.usefulInfo) {
            obj.usefulInfo.forEach((subject, indexSubject) => {
                const titleSubject = `UsefulInFormations[${indexSubject}].Title`;
                objDataSiteReport.append(titleSubject, subject.title);
                for (let indexContent = 0, len = obj.usefulInfo[indexSubject].content.length; indexContent < len; indexContent++) {
                    const nameContent = `UsefulInFormations[${indexSubject}].Content[${indexContent}].Name`;
                    objDataSiteReport.append(nameContent, subject.content[indexContent].name);
                    const detailContent = `UsefulInFormations[${indexSubject}].Content[${indexContent}].Detail`;
                    objDataSiteReport.append(detailContent, subject.content[indexContent].detail);
                    if (subject.content[indexContent].images) {
                        // tslint:disable-next-line:max-line-length
                        for (let indexImage = 0, length = obj.usefulInfo[indexSubject].content[indexContent].images.length; indexImage < length; indexImage++) {
                            if (subject.content[indexContent].images[indexImage].id) {
                                const imageContentId = `UsefulInFormations[${indexSubject}].Content[${indexContent}].ImageUrls`;
                                objDataSiteReport.append(imageContentId, subject.content[indexContent].images[indexImage].id);
                            } else {
                                const imageContent = `UsefulInFormations[${indexSubject}].Content[${indexContent}].Images`;
                                objDataSiteReport.append(imageContent, subject.content[indexContent].images[indexImage].image.file);
                            }
                        }
                    }
                }
            });
        }
        if (obj) {
            objDataSiteReport.append('UpdatedDescription', obj.updateDescription);
        } else { objDataSiteReport.append('UpdatedDescription', ''); }
        return this.apiService.postFile(url, objDataSiteReport).map(res => res).share();
    }
    // Danh sách loại tài liệu cần kiểm tra bản chính thức
    getListBiddocumenttypes(): Observable<DictionaryItem[]> {
        const url = `biddocumenttypes`;
        return this.apiService
            .get(url)
            .map(response =>
                response.result.map(x => {
                    return {
                        id: x.key,
                        text: `${x.value}`
                    };
                })
            )
            .share();
    }
}
