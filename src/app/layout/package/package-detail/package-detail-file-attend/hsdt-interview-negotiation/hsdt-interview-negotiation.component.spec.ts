import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HsdtInterviewNegotiationComponent } from './hsdt-interview-negotiation.component';

describe('HsdtInterviewNegotiationComponent', () => {
  let component: HsdtInterviewNegotiationComponent;
  let fixture: ComponentFixture<HsdtInterviewNegotiationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HsdtInterviewNegotiationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HsdtInterviewNegotiationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
