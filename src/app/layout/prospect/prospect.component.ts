import { Component, OnInit, ViewChild } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { Subject } from 'rxjs/Rx';
import { DataTableDirective } from 'angular-datatables';

@Component({
    selector: 'app-prospect',
    templateUrl: './prospect.component.html',
    styleUrls: ['./prospect.component.scss'],
    animations: [routerTransition()]
})
export class ProspectComponent implements OnInit {
    ngOnInit(): void {

    }


}
