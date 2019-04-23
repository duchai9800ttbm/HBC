import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewNoticeComponent } from './interview-notice.component';

describe('InterviewNoticeComponent', () => {
  let component: InterviewNoticeComponent;
  let fixture: ComponentFixture<InterviewNoticeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterviewNoticeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterviewNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
