import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidationSummaryComponent } from './validation-summary/validation-summary.component';
import { ListErrorsComponent } from './list-errors/index';
import { ConfirmationPopupComponent } from './confirmation-popup/confirmation-popup.component';
import { AlertComponent } from './alert/alert.component';
import { PaginationComponent } from './pagination/pagination.component';
import { SharedPipesModule } from '../pipes/shared-pipes.module';
import { FooterCopyrightComponent } from './footer-copyright/footer-copyright.component';
import { ConvertProspect2Component } from './convert-prospect2/convert-prospect2.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgbDropdownModule, NgbAlertModule, NgbModalModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationPopupCallAwayComponent } from './confirmation-popup-call-away/confirmation-popup-call-away.component';
import { FengShuisInforComponent } from './feng-shuis-infor/feng-shuis-infor.component';
import { PoupRejectPackageComponent } from './poup-reject-package/poup-reject-package.component';

@NgModule({
    imports: [
        CommonModule,
        SharedPipesModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        NgbDropdownModule.forRoot(),
        NgbAlertModule.forRoot(),
        NgbCollapseModule.forRoot(),
        NgbModalModule.forRoot(),
    ],
    declarations: [
        // AlertComponent,
        ValidationSummaryComponent,
        ListErrorsComponent,
        ConfirmationPopupComponent,
        PaginationComponent,
        FooterCopyrightComponent,
        ConvertProspect2Component,
        ConfirmationPopupCallAwayComponent,
        FengShuisInforComponent,
        PoupRejectPackageComponent,
    ],
    exports: [
        // AlertComponent,
        ValidationSummaryComponent,
        ListErrorsComponent,
        ConfirmationPopupComponent,
        PaginationComponent,
        FooterCopyrightComponent,
        ConvertProspect2Component,
        ConfirmationPopupCallAwayComponent,
        PoupRejectPackageComponent
    ],
    entryComponents: [
        ConfirmationPopupComponent,
        ConvertProspect2Component,
        ConfirmationPopupCallAwayComponent,
        FengShuisInforComponent,
        PoupRejectPackageComponent
    ]
})
export class SharedComponentsModule { }
