import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { HoSoDuThauService } from '../../../../../../../../shared/services/ho-so-du-thau.service';
import { TableYeuCauDacBiet, RequirementDetail } from '../../../../../../../../shared/models/ho-so-du-thau/table-yeu-cau';

@Component({
  selector: 'app-summary-condition-form-special-requirement',
  templateUrl: './summary-condition-form-special-requirement.component.html',
  styleUrls: ['./summary-condition-form-special-requirement.component.scss']
})
export class SummaryConditionFormSpecialRequirementComponent implements OnInit, AfterViewInit {

  specialRequirementForm: FormGroup;
  otherRequirement = new TableYeuCauDacBiet();
  isModeView = false;
  get requirementsFA(): FormArray {
    return this.specialRequirementForm.get('requirements') as FormArray;
  }
  constructor(
    private fb: FormBuilder,
    private hoSoDuThauService: HoSoDuThauService
  ) { }

  ngOnInit() {
    this.hoSoDuThauService.watchLiveformState().subscribe(data => {
      this.isModeView = data.isModeView;
    });
    this.loadData();
    this.createForm();
  }
  ngAfterViewInit() {
    this.swapRow();
  }

  createForm() {
    this.specialRequirementForm = this.fb.group({
      tenderEvaluation: {
        value: this.otherRequirement.tenderEvaluation,
        disabled: this.isModeView
      },
      tenderEvaluationSteps: {
        value: this.otherRequirement.tenderEvaluationSteps,
        disabled: this.isModeView
      },
      tenderEvaluationStep1: {
        value: this.otherRequirement.tenderEvaluationStep1,
        disabled: this.isModeView
      },
      tenderEvaluationStep2: {
        value: this.otherRequirement.tenderEvaluationStep2,
        disabled: this.isModeView
      },
      requirements: this.fb.array([])
    });
    this.otherRequirement.requirementDetails.forEach(item => {
      const control = <FormArray>this.specialRequirementForm.controls.requirements;
      control.push(this.fb.group({
        requirementName: {
          value: item.requirementName,
          disabled: this.isModeView
        },
        requirementDesc: {
          value: item.requirementDesc,
          disabled: this.isModeView
        },
        requirementLink: {
          value: item.requirementLink,
          disabled: this.isModeView
        }
      }));
    });
    this.specialRequirementForm.valueChanges.subscribe(data => {
      let obj = new TableYeuCauDacBiet();
      obj = {
        tenderEvaluation: data.tenderEvaluation,
        tenderEvaluationSteps: data.tenderEvaluationSteps,
        tenderEvaluationStep1: data.tenderEvaluationStep1,
        tenderEvaluationStep2: data.tenderEvaluationStep2,
        requirementDetails: (data.requirements || []).map(x => ({
          requirementName: x.requirementName,
          requirementDesc: x.requirementDesc,
          requirementLink: x.requirementLink
        }))
      };
      this.hoSoDuThauService.emitDataStepSpecial(obj);
    });
    this.hoSoDuThauService.scrollToView(true);
  }


  loadData() {
    this.hoSoDuThauService.watchDataLiveForm().subscribe(data => {
      const otherRequirement = data.yeuCauDacBietKhac;
      if (!otherRequirement) {
        this.otherRequirement = {
          tenderEvaluation: 'Tender Evaluation',
          tenderEvaluationSteps: 'Two (02) steps',
          tenderEvaluationStep1: 'Preliminary Evaluation',
          tenderEvaluationStep2: 'Detail Evaluation',
          requirementDetails: [
            {
              requirementName: 'Green Building Standard',
              requirementDesc: '',
              requirementLink: 'Green Mark'
            },
            {
              requirementName: 'Profit, Overhead and Attendance',
              requirementDesc: 'Maximum',
              requirementLink: '3%'
            }
          ]
        };
      } else {
        this.otherRequirement = data.yeuCauDacBietKhac;
        if (this.otherRequirement.requirementDetails.length === 0) {
          this.otherRequirement = {
            tenderEvaluation: 'Tender Evaluation',
            tenderEvaluationSteps: 'Two (02) steps',
            tenderEvaluationStep1: 'Preliminary Evaluation',
            tenderEvaluationStep2: 'Detail Evaluation',
            requirementDetails: [
              {
                requirementName: 'Green Building Standard',
                requirementDesc: '',
                requirementLink: 'Green Mark'
              },
              {
                requirementName: 'Profit, Overhead and Attendance',
                requirementDesc: 'Maximum',
                requirementLink: '3%'
              }
            ]
          };
        }
      }
    });
  }

  addFormArrayControl(name: string, data?: RequirementDetail) {
    const formArray = this.specialRequirementForm.get(name) as FormArray;
    const formItem = this.fb.group({
      requirementName: {
        value: data ? data.requirementName : null,
        disabled: this.isModeView
      },
      requirementDesc: {
        value: data ? data.requirementDesc : null,
        disabled: this.isModeView
      },
      requirementLink: {
        value: data ? data.requirementLink : null,
        disabled: this.isModeView
      }
    });
    formArray.push(formItem);
  }

  removeFormArrayControl(name: string, index: number) {
    const formArray = this.specialRequirementForm.get(name) as FormArray;
    formArray.removeAt(index);
  }
  swapRow() {
    const row = document.getElementById('requirementsrow0');
    const sibling = row.previousElementSibling.previousElementSibling;
    const parent = row.parentNode;
    parent.insertBefore(row, sibling);
  }
}
