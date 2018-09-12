import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingPositionComponent } from './setting-position.component';

describe('SettingPositionComponent', () => {
  let component: SettingPositionComponent;
  let fixture: ComponentFixture<SettingPositionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingPositionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingPositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
