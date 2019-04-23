import { DocumentEntry } from './document-entry';

export class DebtDetailResponse {
    startBalance: number;
    endBalance: number;
    documentEntrys: DocumentEntry[];
}
