import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CauHoiHoSoComponent } from './cau-hoi-ho-so.component';

describe('CauHoiHoSoComponent', () => {
  let component: CauHoiHoSoComponent;
  let fixture: ComponentFixture<CauHoiHoSoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CauHoiHoSoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CauHoiHoSoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
