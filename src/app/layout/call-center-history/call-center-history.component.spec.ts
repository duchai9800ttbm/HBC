import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallCenterHistoryComponent } from './call-center-history.component';

describe('CallCenterHistoryComponent', () => {
  let component: CallCenterHistoryComponent;
  let fixture: ComponentFixture<CallCenterHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallCenterHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallCenterHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
