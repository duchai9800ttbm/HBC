import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportMeetingComponent } from './report-meeting.component';

describe('ReportMeetingComponent', () => {
  let component: ReportMeetingComponent;
  let fixture: ComponentFixture<ReportMeetingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportMeetingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
