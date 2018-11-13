import { Component, OnInit } from '@angular/core';
import { HoSoDuThauService } from '../../../../../../../../shared/services/ho-so-du-thau.service';
import { StakeHolder } from '../../../../../../../../shared/models/ho-so-du-thau/stack-holder.model';
import { PackageDetailComponent } from '../../../../../package-detail.component';

@Component({
  selector: 'app-summary-condition-form-related-parties',
  templateUrl: './summary-condition-form-related-parties.component.html',
  styleUrls: ['./summary-condition-form-related-parties.component.scss']
})
export class SummaryConditionFormRelatedPartiesComponent implements OnInit {
  cacBenLienQuan = new Array<StakeHolder>();
  stakeHolderList = new Array<StakeHolder>();
  packageId;
  isFormChange = false;
  isModeView = false;

  constructor(
    private hoSoDuThauService: HoSoDuThauService,
  ) { }


  ngOnInit() {
    this.hoSoDuThauService.watchLiveformState().subscribe(data => {
      this.isModeView = data.isModeView;
    });
    this.packageId = +PackageDetailComponent.packageId;
    this.loadData();
  }

  loadData() {
    this.hoSoDuThauService.watchDataLiveForm().subscribe(data => {
      const objDataStepRelate = data.cacBenLienQuan;
      this.isFormChange = data.isChangeFormCacBenLienQuan;
      if (objDataStepRelate) {
        this.cacBenLienQuan = objDataStepRelate;
      }

      this.hoSoDuThauService.getStackHolders(this.packageId).subscribe(response => {
        this.stakeHolderList = response;

        if (!this.cacBenLienQuan) {
          this.stakeHolderList.forEach(x => {
            (x.customers || []).forEach(customer => {
              customer.note = '';
            });
          });
        }

        if (this.isFormChange) {
          this.stakeHolderList = this.cacBenLienQuan;
        }

        // merged two array object
        for (const group of this.stakeHolderList) {
          for (const groupLiveForm of this.cacBenLienQuan) {
            if (group.id === groupLiveForm.id) {
              group.customers = group.customers.concat(groupLiveForm.customers);
              for (let i = 0; i < group.customers.length; ++i) {
                for (let j = i + 1; j < group.customers.length; ++j) {
                  if (group.customers[i].customerId === group.customers[j].customerId) {
                    group.customers[i].note = group.customers[j].note;
                    group.customers.splice(j--, 1);
                  }
                }
              }
            }
          }
        }


      });

    });
  }

  noteChange(e) {
    if (!this.isFormChange) {
      this.hoSoDuThauService.emitFormCacBenLienQuan(true);
    }
    this.hoSoDuThauService.emitDataStepRelate(this.stakeHolderList);
  }

  returnIndex(i, k) {
    let dem = 0;
    for (let m = 0; m < this.stakeHolderList.length; m++) {
      if (m < i) {
        dem = dem + this.stakeHolderList[m].customers.length;
      }
    }
    return dem + k + 1;
  }

  maxIndex() {
    let dem = 0;
    if (this.stakeHolderList) {
      for (let m = 0; m < this.stakeHolderList.length; m++) {
       for (let n = 0; n < this.stakeHolderList[m].customers.length; n++ ) {
         dem = dem + 1;
       }
      }
    }
    return dem;
  }


}
