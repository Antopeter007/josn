import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedTransactionsByBankComponent } from './approved-transactions-by-bank.component';

describe('ApprovedTransactionsByBankComponent', () => {
  let component: ApprovedTransactionsByBankComponent;
  let fixture: ComponentFixture<ApprovedTransactionsByBankComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ ApprovedTransactionsByBankComponent ]
  //   })
  //   .compileComponents();
  // }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovedTransactionsByBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
