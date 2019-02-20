import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { SessionService } from './session.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { ReportKpiChair } from '../models/report-follow/report-kpi-chair.model';
import { StartAndEndDate } from '../models/report-follow/startAndEndDate.model';
import { ReportWinBid } from '../models/report-follow/report-kpi-win-bid.model';

@Injectable()
export class ReportFollowService {
  startAndEndDate = new BehaviorSubject<StartAndEndDate>({
    startDate: new Date(),
    endDate: new Date(),
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

}
