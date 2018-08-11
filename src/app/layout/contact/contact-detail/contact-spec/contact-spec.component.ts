import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../../router.animations';
import { Observable } from 'rxjs/Observable';
import { ContactModel } from '../../../../shared/models/index';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ContactService } from '../../../../shared/services/index';
import { FengShuisInforComponent } from '../../../../shared/components/feng-shuis-infor/feng-shuis-infor.component';
import { DialogService } from '../../../../../../node_modules/@progress/kendo-angular-dialog';
import { FengShuisInforService } from '../../../../shared/services/feng-shuis-infor.service';
const defaultAvatarSrc = 'assets/images/no-avatar.png';

@Component({
  selector: 'app-contact-spec',
  templateUrl: './contact-spec.component.html',
  styleUrls: ['./contact-spec.component.scss'],
  animations: [routerTransition()]
})
export class ContactSpecComponent implements OnInit {
  public isCollapsedMain = false;
  public isCollapsedAddress = false;
  public isCollapsedDesc = false;
  public isCollapsedPic = false;
  public dialog;
  fengShuisInforModel;
  contact$: Observable<ContactModel>;
  avatarSrc: string;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private contactService: ContactService,
    private dialogService: DialogService,
    private fengShuisInforService: FengShuisInforService
  ) { }

  ngOnInit(): void {
    this.avatarSrc = defaultAvatarSrc;
    this.contact$ = this.route.parent.paramMap.switchMap((params: ParamMap) =>
      this.contactService.view(params.get('id')));
    

  }
  goToDeitalCustomer(customerId) {
    this.router.navigate([`/customer/detail/${customerId}`]);
  }

  public showDialog() {
    this.dialog = this.dialogService.open({
      title: 'PHONG THỦY',
      content: FengShuisInforComponent,
      width: 750,
      height: 580,
      minWidth: 250,
    });
  }
}
