import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EndInterviewComponent } from './end-interview.component';

describe('EndInterviewComponent', () => {
  let component: EndInterviewComponent;
  let fixture: ComponentFixture<EndInterviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndInterviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndInterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
