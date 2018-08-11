import { Pipe, PipeTransform } from '@angular/core';
// We use the Moment.js library to convert dates to relative times
import * as moment from 'moment';

@Pipe({
    // Specifying the name to be used within templates
    name: 'shortenedName'
})

export class ShortenedName implements PipeTransform {
    // The transform method will be called when the pipe is used
    // within a template
    transform(text: string) {
        if (!text) {
            return '';
        }
        const shortenedText = text
            .split(' ')
            .map((sub: any) => sub.slice(0, 1).toUpperCase())
            .join('');

        return shortenedText.slice(0, 1) + shortenedText.slice(-1);
    }
}
