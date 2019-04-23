import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeHistoryPopupComponent } from './change-history-popup.component';

describe('ChangeHistoryPopupComponent', () => {
  let component: ChangeHistoryPopupComponent;
  let fixture: ComponentFixture<ChangeHistoryPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeHistoryPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeHistoryPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
