import { Component, OnInit, ViewChild } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { Subject } from 'rxjs/Rx';
import { DataTableDirective } from 'angular-datatables';

@Component({
    selector: 'app-opportunity',
    templateUrl: './opportunity.component.html',
    styleUrls: ['./opportunity.component.scss'],
    animations: [routerTransition()]
})
export class OpportunityComponent implements OnInit {
    ngOnInit(): void {

    }
}
