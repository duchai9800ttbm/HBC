import { Directive, AfterViewChecked, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appSquareBox]'
})
export class SquareBoxDirective implements AfterViewChecked {

  constructor(private el: ElementRef) { }

  ngAfterViewChecked(): void {
    this.matchWidth(this.el.nativeElement);
  }

  @HostListener('window:resize')
    onResize() {
        // call our matchWidth function here later
        this.matchWidth(this.el.nativeElement);
    }

    matchWidth(parent: HTMLElement) {
        // match width logic here
        if (!parent) {
          return;
        }
        // find width
        const width = parent.offsetWidth;
        parent.style.height = `${width}px`;
    }

}
