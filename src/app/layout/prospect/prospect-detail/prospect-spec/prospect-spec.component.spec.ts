import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProspectSpecComponent } from './prospect-spec.component';

describe('ProspectSpecComponent', () => {
  let component: ProspectSpecComponent;
  let fixture: ComponentFixture<ProspectSpecComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProspectSpecComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProspectSpecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
