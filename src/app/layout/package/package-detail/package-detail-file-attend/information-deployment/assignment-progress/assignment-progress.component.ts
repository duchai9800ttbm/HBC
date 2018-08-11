import { Component, OnInit, Input } from '@angular/core';
import { Observable } from '../../../../../../../../node_modules/rxjs/Observable';
import { Subject } from '../../../../../../../../node_modules/rxjs/Subject';
import { UploadItem } from '../../../../../../shared/models/upload/upload-item.model';
import { Status } from '../../../../../../shared/models/status-item.model';
import { DATATABLE_CONFIG } from '../../../../../../shared/configs/datatable.config';
import { routerTransition } from '../../../../../../router.animations';
import { AlertService, DataService } from '../../../../../../shared/services';
import { SelectableSettings } from '@progress/kendo-angular-grid';
import { DataUploadService } from '../../../../../../shared/services/data-upload.service';
import { GridDataResult, PageChangeEvent,SelectAllCheckboxState } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
@Component({
  selector: 'app-assignment-progress',
  templateUrl: './assignment-progress.component.html',
  styleUrls: ['./assignment-progress.component.scss'],
  animations: [routerTransition()]
})
export class AssignmentProgressComponent implements OnInit {

  @Input() UploadItem: UploadItem;
  @Input() hideButon: boolean;
  @Input() dataConfirm = false;
  public gridView: GridDataResult;
  public gridViewSelect: GridDataResult;
  public items: UploadItem[] = this.dataUploadService.getdataUploadFile();
  public itemSelect: UploadItem[] = this.dataUploadService.getdataUploadFileSelect();
  public selectAllState: SelectAllCheckboxState = 'unchecked';
  public mySelection: number[] = [];
  public pageSize = 10;
  public skip = 0;
  total: number;
  totalSelect:number;
  public multiple = false;
  public allowUnsort = true;
  public sort: SortDescriptor[] = [
    
    {
      field: 'name',
      dir: 'asc'
    },
    {
      field: 'version',
      dir: 'asc'
    },
    {
      field: 'description',
      dir: 'asc'
    }, {
      field: 'status',
      dir: 'asc'
    },
    {
      field: 'userId',
      dir: 'asc'
    },
    {
      field: 'createDate',
      dir: 'asc'
    }
  ];

  constructor(private dataUploadService: DataUploadService) {
    this.loadItems();
  }

  status: Array<{ name: string; id: number }> = [
    { id: 1, name: 'Bản nháp' },
    { id: 2, name: 'Chính thức' }
  ];
  listUsers: Array<{ name: string; id: number }> = [
    { id: 1, name: 'Oliver Dinh' },
    { id: 2, name: 'Phuong VD' },
    { id: 3, name: 'Nghia Nguyen' },
    { id: 4, name: 'Dao Nhan' },
    { id: 5, name: 'Dang Quyen' }
  ];
  dateUploads: Array<{ date: string }> = [
    { date: '01/08/2018' },
    { date: '02/08/2018' },
    { date: '03/08/2018' },
    { date: '04/08/2018' },
    { date: '05/08/2018' }
  ];
  checkboxSeclectAll: boolean;

  ngOnInit() {
    console.log('hideButon', this.hideButon);
    this.total =this.items.length;
    this.totalSelect =this.itemSelect.length;

  }
  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.loadItems();
  }
  public onSelectedKeysChange(e) {
    const len = this.mySelection.length;
    if (len === 0) {
        this.selectAllState = 'unchecked';
    } else if (len > 0 && len < this.items.length) {
        this.selectAllState = 'indeterminate';
    } else {
        this.selectAllState = 'checked';
    }
}

  public onSelectAllChange(checkedState: SelectAllCheckboxState) {

    console.log('this.mySelection.length',checkedState);
    if (checkedState === 'checked') {
        this.mySelection = this.items.map((item) => item.id);
        this.selectAllState = 'checked';
    } else {
        this.mySelection = [];
        this.selectAllState = 'unchecked';
    }
}
  private loadItems(): void {
    this.items = orderBy(this.items, this.sort);
      this.gridView = {      
      data: this.items.slice(this.skip, this.skip + this.pageSize),
      total: this.items.length
    };
    this.itemSelect = orderBy(this.itemSelect, this.sort);
    this.gridViewSelect = {
      data: this.itemSelect.slice(this.skip, this.skip + this.pageSize),
      total: this.itemSelect.length
    };
  }

}
