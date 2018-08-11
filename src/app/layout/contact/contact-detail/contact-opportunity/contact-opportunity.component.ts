import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerService, ContactService } from '../../../../shared/services/index';

@Component({
  selector: 'app-contact-opportunity',
  templateUrl: './contact-opportunity.component.html',
  styleUrls: ['./contact-opportunity.component.scss']
})
export class ContactOpportunityComponent implements OnInit {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  constructor(
    private route: ActivatedRoute,
    private contactService: ContactService,
  ) { }

  ngOnInit() {
    this.route.parent.params.subscribe(value => {
      this.id = value.id;
      this.contactService.view(this.id).subscribe(result => {
        this.firstName = result.firstName;
        this.lastName = result.lastName;
      });
    });
  }

}
