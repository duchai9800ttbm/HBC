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
import { NotificationListComponent } from './notification-list/notification-list.component';
import { MenuComponent } from './components/menu/menu.component';
import { ProspectService } from '../shared/services';
import { GroupUserService } from '../shared/services/group-user.service';
import { ChangeListComponent } from './change-list/change-list.component';

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
        NotificationListComponent,
        MenuComponent,
        ChangeListComponent,
    ],
    entryComponents: [
        ChangePasswordModalComponent,
    ],
    providers: [
        ProspectService,
        GroupUserService
    ]
})
export class LayoutModule { }
