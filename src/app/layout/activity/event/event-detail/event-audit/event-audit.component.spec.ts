import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventAuditComponent } from './event-audit.component';

describe('EventAuditComponent', () => {
  let component: EventAuditComponent;
  let fixture: ComponentFixture<EventAuditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventAuditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
