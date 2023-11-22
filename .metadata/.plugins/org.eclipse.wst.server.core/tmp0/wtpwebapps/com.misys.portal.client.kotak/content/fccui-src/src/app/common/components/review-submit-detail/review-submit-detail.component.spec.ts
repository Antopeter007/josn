import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewSubmitDetailComponent } from './review-submit-detail.component';

describe('ReviewSubmitDetailComponent', () => {
  let component: ReviewSubmitDetailComponent;
  let fixture: ComponentFixture<ReviewSubmitDetailComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ ReviewSubmitDetailComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewSubmitDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
