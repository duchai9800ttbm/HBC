import { Product } from '../product/product';
import { Invoice } from './invoice';

export class InvoiceInfo {
    customerBalance: number;
    productCustomerPrices: Product[];
    invoiceLastest: Invoice;
    invoicesOfMonth: Invoice[];
}
