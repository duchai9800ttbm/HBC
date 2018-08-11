import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationDeploymentComponent } from './information-deployment.component';

describe('InformationDeploymentComponent', () => {
  let component: InformationDeploymentComponent;
  let fixture: ComponentFixture<InformationDeploymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformationDeploymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationDeploymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
