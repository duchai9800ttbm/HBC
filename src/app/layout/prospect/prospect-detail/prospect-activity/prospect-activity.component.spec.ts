import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProspectActivityComponent } from './prospect-activity.component';

describe('ProspectActivityComponent', () => {
  let component: ProspectActivityComponent;
  let fixture: ComponentFixture<ProspectActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProspectActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProspectActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
