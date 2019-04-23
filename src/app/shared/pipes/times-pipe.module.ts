import { Pipe, PipeTransform } from '@angular/core';
// We use the Moment.js library to convert dates to relative times
import * as moment from 'moment';

@Pipe({
    // Specifying the name to be used within templates
    name: 'times'
})
// Our pipe will transform dates and timestamps to relative times
// using Moment.js
export class TimesPipe implements PipeTransform {
    // The transform method will be called when the pipe is used
    // within a template
    transform(value, args: string[]): any {
        const res = [];
        for (let i = 0; i < value; i++) {
            res.push(i);
        }
        return res;
    }
}
