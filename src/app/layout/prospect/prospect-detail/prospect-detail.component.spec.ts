import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProspectDetailComponent } from './prospect-detail.component';

describe('ProspectDetailComponent', () => {
  let component: ProspectDetailComponent;
  let fixture: ComponentFixture<ProspectDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProspectDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProspectDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
