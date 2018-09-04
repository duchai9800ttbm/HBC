import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputNumberDirective } from './input-number.directive';
import { InputMoneyDirective } from './input-money.directive';
import { VnCurrencyPipe } from '../pipes/vn-currency-pipe.module';
import { PhoneNumberCallableDirective } from './phone-number-callable.directive';
import { SameWidthDirective } from './same-width.directive';
import { InputAreaDirective } from './input-area.directive';
import { NumberAreaPipe } from '../pipes/number-area.pipe';
import { SquareBoxDirective } from './square-box.directive';
import { TextEllipsisDirective } from './text-ellipsis.directive';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        InputNumberDirective,
        InputMoneyDirective,
        PhoneNumberCallableDirective,
        SameWidthDirective,
        InputAreaDirective,
        SquareBoxDirective,
        TextEllipsisDirective
    ],
    exports: [
        InputNumberDirective,
        InputMoneyDirective,
        PhoneNumberCallableDirective,
        SameWidthDirective,
        InputAreaDirective,
        SquareBoxDirective,
        TextEllipsisDirective
    ],
    providers: [
        VnCurrencyPipe,
        NumberAreaPipe
    ]
})
export class SharedDirectivesModule { }