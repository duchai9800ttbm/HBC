import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactAuditComponent } from './contact-audit.component';

describe('ContactAuditComponent', () => {
  let component: ContactAuditComponent;
  let fixture: ComponentFixture<ContactAuditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactAuditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
