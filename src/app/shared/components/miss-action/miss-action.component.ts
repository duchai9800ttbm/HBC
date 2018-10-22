import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '../../../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../services';
import { Router } from '../../../../../node_modules/@angular/router';
import { PackageService } from '../../services/package.service';

@Component({
  selector: 'app-miss-action',
  templateUrl: './miss-action.component.html',
  styleUrls: ['./miss-action.component.scss']
})
export class MissActionComponent implements OnInit {
  @Input() message: any;
  @Input() routerLink: any;
  @Input() setRouterAction: any;
  constructor(
    public activeModal: NgbActiveModal,
    private alertService: AlertService,
    private router: Router,
    private packageService: PackageService
  ) { }

  ngOnInit() {
  }

  viewDetail() {
    if (this.setRouterAction) {
      this.packageService.setRouterAction('view');
    }
    this.activeModal.close('Close click');
    this.router.navigate([this.routerLink]);
  }
}
