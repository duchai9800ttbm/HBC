import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import CustomValidator from '../../../shared/helpers/custom-validator.helper';
import { routerTransition } from '../../../router.animations';
import ValidationHelper from '../../../shared/helpers/validation.helper';
import { UserModel } from '../../../shared/models/user/user.model';
import { UserService, SessionService, AlertService } from '../../../shared/services/index';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserAvatarModalComponent } from './user-avatar-modal/user-avatar-modal.component';
const defaultAvatarSrc = 'assets/images/no-avatar.png';
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  animations: [routerTransition()],
})
export class UserProfileComponent implements OnInit {

  isSubmitted: boolean;
  userProfileForm: FormGroup;
  invalidMessages: string[];
  userProfile: UserModel;
  formErrors = {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
  };
  dis = true;
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private sessionService: SessionService,
    private modalService: NgbModal,
    private alertService: AlertService,
  ) { }
  avatarSrc: string;
  ngOnInit() {
    this.avatarSrc = defaultAvatarSrc;
    this.userProfile = this.sessionService.userInfo;
    this.userService.getUserInformation(this.userProfile.id).subscribe(response => {
      this.userProfile = response;
      this.createForm();
      const that = this;
      this.avatarSrc = this.userProfile.avatar ? this.userProfile.avatar : defaultAvatarSrc;
      this.sessionService
        .watchAvatarUser()
        .subscribe(user => {
          that.userProfile = user;
          this.avatarSrc = this.userProfile.avatar ? this.userProfile.avatar : defaultAvatarSrc;
        }
        );
    });
  }

  createForm() {
    this.userProfileForm = this.fb.group({
      lastName: [this.userProfile.lastName, Validators.required],
      firstName: [this.userProfile.firstName, Validators.required],
      phone: [this.userProfile.phoneNumber, CustomValidator.phoneNumber],
      email: [this.userProfile.email, CustomValidator.emailOrEmpty],
      // dob: this.userProfile.dob,
      dob: '',
      gender: this.userProfile.gender,
      address: this.userProfile.address,
      departmant: this.userProfile.department ? this.userProfile.department.text : '',
      level: this.userProfile.level ? this.userProfile.level.text : ''
    });
    this.userProfileForm.valueChanges
      .subscribe(data => this.onFormValueChanged(data));

  }

  onFormValueChanged(data?: any) {
    if (this.isSubmitted) {
      this.validateForm();
    }
  }
  validateForm() {
    this.invalidMessages = ValidationHelper.getInvalidMessages(this.userProfileForm, this.formErrors);
    return this.invalidMessages.length === 0;
  }

  submitForm() {

  }

  onFileChange(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file = fileList[0];
      if (file.size < 1048576) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          if (e.target.result) {
            this.avatarSrc = e.target.result;
          }
        };
        reader.readAsDataURL(file);
      } else {
        this.alertService.error('Dung lượng ảnh quá lớn! Vui lòng chọn ảnh dưới 1MB.');
      }
    }
  }

  openAvatarModal() {
    const modaRef = this.modalService.open(UserAvatarModalComponent);
  }
  clearAvatar() {
    this.avatarSrc = defaultAvatarSrc;
    //   this.uploadAvatar();
  }

  // uploadAvatar() {
  //   const imageBase64 = this.avatarSrc.split(',')[1];
  //   this.userService.upLoadAvatar(imageBase64).subscribe(result => {
  //     //this.sessionService.saveUserInfo(result);
  //     this.alertService.success('Cập nhật ảnh đại diện thành công!');
  //   });
  // }


  // resize(img, MAX_WIDTH: number, MAX_HEIGHT: number, callback) {
  //   // This will wait until the img is loaded before calling this function
  //   return img.onload = () => {
  //     // Get the images current width and height
  //     let width = img.width;
  //     let height = img.height;
  //     // Set the WxH to fit the Max values (but maintain proportions)
  //     if (width > height) {
  //       if (width > MAX_WIDTH) {
  //         height *= MAX_WIDTH / width;
  //         width = MAX_WIDTH;
  //       }
  //     } else {
  //       if (height > MAX_HEIGHT) {
  //         width *= MAX_HEIGHT / height;
  //         height = MAX_HEIGHT;
  //       }
  //     }
  //     // create a canvas object
  //     const canvas = document.createElement('canvas');
  //     // Set the canvas to the new calculated dimensions
  //     canvas.width = width;
  //     canvas.height = height;
  //     const ctx = canvas.getContext('2d');
  //     ctx.drawImage(img, 0, 0, width, height);
  //     // Get this encoded as a jpeg
  //     // IMPORTANT: 'jpeg' NOT 'jpg'
  //     const dataUrl = canvas.toDataURL('image/jpeg');
  //     // callback with the results
  //     callback(dataUrl, img.src.length, dataUrl.length);
  //   };
  // }

}
