import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoilConditionComponent } from './soil-condition.component';

describe('SoilConditionComponent', () => {
  let component: SoilConditionComponent;
  let fixture: ComponentFixture<SoilConditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoilConditionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoilConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
