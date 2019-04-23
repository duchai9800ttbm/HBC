import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportEndInterviewComponent } from './report-end-interview.component';

describe('ReportEndInterviewComponent', () => {
  let component: ReportEndInterviewComponent;
  let fixture: ComponentFixture<ReportEndInterviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportEndInterviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportEndInterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
