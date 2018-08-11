import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs/Rx";
import { ApiService, SessionService } from ".";
import { PagedResult } from "../models";
import { Invoice } from "../models/invoice/invoice";
import { InvoiceModel } from "../models/invoice/invoice-model";
import { DeliveryDetail } from "../models/delivery/delivery-detail";
import { DeliveryDetailResponse } from "../models/delivery/delivery-detail-response";
import DateTimeConvertHelper from "../helpers/datetime-convert-helper";
import { DocumentEntry } from "../models/debt/document-entry";
import { DebtDetailModel } from "../models/debt/debt-detail-model";
import { DebtDetailResponse } from "../models/debt/debt-detail-responsive";

@Injectable()
export class WindowService {
    deliveryReceiptDataSource = new Subject<boolean>();
    deliveryReceiptShow = this.deliveryReceiptDataSource.asObservable();
    detailRevenueDataSource = new Subject<boolean>();
    detailRevenueShow = this.detailRevenueDataSource.asObservable();
    customerIdDataSource = new Subject<number>();
    customerId = this.customerIdDataSource.asObservable();

    get employeeId() {
        return this.sessionService.currentUser.employeeId;
    }

    constructor(
        private apiService: ApiService,
        private sessionService: SessionService
    ) { }

    setDeliveryReceiptShow(data: boolean) {
        this.deliveryReceiptDataSource.next(data);
    }

    setDetailRevenueShow(data: boolean) {
        this.detailRevenueDataSource.next(data);
    }

    setCustomerId(data: number) {
        this.customerIdDataSource.next(data);
    }

    // get danh sách phiếu giao
    getDeliveryReceiptList(
        customerId: number,
        pageNumber: number,
        pageSize: number,
        productNo?: string,
        invoiceStatus?: string,
        invoiceNo?: string
    ): Observable<PagedResult<InvoiceModel>> {
        let url = `employee/${
            this.employeeId
            }/invoices/${customerId}/${pageNumber}/${pageSize}?`;
        if (productNo) {
            url += `&productNo=${productNo}`;
        }
        if (invoiceStatus) {
            url += `&invoiceStatus=${invoiceStatus}`;
        }
        if (invoiceNo) {
            url += `&invoiceNo=${invoiceNo}`;
        }
        return this.apiService
            .get(url)
            .map(response => {
                const result = response.result;
                return {
                    currentPage: result.page,
                    pageSize: pageSize,
                    pageCount: result.pageCount,
                    total: result.recordCount,
                    items: (result.data || []).map(this.toInvoiceModel)
                };
            })
            .share();
    }

    // chi tiết tình trạng giao hàng
    getDeliveryDetail(coordinatorNo: string): Observable<DeliveryDetail> {
        const url = `employee/${
            this.employeeId
            }/coordinator?coordinatorNo=${coordinatorNo}`;
        return this.apiService
            .get(url)
            .map(data => this.toDeliveryDetail(data.result));
    }

    // chi tiết công nợ
    getDebtDetail(
        customerId: number,
        pageNumber: number,
        pageSize: number,
        fromDate: number,
        toDate: number
    ): Observable<PagedResult<DebtDetailResponse>> {
        const url = `employee/${
            this.employeeId
            }/debtdetails/${customerId}/${pageNumber}/${pageSize}?fromDate=${fromDate}&toDate=${toDate}`;
        return this.apiService
            .get(url)
            .map(response => {
                const result = response.result;
                return {
                    currentPage: result.page,
                    pageSize: pageSize,
                    pageCount: result.pageCount,
                    total: result.recordCount,
                    items: result.data
                };
            })
            .share();
    }

    toDeliveryDetail(data: DeliveryDetailResponse): DeliveryDetail {
        return {
            coordinatorDateStr: DateTimeConvertHelper.fromTimestampToDtStr(
                data.coordinatorDate
            ),
            coordinatorNo: data.coordinatorNo,
            coordinatorStatus: data.coordinatorStatus,
            employeeName: data.employee.name,
            vehicleNoPlate: data.vehicleNoPlate
        };
    }

    toInvoiceModel(data: Invoice): InvoiceModel {
        return {
            coordinatorReference: data.invoice.coordinatorReference,
            invoiceStatus: data.invoice.invoiceStatus,
            invoiceNo: data.invoice.invoiceNo,
            productDesc: data.productDesc,
            productNo: data.product.productNo,
            productQty: data.productQty,
            productSerialNo: data.productSerialNo,
            productUnitPrice: data.productUnitPrice,
            totalAmount: data.totalAmount,
            transferFeeAmount: data.transferFeeAmount,
            productQtyCancel:
                data.invoice.invoiceStatus === "InvoiceCancel"
                    ? data.productQty
                    : null
        };
    }

    toDebtDetailModel(
        data: DocumentEntry,
        startBalance: number
    ): DebtDetailModel {
        const debtIncrease =
            data.debitAccountId === 20
                ? data.document.documentExchangeAmount
                : 0;
        const debtDecrease =
            data.creditAccountId === 20
                ? data.document.documentExchangeAmount
                : 0;
        return {
            createdDate: DateTimeConvertHelper.fromTimestampToDtStr(
                data.document.createdDate
            ),
            debtDecrease: debtDecrease,
            debtIncrease: debtIncrease,
            documentDate: DateTimeConvertHelper.fromTimestampToDtStr(
                data.document.documentDate
            ),
            documentDesc: data.document.documentDesc,
            documentNo: data.document.documentNo,
            remainingCredits: startBalance - debtIncrease + debtDecrease
        };
    }
}
