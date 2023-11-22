import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewSubmitTableComponent } from './review-submit-table.component';

describe('ReviewSubmitTableComponent', () => {
  let component: ReviewSubmitTableComponent;
  let fixture: ComponentFixture<ReviewSubmitTableComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ ReviewSubmitTableComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewSubmitTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
