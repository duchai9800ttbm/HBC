import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryConditionFormInfoComponent } from './summary-condition-form-info.component';

describe('SummaryConditionFormInfoComponent', () => {
  let component: SummaryConditionFormInfoComponent;
  let fixture: ComponentFixture<SummaryConditionFormInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummaryConditionFormInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryConditionFormInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
