import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectionLetterComponent } from './rejection-letter.component';

describe('RejectionLetterComponent', () => {
  let component: RejectionLetterComponent;
  let fixture: ComponentFixture<RejectionLetterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectionLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectionLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
