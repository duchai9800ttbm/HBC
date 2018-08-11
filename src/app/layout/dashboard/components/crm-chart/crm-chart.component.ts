import { Component, OnInit } from "@angular/core";
import { DATETIME_PICKER_CONFIG } from "../../../../shared/configs/datepicker.config";
import { ChartService } from "../../../../shared/services/chart.service";
import { ChartModel } from "../../../../shared/models/chart/chart.model";
import * as moment from "moment";
import { FormBuilder, Validators } from "@angular/forms";
import { FormGroup } from "@angular/forms/src/model";
import DateTimeConvertHelper from "../../../../shared/helpers/datetime-convert-helper";
import ValidationHelper from "../../../../shared/helpers/validation.helper";
import { AfterViewInit } from "@angular/core/src/metadata/lifecycle_hooks";
import { TranslateService } from "@ngx-translate/core";
import { ViewChild } from "@angular/core";
import { ElementRef } from "@angular/core";
@Component({
    selector: "app-crm-chart",
    templateUrl: "./crm-chart.component.html",
    styleUrls: ["./crm-chart.component.scss"]
})
export class CrmChartComponent implements OnInit {
    @ViewChild("module") module: ElementRef;
    datePickerConfig = DATETIME_PICKER_CONFIG;

    public lineChartData = [{ data: [], label: "" }];

    public lineChartLabels: Array<any> = [];

    public arrayChart: ChartModel[] = [];

    public lineChartOptions: any = {
        responsive: true,
        //   title: {
        //     display: true,
        //     text: 'Custom Chart Title'
        // },
        // legend: {
        //   display: true,
        //   text: 'fdsfdsaf'
        // },
        scales: {
            xAxes: [
                {
                    position: "left",
                    scaleLabel: {
                        display: true,
                        labelString: "Thời gian (tháng)"
                    }
                }
            ],
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true,
                        callback: label => {
                            const floatting = (label + "").split(".")[1];
                            if (floatting && floatting.length > 1) {
                                return label.toFixed(1);
                            }
                            return `${label}`;
                        }
                    },
                    position: "left",
                    scaleLabel: {
                        display: true,
                        labelString: "Số lượng"
                    }
                }
            ]
        }
    };
    public lineChartColors: Array<any> = [
        {
            // grey
            backgroundColor: "rgba(167,221,236,0.39)",
            borderColor: "#00a0e3",
            borderCapStyle: "butt",
            pointBackgroundColor: "rgba(148,159,177,1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(148,159,177,0.8)"
        }
    ];
    public lineChartLegend = true;
    public lineChartType = "line";
    chartForm: FormGroup;
    isSubmitted: boolean;
    invalidMessages: string[];
    formErrors = {
        startDate: "",
        endDate: ""
    };
    constructor(
        private chartService: ChartService,
        private fb: FormBuilder,
        private translateService: TranslateService
    ) { }

    ngOnInit() {
        this.createForm();
        this.chartService
            .getChartByModule(
                "prospects",
                "month",
                moment()
                    .startOf("year")
                    .valueOf(),
                moment()
                    .endOf("year")
                    .valueOf()
            )
            .subscribe(result => {
                this.arrayChart = result;
                this.lineChartLabels = [];
                this.lineChartData[0].data = [];
                this.lineChartData[0].label = this.translateService.instant(
                    "prospect"
                );
                if (this.arrayChart) {
                    this.arrayChart.forEach(element => {
                        this.lineChartLabels.push(
                            `Tháng ${moment(element.paymentDate).format("MM")}`
                        );
                        this.lineChartData[0].data.push(element.amount);
                    });
                }
            });
    }

    createForm() {
        this.chartForm = this.fb.group({
            startDate: [
                DateTimeConvertHelper.fromTimestampToDtObject(
                    moment()
                        .startOf("year")
                        .valueOf()
                ),
                Validators.required
            ],
            endDate: [
                DateTimeConvertHelper.fromTimestampToDtObject(
                    moment()
                        .endOf("year")
                        .valueOf()
                ),
                Validators.required
            ],
            moduleName: "prospects"
        });
        this.chartForm.valueChanges.subscribe(data =>
            this.onFormValueChanged(data)
        );
    }
    onFormValueChanged(data?: any) {
        if (this.isSubmitted) {
            this.validateForm();
        }
    }

    validateForm() {
        this.invalidMessages = ValidationHelper.getInvalidMessages(
            this.chartForm,
            this.formErrors
        );
        return this.invalidMessages.length === 0;
    }
    // events
    public chartClicked(e: any): void { }

    public chartHovered(e: any): void { }

    onSelectType(value) {
        this.chartService
            .getChartByModule(
                value,
                "month",
                moment(this.chartForm.value.startDate).unix() * 1000,
                moment(this.chartForm.value.endDate).unix() * 1000
            )
            .subscribe(result => {
                this.arrayChart = result;
                this.lineChartLabels = [];
                this.lineChartData[0].data = [];
                this.lineChartData[0].label = this.translateService.instant(
                    value.substring(0, value.length - 1)
                );
                this.arrayChart.forEach(element => {
                    this.lineChartLabels.push(
                        `Tháng ${moment(element.paymentDate).format("MM")}`
                    );
                    this.lineChartData[0].data.push(element.amount);
                });
            });
    }

    onClick() {
        const value = this.module.nativeElement.value.toString();
        this.isSubmitted = true;
        if (this.validateForm()) {
            this.chartService
                .getChartByModule(
                    this.chartForm.value.moduleName,
                    "month",
                    moment(this.chartForm.value.startDate).unix() * 1000,
                    moment(this.chartForm.value.endDate).unix() * 1000
                )
                .subscribe(result => {
                    this.arrayChart = result;
                    this.lineChartLabels = [];
                    this.lineChartData[0].data = [];
                    this.lineChartData[0].label = this.translateService.instant(
                        value.substring(0, value.length - 1)
                    );
                    if (this.arrayChart) {
                        this.arrayChart.forEach(element => {
                            this.lineChartLabels.push(
                                `Tháng ${moment(element.paymentDate).format(
                                    "MM"
                                )}`
                            );
                            this.lineChartData[0].data.push(element.amount);
                        });
                    }
                });
        }
    }
}
