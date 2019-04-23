import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewNoticeListComponent } from './interview-notice-list.component';

describe('InterviewNoticeListComponent', () => {
  let component: InterviewNoticeListComponent;
  let fixture: ComponentFixture<InterviewNoticeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterviewNoticeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterviewNoticeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
