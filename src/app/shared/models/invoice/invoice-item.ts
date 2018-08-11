import * as moment from 'moment';
import DateTimeConvertHelper from '../../helpers/datetime-convert-helper';

export class InvoiceItem {
    id: number;
    invoiceNo: string;
    invoiceDate: number;
    invoiceStatus: string;
    coordinatorReference: string;
    customerId: number;
    get invoiceDateStr() {
        return DateTimeConvertHelper.fromTimestampToDtStr(this.invoiceDate);
    }
}
