import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryConditionEditComponent } from './summary-condition-edit.component';

describe('SummaryConditionEditComponent', () => {
  let component: SummaryConditionEditComponent;
  let fixture: ComponentFixture<SummaryConditionEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummaryConditionEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryConditionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
