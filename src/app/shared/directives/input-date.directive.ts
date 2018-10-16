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
    selector: '[appInputDate]',
    // tslint:disable-next-line:use-host-property-decorator
    host: {
        '(blur)': 'formatInputValue($event.target.value)',
        '(focus)': 'formatToNumber($event.target.value)',
        // '(load)': 'formatInputValue($event.target.value)',
    }
})
export class InputDateDirective implements OnInit {
    DECIMAL_SEPARATOR = '.';
    THOUSANDS_SEPARATOR = ',';
    CURRENCY_UNIT = ' ngày';
    PADDING = '000000';
    constructor(
        private el: ElementRef,
        private renderer: Renderer,
        private viewContainer: ViewContainerRef,
        private ngControl: NgControl,
        private numberArea: NumberAreaPipe
    ) {
        this.renderer.setElementAttribute(this.el.nativeElement,
            'onkeypress', 'return ( ( event.charCode >= 48 && event.charCode <= 57 ) || (event.charCode === 46) )');
        this.renderer.setElementAttribute(this.el.nativeElement, 'maxlength', '16');
    }


    ngOnInit() {
        this.ngControl.valueAccessor.writeValue(this.numberArea.transform(this.ngControl.value));
    }

    transform(value: number | string, fractionSize: number = 0): string {
        if (!value) { return '0' + this.CURRENCY_UNIT; }
        if (isNaN(+value)) { return value.toString(); }
        let [integer, fraction = ''] = (+value).toString()
            .split(this.DECIMAL_SEPARATOR);
        fraction = fractionSize > 0
            ? this.DECIMAL_SEPARATOR + (fraction + this.PADDING).substring(0, fractionSize)
            : '';
        integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, this.THOUSANDS_SEPARATOR);
        return integer + fraction + (integer && this.CURRENCY_UNIT);
    }

    parse(value: string, fractionSize: number = 0): number {
        if (!isNaN(+value)) { return +value; }
        let integer = (value || '').replace(this.CURRENCY_UNIT, '');
        integer = integer.split(this.THOUSANDS_SEPARATOR).join('');
        return +integer;
    }

    formatInputValue(value) {
        this.ngControl.valueAccessor.writeValue(this.transform(value));
    }

    formatToNumber(value) {
        this.ngControl.valueAccessor.writeValue(this.parse(value));
    }
}
