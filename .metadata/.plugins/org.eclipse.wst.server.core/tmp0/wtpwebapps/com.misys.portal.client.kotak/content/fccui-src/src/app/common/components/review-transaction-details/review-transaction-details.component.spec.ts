import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewTransactionDetailsComponent } from './review-transaction-details.component';

describe('ReviewTransactionDetailsComponent', () => {
  let component: ReviewTransactionDetailsComponent;
  let fixture: ComponentFixture<ReviewTransactionDetailsComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ ReviewTransactionDetailsComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewTransactionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
