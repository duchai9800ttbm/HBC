import { Component, OnInit } from '@angular/core';
import { PackageService } from '../../../../../shared/services/package.service';
import { PackagePermissionComponent } from '../../package-permission.component';
import { StakeHolder, CustomerStakeHolder } from '../../../../../shared/models/ho-so-du-thau/stack-holder.model';
import { FormBuilder, FormGroup, FormArray, FormControl } from '../../../../../../../node_modules/@angular/forms';
import { UserService, AlertService } from '../../../../../shared/services';
import { UserItemModel } from '../../../../../shared/models/user/user-item.model';
import { DictionaryItem } from '../../../../../shared/models';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-user-bid-group-stake-holder',
  templateUrl: './user-bid-group-stake-holder.component.html',
  styleUrls: ['./user-bid-group-stake-holder.component.scss']
})
export class UserBidGroupStakeHolderComponent implements OnInit {
  packageId: number;
  listStackHolders: StakeHolder[];
  stakeHolderForm: FormGroup;
  listUser: UserItemModel[];
  contactsSearchResults;
  customersSearchResults;

  constructor(
    private packageService: PackageService,
    private userService: UserService,
    private fb: FormBuilder,
    private alertService: AlertService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.packageId = PackagePermissionComponent.packageId;
    this.searchCustomers();
    this.loadData();
  }

  loadUser() {
    this.userService.getAllUser('').subscribe(data => {
      this.listUser = data;
    });
  }

  loadData() {
    this.packageService.getStakeHolders(this.packageId).subscribe(data => {
      this.listStackHolders = data;
      this.listStackHolders.forEach(item => {
        if (item.customers.length === 0) {
          item.customers = [];
          const obj = new CustomerStakeHolder();
          obj.customerName = '';
          obj.customerId = null;
          item.customers.push(obj);
        }
      });
      console.log(this.listStackHolders);

    });
  }

  // createForm() {
  //   this.stakeHolderForm = this.fb.group({
  //     stakeHolders: this.fb.array([])
  //   });

  //   this.listStackHolders.forEach(x => {
  //     const controls = <FormArray>(this.stakeHolderForm.controls.stakeHolders);
  //     controls.push(this.fb.group({
  //       groupName: x.groupName,
  //       customers: this.fb.array([
  //         (x.customers || []).map(customer => {
  //           const customerControl = this.fb.group({
  //             customerId: customer.customerId,
  //             customerName: customer.customerName,
  //             contacts: this.fb.array([
  //               (customer.contacts || []).map(contact => {
  //                 const contactControl = this.fb.control(contact);
  //                 return contactControl as FormControl;
  //               })
  //             ])
  //           });
  //           return customerControl as FormGroup;
  //         })
  //       ]) as FormArray
  //     }));
  //   });
  // }

  addFormItem(groupId) {
    this.listStackHolders.forEach(item => {
      if (item.id === groupId) {
        const obj = new CustomerStakeHolder();
        obj.customerName = '';
        obj.customerId = null;
        item.customers.push(obj);
      }
    });
  }

  removeFormItem(groupId, index) {
    this.listStackHolders.forEach(item => {
      if (item.id === groupId) {
        item.customers.splice(index, 1);
      }
    });
  }

  searchContacts(query) {
    this.packageService.getListCustomercontact2(query)
      .subscribe(result => {
        this.contactsSearchResults = result;
      });
  }

  searchCustomers() {
    this.packageService.getListCustomer2()
      .subscribe(result => {
        this.customersSearchResults = result;
      });
  }

  submit() {
    const list = [...this.listStackHolders].map(x => ({
      userGroupId: x.id,
      customers: (x.customers || []).filter(cus => cus.customerId).map(customer => ({
        customerId: +customer.customerId,
        customerContactIds: (customer.contacts || []).map(contact => contact.id)
      }))
    }));

    this.spinner.show();
    this.packageService.updateStakeHolders(this.packageId, list).subscribe(data => {
      this.spinner.hide();
      this.alertService.success('Cập nhật các bên liên quan thành công!');
    }, err => {
      this.spinner.hide();
      this.alertService.error('Cập nhật các bên liên quan thất bại!');
    });

  }

}
