import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignDetailComponent } from './assign-detail.component';

describe('AssignDetailComponent', () => {
  let component: AssignDetailComponent;
  let fixture: ComponentFixture<AssignDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
