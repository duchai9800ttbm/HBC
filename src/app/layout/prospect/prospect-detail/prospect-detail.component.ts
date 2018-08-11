
import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { ConvertProspectModalComponent } from './convert-prospect-modal/convert-prospect-modal.component';
import { NgbModal, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ProspectService, AlertService, ConfirmationService, CampaignService } from '../../../shared/services/index';
import { Observable } from "rxjs/Observable";
import { ProspectModel } from '../../../shared/models/index';
import 'rxjs/add/operator/pluck';
import { ISubscription, Subscription } from 'rxjs/Subscription';
import { ConvertProspect2Component } from '../../../shared/components/convert-prospect2/convert-prospect2.component';

@Component({
  selector: 'app-prospect-detail',
  templateUrl: './prospect-detail.component.html',
  styleUrls: ['./prospect-detail.component.scss'],
  animations: [routerTransition()]
})
export class ProspectDetailComponent implements OnInit, OnDestroy {
  prospect$: Observable<ProspectModel>;
  prospect: ProspectModel;
  activeModalRef: NgbModalRef;
  constructor(
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    public activeModal: NgbActiveModal,
    private alertService: AlertService,
    private confirmationService: ConfirmationService,
    private prospectService: ProspectService,
    private campaignService: CampaignService
  ) { }
  isNotExist = false;
  openConvertProspectModal() {
    if (!this.activeModalRef) {
      this.activeModalRef = this.modalService.open(ConvertProspect2Component);
      this.activeModalRef.componentInstance.prospect = this.prospect;
    }
  }

  ngOnInit() {
    const that = this;
    this.prospect$ = this.route.paramMap.switchMap((params: ParamMap) => this.prospectService.view(params.get('id')));
    this.prospect$.subscribe(prospect => {
      this.prospect = prospect;
      that.route.params.subscribe(params => {
        if (params.isPopUpConvert) {
          that.openConvertProspectModal();
        }
      });
     
    },
      err => this.isNotExist = true);

  }

  delete(id) {
    const that = this;
    this.confirmationService.confirm('Bạn có chắc chắn muốn xóa tiềm năng này?',
      () => {
        that.prospectService.delete([id]).subscribe(_ => {
          that.router.navigate(['/prospect']);
          that.alertService.success('Đã xóa tiềm năng!');
        });
      });

  }
  refresh(id) {
    this.prospect$ = this.prospectService.view(id);
    this.alertService.success('Dữ liệu đã được cập nhật mới nhất!');
  }
  ngOnDestroy(): void {

  }

}



