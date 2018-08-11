import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HsdtSignedComponent } from './hsdt-signed.component';

describe('HsdtSignedComponent', () => {
  let component: HsdtSignedComponent;
  let fixture: ComponentFixture<HsdtSignedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HsdtSignedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HsdtSignedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
