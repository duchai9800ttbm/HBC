import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageEmailComponent } from './package-email.component';

describe('PackageEmailComponent', () => {
  let component: PackageEmailComponent;
  let fixture: ComponentFixture<PackageEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
