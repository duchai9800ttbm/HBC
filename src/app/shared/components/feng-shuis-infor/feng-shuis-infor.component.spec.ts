import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FengShuisInforComponent } from './feng-shuis-infor.component';

describe('FengShuisInforComponent', () => {
  let component: FengShuisInforComponent;
  let fixture: ComponentFixture<FengShuisInforComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FengShuisInforComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FengShuisInforComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
