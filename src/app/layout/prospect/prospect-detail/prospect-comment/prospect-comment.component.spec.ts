import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProspectCommentComponent } from './prospect-comment.component';

describe('ProspectCommentComponent', () => {
  let component: ProspectCommentComponent;
  let fixture: ComponentFixture<ProspectCommentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProspectCommentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProspectCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
