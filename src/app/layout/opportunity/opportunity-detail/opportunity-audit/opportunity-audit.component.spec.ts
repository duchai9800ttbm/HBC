import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunityAuditComponent } from './opportunity-audit.component';

describe('OpportunityAuditComponent', () => {
  let component: OpportunityAuditComponent;
  let fixture: ComponentFixture<OpportunityAuditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpportunityAuditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunityAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
