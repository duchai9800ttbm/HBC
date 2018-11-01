import {
  Directive,
  OnInit,
  ViewContainerRef,
  HostListener,
  Renderer,
  ElementRef
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { VnCurrencyPipeNoPlaceholder } from '../pipes/vn-currency-pipe-noplaceholder.module';

@Directive({
  selector: '[appInputMoneyNoplaceholder]',
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '(blur)': 'formatInputValue($event.target.value)',
    '(focus)': 'formatToNumber($event.target.value)',
    // '(load)': 'formatInputValue($event.target.value)',
  }
})
export class InputMoneyNoplaceholderDirective implements OnInit {
  constructor(
    private el: ElementRef,
    private renderer: Renderer,
    private ngControl: NgControl,
    private vnCurrencyPipeNoPlaceholder: VnCurrencyPipeNoPlaceholder,
  ) {
    // this.renderer.setElementAttribute(this.el.nativeElement, 'maxlength', PHONE_NUMBER_MAX_LENGHT);
    this.renderer.setElementAttribute(this.el.nativeElement, 'onkeypress', 'return event.charCode >= 48 && event.charCode <= 57');
    // this.renderer.setElementAttribute(this.el.nativeElement, 'type', 'number');
    this.renderer.setElementAttribute(this.el.nativeElement, 'maxlength', '13');
  }


  ngOnInit() {
    this.ngControl.valueAccessor.writeValue(this.vnCurrencyPipeNoPlaceholder.transform(this.ngControl.value));
  }

  formatInputValue(value) {
    this.ngControl.valueAccessor.writeValue(this.vnCurrencyPipeNoPlaceholder.transform(value));
  }

  formatToNumber(value) {
    this.ngControl.valueAccessor.writeValue(this.vnCurrencyPipeNoPlaceholder.parse(value));
  }
}
