import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputAssignToComponent } from './input-assign-to.component';

describe('InputAssignToComponent', () => {
  let component: InputAssignToComponent;
  let fixture: ComponentFixture<InputAssignToComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputAssignToComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputAssignToComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
