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
import { VnCurrencyPipe } from '../pipes/vn-currency-pipe.module';
import { NumberAreaPipe } from '../pipes/number-area.pipe';

@Directive({
    selector: '[appInputArea]',
    // tslint:disable-next-line:use-host-property-decorator
    host: {
        '(blur)': 'formatInputValue($event.target.value)',
        '(focus)': 'formatToNumber($event.target.value)',
        // '(load)': 'formatInputValue($event.target.value)',
    }
})
export class InputAreaDirective implements OnInit {

    constructor(
        private el: ElementRef,
        private renderer: Renderer,
        private viewContainer: ViewContainerRef,
        private ngControl: NgControl,
    //    private vnCurrencyPipe: VnCurrencyPipe,
        private numberArea: NumberAreaPipe
    ) {
        // this.renderer.setElementAttribute(this.el.nativeElement, 'maxlength', PHONE_NUMBER_MAX_LENGHT);
        this.renderer.setElementAttribute(this.el.nativeElement,
            'onkeypress', 'return ( ( event.charCode >= 48 && event.charCode <= 57 ) )');
            // || (event.charCode === 44)
        // this.renderer.setElementAttribute(this.el.nativeElement, 'type', 'number');
        this.renderer.setElementAttribute(this.el.nativeElement, 'maxlength', '13');
    }


    ngOnInit() {
        this.ngControl.valueAccessor.writeValue(this.numberArea.transform(this.ngControl.value));
    }

    // ngAfterViewInit() {
    //     this.ngControl.valueAccessor.writeValue(this.vnCurrencyPipe.transform(value));
    // }

    formatInputValue(value) {
        this.ngControl.valueAccessor.writeValue(this.numberArea.transform(value));
    }

    formatToNumber(value) {
        this.ngControl.valueAccessor.writeValue(this.numberArea.parse(value));
        // this.ngControl.valueAccessor.writeValue(this.numberArea.parseDouble(value));
    }
}
