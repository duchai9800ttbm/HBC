export class InvoiceModel {
    coordinatorReference: string;
    productSerialNo: string;
    productNo: string;
    productDesc: string;
    productQty: number;
    productUnitPrice: number;
    transferFeeAmount: number;
    totalAmount: number;
    invoiceStatus: string;
    invoiceNo: string;
    productQtyCancel?: number;
}
