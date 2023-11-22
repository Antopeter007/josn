import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewInterestComponent } from './review-interest.component';

describe('ReviewInterestComponent', () => {
  let component: ReviewInterestComponent;
  let fixture: ComponentFixture<ReviewInterestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewInterestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewInterestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
