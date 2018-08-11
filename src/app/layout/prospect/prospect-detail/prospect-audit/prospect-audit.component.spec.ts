import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProspectAuditComponent } from './prospect-audit.component';

describe('ProspectAuditComponent', () => {
  let component: ProspectAuditComponent;
  let fixture: ComponentFixture<ProspectAuditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProspectAuditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProspectAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
