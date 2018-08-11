import { Component, OnInit, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-table-action',
    templateUrl: './table-action.component.html',
    styleUrls: ['./table-action.component.scss']
})
export class TableActionComponent implements OnInit {
    @Input() action: any;
    constructor() {
        this.action = {
            view: {},
            edit: {},
            mail: {},
            delete: {},
        };
    }

    ngOnInit() { }
}
