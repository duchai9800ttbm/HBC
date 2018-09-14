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
        return Object.keys(groupedObj).map(documentType => (
            {
                documentType,
                items: groupedObj[documentType]
            }
        ));
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

    tenderSiteSurveyingReport(bidOpportunityId: number): Observable<SiteSurveyReport> {
        const url = `bidopportunity/${bidOpportunityId}/tendersitesurveyingreport`;
        return this.apiService.get(url).map(res => {
            let newModel = new SiteSurveyReport();
            if (res.result) {
                newModel = res.result;
            }
            return newModel;
        });
    }

    toSiteSurveyReport(model: any): SiteSurveyReport {
        return {
            id: model.id ? model.id : null,
            bidOpportunityId: model.bidOpportunityId,
            nguoiTao: model.createdEmployee.employeeName,
            ngayTao: model.createdEmployee.employeeNo,
            lanCapNhat: 1, // ?
            nguoiCapNhat: model.updatedEmployee.employeeName,
            ngayCapNhat: model.updatedEmployee.employeeNo,
            noiDungCapNhat: 'string', // ?
            tenTaiLieu: model.documentName,
            lanPhongVan: model.interviewTimes,
            scaleOverall: model.projectStatistic && {
                tenTaiLieu: model.documentName,
                lanPhongVan: model.interviewTimes,
                loaiCongTrinh: {
                    vanPhong: false,
                    khuDanCu: false,
                    trungTamThuongMai: false,
                    khachSan: false,
                    nhaCongNghiep: false,
                    toHop: false,
                    canHo: false,
                    haTang: false,
                    mep: false,
                    sanBay: false,
                    nhaphoBietThu: false,
                    truongHoc: false,
                    congtrinhMoi: false,
                    nangCapCaiTien: false,
                    thayDoiBoSung: false,
                    thaoDoCaiTien: false,
                    khac: '',
                },
                quyMoDuAn: model.projectStatistic.projectStatistic && {
                    dienTichCongTruong: model.projectStatistic.projectStatistic.siteArea,
                    tongDienTichXayDung: model.projectStatistic.projectStatistic.grossFloorArea,
                    soTang: model.projectStatistic.projectStatistic.totalNumberOfFloor,
                    tienDo: model.projectStatistic.projectStatistic.constructionPeriod

                },
                hinhAnhPhoiCanh: model.projectStatistic.perspectiveImageOfProject && {
                    description: model.projectStatistic.perspectiveImageOfProject.desc,
                    images: model.projectStatistic.perspectiveImageOfProject.imageUrls ?
                        model.projectStatistic.perspectiveImageOfProject.imageUrls.map(x => ({
                            id: x.guid,
                            image: x.largeSizeUrl
                        })) : []
                },
                thongTinVeKetCau: model.projectStatistic.existingStructure && {
                    description: model.projectStatistic.existingStructure.desc,
                    images: (model.projectStatistic.existingStructure.imageUrls || []).map(x => ({
                        id: x.guid,
                        image: x.largeSizeUrl
                    }))
                },
                nhungYeuCauDacBiet: model.projectStatistic.specialRequirement && {
                    description: model.projectStatistic.specialRequirement.desc,
                    images: (model.projectStatistic.specialRequirement.imageUrls || []).map(x => ({
                        id: x.guid,
                        image: x.largeSizeUrl
                    }))
                }
            },
            describeOverall: model.siteInformation && {
                chiTietDiaHinh: model.siteInformation.topography && {
                    description: model.siteInformation.topography.desc,
                    images: (model.siteInformation.topography.imageUrls || []).map(x => ({
                        id: x.guid,
                        image: x.largeSizeUrl
                    }))
                },
                kienTrucHienHuu: model.siteInformation.existBuildingOnTheSite && {
                    description: model.siteInformation.existBuildingOnTheSite.desc,
                    images: (model.siteInformation.existBuildingOnTheSite.imageUrls || []).map(x => ({
                        id: x.guid,
                        image: x.largeSizeUrl
                    }))
                },
                yeuCauChuongNgai: model.siteInformation.existObstacleOnTheSite && {
                    description: model.siteInformation.existObstacleOnTheSite.desc,
                    images: (model.siteInformation.existObstacleOnTheSite.imageUrls || []).map(x => ({
                        id: x.guid,
                        image: x.largeSizeUrl
                    }))
                }
            },
            traffic: model.transportationAndSiteEntranceCondition && {
                chiTietDiaHinh: model.transportationAndSiteEntranceCondition && {
                    khoKhan: model.transportationAndSiteEntranceCondition.disadvantage && {
                        description: model.transportationAndSiteEntranceCondition.disadvantage.desc,
                        images: (model.transportationAndSiteEntranceCondition.disadvantage.imageUrls || []).map(x => ({
                            id: x.guid,
                            image: x.largeSizeUrl
                        }))
                    },
                    thuanLoi: model.transportationAndSiteEntranceCondition.advantage && {
                        description: model.transportationAndSiteEntranceCondition.advantage.desc,
                        images: (model.transportationAndSiteEntranceCondition.advantage.imageUrls || []).map(x => ({
                            id: x.guid,
                            image: x.largeSizeUrl
                        }))
                    }
                },
                loiVaoCongTrinh: model.transportationAndSiteEntranceCondition && {
                    huongVao: model.transportationAndSiteEntranceCondition.directionOfSiteEntrance && {
                        description: model.transportationAndSiteEntranceCondition.directionOfSiteEntrance.desc,
                        images: (model.transportationAndSiteEntranceCondition.directionOfSiteEntrance.imageUrls || []).map(x => ({
                            id: x.guid,
                            image: x.largeSizeUrl
                        }))
                    },
                    duongHienCo: model.transportationAndSiteEntranceCondition.existingRoadOnSite && {
                        description: model.transportationAndSiteEntranceCondition.existingRoadOnSite.desc,
                        images: (model.transportationAndSiteEntranceCondition.existingRoadOnSite.imageUrls || []).map(x => ({
                            id: x.guid,
                            image: x.largeSizeUrl
                        }))
                    },
                    yeuCauDuongTam: model.transportationAndSiteEntranceCondition.temporatyRoadRequirement && {
                        description: model.transportationAndSiteEntranceCondition.temporatyRoadRequirement.desc,
                        images: (model.transportationAndSiteEntranceCondition.temporatyRoadRequirement.imageUrls || []).map(x => ({
                            id: x.guid,
                            image: x.largeSizeUrl
                        }))
                    },
                    yeuCauHangRao: model.transportationAndSiteEntranceCondition.temporaryFenceRequirement && {
                        description: model.transportationAndSiteEntranceCondition.temporaryFenceRequirement.desc,
                        images: (model.transportationAndSiteEntranceCondition.temporaryFenceRequirement.imageUrls || []).map(x => ({
                            id: x.guid,
                            image: x.largeSizeUrl
                        }))
                    }
                }
            },
            demoConso: model.demobilisationAndConsolidation && {
                phaVoKetCau: model.demobilisationAndConsolidation.demobilisationExistingStructureOrBuilding && {
                    description: model.demobilisationAndConsolidation.demobilisationExistingStructureOrBuilding.desc,
                    images: (model.demobilisationAndConsolidation.demobilisationExistingStructureOrBuilding.imageUrls || []).map(x => ({
                        id: x.guid,
                        image: x.largeSizeUrl
                    }))
                },
                giaCoKetCau: model.demobilisationAndConsolidation.consolidationExistingStructureOrBuilding && {
                    description: model.demobilisationAndConsolidation.consolidationExistingStructureOrBuilding.desc,
                    images: (model.demobilisationAndConsolidation.consolidationExistingStructureOrBuilding.imageUrls || []).map(x => ({
                        id: x.guid,
                        image: x.largeSizeUrl
                    }))
                },
                dieuKien: model.demobilisationAndConsolidation.adjacentBuildingConditions && {
                    description: model.demobilisationAndConsolidation.adjacentBuildingConditions.desc,
                    images: (model.demobilisationAndConsolidation.adjacentBuildingConditions.imageUrls || []).map(x => ({
                        id: x.guid,
                        image: x.largeSizeUrl
                    }))
                }
            },
            serviceConstruction: model.temporaryBuildingServiceForConstruction && {
                heThongNuoc: model.temporaryBuildingServiceForConstruction && {
                    heThongHienHuu: model.temporaryBuildingServiceForConstruction.supplyWaterSystemExistingSystem && {
                        description: model.temporaryBuildingServiceForConstruction.supplyWaterSystemExistingSystem.desc,
                        images: (model.temporaryBuildingServiceForConstruction.supplyWaterSystemExistingSystem.imageUrls || []).map(x => ({
                            id: x.guid,
                            image: x.largeSizeUrl
                        }))
                    },
                    diemDauNoi: model.temporaryBuildingServiceForConstruction.supplyWaterSystemExistingConnectionPoint && {
                        description: model.temporaryBuildingServiceForConstruction.supplyWaterSystemExistingConnectionPoint.desc,
                        images: (model.temporaryBuildingServiceForConstruction.supplyWaterSystemExistingConnectionPoint.imageUrls || [])
                            .map(x => ({
                                id: x.guid,
                                image: x.largeSizeUrl
                            }))
                    }
                },
                heThongNuocThoat: model.temporaryBuildingServiceForConstruction && {
                    heThongHienHuu: model.temporaryBuildingServiceForConstruction.drainageWaterSystemExistingSystem && {
                        description: model.temporaryBuildingServiceForConstruction.drainageWaterSystemExistingSystem.desc,
                        images: (model.temporaryBuildingServiceForConstruction.drainageWaterSystemExistingSystem.imageUrls || [])
                            .map(x => ({
                                id: x.guid,
                                image: x.largeSizeUrl
                            }))
                    },
                    diemDauNoi: model.temporaryBuildingServiceForConstruction.drainageWaterSystemExistingConnectionPoint && {
                        description: model.temporaryBuildingServiceForConstruction.drainageWaterSystemExistingConnectionPoint.desc,
                        images: (model.temporaryBuildingServiceForConstruction.drainageWaterSystemExistingConnectionPoint.imageUrls || [])
                            .map(x => ({
                                id: x.guid,
                                image: x.largeSizeUrl
                            }))
                    }
                },
                heThongDien: model.temporaryBuildingServiceForConstruction && {
                    tramHaThe: model.temporaryBuildingServiceForConstruction.transformerStation && {
                        description: model.temporaryBuildingServiceForConstruction.transformerStation.desc,
                        images: (model.temporaryBuildingServiceForConstruction.transformerStation.imageUrls || []).map(x => ({
                            id: x.guid,
                            image: x.largeSizeUrl
                        }))
                    },
                    duongDayTrungThe: model.temporaryBuildingServiceForConstruction.existingMediumVoltageSystem && {
                        description: model.temporaryBuildingServiceForConstruction.existingMediumVoltageSystem.desc,
                        images: (model.temporaryBuildingServiceForConstruction.existingMediumVoltageSystem.imageUrls || []).map(x => ({
                            id: x.guid,
                            image: x.largeSizeUrl
                        }))
                    },
                    thongTinKhac: model.temporaryBuildingServiceForConstruction.others && {
                        description: model.temporaryBuildingServiceForConstruction.others.desc,
                        images: (model.temporaryBuildingServiceForConstruction.others.imageUrls || []).map(x => ({
                            id: x.guid,
                            image: x.largeSizeUrl
                        }))
                    }
                }
            },
            soilCondition: model.reportExistingSoilCondition && {
                nenMongHienCo: model.reportExistingSoilCondition.existingFooting && {
                    description: model.reportExistingSoilCondition.existingFooting.desc,
                    images: (model.reportExistingSoilCondition.existingFooting.imageUrls || []).map(x => ({
                        id: guid,
                        image: x.largeSizeUrl
                    }))
                },
                thongTinCongTrinhGanDo: model.reportExistingSoilCondition.soilInvestigation && {
                    description: model.reportExistingSoilCondition.soilInvestigation.desc,
                    images: (model.reportExistingSoilCondition.soilInvestigation.imageUrls || []).map(x => ({
                        id: guid,
                        image: x.largeSizeUrl
                    }))
                }
            },
            usefulInfo: (model.usefulInFormations || []).map(x => ({
                title: x.title,
                content: x.content.map(i => ({
                    name: i.name,
                    detail: i.detail,
                    images: i.imageUrls.map(e => ({
                        id: e.guid,
                        image: e.largeSizeUrl
                    }))
                }))
            })),
            updateDescription: '' // TODO: Map
        };
    }

    createOrUpdateSiteSurveyingReport(obj: SiteSurveyReport) {
        const url = `bidopportunity/tendersitesurveyingreport/createorupdate`;
        const objDataSiteReport = new FormData();
        objDataSiteReport.append('BidOpportunityId', `${obj.bidOpportunityId}`);
        objDataSiteReport.append('CreatedEmployeeId', `${obj.nguoiTao}`);
        objDataSiteReport.append('UpdatedEmployeeId', `${obj.nguoiCapNhat}`);
        objDataSiteReport.append('DocumentName', obj.tenTaiLieu);
        objDataSiteReport.append('InterviewTimes', `${obj.lanCapNhat}`);
        objDataSiteReport.append('ProjectStatistic.ProjectStatistic.ProjectScale.SiteArea',
            `${obj.scaleOverall.quyMoDuAn.dienTichCongTruong}`);
        objDataSiteReport.append('ProjectStatistic.ProjectStatistic.ProjectScale.GrossFloorArea',
            `${obj.scaleOverall.quyMoDuAn.tongDienTichXayDung}`);
        objDataSiteReport.append('ProjectStatistic.ProjectStatistic.ProjectScale.TotalNumberOfFloor',
            obj.scaleOverall.quyMoDuAn.soTang);
        objDataSiteReport.append('ProjectStatistic.ProjectStatistic.ProjectScale.ConstructionPeriod',
            `${obj.scaleOverall.quyMoDuAn.tienDo}`);
        objDataSiteReport.append('ProjectStatistic.PerspectiveImageOfProject.Desc',
            obj.scaleOverall.hinhAnhPhoiCanh.description);
        obj.scaleOverall.hinhAnhPhoiCanh.images.forEach(x => {
            (x.id) ?
                objDataSiteReport.append('ProjectStatistic.PerspectiveImageOfProject.ImageUrls', x.id) :
                objDataSiteReport.append('ProjectStatistic.PerspectiveImageOfProject.Images', x.image);
        });
        objDataSiteReport.append('ProjectStatistic.ExistingStructure.Desc',
            obj.scaleOverall.thongTinVeKetCau.description);
        obj.scaleOverall.thongTinVeKetCau.images.forEach(x => {
            (x.id) ?
                objDataSiteReport.append('ProjectStatistic.ExistingStructure.ImageUrls', x.id) :
                objDataSiteReport.append('ProjectStatistic.ExistingStructure.Images', x.image);
        });
        objDataSiteReport.append('ProjectStatistic.SpecialRequirement.Desc',
            obj.scaleOverall.nhungYeuCauDacBiet.description);
        obj.scaleOverall.nhungYeuCauDacBiet.images.forEach(x => {
            (x.id) ?
                objDataSiteReport.append('ProjectStatistic.SpecialRequirement.ImageUrls', x.id) :
                objDataSiteReport.append('ProjectStatistic.SpecialRequirement.Images', x.image);
        });
        objDataSiteReport.append('SiteInformation.Topography.Desc', obj.describeOverall.chiTietDiaHinh.description);
        obj.describeOverall.chiTietDiaHinh.images.forEach(x => {
            (x.id) ?
                objDataSiteReport.append('SiteInformation.Topography.ImageUrls', x.id) :
                objDataSiteReport.append('SiteInformation.Topography.Images', x.image);
        });
        objDataSiteReport.append('SiteInformation.ExistBuildingOnTheSite.Desc', obj.describeOverall.kienTrucHienHuu.description);
        obj.describeOverall.kienTrucHienHuu.images.forEach(x => {
            (x.id) ?
                objDataSiteReport.append('SiteInformation.ExistBuildingOnTheSite.ImageUrls', x.id) :
                objDataSiteReport.append('SiteInformation.ExistBuildingOnTheSite.Images', x.image);
        });
        objDataSiteReport.append('SiteInformation.ExistObstacleOnTheSite.Desc', obj.describeOverall.yeuCauChuongNgai.description);
        obj.describeOverall.yeuCauChuongNgai.images.forEach(x => {
            (x.id) ?
                objDataSiteReport.append('SiteInformation.ExistObstacleOnTheSite.ImageUrls', x.id) :
                objDataSiteReport.append('SiteInformation.ExistObstacleOnTheSite.Images', x.image);
        });
        objDataSiteReport.append('TransportationAndSiteEntranceCondition.Disadvantage.Desc',
            obj.traffic.chiTietDiaHinh.khoKhan.description);
        obj.traffic.chiTietDiaHinh.khoKhan.images.forEach(x => {
            (x.id) ?
                objDataSiteReport.append('TransportationAndSiteEntranceCondition.Disadvantage.ImageUrls', x.id) :
                objDataSiteReport.append('TransportationAndSiteEntranceCondition.Disadvantage.Images', x.image);
        });
        objDataSiteReport.append('TransportationAndSiteEntranceCondition.Advantage.Desc', obj.traffic.chiTietDiaHinh.thuanLoi.description);
        obj.traffic.chiTietDiaHinh.thuanLoi.images.forEach(x => {
            (x.id) ?
                objDataSiteReport.append('TransportationAndSiteEntranceCondition.Advantage.ImageUrls', x.id) :
                objDataSiteReport.append('TransportationAndSiteEntranceCondition.Advantage.Images', x.image);
        });
        objDataSiteReport.append('TransportationAndSiteEntranceCondition.DirectionOfSiteEntrance.Desc',
            obj.traffic.loiVaoCongTrinh.huongVao.description);
        obj.traffic.loiVaoCongTrinh.huongVao.images.forEach(x => {
            (x.id) ?
                objDataSiteReport.append('TransportationAndSiteEntranceCondition.DirectionOfSiteEntrance.ImageUrls', x.id) :
                objDataSiteReport.append('TransportationAndSiteEntranceCondition.DirectionOfSiteEntrance.Images', x.image);
        });
        objDataSiteReport.append('TransportationAndSiteEntranceCondition.ExistingRoadOnSite.Desc',
            obj.traffic.loiVaoCongTrinh.duongHienCo.description);
        obj.traffic.loiVaoCongTrinh.duongHienCo.images.forEach(x => {
            (x.id) ?
                objDataSiteReport.append('TransportationAndSiteEntranceCondition.ExistingRoadOnSite.ImageUrls', x.id) :
                objDataSiteReport.append('TransportationAndSiteEntranceCondition.ExistingRoadOnSite.Images', x.image);
        });
        objDataSiteReport.append('TransportationAndSiteEntranceCondition.TemporatyRoadRequirement.Desc',
            obj.traffic.loiVaoCongTrinh.yeuCauDuongTam.description);
        obj.traffic.loiVaoCongTrinh.yeuCauDuongTam.images.forEach(x => {
            (x.id) ?
                objDataSiteReport.append('TransportationAndSiteEntranceCondition.TemporatyRoadRequirement.ImageUrls', x.id) :
                objDataSiteReport.append('TransportationAndSiteEntranceCondition.TemporatyRoadRequirement.Images', x.image);
        });
        objDataSiteReport.append('TransportationAndSiteEntranceCondition.TemporaryFenceRequirement.Desc',
            obj.traffic.loiVaoCongTrinh.yeuCauHangRao.description);
        obj.traffic.loiVaoCongTrinh.yeuCauHangRao.images.forEach(x => {
            (x.id) ?
                objDataSiteReport.append('TransportationAndSiteEntranceCondition.TemporaryFenceRequirement.ImageUrls', x.id) :
                objDataSiteReport.append('TransportationAndSiteEntranceCondition.TemporaryFenceRequirement.Images', x.image);
        });
        objDataSiteReport.append('DemobilisationAndConsolidation.DemobilisationExistingStructureOrBuilding.Desc',
            obj.demoConso.phaVoKetCau.description);
        obj.demoConso.phaVoKetCau.images.forEach(x => {
            (x.id) ?
                objDataSiteReport.append('DemobilisationAndConsolidation.DemobilisationExistingStructureOrBuilding.ImageUrls', x.id) :
                objDataSiteReport.append('DemobilisationAndConsolidation.DemobilisationExistingStructureOrBuilding.Images', x.image);
        });
        objDataSiteReport.append('DemobilisationAndConsolidation.ConsolidationExistingStructureOrBuilding.Desc',
            obj.demoConso.giaCoKetCau.description);
        obj.demoConso.giaCoKetCau.images.forEach(x => {
            (x.id) ?
                objDataSiteReport.append('DemobilisationAndConsolidation.ConsolidationExistingStructureOrBuilding.ImageUrls', x.id) :
                objDataSiteReport.append('DemobilisationAndConsolidation.ConsolidationExistingStructureOrBuilding.Images', x.image);
        });
        objDataSiteReport.append('DemobilisationAndConsolidation.AdjacentBuildingConditions.Desc',
            obj.demoConso.dieuKien.description);
        obj.demoConso.dieuKien.images.forEach(x => {
            (x.id) ?
                objDataSiteReport.append('DemobilisationAndConsolidation.AdjacentBuildingConditions.ImageUrls', x.id) :
                objDataSiteReport.append('DemobilisationAndConsolidation.AdjacentBuildingConditions.Images', x.image);
        });
        objDataSiteReport.append('TemporaryBuildingServiceForConstruction.SupplyWaterSystemExistingSystem.Desc',
            obj.serviceConstruction.heThongNuoc.heThongHienHuu.description);
        obj.serviceConstruction.heThongNuoc.heThongHienHuu.images.forEach(x => {
            (x.id) ?
                objDataSiteReport.append('TemporaryBuildingServiceForConstruction.SupplyWaterSystemExistingSystem.ImageUrls', x.id) :
                objDataSiteReport.append('TemporaryBuildingServiceForConstruction.SupplyWaterSystemExistingSystem.Images', x.image);
        });
        objDataSiteReport.append('TemporaryBuildingServiceForConstruction.SupplyWaterSystemExistingConnectionPoint.Desc',
            obj.serviceConstruction.heThongNuoc.diemDauNoi.description);
        obj.serviceConstruction.heThongNuoc.diemDauNoi.images.forEach(x => {
            (x.id) ?
                objDataSiteReport.append('TemporaryBuildingServiceForConstruction.SupplyWaterSystemExistingConnectionPoint.ImageUrls',
                    x.id) :
                objDataSiteReport.append('TemporaryBuildingServiceForConstruction.SupplyWaterSystemExistingConnectionPoint.Images',
                    x.image);
        });
        objDataSiteReport.append('TemporaryBuildingServiceForConstruction.DrainageWaterSystemExistingSystem.Desc',
            obj.serviceConstruction.heThongNuocThoat.heThongHienHuu.description);
        obj.serviceConstruction.heThongNuocThoat.heThongHienHuu.images.forEach(x => {
            (x.id) ?
                objDataSiteReport.append('TemporaryBuildingServiceForConstruction.DrainageWaterSystemExistingSystem.ImageUrls', x.id) :
                objDataSiteReport.append('TemporaryBuildingServiceForConstruction.DrainageWaterSystemExistingSystem.Images', x.image);
        });
        objDataSiteReport.append('TemporaryBuildingServiceForConstruction.DrainageWaterSystemExistingConnectionPoint.Desc',
            obj.serviceConstruction.heThongNuocThoat.diemDauNoi.description);
        obj.serviceConstruction.heThongNuocThoat.diemDauNoi.images.forEach(x => {
            (x.id) ?
                objDataSiteReport.append('TemporaryBuildingServiceForConstruction.DrainageWaterSystemExistingConnectionPoint.ImageUrls',
                    x.id) :
                objDataSiteReport.append('TemporaryBuildingServiceForConstruction.DrainageWaterSystemExistingConnectionPoint.Images',
                    x.image);
        });
        objDataSiteReport.append('TemporaryBuildingServiceForConstruction.TransformerStation.Desc',
            obj.serviceConstruction.heThongDien.tramHaThe.description);
        obj.serviceConstruction.heThongDien.tramHaThe.images.forEach(x => {
            (x.id) ?
                objDataSiteReport.append('TemporaryBuildingServiceForConstruction.TransformerStation.ImageUrls', x.id) :
                objDataSiteReport.append('TemporaryBuildingServiceForConstruction.TransformerStation.Images', x.image);
        });
        objDataSiteReport.append('TemporaryBuildingServiceForConstruction.ExistingMediumVoltageSystem.Desc',
            obj.serviceConstruction.heThongDien.duongDayTrungThe.description);
        obj.serviceConstruction.heThongDien.duongDayTrungThe.images.forEach(x => {
            (x.id) ?
                objDataSiteReport.append('TemporaryBuildingServiceForConstruction.ExistingMediumVoltageSystem.ImageUrls', x.id) :
                objDataSiteReport.append('TemporaryBuildingServiceForConstruction.ExistingMediumVoltageSystem.Images', x.image);
        });
        objDataSiteReport.append('TemporaryBuildingServiceForConstruction.Others.Desc',
            obj.serviceConstruction.heThongDien.thongTinKhac.description);
        obj.serviceConstruction.heThongDien.thongTinKhac.images.forEach(x => {
            (x.id) ?
                objDataSiteReport.append('TemporaryBuildingServiceForConstruction.Others.ImageUrls', x.id) :
                objDataSiteReport.append('TemporaryBuildingServiceForConstruction.Others.Images', x.image);
        });
        objDataSiteReport.append('ExistingSoilCondition.ExistingFooting.Desc',
            obj.soilCondition.nenMongHienCo.description);
        obj.soilCondition.nenMongHienCo.images.forEach(x => {
            (x.id) ?
                objDataSiteReport.append('ExistingSoilCondition.ExistingFooting.ImageUrls', x.id) :
                objDataSiteReport.append('ExistingSoilCondition.ExistingFooting.Images', x.image);
        });
        objDataSiteReport.append('ExistingSoilCondition.SoilInvestigation.Desc',
            obj.soilCondition.thongTinCongTrinhGanDo.description);
        obj.soilCondition.thongTinCongTrinhGanDo.images.forEach(x => {
            (x.id) ?
                objDataSiteReport.append('ExistingSoilCondition.SoilInvestigation.ImageUrls', x.id) :
                objDataSiteReport.append('ExistingSoilCondition.SoilInvestigation.Images', x.image);
        });
        objDataSiteReport.append('UsefulInFormations',
            null
        );
        objDataSiteReport.append('UpdatedDescription', obj.updateDescription);
        return this.apiService.postFile(url, objDataSiteReport).map(res => res).share();
    }
}
