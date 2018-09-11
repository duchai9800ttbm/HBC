import { Directive, ElementRef, HostListener, AfterViewChecked } from '@angular/core';

@Directive({
  selector: '[appWidthAuto]'
})
export class WidthAutoDirective implements AfterViewChecked {

  constructor(private el: ElementRef) {}

  ngAfterViewChecked(): void {
      this.matchWidth(this.el.nativeElement);
  }

  @HostListener('window:resize')
  onResize() {
      // call our matchWidth function here later
      this.matchWidth(this.el.nativeElement);
  }

  matchWidth(parent: HTMLElement) {
      if (!parent) {
          return;
      }
      parent.style.width = `auto`;
  }
}
