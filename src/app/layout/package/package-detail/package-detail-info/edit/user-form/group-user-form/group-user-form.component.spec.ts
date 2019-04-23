import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupUserFormComponent } from './group-user-form.component';

describe('GroupUserFormComponent', () => {
  let component: GroupUserFormComponent;
  let fixture: ComponentFixture<GroupUserFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupUserFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupUserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
