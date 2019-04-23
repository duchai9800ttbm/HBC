import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KickOffListComponent } from './kick-off-list.component';

describe('KickOffListComponent', () => {
  let component: KickOffListComponent;
  let fixture: ComponentFixture<KickOffListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KickOffListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KickOffListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
