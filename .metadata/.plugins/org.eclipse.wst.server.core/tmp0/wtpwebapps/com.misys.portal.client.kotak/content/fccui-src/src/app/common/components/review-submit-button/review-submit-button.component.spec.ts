import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewSubmitButtonComponent } from './review-submit-button.component';

describe('ReviewSubmitButtonComponent', () => {
  let component: ReviewSubmitButtonComponent;
  let fixture: ComponentFixture<ReviewSubmitButtonComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ ReviewSubmitButtonComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewSubmitButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
