import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-setting-kpi-target',
  templateUrl: './setting-kpi-target.component.html',
  styleUrls: ['./setting-kpi-target.component.scss']
})
export class SettingKpiTargetComponent implements OnInit {
  isCollapseMenu = false;
  idReport = 'group-config';
  widthReport: number;
  urlArray = ['group-config', 'kpi-chair', 'group-config', 'win-bid', 'kpi-area', 'construction-items', 'type-construction'];
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
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
    // console.log('url-child', this.activatedRoute.snapshot.children[0].routeConfig.path);
    // console.log('query-param', this.activatedRoute.snapshot.queryParamMap.get('action'));
    if (this.activatedRoute.snapshot.children[0].routeConfig.path !== `${childUrl}`) {
      this.router.navigate([`/settings/kpi-target/${childUrl}`],
        {
          queryParams: { action: 'view' }
        });
    }
  }

}
