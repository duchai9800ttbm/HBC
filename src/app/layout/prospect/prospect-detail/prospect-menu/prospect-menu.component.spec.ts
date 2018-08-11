import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProspectMenuComponent } from './prospect-menu.component';

describe('ProspectMenuComponent', () => {
  let component: ProspectMenuComponent;
  let fixture: ComponentFixture<ProspectMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProspectMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProspectMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
