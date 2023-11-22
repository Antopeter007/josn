import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedTransactionsByBankComponent } from './rejected-transactions-by-bank.component';

describe('RejectedTransactionsByBankComponent', () => {
  let component: RejectedTransactionsByBankComponent;
  let fixture: ComponentFixture<RejectedTransactionsByBankComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ RejectedTransactionsByBankComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectedTransactionsByBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
