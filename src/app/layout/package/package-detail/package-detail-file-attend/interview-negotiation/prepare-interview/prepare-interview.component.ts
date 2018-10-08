import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '../../../../../../../../node_modules/@angular/router';
import { PackageDetailComponent } from '../../../package-detail.component';
import { InterviewInvitationService } from '../../../../../../shared/services/interview-invitation.service';
import { DATATABLE_CONFIG } from '../../../../../../shared/configs';
import { Subject, BehaviorSubject } from '../../../../../../../../node_modules/rxjs';
import { ApprovedDossiersList } from '../../../../../../shared/models/interview-invitation/approved-dossiers-list.model';

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
  ) { }
  packageId: number;
  dtOptions: any = DATATABLE_CONFIG;
  dtTrigger: Subject<any> = new Subject();
  searchApprovedDossiers$ = new BehaviorSubject<string>('');
  pagedResult: ApprovedDossiersList[];
  ngOnInit() {
    this.packageId = +PackageDetailComponent.packageId;
    this.searchApprovedDossiers$.debounceTime(600)
    .distinctUntilChanged()
    .subscribe(keySearch => {
      this.interviewInvitationService.getListApprovedDossiers(this.packageId, keySearch).subscribe( response => {
        this.pagedResult = response;
        console.log('this.pagedRessult', this.pagedResult);
      });
    });
  }

  routerLink(link: string) {
    this.router.navigate([`/package/detail/${this.packageId}/attend/interview-negotiation/${link}`]);
  }

}
