import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import '@progress/kendo-ui';
import { NgxSpinnerService } from 'ngx-spinner';
import { PackageService } from '../../../../../../shared/services/package.service';
import { PackageInfoModel } from '../../../../../../shared/models/package/package-info.model';
import { PackageDetailComponent } from '../../../package-detail.component';
import { DATATABLE_CONFIG } from '../../../../../../shared/configs';
import { Subject, Observable } from 'rxjs';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { TenderPreparationPlanItem } from '../../../../../../shared/models/package/tender-preparation-plan-item';
import DateTimeConvertHelper from '../../../../../../shared/helpers/datetime-convert-helper';
import { UserService } from '../../../../../../shared/services';
import { UserItemModel } from '../../../../../../shared/models/user/user-item.model';
import { TenderPreparationPlanningRequest } from '../../../../../../shared/models/api-request/package/tender-preparation-planning-request';

declare let kendo: any;

@Component({
    selector: 'app-information-deployment-form',
    templateUrl: './information-deployment-form.component.html',
    styleUrls: ['./information-deployment-form.component.scss']
})
export class InformationDeploymentFormComponent implements OnInit {
    @ViewChild('ganttChart')
    ganttChart: ElementRef;
    bidOpportunityId;
    packageInfo: PackageInfoModel;
    dtOptions: any = DATATABLE_CONFIG;
    planForm: FormGroup;
    dtTrigger: Subject<any> = new Subject();
    fakeArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    userList: Observable<UserItemModel[]>;

    get tasksFA(): FormArray {
        return this.planForm.get('tasks') as FormArray;
    }
    constructor(
        private spinner: NgxSpinnerService,
        private packageService: PackageService,
        private userService: UserService,
        private fb: FormBuilder
    ) {}

    ngOnInit() {
        setTimeout(() => {
            this.dtTrigger.next();
        });
        this.bidOpportunityId = PackageDetailComponent.packageId;
        this.userList = this.userService.getAllUser('');
        this.getPackageInfo();
        this.packageService
            .getDefaultTenderPreparationPlanning()
            .subscribe(data => this.createForm(data));
        // this.packageService.getTenderPreparationPlanning(this.bidOpportunityId).subscribe(data => console.log(data));
    }

    createForm(planModel: TenderPreparationPlanningRequest) {
        const taskArr = [];
        planModel.tasks.forEach(i => taskArr.push(this.createTaskItemFG(i)));
        this.planForm = this.fb.group({
            projectDirectorEmployeeId: planModel.projectDirectorEmployeeId,
            tenderDepartmentEmployeeId: planModel.tenderDepartmentEmployeeId,
            technicalDepartmentEmployeeId: planModel.technicalDepartmentEmployeeId,
            bimDepartmentEmployeeId: planModel.bimDepartmentEmployeeId,
            tasks: this.fb.array(taskArr)
        });
        setTimeout(() => {
            kendo.jQuery(this.ganttChart.nativeElement).kendoGantt({
                //   dataSource: this.tasksDataSource,
                dataSource: planModel.tasks.map(i => {
                    return {
                        id: i.itemId,
                        orderId: i.itemId,
                        parentId: null,
                        title: i.itemName,
                        start: new Date(),
                        end: new Date()
                    };
                }),
                // dependencies: this.dependenciesDataSource,
                views: [
                    { type: 'day', selected: true },
                    { type: 'week' },
                    'month'
                ],
                // columns: [
                //     { field: 'id', title: 'ID', width: 60 },
                //     {
                //         field: 'title',
                //         title: 'Title',
                //         editable: true,
                //         sortable: true
                //     },
                //     {
                //         field: 'start',
                //         title: 'Start Time',
                //         format: '{0:MM/dd/yyyy}',
                //         width: 100,
                //         editable: true,
                //         sortable: true
                //     },
                //     {
                //         field: 'end',
                //         title: 'End Time',
                //         format: '{0:MM/dd/yyyy}',
                //         width: 100,
                //         editable: true,
                //         sortable: true
                //     }
                // ],
                // dependencies: [
                //     {
                //         predecessorId: 1,
                //         successorId: 3,
                //         type: 1
                //     }
                // ],
                height: 2291,
                listWidth: 0,
                showWorkHours: false,
                showWorkDays: false,
                snap: false
            });
        }, 500);
    }

    createTaskItemFG(data: TenderPreparationPlanItem): FormGroup {
        return this.fb.group({
            itemId: data.itemId,
            itemName: data.itemName,
            itemDesc: data.itemDesc,
            whoIsInChargeId: data.whoIsInChargeId,
            startDate: data.startDate
                ? DateTimeConvertHelper.fromTimestampToDtObject(
                      data.startDate * 1000
                  )
                : new Date(),
            finishDate: data.finishDate
                ? DateTimeConvertHelper.fromTimestampToDtObject(
                      data.finishDate * 1000
                  )
                : new Date(),
            duration: data.duration
        });
    }

    getPackageInfo() {
        this.spinner.show();
        this.packageService
            .getInforPackageID(this.bidOpportunityId)
            .subscribe(data => {
                this.packageInfo = data;
                this.spinner.hide();
                console.log(this.packageInfo);
            });
    }
}
