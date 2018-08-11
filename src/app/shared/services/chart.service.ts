import { Injectable } from "@angular/core";
import { SessionService, ApiService } from "./index";
import { UrlHandlingStrategy } from "@angular/router/src/url_handling_strategy";
import { URLSearchParams } from "@angular/http";
@Injectable()
export class ChartService {
    constructor(
        private sessionService: SessionService,
        private apiService: ApiService
    ) {}
    get employeeId() {
        return this.sessionService.currentUser.employeeId;
    }

    getChartByModule(
        moduleName: string,
        type: string,
        startDate: number,
        endDate: number
    ) {
        const url = `/employee/${this.employeeId}/${moduleName}/chart/${type}/`;
        const urlParams = new URLSearchParams();
        urlParams.append("from", startDate.toString());
        urlParams.append("to", endDate.toString());
        return this.apiService
            .get(url, urlParams)
            .map(response => {
                return response.result;
            })
            .share();
    }
}
