import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterActiveCodeComponent } from './enter-active-code.component';

describe('EnterActiveCodeComponent', () => {
  let component: EnterActiveCodeComponent;
  let fixture: ComponentFixture<EnterActiveCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterActiveCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterActiveCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
