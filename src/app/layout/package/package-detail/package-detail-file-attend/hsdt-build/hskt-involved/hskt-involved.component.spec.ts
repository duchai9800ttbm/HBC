import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HsktInvolvedComponent } from './hskt-involved.component';

describe('HsktInvolvedComponent', () => {
  let component: HsktInvolvedComponent;
  let fixture: ComponentFixture<HsktInvolvedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HsktInvolvedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HsktInvolvedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
