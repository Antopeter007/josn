import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewFormSubmitComponent } from './review-form-submit.component';

describe('ReviewFormSubmitComponent', () => {
  let component: ReviewFormSubmitComponent;
  let fixture: ComponentFixture<ReviewFormSubmitComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ ReviewFormSubmitComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewFormSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
