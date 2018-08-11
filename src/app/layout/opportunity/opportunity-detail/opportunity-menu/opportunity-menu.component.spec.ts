import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunityMenuComponent } from './opportunity-menu.component';

describe('OpportunityMenuComponent', () => {
  let component: OpportunityMenuComponent;
  let fixture: ComponentFixture<OpportunityMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpportunityMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunityMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
