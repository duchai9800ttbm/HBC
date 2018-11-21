import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThanksLetterCancelComponent } from './thanks-letter-cancel.component';

describe('ThanksLetterCancelComponent', () => {
  let component: ThanksLetterCancelComponent;
  let fixture: ComponentFixture<ThanksLetterCancelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThanksLetterCancelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThanksLetterCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
