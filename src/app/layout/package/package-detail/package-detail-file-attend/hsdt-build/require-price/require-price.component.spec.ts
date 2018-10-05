import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirePriceComponent } from './require-price.component';

describe('RequirePriceComponent', () => {
  let component: RequirePriceComponent;
  let fixture: ComponentFixture<RequirePriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequirePriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequirePriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
