import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupUpdateDescriptionComponent } from './popup-update-description.component';

describe('PopupUpdateDescriptionComponent', () => {
  let component: PopupUpdateDescriptionComponent;
  let fixture: ComponentFixture<PopupUpdateDescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupUpdateDescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupUpdateDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
