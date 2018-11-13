import { Injectable } from '@angular/core';
import { SessionService } from './session.service';
import { ApiService } from './api.service';
import { Observable } from 'rxjs/Observable';
import { DictionaryItem, PagedResult } from '../models';
import { SiteSurveyReport } from '../models/site-survey-report/site-survey-report';
import { ScaleOverall, ConstructionItem } from '../models/site-survey-report/scale-overall.model';
import { AlertService } from './alert.service';
import { HistoryLiveForm } from '../models/ho-so-du-thau/history-liveform.model';
import { CustomerModel } from '../models/site-survey-report/customer-list';
import { PackageInfoModel } from '../models/package/package-info.model';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable()
export class SiteSurveyReportService {
  static dataPackage: PackageInfoModel;
  static signalLoading: Subject<boolean> = new Subject();
  static signalEdit = new BehaviorSubject<boolean>(false);
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

  constructor(
    private apiService: ApiService,
    private sessionService: SessionService
  ) { }
  get employeeId() {
    return this.sessionService.currentUser.employeeId;
  }
  // BEGIN: Check Refresh
  watchingSignalLoad() {
    return SiteSurveyReportService.signalLoading;
  }
  detectSignalLoad(signal) {
    SiteSurveyReportService.signalLoading.next(signal);
  }
  watchingSignalEdit() {
    return SiteSurveyReportService.signalEdit;
  }
  detectSignalEdit(signal) {
    SiteSurveyReportService.signalEdit.next(signal);
  }
  // END: Check Refresh

  // Save Package
  detectPackageData(data: PackageInfoModel) {
    SiteSurveyReportService.dataPackage = data;
  }
  // Get PackageData
  getPackageData(): PackageInfoModel {
    return SiteSurveyReportService.dataPackage;
  }
  // Get danh sách liên hệ
  getListCustomerContact(page: number, pageSize: number) {
    const url = `customercontact/${page}/${pageSize}`;
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
  // Get Danh sách Phòng ban nhánh 1
  getListDepartmentsFromBranches() {
    const url = `data/branches/1/departments`;
    return this.apiService.get(url)
      .map(response => {
        const result = response.result;
        return result.map(item => {
          return {
            id: item.id,
            departmentNo: item.departmentNo,
            departmentName: item.departmentName
          };
        });
      });
  }
  // Get Danh sách User
  getAllUser(searchTerm: string): Observable<CustomerModel[]> {
    const url = `user/search/?searchTerm=${searchTerm}`;
    return this.apiService.get(url)
      .map(response => response.result).share();
  }
  // Danh sách loại công trình
  getListConstructionType(): Observable<ConstructionItem[]> {
    const url = `bidconstructiontype/filter/0/1000`;
    return this.apiService.get(url).map(res => {
      const result = res.result.items.map(x => ({
        id: x.id,
        text: x.constructionTypeName,
        value: x.constructionTypeNameEng,
        checked: false
      }));
      return result;
    });
  }

  // Thông tin bảng báo cáo công trình
  tenderSiteSurveyingReport(bidOpportunityId: number): Observable<SiteSurveyReport> {
    const url = `bidopportunity/${bidOpportunityId}/tendersitesurveyingreport`;
    return this.apiService.get(url).map(res => {
      if (!res.result) {
        return null;
      } else {
        return this.toSiteSurveyReport(res.result, bidOpportunityId);
      }
    });
  }

  // Xóa ảnh báo cáo công trình
  deleteImageSiteSurveyingReport(guid) {
    const url = `bidopportunity/tendersitesurveyingreport/deleteimage`;
    return this.apiService.post(url, guid);
  }

  // Upload ảnh
  uploadImageSiteSurveyingReport(
    listImage: any,
    bidOpportunityId: number
  ) {
    const url = `bidopportunity/tendersitesurveyingreport/uploadimage`;
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

  // Tạo mới - cập nhật báo cáo công trình
  createOrUpdateSiteSurveyingReport(obj: SiteSurveyReport) {
    const url = `bidopportunity/tendersitesurveyingreport/createorupdate`;
    const infoReport = {
      bidOpportunityId: obj.bidOpportunityId,
      createdEmployeeId: (obj.nguoiTao) ? obj.nguoiTao.id : this.employeeId,
      updatedEmployeeId: this.employeeId,
      isDraftVersion: obj.isDraft,
      departmentId: (obj.phongBan) ? +obj.phongBan.id : 0,
      departmentNo: (obj.phongBan) ? obj.phongBan.key : '',
      surveyEmployeeId: (obj.nguoiKhaoSat && obj.nguoiKhaoSat.id ) ? obj.nguoiKhaoSat.id : null,
      documentName: (obj.scaleOverall) ? obj.scaleOverall.tenTaiLieu : '',
      projectStatistic: obj.scaleOverall && {
        projectStatistic: {
          constructionType: obj.scaleOverall.loaiCongTrinh && obj.scaleOverall.loaiCongTrinh.map(x => ({
            value: x.value,
            text: x.text,
            checked: x.checked
          })),
          constructionStatus: obj.scaleOverall.trangthaiCongTrinh && obj.scaleOverall.trangthaiCongTrinh.map(x => ({
            value: x.value,
            text: x.text,
            checked: x.checked
          })),
          projectScale: obj.scaleOverall.quyMoDuAn && {
            interviewTimes: (obj.scaleOverall.lanPhongVan) ? obj.scaleOverall.lanPhongVan : 0,
            siteArea: (obj.scaleOverall.quyMoDuAn.dienTichCongTruong) ? obj.scaleOverall.quyMoDuAn.dienTichCongTruong : 0,
            grossFloorArea: (obj.scaleOverall.quyMoDuAn.tongDienTichXayDung) ? obj.scaleOverall.quyMoDuAn.tongDienTichXayDung : 0,
            totalNumberOfFloor: (obj.scaleOverall.quyMoDuAn.soTang) ? obj.scaleOverall.quyMoDuAn.soTang : '',
            constructionPeriod: (obj.scaleOverall.quyMoDuAn.tienDo) ? obj.scaleOverall.quyMoDuAn.tienDo : 0
          }
        },
        perspectiveImageOfProject: obj.scaleOverall.hinhAnhPhoiCanh && {
          desc: obj.scaleOverall.hinhAnhPhoiCanh.description,
          imageUrls: obj.scaleOverall.hinhAnhPhoiCanh.images
        },
        existingStructure: obj.scaleOverall.thongTinVeKetCau && {
          desc: obj.scaleOverall.thongTinVeKetCau.description,
          imageUrls: obj.scaleOverall.thongTinVeKetCau.images
        },
        specialRequirement: obj.scaleOverall.nhungYeuCauDacBiet && {
          desc: obj.scaleOverall.nhungYeuCauDacBiet.description,
          imageUrls: obj.scaleOverall.nhungYeuCauDacBiet.images
        }
      },
      siteInformation: obj.describeOverall && {
        topography: obj.describeOverall.chiTietDiaHinh && {
          desc: obj.describeOverall.chiTietDiaHinh.description,
          imageUrls: obj.describeOverall.chiTietDiaHinh.images
        },
        existBuildingOnTheSite: obj.describeOverall.kienTrucHienHuu && {
          desc: obj.describeOverall.kienTrucHienHuu.description,
          imageUrls: obj.describeOverall.kienTrucHienHuu.images
        },
        existObstacleOnTheSite: obj.describeOverall.yeuCauChuongNgai && {
          desc: obj.describeOverall.yeuCauChuongNgai.description,
          imageUrls: obj.describeOverall.yeuCauChuongNgai.images
        }
      },
      transportationAndSiteEntranceCondition: obj.traffic && {
        disadvantage: obj.traffic.chiTietDiaHinhKhoKhan && {
          desc: obj.traffic.chiTietDiaHinhKhoKhan.description,
          imageUrls: obj.traffic.chiTietDiaHinhKhoKhan.images
        },
        advantage: obj.traffic.chiTietDiaHinhThuanLoi && {
          desc: obj.traffic.chiTietDiaHinhThuanLoi.description,
          imageUrls: obj.traffic.chiTietDiaHinhThuanLoi.images
        },
        directionOfSiteEntrance: obj.traffic.loiVaoCongTrinhHuongVao && {
          desc: obj.traffic.loiVaoCongTrinhHuongVao.description,
          imageUrls: obj.traffic.loiVaoCongTrinhHuongVao.images
        },
        existingRoadOnSite: obj.traffic.loiVaoCongTrinhDuongHienCo && {
          desc: obj.traffic.loiVaoCongTrinhDuongHienCo.description,
          imageUrls: obj.traffic.loiVaoCongTrinhDuongHienCo.images
        },
        temporatyRoadRequirement: obj.traffic.loiVaoCongTrinhYeuCauDuongTam && {
          desc: obj.traffic.loiVaoCongTrinhYeuCauDuongTam.description,
          imageUrls: obj.traffic.loiVaoCongTrinhYeuCauDuongTam.images
        },
        temporaryFenceRequirement: obj.traffic.loiVaoCongTrinhYeuCauHangRao && {
          desc: obj.traffic.loiVaoCongTrinhYeuCauHangRao.description,
          imageUrls: obj.traffic.loiVaoCongTrinhYeuCauHangRao.images
        }
      },
      demobilisationAndConsolidation: obj.demoConso && {
        demobilisationExistingStructureOrBuilding: obj.demoConso.phaVoKetCau && {
          desc: obj.demoConso.phaVoKetCau.description,
          imageUrls: obj.demoConso.phaVoKetCau.images
        },
        consolidationExistingStructureOrBuilding: obj.demoConso.giaCoKetCau && {
          desc: obj.demoConso.giaCoKetCau.description,
          imageUrls: obj.demoConso.giaCoKetCau.images
        },
        adjacentBuildingConditions: obj.demoConso.dieuKien && {
          desc: obj.demoConso.dieuKien.description,
          imageUrls: obj.demoConso.dieuKien.images
        }
      },
      temporaryBuildingServiceForConstruction: obj.serviceConstruction && {
        supplyWaterSystemExistingSystem: obj.serviceConstruction.heThongNuocHeThongHienHuu && {
          desc: obj.serviceConstruction.heThongNuocHeThongHienHuu.description,
          imageUrls: obj.serviceConstruction.heThongNuocHeThongHienHuu.images
        },
        supplyWaterSystemExistingConnectionPoint: obj.serviceConstruction.heThongNuocDiemDauNoi && {
          desc: obj.serviceConstruction.heThongNuocDiemDauNoi.description,
          imageUrls: obj.serviceConstruction.heThongNuocDiemDauNoi.images
        },
        drainageWaterSystemExistingSystem: obj.serviceConstruction.heThongNuocThoatHeThongHienHuu && {
          desc: obj.serviceConstruction.heThongNuocThoatHeThongHienHuu.description,
          imageUrls: obj.serviceConstruction.heThongNuocThoatHeThongHienHuu.images
        },
        drainageWaterSystemExistingConnectionPoint: obj.serviceConstruction.heThongNuocThoatDiemDauNoi && {
          desc: obj.serviceConstruction.heThongNuocThoatDiemDauNoi.description,
          imageUrls: obj.serviceConstruction.heThongNuocThoatDiemDauNoi.images
        },
        transformerStation: obj.serviceConstruction.heThongDienTramHaThe && {
          desc: obj.serviceConstruction.heThongDienTramHaThe.description,
          imageUrls: obj.serviceConstruction.heThongDienTramHaThe.images
        },
        existingMediumVoltageSystem: obj.serviceConstruction.heThongDienDuongDayTrungThe && {
          desc: obj.serviceConstruction.heThongDienDuongDayTrungThe.description,
          imageUrls: obj.serviceConstruction.heThongDienDuongDayTrungThe.images
        },
        others: obj.serviceConstruction.heThongDienThongTinKhac && {
          desc: obj.serviceConstruction.heThongDienThongTinKhac.description,
          imageUrls: obj.serviceConstruction.heThongDienThongTinKhac.images
        }
      },
      existingSoilCondition: obj.soilCondition && {
        existingFooting: obj.soilCondition.nenMongHienCo && {
          desc: obj.soilCondition.nenMongHienCo.description,
          imageUrls: obj.soilCondition.nenMongHienCo.images
        },
        soilInvestigation: obj.soilCondition.thongTinCongTrinhGanDo && {
          desc: obj.soilCondition.thongTinCongTrinhGanDo.description,
          imageUrls: obj.soilCondition.thongTinCongTrinhGanDo.images
        }
      },
      usefulInFormations: (obj.usefulInfo) ? obj.usefulInfo.map(subject => ({
        title: subject.title,
        content: subject.content.map(contentItem => ({
          name: contentItem.name,
          detail: contentItem.detail,
          imageUrls: contentItem.imageUrls
        }))
      })) : []
      ,
      updatedDescription: obj.updateDescription
    };
    return this.apiService
      .post(url, infoReport)
      .map(response => response);
  }


  // Mapping data - thông tin bảng báo cáo công trình
  toSiteSurveyReport(model: any, bidOpportunityId: number) {
    const dataFormated = new SiteSurveyReport();
    // case: CREATE
    if (!model) {
      dataFormated.bidOpportunityId = bidOpportunityId;
      dataFormated.nguoiTao = {
        id: this.employeeId,
        name: ''
      };
      dataFormated.isDraft = true;
      dataFormated.nguoiKhaoSat = model.surveyEmployee && {
        id: model.surveyEmployee.employeeId,
        text: model.surveyEmployee.employeeName
      };
      dataFormated.phongBan = model.department && {
        id: model.department.id,
        key: model.department.departmentNo,
        text: model.department.departmentName
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
      dataFormated.isCreate = false;
      dataFormated.bidOpportunityId = model.bidOpportunityId;
      dataFormated.id = model.id;
      dataFormated.nguoiTao = model.createdEmployee && {
        id: model.createdEmployee.employeeId,
        name: model.createdEmployee.employeeName
      };
      dataFormated.nguoiCapNhat = model.updatedEmployee && {
        id: model.updatedEmployee.employeeId,
        name: model.updatedEmployee.employeeName
      };
      dataFormated.isDraft = model.isDraftVersion;
      dataFormated.phongBan = model.department && {
        id: model.department.id,
        key: model.department.departmentNo,
        text: model.department.departmentName
      };
      dataFormated.ngayTao = model.createTime;
      dataFormated.lanCapNhat = null;
      dataFormated.ngayCapNhat = model.updateTime;
      dataFormated.noiDungCapNhat = '';
      dataFormated.nguoiKhaoSat = model.surveyEmployee && {
        id: model.surveyEmployee.employeeId,
        text: model.surveyEmployee.employeeName
      };
      dataFormated.tenTaiLieu = model.documentName;
      dataFormated.lanPhongVan = (model.projectStatistic.projectStatistic) ?
        model.projectStatistic.projectStatistic.projectScale.interviewTimes : null;
      dataFormated.scaleOverall = {
        tenTaiLieu: model.documentName,
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
          description: (model.projectStatistic.perspectiveImageOfProject.desc !== 'null') ?
            model.projectStatistic.perspectiveImageOfProject.desc : '',
          images: (model.projectStatistic.perspectiveImageOfProject.imageUrls || []).map(x => ({
            id: x.guid,
            thumbSizeUrl: x.thumbSizeUrl,
            largeSizeUrl: x.largeSizeUrl
          }))
        },
        thongTinVeKetCau: model.projectStatistic.existingStructure && {
          description: (model.projectStatistic.existingStructure.desc !== 'null') ?
            model.projectStatistic.existingStructure.desc : '',
          images: (model.projectStatistic.existingStructure.imageUrls || []).map(x => ({
            id: x.guid,
            thumbSizeUrl: x.thumbSizeUrl,
            largeSizeUrl: x.largeSizeUrl
          }))
        },
        nhungYeuCauDacBiet: model.projectStatistic.specialRequirement && {
          description: (model.projectStatistic.specialRequirement.desc !== 'null') ?
            model.projectStatistic.specialRequirement.desc : '',
          images: (model.projectStatistic.specialRequirement.imageUrls || []).map(x => ({
            id: x.guid,
            thumbSizeUrl: x.thumbSizeUrl,
            largeSizeUrl: x.largeSizeUrl
          }))
        }
      };
      dataFormated.describeOverall = model.siteInformation && {
        chiTietDiaHinh: model.siteInformation.topography && {
          description: (model.siteInformation.topography.desc !== 'null') ?
            model.siteInformation.topography.desc : '',
          images: (model.siteInformation.topography.imageUrls || []).map(x => ({
            id: x.guid,
            thumbSizeUrl: x.thumbSizeUrl,
            largeSizeUrl: x.largeSizeUrl
          }))
        },
        kienTrucHienHuu: model.siteInformation.existBuildingOnTheSite && {
          description: (model.siteInformation.existBuildingOnTheSite.desc !== 'null') ?
            model.siteInformation.existBuildingOnTheSite.desc : '',
          images: (model.siteInformation.existBuildingOnTheSite.imageUrls || []).map(x => ({
            id: x.guid,
            thumbSizeUrl: x.thumbSizeUrl,
            largeSizeUrl: x.largeSizeUrl
          }))
        },
        yeuCauChuongNgai: model.siteInformation.existObstacleOnTheSite && {
          description: (model.siteInformation.existObstacleOnTheSite.desc !== 'null') ?
            model.siteInformation.existObstacleOnTheSite.desc : '',
          images: (model.siteInformation.existObstacleOnTheSite.imageUrls || []).map(x => ({
            id: x.guid,
            thumbSizeUrl: x.thumbSizeUrl,
            largeSizeUrl: x.largeSizeUrl
          }))
        }
      };
      dataFormated.traffic = model.transportationAndSiteEntranceCondition && {
        chiTietDiaHinhKhoKhan: model.transportationAndSiteEntranceCondition.disadvantage && {
          description: (model.transportationAndSiteEntranceCondition.disadvantage.desc !== 'null') ?
            model.transportationAndSiteEntranceCondition.disadvantage.desc : '',
          images: (model.transportationAndSiteEntranceCondition.disadvantage.imageUrls || []).map(x => ({
            id: x.guid,
            thumbSizeUrl: x.thumbSizeUrl,
            largeSizeUrl: x.largeSizeUrl
          }))
        },
        chiTietDiaHinhThuanLoi: model.transportationAndSiteEntranceCondition.advantage && {
          description: (model.transportationAndSiteEntranceCondition.advantage.desc !== 'null') ?
            model.transportationAndSiteEntranceCondition.advantage.desc : '',
          images: (model.transportationAndSiteEntranceCondition.advantage.imageUrls || []).map(x => ({
            id: x.guid,
            thumbSizeUrl: x.thumbSizeUrl,
            largeSizeUrl: x.largeSizeUrl
          }))
        },
        loiVaoCongTrinhHuongVao: model.transportationAndSiteEntranceCondition.directionOfSiteEntrance && {
          description: (model.transportationAndSiteEntranceCondition.directionOfSiteEntrance.desc !== 'null') ?
            model.transportationAndSiteEntranceCondition.directionOfSiteEntrance.desc : '',
          images: (model.transportationAndSiteEntranceCondition.directionOfSiteEntrance.imageUrls || []).map(x => ({
            id: x.guid,
            thumbSizeUrl: x.thumbSizeUrl,
            largeSizeUrl: x.largeSizeUrl
          }))
        },
        loiVaoCongTrinhDuongHienCo: model.transportationAndSiteEntranceCondition.existingRoadOnSite && {
          description: (model.transportationAndSiteEntranceCondition.existingRoadOnSite.desc !== 'null') ?
            model.transportationAndSiteEntranceCondition.existingRoadOnSite.desc : '',
          images: (model.transportationAndSiteEntranceCondition.existingRoadOnSite.imageUrls || []).map(x => ({
            id: x.guid,
            thumbSizeUrl: x.thumbSizeUrl,
            largeSizeUrl: x.largeSizeUrl
          }))
        },
        loiVaoCongTrinhYeuCauDuongTam: model.transportationAndSiteEntranceCondition.temporatyRoadRequirement && {
          description: (model.transportationAndSiteEntranceCondition.temporatyRoadRequirement.desc !== 'null') ?
            model.transportationAndSiteEntranceCondition.temporatyRoadRequirement.desc : '',
          images: (model.transportationAndSiteEntranceCondition.temporatyRoadRequirement.imageUrls || []).map(x => ({
            id: x.guid,
            thumbSizeUrl: x.thumbSizeUrl,
            largeSizeUrl: x.largeSizeUrl
          }))
        },
        loiVaoCongTrinhYeuCauHangRao: model.transportationAndSiteEntranceCondition.temporaryFenceRequirement && {
          description: (model.transportationAndSiteEntranceCondition.temporaryFenceRequirement.desc !== 'null') ?
            model.transportationAndSiteEntranceCondition.temporaryFenceRequirement.desc : '',
          images: (model.transportationAndSiteEntranceCondition.temporaryFenceRequirement.imageUrls || []).map(x => ({
            id: x.guid,
            thumbSizeUrl: x.thumbSizeUrl,
            largeSizeUrl: x.largeSizeUrl
          }))
        },
      };
      dataFormated.demoConso = model.demobilisationAndConsolidation && {
        phaVoKetCau: model.demobilisationAndConsolidation.demobilisationExistingStructureOrBuilding && {
          description: (model.demobilisationAndConsolidation.demobilisationExistingStructureOrBuilding.desc !== 'null') ?
            model.demobilisationAndConsolidation.demobilisationExistingStructureOrBuilding.desc : '',
          images: (model.demobilisationAndConsolidation.demobilisationExistingStructureOrBuilding.imageUrls || []).map(x => ({
            id: x.guid,
            thumbSizeUrl: x.thumbSizeUrl,
            largeSizeUrl: x.largeSizeUrl
          }))
        },
        giaCoKetCau: model.demobilisationAndConsolidation.consolidationExistingStructureOrBuilding && {
          description: (model.demobilisationAndConsolidation.consolidationExistingStructureOrBuilding.desc !== 'null') ?
            model.demobilisationAndConsolidation.consolidationExistingStructureOrBuilding.desc : '',
          images: (model.demobilisationAndConsolidation.consolidationExistingStructureOrBuilding.imageUrls || []).map(x => ({
            id: x.guid,
            thumbSizeUrl: x.thumbSizeUrl,
            largeSizeUrl: x.largeSizeUrl
          }))
        },
        dieuKien: model.demobilisationAndConsolidation.adjacentBuildingConditions && {
          description: (model.demobilisationAndConsolidation.adjacentBuildingConditions.desc !== 'null') ?
            model.demobilisationAndConsolidation.adjacentBuildingConditions.desc : '',
          images: (model.demobilisationAndConsolidation.adjacentBuildingConditions.imageUrls || []).map(x => ({
            id: x.guid,
            thumbSizeUrl: x.thumbSizeUrl,
            largeSizeUrl: x.largeSizeUrl
          }))
        }
      };
      dataFormated.serviceConstruction = model.temporaryBuildingServiceForConstruction && {
        heThongNuocHeThongHienHuu: model.temporaryBuildingServiceForConstruction.supplyWaterSystemExistingSystem && {
          description: (model.temporaryBuildingServiceForConstruction.supplyWaterSystemExistingSystem.desc !== 'null') ?
            model.temporaryBuildingServiceForConstruction.supplyWaterSystemExistingSystem.desc : '',
          images: (model.temporaryBuildingServiceForConstruction.supplyWaterSystemExistingSystem.imageUrls || []).map(x => ({
            id: x.guid,
            thumbSizeUrl: x.thumbSizeUrl,
            largeSizeUrl: x.largeSizeUrl
          }))
        },
        heThongNuocDiemDauNoi: model.temporaryBuildingServiceForConstruction.supplyWaterSystemExistingConnectionPoint && {
          description: (model.temporaryBuildingServiceForConstruction.supplyWaterSystemExistingConnectionPoint.desc !== 'null') ?
            model.temporaryBuildingServiceForConstruction.supplyWaterSystemExistingConnectionPoint.desc : '',
          images: (model.temporaryBuildingServiceForConstruction.supplyWaterSystemExistingConnectionPoint.imageUrls || [])
            .map(x => ({
              id: x.guid,
              thumbSizeUrl: x.thumbSizeUrl,
              largeSizeUrl: x.largeSizeUrl
            }))
        },
        heThongNuocThoatHeThongHienHuu: model.temporaryBuildingServiceForConstruction.drainageWaterSystemExistingSystem && {
          description: (model.temporaryBuildingServiceForConstruction.drainageWaterSystemExistingSystem.desc !== 'null') ?
            model.temporaryBuildingServiceForConstruction.drainageWaterSystemExistingSystem.desc : '',
          images: (model.temporaryBuildingServiceForConstruction.drainageWaterSystemExistingSystem.imageUrls || [])
            .map(x => ({
              id: x.guid,
              thumbSizeUrl: x.thumbSizeUrl,
              largeSizeUrl: x.largeSizeUrl
            }))
        },
        heThongNuocThoatDiemDauNoi: model.temporaryBuildingServiceForConstruction.drainageWaterSystemExistingConnectionPoint && {
          description:
            (model.temporaryBuildingServiceForConstruction.drainageWaterSystemExistingConnectionPoint.desc !== 'null') ?
              model.temporaryBuildingServiceForConstruction.drainageWaterSystemExistingConnectionPoint.desc : '',
          images: (model.temporaryBuildingServiceForConstruction.drainageWaterSystemExistingConnectionPoint.imageUrls || [])
            .map(x => ({
              id: x.guid,
              thumbSizeUrl: x.thumbSizeUrl,
              largeSizeUrl: x.largeSizeUrl
            }))
        },
        heThongDienTramHaThe: model.temporaryBuildingServiceForConstruction.transformerStation && {
          description: (model.temporaryBuildingServiceForConstruction.transformerStation.desc !== 'null') ?
            model.temporaryBuildingServiceForConstruction.transformerStation.desc : '',
          images: (model.temporaryBuildingServiceForConstruction.transformerStation.imageUrls || []).map(x => ({
            id: x.guid,
            thumbSizeUrl: x.thumbSizeUrl,
            largeSizeUrl: x.largeSizeUrl
          }))
        },
        heThongDienDuongDayTrungThe: model.temporaryBuildingServiceForConstruction.existingMediumVoltageSystem && {
          description: (model.temporaryBuildingServiceForConstruction.existingMediumVoltageSystem.desc !== 'null') ?
            model.temporaryBuildingServiceForConstruction.existingMediumVoltageSystem.desc : '',
          images: (model.temporaryBuildingServiceForConstruction.existingMediumVoltageSystem.imageUrls || []).map(x => ({
            id: x.guid,
            thumbSizeUrl: x.thumbSizeUrl,
            largeSizeUrl: x.largeSizeUrl
          }))
        },
        heThongDienThongTinKhac: model.temporaryBuildingServiceForConstruction.others && {
          description: (model.temporaryBuildingServiceForConstruction.others.desc !== 'null') ?
            model.temporaryBuildingServiceForConstruction.others.desc : '',
          images: (model.temporaryBuildingServiceForConstruction.others.imageUrls || []).map(x => ({
            id: x.guid,
            thumbSizeUrl: x.thumbSizeUrl,
            largeSizeUrl: x.largeSizeUrl
          }))
        }
      };
      dataFormated.soilCondition = model.reportExistingSoilCondition && {
        nenMongHienCo: model.reportExistingSoilCondition.existingFooting && {
          description: (model.reportExistingSoilCondition.existingFooting.desc !== 'null') ?
            model.reportExistingSoilCondition.existingFooting.desc : '',
          images: (model.reportExistingSoilCondition.existingFooting.imageUrls || []).map(x => ({
            id: x.guid,
            thumbSizeUrl: x.thumbSizeUrl,
            largeSizeUrl: x.largeSizeUrl
          }))
        },
        thongTinCongTrinhGanDo: model.reportExistingSoilCondition.soilInvestigation && {
          description: (model.reportExistingSoilCondition.soilInvestigation.desc !== 'null') ?
            model.reportExistingSoilCondition.soilInvestigation.desc : '',
          images: (model.reportExistingSoilCondition.soilInvestigation.imageUrls || []).map(x => ({
            id: x.guid,
            thumbSizeUrl: x.thumbSizeUrl,
            largeSizeUrl: x.largeSizeUrl
          }))
        }
      };
      dataFormated.usefulInfo = (model.usefulInFormations || []).map(x => ({
        title: x.title,
        content: x.content.map(i => ({
          name: (i.name !== 'null') ? i.name : '',
          detail: (i.detail !== 'null') ? i.detail : '',
          imageUrls: i.imageUrls.map(e => ({
            id: e.guid,
            thumbSizeUrl: e.thumbSizeUrl,
            largeSizeUrl: e.largeSizeUrl
          }))
        }))
      }));
      dataFormated.updateDescription = '';
      return dataFormated;
    }
  }

  // Xóa báo cáo công trình
  deleteSiteSurveyingReport(bidOpportunityId: number) {
    const url = `bidopportunity/${bidOpportunityId}/tendersitesurveyingreport/delete`;
    return this.apiService.post(url, bidOpportunityId);
  }

  // Lịch sử thay đổi báo cáo công trình
  changedHistoryTenderSiteReport(
    bidOpportunityId: number,
    page: number | string,
    pageSize: number | string): Observable<PagedResult<HistoryLiveForm>> {
    const url = `bidopportunity/${bidOpportunityId}/tendersitesurveyingreport/changedhistory/${page}/${pageSize}`;
    return this.apiService.get(url).map(res => {
      const response = res.result;
      return {
        currentPage: response.pageIndex,
        pageSize: response.pageSize,
        pageCount: response.totalPages,
        total: response.totalCount,
        items: (response.items || []).map(SiteSurveyReportService.toHistoryLiveForm)
      };
    });
  }

  // createOrUpdateSiteSurveyingReport(obj: SiteSurveyReport) {
  //     const url = `bidopportunity/tendersitesurveyingreport/createorupdate`;
  //     const objDataSiteReport = new FormData();
  //     objDataSiteReport.append('BidOpportunityId', `${obj.bidOpportunityId}`);
  //     objDataSiteReport.append('CreatedEmployeeId', `${obj.nguoiTao.id}`);
  //     if (obj.nguoiCapNhat) {
  //         objDataSiteReport.append('UpdatedEmployeeId', `${obj.nguoiCapNhat.id}`);
  //     } else {
  //         objDataSiteReport.append('UpdatedEmployeeId', `${this.employeeId}`);
  //     }
  //     obj.scaleOverall.loaiCongTrinh.forEach((x, i) => {
  //         const paramAppendText = `ProjectStatistic.ProjectStatistic.ConstructionType[${i}].Text`;
  //         const paramAppendValue = `ProjectStatistic.ProjectStatistic.ConstructionType[${i}].Value`;
  //         const paramAppendChecked = `ProjectStatistic.ProjectStatistic.ConstructionType[${i}].Checked`;
  //         objDataSiteReport.append(paramAppendText, x.text);
  //         objDataSiteReport.append(paramAppendValue, x.value);
  //         objDataSiteReport.append(paramAppendChecked, `${x.checked}`);
  //     });
  //     obj.scaleOverall.trangthaiCongTrinh.forEach((x, i) => {
  //         const paramAppendText = `ProjectStatistic.ProjectStatistic.ConstructionStatus[${i}].Text`;
  //         const paramAppendValue = `ProjectStatistic.ProjectStatistic.ConstructionStatus[${i}].Value`;
  //         const paramAppendChecked = `ProjectStatistic.ProjectStatistic.ConstructionStatus[${i}].Checked`;
  //         objDataSiteReport.append(paramAppendText, x.text);
  //         objDataSiteReport.append(paramAppendValue, x.value);
  //         objDataSiteReport.append(paramAppendChecked, `${x.checked}`);
  //     });
  //     if (obj.scaleOverall) {
  //         objDataSiteReport.append('ProjectStatistic.ProjectStatistic.ProjectScale.DocumentName', obj.scaleOverall.tenTaiLieu);
  //     } else { objDataSiteReport.append('ProjectStatistic.ProjectStatistic.ProjectScale.DocumentName', ''); }
  //     if (obj.scaleOverall) {
  //         objDataSiteReport.append('ProjectStatistic.ProjectStatistic.ProjectScale.InterviewTimes',
  //             `${(obj.scaleOverall.lanPhongVan) ? obj.scaleOverall.lanPhongVan : 0}`);
  //     } else {
  //         objDataSiteReport.append('ProjectStatistic.ProjectStatistic.ProjectScale.InterviewTimes', `${0}`);
  //     }
  //     if (obj.scaleOverall.quyMoDuAn.dienTichCongTruong) {
  //         objDataSiteReport.append('ProjectStatistic.ProjectStatistic.ProjectScale.SiteArea',
  //             `${obj.scaleOverall.quyMoDuAn.dienTichCongTruong}`);
  //     } else {
  //         objDataSiteReport.append('ProjectStatistic.ProjectStatistic.ProjectScale.SiteArea', `${0}`);
  //     }
  //     if (obj.scaleOverall.quyMoDuAn.tongDienTichXayDung) {
  //         objDataSiteReport.append('ProjectStatistic.ProjectStatistic.ProjectScale.GrossFloorArea',
  //             `${obj.scaleOverall.quyMoDuAn.tongDienTichXayDung}`);
  //     } else {
  //         objDataSiteReport.append('ProjectStatistic.ProjectStatistic.ProjectScale.GrossFloorArea', `${0}`);
  //     }
  //     if (obj.scaleOverall.quyMoDuAn.tienDo) {
  //         objDataSiteReport.append('ProjectStatistic.ProjectStatistic.ProjectScale.ConstructionPeriod',
  //             `${obj.scaleOverall.quyMoDuAn.tienDo}`);
  //     } else {
  //         objDataSiteReport.append('ProjectStatistic.ProjectStatistic.ProjectScale.ConstructionPeriod', `${0}`);
  //     }
  //     if (obj.scaleOverall.quyMoDuAn.soTang) {
  //         objDataSiteReport.append('ProjectStatistic.ProjectStatistic.ProjectScale.TotalNumberOfFloor',
  //             obj.scaleOverall.quyMoDuAn.soTang);
  //     } else {
  //         objDataSiteReport.append('ProjectStatistic.ProjectStatistic.ProjectScale.TotalNumberOfFloor', '');
  //     }
  //     if (obj.scaleOverall.hinhAnhPhoiCanh) {
  //         objDataSiteReport.append('ProjectStatistic.PerspectiveImageOfProject.Desc', obj.scaleOverall.hinhAnhPhoiCanh.description);
  //         obj.scaleOverall.hinhAnhPhoiCanh.images.forEach((x, i) => {
  //             if (x.id) {
  //                 objDataSiteReport.append('ProjectStatistic.PerspectiveImageOfProject.ImageUrls', x.id);
  //             } else {
  //                 objDataSiteReport.append('ProjectStatistic.PerspectiveImageOfProject.Images', x.image.file);
  //             }
  //         });
  //     } else {
  //         objDataSiteReport.append('ProjectStatistic.PerspectiveImageOfProject.Desc', '');
  //         objDataSiteReport.append('ProjectStatistic.PerspectiveImageOfProject.ImageUrls', null);
  //         objDataSiteReport.append('ProjectStatistic.PerspectiveImageOfProject.Images', null);
  //     }
  //     if (obj.scaleOverall.thongTinVeKetCau) {
  //         objDataSiteReport.append('ProjectStatistic.ExistingStructure.Desc', obj.scaleOverall.thongTinVeKetCau.description);
  //         obj.scaleOverall.thongTinVeKetCau.images.forEach(x => {
  //             if (x.id) {
  //                 objDataSiteReport.append('ProjectStatistic.ExistingStructure.ImageUrls', x.id);
  //             } else { objDataSiteReport.append('ProjectStatistic.ExistingStructure.Images', x.image.file); }
  //         });
  //     } else {
  //         objDataSiteReport.append('ProjectStatistic.ExistingStructure.Desc', '');
  //         objDataSiteReport.append('ProjectStatistic.ExistingStructure.ImageUrls', null);
  //         objDataSiteReport.append('ProjectStatistic.ExistingStructure.Images', null);
  //     }
  //     if (obj.scaleOverall.nhungYeuCauDacBiet) {
  //         objDataSiteReport.append('ProjectStatistic.SpecialRequirement.Desc', obj.scaleOverall.nhungYeuCauDacBiet.description);
  //         obj.scaleOverall.nhungYeuCauDacBiet.images.forEach(x => {
  //             (x.id) ?
  //                 objDataSiteReport.append('ProjectStatistic.SpecialRequirement.ImageUrls', x.id) :
  //                 objDataSiteReport.append('ProjectStatistic.SpecialRequirement.Images', x.image.file);
  //         });
  //     } else {
  //         objDataSiteReport.append('ProjectStatistic.SpecialRequirement.Desc', '');
  //         objDataSiteReport.append('ProjectStatistic.SpecialRequirement.ImageUrls', null);
  //         objDataSiteReport.append('ProjectStatistic.SpecialRequirement.Images', null);
  //     }
  //     // Describe
  //     if (obj.describeOverall) {
  //         if (obj.describeOverall.chiTietDiaHinh) {
  //             objDataSiteReport.append('SiteInformation.Topography.Desc', obj.describeOverall.chiTietDiaHinh.description);
  //             obj.describeOverall.chiTietDiaHinh.images.forEach(x => {
  //                 (x.id) ?
  //                     objDataSiteReport.append('SiteInformation.Topography.ImageUrls', x.id) :
  //                     objDataSiteReport.append('SiteInformation.Topography.Images', x.image.file);
  //             });
  //         } else {
  //             objDataSiteReport.append('SiteInformation.Topography.Desc', '');
  //             objDataSiteReport.append('SiteInformation.Topography.ImageUrls', null);
  //             objDataSiteReport.append('SiteInformation.Topography.Images', null);
  //         }
  //     }
  //     if (obj.describeOverall) {
  //         if (obj.describeOverall.kienTrucHienHuu) {
  //             objDataSiteReport.append('SiteInformation.ExistBuildingOnTheSite.Desc', obj.describeOverall.kienTrucHienHuu.description);
  //             obj.describeOverall.kienTrucHienHuu.images.forEach(x => {
  //                 (x.id) ?
  //                     objDataSiteReport.append('SiteInformation.ExistBuildingOnTheSite.ImageUrls', x.id) :
  //                     objDataSiteReport.append('SiteInformation.ExistBuildingOnTheSite.Images', x.image.file);
  //             });
  //         } else {
  //             objDataSiteReport.append('SiteInformation.ExistBuildingOnTheSite.Desc', '');
  //             objDataSiteReport.append('SiteInformation.ExistBuildingOnTheSite.ImageUrls', null);
  //             objDataSiteReport.append('SiteInformation.ExistBuildingOnTheSite.Images', null);
  //         }
  //     }
  //     if (obj.describeOverall) {
  //         if (obj.describeOverall.yeuCauChuongNgai) {
  //             objDataSiteReport.append('SiteInformation.ExistObstacleOnTheSite.Desc', obj.describeOverall.yeuCauChuongNgai.description);
  //             obj.describeOverall.yeuCauChuongNgai.images.forEach(x => {
  //                 (x.id) ?
  //                     objDataSiteReport.append('SiteInformation.ExistObstacleOnTheSite.ImageUrls', x.id) :
  //                     objDataSiteReport.append('SiteInformation.ExistObstacleOnTheSite.Images', x.image.file);
  //             });
  //         } else {
  //             objDataSiteReport.append('SiteInformation.ExistObstacleOnTheSite.Desc', '');
  //             objDataSiteReport.append('SiteInformation.ExistObstacleOnTheSite.ImageUrls', null);
  //             objDataSiteReport.append('SiteInformation.ExistObstacleOnTheSite.Images', null);
  //         }
  //     }
  //     // Traffice
  //     if (obj.traffic) {
  //         if (obj.traffic.chiTietDiaHinhKhoKhan) {
  //             objDataSiteReport.append('TransportationAndSiteEntranceCondition.Disadvantage.Desc',
  //                 obj.traffic.chiTietDiaHinhKhoKhan.description);
  //             obj.traffic.chiTietDiaHinhKhoKhan.images.forEach(x => {
  //                 (x.id) ?
  //                     objDataSiteReport.append('TransportationAndSiteEntranceCondition.Disadvantage.ImageUrls', x.id) :
  //                     objDataSiteReport.append('TransportationAndSiteEntranceCondition.Disadvantage.Images', x.image.file);
  //             });
  //         } else {
  //             objDataSiteReport.append('TransportationAndSiteEntranceCondition.Disadvantage.Desc', '');
  //             objDataSiteReport.append('TransportationAndSiteEntranceCondition.Disadvantage.ImageUrls', null);
  //             objDataSiteReport.append('TransportationAndSiteEntranceCondition.Disadvantage.Images', null);
  //         }
  //     }
  //     if (obj.traffic) {
  //         if (obj.traffic.chiTietDiaHinhThuanLoi) {
  //             objDataSiteReport.append('TransportationAndSiteEntranceCondition.Advantage.Desc',
  //                 obj.traffic.chiTietDiaHinhThuanLoi.description);
  //             obj.traffic.chiTietDiaHinhThuanLoi.images.forEach(x => {
  //                 (x.id) ?
  //                     objDataSiteReport.append('TransportationAndSiteEntranceCondition.Advantage.ImageUrls', x.id) :
  //                     objDataSiteReport.append('TransportationAndSiteEntranceCondition.Advantage.Images', x.image.file);
  //             });
  //         } else {
  //             objDataSiteReport.append('TransportationAndSiteEntranceCondition.Advantage.Desc', '');
  //             objDataSiteReport.append('TransportationAndSiteEntranceCondition.Advantage.ImageUrls', null);
  //             objDataSiteReport.append('TransportationAndSiteEntranceCondition.Advantage.Images', null);
  //         }
  //         if (obj.traffic.loiVaoCongTrinhHuongVao) {
  //             objDataSiteReport.append('TransportationAndSiteEntranceCondition.DirectionOfSiteEntrance.Desc',
  //                 obj.traffic.loiVaoCongTrinhHuongVao.description);
  //             obj.traffic.loiVaoCongTrinhHuongVao.images.forEach(x => {
  //                 (x.id) ?
  //                     objDataSiteReport.append('TransportationAndSiteEntranceCondition.DirectionOfSiteEntrance.ImageUrls', x.id) :
  //                     objDataSiteReport.append('TransportationAndSiteEntranceCondition.DirectionOfSiteEntrance.Images', x.image.file);
  //             });
  //         } else {
  //             objDataSiteReport.append('TransportationAndSiteEntranceCondition.DirectionOfSiteEntrance.Desc', '');
  //             objDataSiteReport.append('TransportationAndSiteEntranceCondition.DirectionOfSiteEntrance.ImageUrls', null);
  //             objDataSiteReport.append('TransportationAndSiteEntranceCondition.DirectionOfSiteEntrance.Images', null);
  //         }
  //         if (obj.traffic.loiVaoCongTrinhDuongHienCo) {
  //             objDataSiteReport.append('TransportationAndSiteEntranceCondition.ExistingRoadOnSite.Desc',
  //                 obj.traffic.loiVaoCongTrinhDuongHienCo.description);
  //             obj.traffic.loiVaoCongTrinhDuongHienCo.images.forEach(x => {
  //                 (x.id) ?
  //                     objDataSiteReport.append('TransportationAndSiteEntranceCondition.ExistingRoadOnSite.ImageUrls', x.id) :
  //                     objDataSiteReport.append('TransportationAndSiteEntranceCondition.ExistingRoadOnSite.Images', x.image.file);
  //             });
  //         } else {
  //             objDataSiteReport.append('TransportationAndSiteEntranceCondition.ExistingRoadOnSite.Desc', '');
  //             objDataSiteReport.append('TransportationAndSiteEntranceCondition.ExistingRoadOnSite.ImageUrls', null);
  //             objDataSiteReport.append('TransportationAndSiteEntranceCondition.ExistingRoadOnSite.Images', null);
  //         }
  //         if (obj.traffic.loiVaoCongTrinhYeuCauDuongTam) {
  //             objDataSiteReport.append('TransportationAndSiteEntranceCondition.TemporatyRoadRequirement.Desc',
  //                 obj.traffic.loiVaoCongTrinhYeuCauDuongTam.description);
  //             obj.traffic.loiVaoCongTrinhYeuCauDuongTam.images.forEach(x => {
  //                 (x.id) ?
  //                     objDataSiteReport.append('TransportationAndSiteEntranceCondition.TemporatyRoadRequirement.ImageUrls', x.id) :
  //                     objDataSiteReport.append('TransportationAndSiteEntranceCondition.TemporatyRoadRequirement.Images', x.image.file);
  //             });
  //         } else {
  //             objDataSiteReport.append('TransportationAndSiteEntranceCondition.TemporatyRoadRequirement.Desc', '');
  //             objDataSiteReport.append('TransportationAndSiteEntranceCondition.TemporatyRoadRequirement.ImageUrls', null);
  //             objDataSiteReport.append('TransportationAndSiteEntranceCondition.TemporatyRoadRequirement.Images', null);
  //         }
  //         if (obj.traffic.loiVaoCongTrinhYeuCauHangRao) {
  //             objDataSiteReport.append('TransportationAndSiteEntranceCondition.TemporaryFenceRequirement.Desc',
  //                 obj.traffic.loiVaoCongTrinhYeuCauHangRao.description);
  //             obj.traffic.loiVaoCongTrinhYeuCauHangRao.images.forEach(x => {
  //                 (x.id) ?
  //                     objDataSiteReport.append('TransportationAndSiteEntranceCondition.TemporaryFenceRequirement.ImageUrls', x.id) :
  //                     objDataSiteReport.append('TransportationAndSiteEntranceCondition.TemporaryFenceRequirement.Images', x.image.file);
  //             });
  //         } else {
  //             objDataSiteReport.append('TransportationAndSiteEntranceCondition.TemporaryFenceRequirement.Desc', '');
  //             objDataSiteReport.append('TransportationAndSiteEntranceCondition.TemporaryFenceRequirement.ImageUrls', null);
  //             objDataSiteReport.append('TransportationAndSiteEntranceCondition.TemporaryFenceRequirement.Images', null);
  //         }
  //     }
  //     // Demo
  //     if (obj.demoConso) {
  //         if (obj.demoConso.phaVoKetCau) {
  //             objDataSiteReport.append('DemobilisationAndConsolidation.DemobilisationExistingStructureOrBuilding.Desc',
  //                 obj.demoConso.phaVoKetCau.description);
  //             obj.demoConso.phaVoKetCau.images.forEach(x => {
  //                 (x.id) ?
  //                     objDataSiteReport.append('DemobilisationAndConsolidation.DemobilisationExistingStructureOrBuilding.ImageUrls',
  //                         x.id) :
  //                     objDataSiteReport.append('DemobilisationAndConsolidation.DemobilisationExistingStructureOrBuilding.Images',
  //                         x.image);
  //             });
  //         } else {
  //             objDataSiteReport.append('DemobilisationAndConsolidation.DemobilisationExistingStructureOrBuilding.Desc', '');
  //             objDataSiteReport.append('DemobilisationAndConsolidation.DemobilisationExistingStructureOrBuilding.ImageUrls', null);
  //             objDataSiteReport.append('DemobilisationAndConsolidation.DemobilisationExistingStructureOrBuilding.Images', null);
  //         }
  //         if (obj.demoConso.giaCoKetCau) {
  //             objDataSiteReport.append('DemobilisationAndConsolidation.ConsolidationExistingStructureOrBuilding.Desc',
  //                 obj.demoConso.giaCoKetCau.description);
  //             obj.demoConso.giaCoKetCau.images.forEach(x => {
  //                 (x.id) ?
  //                     objDataSiteReport.append('DemobilisationAndConsolidation.ConsolidationExistingStructureOrBuilding.ImageUrls',
  //                         x.id) :
  //                     objDataSiteReport.append('DemobilisationAndConsolidation.ConsolidationExistingStructureOrBuilding.Images',
  //                         x.image.file);
  //             });
  //         } else {
  //             objDataSiteReport.append('DemobilisationAndConsolidation.ConsolidationExistingStructureOrBuilding.Desc', '');
  //             objDataSiteReport.append('DemobilisationAndConsolidation.ConsolidationExistingStructureOrBuilding.ImageUrls', null);
  //             objDataSiteReport.append('DemobilisationAndConsolidation.ConsolidationExistingStructureOrBuilding.Images', null);
  //         }
  //         if (obj.demoConso.dieuKien) {
  //             objDataSiteReport.append('DemobilisationAndConsolidation.AdjacentBuildingConditions.Desc',
  //                 obj.demoConso.dieuKien.description);
  //             obj.demoConso.dieuKien.images.forEach(x => {
  //                 (x.id) ?
  //                     objDataSiteReport.append('DemobilisationAndConsolidation.AdjacentBuildingConditions.ImageUrls', x.id) :
  //                     objDataSiteReport.append('DemobilisationAndConsolidation.AdjacentBuildingConditions.Images', x.image.file);
  //             });
  //         } else {
  //             objDataSiteReport.append('DemobilisationAndConsolidation.AdjacentBuildingConditions.Desc', '');
  //             objDataSiteReport.append('DemobilisationAndConsolidation.AdjacentBuildingConditions.ImageUrls', null);
  //             objDataSiteReport.append('DemobilisationAndConsolidation.AdjacentBuildingConditions.Images', null);
  //         }
  //     }
  //     // ServiceCOnstruction
  //     if (obj.serviceConstruction) {
  //         if (obj.serviceConstruction.heThongNuocHeThongHienHuu) {
  //             objDataSiteReport.append('TemporaryBuildingServiceForConstruction.SupplyWaterSystemExistingSystem.Desc',
  //                 obj.serviceConstruction.heThongNuocHeThongHienHuu.description);
  //             obj.serviceConstruction.heThongNuocHeThongHienHuu.images.forEach(x => {
  //                 (x.id) ?
  //                     objDataSiteReport.append('TemporaryBuildingServiceForConstruction.SupplyWaterSystemExistingSystem.ImageUrls',
  //                         x.id) :
  //                     objDataSiteReport.append('TemporaryBuildingServiceForConstruction.SupplyWaterSystemExistingSystem.Images',
  //                         x.image.file);
  //             });
  //         } else {
  //             objDataSiteReport.append('TemporaryBuildingServiceForConstruction.SupplyWaterSystemExistingSystem.Desc', '');
  //             objDataSiteReport.append('TemporaryBuildingServiceForConstruction.SupplyWaterSystemExistingSystem.ImageUrls', null);
  //             objDataSiteReport.append('TemporaryBuildingServiceForConstruction.SupplyWaterSystemExistingSystem.Images', null);
  //         }
  //         if (obj.serviceConstruction.heThongNuocDiemDauNoi) {
  //             objDataSiteReport.append('TemporaryBuildingServiceForConstruction.SupplyWaterSystemExistingConnectionPoint.Desc',
  //                 obj.serviceConstruction.heThongNuocDiemDauNoi.description);
  //             obj.serviceConstruction.heThongNuocDiemDauNoi.images.forEach(x => {
  //                 (x.id) ?
  //                     objDataSiteReport.append
  //                         ('TemporaryBuildingServiceForConstruction.SupplyWaterSystemExistingConnectionPoint.ImageUrls', x.id) :
  //                     objDataSiteReport.append('TemporaryBuildingServiceForConstruction.SupplyWaterSystemExistingConnectionPoint.Images',
  //                         x.image);
  //             });
  //         } else {
  //             objDataSiteReport.append('TemporaryBuildingServiceForConstruction.SupplyWaterSystemExistingConnectionPoint.Desc', '');
  //             objDataSiteReport.append('TemporaryBuildingServiceForConstruction.SupplyWaterSystemExistingConnectionPoint.ImageUrls',
  //                 null);
  //             objDataSiteReport.append('TemporaryBuildingServiceForConstruction.SupplyWaterSystemExistingConnectionPoint.Images',
  //                 null);
  //         }
  //         if (obj.serviceConstruction.heThongNuocThoatHeThongHienHuu) {
  //             objDataSiteReport.append('TemporaryBuildingServiceForConstruction.DrainageWaterSystemExistingSystem.Desc',
  //                 obj.serviceConstruction.heThongNuocThoatHeThongHienHuu.description);
  //             obj.serviceConstruction.heThongNuocThoatHeThongHienHuu.images.forEach(x => {
  //                 (x.id) ?
  //                     objDataSiteReport.append
  //                         ('TemporaryBuildingServiceForConstruction.DrainageWaterSystemExistingSystem.ImageUrls', x.id) :
  //                     objDataSiteReport.append
  //                         ('TemporaryBuildingServiceForConstruction.DrainageWaterSystemExistingSystem.Images', x.image.file);
  //             });
  //         } else {
  //             objDataSiteReport.append('TemporaryBuildingServiceForConstruction.DrainageWaterSystemExistingSystem.Desc', '');
  //             objDataSiteReport.append('TemporaryBuildingServiceForConstruction.DrainageWaterSystemExistingSystem.ImageUrls', null);
  //             objDataSiteReport.append('TemporaryBuildingServiceForConstruction.DrainageWaterSystemExistingSystem.Images', null);
  //         }
  //         if (obj.serviceConstruction.heThongNuocThoatDiemDauNoi) {
  //             objDataSiteReport.append('TemporaryBuildingServiceForConstruction.DrainageWaterSystemExistingConnectionPoint.Desc',
  //                 obj.serviceConstruction.heThongNuocThoatDiemDauNoi.description);
  //             obj.serviceConstruction.heThongNuocThoatDiemDauNoi.images.forEach(x => {
  //                 (x.id) ?
  //                     objDataSiteReport.append
  //                         ('TemporaryBuildingServiceForConstruction.DrainageWaterSystemExistingConnectionPoint.ImageUrls', x.id) :
  //                     objDataSiteReport.append
  //                         ('TemporaryBuildingServiceForConstruction.DrainageWaterSystemExistingConnectionPoint.Images', x.image.file);
  //             });
  //         } else {
  //             objDataSiteReport.append('TemporaryBuildingServiceForConstruction.DrainageWaterSystemExistingConnectionPoint.Desc', '');
  //             objDataSiteReport.append('TemporaryBuildingServiceForConstruction.DrainageWaterSystemExistingConnectionPoint.ImageUrls',
  //                 null);
  //             objDataSiteReport.append('TemporaryBuildingServiceForConstruction.DrainageWaterSystemExistingConnectionPoint.Images',
  //                 null);
  //         }
  //         if (obj.serviceConstruction.heThongDienTramHaThe) {
  //             objDataSiteReport.append('TemporaryBuildingServiceForConstruction.TransformerStation.Desc',
  //                 obj.serviceConstruction.heThongDienTramHaThe.description);
  //             obj.serviceConstruction.heThongDienTramHaThe.images.forEach(x => {
  //                 (x.id) ?
  //                     objDataSiteReport.append('TemporaryBuildingServiceForConstruction.TransformerStation.ImageUrls', x.id) :
  //                     objDataSiteReport.append('TemporaryBuildingServiceForConstruction.TransformerStation.Images', x.image.file);
  //             });
  //         } else {
  //             objDataSiteReport.append('TemporaryBuildingServiceForConstruction.TransformerStation.Desc', '');
  //             objDataSiteReport.append('TemporaryBuildingServiceForConstruction.TransformerStation.ImageUrls', null);
  //             objDataSiteReport.append('TemporaryBuildingServiceForConstruction.TransformerStation.Images', null);
  //         }
  //         if (obj.serviceConstruction.heThongDienDuongDayTrungThe) {
  //             objDataSiteReport.append('TemporaryBuildingServiceForConstruction.ExistingMediumVoltageSystem.Desc',
  //                 obj.serviceConstruction.heThongDienDuongDayTrungThe.description);
  //             obj.serviceConstruction.heThongDienDuongDayTrungThe.images.forEach(x => {
  //                 (x.id) ?
  //                     objDataSiteReport.append('TemporaryBuildingServiceForConstruction.ExistingMediumVoltageSystem.ImageUrls', x.id) :
  //                     objDataSiteReport.append('TemporaryBuildingServiceForConstruction.ExistingMediumVoltageSystem.Images',
  //                         x.image.file);
  //             });
  //         } else {
  //             objDataSiteReport.append('TemporaryBuildingServiceForConstruction.ExistingMediumVoltageSystem.Desc', '');
  //             objDataSiteReport.append('TemporaryBuildingServiceForConstruction.ExistingMediumVoltageSystem.ImageUrls', null);
  //             objDataSiteReport.append('TemporaryBuildingServiceForConstruction.ExistingMediumVoltageSystem.Images', null);
  //         }
  //         if (obj.serviceConstruction.heThongDienThongTinKhac) {
  //             objDataSiteReport.append('TemporaryBuildingServiceForConstruction.Others.Desc',
  //                 obj.serviceConstruction.heThongDienThongTinKhac.description);
  //             obj.serviceConstruction.heThongDienThongTinKhac.images.forEach(x => {
  //                 (x.id) ?
  //                     objDataSiteReport.append('TemporaryBuildingServiceForConstruction.Others.ImageUrls', x.id) :
  //                     objDataSiteReport.append('TemporaryBuildingServiceForConstruction.Others.Images', x.image.file);
  //             });
  //         } else {
  //             objDataSiteReport.append('TemporaryBuildingServiceForConstruction.Others.Desc', '');
  //             objDataSiteReport.append('TemporaryBuildingServiceForConstruction.Others.ImageUrls', null);
  //             objDataSiteReport.append('TemporaryBuildingServiceForConstruction.Others.Images', null);
  //         }
  //     }
  //     if (obj.soilCondition) {
  //         if (obj.soilCondition.nenMongHienCo) {
  //             objDataSiteReport.append('ExistingSoilCondition.ExistingFooting.Desc',
  //                 obj.soilCondition.nenMongHienCo.description);
  //             obj.soilCondition.nenMongHienCo.images.forEach(x => {
  //                 (x.id) ?
  //                     objDataSiteReport.append('ExistingSoilCondition.ExistingFooting.ImageUrls', x.id) :
  //                     objDataSiteReport.append('ExistingSoilCondition.ExistingFooting.Images', x.image.file);
  //             });
  //         } else {
  //             objDataSiteReport.append('ExistingSoilCondition.ExistingFooting.Desc', '');
  //             objDataSiteReport.append('ExistingSoilCondition.ExistingFooting.ImageUrls', null);
  //             objDataSiteReport.append('ExistingSoilCondition.ExistingFooting.Images', null);
  //         }
  //         if (obj.soilCondition.thongTinCongTrinhGanDo) {
  //             objDataSiteReport.append('ExistingSoilCondition.SoilInvestigation.Desc',
  //                 obj.soilCondition.thongTinCongTrinhGanDo.description);
  //             obj.soilCondition.thongTinCongTrinhGanDo.images.forEach(x => {
  //                 (x.id) ?
  //                     objDataSiteReport.append('ExistingSoilCondition.SoilInvestigation.ImageUrls', x.id) :
  //                     objDataSiteReport.append('ExistingSoilCondition.SoilInvestigation.Images', x.image.file);
  //             });
  //         } else {
  //             objDataSiteReport.append('ExistingSoilCondition.SoilInvestigation.Desc', '');
  //             objDataSiteReport.append('ExistingSoilCondition.SoilInvestigation.ImageUrls', null);
  //             objDataSiteReport.append('ExistingSoilCondition.SoilInvestigation.Images', null);
  //         }
  //     }
  //     if (obj.usefulInfo) {
  //         obj.usefulInfo.forEach((subject, indexSubject) => {
  //             const titleSubject = `UsefulInFormations[${indexSubject}].Title`;
  //             objDataSiteReport.append(titleSubject, subject.title);
  //             for (let indexContent = 0, len = obj.usefulInfo[indexSubject].content.length; indexContent < len; indexContent++) {
  //                 const nameContent = `UsefulInFormations[${indexSubject}].Content[${indexContent}].Name`;
  //                 objDataSiteReport.append(nameContent, subject.content[indexContent].name);
  //                 const detailContent = `UsefulInFormations[${indexSubject}].Content[${indexContent}].Detail`;
  //                 objDataSiteReport.append(detailContent, subject.content[indexContent].detail);
  //                 if (subject.content[indexContent].images) {
  //                     // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:max-line-length
  //                     for (let indexImage = 0, length = obj.usefulInfo[indexSubject].content[indexContent].images.length; indexImage < length; indexImage++) {
  //                         if (subject.content[indexContent].images[indexImage].id) {
  //                             const imageContentId = `UsefulInFormations[${indexSubject}].Content[${indexContent}].ImageUrls`;
  //                             objDataSiteReport.append(imageContentId, subject.content[indexContent].images[indexImage].id);
  //                         } else {
  //                             const imageContent = `UsefulInFormations[${indexSubject}].Content[${indexContent}].Images`;
  //                             objDataSiteReport.append(imageContent, subject.content[indexContent].images[indexImage].image.file);
  //                         }
  //                     }
  //                 }
  //             }
  //         });
  //     }
  //     if (obj) {
  //         objDataSiteReport.append('UpdatedDescription', obj.updateDescription);
  //     } else { objDataSiteReport.append('UpdatedDescription', ''); }
  //     return this.apiService.postFile(url, objDataSiteReport).map(res => res).share();
  // }

}
