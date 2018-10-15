import { Component, OnInit } from '@angular/core';
import { PackageService } from '../../../../../shared/services/package.service';
import { PackagePermissionComponent } from '../../package-permission.component';
import { StakeHolder } from '../../../../../shared/models/ho-so-du-thau/stack-holder.model';
import { FormBuilder, FormGroup, FormArray } from '../../../../../../../node_modules/@angular/forms';

@Component({
  selector: 'app-user-bid-group-stake-holder',
  templateUrl: './user-bid-group-stake-holder.component.html',
  styleUrls: ['./user-bid-group-stake-holder.component.scss']
})
export class UserBidGroupStakeHolderComponent implements OnInit {
  packageId: number;
  listStackHolders: StakeHolder[];
  stakeHolderForm: FormGroup;
  constructor(
    private packageService: PackageService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.packageId = PackagePermissionComponent.packageId;
    this.loadData();
  }



  loadData() {
    this.packageService.getStakeHolders(503).subscribe(data => {
      this.listStackHolders = data;
      this.createForm();
    });
  }

  createForm() {
    this.stakeHolderForm = this.fb.group({
      stackHolders: this.fb.array([])
    });

    this.listStackHolders.forEach(x => {
      const controls = <FormArray>(this.stakeHolderForm.controls.stackHolders);
      controls.push(this.fb.group({
        groupName: x.groupName,
        customers: (x.customers || []).map(customer => {
          const customerControl = this.fb.group({
            customerId: customer.customerId,
            customerName: customer.customerName,
            contacts: (customer.contacts || []).map(contact => {
              const contactControl = this.fb.control(contact);
              return contactControl;
            })
          });
          return customerControl;
        })
      }));
    });
    console.log(this.stakeHolderForm);
  }

}
