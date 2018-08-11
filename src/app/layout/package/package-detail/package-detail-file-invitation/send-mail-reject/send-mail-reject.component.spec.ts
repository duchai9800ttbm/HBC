import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendMailRejectComponent } from './send-mail-reject.component';

describe('SendMailRejectComponent', () => {
  let component: SendMailRejectComponent;
  let fixture: ComponentFixture<SendMailRejectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendMailRejectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendMailRejectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
