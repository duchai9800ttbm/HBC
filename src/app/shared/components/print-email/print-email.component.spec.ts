import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintEmailComponent } from './print-email.component';

describe('PrintEmailComponent', () => {
  let component: PrintEmailComponent;
  let fixture: ComponentFixture<PrintEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
