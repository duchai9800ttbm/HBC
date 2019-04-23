import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../../../router.animations';

@Component({
  selector: 'app-package-detail-file-invitation',
  templateUrl: './package-detail-file-invitation.component.html',
  styleUrls: ['./package-detail-file-invitation.component.scss'],
  animations: [slideToTop()]
})
export class PackageDetailFileInvitationComponent implements OnInit {
  constructor(
  ) { }

  ngOnInit() {
  }

}
