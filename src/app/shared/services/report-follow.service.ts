import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { SessionService } from './session.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { ReportKpiChair } from '../models/report-follow/report-kpi-chair.model';
import { StartAndEndDate } from '../models/report-follow/startAndEndDate.model';
import { ReportWinBid } from '../models/report-follow/report-kpi-win-bid.model';
import { ReportKpiArea } from '../models/report-follow/report-kpi-area.model';
import { ReportKpiConstructionCategory } from '../models/report-follow/report-kpi-construction-category.model';
import { StartAndEndConstructionCategory } from '../models/report-follow/startAndEndConstructionCategory.model';
import { StartAndEndConstructionType } from '../models/report-follow/startAndEndConstructionType.model';
import { ReportKpiConstructionType } from '../models/report-follow/report-kpi-construction-type.model';
import { ReportWinRateConstractors } from '../models/report-follow/report-win-rate-constractors.model';
import { ReportKpiWinRateQuarter } from '../models/report-follow/report-kpi-win-rate-quarter.model';
import { ReportFloorArea } from '../models/report-follow/report-floor-area.model';
import { ReportPotentialProjects } from '../models/report-follow/report-potential-projects.model';
import { ReportNumberWinBid } from '../models/report-follow/report-number-win-bid.model';
import * as FileSaver from 'file-saver';
@Injectable()
export class ReportFollowService {
  startAndEndDate = new BehaviorSubject<StartAndEndDate>({
    startDate: new Date(),
    endDate: new Date(),
    constructionCategory: null,
    constructionCategoryName: null,
    constructionType: null,
    constructionTypeName: null,
    isMessgeCanNote: true,
  });
  constructor(
    private apiService: ApiService,
    private sessionService: SessionService,
  ) { }
  // ====== Báo cáo theo dõi
  // mapping Thống kê chỉ tiêu KPI chủ trì theo khoảng thời gian
  mappingReportKpiChair(result: any): ReportKpiChair {
    return {
      kpiGroupChairs: result.kpiGroupChairs && result.kpiGroupChairs.map(itemKpiGroupChairs => {
        return {
          kpiGroup: itemKpiGroupChairs.kpiGroup && {
            id: itemKpiGroupChairs.kpiGroup.id,
            name: itemKpiGroupChairs.kpiGroup.name,
            desc: itemKpiGroupChairs.kpiGroup.desc,
            status: itemKpiGroupChairs.kpiGroup.status && {
              key: itemKpiGroupChairs.kpiGroup.status.key,
              value: itemKpiGroupChairs.kpiGroup.status.value,
              displayText: itemKpiGroupChairs.kpiGroup.status.displayText,
            },
          },
          chairDetail: itemKpiGroupChairs.chairDetail && itemKpiGroupChairs.chairDetail.map(itemChairDetail => {
            return {
              employee: itemChairDetail.employee && {
                id: itemChairDetail.employee.id,
                employeeId: itemChairDetail.employee.employeeId,
                employeeNo: itemChairDetail.employee.employeeNo,
                employeeName: itemChairDetail.employee.employeeName,
                employeeAddress: itemChairDetail.employee.employeeAddress,
                employeeDob: itemChairDetail.employee.employeeDob,
                employeeTel: itemChairDetail.employee.employeeTel,
                employeeTel1: itemChairDetail.employee.employeeTel1,
                departmentName: itemChairDetail.employee.departmentName,
                levelName: itemChairDetail.employee.levelName,
                employeeAvatar: itemChairDetail.employee.employeeAvatar && {
                  guid: itemChairDetail.employee.employeeAvatar.guid,
                  thumbSizeUrl: itemChairDetail.employee.employeeAvatar.thumbSizeUrl,
                  largeSizeUrl: itemChairDetail.employee.employeeAvatar.largeSizeUrl,
                },
                departmentRoomName: itemChairDetail.employee.departmentRoomName,
                branchName: itemChairDetail.employee.branchName,
                employeeBirthPlace: itemChairDetail.employee.employeeBirthPlace,
                employeeIDNumber: itemChairDetail.employee.employeeIDNumber,
                employeeGender: itemChairDetail.employee.employeeGender,
                employeeTaxNumber: itemChairDetail.employee.employeeTaxNumber,
                employeeBankAccount: itemChairDetail.employee.employeeBankAccount,
              },
              kpiTargetAmount: itemChairDetail.kpiTargetAmount,
              winningOfBidTotalAmount: itemChairDetail.winningOfBidTotalAmount,
              achievedPercent: itemChairDetail.achievedPercent,
            };
          }),
          kpiTargetAmount: itemKpiGroupChairs.kpiTargetAmount,
          winningOfBidValueAmount: itemKpiGroupChairs.winningOfBidValueAmount,
        };
      }),
      kpiTargetAmount: result.kpiTargetAmount,
      winningOfBidTotalAmount: result.winningOfBidTotalAmount,
      achievedPercent: result.achievedPercent,
      winningBidOfDayTargetAmount: result.winningBidOfDayTargetAmount,
      dayCount: result.dayCount,
      winningOfBidTargetAmount: result.winningOfBidTargetAmount,
      winningBidOfDayCompareTargetAmount: result.winningBidOfDayCompareTargetAmount,
    };
  }
  // Thống kê chỉ tiêu KPI chủ trì theo khoảng thời gian
  detailReportKpiChair(startDate: number, endDate: number): Observable<ReportKpiChair> {
    const url = `kpi/chairemployee/get?startDate=${startDate}&endDate=${endDate}`;
    return this.apiService.get(url).map(response => {
      const result = response.result;
      return this.mappingReportKpiChair(result);
    });
  }
  // mapping Thống kê chỉ tiêu trúng thầu trong khoảng thời gian
  mappingReportWinBid(result: any): ReportWinBid {
    return {
      winningOfBidTargetPercent: result.winningOfBidTargetPercent,
      totalTargetAmount: result.totalTargetAmount,
      winningOfBidPercent: result.winningOfBidPercent,
      totalAmount: result.totalAmount,
      targetNote: result.targetNote,
      note: result.note,
    };
  }
  // Thống kê chỉ tiêu trúng thầu trong khoảng thời gian
  detailReportWinBid(startDate: number, endDate: number): Observable<ReportWinBid> {
    const url = `kpiwinningofbid/get?startDate=${startDate}&endDate=${endDate}`;
    return this.apiService.get(url).map(response => {
      const result = response.result;
      return this.mappingReportWinBid(result);
    });
  }
  // mapping Thống kê chỉ tiêu KPI khu vực theo khoảng thời gian
  mappingReportKpiArea(result: any): ReportKpiArea {
    return {
      kpiLocationDetails: result.kpiLocationDetails && result.kpiLocationDetails.map(itemKpiLocationDetails => {
        return {
          location: itemKpiLocationDetails.location && {
            id: itemKpiLocationDetails.location.id,
            locationName: itemKpiLocationDetails.location.locationName,
            locationNo: itemKpiLocationDetails.location.locationNo,
            locationDesc: itemKpiLocationDetails.location.locationDesc,
          },
          kpiTarget: itemKpiLocationDetails.kpiTarget,
          winningOfBidAmount: itemKpiLocationDetails.winningOfBidAmount,
          achievedPercent: itemKpiLocationDetails.achievedPercent,
        };
      }),
      kpiTargetTotalAmount: result.kpiTargetTotalAmount,
      winningOfBidTotalAmount: result.winningOfBidTotalAmount,
      achievedPercent: result.achievedPercent,
    };
  }
  // Thống kê chỉ tiêu KPI khu vực theo khoảng thời gian
  detailReportKpiAre(startDate: number, endDate: number): Observable<ReportKpiArea> {
    const url = `kpilocation/get?startDate=${startDate}&endDate=${endDate}`;
    return this.apiService.get(url).map(response => {
      const result = response.result;
      return this.mappingReportKpiArea(result);
    });
  }
  // mapping Thống kê chỉ tiêu KPI hạng mục thi công theo khoảng thời gian
  mappingReportKpiConstructionCategory(result: any): ReportKpiConstructionCategory {
    return {
      winningOfBidTargetPer: result.winningOfBidTargetPer,
      targetAmount: result.targetAmount,
      winningOfBidPer: result.winningOfBidPer,
      amount: result.amount,
      targetNote: result.targetNote,
      note: result.note,
    };
  }
  // Thống kê chỉ tiêu KPI hạng mục thi công theo khoảng thời gian
  // tslint:disable-next-line:max-line-length
  detailReportKpiConstructionCategory(constructionCategoryId: number, startDate: number, endDate: number): Observable<ReportKpiConstructionCategory> {
    const url = `kpiconstructioncategory/${constructionCategoryId}/get?startDate=${startDate}&endDate=${endDate}`;
    return this.apiService.get(url).map(response => {
      const result = response.result;
      return this.mappingReportKpiConstructionCategory(result);
    });
  }
  // mapping Thống kê chỉ tiêu KPI loại công trình theo khoảng thời gian
  mappingReportKpiConstructionType(result: any): ReportKpiConstructionType {
    return {
      winningOfBidTargetPer: result.winningOfBidTargetPer,
      targetAmount: result.targetAmount,
      winningOfBidPer: result.winningOfBidPer,
      amount: result.amount,
    };
  }
  // Thống kê chỉ tiêu KPI loại công trình theo khoảng thời gian
  detailReportKpiConstructionType(constructionTypeId: number, startDate: number, endDate: number): Observable<ReportKpiConstructionType> {
    const url = `kpiconstructiontype/${constructionTypeId}/get?startDate=${startDate}&endDate=${endDate}`;
    return this.apiService.get(url).map(response => {
      const result = response.result;
      return this.mappingReportKpiConstructionType(result);
    });
  }
  // mapping Thống kê chỉ tiêu KPI trúng thầu theo vai trò nhà thầu theo khoảng thời gian
  mappingReportWinRateContractors(result: any): ReportWinRateConstractors {
    return {
      reportKPIBidderRoleDetails: result.reportKPIBidderRoleDetails
        && result.reportKPIBidderRoleDetails.map(itemReportKPIBidderRoleDetail => {
          return {
            bidderRole: itemReportKPIBidderRoleDetail.bidderRole && {
              key: itemReportKPIBidderRoleDetail.bidderRole.key,
              value: itemReportKPIBidderRoleDetail.bidderRole.value,
              displayText: itemReportKPIBidderRoleDetail.bidderRole.displayText
            },
            winningOfBidPer: itemReportKPIBidderRoleDetail.winningOfBidPer,
            amount: itemReportKPIBidderRoleDetail.amount,
          };
        }),
      winningOfBidPer: result.winningOfBidPer,
      totalAmount: result.totalAmount
    };
  }
  // Thống kê chỉ tiêu KPI trúng thầu theo vai trò nhà thầu theo khoảng thời gian
  detailReportWinRateContractors(startDate: number, endDate: number): Observable<ReportWinRateConstractors> {
    const url = `kpibidderrole/get?startDate=${startDate}&endDate=${endDate}`;
    return this.apiService.get(url).map(response => {
      const result = response.result;
      return this.mappingReportWinRateContractors(result);
    });
  }
  // mapping Thống kê chỉ tiêu KPI trúng thầu theo quý trong năm theo khoảng thời gian
  mappingReportWinRateQuarter(result: any): ReportKpiWinRateQuarter {
    return {
      reportKPIQuaterOfYearDetails: result.reportKPIQuaterOfYearDetails
        && result.reportKPIQuaterOfYearDetails.map(itemReportKPIQuaterOfYearDetails => {
          return {
            quaterOfYear: itemReportKPIQuaterOfYearDetails.quaterOfYear && {
              key: itemReportKPIQuaterOfYearDetails.quaterOfYear.key,
              value: itemReportKPIQuaterOfYearDetails.quaterOfYear.value,
              displayText: itemReportKPIQuaterOfYearDetails.quaterOfYear.displayText,
            },
            winningOfBidPer: itemReportKPIQuaterOfYearDetails.winningOfBidPer,
            amount: itemReportKPIQuaterOfYearDetails.amount,
            note: itemReportKPIQuaterOfYearDetails.note,
          };
        }),
      winningOfBidPer: result.winningOfBidPer,
      totalAmount: result.totalAmount,
    };
  }
  // Thống kê chỉ tiêu KPI trúng thầu theo quý trong năm theo khoảng thời gian
  detailReportWinRateQuarter(startDate: number, endDate: number): Observable<ReportKpiWinRateQuarter> {
    const url = `kpiquaterofyear/get?startDate=${startDate}&endDate=${endDate}`;
    return this.apiService.get(url).map(response => {
      const result = response.result;
      return this.mappingReportWinRateQuarter(result);
    });
  }
  // mapping Thống kê diện tích sàn xây dựng đã tham gia và trúng thầu theo khoảng thời gian
  mappingReportFloorArea(result: any): ReportFloorArea {
    return {
      tenderBuildingFloorArea: result.tenderBuildingFloorArea,
      tenderBuildingFloorAmount: result.tenderBuildingFloorAmount,
      tenderNote: result.tenderNote,
      waitForResultBuildingFloorArea: result.waitForResultBuildingFloorArea,
      waitForResultBuildingFloorAmount: result.waitForResultBuildingFloorAmount,
      waitForResultNote: result.waitForResultNote,
      winningOfBidBuildingFloorArea: result.winningOfBidBuildingFloorArea,
      winningOfBidBuildingFloorAmount: result.winningOfBidBuildingFloorAmount,
      winningOfBidNote: result.winningOfBidNote,
      winningOfBidCompareTenderPer: result.winningOfBidCompareTenderPer,
      winningOfBidCompareTotalBidPer: result.winningOfBidCompareTotalBidPer,
      perNote: result.perNote
    };
  }
  // Thống kê diện tích sàn xây dựng đã tham gia và trúng thầu theo khoảng thời gian
  detailReportFloorArea(startDate: number, endDate: number): Observable<ReportFloorArea> {
    const url = `report/buildingfloorarea?startDate=${startDate}&endDate=${endDate}`;
    return this.apiService.get(url).map(response => {
      const result = response.result;
      return this.mappingReportFloorArea(result);
    });
  }
  // mapping Danh sách dự án tiềm năng
  mappingPotentialProjects(result: any): ReportPotentialProjects {
    return {
      id: result.id,
      opportunityName: result.opportunityName,
      projectName: result.projectName,
      chairEmployee: result.chairEmployee && {
        id: result.chairEmployee.id,
        employeeId: result.chairEmployee.employeeId,
        employeeNo: result.chairEmployee.employeeNo,
        employeeName: result.chairEmployee.employeeName,
        employeeAddress: result.chairEmployee.employeeAddress,
        employeeDob: result.chairEmployee.employeeDob,
        employeeTel: result.chairEmployee.employeeTel,
        employeeTel1: result.chairEmployee.employeeTel1,
        departmentName: result.chairEmployee.departmentName,
        levelName: result.chairEmployee.levelName,
        employeeAvatar: result.chairEmployee.employeeAvatar && {
          guid: result.chairEmployee.employeeAvatar.guid,
          thumbSizeUrl: result.chairEmployee.employeeAvatar.thumbSizeUrl,
          largeSizeUrl: result.chairEmployee.employeeAvatar.largeSizeUrl,
        },
        departmentRoomName: result.chairEmployee.departmentRoomName,
        branchName: result.chairEmployee.branchName,
        employeeBirthPlace: result.chairEmployee.employeeBirthPlace,
        employeeIDNumber: result.chairEmployee.employeeIDNumber,
        employeeGender: result.chairEmployee.employeeGender,
        employeeTaxNumber: result.chairEmployee.employeeTaxNumber,
        employeeBankAccount: result.chairEmployee.employeeBankAccount,
      },
      totalCostOfSubmission: result.totalCostOfSubmission,
    };
  }
  // Danh sách dự án tiềm năng
  listPotentialProjects(startDate: number, endDate: number): Observable<ReportPotentialProjects[]> {
    const url = `report/potentialbidopportunity?startDate=${startDate}&endDate=${endDate}`;
    return this.apiService.get(url).map(response => {
      const result = response.result;
      return (result || []).map(item => {
        return this.mappingPotentialProjects(item);
      });
    });
  }
  // mapping Thống kê số lượng trúng thầu
  mappingNumberWinningOfBid(result: any): ReportNumberWinBid {
    return {
      tenderCount: result.tenderCount,
      tenderAmount: result.tenderAmount,
      tenderNote: result.tenderNote,
      waitForResultCount: result.waitForResultCount,
      waitForResultAmount: result.waitForResultAmount,
      waitForResultNote: result.waitForResultNote,
      winningOfBidCount: result.winningOfBidCount,
      winningOfBidAmount: result.winningOfBidAmount,
      winningOfBidNote: result.winningOfBidNote,
      winningOfBidCompareTenderPer: result.winningOfBidCompareTenderPer,
      winningOfBidCompareTotalBidPer: result.winningOfBidCompareTotalBidPer,
      perNote: result.perNote
    };
  }
  // Thống kê số lượng trúng thầu
  listNumberWinningOfBid(startDate: number, endDate: number): Observable<ReportNumberWinBid> {
    const url = `report/winningofbid?startDate=${startDate}&endDate=${endDate}`;
    return this.apiService.get(url).map(response => {
      const result = response.result;
      return this.mappingNumberWinningOfBid(result);
    });
  }
  ////// =============
  // Xuất báo cáo ra excel
  exportReportToExcel(
    startDate: number,
    endDate: number,
    constructionCategoryId: number,
    constructionTypeId: number,
  ) {
    // tslint:disable-next-line:max-line-length
    const filterUrl = `report/export?startDate=${startDate}&endDate=${endDate}&constructionCategoryId=${constructionCategoryId ? constructionCategoryId : ''}&constructionTypeId=${constructionTypeId ? constructionTypeId : ''}`;
    return this.apiService.getFileHBC(filterUrl).map(response => {
      return FileSaver.saveAs(
        new Blob([response.file], {
          type: `${response.file.type}`,
        }), response.fileName
      );
    });
  }
  // ==================
  // Ghi chú cho báo cáo
  // Cập nhật ghi chú báo cáo chỉ tiêu trúng thầu theo năm
  updateNoteReportWinBid(year: number, targetNote: string, note: string) {
    const url = `kpiwinningofbid/note/update`;
    const requestModel = {
      year: year,
      targetNote: targetNote,
      note: note,
    };
    return this.apiService.post(url, requestModel);
  }
  // Cập nhật ghi chú báo cáo chỉ tiêu KPI theo từng hạng mục thi công theo năm
  updateNoteReportConstructionCategory(constructionCategoryId: number, year: number, targetNote: string, note: string) {
    const url = `kpiconstructioncategory/note/update`;
    const requestModel = {
      constructionCategoryId: constructionCategoryId,
      year: year,
      targetNote: targetNote,
      note: note,
    };
    return this.apiService.post(url, requestModel);
  }
  // Cập nhật ghi chú báo cáo tỉ lệ trúng thầu theo vai trò nhà thầu theo năm
  updateNoteReportRateContractor(year: number, reportWinRateConstractors: ReportWinRateConstractors) {
    const url = `kpibidderrole/note/update`;
    const details = reportWinRateConstractors.reportKPIBidderRoleDetails.map(item => {
      return {
        quaterOfYear: item.bidderRole && item.bidderRole.key,
        note: item.note,
      };
    });
    const requestModel = {
      year: year,
      details: details,
    };
    console.log('hi.reportWinRateConstractors', requestModel);
    return this.apiService.post(url, requestModel);
  }
  // Cập nhật ghi chú báo cáo "tỉ lệ trúng thầu theo qúy" theo năm
  updateNoteReportQuaterOfYear(year: number, reportKPIQuaterOfYearDetails: any) {
    const url = `kpiquaterofyear/note/update`;
    const details = reportKPIQuaterOfYearDetails.map(item => {
      return {
        quaterOfYear: item.quaterOfYear && item.quaterOfYear.key,
        note: item.note,
      };
    });
    const requestModel = {
      year: year,
      details: details,
    };
    return this.apiService.post(url, requestModel);
  }

  // Cập nhật ghi chú thống kê diện thích sàn đã xây dựng và trùng thầu theo năm
  updateNoteReportFloorArea(year: number, reportFloorArea: ReportFloorArea) {
    const url = `report/buildingfloorarea/note/update`;
    const requestModel = {
      year: year,
      tenderNote: reportFloorArea.tenderNote,
      waitingNote: reportFloorArea.waitForResultNote,
      winningOfBidNote: reportFloorArea.winningOfBidNote,
      perNote: reportFloorArea.perNote,
    };
    return this.apiService.post(url, requestModel);
  }

  // Cập nhật ghi chú thống kê số lượng trùng thầu theo năm
  updateNoteNumberWinbid(year: number, reportNumberWinBid: ReportNumberWinBid) {
    const url = `report/winningofbid/note/update`;
    const requestModel = {
      year: year,
      tenderNote: reportNumberWinBid.tenderNote,
      waitingNote: reportNumberWinBid.waitForResultNote,
      winningOfBidNote: reportNumberWinBid.winningOfBidNote,
      perNote: reportNumberWinBid.perNote,
    };
    return this.apiService.post(url, requestModel);
  }
}
