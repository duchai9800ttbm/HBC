import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunityActivityComponent } from './opportunity-activity.component';

describe('OpportunityActivityComponent', () => {
  let component: OpportunityActivityComponent;
  let fixture: ComponentFixture<OpportunityActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpportunityActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunityActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
