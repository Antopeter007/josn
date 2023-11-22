import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SgIssuingBankAndAmountComponent } from './sg-issuing-bank-and-amount.component';

describe('SgIssuingBankAndAmountComponent', () => {
  let component: SgIssuingBankAndAmountComponent;
  let fixture: ComponentFixture<SgIssuingBankAndAmountComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ SgIssuingBankAndAmountComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SgIssuingBankAndAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
