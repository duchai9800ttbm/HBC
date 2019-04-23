import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DescribeOverallComponent } from './describe-overall.component';

describe('DescribeOverallComponent', () => {
  let component: DescribeOverallComponent;
  let fixture: ComponentFixture<DescribeOverallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DescribeOverallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DescribeOverallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
