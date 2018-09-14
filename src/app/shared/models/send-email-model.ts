export class SendEmailModel {
    subject: string;
    to: string;
    cc: string;
    bcc: string;
    content: string;
    bidOpportunityId: number;

    get recipientEmails(): string[] {
        let recipientEmails = this.to.split(',').map(i => i.trim());
        if (this.cc) {
            const cc = this.cc.split(',').map(i => i.trim());
            recipientEmails = recipientEmails.concat(cc);
        }
        if (this.bcc) {
            const bcc = this.bcc.split(',').map(i => i.trim());
            recipientEmails = recipientEmails.concat(bcc);
        }
        return recipientEmails;
    }
}
