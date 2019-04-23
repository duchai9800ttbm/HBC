import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryConditionCreateComponent } from './summary-condition-create.component';

describe('SummaryConditionCreateComponent', () => {
  let component: SummaryConditionCreateComponent;
  let fixture: ComponentFixture<SummaryConditionCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummaryConditionCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryConditionCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
