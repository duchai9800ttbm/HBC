import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { EmailService } from '../../../shared/services/email.service';
import { EmailCategory } from '../../../shared/models/email/email-item.model';
import { ActivatedRoute } from '../../../../../node_modules/@angular/router';

@Component({
  selector: 'app-package-email',
  templateUrl: './package-email.component.html',
  styleUrls: ['./package-email.component.scss'],
  animations: [routerTransition()]
})
export class PackageEmailComponent implements OnInit {
  static packageId;
  public packageId: number;
  listEmailCategory: EmailCategory[];
  assign;
  deploy;
  giveUp;
  important;
  interview;
  kickOff;
  miss;
  transfer;
  trash;
  win;
  constructor(
    private emailService: EmailService,
    private activetedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.activetedRoute.params.subscribe(result => {
      this.packageId = +result.id;
      PackageEmailComponent.packageId = this.packageId;
    });
    const that = this;
    this.emailService.watchEmailSubject().subscribe(data => {
      console.log('abcd');
      this.emailService.getListCategory(this.packageId).subscribe(result => {
        this.listEmailCategory = result;
        this.listEmailCategory.forEach(e => {
          if (e.category && e.category.key === 'RejectOpportunity') {
            this.giveUp = e;
          }
          if (e.category && e.category.key === 'PlanningAssignment') {
            this.assign = e;
          }
          if (e.category && e.category.key === 'TransferDocuments') {
            this.transfer = e;
          }
          if (e.category && e.category.key === 'AnnounceDeployment') {
            this.deploy = e;
          }
          if (e.category && e.category.key === 'AnnounceInterview') {
            this.interview = e;
          }
          if (e.category && e.category.key === 'AnnouncePassBidOpportunity') {
            this.win = e;
          }
          if (e.category && e.category.key === 'AnnounceFailBidOpportunity') {
            this.miss = e;
          }
          if (e.category && e.category.key === 'Kick-off') {
            this.kickOff = e;
          }
          if (e.category && e.category.key === 'TrashCan') {
            this.trash = e;
          }
          if (e.category && e.category.key === 'ImportantEmails') {
            this.important = e;
          }
        });
      });
    });
    this.emailService.getListCategory(this.packageId).subscribe(result => {
      this.listEmailCategory = result;
      this.listEmailCategory.forEach(e => {
        if (e.category && e.category.key === 'RejectOpportunity') {
          this.giveUp = e;
        }
        if (e.category && e.category.key === 'PlanningAssignment') {
          this.assign = e;
        }
        if (e.category && e.category.key === 'TransferDocuments') {
          this.transfer = e;
        }
        if (e.category && e.category.key === 'AnnounceDeployment') {
          this.deploy = e;
        }
        if (e.category && e.category.key === 'AnnounceInterview') {
          this.interview = e;
        }
        if (e.category && e.category.key === 'AnnouncePassBidOpportunity') {
          this.win = e;
        }
        if (e.category && e.category.key === 'AnnounceFailBidOpportunity') {
          this.miss = e;
        }
        if (e.category && e.category.key === 'Kick-off') {
          this.kickOff = e;
        }
        if (e.category && e.category.key === 'TrashCan') {
          this.trash = e;
        }
        if (e.category && e.category.key === 'ImportantEmails') {
          this.important = e;
        }
      });
    });
  }

}
