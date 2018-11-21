import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NeedCreateTenderFormImagesProjectComponent } from './need-create-tender-form-images-project.component';

describe('NeedCreateTenderFormImagesProjectComponent', () => {
  let component: NeedCreateTenderFormImagesProjectComponent;
  let fixture: ComponentFixture<NeedCreateTenderFormImagesProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NeedCreateTenderFormImagesProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NeedCreateTenderFormImagesProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
