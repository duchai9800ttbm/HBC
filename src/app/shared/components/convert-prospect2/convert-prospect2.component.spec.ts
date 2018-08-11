import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertProspect2Component } from './convert-prospect2.component';

describe('ConvertProspect2Component', () => {
  let component: ConvertProspect2Component;
  let fixture: ComponentFixture<ConvertProspect2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConvertProspect2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvertProspect2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
