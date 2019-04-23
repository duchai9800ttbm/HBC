import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
  HostListener,
  Renderer,
  ElementRef
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { NumberAreaPipeNoplaceholder } from '../pipes/number-area-noplaceholer.pipe';

@Directive({
  selector: '[appInputAreaNoplaceholder]',
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '(blur)': 'formatInputValue($event.target.value)',
    '(focus)': 'formatToNumber($event.target.value)',
    // '(load)': 'formatInputValue($event.target.value)',
  }
})
export class InputAreaNoplaceholderDirective implements OnInit {
  constructor(
    private el: ElementRef,
    private renderer: Renderer,
    private viewContainer: ViewContainerRef,
    private ngControl: NgControl,
    //    private vnCurrencyPipe: VnCurrencyPipe,
    private numberAreaPipeNoplaceholder: NumberAreaPipeNoplaceholder
  ) {
    // this.renderer.setElementAttribute(this.el.nativeElement, 'maxlength', PHONE_NUMBER_MAX_LENGHT);
    this.renderer.setElementAttribute(this.el.nativeElement,
      'onkeypress', 'return ( ( event.charCode >= 48 && event.charCode <= 57 ) || (event.charCode === 46) )');
    // || (event.charCode === 44)
    // this.renderer.setElementAttribute(this.el.nativeElement, 'type', 'number');
    this.renderer.setElementAttribute(this.el.nativeElement, 'maxlength', '16');
  }


  ngOnInit() {
    this.ngControl.valueAccessor.writeValue(this.numberAreaPipeNoplaceholder.transform(this.ngControl.value));
  }

  formatInputValue(value) {
    this.ngControl.valueAccessor.writeValue(this.numberAreaPipeNoplaceholder.transform(value));
  }

  formatToNumber(value) {
    this.ngControl.valueAccessor.writeValue(this.numberAreaPipeNoplaceholder.parse(value));
  }
}
