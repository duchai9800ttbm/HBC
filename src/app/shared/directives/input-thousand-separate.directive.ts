import {
  Directive,
  OnInit,
  ViewContainerRef,
  HostListener,
  Renderer,
  ElementRef
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { ThousandSeparate } from '../pipes/thoudand-separate.module';

@Directive({
  selector: '[appInputThousandSeparate]',
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '(blur)': 'formatInputValue($event.target.value)',
    '(focus)': 'formatToNumber($event.target.value)',
    // '(load)': 'formatInputValue($event.target.value)',
  }
})
export class InputThousandSeparateDirective implements OnInit {
  constructor(
    private el: ElementRef,
    private renderer: Renderer,
    private ngControl: NgControl,
    private thousandSeparate: ThousandSeparate,
  ) {
    this.renderer.setElementAttribute(this.el.nativeElement, 'onkeypress', 'return event.charCode >= 48 && event.charCode <= 57');
    this.renderer.setElementAttribute(this.el.nativeElement, 'maxlength', '17');
  }


  ngOnInit() {
    this.ngControl.valueAccessor.writeValue(this.thousandSeparate.transform(this.ngControl.value));
  }

  formatInputValue(value) {
    this.ngControl.valueAccessor.writeValue(this.thousandSeparate.transform(value));
  }

  formatToNumber(value) {
    this.ngControl.valueAccessor.writeValue(this.thousandSeparate.parse(value));
  }
}
