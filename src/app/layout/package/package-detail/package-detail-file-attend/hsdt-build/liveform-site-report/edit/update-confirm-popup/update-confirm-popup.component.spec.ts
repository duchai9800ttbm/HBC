import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateConfirmPopupComponent } from './update-confirm-popup.component';

describe('UpdateConfirmPopupComponent', () => {
  let component: UpdateConfirmPopupComponent;
  let fixture: ComponentFixture<UpdateConfirmPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateConfirmPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateConfirmPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
