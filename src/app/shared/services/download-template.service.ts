import { Injectable } from "@angular/core";
import { ApiService, SessionService } from "./index";
import * as FileSaver from "file-saver";
const EXCEL_EXTENSION = ".xlsm";
@Injectable()
export class DownloadTemplateService {
    constructor(
        private apiService: ApiService,
        private sessionService: SessionService
    ) {}
    get employeeId() {
        return this.sessionService.currentUser.employeeId;
    }

    downloadTemplate(moduleName: string) {
        const url = `employee/${this.employeeId}/downloadFile/${moduleName}`;
        return this.apiService
            .getFile(url)
            .map(response => {
                return FileSaver.saveAs(
                    new Blob([response], {
                        type: "vnd.ms-excel.sheet.macroEnabled.12"
                    }),
                    `${moduleName}_template${EXCEL_EXTENSION}`
                );
            })
            .share();
    }
}
