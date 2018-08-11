import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { CallCenterService } from '../services/call-center.service';
import { ConfirmationService } from '../services/confirmation.service';

@Directive({
  selector: '[appPhoneNumberCallable]'
})
export class PhoneNumberCallableDirective {
  @Input('appPhoneNumberCallable') phone: string;
  element: ElementRef;
  phoneNumber: string;
  constructor(
    el: ElementRef,
    private confirmationService: ConfirmationService,
    private callCenterService: CallCenterService
  ) {
    this.element = el;
    // this.element.nativeElement.style.color = '#478993';
    // this.element.nativeElement.style.cursor = 'pointer';
    // this.element.nativeElement.title = 'Bấm vào để gọi';
  }
  @HostListener('click') callAway() {
    // this.phoneNumber = this.element.nativeElement.innerText;
    // if (this.phoneNumber) {
    //   this.confirmationService
    //     .confirmCallAway(`Bạn có muốn thực hiện cuộc gọi đến số điện thoại : ${this.phoneNumber} không ?`,
    //       () => {
    //         this.callCenterService.call(this.phoneNumber).subscribe();
    //       });
    // }
    // if (this.phone) {
    //   this.confirmationService
    //     .confirmCallAway(`Bạn có muốn thực hiện cuộc gọi đến số điện thoại : ${this.phone} không ?`,
    //       () => {
    //         this.callCenterService.call(this.phone).subscribe();
    //       });
    // }

  }

}
