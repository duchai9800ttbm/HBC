import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunitySpecComponent } from './opportunity-spec.component';

describe('OpportunitySpecComponent', () => {
  let component: OpportunitySpecComponent;
  let fixture: ComponentFixture<OpportunitySpecComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpportunitySpecComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunitySpecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
