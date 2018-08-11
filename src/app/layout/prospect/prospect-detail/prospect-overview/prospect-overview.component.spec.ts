import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProspectOverviewComponent } from './prospect-overview.component';

describe('ProspectOverviewComponent', () => {
  let component: ProspectOverviewComponent;
  let fixture: ComponentFixture<ProspectOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProspectOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProspectOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
