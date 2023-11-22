import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiIssuingBankAndAmountComponent } from './li-issuing-bank-and-amount.component';

describe('LiIssuingBankAndAmountComponent', () => {
  let component: LiIssuingBankAndAmountComponent;
  let fixture: ComponentFixture<LiIssuingBankAndAmountComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ LiIssuingBankAndAmountComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiIssuingBankAndAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
