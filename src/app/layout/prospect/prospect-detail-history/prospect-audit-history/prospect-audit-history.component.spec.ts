import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProspectAuditHistoryComponent } from './prospect-audit-history.component';

describe('ProspectAuditHistoryComponent', () => {
  let component: ProspectAuditHistoryComponent;
  let fixture: ComponentFixture<ProspectAuditHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProspectAuditHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProspectAuditHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
