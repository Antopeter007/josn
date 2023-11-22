import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewDetailTableComponent } from './review-detail-table.component';

describe('ReviewDetailTableComponent', () => {
  let component: ReviewDetailTableComponent;
  let fixture: ComponentFixture<ReviewDetailTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewDetailTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewDetailTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
