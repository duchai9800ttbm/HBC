import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ProspectService } from '../../../shared/services';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConvertProspect2Component } from '../../../shared/components/convert-prospect2/convert-prospect2.component';

@Component({
  selector: 'app-prospect-history',
  templateUrl: './prospect-history.component.html',
  styleUrls: ['./prospect-history.component.scss']
})
export class ProspectHistoryComponent implements OnInit {
  @Input() phoneNumber: string;
  @Input() prospects: any;
  activeModalRef: NgbModalRef;
  constructor(
    private router: Router,
    private prospectService: ProspectService,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
  }
  detailProspect() {
    this.router.navigate([`/prospect/detail/${this.prospects[0].objectId}`]);
  }
  // convertProspect() {
  //   this.router.navigate([`/dashboard`]);
  //   setTimeout(() => {
  //     this.router.navigate([`/prospect/detail/${this.prospects[0].objectId}`, {
  //       isPopUpConvert: true
  //     }]);
  //   }, 10);
  // }

  convertProspect(id) {
    this.prospectService.view(id).subscribe(prospect => {
      if (this.activeModalRef) {
        this.activeModalRef.close();
      }
      this.activeModalRef = this.modalService.open(ConvertProspect2Component);
      this.activeModalRef.componentInstance.prospect = prospect;
    });
  }

}
