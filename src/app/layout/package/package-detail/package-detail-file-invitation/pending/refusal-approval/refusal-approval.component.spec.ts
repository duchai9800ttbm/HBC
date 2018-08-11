import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefusalApprovalComponent } from './refusal-approval.component';

describe('RefusalApprovalComponent', () => {
  let component: RefusalApprovalComponent;
  let fixture: ComponentFixture<RefusalApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefusalApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefusalApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
