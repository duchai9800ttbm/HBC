import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { ContactService, AlertService, ConfirmationService } from '../../../shared/services';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ContactModel } from '../../../shared/models';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'app-contact-detail',
    templateUrl: './contact-detail.component.html',
    styleUrls: ['./contact-detail.component.scss'],
    animations: [routerTransition()]
})
export class ContactDetailComponent implements OnInit {
    contact$: Observable<ContactModel>;
    isNotExist = false;
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private alertService: AlertService,
        private confirmationService: ConfirmationService,
        private contactService: ContactService) { }

    ngOnInit(): void {
        this.contact$ = this.route.paramMap.switchMap((params: ParamMap) =>
            this.contactService.view(params.get('id')));
        this.contact$.subscribe(contact => {}
        , err => {
            this.isNotExist = true;
        });
    }

    delete(id) {
        const that = this;
        this.confirmationService.confirm('Bạn có chắc chắn muốn xóa liên hệ này?',
            () => {
                that.contactService.delete([id]).subscribe(_ => {
                    that.router.navigate(['/contact']);
                    that.alertService.success('Đã xóa liên hệ!', true);
                });
            });

    }

    refresh(id) {
        this.contact$ = this.contactService.view(id);
        this.alertService.success('Dữ liệu đã được cập nhật mới nhất!');
    }
}
