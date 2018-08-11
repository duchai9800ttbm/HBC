import { DataTablesModule } from 'angular-datatables';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateTimePickerModule } from 'ng-pick-datetime';
import { SharedComponentsModule } from './components/shared-components.module';
import { SharedPipesModule } from './pipes/shared-pipes.module';
import { CommentsModule } from './modules/comments/comments.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgbCollapseModule, NgbAlertModule, NgbDropdownModule, NgbModalModule, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { AutoCompleteModule, DropdownModule } from 'primeng/primeng';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
// tslint:disable-next-line:max-line-length
import { AuthGuard, ApiService, DataService, UserService } from './services/index';
import { SharedDirectivesModule } from './directives/shared-directives.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap/tooltip/tooltip.module';
import { MomentModule } from 'angular2-moment';
import { ActivitiesModule } from './modules/activities/activities.module';
import { AuditsModule } from './modules/audits/audits.module';
import { RouterModule } from '@angular/router';
import { FormInputModule } from './modules/form-input/form-input.module';
import { AuditsListModule } from './modules/audits-list/audits-list.module';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { GridModule } from '@progress/kendo-angular-grid';
import { WindowService } from './services/window.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FengShuisInforService } from './services/feng-shuis-infor.service';
import { PackageService } from './services/package.service';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { TagInputModule } from 'ngx-chips';
import { DocumentService } from './services/document.service';
import { ScrollToTopService } from './services/scroll-to-top.service';
import { OpportunityHsmtService } from './services/opportunity-hsmt.service';
import { DocumentReviewService } from './services/document-review.service';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { SettingService } from './services/setting.service';
import { MenuModule } from '@progress/kendo-angular-menu';
@NgModule({
    imports: [
        TagInputModule,
        FilterPipeModule,
        NgxSpinnerModule,
        AuditsListModule,
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        MomentModule,
        NgbCarouselModule.forRoot(),
        NgbDropdownModule.forRoot(),
        NgbAlertModule.forRoot(),
        NgbCollapseModule.forRoot(),
        NgbModalModule.forRoot(),
        NgbTooltipModule.forRoot(),
        AutoCompleteModule,
        DropdownModule,
        DataTablesModule,
        DateTimePickerModule,
        CommentsModule,
        ActivitiesModule,
        AuditsModule,
        FormInputModule,
        SharedComponentsModule,
        SharedPipesModule,
        SharedDirectivesModule,
        ButtonsModule,
        DialogsModule,
        GridModule,
        DropDownsModule,
        MenuModule
        // ScrollToTopService
    ],
    exports: [
        FilterPipeModule,
        NgxSpinnerModule,
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        MomentModule,
        NgbCarouselModule,
        NgbDropdownModule,
        NgbAlertModule,
        NgbCollapseModule,
        NgbModalModule,
        NgbTooltipModule,
        TranslateModule,
        DataTablesModule,
        AutoCompleteModule,
        DropdownModule,
        DateTimePickerModule,
        CommentsModule,
        ActivitiesModule,
        AuditsModule,
        FormInputModule,
        SharedComponentsModule,
        SharedPipesModule,
        SharedDirectivesModule,
        ButtonsModule,
        DialogsModule,
        GridModule,
        DropDownsModule,
        MenuModule
        // ScrollToTopService
    ],
    providers: [
        TranslateService,
        AuthGuard,
        ApiService,
        DataService,
        UserService,
        WindowService,
        FengShuisInforService,
        PackageService,
        DocumentService,
        ScrollToTopService,
        OpportunityHsmtService,
        DocumentReviewService,
        SettingService
    ],
})
export class SharedModule { }
