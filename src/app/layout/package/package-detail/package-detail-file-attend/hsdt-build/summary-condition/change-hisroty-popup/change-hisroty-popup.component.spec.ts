import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeHisrotyPopupComponent } from './change-hisroty-popup.component';

describe('ChangeHisrotyPopupComponent', () => {
  let component: ChangeHisrotyPopupComponent;
  let fixture: ComponentFixture<ChangeHisrotyPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeHisrotyPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeHisrotyPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
