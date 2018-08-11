import { NgModule } from '@angular/core';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { HttpModule } from '@angular/http';
import { SharedModule } from '../shared/shared.module';
import { ChangePasswordModalComponent } from './components/change-password-modal/change-password-modal.component';
import { HeaderMenuComponent } from './components/header/header-menu/header-menu.component';
import { HeaderNotificationComponent } from './components/header/header-notification/header-notification.component';
import { HeaderUserMenuComponent } from './components/header/header-user-menu/header-user-menu.component';
import { FooterComponent } from './components/footer/footer.component';
import { ChangeListComponent } from './change-list/change-list.component';
import { NotificationListComponent } from './notification-list/notification-list.component';
import { MenuComponent } from './components/menu/menu.component';
import { CallCenterComponent } from './call-center/call-center.component';
import { AnonymousComponent } from './call-center/anonymous/anonymous.component';
import { ProspectCallComponent } from './call-center/prospect-call/prospect-call.component';
import { ContactCustomerComponent } from './call-center/contact-customer/contact-customer.component';
import { CustomerCallComponent } from './call-center/customer-call/customer-call.component';
import { ContactCallComponent } from './call-center/contact-call/contact-call.component';
import { CallCenterService } from '../shared/services/call-center.service';
import { OpportunityService, ContactService, CustomerService, ProspectService } from '../shared/services';
import { CallCenterHistoryComponent } from './call-center-history/call-center-history.component';
import { AnonymousHistoryComponent } from './call-center-history/anonymous-history/anonymous-history.component';
import { ContactHistoryComponent } from './call-center-history/contact-history/contact-history.component';
import { ContactCustomerHistoryComponent } from './call-center-history/contact-customer-history/contact-customer-history.component';
import { CustomerHistoryComponent } from './call-center-history/customer-history/customer-history.component';
import { ProspectHistoryComponent } from './call-center-history/prospect-history/prospect-history.component';
import { CallCenterHistoryService } from '../shared/services/call-center-history.service';
import { ConvertProspectModalComponent } from './prospect/prospect-detail/convert-prospect-modal/convert-prospect-modal.component';
import { CallAwayComponent } from './call-away/call-away.component';
import { DeliveryReceiptWindowComponent } from './delivery-receipt-window/delivery-receipt-window.component';
import { DetaildRevenueWindowComponent } from './detaild-revenue-window/detaild-revenue-window.component';
import { BrowserAnimationsModule } from '../../../node_modules/@angular/platform-browser/animations';
import { GroupUserService } from '../shared/services/group-user.service';

@NgModule({
    imports: [
        LayoutRoutingModule,
        HttpModule,
        SharedModule,
    ],
    declarations: [
        LayoutComponent,
        SidebarComponent,
        HeaderComponent,
        ChangePasswordModalComponent,
        HeaderMenuComponent,
        HeaderNotificationComponent,
        HeaderUserMenuComponent,
        FooterComponent,
        ChangeListComponent,
        NotificationListComponent,
        MenuComponent,
        CallCenterComponent,
        AnonymousComponent,
        ProspectCallComponent,
        ContactCustomerComponent,
        CustomerCallComponent,
        ContactCallComponent,
        CallCenterHistoryComponent,
        AnonymousHistoryComponent,
        ContactHistoryComponent,
        ContactCustomerHistoryComponent,
        CustomerHistoryComponent,
        ProspectHistoryComponent,
        CallAwayComponent,
        DeliveryReceiptWindowComponent,
        DetaildRevenueWindowComponent
    ],
    entryComponents: [
        ChangePasswordModalComponent,
    ],
    providers: [
        CallCenterService,
        OpportunityService,
        ContactService,
        CustomerService,
        ProspectService,
        CallCenterHistoryService,
        GroupUserService
    ]
})
export class LayoutModule { }
