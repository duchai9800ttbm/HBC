import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallAwayComponent } from './call-away.component';

describe('CallAwayComponent', () => {
  let component: CallAwayComponent;
  let fixture: ComponentFixture<CallAwayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallAwayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallAwayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
