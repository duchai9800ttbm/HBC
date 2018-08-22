import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewNoticeDetailComponent } from './interview-notice-detail.component';

describe('InterviewNoticeDetailComponent', () => {
  let component: InterviewNoticeDetailComponent;
  let fixture: ComponentFixture<InterviewNoticeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterviewNoticeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterviewNoticeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
