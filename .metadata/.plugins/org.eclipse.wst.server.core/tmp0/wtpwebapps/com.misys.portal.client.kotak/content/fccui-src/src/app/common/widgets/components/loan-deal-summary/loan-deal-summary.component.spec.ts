import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanDealSummaryComponent } from './loan-deal-summary.component';

describe('LoanDealSummaryComponent', () => {
  let component: LoanDealSummaryComponent;
  let fixture: ComponentFixture<LoanDealSummaryComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ LoanDealSummaryComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanDealSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
