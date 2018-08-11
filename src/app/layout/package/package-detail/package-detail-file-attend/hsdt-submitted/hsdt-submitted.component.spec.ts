import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HsdtSubmittedComponent } from './hsdt-submitted.component';

describe('HsdtSubmittedComponent', () => {
  let component: HsdtSubmittedComponent;
  let fixture: ComponentFixture<HsdtSubmittedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HsdtSubmittedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HsdtSubmittedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
