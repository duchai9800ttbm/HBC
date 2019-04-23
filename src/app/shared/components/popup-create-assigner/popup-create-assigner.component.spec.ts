import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupCreateAssignerComponent } from './popup-create-assigner.component';

describe('PopupCreateAssignerComponent', () => {
  let component: PopupCreateAssignerComponent;
  let fixture: ComponentFixture<PopupCreateAssignerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupCreateAssignerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupCreateAssignerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
