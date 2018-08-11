import * as moment from 'moment';
import { Moment } from 'moment';

export default class DateTimeConvertHelper {
    private static readonly dateFormat = 'DD/MM/YYYY';
    private static readonly datetimeFormat = 'DD/MM/YYYY HH:mm';
    private static readonly timeFormat = 'HH:mm';

    static fromDtObjectToTimestamp(dtObject: Date): number {
        return dtObject ? +dtObject : null;
    }

    static fromTimestampToDtObject(timestamp: number): Date {
        return timestamp ? moment(timestamp).toDate() : null;
    }

    static fromTimestampToDtStr(timestamp: number): string {
        return moment(timestamp).format(this.dateFormat);
    }
}
