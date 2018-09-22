import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appAutoFocus]'
})
export class AutoFocusDirective implements OnInit {

  @Input() appAutofocus: boolean;
  private el: any;
  constructor(
    private elementRef: ElementRef,
  ) {
    this.el = this.elementRef.nativeElement;
  }

  ngOnInit() {
    // this.el.focus();
  }
}
