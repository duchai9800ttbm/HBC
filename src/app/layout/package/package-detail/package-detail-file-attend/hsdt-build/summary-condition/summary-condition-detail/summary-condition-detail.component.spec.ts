import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryConditionDetailComponent } from './summary-condition-detail.component';

describe('SummaryConditionDetailComponent', () => {
  let component: SummaryConditionDetailComponent;
  let fixture: ComponentFixture<SummaryConditionDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummaryConditionDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryConditionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
