import { Component, OnInit, Input } from '@angular/core';
import { ProspectModel } from '../../models/prospect/prospect.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { DictionaryItem } from '../../models/dictionary-item.model';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SessionService } from '../../services/session.service';
import { DataService } from '../../services/data.service';
import { AlertService } from '../../services/alert.service';
import { ProspectService } from '../../services/prospect.service';
import { ConfirmationService } from '../../services/confirmation.service';
import CustomValidator from '../../helpers/custom-validator.helper';
import ValidationHelper from '../../helpers/validation.helper';

@Component({
  selector: 'app-convert-prospect2',
  templateUrl: './convert-prospect2.component.html',
  styleUrls: ['./convert-prospect2.component.scss']
})
export class ConvertProspect2Component implements OnInit {
  isSubmitted: boolean;
  @Input() prospect: ProspectModel;
  hidePopup = false;
  convertProspectForm: FormGroup;

  validationMessages = [];
  businessList: Observable<DictionaryItem[]>;
  salutationList: Observable<DictionaryItem[]>;
  employeeList: Observable<DictionaryItem[]>;
  employeeGroupList: Observable<DictionaryItem[]>;
  isCollapsedMain: boolean;
  isCollapsed2: boolean;
  checkName = 0;
  formErrors = {
    customerName: '',
    contactFirstName: '',
    contactLastName: '',
    contactEmail: '',
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public activeModal: NgbActiveModal,
    private sessionService: SessionService,
    private dataService: DataService,
    private alertService: AlertService,
    private prospectService: ProspectService,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit() {
    this.createForm();
    this.salutationList = this.dataService.getSalutations();
    this.businessList = this.dataService.getBusiness();
    this.employeeList = this.dataService.getEmployees();
    this.employeeGroupList = this.dataService.getEmployeeGroups();
  }

  createForm() {
    this.convertProspectForm = this.fb.group({
      id: this.prospect.id,
      isNewCustomer: true,
      customerName: [this.prospect.companyName, Validators.required],
      customerBusiness: this.prospect.fieldOfAction,
      isNewContact: true,
      contactSalutation: this.prospect.name,
      contactFirstName: [this.prospect.firstName, Validators.required],
      contactLastName: [this.prospect.lastName, Validators.required],
      contactEmail: [this.prospect.email, CustomValidator.emailOrEmpty],
      assignTo: (this.prospect.assignTo && this.prospect.assignTo.id)
        || this.sessionService.currentUser.employeeId,
    });

    this.setFormValidators();

    this.convertProspectForm.valueChanges
      .subscribe(data => {
        this.onFormValueChanged(data);
        this.checkName = 0;
      });
  }


  setFormValidators() {
    const customerNameControl = this.convertProspectForm.get('customerName');
    const customerBusinessControl = this.convertProspectForm.get('customerBusiness');
    const contactSalutationControl = this.convertProspectForm.get('contactSalutation');
    const contactFirstNameControl = this.convertProspectForm.get('contactFirstName');
    const contactLastNameControl = this.convertProspectForm.get('contactLastName');
    const contactEmailControl = this.convertProspectForm.get('contactEmail');

    this.convertProspectForm.get('isNewCustomer').valueChanges.subscribe((validate) => {
      if (validate) {
        customerNameControl.enable();
        customerBusinessControl.enable();
        customerNameControl.setValidators([Validators.required]);
      } else {
        customerNameControl.disable();
        customerBusinessControl.disable();
        customerNameControl.clearValidators();
      }
      customerNameControl.updateValueAndValidity();
    });
    this.convertProspectForm.get('isNewContact').valueChanges.subscribe((validate) => {

      if (validate) {
        contactSalutationControl.enable();
        contactFirstNameControl.enable();
        contactLastNameControl.enable();
        contactEmailControl.enable();
        contactFirstNameControl.setValidators([Validators.required]);
        contactLastNameControl.setValidators([Validators.required]);
        contactEmailControl.setValidators([CustomValidator.emailOrEmpty]);
      } else {
        contactSalutationControl.disable();
        contactFirstNameControl.disable();
        contactLastNameControl.disable();
        contactEmailControl.disable();
        contactFirstNameControl.clearValidators();
        contactLastNameControl.clearValidators();
        contactEmailControl.clearValidators();
      }
      contactFirstNameControl.updateValueAndValidity();
      contactLastNameControl.updateValueAndValidity();
      contactEmailControl.updateValueAndValidity();
    });
  }

  onFormValueChanged(data?: any) {
    if (this.isSubmitted) {
      this.validateForm();
    }
  }

  validateForm() {
    const isNewCustomer = this.convertProspectForm.get('isNewCustomer');
    const isNewContact = this.convertProspectForm.get('isNewContact');
    if (!isNewCustomer.value && !isNewContact.value) {
      this.validationMessages = ['Chuyển đổi đòi hỏi phải lựa chọn Liên hệ hoặc Khách hàng'];
      return false;
    } else {
      this.validationMessages = [];
    }
    return ValidationHelper.getInvalidMessages(this.convertProspectForm, this.formErrors).length === 0;
  }


  submitForm() {
    this.isSubmitted = true;
    if (this.validateForm()) {
      const that = this;
      this.prospectService.checkCustomerName(this.convertProspectForm.get('customerName').value)
        .subscribe(result => {
          this.checkName = result;
          const thiss = this;
          if (this.checkName === 1) {
            that.confirmationService.confirm(`Tên khách hàng trùng với tên một khách hàng đã có bạn có muốn tiếp tục không?`,
              () => {
                that.hidePopup = true;
                // tslint:disable-next-line:max-line-length
                this.prospectService.checkContactName(`${this.convertProspectForm.get('contactLastName').value} ${this.convertProspectForm.get('contactFirstName').value}`)
                  .subscribe(res => {
                    if (res === 1) {
                      that.confirmationService.confirm(`Tên liên hệ trùng với tên một liên hệ đã có bạn có muốn tiếp tục không?`,
                        () => {
                          thiss.prospectService
                            .convertProspect(this.convertProspectForm.value)
                            .subscribe(_ => {
                              this.activeModal.close('Close click');
                              this.router.navigate(['/prospect']);
                              this.alertService.success('Tiềm năng đã được chuyển đổi thành công!');
                            });
                        });
                    } else {
                      this.prospectService
                        .convertProspect(this.convertProspectForm.value)
                        .subscribe(respon => {
                          this.activeModal.close('Close click');
                          this.activeModal.close('Close click');
                          this.router.navigate(['/prospect']);
                          this.alertService.success('Tiềm năng đã được chuyển đổi thành công!');
                        });
                    }
                  });

              });
          } else {
            this.prospectService
              .convertProspect(this.convertProspectForm.value)
              .subscribe(res => {
                this.activeModal.close('Close click');
                this.activeModal.close('Close click');
                this.router.navigate(['/prospect']);
                this.alertService.success('Tiềm năng đã được chuyển đổi thành công!');
              });
          }
        });

    }
  }



}
