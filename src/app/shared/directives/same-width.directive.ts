import {
    Directive,
    Input,
    AfterViewChecked,
    ElementRef,
    HostListener
} from '@angular/core';

@Directive({
    selector: '[appSameWidth]'
})
export class SameWidthDirective implements AfterViewChecked {
    @Input()
    appSameWidth: any;

    constructor(private el: ElementRef) {}

    ngAfterViewChecked() {
        // call our matchWidth function here later
        this.matchWidth(this.el.nativeElement, this.appSameWidth);
    }

    @HostListener('window:resize')
    onResize() {
        // call our matchWidth function here later
        this.matchWidth(this.el.nativeElement, this.appSameWidth);
    }

    matchWidth(parent: HTMLElement, className: string) {
        // match width logic here
        if (!parent) {
          return;
        }
        const children = document.getElementsByClassName(className);
        // find max width
        const maxwidth = parent.offsetWidth;

        if (!children) {
          return;
        }

        // reset all children width
        Array.from(children).forEach((x: HTMLElement) => {
            x.style.width = 'initial';
        });

        // gather all width
        const itemwidths = Array.from(children).map(
            x => x.getBoundingClientRect().width
        );

        // apply max width
        Array.from(children).forEach(
            (x: HTMLElement) => (x.style.width = `${maxwidth}px`)
        );
    }
}
