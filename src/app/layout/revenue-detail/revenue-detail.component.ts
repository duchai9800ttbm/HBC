import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { DATETIME_PICKER_CONFIG } from '../../shared/configs/datepicker.config';
import { ActivatedRoute } from '@angular/router';
import { WindowService } from '../../shared/services/window.service';
import { DebtDetailModel } from '../../shared/models/debt/debt-detail-model';
import { PagedResult, CustomerModel } from '../../shared/models';
import { DebtDetailResponse } from '../../shared/models/debt/debt-detail-responsive';
import * as moment from 'moment';
import DateTimeConvertHelper from '../../shared/helpers/datetime-convert-helper';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CustomerService } from '../../shared/services';

@Component({
    selector: 'app-revenue-detail',
    templateUrl: './revenue-detail.component.html',
    styleUrls: ['./revenue-detail.component.scss'],
    animations: [routerTransition()]
})
export class RevenueDetailComponent implements OnInit {
    datePickerConfig = DATETIME_PICKER_CONFIG;
    customerId: number;
    debtList: DebtDetailModel[];
    pagedResult: PagedResult<DebtDetailResponse> = new PagedResult<
        DebtDetailResponse
    >();
    startDate = DateTimeConvertHelper.fromTimestampToDtObject(moment().startOf('year').valueOf());
    endDate = new Date();
    currentCustomer: CustomerModel = new CustomerModel();
    constructor(
        private route: ActivatedRoute,
        private windowService: WindowService,
        private customerService: CustomerService
    ) {
    }

    ngOnInit() {
        this.route.params.subscribe(data => {
            this.customerId = data.id;
            this.customerService.view(this.customerId).subscribe(customer => {
              this.currentCustomer = customer;
            });
            this.windowService
                .getDebtDetail(
                    this.customerId,
                    0,
                    10,
                    moment(this.startDate).valueOf(),
                    moment(this.endDate).valueOf()
                )
                .subscribe(debt => {
                    this.pagedResult = debt;
                    this.refresh();
                });
        });
    }

    refresh() {
        this.debtList = [];
        this.pagedResult.items[0].documentEntrys.forEach(e => {
            this.debtList.push(
                this.windowService.toDebtDetailModel(
                    e,
                    this.pagedResult.items[0].startBalance
                )
            );
        });
    }

    pagedResultChange(pagedData) {
        this.windowService
            .getDebtDetail(
                this.customerId,
                pagedData.currentPage,
                pagedData.pageSize,
                moment(this.startDate).valueOf(),
                moment(this.endDate).valueOf()
            )
            .subscribe(result => {
                this.pagedResult = result;
                this.refresh();
            });
    }

    search() {
      this.windowService
            .getDebtDetail(
                this.customerId,
                Number(this.pagedResult.currentPage),
                Number(this.pagedResult.pageSize),
                moment(this.startDate).valueOf(),
                moment(this.endDate).valueOf()
            )
            .subscribe(result => {
                this.pagedResult = result;
                this.refresh();
            });
    }
}
