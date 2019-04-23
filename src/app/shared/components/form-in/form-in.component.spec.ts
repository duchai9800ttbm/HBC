import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormInComponent } from './form-in.component';

describe('FormInComponent', () => {
  let component: FormInComponent;
  let fixture: ComponentFixture<FormInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
