import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceConstructionComponent } from './service-construction.component';

describe('ServiceConstructionComponent', () => {
  let component: ServiceConstructionComponent;
  let fixture: ComponentFixture<ServiceConstructionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceConstructionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceConstructionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
