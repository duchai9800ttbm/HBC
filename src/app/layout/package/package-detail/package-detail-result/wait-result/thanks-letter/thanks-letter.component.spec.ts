import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThanksLetterComponent } from './thanks-letter.component';

describe('ThanksLetterComponent', () => {
  let component: ThanksLetterComponent;
  let fixture: ComponentFixture<ThanksLetterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThanksLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThanksLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
