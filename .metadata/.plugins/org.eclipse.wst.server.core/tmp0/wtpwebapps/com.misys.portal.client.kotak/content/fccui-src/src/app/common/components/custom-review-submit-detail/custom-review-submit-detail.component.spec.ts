import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomReviewSubmitDetailComponent } from './custom-review-submit-detail.component';

describe('CustomReviewSubmitDetailComponent', () => {
  let component: CustomReviewSubmitDetailComponent;
  let fixture: ComponentFixture<CustomReviewSubmitDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomReviewSubmitDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomReviewSubmitDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
