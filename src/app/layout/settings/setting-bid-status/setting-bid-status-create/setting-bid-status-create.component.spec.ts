import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingBidStatusCreateComponent } from './setting-bid-status-create.component';

describe('SettingBidStatusCreateComponent', () => {
  let component: SettingBidStatusCreateComponent;
  let fixture: ComponentFixture<SettingBidStatusCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingBidStatusCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingBidStatusCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
