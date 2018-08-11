import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitResultComponent } from './wait-result.component';

describe('WaitResultComponent', () => {
  let component: WaitResultComponent;
  let fixture: ComponentFixture<WaitResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaitResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
