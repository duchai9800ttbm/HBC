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
      surveyEmployeeId: (obj.nguoiKhaoSat && obj.nguoiKhaoSat.id) ? obj.nguoiKhaoSat.id : null,
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
            constructionPeriod: (obj.scaleOverall.quyMoDuAn.tienDo) ? obj.scaleOverall.quyMoDuAn.tienDo : ''
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
      updatedDesc: obj.updateDescription
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
          tienDo: null,
          donViTienDo: null
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
      dataFormated.soilCondition = model.existingSoilCondition && {
        nenMongHienCo: model.existingSoilCondition.existingFooting && {
          description: (model.existingSoilCondition.existingFooting.desc !== 'null') ?
            model.existingSoilCondition.existingFooting.desc : '',
          images: (model.existingSoilCondition.existingFooting.imageUrls || []).map(x => ({
            id: x.guid,
            thumbSizeUrl: x.thumbSizeUrl,
            largeSizeUrl: x.largeSizeUrl
          }))
        },
        thongTinCongTrinhGanDo: model.existingSoilCondition.soilInvestigation && {
          description: (model.existingSoilCondition.soilInvestigation.desc !== 'null') ?
            model.existingSoilCondition.soilInvestigation.desc : '',
          images: (model.existingSoilCondition.soilInvestigation.imageUrls || []).map(x => ({
            id: x.guid,
            thumbSizeUrl: x.thumbSizeUrl,
            largeSizeUrl: x.largeSizeUrl
          }))
        }
      };
      dataFormated.usefulInfo = (model.usefulInFormations || []).map(x => ({
        title: x.title,
        content: x.content && x.content.map(i => ({
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
    const url = `bidopportunity/${bidOpportunityId}/tendersitesurveyingreport/changedhistory/0/1000`;
    return this.apiService.get(url).map(res => {
      const response = res.result;
      return {
        // currentPage: response.pageIndex,
        // pageSize: response.pageSize,
        currentPage: page,
        pageSize: pageSize,
        pageCount: response.totalPages,
        total: response.totalCount,
        items: (response.items || []).map(SiteSurveyReportService.toHistoryLiveForm)
      };
    });
  }

}
