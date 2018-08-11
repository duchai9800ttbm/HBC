import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationPopupCallAwayComponent } from './confirmation-popup-call-away.component';

describe('ConfirmationPopupCallAwayComponent', () => {
  let component: ConfirmationPopupCallAwayComponent;
  let fixture: ComponentFixture<ConfirmationPopupCallAwayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmationPopupCallAwayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationPopupCallAwayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
