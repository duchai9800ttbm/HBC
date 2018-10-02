import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '../../../../../../../../node_modules/@angular/router';
import { PackageDetailComponent } from '../../../package-detail.component';

@Component({
  selector: 'app-prepare-interview',
  templateUrl: './prepare-interview.component.html',
  styleUrls: ['./prepare-interview.component.scss'],
})
export class PrepareInterviewComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }
  packageId = +PackageDetailComponent.packageId;
  ngOnInit() {
  }

  routerLink(link: string) {
    this.router.navigate([`/package/detail/${this.packageId}/attend/interview-negotiation/${link}`]);
  }

}
