import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupConfirmTypeFormInComponent } from './popup-confirm-type-form-in.component';

describe('PopupConfirmTypeFormInComponent', () => {
  let component: PopupConfirmTypeFormInComponent;
  let fixture: ComponentFixture<PopupConfirmTypeFormInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupConfirmTypeFormInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupConfirmTypeFormInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
