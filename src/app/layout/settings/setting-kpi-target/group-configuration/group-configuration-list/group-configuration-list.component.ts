import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-group-configuration-list',
  templateUrl: './group-configuration-list.component.html',
  styleUrls: ['./group-configuration-list.component.scss']
})
export class GroupConfigurationListComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  createGroupConfig() {
    this.router.navigate([`/settings/kpi-target/group-config/create`]);
  }

  editGroupConfig(id: number) {
    this.router.navigate([`/settings/kpi-target/group-config/edit/${id}`]);
  }
}
