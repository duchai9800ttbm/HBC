import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { routerTransition, slideToRight, slideToLeft } from '../../../../router.animations';

@Component({
  selector: 'app-package-detail-file-invitation',
  templateUrl: './package-detail-file-invitation.component.html',
  styleUrls: ['./package-detail-file-invitation.component.scss'],
  animations: [slideToLeft()]
})
export class PackageDetailFileInvitationComponent implements OnInit {
  public packageId;
  constructor(
    private activetedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    // this.activetedRoute.params.subscribe(result => {
    //   this.packageId = +result.id;
    // });
  }

}
