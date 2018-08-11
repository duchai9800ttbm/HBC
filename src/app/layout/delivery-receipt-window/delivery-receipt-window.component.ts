import { Component, OnInit } from '@angular/core';
import { WindowService } from '../../shared/services/window.service';
import { CustomerService, DataService } from '../../shared/services';
import {
    CustomerModel,
    DictionaryItem,
    PagedResult
} from '../../shared/models';
import { Invoice } from '../../shared/models/invoice/invoice';
import { InvoiceModel } from '../../shared/models/invoice/invoice-model';
import { GroupDescriptor, DataResult, process } from '@progress/kendo-data-query';
import { DeliveryDetail } from '../../shared/models/delivery/delivery-detail';

@Component({
    selector: 'app-delivery-receipt-window',
    templateUrl: './delivery-receipt-window.component.html',
    styleUrls: ['./delivery-receipt-window.component.scss']
})
export class DeliveryReceiptWindowComponent implements OnInit {
    isShowDeliveryReceipt = false;
    isShowDeliveryDetail = false;
    currentCustomer: CustomerModel = new CustomerModel();
    products: DictionaryItem[];
    invoiceStatusList: DictionaryItem[];
    deliveryReceiptPageData: PagedResult<InvoiceModel> = new PagedResult<
        InvoiceModel
    >();
    groups: GroupDescriptor[] = [{ field: 'invoiceNo' }];
    gridView: DataResult;
    deliveryDetail: DeliveryDetail = new DeliveryDetail();
    deliveryDetailItems: InvoiceModel[];
    constructor(
        private windowService: WindowService,
        private customerService: CustomerService,
        private dataService: DataService
    ) {}

    ngOnInit() {
        this.windowService.deliveryReceiptShow.subscribe(
            data => (this.isShowDeliveryReceipt = data)
        );
        // const customerId = async this.windowService.customerId.;
        this.windowService.customerId.subscribe(data => {
            this.customerService.view(data).subscribe(customer => {
                this.currentCustomer = customer;
            });
            this.dataService.getListInvoiceStatus().subscribe(invoiceStatus => {
                this.invoiceStatusList = invoiceStatus;
                this.windowService
                    .getDeliveryReceiptList(data, 0, 10)
                    .subscribe(deliveryInvoice => {
                        this.refresh(deliveryInvoice);
                    });
            });
        });
        this.dataService
            .getListProduct()
            .subscribe(data => (this.products = data));
    }

    pagedResultChange(data) {
        this.windowService
            .getDeliveryReceiptList(
                this.currentCustomer.id,
                data.currentPage,
                data.pageSize
            )
            .subscribe(result => this.refresh(result));
    }

    refresh(pagedResult) {
        this.deliveryReceiptPageData = pagedResult;
        this.deliveryReceiptPageData.items.forEach(item => {
            item.invoiceStatus = this.invoiceStatusList.find(
                i => i.id + '' === item.invoiceStatus
            ).text;
        });
        console.log(this.deliveryReceiptPageData.items);
        this.gridView = process(this.deliveryReceiptPageData.items, { group: this.groups });
    }

    showDetailWindow(e) {
      this.isShowDeliveryDetail = true;
      this.deliveryDetailItems = this.deliveryReceiptPageData.items.filter(i => i.coordinatorReference === e);
      this.windowService.getDeliveryDetail(e)
        .subscribe(data => {
          this.deliveryDetail = data;
        //   this.deliveryDetail.coordinatorStatus = this.invoiceStatusList.find(
        //     i => i.id + '' === this.deliveryDetail.coordinatorStatus
        // ).text;
        });
    }
}
