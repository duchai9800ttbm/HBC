import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProspectCreateComponent } from './prospect-create.component';

describe('ProspectCreateComponent', () => {
  let component: ProspectCreateComponent;
  let fixture: ComponentFixture<ProspectCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProspectCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProspectCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
