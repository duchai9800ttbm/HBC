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
import { routerTransition } from '../../router.animations';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-delivery',
    templateUrl: './delivery.component.html',
    styleUrls: ['./delivery.component.scss'],
    animations: [routerTransition()]
})
export class DeliveryComponent implements OnInit {

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
    coordinatorStatusList: DictionaryItem[];
    productFilter = '';
    statusFilter = '';
    invoiceNo;
    constructor(
        private windowService: WindowService,
        private customerService: CustomerService,
        private dataService: DataService,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.route.params.subscribe(data => {
            this.customerService.view(data.id).subscribe(customer => {
                console.log(customer);
                this.currentCustomer = customer;
            });
            this.dataService.getListInvoiceStatus().subscribe(invoiceStatus => {
                this.invoiceStatusList = invoiceStatus;
                this.windowService
                    .getDeliveryReceiptList(data.id, 0, 10, '', '', data.invoiceNo)
                    .subscribe(deliveryInvoice => {
                        this.refresh(deliveryInvoice);
                    });
            });
        });
        this.dataService
            .getListProduct()
            .subscribe(data => (this.products = data));
        this.dataService.getListCoordinatorStatus()
            .subscribe(data => this.coordinatorStatusList = data);
    }

    pagedResultChange(data) {
        this.windowService
            .getDeliveryReceiptList(
                this.currentCustomer.id,
                data.currentPage,
                data.pageSize,
                this.productFilter,
                this.statusFilter
            )
            .subscribe(result => this.refresh(result));
    }

    filterDeliveryReceipt(key?: string) {
        this.windowService
            .getDeliveryReceiptList(
                this.currentCustomer.id,
                Number(this.deliveryReceiptPageData.currentPage),
                Number(this.deliveryReceiptPageData.pageSize),
                this.productFilter,
                this.statusFilter,
                key
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
                this.deliveryDetail.coordinatorStatus = this.coordinatorStatusList.find(
                    i => i.id + '' === this.deliveryDetail.coordinatorStatus
                ).text;
            });
    }

    groupChange(groups: GroupDescriptor[]): void {
        this.groups = groups;
        this.gridView = process(this.deliveryReceiptPageData.items, { group: this.groups });
    }

}
