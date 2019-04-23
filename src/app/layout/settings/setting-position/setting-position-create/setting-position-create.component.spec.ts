import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingPositionCreateComponent } from './setting-position-create.component';

describe('SettingPositionCreateComponent', () => {
  let component: SettingPositionCreateComponent;
  let fixture: ComponentFixture<SettingPositionCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingPositionCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingPositionCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
