import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupCreateChairComponent } from './popup-create-chair.component';

describe('PopupCreateChairComponent', () => {
  let component: PopupCreateChairComponent;
  let fixture: ComponentFixture<PopupCreateChairComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupCreateChairComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupCreateChairComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
