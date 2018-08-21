import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryConditionComponent } from './summary-condition.component';

describe('SummaryConditionComponent', () => {
  let component: SummaryConditionComponent;
  let fixture: ComponentFixture<SummaryConditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummaryConditionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
