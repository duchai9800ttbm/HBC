import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VnCurrencyPipe } from './vn-currency-pipe.module';
import { FromNowPipe } from './from-now-pipes.module';
import { TimesPipe } from './times-pipe.module';
import { ShortenedName } from './shortened-name-pipe.module';
import { VnNumberPipe } from './vn-number-pipe.module';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        VnCurrencyPipe,
        FromNowPipe,
        TimesPipe,
        ShortenedName,
        VnNumberPipe
    ],
    exports: [
        VnCurrencyPipe,
        FromNowPipe,
        TimesPipe,
        ShortenedName,
        VnNumberPipe
    ],
})
export class SharedPipesModule { }
