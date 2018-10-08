import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryConditionOverviewComponent } from './summary-condition-overview.component';

describe('SummaryConditionOverviewComponent', () => {
  let component: SummaryConditionOverviewComponent;
  let fixture: ComponentFixture<SummaryConditionOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummaryConditionOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryConditionOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
