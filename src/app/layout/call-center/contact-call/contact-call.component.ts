import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { OpportunityService } from '../../../shared/services/opportunity.service';
import { ContactService } from '../../../shared/services';

@Component({
  selector: 'app-contact-call',
  templateUrl: './contact-call.component.html',
  styleUrls: ['./contact-call.component.scss']
})
export class ContactCallComponent implements OnInit {
  @Input() phoneNumber: string;
  @Input() contacts: any;
  opportunityId;
  listCustomer = [];
  constructor(
    private router: Router,
    private opportunityService: OpportunityService,
    private contactService: ContactService
  ) { }

  ngOnInit() {
    this.opportunityService.getOpportunitiesByModuleItemId('contact', this.contacts[0].objectId, 0, 1)
      .subscribe(result => {
        this.opportunityId = result.items.length ? result.items[0].id : null;
      });
    this.contactService.getCustomerListByContact(this.contacts[0].objectId).subscribe(res => {
      this.listCustomer = res;
      this.listCustomer.forEach(element => {
        this.opportunityService.getOpportunitiesByModuleItemId('customer', element.id, 0, 1).subscribe(result => {
          element.isOpportunity = (result.items && result.items.length) ? true : false;
        });
      });
    });
  }

  detailOpportunity() {
    this.router.navigate([`/contact/detail/${this.contacts[0].objectId}/opportunity`]);
  }
  detailContact() {
    this.router.navigate([`/contact/detail/${this.contacts[0].objectId}`]);
  }
  detailOpportunityItem(id: number | string) {
    this.router.navigate([`/dashboard`]);
    setTimeout(() => {
      this.router.navigate([`/customer/detail/${id}/opportunity`]);
    }, 10);

  }
}
