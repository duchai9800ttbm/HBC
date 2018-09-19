import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appInputNumberInteger]'
})
export class InputNumberIntegerDirective {

  constructor() { }
  getKey(e: KeyboardEvent) {
    return e.keyCode || e.charCode;
  }

  getCharCode(e: KeyboardEvent) {
    return e.charCode || e.keyCode || e.which;
  }

  @HostListener('keypress', ['$event'])
  onKeyPress(e: KeyboardEvent) {

    if (e.ctrlKey || e.altKey) {
      return;
    }
    const c = this.getCharCode(e);
    const cc = String.fromCharCode(c);
    let ok = true;
    ok = /[\d]/.test(cc);
    if (!ok) {
      e.preventDefault();
    }
  }
}
