import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskAuditComponent } from './task-audit.component';

describe('TaskAuditComponent', () => {
  let component: TaskAuditComponent;
  let fixture: ComponentFixture<TaskAuditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskAuditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
