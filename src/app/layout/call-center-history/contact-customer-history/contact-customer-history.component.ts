import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { OpportunityService } from '../../../shared/services';
import { InvoiceInfo } from '../../../shared/models/invoice/invoice-info';

@Component({
  selector: 'app-contact-customer-history',
  templateUrl: './contact-customer-history.component.html',
  styleUrls: ['./contact-customer-history.component.scss']
})
export class ContactCustomerHistoryComponent implements OnInit {

  @Input() customers: any;
  @Input() contacts: any;
  @Input() phoneNumber: string;
  opportunityCustomerId;
  opportunityContactId;
  invoiceInfo: InvoiceInfo;
  isShowMore = false;
  dayInvoiceLatest;
  constructor(
    private router: Router,
    private opportunityService: OpportunityService,
  ) { }

  ngOnInit() {
    this.opportunityService.getOpportunitiesByModuleItemId('customer', this.customers[0].objectId, 0, 1)
      .subscribe(result => {
        this.opportunityCustomerId = result.items.length ? result.items[0].id : null;
      });
    this.opportunityService.getOpportunitiesByModuleItemId('contact', this.contacts[0].objectId, 0, 1)
      .subscribe(result => {
        this.opportunityContactId = result.items.length ? result.items[0].id : null;
      });
  }
  detailOpportunityCustomer() {
    this.router.navigate([`/customer/detail/${this.customers[0].objectId}/opportunity`]);
  }
  detailOpportunityContact(objectId: number | string) {
    this.router.navigate([`/contact/detail/${objectId}/opportunity`]);
  }
  detailCustomer() {
    this.router.navigate([`/customer/detail/${this.customers[0].objectId}`]);
  }
  detailContact() {
    this.router.navigate([`/contact/detail/${this.contacts[0].objectId}`]);
  }

}
