import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '../../../../../../../../node_modules/@angular/router';
import { PackageDetailComponent } from '../../../package-detail.component';
import { InterviewInvitationService } from '../../../../../../shared/services/interview-invitation.service';
import { DATATABLE_CONFIG } from '../../../../../../shared/configs';
import { Subject, BehaviorSubject } from '../../../../../../../../node_modules/rxjs';
import { ApprovedDossiersList } from '../../../../../../shared/models/interview-invitation/approved-dossiers-list.model';
import { NgxSpinnerService } from '../../../../../../../../node_modules/ngx-spinner';
import { AlertService } from '../../../../../../shared/services';

@Component({
  selector: 'app-prepare-interview',
  templateUrl: './prepare-interview.component.html',
  styleUrls: ['./prepare-interview.component.scss'],
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
  isNgOnInit: boolean;
  ngOnInit() {
    this.packageId = +PackageDetailComponent.packageId;
    this.interviewInvitationService.watchRefeshPrepareInterview().subscribe(value => {
      this.spinner.show();
      this.interviewInvitationService.getListApprovedDossiers(this.packageId, this.searchApprovedDossiers$.value).subscribe(response => {
        this.pagedResult = response;
        this.spinner.hide();
        if (this.isNgOnInit) {
          this.alertService.success('Dữ liệu đã được cập nhật mới nhất!');
        }
        this.isNgOnInit = true;
      },
        err => {
          this.alertService.error('Cập nhật dữ liệu thất bại!');
        }
      );
    });
    this.searchApprovedDossiers$.debounceTime(600)
      .distinctUntilChanged()
      .subscribe(keySearch => {
        this.spinner.show();
        this.interviewInvitationService.getListApprovedDossiers(this.packageId, keySearch).subscribe(response => {
          this.pagedResult = response;
          this.spinner.hide();
        },
          err => {
            this.alertService.error('Cập nhật dữ liệu thất bại!');
          });
      });
  }

  routerLink(link: string) {
    this.router.navigate([`/package/detail/${this.packageId}/attend/interview-negotiation/${link}`]);
  }

  renderIndex(i, k) {
    let dem = 0;
    let tam = -1;
    if (+i === 0) {
      return k + 1;
    } else {
      this.pagedResult.forEach(ite => {
        if (tam < +i - 1) {
          if (!ite.childs) {
            dem++;
          } else {
            ite.childs.forEach(e => {
              dem++;
            });
          }
        }
        tam++;
      });
      return dem + k + 1;
    }
  }

  onSelectAll(value: boolean) {
    this.pagedResult.forEach(item => item['checkboxSelected'] = value);
  }

}
