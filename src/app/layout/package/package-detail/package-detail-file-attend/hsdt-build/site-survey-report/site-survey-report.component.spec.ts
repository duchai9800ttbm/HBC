import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteSurveyReportComponent } from './site-survey-report.component';

describe('SiteSurveyReportComponent', () => {
  let component: SiteSurveyReportComponent;
  let fixture: ComponentFixture<SiteSurveyReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteSurveyReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteSurveyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
