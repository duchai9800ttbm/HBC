import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewNegotiationComponent } from './interview-negotiation.component';

describe('InterviewNegotiationComponent', () => {
  let component: InterviewNegotiationComponent;
  let fixture: ComponentFixture<InterviewNegotiationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterviewNegotiationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterviewNegotiationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
