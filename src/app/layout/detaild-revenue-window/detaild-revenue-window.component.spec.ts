import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetaildRevenueWindowComponent } from './detaild-revenue-window.component';

describe('DetaildRevenueWindowComponent', () => {
  let component: DetaildRevenueWindowComponent;
  let fixture: ComponentFixture<DetaildRevenueWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetaildRevenueWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetaildRevenueWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
