import {
    Directive,
    ElementRef,
    HostListener,
    Input,
    OnInit,
    Renderer
} from '@angular/core';
import { NgControl } from '../../../../node_modules/@angular/forms';
import { VnCurrencyPipe } from '../pipes/vn-currency-pipe.module';
const PADDING = '000000';
@Directive({
    selector: '[appInputNumberNegativeDecimal]',
    // tslint:disable-next-line:use-host-property-decorator
    host: {
        '(blur)': 'formatInputValue($event.target.value)',
        '(focus)': 'formatToNumber($event.target.value)',
    }
})
export class InputNumberNegativeDecimalDirective implements OnInit {
    @Input('negative')
    negative: boolean;
    @Input('decimal')
    decimal: boolean;
    @Input('min')
    min: number;
    @Input('max')
    max: number;
    private DECIMAL_SEPARATOR: string;
    private THOUSANDS_SEPARATOR: string;
    private CURRENCY_UNIT: string;
    constructor(
        private _el: ElementRef,
        private ngControl: NgControl,
        private vnCurrencyPipe: VnCurrencyPipe,
        private renderer: Renderer,
    ) {
        this.DECIMAL_SEPARATOR = '.';
        this.THOUSANDS_SEPARATOR = ',';
        this.CURRENCY_UNIT = ' đ';
        this.renderer.setElementAttribute(this._el.nativeElement, 'maxlength', '18');
    }

    ngOnInit() {
        this.ngControl.valueAccessor.writeValue(this.transformNotDenominations(this.ngControl.value));
    }

    formatInputValue(value) {
        this.ngControl.valueAccessor.writeValue(this.transformNotDenominations(value));
    }

    formatToNumber(value) {
        this.ngControl.valueAccessor.writeValue(this.vnCurrencyPipe.parse(value));
    }

    transformNotDenominations(value: number | string, fractionSize: number = 2): string {
        if (!value) { return ''; }
        if (isNaN(+value)) { return value.toString(); }
        let [integer, fraction = ''] = (+value).toString()
            .split(this.DECIMAL_SEPARATOR);
        fraction = fractionSize > 0
            ? this.DECIMAL_SEPARATOR + (fraction + PADDING).substring(0, fractionSize)
            : '';
        integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, this.THOUSANDS_SEPARATOR);
        return integer + fraction;
    }

    parse(value: string, fractionSize: number = 2): number {
        if (!isNaN(+value)) { return +value; }
        let integer = (value || '').replace(this.CURRENCY_UNIT, '');
        integer = integer.split(this.THOUSANDS_SEPARATOR).join('');
        return +integer;
    }

    @HostListener('input', ['$event'])
    onInputChange(event) {
        let regex = null;
        if (this.decimal) {
            regex = /[^0-9\.]*/g;
        } else {
            regex = /[^0-9]*/g;
        }
        let initalValue = this._el.nativeElement.value as String;
        const l = initalValue.match(/\./g) || [];
        // chỉ cho nhập 1 dấu .
        if (l.length === 2) {
            initalValue = initalValue.substring(0, initalValue.length - 1);
        }
        let valueReplace = initalValue.replace(regex, '');
        if (initalValue.includes('-') && this.negative) {
            valueReplace = '-' + valueReplace;
        }
        if (
            (valueReplace.substring(0, 1) === '-' &&
                valueReplace.substring(1, 1) === '0' &&
                Number(valueReplace) >= 1) ||
            (valueReplace.substring(0, 1) === '0' && Number(valueReplace) >= 1)
        ) {
            valueReplace = valueReplace.replace('0', '');
        }
        if (this.min && Number(valueReplace) < this.min) {
            valueReplace = this.min + '';
        }
        if (this.max && Number(valueReplace) > this.max) {
            valueReplace = this.max + '';
        }
        this._el.nativeElement.value = valueReplace;
        if (initalValue !== this._el.nativeElement.value) {
            // event.stopPropagation();
        }
    }

    @HostListener('keypress', ['$event'])
    onKeyPress(e: KeyboardEvent) {
        const initalValue = this._el.nativeElement.value as String;
        const l = initalValue.match(/\./g) || [];
        // chỉ cho nhập 1 dấu .
        if (l.length === 1 && e.key === '.') {
            e.preventDefault();
        }
    }

}
