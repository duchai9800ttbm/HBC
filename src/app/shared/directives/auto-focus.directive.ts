import { Directive, ElementRef, Input, OnInit, Attribute } from '@angular/core';

@Directive({
    selector: '[appAutoFocus]'
})
export class AutoFocusDirective implements OnInit {
  @Input('appAutoFocus') appAutoFocus: boolean;
    private el: any;
    constructor(
        private elementRef: ElementRef
    ) {
        this.el = this.elementRef.nativeElement;
    }

    ngOnInit() {
        if (this.appAutoFocus + '' === '') {
          this.el.focus();
        } else if (this.appAutoFocus) {
          this.el.focus();
        }
    }
}
