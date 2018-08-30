import { NgModule } from '@angular/core';
import { CommonModule, LocationStrategy, HashLocationStrategy } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard, SessionService, ConfirmationService, InstantSearchService, UserNotificationService } from './shared/services';
import { AlertService } from './shared/services';
import { HttpModule } from '@angular/http';
import { SharedModule } from './shared/shared.module';
import { AlertComponent } from './shared/components/alert/alert.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { StarRatingModule } from 'angular-star-rating';
import { DataUploadService } from './shared/services/data-upload.service';
import { GroupUserService } from './shared/services/group-user.service';
import { LiveformDataReportService } from './shared/services/liveform-data-report.service';
// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient) {
    // for development
    // return new TranslateHttpLoader(http, '/start-angular/SB-Admin-BS4-Angular-5/master/dist/assets/i18n/', '.json');
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    imports: [
        StarRatingModule.forRoot(),
        CommonModule,
        SharedModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        }),
        AppRoutingModule,
        NgxSpinnerModule
    ],
    declarations: [AppComponent, AlertComponent],
    bootstrap: [AppComponent],
    providers: [
        AlertService,
        SessionService,
        ConfirmationService,
        InstantSearchService,
        UserNotificationService,
        LiveformDataReportService,
        DataUploadService,
        { provide: LocationStrategy, useClass: HashLocationStrategy }
    ],
})
export class AppModule { }
