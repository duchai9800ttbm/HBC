import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '../../../../../../../../node_modules/@angular/router';
import { PackageDetailComponent } from '../../../package-detail.component';
import { InterviewInvitationService } from '../../../../../../shared/services/interview-invitation.service';
import { DATATABLE_CONFIG } from '../../../../../../shared/configs';
import { Subject, BehaviorSubject } from '../../../../../../../../node_modules/rxjs';
import { ApprovedDossiersList } from '../../../../../../shared/models/interview-invitation/approved-dossiers-list.model';
import { NgxSpinnerService } from '../../../../../../../../node_modules/ngx-spinner';
import { AlertService } from '../../../../../../shared/services';
import { NgbDropdownConfig } from '../../../../../../../../node_modules/@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-prepare-interview',
  templateUrl: './prepare-interview.component.html',
  styleUrls: ['./prepare-interview.component.scss'],
  providers: [NgbDropdownConfig],
})
export class PrepareInterviewComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private interviewInvitationService: InterviewInvitationService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
  ) { }
  packageId: number;
  dtOptions: any = DATATABLE_CONFIG;
  dtTrigger: Subject<any> = new Subject();
  searchApprovedDossiers$ = new BehaviorSubject<string>('');
  pagedResult: ApprovedDossiersList[];
  indexTable = 0;
  isNgOnInit = false;
  loading = false;
  ngOnInit() {
    this.packageId = +PackageDetailComponent.packageId;
    this.interviewInvitationService.watchRefeshPrepareInterview().subscribe(value => {
      if (this.isNgOnInit) {
        this.spinner.show();
        this.loading = true;
        this.interviewInvitationService.getListApprovedDossiers(this.packageId, this.searchApprovedDossiers$.value).subscribe(response => {
          this.pagedResult = response;
          this.loading = false;
          this.spinner.hide();
          this.alertService.success('Dữ liệu đã được cập nhật mới nhất!');
        },
          err => {
            this.spinner.hide();
            this.loading = false;
            this.alertService.error('Cập nhật dữ liệu thất bại!');
          }
        );
      }
    });
    this.searchApprovedDossiers$.debounceTime(600)
      .distinctUntilChanged()
      .subscribe(keySearch => {
        this.spinner.show();
        this.loading = true;
        this.interviewInvitationService.getListApprovedDossiers(this.packageId, keySearch).subscribe(response => {
          this.pagedResult = response;
          console.log('this.result', this.pagedResult);
          this.spinner.hide();
          this.loading = false;
          this.isNgOnInit = true;
        },
          err => {
            this.spinner.hide();
            this.loading = false;
            if (this.isNgOnInit) {
              this.alertService.error('Cập nhật dữ liệu thất bại!');
            }
            this.isNgOnInit = true;
          });
      });
  }

  routerLink(link: string) {
    this.router.navigate([`/package/detail/${this.packageId}/attend/interview-negotiation/${link}`]);
  }

  renderIndex(i, k) {
    // let dem = 0;
    // let tam = -1;
    // if (+i === 0) {
    //   return k + 1;
    // } else {
    //   this.pagedResult.forEach(ite => {
    //     if (tam < +i - 1) {
    //       if (!ite.childs) {
    //         dem++;
    //       } else {
    //         ite.childs.forEach(e => {
    //           dem++;
    //         });
    //       }
    //     }
    //     tam++;
    //   });
    //   return dem + k + 1;
    // }
    if (i === 0) {
      return k + 1;
    } else {
      let dem = 0;
      for (let a = 0; a < i; a++) {
        if (this.pagedResult[a].document && this.pagedResult[a].document.length !== 0) {
          dem = dem + this.pagedResult[a].document.length;
        } else if (this.pagedResult[a].childs && this.pagedResult[a].childs.length !== 0) {
          dem = dem + this.pagedResult[a].childs.length;
        }
      }
      dem = dem + k;
      return dem + 1;
    }
  }

  onSelectAll(value: boolean) {
    this.pagedResult.forEach(item => item['checkboxSelected'] = value);
  }


  viewDetailLiveForm(type: string) {
    console.log('typeliveForm', type);
    switch (type) {
      // Bản tóm tắt điều kiện dự thầu
      case 'TenderConditionalSummary': {
        this.router.navigate([`/package/detail/${this.packageId}/attend/build/summary`]);
        break;
      }
      // Bảo cáo tham quan công trình
      case 'SiteSurveyingReport': {
        this.router.navigate([`/package/detail/${this.packageId}/attend/build/liveformsite`]);
        break;
      }
      // Trình duyệt giá
      case 'TenderPriceApproval': {
        this.router.navigate([`/package/detail/${this.packageId}/attend/price-review/summary`]);
        break;
      }
    }
  }

  dowloadDocument(tenderDocumentId: number) {
    console.log('tenderDocumentId', tenderDocumentId);
    this.interviewInvitationService.downloadTenderdocument(tenderDocumentId).subscribe(response => {
    },
      err => {
        this.spinner.hide();
        this.alertService.error('Tải tài liệu hồ sơ dự thầu không thành công!');
      });
  }

}
