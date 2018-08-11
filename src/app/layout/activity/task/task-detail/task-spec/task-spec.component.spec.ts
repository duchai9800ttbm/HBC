import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskSpecComponent } from './task-spec.component';

describe('TaskSpecComponent', () => {
  let component: TaskSpecComponent;
  let fixture: ComponentFixture<TaskSpecComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskSpecComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskSpecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
