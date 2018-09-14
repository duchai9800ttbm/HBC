import { SearchEmailModel } from "./search-email.model";

export class SendEmailModel {
    subject: string;
    to: SearchEmailModel[];
    cc: SearchEmailModel[];
    bcc: SearchEmailModel[];
    content: string;
    bidOpportunityId: number;

    get recipientEmails(): string[] {
        // let recipientEmails = this.to.split(',').map(i => i.trim());
        let recipientEmails = this.to.map( item => item.employeeEmail);
        if (this.cc) {
            const cc = this.cc.map( item => item.employeeEmail);
            recipientEmails = recipientEmails.concat(cc);
        }
        if (this.bcc) {
            const bcc = this.bcc.map( item => item.employeeEmail);
            recipientEmails = recipientEmails.concat(bcc);
        }
        return recipientEmails;
    }
}
