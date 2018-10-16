import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDetailFileComponent } from './view-detail-file.component';

describe('ViewDetailFileComponent', () => {
  let component: ViewDetailFileComponent;
  let fixture: ComponentFixture<ViewDetailFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewDetailFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDetailFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
