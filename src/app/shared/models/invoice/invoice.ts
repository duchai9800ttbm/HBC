import { InvoiceItem } from './invoice-item';

export class Invoice {
    id: number;
    productName: string;
    productDesc: string;
    productSerialNo: string;
    productQty: number;
    productUnitPrice: number;
    transferFeeAmount: number;
    loadingAmount: number;
    totalAmount: number;
    invoice: InvoiceItem;
    product: {
        productNo: string;
    };
    coordinatorReference: string;
}
