import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProspectCallComponent } from './prospect-call.component';

describe('ProspectCallComponent', () => {
  let component: ProspectCallComponent;
  let fixture: ComponentFixture<ProspectCallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProspectCallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProspectCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
