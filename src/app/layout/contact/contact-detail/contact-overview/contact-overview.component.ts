import { routerTransition } from '../../../../router.animations';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ContactModel } from '../../../../shared/models/index';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ContactService } from '../../../../shared/services/index';

@Component({
  selector: 'app-contact-overview',
  templateUrl: './contact-overview.component.html',
  styleUrls: ['./contact-overview.component.scss'],
  animations: [routerTransition()]
})
export class ContactOverviewComponent implements OnInit {
  isCollapsedMain = false;
  isCollapsedAddress = false;
  isCollapsedDesc = false;

  contact$: Observable<ContactModel>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private contactService: ContactService) { }

  ngOnInit(): void {
    this.contact$ = this.route.parent.paramMap.switchMap((params: ParamMap) =>
      this.contactService.view(params.get('id')));
  }
  goToDeitalCustomer(customerId) {
    this.router.navigate([`/customer/detail/${customerId}`]);
  }
}
