import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunityOverviewComponent } from './opportunity-overview.component';

describe('OpportunityOverviewComponent', () => {
  let component: OpportunityOverviewComponent;
  let fixture: ComponentFixture<OpportunityOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpportunityOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunityOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
