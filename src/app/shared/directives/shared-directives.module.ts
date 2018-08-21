import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputNumberDirective } from './input-number.directive';
import { InputMoneyDirective } from './input-money.directive';
import { VnCurrencyPipe } from '../pipes/vn-currency-pipe.module';
import { PhoneNumberCallableDirective } from './phone-number-callable.directive';
import { SameWidthDirective } from './same-width.directive';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        InputNumberDirective,
        InputMoneyDirective,
        PhoneNumberCallableDirective,
        SameWidthDirective,
    ],
    exports: [
        InputNumberDirective,
        InputMoneyDirective,
        PhoneNumberCallableDirective,
        SameWidthDirective
    ],
    providers: [
        VnCurrencyPipe,
    ]
})
export class SharedDirectivesModule { }