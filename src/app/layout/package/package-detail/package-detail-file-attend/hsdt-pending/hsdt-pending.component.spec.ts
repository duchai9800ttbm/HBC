import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HsdtPendingComponent } from './hsdt-pending.component';

describe('HsdtPendingComponent', () => {
  let component: HsdtPendingComponent;
  let fixture: ComponentFixture<HsdtPendingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HsdtPendingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HsdtPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
