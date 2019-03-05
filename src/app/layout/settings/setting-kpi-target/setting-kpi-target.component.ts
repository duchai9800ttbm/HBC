import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserModel } from '../../../shared/models/user/user.model';
import { SessionService } from '../../../shared/services';

@Component({
  selector: 'app-setting-kpi-target',
  templateUrl: './setting-kpi-target.component.html',
  styleUrls: ['./setting-kpi-target.component.scss']
})
export class SettingKpiTargetComponent implements OnInit {
  @ViewChild('tabOptionKpiType') tabOptionKpiType: ElementRef;
  isCollapseMenu = false;
  idReport = 'group-config';
  widthReport: number;
  urlArray = ['group-config', 'kpi-chair', 'group-config', 'win-bid', 'kpi-area', 'construction-items', 'type-construction'];
  userModel: UserModel;
  listPrivileges = [];
  isManageKPISettings;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sessionService: SessionService
  ) { }

  ngOnInit() {
    this.userModel = this.sessionService.userInfo;
    this.listPrivileges = this.userModel.privileges;
    this.isManageKPISettings = this.listPrivileges.some(x => x === 'ManageKPISettings');
    if (!this.isManageKPISettings) {
      this.router.navigate(['/no-permission']);
    }
    this.checkActiveTab();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.widthReport = document.getElementById('wrapper-report').offsetWidth;
    if (this.widthReport <= 940) {
      document.getElementById('wrapper-report').classList.add('flex-column');
      document.getElementById('menu-report').classList.add('mb-2');
      document.getElementById('menu-report').classList.add('menu-report--fixed');
      document.getElementById('reports-table').classList.remove('pl-3');
      document.getElementById('reports-table').classList.add('reports--margintop');
      document.getElementById('content-child').classList.remove('px-3');
      this.isCollapseMenu = true;
      const listReports = document.getElementsByName('list-report');
      for (let i = 0; i < listReports.length; i++) {
        if (listReports[i].id === this.idReport) {
          (<HTMLLIElement>listReports[i]).classList.add('menu-report__toggle');
        }
        if (listReports[i].id !== this.idReport) {
          (<HTMLLIElement>listReports[i]).classList.add('d-none');
        }
      }


    }
    if (this.widthReport > 940) {
      document.getElementById('wrapper-report').classList.remove('flex-column');
      document.getElementById('menu-report').classList.remove('mb-2');
      document.getElementById('menu-report').classList.remove('menu-report--fixed');
      document.getElementById('reports-table').classList.add('pl-3');
      document.getElementById('reports-table').classList.remove('reports--margintop');
      document.getElementById('content-child').classList.add('px-3');
      this.isCollapseMenu = false;
      const listReports = document.getElementsByName('list-report');
      for (let i = 0; i < listReports.length; i++) {
        if (listReports[i].id === this.idReport) {
          (<HTMLLIElement>listReports[i]).classList.remove('menu-report__toggle');
        }
        if (listReports[i].id !== this.idReport) {
          (<HTMLLIElement>listReports[i]).classList.remove('d-none');
        }
      }

    }
  }

  @HostListener('document:click', ['$event'])
  public documentClick(event: any): void {
    if (this.contains(event.target)) {
    }
    if (!this.contains(event.target)) {
      if (this.widthReport <= 940) {
        this.isCollapseMenu = false;
        this.collapseMenu();
      }
    }
  }

  contains(target: any): boolean {
    return this.tabOptionKpiType.nativeElement.contains(target) ||
      (this.tabOptionKpiType ? this.tabOptionKpiType.nativeElement.contains(target) : false);
  }

  checkActiveTab() {
    this.urlArray.forEach(item => {
      if (this.router.url.includes(item)) {
        this.idReport = item;
        return;
      }
    });
  }

  toggleCollapseMenu(idreport) {
    this.widthReport = document.getElementById('wrapper-report').offsetWidth;
    this.idReport = idreport;
    if (this.widthReport <= 940) {
      this.collapseMenu();
    }
  }

  collapseMenu() {
    this.isCollapseMenu = !this.isCollapseMenu;
    const listReports = document.getElementsByName('list-report');
    if (this.isCollapseMenu) {
      for (let i = 0; i < listReports.length; i++) {
        if (listReports[i].id === this.idReport) {
          (<HTMLLIElement>listReports[i]).classList.add('menu-report__toggle');
        }
        if (listReports[i].id !== this.idReport) {
          (<HTMLLIElement>listReports[i]).classList.add('d-none');
        }
      }
    }
    if (!this.isCollapseMenu) {
      for (let i = 0; i < listReports.length; i++) {
        if (listReports[i].id === this.idReport) {
          (<HTMLLIElement>listReports[i]).classList.remove('menu-report__toggle');
        }
        if (listReports[i].id !== this.idReport) {
          (<HTMLLIElement>listReports[i]).classList.remove('d-none');
        }
      }
    }
  }

  routerChildTab(childUrl: string) {
    if (this.activatedRoute.snapshot.children[0].routeConfig.path !== `${childUrl}`) {
      this.router.navigate([`/settings/kpi-target/${childUrl}`],
        {
          queryParams: { action: 'view' }
        });
    }
  }

}
