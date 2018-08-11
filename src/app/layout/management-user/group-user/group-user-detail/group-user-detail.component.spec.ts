import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupUserDetailComponent } from './group-user-detail.component';

describe('GroupUserDetailComponent', () => {
  let component: GroupUserDetailComponent;
  let fixture: ComponentFixture<GroupUserDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupUserDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupUserDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
