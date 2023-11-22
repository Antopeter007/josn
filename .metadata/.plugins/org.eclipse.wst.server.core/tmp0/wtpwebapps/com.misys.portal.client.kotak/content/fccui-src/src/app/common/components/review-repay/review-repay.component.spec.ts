
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewRepaymentComponent } from './review-repay.component';

describe('ReviewRepaymentComponent', () => {
  let component: ReviewRepaymentComponent;
  let fixture: ComponentFixture<ReviewRepaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewRepaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewRepaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
