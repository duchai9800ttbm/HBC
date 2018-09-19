import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import '@progress/kendo-ui';
import { NgxSpinnerService } from 'ngx-spinner';
import { PackageService } from '../../../../../../shared/services/package.service';
import { PackageInfoModel } from '../../../../../../shared/models/package/package-info.model';
import { PackageDetailComponent } from '../../../package-detail.component';
import { DATATABLE_CONFIG } from '../../../../../../shared/configs';
import { Subject } from 'rxjs';

declare let kendo: any;

@Component({
  selector: 'app-information-deployment-form',
  templateUrl: './information-deployment-form.component.html',
  styleUrls: ['./information-deployment-form.component.scss']
})
export class InformationDeploymentFormComponent implements OnInit {

  @ViewChild('ganttChart') ganttChart: ElementRef;
  bidOpportunityId;
  packageInfo: PackageInfoModel;
  dtOptions: any = DATATABLE_CONFIG;
  dtTrigger: Subject<any> = new Subject();
  fakeArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  private readonly serviceRoot = 'https://demos.telerik.com/kendo-ui/service';
  private readonly tasksDataSource = new kendo.data.GanttDataSource({
      transport: {
          read: {
              url: this.serviceRoot + '/GanttTasks',
              dataType: 'jsonp'
          },
          update: {
              url: this.serviceRoot + '/GanttTasks/Update',
              dataType: 'jsonp'
          },
          destroy: {
              url: this.serviceRoot + '/GanttTasks/Destroy',
              dataType: 'jsonp'
          },
          create: {
              url: this.serviceRoot + '/GanttTasks/Create',
              dataType: 'jsonp'
          },
          parameterMap: function(options, operation) {
              if (operation !== 'read') {
                  return { models: kendo.stringify(options.models || [options]) };
              }
          }
      },
      schema: {
          model: {
              id: 'id',
              fields: {
                  id: { from: 'ID', type: 'number' },
                  orderId: { from: 'OrderID', type: 'number', validation: { required: true } },
                  parentId: { from: 'ParentID', type: 'number', defaultValue: null, validation: { required: true } },
                  start: { from: 'Start', type: 'date' },
                  end: { from: 'End', type: 'date' },
                  title: { from: 'Title', defaultValue: '', type: 'string' },
                  percentComplete: { from: 'PercentComplete', type: 'number' },
                  summary: { from: 'Summary', type: 'boolean' },
                  expanded: { from: 'Expanded', type: 'boolean', defaultValue: true }
              }
          }
      }
  });

  private readonly dependenciesDataSource = new kendo.data.GanttDependencyDataSource({
      transport: {
          read: {
              url: this.serviceRoot + '/GanttDependencies',
              dataType: 'jsonp'
          },
          update: {
              url: this.serviceRoot + '/GanttDependencies/Update',
              dataType: 'jsonp'
          },
          destroy: {
              url: this.serviceRoot + '/GanttDependencies/Destroy',
              dataType: 'jsonp'
          },
          create: {
              url: this.serviceRoot + '/GanttDependencies/Create',
              dataType: 'jsonp'
          },
          parameterMap: function(options, operation) {
              if (operation !== 'read') {
                  return { models: kendo.stringify(options.models || [options]) };
              }
          }
      },
      schema: {
          model: {
              id: 'id',
              fields: {
                  id: { from: 'ID', type: 'number' },
                  predecessorId: { from: 'PredecessorID', type: 'number' },
                  successorId: { from: 'SuccessorID', type: 'number' },
                  type: { from: 'Type', type: 'number' }
              }
          }
      }
  });
  constructor(
    private spinner: NgxSpinnerService,
    private packageService: PackageService
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.dtTrigger.next();
    });
    this.bidOpportunityId = PackageDetailComponent.packageId;
    this.spinner.show();
            this.packageService
                .getInforPackageID(this.bidOpportunityId)
                .subscribe(data => {
                    this.packageInfo = data;
                    this.spinner.hide();
                    console.log(this.packageInfo);
                });
    kendo.jQuery(this.ganttChart.nativeElement).kendoGantt({
    //   dataSource: this.tasksDataSource,
      dataSource: [
        {
          id: 1,
          orderId: 0,
          parentId: null,
          title: 'Task1',
          start: new Date('2014/6/17 9:00'),
          end: new Date('2014/6/17 11:00')
        },
        {
          id: 2,
          orderId: 1,
          parentId: null,
          title: 'Task2',
          start: new Date('2014/6/17 12:00'),
          end: new Date('2014/6/17 14:00')
        },
        {
          id: 3,
          orderId: 2,
          parentId: null,
          title: 'Task3',
          start: new Date('2014/6/17 13:00'),
          end: new Date('2014/6/17 15:00')
        },
        {
            id: 1,
            orderId: 0,
            parentId: null,
            title: 'Task1',
            start: new Date('2014/6/17 9:00'),
            end: new Date('2014/6/17 11:00')
          },
          {
            id: 2,
            orderId: 1,
            parentId: null,
            title: 'Task2',
            start: new Date('2014/6/17 12:00'),
            end: new Date('2014/6/17 14:00')
          },
          {
            id: 3,
            orderId: 2,
            parentId: null,
            title: 'Task3',
            start: new Date('2014/6/17 13:00'),
            end: new Date('2014/6/17 15:00')
          },
          {
            id: 1,
            orderId: 0,
            parentId: null,
            title: 'Task1',
            start: new Date('2014/6/17 9:00'),
            end: new Date('2014/6/17 11:00')
          },
          {
            id: 2,
            orderId: 1,
            parentId: null,
            title: 'Task2',
            start: new Date('2014/6/17 12:00'),
            end: new Date('2014/6/17 14:00')
          },
          {
            id: 3,
            orderId: 2,
            parentId: null,
            title: 'Task3',
            start: new Date('2014/6/17 13:00'),
            end: new Date('2014/6/17 15:00')
          },
          {
            id: 1,
            orderId: 0,
            parentId: null,
            title: 'Task1',
            start: new Date('2014/6/17 9:00'),
            end: new Date('2014/6/17 11:00')
          },
          {
            id: 2,
            orderId: 1,
            parentId: null,
            title: 'Task2',
            start: new Date('2014/6/17 12:00'),
            end: new Date('2014/6/17 14:00')
          },
          {
            id: 3,
            orderId: 2,
            parentId: null,
            title: 'Task3',
            start: new Date('2014/6/17 13:00'),
            end: new Date('2014/6/17 15:00')
          }
      ],
      // dependencies: this.dependenciesDataSource,
      views: [
          { type: 'day', selected: true },
          { type: 'week'},
          'month'
      ],
      columns: [
          { field: 'id', title: 'ID', width: 60 },
          { field: 'title', title: 'Title', editable: true, sortable: true },
          { field: 'start', title: 'Start Time', format: '{0:MM/dd/yyyy}', width: 100, editable: true, sortable: true },
          { field: 'end', title: 'End Time', format: '{0:MM/dd/yyyy}', width: 100, editable: true, sortable: true }
      ],
      dependencies: [
        {
          predecessorId: 1,
          successorId: 3,
          type: 1
        }
      ],
      // height: 700,
      listWidth: 0,

      showWorkHours: false,
      showWorkDays: false,

      snap: false
  });
  }

}
