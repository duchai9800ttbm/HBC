import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'statusdocument'
})

export class StatusDocument implements PipeTransform {
    transform(value: string): any {
        if (value = 'Draft') {
            return 'Bản nháp';
        } else {
            return 'Chính thức';
        }
    }
}
